const User = require('../models/User');

const session = require('express-session');



exports.login = async (req, res) => {
    try {
        // Retrieve user data from request body
        const { email, password } = req.body;
        console.log('Attempting to log in with:', email, password); // Log the received credentials

        // Find the user by email
        const user = await User.findOne({ email });
        console.log('User found:', !!user); // Log whether the user was found
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Check if password is correct

        const isMatch = user.password === password; // assuming you have a method to compare passwords
        console.log('Password match:', isMatch); // Log result of password 
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
            
        }

        // Redirect to dashboard page
        res.json({ message: 'Login successful', redirectTo: '/dashboard.html' });

    } catch (error) {
        console.error('Server error during login:', error); 
        res.status(500).json({ message: 'Server error' });
    }
};
