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
