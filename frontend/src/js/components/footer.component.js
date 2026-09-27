/* ============================================
   HONATU – Reusable Footer Component
   Single source of truth for the site-wide footer
   ============================================ */

import logoImg from '../../assets/logo/Logo.png';

/**
 * Global footer configuration
 * Edit here to update links, texts, schedules, or contact details everywhere
 */
export const FOOTER_CONFIG = {
  brand: {
    logoAlt: 'Honatu',
    logoSrc: logoImg,
    logoRelPath: 'assets/logo/Logo.png',
    description: 'Insumos hidropónicos premium para cultivadores que buscan calidad, conocimiento y comunidad.'
  },
  social: [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/524424591473',
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4l-2-1c-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1a7.6 7.6 0 01-3.8-3.3c-.2-.3 0-.5.2-.6l.5-.6c.1-.2.2-.3.1-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 21.8a9.9 9.9 0 01-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 01-1.5-5.2c0-5.5 4.5-10 10-10a9.9 9.9 0 017 2.9 9.8 9.8 0 012.9 7c0 5.5-4.5 10-10 10zm8.5-18.3A11.8 11.8 0 0012 0C5.4 0 .1 5.3.1 11.9a11.8 11.8 0 001.6 5.9L0 24l6.3-1.7a11.9 11.9 0 005.7 1.5c6.6 0 11.9-5.3 11.9-11.9a11.8 11.8 0 00-3.5-8.4z"/></svg>'
    }
  ],
  navigation: [
    { label: 'Inicio', path: 'index.html' },
    { label: 'Nosotros', path: 'pages/nosotros.html' },
    { label: 'Tienda', path: 'pages/tienda.html' },
    { label: 'Educación', path: 'pages/educacion.html' },
    { label: 'Talleres', path: 'pages/talleres.html' },
    { label: 'Servicios', path: 'pages/servicios.html' },
    { label: 'Involúcrate', path: 'pages/involucrate.html' }
  ],
  contact: {
    phone: '+52 (442) 459-1473',
    phoneHref: 'tel:+524424591473',
    email: 'contacto.honatu@gmail.com',
    emailHref: 'mailto:contacto.honatu@gmail.com'
  },
  schedule: [
    'Lunes – Viernes: 9:00 – 18:00',
    'Sábado: 10:00 – 14:00',
    'Domingo: Cerrado'
  ],
  legal: {
    copyright: `© ${new Date().getFullYear()} Honatu. Todos los derechos reservados.`,
    privacyText: 'Política de Privacidad',
    termsText: 'Términos de Servicio'
  }
};

/**
 * Determines whether the current view is inside the /pages/ directory
 */
export function isSubpageView() {
  if (typeof document !== 'undefined') {
    const isSubScript = document.querySelector('script[src*="../js/"]') !== null;
    const isSubLink = document.querySelector('link[href*="../css/"]') !== null;
    if (isSubScript || isSubLink) return true;
  }
  return window.location.pathname.includes('/pages/') ||
    (window.location.pathname.endsWith('.html') && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/'));
}

/**
 * Resolves a root-relative path (e.g. 'pages/tienda.html' or 'assets/logo/Logo.png')
 * to the correct relative URL based on the current page location.
 */
export function resolveRelativePath(targetPath) {
  const isSubpage = isSubpageView();

  if (targetPath.startsWith('http://') || targetPath.startsWith('https://') || targetPath.startsWith('mailto:') || targetPath.startsWith('tel:')) {
    return targetPath;
  }

  if (targetPath === 'index.html') {
    return isSubpage ? '../index.html' : './index.html';
  }

  if (targetPath.startsWith('pages/')) {
    const pageFileName = targetPath.replace('pages/', '');
    return isSubpage ? `./${pageFileName}` : `./pages/${pageFileName}`;
  }

  const cleanPath = targetPath.replace(/^(\.\/|\.\.\/)?src\//, '');

  if (cleanPath.startsWith('assets/')) {
    return isSubpage ? `../${cleanPath}` : `./${cleanPath}`;
  }

  return isSubpage ? `../${cleanPath}` : `./${cleanPath}`;
}

/**
 * Generates the unified HTML markup for the Honatu footer
 */
export function generateFooterHTML(config = FOOTER_CONFIG) {
  const logoSrc = config.brand.logoSrc || logoImg || resolveRelativePath(config.brand.logoRelPath);

  const socialHTML = config.social.map(item => `
    <a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.name}">
      ${item.svg}
    </a>
  `).join('');

  const navHTML = config.navigation.map(item => `
    <a href="${resolveRelativePath(item.path)}">${item.label}</a>
  `).join('');

  const scheduleHTML = config.schedule.map(item => `
    <p>${item}</p>
  `).join('');

  return `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="${logoSrc}" alt="${config.brand.logoAlt}" class="footer-logo-img">
          <p>${config.brand.description}</p>
          <div class="footer-social">
            ${socialHTML}
          </div>
        </div>

        <div class="footer-col">
          <h4>Navegación</h4>
          ${navHTML}
        </div>

        <div class="footer-col">
          <h4>Contacto</h4>
          <p><a href="${config.contact.phoneHref}" style="display:inline; padding:0;">${config.contact.phone}</a></p>
          <p><a href="${config.contact.emailHref}" style="display:inline; padding:0;">${config.contact.email}</a></p>
        </div>

        <div class="footer-col">
          <h4>Horarios de atención</h4>
          ${scheduleHTML}
        </div>
      </div>

      <div class="footer-bottom">
        <p>${config.legal.copyright}</p>
        <div class="footer-legal-links" style="display: flex; gap: var(--space-md);">
          <a href="#">${config.legal.privacyText}</a>
          <span style="color: var(--color-gray-600);">&bull;</span>
          <a href="#">${config.legal.termsText}</a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Standard Web Component for Honatu Footer (<honatu-footer>)
 */
export class HonatuFooter extends HTMLElement {
  connectedCallback() {
    this.classList.add('footer');
    this.setAttribute('role', 'contentinfo');
    this.innerHTML = generateFooterHTML();
  }
}

// Register custom element if not already registered
if (typeof window !== 'undefined' && !customElements.get('honatu-footer')) {
  customElements.define('honatu-footer', HonatuFooter);
}

/**
 * Mounts or refreshes footer markup into any HTML element
 */
export function renderFooter(targetElement) {
  if (!targetElement) return;
  targetElement.innerHTML = generateFooterHTML();
}
