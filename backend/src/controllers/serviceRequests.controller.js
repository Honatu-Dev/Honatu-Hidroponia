import { ServiceRequest, User, ClientProfile } from '../models/index.js';
import { getPagination, pagedResponse } from '../middlewares/pagination.js';

// 1. Crear una solicitud de servicio (Soporta usuarios logueados e invitados)
export const createServiceRequest = async (req, res) => {
  try {
    const { serviceType, details, requestedDate, location, guestName, guestEmail, guestPhone } = req.body;
    console.log('📝 [SERVICE REQUEST] Creando solicitud:', { serviceType, details, requestedDate, location, guestName, guestEmail });

    const requestData = {
      serviceType,
      details: details || null,
      location: location || null,
      requestedDate: requestedDate ? new Date(requestedDate) : null,
      status: 'PENDING'
    };

    if (req.user && req.user.id) {
      requestData.userId = req.user.id;
      console.log('✅ Solicitud de usuario autenticado:', req.user.id);
    } else {
      if (!guestName || !guestEmail) {
        console.log('❌ Solicitud de invitado sin datos requeridos');
        return res.status(400).json({ message: 'Para enviar la solicitud sin cuenta, requerimos tu nombre y correo' });
      }
      requestData.guestName = guestName.trim();
      requestData.guestEmail = guestEmail.toLowerCase().trim();
      requestData.guestPhone = guestPhone ? guestPhone.trim() : null;
      console.log('✅ Solicitud de invitado:', { guestName, guestEmail });
    }

    const serviceRequest = await ServiceRequest.create(requestData);
    console.log('✅ Solicitud guardada en BD:', serviceRequest.id);

    res.status(201).json({
      message: '¡Solicitud enviada con éxito!',
      serviceRequest
    });
  } catch (error) {
    console.error('❌ Error creating service request:', error.message);
    res.status(500).json({ message: 'Error en el servidor al procesar la solicitud' });
  }
};

// 2. Obtener las solicitudes del usuario autenticado actual
export const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    console.error('Error in getMyServiceRequests:', error);
    res.status(500).json({ message: 'Error al obtener tus solicitudes.' });
  }
};

// 3. Obtener todas las solicitudes (Solo Admins)
export const getAllServiceRequests = async (req, res) => {
  try {
    const options = {
      include: [
        {
          model: User,
          attributes: ['id', 'email'],
          include: [{ model: ClientProfile, attributes: ['fullName', 'phone'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    };

    const pagination = getPagination(req);
    if (pagination) {
      const result = await ServiceRequest.findAndCountAll({
        ...options,
        limit: pagination.limit,
        offset: pagination.offset,
        distinct: true
      });
      return res.json(pagedResponse(result, pagination));
    }

    const requests = await ServiceRequest.findAll(options);
    res.json(requests);
  } catch (error) {
    console.error('Error in getAllServiceRequests:', error);
    res.status(500).json({ message: 'Error al obtener las solicitudes.' });
  }
};

// 4. Actualizar el estado de una solicitud (Solo Admins)
export const updateServiceRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const serviceRequest = await ServiceRequest.findByPk(id);
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    serviceRequest.status = status;
    await serviceRequest.save();

    res.json({
      message: 'Estado actualizado',
      serviceRequest
    });
  } catch (error) {
    console.error('Error in updateServiceRequestStatus:', error);
    res.status(500).json({ message: 'Error al actualizar la solicitud.' });
  }
};
