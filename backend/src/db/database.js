import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Ruta al archivo .sqlite junto a este mismo directorio
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'items.sqlite');

// Abre (o crea) la base de datos
const db = new Database(DB_PATH);

// Activa WAL para mejor rendimiento concurrente
db.pragma('journal_mode = WAL');

// Crea las tablas si no existen se ejecuta una sola vez al arrancar el servidor.

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id            TEXT PRIMARY KEY,
    nombre        TEXT NOT NULL,
    categoriaId   TEXT,
    estado        TEXT,
    puntuacion    REAL,
    fechaRegistro TEXT,
    fechaActividad TEXT,
    notas         TEXT,
    atributos     TEXT,    -- JSON serializado como string
    activo        INTEGER  -- 1 = activo, 0 = archivado (soft delete)
  );

  CREATE TABLE IF NOT EXISTS registros (
    id      TEXT PRIMARY KEY,
    itemId  TEXT NOT NULL,
    fecha   TEXT NOT NULL,
    valor   REAL,
    notas   TEXT,
    FOREIGN KEY (itemId) REFERENCES items(id)
  );
`);

export default db;
