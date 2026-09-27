import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const WorkshopEnrollment = sequelize.define('WorkshopEnrollment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  paymentStatus: { type: DataTypes.ENUM('PENDING', 'PAID'), defaultValue: 'PENDING' }
}, { timestamps: true });

export default WorkshopEnrollment;