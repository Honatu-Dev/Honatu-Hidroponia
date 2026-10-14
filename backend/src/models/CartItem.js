import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'productVariantId'] }]
});

export default CartItem;