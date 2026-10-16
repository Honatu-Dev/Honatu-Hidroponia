import { apiFetch } from '../config.js';
import { bindAddToCartButtons } from './cart.controller.js';

const SKELETON = `
    <article class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-text short"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text medium"></div>
        <div class="skeleton-button"></div>
      </div>
    </article>`;

const EMPTY_STATE = `
    <div class="empty-state">
      <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <h3>Próximamente: Catálogo de Productos</h3>
      <p>Estamos trabajando para traerte los mejores insumos hidropónicos. ¡Mantente atento!</p>
    </div>`;

const escapeHtml = (str) => String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const slugify = (str) => String(str ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function renderCard(product) {
  const variants = product.ProductVariants || [];
  const variant = variants[0] || {};
  const img = product.imageUrl || variant.imageUrls?.[0] || '';
  const name = escapeHtml(product.name);
  const desc = escapeHtml(product.description || '');
  const category = escapeHtml(product.category || 'otros');
  const slug = escapeHtml(slugify(product.category));
  const price = Number(variant.price || 0);
  const outOfStock = variant.id ? (variant.stock ?? 0) <= 0 : true;

  return `
    <article class="product-card" data-category="${slug}" data-id="${variant.id || ''}"
      data-name="${name}" data-price="${price}" data-img="${img}">
      <a href="../shop/product.html?id=${product.id}" class="product-img-wrap">
        <img src="${img}" alt="${name}" loading="lazy">
      </a>
      <div class="product-body">
        <span class="product-category">${category}</span>
        <h3 class="product-name">${name}</h3>
        <p class="product-desc">${desc}</p>
        <div class="product-footer">
          <span class="product-price">$${price.toLocaleString('es-MX')} <small>MXN</small></span>
          <div style="display: flex; gap: 8px;">
            <a href="../shop/product.html?id=${product.id}" class="btn btn-secondary btn-sm">Ver Detalles</a>
            ${variant.id ? `<button class="btn btn-primary btn-sm btn-add-cart" data-product-id="${variant.id}" data-name="${name}" data-price="${price}" data-img="${img}" ${outOfStock ? 'disabled' : ''}>${outOfStock ? 'Agotado' : 'Agregar'}</button>` : ''}
          </div>
        </div>
      </div>
    </article>`;
}

export async function initShopGrid() {
  const shopGrid = document.getElementById('shopGrid');
  if (!shopGrid) return;

  // Render Skeletons
  shopGrid.innerHTML = SKELETON + SKELETON + SKELETON;

  try {
    const response = await apiFetch('/api/products');
    const products = response.ok ? await response.json() : [];

    if (!Array.isArray(products) || products.length === 0) {
      shopGrid.innerHTML = EMPTY_STATE;
      return;
    }

    shopGrid.innerHTML = products.map(renderCard).join('');
    bindAddToCartButtons();
  } catch (error) {
    console.error('Error cargando productos:', error);
    shopGrid.innerHTML = EMPTY_STATE;
  }
}
