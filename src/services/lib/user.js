import axiosInstance from '../axiosInterceptor';

export function searchUsers(query) {
  return axiosInstance.get('/user/search?q=' + query);
}

export async function updateUser(userId,formData){
  return await axiosInstance.post(`/user/${userId}/updateInfo`, formData);
}
