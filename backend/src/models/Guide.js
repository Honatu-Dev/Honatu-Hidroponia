import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Guide = sequelize.define('Guide', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING },
  summary: { type: DataTypes.TEXT },
  coverImage: { type: DataTypes.STRING },
  readCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  publishedAt: { type: DataTypes.DATEONLY },
  resources: { type: DataTypes.JSONB, defaultValue: [] } // [{ name, type, url }]
}, { timestamps: true });

export default Guide;
