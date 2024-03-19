const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Handle signup logic
exports.signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check for an existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).json({ message: 'User successfully created', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
};

// Handle signout logic
exports.signOut = (req, res) => {
  req.logout(); // Passport provides this method to log out the user
  res.redirect('/login');
};

// ... Other controller methods like Google OAuth handling could be added here
