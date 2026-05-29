import { useState, useRef, useEffect } from 'react';
import { crearItem, ESTADOS } from '../utils/itemUtils';
import { CATEGORIAS } from '../utils/categorias';
import { useStorage } from '../context/StorageContext';


export default function FormularioItem({ itemEditar, dispatch, onCancelar, inputRef: externalRef }) {
  const { guardarItem } = useStorage();
  const esEdicion = Boolean(itemEditar);
  const localRef  = useRef(null);
  const inputRef  = externalRef || localRef;

  const [form, setForm] = useState(
    esEdicion
      ? { nombre: itemEditar.nombre, categoriaId: itemEditar.categoriaId, estado: itemEditar.estado, puntuacion: itemEditar.puntuacion ?? '', notas: itemEditar.notas || '', capLeidos: itemEditar.atributos?.capLeidos ?? '', capTotales: itemEditar.atributos?.capTotales ?? '', portadaUrl: itemEditar.atributos?.portadaUrl || '' }
      : { nombre: '', categoriaId: CATEGORIAS[0].id, estado: ESTADOS[0].value, puntuacion: '', notas: '', capLeidos: '', capTotales: '', portadaUrl: '' }
  );

  const [error,    setError]    = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) { setError('El título del manga es obligatorio.'); return; }
    setError('');
    setCargando(true);

    const atributos = {
      capLeidos:  form.capLeidos  !== '' ? Number(form.capLeidos)  : 0,
      capTotales: form.capTotales !== '' ? Number(form.capTotales) : 0,
      portadaUrl: form.portadaUrl.trim(),
    };

    try {
      if (esEdicion) {
        const actualizado = { ...itemEditar, nombre: form.nombre, categoriaId: form.categoriaId, estado: form.estado, puntuacion: form.puntuacion !== '' ? Number(form.puntuacion) : null, notas: form.notas, atributos, fechaActividad: new Date().toISOString() };
        await guardarItem(actualizado);
        // Despacha CAMBIAR_ESTADO si el estado cambió, y recarga
        dispatch({ type: 'REGISTRAR_ACTIVIDAD', payload: { tipo: 'editar', id: itemEditar.id } });
        onCancelar(); // señal para que App recargue
      } else {
        const nuevo = crearItem({ ...form, atributos });
        await guardarItem(nuevo);
        dispatch({ type: 'AGREGAR',             payload: nuevo });
        dispatch({ type: 'REGISTRAR_ACTIVIDAD', payload: { tipo: 'agregar', id: nuevo.id } });
        setForm({ nombre: '', categoriaId: CATEGORIAS[0].id, estado: ESTADOS[0].value, puntuacion: '', notas: '', capLeidos: '', capTotales: '', portadaUrl: '' });
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.titulo}>{esEdicion ? '✏️ Editar manga' : '➕ Agregar manga'}</h2>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        <div style={styles.field}><label>Título *</label><input ref={inputRef} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Berserk" /></div>
        <div style={styles.field}><label>Autor</label><input name="notas" value={form.notas} onChange={handleChange} placeholder="Ej: Kentaro Miura" /></div>
        <div style={styles.field}><label>Género</label><select name="categoriaId" value={form.categoriaId} onChange={handleChange}>{CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>)}</select></div>
        <div style={styles.field}><label>Estado</label><select name="estado" value={form.estado} onChange={handleChange}>{ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}</select></div>
        <div style={styles.field}><label>Caps. leídos</label><input name="capLeidos" type="number" min="0" value={form.capLeidos} onChange={handleChange} placeholder="0" /></div>
        <div style={styles.field}><label>Caps. totales</label><input name="capTotales" type="number" min="0" value={form.capTotales} onChange={handleChange} placeholder="Ej: 374" /></div>
        <div style={styles.field}><label>Puntuación (0–10)</label><input name="puntuacion" type="number" min="0" max="10" step="0.5" value={form.puntuacion} onChange={handleChange} placeholder="Opcional" /></div>
        <div style={styles.field}><label>URL portada</label><input name="portadaUrl" value={form.portadaUrl} onChange={handleChange} placeholder="https://..." /></div>
      </div>
      <div style={styles.botones}>
        <button type="submit" disabled={cargando} style={styles.btnPrimary}>{cargando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Agregar manga'}</button>
        {esEdicion && <button type="button" onClick={onCancelar} style={styles.btnSecondary}>Cancelar</button>}
      </div>
    </form>
  );
}

const styles = {
  form: { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  titulo: { fontSize: '1.1rem', fontWeight: 700 },
  error: { background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 6, color: 'var(--danger)', fontSize: '0.85rem', padding: '0.5rem 0.8rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  botones: { display: 'flex', gap: '0.8rem' },
  btnPrimary: { background: 'var(--accent)', color: '#fff' },
  btnSecondary: { background: 'var(--surface2)', color: 'var(--text)' },
};
