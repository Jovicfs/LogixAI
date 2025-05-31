import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { Brightness4, Brightness7, Language } from '@mui/icons-material';
import { DarkModeContext } from '../../App';

const LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
];

function UserSettingsDialog({ open, onClose, currentUser }) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const [language, setLanguage] = useState(
    localStorage.getItem('logixai_language') || 'pt'
  );

  // Atualiza o tema do MUI dinamicamente
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        ...(darkMode
          ? {
              background: {
                default: '#18181b',
                paper: '#23232a'
              },
              text: {
                primary: '#f3f4f6',
                secondary: '#a1a1aa'
              },
              primary: { main: '#3b82f6' },
              secondary: { main: '#6366f1' }
            }
          : {
              background: {
                default: '#f3f4f6',
                paper: '#fff'
              },
              text: {
                primary: '#18181b',
                secondary: '#52525b'
              },
              primary: { main: '#2563eb' },
              secondary: { main: '#6366f1' }
            })
      }
    }), [darkMode]
  );

  // Aplica/remover classe dark no html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (activeTab === 0) {
      if (!formData.username || !formData.email) {
        setError('Todos os campos são obrigatórios');
        return false;
      }
    } else if (activeTab === 1) {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        setError('Todos os campos são obrigatórios');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return false;
      }
      if (formData.newPassword.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (activeTab === 2) {
      // Preferências não precisam de submit backend
      setSuccess('Preferências salvas!');
      setError('');
      setTimeout(() => setSuccess(''), 1200);
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: activeTab === 0 ? 'profile' : 'password',
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          onClose();
          if (activeTab === 0) {
            window.location.reload(); // Reload to update username in header
          }
        }, 1500);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao atualizar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Preferências handlers
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem('logixai_language', e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}>
          Configurações da Conta
        </DialogTitle>
        <DialogContent sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary
        }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
            variant="fullWidth"
          >
            <Tab label="Perfil" />
            <Tab label="Senha" />
            <Tab label="Preferências" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nome de usuário"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    '& input': { color: theme.palette.text.primary }
                  }
                }}
                InputLabelProps={{
                  sx: { color: theme.palette.text.secondary }
                }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    '& input': { color: theme.palette.text.primary }
                  }
                }}
                InputLabelProps={{
                  sx: { color: theme.palette.text.secondary }
                }}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Senha atual"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    '& input': { color: theme.palette.text.primary }
                  }
                }}
                InputLabelProps={{
                  sx: { color: theme.palette.text.secondary }
                }}
              />
              <TextField
                label="Nova senha"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    '& input': { color: theme.palette.text.primary }
                  }
                }}
                InputLabelProps={{
                  sx: { color: theme.palette.text.secondary }
                }}
              />
              <TextField
                label="Confirmar nova senha"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    '& input': { color: theme.palette.text.primary }
                  }
                }}
                InputLabelProps={{
                  sx: { color: theme.palette.text.secondary }
                }}
              />
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Aparência
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                    color="primary"
                    icon={<Brightness7 />}
                    checkedIcon={<Brightness4 />}
                  />
                }
                label={darkMode ? "Modo Escuro" : "Modo Claro"}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Idioma
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="language-select-label">
                  <Language sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                  Idioma
                </InputLabel>
                <Select
                  labelId="language-select-label"
                  value={language}
                  label="Idioma"
                  onChange={handleLanguageChange}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    '.MuiSelect-icon': { color: theme.palette.text.secondary }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary
                      }
                    }
                  }}
                >
                  {LANGUAGES.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Notificações
              </Typography>
              <FormControlLabel
                control={<Switch color="primary" checked disabled />}
                label="Receber notificações por email (em breve)"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default UserSettingsDialog;
