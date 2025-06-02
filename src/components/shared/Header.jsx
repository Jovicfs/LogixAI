import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';
import { auth } from '../../utils/api';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Slide,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImageIcon from '@mui/icons-material/Image';
import ChatIcon from '@mui/icons-material/Chat';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CloseIcon from '@mui/icons-material/Close';
import { Settings as SettingsIcon } from '@mui/icons-material';
import UserSettingsDialog from './UserSettingsDialog';
import logixaiLogo from '../../utils/brain-brainstorm-creative-svgrepo-com.svg';
import NavDropdownMenu from './NavDropdownMenu';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TuneIcon from '@mui/icons-material/Tune';
import CodeIcon from '@mui/icons-material/Code';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';

function Header({ onShowLogos, buttonText = "Meus Logos" }) {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

const features = [
  {
    title: 'Gerar Logo',
    path: '/create-logo',
    icon: <AutoAwesomeIcon fontSize="small" /> // ok
  },
  {
    title: 'Gerar Post',
    path: '/post-generator',
    icon: <RocketLaunchIcon fontSize="small" /> // bom para ideias ou lançamento de conteúdo
  },
  {
    title: 'Gerar Imagem',
    path: '/create-image',
    icon: <ImageIcon fontSize="small" />
  },
  {
    title: 'Chat com IA',
    path: '/ai-chat',
    icon: <ChatIcon fontSize="small" />
  },
  {
    title: 'Remover Fundo',
    path: '/remove-background',
    icon: <AutoFixHighIcon fontSize="small" /> // melhor que repetir o ícone de imagem
  },
  {
    title: 'Melhorar Imagem',
    path: '/image-enhancer',
    icon: <TuneIcon fontSize="small" /> // representa ajustes e melhorias
  },
  {
    title: 'Gerar Código',
    path: '/code-generator',
    icon: <CodeIcon fontSize="small" />
  },
  {
    title: 'Gerar Música',
    path: '/music-generator',
    icon: <MusicNoteIcon fontSize="small" />
  },
  {
    title: 'Gerar Vídeo',
    path: '/video-generator',
    icon: <MovieCreationIcon fontSize="small" />
  },
  {
    title: 'Premium',
    path: '/pricing',
    icon: <MonetizationOnIcon fontSize="small" />
  }
];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = async () => {
    try {
      await auth.logout();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Modern gradient logo
  const Logo = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img 
        src={logixaiLogo} 
        alt="LogixAI Logo" 
        style={{ 
          height: '40px', 
          marginRight: '8px'
        }} 
      />
      <Typography
        variant="h5"
        noWrap
        component={Link}
        to="/"
        sx={{
          fontWeight: 900,
          letterSpacing: 1,
          background: 'linear-gradient(90deg, #00F5FF, #8A2BE2, #FF00FF, #FF1493)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'pulseText 10s infinite linear',
          color: theme.palette.primary.contrastText,
          textDecoration: 'none',
          fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        LogixAI 
      </Typography>
    </Box>
  );

  // Navigation links for desktop
const NavLinks = (
  <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', marginLeft: 2 }}>
    <NavDropdownMenu
      title="Ferramentas de IA"
      items={features}
      sx={{ marginRight: 2, color: theme.palette.text.primary }}
    />
  </Box>
);

  // Drawer for mobile navigation
  const DrawerMenu = (
    <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
      <Box sx={{ width: 260, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 1 }}>
          {Logo}
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {features.map(feature => (
            <ListItem
              button
              key={feature.path}
              component={Link}
              to={feature.path}
              selected={location.pathname === feature.path}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>{feature.icon}</ListItemIcon>
              <ListItemText primary={feature.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ px: 2, py: 2 }}>
          {authState.isAuthenticated ? (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ width: 28, height: 28, mr: 1 }}>
                  <AccountCircleIcon />
                </Avatar>
                <Typography variant="body2">{authState.username}</Typography>
              </Box>
              {onShowLogos && (
                <Button
                  onClick={() => {
                    handleDrawerToggle();
                    onShowLogos();
                  }}
                  fullWidth
                  sx={{ mb: 1 }}
                  variant="outlined"
                  color="primary"
                >
                  {buttonText}
                </Button>
              )}
              <Button
                onClick={handleLogout}
                fullWidth
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/sign-in"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{ mb: 1 }}
                variant="outlined"
                color="primary"
                onClick={handleDrawerToggle}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/sign-up"
                fullWidth
                startIcon={<RocketLaunchIcon />}
                variant="contained"
                color="primary"
                onClick={handleDrawerToggle}
              >
                Começar Agora
              </Button>


            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );

  // User menu for desktop
  const UserMenu = (
    <>
      <Tooltip title={authState.username || 'Conta'}>
        <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled>
          <AccountCircleIcon sx={{ mr: 1 }} />
          {authState.username}
        </MenuItem>
        {onShowLogos && (
          <MenuItem
            onClick={() => {
              handleClose();
              onShowLogos();
            }}
          >
            <AutoAwesomeIcon sx={{ mr: 1 }} />
            {buttonText}
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          handleClose();
          setSettingsOpen(true);
        }}>
          <SettingsIcon sx={{ mr: 1 }} />
          Configurações
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Sair
        </MenuItem>
      </Menu>

      <UserSettingsDialog 
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUser={authState}
      />
    </>
  );

  return (
    <Slide appear={false} direction="down" in>
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 2 } }}>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {Logo}

          {/* Desktop navigation */}
          {!isMobile && NavLinks}

          <Box sx={{ flexGrow: 1 }} />

          {/* Auth buttons */}
          {authState.isAuthenticated ? (
            !isMobile ? (
              UserMenu
            ) : null
          ) : (
            !isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/sign-in"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/sign-up"
                  startIcon={<RocketLaunchIcon />}
                  variant="contained"
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  Começar Agora
                </Button>
              </Box>
            )
          )}
        </Toolbar>
        {DrawerMenu}
      </AppBar>
    </Slide>
  );
}

export default Header;
