const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String },
  clicks: { type: Number, default: 0 },
  category: { type: String, required: true, default: 'Socials' },
  order: { type: Number, default: 0 } // Tracks custom list sorting
}, { timestamps: true });

module.exports = mongoose.model('Link', LinkSchema);