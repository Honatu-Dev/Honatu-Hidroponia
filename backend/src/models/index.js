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
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'productVariantId' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId' });

// 5. Services
User.hasMany(ServiceRequest, { foreignKey: 'userId' });
ServiceRequest.belongsTo(User, { foreignKey: 'userId' });

// 6. Workshops
User.hasMany(WorkshopEnrollment, { foreignKey: 'userId' });
WorkshopEnrollment.belongsTo(User, { foreignKey: 'userId' });

Workshop.hasMany(WorkshopEnrollment, { foreignKey: 'workshopId' });
WorkshopEnrollment.belongsTo(Workshop, { foreignKey: 'workshopId' });

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