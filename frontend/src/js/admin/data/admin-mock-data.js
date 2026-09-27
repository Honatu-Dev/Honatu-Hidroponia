/* ============================================
   HONATU – Admin Mock Data Store
   Normalized Data Models based on diagramER.md
   ============================================ */

import { getItem, setItem, StorageKeys } from '../../middleware/storage.middleware.js';

export const MEXICAN_STATES = [
  { id: 1, name: 'Aguascalientes', code: 'AGS' },
  { id: 2, name: 'Baja California', code: 'BC' },
  { id: 3, name: 'Baja California Sur', code: 'BCS' },
  { id: 4, name: 'Campeche', code: 'CAM' },
  { id: 5, name: 'Coahuila', code: 'COA' },
  { id: 6, name: 'Colima', code: 'COL' },
  { id: 7, name: 'Chiapas', code: 'CHP' },
  { id: 8, name: 'Chihuahua', code: 'CHH' },
  { id: 9, name: 'Ciudad de México', code: 'CDMX' },
  { id: 10, name: 'Durango', code: 'DUR' },
  { id: 11, name: 'Guanajuato', code: 'GTO' },
  { id: 12, name: 'Guerrero', code: 'GRO' },
  { id: 13, name: 'Hidalgo', code: 'HID' },
  { id: 14, name: 'Jalisco', code: 'JAL' },
  { id: 15, name: 'Estado de México', code: 'MEX' },
  { id: 16, name: 'Michoacán', code: 'MIC' },
  { id: 17, name: 'Morelos', code: 'MOR' },
  { id: 18, name: 'Nayarit', code: 'NAY' },
  { id: 19, name: 'Nuevo León', code: 'NLE' },
  { id: 20, name: 'Oaxaca', code: 'OAX' },
  { id: 21, name: 'Puebla', code: 'PUE' },
  { id: 22, name: 'Querétaro', code: 'QRO' },
  { id: 23, name: 'Quintana Roo', code: 'ROO' },
  { id: 24, name: 'San Luis Potosí', code: 'SLP' },
  { id: 25, name: 'Sinaloa', code: 'SIN' },
  { id: 26, name: 'Sonora', code: 'SON' },
  { id: 27, name: 'Tabasco', code: 'TAB' },
  { id: 28, name: 'Tamaulipas', code: 'TAM' },
  { id: 29, name: 'Tlaxcala', code: 'TLA' },
  { id: 30, name: 'Veracruz', code: 'VER' },
  { id: 31, name: 'Yucatán', code: 'YUC' },
  { id: 32, name: 'Zacatecas', code: 'ZAC' },
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Solución Nutritiva A+B Hidroponía',
    slug: 'solucion-nutritiva-ab',
    category: 'Nutrientes',
    description: 'Fórmula mineral quelatada completa de grado profesional para crecimiento y floración en hidroponía.',
    coverImage: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    variants: [
      { id: 101, sku: 'HON-NUT-1L', name: 'Presentación 1 Litro', price: 280, discountPrice: 249, stock: 45, weight: 1.2 },
      { id: 102, sku: 'HON-NUT-5L', name: 'Presentación 5 Litros', price: 1150, discountPrice: 990, stock: 18, weight: 5.8 },
      { id: 103, sku: 'HON-NUT-20L', name: 'Presentación 20 Litros Garrafa', price: 3800, discountPrice: 3450, stock: 6, weight: 22.5 },
    ]
  },
  {
    id: 2,
    name: 'Sustrato Fibra de Coco Lavada y Desalinizada',
    slug: 'fibra-de-coco-premium',
    category: 'Sustratos',
    description: 'Sustrato 100% natural con excelente retención de humedad y aireación radicular óptima.',
    coverImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    variants: [
      { id: 201, sku: 'HON-COCO-10L', name: 'Bolsa 10 Litros', price: 120, discountPrice: 110, stock: 32, weight: 2.5 },
      { id: 202, sku: 'HON-COCO-50L', name: 'Bolsa 50 Litros Granel', price: 460, discountPrice: 399, stock: 14, weight: 11.0 },
    ]
  },
  {
    id: 3,
    name: 'Medidor Combo Digital pH & Electroconductividad (EC)',
    slug: 'medidor-digital-ph-ec',
    category: 'Instrumentación',
    description: 'Sonda impermeable de alta precisión con compensación automática de temperatura y calibración en 1 punto.',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    variants: [
      { id: 301, sku: 'HON-METER-PRO', name: 'Kit Completo con Buffers', price: 1250, discountPrice: 1099, stock: 9, weight: 0.4 },
    ]
  },
  {
    id: 4,
    name: 'Sistema Hidropónico NFT Modular 36 Plantas',
    slug: 'sistema-nft-36-plantas',
    category: 'Sistemas',
    description: 'Sistema vertical compacto fabricado en PVC virgen alimentario con bomba sumergible, temporizador y canastillas.',
    coverImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    variants: [
      { id: 401, sku: 'HON-NFT-36P', name: 'Sistema Estándar 36 Plazas', price: 4200, discountPrice: 3850, stock: 4, weight: 14.5 },
      { id: 402, sku: 'HON-NFT-36P-PRO', name: 'Sistema con Iluminación LED Full Spectrum', price: 6100, discountPrice: 5600, stock: 2, weight: 18.0 },
    ]
  },
  {
    id: 5,
    name: 'Bomba Sumergible de Alta Eficiencia 2500 L/h',
    slug: 'bomba-sumergible-2500lh',
    category: 'Automatización',
    description: 'Bomba silenciosa con eje cerámico de larga vida útil para sistemas de recirculación continua.',
    coverImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    variants: [
      { id: 501, sku: 'HON-PUMP-2500', name: 'Modelo 25W 2.5m Altura', price: 680, discountPrice: 590, stock: 22, weight: 1.1 },
    ]
  },
  {
    id: 6,
    name: 'Perlita Expandida Agrícola A-13',
    slug: 'perlita-expandida-agricola',
    category: 'Sustratos',
    description: 'Mineral volcánico expandido estéril, inerte y con pH neutro, ideal para mezclas de germinación.',
    coverImage: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    variants: [
      { id: 601, sku: 'HON-PERL-100L', name: 'Costal 100 Litros', price: 540, discountPrice: 480, stock: 11, weight: 8.5 },
    ]
  }
];

const INITIAL_WORKSHOPS = [
  {
    id: 1,
    title: 'Inmersión Práctica: Construcción y Manejo de Sistemas NFT',
    slug: 'taller-sistemas-nft-queretaro',
    type: 'IN_PERSON',
    date: '2026-08-22',
    time: '09:00 - 15:00',
    location: 'Invernadero Demostrativo Honatu, Querétaro, Qro.',
    price: 1850,
    maxCapacity: 20,
    status: 'PUBLISHED',
    coverImage: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80',
    description: 'Taller presencial intensivo donde armarás desde cero un sistema NFT, aprenderás a nivelar pendientes, preparar soluciones nutritivas y balancear pH.',
    registrations: [
      { id: 1001, fullName: 'Valeria Mendoza Soto', email: 'valeria.mendoza@gmail.com', phone: '442-198-4421', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-01', paymentStatus: 'PAID', amount: 1850 },
      { id: 1002, fullName: 'Carlos Eduardo Ruiz', email: 'carlos.ruiz@hotmail.com', phone: '55-3211-9876', stateId: 9, stateName: 'Ciudad de México', registeredAt: '2026-08-01', paymentStatus: 'PAID', amount: 1850 },
      { id: 1003, fullName: 'Mariana Flores Pacheco', email: 'mariana.flores@outlook.com', phone: '477-890-1234', stateId: 11, stateName: 'Guanajuato', registeredAt: '2026-08-02', paymentStatus: 'PAID', amount: 1850 },
      { id: 1004, fullName: 'Rodrigo Alarcón', email: 'rodrigo.alarcon@gmail.com', phone: '442-654-7890', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-02', paymentStatus: 'PAID', amount: 1850 },
      { id: 1005, fullName: 'Sofía Castañeda Gil', email: 'sofia.castaneda@gmail.com', phone: '722-456-7890', stateId: 15, stateName: 'Estado de México', registeredAt: '2026-08-02', paymentStatus: 'PENDING', amount: 1850 },
      { id: 1006, fullName: 'Miguel Ángel Torres', email: 'matorres@agro.mx', phone: '442-998-1122', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-03', paymentStatus: 'PAID', amount: 1850 },
      { id: 1007, fullName: 'Daniela Salgado Vega', email: 'daniela.salgado@gmail.com', phone: '55-4433-2211', stateId: 9, stateName: 'Ciudad de México', registeredAt: '2026-08-03', paymentStatus: 'PAID', amount: 1850 },
      { id: 1008, fullName: 'Fernando Gamboa', email: 'fgamboa@qro.gob.mx', phone: '442-332-1199', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-03', paymentStatus: 'PAID', amount: 1850 },
      { id: 1009, fullName: 'Andrea Ledesma', email: 'andrea.ledesma@gmail.com', phone: '442-887-6543', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-04', paymentStatus: 'PAID', amount: 1850 },
      { id: 1010, fullName: 'Javier Navarro Peña', email: 'javier.navarro@gmail.com', phone: '444-123-9876', stateId: 24, stateName: 'San Luis Potosí', registeredAt: '2026-08-04', paymentStatus: 'PENDING', amount: 1850 },
      { id: 1011, fullName: 'Paola Ortiz Gómez', email: 'paola.ortiz@gmail.com', phone: '442-776-5432', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-04', paymentStatus: 'PAID', amount: 1850 },
      { id: 1012, fullName: 'Guillermo Herrera', email: 'memo.herrera@gmail.com', phone: '477-654-3210', stateId: 11, stateName: 'Guanajuato', registeredAt: '2026-08-04', paymentStatus: 'PAID', amount: 1850 },
    ]
  },
  {
    id: 2,
    title: 'Nutrición Vegetal Avanzada: Fórmulas y Diagnóstico de CE/pH',
    slug: 'masterclass-nutricion-vegetal-online',
    type: 'ONLINE',
    date: '2026-08-29',
    time: '10:00 - 14:00',
    location: 'En vivo vía Zoom + Grabación HD y Calculadora Excel',
    price: 890,
    maxCapacity: 50,
    status: 'PUBLISHED',
    coverImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=80',
    description: 'Masterclass especializada en química de soluciones nutritivas, cálculo de iones en ppm y corrección rápida de deficiencias nutricionales.',
    registrations: [
      { id: 2001, fullName: 'Ernesto Beltrán', email: 'ernesto.beltran@gmail.com', phone: '33-1234-5678', stateId: 14, stateName: 'Jalisco', registeredAt: '2026-07-28', paymentStatus: 'PAID', amount: 890 },
      { id: 2002, fullName: 'Claudia Ibáñez', email: 'claudia.ibanez@yahoo.com', phone: '81-8765-4321', stateId: 19, stateName: 'Nuevo León', registeredAt: '2026-07-29', paymentStatus: 'PAID', amount: 890 },
      { id: 2003, fullName: 'Alejandro Morales', email: 'amorales@puebla.org', phone: '222-345-6789', stateId: 21, stateName: 'Puebla', registeredAt: '2026-07-30', paymentStatus: 'PAID', amount: 890 },
      { id: 2004, fullName: 'Beatriz Quintana', email: 'b.quintana@gmail.com', phone: '999-987-6543', stateId: 31, stateName: 'Yucatán', registeredAt: '2026-07-31', paymentStatus: 'PAID', amount: 890 },
      { id: 2005, fullName: 'Hugo Hernández', email: 'hugo.hdez@gmail.com', phone: '55-6677-8899', stateId: 9, stateName: 'Ciudad de México', registeredAt: '2026-08-01', paymentStatus: 'PAID', amount: 890 },
      { id: 2006, fullName: 'Lucía Santillán', email: 'lucia.santillan@gmail.com', phone: '664-321-4567', stateId: 2, stateName: 'Baja California', registeredAt: '2026-08-01', paymentStatus: 'PAID', amount: 890 },
      { id: 2007, fullName: 'Roberto Valdés', email: 'rvaldes@coahuila.mx', phone: '844-556-7788', stateId: 5, stateName: 'Coahuila', registeredAt: '2026-08-02', paymentStatus: 'PAID', amount: 890 },
      { id: 2008, fullName: 'Gabriela Cárdenas', email: 'gaby.cardenas@gmail.com', phone: '229-876-5432', stateId: 30, stateName: 'Veracruz', registeredAt: '2026-08-02', paymentStatus: 'PAID', amount: 890 },
      { id: 2009, fullName: 'Sergio Navarrete', email: 'sergio.nav@gmail.com', phone: '442-123-4455', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-03', paymentStatus: 'PAID', amount: 890 },
      { id: 2010, fullName: 'Lorena Domínguez', email: 'lore.dominguez@gmail.com', phone: '33-9876-1234', stateId: 14, stateName: 'Jalisco', registeredAt: '2026-08-03', paymentStatus: 'PAID', amount: 890 },
    ]
  },
  {
    id: 3,
    title: 'Manejo Integrado de Plagas y Control Biológico en Hidroponía',
    slug: 'taller-control-biologico-plagas',
    type: 'IN_PERSON',
    date: '2026-09-05',
    time: '09:00 - 14:00',
    location: 'Invernadero Demostrativo Honatu, Querétaro, Qro.',
    price: 1600,
    maxCapacity: 15,
    status: 'PUBLISHED',
    coverImage: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&auto=format&fit=crop&q=80',
    description: 'Aprende a identificar trips, mosquita blanca, araña roja y hongos fitopatógenos, aplicando biocontroladores y extractos botánicos.',
    registrations: [
      { id: 3001, fullName: 'Armando Cisneros', email: 'armando.cis@gmail.com', phone: '442-998-3344', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-01', paymentStatus: 'PAID', amount: 1600 },
      { id: 3002, fullName: 'Raquel Zamora', email: 'raquel.zamora@gmail.com', phone: '771-443-2211', stateId: 13, stateName: 'Hidalgo', registeredAt: '2026-08-02', paymentStatus: 'PAID', amount: 1600 },
      { id: 3003, fullName: 'Gonzalo Peñaloza', email: 'gonzalo.pen@gmail.com', phone: '442-112-9900', stateId: 22, stateName: 'Querétaro', registeredAt: '2026-08-03', paymentStatus: 'PAID', amount: 1600 },
      { id: 3004, fullName: 'Karla Jimena Ponce', email: 'karla.ponce@gmail.com', phone: '444-889-0011', stateId: 24, stateName: 'San Luis Potosí', registeredAt: '2026-08-04', paymentStatus: 'PENDING', amount: 1600 },
    ]
  }
];

const INITIAL_SERVICES = [
  {
    id: 1,
    clientName: 'AgroInnova del Bajío S.A. de C.V.',
    contactEmail: 'contacto@agroinnova.com.mx',
    contactPhone: '442-889-9911',
    serviceType: 'CONSTRUCTION',
    serviceTitle: 'Invernadero Multicapilla 500 m² para Tomate Cherry',
    status: 'IN_REVIEW',
    requestedAt: '2026-08-02',
    details: {
      surfaceM2: 500,
      structureType: 'Multicapilla con malla antiáfidos',
      targetCrop: 'Tomate Cherry Gourmet en Sustrato de Coco',
      location: 'Pedro Escobedo, Querétaro',
      estimatedBudget: 350000,
      notes: 'Requieren automatización completa de fertirriego y monitoreo de temperatura.'
    },
    quote: {
      totalAmount: 342000,
      validUntil: '2026-08-30',
      status: 'ISSUED',
      breakdown: [
        { concept: 'Estructura galvanizada y cubierta plástica UV', cost: 185000 },
        { concept: 'Cabezal de riego automatizado con inyección de nutrientes', cost: 78000 },
        { concept: 'Canaletas de cultivo y sustrato de coco', cost: 44000 },
        { concept: 'Instalación, puesta en marcha y capacitación', cost: 35000 },
      ]
    }
  },
  {
    id: 2,
    clientName: 'Rancho Santa María Hidropónicos',
    contactEmail: 'rsantamaria@hortalizas.com',
    contactPhone: '461-332-1100',
    serviceType: 'ADVISORY',
    serviceTitle: 'Asesoría Nutricional y Corrección de CE en Lechuga Francesa',
    status: 'PENDING',
    requestedAt: '2026-08-03',
    details: {
      modality: 'ON_SITE',
      mainTopic: 'Nutrición y Salinidad en Sistema Raíz Flotante',
      problemDescription: 'Presentan quemadura de bordes (tip burn) en hojas tiernas con temperaturas superiores a 32°C.',
      suggestedDate: '2026-08-15',
      location: 'Celaya, Guanajuato'
    }
  },
  {
    id: 3,
    clientName: 'Dra. Elena Villalobos',
    contactEmail: 'elena.villalobos@itesm.mx',
    contactPhone: '55-1987-6543',
    serviceType: 'ADVISORY',
    serviceTitle: 'Diseño de Laboratorio Hidropónico Vertical Universitario',
    status: 'ACCEPTED',
    requestedAt: '2026-07-26',
    details: {
      modality: 'ONLINE',
      mainTopic: 'Dimensionamiento de Iluminación LED y Recirculación',
      problemDescription: 'Consultoría técnica para laboratorio de investigación en agricultura protegida vertical.',
      suggestedDate: '2026-08-10',
      location: 'Campus Querétaro'
    },
    quote: {
      totalAmount: 28500,
      validUntil: '2026-08-25',
      status: 'ACCEPTED',
      breakdown: [
        { concept: 'Estudio fotométrico y espectro PAR', cost: 12500 },
        { concept: 'Planos hidráulicos y balance de flujo', cost: 9500 },
        { concept: 'Sesiones de consultoría y manual de operación', cost: 6500 },
      ]
    }
  }
];

const INITIAL_GUIDES = [
  {
    id: 1,
    title: 'Guía Maestra de Nutrición Hidropónica: Fórmulas A+B y Cálculo de PPM',
    slug: 'guia-maestra-nutricion-hidroponica-ab',
    category: 'Nutrientes',
    summary: 'Aprende los principios químicos de las soluciones concentradas madre A y B, incompatibilidades de sales y curvas de absorción.',
    coverImage: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80',
    isPublished: true,
    readCount: 1420,
    author: 'Ing. Agrónomo Honatu',
    publishedAt: '2026-06-15',
    resources: [
      { id: 1, name: 'Calculadora de Sales en PPM (Excel)', type: 'EXCEL', url: '#descarga-calculadora' },
      { id: 2, name: 'Tabla de Compatibilidad de Fertilizantes (PDF)', type: 'PDF', url: '#descarga-pdf' }
    ]
  },
  {
    id: 2,
    title: 'Guía de Sustratos Inertes: Manejo de Fibra de Coco y Perlita Agrícola',
    slug: 'guia-sustratos-fibra-coco-perlita',
    category: 'Sustratos',
    summary: 'Cómo lavar, amortiguar con calcio-magnesio y reutilizar sustratos para evitar desbalances nutricionales.',
    coverImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
    isPublished: true,
    readCount: 980,
    author: 'Equipo Técnico Honatu',
    publishedAt: '2026-07-02',
    resources: [
      { id: 3, name: 'Protocolo de Lavado y Buffer con Cal-Mag (PDF)', type: 'PDF', url: '#descarga-buffer' }
    ]
  },
  {
    id: 3,
    title: 'Automatización y Sensores IoT para el Monitoreo Continuo de pH y CE',
    slug: 'automatizacion-sensores-iot-hidroponia',
    category: 'Automatización',
    summary: 'Integración de controladores electrónicos, dosificadores peristálticos y alertas tempranas a tu teléfono móvil.',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    isPublished: false,
    readCount: 310,
    author: 'Dpto. Innovación Honatu',
    publishedAt: '2026-08-01',
    resources: [
      { id: 4, name: 'Diagrama de Cableado y Componentes Arduino/ESP32', type: 'PDF', url: '#descarga-diagrama' }
    ]
  }
];

const INITIAL_FRONTEND_CONFIG = {
  hero: {
    badge: 'TECNOLOGÍA HIDROPÓNICA PROFESIONAL',
    title: 'Cultiva el Futuro con Máxima Eficiencia',
    subtitle: 'Soluciones minerales balanceadas, sistemas automatizados de alta precisión y talleres presenciales con expertos en agricultura protegida.',
    ctaPrimaryText: 'Explorar Catálogo',
    ctaPrimaryLink: 'tienda.html',
    ctaSecondaryText: 'Ver Talleres y Cursos',
    ctaSecondaryLink: 'talleres.html',
    heroImage: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=1200&auto=format&fit=crop&q=80'
  },
  topbarNotice: {
    enabled: true,
    text: '¡Inscripciones Abiertas! Taller Presencial de Sistemas NFT en Querétaro – Cupos Limitados.',
    linkText: 'Ver Detalles →',
    linkUrl: 'talleres.html'
  },
  featured: {
    highlightProductIds: [1, 3, 4],
    highlightWorkshopId: 1
  }
};

export function getAdminProducts() {
  return getItem(StorageKeys.ADMIN_PRODUCTS, INITIAL_PRODUCTS);
}

export function saveAdminProducts(products) {
  setItem(StorageKeys.ADMIN_PRODUCTS, products);
}

export function getAdminWorkshops() {
  return getItem(StorageKeys.ADMIN_WORKSHOPS, INITIAL_WORKSHOPS);
}

export function saveAdminWorkshops(workshops) {
  setItem(StorageKeys.ADMIN_WORKSHOPS, workshops);
}

export function getAdminServices() {
  return getItem(StorageKeys.ADMIN_SERVICES, INITIAL_SERVICES);
}

export function saveAdminServices(services) {
  setItem(StorageKeys.ADMIN_SERVICES, services);
}

export function getAdminGuides() {
  return getItem(StorageKeys.ADMIN_GUIDES, INITIAL_GUIDES);
}

export function saveAdminGuides(guides) {
  setItem(StorageKeys.ADMIN_GUIDES, guides);
}

export function getFrontendConfig() {
  return getItem(StorageKeys.FRONTEND_CONFIG, INITIAL_FRONTEND_CONFIG);
}

export function saveFrontendConfig(config) {
  setItem(StorageKeys.FRONTEND_CONFIG, config);
}

// Helper to calculate state distribution of all workshop attendees
export function getAttendeeStateDistribution() {
  const workshops = getAdminWorkshops();
  const stateCounts = {};

  workshops.forEach(w => {
    (w.registrations || []).forEach(reg => {
      const stateName = reg.stateName || 'Otro Estado';
      stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;
    });
  });

  const total = Object.values(stateCounts).reduce((a, b) => a + b, 0);

  return Object.entries(stateCounts)
    .map(([state, count]) => ({
      state,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
}
