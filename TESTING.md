# Guía de Testing Manual

## Preparación

1. Asegúrate de que el backend API está ejecutándose en `http://localhost:5249` o `https://localhost:7177`
2. Inicia la aplicación con `npm run dev`
3. Abre tu navegador en `http://localhost:5173`

## Criterios de Aceptación a Probar

### ✅ Criterio 1: Puedo buscar un folio

**Pasos:**
1. Ve a la página principal (/)
2. Verás un campo de entrada con la etiqueta "Folio"
3. Ingresa un folio válido de tu base de datos (ej: "FOL-2024-001")
4. Presiona el botón "Buscar" o Enter

**Resultado esperado:**
- Se navega a `/aspirante/{folio}`
- Se cargan los datos del aspirante
- Aparece un spinner mientras se cargan los datos

**Casos de error:**
- Folio vacío: Muestra error "Por favor ingresa un folio"
- Folio inválido: Muestra error del servidor

---

### ✅ Criterio 2: Puedo ver su información

**Pasos:**
1. Después de buscar un folio válido, verás la página de detalle
2. Observa todos los campos mostrados

**Información visible:**
- Folio
- Estado (como Chip de color)
- Nombre
- Apellido
- Email
- Teléfono (si disponible)
- Programa (si disponible)
- Fecha de Inscripción (si disponible)
- Última Actualización (si disponible)

**Resultado esperado:**
- Toda la información se muestra correctamente
- Los estados tienen colores diferentes:
  - Pendiente: Naranja
  - Inscrito: Azul
  - Aprobado: Verde
  - Rechazado: Rojo
  - Cancelado: Gris

---

### ✅ Criterio 3: Puedo cambiar estado y ver reflejado el cambio al recargar datos

**Pasos:**
1. En la página de detalle, presiona el botón "Cambiar Estado"
2. Se abre un modal
3. En el dropdown "Nuevo Estado", selecciona un estado diferente
4. (Opcional) Agrega un motivo en el campo de texto
5. Presiona "Guardar"

**Resultado esperado:**
- Se muestra un mensaje de éxito
- El estado se actualiza en la página
- El Chip de estado cambia de color
- Los botones están deshabilitados durante el cambio
- Aparece un spinner en el botón "Guardar"

**Verificación:**
- Presiona el botón "Actualizar" en la página de detalle
- Los datos se refrescan desde el servidor
- El estado permanece actualizado

---

### ✅ Criterio 4: Si intento una transición inválida, se muestra el mensaje del backend

**Pasos:**
1. En el modal de cambio de estado
2. Intenta cambiar a un estado que tu API marque como inválido
3. (Depende de las reglas de negocio de tu backend)

**Resultado esperado:**
- Se muestra un mensaje de error en rojo en el modal
- El error contiene el mensaje del backend
- El cambio NO se aplica
- Puedes cerrar el modal y reintentar

**Ejemplo de reglas de transición típicas:**
- No puedes ir de "Aprobado" a "Pendiente"
- No puedes cambiar desde "Cancelado"
- Solo ciertos estados permiten ciertas transiciones

---

## Pruebas Adicionales

### Manejo de Errores

1. **Folio no encontrado:**
   - Ingresa un folio que no existe
   - Resultado: Error "No se encontró información del aspirante"

2. **Conexión perdida:**
   - Detén el servidor backend
   - Intenta buscar o cambiar estado
   - Resultado: Error de conexión

3. **Campos opcionales:**
   - Algunos aspirantes pueden no tener teléfono o programa
   - Resultado: Los campos no se muestran

### Loading States

1. En la búsqueda: Se muestra un spinner mientras se carga
2. En la página de detalle: Se muestra un spinner mientras se carga la ficha
3. En el modal: Se deshabilitan los campos mientras se cambia el estado

### Validación de Formulario

1. Campo folio vacío: No permite buscar
2. Modal sin cambio de estado: Botón deshabilitado
3. Motivo opcional: Puedes guardar sin especificar motivo

---

## Flujo Completo de Ejemplo

```
1. Abre http://localhost:5173
2. Ve la página de búsqueda
3. Ingresa folio "FOL-2024-001"
4. Presiona Buscar
5. Se carga la página de detalle
6. Ves todos los datos del aspirante
7. Presiona "Cambiar Estado"
8. Se abre el modal
9. Cambias de "Pendiente" a "Inscrito"
10. Escribes "Documentos validados"
11. Presiona Guardar
12. Se muestra "Estado cambió a Inscrito"
13. El Chip cambia de color a azul
14. Presiona "Actualizar"
15. Se refrescan los datos y confirman el cambio
16. Presiona el botón "Volver"
17. Vuelves a la página de búsqueda
18. Repite con otro folio
```

---

## Notas Importantes

- La URL de la API está configurada en `.env`
- Si tu backend está en otro puerto, actualiza `.env`
- Los cambios de estado se guardan en la base de datos
- TanStack Query cachea los datos automáticamente
- Los errores se muestran en alertas cerrable
