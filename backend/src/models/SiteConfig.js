import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const SiteConfig = sequelize.define('SiteConfig', {
  key: { type: DataTypes.STRING, primaryKey: true },
  config: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} }
}, { timestamps: true });

export default SiteConfig;
