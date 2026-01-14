const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));
// If development, you might want to comment out the above or handle it conditionally
// But for the Docker build, 'public' is where we put the 'dist' folder.

// ... existing routes ...

app.post('/api/scan', (req, res) => {
    const { repoUrl, githubToken } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: 'Repository URL is required' });
    }

    console.log(`Starting scan for: ${repoUrl}`);

    // Set GITHUB_TOKEN env var if provided
    const env = { ...process.env };
    if (githubToken) {
        env.GITHUB_TOKEN = githubToken;
    }

    // Adjust command to use 'trivy' from path. 
    // Assumes trivy is in PATH. If using via homebrew it might need full path if not in env.
    // We'll try just 'trivy'.
    const trivyProcess = spawn('trivy', ['repo', '--format', 'json', '-q', repoUrl], { env });

    let stdoutData = '';
    let stderrData = '';

    trivyProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    trivyProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        // Console error for debugging but don't fail immediately as trivy writes progress to stderr
        console.error(`[Trivy Stderr]: ${data}`);
    });

    trivyProcess.on('close', (code) => {
        console.log(`Trivy process exited with code ${code}`);

        if (code !== 0) {
            // If code is not 0, it might be an error or just vulnerabilities found (depending on exit code settings)
            // But usually 0 = success, 1 = failure. Trivy with --exit-code 0 (default) returns 0 even if vuln found.
            // If it failed to run (e.g. invalid repo), stderr will have info.

            // Check if we got JSON output despite error (rare)
            if (!stdoutData) {
                return res.status(500).json({ error: 'Scan failed', details: stderrData });
            }
        }

        try {
            const results = JSON.parse(stdoutData);
            res.json(results);
        } catch (err) {
            console.error('Failed to parse JSON:', err);
            // If stdout is not valid JSON, send error
            res.status(500).json({ error: 'Failed to parse scan results', details: stderrData || err.message });
        }
    });

    trivyProcess.on('error', (err) => {
        console.error('Failed to start trivy process:', err);
        res.status(500).json({ error: 'Failed to start scanner', details: err.message });
    });
});

// Initialize Gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
    }

    try {
        // Prepare history for Gemini (excluding system message if separate, but Gemini supports system instructions in newer models or we can just prepend)
        // Simple mapping: 
        // user -> user
        // assistant -> model
        // Helper to map roles
        const mapRole = (role) => {
            if (role === 'assistant') return 'model';
            return 'user';
        };

        let history = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: mapRole(m.role),
                parts: [{ text: m.content }]
            }));

        const lastMessage = history.pop(); // The last user message is the prompt

        // Validation: History must start with 'user'. Remove leading 'model' messages.
        while (history.length > 0 && history[0].role === 'model') {
            history.shift();
        }

        if (!lastMessage) {
            return res.status(400).json({ error: 'No user message found' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessageStream(lastMessage.parts[0].text);

        // Set headers for SSE/streaming
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }

        res.end();

    } catch (error) {
        console.error('Gemini Chat API Error:', error);
        // If headers sent, end stream with error, else send json
        if (res.headersSent) {
            res.end(`\n\n[Error: ${error.message}]`);
        } else {
            res.status(500).json({ error: 'Failed to communicate with AI service', details: error.message });
        }
    }
});



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
