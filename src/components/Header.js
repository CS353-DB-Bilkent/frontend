import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ROLES from '../constants/roles';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/Store';
import { AirplaneTicket } from '@mui/icons-material';

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
  [ROLES.ADMIN]: ['/main', '/event-approvals'],
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
              fontFamily: 'poppins',
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

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
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
