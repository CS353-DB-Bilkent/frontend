import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import EVENT_TYPE from '../constants/eventType';
import { useQuery } from '@tanstack/react-query';
import { getAllEvents, searchEvents } from '../services/lib/event';
import Loading from '../components/loading/Loading';
import { useLoadingStore } from '../stores/Loading';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,
    top: 10,
    padding: '4px',
    fontSize: '20px',
  },
}));

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ minWidth: 275, maxWidth: 345, m: 1 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {event.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {event.details}
          </Typography>
          <Typography variant="body2" color="text.primary" fontSize={'15px'}>
            Dates: <br />
            {new Date(event.startDate).toLocaleString()}-{new Date(event.endDate).toLocaleString()}
          </Typography>

          <Typography variant="body2" color="text.primary" fontSize={'15px'}>
            Minimum Allowed Age: {event.minAgeAllowed}
          </Typography>
        </CardContent>
        <CardActions>
          <Button fullWidth size="small" variant="contained" color="primary" onClick={() => navigate(`/event/info/${event.eventId}`)}>
            See More Info
          </Button>
        </CardActions>
        <hr></hr>
        <Typography align="center" justifyContent={'center'} variant="body2" color="text.primary" mb={'6px'}>
          {event.eventType}
        </Typography>
      </Card>
    </Box>
  );
};

const EventsGrid = ({ events }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={event.eventId}>
          <StyledBadge color="primary" badgeContent={`$${event.ticketPrice}`}>
            <EventCard event={event} />
          </StyledBadge>
        </Grid>
      ))}
    </Grid>
  );
};

const MainEventsPage = () => {
  const setLoading = useLoadingStore((s) => s.setLoading);

  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    artistName: '',
    brandName: '',
    venueName: '',
    location: '',
    type: '',
    minAgeAllowed: 0,
    startDate: null,
    orderBy: 'START_DATE',
    orderDirection: 'ASC',
  });

  const {
    loading,
    error,
    data: initialEvents,
  } = useQuery({
    queryKey: ['initialEvents'],
    queryFn: async () => getAllEvents(),
  });

  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents.data?.data);
    }
  }, [initialEvents]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const response = await searchEvents(
        filters.searchTerm,
        filters.artistName,
        filters.brandName,
        filters.venueName,
        filters.location,
        filters.type,
        filters.minAgeAllowed,
        filters.startDate,
        filters.orderBy,
        filters.orderDirection
      );
      setEvents(response.data?.data);
      setLoading(false);

      console.log('Filtered Events:', response.data?.data);
    } catch (error) {
      console.error('Error applying filters:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Grid container direction="row" justifyContent="center" alignItems="center" mb={'20px'}>
        <Grid container spacing={2} m={'10px'}>
          {/* Search Term Input */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <TextField id="search-term" name="searchTerm" label="Search Term" variant="outlined" value={filters.searchTerm} onChange={handleFilterChange} />
            </FormControl>
          </Grid>

          {/* Artist Name Input */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <TextField id="artist-name" name="artistName" label="Artist Name" variant="outlined" value={filters.artistName} onChange={handleFilterChange} />
            </FormControl>
          </Grid>

          {/* Brand Name Input */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <TextField id="brand-name" name="brandName" label="Brand Name" variant="outlined" value={filters.brandName} onChange={handleFilterChange} />
            </FormControl>
          </Grid>

          {/* Venue Name Input */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <TextField id="venue-name" name="venueName" label="Venue Name" variant="outlined" value={filters.venueName} onChange={handleFilterChange} />
            </FormControl>
          </Grid>

          {/* Location Input */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <TextField id="location" name="location" label="Location" variant="outlined" value={filters.location} onChange={handleFilterChange} />
            </FormControl>
          </Grid>

          {/* Minimum Age Allowed Input */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <TextField
                id="min-age-allowed"
                name="minAgeAllowed"
                label="Minimum Age Allowed"
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 0 } }} // Ensuring only positive numbers
                value={filters.minAgeAllowed}
                onChange={handleFilterChange}
              />
            </FormControl>
          </Grid>

          {/* Event Type Filter */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <InputLabel id="type">Event Type</InputLabel>
              <Select labelId="type" id="type-select" name="type" value={filters.type} label="Event Type" onChange={handleFilterChange}>
                <MenuItem value={EVENT_TYPE.CONCERT}>Concert</MenuItem>
                <MenuItem value={EVENT_TYPE.SPORTS}>Sport</MenuItem>
                <MenuItem value={EVENT_TYPE.THEATER}>Theater</MenuItem>
                <MenuItem value={EVENT_TYPE.GATHERING}>Gathering</MenuItem>
                <MenuItem value={EVENT_TYPE.PARTY}>Party</MenuItem>
                <MenuItem value={''}>None</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <InputLabel id="orderBy">Order By</InputLabel>
              <Select labelId="orderBy" id="orderBy-select" name="orderBy" value={filters.orderBy} label="Order By" onChange={handleFilterChange}>
                <MenuItem value={'START_DATE'}>Start Date</MenuItem>
                <MenuItem value={'END_DATE'}>End Date</MenuItem>
                <MenuItem value={'NAME'}>Name</MenuItem>
                <MenuItem value={'EVENT_TYPE'}>Type</MenuItem>
                <MenuItem value={'TICKET_PRICE'}>Price</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <InputLabel id="orderDirection">Order Direction</InputLabel>
              <Select
                labelId="orderDirection"
                id="orderDirection-select"
                name="orderDirection"
                value={filters.orderDirection}
                label="Order Direction"
                onChange={handleFilterChange}
              >
                <MenuItem value={'ASC'}>Ascending</MenuItem>
                <MenuItem value={'DESC'}>Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date Filter */}
          <Grid item xs={3}>
            <FormControl fullWidth className="px-3 mb-6 md:mb-0">
              <InputLabel id="type">Date Placeholder</InputLabel>
            </FormControl>
          </Grid>
        </Grid>

        <Button variant="contained" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Grid>

      <hr></hr>

      {/* Events Section */}
      <EventsGrid events={events} />
    </div>
  );
};

export default MainEventsPage;
