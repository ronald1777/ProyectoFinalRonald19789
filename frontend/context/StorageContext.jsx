import { createContext, useContext, useState } from 'react';
import { SEED_MANGAS } from '../utils/seedData';

const API_BASE = 'http://localhost:3000/api/items';
const LS_KEY   = 'items';

// ── Helpers de LocalStorage ───────────────────────────────────────────────

function lsLeer() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
    // Seed con los mangas reales si localStorage está vacío
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_MANGAS));
    return SEED_MANGAS;
  } catch {
    return SEED_MANGAS;
  }
}

function lsGuardar(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

// ── Context ───────────────────────────────────────────────────────────────

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(
    () => localStorage.getItem('modo') || 'local'
  );

  function setModo(nuevoModo) {
    localStorage.setItem('modo', nuevoModo);
    setModoState(nuevoModo);
  }

  // ── obtenerItems ─────────────────────────────────────────────────────────
  async function obtenerItems() {
    if (modo === 'api') {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Error al obtener items del backend');
      return res.json();
    } else {
      return lsLeer().filter((i) => i.activo);
    }
  }

  // ── guardarItem ──────────────────────────────────────────────────────────
  async function guardarItem(item) {
    if (modo === 'api') {
      const esNuevo = !item.id || item.id.length < 10;
      const url     = esNuevo ? API_BASE : `${API_BASE}/${item.id}`;
      const method  = esNuevo ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Error al guardar item en el backend');
      return res.json();
    } else {
      const items  = lsLeer();
      const existe = items.findIndex((i) => i.id === item.id);
      if (existe >= 0) {
        items[existe] = { ...item, fechaActividad: new Date().toISOString() };
      } else {
        items.push({ ...item, activo: true });
      }
      lsGuardar(items);
      return item;
    }
  }

  // ── eliminarItem ─────────────────────────────────────────────────────────
  async function eliminarItem(id) {
    if (modo === 'api') {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar item en el backend');
      return res.json();
    } else {
      const items = lsLeer().map((i) =>
        i.id === id ? { ...i, activo: false, fechaActividad: new Date().toISOString() } : i
      );
      lsGuardar(items);
    }
  }

  return (
    <StorageContext.Provider value={{ modo, setModo, obtenerItems, guardarItem, eliminarItem }}>
      {children}
    </StorageContext.Provider>
  );
}

/** Hook de conveniencia */
export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage debe usarse dentro de <StorageProvider>');
  return ctx;
}
