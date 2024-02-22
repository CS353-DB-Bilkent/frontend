import { Backdrop, CircularProgress } from '@mui/material';
import { useLoadingStore } from '../../stores/Loading';

export default function Loading() {
  const isLoading = useLoadingStore((s) => s.isLoading);

  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
