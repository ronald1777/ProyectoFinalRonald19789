CREATE TABLE IF NOT EXISTS public.items (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  "categoriaId" TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  puntuacion REAL,
  "fechaRegistro" TEXT NOT NULL,
  "fechaActividad" TEXT NOT NULL,
  notas TEXT NOT NULL DEFAULT '',
  atributos JSONB NOT NULL DEFAULT '{}'::jsonb,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.registros (
  id TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  fecha TEXT NOT NULL,
  valor REAL,
  notas TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_items_activo_fecha
  ON public.items (activo, "fechaActividad" DESC);

CREATE INDEX IF NOT EXISTS idx_items_categoria_estado
  ON public.items ("categoriaId", estado);
