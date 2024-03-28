
const User = require('../models/User'); // Adjust path as necessary



const jwt = require('jsonwebtoken');

// A utility function to decode the JWT and get the userId
const getUserIdFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, '6113'                                                                                                                                                                                        ); // Replace 'yourSecretKey' with your actual secret key
        return decoded.userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};


//Assuming the above getUserIdFromToken function is available in your project
exports.getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Assuming the Authorization header is in the format: Bearer <token>
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
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user profile' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
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
        console.error(error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
};

