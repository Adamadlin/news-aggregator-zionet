// newsFetcher.js

const fetch = require('node-fetch'); // Importing node-fetch to use fetch in Node.js

// Function to fetch news data
async function fetchNews() {
  const url = "https://newsdata.io/api/1/latest?apikey=pub_59395a65f923bb130664ba90978da51e1416c&q=latest";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log('News API Response:', json); // Log response to the console
    return json; // Return the response JSON
  } catch (error) {
    console.error(`Error fetching data from news API: ${error.message}`);
    throw error; // Re-throw error to be handled by the caller
  }
}

// Export the fetchNews function to be used in other files
module.exports = fetchNews;
