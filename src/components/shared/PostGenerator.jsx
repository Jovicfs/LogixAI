import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Card, Typography, IconButton, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from '../shared/Header';
import Toast from '../shared/Toast';
import withProtectedRoute from '../shared/ProtectedRoute';
import { useTheme } from '@mui/material/styles';

function PostGeneratorUI() {
  const theme = useTheme();
  const [savedPosts, setSavedPosts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [wordCount, setWordCount] = useState('300');
  const [format, setFormat] = useState('Post de blog');
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch history on mount and also when the component is focused (user clicks/navigates to it)
  useEffect(() => {
    fetchPostHistory();

    // Optionally, also fetch when the window/tab regains focus
    const onFocus = () => fetchPostHistory();
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const fetchPostHistory = async () => {
    try {
      setHistoryLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/post/history', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSavedPosts(data.posts || []);
      } else{
        setSavedPosts([]);
        setError(data.error || 'Erro ao buscar histórico');
      }
    } catch (err){
      setSavedPosts([]);
      setError('Erro ao buscar histórico');
    } finally {
      setHistoryLoading(false);
    }
  };

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

  const handleSavePost = async () => {
    try {
      const response = await fetch('http://localhost:5000/post/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          topic,
          content: post,
          format,
          tone,
          wordCount: parseInt(wordCount)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar post');
      await fetchPostHistory();
    } catch (err) {
      setError(err.message || 'Erro ao salvar post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/post/delete/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao deletar post');
      await fetchPostHistory();
    } catch (err) {
      setError(err.message || 'Erro ao deletar post');
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      const response = await fetch(`http://localhost:5000/post/update/${selectedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          topic: updatedPost.topic,
          content: updatedPost.content
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao atualizar post');
      await fetchPostHistory();
      setEditDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar post');
    }
  };

  const handleLoadPost = (savedPost) => {
    setTopic(savedPost.topic);
    setPost(savedPost.content);
    setFormat(savedPost.format);
    setTone(savedPost.tone);
    setWordCount(savedPost.word_count ? savedPost.word_count.toString() : '300');
  };

  // Fix: Separate edit dialog state from generated post card
  const handleEditIconClick = (post) => {
    setSelectedPost({ ...post }); // Make a copy to avoid direct mutation
    setEditDialogOpen(true);
  };

  // Only show history section ONCE, above the form and not inside the generated post card
  return (
    <div
      className="min-h-screen"
      style={{ background: theme.palette.background.default }}
    >
      <Header />
      <Box
        maxWidth={800}
        mx="auto"
        px={3}
        sx={{
          pt: '100px',
          pb: 4,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
          sx={{
            mb: 4,
            color: theme.palette.text.primary,
          }}
        >
          Gerador de Posts com IA
        </Typography>

        {/* Show history section only if there is history */}
        {savedPosts.length > 0 && (
          <Box
            mt={2}
            borderTop={1}
            borderColor={theme.palette.divider}
            pt={2}
          >
            <Typography
              variant="h6"
              gutterBottom
              display="flex"
              alignItems="center"
              sx={{ color: theme.palette.text.primary }}
            >
              Histórico de Posts
              {historyLoading && (
                <CircularProgress size={20} sx={{ ml: 2, color: theme.palette.primary.main }} />
              )}
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {savedPosts.map((savedPost) => (
                <Card
                  key={savedPost.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                        {savedPost.topic}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ color: theme.palette.text.secondary }}>
                        {savedPost.format} • {savedPost.created_at ? savedPost.created_at.slice(0, 10) : ''}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditIconClick(savedPost)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleLoadPost(savedPost)}
                        sx={{ color: theme.palette.secondary.main }}
                      >
                        <ReplayIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeletePost(savedPost.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <TextField
          fullWidth
          label="Tópico"
          placeholder="Vantagens do trabalho remoto"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
          InputProps={{
            style: {
              color: theme.palette.text.primary,
              background: theme.palette.background.paper,
            },
          }}
        />

        <Box display="flex" gap={2} mt={2} mb={2}>
          <TextField
            select
            label="Tom"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            InputProps={{
              style: {
                color: theme.palette.text.primary,
                background: theme.palette.background.paper,
              },
            }}
          >
            <MenuItem value="Profissional">Profissional</MenuItem>
            <MenuItem value="Descontraído">Descontraído</MenuItem>
            <MenuItem value="Inspirador">Inspirador</MenuItem>
          </TextField>

          <TextField
            type="number"
            label="Contagem de palavras"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            InputProps={{
              style: {
                color: theme.palette.text.primary,
                background: theme.palette.background.paper,
              },
            }}
          />

          <TextField
            select
            label="Formato"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            InputProps={{
              style: {
                color: theme.palette.text.primary,
                background: theme.palette.background.paper,
              },
            }}
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
          sx={{
            mt: 2,
            mb: 4,
            fontWeight: 'bold',
            fontSize: '1rem',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: theme.palette.primary.contrastText,
            boxShadow: theme.shadows[2],
          }}
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
          <Card
            variant="outlined"
            sx={{
              p: 3,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: theme.shadows[2],
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: theme.palette.text.primary }}>
              {topic}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: theme.palette.text.primary }}>
              {post}
            </Typography>

            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary" sx={{ color: theme.palette.text.secondary }}>
                {format} - {tone} - {wordCount} palavras
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ color: theme.palette.text.secondary }}>
                Gerado em: {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Card>
        )}

        {/* Edit Dialog (always available, not inside the post card) */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: theme.palette.text.primary }}>Editar Post</DialogTitle>
          <DialogContent>
            {selectedPost && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Tópico"
                  value={selectedPost.topic}
                  onChange={(e) => setSelectedPost({ ...selectedPost, topic: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                  InputProps={{
                    style: {
                      color: theme.palette.text.primary,
                      background: theme.palette.background.paper,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Conteúdo"
                  value={selectedPost.content}
                  onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                  InputProps={{
                    style: {
                      color: theme.palette.text.primary,
                      background: theme.palette.background.paper,
                    },
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} sx={{ color: theme.palette.text.secondary }}>
              Cancelar
            </Button>
            <Button
              onClick={() => handleEditPost(selectedPost)}
              variant="contained"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.primary.contrastText,
              }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Box display="flex" justifyContent="space-around" mt={2}>
          <IconButton onClick={handleCopy} sx={{ color: theme.palette.primary.main }}>
            <ContentCopyIcon />
          </IconButton>
          <IconButton onClick={handleSavePost} sx={{ color: theme.palette.success.main }}>
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleGenerate} sx={{ color: theme.palette.secondary.main }}>
            <ReplayIcon />
          </IconButton>
          <IconButton sx={{ color: theme.palette.info.main }}>
            <PublishIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}

export default withProtectedRoute(PostGeneratorUI);