import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateVariant,
  deactivateProduct
} from '../controllers/products.controller.js';
import { optionalAuth, requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { handleValidationErrors } from '../middlewares/validate.js';
import {
  upsertProductValidator,
  updateVariantValidator
} from '../middlewares/validators/products.validator.js';

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Obtener el catálogo de productos con sus variantes
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos activos
 */
router.get('/', optionalAuth, getProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Obtener el detalle de un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', optionalAuth, getProductById);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Crear un producto con variantes (Solo Administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Producto creado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', requireAuth, requireAdmin, upsertProductValidator, handleValidationErrors, createProduct);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto (Solo Administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', requireAuth, requireAdmin, handleValidationErrors, updateProduct);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Desactivar un producto (Solo Administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Producto desactivado
 */
router.delete('/:id', requireAuth, requireAdmin, deactivateProduct);

/**
 * @openapi
 * /api/products/variants/{variantId}:
 *   put:
 *     summary: Actualizar precio, stock o imágenes de una variante (Solo Administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Variante actualizada
 *       404:
 *         description: Variante no encontrada
 */
router.put('/variants/:variantId', requireAuth, requireAdmin, updateVariantValidator, handleValidationErrors, updateVariant);

export default router;
