import { body } from 'express-validator';

export const enrollWorkshopValidator = [
  body('workshopId')
    .notEmpty()
    .withMessage('El ID del taller es requerido')
    .isUUID()
    .withMessage('El ID del taller no es válido')
    .trim(),
  body('guestName')
    .if((value, { req }) => !req.user)
    .trim()
    .notEmpty()
    .withMessage('El nombre del invitado es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre del invitado debe tener entre 2 y 255 caracteres'),
  body('guestEmail')
    .if((value, { req }) => !req.user)
    .isEmail()
    .withMessage('El correo del invitado no es válido')
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

export const createWorkshopValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 255 })
    .withMessage('El título no puede superar 255 caracteres'),
  body('scheduledDate')
    .notEmpty()
    .withMessage('La fecha programada es requerida')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('La fecha debe tener formato ISO8601 válido')
    .custom(value => new Date(value) > new Date())
    .withMessage('La fecha programada debe ser futura'),
  body('capacity')
    .notEmpty()
    .withMessage('El cupo es requerido')
    .isInt({ min: 1 })
    .withMessage('El cupo debe ser un entero mayor o igual a 1'),
  body('price')
    .notEmpty()
    .withMessage('El precio es requerido')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El precio debe ser un decimal válido')
    .custom(value => Number(value) >= 0)
    .withMessage('El precio no puede ser negativo'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('La descripción es demasiado larga'),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('La URL de imagen no es válida')
    .isLength({ max: 255 })
    .withMessage('La URL de imagen es demasiado larga'),
  body('modality')
    .optional({ checkFalsy: true })
    .isIn(['Presencial', 'Online', 'Híbrido'])
    .withMessage('La modalidad debe ser Presencial, Online o Híbrido'),
  body('agenda')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('La agenda debe ser un arreglo')
    .custom(value => value.every(item => typeof item === 'string' && item.length <= 255))
    .withMessage('Cada tema de la agenda debe ser texto de máximo 255 caracteres')
];
