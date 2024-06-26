import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { handleSaveNewBrand } from '../components/Brands';
import Loading from '../components/loading/Loading';
import { handleSaveNewVenue } from '../components/Venues';

import { handleSaveNewEventPerson } from '../components/EventPersons';
import EVENT_TYPE from '../constants/eventType';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { createEvent, getAllBrands, getAllEventPersons, getAllVenues, getMyEvents } from '../services/lib/event';
import { useAuthStore } from '../stores/Store';
import { notify, notifyError } from '../utility/notify';

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [minAgeAllowed, setMinAgeAllowed] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventDetails, setEventDetails] = useState('');
  const [errors, setErrors] = useState({});
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventPersons, setEventPersons] = useState([]);
  const [newVenueOpen, setNewVenueOpen] = useState(false);
  const [venueDetails, setVenueDetails] = useState({
    newVenueName: '',
    newVenueCity: '',
    newVenueAddress: '',
    newVenueCapacity: '',
  });
  const [newBrandOpen, setNewBrandOpen] = useState(false);
  const [newEventPersonOpen, setNewEventPersonOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [newEventPersonName, setNewEventPersonName] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedEventPersonId, setSelectedEventPersonId] = useState('');

  const handleNewVenueDialog = () => setNewVenueOpen(true);
  const handleNewBrandDialog = () => setNewBrandOpen(true);
  const handleNewEventPersonDialog = () => setNewEventPersonOpen(true);

  const user = useAuthStore((s) => s.user);

  const closeVenueModal = () => {
    setNewVenueOpen(false);
  };

  const resetVenueForm = () => {
    setVenueDetails({
      newVenueName: '',
      newVenueCity: '',
      newVenueAddress: '',
      newVenueCapacity: '',
    });
  };

  const saveNewVenue = async () => {
    await handleSaveNewVenue(venueDetails, setVenues, closeVenueModal, resetVenueForm);
  };

  const closeBrandModal = () => {
    setNewBrandOpen(false);
  };

  const resetBrandForm = () => {
    setBrands('');
  };

  const saveNewBrand = async () => {
    await handleSaveNewBrand(newBrandName, setBrands, closeBrandModal, resetBrandForm);
  };

  const closeEventPersonModal = () => {
    setNewEventPersonOpen(false);
  };

  const resetEventPersonForm = () => {
    setNewEventPersonName('');
  };

  const saveNewEventPerson = async () => {
    await handleSaveNewEventPerson(newEventPersonName, setEventPersons, closeEventPersonModal, resetEventPersonForm);
  };

  const {
    data: myEvents,
    eventsLoading,
    eventsError,
  } = useQuery({
    queryKey: ['myEvents'],
    queryFn: async () => getMyEvents(),
  });

  const {
    loading,
    error,
    data: initialVenues,
  } = useQuery({
    queryKey: ['initialVenues'],
    queryFn: async () => getAllVenues(),
  });

  const { data: initialBrands } = useQuery({
    queryKey: ['initialBrands'],
    queryFn: async () => getAllBrands(),
  });

  const { data: initialEventPersons } = useQuery({
    queryKey: ['initialEventPersons'],
    queryFn: async () => getAllEventPersons(),
  });

  useEffect(() => {
    if (myEvents && myEvents.data?.data) {
      setEvents(myEvents.data.data);
    }
  }, [myEvents]);

  useEffect(() => {
    if (initialVenues && initialVenues.data?.data) {
      setVenues(initialVenues.data.data);
    }
  }, [initialVenues]);

  useEffect(() => {
    if (initialBrands && initialBrands.data?.data) {
      setBrands(initialBrands.data.data);
    }
  }, [initialBrands]);

  useEffect(() => {
    if (initialEventPersons && initialEventPersons.data?.data) {
      setEventPersons(initialEventPersons.data.data);
    }
  }, [initialEventPersons]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  const validate = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!eventName) {
      formIsValid = false;
      tempErrors['eventName'] = 'Event name is required.';
    }
    if (!eventType) {
      formIsValid = false;
      tempErrors['eventType'] = 'Event type is required.';
    }
    if (!minAgeAllowed) {
      formIsValid = false;
      tempErrors['minAgeAllowed'] = 'Minimum age is required.';
    }
    if (!startDate || !endDate) {
      formIsValid = false;
      tempErrors['eventDates'] = 'Start and end dates are required.';
    }
    if (!selectedVenueId) {
      formIsValid = false;
      tempErrors['venueName'] = 'Venue is required.';
    }
    if (!numberOfTickets) {
      formIsValid = false;
      tempErrors['numberOfTickets'] = 'Number of tickets is required.';
    }
    if (!ticketPrice) {
      formIsValid = false;
      tempErrors['ticketPrice'] = 'Ticket price is required.';
    }
    console.log('Errors:', tempErrors);
    setErrors(tempErrors);
    return formIsValid;
  };

  const handleDialogToggle = () => setOpen(!open);
  const handleSave = async () => {
    if (validate()) {
      try {
        const eventData = {
          name: eventName,
          details: eventDetails,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          ticketPrice: parseFloat(ticketPrice),
          numberOfTickets: parseInt(numberOfTickets, 10),
          eventType: eventType,
          minAgeAllowed: parseInt(minAgeAllowed, 10),
          userId: user.userId,
          venueId: selectedVenueId,
          brandId: selectedBrandId !== '' ? selectedBrandId : null,
          eventPersonId: selectedEventPersonId !== '' ? selectedEventPersonId : null,
        };

        console.log('Event Data:', eventData);

        const result = await createEvent(eventData);
        console.log('Event created successfully:', result);
        notify('Event created successfully!', NOTIFY_TYPES.SUCCESS);
        handleDialogToggle();
      } catch (error) {
        notifyError(error.response.data);
      }
    }
  };

  if (eventsLoading) return <Loading />;
  if (eventsError) return <Typography color="error">Error: {eventsError.message}</Typography>;

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h4" color="primary.dark" fontWeight="bold">
          Welcome, {user.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Button variant="contained" onClick={handleDialogToggle}>
          Create New Event
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Your Events:</Typography>
          <Grid container spacing={2}>
            {events && Array.isArray(events) ? (
              events.map((event) => {
                return (
                  <Grid item key={event.eventId} xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6">{event.name}</Typography>
                      <Typography variant="body2">Details: {event.details}</Typography>
                      <Typography variant="body2">Tickets Remaining: {event.numberOfTickets}</Typography>
                      <Typography variant="body2">Start Date: {new Date(event.startDate).toDateString()}</Typography>
                      <Typography variant="body2">Status: {event.eventStatus} </Typography>
                    </Paper>
                  </Grid>
                );
              })
            ) : (
              <Typography>No events found or data is not in the expected format.</Typography>
            )}
          </Grid>
        </Paper>
      </Grid>
      <Dialog open={open} onClose={handleDialogToggle} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogContentText sx={{ mb: 2, textAlign: 'center' }}>Create a New Event</DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Event Name"
                type="text"
                required
                fullWidth
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                variant="outlined"
                error={!!errors.eventName}
                helperText={errors.eventName || ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" required error={!!errors.eventType}>
                <InputLabel id="eventType-label">Event Type</InputLabel>
                <Select labelId="eventType-label" id="eventType" value={eventType} label="Event Type" onChange={(e) => setEventType(e.target.value)}>
                  <MenuItem value={'None'}>None</MenuItem>
                  <MenuItem value={EVENT_TYPE.CONCERT}>Concert</MenuItem>
                  <MenuItem value={EVENT_TYPE.SPORTS}>Sport</MenuItem>
                  <MenuItem value={EVENT_TYPE.THEATER}>Theater</MenuItem>
                  <MenuItem value={EVENT_TYPE.GATHERING}>Gathering</MenuItem>
                  <MenuItem value={EVENT_TYPE.PARTY}>Party</MenuItem>
                </Select>
                <FormHelperText>{errors.eventType}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="minAgeAllowed"
                label="Minimum Age Allowed"
                type="number"
                required
                fullWidth
                value={minAgeAllowed}
                onChange={(e) => setMinAgeAllowed(e.target.value)}
                variant="outlined"
                error={!!errors.minAgeAllowed}
                helperText={errors.minAgeAllowed || ''}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="numberOfTickets"
                label="Number of Tickets"
                type="number"
                required
                fullWidth
                value={numberOfTickets}
                onChange={(e) => setNumberOfTickets(e.target.value)}
                variant="outlined"
                error={!!errors.numberOfTickets}
                helperText={errors.numberOfTickets || ''}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="ticketPrice"
                label="Ticket price"
                type="number"
                required
                fullWidth
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                variant="outlined"
                error={!!errors.ticketPrice}
                helperText={errors.ticketPrice || ''}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="startDate"
                onChange={(e) => setStartDate(e.target.value)}
                helperText={errors.eventDates || ''}
                label="Start Date"
                name="startDate"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="endDate"
                onChange={(e) => setEndDate(e.target.value)}
                helperText={errors.eventDates || ''}
                label="End Date"
                name="endDate"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Event Person</InputLabel>
                <Select value={selectedEventPersonId} onChange={(e) => setSelectedEventPersonId(e.target.value)} label="Event Person">
                  {eventPersons.map((person) => (
                    <MenuItem key={person.eventPersonId} value={person.eventPersonId}>
                      {person.eventPersonName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button onClick={handleNewEventPersonDialog}>Add New Event Person</Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Venue</InputLabel>
                <Select value={selectedVenueId} onChange={(e) => setSelectedVenueId(e.target.value)} label="Venue">
                  {venues.map((venue) => (
                    <MenuItem key={venue.venueId} value={venue.venueId}>
                      {venue.venueName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button onClick={handleNewVenueDialog}>Add New Venue</Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={selectedBrandId}
                  onChange={(e) => {
                    setSelectedBrandId(e.target.value);
                    console.log('Selected Brand Id:', e.target.value);
                  }}
                  label="Brand"
                >
                  {brands.map((brand, index) => (
                    <MenuItem key={brand.brandId ? brand.brandId : `brand-${index}`} value={brand.brandId}>
                      {brand.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button onClick={handleNewBrandDialog}>Add New Brand</Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="eventDetails"
                label="Event Description"
                type="text"
                fullWidth
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleDialogToggle}>Cancel</Button>
          <Button onClick={handleSave}>Add Event</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={newVenueOpen} onClose={() => setNewVenueOpen(false)}>
        <DialogTitle>Add New Venue</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newVenueName"
            label="Venue Name"
            type="text"
            required
            fullWidth
            value={venueDetails.name}
            onChange={(e) => setVenueDetails({ ...venueDetails, newVenueName: e.target.value })}
          />
          <TextField
            margin="dense"
            id="newVenueCity"
            label="Venue City"
            type="text"
            fullWidth
            required
            value={venueDetails.city}
            onChange={(e) => setVenueDetails({ ...venueDetails, newVenueCity: e.target.value })}
          />
          <TextField
            margin="dense"
            id="newVenueAddress"
            label="Venue Address"
            type="text"
            fullWidth
            required
            value={venueDetails.address}
            onChange={(e) => setVenueDetails({ ...venueDetails, newVenueAddress: e.target.value })}
          />
          <TextField
            margin="dense"
            id="newVenueCapacity"
            label="Venue Capacity"
            type="number"
            fullWidth
            required
            value={venueDetails.capacity}
            onChange={(e) => setVenueDetails({ ...venueDetails, newVenueCapacity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewVenueOpen(false)}>Cancel</Button>
          <Button onClick={saveNewVenue}>Add Venue</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={newBrandOpen} onClose={() => setNewBrandOpen(false)}>
        <DialogTitle>Add New Brand</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="brandName"
            label="Brand Name"
            type="text"
            required
            fullWidth
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewBrandOpen(false)}>Cancel</Button>
          <Button onClick={saveNewBrand}>Add Brand</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={newEventPersonOpen} onClose={() => setNewEventPersonOpen(false)}>
        <DialogTitle>Add New EventPerson</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newEventPersonName"
            label="EventPerson Name"
            type="text"
            required
            fullWidth
            value={newEventPersonName}
            onChange={(e) => setNewEventPersonName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewEventPersonOpen(false)}>Cancel</Button>
          <Button onClick={saveNewEventPerson}>Add EventPerson</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
