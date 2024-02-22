import axiosInstance from '../axiosInterceptor';

export function createAdmin(email, name) {
  return axiosInstance.post('/super-admin/create-admin', {
    email: email,
    name: name,
  });
}
