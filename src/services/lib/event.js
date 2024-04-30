import axiosInstance from '../axiosInterceptor';

export async function getAllEvents() {
  return await axiosInstance.get('/event/all');
}
export async function getMyTickets(userId){
  return await axiosInstance.get(`/event/getAllTickets/${userId}`);
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

export async function reportEvent(eventId) {
  try {
    return await axiosInstance.post(`/event/reportEvent/${eventId}`);

  } catch (error) {
    console.error('Error fetching the event report:', error);
    throw new Error('There was an error fetching the event report.');
  }
}
export async function postReview(reviewData) {
  try {
      return await axiosInstance.post(`/reviews/post`, {
      rating: reviewData.rating,
      description: reviewData.comment,
      reviewDate: new Date().toISOString().split('T')[0], // Review date is today
      userId: reviewData.userId,
    });
  } catch (error) {
    console.error('Error posting review:', error);
    throw error;
  }
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

export async function refundTicket(ticketId){
  return await axiosInstance.post(`/event/refundTicket/${ticketId}`);
}

export async function createEvent(eventData) {
  return await axiosInstance.post('/event/create', eventData);
}
export async function cancelEvent(eventId) {
  return await axiosInstance.post(`/event/cancelEvent/${eventId}`);
}

export async function getUnapprovedEvents(){
  return await axiosInstance.get(`/events/getUnapprovedEvents`);
}
export async function approveEvent(eventId){
  return await axiosInstance.get(`/events/approve/${eventId}`);
}
export async function rejectEvent(eventId){
  return await axiosInstance.get(`/events/reject/${eventId}`);
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
