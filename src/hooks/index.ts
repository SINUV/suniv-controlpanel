import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import {
  CambiarEstadoRequest,
  CambiarEstadoResponse,
  FichaAspirante,
  FolioResumen,
  InscripcionStatus,
} from '../types';

// Hook para consultar el status de una inscripción
export const useConsultarStatus = (folio: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['status', folio],
    queryFn: async () => {
      if (!folio) throw new Error('Folio is required');
      return apiService.consultarStatus(folio);
    },
    enabled: enabled && !!folio,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener la ficha del aspirante
export const useObtenerFicha = (folio: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ficha', folio],
    queryFn: async () => {
      if (!folio) throw new Error('Folio is required');
      return apiService.obtenerFicha(folio);
    },
    enabled: enabled && !!folio,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para cambiar el estado del aspirante
export const useCambiarEstado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ folio, request }: { folio: string; request: CambiarEstadoRequest }) => {
      return apiService.cambiarEstado(folio, request);
    },
    onSuccess: (data, variables) => {
      // Invalidar la caché de las queries afectadas
      queryClient.invalidateQueries({ queryKey: ['status', variables.folio] });
      queryClient.invalidateQueries({ queryKey: ['ficha', variables.folio] });
    },
  });
};

// Hook para aprobar inscripción
export const useAprobarInscripcion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folio: string) => {
      return apiService.aprobarInscripcion(folio);
    },
    onSuccess: (data, folio) => {
      queryClient.invalidateQueries({ queryKey: ['status', folio] });
      queryClient.invalidateQueries({ queryKey: ['ficha', folio] });
    },
  });
};

// Hook para obtener todos los folios
export const useObtenerFolios = () => {
  return useQuery<FolioResumen[]>({
    queryKey: ['folios'],
    queryFn: async () => apiService.obtenerFolios(),
    retry: 1,
    staleTime: 1000 * 60 * 2,
  });
};
