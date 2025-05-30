// components/EnhanceImage.jsx
"use client";

import React, { useState, useRef } from "react";
import { 
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Header from './shared/Header';
import withProtectedRoute from "./shared/ProtectedRoute";

function EnhanceImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const inputRef = useRef(null);

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Valida o do tamanho do arquivo
    if (file.size > 5 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo: 5MB");
      return;
    }

    setLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      // Mostra imagem original
      const originalUrl = URL.createObjectURL(file);
      setOriginalImage(originalUrl);

      // Prepara formData para envio
      const formData = new FormData();
      formData.append('image', file);

      // Envia para o backend
      const response = await fetch('http://localhost:5000/enhance/upscale', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar imagem');
      }

      // Converte resposta para blob e cria URL
      const blob = await response.blob();
      const enhancedUrl = URL.createObjectURL(blob);
      setEnhancedImage(enhancedUrl);

    } catch (err) {
      console.error("Error processing image:", err);
      setError("Erro ao processar imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async () => {
    if (!enhancedImage) return;

    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'enhanced-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <Header />
      
      <Box className="container mx-auto px-4 pt-20">
        <Paper className="p-8 rounded-xl shadow-lg">
          <Typography variant="h4" className="text-center mb-6">
            Melhorar Qualidade de Imagem
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <Box className="flex flex-col items-center gap-4">
            <Button
              variant="contained"
              component="label"
              disabled={loading}
            >
              Selecionar Imagem
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </Button>

            {loading && (
              <Box className="flex flex-col items-center gap-2">
                <CircularProgress />
                <Typography>Processando imagem...</Typography>
              </Box>
            )}

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {originalImage && (
                <Box>
                  <Typography variant="h6" className="mb-2">Original:</Typography>
                  <img src={originalImage} alt="Original" className="rounded-lg shadow-md w-full" />
                </Box>
              )}

              {enhancedImage && (
                <Box position="relative">
                  <Typography variant="h6" className="mb-2">Aprimorada:</Typography>
                  <img src={enhancedImage} alt="Enhanced" className="rounded-lg shadow-md w-full" />
                  <Tooltip title="Baixar imagem">
                    <IconButton
                      onClick={handleDownload}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default withProtectedRoute(EnhanceImage);

