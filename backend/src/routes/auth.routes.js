import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas base: /api/auth
router.post('/register', register);
router.post('/login', login);

export default router;
