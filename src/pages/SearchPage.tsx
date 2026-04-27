import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const SearchPage = () => {
  const [folio, setFolio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!folio.trim()) {
      setError('Por favor ingresa un folio');
      return;
    }

    setError(null);
    navigate(`/aspirante/${encodeURIComponent(folio.trim())}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolio(e.target.value);
    if (error) setError(null);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Búsqueda de Aspirante
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSearch}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Folio"
                placeholder="Ej: FOL-2024-001"
                value={folio}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ px: 3, textTransform: 'none', fontWeight: 'bold' }}
                startIcon={<SearchIcon />}
              >
                Buscar
              </Button>
            </Box>
          </form>

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 3 }}
          >
            Ingresa el número de folio para ver los detalles del aspirante
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
