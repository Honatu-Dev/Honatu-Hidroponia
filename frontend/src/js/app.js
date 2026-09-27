/* ============================================
   HONATU – App Entry Point
   Bootstraps all controllers and middleware
   ============================================ */

// --- Middleware ---
import { initRevealAnimations, initCounters, injectFilterAnimation } from './middleware/animations.middleware.js';
import './middleware/toast.middleware.js'; // self-registers showToast globally

// --- Services ---
import { initCloudinaryImages } from './services/cloudinary.service.js';

// --- Controllers ---
import { initLoader } from './controllers/loader.controller.js';
import { initNavbar } from './controllers/navbar.controller.js';
import { initSmoothScroll, initActiveNavTracking, handleInitialHashScroll } from './controllers/scroll.controller.js';
import { initAuth } from './controllers/auth.controller.js';
import { initCart } from './controllers/cart.controller.js';
import { initFavorites } from './controllers/favorites.controller.js';
import { initFilters } from './controllers/filters.controller.js';
import { initContactForm } from './controllers/contact.controller.js';
import { initFooter } from './controllers/footer.controller.js';

// --- UI Components ---
import './components/header.component.js'; // Registers <honatu-header> Custom Element
import './components/footer.component.js'; // Registers <honatu-footer> Custom Element
import './components/map.component.js';    // Registers <honatu-map> Custom Element
import { initVineDecorations } from './components/vine-decoration.js';

function bootstrapApp() {
  // Always initialize loader first
  try { initLoader(); } catch (e) { console.warn('Loader init error:', e); }

  // Services & Assets
  try { initCloudinaryImages(); } catch (e) { console.warn('Cloudinary init error:', e); }

  // Middleware
  try { initRevealAnimations(); } catch (e) { console.warn('Reveal animations error:', e); }
  try { initCounters(); } catch (e) { console.warn('Counters error:', e); }
  try { injectFilterAnimation(); } catch (e) { console.warn('Filter animation error:', e); }

  // Controllers
  try { initNavbar(); } catch (e) { console.warn('Navbar init error:', e); }
  try { initFooter(); } catch (e) { console.warn('Footer init error:', e); }
  try { initSmoothScroll(); } catch (e) { console.warn('Smooth scroll error:', e); }
  try { initActiveNavTracking(); } catch (e) { console.warn('Active nav tracking error:', e); }
  try { handleInitialHashScroll(); } catch (e) { console.warn('Hash scroll error:', e); }
  try { initAuth(); } catch (e) { console.warn('Auth init error:', e); }
  try { initCart(); } catch (e) { console.warn('Cart init error:', e); }
  try { initFavorites(); } catch (e) { console.warn('Favorites init error:', e); }
  try { initFilters(); } catch (e) { console.warn('Filters init error:', e); }
  try { initContactForm(); } catch (e) { console.warn('Contact form error:', e); }
  
  // UI Components
  try { initVineDecorations(); } catch (e) { console.warn('Vine decorations error:', e); }
}

// Ensure execution even if DOMContentLoaded already fired before module execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
