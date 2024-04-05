const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();


const authRoutes = require('./src/routes/authRoutes');

const userRoutes = require('./src/routes/userRoutes'); // Adjust path as necessary

const appointmentRoutes = require('./src/routes/appointmentRoutes');




// Initialize Express
const app = express();


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch((error) => console.error('MongoDB connection error:', error));


// Middleware for parsing application/json
app.use(express.json());

// Serveing static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define authRoutes after the express app is initialized and middleware set

app.use('/auth', authRoutes);//auth routes
app.use('/user', userRoutes);//user routes
app.use('/appointments', appointmentRoutes); // Appointment routes

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ensure this path points to your actual index.html file
});

app.get('/dashboard', (req, res) => {
    // Replace 'path/to/dashboard.html' with the actual path to your dashboard HTML file
    res.sendFile(path.join(__dirname, 'public' , 'dashboard.html'));
});
app.get('/myAppointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'myAppointments.html'));
});
app.get('/bookAppointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bookAppointments.html'));
});




const PORT = process.env.PORT || 1337; // Fallback to 3000 if process.env.PORT is not defined
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


