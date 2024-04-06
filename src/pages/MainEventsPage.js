import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import EVENT_TYPE from '../constants/eventType';
import { useQuery } from '@tanstack/react-query';
import { getAllEvents, searchEvents } from '../services/lib/event';
import Loading from '../components/loading/Loading';
import { useLoadingStore } from '../stores/Loading';

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
        filters.startDate
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
      <div className="flex flex-wrap -mx-3 mb-6">
        {/* Search Term Input */}
        <FormControl fullWidth className="px-3 mb-6 md:mb-0">
          <TextField id="search-term" name="searchTerm" label="Search Term" variant="outlined" value={filters.searchTerm} onChange={handleFilterChange} />
        </FormControl>

        {/* Artist Name Input */}
        <FormControl fullWidth className="px-3 mb-6 md:mb-0">
          <TextField id="artist-name" name="artistName" label="Artist Name" variant="outlined" value={filters.artistName} onChange={handleFilterChange} />
        </FormControl>

        {/* Brand Name Input */}
        <FormControl fullWidth className="px-3 mb-6 md:mb-0">
          <TextField id="brand-name" name="brandName" label="Brand Name" variant="outlined" value={filters.brandName} onChange={handleFilterChange} />
        </FormControl>

        {/* Venue Name Input */}
        <FormControl fullWidth className="px-3 mb-6 md:mb-0">
          <TextField id="venue-name" name="venueName" label="Venue Name" variant="outlined" value={filters.venueName} onChange={handleFilterChange} />
        </FormControl>

        {/* Location Input */}
        <FormControl fullWidth className="px-3 mb-6 md:mb-0">
          <TextField id="location" name="location" label="Location" variant="outlined" value={filters.location} onChange={handleFilterChange} />
        </FormControl>

        {/* Minimum Age Allowed Input */}
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

        {/* Event Type Filter */}
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

        {/* Start Date Filter */}
      </div>

      <Button variant="contained" onClick={applyFilters}>
        Apply Filters
      </Button>

      {/* Events Section */}
      <div className="mt-8">
        {events.map((event) => (
          <div key={event.eventId} className="mb-4 p-4 bg-purple-200 rounded">
            <h2 className="font-bold text-xl">{event.name}</h2>
            <p>{event.details}</p>
            <p>Start: {event.startDate}</p>
            <p>End: {event.endDate}</p>
            <p>Ticket Price: ${event.ticketPrice}</p>
            <p>Available Tickets: {event.numberOfTickets}</p>
            <p>Min Age: {event.minAgeAllowed}</p>
            <p>Type: {event.eventType}</p>
            <p>Status: {event.eventStatus}</p>
            <Button variant="contained" color="primary">
              Buy Tickets
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainEventsPage;
