import { Product, ProductVariant, sequelize } from '../models/index.js';
import { getPagination, pagedResponse } from '../middlewares/pagination.js';

// 1. Listar productos activos con sus variantes (Público)
//    Sin parámetros devuelve arreglo completo; con ?page&limit devuelve { items, total, page, pages }
export const getProducts = async (req, res) => {
  try {
    const where = req.user && req.user.role === 'ADMIN' ? {} : { isActive: true };
    const pagination = getPagination(req);

    if (pagination) {
      const result = await Product.findAndCountAll({
        where,
        include: [{ model: ProductVariant }],
        order: [['createdAt', 'DESC']],
        limit: pagination.limit,
        offset: pagination.offset,
        distinct: true
      });
      return res.json(pagedResponse(result, pagination));
    }

    const products = await Product.findAll({
      where,
      include: [{ model: ProductVariant }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener productos' });
  }
};

// 2. Detalle de un producto con variantes (Público)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: ProductVariant }]
    });
    if (!product || (!product.isActive && req.user?.role !== 'ADMIN')) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el producto' });
  }
};

// 3. Crear producto con variantes opcionales (Solo Admins)
export const createProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, category, imageUrl, isActive, variants } = req.body;

    const product = await Product.create(
      { name, description, category, imageUrl, isActive },
      { transaction }
    );

    if (Array.isArray(variants) && variants.length > 0) {
      await ProductVariant.bulkCreate(
        variants.map(v => ({
          sku: v.sku,
          attributes: v.attributes || null,
          price: v.price,
          stock: v.stock ?? 0,
          imageUrls: v.imageUrls || [],
          productId: product.id
        })),
        { transaction }
      );
    }

    await transaction.commit();

    const created = await Product.findByPk(product.id, { include: [{ model: ProductVariant }] });
    res.status(201).json({ message: 'Producto creado exitosamente', product: created });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating product:', error);
    if (error.name === 'SequelizeUniqueConstraintError' || error.original?.code === '23505') {
      return res.status(400).json({ message: 'Ya existe una variante con ese SKU' });
    }
    res.status(500).json({ message: 'Error en el servidor al crear el producto' });
  }
};

// 4. Actualizar producto (Solo Admins)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const { name, description, category, imageUrl, isActive } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    const updated = await Product.findByPk(product.id, { include: [{ model: ProductVariant }] });
    res.json({ message: 'Producto actualizado', product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el producto' });
  }
};

// 5. Actualizar variante (precio, stock, imágenes, atributos) (Solo Admins)
export const updateVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variante no encontrada' });
    }

    const { price, stock, imageUrls, attributes } = req.body;
    if (price !== undefined) variant.price = price;
    if (stock !== undefined) variant.stock = stock;
    if (imageUrls !== undefined) variant.imageUrls = imageUrls;
    if (attributes !== undefined) variant.attributes = attributes;

    await variant.save();
    res.json({ message: 'Variante actualizada', variant });
  } catch (error) {
    console.error('Error updating variant:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar la variante' });
  }
};

// 6. Desactivar producto (soft delete) (Solo Admins)
export const deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    product.isActive = false;
    await product.save();
    res.json({ message: 'Producto desactivado', product });
  } catch (error) {
    console.error('Error deactivating product:', error);
    res.status(500).json({ message: 'Error en el servidor al desactivar el producto' });
  }
};
