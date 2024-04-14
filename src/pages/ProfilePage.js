import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Button, Paper } from '@mui/material';
import Header from '../components/Header';
import UserSettings from '../components/UserSettings';
import MyTickets from '../components/MyTickets';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/Store';


const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  // State to track the active section
  const [activeSection, setActiveSection] = useState('tickets'); // 'settings' or 'tickets'

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Box>
      <Header /> {/* Your Header component at the top */}
      <Container maxWidth='false' sx={{ mt: 4 }}>
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 64px)', mt: 4 }}>
          {/* Sidebar navigation */}
          <Grid item xs={12} md={3} sx={{
            position: 'sticky',
            top: 0,
            //height: 'inherit', // This makes sure that the sidebar fills the height
          }}>
            <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                Welcome,  {user ? user.name : "User"}</Typography>
              {/* Avatar and user info would go here */}
              <Button
                fullWidth
                variant={activeSection === 'settings' ? 'contained' : 'text'}
                onClick={() => setActiveSection('settings')}
              >
                User Settings
              </Button>
              <Button
                fullWidth
                variant={activeSection === 'tickets' ? 'contained' : 'text'}
                onClick={() => setActiveSection('tickets')}
              >
                My Tickets
              </Button>
              <Button fullWidth color="error" onClick={() => {
                logout();
                navigate('/login');
                }}
              >
                Logout
              </Button>
            </Paper>
          </Grid>

          {/* Main content area */}
          <Grid item xs={12} md={9}>
            {activeSection === 'settings' && user && <UserSettings user={user} />}
            {activeSection === 'tickets' && user && <MyTickets user={user} />}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
