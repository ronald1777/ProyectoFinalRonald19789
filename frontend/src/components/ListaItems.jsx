import ItemCard from './ItemCard';

/**
 * ListaItems
 * Recibe el array de items activos y los mapea con `.map()` para renderizar
 * un <ItemCard> por cada uno.
 * También muestra el total de items y un mensaje cuando la lista está vacía.
 */
export default function ListaItems({ items, onEditar, onArchivar }) {
  return (
    <section>
      <div style={styles.header}>
        <h2 style={styles.titulo}>📋 Mis Items</h2>
        <span style={styles.conteo}>{items.length} activo{items.length !== 1 ? 's' : ''}</span>
      </div>

      {items.length === 0 ? (
        <div style={styles.vacio}>
          <p>No hay items todavía.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Agrega tu primer item usando el formulario de arriba.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  titulo: { fontSize: '1.1rem', fontWeight: 700 },
  conteo: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '3px 12px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  vacio: {
    textAlign: 'center',
    padding: '3rem 1rem',
    border: '2px dashed var(--border)',
    borderRadius: 'var(--radius)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
};
