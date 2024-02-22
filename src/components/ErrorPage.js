import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  const [countDown, setCountDown] = useState(5);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/login');
      window.location.reload();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown((current) => current - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countDown]);

  return (
    <Grid
      container
      sx={{
        mt: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 5 }}>
        <Typography sx={{ color: 'primary.main', display: { xs: 'none', sm: 'flex' } }} fontSize={'40px'} fontWeight={'bold'}>
          Something went wrong...
        </Typography>
        <Typography sx={{ color: 'primary.main', display: { xs: 'none', sm: 'flex' } }} fontSize={'40px'} fontWeight={'bold'}>
          Redirecting in {countDown} seconds
        </Typography>
      </Grid>
    </Grid>
  );
}
