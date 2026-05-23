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

// @route   POST /api/links
// @desc    Create a new link entry
// @access  Private (Admin Only)
router.post('/', auth, async (req, res) => {
  const { title, url, category } = req.body; // Extract category

  try {
    const newLink = new Link({
      title,
      url,
      category: category || 'Socials', // Save to document instance
    });

    const savedLink = await newLink.save();
    res.status(201).json({ success: true, data: savedLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating link' });
  }
});

// @route   POST /api/links/:id/click
// @desc    Increment the click counter for a specific link
// @access  Public
router.post('/:id/click', async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } }, // Atomic operation to increment clicks by 1
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Return the URL so the frontend knows where to redirect the user
    return res.status(200).json({ url: link.url });
  } catch (error) {
    console.error('Click tracking error:', error);
    return res.status(500).json({ error: 'Server error tracking click' });
  }
});

module.exports = router;