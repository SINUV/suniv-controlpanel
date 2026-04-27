// Estados permitidos
export type Estado = 'Pendiente' | 'Inscrito' | 'Aprobado' | 'Rechazado' | 'Cancelado';

// Respuesta de búsqueda de status
export interface InscripcionStatus {
  folio: string;
  estado: Estado;
  nombreCompleto?: string;
  correo?: string;
  telefono?: string;
}

// Datos de ficha de aspirante
export interface FichaAspirante {
  folio: string;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  programa?: string;
  estado: Estado;
  campus?: string;
  lugarExamen?: string;
  horaExamen?: string;
  carrera?: string;
  correo?: string;
  fechaInscripcion?: string;
  fechaExamen?: string;
  fechaActualizacion?: string;
}

// Item de listado para mostrar folios y navegación a detalle
export interface FolioResumen {
  folio: string;
  estado?: Estado;
  nombre?: string;
  correo?: string;
}

// Request para cambiar estado
export interface CambiarEstadoRequest {
  estado: Estado;
  motivo?: string;
}

// Response de cambio de estado
export interface CambiarEstadoResponse {
  folio: string;
  estado: Estado;
  mensaje?: string;
}

// Errores de API
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, string | string[]>;
}

// Respuesta paginada (si la API lo requiere)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
