// src/components/FetchNews.js
import React, { useState } from 'react';
import axios from 'axios';

function FetchNews() {
  const [email, setEmail] = useState('');
  const [news, setNews] = useState([]);
  const [message, setMessage] = useState('');

  const handleFetchNews = async () => {
    try {
      const response = await axios.post('http://localhost:6003/users/fetch-news', {
        email,
      });
      setNews(response.data.news || []);
      setMessage('');
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Fetch News</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleFetchNews}>Fetch News</button>
      {message && <p>{message}</p>}
      {news.length > 0 && (
        <ul>
          {news.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FetchNews;