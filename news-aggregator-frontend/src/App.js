import './App.css';

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography } from '@mui/material';
import RegisterUser from './components/RegisterUser';
import UpdatePreferences from './components/UpdatePreferences';
import SendNotificationButton from './components/SendNotificationButton';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            News Aggregator
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <RegisterUser />
            <UpdatePreferences />
            <SendNotificationButton />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;