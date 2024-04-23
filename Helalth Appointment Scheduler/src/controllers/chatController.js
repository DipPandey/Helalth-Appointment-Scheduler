const axios = require('axios');
require('dotenv').config();

// Replace 'OPENAI_API_KEY' with your actual key name from .env file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.getChatResponse = async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": req.body.message }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        if (error.response && error.response.status === 429) {
            // Extract the retry-after header value if present
            const retryAfter = error.response.headers['retry-after'];
            console.error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
            // Respond with a 'Too Many Requests' status code and the retry-after duration
            res.status(429).send(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
        } else {
            console.error('Error calling OpenAI:', error);
            res.status(500).send('Failed to fetch response from OpenAI');
        }
    }
};

