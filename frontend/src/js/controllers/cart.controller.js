/* ============================================
   HONATU – Cart Controller
   E-commerce cart system
   ============================================ */

import { getItem, setItem, StorageKeys } from '../middleware/storage.middleware.js';
import { getCloudinaryUrl } from '../services/cloudinary.service.js';
import { showToast } from '../middleware/toast.middleware.js';

const SVG_CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

let cart = getItem(StorageKeys.CART, []);

function parsePrice(priceStr) {
  return parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10) || 0;
}

function calcTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateBadge() {
  const cartBadge = document.getElementById('cartBadge');
  if (!cartBadge) return;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalItems;
  cartBadge.classList.toggle('has-items', totalItems > 0);
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div class="cart-empty">' +
        '<svg class="cart-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
        '<p>Tu carrito esta vacio</p>' +
        '<p class="cart-empty-sub">Explora nuestros productos y empieza a cultivar</p>' +
      '</div>';
  } else {
    cartItems.innerHTML = cart.map(item =>
      '<div class="cart-item" data-cart-id="' + item.id + '">' +
        '<img src="' + getCloudinaryUrl(item.img, { width: 120, height: 120, crop: 'fill' }) + '" alt="' + item.name + '" class="cart-item-img">' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-price">$' + item.price.toLocaleString('es-MX') + ' MXN</div>' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn" data-action="decrease" data-id="' + item.id + '">&minus;</button>' +
            '<span>' + item.qty + '</span>' +
            '<button class="qty-btn" data-action="increase" data-id="' + item.id + '">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" data-action="remove" data-id="' + item.id + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>'
    ).join('');
  }

  if (cartTotal) {
    cartTotal.textContent = '$' + calcTotal().toLocaleString('es-MX') + ' MXN';
  }

  updateBadge();
  setItem(StorageKeys.CART, cart);
}

export function addToCart(id, name, price, img) {
  const existing = cart.find(item => item.id === id);
  const resolvedImg = getCloudinaryUrl(img, { width: 150, height: 150, crop: 'fill' });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: parsePrice(price), img: resolvedImg, qty: 1 });
  }
  renderCart();
}

export function initCart() {
  const cartPanel = document.getElementById('cartPanel');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartItems = document.getElementById('cartItems');

  const openCart = () => {
    cartPanel?.classList.add('is-open');
    cartOverlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartPanel?.classList.remove('is-open');
    cartOverlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Quantity changes & remove
  cartItems?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'increase') {
      const item = cart.find(i => i.id === id);
      if (item) item.qty += 1;
    } else if (action === 'decrease') {
      const item = cart.find(i => i.id === id);
      if (item && item.qty > 1) {
        item.qty -= 1;
      } else {
        cart = cart.filter(i => i.id !== id);
      }
    } else if (action === 'remove') {
      cart = cart.filter(i => i.id !== id);
    }

    renderCart();
  });

  // Add to cart buttons
  document.querySelectorAll('.btn-add-cart, .btn-add-cart-lg').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.product-card') || this.closest('.product-info');
      if (!card) return;

      const id = card.dataset.id || this.dataset.productId;
      const name = card.dataset.name || this.dataset.name || (card.querySelector('.product-name') ? card.querySelector('.product-name').textContent.trim() : 'Producto');
      const price = card.dataset.price || this.dataset.price;
      const img = card.dataset.img || this.dataset.img;

      addToCart(id, name, price, img);

      showToast(`¡"${name}" agregado al carrito con éxito!`);

      this.classList.add('added');
      const originalHTML = this.innerHTML;
      this.innerHTML = SVG_CHECK;
      setTimeout(() => {
        this.classList.remove('added');
        this.innerHTML = originalHTML;
      }, 1200);
    });
  });

  // Keyboard: Escape closes cart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
    }
  });

  renderCart();
}
