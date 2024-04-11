import { useAuthStore } from '../stores/Store';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Grid, Typography, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { useNavigate } from 'react-router-dom';
import { useLoadingStore } from '../stores/Loading';
import { deposit, withdraw } from '../services/lib/wallet';

export default function Wallet() {
  const navigate = useNavigate();
  const setLoading = useLoadingStore((s) => s.setLoading);
  const [amount, setAmount] = useState([]);

  const user = useAuthStore((s) => s.user);

  const handleSubmitWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await withdraw(amount);
      useAuthStore.getState().setUser({ ...user, balance: user.balance - amount });

      notify('Withdrawal successful', NOTIFY_TYPES.SUCCESS);
      navigate('/');
    } catch (error) {
      notifyError('Withdrawal failed', NOTIFY_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deposit(amount);
      useAuthStore.getState().setUser({ ...user, balance: user.balance + amount });

      notify('Deposit successful', NOTIFY_TYPES.SUCCESS);
      navigate('/');
    } catch (error) {
      notifyError('Deposit failed', NOTIFY_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CssBaseline />
      <Grid container rowSpacing={4} component={Paper} sx={{ width: '60vh', borderRadius: '16px', mt: 30 }}>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: 'secondary.dark' }} fontSize={'20px'} fontWeight={'bold'}>
            Current Balance: {user.balance}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            p={2}
          >
            <TextField
              id="outlined-number"
              label="Amount"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmitWithdraw} disabled={amount <= 0 || amount > user.balance}>
                Withdraw
              </Button>
              <Button variant="contained" onClick={handleSubmitDeposit} disabled={amount <= 0}>
                Deposit
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
