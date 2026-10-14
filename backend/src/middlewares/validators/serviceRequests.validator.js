import { body } from 'express-validator';

export const createServiceRequestValidator = [
  body('serviceType')
    .trim()
    .notEmpty()
    .withMessage('El tipo de servicio es requerido')
    .isLength({ max: 100 })
    .withMessage('El tipo de servicio no puede superar 100 caracteres'),
  body('details')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('El mensaje no puede superar 2000 caracteres'),
  body('requestedDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('La fecha solicitada debe tener formato ISO8601 válido'),
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('La ubicación no puede superar 255 caracteres'),
  body('guestName')
    .if((value, { req }) => !req.user)
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  body('guestEmail')
    .if((value, { req }) => !req.user)
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail({ all_lowercase: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('El correo es demasiado largo'),
  body('guestPhone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('El teléfono no puede superar 50 caracteres')
];

export const updateServiceRequestStatusValidator = [
  body('status')
    .isIn(['PENDING', 'REVIEW', 'ACCEPTED', 'COMPLETED', 'REJECTED'])
    .withMessage('Estado no válido')
];
