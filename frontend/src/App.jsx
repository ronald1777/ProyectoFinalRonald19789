import { useState, useEffect, useRef, useCallback } from 'react';
import FormularioItem from './components/FormularioItem';
import ListaItems from './components/ListaItems';
import { useStorage } from './context/StorageContext';
import { useTheme } from './context/ThemeContext';
import { useUser } from './context/UserContext';
import { ESTADOS } from './utils/itemUtils';


export default function App() {
  const { obtenerItems, modo, setModo } = useStorage();
  const { tema, toggleTema }            = useTheme();
  const { nombre }                      = useUser();

  const [items, setItems]               = useState([]);
  const [itemEditando, setItemEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [cargando, setCargando]         = useState(true);
  const [ultimoGuardado, setUltimoGuardado] = useState(null);
  const [tiempoDesde, setTiempoDesde]   = useState('');

  // ── useRef #1 — foco del input título
  const inputRef = useRef(null);

  // ── useRef #2 — ID del intervalo de tiempo
  const intervalRef = useRef(null);

  // ── useRef #3 — último item de la lista (para scroll)
  const lastItemRef = useRef(null);

  // ── Cargar items ─────────────────────────────────────────────────
  const cargarItems = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerItems();
      setItems(data);
    } catch (err) {
      console.error('Error cargando items:', err);
    } finally {
      setCargando(false);
    }
  }, [obtenerItems]);

  useEffect(() => { cargarItems(); }, [modo]);

  // ── useRef #2 — intervalo de "último guardado hace X seg" ────────
  useEffect(() => {
    // Limpia el intervalo anterior antes de crear uno nuevo
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!ultimoGuardado) return;
      const segs = Math.round((Date.now() - ultimoGuardado) / 1000);
      setTiempoDesde(segs < 60 ? `hace ${segs}s` : `hace ${Math.round(segs / 60)}min`);
    }, 1000);

    // Cleanup al desmontar — patrón obligatorio de la rúbrica
    return () => clearInterval(intervalRef.current);
  }, [ultimoGuardado]);

  // ── Atajos de teclado ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Ctrl+N → foco en el input título (useRef #1)
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // T → toggle tema (solo si no estamos escribiendo en un input)
      if (e.key === 't' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
        toggleTema();
      }
    };
    window.addEventListener('keydown', handler);
    // Cleanup obligatorio
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTema]);

  // ── Después de agregar → scroll al último item (useRef #3) ────────
  function handleActualizar() {
    setItemEditando(null);
    setUltimoGuardado(Date.now());
    cargarItems().then(() => {
      setTimeout(() => lastItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    });
  }

  // Filtro por estado
  const visibles = filtroEstado === 'todos'
    ? items
    : items.filter((i) => i.estado === filtroEstado);

  const leyendo    = items.filter((i) => i.estado === 'leyendo').length;
  const completado = items.filter((i) => i.estado === 'completado').length;

  return (
    <div style={layout.root}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header style={layout.header}>
        <div style={layout.logoGroup}>
          <span style={layout.logo}>📚 Manga Tracker</span>
          <span style={layout.sub}>Hola, {nombre} · Fase 2 · modo: <strong>{modo}</strong></span>
        </div>

        <div style={layout.headerRight}>
          {/* Switch de modo API / Local */}
          <div style={layout.modoSwitch}>
            <span style={layout.modoLabel}>Modo:</span>
            <button
              onClick={() => setModo(modo === 'local' ? 'api' : 'local')}
              style={{ ...layout.modoBtn, background: modo === 'api' ? 'var(--success)' : 'var(--surface2)' }}
            >
              {modo === 'api' ? '☁️ API' : '💾 Local'}
            </button>
          </div>

          {/* Botón de tema */}
          <button onClick={toggleTema} style={layout.temaBtn} title="Atajo: T">
            {tema === 'oscuro' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>

          {/* Estadísticas */}
          <span style={layout.pill}>📖 {leyendo} leyendo</span>
          <span style={layout.pill}>✅ {completado} completados</span>
          {ultimoGuardado && <span style={layout.pill}>💾 {tiempoDesde}</span>}
        </div>
      </header>

      <main style={layout.main}>
        {/* Formulario */}
        <FormularioItem
          itemEditar={itemEditando}
          onActualizar={handleActualizar}
          onCancelar={() => setItemEditando(null)}
          inputRef={inputRef}
        />

        {/* Filtros */}
        <div style={layout.filtros}>
          {['todos', ...ESTADOS.map((e) => e.value)].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              style={{
                ...layout.filtroBtn,
                background: filtroEstado === estado ? 'var(--accent)' : 'var(--surface)',
                color: filtroEstado === estado ? '#fff' : 'var(--text-muted)',
                borderColor: filtroEstado === estado ? 'var(--accent)' : 'var(--border)',
              }}
            >
              {estado === 'todos' ? '🗂️ Todos' : ESTADOS.find((e) => e.value === estado)?.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cargando
          ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando mangas…</p>
          : <ListaItems
              items={visibles}
              onEditar={setItemEditando}
              onRecargar={handleActualizar}
              lastRef={lastItemRef}
            />
        }
      </main>
    </div>
  );
}

const layout = {
  root: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    background: 'var(--surface)', borderBottom: '1px solid var(--border)',
    padding: '0.8rem 2rem', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem',
  },
  logoGroup: { display: 'flex', alignItems: 'baseline', gap: '0.8rem' },
  logo: { fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' },
  sub: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' },
  modoSwitch: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  modoLabel: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  modoBtn: { border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#fff' },
  temaBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--text)' },
  pill: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', color: 'var(--text-muted)' },
  main: { maxWidth: 980, margin: '0 auto', padding: '2rem 1.5rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  filtros: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filtroBtn: { border: '1px solid', borderRadius: 20, padding: '4px 14px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s' },
};
