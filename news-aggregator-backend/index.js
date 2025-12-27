
// news-aggregator-backend/index.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 6003;

app.use(express.json());
app.use(cors());

const User = require('./models/User');

// ✅ Connect function (tests will call this)
async function connectToMongo() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Check your .env or test env.');
  }

  // Prevent re-connecting in tests / hot reload
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  });
}

// ✅ Create user
app.post('/users', async (req, res) => {
  try {
    const { name, email, age, preferences } = req.body;

    if (!name || !email || !preferences) {
      return res.status(400).json({ error: 'Please provide name, email, and preferences.' });
    }

    const newUser = new User({ name, email, age, preferences });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating user:', err);

    // nice-to-have: duplicate email handling
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ✅ Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Get single user by email (needed by notification-service)
app.get('/users/email/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ✅ Update preferences
app.put('/users/email/:email/preferences', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const { preferences } = req.body;

    if (!preferences || !Array.isArray(preferences)) {
      return res.status(400).json({ error: 'Please provide an array of preferences.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { preferences },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({ message: 'Preferences updated', user: updatedUser });
  } catch (err) {
    console.error('Error updating user preferences:', err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// ✅ Fetch news using SAVED preferences
app.post('/users/fetch-news', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Please provide a valid email.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (!Array.isArray(user.preferences) || user.preferences.length === 0) {
      return res.status(400).json({ error: 'User has no preferences configured.' });
    }

    const newsServiceUrl = 'http://news-service:6001/news/fetch-by-preferences';
    const response = await axios.post(newsServiceUrl, { preferences: user.preferences });

    const results = response.data?.data?.results || [];

    const articles = results.map((a) => ({
      title: a.title || 'Untitled',
      link: a.link || a.url || '',
      pubDate: a.pubDate || a.publishedAt || a.date || null,
      source: a.source_id || a.source || '',
    }));

    res.status(200).json({
      message: 'News fetched successfully',
      preferences: user.preferences,
      articles,
    });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// ✅ Only listen in real runs (NOT in tests)
if (process.env.NODE_ENV !== 'test') {
  connectToMongo()
    .then(() => {
      console.log('Successfully connected to MongoDB!');
      app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
    })
    .catch((err) => console.error('Error connecting to MongoDB', err));
}

// ✅ Export for tests
module.exports = { app, connectToMongo };