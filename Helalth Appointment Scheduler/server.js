const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Make sure the path is correct

// Initialize Express
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/HAS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to HAS MongoDB.'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to parse JSON request bodies
app.use(express.json());

// Use authRoutes for any requests that go to '/auth'
app.use('/auth', authRoutes);

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
