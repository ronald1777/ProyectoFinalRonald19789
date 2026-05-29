import pg from 'pg';
import { SEED_MANGAS } from './seedData.js';

const { Pool } = pg;

const projectId = process.env.SUPABASE_PROJECT_ID || 'ddhcockdfpwxjgnepbcg';
const dbPassword = process.env.SUPABASE_DB_PASSWORD;
const dbHost = process.env.SUPABASE_DB_HOST || `db.${projectId}.supabase.co`;
const dbPort = process.env.SUPABASE_DB_PORT || '5432';
const dbName = process.env.SUPABASE_DB_NAME || 'postgres';
const dbUser = process.env.SUPABASE_DB_USER || 'postgres';

function buildConnectionString() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;

  if (!dbPassword) {
    throw new Error('Falta SUPABASE_DB_PASSWORD en backend/.env');
  }

  return `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;
}

export const pool = new Pool({
  connectionString: buildConnectionString(),
  ssl: { rejectUnauthorized: false },
});

export function toApiItem(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    categoriaId: row.categoriaId,
    estado: row.estado,
    puntuacion: row.puntuacion === null ? null : Number(row.puntuacion),
    fechaRegistro: row.fechaRegistro?.toISOString?.() || row.fechaRegistro,
    fechaActividad: row.fechaActividad?.toISOString?.() || row.fechaActividad,
    notas: row.notas || '',
    atributos: row.atributos || {},
    activo: Boolean(row.activo),
  };
}

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      "categoriaId" TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendiente',
      puntuacion REAL,
      "fechaRegistro" TEXT NOT NULL,
      "fechaActividad" TEXT NOT NULL,
      notas TEXT NOT NULL DEFAULT '',
      atributos JSONB NOT NULL DEFAULT '{}'::jsonb,
      activo BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS registros (
      id TEXT PRIMARY KEY,
      "itemId" TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      fecha TEXT NOT NULL,
      valor REAL,
      notas TEXT NOT NULL DEFAULT ''
    );
  `);

  const { rows } = await query('SELECT COUNT(*)::int AS total FROM items');
  if (rows[0].total === 0) {
    await seedInitialData();
  }
}

async function seedInitialData() {
  const client = await pool.connect();
  const now = new Date().toISOString();

  try {
    await client.query('BEGIN');

    for (const item of SEED_MANGAS) {
      await client.query(
        `
          INSERT INTO items (
            id, nombre, "categoriaId", estado, puntuacion,
            "fechaRegistro", "fechaActividad", notas, atributos, activo
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
          ON CONFLICT (id) DO NOTHING
        `,
        [
          item.id,
          item.nombre,
          item.categoriaId,
          item.estado,
          item.puntuacion,
          now,
          now,
          item.notas,
          JSON.stringify(item.atributos),
          item.activo,
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`Datos iniciales cargados: ${SEED_MANGAS.length} mangas`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
