/* ============================================
   HONATU – Site Config Controller
   Aplica la configuración publicada desde el admin
   (hero, CTAs, imagen y aviso del topbar)
   ============================================ */

import { apiFetch } from '../config.js';

export async function initSiteConfig() {
  const hero = document.querySelector('.hero');
  if (!hero) return; // Solo aplica en la página de inicio

  try {
    const res = await apiFetch('/api/site-config');
    if (!res.ok) return;
    const config = await res.json();

    const h = config.hero || {};
    const h1 = hero.querySelector('h1');
    if (h1 && h.title) h1.textContent = h.title;

    const [cta1, cta2] = hero.querySelectorAll('.hero-actions a');
    if (cta1 && h.ctaPrimaryText) cta1.firstChild.textContent = h.ctaPrimaryText + ' ';
    if (cta1 && h.ctaPrimaryLink) cta1.href = h.ctaPrimaryLink;
    if (cta2 && h.ctaSecondaryText) cta2.textContent = h.ctaSecondaryText;
    if (cta2 && h.ctaSecondaryLink) cta2.href = h.ctaSecondaryLink;

    const heroImg = hero.querySelector('.hero-bg img');
    if (heroImg && h.heroImage) heroImg.src = h.heroImage;

    const t = config.topbarNotice || {};
    if (t.enabled && t.text) {
      const bar = document.createElement('div');
      bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999;background:var(--color-terracotta);color:#fff;text-align:center;font-size:0.85rem;font-weight:600;padding:8px 16px;';
      bar.textContent = t.linkText ? `${t.text} — ${t.linkText}` : t.text;
      if (t.linkUrl) {
        bar.style.cursor = 'pointer';
        bar.addEventListener('click', () => { window.location.href = t.linkUrl; });
      }
      document.body.prepend(bar);
      document.body.style.paddingTop = '36px';
    }
  } catch (error) {
    // Sin conexión o sin config guardada: se usa el contenido estático del HTML
    console.warn('Site config no disponible:', error);
  }
}
