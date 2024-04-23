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

// the followind endpoints do not exist, they need to be implemented in the backend
export const fetchVenues = async () => {
  return await axiosInstance.get('/event/venues');
};
export const fetchBrands = async () => {
  return await axiosInstance.get('/event/brands');
};

export const createBrand = async (brandName) => {
  return await axiosInstance.post('/event/createBrand', { name: brandName });
};

export const fetchEventPersons = async () => {
  return await axiosInstance.get('/event/eventPersons');
};

export const createEventPerson = async (eventPersonName) => {
  return await axiosInstance.post('/event/createEventPerson', { name: eventPersonName });
};
