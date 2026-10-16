import { Order, OrderItem, ProductVariant, Product, User, ClientProfile, sequelize } from '../models/index.js';
import { getPagination, pagedResponse } from '../middlewares/pagination.js';

// 1. Crear una orden a partir de los artículos del carrito (Usuario autenticado)
export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, shippingAddress } = req.body;
    console.log('🛒 [ORDER] Creando orden para usuario:', req.user.id);
    console.log('📦 Items:', items);
    console.log('📍 Dirección de envío:', shippingAddress);

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.productVariantId, {
        include: [{ model: Product }],
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!variant || !variant.Product || !variant.Product.isActive) {
        await transaction.rollback();
        console.log('❌ Producto no disponible:', item.productVariantId);
        return res.status(400).json({ message: 'Uno de los productos ya no está disponible' });
      }

      if (variant.stock < item.quantity) {
        await transaction.rollback();
        console.log('❌ Stock insuficiente:', { producto: variant.Product.name, solicitado: item.quantity, disponible: variant.stock });
        return res.status(400).json({
          message: `Stock insuficiente para "${variant.Product.name}". Disponible: ${variant.stock}`
        });
      }

      const unitPrice = parseFloat(variant.price);
      totalAmount += unitPrice * item.quantity;
      variant.stock -= item.quantity;
      await variant.save({ transaction });
      console.log('✅ Stock actualizado:', { producto: variant.Product.name, nuevoStock: variant.stock });

      orderItemsData.push({
        productVariantId: variant.id,
        quantity: item.quantity,
        unitPrice
      });
    }

    const order = await Order.create(
      {
        userId: req.user.id,
        totalAmount: totalAmount.toFixed(2),
        shippingAddress,
        status: 'PENDING'
      },
      { transaction }
    );
    console.log('✅ Orden creada:', { orderId: order.id, total: totalAmount.toFixed(2) });

    await OrderItem.bulkCreate(
      orderItemsData.map(i => ({ ...i, orderId: order.id })),
      { transaction }
    );
    console.log('✅ Items de orden guardados:', orderItemsData.length);

    await transaction.commit();
    console.log('✅ Transacción completada exitosamente');

    const created = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [{ model: ProductVariant, include: [{ model: Product }] }] }]
    });

    res.status(201).json({ message: '¡Pedido creado con éxito!', order: created });
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({ message: 'Error en el servidor al crear el pedido' });
  }
};

// 2. Obtener las órdenes del usuario autenticado
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: ProductVariant, include: [{ model: Product, attributes: ['id', 'name', 'imageUrl'] }] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({ message: 'Error al obtener tus pedidos.' });
  }
};

// 3. Obtener todas las órdenes (Solo Admins)
export const getAllOrders = async (req, res) => {
  try {
    const pagination = getPagination(req);
    const options = {
      include: [
        { model: User, attributes: ['id', 'email'], include: [{ model: ClientProfile, attributes: ['fullName', 'phone'] }] },
        { model: OrderItem, include: [{ model: ProductVariant, include: [{ model: Product }] }] }
      ],
      order: [['createdAt', 'DESC']]
    };

    if (pagination) {
      const result = await Order.findAndCountAll({ ...options, limit: pagination.limit, offset: pagination.offset, distinct: true });
      return res.json(pagedResponse(result, pagination));
    }

    const orders = await Order.findAll(options);
    res.json(orders);
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos.' });
  }
};

// 4. Actualizar el estado de una orden (Solo Admins)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    order.status = req.body.status;
    await order.save();

    res.json({ message: 'Estado del pedido actualizado', order });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Error al actualizar el pedido.' });
  }
};
