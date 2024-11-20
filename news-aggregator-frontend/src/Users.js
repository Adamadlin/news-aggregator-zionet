import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch all users
    axios.get('http://localhost:6000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:6001/news');
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <div>
      <h2>Registered Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
      
      <h2>News</h2>
      <button onClick={fetchNews}>Fetch Latest News</button>
      <ul>
        {news.map((article, index) => (
          <li key={index}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
