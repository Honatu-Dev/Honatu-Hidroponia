/* ============================================
   Phone Formatter Utility
   Formats phone numbers with proper spacing
   ============================================ */

/**
 * Formats a phone number to display format
 * Handles Mexican phone numbers: +52 (XXX) XXX-XXXX
 * @param {string} value - The phone number to format
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(value) {
  if (!value) return '';

  // Remove all non-digit characters except +
  let cleaned = value.replace(/[^\d+]/g, '');

  // Remove leading + if present (we'll add it back)
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Handle Mexican numbers (10 digits)
  if (cleaned.length >= 10) {
    // If it starts with 52 (country code), remove it for formatting
    if (cleaned.startsWith('52')) {
      cleaned = cleaned.substring(2);
    }

    // Format as +52 (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      const areaCode = cleaned.substring(0, 3);
      const firstPart = cleaned.substring(3, 6);
      const secondPart = cleaned.substring(6, 10);
      return `+52 (${areaCode}) ${firstPart}-${secondPart}`;
    }
  }

  // For other lengths, just add spacing every 3 digits
  if (cleaned.length > 0) {
    return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
  }

  return '';
}

/**
 * Initialize phone input formatting for all tel inputs
 */
export function initPhoneFormatting() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    // Format on input
    input.addEventListener('input', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });

    // Format on blur (in case user pastes)
    input.addEventListener('blur', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });

    // Format initial value if present
    if (input.value) {
      input.value = formatPhoneNumber(input.value);
    }
  });
}
