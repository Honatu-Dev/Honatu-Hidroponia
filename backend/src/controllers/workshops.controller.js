import { Workshop, WorkshopEnrollment, User, ClientProfile, sequelize } from '../models/index.js';

// 1. Obtener todos los talleres disponibles
export const getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.findAll({
      order: [['scheduledDate', 'ASC']]
    });
    res.json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener talleres' });
  }
};

// 2. Registrarse a un taller (Soporta usuarios logueados y usuarios invitados)
export const enrollWorkshop = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { workshopId, guestName, guestEmail, guestPhone } = req.body;

    // Verificar si el taller existe y bloquear la fila para evitar sobreinscripción
    const workshop = await Workshop.findByPk(workshopId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!workshop) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Taller no encontrado' });
    }

    // Verificar cupo dentro de la transacción
    const enrolledCount = await WorkshopEnrollment.count({
      where: { workshopId },
      transaction
    });
    if (enrolledCount >= workshop.capacity) {
      await transaction.rollback();
      return res.status(400).json({ message: 'El taller ya está lleno' });
    }

    const enrollmentData = {
      workshopId,
      paymentStatus: 'PENDING'
    };

    // Si el usuario está autenticado (pasó por el middleware auth), vinculamos su cuenta
    // Si no, usamos los datos de invitado
    if (req.user && req.user.id) {
      enrollmentData.userId = req.user.id;

      // Validar que no esté ya registrado
      const existing = await WorkshopEnrollment.findOne({
        where: { workshopId, userId: req.user.id },
        transaction
      });
      if (existing) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Ya estás inscrito a este taller' });
      }
    } else {
      // Es un invitado, requerimos sus datos
      if (!guestName || !guestEmail) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Para inscribirte sin cuenta, requerimos tu nombre y correo' });
      }

      enrollmentData.guestName = guestName.trim();
      enrollmentData.guestEmail = guestEmail.toLowerCase().trim();
      enrollmentData.guestPhone = guestPhone ? guestPhone.trim() : null;

      // Validar que este email no esté ya registrado en este taller
      const existingGuest = await WorkshopEnrollment.findOne({
        where: { workshopId, guestEmail: enrollmentData.guestEmail },
        transaction
      });
      if (existingGuest) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Este correo ya está inscrito a este taller' });
      }
    }

    const enrollment = await WorkshopEnrollment.create(enrollmentData, { transaction });
    await transaction.commit();

    res.status(201).json({
      message: '¡Inscripción exitosa!',
      enrollment
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error in enrollWorkshop:', error);

    if (error.name === 'SequelizeUniqueConstraintError' || error.original?.code === '23505') {
      return res.status(400).json({ message: 'Ya estás inscrito a este taller' });
    }

    res.status(500).json({ message: 'Error en el servidor al procesar la inscripción' });
  }
};

// 3. Obtener las inscripciones del usuario autenticado actual
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await WorkshopEnrollment.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Workshop,
          attributes: ['id', 'title', 'description', 'scheduledDate', 'price', 'imageUrl', 'modality']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Error in getMyEnrollments:', error);
    res.status(500).json({ message: 'Error al obtener tus inscripciones a talleres.' });
  }
};

// 4. Crear un nuevo taller (Solo Admins)
export const createWorkshop = async (req, res) => {
  try {
    const { title, scheduledDate, capacity, price, description, imageUrl, modality, agenda } = req.body;
    
    const workshop = await Workshop.create({
      title,
      description,
      scheduledDate,
      capacity,
      price,
      imageUrl,
      modality,
      agenda
    });

    res.status(201).json({
      message: 'Taller creado exitosamente',
      workshop
    });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ message: 'Error en el servidor al crear taller' });
  }
};
