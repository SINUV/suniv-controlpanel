import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useObtenerFolios } from '../hooks';
import { Estado } from '../types';
import { config } from '../config';

const getEstadoColor = (estado?: Estado) => {
  const colors: Record<Estado, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
    Pendiente: 'warning',
    Inscrito: 'primary',
    Aprobado: 'success',
    Rechazado: 'error',
    Cancelado: 'default',
  };
  return estado ? colors[estado] : 'default';
};

export const SearchPage = () => {
  const [folio, setFolio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    data: folios,
    isLoading,
    error: foliosError,
    refetch,
    isFetching,
  } = useObtenerFolios();

  const filteredFolios = useMemo(() => {
    if (!folios?.length) return [];

    const search = folio.trim().toLowerCase();
    if (!search) return folios;

    return folios.filter((item) => {
      const byFolio = item.folio.toLowerCase().includes(search);
      const byName = item.nombre?.toLowerCase().includes(search);
      const byEmail = item.correo?.toLowerCase().includes(search);
      return byFolio || !!byName || !!byEmail;
    });
  }, [folios, folio]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!folio.trim()) {
      setError('Escribe un folio para abrirlo directamente o selecciona uno de la lista');
      return;
    }

    setError(null);
    navigate(`/aspirante/${encodeURIComponent(folio.trim())}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolio(e.target.value);
    if (error) setError(null);
  };

  const handleGoToDetail = (selectedFolio: string) => {
    navigate(`/aspirante/${encodeURIComponent(selectedFolio)}`);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 3,
          py: 4,
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

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Los folios se cargan automáticamente para abrir su detalle y cambiar estado.
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

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Folios disponibles</Typography>
            <Button
              size="small"
              startIcon={isFetching ? <CircularProgress size={14} /> : <RefreshIcon />}
              onClick={() => refetch()}
              disabled={isFetching || !config.foliosEndpoint}
            >
              Actualizar lista
            </Button>
          </Box>

          {!config.foliosEndpoint && (
            <Alert severity="info" sx={{ mt: 1 }}>
              El listado automático está desactivado. Define VITE_API_FOLIOS_ENDPOINT en tu .env con el endpoint real para cargar todos los folios.
            </Alert>
          )}

          {config.foliosEndpoint && isLoading && (
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}

          {config.foliosEndpoint && foliosError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {typeof foliosError === 'string'
                ? foliosError
                : (foliosError as any)?.message || 'No se pudieron cargar los folios'}
            </Alert>
          )}

          {config.foliosEndpoint && !isLoading && !foliosError && filteredFolios.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay folios para mostrar con el filtro actual.
            </Alert>
          )}

          {config.foliosEndpoint && !isLoading && !foliosError && filteredFolios.length > 0 && (
            <List sx={{ maxHeight: 360, overflow: 'auto', mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              {filteredFolios.map((item, index) => (
                <ListItem
                  key={item.folio}
                  secondaryAction={
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleGoToDetail(item.folio)}
                    >
                      Ver detalle
                    </Button>
                  }
                  divider={index < filteredFolios.length - 1}
                >
                  <ListItemText
                    primary={item.nombre || item.folio}
                    secondary={item.nombre ? `Folio: ${item.folio}${item.correo ? ` • ${item.correo}` : ''}` : item.folio}
                  />
                  {item.estado && (
                    <Chip
                      label={item.estado}
                      color={getEstadoColor(item.estado)}
                      size="small"
                      sx={{ mr: 2, fontWeight: 600 }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          )}

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 3 }}
          >
            Puedes buscar por folio, nombre o correo, y abrir el detalle para cambiar estado.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
