/**
 * Escapa caracteres HTML especiales para prevenir XSS al inyectar strings en innerHTML.
 * Preferir textContent/createElement cuando sea posible.
 */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escapa un valor para usarlo de forma segura dentro de un atributo HTML.
 */
export function escapeAttr(value) {
  return escapeHtml(value).replace(/\s/g, ' ');
}
