import { useState, useRef } from 'react';
import { Grid, Paper, Button, Typography, CssBaseline, TextField, Select, MenuItem, InputLabel, FormControl, Divider } from '@mui/material';
import { sendMessage, getContacts } from '../services/lib/message';
import { notify, notifyError } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';
import { useLoadingStore } from '../stores/Loading';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/loading/Loading';

export default function ContactPage() {
  const setLoading = useLoadingStore((s) => s.setLoading);

  const [contactId, setContactId] = useState('');
  let titleRef = useRef(null);
  let messageRef = useRef(null);

  const {
    loading,
    error,
    data: contactIds,
  } = useQuery({
    queryKey: ['contactIds'],
    queryFn: async () => getContacts(),
  });

  const handleContactId = (event) => {
    event.preventDefault();
    setContactId(event.target.value);
  };

  const send = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const contactId = formData.get('sendDest');
    const title = formData.get('title');
    const message = formData.get('message');

    try {
      setLoading(true);
      await sendMessage(contactId, title, message);
      notify('Your message has been sent!', NOTIFY_TYPES.SUCCESS);
      setLoading(false);
    } catch (error) {
      notifyError(error.response.data);
    }
    setLoading(false);
    setContactId('');
    titleRef.current.value = '';
    messageRef.current.value = '';
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <h1>{error}</h1>;
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
        Inform Us About Technical Issues
      </Typography>
      <Divider style={{ width: '70vw', background: 'primary.dark' }}></Divider>
      <Paper sx={{ borderRadius: '16px', mt: 3, p: 4, width: '80vw' }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '40vh', minHeight: '500px' }}>
          <Typography sx={{ color: 'red', mb: 5, textAlign: 'center' }} fontSize={'16px'}>
            Please make sure to complete these steps before sending a message:{' '}
            <b>
              <br /> 1. Read the manual. <br /> 2. Check announcements to see if your question has been answered.
            </b>
            <br /> If you still need to be answered, please contact us using this page.
          </Typography>
          <Grid container component="form" onSubmit={send} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Grid item>
              <FormControl sx={{ width: '15vw', ml: 5 }} size="small">
                <InputLabel id="contactLabel">Send To</InputLabel>
                <Select required name="sendDest" labelId="selectContact" label={contactId} value={contactId} onChange={handleContactId}>
                  {contactIds?.data.data.map((contactid) => (
                    <MenuItem key={contactid.id} value={contactid.id}>
                      {contactid.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <TextField sx={{ width: '30vw', ml: 5, mt: 5 }} required inputRef={titleRef} name="title" id="title" size="small" label="Title" variant="outlined"></TextField>

            <TextField
              sx={{ width: '60vw', ml: 5, mt: 5 }}
              required
              inputRef={messageRef}
              multiline
              rows={5}
              fullWidth
              name="message"
              id="message"
              size="small"
              label="Message"
              variant="outlined"
            ></TextField>
            <Button sx={{ mt: 3, ml: 5 }} type="submit" variant="contained">
              Send Message
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
