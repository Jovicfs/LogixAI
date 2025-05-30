import React, { useState } from 'react';
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
  Tab
} from '@mui/material';

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurações da Conta</DialogTitle>
      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Perfil" />
          <Tab label="Senha" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {activeTab === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome de usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Senha atual"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Nova senha"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Confirmar nova senha"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
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
  );
}

export default UserSettingsDialog;
