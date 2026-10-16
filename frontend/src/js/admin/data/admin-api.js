/* ============================================
   HONATU – Admin API Data Layer
   Carga datos reales de la API y los mapea a las
   estructuras que usan los controladores del admin.
   ============================================ */

import { apiFetch } from '../../config.js';
import { MEXICAN_STATES } from './admin-mock-data.js';

const cache = {
  products: [],
  workshops: [],
  enrollments: [],
  services: [],
  orders: [],
  guides: [],
  siteConfig: null
};

// Acceso síncrono al último estado cargado (los loaders lo actualizan)
export const adminCache = cache;

const SERVICE_LABELS = {
  asesoria: 'Asesoría Técnica',
  insumos: 'Venta de Insumos',
  construccion: 'Construcción de Invernadero',
  talleres: 'Talleres y Capacitación',
  contacto: 'Contacto General',
  comunidad: 'Proyectos Comunitarios'
};

const STATUS_MAP = {
  PENDING: 'PENDING',
  REVIEW: 'IN_REVIEW',
  ACCEPTED: 'ACCEPTED',
  COMPLETED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

function guessState(address) {
  if (!address) return null;
  const lower = address.toLowerCase();
  return MEXICAN_STATES.find(s => lower.includes(s.toLowerCase())) || null;
}

export function mapProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category || 'Nutrientes',
    description: p.description || '',
    coverImage: p.imageUrl || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600',
    isActive: p.isActive !== false,
    variants: (p.ProductVariants || []).map(v => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price) || 0,
      stock: v.stock ?? 0,
      imageUrls: v.imageUrls || []
    }))
  };
}

export function mapEnrollment(e) {
  const profile = e.User?.ClientProfile;
  return {
    id: e.id,
    workshopId: e.workshopId,
    fullName: profile?.fullName || e.guestName || 'Invitado',
    email: e.User?.email || e.guestEmail || '',
    phone: profile?.phone || e.guestPhone || '',
    stateName: guessState(profile?.shippingAddress) || 'N/D',
    registeredAt: e.createdAt ? new Date(e.createdAt).toLocaleDateString('es-MX') : '',
    paymentStatus: e.paymentStatus || 'PENDING',
    amount: Number(e.Workshop?.price || 0)
  };
}

export function mapWorkshop(w, enrollments = []) {
  const date = w.scheduledDate ? new Date(w.scheduledDate) : null;
  const pad = n => String(n).padStart(2, '0');
  return {
    id: w.id,
    title: w.title,
    type: w.modality === 'Online' ? 'ONLINE' : 'IN_PERSON',
    date: date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '',
    time: date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : '',
    location: w.location || '',
    price: Number(w.price) || 0,
    maxCapacity: w.capacity || 0,
    description: w.description || '',
    imageUrl: w.imageUrl || '',
    status: 'PUBLISHED',
    registrations: enrollments.filter(e => e.workshopId === w.id)
  };
}

export function mapServiceRequest(s) {
  const profile = s.User?.ClientProfile;
  const requestedDate = s.requestedDate ? new Date(s.requestedDate) : null;
  return {
    id: s.id,
    clientName: profile?.fullName || s.guestName || 'Invitado',
    contactEmail: s.User?.email || s.guestEmail || '',
    contactPhone: profile?.phone || s.guestPhone || '',
    serviceType: s.serviceType === 'construccion' ? 'CONSTRUCTION' : 'ADVISORY',
    serviceTitle: SERVICE_LABELS[s.serviceType] || s.serviceType,
    requestedAt: requestedDate
      ? `Cita: ${requestedDate.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}`
      : new Date(s.createdAt).toLocaleDateString('es-MX'),
    status: STATUS_MAP[s.status] || 'PENDING',
    rawStatus: s.status,
    details: {
      location: s.location || null,
      notes: s.details || null
    },
    quote: null
  };
}

async function fetchJson(path) {
  const res = await apiFetch(path);
  if (!res.ok) throw new Error(`Error ${res.status} en ${path}`);
  return res.json();
}

export async function loadProducts(force = false) {
  if (!force && cache.products.length) return cache.products;
  const data = await fetchJson('/api/products');
  cache.products = data.map(mapProduct);
  return cache.products;
}

export async function loadWorkshops(force = false) {
  if (!force && cache.workshops.length) return cache.workshops;
  const [workshops, enrollments] = await Promise.all([
    fetchJson('/api/workshops'),
    fetchJson('/api/workshops/admin/enrollments').catch(() => [])
  ]);
  cache.enrollments = enrollments.map(mapEnrollment);

  // Agrupar inscripciones por taller una sola vez: O(e) en vez de O(w × e)
  const byWorkshop = new Map();
  cache.enrollments.forEach(e => {
    if (!byWorkshop.has(e.workshopId)) byWorkshop.set(e.workshopId, []);
    byWorkshop.get(e.workshopId).push(e);
  });
  cache.workshops = workshops.map(w => mapWorkshop(w, byWorkshop.get(w.id) || []));
  return cache.workshops;
}

export async function loadEnrollments() {
  return cache.enrollments;
}

export async function loadServices(force = false) {
  if (!force && cache.services.length) return cache.services;
  const data = await fetchJson('/api/service-requests');
  cache.services = data.map(mapServiceRequest);
  return cache.services;
}

export async function loadOrders(force = false) {
  if (!force && cache.orders.length) return cache.orders;
  const data = await fetchJson('/api/orders');
  cache.orders = data;
  return cache.orders;
}

export function mapGuide(g) {
  return {
    id: g.id,
    title: g.title,
    category: g.category || 'General',
    author: g.author || 'Equipo Agronómico Honatu',
    summary: g.summary || '',
    coverImage: g.coverImage || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600',
    isPublished: !!g.isPublished,
    readCount: g.readCount || 0,
    publishedAt: g.publishedAt || (g.createdAt ? g.createdAt.slice(0, 10) : ''),
    resources: g.resources || []
  };
}

export async function loadGuides(force = false) {
  if (!force && cache.guides.length) return cache.guides;
  const data = await fetchJson('/api/guides');
  cache.guides = data.map(mapGuide);
  return cache.guides;
}

export async function loadSiteConfig() {
  if (cache.siteConfig) return cache.siteConfig;
  cache.siteConfig = await fetchJson('/api/site-config').catch(() => ({}));
  return cache.siteConfig;
}

export async function saveSiteConfig(config) {
  const res = await apiFetch('/api/site-config', {
    method: 'PUT',
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message);
  cache.siteConfig = config;
  return config;
}

export function getStateDistribution(enrollments) {
  if (!enrollments.length) return [];
  const counts = {};
  enrollments.forEach(e => {
    const state = e.stateName && e.stateName !== 'N/D' ? e.stateName : 'Sin dato';
    counts[state] = (counts[state] || 0) + 1;
  });
  const total = enrollments.length;
  return Object.entries(counts)
    .map(([state, count]) => ({ state, count, percentage: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}
