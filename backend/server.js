import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

// Rutas
// import productRoutes from './src/routes/product.routes.js';

dotenv.config();

// Conectar a Base de Datos
// (Comentado temporalmente hasta que configures PostgreSQL)
// connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middlewares de rutas
// app.use('/api/productos', productRoutes);

// Ruta básica de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Honatu Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
