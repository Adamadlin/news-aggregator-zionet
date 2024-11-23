// src/components/RegisterUser.js
import React, { useState } from 'react';
import axios from 'axios';

function RegisterUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [preferences, setPreferences] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:6003/users', {
        name,
        email,
        age: Number(age),
        preferences: preferences.split(',').map((p) => p.trim()),
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Register User</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      <input type="text" placeholder="Preferences (comma separated)" value={preferences} onChange={(e) => setPreferences(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
}

export default RegisterUser;
