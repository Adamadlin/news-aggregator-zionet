
// news-aggregator-backend/index.js
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Set the port the server will run on
const PORT = process.env.PORT || 6003;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS


// MongoDB Connection URI
const mongoUri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,           // Increase socket timeout to 45 seconds
  connectTimeoutMS: 30000 
})
.then(() => {
  console.log('Successfully connected to MongoDB Atlas!');
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Import the User model
const User = require('./models/User'); // Ensure the User model is in the correct directory

// Route to create a new user (register)
// works 
app.post('/users', async (req, res) => {
  try {
    const { name, email, age, preferences } = req.body;

    // Validation for required fields
    if (!name || !email || !preferences) {
      return res.status(400).json({ error: "Please provide name, email, and preferences." });
    }

    const newUser = new User({ name, email, age, preferences });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Route to get all users
// works 
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});








// Route to update user preferences by email
// works 
app.put('/users/email/:email/preferences', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const { preferences } = req.body;

    // Validation to ensure preferences are provided
    if (!preferences || !Array.isArray(preferences)) {
      return res.status(400).json({ error: "Please provide an array of preferences." });
    }

    // Find user by email and update preferences
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail }, // Find the user by email
      { preferences },      // Update the preferences field
      { new: true, runValidators: true } // Return the updated user and validate input
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: 'User preferences updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user preferences:', err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// POST endpoint to fetch news based on user preferences
app.post('/users/fetch-news', async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ error: 'Please provide a valid email.' });
  }

  try {
    // Find user in MongoDB by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Make a request to the news service to get news based on user preferences
    // Ensure this matches your service URL
    // was 6001
    const newsServiceUrl = 'http://news-service:6001/news/fetch-by-preferences'; 
    const response = await axios.post(newsServiceUrl, { preferences: user.preferences });

    // Send the response to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});








