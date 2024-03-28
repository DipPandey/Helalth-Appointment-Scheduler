const User = require('./src/Models/User');

const session = require('express-session');

app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // for HTTPS
}));


exports.login = async (req, res) => {
    try {
        // Retrieve user data from request body
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password); // assuming you have a method to compare passwords
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
            console.log("what the fuck failed again")
        }

        // Assuming you're using sessions
        req.session.userId = user._id;

        // Redirect to dashboard page
        res.json({ message: 'Login successful', redirectTo: '/dashboard' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
