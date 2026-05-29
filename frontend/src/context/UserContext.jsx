import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario') || '{"nombre":"Ronald","preferencias":{}}');
    } catch {
      return { nombre: 'Ronald', preferencias: {} };
    }
  });

  function setNombre(nombre) {
    const next = { ...usuario, nombre };
    localStorage.setItem('usuario', JSON.stringify(next));
    setUsuario(next);
  }

  function setPreferencias(preferencias) {
    const next = { ...usuario, preferencias };
    localStorage.setItem('usuario', JSON.stringify(next));
    setUsuario(next);
  }

  return (
    <UserContext.Provider value={{ ...usuario, setNombre, setPreferencias }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de <UserProvider>');
  return ctx;
}
