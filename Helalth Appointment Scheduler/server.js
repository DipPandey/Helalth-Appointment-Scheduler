'use strict';
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

// Set up middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
