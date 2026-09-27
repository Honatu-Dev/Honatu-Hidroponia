/* ============================================
   HONATU – Favorites Controller
   ============================================ */

import { getItem, setItem, StorageKeys } from '../middleware/storage.middleware.js';
import { showToast } from '../middleware/toast.middleware.js';

let favorites = getItem(StorageKeys.FAVORITES, []);

function updateFavoriteButtons() {
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    const card = btn.closest('.product-card') || btn.closest('.product-info');
    if (!card) return;
    const id = card.dataset.id || btn.dataset.productId;
    if (!id) return;

    if (favorites.includes(id)) {
      btn.classList.add('active');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-terracotta)" stroke="var(--color-terracotta)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    }
  });
}

export function initFavorites() {
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const card = this.closest('.product-card') || this.closest('.product-info');
      if (!card) return;

      const id = card.dataset.id || this.dataset.productId;
      if (!id) return;

      const name = card.dataset.name || (card.querySelector('.product-name, .product-title') ? card.querySelector('.product-name, .product-title').textContent.trim() : 'Producto');

      const index = favorites.indexOf(id);
      if (index === -1) {
        favorites.push(id);
        showToast(`¡"${name}" agregado a tus favoritos!`);
      } else {
        favorites.splice(index, 1);
        showToast(`¡"${name}" eliminado de tus favoritos!`);
      }

      setItem(StorageKeys.FAVORITES, favorites);
      updateFavoriteButtons();
    });
  });

  updateFavoriteButtons();
}
