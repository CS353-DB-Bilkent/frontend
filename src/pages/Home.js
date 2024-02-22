import React from 'react';
import ROLES from '../constants/roles';
import { useAuthStore } from '../stores/Store';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavigator() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  React.useEffect(() => {
    if (user.role === ROLES.SUPER_ADMIN) return navigate('/super-admin/create-admin');

    return navigate(`/${user.role.toLowerCase().replace(/_/g, '-')}/dashboard`);
  });
}
