# Guía de Inicio Rápido

## 1. Instalación y Setup

```bash
# Navega al directorio del proyecto
cd suniv-control

# Instala las dependencias (ya están instaladas)
npm install

# Configura la variable de entorno
# El archivo .env ya existe con la configuración por defecto
# Si necesitas cambiar la URL de la API, edita .env:
# VITE_API_BASE_URL=http://tu-backend:puerto
```

## 2. Desarrollo

```bash
# Inicia el servidor de desarrollo
npm run dev

# La aplicación estará en http://localhost:5173
```

## 3. Build para Producción

```bash
# Compila la aplicación
npm run build

# Previsualiza la versión compilada
npm run preview
```

## Flujo de la Aplicación

### Página de Búsqueda (/)
- Ingresa un folio (ej: FOL-2024-001)
- Presiona "Buscar" o Enter
- Se navega automáticamente al detalle

### Página de Detalle (/aspirante/:folio)
- Muestra toda la información del aspirante
- Estados disponibles: Pendiente, Inscrito, Aprobado, Rechazado, Cancelado
- Botones:
  - **Cambiar Estado**: Abre el modal para cambiar estado
  - **Actualizar**: Recarga los datos del servidor

### Modal de Cambio de Estado
- **Campo Estado**: Dropdown con todos los estados disponibles
- **Campo Motivo**: Texto opcional explicando el cambio
- El botón "Guardar" se deshabilita si no cambias el estado
- Al guardar, se actualiza automáticamente

## Manejo de Errores

### Errores Comunes

| Situación | Mensaje |
|-----------|---------|
| Folio no encontrado | "Error al obtener la información" |
| Cambio de estado inválido | Mensaje específico del backend |
| Conexión perdida | Error de Axios |
| Folio vacío | "Por favor ingresa un folio" |

Todos los errores se muestran en alertas rojas que puedes cerrar.

## Características Implementadas

✅ **Búsqueda de Aspirante**: Interfaz limpia y responsiva
✅ **Vista de Detalles**: Muestra toda la información disponible
✅ **Cambio de Estado**: Modal con validación de formulario
✅ **Manejo de Errores**: Alertas claras en caso de fallo
✅ **Loading States**: Spinners durante carga de datos
✅ **Actualización en Tiempo Real**: Los cambios se reflejan inmediatamente
✅ **Validación Zod**: Datos validados antes de enviar
✅ **Tiping TypeScript**: Código totalmente tipado
✅ **TanStack Query**: Caché inteligente y invalidación automática

## Arquitectura

### Services (src/services/api.ts)
- Cliente Axios centralizado
- Métodos para cada endpoint de API
- Manejo de errores estandarizado

### Hooks (src/hooks/index.ts)
- `useConsultarStatus`: Obtiene estado de inscripción
- `useObtenerFicha`: Obtiene datos del aspirante
- `useCambiarEstado`: Mutation para cambiar estado
- `useAprobarInscripcion`: Mutation para aprobar

### Pages
- **SearchPage**: Búsqueda por folio
- **AspirativeDetailPage**: Detalle completo

### Components
- **CambiarEstadoModal**: Modal reutilizable

### Types (src/types/index.ts)
- Todas las interfaces de API tipadas
- Estados como tipo enum

## Variables de Entorno

```env
# URL base de la API (por defecto: http://localhost:5249)
VITE_API_BASE_URL=http://localhost:5249
```

## Próximas Mejoras (Arquitectura Lista)

La arquitectura está diseñada para facilitar la agregación de:
- Autenticación JWT
- Interceptores de autorización
- Refresh token automático
- Logging centralizado
- Persistencia de sesión
