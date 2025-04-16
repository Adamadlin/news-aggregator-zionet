// src/components/RegisterUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
      setName('');
      setEmail('');
      setAge('');
      setPreferences('');
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Register User
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Age"
            type="number"
            variant="outlined"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Preferences"
            variant="outlined"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            helperText="Enter preferences separated by commas"
            required
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            endIcon={<PersonAddIcon />}
            fullWidth
          >
            Register
          </Button>
          {message && (
            <Typography color={message.includes('Error') ? 'error' : 'success'}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterUser;
