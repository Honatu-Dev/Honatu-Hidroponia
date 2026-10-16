import { body } from 'express-validator';

export const upsertProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto es requerido')
    .isLength({ max: 255 })
    .withMessage('El nombre no puede superar 255 caracteres'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('La descripción es demasiado larga'),
  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('La categoría no puede superar 100 caracteres'),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ require_tld: true })
    .withMessage('La URL de la imagen no es válida')
    .isLength({ max: 500 }),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser booleano'),
  body('variants')
    .optional()
    .isArray()
    .withMessage('variants debe ser un arreglo'),
  body('variants.*.sku')
    .trim()
    .notEmpty()
    .withMessage('El SKU de la variante es requerido')
    .isLength({ max: 100 }),
  body('variants.*.price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un entero mayor o igual a 0'),
  body('variants.*.imageUrls')
    .optional()
    .isArray()
    .withMessage('imageUrls debe ser un arreglo'),
  body('variants.*.imageUrls.*')
    .optional()
    .isURL({ require_tld: true })
    .withMessage('Cada imagen debe ser una URL válida')
];

export const updateVariantValidator = [
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un entero mayor o igual a 0'),
  body('imageUrls')
    .optional()
    .isArray()
    .withMessage('imageUrls debe ser un arreglo'),
  body('attributes')
    .optional()
    .isObject()
    .withMessage('attributes debe ser un objeto')
];
