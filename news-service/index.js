
// // news-service/index.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors');
// const app = express();
// const port = 6001;

// // Enable CORS
// app.use(cors());

// // Middleware for parsing JSON
// app.use(bodyParser.json());

//  const myfunc = function() {
//   fetch("https://newsdata.io/api/1/latest?apikey=pub_59395a65f923bb130664ba90978da51e1416c&q=latest")
//   .then((response) => response.json())
//   .then((json) => {
//     // Extract articles and log titles, URLs, and categories
//     if (json.results && json.results.length > 0) {
//       json.results.forEach((article) => {
//         console.log(`Title: ${article.title}`);
//         console.log(`URL: ${article.link}`);
//         console.log(`Categories: ${article.category ? article.category.join(', ') : 'N/A'}`);
//       });
//     } else {
//       console.log('No articles found.');
//     }
//   })
//   .catch((error) => {
//     console.error('Error fetching news data:', error);
//   });
//  }

// // GET endpoint to confirm service is working
// app.get('/news', (req, res) => {
//   res.json({ message: 'News service is working!' })
//   // returns data in terminal (?)
//   console.log(myfunc())
// });

// // POST endpoint to get news based on preferences
// app.post('/news', async (req, res) => {
//   const { preferences } = req.body;

//   // Basic validation to ensure preferences are provided
//   if (!preferences || !preferences.category) {
//     return res.status(400).json({ error: 'Please provide a category in preferences.' });
//   }

//   try {
//     // Use Axios to fetch news data from an external API
//     const response = await axios.get(`https://newsdata.io/api/1/latest?apikey=pub_59395a65f923bb130664ba90978da51e1416c&q=latest`);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching news:', error.message);
//     res.status(500).json({ error: 'Failed to fetch news' });
//   }
// });


// // Start the server
// app.listen(port, () => {
//   console.log(`News Service running on port ${port}`);
// });

// news-service/index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 6001;

// Enable CORS
app.use(cors());

// Middleware for parsing JSON
app.use(bodyParser.json());

// Function to fetch news based on preferences
const fetchNews = async (preferences) => {
  try {
    // Join preferences into a single comma-separated string for the API request
    const query = preferences.join(',');
    const response = await axios.get(`https://newsdata.io/api/1/latest?apikey=pub_59395a65f923bb130664ba90978da51e1416c&q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news data:', error.message);
    throw error;
  }
};

// GET endpoint to confirm service is working
app.get('/news', (req, res) => {
  res.json({ message: 'News service is working!' });
});

// POST endpoint to get news based on user preferences
app.post('/news/fetch-by-preferences', async (req, res) => {
  const { preferences } = req.body;

  // Basic validation to ensure preferences are provided
  if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of preferences.' });
  }

  try {
    // Fetch the news based on user preferences
    const newsData = await fetchNews(preferences);
    
    // Send the fetched data to the client
    res.status(200).json({
      message: 'News fetched successfully based on preferences',
      data: newsData,
    });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`News Service running on port ${port}`);
});
