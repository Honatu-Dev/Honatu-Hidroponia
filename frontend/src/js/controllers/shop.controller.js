export async function initShopGrid() {
  const shopGrid = document.getElementById('shopGrid');
  if (!shopGrid) return;

  // Render Skeletons
  shopGrid.innerHTML = `
    <article class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-text short"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text medium"></div>
        <div class="skeleton-button"></div>
      </div>
    </article>
    <article class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-text short"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text medium"></div>
        <div class="skeleton-button"></div>
      </div>
    </article>
    <article class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-text short"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text medium"></div>
        <div class="skeleton-button"></div>
      </div>
    </article>
  `;

  // Simulate network request for products (since there is no DB backend for products yet)
  setTimeout(() => {
    // For now, assume products array is empty
    const products = [];

    if (products.length === 0) {
      shopGrid.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3>Próximamente: Catálogo de Productos</h3>
          <p>Estamos trabajando para traerte los mejores insumos hidropónicos. ¡Mantente atento!</p>
        </div>
      `;
    } else {
      // Logic for rendering products when they exist
      shopGrid.innerHTML = ''; 
    }
  }, 1200);
}
