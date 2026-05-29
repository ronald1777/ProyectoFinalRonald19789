import { useMemo } from 'react';
import ItemCard from './ItemCard';
import { CATEGORIAS } from '../utils/categorias';
import { ESTADOS } from '../utils/itemUtils';

export default function ListaItems({ lista, filtroEstado, filtroCategoria, busqueda, onEditar, onArchivar }) {
  const itemsVisibles = useMemo(() => {
    return lista
      .filter((m) => m.activo !== false)
      .filter((m) => filtroEstado    === 'todos' || m.estado      === filtroEstado)
      .filter((m) => filtroCategoria === 'todas' || m.categoriaId === filtroCategoria)
      .filter((m) => !busqueda || m.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => new Date(b.fechaActividad) - new Date(a.fechaActividad));
  }, [lista, filtroEstado, filtroCategoria, busqueda]);
  const stats = useMemo(() => ({
    total:     lista.filter((m) => m.activo !== false).length,
    leyendo:   lista.filter((m) => m.estado === 'leyendo'    && m.activo !== false).length,
    pendiente: lista.filter((m) => m.estado === 'pendiente'  && m.activo !== false).length,
    dropped:   lista.filter((m) => m.estado === 'dropped'    && m.activo !== false).length,
    completado:lista.filter((m) => m.estado === 'completado' && m.activo !== false).length,
  }), [lista]);

  return (
    <section>
      {/* Stats bar */}
      <div style={styles.statsBar}>
        <span style={styles.stat}>📚 {stats.total} total</span>
        <span style={styles.stat}>📖 {stats.leyendo} leyendo</span>
        <span style={styles.stat}>⏳ {stats.pendiente} pendiente</span>
        <span style={styles.stat}>✅ {stats.completado} completado</span>
        <span style={styles.stat}>🚫 {stats.dropped} dropped</span>
        <span style={{ ...styles.stat, marginLeft: 'auto' }}>{itemsVisibles.length} mostrados</span>
      </div>

      {itemsVisibles.length === 0 ? (
        <div style={styles.vacio}>
          <p style={{ fontSize: '2rem' }}>📭</p>
          <p>No hay mangas que coincidan con los filtros.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {itemsVisibles.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEditar={onEditar}
              onArchivar={onArchivar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  statsBar: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '0.6rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' },
  stat: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  vacio: { textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
};
