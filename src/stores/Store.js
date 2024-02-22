import axiosInstance, { setAuthToken } from '../services/axiosInterceptor';
import { create } from 'zustand';

const localStorageAccessToken = localStorage.getItem('accessToken') ?? '';

setAuthToken(localStorageAccessToken ?? '');

export const useAuthStore = create((set) => ({
  user: null,
  login: async (loginData) => {
    try {
      const res = await axiosInstance.post('/auth/login', {
        email: loginData.email,
        password: loginData.password,
      });

      console.log(res);

      const accessToken = res.data?.data?.accessToken;
      if (!accessToken) throw new Error('accessToken is not available.');

      localStorage.setItem('accessToken', accessToken);
      setAuthToken(accessToken);

      const userResponse = await axiosInstance.get('/user/me');
      const user = userResponse.data?.data;

      if (!user) throw new Error('User is not available :(.');

      set((state) => ({ ...state, user }));
    } catch (err) {
      console.warn(err);
      set((state) => ({ ...state, user: undefined }));
      throw err;
    }
  },
  logout: () => {
    try {
      axiosInstance.post('/auth/logout');
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem('accessToken');
    setAuthToken('');
    set((state) => ({ ...state, user: undefined }));
  },
  setUser: (user) => {
    set((state) => ({ ...state, user }));
  },
}));
