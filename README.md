# SCA Scanner with Gemini AI Assistant

A powerful security vulnerability scanner that combines **Trivy** for repository scanning with **Google Gemini AI Assistant** for intelligent, real-time vulnerability analysis and advice.

<img width="2724" height="1576" alt="image" src="https://github.com/user-attachments/assets/09d6411f-5645-4a03-8a93-4eee1e575500" />


<img width="2724" height="1576" alt="image" src="https://github.com/user-attachments/assets/c8bece4f-1e62-4eed-a2c7-6a1247d9e853" />


## Features

*   **Repo Scanning**: Scans public GitHub repositories for vulnerabilities using Trivy.
*   **AI Security Assistant**: Integrated chat interface powered by **Gemini Pro 1.5/2.0**.
*   **Real-time Streaming**: Chat responses stream in real-time for better UX.
*   **Cyberpunk UI**: Modern, dark-mode/glassmorphism aesthetic.

## Tech Stack

*   **Frontend**: React, Vite, TailwindCSS
*   **Backend**: Node.js, Express
*   **Scanner**: Trivy (Aqua Security)
*   **AI**: Google Gemini Pro (via `@google/generative-ai` SDK)

## Prerequisites

Before running the application, ensure you have the following installed:

1.  **Node.js** (v18+) & **npm**
2.  **Trivy**: The scanner tool must be installed and accessible in your system PATH.
    *   *Mac (Homebrew)*: `brew install trivy`
    *   *Linux*: See [Trivy Installation Guide](https://aquasecurity.github.io/trivy/v0.18.3/installation/)
3.  **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/).

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/trivy-gemini-scanner.git
    cd trivy-gemini-scanner
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    cd client
    npm install
    cd ..
    ```

3.  **Install Backend Dependencies**:
    ```bash
    cd server
    npm install
    cd ..
    ```

## Configuration

1.  Create a `.env` file in the `server` directory:
    ```bash
    touch server/.env
    ```

2.  Add your Gemini API Key to `server/.env`:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    # Optional: GitHub token for higher rate limits with Trivy
    # GITHUB_TOKEN=your_github_token
    ```

## Running the Application

### Option 1: Quick Start (Mac/Linux)
Run the provided helper script from the root directory:
```bash
./start-app.sh
```
This script handles starting both the backend (port 3000) and frontend (port 5173).

### Option 2: Manual Start

**Terminal 1 (Backend):**
```bash
cd server
node index.js
```
*Server runs on http://localhost:3000*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Frontend runs on http://localhost:5173*

## Usage

1.  Open `http://localhost:5173/` in your browser.
2.  Enter a GitHub repository URL (e.g., `https://github.com/user/repo`) in the search bar.
3.  Click **SCAN REPO**.
4.  View vulnerabilities in the table.
5.  Use the **Security AI** chat on the right to ask questions like:
    *   "How do I fix the SQL injection vulnerability?"
    *   "Explain CVE-2023-XXXX"

## Troubleshooting

*   **"Failed to fetch" / Connection Refused**: Ensure the backend server is running on port 3000.
*   **AI Chat Error**: Check your `GEMINI_API_KEY` in `server/.env`. Ensure you have access to the models (e.g., `gemini-pro-latest` or `gemini-1.5-flash`).
*   **Trivy not found**: Ensure `trivy` is in your system PATH (`which trivy`).

## License
MIT
