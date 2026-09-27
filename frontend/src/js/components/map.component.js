/* ============================================
   HONATU – Reusable Map Component
   Single source of truth for the site-wide map
   ============================================ */

/**
 * Global map configuration
 * Edit here to update the map location everywhere
 */
export const MAP_CONFIG = {
  placeName: 'Ndalí Centro de Conexión',
  // Embed src with exact place_id: 0x85d35b59c1b9aa2b:0x75e417866fba2449
  embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.2!2d-100.3866!3d20.5901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d35b59c1b9aa2b%3A0x75e417866fba2449!2sNdal%C3%AD+Centro+de+Conexi%C3%B3n!5e0!3m2!1ses!2smx!4v1715201234567',
  // Direct link to open in Google Maps
  mapsUrl: 'https://www.google.com/maps/place/ndali+centro+de+conexi%C3%B3n/data=!4m2!3m1!1s0x85d35b59c1b9aa2b:0x75e417866fba2449',
  buttonLabel: 'Abrir en Google Maps'
};

/**
 * Generates the map iframe + button HTML
 * @param {'home'|'subpage'} variant - CSS variant to use
 */
export function generateMapHTML(variant = 'subpage', config = MAP_CONFIG) {
  if (variant === 'home') {
    return `
      <div class="map-wrap reveal-scale">
        <iframe class="map-frame"
          src="${config.embedSrc}"
          allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          title="Ubicación de ${config.placeName}"></iframe>
      </div>
      <div class="map-actions">
        <a href="${config.mapsUrl}" target="_blank" rel="noopener"
          class="btn btn-secondary">${config.buttonLabel}</a>
      </div>
    `;
  }

  // subpage variant
  return `
    <iframe
      src="${config.embedSrc}"
      width="100%" height="400" style="border:0; border-radius: 8px;"
      allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      title="Ubicación de ${config.placeName}"></iframe>
    <div class="map-button">
      <a href="${config.mapsUrl}" target="_blank" rel="noopener">${config.buttonLabel}</a>
    </div>
  `;
}

/**
 * Standard Web Component for Honatu Map (<honatu-map>)
 * Usage: <honatu-map></honatu-map>            (subpage)
 *        <honatu-map variant="home"></honatu-map>   (index)
 */
export class HonatuMap extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'subpage';
    this.innerHTML = generateMapHTML(variant);
  }
}

// Register custom element if not already registered
if (typeof window !== 'undefined' && !customElements.get('honatu-map')) {
  customElements.define('honatu-map', HonatuMap);
}

/**
 * Mounts map markup into any HTML element
 */
export function renderMap(targetElement, variant = 'subpage') {
  if (!targetElement) return;
  targetElement.innerHTML = generateMapHTML(variant);
}
