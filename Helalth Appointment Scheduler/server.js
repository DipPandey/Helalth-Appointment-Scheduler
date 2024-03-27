const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Adjust the path to where your authRoutes.js file is located.



app.use(express.json()); // for parsing application/json
app.use('/auth', authRoutes); // Set up routes

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/HAS', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Successfully connected to HAS MongoDB.'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Initialize Express
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  // Change the path to your actual path to the index.html if it's different
  res.sendFile(path.join(__dirname, 'public'));
});

// Start the server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
