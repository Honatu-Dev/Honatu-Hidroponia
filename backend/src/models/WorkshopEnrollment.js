import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const WorkshopEnrollment = sequelize.define('WorkshopEnrollment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  paymentStatus: { type: DataTypes.ENUM('PENDING', 'PAID'), defaultValue: 'PENDING' },
  // Guest details (used if userId is null)
  guestName: { type: DataTypes.STRING, allowNull: true },
  guestEmail: { type: DataTypes.STRING, allowNull: true },
  guestPhone: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

export default WorkshopEnrollment;