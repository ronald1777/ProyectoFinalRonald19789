import { Router } from 'express';
import db from '../db/database.js';
import { randomUUID } from 'crypto';

const router = Router();


router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM items WHERE activo = 1').all();

    // Convertir atributos de string JSON → objeto
    const items = rows.map((row) => ({
      ...row,
      atributos: JSON.parse(row.atributos || '{}'),
      activo: Boolean(row.activo),
    }));

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const {
      id = randomUUID(),
      nombre,
      categoriaId = '',
      estado = 'pendiente',
      puntuacion = null,
      fechaRegistro = new Date().toISOString(),
      fechaActividad = new Date().toISOString(),
      notas = '',
      atributos = {},
      activo = true,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El campo nombre es obligatorio.' });
    }

    db.prepare(`
      INSERT INTO items (id, nombre, categoriaId, estado, puntuacion,
        fechaRegistro, fechaActividad, notas, atributos, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, nombre, categoriaId, estado, puntuacion,
      fechaRegistro, fechaActividad, notas,
      JSON.stringify(atributos),
      activo ? 1 : 0
    );

    res.status(201).json({ id, nombre, categoriaId, estado, puntuacion,
      fechaRegistro, fechaActividad, notas, atributos, activo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────────
   PUT /api/items/:id
   Actualiza los campos de un item existente.
   Solo actualiza los campos que vienen en el body.
───────────────────────────────────────────── */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);

    if (!item) return res.status(404).json({ error: 'Item no encontrado.' });

    const {
      nombre = item.nombre,
      categoriaId = item.categoriaId,
      estado = item.estado,
      puntuacion = item.puntuacion,
      notas = item.notas,
      atributos,
      fechaActividad = new Date().toISOString(),
    } = req.body;

    db.prepare(`
      UPDATE items
      SET nombre = ?, categoriaId = ?, estado = ?, puntuacion = ?,
          notas = ?, atributos = ?, fechaActividad = ?
      WHERE id = ?
    `).run(
      nombre, categoriaId, estado, puntuacion,
      notas,
      JSON.stringify(atributos ?? JSON.parse(item.atributos || '{}')),
      fechaActividad,
      id
    );

    const actualizado = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json({ ...actualizado, atributos: JSON.parse(actualizado.atributos || '{}'), activo: Boolean(actualizado.activo) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const info = db.prepare('UPDATE items SET activo = 0 WHERE id = ?').run(id);

    if (info.changes === 0) return res.status(404).json({ error: 'Item no encontrado.' });

    res.json({ mensaje: `Item ${id} archivado correctamente.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/registro', (req, res) => {
  try {
    const { id: itemId } = req.params;
    const item = db.prepare('SELECT id FROM items WHERE id = ?').get(itemId);

    if (!item) return res.status(404).json({ error: 'Item no encontrado.' });

    const {
      valor = null,
      notas = '',
    } = req.body;

    const registro = {
      id: randomUUID(),
      itemId,
      fecha: new Date().toISOString(),
      valor,
      notas,
    };

    db.prepare(`
      INSERT INTO registros (id, itemId, fecha, valor, notas)
      VALUES (?, ?, ?, ?, ?)
    `).run(registro.id, registro.itemId, registro.fecha, registro.valor, registro.notas);

    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
