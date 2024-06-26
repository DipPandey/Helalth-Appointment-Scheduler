const User = require('../models/User'); // Adjust path as necessary
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;


// A utility function to decode the JWT and get the userId
const getUserIdFromToken = (token) => {
    try {

        const decoded = jwt.verify(token, jwtSecret);
        return decoded.userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

exports.getUserProfile = async (req, res) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const userId = getUserIdFromToken(token);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid or missing token' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Error retrieving user profile' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const token =  req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const userId = getUserIdFromToken(token);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid or missing token' });
        }

        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
};

