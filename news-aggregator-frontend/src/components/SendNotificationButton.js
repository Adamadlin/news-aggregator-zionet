
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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
      setEmail('');
      setPreferences('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again later.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Send Notification
          </Typography>
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
            label="Preferences"
            type="text"
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
            onClick={handleSendNotification}
            endIcon={<SendIcon />}
            fullWidth
          >
            Send Notification
          </Button>
        </Box>
      </Paper>
    </Container>

);
};

export default SendNotificationButton;
