import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { setupSwagger } from './src/config/swagger.js';

// Rutas
import authRoutes from './src/routes/auth.routes.js';
import workshopsRoutes from './src/routes/workshops.routes.js';
// import productRoutes from './src/routes/product.routes.js';

dotenv.config();

// Conectar a Base de Datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Documentación de Swagger API
setupSwagger(app);

// Middlewares de rutas
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopsRoutes);
// app.use('/api/productos', productRoutes);

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Verificar estado de salud de la API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: El servidor está operativo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Honatu Backend is running!
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Honatu Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI disponible en: http://localhost:${PORT}/api/docs`);
});
