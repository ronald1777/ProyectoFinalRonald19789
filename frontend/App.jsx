import { useState, useEffect } from 'react';
import FormularioItem from './components/FormularioItem';
import ListaItems from './components/ListaItems';
import { filtrarActivos } from './utils/itemUtils';

export default function App() {
  // Lazy initializer: lee LocalStorage solo en el primer render
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem('items') || '[]')
  );

  // Estado para saber qué item se está editando (null = modo creación)
  const [itemEditando, setItemEditando] = useState(null);

  // ② Efecto de sincronización: persiste en LocalStorage en cada cambio
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  /** CREATE — agrega un item nuevo al array */
  function handleAgregar(nuevoItem) {
    setItems((prev) => [...prev, nuevoItem]);
  }

  /** UPDATE — reemplaza el item con el mismo id */
  function handleActualizar(itemActualizado) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemActualizado.id ? itemActualizado : i))
    );
    setItemEditando(null);
  }

  // DELETE (soft) — archiva el item: activo → false
  function handleArchivar(id) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, activo: false, fechaActividad: new Date().toISOString() } : i
      )
    );
  }

  // Solo mostramos los items con activo === true
  const itemsActivos = filtrarActivos(items);

  return (
    <div style={layout.root}>
      {/* Barra superior */}
      <header style={layout.header}>
        <span style={layout.logo}>⚡ Fase 1</span>
        <span style={layout.subtitle}>useState · useEffect · LocalStorage</span>
      </header>

      <main style={layout.main}>
        {/* Formulario de creación o edición */}
        <FormularioItem
          onAgregar={handleAgregar}
          itemEditar={itemEditando}
          onActualizar={handleActualizar}
          onCancelar={() => setItemEditando(null)}
        />

        {/* Lista de items activos */}
        <ListaItems
          items={itemsActivos}
          onEditar={setItemEditando}
          onArchivar={handleArchivar}
        />
      </main>
    </div>
  );
}

const layout = {
  root: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: { fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' },
  subtitle: { fontSize: '0.82rem', color: 'var(--text-muted)' },
  main: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2rem 1.5rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
};
