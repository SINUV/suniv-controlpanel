import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import {
  InscripcionStatus,
  FichaAspirante,
  FolioResumen,
  CambiarEstadoRequest,
  CambiarEstadoResponse,
} from '../types';

class ApiService {
  private axiosInstance: AxiosInstance;

  private normalizeEstado(value?: string): InscripcionStatus['estado'] {
    const estado = (value ?? '').toString().trim().toLowerCase();

    const map: Record<string, InscripcionStatus['estado']> = {
      pendiente: 'Pendiente',
      inscrito: 'Inscrito',
      aprobado: 'Aprobado',
      rechazado: 'Rechazado',
      cancelado: 'Cancelado',
    };

    return map[estado] ?? 'Pendiente';
  }

  private unwrapResponseData<T>(payload: any): T {
    return (payload?.data ?? payload) as T;
  }

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para errores
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        return Promise.reject({
          message: errorMessage,
          statusCode: error.response?.status,
          details: error.response?.data?.details,
        });
      }
    );
  }

  // Consultar status de inscripción
  async consultarStatus(folio: string): Promise<InscripcionStatus> {
    const response = await this.axiosInstance.get(
      `/api/Inscripciones/consulta/status/${folio}`
    );
    const payload = response.data ?? {};

    return {
      folio: payload.folio ?? folio,
      estado: this.normalizeEstado(payload.estado ?? payload.estado_aspirante),
      nombreCompleto: payload.nombre_completo,
      correo: payload.correo,
      telefono: payload.aspirante?.telefono,
    };
  }

  // Obtener ficha del aspirante
  async obtenerFicha(folio: string): Promise<FichaAspirante> {
    const response = await this.axiosInstance.get(
      `/api/Admision/ficha/${folio}`
    );
    const payload = this.unwrapResponseData<any>(response.data) ?? {};

    return {
      folio: payload.folio ?? folio,
      nombre: payload.nombre ?? '',
      apellido: payload.apellido,
      email: payload.email ?? payload.correo,
      correo: payload.correo,
      telefono: payload.telefono,
      programa: payload.programa ?? payload.carrera,
      carrera: payload.carrera,
      campus: payload.campus,
      lugarExamen: payload.lugarExamen,
      horaExamen: payload.horaExamen,
      estado: this.normalizeEstado(payload.estado ?? payload.estado_aspirante),
      fechaInscripcion: payload.fechaInscripcion,
      fechaExamen: payload.fechaExamen,
      fechaActualizacion: payload.fechaActualizacion,
    };
  }

  // Cambiar estado del aspirante
  async cambiarEstado(
    folio: string,
    request: CambiarEstadoRequest
  ): Promise<CambiarEstadoResponse> {
    const response = await this.axiosInstance.patch(
      `/api/Admision/estado/${folio}`,
      request
    );
    const payload = response.data ?? {};

    return {
      folio: payload.folio ?? folio,
      estado: this.normalizeEstado(payload.estado ?? payload.estadoActual ?? request.estado),
      mensaje: payload.mensaje ?? payload.message,
    };
  }

  // Aprobar inscripción (PATCH)
  async aprobarInscripcion(folio: string): Promise<CambiarEstadoResponse> {
    const response = await this.axiosInstance.patch(
      `/api/Inscripciones/aspirante/${folio}/aprobar`
    );
    const payload = response.data ?? {};

    return {
      folio,
      estado: this.normalizeEstado(payload.estado ?? payload.estadoActual ?? 'Aprobado'),
      mensaje: payload.mensaje ?? payload.message,
    };
  }

  // Obtener todos los folios disponibles
  async obtenerFolios(): Promise<FolioResumen[]> {
    if (!config.foliosEndpoint) {
      return [];
    }

    const response = await this.axiosInstance.get(config.foliosEndpoint);
    const payload = this.unwrapResponseData<any>(response.data);
    const rawItems: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.result)
          ? payload.result
          : [];

    return rawItems
      .map((item: any): FolioResumen | null => {
        const folio = item?.folio ?? item?.idFolio ?? item?.numeroFolio;

        if (!folio) return null;

        const fullName = [item?.nombre, item?.apellido].filter(Boolean).join(' ');
        const nombre = item?.nombreCompleto ?? item?.nombre ?? (fullName || undefined);

        return {
          folio: String(folio),
          estado: this.normalizeEstado(item?.estado ?? item?.estado_aspirante),
          nombre,
          correo: item?.correo ?? item?.email,
        };
      })
      .filter((item): item is FolioResumen => item !== null);
  }
}

export const apiService = new ApiService();
