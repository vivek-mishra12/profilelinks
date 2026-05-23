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
// GET: Fetch all links sorted by order index (Public)
router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ order: 1 }); // Sort chronologically ascending by order index
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST: Add a new link (Protected - Cleanly combined with categories, analytics & icons)
// POST: Add a new link (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, url, icon, category } = req.body;

    // Dynamically grab the highest order value to safely append new cards to the very bottom
    const highestOrderLink = await Link.findOne().sort({ order: -1 });
    const nextOrder = highestOrderLink ? highestOrderLink.order + 1 : 0;

    const newLink = new Link({ 
      title, 
      url, 
      icon,
      category: category || 'Socials',
      order: nextOrder
    });

    await newLink.save();
    res.status(201).json({ success: true, data: newLink });
  } catch (err) {
    res.status(500).json({ message: 'Error adding link' });
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

// PUT: Bulk reorder all links sequence index (Protected)
router.put('/reorder', auth, async (req, res) => {
  try {
    const { orderedLinks } = req.body; // Expects an ordered array: [{ _id: '...', order: 0 }, ...]

    if (!orderedLinks || !Array.isArray(orderedLinks)) {
      return res.status(400).json({ message: 'Invalid data payload' });
    }

    // Process parallel atomic updates using bulkWrite for top execution speed
    const bulkOperations = orderedLinks.map((item, index) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: index } }
      }
    }));

    await Link.bulkWrite(bulkOperations);
    res.json({ success: true, message: 'Ordering positions updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating sorting order positions' });
  }
});

module.exports = router;