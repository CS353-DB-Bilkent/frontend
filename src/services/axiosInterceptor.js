import ERROR_CODES from '../constants/errorCodes';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_API_URL || `http://ticket-seller.eu-central-1.elasticbeanstalk.com/` || `http://localhost:8080`,
});

const successHandler = (response) => {
  return response;
};

function errorHandler(error) {
  if (error.response?.status === ERROR_CODES.JWT) {
    localStorage.removeItem('accessToken');
    window.location.reload();

    return Promise.reject('Not authorized.');
  }

  if (error.response?.status === ERROR_CODES.REQUIRED_ROLES_NOT_PRESENT) {
    return Promise.reject('Not found.');
  }

  return Promise.reject(error);
}

axios.interceptors.response.use(successHandler, errorHandler);

export function setAuthToken(token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosInstance;
