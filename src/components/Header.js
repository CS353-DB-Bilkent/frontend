import { AirplaneTicket } from '@mui/icons-material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ROLES from '../constants/roles';
import { useAuthStore } from '../stores/Store';

const PROFILE_SETTINGS = ['Profile', 'Logout'];
const PROFILE_SETTINGS_PATHS = ['/profile', '/logout'];

const USER_ROLE_TO_PAGES = {
  [ROLES.SUPER_ADMIN]: ['Create Admin'],
  [ROLES.ADMIN]: ['Events', 'Event Approvals'],
  [ROLES.EVENT_ORGANIZER]: ['Events', 'Dashboard', 'Wallet'],
  [ROLES.USER]: ['Events', 'Wallet'],
  [ROLES.GUEST]: ['Events'],
};

const USER_ROLE_TO_PAGES_PATHS = {
  [ROLES.SUPER_ADMIN]: ['/super-admin/create-admin'],
  [ROLES.ADMIN]: ['/main', '/admin/event-approvals'],
  [ROLES.EVENT_ORGANIZER]: ['/main', '/event-organizer/dashboard', '/wallet'],
  [ROLES.USER]: ['/main', '/wallet'],
  [ROLES.GUEST]: ['/main'],
};

function Header() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const currentRole = user ? user.role : ROLES.GUEST;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const pages = USER_ROLE_TO_PAGES[currentRole];
  const pagesPaths = USER_ROLE_TO_PAGES_PATHS[currentRole];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseUserMenuAndNavigateToLogin = () => {
    setAnchorElUser(null);
    navigate('/login');
  };
  function stringToColor(string) {
    let hash = 0;
    let i;
      for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
  
    return color;
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: name.length > 1 ? `${name[0]}${name[1]}` : `${name[0]}`,
    };
  }

  return (
    <AppBar sx={{ bgcolor: 'primary.main' }} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AirplaneTicket sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'roboto',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TICKETBASE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} component={Link} to={{ pathname: pagesPaths[index] }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'poppins',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button component={Link} to={{ pathname: pagesPaths[index] }} key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'secondary.light', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>
          <Typography sx={{paddingRight: '20px'}}>Current Balance: {user.balance}</Typography>


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar(user.name)} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user
                ? PROFILE_SETTINGS.map((setting, index) => (
                    <MenuItem component={Link} to={{ pathname: PROFILE_SETTINGS_PATHS[index] }} key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))
                : ['Log In'].map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenuAndNavigateToLogin}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
