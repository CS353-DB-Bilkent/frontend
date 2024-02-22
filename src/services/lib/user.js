import axiosInstance from '../axiosInterceptor';

export function searchUsers(query) {
  return axiosInstance.get('/user/search?q=' + query);
}

export async function getUsersBySemesterId(semesterId) {
  return await axiosInstance.get(`/user/by-semester/${semesterId}`);
}
