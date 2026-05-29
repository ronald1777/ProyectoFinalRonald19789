export function crearItem(datos) {
  return {
    id: crypto.randomUUID(),
    nombre: datos.nombre,
    categoriaId: datos.categoriaId,
    estado: datos.estado || 'pendiente',
    puntuacion: datos.puntuacion !== '' ? Number(datos.puntuacion) : null,
    fechaRegistro: new Date().toISOString(),
    fechaActividad: new Date().toISOString(),
    notas: datos.notas || '',
    atributos: datos.atributos || {}, 
    activo: true,
  };
}

export function filtrarActivos(items) {
  return items.filter((i) => i.activo);
}

export function calcularProgreso(atributos) {
  const leidos  = Number(atributos?.capLeidos)  || 0;
  const totales = Number(atributos?.capTotales) || 0;
  if (totales === 0) return 0;
  return Math.min(100, Math.round((leidos / totales) * 100));
}

export const ESTADOS = [
  { value: 'leyendo',    label: '📖 Leyendo' },
  { value: 'completado', label: '✅ Completado' },
  { value: 'pendiente',  label: '⏳ Pendiente' },
  { value: 'dropped',    label: '🚫 Dropped' },
];

export const COLOR_ESTADO = {
  leyendo:    'var(--accent)',
  completado: 'var(--success)',
  pendiente:  'var(--warning)',
  dropped:    'var(--danger)',
};

export function normalizeEstado(raw) {
  const map = { leyendo: 'leyendo', completado: 'completado', pendiente: 'pendiente', dropped: 'dropped' };
  return map[raw?.toLowerCase()] || 'pendiente';
}
