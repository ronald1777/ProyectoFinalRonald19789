import { Router } from 'express';
import { randomUUID } from 'crypto';
import { query, toApiItem } from '../db/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT *
      FROM items
      WHERE activo = TRUE
      ORDER BY "fechaActividad" DESC, nombre ASC
    `);

    res.json(rows.map(toApiItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      id = randomUUID(),
      nombre,
      categoriaId = 'romance',
      estado = 'pendiente',
      puntuacion = null,
      fechaRegistro = new Date().toISOString(),
      fechaActividad = new Date().toISOString(),
      notas = '',
      atributos = {},
      activo = true,
    } = req.body;

    if (!nombre?.trim()) {
      return res.status(400).json({ error: 'El campo nombre es obligatorio.' });
    }

    const { rows } = await query(
      `
        INSERT INTO items (
          id, nombre, "categoriaId", estado, puntuacion,
          "fechaRegistro", "fechaActividad", notas, atributos, activo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
        RETURNING *
      `,
      [
        id,
        nombre.trim(),
        categoriaId,
        estado,
        puntuacion,
        fechaRegistro,
        fechaActividad,
        notas,
        JSON.stringify(atributos),
        activo,
      ]
    );

    res.status(201).json(toApiItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      categoriaId,
      estado,
      puntuacion,
      notas,
      atributos,
      fechaActividad = new Date().toISOString(),
    } = req.body;

    const { rows } = await query(
      `
        UPDATE items
        SET
          nombre = COALESCE($2, nombre),
          "categoriaId" = COALESCE($3, "categoriaId"),
          estado = COALESCE($4, estado),
          puntuacion = $5,
          notas = COALESCE($6, notas),
          atributos = COALESCE($7::jsonb, atributos),
          "fechaActividad" = $8
        WHERE id = $1
        RETURNING *
      `,
      [
        id,
        nombre?.trim(),
        categoriaId,
        estado,
        puntuacion ?? null,
        notas,
        atributos ? JSON.stringify(atributos) : null,
        fechaActividad,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado.' });
    }

    res.json(toApiItem(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const fechaActividad = new Date().toISOString();
    const { rows } = await query(
      `
        UPDATE items
        SET activo = FALSE, "fechaActividad" = $2
        WHERE id = $1
        RETURNING id, "fechaActividad"
      `,
      [req.params.id, fechaActividad]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado.' });
    }

    res.json({
      id: rows[0].id,
      fechaActividad: rows[0].fechaActividad?.toISOString?.() || rows[0].fechaActividad,
      mensaje: `Item ${rows[0].id} archivado correctamente.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/registro', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { rows: itemRows } = await query('SELECT id FROM items WHERE id = $1', [itemId]);

    if (itemRows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado.' });
    }

    const { valor = null, notas = '' } = req.body;
    const { rows } = await query(
      `
        INSERT INTO registros (id, "itemId", fecha, valor, notas)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, "itemId", fecha, valor, notas
      `,
      [randomUUID(), itemId, new Date().toISOString(), valor, notas]
    );

    res.status(201).json({
      id: rows[0].id,
      itemId: rows[0].itemId,
      fecha: rows[0].fecha?.toISOString?.() || rows[0].fecha,
      valor: rows[0].valor === null ? null : Number(rows[0].valor),
      notas: rows[0].notas,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
