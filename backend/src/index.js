import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use('/api/items', itemsRouter);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend Manga Tracker — Supabase ✅', endpoints: [
    'GET    /api/items',
    'POST   /api/items',
    'PUT    /api/items/:id',
    'DELETE /api/items/:id',
    'POST   /api/items/:id/registro',
  ]});
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log(`📦 Supabase: ${process.env.SUPABASE_URL}`);
});
