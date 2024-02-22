import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/Store';
import { useLoadingStore } from '../stores/Loading';

export default function Logout() {
  const logout = useAuthStore((s) => s.logout);
  const setLoading = useLoadingStore((s) => s.setLoading);

  const { isLoading, error } = useQuery(
    [],
    async () => {
      try {
        setLoading(true);
        await logout();
      } catch (_) {}
      setLoading(false);
      return '';
    },
    { retry: 1 }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/login" />;
}
