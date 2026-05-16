const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Link = require('../models/Link');
const auth = require('../middleware/auth');

// POST: Verify password and return JWT
router.post('/auth/verify', async (req, res) => {
  const { password } = req.body;
  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  
  if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect Password' });

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ success: true, token });
});

// GET: Fetch all links (Public)
router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST: Add a new link (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, url, icon } = req.body;
    const newLink = new Link({ title, url, icon });
    await newLink.save();
    res.json({ success: true, data: newLink });
  } catch (err) {
    res.status(500).json({ message: 'Error adding link' });
  }
});

module.exports = router;