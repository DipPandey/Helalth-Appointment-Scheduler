const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Set this as an environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Inside authController.js
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '227159597585-60q6lu5notm1ddeskrplqi517g404e9e.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

exports.googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        // Use the payload to authenticate the user
        res.json({ success: true, user: payload });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Authentication failed', error: error.toString() });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Special admin check
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign({ userId: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({
                message: 'Admin login successful',
                token: token,
                user: { name: "Admin", role: "admin" },
                redirectTo: '/adminDashboard'
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: user not found' });
        }

        // Replace plain text comparison with bcrypt if password hashing is implemented
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = user.password === password;

        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed: incorrect password' });
        }

        // If the user is found and the password matches, create a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token: token, name: user.name, redirectTo: '/dashboard' });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.signup = async (req, res) => {
    try {
        const { email, password, username, name, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Email or username already in use' });
        }

        // Hash the password with bcrypt before storing it
        // const salt = await bcrypt.genSalt(10);
        // const hash = await bcrypt.hash(password, salt);

        // For security, store the hashed password
        const newUser = new User({
            email,
            password, // Use hash instead after uncommenting the bcrypt lines
            username,
            name,
            role
        });

        await newUser.save();
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error creating new user' });
    }
};
