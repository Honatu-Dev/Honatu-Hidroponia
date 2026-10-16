import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addCartItem,
  syncCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cart.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { handleValidationErrors } from '../middlewares/validate.js';
import { upsertCartItemValidator } from '../middlewares/validators/orders.validator.js';

const router = express.Router();

const syncCartValidator = [
  body('items')
    .isArray()
    .withMessage('items debe ser un arreglo'),
  body('items.*.productVariantId')
    .notEmpty()
    .isUUID()
    .withMessage('El ID de la variante no es válido'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero mayor o igual a 1')
];

const updateQuantityValidator = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero mayor o igual a 1')
];

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Artículos del carrito
 */
router.get('/', requireAuth, getCart);

/**
 * @openapi
 * /api/cart:
 *   post:
 *     summary: Agregar un artículo al carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Artículo agregado
 *       404:
 *         description: Producto no disponible
 */
router.post('/', requireAuth, upsertCartItemValidator, handleValidationErrors, addCartItem);

/**
 * @openapi
 * /api/cart/sync:
 *   put:
 *     summary: Reemplazar el carrito del servidor con el carrito local
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito sincronizado
 */
router.put('/sync', requireAuth, syncCartValidator, handleValidationErrors, syncCart);

/**
 * @openapi
 * /api/cart/{itemId}:
 *   put:
 *     summary: Actualizar la cantidad de un artículo del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *       404:
 *         description: Artículo no encontrado
 */
router.put('/:itemId', requireAuth, updateQuantityValidator, handleValidationErrors, updateCartItem);

/**
 * @openapi
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Eliminar un artículo del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Artículo eliminado
 */
router.delete('/:itemId', requireAuth, removeCartItem);

/**
 * @openapi
 * /api/cart:
 *   delete:
 *     summary: Vaciar el carrito completo
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete('/', requireAuth, clearCart);

export default router;
