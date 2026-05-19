import { ESTADOS, CATEGORIAS } from '../utils/itemUtils';

/**
 * ItemCard
 * Renderiza un solo Item con:
 * - Todos sus datos visibles.
 * - Botón "Editar" → llama onEditar(item).
 * - Botón "Archivar" → llama onArchivar(item.id).
 *   (soft delete: cambia activo a false, no borra el registro)
 */
export default function ItemCard({ item, onEditar, onArchivar }) {
  const estadoLabel = ESTADOS.find((e) => e.value === item.estado)?.label || item.estado;
  const categoriaLabel = CATEGORIAS.find((c) => c.value === item.categoriaId)?.label || item.categoriaId;

  const colorEstado = {
    pendiente: 'var(--warning)',
    en_progreso: 'var(--accent2)',
    completado: 'var(--success)',
    archivado: 'var(--text-muted)',
  }[item.estado] || 'var(--text-muted)';

  return (
    <article style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.categoria}>{categoriaLabel}</span>
        <span style={{ ...styles.badge, color: colorEstado, borderColor: colorEstado }}>
          {estadoLabel}
        </span>
      </div>

      {/* Nombre */}
      <h3 style={styles.nombre}>{item.nombre}</h3>

      {/* Meta */}
      <div style={styles.meta}>
        {item.puntuacion !== null && (
          <span>⭐ {item.puntuacion}/10</span>
        )}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          {new Date(item.fechaRegistro).toLocaleDateString('es-GT')}
        </span>
      </div>

      {/* Notas */}
      {item.notas && <p style={styles.notas}>{item.notas}</p>}

      {/* Atributos JSON */}
      {Object.keys(item.atributos || {}).length > 0 && (
        <details style={styles.details}>
          <summary style={styles.summary}>Atributos JSON</summary>
          <pre style={styles.pre}>{JSON.stringify(item.atributos, null, 2)}</pre>
        </details>
      )}

      {/* Acciones */}
      <div style={styles.acciones}>
        <button onClick={() => onEditar(item)} style={styles.btnEdit}>Editar</button>
        <button onClick={() => onArchivar(item.id)} style={styles.btnDanger}>Archivar</button>
      </div>
    </article>
  );
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    transition: 'border-color 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoria: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid',
    borderRadius: 20,
    padding: '2px 10px',
  },
  nombre: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    fontSize: '0.82rem',
  },
  notas: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    borderLeft: '3px solid var(--border)',
    paddingLeft: '0.6rem',
  },
  details: { fontSize: '0.8rem' },
  summary: { cursor: 'pointer', color: 'var(--text-muted)' },
  pre: {
    background: 'var(--surface2)',
    borderRadius: 6,
    padding: '0.5rem',
    marginTop: '0.4rem',
    overflow: 'auto',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
  },
  acciones: { display: 'flex', gap: '0.5rem', marginTop: '0.3rem' },
  btnEdit: { background: 'var(--surface2)', color: 'var(--text)', flex: 1 },
  btnDanger: { background: '#ef44441a', color: 'var(--danger)', border: '1px solid var(--danger)', flex: 1 },
};
