import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { approveEvent, getUnapprovedEvents, rejectEvent } from '../services/lib/event'; // Assuming axiosInstance is set up with baseURL

const EventApprovalPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getUnapprovedEvents()
      .then(response => {
        setEvents(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching unapproved events:', error);
      });
  }, []);
  const handleApprove = async (eventId) => {
    try {
      await approveEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (eventId) => {
    try {
      await rejectEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Events Waiting for Approval
      </Typography>
      <List>
        {events.map((event) => (
          <Paper key={event.id} elevation={3} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={event.name}
                secondary={
                  `Type: ${event.type} - Artist: ${event.artist} - Age Limit: ${event.minimumAgeAllowed}`
                }
              />
              <Button onClick={() => handleApprove(event.id)} variant="contained" color="primary">
                Approve
              </Button>
              <Button onClick={() => handleReject(event.id)} variant="contained" color="secondary" sx={{ ml: 2 }}>
                Reject
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={`City: ${event.city} - Venue: ${event.venue}`}
                secondary={`Start: ${new Date(event.start).toLocaleString()} - End: ${new Date(event.end).toLocaleString()}`}
              />
              <Typography variant="body2" sx={{ ml: 'auto' }}>
                Number of Tickets: {event.numberOfTickets}
              </Typography>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default EventApprovalPage;
