import express from 'express';
import { getWorkshops, enrollWorkshop, createWorkshop } from '../controllers/workshops.controller.js';
import { optionalAuth, requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/workshops:
 *   get:
 *     summary: Obtener la lista completa de talleres
 *     description: Retorna todos los talleres disponibles ordenados por fecha de realización.
 *     tags: [Workshops]
 *     responses:
 *       200:
 *         description: Lista de talleres obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workshop'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getWorkshops);

/**
 * @openapi
 * /api/workshops/enroll:
 *   post:
 *     summary: Inscribirse a un taller
 *     description: Permite registrar la inscripción a un taller. Puede realizarse tanto con token JWT de usuario autenticado como en modo invitado (proporcionando nombre y correo).
 *     tags: [Workshops]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkshopEnrollmentRequest'
 *     responses:
 *       201:
 *         description: Inscripción realizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '¡Inscripción exitosa!'
 *                 enrollment:
 *                   type: object
 *       400:
 *         description: Taller lleno, usuario ya inscrito o faltan datos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Taller no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/enroll', optionalAuth, enrollWorkshop);

/**
 * @openapi
 * /api/workshops:
 *   post:
 *     summary: Crear un nuevo taller (Solo Administradores)
 *     description: Endpoint protegido para crear un taller educativo en la plataforma.
 *     tags: [Workshops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkshopRequest'
 *     responses:
 *       201:
 *         description: Taller creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Taller creado exitosamente'
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acceso denegado (requiere rol de administrador)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', requireAuth, requireAdmin, createWorkshop);

export default router;
