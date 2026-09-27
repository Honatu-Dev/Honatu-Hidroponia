/* ============================================
   HONATU – Admin Dashboard Master Controller
   Session Security, Navigation, State & Modules
   ============================================ */

import { requireAdminAuth, getAuthUser, logout } from '../controllers/auth.controller.js';
import { initAdminOverview } from './controllers/admin-overview.controller.js';
import { initAdminProducts } from './controllers/admin-products.controller.js';
import { initAdminWorkshops } from './controllers/admin-workshops.controller.js';
import { initAdminServices } from './controllers/admin-services.controller.js';
import { initAdminGuides } from './controllers/admin-guides.controller.js';
import { initAdminFrontend } from './controllers/admin-frontend.controller.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Guard Admin Route
  const isAuthorized = requireAdminAuth(true);
  if (!isAuthorized) return;

  // 2. Display User Details
  const user = getAuthUser();
  const userDisplay = document.getElementById('adminCurrentUserName');
  if (userDisplay && user?.name) {
    userDisplay.textContent = user.name;
  }

  // 3. Initialize Sidebar Collapse Toggle
  initSidebar();

  // 4. Initialize Tab Navigation
  initTabs();

  // 5. Initialize Sub-modules
  initAdminOverview();
  initAdminProducts();
  initAdminWorkshops();
  initAdminServices();
  initAdminGuides();
  initAdminFrontend();

  // 6. Bind Global Logout
  document.getElementById('adminLogoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout('login.html');
  });
});

function initSidebar() {
  const wrapper = document.querySelector('.admin-wrapper');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const mobileToggleBtn = document.getElementById('mobileSidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');

  // Load saved state
  const isCollapsed = localStorage.getItem('honatu_admin_sidebar_collapsed') === 'true';
  if (isCollapsed && wrapper) {
    wrapper.classList.add('sidebar-collapsed');
  }

  toggleBtn?.addEventListener('click', () => {
    wrapper?.classList.toggle('sidebar-collapsed');
    const newState = wrapper?.classList.contains('sidebar-collapsed');
    localStorage.setItem('honatu_admin_sidebar_collapsed', newState ? 'true' : 'false');
  });

  mobileToggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('mobile-open');
  });
}

function initTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  const panes = document.querySelectorAll('.tab-pane');
  const breadcrumbActive = document.querySelector('.active-tab-title');

  const tabTitles = {
    overview: 'Panel de Control & Métricas',
    products: 'Catálogo de Productos & Inventario',
    workshops: 'Talleres, Cursos & Geolocalización',
    services: 'Asesorías Técnicas & Invernaderos',
    guides: 'Guías Educativas & Recursos',
    frontend: 'Gestión Visual del Frontend',
    clients: 'Directorio de Clientes'
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      // Update Nav Buttons
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Update Panes
      panes.forEach(pane => {
        if (pane.id === `tab-${targetTab}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Update Breadcrumb
      if (breadcrumbActive && tabTitles[targetTab]) {
        breadcrumbActive.textContent = tabTitles[targetTab];
      }

      // Re-trigger layout adjustments for Chart.js if switching to overview
      if (targetTab === 'overview') {
        initAdminOverview();
      }

      // Close mobile sidebar on navigation
      document.querySelector('.admin-sidebar')?.classList.remove('mobile-open');
    });
  });
}
