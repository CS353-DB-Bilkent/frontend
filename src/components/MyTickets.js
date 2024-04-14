import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import axiosInstance from '../services/axiosInterceptor';
import { useAuthStore } from '../stores/Store';

export default function MyTickets({user}) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (user && user.userId) {
      const fetchTickets = async () => {
        try {
          const response = await axiosInstance.get(`/event/getAllTickets/${user.userId}`);
          setTickets(response.data.data); // Assuming this is the structure
        } catch (error) {
          console.error('Error fetching tickets:', error);
          // Handle error state appropriately
        }
      };

      fetchTickets();
    }
  }, [user]);

  const handleRefund = async (eventId) => {
    try {
      // Confirmation before refunding
      if (!window.confirm('Are you sure you want to cancel this event and refund the ticket?')) {
        return;
      }

      // Send the request to the refund endpoint
      await axiosInstance.delete(`/event/cancelEvent/${eventId}`);

      // Filter out the refunded ticket from the state
      const updatedTickets = tickets.filter(ticket => ticket.eventId !== eventId);
      setTickets(updatedTickets);

      // Notify the user
      alert('The event has been cancelled and the ticket has been refunded.');
    } catch (error) {
      console.error('Error refunding the ticket:', error);
      // Handle error state appropriately
      alert('There was an error processing your refund. Please try again later.');
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Typography variant="h6" component="div" sx={{ p: 2 }}>
        My Tickets
      </Typography>
      <List>
        {tickets.map((ticket) => (
          <React.Fragment key={ticket.ticketId}>
            <ListItem>
              <ListItemText
                primary={`Event ID: ${ticket.eventId}`} // You might want to fetch event details to show more meaningful info
                secondary={`Purchased on: ${new Date(ticket.purchaseDate).toLocaleDateString()}`}
              />
              <Typography sx={{ margin: 'auto 10px' }}>
                {`Price: ${ticket.price}`}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {/* handle refund logic */}}
                disabled={ticket.ticketStatus !== 'RESERVED'}
              >
                Refund
              </Button>
              {/* Implement review functionality as needed */}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
