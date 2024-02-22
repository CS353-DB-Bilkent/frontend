import { useAuthStore } from '../stores/Store';

export function useCheckPermission(roles) {
  const user = useAuthStore((s) => s.user);

  return roles.includes(user.role);
}
