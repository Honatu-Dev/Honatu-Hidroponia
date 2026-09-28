import express from 'express';
import { getWorkshops, enrollWorkshop, createWorkshop } from '../controllers/workshops.controller.js';
import { optionalAuth, requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Público: Ver talleres
router.get('/', getWorkshops);

// Público / Usuario: Inscribirse a un taller (Puede recibir Token JWT, pero es opcional para invitados)
router.post('/enroll', optionalAuth, enrollWorkshop);

// Protegido: Crear talleres (Solo Admin)
router.post('/', requireAuth, requireAdmin, createWorkshop);

export default router;
