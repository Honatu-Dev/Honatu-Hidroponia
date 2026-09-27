/* ============================================
   HONATU – Admin Frontend Configuration Controller
   Live Visual Editor for Home Hero, Topbar & Promos
   ============================================ */

import { getFrontendConfig, saveFrontendConfig } from '../data/admin-mock-data.js';
import { showToast } from '../../middleware/toast.middleware.js';

export function initAdminFrontend() {
  loadFrontendConfigIntoForm();
  bindFrontendEvents();
}

export function loadFrontendConfigIntoForm() {
  const config = getFrontendConfig();
  if (!config) return;

  // Hero Fields
  const h = config.hero || {};
  const heroBadge = document.getElementById('feHeroBadge');
  const heroTitle = document.getElementById('feHeroTitle');
  const heroSub = document.getElementById('feHeroSubtitle');
  const heroCta1Text = document.getElementById('feHeroCta1Text');
  const heroCta1Link = document.getElementById('feHeroCta1Link');
  const heroCta2Text = document.getElementById('feHeroCta2Text');
  const heroCta2Link = document.getElementById('feHeroCta2Link');
  const heroImage = document.getElementById('feHeroImage');

  if (heroBadge) heroBadge.value = h.badge || '';
  if (heroTitle) heroTitle.value = h.title || '';
  if (heroSub) heroSub.value = h.subtitle || '';
  if (heroCta1Text) heroCta1Text.value = h.ctaPrimaryText || '';
  if (heroCta1Link) heroCta1Link.value = h.ctaPrimaryLink || '';
  if (heroCta2Text) heroCta2Text.value = h.ctaSecondaryText || '';
  if (heroCta2Link) heroCta2Link.value = h.ctaSecondaryLink || '';
  if (heroImage) heroImage.value = h.heroImage || '';

  // Topbar Notice Fields
  const t = config.topbarNotice || {};
  const tbEnabled = document.getElementById('feTopbarEnabled');
  const tbText = document.getElementById('feTopbarText');
  const tbLink = document.getElementById('feTopbarLink');

  if (tbEnabled) tbEnabled.checked = !!t.enabled;
  if (tbText) tbText.value = t.text || '';
  if (tbLink) tbLink.value = t.linkText || '';

  updateLivePreview();
}

function updateLivePreview() {
  const badge = document.getElementById('feHeroBadge')?.value || 'TECNOLOGÍA HIDROPÓNICA';
  const title = document.getElementById('feHeroTitle')?.value || 'Cultiva el Futuro';
  const sub = document.getElementById('feHeroSubtitle')?.value || 'Soluciones minerales balanceadas...';
  const cta1 = document.getElementById('feHeroCta1Text')?.value || 'Explorar Catálogo';
  const cta2 = document.getElementById('feHeroCta2Text')?.value || 'Ver Talleres';
  const noticeEnabled = document.getElementById('feTopbarEnabled')?.checked;
  const noticeText = document.getElementById('feTopbarText')?.value || '';

  const prevBadge = document.getElementById('prevHeroBadge');
  const prevTitle = document.getElementById('prevHeroTitle');
  const prevSub = document.getElementById('prevHeroSubtitle');
  const prevCta1 = document.getElementById('prevHeroCta1');
  const prevCta2 = document.getElementById('prevHeroCta2');
  const prevNotice = document.getElementById('prevTopbarNotice');

  if (prevBadge) prevBadge.textContent = badge;
  if (prevTitle) prevTitle.textContent = title;
  if (prevSub) prevSub.textContent = sub;
  if (prevCta1) prevCta1.textContent = cta1;
  if (prevCta2) prevCta2.textContent = cta2;

  if (prevNotice) {
    if (noticeEnabled && noticeText) {
      prevNotice.style.display = 'block';
      prevNotice.textContent = noticeText;
    } else {
      prevNotice.style.display = 'none';
    }
  }
}

function bindFrontendEvents() {
  const form = document.getElementById('frontendConfigForm');
  const inputs = form?.querySelectorAll('input, textarea');

  inputs?.forEach(input => {
    input.addEventListener('input', updateLivePreview);
    input.addEventListener('change', updateLivePreview);
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveFrontendConfigFromForm();
  });
}

function saveFrontendConfigFromForm() {
  const config = {
    hero: {
      badge: document.getElementById('feHeroBadge')?.value.trim(),
      title: document.getElementById('feHeroTitle')?.value.trim(),
      subtitle: document.getElementById('feHeroSubtitle')?.value.trim(),
      ctaPrimaryText: document.getElementById('feHeroCta1Text')?.value.trim(),
      ctaPrimaryLink: document.getElementById('feHeroCta1Link')?.value.trim(),
      ctaSecondaryText: document.getElementById('feHeroCta2Text')?.value.trim(),
      ctaSecondaryLink: document.getElementById('feHeroCta2Link')?.value.trim(),
      heroImage: document.getElementById('feHeroImage')?.value.trim(),
    },
    topbarNotice: {
      enabled: document.getElementById('feTopbarEnabled')?.checked,
      text: document.getElementById('feTopbarText')?.value.trim(),
      linkText: document.getElementById('feTopbarLink')?.value.trim(),
      linkUrl: 'talleres.html'
    },
    featured: {
      highlightProductIds: [1, 3, 4],
      highlightWorkshopId: 1
    }
  };

  saveFrontendConfig(config);
  showToast("¡Configuración del frontend guardada y publicada en la tienda!");
}
