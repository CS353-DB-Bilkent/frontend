import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Button, Paper } from '@mui/material';
import Header from '../components/Header';
import UserSettings from '../components/UserSettings';
import MyTickets from '../components/MyTickets';
import MyEvents from '../components/MyEvents';
import MyTransactions from '../components/MyTransactions';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/Store';
import { useLoadingStore } from '../stores/Loading';
import ROLES from '../constants/roles';
import EventApprovalPage from './EventApprovalPage';
import Loading from '../components/loading/Loading';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  // State to track the active section
  const [activeSection, setActiveSection] = useState(''); // 'settings' or 'tickets'
  const { isLoading, setLoading } = useLoadingStore();
  const isOrganizer = user.role === ROLES.EVENT_ORGANIZER;
  const isAdmin = user.role === ROLES.ADMIN;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Header />
      <Container maxWidth="false" sx={{ mt: 4 }}>
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 64px)', mt: 4 }}>
          {/* Sidebar navigation */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              position: 'sticky',
              top: 0,
              //height: 'inherit', // This makes sure that the sidebar fills the height
            }}
          >
            <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                Welcome, {user ? user.name : 'User'}
              </Typography>
              {/* Avatar and user info would go here */}
              <Button fullWidth variant={activeSection === 'settings' ? 'contained' : 'text'} onClick={() => setActiveSection('settings')}>
                User Settings
              </Button>
              {!isAdmin && (
                <Button fullWidth variant={activeSection === 'tickets' ? 'contained' : 'text'} onClick={() => setActiveSection(isOrganizer ? 'events' : 'tickets')}>
                  {isOrganizer ? 'My Events' : 'My Tickets'}
                </Button>
              )}
              {!isAdmin && (
                <Button fullWidth variant={activeSection === 'transactions' ? 'contained' : 'text'} onClick={() => setActiveSection('transactions')}>
                  Transactions
                </Button>
              )}
              {isAdmin && (
                <Button fullWidth variant={activeSection === 'eventApproval' ? 'contained' : 'text'} onClick={() => setActiveSection('eventApproval')}>
                  Event Approval
                </Button>
              )}
              <Button
                fullWidth
                color="error"
                onClick={() => {
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
            {activeSection === 'events' && user && <MyEvents user={user} />}
            {activeSection === 'transactions' && user && <MyTransactions user={user} />}
            {activeSection === 'eventApproval' && isAdmin && <EventApprovalPage />}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
