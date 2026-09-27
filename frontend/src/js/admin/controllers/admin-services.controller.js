/* ============================================
   HONATU – Admin Services Controller
   Advisories, Greenhouse Construction & Quotes
   ============================================ */

import { getAdminServices, saveAdminServices } from '../data/admin-mock-data.js';
import { showToast } from '../../middleware/toast.middleware.js';

export function initAdminServices() {
  renderServicesTable();
  bindServiceEvents();
}

export function renderServicesTable() {
  const tbody = document.getElementById('adminServicesTableBody');
  if (!tbody) return;

  const services = getAdminServices();

  tbody.innerHTML = services.map(s => `
    <tr>
      <td>
        <strong>${s.clientName}</strong>
        <div style="font-size: 0.75rem; color: var(--color-gray-500);">${s.contactEmail} • ${s.contactPhone}</div>
      </td>
      <td>
        <span class="status-pill" style="background: ${s.serviceType === 'CONSTRUCTION' ? 'rgba(184, 115, 51, 0.12)' : 'rgba(94, 130, 84, 0.14)'}; color: ${s.serviceType === 'CONSTRUCTION' ? 'var(--color-terracotta)' : 'var(--color-forest)'};">
          ${s.serviceType === 'CONSTRUCTION' ? 'Invernadero' : 'Asesoría Técnica'}
        </span>
      </td>
      <td>${s.serviceTitle}</td>
      <td><span style="font-size: 0.8rem; color: var(--color-gray-500);">${s.requestedAt}</span></td>
      <td>
        <span class="status-pill ${s.status === 'ACCEPTED' ? 'paid' : s.status === 'IN_REVIEW' ? 'pending' : 'draft'}">
          ${s.status === 'ACCEPTED' ? '✓ Cotizado y Aceptado' : s.status === 'IN_REVIEW' ? 'En Revisión' : 'Pendiente'}
        </span>
      </td>
      <td>
        <button type="button" class="btn-admin-pill btn-view-service" data-id="${s.id}">
          Ver Detalle & Cotización
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
      const id = parseInt(viewBtn.dataset.id, 10);
      openServiceDetailModal(id);
    }
  });
}

function openServiceDetailModal(serviceId) {
  const services = getAdminServices();
  const service = services.find(s => s.id === serviceId);
  if (!service) return;

  const modal = document.getElementById('serviceModal');
  document.getElementById('serviceModalTitle').textContent = `Solicitud #${service.id}: ${service.clientName}`;

  const detailContainer = document.getElementById('serviceDetailContent');
  const d = service.details || {};

  let detailHtml = `
    <div style="background: var(--color-stone-light); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px; color: var(--color-forest); font-family: var(--font-display);">${service.serviceTitle}</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem;">
        <div><strong>Contacto:</strong> ${service.clientName}</div>
        <div><strong>Correo:</strong> ${service.contactEmail}</div>
        <div><strong>Teléfono:</strong> ${service.contactPhone}</div>
        <div><strong>Fecha:</strong> ${service.requestedAt}</div>
        ${d.surfaceM2 ? `<div><strong>Superficie:</strong> ${d.surfaceM2} m²</div>` : ''}
        ${d.targetCrop ? `<div><strong>Cultivo:</strong> ${d.targetCrop}</div>` : ''}
        ${d.location ? `<div><strong>Ubicación:</strong> ${d.location}</div>` : ''}
        ${d.modality ? `<div><strong>Modalidad:</strong> ${d.modality}</div>` : ''}
      </div>
      ${d.notes || d.problemDescription ? `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--color-gray-200); font-size: 0.84rem;">
          <strong>Notas / Diagnóstico:</strong> ${d.notes || d.problemDescription}
        </div>
      ` : ''}
    </div>
  `;

  if (service.quote) {
    const q = service.quote;
    detailHtml += `
      <div style="background: #FFFFFF; border: 1px solid var(--color-gray-200); padding: 16px; border-radius: var(--radius-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="margin: 0; color: var(--color-forest); font-family: var(--font-display);">Cotización Emitida</h4>
          <span class="status-pill ${q.status === 'ACCEPTED' ? 'paid' : 'pending'}">${q.status}</span>
        </div>
        <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 12px;">
          ${(q.breakdown || []).map(b => `
            <tr style="border-bottom: 1px solid var(--color-gray-100);">
              <td style="padding: 6px 0;">${b.concept}</td>
              <td style="text-align: right; font-weight: 600;">$${b.cost.toLocaleString('es-MX')}</td>
            </tr>
          `).join('')}
          <tr>
            <td style="padding: 10px 0; font-weight: 700; font-size: 0.95rem;">TOTAL ESTIMADO:</td>
            <td style="text-align: right; font-weight: 800; font-size: 1.1rem; color: var(--color-forest);">$${q.totalAmount.toLocaleString('es-MX')}</td>
          </tr>
        </table>
        <div style="font-size: 0.78rem; color: var(--color-gray-500);">Válida hasta: ${q.validUntil}</div>
      </div>
    `;
  } else {
    detailHtml += `
      <div style="text-align: center; padding: 20px; background: rgba(35, 78, 40, 0.04); border-radius: var(--radius-md);">
        <p style="margin-bottom: 12px; font-size: 0.9rem;">Esta solicitud está pendiente de cotización técnica.</p>
        <button type="button" class="btn btn-primary btn-sm" id="btnEmitQuote">
          Emitir Cotización Rápida
        </button>
      </div>
    `;
  }

  detailContainer.innerHTML = detailHtml;

  document.getElementById('btnEmitQuote')?.addEventListener('click', () => {
    service.status = 'ACCEPTED';
    service.quote = {
      totalAmount: 18500,
      validUntil: '2026-09-01',
      status: 'ISSUED',
      breakdown: [
        { concept: 'Diagnóstico en campo y análisis químico', cost: 8500 },
        { concept: 'Plan de nutrición personalizado y seguimiento', cost: 10000 },
      ]
    };
    saveAdminServices(services);
    showToast("¡Cotización generada y guardada!");
    modal?.classList.remove('active');
    renderServicesTable();
  });

  modal?.classList.add('active');
}
