import { CartItem, ProductVariant, Product, sequelize } from '../models/index.js';

const includeVariant = {
  model: ProductVariant,
  include: [{ model: Product, attributes: ['id', 'name', 'imageUrl'] }]
};

// 1. Obtener el carrito del usuario autenticado
export const getCart = async (req, res) => {
  try {
    const items = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [includeVariant],
      order: [['createdAt', 'ASC']]
    });
    res.json(items);
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ message: 'Error al obtener el carrito.' });
  }
};

// 2. Agregar artículo al carrito (o incrementar cantidad si ya existe)
export const addCartItem = async (req, res) => {
  try {
    const { productVariantId } = req.body;
    const quantity = req.body.quantity || 1;
    console.log('🛒 [CART] Agregando al carrito:', { userId: req.user.id, productVariantId, quantity });

    const variant = await ProductVariant.findByPk(productVariantId, { include: [{ model: Product }] });
    if (!variant || !variant.Product?.isActive) {
      console.log('❌ Producto no disponible:', productVariantId);
      return res.status(404).json({ message: 'Producto no disponible' });
    }

    const [item, created] = await CartItem.findOrCreate({
      where: { userId: req.user.id, productVariantId },
      defaults: { quantity }
    });

    if (!created) {
      item.quantity += quantity;
      await item.save();
      console.log('✅ Cantidad actualizada:', { itemId: item.id, nuevaCantidad: item.quantity });
    } else {
      console.log('✅ Nuevo item agregado:', { itemId: item.id, cantidad: quantity });
    }

    const full = await CartItem.findByPk(item.id, { include: [includeVariant] });
    res.status(created ? 201 : 200).json({ message: 'Artículo agregado al carrito', item: full });
  } catch (error) {
    console.error('❌ Error in addCartItem:', error.message);
    res.status(500).json({ message: 'Error al agregar al carrito.' });
  }
};

// 3. Reemplazar el carrito completo (sincronizar carrito local al iniciar sesión)
export const syncCart = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items } = req.body;

    await CartItem.destroy({ where: { userId: req.user.id }, transaction });

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.productVariantId, {
        include: [{ model: Product }],
        transaction
      });
      if (!variant || !variant.Product?.isActive) continue;
      await CartItem.create(
        { userId: req.user.id, productVariantId: item.productVariantId, quantity: item.quantity },
        { transaction }
      );
    }

    await transaction.commit();

    const cart = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [includeVariant],
      order: [['createdAt', 'ASC']]
    });
    res.json(cart);
  } catch (error) {
    await transaction.rollback();
    console.error('Error in syncCart:', error);
    res.status(500).json({ message: 'Error al sincronizar el carrito.' });
  }
};

// 4. Actualizar la cantidad de un artículo
export const updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findOne({
      where: { id: req.params.itemId, userId: req.user.id }
    });
    if (!item) {
      return res.status(404).json({ message: 'Artículo no encontrado en el carrito' });
    }

    item.quantity = req.body.quantity;
    await item.save();

    const full = await CartItem.findByPk(item.id, { include: [includeVariant] });
    res.json({ message: 'Cantidad actualizada', item: full });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(500).json({ message: 'Error al actualizar el carrito.' });
  }
};

// 5. Eliminar un artículo del carrito
export const removeCartItem = async (req, res) => {
  try {
    const deleted = await CartItem.destroy({
      where: { id: req.params.itemId, userId: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Artículo no encontrado en el carrito' });
    }
    res.json({ message: 'Artículo eliminado del carrito' });
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    res.status(500).json({ message: 'Error al eliminar el artículo.' });
  }
};

// 6. Vaciar el carrito
export const clearCart = async (req, res) => {
  try {
    await CartItem.destroy({ where: { userId: req.user.id } });
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error in clearCart:', error);
    res.status(500).json({ message: 'Error al vaciar el carrito.' });
  }
};
