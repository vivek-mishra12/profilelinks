require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Other Middleware
app.use(express.json());

// Routes
app.use('/api/links', require('./routes/links'));

// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => 
        console.log('Server running on port 5000')
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));