import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/loading/Loading';
import { buyTicket, getEventById } from '../services/lib/event';
import { useAuthStore } from '../stores/Store';
import TICKET_STATUS from '../constants/ticketStatus';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
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

  return (
    <div>
      <div style={{ background: '#b3dbff', padding: '10px' }}>
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
      <div style={{ padding: '10px' }}>
        <Typography variant="body1">{event.eventStatus} event</Typography>
        <Typography variant="body1">Tickets Left: {event.numberOfTickets}</Typography>
        <Typography variant="body1">Minimum Age Allowed: {event.minAgeAllowed}</Typography>

        <Button variant="contained" color="primary" onClick={handleOpenTicketsDialog}>
          See Tickets
        </Button>
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
            <Checkbox onChange={handleBuyerVisibleChange} color="primary" />
            <Button variant="contained" color="primary" onClick={handleBuyTicket}>
              {' '}
              Buy Ticket{' '}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default EventDetailsPage;
