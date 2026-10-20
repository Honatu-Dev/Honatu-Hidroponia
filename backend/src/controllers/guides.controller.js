import { Guide, sequelize } from '../models/index.js';
import { getPagination, pagedResponse } from '../middlewares/pagination.js';

// 1. Listar guías (público: solo publicadas; admin: todas)
export const getGuides = async (req, res) => {
  try {
    const where = req.user && req.user.role === 'ADMIN' ? {} : { isPublished: true };
    const pagination = getPagination(req);

    if (pagination) {
      const result = await Guide.findAndCountAll({
        where,
        order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
        limit: pagination.limit,
        offset: pagination.offset
      });
      return res.json(pagedResponse(result, pagination));
    }

    const guides = await Guide.findAll({
      where,
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json(guides);
  } catch (error) {
    console.error('[GUIDES] ERROR_DATABASE:', error.message);
    res.status(500).json({ message: 'Error en el servidor al obtener guías' });
  }
};

// 2. Detalle de una guía (incrementa el contador de lecturas)
export const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide || (!guide.isPublished && req.user?.role !== 'ADMIN')) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }

    await guide.increment('readCount');
    res.json(guide);
  } catch (error) {
    console.error('[GUIDES] ERROR_DATABASE:', error.message);
    res.status(500).json({ message: 'Error en el servidor al obtener la guía' });
  }
};

// 3. Crear guía (Solo Admins)
export const createGuide = async (req, res) => {
  try {
    const { title, category, author, summary, coverImage, isPublished, resources } = req.body;

    const guide = await Guide.create({
      title,
      category,
      author: author || 'Equipo Agronómico Honatu',
      summary,
      coverImage,
      isPublished: isPublished !== undefined ? isPublished : true,
      publishedAt: new Date(),
      resources: resources || []
    });

    res.status(201).json({ message: 'Guía creada exitosamente', guide });
  } catch (error) {
    console.error('[GUIDES] ERROR_DATABASE:', error.message);
    res.status(500).json({ message: 'Error en el servidor al crear la guía' });
  }
};

// 4. Actualizar guía (Solo Admins)
export const updateGuide = async (req, res) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }

    const { title, category, author, summary, coverImage, isPublished, resources } = req.body;
    if (title !== undefined) guide.title = title;
    if (category !== undefined) guide.category = category;
    if (author !== undefined) guide.author = author;
    if (summary !== undefined) guide.summary = summary;
    if (coverImage !== undefined) guide.coverImage = coverImage;
    if (isPublished !== undefined) guide.isPublished = isPublished;
    if (resources !== undefined) guide.resources = resources;

    await guide.save();
    res.json({ message: 'Guía actualizada', guide });
  } catch (error) {
    console.error('[GUIDES] ERROR_DATABASE:', error.message);
    res.status(500).json({ message: 'Error en el servidor al actualizar la guía' });
  }
};

// 5. Eliminar guía (Solo Admins)
export const deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }
    await guide.destroy();
    res.json({ message: 'Guía eliminada' });
  } catch (error) {
    console.error('[GUIDES] ERROR_DATABASE:', error.message);
    res.status(500).json({ message: 'Error en el servidor al eliminar la guía' });
  }
};
