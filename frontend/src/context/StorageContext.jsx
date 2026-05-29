import { createContext, useContext, useState } from 'react';
import { SEED_MANGAS } from '../utils/seedData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/items';
const LS_KEY = 'items';

function lsLeer() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_MANGAS));
    return SEED_MANGAS;
  } catch {
    return SEED_MANGAS;
  }
}

function lsGuardar(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

async function parseResponse(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || fallbackMessage);
  }
  return body;
}

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(() => localStorage.getItem('modo') || 'local');

  function setModo(nuevoModo) {
    localStorage.setItem('modo', nuevoModo);
    setModoState(nuevoModo);
  }

  async function obtenerItems() {
    if (modo === 'api') {
      const res = await fetch(API_BASE);
      return parseResponse(res, 'Error al obtener items desde Supabase');
    }

    return lsLeer().filter((item) => item.activo !== false);
  }

  async function guardarItem(item, { esNuevo = false } = {}) {
    if (modo === 'api') {
      const url = esNuevo ? API_BASE : `${API_BASE}/${item.id}`;
      const method = esNuevo ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return parseResponse(res, 'Error al guardar item en Supabase');
    }

    const items = lsLeer();
    const existe = items.findIndex((actual) => actual.id === item.id);
    const guardado = { ...item, fechaActividad: new Date().toISOString(), activo: item.activo !== false };

    if (existe >= 0) {
      items[existe] = guardado;
    } else {
      items.push(guardado);
    }

    lsGuardar(items);
    return guardado;
  }

  async function eliminarItem(id) {
    if (modo === 'api') {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      return parseResponse(res, 'Error al archivar item en Supabase');
    }

    const fechaActividad = new Date().toISOString();
    const items = lsLeer().map((item) =>
      item.id === id ? { ...item, activo: false, fechaActividad } : item
    );
    lsGuardar(items);
    return { id, fechaActividad };
  }

  return (
    <StorageContext.Provider value={{ modo, setModo, obtenerItems, guardarItem, eliminarItem }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage debe usarse dentro de <StorageProvider>');
  return ctx;
}
