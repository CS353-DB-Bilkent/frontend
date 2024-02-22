import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInterceptor';
import { useAuthStore } from '../../stores/Store';
import Loading from '../loading/Loading';
import { notifyError } from '../../utility/notify';

export function UserLoader({ children }) {
  let location = useLocation();
  let user = useAuthStore((s) => s.user);
  let setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const { isLoading, error } = useQuery(
    ['user'],
    async () => {
      let user = null;

      try {
        const userResponse = await axiosInstance.get('/user/me');
        user = userResponse.data?.data;
        setUser(user);
      } catch (error) {
        if (location.pathname !== '/') {
          notifyError(error.response.data);
          navigate('/login');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }

      return user;
    },
    { retry: 1 }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
