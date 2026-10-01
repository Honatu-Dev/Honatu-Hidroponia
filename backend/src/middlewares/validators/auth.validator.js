import { body } from 'express-validator';

const passwordRules = (field = 'password', min = 8) =>
  body(field)
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min })
    .withMessage(`La contraseña debe tener al menos ${min} caracteres`)
    .trim();

export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('El nombre completo es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  body('email')
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail({ all_lowercase: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('El correo es demasiado largo'),
  passwordRules('password', 8),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('El teléfono no puede superar 50 caracteres')
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail({ all_lowercase: true })
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .trim()
];

export const updateProfileValidator = [
  body('fullName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('El teléfono no puede superar 50 caracteres'),
  body('shippingAddress')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La dirección de envío es demasiado larga')
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida')
    .trim(),
  passwordRules('newPassword', 8)
];
