require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // Ensure JSON body parsing
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data

// Webhook endpoint

app.post('/webhook', async (req, res) => {
    console.log('Received Webhook:', req.body);

    // Ensure req.body is defined
    if (!req.body || !req.body.message) {
        return res.status(400).json({ error: "Invalid request: 'message' field missing" });
    }

    const userMessage = req.body.message;
    const botReply = await getAIResponse(userMessage);

    res.json({ reply: botReply });
});


// Function to generate AI response using Ollama
async function getAIResponse(userMessage) {
    try {
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "mistral",  // Change this to any installed model, e.g., "llama2"
                prompt: userMessage,
                stream: false // Set to false to get full response at once
            }
        );
        return response.data.response;
    } catch (error) {
        console.error("Ollama API Error:", error.response ? error.response.data : error.message);
        return "Sorry, I am facing issues at the moment.";
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
