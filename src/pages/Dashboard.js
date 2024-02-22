import { Grid, Paper, Button, Typography, CssBaseline, Divider } from '@mui/material';
import { useLoadingStore } from '../stores/Loading';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/loading/Loading';
import { useAuthStore } from '../stores/Store';

export default function Dashboard() {
  const setLoading = useLoadingStore((s) => s.setLoading);
  const user = useAuthStore((s) => s.user);

  const {
    loading,
    error,
    data: me,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      /* Fill in with a function... */
      return user;
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.log(error);
    return <h1>{JSON.stringify(error)}</h1>;
  }

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        p: 5,
        m: 5,
      }}
    >
      <CssBaseline />
      <Typography sx={{ color: 'primary.dark' }} fontSize={'28px'} fontWeight={'bold'}>
        Selamlar
      </Typography>
      <Divider style={{ width: '70vw', background: 'primary.dark' }}></Divider>
      <Paper sx={{ borderRadius: '16px', mt: 3, p: 4, width: '80vw' }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '40vh', minHeight: '500px' }}>{JSON.stringify(me)}</Grid>
      </Paper>
    </Grid>
  );
}
