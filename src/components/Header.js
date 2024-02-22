import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import '@fontsource/poppins/300.css';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '../stores/Store';
import ROLES from '../constants/roles';
import { Dialog, DialogContent, InputBase, Paper, alpha, styled, Grid, List, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchUsers } from '../services/lib/user';
import { notify } from '../utility/notify';
import NOTIFY_TYPES from '../constants/notifyTypes';

const debounce = (func, wait) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const USER_ROLE_TO_PAGES = {
  [ROLES.SUPER_ADMIN]: ['Create Admin'],
  [ROLES.ADMIN]: ['Dashboard', 'Announcements', 'Contact'],
  [ROLES.EVENT_OWNER]: ['Dashboard', 'Announcements', 'Contact'],
  [ROLES.USER]: ['Dashboard', 'Announcements', 'Contact'],
};
const USER_ROLE_TO_PAGES_PATHS = {
  [ROLES.SUPER_ADMIN]: ['/super-admin/create-admin', '/contact'],
  [ROLES.ADMIN]: ['/dashboard', '/announcements', '/contact'],
  [ROLES.EVENT_OWNER]: ['/dashboard', '/announcements', '/contact'],
  [ROLES.USER]: ['/dashboard', '/announcements', '/contact'],
};

function Header() {
  const user = useAuthStore((s) => s.user);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchUserResults, setSearchUserResults] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [userRes, setUserRes] = React.useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const fetchNameResults = async (q) => {
    return notify('Not implemented yet!', NOTIFY_TYPES.WARNING);

    // eslint-disable-next-line no-unreachable
    try {
      if (q !== '' && q.length > 3) {
        const res = await searchUsers(q);
        setSearchUserResults(res?.data?.data);
      } else if (q.length > 0 && q.length <= 3) {
        notify('Please type more than 3 characters', NOTIFY_TYPES.WARNING);
      }
    } catch (e) {
      notify(e.data?.data?.message, NOTIFY_TYPES.ERROR);
    }
  };

  const handleSearch = React.useMemo(() => debounce(fetchNameResults, 1000), []);

  const handleSearchInput = (q) => {
    if (q === '' || q === undefined) setSearchUserResults([]);
  };

  const pages = USER_ROLE_TO_PAGES[user.role];
  const pagesPaths = USER_ROLE_TO_PAGES_PATHS[user.role];
  const settings = ['Change Password', 'Logout'];
  const settingsPaths = ['/change-password', '/logout'];

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

  const showDetailedInfo = (e, res) => {
    e.preventDefault();
    setUserRes(res);
    handleOpen();
  };

  const searchSx = {
    width: '20vw',
    textTransform: 'none',
    bgcolor: 'white',
    border: 'none',
    borderRadius: '4px',
    mb: '5px',
    '&:hover': { backgroundColor: 'secondary.light', border: 'none' },
    zIndex: '2',
  };
  return (
    <AppBar sx={{ bgcolor: 'primary.main' }} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 5 }}>
            {pages.map((page, index) => (
              <Button component={Link} to={{ pathname: pagesPaths[index] }} key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'secondary.light', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ mr: '2%' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={(event) => {
                  event.preventDefault();
                  handleSearchInput(event.target.value);
                  handleSearch(event.target.value);
                }}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box position={'absolute'}>
              <List sx={{ maxHeight: '250px', position: 'relative', overflow: 'auto', mt: 0 }}>
                {searchUserResults.map((searchUser) => (
                  <Button component={Paper} variant="outlined" elevation={6} sx={searchSx} key={searchUser.bilkentId} onClick={(e, res = searchUser) => showDetailedInfo(e, res)}>
                    <Typography fontSize="16px" color={'secondary.dark'}>
                      {searchUser.name}
                    </Typography>
                  </Button>
                ))}
              </List>
              <Dialog fullWidth maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <DialogTitle id="dialog-title" sx={{ color: 'primary.dark', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontSize={'26px'} fontWeight="bold">
                    User Information
                  </Typography>
                  <IconButton onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                    <Box>
                      <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography sx={{ color: 'secondary.main', mr: '5px' }} fontSize={'18px'} mt={2}>
                          Student Name:
                        </Typography>
                        <Typography sx={{ color: 'secondary.dark' }} fontSize={'18px'} fontWeight={'bold'} mt={2}>
                          {userRes?.name}
                        </Typography>
                      </Grid>
                      <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography sx={{ color: 'secondary.main', mr: '5px' }} fontSize={'18px'} mt={2}>
                          Bilkent ID:
                        </Typography>
                        <Typography sx={{ color: 'secondary.dark' }} fontSize={'18px'} fontWeight={'bold'} mt={2}>
                          {userRes?.bilkentId}
                        </Typography>
                      </Grid>
                      <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography sx={{ color: 'secondary.main', mr: '5px' }} fontSize={'18px'} mt={2}>
                          Email:
                        </Typography>
                        <Typography sx={{ color: 'secondary.dark' }} fontSize={'18px'} fontWeight={'bold'} mt={2}>
                          {userRes?.email}
                        </Typography>
                      </Grid>
                    </Box>
                    <Box>
                      <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography sx={{ color: 'secondary.main', mr: '5px' }} fontSize={'18px'} mt={2}>
                          Department:
                        </Typography>
                        <Typography sx={{ color: 'secondary.dark' }} fontSize={'18px'} fontWeight={'bold'} mt={2}>
                          {userRes?.department}
                        </Typography>
                      </Grid>
                      <Grid sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Typography sx={{ color: 'secondary.main', mr: '5px' }} fontSize={'18px'} mt={2}>
                          Role:
                        </Typography>
                        <Typography sx={{ color: 'secondary.dark' }} fontSize={'18px'} fontWeight={'bold'} mt={2}>
                          {userRes?.role === 'SUPER_ADMIN' ? userRes?.role.slice(0, 5) + ' ' + userRes?.role.slice(6) : userRes?.role}
                        </Typography>
                      </Grid>
                    </Box>
                  </Box>
                </DialogContent>
              </Dialog>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <PersonIcon sx={{ color: 'secondary.light' }} />
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
              {settings.map((setting, index) => (
                <MenuItem component={Link} to={{ pathname: settingsPaths[index] }} key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography fontSize={'14px'} sx={{ ml: '0.5%' }} fontStyle={'bold'}>
            {user.name}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
