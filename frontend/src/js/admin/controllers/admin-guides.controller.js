/* ============================================
   HONATU – Admin Guides Controller
   Educational Articles, Calculators & Resources CRUD
   ============================================ */

import { getAdminGuides, saveAdminGuides } from '../data/admin-mock-data.js';
import { showToast } from '../../middleware/toast.middleware.js';

let currentEditingGuideId = null;

export function initAdminGuides() {
  renderGuidesTable();
  bindGuideEvents();
}

export function renderGuidesTable() {
  const tbody = document.getElementById('adminGuidesTableBody');
  if (!tbody) return;

  const guides = getAdminGuides();

  tbody.innerHTML = guides.map(g => `
    <tr>
      <td>
        <div class="product-row-info">
          <img src="${g.coverImage || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=100'}" alt="${g.title}" class="product-thumb">
          <div>
            <strong>${g.title}</strong>
            <div style="font-size: 0.75rem; color: var(--color-gray-500);">${g.author} • ${g.publishedAt}</div>
          </div>
        </div>
      </td>
      <td><span class="status-pill" style="background: var(--color-stone); color: var(--color-forest);">${g.category}</span></td>
      <td><strong>${(g.resources || []).length} archivos</strong></td>
      <td><span>Vistas: ${(g.readCount || 0).toLocaleString()}</span></td>
      <td>
        <span class="status-pill ${g.isPublished ? 'active' : 'draft'}">
          ${g.isPublished ? 'Publicada' : 'Borrador'}
        </span>
      </td>
      <td>
        <div class="action-btn-group">
          <button type="button" class="btn-action-icon btn-edit-guide" data-id="${g.id}" title="Editar guía">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="btn-action-icon btn-toggle-guide" data-id="${g.id}" title="Publicar/Ocultar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button type="button" class="btn-action-icon btn-action-delete btn-delete-guide" data-id="${g.id}" title="Eliminar guía">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function bindGuideEvents() {
  const btnNew = document.getElementById('btnNewGuide');
  const modal = document.getElementById('guideModal');
  const form = document.getElementById('guideForm');
  const closeBtn = document.getElementById('closeGuideModal');

  btnNew?.addEventListener('click', () => {
    currentEditingGuideId = null;
    form?.reset();
    document.getElementById('guideModalTitle').textContent = 'Crear Nueva Guía Educativa';
    modal?.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });

  document.getElementById('adminGuidesTableBody')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit-guide');
    const toggleBtn = e.target.closest('.btn-toggle-guide');
    const deleteBtn = e.target.closest('.btn-delete-guide');

    if (editBtn) {
      const id = parseInt(editBtn.dataset.id, 10);
      openEditGuideModal(id);
    } else if (toggleBtn) {
      const id = parseInt(toggleBtn.dataset.id, 10);
      toggleGuideStatus(id);
    } else if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id, 10);
      deleteGuide(id);
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveGuideFromForm();
  });
}

function openEditGuideModal(id) {
  const guides = getAdminGuides();
  const guide = guides.find(g => g.id === id);
  if (!guide) return;

  currentEditingGuideId = id;
  const modal = document.getElementById('guideModal');
  document.getElementById('guideModalTitle').textContent = 'Editar Guía Educativa';

  document.getElementById('guideTitle').value = guide.title;
  document.getElementById('guideCategory').value = guide.category;
  document.getElementById('guideAuthor').value = guide.author;
  document.getElementById('guideSummary').value = guide.summary;
  document.getElementById('guideImage').value = guide.coverImage;

  modal?.classList.add('active');
}

function saveGuideFromForm() {
  const guides = getAdminGuides();
  const title = document.getElementById('guideTitle').value.trim();
  const category = document.getElementById('guideCategory').value;
  const author = document.getElementById('guideAuthor').value.trim();
  const summary = document.getElementById('guideSummary').value.trim();
  const coverImage = document.getElementById('guideImage').value.trim() || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600';

  if (currentEditingGuideId) {
    const index = guides.findIndex(g => g.id === currentEditingGuideId);
    if (index !== -1) {
      guides[index].title = title;
      guides[index].category = category;
      guides[index].author = author;
      guides[index].summary = summary;
      guides[index].coverImage = coverImage;
      saveAdminGuides(guides);
      showToast("Guía educativa actualizada exitosamente.");
    }
  } else {
    const newGuide = {
      id: Date.now(),
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      author: author || 'Equipo Agronómico Honatu',
      summary,
      coverImage,
      isPublished: true,
      readCount: 1,
      publishedAt: new Date().toISOString().split('T')[0],
      resources: [
        { id: Date.now(), name: 'Documento Técnico (PDF)', type: 'PDF', url: '#' }
      ]
    };
    guides.unshift(newGuide);
    saveAdminGuides(guides);
    showToast("¡Nueva guía publicada en el blog!");
  }

  document.getElementById('guideModal')?.classList.remove('active');
  renderGuidesTable();
}

function toggleGuideStatus(id) {
  const guides = getAdminGuides();
  const guide = guides.find(g => g.id === id);
  if (guide) {
    guide.isPublished = !guide.isPublished;
    saveAdminGuides(guides);
    showToast(`Guía ${guide.isPublished ? 'publicada' : 'guardada como borrador'}.`);
    renderGuidesTable();
  }
}

function deleteGuide(id) {
  if (confirm("¿Estás seguro de eliminar esta guía educativa?")) {
    const guides = getAdminGuides().filter(g => g.id !== id);
    saveAdminGuides(guides);
    showToast("Guía eliminada.");
    renderGuidesTable();
  }
}
