import axiosInstance from '../axiosInterceptor';

export function withdraw(amount) {
  return axiosInstance.post(`/transaction/withdraw/${amount}`);
}

export function deposit(amount) {
  return axiosInstance.post(`/transaction/deposit/${amount}`);
}
