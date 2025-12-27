

// notification-service/index.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 6002;

app.use(bodyParser.json());

// ✅ Allow your frontend (host is 3001)
app.use(
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

// ✅ SMTP creds must exist in container env
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ Missing SMTP_USER / SMTP_PASS in notification-service environment');
}

// ✅ Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // app password
  },
});

// Helper: fetch user from backend by email (MongoDB)
async function fetchUserByEmail(email) {
  const url = `http://news-aggregator-backend:6003/users/email/${encodeURIComponent(email)}`;
  const res = await axios.get(url);
  return res.data;
}

// Helper: fetch news by preferences from news-service
async function fetchNewsByPreferences(preferences) {
  const url = 'http://news-service:6001/news/fetch-by-preferences';
  const res = await axios.post(url, { preferences });
  return res.data; // { message, data: newsDataIoResponse }
}

// ✅ POST /notify  (Frontend sends ONLY { email })
app.post('/notify', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Please provide a valid email.' });

  try {
    // 1) Get user + preferences from DB
    const user = await fetchUserByEmail(email);

    if (!user?.preferences || !Array.isArray(user.preferences) || user.preferences.length === 0) {
      return res.status(400).json({ error: 'User has no preferences configured.' });
    }

    // 2) Fetch news using preferences
    const newsPayload = await fetchNewsByPreferences(user.preferences);

    // news-service returns: { message, data: <newsdata.io response> }
    const articles = newsPayload?.data?.results || [];
    if (!articles.length) {
      return res.json({ message: 'No articles found for this user. Email not sent.' });
    }

    // 3) Build email
    let text = `Hi ${user.name || ''}\n\nHere are your latest news updates for: ${user.preferences.join(
      ', '
    )}\n\n`;

    articles.slice(0, 15).forEach((a, i) => {
      text += `${i + 1}) ${a.title}\n${a.link}\n\n`;
    });

    // 4) Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'News Update (based on your saved preferences)',
      text,
    });

    console.log('✅ Email sent:', info.response || info);

    return res.json({ message: 'Email sent ✅', info });
  } catch (err) {
    console.error('❌ /notify failed:', err?.message || err);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.get('/notifications', (req, res) => {
  res.json({ message: 'Notification service is working!' });
});

app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));