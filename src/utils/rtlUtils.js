/**
 * RTL/LTR Utility Functions
 * Handles right-to-left and left-to-right layout switching
 */

/**
 * RTL languages list
 */
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * Check if a language is RTL
 * @param {string} language - Language code
 * @returns {boolean} - True if language is RTL
 */
export const isRTL = (language) => {
  return RTL_LANGUAGES.includes(language);
};

/**
 * Get text direction for a language
 * @param {string} language - Language code
 * @returns {string} - 'rtl' or 'ltr'
 */
export const getDirection = (language) => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

/**
 * Set HTML document direction and language
 * @param {string} language - Language code
 */
export const setDocumentDirection = (language) => {
  const dir = getDirection(language);
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
  
  // Add/remove RTL class on body for additional styling
  if (dir === 'rtl') {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
};

/**
 * Get the localized value of a field based on the current language.
 * Convention: name_ar, name_en, etc.
 * @param {object} item - The object containing the fields
 * @param {string} field - The base field name (e.g., 'name')
 * @param {string} lang - The current language code (e.g., 'ar', 'en')
 * @returns {string} - The localized field value, or the field value, or empty string
 */
export const getLangField = (item, field, lang) => {
  if (!item) return '';
  const langUpper = lang.charAt(0).toUpperCase() + lang.slice(1); // 'Ar' or 'En'
  const localizedField = `${field}_${langUpper.toLowerCase()}`; // 'name_ar' or 'name_en'
  
  // Try precise field name_ar/name_en
  if (item[localizedField]) return item[localizedField];
  
  // Fallback to base field if exists
  if (item[field]) return item[field];
  
  return '';
};

/**
 * Get opposite direction
 * @param {string} direction - Current direction ('rtl' or 'ltr')
 * @returns {string} - Opposite direction
 */
export const getOppositeDirection = (direction) => {
  return direction === 'rtl' ? 'ltr' : 'rtl';
};

/**
 * Apply RTL-specific styles to an element
 * @param {HTMLElement} element - DOM element
 * @param {object} styles - Style object with RTL/LTR variants
 */
export const applyDirectionalStyles = (element, styles) => {
  const dir = document.documentElement.dir;
  const stylesToApply = dir === 'rtl' ? styles.rtl : styles.ltr;
  
  Object.assign(element.style, stylesToApply);
};
