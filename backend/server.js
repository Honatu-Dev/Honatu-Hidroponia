import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './src/config/db.js';

dotenv.config();

// Validar variables críticas antes de levantar el servidor
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

// Conectar a Base de Datos
connectDB();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Swagger UI disponible en: http://${HOST}:${PORT}/api/docs`);
});
