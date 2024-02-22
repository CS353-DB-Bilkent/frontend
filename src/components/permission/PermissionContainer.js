import { useNavigate } from 'react-router-dom';
import NOTIFY_TYPES from '../../constants/notifyTypes';
import { useCheckPermission } from '../../hooks/useCheckPermission';
import { notify } from '../../utility/notify';

export function PermissionContainer({ children, roles }) {
  const navigate = useNavigate();
  const hasPermission = useCheckPermission(roles);

  if (!hasPermission) {
    notify('You cannot view this page!', NOTIFY_TYPES.ERROR);
    return navigate("/");
  }

  return children;
}
