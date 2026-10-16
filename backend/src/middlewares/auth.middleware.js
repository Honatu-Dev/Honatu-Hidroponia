import jwt from 'jsonwebtoken';

// Extraer el token de las cabeceras
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

// 1. Middleware para rutas OBLIGATORIAMENTE autenticadas (ej. Mi Cuenta, Mis Pedidos)
export const requireAuth = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    console.log('❌ [AUTH] Sin token en:', req.method, req.path);
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    console.log('✅ [AUTH] Usuario autenticado:', { email: decoded.email, role: decoded.role, path: req.path });
    next();
  } catch (error) {
    console.log('❌ [AUTH] Token inválido:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// 2. Middleware para rutas OPCIONALMENTE autenticadas (ej. Inscribirse a un taller)
// Si hay token, lo valida y pone req.user. Si no hay token, simplemente avanza sin req.user.
export const optionalAuth = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      console.warn('Optional auth token invalid, proceeding as guest');
    }
  }
  next();
};

// 3. Middleware para rutas que solo Admins pueden tocar (ej. Crear Talleres, Cambiar stock)
export const requireAdmin = (req, res, next) => {
  // Primero debe estar autenticado (asumimos que requireAuth se llamó antes)
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' });
  }
  next();
};
