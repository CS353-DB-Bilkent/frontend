import { Avatar, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, Rating } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import Loading from '../components/loading/Loading';
import NOTIFY_TYPES from '../constants/notifyTypes';
import TICKET_STATUS from '../constants/ticketStatus';
import { buyTicket, getBrand, getEventAttendees, getEventById, getEventPerson, getReviews, getVenueById } from '../services/lib/event';
import { useAuthStore } from '../stores/Store';
import { notify, notifyError } from '../utility/notify';
const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [venue, setVenue] = useState(null);
  const [brand, setBrand] = useState(null);
  const [eventPerson, setEventPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketsDialog, setTicketsDialog] = useState(false);
  const [buyerVisible, setBuyerVisible] = useState(false);

  const user = useAuthStore((state) => state.user);

  const handleOpenTicketsDialog = () => {
    setTicketsDialog(true);
  };
  const handleCloseTicketsDialog = () => {
    setTicketsDialog(false);
  };

  const handleBuyerVisibleChange = (event) => {
    setBuyerVisible(event.target.checked);
  };

  const handleBuyTicket = async () => {
    try {
      const userId = user.userId;
      const purchaseDate = new Date().toISOString();
      const price = event.ticketPrice;
      const ticketStatus = TICKET_STATUS.RESERVED;

      console.log(buyerVisible);

      await buyTicket(userId, eventId, purchaseDate, price, ticketStatus, buyerVisible);
      notify('Ticket purchased successfully', NOTIFY_TYPES.SUCCESS);
    } catch (error) {
      notifyError(error.response.data);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await getEventById(eventId);
        setEvent(response.data.data);
        const attendeesResponse = await getEventAttendees(eventId);
        setAttendees(attendeesResponse.data.data);
        const reviewsResponse = await getReviews(eventId);
        console.log(reviewsResponse.data.data);
        setReviews(reviewsResponse.data.data);
        const venueDetails = await getVenueById(eventId);
        setVenue(venueDetails.data.data);
        const brandDetails = await getBrand(eventId);
        setBrand(brandDetails.data.data);
        const eventPersonDetails = await getEventPerson(eventId);
        setEventPerson(eventPersonDetails.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return <Typography variant="h6">Event not found.</Typography>;
  }
  function stringToColor(string) {
    let hash = 0;
    let i;
      for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: name.length > 1 ? `${name[0]}${name[1]}` : `${name[0]}`,
    };
  }

 
  

  return (
    <div>
      <div style={{ background: '#b3dbff', padding: '30px' }}>
        <Typography variant="h6"> {event.eventType} </Typography>
        <Typography variant="h4" gutterBottom>
          {event.name}
        </Typography>
        <Typography variant="body1">{event.details}</Typography>
        <hr></hr>

        <Typography variant="body1">Dates</Typography>
        <Typography variant="body2">
          Start: {new Date(event.startDate).toLocaleString()} - End: {new Date(event.endDate).toLocaleString()}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', padding: '10px' }}>
        <div style={{ flex: 1, padding:'20px' }}>
          <Typography variant="h6">Event Details </Typography>
          <Typography variant="body1">{event.eventStatus} event</Typography>
          <Typography variant="body1">Tickets Left: {event.numberOfTickets}</Typography>
          <Typography variant="body1">Minimum Age Allowed: {event.minAgeAllowed}</Typography>
          <Typography variant="body1">Brand for the event: {brand.brandName}</Typography>
          <Typography variant="body1">Event Person: {eventPerson.eventPersonName}</Typography>
          <hr></hr>
          <Typography variant="h6">Venue Details </Typography>
          <Typography variant="body1">{venue ? venue.venueName : "Loading venue details..."}</Typography>
          <Typography variant="body1">City: {venue ? venue.venueCity : "Loading venue details..."}</Typography>
          <Typography variant="body1">Address: {venue ? venue.venueAddress : "Loading venue details..."}</Typography>
          <Typography variant="body1">Capacity: {venue.venueCapacity}</Typography>

        
        </div>
        <div  style={{ flex: 1 }} >
          <Button variant="contained" color="primary" onClick={handleOpenTicketsDialog}>
            See Tickets
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="h6">Event Attendees</Typography>
          {attendees.length > 0 ? (
            <List>
              {attendees.map((attendee, index) => (
                <ListItem key={index}>
                  <Avatar {...stringAvatar(attendee.name)} />
                  <ListItemText primary={attendee.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" style={{ marginLeft: 20 }}>No visible attendees yet!</Typography>
          )}
          <hr></hr>
        <Typography variant="h6">Event Reviews</Typography>
          {reviews.length > 0 ? (
            <List>
              {reviews.map((review, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <Avatar {...stringAvatar(review.userInitials)} />
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Rating value={review.rating} readOnly size="small" />
                      </React.Fragment>
                    }
                    secondary={review.description}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" style={{ marginLeft: 20 }}>No one posted a review yet!</Typography>
          )}
          <Dialog open={ticketsDialog} onClose={handleCloseTicketsDialog}>
            <DialogTitle>Tickets for {event.name}</DialogTitle>
            <DialogContent>
              <Typography variant="body1"></Typography>
              <DialogContentText>
                {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
                <Typography variant="body1">Ticket Price: {event.ticketPrice} </Typography>
                <Typography variant="body1">Your balance: {user.balance}</Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Typography variant="body1">Appear as going?</Typography>
              <Checkbox onChange={handleBuyerVisibleChange} color="primary" />
              <Button variant="contained" color="primary" onClick={handleBuyTicket}>
                {' '}
                Buy Ticket{' '}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
