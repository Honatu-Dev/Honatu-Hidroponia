import { validationResult, body } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map(err => ({
    field: err.path,
    msg: err.msg
  }));

  return res.status(400).json({
    message: 'Datos inválidos. Revisa los campos e intenta de nuevo.',
    errors: formatted
  });
};

export const optionalSanitizedEmail = (field = 'email') =>
  body(field)
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail({ all_lowercase: true })
    .trim();

export const requiredSanitizedEmail = (field = 'email') =>
  body(field)
    .isEmail()
    .withMessage('El correo no tiene un formato válido')
    .normalizeEmail({ all_lowercase: true })
    .trim();
