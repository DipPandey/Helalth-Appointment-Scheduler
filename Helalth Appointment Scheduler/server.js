const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Initialize Express
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/HAS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to HAS MongoDB.'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.use(express.json()); // for parsing application/json

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes after the express app is initialized and middleware set
const authRoutes = require('./routes/authRoutes'); // Make sure this path is correct
app.use('/auth', authRoutes);

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ensure this path is correct
});

// Start the server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
