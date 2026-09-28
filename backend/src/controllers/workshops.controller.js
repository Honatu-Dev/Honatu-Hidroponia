import { Workshop, WorkshopEnrollment, User, ClientProfile } from '../models/index.js';

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
  try {
    const { workshopId, guestName, guestEmail, guestPhone } = req.body;

    // Verificar si el taller existe
    const workshop = await Workshop.findByPk(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: 'Taller no encontrado' });
    }

    // Verificar cupo
    const enrolledCount = await WorkshopEnrollment.count({ where: { workshopId } });
    if (enrolledCount >= workshop.capacity) {
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
      
      // Opcional: Validar que no esté ya registrado
      const existing = await WorkshopEnrollment.findOne({
        where: { workshopId, userId: req.user.id }
      });
      if (existing) {
        return res.status(400).json({ message: 'Ya estás inscrito a este taller' });
      }
    } else {
      // Es un invitado, requerimos sus datos
      if (!guestName || !guestEmail) {
        return res.status(400).json({ message: 'Para inscribirte sin cuenta, requerimos tu nombre y correo' });
      }
      
      enrollmentData.guestName = guestName;
      enrollmentData.guestEmail = guestEmail;
      enrollmentData.guestPhone = guestPhone;
      
      // Opcional: Validar que este email no esté ya registrado en este taller
      const existingGuest = await WorkshopEnrollment.findOne({
        where: { workshopId, guestEmail }
      });
      if (existingGuest) {
        return res.status(400).json({ message: 'Este correo ya está inscrito a este taller' });
      }
    }

    const enrollment = await WorkshopEnrollment.create(enrollmentData);

    res.status(201).json({
      message: '¡Inscripción exitosa!',
      enrollment
    });

  } catch (error) {
    console.error('Error in enrollWorkshop:', error);
    res.status(500).json({ message: 'Error en el servidor al procesar la inscripción' });
  }
};

// 3. Crear un nuevo taller (Solo Admins)
export const createWorkshop = async (req, res) => {
  try {
    const { title, scheduledDate, capacity, price } = req.body;
    
    // Aquí idealmente validaríamos que el usuario que hace esto es ADMIN
    // (lo haremos desde las rutas con un middleware en el futuro)
    
    const workshop = await Workshop.create({
      title,
      scheduledDate,
      capacity,
      price
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
