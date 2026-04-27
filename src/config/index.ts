// En desarrollo usamos localhost por defecto; en produccion usamos el mismo origen si no hay variable.
const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const envFoliosEndpoint = import.meta.env.VITE_API_FOLIOS_ENDPOINT?.trim();
const DEFAULT_LOCAL_API = 'http://localhost:5249';

const API_BASE_URL =
  envBaseUrl ||
  (import.meta.env.PROD ? window.location.origin : DEFAULT_LOCAL_API);

if (!envBaseUrl && import.meta.env.PROD) {
  console.warn(
    'VITE_API_BASE_URL no esta configurada en produccion. Se usa window.location.origin como fallback.'
  );
}

export const config = {
  apiBaseUrl: API_BASE_URL,
  foliosEndpoint: envFoliosEndpoint || null,
};
