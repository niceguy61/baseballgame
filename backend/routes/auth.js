// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/signup', async (req, res) => {
    const { username, password, isAdmin } = req.body;
    console.log(req.body)
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
  
    const user = new User({ username, isAdmin });
    user.setPassword(password);
    await user.save();
    res.json({ token: jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'secret') });
  });

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ username });
    if (user && user.validPassword(password)) {
        res.json({ token: jwt.sign({ id: user._id }, 'secret') });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;