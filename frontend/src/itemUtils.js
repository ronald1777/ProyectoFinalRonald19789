/**
 * Crea un Item nuevo con todos los campos del modelo de datos.
 * Se usa en FormularioItem al hacer submit.
 */
export function crearItem(datos) {
  return {
    id: crypto.randomUUID(),           // UUID generado por el navegador
    nombre: datos.nombre,
    categoriaId: datos.categoriaId,
    estado: datos.estado || 'pendiente',
    puntuacion: datos.puntuacion !== '' ? Number(datos.puntuacion) : null,
    fechaRegistro: new Date().toISOString(),
    fechaActividad: new Date().toISOString(),
    notas: datos.notas || '',
    atributos: datos.atributos || {},  // objeto JSON libre
    activo: true,
  };
}

/**
 * Devuelve solo los Items con activo === true.
 * El DELETE no borra el item; lo "archiva" cambiando activo a false.
 */
export function filtrarActivos(items) {
  return items.filter((i) => i.activo);
}

/**
 * Etiqueta legible para cada estado.
 */
export const ESTADOS = [
  { value: 'pendiente',   label: '⏳ Pendiente' },
  { value: 'en_progreso', label: '🔄 En progreso' },
  { value: 'completado',  label: '✅ Completado' },
  { value: 'archivado',   label: '📦 Archivado' },
];

/**
 * Categorías de ejemplo — personaliza según tu tema.
 */
export const CATEGORIAS = [
  { value: 'rpg',      label: '🎮 RPG' },
  { value: 'salud',    label: '🏃 Salud' },
  { value: 'estudio',  label: '📚 Estudio' },
  { value: 'hogar',    label: '🏠 Hogar' },
  { value: 'trabajo',  label: '💼 Trabajo' },
];
