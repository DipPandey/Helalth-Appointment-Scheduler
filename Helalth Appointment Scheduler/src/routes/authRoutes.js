const express = require('express');
const passport = require('passport');

const router = express.Router();
const authController = require('../controllers/authController');

// Signup route
router.post('/signup', authController.signUp);

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true, // allows passport to flash messages (requires connect-flash middleware)
}));

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/'); // On success, redirect to the home page
  },
);

module.exports = router;
