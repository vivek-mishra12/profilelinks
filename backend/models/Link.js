const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    default: 'Socials', // Default value so old records don't break
  },
}, { timestamps: true });

module.exports = mongoose.model('Link', LinkSchema);