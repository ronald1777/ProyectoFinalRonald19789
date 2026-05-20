import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Parsea el body de las peticiones como JSON
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));


app.use('/api/items', itemsRouter);
// Ruta raíz de verificación ("health check")
app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend Fase 1 funcionando ✅', endpoints: [
    'GET    /api/items',
    'POST   /api/items',
    'PUT    /api/items/:id',
    'DELETE /api/items/:id',
    'POST   /api/items/:id/registro',
  ]});
});

app.listen(PORT, () => {
  console.log(`Servidor encendido en http://localhost:${PORT}`);
});
