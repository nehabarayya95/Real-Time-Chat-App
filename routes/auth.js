const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/regoster', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password});
        await user.save();
        res.status(201).json({ message: 'User  registered'});
    } catch (err){
        res.status(400).json({error: err.message}); 
    }
});

router.post('/logiin', async (req, res) => {
  const {username, password} = req.body;
  try {
    const user = await User.findOne({ username });
    if(!user || !(await user.comparePassword(password))) {
       return res.status(400).json({ error: 'Invalid credentials'});
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({token});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;

