import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSwagger } from './src/config/swagger.js';

// Rutas
import authRoutes from './src/routes/auth.routes.js';
import workshopsRoutes from './src/routes/workshops.routes.js';
import serviceRequestsRoutes from './src/routes/serviceRequests.routes.js';
import productsRoutes from './src/routes/products.routes.js';
import ordersRoutes from './src/routes/orders.routes.js';
import cartRoutes from './src/routes/cart.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Confía en el proxy cuando se corre detrás de Nginx/Apache en producción
app.set('trust proxy', 1);

// Helmet: headers de seguridad
app.use(helmet());

// CORS restringido, con fallback seguro para despliegues sin configurar
const corsOptions = { credentials: true };
if (process.env.CORS_ORIGIN) {
  corsOptions.origin = process.env.CORS_ORIGIN.split(',').map(s => s.trim());
} else if (isProduction) {
  console.warn('[CORS] CORS_ORIGIN no está configurado en producción. Se permite cualquier origen de forma temporal.');
  corsOptions.origin = true; // refleja el origen solicitante
} else {
  corsOptions.origin = 'http://localhost:5173';
}
app.use(cors(corsOptions));

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

// Carpeta pública para assets (logo de Swagger, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Documentación de Swagger API
setupSwagger(app);

// Middlewares de rutas
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopsRoutes);
app.use('/api/service-requests', serviceRequestsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);

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

export default app;
