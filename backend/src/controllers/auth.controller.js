import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, ClientProfile } from '../models/index.js';

// @desc    Register a new client user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // 1. Validaciones básicas
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Por favor envía email, password y fullName.' });
    }

    // 2. Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Crear el usuario en la BD (Base Auth)
    const newUser = await User.create({
      email,
      passwordHash,
      role: 'CLIENT'
    });

    // 5. Crear el perfil del cliente (Business Data)
    await ClientProfile.create({
      userId: newUser.id,
      fullName,
      phone: phone || null
    });

    // 6. Generar JWT
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'secret_honatu_123', // ¡Recuerda poner JWT_SECRET en tu .env!
      { expiresIn: '30d' }
    );

    // 7. Responder con éxito
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName
      }
    });

  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Error del servidor al registrar usuario.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor ingresa email y contraseña.' });
    }

    // 1. Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_honatu_123',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error del servidor al iniciar sesión.' });
  }
};
