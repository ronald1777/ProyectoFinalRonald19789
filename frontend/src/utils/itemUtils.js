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

export function filtrarActivos(items) {
  return items.filter((i) => i.activo);
}
export const ESTADOS = [
  { value: 'pendiente',   label: ' Pendiente' },
  { value: 'en_progreso', label: ' En progreso' },
  { value: 'completado',  label: ' Completado' },
  { value: 'archivado',   label: ' Archivado' },
];

export const CATEGORIAS = [
  { value: 'rpg',      label: ' Extras' },
  { value: 'salud',    label: ' Salud' },
  { value: 'estudio',  label: ' Estudio' },
  { value: 'hogar',    label: ' Hogar' },
  { value: 'trabajo',  label: ' Trabajo' },
];
