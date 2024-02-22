import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Router } from './router/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import Loading from './components/loading/Loading';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import Consent from './components/Consent';

const theme = createTheme({
  palette: {
    background: {
      default: '#F2F2F2',
    },
    primary: {
      main: '#00315C', //Prussian blue
      light: '#0068C3', // Celestial Blue
      green: '#4FB286', // Mint
    },
    secondary: {
      dark: '#1C2227', // Eerie black
      main: '#777D85', // State gray
      light: '#F2F2F2', // Isabelline
    },
  },
  typography: {
    fontFamily: ['poppins', 'dm-sans'].join(','),
  },
});

const queryClient = new QueryClient();

function App() {
  moment.updateLocale('en', {
    week: {
      dow: 1,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme}>
          <ReactNotifications />
          <Loading />
          <Router />
          <Consent />
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
