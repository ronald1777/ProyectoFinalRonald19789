import { useState } from 'react';
import { crearItem, ESTADOS, CATEGORIAS } from '../utils/itemUtils';

export default function FormularioItem({ onAgregar, itemEditar, onActualizar, onCancelar }) {
  const esEdicion = Boolean(itemEditar);

  const [form, setForm] = useState(
    esEdicion
      ? {
          nombre: itemEditar.nombre,
          categoriaId: itemEditar.categoriaId,
          estado: itemEditar.estado,
          puntuacion: itemEditar.puntuacion ?? '',
          notas: itemEditar.notas || '',
          atributosRaw: JSON.stringify(itemEditar.atributos || {}, null, 2),
        }
      : {
          nombre: '',
          categoriaId: CATEGORIAS[0].value,
          estado: ESTADOS[0].value,
          puntuacion: '',
          notas: '',
          atributosRaw: '{}',
        }
  );

  const [error, setError] = useState('');

  //Actualiza un campo del formulario por nombre
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    // Validar que atributosRaw sea JSON válido
    let atributos = {};
    try {
      atributos = JSON.parse(form.atributosRaw || '{}');
    } catch {
      setError('El campo "Atributos" no es JSON válido.');
      return;
    }

    setError('');
    const datos = { ...form, atributos };

    if (esEdicion) {
      // Actualizar item existente conservando id, fechaRegistro, activo
      onActualizar({
        ...itemEditar,
        nombre: datos.nombre,
        categoriaId: datos.categoriaId,
        estado: datos.estado,
        puntuacion: datos.puntuacion !== '' ? Number(datos.puntuacion) : null,
        notas: datos.notas,
        atributos,
        fechaActividad: new Date().toISOString(),
      });
    } else {
      onAgregar(crearItem(datos));
      setForm({
        nombre: '',
        categoriaId: CATEGORIAS[0].value,
        estado: ESTADOS[0].value,
        puntuacion: '',
        notas: '',
        atributosRaw: '{}',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.titulo}>{esEdicion ? '✏️ Editar Item' : '➕ Nuevo Item'}</h2>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        <div style={styles.field}>
          <label>Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Terminar nivel 3" />
        </div>

        <div style={styles.field}>
          <label>Categoría</label>
          <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label>Puntuación (0–10)</label>
          <input
            name="puntuacion"
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={form.puntuacion}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </div>
      </div>

      <div style={styles.field}>
        <label>Notas</label>
        <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Notas libres…" />
      </div>

      <div style={styles.field}>
        <label>Atributos (JSON)</label>
        <textarea
          name="atributosRaw"
          value={form.atributosRaw}
          onChange={handleChange}
          placeholder='{"dificultad": "alta"}'
          style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
        />
      </div>

      <div style={styles.botones}>
        <button type="submit" style={styles.btnPrimary}>
          {esEdicion ? 'Guardar cambios' : 'Agregar Item'}
        </button>
        {esEdicion && (
          <button type="button" onClick={onCancelar} style={styles.btnSecondary}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  titulo: { fontSize: '1.1rem', fontWeight: 700 },
  error: {
    background: '#ef44441a',
    border: '1px solid var(--danger)',
    borderRadius: 6,
    color: 'var(--danger)',
    fontSize: '0.85rem',
    padding: '0.5rem 0.8rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.8rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  botones: { display: 'flex', gap: '0.8rem' },
  btnPrimary: { background: 'var(--accent)', color: '#fff' },
  btnSecondary: { background: 'var(--surface2)', color: 'var(--text)' },
};
