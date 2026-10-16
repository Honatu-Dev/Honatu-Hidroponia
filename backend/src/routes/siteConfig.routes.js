import express from 'express';
import { getSiteConfig, upsertSiteConfig } from '../controllers/siteConfig.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { handleValidationErrors } from '../middlewares/validate.js';
import { siteConfigValidator } from '../middlewares/validators/guides.validator.js';

const router = express.Router();

/**
 * @openapi
 * /api/site-config:
 *   get:
 *     summary: Obtener la configuración pública del sitio (hero, topbar, destacados)
 *     tags: [Site Config]
 *     responses:
 *       200:
 *         description: Objeto de configuración del sitio
 */
router.get('/', getSiteConfig);

/**
 * @openapi
 * /api/site-config:
 *   put:
 *     summary: Guardar la configuración del sitio (Solo Administradores)
 *     tags: [Site Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración guardada
 */
router.put('/', requireAuth, requireAdmin, siteConfigValidator, handleValidationErrors, upsertSiteConfig);

export default router;
