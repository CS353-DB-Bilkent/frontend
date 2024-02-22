import * as React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ color: 'primary.light' }} fontSize={'120px'} fontWeight={'bold'}>
          404
        </Typography>
        <Typography sx={{ color: 'primary.main', display: { xs: 'none', sm: 'flex' } }} fontSize={'28px'} fontWeight={'bold'}>
          Could not find what you are looking for...
        </Typography>
        <Typography sx={{ color: 'primary.main', display: { xs: 'none', sm: 'flex' } }} fontSize={'28px'} fontWeight={'bold'}>
          Here is a cat pic.
        </Typography>
      </Grid>

      <Button variant="contained" size="large" sx={{ mt: 3, bgcolor: 'primary.light' }} onClick={() => navigate('/')}>
        Return home
      </Button>
    </Grid>
  );
}
