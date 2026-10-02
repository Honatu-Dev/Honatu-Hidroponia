import { sequelize } from '../config/db.js';

import User from './User.js';
import ClientProfile from './ClientProfile.js';
import AdminProfile from './AdminProfile.js';
import Product from './Product.js';
import ProductVariant from './ProductVariant.js';
import CartItem from './CartItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import ServiceRequest from './ServiceRequest.js';
import Workshop from './Workshop.js';
import WorkshopEnrollment from './WorkshopEnrollment.js';

// ---- ASSOCIATIONS ----

// 1. Profiles
User.hasOne(ClientProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
ClientProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(AdminProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
AdminProfile.belongsTo(User, { foreignKey: 'userId' });

// 2. Products & Variants
Product.hasMany(ProductVariant, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId' });

// 3. Cart
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });
ProductVariant.hasMany(CartItem, { foreignKey: 'productVariantId', onDelete: 'CASCADE' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId' });

// 4. Orders
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'RESTRICT' });
Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'RESTRICT' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'CASCADE' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'productVariantId', onDelete: 'RESTRICT' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId', onDelete: 'RESTRICT' });

// 5. Services
User.hasMany(ServiceRequest, { foreignKey: 'userId', onDelete: 'SET NULL' });
ServiceRequest.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });

// 6. Workshops
User.hasMany(WorkshopEnrollment, { foreignKey: 'userId', onDelete: 'SET NULL' });
WorkshopEnrollment.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });

Workshop.hasMany(WorkshopEnrollment, { foreignKey: 'workshopId', onDelete: 'CASCADE' });
WorkshopEnrollment.belongsTo(Workshop, { foreignKey: 'workshopId', onDelete: 'CASCADE' });

export {
  sequelize,
  User,
  ClientProfile,
  AdminProfile,
  Product,
  ProductVariant,
  CartItem,
  Order,
  OrderItem,
  ServiceRequest,
  Workshop,
  WorkshopEnrollment
};