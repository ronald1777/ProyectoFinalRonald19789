const KEY = 'items';

/** Lee todos los items desde LocalStorage. */
export function leerItems() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

/** Escribe el array completo de items en LocalStorage. */
export function guardarItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}
