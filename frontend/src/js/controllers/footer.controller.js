/* ============================================
   HONATU – Footer Controller
   Initializes and ensures the footer component is rendered
   ============================================ */

import { renderFooter } from '../components/footer.component.js';

export function initFooter() {
  // Target both standard semantic footer and custom element
  const footers = document.querySelectorAll('footer.footer, honatu-footer');
  if (!footers || footers.length === 0) return;

  footers.forEach(footer => {
    // If it's a standard footer element (not already self-rendered by custom element connectedCallback)
    if (footer.tagName.toLowerCase() === 'footer') {
      renderFooter(footer);
    }
  });
}
