import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ProductVariant = sequelize.define('ProductVariant', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sku: { type: DataTypes.STRING, unique: true, allowNull: false },
  attributes: { type: DataTypes.JSONB }, // e.g. { size: "large", color: "green" }
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  imageUrls: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] } // Cloudinary URLs
}, { timestamps: true });

export default ProductVariant;