import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  serviceType: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('PENDING', 'REVIEW', 'ACCEPTED', 'COMPLETED', 'REJECTED'), defaultValue: 'PENDING' },
  requestedDate: { type: DataTypes.DATE }
}, { timestamps: true });

export default ServiceRequest;