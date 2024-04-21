// Assuming the latest openai package supports this structure

const { OpenAIApi } = require('openai');

const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is stored in your .env file
});

exports.getChatResponse = async (req, res) => {
    const { message } = req.body;
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: message }]
        });
        // The structure of response.data may vary based on the API's response.
        // You may need to adjust the following line to match the structure:
        const reply = response.data.choices[0].message.content.trim();
        res.json({ reply });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Failed to fetch response from OpenAI');
    }
};
