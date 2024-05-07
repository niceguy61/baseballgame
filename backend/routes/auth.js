// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username });
    user.setPassword(password);
    await user.save();
    res.json({ token: jwt.sign({ id: user._id }, 'secret') });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && user.validPassword(password)) {
        res.json({ token: jwt.sign({ id: user._id }, 'secret') });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
