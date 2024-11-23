// src/components/UpdatePreferences.js
import React, { useState } from 'react';
import axios from 'axios';

function UpdatePreferences() {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:6003/users/email/${email}/preferences`, {
        preferences: preferences.split(',').map((p) => p.trim()),
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Update Preferences</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Preferences (comma separated)" value={preferences} onChange={(e) => setPreferences(e.target.value)} />
      <button onClick={handleUpdate}>Update Preferences</button>
      <p>{message}</p>
    </div>
  );
}

export default UpdatePreferences;
