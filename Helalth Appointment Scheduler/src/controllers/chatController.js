// Import the OpenAI SDK
const OpenAI = require('openai');
const axios = require('axios');
const apiKey = process.env.OPENAI_API_KEY;

// Assuming the OpenAI package exports a single OpenAIApi class
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


exports.getChatResponse = async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "text-davinci-003",
            prompt: message,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const reply = response.data.choices[0].text.trim();
        res.json({ reply });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Failed to fetch response from OpenAI');
    }
};

