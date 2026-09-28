import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Workshop = sequelize.define('Workshop', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  scheduledDate: { type: DataTypes.DATE, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  modality: { type: DataTypes.ENUM('Presencial', 'Online', 'Híbrido'), defaultValue: 'Presencial' },
  agenda: { type: DataTypes.JSONB } // Array de strings (temas del taller)
}, { timestamps: true });

export default Workshop;