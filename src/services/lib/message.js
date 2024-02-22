import axiosInstance from '../axiosInterceptor';

export async function sendMessage(contactId, title, message) {
  return await axiosInstance.post(`/custom-message/send`, {
    contactId,
    title,
    message,
  });
}

export function getContacts() {
  return axiosInstance.get('/custom-message/contacts');
}
