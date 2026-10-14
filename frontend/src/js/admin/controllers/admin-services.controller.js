/* ============================================
   HONATU – Admin Services Controller
   Advisories, Greenhouse Construction & Quotes
   ============================================ */

import { apiFetch } from '../../config.js';
import { adminCache, loadServices } from '../data/admin-api.js';
import { showToast } from '../../middleware/toast.middleware.js';

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  REVIEW: 'En Revisión',
  ACCEPTED: 'Aceptada',
  COMPLETED: 'Completada',
  REJECTED: 'Rechazada'
};

export function initAdminServices() {
  loadServices()
    .then(() => renderServicesTable())
    .catch(err => {
      console.error('Error cargando solicitudes:', err);
      showToast('No se pudieron cargar las solicitudes del servidor.');
    });
  bindServiceEvents();
}

export function renderServicesTable() {
  const tbody = document.getElementById('adminServicesTableBody');
  if (!tbody) return;

  const services = adminCache.services;

  if (services.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 32px; color: var(--color-gray-500);">
          No hay solicitudes de servicio registradas todavía.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = services.map(s => `
    <tr>
      <td>
        <strong>${s.clientName}</strong>
        <div style="font-size: 0.75rem; color: var(--color-gray-500);">${s.contactEmail} • ${s.contactPhone || 'Sin teléfono'}</div>
      </td>
      <td>
        <span class="status-pill" style="background: ${s.serviceType === 'CONSTRUCTION' ? 'rgba(184, 115, 51, 0.12)' : 'rgba(94, 130, 84, 0.14)'}; color: ${s.serviceType === 'CONSTRUCTION' ? 'var(--color-terracotta)' : 'var(--color-forest)'};">
          ${s.serviceType === 'CONSTRUCTION' ? 'Invernadero' : 'Asesoría Técnica'}
        </span>
      </td>
      <td>${s.serviceTitle}</td>
      <td><span style="font-size: 0.8rem; color: var(--color-gray-500);">${s.requestedAt}</span></td>
      <td>
        <span class="status-pill ${s.rawStatus === 'ACCEPTED' || s.rawStatus === 'COMPLETED' ? 'paid' : s.rawStatus === 'REVIEW' ? 'pending' : s.rawStatus === 'REJECTED' ? 'draft' : 'draft'}">
          ${STATUS_LABELS[s.rawStatus] || 'Pendiente'}
        </span>
      </td>
      <td>
        <button type="button" class="btn-admin-pill btn-view-service" data-id="${s.id}">
          Ver Detalle
        </button>
      </td>
    </tr>
  `).join('');
}

function bindServiceEvents() {
  const modal = document.getElementById('serviceModal');
  const closeBtn = document.getElementById('closeServiceModal');

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });

  document.getElementById('adminServicesTableBody')?.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.btn-view-service');
    if (viewBtn) {
      openServiceDetailModal(viewBtn.dataset.id);
    }
  });
}

async function setServiceStatus(id, status) {
  const res = await apiFetch(`/api/service-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message);
}

function openServiceDetailModal(serviceId) {
  const service = adminCache.services.find(s => s.id === serviceId);
  if (!service) return;

  const modal = document.getElementById('serviceModal');
  document.getElementById('serviceModalTitle').textContent = `Solicitud: ${service.clientName}`;

  const detailContainer = document.getElementById('serviceDetailContent');
  const d = service.details || {};

  detailContainer.innerHTML = `
    <div style="background: var(--color-stone-light); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px; color: var(--color-forest); font-family: var(--font-display);">${service.serviceTitle}</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem;">
        <div><strong>Contacto:</strong> ${service.clientName}</div>
        <div><strong>Correo:</strong> ${service.contactEmail}</div>
        <div><strong>Teléfono:</strong> ${service.contactPhone || 'N/D'}</div>
        <div><strong>Fecha:</strong> ${service.requestedAt}</div>
        ${d.location ? `<div><strong>Ubicación:</strong> ${d.location}</div>` : ''}
      </div>
      ${d.notes ? `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--color-gray-200); font-size: 0.84rem; white-space: pre-line;">
          <strong>Detalles:</strong> ${d.notes}
        </div>
      ` : ''}
    </div>

    <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; padding: 12px;">
      <button type="button" class="btn btn-secondary btn-sm" data-status="REVIEW">Marcar En Revisión</button>
      <button type="button" class="btn btn-primary btn-sm" data-status="ACCEPTED">Aceptar</button>
      <button type="button" class="btn btn-primary btn-sm" data-status="COMPLETED">Completada</button>
      <button type="button" class="btn btn-secondary btn-sm" data-status="REJECTED" style="color: var(--color-terracotta);">Rechazar</button>
    </div>
  `;

  detailContainer.querySelectorAll('[data-status]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        btn.disabled = true;
        await setServiceStatus(serviceId, btn.dataset.status);
        showToast(`Solicitud marcada como "${STATUS_LABELS[btn.dataset.status]}".`);
        modal?.classList.remove('active');
        await loadServices(true);
        renderServicesTable();
      } catch (error) {
        console.error('Error actualizando solicitud:', error);
        showToast('No se pudo actualizar el estado.');
        btn.disabled = false;
      }
    });
  });

  modal?.classList.add('active');
}
