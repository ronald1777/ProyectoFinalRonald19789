import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'oscuro');

  useEffect(() => {
    document.body.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  function toggleTema() {
    setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}
