import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ClientProfile = sequelize.define('ClientProfile', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  shippingAddress: { type: DataTypes.STRING }
}, { timestamps: true });

export default ClientProfile;