/**
 * categorias.js
 * Catálogo de géneros de manga con emoji y color propio.
 * Se usa en FormularioItem (select), ItemCard (badge) y filtros.
 * Mínimo 5 categorías requeridas por la rúbrica.
 */
export const CATEGORIAS = [
  { id: 'romance',      nombre: 'Romance',       emoji: '💕', color: '#E8678A' },
  { id: 'fantasia',     nombre: 'Fantasía',       emoji: '🧙', color: '#7F77DD' },
  { id: 'spocon',       nombre: 'Spocon',         emoji: '🏆', color: '#EF9F27' },
  { id: 'scifi',        nombre: 'Sci-fi',         emoji: '🚀', color: '#38BDF8' },
  { id: 'slice',        nombre: 'Slice of Life',  emoji: '☕', color: '#22C55E' },
  { id: 'misterio',     nombre: 'Misterio',       emoji: '🔍', color: '#A78BFA' },
  { id: 'musica',       nombre: 'Música',         emoji: '🎵', color: '#F472B6' },
  { id: 'shonen',       nombre: 'Shonen',         emoji: '⚡', color: '#FB923C' },
];

/**
 * Devuelve la categoría por su id, o un objeto genérico si no existe.
 */
export function getCategoriaById(id) {
  return CATEGORIAS.find((c) => c.id === id) || { id, nombre: id, emoji: '📖', color: '#888' };
}
