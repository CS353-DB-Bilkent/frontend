import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Loading from '../components/loading/Loading';
import EVENT_TYPE from '../constants/eventType';
import { getMyEvents } from '../services/lib/event';
import { useAuthStore } from '../stores/Store';



export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [newVenueOpen, setNewVenueOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [minAgeAllowed, setMinAgeAllowed] = useState('');  
  const [numberOfTickets, setNumberOfTickets] = useState('');  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [errors, setErrors] = useState({});
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueCity, setNewVenueCity] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('');
  const [newVenueCapacity, setNewVenueCapacity] = useState('');
  const [venues, setVenues] = useState([]);

  const validate = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!eventName) {
      formIsValid = false;
      tempErrors["eventName"] = "Event name is required.";
    }

    if (!eventLocation) {
      formIsValid = false;
      tempErrors["eventLocation"] = "Event location is required.";
    }

    if (!eventType) {
      formIsValid = false;
      tempErrors["eventType"] = "Event type is required.";
    }
    if (!minAgeAllowed) {
      formIsValid = false;
      tempErrors["minAgeAllowed"] = "Minimum age is required.";
    }

    if (!startDate || !endDate) {
      formIsValid = false;
      tempErrors["eventDates"] = "Start and end dates are required.";
    }

    if (!venueName) {
      formIsValid = false;
      tempErrors["venueName"] = "Venue is required.";
    }
    if (!numberOfTickets) {
      formIsValid = false;
      tempErrors["numberOfTickets"] = "Number of tickets is required.";
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const user = useAuthStore((s) => s.user);
  const { data: events, isLoading: eventsLoading, error: eventsError } = useQuery(['myEvents'], getMyEvents);

  const handleDialogToggle = () => setOpen(!open);
  const handleSave = () => {
    if (validate()) {
        console.log({
            eventName,
            eventLocation,
            eventType,
            minAgeAllowed,
            startDate,
            endDate,
            venueName,
            eventDetails
        });
        handleDialogToggle();
    }
};
const handleVenueChange = (event) => {
  const value = event.target.value;
  if (value === "add-new") {
    setNewVenueOpen(true);
  } else {
    setVenueName(value);
  }
};
const handleSaveNewVenue = () => {
  if (!newVenueName || !newVenueCity || newVenueAddress ||newVenueCapacity <= 0) {
    alert("Please fill all fields correctly.");
    return;
  }

  const newVenue = {
    id: venues.length + 1,
    name: newVenueName,
    city: newVenueCity,
    address: newVenueAddress,
    capacity: newVenueCapacity
  };
  setVenues([...venues, newVenue]);
  setVenueName(newVenue.name);
  setNewVenueOpen(false);
  setNewVenueName('');
  setNewVenueCity('');
  setNewVenueAddress('');
  setNewVenueCapacity('');
};


  if (eventsLoading) return <Loading />;
  if (eventsError) return <Typography color="error">Error: {eventsError.message}</Typography>;

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h4" color="primary.dark" fontWeight="bold">Welcome, {user.name}</Typography>
        <Divider sx={{ my: 2 }} />
        <Button variant="contained" onClick={handleDialogToggle}>Create New Event</Button>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Your Events:</Typography>
          <Grid container spacing={2}>
            {events && Array.isArray(events) ? events.map((event) => (
              <Grid item key={event.id} xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2">Location: {event.location}</Typography>
                </Paper>
              </Grid>
            )) : <Typography>No events found or data is not in the expected format.</Typography>}
          </Grid>
        </Paper>
      </Grid>
      <Dialog open={open} onClose={handleDialogToggle} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogContentText sx={{ mb: 2, textAlign: 'center' }}>Create a New Event</DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
                helperText={errors.eventName || ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                id="location"
                label="Event Location"
                type="text"
                required
                fullWidth
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                variant="outlined"
                error={!!errors.eventLocation}
                helperText={errors.eventLocation || ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" required error={!!errors.eventType}>
                <InputLabel id="eventType-label">Event Type</InputLabel>
                <Select
                  labelId="eventType-label"
                  id="eventType"
                  value={eventType}
                  label="Event Type"
                  onChange={(e) => setEventType(e.target.value)}
                >
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
                helperText={errors.minAgeAllowed || ""} 
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                  label="Start Date and Time (*)"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => (
                    <TextField
                        {...params}
                        error={!!errors.eventDates}
                        helperText={errors.eventDates || ""}
                        fullWidth
                        margin="dense"
                    />
                )}
            />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="End Date and Time (*)"
                  required
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => (
                    <TextField
                        {...params}
                        error={!!errors.eventDates}
                        helperText={errors.eventDates || ""}
                        fullWidth
                        margin="dense"
                    />
                )}
            />
              </LocalizationProvider>
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
                helperText={errors.numberOfTickets || ""} 
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="venue-label">Venue</InputLabel>
                <Select
                  labelId="venue-label"
                  required
                  id="venueName"
                  value={venueName}
                  onChange={handleVenueChange}
                  label="Venue"
                >
                  {venues.map((venue) => (
                    <MenuItem key={venue.id} value={venue.name}>{venue.name}</MenuItem>
                  ))}
                  <MenuItem value="add-new">Add New Venue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
            <TextField
                autoFocus
                margin="dense"
                id="name"
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
            value={newVenueName}
            onChange={(e) => setNewVenueName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="newVenueCity"
            label="Venue City"
            type="text"
            fullWidth
            required
            value={newVenueCity}
            onChange={(e) => setNewVenueCity(e.target.value)}
          />
          <TextField
            margin="dense"
            id="newVenueAddress"
            label="Venue Address"
            type="text"
            fullWidth
            required
            value={newVenueAddress}
            onChange={(e) => setNewVenueAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            id="newVenueCapacity"
            label="Venue Capacity"
            type="number"
            fullWidth
            required
            value={newVenueCapacity}
            onChange={(e) => setNewVenueCapacity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewVenueOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewVenue}>Add Venue</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
