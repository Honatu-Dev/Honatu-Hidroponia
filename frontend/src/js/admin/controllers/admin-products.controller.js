/* ============================================
   HONATU – Admin Products Controller
   CRUD, Variants & Inventory Management
   ============================================ */

import { apiFetch } from '../../config.js';
import { adminCache, loadProducts } from '../data/admin-api.js';
import { showToast } from '../../middleware/toast.middleware.js';

let currentEditingProductId = null;

export function initAdminProducts() {
  loadProducts()
    .then(() => renderProductsTable())
    .catch(err => {
      console.error('Error cargando productos:', err);
      showToast('No se pudieron cargar los productos del servidor.', 'error');
    });
  bindProductEvents();
}

export function renderProductsTable(filterText = '', filterCategory = 'all') {
  const tableBody = document.getElementById('adminProductsTableBody');
  if (!tableBody) return;

  const products = adminCache.products;
  const searchLower = filterText.toLowerCase();

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchLower) ||
                          p.category.toLowerCase().includes(searchLower) ||
                          (p.variants || []).some(v => v.sku.toLowerCase().includes(searchLower));
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 32px; color: var(--color-gray-500);">
          No se encontraron productos que coincidan con la búsqueda.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(product => {
    const mainVariant = product.variants?.[0] || { sku: 'N/A', price: 0, stock: 0 };
    const totalStock = (product.variants || []).reduce((acc, v) => acc + (v.stock || 0), 0);
    const variantsCount = (product.variants || []).length;

    return `
      <tr>
        <td>
          <div class="product-row-info">
            <img src="${product.coverImage}" alt="${product.name}" class="product-thumb">
            <div>
              <strong>${product.name}</strong>
              <div style="font-size: 0.75rem; color: var(--color-gray-500);">${mainVariant.sku} • ${variantsCount} variante(s)</div>
            </div>
          </div>
        </td>
        <td><span class="status-pill" style="background: var(--color-stone); color: var(--color-forest);">${product.category}</span></td>
        <td><strong>$${mainVariant.price.toLocaleString('es-MX')}</strong></td>
        <td>
          <span style="font-weight: 700; color: ${totalStock <= 5 ? '#D32F2F' : '#2E7D32'};">
            ${totalStock} unids.
          </span>
        </td>
        <td>
          <span class="status-pill ${product.isActive ? 'active' : 'draft'}">
            ${product.isActive ? 'Activo' : 'Pausado'}
          </span>
        </td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="btn-action-icon btn-edit-product" data-id="${product.id}" title="Editar producto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button type="button" class="btn-action-icon btn-toggle-product" data-id="${product.id}" title="Cambiar estado">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button type="button" class="btn-action-icon btn-action-delete btn-delete-product" data-id="${product.id}" title="Eliminar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function bindProductEvents() {
  const searchInput = document.getElementById('searchProductsInput');
  const catFilter = document.getElementById('filterProductCategory');
  const btnNewProduct = document.getElementById('btnNewProduct');
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  const closeBtn = document.getElementById('closeProductModal');

  searchInput?.addEventListener('input', (e) => {
    renderProductsTable(e.target.value, catFilter?.value || 'all');
  });

  catFilter?.addEventListener('change', (e) => {
    renderProductsTable(searchInput?.value || '', e.target.value);
  });

  btnNewProduct?.addEventListener('click', () => {
    currentEditingProductId = null;
    form?.reset();
    document.getElementById('productModalTitle').textContent = 'Nuevo Producto del Catálogo';
    modal?.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });

  // Table action clicks (edit, toggle, delete)
  document.getElementById('adminProductsTableBody')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit-product');
    const toggleBtn = e.target.closest('.btn-toggle-product');
    const deleteBtn = e.target.closest('.btn-delete-product');

    if (editBtn) {
      openEditProductModal(editBtn.dataset.id);
    } else if (toggleBtn) {
      toggleProductStatus(toggleBtn.dataset.id);
    } else if (deleteBtn) {
      deleteProduct(deleteBtn.dataset.id);
    }
  });

  // Form submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProductFromForm();
  });
}

function openEditProductModal(id) {
  const product = adminCache.products.find(p => p.id === id);
  if (!product) return;

  currentEditingProductId = id;
  const modal = document.getElementById('productModal');
  document.getElementById('productModalTitle').textContent = 'Editar Producto';

  document.getElementById('prodName').value = product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodDescription').value = product.description;
  document.getElementById('prodImage').value = product.coverImage;

  const v = product.variants?.[0] || { sku: '', price: 0, stock: 0 };
  document.getElementById('prodSku').value = v.sku;
  document.getElementById('prodPrice').value = v.price;
  document.getElementById('prodStock').value = v.stock;

  modal?.classList.add('active');
}

async function saveProductFromForm() {
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const description = document.getElementById('prodDescription').value.trim();
  const coverImage = document.getElementById('prodImage').value.trim();
  const sku = document.getElementById('prodSku').value.trim() || `HON-${Date.now().toString().slice(-4)}`;
  const price = parseFloat(document.getElementById('prodPrice').value) || 0;
  const stock = parseInt(document.getElementById('prodStock').value, 10) || 0;

  try {
    if (currentEditingProductId) {
      const product = adminCache.products.find(p => p.id === currentEditingProductId);
      if (!product) return;

      const res = await apiFetch(`/api/products/${currentEditingProductId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, category, description, imageUrl: coverImage || undefined })
      });
      if (!res.ok) throw new Error((await res.json()).message);

      const variant = product.variants?.[0];
      if (variant?.id) {
        await apiFetch(`/api/products/variants/${variant.id}`, {
          method: 'PUT',
          body: JSON.stringify({ price, stock, imageUrls: coverImage ? [coverImage] : undefined })
        });
      }
      showToast('Producto actualizado exitosamente.');
    } else {
      const res = await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          category,
          description,
          imageUrl: coverImage || undefined,
          variants: [{ sku, price, stock, imageUrls: coverImage ? [coverImage] : [] }]
        })
      });
      if (!res.ok) throw new Error((await res.json()).message);
      showToast('¡Nuevo producto agregado al catálogo!');
    }

    document.getElementById('productModal')?.classList.remove('active');
    await loadProducts(true);
    renderProductsTable();
  } catch (error) {
    console.error('Error guardando producto:', error);
    showToast(error.message || 'No se pudo guardar el producto.', 'error');
  }
}

async function toggleProductStatus(id) {
  const prod = adminCache.products.find(p => p.id === id);
  if (!prod) return;

  try {
    const res = await apiFetch(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !prod.isActive })
    });
    if (!res.ok) throw new Error((await res.json()).message);
    showToast(`Producto ${!prod.isActive ? 'activado' : 'pausado'} correctamente.`);
    await loadProducts(true);
    renderProductsTable();
  } catch (error) {
    console.error('Error cambiando estado:', error);
    showToast('No se pudo cambiar el estado del producto.', 'error');
  }
}

async function deleteProduct(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

  try {
    const res = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error((await res.json()).message);
    showToast('Producto eliminado del catálogo.');
    await loadProducts(true);
    renderProductsTable();
  } catch (error) {
    console.error('Error eliminando producto:', error);
    showToast('No se pudo eliminar el producto.', 'error');
  }
}
