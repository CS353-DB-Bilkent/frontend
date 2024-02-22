import { Grid, Typography, Paper, Box, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { notify, notifyError } from '../utility/notify';
import { createAdmin } from '../services/lib/superAdmin';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { useLoadingStore } from '../stores/Loading';

export default function CreateAdmin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [department, setDepartment] = useState('');

  const setLoading = useLoadingStore((s) => s.setLoading);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await createAdmin(id, email, name, department);
      notify('Admin is successfully created!', NOTIFY_TYPES.SUCCESS);
    } catch (err) {
      notifyError(err.response.data);
    }
    setLoading(false);
    setName('');
    setEmail('');
    setId('');
    setDepartment('');
  };

  const handleChange = (event) => {
    setDepartment(event.target.value);
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 5,
        width: '100vw',
        height: '90vh',
      }}
    >
      <CssBaseline />
      <Grid item sx={{ p: 8, display: 'flex', flexDirection: 'column', borderRadius: '16px', width: '95vw', height: '80vh' }} component={Paper}>
        <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>Admin Creation Panel</Typography>

        <Divider style={{ width: '100%' }} />
        <TextField sx={{ marginY: '35px', marginX: '20px', width: '250px' }} label="Name" required value={name} onChange={(e) => setName(e.target.value)}></TextField>
        <Box direction="column" sx={{ marginX: '20px' }}>
          <TextField sx={{ width: '250px' }} label="Bilkent Mail" required value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
        </Box>

        <TextField sx={{ width: '250px', marginX: '20px', marginY: '35px' }} label="Bilkent ID" required value={id} onChange={(e) => setId(e.target.value)}></TextField>
        <TextField sx={{ width: '250px', marginX: '20px' }} label="Department" select required value={department} onChange={handleChange} fullWidth>
          <MenuItem value="CS">Computer Science</MenuItem>
          <MenuItem value="ME">Mechanical Engineering</MenuItem>
          <MenuItem value="EE">Electric Electronic Engineering</MenuItem>
          <MenuItem value="IE">Industrial Engineering</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" onClick={handleSubmit} sx={{ marginY: '35px', marginX: '20px', bgcolor: 'primary.main', width: '200px' }}>
          Create Admin
        </Button>
      </Grid>
    </Grid>
  );
}
