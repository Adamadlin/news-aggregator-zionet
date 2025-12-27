

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const SendNotificationButton = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendNotification = async () => {
    if (!email) {
      setMessage('Please provide an email.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:6002/notify', { email });
      setMessage(res.data.message || 'Notification sent ✅');
      setEmail('');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setMessage('Error: ' + msg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Send Notification (uses saved preferences)
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

          <Button
            variant="contained"
            color="primary"
            onClick={handleSendNotification}
            endIcon={<SendIcon />}
            fullWidth
          >
            Send Email
          </Button>

          {message && (
            <Typography color={message.startsWith('Error') ? 'error' : 'success.main'}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SendNotificationButton;