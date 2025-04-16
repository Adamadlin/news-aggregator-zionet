// src/components/UpdatePreferences.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';

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

      setEmail('');
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
            Update Preferences
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
            label="New Preferences"
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
            onClick={handleUpdate}
            endIcon={<UpdateIcon />}
            fullWidth
          >
            Update Preferences
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

export default UpdatePreferences;
