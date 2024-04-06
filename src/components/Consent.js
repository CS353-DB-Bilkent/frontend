import { useState, useEffect } from 'react';
import { Paper, Box, Typography, Fade, Stack, Button } from '@mui/material';
import TrapFocus from '@mui/material/Unstable_TrapFocus';

export default function Consent() {
  const [bannerOpen, setBannerOpen] = useState(false);

  const closeBanner = () => {
    setBannerOpen(false);
  };

  useEffect(() => {
    const data = window.localStorage.getItem('COOKIE_CONSENT');
    if (data !== null) {
      setBannerOpen(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('COOKIE_CONSENT', bannerOpen);
  }, [bannerOpen]);

  return (
    <TrapFocus>
      <Fade appear={false} in={bannerOpen}>
        <Paper
          role="dialog"
          aria-modal="false"
          aria-label="Cookie banner"
          square
          variant="outlined"
          tabIndex={-1}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            m: 0,
            p: 2,
            borderWidth: 0,
            borderTopWidth: 1,
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
            <Box
              sx={{
                flexShrink: 1,
                alignSelf: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <Typography fontWeight="bold">This website uses cookies</Typography>
              <Typography variant="body2">By continuing to use this website, you consent to the use of cookies.</Typography>
            </Box>
            <Stack
              gap={2}
              direction={{
                xs: 'row-reverse',
                sm: 'row',
              }}
              sx={{
                flexShrink: 0,
                alignSelf: { xs: 'flex-end', sm: 'center' },
              }}
            >
              <Button size="small" onClick={closeBanner} variant="contained">
                OK
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Fade>
    </TrapFocus>
  );
}
