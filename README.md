# SUniv Control - Sistema de Gestión de Inscripciones

Aplicación web para gestionar el estado de inscripciones y fichas de aspirantes en el proceso de admisión.

## Características

- **Búsqueda por folio**: Ingresa un folio para buscar información del aspirante
- **Vista de detalles**: Información completa del aspirante (nombre, email, teléfono, programa, etc.)
- **Cambio de estado**: Modifica el estado del aspirante con motivo opcional
- **Estados disponibles**: Pendiente, Inscrito, Aprobado, Rechazado, Cancelado
- **Actualización en tiempo real**: Los cambios se reflejan inmediatamente
- **Manejo robusto de errores**: Mensajes claros cuando hay problemas
- **Loading states**: Indicadores de carga en las operaciones

## Requisitos

- Node.js 16+
- npm o yarn
- Backend API funcionando en `http://localhost:5249` (HTTP) o `https://localhost:7177` (HTTPS), o configurar en `.env`

## Instalación

1. Clona el repositorio y navega al directorio:
```bash
cd suniv-control
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Configura la URL base de la API en `.env`:
```env
VITE_API_BASE_URL=http://localhost:5249
```

## Desarrollo

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build

Para crear una versión optimizada para producción:
```bash
npm run build
```

Si vas a desplegar, compila con la URL real del backend para evitar que el frontend intente llamar a `localhost` del navegador del usuario:

```bash
VITE_API_BASE_URL=https://tu-backend.com npm run build
```

Si frontend y backend viven en el mismo dominio, no necesitas esa variable: en produccion se usara automaticamente el mismo origen del sitio desplegado.

Para previsualizar la versión compilada:
```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   └── CambiarEstadoModal.tsx    # Modal para cambiar estado
├── config/             # Configuración de la aplicación
│   └── index.ts        # Variables de entorno y config
├── hooks/              # Custom hooks con TanStack Query
│   └── index.ts        # Hooks para consultas y mutaciones
├── pages/              # Páginas principales
│   ├── SearchPage.tsx           # Búsqueda por folio
│   └── AspirativeDetailPage.tsx # Detalle del aspirante
├── services/           # Servicios de API
│   └── api.ts          # Cliente Axios y llamadas API
├── types/              # Tipos e interfaces TypeScript
│   └── index.ts        # Definiciones de tipos
├── App.jsx             # Componente raíz con router
└── main.jsx            # Punto de entrada
```

## Tecnologías Utilizadas

- **React 19**: Framework de interfaz de usuario
- **React Router**: Enrutamiento de aplicación
- **Vite**: Bundler y servidor de desarrollo
- **Axios**: Cliente HTTP
- **TanStack Query**: Gestión de estado y caché de datos
- **React Hook Form**: Gestión de formularios
- **Zod**: Validación de datos
- **MUI (Material-UI)**: Componentes de UI

## Flujo de Uso

1. **Inicio**: Usuario accede a la página principal de búsqueda
2. **Búsqueda**: Ingresa un folio y presiona "Buscar"
3. **Detalles**: Se cargan y muestran los datos del aspirante
4. **Cambio de Estado**: Usuario puede presionar "Cambiar Estado"
5. **Modal**: Se abre un formulario para seleccionar nuevo estado y motivo
6. **Confirmación**: Al guardar, se actualiza el estado en la API
7. **Reflejo**: Los datos se actualizan automáticamente en la vista

## Criterios de Aceptación

- ✅ Puedo buscar un folio
- ✅ Puedo ver su información
- ✅ Puedo cambiar estado y ver reflejado el cambio al recargar datos
- ✅ Si intento una transición inválida, se muestra el mensaje del backend

## Endpoints API Utilizados

- `GET /api/Inscripciones/consulta/status/{folio}` - Consultar status
- `GET /api/Admision/ficha/{folio}` - Obtener ficha del aspirante
- `PATCH /api/Admision/estado/{folio}` - Cambiar estado con body `{ estado, motivo }`
- `PATCH /api/Inscripciones/aspirante/{folio}/aprobar` - Aprobar inscripción

## Variables de Entorno

| Variable | Descripción | Valor Predeterminado |
|----------|-------------|---------------------|
| `VITE_API_BASE_URL` | URL base de la API | `http://localhost:5249` |

## Notas

- La autenticación y autorización están implementadas a nivel de arquitectura pero no activadas (como se solicitó)
- Los errores de API se capturan y muestran de forma clara al usuario
- La aplicación utiliza TanStack Query para invalidar caché automáticamente cuando hay cambios
- El modal de cambio de estado deshabilita la opción de guardar si el nuevo estado es igual al actual
