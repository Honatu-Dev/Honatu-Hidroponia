import { body } from 'express-validator';

export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('La orden debe incluir al menos un artículo'),
  body('items.*.productVariantId')
    .notEmpty()
    .withMessage('El ID de la variante es requerido')
    .isUUID()
    .withMessage('El ID de la variante no es válido'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero mayor o igual a 1'),
  body('shippingAddress')
    .trim()
    .notEmpty()
    .withMessage('La dirección de envío es requerida')
    .isLength({ max: 1000 })
    .withMessage('La dirección es demasiado larga')
];

export const updateOrderStatusValidator = [
  body('status')
    .isIn(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Estado no válido')
];

export const upsertCartItemValidator = [
  body('productVariantId')
    .notEmpty()
    .withMessage('El ID de la variante es requerido')
    .isUUID()
    .withMessage('El ID de la variante no es válido'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un entero mayor o igual a 1')
];
