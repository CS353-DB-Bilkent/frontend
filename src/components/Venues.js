import { createVenue } from '../services/lib/event';

  export const handleSaveNewVenue = async (venueDetails, setVenues, closeVenueModal, resetVenueForm) => {
    const { newVenueName, newVenueCity, newVenueAddress, newVenueCapacity } = venueDetails;

    if (!newVenueName || !newVenueCity || !newVenueAddress || newVenueCapacity <= 0) {
      alert("Please fill all fields correctly!!");
      return;
    }
  
    const newVenue = {
      venueName: newVenueName,
      venueCity: newVenueCity,
      venueAddress: newVenueAddress,
      venueCapacity: parseInt(newVenueCapacity, 10)
    };
  
    try {
      const response = await createVenue(newVenue);
      console.log("Response received:", response);

      console.log("Venue created successfully :) with data:", response.data);
      alert('Venue created successfully :)');
      const updatedVenue = response.data;

      if (!updatedVenue || updatedVenue.venueId === null) {
        alert('Invalid venue data received. Please try again.');
        console.error('Invalid venue data:', updatedVenue);
        return;
    }

      setVenues(prevVenues => [...prevVenues, updatedVenue]);
      closeVenueModal();
      resetVenueForm();
    }
    catch (error) {
      console.error("Error creating venue:", error);
      alert(':( Failed to create venue: ' + error.response.data.message || error.message);
    }
  };


  // export const fetchVenues = async () => {
  //   try {
  //     console.log("Fetching venues from API");
  //     const response = await getAllVenues();
  //     return response.data;
  //   } catch (error) {
  //     console.error("Failed to fetch venues:", error);
  //     return [];
  //   }
  // };
  
