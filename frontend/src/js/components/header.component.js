/* ============================================
   HONATU – Reusable Header / Navbar Component
   Single source of truth for the site-wide navigation
   ============================================ */

import { isSubpageView, resolveRelativePath } from './footer.component.js';
import logoImg from '../../assets/logo/Logo.png';

export const HEADER_CONFIG = {
  brand: {
    logoAlt: 'Honatu',
    logoSrc: logoImg,
    logoRelPath: 'assets/logo/Logo.png',
    // homeHref is resolved at render time depending on context
  },
  navigation: [
    { label: 'Servicios', path: 'pages/servicios.html', homeHash: '#servicios' },
    { label: 'Quienes somos?', path: 'pages/nosotros.html', homeHash: '#nosotros' },
    { label: 'Tienda', path: 'pages/tienda.html', homeHash: '#tienda' },
    { label: 'Blog', path: 'pages/educacion.html', homeHash: '#educacion' }
  ],
  cta: {
    label: 'Contactanos',
    path: 'pages/involucrate.html#contacto',
    homeHash: '#involucrate'
  }
};

/**
 * Returns the active link identifier based on current pathname
 */
export function getCurrentPageName() {
  if (typeof window === 'undefined') return 'index';
  const path = window.location.pathname;
  const match = path.match(/\/pages\/([^.]+)\.html/) || path.match(/\/([^.]+)\.html/);
  if (!match) return 'index';
  return match[1];
}

/**
 * Generates the unified HTML markup for the Honatu Navbar
 */
export function generateHeaderHTML(config = HEADER_CONFIG) {
  const isSubpage = isSubpageView();
  const currentPage = getCurrentPageName();
  const logoSrc = config.brand.logoSrc || logoImg || resolveRelativePath(config.brand.logoRelPath);
  // Logo: on home page scroll to #hero; on subpages navigate to index.html
  const logoHref = isSubpage ? resolveRelativePath('index.html') : '#hero';
  const favHref = resolveRelativePath('pages/favoritos.html');

  const navLinksHTML = config.navigation.map(item => {
    let href = '';
    let isActive = false;

    if (!isSubpage) {
      // On homepage: use in-page anchor if defined, else go directly to subpage
      href = item.homeHash ? item.homeHash : resolveRelativePath(item.path);
    } else {
      // On subpages: redirect back to homepage section if homeHash is defined, else go to subpage
      href = item.homeHash
        ? `${resolveRelativePath('index.html')}${item.homeHash}`
        : resolveRelativePath(item.path);
      const itemPageName = item.path.replace('pages/', '').replace('.html', '');
      isActive = (currentPage === itemPageName);
    }

    return `<a href="${href}" class="nav-link ${isActive ? 'active' : ''}">${item.label}</a>`;
  }).join('');

  // CTA button: on homepage use in-page anchor, on subpages redirect to homepage section
  const ctaHref = !isSubpage
    ? (config.cta.homeHash || resolveRelativePath(config.cta.path))
    : (config.cta.homeHash
        ? `${resolveRelativePath('index.html')}${config.cta.homeHash}`
        : resolveRelativePath(config.cta.path));

  return `
    <div class="nav-container">
      <a href="${logoHref}" class="nav-logo" aria-label="Inicio">
        <img src="${logoSrc}" alt="${config.brand.logoAlt}">
      </a>

      <div id="navMenu" class="nav-menu">
        ${navLinksHTML}
        <a href="${ctaHref}" class="btn btn-primary btn-sm nav-cta">${config.cta.label}</a>
      </div>

      <div class="nav-right">
        <a href="${favHref}" class="nav-cart" aria-label="Favoritos" title="Favoritos">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </a>

        <button id="userLoginToggle" class="nav-cart" aria-label="Usuario" title="Mi Cuenta">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        <button id="cartToggle" class="nav-cart" aria-label="Carrito de compras" title="Carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span id="cartBadge" class="cart-badge">0</span>
        </button>

        <button id="navHamburger" class="nav-hamburger" aria-label="Menú">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Standard Web Component for Honatu Header (<honatu-header>)
 */
export class HonatuHeader extends HTMLElement {
  connectedCallback() {
    this.classList.add('navbar');
    const isSubpage = isSubpageView();
    if (isSubpage) {
      this.classList.add('navbar--solid');
    } else {
      this.classList.add('navbar--transparent');
    }
    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', 'Navegación principal');
    this.id = 'navbar';
    this.innerHTML = generateHeaderHTML();
  }
}

// Register custom element if not already registered
if (typeof window !== 'undefined' && !customElements.get('honatu-header')) {
  customElements.define('honatu-header', HonatuHeader);
}

/**
 * Mounts or refreshes header markup into any HTML element
 */
export function renderHeader(targetElement) {
  if (!targetElement) return;
  const isSubpage = isSubpageView();
  if (isSubpage) {
    targetElement.classList.remove('navbar--transparent');
    targetElement.classList.add('navbar--solid');
  }
  targetElement.innerHTML = generateHeaderHTML();
}
