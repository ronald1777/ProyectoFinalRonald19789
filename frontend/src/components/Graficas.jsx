import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { CATEGORIAS } from '../utils/categorias';
import { ESTADOS } from '../utils/itemUtils';

/**
 * Graficas.jsx — Fase 3
 *
 * Contiene 3 gráficas con Recharts (mínimo requerido):
 *
 *  1. BarChart  — Actividad de los últimos 7 días
 *     Muestra cuántos mangas fueron modificados/agregados por día.
 *
 *  2. PieChart  — Distribución por categoría
 *     Muestra el porcentaje de mangas en cada género.
 *
 *  3. PieChart — Gráfica original: Cantidad por estado
 *     Compara cuántos mangas están leyendo, pendientes, completados o dropped.
 *     Esta es la gráfica "original propia" que pide la rúbrica.
 *
 * Todos los datos se calculan con useMemo para no recalcular en cada render.
 */
export default function Graficas({ mangas, historial }) {
  const idsVisibles = useMemo(() => new Set(mangas.map((m) => m.id)), [mangas]);

  // ── Gráfica 1: Actividad últimos 7 días ────────────────────────────────
  const datosActividad = useMemo(() => {
    const eventos = historial.length > 0
      ? historial
      : mangas.map((m) => ({
          fecha: m.fechaActividad || m.fechaRegistro,
          tipo: 'actividad',
          mangaId: m.id,
        }));

    const hoy = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - (6 - i));
      const label = dia.toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric' });
      const count = eventos.filter((h) => {
        const hFecha = new Date(h.fecha);
        return idsVisibles.has(h.mangaId) && hFecha.toDateString() === dia.toDateString();
      }).length;
      return { dia: label, actividad: count };
    });
  }, [historial, idsVisibles, mangas]);

  // ── Gráfica 2: Distribución por categoría (PieChart) ───────────────────
  const datosPie = useMemo(() => {
    const activos = mangas.filter((m) => m.activo !== false);
    return CATEGORIAS
      .map((cat) => ({
        name: `${cat.emoji} ${cat.nombre}`,
        value: activos.filter((m) => m.categoriaId === cat.id).length,
        color: cat.color,
      }))
      .filter((d) => d.value > 0);
  }, [mangas]);

  // ── Gráfica 3: Cantidad por estado (PieChart) ─────────────────────────
  const datosEstados = useMemo(() => {
    const activos = mangas.filter((m) => m.activo !== false);
    return ESTADOS
      .map((estado) => ({
        name: estado.label,
        value: activos.filter((m) => m.estado === estado.value).length,
        color: COLORES_ESTADO[estado.value],
      }))
      .filter((d) => d.value > 0);
  }, [mangas]);

  return (
    <div style={styles.contenedor}>
      <h2 style={styles.titulo}>📊 Estadísticas</h2>

      <div style={styles.grid}>

        {/* ── Gráfica 1: Actividad 7 días ── */}
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Actividad últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={datosActividad} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="actividad" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Gráfica 2: Distribución por categoría ── */}
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Distribución por categoría</h3>
          {datosPie.length === 0
            ? <p style={styles.sinDatos}>Sin datos aún</p>
            : <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={datosPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {datosPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>

        {/* ── Gráfica 3: Cantidad por estado ── */}
        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <h3 style={styles.cardTitulo}>Cantidad por estado — Gráfica original</h3>
          <p style={styles.desc}>PieChart que compara mangas leídos, pendientes, completados o dropped.</p>
          {datosEstados.length === 0
            ? <p style={styles.sinDatos}>Sin datos aún</p>
            : <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={datosEstados}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {datosEstados.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 }}
                    formatter={(v) => [v, 'Mangas']}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>

      </div>
    </div>
  );
}

const styles = {
  contenedor: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  titulo: { fontSize: '1.1rem', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  card: { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  cardTitulo: { fontSize: '0.9rem', fontWeight: 600 },
  desc: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  sinDatos: { color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' },
};

const COLORES_ESTADO = {
  leyendo: '#6c63ff',
  completado: '#22c55e',
  pendiente: '#f59e0b',
  dropped: '#ef4444',
};
