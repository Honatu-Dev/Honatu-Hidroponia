import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, ClientProfile, AdminProfile } from '../models/index.js';

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
      { id: newUser.id, role: newUser.role, email: newUser.email },
      process.env.JWT_SECRET,
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
        name: fullName,
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

    // 1. Buscar usuario con su perfil
    const user = await User.findOne({
      where: { email },
      include: [
        { model: ClientProfile },
        { model: AdminProfile }
      ]
    });

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
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const displayName = user.ClientProfile?.fullName || user.email.split('@')[0];

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: displayName,
        fullName: displayName,
        phone: user.ClientProfile?.phone || null,
        shippingAddress: user.ClientProfile?.shippingAddress || null
      }
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error del servidor al iniciar sesión.' });
  }
};

// @desc    Get currently authenticated user details & profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] },
      include: [
        { model: ClientProfile },
        { model: AdminProfile }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const displayName = user.ClientProfile?.fullName || user.email.split('@')[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: displayName,
        fullName: displayName,
        phone: user.ClientProfile?.phone || null,
        shippingAddress: user.ClientProfile?.shippingAddress || null,
        clientProfile: user.ClientProfile,
        adminProfile: user.AdminProfile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Error al obtener datos del usuario autenticado.' });
  }
};

// @desc    Update client profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, shippingAddress } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let profile = await ClientProfile.findOne({ where: { userId: user.id } });
    if (!profile) {
      profile = await ClientProfile.create({
        userId: user.id,
        fullName: fullName || user.email.split('@')[0],
        phone: phone || null,
        shippingAddress: shippingAddress || null
      });
    } else {
      if (fullName !== undefined) profile.fullName = fullName;
      if (phone !== undefined) profile.phone = phone;
      if (shippingAddress !== undefined) profile.shippingAddress = shippingAddress;
      await profile.save();
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profile.fullName,
        fullName: profile.fullName,
        phone: profile.phone,
        shippingAddress: profile.shippingAddress
      }
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Error al actualizar información del perfil.' });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Por favor envía contraseña actual y nueva contraseña.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Error al cambiar la contraseña.' });
  }
};
