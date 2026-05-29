import { useReducer, useEffect, useRef, useMemo, useCallback, useState } from 'react';
import FormularioItem from './components/FormularioItem';
import ListaItems from './components/ListaItems';
import Graficas from './components/Graficas';
import { mangaReducer, estadoInicial } from './reducer/mangaReducer';
import { useStorage } from './context/StorageContext';
import { useTheme } from './context/ThemeContext';
import { useUser } from './context/UserContext';
import { ESTADOS } from './utils/itemUtils';
import { CATEGORIAS } from './utils/categorias';

export default function App() {
  const [state, dispatch]            = useReducer(mangaReducer, estadoInicial);
  const [itemEditando, setItemEditando] = useState(null);
  const [cargando, setCargando]      = useState(true);
  const [vistaGraficas, setVistaGraficas] = useState(false);

  const { obtenerItems, eliminarItem, modo, setModo } = useStorage();
  const { tema, toggleTema }                          = useTheme();
  const { nombre }                                    = useUser();

  const inputRef = useRef(null);

  //  Carga inicial 
  const cargarItems = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerItems();
      dispatch({ type: 'HIDRATAR', payload: data });
    } catch (err) {
      console.error('Error cargando:', err);
    } finally {
      setCargando(false);
    }
  }, [obtenerItems]);

  useEffect(() => { cargarItems(); }, [modo]);

  //  Atajos de teclado 
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); inputRef.current?.focus(); }
      if (e.key === 't' && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) toggleTema();
      if (e.key === 'g' && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) setVistaGraficas((v) => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTema]);
  const handleEditar = useCallback((item) => {
    setItemEditando(item);
  }, []);

  const handleArchivar = useCallback(async (id) => {
    await eliminarItem(id);
    dispatch({ type: 'ELIMINAR', payload: id });
    dispatch({ type: 'REGISTRAR_ACTIVIDAD', payload: { tipo: 'archivar', id } });
  }, [eliminarItem]);

  const handleCancelar = useCallback(async () => {
    setItemEditando(null);
    await cargarItems();
  }, [cargarItems]);
  const estadisticasHeader = useMemo(() => ({
    leyendo:    state.lista.filter((m) => m.estado === 'leyendo'    && m.activo !== false).length,
    completado: state.lista.filter((m) => m.estado === 'completado' && m.activo !== false).length,
  }), [state.lista]);

  return (
    <div style={layout.root}>
      {/* ── Header ── */}
      <header style={layout.header}>
        <div style={layout.logoGroup}>
          <span style={layout.logo}>📚 Manga Tracker</span>
          <span style={layout.sub}>Hola, {nombre} · Fase 3 · modo: <strong>{modo}</strong></span>
        </div>
        <div style={layout.headerRight}>
          <button onClick={() => setModo(modo === 'local' ? 'api' : 'local')}
            style={{ ...layout.modoBtn, background: modo === 'api' ? 'var(--success)' : 'var(--surface2)' }}>
            {modo === 'api' ? '☁️ API' : '💾 Local'}
          </button>
          <button onClick={toggleTema} style={layout.temaBtn} title="Atajo: T">
            {tema === 'oscuro' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
          <button onClick={() => setVistaGraficas((v) => !v)} style={layout.grafBtn} title="Atajo: G">
            {vistaGraficas ? '📋 Lista' : '📊 Gráficas'}
          </button>
          <span style={layout.pill}>📖 {estadisticasHeader.leyendo} leyendo</span>
          <span style={layout.pill}>✅ {estadisticasHeader.completado} completados</span>
        </div>
      </header>

      <main style={layout.main}>
        {/* Formulario */}
        <FormularioItem
          itemEditar={itemEditando}
          dispatch={dispatch}
          onCancelar={handleCancelar}
          inputRef={inputRef}
        />

        {/* Filtros */}
        <div style={layout.filtros}>
          {/* Búsqueda */}
          <input
            placeholder="🔍 Buscar manga…"
            value={state.busqueda}
            onChange={(e) => dispatch({ type: 'FILTRAR', payload: { busqueda: e.target.value } })}
            style={{ ...layout.searchInput }}
          />
          {/* Filtro estado */}
          {['todos', ...ESTADOS.map((e) => e.value)].map((est) => (
            <button key={est}
              onClick={() => dispatch({ type: 'FILTRAR', payload: { filtroEstado: est } })}
              style={{ ...layout.filtroBtn, background: state.filtroEstado === est ? 'var(--accent)' : 'var(--surface)', color: state.filtroEstado === est ? '#fff' : 'var(--text-muted)', borderColor: state.filtroEstado === est ? 'var(--accent)' : 'var(--border)' }}>
              {est === 'todos' ? '🗂️ Todos' : ESTADOS.find((e) => e.value === est)?.label}
            </button>
          ))}
          {/* Filtro categoría */}
          {['todas', ...CATEGORIAS.map((c) => c.id)].map((catId) => {
            const cat = CATEGORIAS.find((c) => c.id === catId);
            return (
              <button key={catId}
                onClick={() => dispatch({ type: 'FILTRAR', payload: { filtroCategoria: catId } })}
                style={{ ...layout.filtroBtn, background: state.filtroCategoria === catId ? (cat?.color || 'var(--accent)') : 'var(--surface)', color: state.filtroCategoria === catId ? '#fff' : 'var(--text-muted)', borderColor: state.filtroCategoria === catId ? (cat?.color || 'var(--accent)') : 'var(--border)' }}>
                {catId === 'todas' ? '🎌 Todas' : `${cat?.emoji} ${cat?.nombre}`}
              </button>
            );
          })}
          <button onClick={() => dispatch({ type: 'LIMPIAR_FILTROS' })} style={layout.btnLimpiar}>
            ✕ Limpiar
          </button>
        </div>

        {/* Vista principal */}
        {cargando
          ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando mangas…</p>
          : vistaGraficas
            ? <Graficas mangas={state.lista} historial={state.historial} />
            : <ListaItems
                lista={state.lista}
                filtroEstado={state.filtroEstado}
                filtroCategoria={state.filtroCategoria}
                busqueda={state.busqueda}
                onEditar={handleEditar}
                onArchivar={handleArchivar}
              />
        }
      </main>
    </div>
  );
}

const layout = {
  root: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' },
  logoGroup: { display: 'flex', alignItems: 'baseline', gap: '0.8rem' },
  logo: { fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' },
  sub: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' },
  modoBtn: { border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#fff' },
  temaBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--text)' },
  grafBtn: { background: 'var(--accent-bg)', border: '1px solid var(--accent)', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 },
  pill: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', color: 'var(--text-muted)' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  filtros: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' },
  searchInput: { borderRadius: 20, padding: '4px 14px', fontSize: '0.85rem', width: 180 },
  filtroBtn: { border: '1px solid', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' },
  btnLimpiar: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--text-muted)' },
};
