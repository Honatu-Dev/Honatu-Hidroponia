import { body } from 'express-validator';

export const upsertGuideValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 255 })
    .withMessage('El título no puede superar 255 caracteres'),
  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }),
  body('author')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }),
  body('summary')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 }),
  body('coverImage')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ require_tld: true })
    .withMessage('La URL de la imagen no es válida')
    .isLength({ max: 500 }),
  body('isPublished')
    .optional()
    .isBoolean(),
  body('resources')
    .optional()
    .isArray()
    .withMessage('resources debe ser un arreglo'),
  body('resources.*.name')
    .optional()
    .trim()
    .isLength({ max: 255 }),
  body('resources.*.url')
    .optional()
    .isLength({ max: 500 })
];

export const siteConfigValidator = [
  body()
    .isObject()
    .withMessage('La configuración debe ser un objeto JSON'),
  body('*.title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Los textos no pueden superar 255 caracteres')
];
