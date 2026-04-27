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
      estado: payload.estado ?? payload.estado_aspirante ?? 'Pendiente',
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
      estado: payload.estado ?? payload.estado_aspirante ?? 'Pendiente',
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
    return response.data;
  }

  // Aprobar inscripción (PATCH)
  async aprobarInscripcion(folio: string): Promise<CambiarEstadoResponse> {
    const response = await this.axiosInstance.patch(
      `/api/Inscripciones/aspirante/${folio}/aprobar`
    );
    return response.data;
  }

  // Obtener todos los folios disponibles
  async obtenerFolios(): Promise<FolioResumen[]> {
    const endpoints = [
      '/api/Inscripciones/consulta/folios',
      '/api/Inscripciones/folios',
      '/api/Inscripciones/consulta',
      '/api/Inscripciones',
      '/api/Admision/fichas',
    ];

    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        const response = await this.axiosInstance.get(endpoint);
        const payload = this.unwrapResponseData<any>(response.data);
        const rawItems: any[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : Array.isArray(payload?.result)
              ? payload.result
              : [];

        if (!Array.isArray(rawItems) || rawItems.length === 0) {
          continue;
        }

        const normalized = rawItems
          .map((item: any): FolioResumen | null => {
            const folio = item?.folio ?? item?.idFolio ?? item?.numeroFolio;

            if (!folio) return null;

            const fullName = [item?.nombre, item?.apellido].filter(Boolean).join(' ');
            const nombre = item?.nombreCompleto ?? item?.nombre ?? (fullName || undefined);

            return {
              folio: String(folio),
              estado: item?.estado ?? item?.estado_aspirante,
              nombre,
              correo: item?.correo ?? item?.email,
            };
          })
          .filter((item): item is FolioResumen => item !== null);

        if (normalized.length > 0) {
          return normalized;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) throw lastError;
    return [];
  }
}

export const apiService = new ApiService();
