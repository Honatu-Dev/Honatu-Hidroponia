import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceRequestStatus
} from '../controllers/serviceRequests.controller.js';
import { optionalAuth, requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { handleValidationErrors } from '../middlewares/validate.js';
import {
  createServiceRequestValidator,
  updateServiceRequestStatusValidator
} from '../middlewares/validators/serviceRequests.validator.js';

const router = express.Router();

// Rate limiting estricto para creación de solicitudes (formularios públicos)
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos, intenta más tarde.' }
});

/**
 * @openapi
 * /api/service-requests:
 *   post:
 *     summary: Crear una solicitud de servicio, contacto o asesoría
 *     tags:
 *       - Service Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceType
 *             properties:
 *               serviceType:
 *                 type: string
 *                 example: asesoria
 *               details:
 *                 type: string
 *               requestedDate:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               guestName:
 *                 type: string
 *               guestEmail:
 *                 type: string
 *               guestPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createLimiter, optionalAuth, createServiceRequestValidator, handleValidationErrors, createServiceRequest);

/**
 * @openapi
 * /api/service-requests/my:
 *   get:
 *     summary: Obtener las solicitudes del usuario autenticado
 *     tags:
 *       - Service Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes del usuario
 *       401:
 *         description: No autenticado
 */
router.get('/my', requireAuth, getMyServiceRequests);

/**
 * @openapi
 * /api/service-requests:
 *   get:
 *     summary: Obtener todas las solicitudes (Solo Administradores)
 *     tags:
 *       - Service Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Lista completa de solicitudes
 *       403:
 *         description: Acceso denegado
 */
router.get('/', requireAuth, requireAdmin, getAllServiceRequests);

/**
 * @openapi
 * /api/service-requests/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una solicitud (Solo Administradores)
 *     tags:
 *       - Service Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, REVIEW, ACCEPTED, COMPLETED, REJECTED]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Solicitud no encontrada
 */
router.patch('/:id/status', requireAuth, requireAdmin, updateServiceRequestStatusValidator, handleValidationErrors, updateServiceRequestStatus);

export default router;
