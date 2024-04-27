import axiosInstance from '../axiosInterceptor';

export async function getAllEvents() {
  return await axiosInstance.get('/event/all');
}

export async function getEventById(eventId) {
  return await axiosInstance.get(`/event/${eventId}/details`);
}

export async function getMyEvents() {
  return await axiosInstance.get('/event/me');
}

export async function searchEvents(searchTerm, artistName, brandName, venueName, location, type, minAgeAllowed, startDate, orderBy, orderDirection) {
  return await axiosInstance.post('/event/filter', {
    searchTerm,
    artistName,
    brandName,
    venueName,
    location,
    type,
    minAgeAllowed,
    startDate,
    orderBy,
    orderDirection,
  });
}
export async function buyTicket(userId, eventId, purchaseDate, price, ticketStatus, isBuyerVisible) {
  const url = `/event/${eventId}/buyTicket`;
  console.log('Calling API:', axiosInstance.defaults.baseURL + url);

  const BuyTicketRequest = {
    userId: userId,
    eventId: eventId,
    purchaseDate: purchaseDate,
    price: price,
    ticketStatus: ticketStatus,
    buyerVisible: isBuyerVisible,
  };

  console.log('Payload:', BuyTicketRequest);
  return await axiosInstance.post(url, BuyTicketRequest);
}

export async function createEvent(eventData) {
  return await axiosInstance.post('/event/create', eventData);
}

export async function createVenue(venueData) {
  return await axiosInstance.post('event/createVenue', venueData);
}

export async function getVenueById(eventId) {
  return await axiosInstance.get(`/event/${eventId}/getVenue`);
}
export async function getBrand(eventId){
  return await axiosInstance.get(`/event/${eventId}/getBrand`);
};
export async function getAllVenues() {
  return await axiosInstance.get('/event/getAllVenues');
}
export async function getAllBrands() {
  return await axiosInstance.get('/event/getAllBrands');
}
export async function getAllEventPersons() {
  return await axiosInstance.get('/event/getAllEventPersons');
}
export async function createBrand(brandName) {
  return await axiosInstance.post('/event/createBrand', { name: brandName });
};

export async function getEventPerson(eventId) {
  return await axiosInstance.get(`/event/${eventId}/getEventPerson`);
};

export async function createEventPerson(eventPersonName) {
  return await axiosInstance.post('/event/createEventPerson', { name: eventPersonName });
};
