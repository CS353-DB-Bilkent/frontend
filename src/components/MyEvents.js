import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { getMyEvents, cancelEvent, reportEvent } from '../services/lib/event';
import ReportDialog from './ReportDialog';
import EVENT_STATUS from '../constants/eventStatus';

export default function MyEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  useEffect(() => {
    if (user && user.userId) {
      // Use the getMyEvents function from event services
      getMyEvents()
        .then(response => {
          setEvents(response.data.data); // Update according to the actual response structure
        })
        .catch(error => {
          console.error('Error fetching events:', error);
          // Handle error state appropriately
        });
    }
  }, [user]);

  const handleCancelEvent = async (eventId) => {
    try {
      // Confirmation before canceling
      if (!window.confirm('Are you sure you want to cancel this event?')) {
        return;
      }
      // Send the request to the cancel event endpoint
      await cancelEvent(eventId);

      // Notify the user
      alert('The event has been cancelled.');
    } catch (error) {
      console.error('Error canceling the event:', error);
      alert('There was an error canceling the event. Please try again later.');
    }
  };

  const handleShowReport = async (eventId) => {
    try {
      const reportResponse = await reportEvent(eventId);
      console.log('Report response data', reportResponse.data.data[0]);
      setReportData(reportResponse.data.data[0]);
      setReportDialogOpen(true); // Open the dialog
    } catch (error) {
      console.error('Error showing the report:', error);
      alert('There was an error showing the report. Please try again later.');
    }
  };
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Typography variant="h6" component="div" sx={{ p: 2 }}>
        My Events
      </Typography>
      <List>
        {events.map((event) => (
          <ListItem key={event.eventId} secondaryAction={
            <>
              <Button
                sx={{ mx: 1 }}
                variant="outlined"
                onClick={() => handleCancelEvent(event.eventId)}
                disabled={event.eventStatus === EVENT_STATUS.CANCELLED} // Disable if event is cancelled
              >
                Cancel
              </Button>
              <Button
                sx={{ mx: 1 }}
                variant="outlined"
                onClick={() => handleShowReport(event.eventId)}
              >
                Report
              </Button>
            </>
          }>
            <ListItemText
              primary={
                <React.Fragment>
                  {event.name} {event.eventStatus === EVENT_STATUS.CANCELLED && <span style={{ color: 'red' }}>CANCELLED</span>}
                </React.Fragment>
              }
              secondary={`Date: ${new Date(event.startDate).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
      {reportData && (
        <ReportDialog
          open={reportDialogOpen}
          onClose={handleCloseReportDialog}
          report={reportData}
        />
      )}
    </Box>
  );
}
