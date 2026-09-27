import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'), defaultValue: 'PENDING' }
}, { timestamps: true });

export default Order;