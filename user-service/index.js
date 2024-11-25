

// user-service/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors') 
const axios = require('axios'); // Import axios for making HTTP requests
const app = express();
const PORT = process.env.PORT || 6000;


// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from frontend

// In-memory storage for users (replace with a database in production)
let users = [];

// POST endpoint to register a user
app.post('/register', async (req, res) => {
  const { name, email, preferences } = req.body;

  // Basic validation
  if (!name || !email || !preferences) {
    return res.status(400).json({ error: "Please provide name, email, and preferences." });
  }

  // Create a new user object
  const newUser = {
    id: users.length + 1,  // Generate a simple ID
    name,
    email,
    preferences,
  };

  // Store the user in the in-memory users array
  users.push(newUser);

  // Log all registered users to the console
  console.log("Current registered users:", users);

  // Fetch news after registration
  try {
    const newsResponse = await axios.get('http://localhost:6001/news'); 

    // Respond with the registered user and the news
    res.status(201).json({
      message: "User registered successfully!",
      user: newUser,
      news: newsResponse.data, // Include the news data in the response
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    // Respond with the registered user but without news if the news request fails
    res.status(201).json({
      message: "User registered successfully, but failed to fetch news.",
      user: newUser,
      error: error.message,
    });
  }
});

// GET endpoint to retrieve all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Endpoint to confirm user service is running
app.get('/user', (req, res) => {
  res.status(200).json({ message: "User service is running!" });
});

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
