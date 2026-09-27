/* ============================================
   HONATU – Storage Middleware
   Abstraction over localStorage
   ============================================ */

export const StorageKeys = {
  CART: 'honatu-cart',
  AUTH: 'honatu-auth',
  AUTH_ROLE: 'honatu-auth-role',
  AUTH_USER: 'honatu-auth-user',
  FAVORITES: 'honatu-favs',
  ADMIN_PRODUCTS: 'honatu-admin-products',
  ADMIN_WORKSHOPS: 'honatu-admin-workshops',
  ADMIN_SERVICES: 'honatu-admin-services',
  ADMIN_GUIDES: 'honatu-admin-guides',
  FRONTEND_CONFIG: 'honatu-frontend-config',
  ADMIN_SIDEBAR_COLLAPSED: 'honatu-admin-sidebar-collapsed',
};

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getString(key) {
  return localStorage.getItem(key);
}

export function setString(key, value) {
  localStorage.setItem(key, value);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}
