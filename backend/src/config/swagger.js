import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Honatu Hidroponía - API REST',
    version: '1.0.0',
    description: `API Backend para la plataforma de Honatu Hidroponía.
    
Incluye endpoints para autenticación de usuarios y clientes, gestión de perfiles, inscripciones a talleres educativos y control de acceso basado en roles (JWT).`,
    contact: {
      name: 'Equipo de Desarrollo Honatu',
      url: 'https://honatu.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor local de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido tras iniciar sesión o registrarte.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Descripción del error ocurrido en la solicitud',
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'fullName'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'cliente@ejemplo.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'Password123!',
          },
          fullName: {
            type: 'string',
            example: 'María González Pérez',
          },
          phone: {
            type: 'string',
            example: '+52 55 1234 5678',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'cliente@ejemplo.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'Password123!',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Inicio de sesión exitoso / Usuario creado exitosamente',
          },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
              email: {
                type: 'string',
                format: 'email',
                example: 'cliente@ejemplo.com',
              },
              role: {
                type: 'string',
                enum: ['CLIENT', 'ADMIN'],
                example: 'CLIENT',
              },
              name: {
                type: 'string',
                example: 'María González Pérez',
              },
              fullName: {
                type: 'string',
                example: 'María González Pérez',
              },
            },
          },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'cliente@ejemplo.com',
          },
          role: {
            type: 'string',
            enum: ['CLIENT', 'ADMIN'],
            example: 'CLIENT',
          },
          name: {
            type: 'string',
            example: 'María González Pérez',
          },
          fullName: {
            type: 'string',
            example: 'María González Pérez',
          },
          phone: {
            type: 'string',
            example: '+52 55 1234 5678',
          },
          shippingAddress: {
            type: 'string',
            example: 'Av. Universidad 120, Col. Centro, Querétaro',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          fullName: {
            type: 'string',
            example: 'María González Pérez',
          },
          phone: {
            type: 'string',
            example: '+52 442 123 4567',
          },
          shippingAddress: {
            type: 'string',
            example: 'Av. Universidad 120, Col. Centro, Querétaro, Qro. CP 76000',
          },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: {
            type: 'string',
            format: 'password',
            example: 'Password123!',
          },
          newPassword: {
            type: 'string',
            format: 'password',
            example: 'NewSecurePassword456!',
          },
        },
      },
      Workshop: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '4ba3fc67-937d-41ae-8f3a-c322b7a9debf',
          },
          title: {
            type: 'string',
            example: 'Introducción a la Hidroponía Casera',
          },
          description: {
            type: 'string',
            example: 'Aprende los fundamentos para cultivar hortalizas sin tierra en tu hogar.',
          },
          scheduledDate: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-15T16:00:00.000Z',
          },
          capacity: {
            type: 'integer',
            example: 20,
          },
          price: {
            type: 'string',
            example: '350.00',
          },
          imageUrl: {
            type: 'string',
            example: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
          },
          modality: {
            type: 'string',
            enum: ['Presencial', 'Online', 'Híbrido'],
            example: 'Presencial',
          },
          agenda: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: [
              'Principios básicos de hidroponía',
              'Sistemas NFT y Raíz Flotante',
              'Nutrientes y pH del agua',
              'Práctica de armado y siembra',
            ],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      WorkshopEnrollmentRequest: {
        type: 'object',
        required: ['workshopId'],
        properties: {
          workshopId: {
            type: 'string',
            format: 'uuid',
            example: '4ba3fc67-937d-41ae-8f3a-c322b7a9debf',
          },
          guestName: {
            type: 'string',
            description: 'Requerido si no se envía token de autenticación (invitado)',
            example: 'Juan Pérez',
          },
          guestEmail: {
            type: 'string',
            format: 'email',
            description: 'Requerido si no se envía token de autenticación (invitado)',
            example: 'juan.perez@ejemplo.com',
          },
          guestPhone: {
            type: 'string',
            description: 'Opcional para invitados',
            example: '+52 55 9876 5432',
          },
        },
      },
      CreateWorkshopRequest: {
        type: 'object',
        required: ['title', 'scheduledDate', 'capacity', 'price'],
        properties: {
          title: {
            type: 'string',
            example: 'Manejo Avanzado de Soluciones Nutritivas',
          },
          description: {
            type: 'string',
            example: 'Curso intensivo sobre formulación y control de EC y pH.',
          },
          scheduledDate: {
            type: 'string',
            format: 'date-time',
            example: '2026-11-05T10:00:00.000Z',
          },
          capacity: {
            type: 'integer',
            example: 15,
          },
          price: {
            type: 'number',
            example: 499.00,
          },
          imageUrl: {
            type: 'string',
            example: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc',
          },
          modality: {
            type: 'string',
            enum: ['Presencial', 'Online', 'Híbrido'],
            example: 'Online',
          },
          agenda: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['Cálculo de sales', 'Monitoreo automatizado'],
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Operaciones de registro, inicio de sesión y gestión de perfiles de usuario',
    },
    {
      name: 'Workshops',
      description: 'Consulta, creación e inscripción a talleres educativos',
    },
    {
      name: 'Health',
      description: 'Verificación del estado del servidor',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../../server.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  // Interfaz de Swagger UI
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Honatu Hidroponía - Documentación API',
      customCss: `
        .swagger-ui .topbar { background-color: #1b4332; }
        .swagger-ui .topbar .topbar-wrapper a span { font-weight: bold; }
      `,
    })
  );

  // Endpoint para exportar la especificación en JSON
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerSpec);
  });
};
