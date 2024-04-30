import React, { useState, useEffect } from 'react';
import { Modal, Fade, Backdrop, Box, Typography, Button, List, ListItem, ListItemText, Divider, Rating, TextField} from '@mui/material';
import { getEventById, getMyTickets, postReview, refundTicket } from '../services/lib/event';
import EVENT_STATUS from '../constants/eventStatus';
import { useLoadingStore } from '../stores/Loading';

function ReviewModal({ open, handleClose, event, postReview }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = async () => {
    // Call the postReview function passed as a prop with the current state of rating and comment
    await postReview({
      eventId: event.eventId, // Assuming `event` prop has an eventId field
      rating,
      comment,
    });
    handleClose();
  };


  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 400,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" component="h2">
            Leave a review for {event.name}
          </Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={handleRatingChange}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            placeholder="Write additional comments (Optional)."
            value={comment}
            onChange={handleCommentChange}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmitReview}
          >
            Post
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

export default function MyTickets({user}) {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isLoading, setLoading } = useLoadingStore();
  useEffect(() => {
    if (user && user.userId) {
      getMyTickets(user.userId)
        .then(async (response) => {
          const tickets = response.data.data;
          setTickets(tickets); // Set the tickets state

          const uniqueEventIds = [...new Set(tickets.map(ticket => ticket.eventId))];
          const eventsHash = {};
          for (const eventId of uniqueEventIds) {
            try {
              const eventResponse = await getEventById(eventId);
              //console.log(eventResponse); // Log to inspect the structure
              eventsHash[eventResponse.data.data.eventId] = eventResponse.data.data;
              //console.log(eventResponse.data);
              //console.log(eventResponse.data.data);
              //console.log(eventsHash[eventResponse.data.data.eventId]);
            } catch (error) {
              console.error(`Failed to fetch details for event ID ${eventId}:`, error);
              // Handle the error, for example by setting a flag or default data
            }
          }
          setEvents(eventsHash); // Update the events state
        })
        .catch(error => {
          console.error('Error fetching tickets:', error);
        });
    }
  }, [user]);


  const handleOpenReviewModal = (event) => {
    setSelectedEvent(event);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
  };
  const handleRefund = async (ticketId) => {
    try {
      // Confirmation before refunding
      if (!window.confirm('Are you sure you want to refund the ticket?')) {
        return;
      }

      // Send the request to the refund endpoint
      await refundTicket(ticketId);

      // Filter out the refunded ticket from the state
      const updatedTickets = tickets.filter(ticket => ticket.ticketId !== ticketId);
      setTickets(updatedTickets);

      // Notify the user
      alert('The ticket has been refunded.');
    } catch (error) {
      console.error('Error refunding the ticket:', error);
      // Handle error state appropriately
      alert('There was an error processing your refund. Please try again later.');
    }
  };
  const handlePostReview = async (reviewData) => {
    try {
      // Here we destructure the eventId from the reviewData to pass it separately if needed
      const { eventId, ...restOfReviewData } = reviewData;
      console.log(reviewData);
      await postReview({
        ...restOfReviewData,
        userId: user.userId,
      });

      // You may want to update state or do something else upon successful posting
      // setReviews([...reviews, response]);

      alert('Review posted successfully');
    } catch (error) {
      console.error('Error posting review:', error);
      alert('An error occurred while posting the review.');
    }
  };
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Typography variant="h6" component="div" sx={{ p: 2 }}>
        My Tickets
      </Typography>
      <List>
        {tickets.map((ticket) => (
          <ListItem key={ticket.ticketId} secondaryAction={
            <>
              <Button
                sx={{ mx: 1 }}
                variant="outlined"
                onClick={() => handleRefund(ticket.ticketId)}
                disabled={ticket.ticketStatus !== 'RESERVED'}
              >
                Refund
              </Button>
              {Object.keys(events).length > 0 ? (
                <Button
                  sx={{ mx: 1 }}
                  variant="outlined"
                  onClick={() => handleOpenReviewModal(events[ticket.eventId])}
                  disabled={!events[ticket.eventId] } // || events[ticket.eventId].eventStatus === EVENT_STATUS.ACTIVE //TODO
                >
                  Review
                </Button>
              ) : (
                <Typography sx={{ mx: 1 }}>
                  Loading event details...
                </Typography>
              )}
            </>
          }>
            <ListItemText
              primary={events[ticket.eventId]?.name || 'Loading event details...'}
              secondary={`Purchased on: ${new Date(ticket.purchaseDate).toLocaleDateString()} - Price: ${ticket.price}`}
            />
          </ListItem>
        ))}
      </List>
      {selectedEvent && (
        <ReviewModal
          open={reviewModalOpen}
          handleClose={handleCloseReviewModal}
          event={selectedEvent}
          postReview={handlePostReview}
        />
      )}
    </Box>
  );
}
