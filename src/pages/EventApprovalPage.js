import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { approveEvent, getUnapprovedEvents, rejectEvent } from '../services/lib/event'; // Assuming axiosInstance is set up with baseURL
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';

const EventApprovalPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getUnapprovedEvents()
      .then((response) => {
        setEvents(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching unapproved events:', error);
      });
  }, []);

  const handleApprove = async (eventId) => {
    try {
      await approveEvent(eventId);
      setEvents(events.filter((event) => event.eventId !== eventId));
      notify('Event approved successfully', NOTIFY_TYPES.SUCCESS);
      setEvents(events.filter((event) => event.eventId !== eventId));
    } catch (error) {
      notifyError(error.response.data);
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (eventId) => {
    try {
      await rejectEvent(eventId);
      setEvents(events.filter((event) => event.eventId !== eventId));
      notify('Event rejected successfully', NOTIFY_TYPES.SUCCESS);
      setEvents(events.filter((event) => event.eventId !== eventId));
    } catch (error) {
      notifyError(error.response.data);
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
          <Paper key={event.eventId} elevation={3} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText primary={event.name} secondary={`Type: ${event.eventType} - Age Limit: ${event.minAgeAllowed}`} />
              <Button onClick={() => handleApprove(event.eventId)} variant="contained" color="primary">
                Approve
              </Button>
              <Button onClick={() => handleReject(event.eventId)} variant="contained" color="secondary" sx={{ ml: 2 }}>
                Reject
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary={`Start: ${new Date(event.startDate).toLocaleString()} - End: ${new Date(event.endDate).toLocaleString()}`} secondary={event.details} />
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
