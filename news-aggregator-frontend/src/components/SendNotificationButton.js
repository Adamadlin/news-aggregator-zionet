
import React, { useState } from 'react';
import axios from 'axios';

const SendNotificationButton = () => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSendNotification = async () => {
    if (!email || !preferences) {
      alert('Please provide both email and preferences.');
      return;
    }

    const preferencesArray = preferences.split(',').map(pref => pref.trim());

    try {
      const response = await axios.post('http://localhost:6002/notify', {
        email,
        preferences: preferencesArray
      });
      
      alert(response.data.message);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Send Notification</h2>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter preferences (comma separated)"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        required
      />
      <button onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default SendNotificationButton;
