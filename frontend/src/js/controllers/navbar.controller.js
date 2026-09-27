/* ============================================
   HONATU – Navbar Controller
   Handles scroll-based style, mobile menu, and active state
   ============================================ */

import { renderHeader } from '../components/header.component.js';
import { isSubpageView } from '../components/footer.component.js';
import logoImg from '../../assets/logo/Logo.png';

export function initNavbar() {
  // Ensure ANY logo image in navbar or static headers is set to the bundled asset
  document.querySelectorAll('.nav-logo img, nav .nav-logo img, honatu-header .nav-logo img').forEach(img => {
    img.src = logoImg;
  });

  // Wait for <honatu-header> connectedCallback to have fired (it's synchronous but
  // we need the id="navbar" it sets before querying children).
  let navbar = document.getElementById('navbar') || document.querySelector('honatu-header');

  if (!navbar) return;

  // If the element is an empty honatu-header that bypassed connectedCallback, render manually
  if (navbar.tagName.toLowerCase() === 'honatu-header' && navbar.children.length === 0) {
    renderHeader(navbar);
    navbar = document.getElementById('navbar') || navbar;
  }

  const isSubpage = isSubpageView();
  const heroSection = document.getElementById('hero');

  // ── Scroll-based transparency (index only) ─────────────────────────────────
  if (!isSubpage && heroSection) {
    const updateNavbar = () => {
      const threshold = heroSection.offsetHeight * 0.25;
      const scrolled = window.scrollY > threshold;
      navbar.classList.toggle('navbar--transparent', !scrolled);
      navbar.classList.toggle('navbar--solid', scrolled);
    };
    // Run immediately so the state is correct before any scroll
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
  } else {
    // Subpages or pages without a hero always get the solid dark navbar
    navbar.classList.remove('navbar--transparent');
    navbar.classList.add('navbar--solid');
  }

  // ── Mobile hamburger menu ──────────────────────────────────────────────────
  const hamburger = document.getElementById('navHamburger');
  const navMenu   = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
    });

    // Close menu when any link is clicked
    navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        navMenu.classList.remove('is-open');
      });
    });
  }
}
