import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orders.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { handleValidationErrors } from '../middlewares/validate.js';
import {
  createOrderValidator,
  updateOrderStatusValidator
} from '../middlewares/validators/orders.validator.js';

const router = express.Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Crear un pedido a partir del carrito (descuenta stock)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Datos inválidos o stock insuficiente
 *       401:
 *         description: No autenticado
 */
router.post('/', requireAuth, createOrderValidator, handleValidationErrors, createOrder);

/**
 * @openapi
 * /api/orders/my:
 *   get:
 *     summary: Obtener los pedidos del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 */
router.get('/my', requireAuth, getMyOrders);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Obtener todos los pedidos (Solo Administradores)
 *     tags: [Orders]
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
 *         description: Lista completa de pedidos
 */
router.get('/', requireAuth, requireAdmin, getAllOrders);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de un pedido (Solo Administradores)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Pedido no encontrado
 */
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatusValidator, handleValidationErrors, updateOrderStatus);

export default router;
