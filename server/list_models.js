const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        if (data.models) {
            const contentModels = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name);
            console.log("GenerateContent Models:", contentModels);
        } else {
            console.log("No models found or error structure:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
