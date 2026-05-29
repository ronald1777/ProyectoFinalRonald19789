import 'dotenv/config';
import { initDatabase, pool } from './database.js';

try {
  await initDatabase();
  console.log('Base de datos lista.');
} finally {
  await pool.end();
}
