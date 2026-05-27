import { useRef } from 'react';
import { ESTADOS, calcularProgreso, COLOR_ESTADO } from '../utils/itemUtils';
import { getCategoriaById } from '../utils/categorias';
import { useStorage } from '../context/StorageContext';

export default function ItemCard({ item, onEditar, onRecargar, isLast, lastRef }) {
  const { eliminarItem } = useStorage();
  const categoria = getCategoriaById(item.categoriaId);

  const estadoLabel = ESTADOS.find((e) => e.value === item.estado)?.label || item.estado;
  const { capLeidos = 0, capTotales = 0, portadaUrl = '' } = item.atributos || {};
  const progreso   = calcularProgreso(item.atributos);
  const colorBarra = COLOR_ESTADO[item.estado] || 'var(--accent)';

  const colorBadge = {
    leyendo:    { color: 'var(--accent)',   bg: 'var(--accent-bg)' },
    completado: { color: 'var(--success)',  bg: 'var(--success-bg)' },
    pendiente:  { color: 'var(--warning)',  bg: 'var(--warning-bg)' },
    dropped:    { color: 'var(--danger)',   bg: 'var(--danger-bg)' },
  }[item.estado] || { color: 'var(--text-muted)', bg: 'transparent' };

  async function handleArchivar() {
    await eliminarItem(item.id);
    onRecargar();
  }

  return (
    // useRef #3 (scroll) — lastRef llega del padre; se adjunta al último card
    <article ref={isLast ? lastRef : null} style={styles.card}>

      {/* Portada */}
      <div style={styles.coverWrap}>
        {portadaUrl
          ? <img src={portadaUrl} alt={item.nombre} style={styles.coverImg}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          : null}
        <div style={{ ...styles.coverFallback, display: portadaUrl ? 'none' : 'flex' }}>📚</div>
        <span style={{ ...styles.estadoBadge, color: colorBadge.color, background: colorBadge.bg }}>
          {estadoLabel}
        </span>
      </div>

      {/* Cuerpo */}
      <div style={styles.body}>
        <h3 style={styles.titulo}>{item.nombre}</h3>
        {item.notas && <p style={styles.autor}>{item.notas}</p>}

        {/* Badge de categoría con color propio */}
        <span style={{ ...styles.genero, background: categoria.color + '22', color: categoria.color }}>
          {categoria.emoji} {categoria.nombre}
        </span>

        {item.puntuacion !== null && item.puntuacion !== undefined && (
          <p style={styles.puntuacion}>⭐ {item.puntuacion} / 10</p>
        )}

        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>
            <span>Progreso</span>
            <span>{capLeidos} / {capTotales || '?'} — {progreso}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progreso}%`, background: colorBarra }} />
          </div>
        </div>

        <p style={styles.fecha}>Agregado: {new Date(item.fechaRegistro).toLocaleDateString('es-GT')}</p>
      </div>

      <div style={styles.acciones}>
        <button onClick={() => onEditar(item)} style={styles.btnEdit}>Editar</button>
        <button onClick={handleArchivar} style={styles.btnDanger}>Archivar</button>
      </div>
    </article>
  );
}

const styles = {
  card: { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  coverWrap: { position: 'relative', height: 160, background: 'var(--surface2)', overflow: 'hidden' },
  coverImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  coverFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' },
  estadoBadge: { position: 'absolute', top: 8, right: 8, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 },
  body: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
  titulo: { fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 },
  autor: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  genero: { fontSize: '0.7rem', fontWeight: 700, borderRadius: 20, padding: '2px 10px', alignSelf: 'flex-start' },
  puntuacion: { fontSize: '0.85rem' },
  progressSection: { marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' },
  progressBar: { height: 6, background: 'var(--surface2)', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6, transition: 'width 0.3s' },
  fecha: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' },
  acciones: { display: 'flex', gap: '0.5rem', padding: '0.8rem 1rem', borderTop: '1px solid var(--border)' },
  btnEdit: { background: 'var(--surface2)', color: 'var(--text)', flex: 1 },
  btnDanger: { background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger)', flex: 1 },
};
