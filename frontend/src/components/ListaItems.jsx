import ItemCard from './ItemCard';
import { useTheme } from '../context/ThemeContext';

export default function ListaItems({ items, onEditar, onRecargar, lastRef }) {
  const { tema } = useTheme();

  return (
    <section>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Mi colección</h2>
        <div style={styles.headerRight}>
          <span style={styles.conteo}>{items.length} manga{items.length !== 1 ? 's' : ''}</span>
          <span style={styles.hint}>Presiona <kbd style={styles.kbd}>T</kbd> para cambiar a tema {tema === 'oscuro' ? 'claro' : 'oscuro'}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={styles.vacio}>
          <p style={{ fontSize: '2rem' }}>📭</p>
          <p>No hay mangas aquí todavía.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Agrega tu primer manga usando el formulario de arriba.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              onEditar={onEditar}
              onRecargar={onRecargar}
              isLast={index === items.length - 1}
              lastRef={lastRef}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  titulo: { fontSize: '1.1rem', fontWeight: 700 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  conteo: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '3px 12px', fontSize: '0.8rem', color: 'var(--text-muted)' },
  hint: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  kbd: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: '0.7rem', padding: '1px 6px', fontFamily: 'monospace' },
  vacio: { textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
};
