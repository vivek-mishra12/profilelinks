require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const linksRouter = require('./routes/links');
const chatRouter = require('./routes/chat'); // 1. Import the chat route

const app = express();

// CORS Middleware
app.use(cors({
    origin: 'https://profilelinks-one.vercel.app',
    credentials: true
}));

// Other Middleware
app.use(express.json());

// Routes
app.use('/api/links', require('./routes/links'));
app.use('/api/chat', chatRouter); // 2. Mount it here

// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => 
        console.log('Server running on port 5000')
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));