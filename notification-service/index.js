


// notification-service/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 6002;

app.use(express.json());

// ✅ CORS – allow both dev ports (3000 & 3001)
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

// ✅ transporter uses env vars (in real run). In tests we mock nodemailer.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper: fetch user from backend (Mongo) by email
async function fetchUserByEmail(email) {
  const url = `http://news-aggregator-backend:6003/users/email/${encodeURIComponent(email)}`;
  const res = await axios.get(url);
  return res.data;
}

// Helper: fetch news from news-service by preferences
async function fetchNewsByPreferences(preferences) {
  const url = 'http://news-service:6001/news/fetch-by-preferences';
  const res = await axios.post(url, { preferences });
  return res.data; // { message, data: { results: [...] } }
}

// ✅ POST /notify
// Frontend sends ONLY { email }.
// Service fetches preferences from DB via backend, fetches news, sends mail.
app.post('/notify', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Please provide a valid email.' });
  }

  try {
    const user = await fetchUserByEmail(email);

    if (!user?.preferences || !Array.isArray(user.preferences) || user.preferences.length === 0) {
      return res.status(400).json({ error: 'User has no preferences configured.' });
    }

    const newsData = await fetchNewsByPreferences(user.preferences);
    const articles = newsData?.data?.results || [];

    if (!articles.length) {
      return res.status(200).json({ message: 'No news found for user preferences. Email not sent.' });
    }

    let messageContent = 'Here are your latest news updates:\n\n';
    articles.forEach((a) => {
      messageContent += `Title: ${a.title}\nURL: ${a.link || a.url || ''}\n\n`;
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'News Update',
      text: messageContent,
    };

    // ✅ Use promise form for easier testing
    const info = await transporter.sendMail(mailOptions);

    return res.json({ message: 'Email sent', info });
  } catch (err) {
    console.error('Error sending notification:', err.message);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Health check
app.get('/notifications', (req, res) => {
  res.json({ message: 'Notification service is working!' });
});

// ✅ Only listen if not testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Notification Service running on port ${port}`));
}

module.exports = app;