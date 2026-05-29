# ProyectoFinalRonald19789 - Manga Tracker

Proyecto de Fase 3 con React, `useReducer`, Recharts, optimizacion con `useMemo`/`useCallback` y backend conectado a Supabase/PostgreSQL.

## Requisitos

- Reducer con 7 acciones: `HIDRATAR`, `AGREGAR`, `ELIMINAR`, `CAMBIAR_ESTADO`, `FILTRAR`, `LIMPIAR_FILTROS`, `REGISTRAR_ACTIVIDAD`.
- Filtros combinados por categoria, estado y busqueda.
- 3 graficas con Recharts, `Tooltip` y `Legend`, visibles entre filtros y formulario.
- `useMemo` para lista filtrada, estadisticas y datos de graficas.
- `useCallback` para handlers que se pasan a componentes hijos.
- `React.memo` en `ItemCard`.
- Medicion con `Profiler` de React en `Graficas`, `FormularioItem` y `ListaItems`.
- Backend Express con tablas `items` y `registros` en Supabase.

## Como ejecutar

Instalar dependencias del backend:

```bash
cd backend
npm install
npm run db:setup
npm run dev
```

Instalar dependencias del frontend en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`. El boton `Local/API` cambia entre LocalStorage y Supabase.

## Supabase

El backend usa la configuracion de `backend/.env`. La base se crea automaticamente al iniciar el backend o al ejecutar:

```bash
cd backend
npm run db:setup
```

Tambien deje SQL manual en:

- `supabase/schema.sql`
- `supabase/seed.sql`

Si el host directo de Supabase no conecta desde tu red, cambia `SUPABASE_DB_HOST`, `SUPABASE_DB_PORT` y `SUPABASE_DB_USER` en `backend/.env` por los datos del pooler de Supabase.

## Mi grafica original

La grafica original es un `PieChart` de cantidad por estado. Muestra cuantos mangas estan leyendo, pendientes, completados o abandonados pero aparece como dropped. La elegi porque el tema del proyecto es seguimiento de mangas, y este grafico permite entender rapidamente el estado general de la biblioteca sin tener la necesidad de revisar cada tarjeta una por una.

## Mis 3 decisiones tecnicas

1. Estructura del reducer: separe las acciones de carga, escritura, filtros y actividad. El reducer se mantiene puro: no hace `fetch`, no lee LocalStorage y no genera fechas por su cuenta.
2. Accion mas dificil: `ELIMINAR`, porque no borra fisicamente el manga. Lo resolvi como archivado logico usando `activo = false`, asi los datos se conservan y las graficas/listas pueden excluirlos.
3. Grafica mas compleja: la actividad de los ultimos 7 dias, porque transforma fechas de actividad en conteos diarios y ademas respeta los filtros activos usando los ids de los mangas visibles.

## Evidencia con React DevTools Profiler

## Implementación de filtro
<img width="1860" height="1013" alt="image" src="https://github.com/user-attachments/assets/446622ac-81dc-4ca8-a0f7-e8ead17a4b4a" />

<img width="1335" height="862" alt="image" src="https://github.com/user-attachments/assets/594579ba-5236-4213-be88-e993d66b991e" />
<img width="1761" height="788" alt="image" src="https://github.com/user-attachments/assets/0f8c0dc0-f69f-4132-b68c-1372c8bfc50b" />
## Cambia segun los filtros
<img width="1389" height="772" alt="image" src="https://github.com/user-attachments/assets/5ca2495d-2d0a-469f-b7e6-465a1893d7b3" />




Analisis: despues de optimizar, el filtrado de la lista solo se recalcula cuando cambian `lista`, `filtroCategoria`, `filtroEstado` o `busqueda`. `ItemCard` evita renders innecesarios cuando sus props no cambian, y los datos de Recharts se recalculan solamente cuando cambia la lista filtrada o el historial.

La app tambien incluye componentes `Profiler` alrededor de `Graficas`, `FormularioItem` y `ListaItems`. En modo desarrollo, los tiempos aparecen en la consola del navegador con etiquetas como `[Profiler:Graficas]`.
