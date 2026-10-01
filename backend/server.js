import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { setupSwagger } from './src/config/swagger.js';

// Rutas
import authRoutes from './src/routes/auth.routes.js';
import workshopsRoutes from './src/routes/workshops.routes.js';
// import productRoutes from './src/routes/product.routes.js';

dotenv.config();

// Validar variables críticas antes de levantar el servidor
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

// Conectar a Base de Datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Helmet: headers de seguridad
app.use(helmet());

// CORS restringido
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : 'http://localhost:5173';
app.use(cors({ origin: corsOrigins, credentials: true }));

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes, intenta más tarde.' }
});
app.use(generalLimiter);

// Rate limiting estricto para auth y enroll
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos, intenta más tarde.' }
});
app.use('/api/auth/login', strictLimiter);
app.use('/api/auth/register', strictLimiter);
app.use('/api/workshops/enroll', strictLimiter);

// Body parser con límite de tamaño
app.use(express.json({ limit: '100kb' }));

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const response = { message: err.message || 'Error interno del servidor' };
  if (!isProduction) {
    response.stack = err.stack;
  }
  res.status(status).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI disponible en: http://localhost:${PORT}/api/docs`);
});
