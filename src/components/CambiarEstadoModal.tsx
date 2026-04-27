import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Estado, CambiarEstadoRequest } from '../types';

const cambiarEstadoSchema = z.object({
  estado: z.enum(['Pendiente', 'Inscrito', 'Aprobado', 'Rechazado', 'Cancelado'] as const, {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
  motivo: z.string().optional(),
});

type CambiarEstadoFormData = z.infer<typeof cambiarEstadoSchema>;

interface CambiarEstadoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CambiarEstadoRequest) => void;
  currentEstado: Estado;
  isLoading?: boolean;
  error?: string | null;
}

const estadosDisponibles: Estado[] = ['Pendiente', 'Inscrito', 'Aprobado', 'Rechazado', 'Cancelado'];

export const CambiarEstadoModal = ({
  open,
  onClose,
  onSubmit,
  currentEstado,
  isLoading = false,
  error,
}: CambiarEstadoModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CambiarEstadoFormData>({
    resolver: zodResolver(cambiarEstadoSchema),
    defaultValues: {
      estado: currentEstado,
      motivo: '',
    },
  });

  const nuevoEstado = watch('estado');

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: CambiarEstadoFormData) => {
    const request: CambiarEstadoRequest = {
      estado: data.estado,
      motivo: data.motivo || undefined,
    };
    onSubmit(request);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cambiar Estado de Aspirante</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Estado Actual: <strong>{currentEstado}</strong>
              </Typography>
            </Box>

            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.estado}>
                  <InputLabel>Nuevo Estado</InputLabel>
                  <Select
                    {...field}
                    label="Nuevo Estado"
                    disabled={isLoading}
                  >
                    {estadosDisponibles.map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="motivo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Motivo (Opcional)"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Describe el motivo del cambio de estado"
                  disabled={isLoading}
                  error={!!errors.motivo}
                  helperText={errors.motivo?.message}
                />
              )}
            />
          </Box>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          color="primary"
          disabled={isLoading || nuevoEstado === currentEstado}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
       </DialogActions>
    </Dialog>
  );
};
