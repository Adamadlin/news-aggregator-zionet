
// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cron = require('node-cron');
const cors = require('cors');
const app = express();
const port = 6002;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001', // Set to your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adam.bugattiveyron@gmail.com',
    pass: 'ijht jixr cpdj nmyf' // Replace with your app-specific password or email password
  }
});

// Function to fetch news and send notifications
const sendNotification = async (userEmail, userPreferences) => {
  try {
    // Fetch news based on user preferences
    const newsServiceUrl = 'http://localhost:6001/news/fetch-by-preferences'; // Update URL if needed
    const response = await axios.post(newsServiceUrl, { preferences: userPreferences });

    // Extract titles and links from the news data
    const newsData = response.data.data.results; // Assuming the response structure contains "data.results"
    let messageContent = 'Here are your latest news updates:\n\n';

    // Loop over each article and add it to the message content
    newsData.forEach(article => {
      messageContent += `Title: ${article.title}\nURL: ${article.link}\n\n`;
    });

    // Define email content with the fetched news data
    const mailOptions = {
      from: 'adam.bugattiveyron@gmail.com',
      to: userEmail,
      subject: 'News Update',
      text: messageContent

    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send email', error);
      } else {
        console.log('Email sent', info);
      }
    });
  } catch (error) {
    console.error('Error fetching news or sending email:', error.message);
  }
};

// Endpoint to send a one-time notification
app.post('/notify', async (req, res) => {
  const { email, preferences } = req.body;

  // Validate input
  if (!email || !preferences) {
    return res.status(400).json({ error: 'Please provide a valid email and preferences.' });
  }

  try {
    // Fetch news based on user preferences
    const newsServiceUrl = 'http://news-service:6001/news/fetch-by-preferences';
    const response = await axios.post(newsServiceUrl, { preferences });

    // Extract titles and links from the news data
    const newsData = response.data.data.results; // Assuming the response structure contains "data.results"
    let messageContent = 'Here are your latest news updates:\n\n';

    // Loop over each article and add it to the message content
    newsData.forEach(article => {
      messageContent += `Title: ${article.title}\nURL: ${article.link}\n\n`;
    });

    // Define email content with the fetched news data
    const mailOptions = {
      from: 'adam.bugattiveyron@gmail.com',
      to: email,
      subject: 'News Update',
      text: messageContent
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send email', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }
      res.json({ message: 'Email sent', info });
    });

  } catch (error) {
    console.error('Error fetching news or sending email:', error.message);
    res.status(500).json({ error: 'Failed to fetch news or send email' });
  }
});

// Endpoint to confirm the service is running
app.get('/notifications', (req, res) => {
  res.json({ message: 'Notification service is working!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Notification Service running on port ${port}`);
});


