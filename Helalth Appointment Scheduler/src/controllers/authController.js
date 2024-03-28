const User = require('../models/User');
//const bcrypt = require('bcrypt');
//const session = require('express-session');



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
exports.signup = async (req, res) => {
    try {
        const { email, password, username, name } = req.body; // Capture additional fields

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Email or username already in use' }); // Updated message to include username check
        }

        // Hash the password
        //const salt = await bcrypt.genSalt(10);
       // const hash = await bcrypt.hash(password, salt);

        // Create a new user instance and save to DB
        const user = new User({ email, password, username, name }); // Include new fields in user creation
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error creating new user' });
    }
};
