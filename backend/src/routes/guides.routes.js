import express from 'express';
import {
  getGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide
} from '../controllers/guides.controller.js';
import { optionalAuth, requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { handleValidationErrors } from '../middlewares/validate.js';
import { upsertGuideValidator } from '../middlewares/validators/guides.validator.js';

const router = express.Router();

/**
 * @openapi
 * /api/guides:
 *   get:
 *     summary: Listar guías educativas publicadas (admins ven todas)
 *     tags: [Guides]
 *     responses:
 *       200:
 *         description: Lista de guías
 */
router.get('/', optionalAuth, getGuides);

/**
 * @openapi
 * /api/guides/{id}:
 *   get:
 *     summary: Obtener una guía (incrementa su contador de lecturas)
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalle de la guía
 *       404:
 *         description: Guía no encontrada
 */
router.get('/:id', optionalAuth, getGuideById);

/**
 * @openapi
 * /api/guides:
 *   post:
 *     summary: Crear una guía educativa (Solo Administradores)
 *     tags: [Guides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Guía creada
 */
router.post('/', requireAuth, requireAdmin, upsertGuideValidator, handleValidationErrors, createGuide);

/**
 * @openapi
 * /api/guides/{id}:
 *   put:
 *     summary: Actualizar una guía (Solo Administradores)
 *     tags: [Guides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Guía actualizada
 *       404:
 *         description: Guía no encontrada
 */
router.put('/:id', requireAuth, requireAdmin, handleValidationErrors, updateGuide);

/**
 * @openapi
 * /api/guides/{id}:
 *   delete:
 *     summary: Eliminar una guía (Solo Administradores)
 *     tags: [Guides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Guía eliminada
 *       404:
 *         description: Guía no encontrada
 */
router.delete('/:id', requireAuth, requireAdmin, deleteGuide);

export default router;
