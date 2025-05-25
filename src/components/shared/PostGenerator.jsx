import React, { useState } from 'react';
import { TextField, Button, MenuItem, Card, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import Header from '../shared/Header';
import Toast from '../shared/Toast';
import withProtectedRoute from '../shared/ProtectedRoute';

function PostGeneratorUI() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [wordCount, setWordCount] = useState('300');
  const [format, setFormat] = useState('Post de blog');
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/post/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          topic,
          tone,
          wordCount: parseInt(wordCount),
          format
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate post');
      
      setPost(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(post);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Box 
        maxWidth={800} 
        mx="auto" 
        px={3}
        sx={{ 
          pt: '100px', // Add padding top to account for fixed header
          pb: 4,
          minHeight: 'calc(100vh - 64px)', // Subtract header height
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          Gerar Post com IA
        </Typography>

        <TextField
          fullWidth
          label="Tópico"
          placeholder="Vantagens do trabalho remoto"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          margin="normal"
        />

        <Box display="flex" gap={2} mt={2} mb={2}>
          <TextField
            select
            label="Tom"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            fullWidth
          >
            <MenuItem value="Profissional">Profissional</MenuItem>
            <MenuItem value="Descontraído">Descontraído</MenuItem>
            <MenuItem value="Inspirador">Inspirador</MenuItem>
          </TextField>

          <TextField
            label="Contagem de palavras"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Formato"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            fullWidth
          >
            <MenuItem value="Post de blog">Post de blog</MenuItem>
            <MenuItem value="Legenda Instagram">Legenda Instagram</MenuItem>
            <MenuItem value="Tweet">Tweet</MenuItem>
          </TextField>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2, mb: 4, fontWeight: 'bold', fontSize: '1rem' }}
          onClick={handleGenerate}
          disabled={loading || !topic}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Gerar Post'}
        </Button>

        {error && (
          <Toast 
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}
        
        {post && (
          <Card variant="outlined" sx={{ p: 3, backgroundColor: '#fafafa' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {topic}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {post}
            </Typography>

            <Box display="flex" justifyContent="space-around" mt={2}>
              <IconButton onClick={handleCopy}><ContentCopyIcon /></IconButton>
              <IconButton><SaveIcon /></IconButton>
              <IconButton onClick={handleGenerate}><ReplayIcon /></IconButton>
              <IconButton><PublishIcon /></IconButton>
            </Box>
          </Card>
        )}
      </Box>
    </div>
  );
}

export default withProtectedRoute(PostGeneratorUI);