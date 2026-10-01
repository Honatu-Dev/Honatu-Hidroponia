/* ============================================
   HONATU – Auth Controller
   Authentication & Interactive Modal System
   ============================================ */

import logoImg from '../../assets/logo/Logo.png';
import { getItem, setItem, removeItem, getString, setString, StorageKeys } from '../middleware/storage.middleware.js';
import { showToast } from '../middleware/toast.middleware.js';
import { apiFetch } from '../config.js';

let isAuthenticated = getString(StorageKeys.AUTH) === 'true';
let authRole = getString(StorageKeys.AUTH_ROLE) || 'CLIENT';
let authUser = getItem(StorageKeys.AUTH_USER, { name: 'Cultivador Honatu', email: 'cliente@honatu.com', role: 'CLIENT' });
let pendingAuthCallback = null;
let pendingRedirectUrl = null;

export function getIsAuthenticated() {
  return getString(StorageKeys.AUTH) === 'true';
}

export function getAuthRole() {
  return getString(StorageKeys.AUTH_ROLE) || (getIsAuthenticated() ? 'CLIENT' : null);
}

export function getAuthUser() {
  return getItem(StorageKeys.AUTH_USER, { name: 'Cultivador Honatu', email: 'cliente@honatu.com', role: getAuthRole() });
}

export function isAdmin() {
  return getIsAuthenticated() && getAuthRole() === 'ADMIN';
}

import { resolveRelativePath } from '../components/footer.component.js';

export function getAdminUrl() {
  return resolveRelativePath('pages/admin/admin.html');
}

export function getLoginUrl() {
  return resolveRelativePath('pages/auth/login.html');
}

export function getClientHomeUrl() {
  return resolveRelativePath('index.html');
}

export function getClientAccountUrl() {
  return resolveRelativePath('pages/auth/account.html');
}

export function logout(customRedirect = null, notify = true) {
  localStorage.removeItem('honatu_token');
  removeItem(StorageKeys.AUTH);
  removeItem(StorageKeys.AUTH_ROLE);
  removeItem(StorageKeys.AUTH_USER);
  isAuthenticated = false;
  authRole = null;
  authUser = null;

  updateNavbarUserState(null);

  if (notify) {
    showToast("Has cerrado sesión exitosamente.");
  }

  setTimeout(() => {
    if (customRedirect) {
      window.location.href = customRedirect;
    } else {
      window.location.href = getLoginUrl();
    }
  }, notify ? 400 : 0);
}

export function updateNavbarUserState(user) {
  const toggles = document.querySelectorAll('#userLoginToggle, .nav-user-toggle');
  toggles.forEach(toggle => {
    if (user) {
      toggle.classList.add('is-authenticated');
      toggle.setAttribute('title', `${user.name || user.fullName || 'Mi Cuenta'} (${user.role})`);
      let dot = toggle.querySelector('.user-online-dot');
      if (!dot) {
        dot = document.createElement('span');
        dot.className = 'user-online-dot';
        dot.style.cssText = 'position: absolute; bottom: 2px; right: 2px; width: 9px; height: 9px; background: #6A8D45; border-radius: 50%; border: 1.5px solid #fff;';
        toggle.style.position = 'relative';
        toggle.appendChild(dot);
      }
    } else {
      toggle.classList.remove('is-authenticated');
      toggle.setAttribute('title', 'Mi Cuenta');
      toggle.querySelector('.user-online-dot')?.remove();
    }
  });
}

export async function verifySession() {
  const token = localStorage.getItem('honatu_token');
  if (!token) {
    updateNavbarUserState(null);
    return null;
  }

  try {
    const response = await apiFetch('/api/auth/me');

    if (response.ok) {
      const data = await response.json();
      isAuthenticated = true;
      authRole = data.user.role;
      authUser = data.user;

      setString(StorageKeys.AUTH, 'true');
      setString(StorageKeys.AUTH_ROLE, data.user.role);
      setItem(StorageKeys.AUTH_USER, data.user);

      updateNavbarUserState(data.user);
      return data.user;
    } else if (response.status === 401) {
      logout(null, false);
      return null;
    }
  } catch (error) {
    console.warn('Backend session verification offline:', error.message);
  }

  const cachedUser = getAuthUser();
  if (cachedUser && getIsAuthenticated()) {
    updateNavbarUserState(cachedUser);
  }
  return cachedUser;
}

export async function requireAdminAuth(redirectToLogin = true) {
  const token = localStorage.getItem('honatu_token');
  if (!token) {
    if (redirectToLogin) {
      showToast("Acceso restringido: Se requieren permisos de Administrador.");
      window.location.href = getLoginUrl();
    }
    return false;
  }

  try {
    const response = await apiFetch('/api/auth/me');
    if (response.ok) {
      const data = await response.json();
      if (data.user?.role === 'ADMIN') {
        setString(StorageKeys.AUTH, 'true');
        setString(StorageKeys.AUTH_ROLE, data.user.role);
        setItem(StorageKeys.AUTH_USER, data.user);
        return true;
      }
    }
  } catch (error) {
    console.error('Admin auth verification failed:', error);
  }

  logout(getLoginUrl());
  return false;
}

export const AUTH_VINE_DECORATION = `
<svg style="width:0; height:0; position:absolute;">
  <defs>
    <linearGradient id="leafGradAuth" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4C7838"/>
      <stop offset="60%" stop-color="#6A8D45"/>
      <stop offset="100%" stop-color="#9CB661"/>
    </linearGradient>
    <linearGradient id="flowerPetalGradAuth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFAA8A"/>
      <stop offset="50%" stop-color="#E2725B"/>
      <stop offset="100%" stop-color="#B84A39"/>
    </linearGradient>
    <radialGradient id="flowerCoreGradAuth" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFE885"/>
      <stop offset="100%" stop-color="#E5A93C"/>
    </radialGradient>
    <filter id="leafShadowAuth" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000" flood-opacity="0.18"/>
    </filter>
    <g id="real-leaf-auth">
      <path d="M 0,0 Q 2,10 0,20" stroke="#3E5922" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M 0,20 C -25,0 -40,40 0,70 C 40,40 25,0 0,20 Z" fill="url(#leafGradAuth)" filter="url(#leafShadowAuth)" />
      <path d="M 0,20 Q 3,45 0,65" fill="none" stroke="#253D15" stroke-width="1.4" opacity="0.6"/>
      <path d="M 0,30 Q -10,33 -15,30 M 0,40 Q -15,43 -20,37 M 0,50 Q -10,50 -15,45" fill="none" stroke="#253D15" stroke-width="1" opacity="0.4"/>
      <path d="M 0,30 Q 10,33 15,30 M 0,40 Q 15,43 20,37 M 0,50 Q 10,50 15,45" fill="none" stroke="#253D15" stroke-width="1" opacity="0.4"/>
    </g>
    <!-- Easter Egg Flower -->
    <g id="real-flower-auth" filter="url(#leafShadowAuth)">
      <path d="M 0,0 C -9,-18 9,-18 0,0 Z" fill="url(#flowerPetalGradAuth)" transform="rotate(0)" />
      <path d="M 0,0 C -9,-18 9,-18 0,0 Z" fill="url(#flowerPetalGradAuth)" transform="rotate(72)" />
      <path d="M 0,0 C -9,-18 9,-18 0,0 Z" fill="url(#flowerPetalGradAuth)" transform="rotate(144)" />
      <path d="M 0,0 C -9,-18 9,-18 0,0 Z" fill="url(#flowerPetalGradAuth)" transform="rotate(216)" />
      <path d="M 0,0 C -9,-18 9,-18 0,0 Z" fill="url(#flowerPetalGradAuth)" transform="rotate(288)" />
      <circle cx="0" cy="0" r="4" fill="url(#flowerCoreGradAuth)" stroke="#B87B20" stroke-width="0.8" />
    </g>
  </defs>
</svg>
<div class="form-vine-wrapper top-left">
  <svg width="140" height="140" viewBox="0 0 140 140" style="overflow:visible;">
    <path class="form-vine-stem" d="M 140,0 L 20,0 Q 0,0 0,20 L 0,140" filter="url(#leafShadowAuth)"/>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(125, 0) rotate(-15)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.38)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(90, 0) rotate(-100)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.44)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(55, 0) rotate(45)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.42)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(22, 0) rotate(-50)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.48)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(6, 6) rotate(-135)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.52)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(0, 22) rotate(120)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.44)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(0, 55) rotate(165)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.48)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(0, 90) rotate(-35)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.44)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(0, 125) rotate(145)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.38)" /></g></g></g>
    <!-- Modal Easter Egg Flower -->
    <g class="form-vine-flower flower-delay-1" transform="translate(60, 0) rotate(15)">
      <g class="sway"><g class="flower-pop"><use href="#real-flower-auth" transform="scale(0.55)" /></g></g>
    </g>
  </svg>
</div>
<div class="form-vine-wrapper bottom-right">
  <svg width="140" height="140" viewBox="0 0 140 140" style="overflow:visible;">
    <path class="form-vine-stem" d="M 0,140 L 120,140 Q 140,140 140,120 L 140,0" filter="url(#leafShadowAuth)"/>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(15, 140) rotate(145)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.38)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(50, 140) rotate(-35)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.44)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(85, 140) rotate(110)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.46)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(118, 140) rotate(45)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.48)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(134, 134) rotate(45)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.52)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(140, 118) rotate(-45)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.44)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(140, 85) rotate(155)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.46)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(140, 50) rotate(-65)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.44)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(140, 15) rotate(-30)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-auth" transform="scale(0.38)" /></g></g></g>
    <!-- Modal Easter Egg Flower -->
    <g class="form-vine-flower flower-delay-2" transform="translate(140, 50) rotate(-40)">
      <g class="sway"><g class="flower-pop"><use href="#real-flower-auth" transform="scale(0.52)" /></g></g>
    </g>
  </svg>
</div>
`;

function ensureAuthModalDOM() {
  let overlay = document.getElementById('loginOverlay');
  let modal = document.getElementById('loginModal');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loginOverlay';
    overlay.className = 'login-overlay';
    document.body.appendChild(overlay);
  }

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.className = 'login-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="login-modal-card">
      ${AUTH_VINE_DECORATION}
      <button id="loginClose" class="login-close" aria-label="Cerrar modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div class="auth-modal-header">
        <img src="${logoImg}" alt="Honatu Hidroponía" class="auth-modal-logo">
        <h2 id="authModalTitle">¡Hola Cultivador!</h2>
        <p id="authModalSubtitle">Inicia sesión o regístrate para gestionar tus pedidos y talleres.</p>
      </div>

      <div class="auth-tabs" role="tablist">
        <button type="button" class="auth-tab-btn active" id="tabLoginBtn" data-target="loginPane">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Iniciar Sesión
        </button>
        <button type="button" class="auth-tab-btn" id="tabRegisterBtn" data-target="registerPane">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Registrarse
        </button>
      </div>

      <!-- PANE 1: LOGIN -->
      <div id="loginPane" class="auth-pane active">
        <form id="modalLoginForm" class="login-form">
          <div class="form-group">
            <label class="form-label" for="modalLoginEmail">Correo Electrónico</label>
            <input type="email" id="modalLoginEmail" class="form-input" placeholder="tu@correo.com" autocomplete="username">
          </div>
          <div class="form-group">
            <label class="form-label" for="modalLoginPassword">Contraseña</label>
            <input type="password" id="modalLoginPassword" class="form-input" placeholder="Tu contraseña" autocomplete="current-password">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
            Iniciar Sesión &rarr;
          </button>
          <p class="auth-switch-prompt">
            ¿Aún no tienes cuenta? <button type="button" id="switchToRegister">Crear una cuenta gratis</button>
          </p>
        </form>
      </div>

      <!-- PANE 2: REGISTER -->
      <div id="registerPane" class="auth-pane">
        <form id="modalRegisterForm" class="login-form">
          <div class="form-group">
            <label class="form-label" for="modalRegName">Nombre Completo</label>
            <input type="text" id="modalRegName" class="form-input" placeholder="Ej. Ana García" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="modalRegEmail">Correo Electrónico</label>
            <input type="email" id="modalRegEmail" class="form-input" placeholder="tu@correo.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="modalRegPassword">Contraseña</label>
            <input type="password" id="modalRegPassword" class="form-input" placeholder="Mínimo 6 caracteres" minlength="6" required>
          </div>
          <button type="submit" class="btn btn-terracotta" style="width: 100%; justify-content: center;">
            Crear Cuenta y Continuar &rarr;
          </button>
          <p class="auth-switch-prompt">
            ¿Ya tienes una cuenta? <button type="button" id="switchToLogin">Inicia sesión aquí</button>
          </p>
        </form>
      </div>
    </div>
  `;

  bindModalEvents();
}

function switchAuthTab(targetTab) {
  const loginPane = document.getElementById('loginPane');
  const registerPane = document.getElementById('registerPane');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const modalTitle = document.getElementById('authModalTitle');

  if (targetTab === 'register') {
    tabLoginBtn?.classList.remove('active');
    tabRegisterBtn?.classList.add('active');
    loginPane?.classList.remove('active');
    registerPane?.classList.add('active');
    if (modalTitle) modalTitle.textContent = '¡Únete a Honatu!';
  } else {
    tabRegisterBtn?.classList.remove('active');
    tabLoginBtn?.classList.add('active');
    registerPane?.classList.remove('active');
    loginPane?.classList.add('active');
    if (modalTitle) modalTitle.textContent = '¡Hola Cultivador!';
  }
}

function bindModalEvents() {
  const loginClose = document.getElementById('loginClose');
  const loginOverlay = document.getElementById('loginOverlay');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  const modalLoginForm = document.getElementById('modalLoginForm');
  const modalRegisterForm = document.getElementById('modalRegisterForm');

  loginClose?.addEventListener('click', closeLoginModal);
  loginOverlay?.addEventListener('click', closeLoginModal);

  tabLoginBtn?.addEventListener('click', () => switchAuthTab('login'));
  tabRegisterBtn?.addEventListener('click', () => switchAuthTab('register'));
  switchToRegister?.addEventListener('click', () => switchAuthTab('register'));
  switchToLogin?.addEventListener('click', () => switchAuthTab('login'));

  modalLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userVal = (document.getElementById('modalLoginEmail')?.value || '').trim();
    const passVal = (document.getElementById('modalLoginPassword')?.value || '').trim();

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userVal, password: passVal })
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token for future API calls
        localStorage.setItem('honatu_token', data.token);
        
        handleAuthSuccess({
          role: data.user.role,
          name: data.user.name,
          email: data.user.email,
          message: `¡Bienvenido(a) de nuevo! Sesión iniciada.`
        });
      } else {
        if (window.showToast) window.showToast(data.message || 'Credenciales incorrectas', 'error');
        else alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (window.showToast) window.showToast('Error de conexión con el servidor', 'error');
    }
  });

  modalRegisterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('modalRegName')?.value || 'Cultivador';
    const email = document.getElementById('modalRegEmail')?.value || '';
    const password = document.getElementById('modalRegPassword')?.value || '';

    try {
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Automatically log them in after registration
        localStorage.setItem('honatu_token', data.token);
        
        handleAuthSuccess({
          role: data.user.role,
          name: data.user.name,
          email: data.user.email,
          message: `¡Bienvenido(a), ${data.user.name}! Tu cuenta ha sido creada.`
        });
      } else {
        if (window.showToast) window.showToast(data.message || 'Error al crear cuenta', 'error');
        else alert(data.message || 'Error al crear cuenta');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (window.showToast) window.showToast('Error de conexión con el servidor', 'error');
    }
  });
}

function handleAuthSuccess({ role = 'CLIENT', name = 'Cultivador', email = 'cliente@honatu.com', message = '', redirectUrl = null }) {
  isAuthenticated = true;
  authRole = role;
  authUser = { name, email, role };

  setString(StorageKeys.AUTH, 'true');
  setString(StorageKeys.AUTH_ROLE, role);
  setItem(StorageKeys.AUTH_USER, authUser);

  closeLoginModal();
  if (message) showToast(message);

  if (typeof pendingAuthCallback === 'function') {
    const cb = pendingAuthCallback;
    pendingAuthCallback = null;
    cb(authUser);
  } else {
    const target = redirectUrl || pendingRedirectUrl;
    pendingRedirectUrl = null;
    if (target) {
      setTimeout(() => {
        window.location.href = target;
      }, 500);
    }
  }
}

export function openLoginModal(options = {}) {
  ensureAuthModalDOM();

  const modal = document.getElementById('loginModal');
  const overlay = document.getElementById('loginOverlay');
  const modalSubtitle = document.getElementById('authModalSubtitle');

  pendingAuthCallback = options.onLoginSuccess || null;
  pendingRedirectUrl = options.redirectTo || null;

  if (options.subtitle && modalSubtitle) {
    modalSubtitle.textContent = options.subtitle;
  } else if (modalSubtitle) {
    modalSubtitle.textContent = "Inicia sesión o regístrate para gestionar tus compras y talleres.";
  }

  if (options.defaultTab) {
    switchAuthTab(options.defaultTab);
  } else {
    switchAuthTab('login');
  }

  overlay?.classList.add('active');
  modal?.classList.remove('vines-grown');
  modal?.classList.remove('blooming-vines');
  void modal?.offsetWidth; // Trigger reflow for vine growth animation
  modal?.classList.add('active');
  modal?.classList.add('vines-grown');
  if (Math.random() < 0.35) {
    modal?.classList.add('blooming-vines');
  }
  document.body.style.overflow = 'hidden';
}

export function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  const overlay = document.getElementById('loginOverlay');
  modal?.classList.remove('active');
  modal?.classList.remove('vines-grown');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
  pendingAuthCallback = null;
  pendingRedirectUrl = null;
}

export function requireAuth(onSuccess, redirectTo, subtitle) {
  if (getIsAuthenticated()) {
    if (typeof onSuccess === 'function') onSuccess(getAuthUser());
    else if (redirectTo) window.location.href = redirectTo;
    return true;
  }
  openLoginModal({
    onLoginSuccess: onSuccess,
    redirectTo,
    subtitle: subtitle || "Inicia sesión o regístrate para continuar."
  });
  return false;
}

export function initAuth() {
  ensureAuthModalDOM();
  verifySession();

  // Attach to navbar account button
  document.querySelectorAll('#userLoginToggle, .nav-user-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isSubpage = window.location.pathname.includes('/pages/');

      if (isAdmin()) {
        window.location.href = isSubpage ? '../admin/admin.html' : './pages/admin/admin.html';
      } else if (getIsAuthenticated()) {
        window.location.href = isSubpage ? '../auth/account.html' : './pages/auth/account.html';
      } else {
        openLoginModal({
          redirectTo: isSubpage ? '../auth/account.html' : './pages/auth/account.html',
          subtitle: "Inicia sesión para acceder a tu cuenta o panel de administración."
        });
      }
    });
  });

  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLoginModal();
    }
  });
}

// Make globally accessible for all pages & inline scripts
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.requireAuth = requireAuth;
window.requireAdminAuth = requireAdminAuth;
window.getIsAuthenticated = getIsAuthenticated;
window.getAuthRole = getAuthRole;
window.getAuthUser = getAuthUser;
window.isAdmin = isAdmin;
window.logout = logout;
window.verifySession = verifySession;
window.updateNavbarUserState = updateNavbarUserState;


