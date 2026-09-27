/* ============================================
   HONATU – Planta Teléfono Foliage Decoration
   Clean botanical vines with balanced, gapless leaves
   ============================================ */

export function createVineDecoration() {
  const template = document.createElement('template');
  template.innerHTML = `
<svg style="width:0; height:0; position:absolute;">
  <defs>
    <linearGradient id="leafGradForm" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#34622B"/>
      <stop offset="60%" stop-color="#5E8254"/>
      <stop offset="100%" stop-color="#8DAF74"/>
    </linearGradient>

    <filter id="leafShadowForm" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
    </filter>

    <g id="real-leaf-form">
      <path d="M 0,0 Q 2,10 0,20" stroke="#2D5325" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M 0,20 C -25,0 -40,40 0,70 C 40,40 25,0 0,20 Z" fill="url(#leafGradForm)" filter="url(#leafShadowForm)" />
      <path d="M 0,20 Q 3,45 0,65" fill="none" stroke="#1B3B1E" stroke-width="1.5" opacity="0.6"/>
      <path d="M 0,30 Q -10,33 -15,30 M 0,40 Q -15,43 -20,37 M 0,50 Q -10,50 -15,45" fill="none" stroke="#1B3B1E" stroke-width="1" opacity="0.4"/>
      <path d="M 0,30 Q 10,33 15,30 M 0,40 Q 15,43 20,37 M 0,50 Q 10,50 15,45" fill="none" stroke="#1B3B1E" stroke-width="1" opacity="0.4"/>
    </g>
  </defs>
</svg>
<div class="form-vine-wrapper top-left">
  <svg width="300" height="300" viewBox="0 0 300 300" style="overflow:visible;">
    <path class="form-vine-stem" d="M 280,14 L 38,14 Q 14,14 14,38 L 14,280" filter="url(#leafShadowForm)"/>
    
    <!-- Top Branch — organic clusters with size variety -->
    <g class="form-vine-leaf leaf-delay-5" transform="translate(268, 14) rotate(-20)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.28)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(252, 16) rotate(170)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.45)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(218, 12) rotate(-40)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.55)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(205, 16) rotate(158)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.30)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(168, 15) rotate(-32)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.48)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(128, 13) rotate(162)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.38)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(95, 16) rotate(-45)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.52)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(88, 13) rotate(155)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.25)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(52, 15) rotate(-28)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.42)" /></g></g></g>
    
    <!-- Corner — big statement leaf -->
    <g class="form-vine-leaf leaf-delay-1" transform="translate(18, 18) rotate(-130)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.58)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(22, 10) rotate(-55)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.26)" /></g></g></g>
    
    <!-- Left Branch — drooping leaves, irregular clusters -->
    <g class="form-vine-leaf leaf-delay-3" transform="translate(16, 52) rotate(160)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.35)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(12, 78) rotate(-22)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.50)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(17, 88) rotate(170)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.28)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(13, 130) rotate(150)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.55)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(16, 168) rotate(-35)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.40)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(12, 175) rotate(165)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.24)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(15, 218) rotate(-28)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.48)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(17, 255) rotate(155)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.32)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(13, 272) rotate(-18)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.42)" /></g></g></g>
  </svg>
</div>
<div class="form-vine-wrapper bottom-right">
  <svg width="250" height="250" viewBox="0 0 250 250" style="overflow:visible;">
    <path class="form-vine-stem" d="M 14,236 L 212,236 Q 236,236 236,212 L 236,14" filter="url(#leafShadowForm)"/>
    
    <!-- Bottom Branch — varied clusters -->
    <g class="form-vine-leaf leaf-delay-5" transform="translate(32, 237) rotate(165)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.30)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(62, 234) rotate(-35)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.52)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(72, 237) rotate(155)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.24)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(115, 236) rotate(-30)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.46)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(152, 235) rotate(158)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.38)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(188, 237) rotate(-40)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.50)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(198, 234) rotate(168)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.26)" /></g></g></g>
    
    <!-- Corner — big leaf -->
    <g class="form-vine-leaf leaf-delay-1" transform="translate(232, 232) rotate(50)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.55)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(228, 224) rotate(-45)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.28)" /></g></g></g>
    
    <!-- Right Branch — organic drooping clusters -->
    <g class="form-vine-leaf leaf-delay-4" transform="translate(237, 198) rotate(-22)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.45)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-2" transform="translate(234, 165) rotate(160)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.52)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(237, 155) rotate(-38)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.25)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-1" transform="translate(235, 118) rotate(152)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.35)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-3" transform="translate(237, 82) rotate(-30)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.48)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-5" transform="translate(234, 72) rotate(165)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.22)" /></g></g></g>
    <g class="form-vine-leaf leaf-delay-4" transform="translate(236, 38) rotate(-25)"><g class="sway"><g class="leaf-pop"><use href="#real-leaf-form" transform="scale(0.42)" /></g></g></g>
  </svg>
</div>
  `;
  return template.content.cloneNode(true);
}

export function initVineDecorations() {
  const wrappers = document.querySelectorAll('.contact-form, .servicio-form-wrapper, .involve-form, .vine-container, [data-vines="true"]');
  if (!wrappers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Force reflow and trigger fresh growth animation
        entry.target.classList.remove('vines-grown');
        void entry.target.offsetWidth;
        entry.target.classList.add('vines-grown');
      } else {
        // Reset when leaving viewport so it grows again when returned to
        entry.target.classList.remove('vines-grown');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  wrappers.forEach(wrapper => {
    // Avoid double appending
    if (wrapper.querySelector('.form-vine-wrapper')) return;
    
    wrapper.style.position = 'relative';
    wrapper.style.zIndex = '1';
    wrapper.appendChild(createVineDecoration());

    observer.observe(wrapper);
  });
}
