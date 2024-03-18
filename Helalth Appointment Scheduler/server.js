'use strict';
const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module
const port = process.env.PORT || 3000;

// Set up middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
