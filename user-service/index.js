


// user-service/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// In-memory storage for users (DEMO ONLY)
let users = [];

// ✅ POST: Register user and fetch news (demo)
app.post('/register', async (req, res) => {
  const { name, email, preferences } = req.body;

  if (!name || !email || !preferences) {
    return res.status(400).json({ error: "Please provide name, email, and preferences." });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    preferences,
  };

  users.push(newUser);

  try {
    // IMPORTANT: use Docker service name, not localhost
    const newsResponse = await axios.get('http://news-service:6001/news');
    res.status(201).json({
      message: "User registered successfully!",
      user: newUser,
      news: newsResponse.data,
    });
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(201).json({
      message: "User registered successfully, but failed to fetch news.",
      user: newUser,
      error: error.message,
    });
  }
});

// ✅ PUT: Update preferences for a specific user by email (demo)
app.put('/users/email/:email/preferences', (req, res) => {
  const { email } = req.params;
  const { preferences } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.preferences = preferences;
  return res.status(200).json({ message: 'Preferences updated', user });
});

// ✅ GET: All users (demo)
app.get('/users', (req, res) => {
  res.json(users);
});

// ✅ GET: Health check
app.get('/user', (req, res) => {
  res.status(200).json({ message: "User service is running!" });
});

// ✅ Run only if not testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
}

// ✅ Export app for testing
module.exports = app;