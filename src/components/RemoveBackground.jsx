// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Fade,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from './shared/Header';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { AutoModel, AutoProcessor, env, RawImage } from '@xenova/transformers';

env.allowLocalModels = false;
env.backends.onnx.wasm.proxy = true;

const EXAMPLE_URL = 'https://images.pexels.com/photos/5965592/pexels-photo-5965592.jpeg?auto=compress&cs=tinysrgb&w=1024';

function RemoveBackground() {
  const theme = useTheme();
  const [status, setStatus] = useState('Iniciando...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [processing, setProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const modelRef = useRef(null);
  const processorRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        setStatus('Carregando modelo de IA...');

        const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
          config: { model_type: 'custom' },
        });
        const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
          config: {
            do_normalize: true,
            do_pad: false,
            do_rescale: true,
            do_resize: true,
            image_mean: [0.5, 0.5, 0.5],
            feature_extractor_type: "ImageFeatureExtractor",
            image_std: [1, 1, 1],
            resample: 2,
            rescale_factor: 0.00392156862745098,
            size: { width: 1024, height: 1024 },
          }
        });

        modelRef.current = model;
        processorRef.current = processor;
        setStatus('Pronto para uso');
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar o modelo. Por favor, recarregue a página.');
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const handleExampleClick = async () => {
    setImageUrl(EXAMPLE_URL);
    await processImage(EXAMPLE_URL);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e2) => {
      const dataUrl = e2.target?.result?.toString() || '';
      setImageUrl(dataUrl);
      await processImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (url) => {
    if (!modelRef.current || !processorRef.current) {
      setError('Modelo não carregado');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setStatus('Processando imagem...');
      setResultUrl('');

      const image = await RawImage.fromURL(url);
      const { pixel_values } = await processorRef.current(image);
      const { output } = await modelRef.current({ input: pixel_values });
      const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image.toCanvas(), 0, 0);
      const pixelData = ctx.getImageData(0, 0, image.width, image.height);
      for (let i = 0; i < mask.data.length; ++i) {
        pixelData.data[4 * i + 3] = mask.data[i];
      }
      ctx.putImageData(pixelData, 0, 0);

      setResultUrl(canvas.toDataURL());
      setStatus('Processamento concluído!');
    } catch (err) {
      setError('Erro ao processar imagem');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.download = 'imagem-sem-fundo.png';
    link.href = resultUrl;
    link.click();
  };

  const handleClear = () => {
    setImageUrl('');
    setResultUrl('');
    setStatus('Pronto para uso');
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 2, sm: 4, md: 6 },
          pb: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Card
          sx={{
            p: { xs: 1, sm: 2, md: 4 },
            borderRadius: 3,
            boxShadow: theme.shadows[6],
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 80%, ${theme.palette.primary.light}10 100%)`,
            width: '100%',
            maxWidth: 900,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 2, sm: 3, md: 4 },
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
            }}
          >
            Remover Fundo de Imagem com IA
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: theme.palette.text.secondary, mb: { xs: 2, sm: 3 } }}
          >
            Faça upload de uma imagem ou use o exemplo para remover o fundo automaticamente.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontWeight: 500 }}>{error}</Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, sm: 3, md: 4 },
              alignItems: 'stretch',
              justifyContent: 'center',
              mb: { xs: 2, sm: 3 },
            }}
          >
            {/* Original Image */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minWidth: 0,
                height: { xs: 180, sm: 240, md: 340, lg: 360 },
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.background.default,
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.3s',
                mb: { xs: 2, md: 0 },
                p: 0,
              }}
            >
              {imageUrl && !processing ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Imagem original"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <Tooltip title="Remover imagem" placement="top">
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.error.main,
                        '&:hover': { bgcolor: theme.palette.error.light },
                      }}
                      onClick={handleClear}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : !imageUrl && !processing ? (
                <Box textAlign="center" width="100%">
                  <ImageIcon sx={{ fontSize: { xs: 36, sm: 48, md: 60 }, color: theme.palette.action.disabled }} />
                  <Typography color="textSecondary" sx={{ mt: 1, fontSize: { xs: 12, sm: 14 } }}>
                    Nenhuma imagem selecionada
                  </Typography>
                </Box>
              ) : processing ? (
                <Fade in={processing}>
                  <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                    <CircularProgress color="primary" />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
                      Processando...
                    </Typography>
                  </Box>
                </Fade>
              ) : null}
            </Paper>

            {/* Result Image */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minWidth: 0,
                height: { xs: 180, sm: 240, md: 340, lg: 360 },
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.background.default,
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.3s',
                mb: { xs: 2, md: 0 },
                p: 0,
              }}
            >
              {resultUrl && !processing ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={resultUrl}
                    alt="Resultado"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <Tooltip title="Baixar resultado" placement="top">
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.success.main,
                        '&:hover': { bgcolor: theme.palette.success.light },
                      }}
                      onClick={handleDownload}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : !resultUrl && !processing ? (
                <Box textAlign="center" width="100%">
                  <ImageIcon sx={{ fontSize: { xs: 36, sm: 48, md: 60 }, color: theme.palette.action.disabled }} />
                  <Typography color="textSecondary" sx={{ mt: 1, fontSize: { xs: 12, sm: 14 } }}>
                    Aguardando processamento
                  </Typography>
                </Box>
              ) : processing ? (
                <Fade in={processing}>
                  <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                    <CircularProgress color="primary" />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
                      Processando...
                    </Typography>
                  </Box>
                </Fade>
              ) : null}
            </Paper>
          </Box>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={2}>
            <Button
              variant="contained"
              startIcon={<ImageIcon />}
              onClick={handleExampleClick}
              disabled={loading || processing}
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.primary.contrastText,
                fontSize: { xs: 12, sm: 14, md: 16 },
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              Usar Exemplo
            </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              disabled={loading || processing}
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                color: theme.palette.primary.contrastText,
                fontSize: { xs: 12, sm: 14, md: 16 },
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              Upload Imagem
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </Button>
          </Box>

          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 2,
              color: theme.palette.text.secondary,
              fontStyle: 'italic',
              letterSpacing: 0.5,
              fontSize: { xs: 12, sm: 14 },
            }}
          >
            {status}
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}

export default RemoveBackground;
