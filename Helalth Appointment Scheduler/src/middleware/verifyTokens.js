const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../models/User');

const jwtVerify = util.promisify(jwt.verify);

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await jwtVerify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(400).json({ message: 'The token does not belong to a valid user.' });
        }

        // If the token is verified, attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired.' });
        }
        return res.status(500).json({ message: 'Failed to authenticate token.', error });
    }
};

module.exports = verifyToken;
