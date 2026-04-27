import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useObtenerFicha, useCambiarEstado, useConsultarStatus } from '../hooks';
import { CambiarEstadoModal } from '../components/CambiarEstadoModal';
import { CambiarEstadoRequest, Estado } from '../types';

const getEstadoColor = (estado: Estado) => {
  const colors: Record<Estado, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
    'Pendiente': 'warning',
    'Inscrito': 'info',
    'Aprobado': 'success',
    'Rechazado': 'error',
    'Cancelado': 'default',
  };
  return colors[estado] || 'default';
};

export const AspirativeDetailPage = () => {
  const { folio } = useParams<{ folio: string }>();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data: ficha,
    isLoading: isLoadingFicha,
    error: fichaError,
    refetch: refetchFicha,
  } = useObtenerFicha(folio || null, true);

  const {
    data: status,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useConsultarStatus(folio || null, true);

  const {
    mutate: cambiarEstado,
    isPending,
    error: cambiarEstadoError,
  } = useCambiarEstado();

  const handleCambiarEstado = (request: CambiarEstadoRequest) => {
    if (!folio) return;

    cambiarEstado(
      { folio, request },
      {
        onSuccess: (data) => {
          setSuccessMessage(
            `Estado cambió a ${data.estado}${data.mensaje ? ': ' + data.mensaje : ''}`
          );
          setOpenModal(false);
          
          // Refrescar datos después de 1 segundo para ver el cambio
          setTimeout(() => {
            refetchFicha();
            refetchStatus();
            setSuccessMessage(null);
          }, 1000);
        },
      }
    );
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!folio) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">Folio no válido</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mt: 2 }}
          >
            Volver a búsqueda
          </Button>
        </Box>
      </Container>
    );
  }

  if (isLoadingFicha || isLoadingStatus) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (fichaError && statusError) {
    const fichaMessage = typeof fichaError === 'string'
      ? fichaError
      : (fichaError as any).message;
    const statusMessage = typeof statusError === 'string'
      ? statusError
      : (statusError as any).message;
    const errorMessage = fichaMessage || statusMessage || 'Error al obtener la información';

    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{errorMessage}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Volver a búsqueda
          </Button>
        </Box>
      </Container>
    );
  }

  if (!ficha && !status) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">No se encontró información del aspirante</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Volver a búsqueda
          </Button>
        </Box>
      </Container>
    );
  }

  const detalle = {
    folio: ficha?.folio || status?.folio || folio,
    estado: status?.estado || ficha?.estado || 'Pendiente',
    nombre: ficha?.nombre || status?.nombreCompleto || 'No disponible',
    apellido: ficha?.apellido || '',
    email: ficha?.email || ficha?.correo || status?.correo || 'No disponible',
    telefono: ficha?.telefono || status?.telefono,
    programa: ficha?.programa || ficha?.carrera,
    campus: ficha?.campus,
    fechaInscripcion: ficha?.fechaInscripcion,
    fechaActualizacion: ficha?.fechaActualizacion,
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header con botón de regreso */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Detalle del Aspirante
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            variant="outlined"
          >
            Volver
          </Button>
        </Box>

        {/* Mensajes de éxito y error */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {cambiarEstadoError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof cambiarEstadoError === 'string'
              ? cambiarEstadoError
              : (cambiarEstadoError as any).message || 'Error al cambiar estado'}
          </Alert>
        )}

        {/* Card principal */}
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          {/* Información básica */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Folio
              </Typography>
              <Typography variant="h6">{detalle.folio}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Estado
              </Typography>
              <Chip
                label={detalle.estado}
                color={getEstadoColor(detalle.estado as Estado)}
                sx={{ fontWeight: 'bold', height: 32 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Nombre
              </Typography>
              <Typography variant="body1">{detalle.nombre}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Apellido
              </Typography>
              <Typography variant="body1">{detalle.apellido || 'No disponible'}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">{detalle.email}</Typography>
            </Grid>

            {detalle.telefono && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Teléfono
                </Typography>
                <Typography variant="body1">{detalle.telefono}</Typography>
              </Grid>
            )}

            {detalle.programa && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Programa
                </Typography>
                <Typography variant="body1">{detalle.programa}</Typography>
              </Grid>
            )}

            {detalle.campus && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Campus
                </Typography>
                <Typography variant="body1">{detalle.campus}</Typography>
              </Grid>
            )}

            {detalle.fechaInscripcion && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Fecha de Inscripción
                </Typography>
                <Typography variant="body1">
                  {new Date(detalle.fechaInscripcion).toLocaleDateString('es-ES')}
                </Typography>
              </Grid>
            )}

            {detalle.fechaActualizacion && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Última Actualización
                </Typography>
                <Typography variant="body1">
                  {new Date(detalle.fechaActualizacion).toLocaleDateString('es-ES')}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setOpenModal(true)}
              disabled={isPending}
            >
              Cambiar Estado
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                refetchFicha();
                refetchStatus();
              }}
              disabled={isPending}
            >
              Actualizar
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Modal para cambiar estado */}
      <CambiarEstadoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCambiarEstado}
        currentEstado={detalle.estado as Estado}
        isLoading={isPending}
        error={cambiarEstadoError ? (typeof cambiarEstadoError === 'string'
          ? cambiarEstadoError
          : (cambiarEstadoError as any).message) : null}
      />
    </Container>
  );
};
