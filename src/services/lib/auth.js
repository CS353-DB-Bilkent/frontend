import axiosInstance from '../axiosInterceptor';

export function loginUser(email, password) {
  return axiosInstance.post('/auth/login', {
    email: email,
    password: password,
  });
}

export function signUpUser(email, name, bilkentId, password) {
  return axiosInstance.post('/auth/signup', {
    email: email,
    name: name,
    bilkentId: bilkentId,
    password: password,
  });
}
