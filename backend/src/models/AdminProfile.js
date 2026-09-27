import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AdminProfile = sequelize.define('AdminProfile', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING }
}, { timestamps: true });

export default AdminProfile;