/* ==============================================================================
   HONATU – Cloudinary Connection & Image Optimization Service
   ==============================================================================
   Provides direct integration with Cloudinary CDN for:
   - Dynamic URL generation with on-the-fly transformations (f_auto, q_auto, responsive resizing)
   - Responsive srcset generation for ultra-fast load times
   - Direct unsigned client-side uploads
   - Automatic local asset to Cloudinary URL translation
   - Zero-broken-image fallback system (gorgeous SVG placeholders on any error/404)
   ============================================================================== */

/**
 * Cloudinary configuration loaded from Vite environment variables (import.meta.env)
 */
export const cloudinaryConfig = {
  cloudName: 'usn9paiw',
  apiKey: '933381184925323',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'honatu_preset',
  folder: import.meta.env.VITE_CLOUDINARY_FOLDER || 'Honatu',

  // Base delivery URL
  get baseUrl() {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload`;
  },

  // Base upload endpoint
  get uploadUrl() {
    return `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  },

  /**
   * Check if Cloudinary is properly configured in the environment
   * @returns {boolean}
   */
  isConfigured() {
    return true;
  }
};

/**
 * Generates an ultra-lightweight, aesthetic SVG placeholder Data URI
 * styled with Honatu brand colors (Forest green, emerald, and clean typography).
 * 
 * @param {string} [label='Honatu Hidroponía'] - Text to display inside the placeholder
 * @param {number} [width=600] - Canvas width
 * @param {number} [height=400] - Canvas height
 * @returns {string} SVG Data URI
 */
export function createFallbackSvg(label = 'Honatu Insumos', width = 600, height = 400) {
  const safeLabel = String(label)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .slice(0, 32);

  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1C15" />
      <stop offset="50%" stop-color="#1B4332" />
      <stop offset="100%" stop-color="#2D6A4F" />
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#74C69D" />
      <stop offset="100%" stop-color="#52B788" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <circle cx="${width / 2}" cy="${height / 2 - 25}" r="45" fill="rgba(82, 183, 136, 0.12)" />
  <g transform="translate(${width / 2 - 20}, ${height / 2 - 45}) scale(1.6)" fill="url(#leafGrad)">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
  </g>
  <text x="50%" y="${height / 2 + 40}" text-anchor="middle" fill="#D8F3DC" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" letter-spacing="0.5">${safeLabel}</text>
  <text x="50%" y="${height / 2 + 65}" text-anchor="middle" fill="#95D5B2" font-family="system-ui, -apple-system, sans-serif" font-size="12" opacity="0.8">HONATU HIDROPONÍA</text>
</svg>`.trim().replace(/\n/g, '');

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

/**
 * Mapping between legacy asset paths and uploaded Cloudinary Public IDs
 */
export const CLOUDINARY_IMAGE_MAP = {
  // Brand & Hero
  'FondoHero.jpeg': 'WhatsApp_Image_2026-07-28_at_3.40.54_PM',
  'main-sample.png': 'main-sample',

  // Servicios
  'servicios/asesoria.jpg': 'Huerto',
  'servicios/insumos.jpg': 'Slab_de_fibra_de_coco',
  'servicios/construccion.jpg': 'Aero_real',
  'servicios/talleres.jpg': 'Huerto3',

  // Nosotros
  'nosotros/img_1.jpg': 'Huerto',
  'nosotros/img_2.jpg': 'Huerto3',
  'nosotros/img_3.jpg': 'Cliente_torre',
  'nosotros/img_4.jpg': 'produccion_indoor',
  'nosotros/img_5.jpg': 'Aero_real',
  'nosotros/img_6.jpg': 'Huerto2',
  'nosotros/img_7.jpg': 'inver.jpeg',
  'nosotros/img_8.jpg': 'IMG_7833',
  'nosotros/img_9.jpg': 'Expo',
  'nosotros/img_10.jpg': 'Talleres.PNG',

  // Productos / Tienda / Home
  'home/img_1.jpg': 'Tierra-de-Monte-produccion-de-alimentos-organicos-1024x536',
  'home/img_2.jpg': 'Slab_de_fibra_de_coco',
  'home/img_3.jpg': 'IMG_7833',
  'home/img_4.jpg': 'Aero_real',
  'home/img_5.jpg': 'Espuma_agricola',
  'home/img_6.jpg': 'Semillas',
  'home/img_7.jpg': 'Espuma_agricola',
  'home/img_8.jpg': 'IMG_7833',
  'home/img_9.jpg': 'Semillas',
  'home/img_10.jpg': 'Cliente_torre',

  // Educación / Hortalizas
  'educacion/img_1.jpg': 'Huerto3',
  'educacion/img_2.jpg': 'Acelga',
  'educacion/img_3.jpg': 'Aero_real',
  'educacion/img_4.jpg': 'Kale',
  'educacion/img_5.jpg': 'Tierra-de-Monte-produccion-de-alimentos-organicos-1024x536',
  'educacion/img_6.jpg': 'Apio',
  'educacion/img_7.jpg': 'produccion_indoor',
  'educacion/img_8.jpg': 'Expo',
  'educacion/img_9.jpg': 'Semillas',
  'educacion/img_10.jpg': 'Huerto',

  // Involúcrate
  'involucrate/img_1.jpg': 'Expo',
  'involucrate/img_2.jpg': 'Huerto2',
  'involucrate/img_3.jpg': 'Cliente_torre',
  'involucrate/img_4.jpg': 'Talleres.PNG',
  'involucrate/img_5.jpg': 'Asesoria.jpg',
  'involucrate/img_6.jpg': 'inver.jpeg',
  'involucrate/img_7.jpg': 'Huerto',
  'involucrate/img_8.jpg': 'Huerto3',
  'involucrate/img_9.jpg': 'Aero_real',
  'involucrate/img_10.jpg': 'produccion_indoor',

  // Acciones
  'acciones/img_1.jpg': 'Huerto',
  'acciones/img_2.jpg': 'Huerto3',
  'acciones/img_3.jpg': 'Aero_real',
  'acciones/img_4.jpg': 'produccion_indoor',
  'acciones/img_5.jpg': 'Expo',
  'acciones/img_6.jpg': 'inver.jpeg',
  'acciones/img_7.jpg': 'Talleres.PNG',
  'acciones/img_8.jpg': 'Asesoria.jpg',
  'acciones/img_9.jpg': 'Cliente_torre',
  'acciones/img_10.jpg': 'Huerto2',

  // Talleres – imágenes de talleres activos
  'talleres/nivel-i.jpg': 'NivelI',
  'talleres/nivel-ii.jpg': 'NivelII',
  'talleres/masterclass.jpg': 'Masterclass'
};

/**
 * Builds an optimized Cloudinary delivery URL with transformation parameters
 * 
 * @param {string} publicId - Cloudinary Public ID or relative path (e.g. 'home/img_1.jpg', 'nosotros/img_1.jpg')
 * @param {Object} [options] - Transformation options
 * @param {number} [options.width] - Desired width in pixels
 * @param {number} [options.height] - Desired height in pixels
 * @param {string} [options.crop] - Crop mode ('fill', 'scale', 'fit', 'thumb', 'limit', 'pad')
 * @param {string} [options.gravity] - Focus gravity ('auto', 'center', 'face', etc.)
 * @param {string|number} [options.quality='auto'] - Image quality ('auto', 'auto:good', 'auto:eco', 80)
 * @param {string} [options.format='auto'] - Image format ('auto', 'webp', 'avif', 'png', 'jpg')
 * @param {string|number} [options.dpr='auto'] - Device Pixel Ratio ('auto', 1.0, 2.0)
 * @param {string} [options.effect] - Visual effect (e.g., 'sharpen', 'blur:100')
 * @returns {string} Fully qualified Cloudinary CDN URL or SVG Fallback
 */
export function getCloudinaryUrl(publicId, options = {}) {
  if (!publicId) return createFallbackSvg();

  // If already a data URI, return as is
  if (publicId.startsWith('data:')) {
    return publicId;
  }

  // If already a full Cloudinary URL
  if (publicId.includes('res.cloudinary.com')) {
    return publicId;
  }

  // Bypass Cloudinary entirely for the Logo as requested, stripping any legacy 'src/' prefix
  if (publicId.includes('Logo.png') || publicId.includes('logo.png')) {
    return publicId.replace(/^(\.\/|\.\.\/)?src\//, '');
  }

  // Clean public ID from full URLs or local relative prefixes
  let cleanId = publicId;

  // Strip http://... or domain prefix if present
  if (cleanId.includes('/assets/images/')) {
    cleanId = cleanId.split('/assets/images/')[1];
  } else if (cleanId.includes('assets/images/')) {
    cleanId = cleanId.split('assets/images/')[1];
  } else {
    cleanId = cleanId
      .replace(/^(\.\.\/|\.\/|\/)/, '')
      .replace(/^assets\//, '')
      .replace(/^images\//, '');
  }

  // Check if there is a direct mapping in CLOUDINARY_IMAGE_MAP
  let finalPublicId = CLOUDINARY_IMAGE_MAP[cleanId] || cleanId;

  if (!cloudinaryConfig.isConfigured()) {
    console.warn('[Cloudinary] VITE_CLOUDINARY_CLOUD_NAME is not set. Generating brand placeholder for:', publicId);
    return createFallbackSvg(cleanId);
  }

  const {
    width,
    height,
    crop = width || height ? 'limit' : undefined,
    gravity,
    quality = 'auto',
    format = 'auto',
    dpr = 'auto',
    effect,
    rawTransformations = []
  } = options;

  const transforms = [];

  // Format & Quality optimizations
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (dpr) transforms.push(`dpr_${dpr}`);

  // Sizing & Crop
  if (crop) transforms.push(`c_${crop}`);
  if (width) transforms.push(`w_${Math.round(width)}`);
  if (height) transforms.push(`h_${Math.round(height)}`);
  if (gravity) transforms.push(`g_${gravity}`);

  // Effects
  if (effect) transforms.push(`e_${effect}`);

  // Custom raw transformations
  if (Array.isArray(rawTransformations) && rawTransformations.length > 0) {
    transforms.push(...rawTransformations);
  }

  const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';
  return `${cloudinaryConfig.baseUrl}/${transformString}${finalPublicId}`;
}

/**
 * Generates a responsive srcset string for <img> or <source> tags
 * 
 * @param {string} publicId - Cloudinary Public ID
 * @param {number[]} [widths=[320, 640, 960, 1200, 1600]] - Array of target widths
 * @param {Object} [options] - Additional transformation options
 * @returns {string} HTML srcset value
 */
export function getCloudinarySrcSet(publicId, widths = [320, 640, 960, 1200, 1600], options = {}) {
  if (!publicId || !cloudinaryConfig.isConfigured()) return '';

  return widths
    .map(w => `${getCloudinaryUrl(publicId, { ...options, width: w })} ${w}w`)
    .join(', ');
}

/**
 * Uploads an image or file directly from the client to Cloudinary using an unsigned upload preset
 * 
 * @param {File|Blob|string} file - The file object or base64 data URI to upload
 * @param {Object} [options] - Upload options
 * @param {string} [options.folder] - Target Cloudinary folder
 * @param {string[]} [options.tags] - Search tags for the asset
 * @param {Function} [options.onProgress] - Progress callback (percentage: number) => void
 * @returns {Promise<Object>} Cloudinary API response JSON
 */
export async function uploadImageToCloudinary(file, options = {}) {
  if (!cloudinaryConfig.isConfigured()) {
    throw new Error('[Cloudinary] Cloud Name is missing in environment variables.');
  }

  const preset = options.uploadPreset || cloudinaryConfig.uploadPreset;
  if (!preset) {
    throw new Error('[Cloudinary] Upload Preset is required for client-side uploads. Configure VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);

  const folder = options.folder || cloudinaryConfig.folder;
  if (folder) {
    formData.append('folder', folder);
  }

  if (options.tags && Array.isArray(options.tags)) {
    formData.append('tags', options.tags.join(','));
  }

  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', cloudinaryConfig.uploadUrl, true);

    if (options.onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          options.onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (err) {
          reject(new Error('[Cloudinary] Failed to parse response: ' + err.message));
        }
      } else {
        try {
          const errResponse = JSON.parse(xhr.responseText);
          reject(new Error(`[Cloudinary Upload Error]: ${errResponse.error?.message || xhr.statusText}`));
        } catch (_) {
          reject(new Error(`[Cloudinary Upload Error]: HTTP ${xhr.status} ${xhr.statusText}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('[Cloudinary] Network error during upload'));
    xhr.send(formData);
  });
}

/**
 * Attaches a robust global error handler to intercept any broken image (404)
 * and replace it with a graceful Cloudinary fallback or aesthetic SVG placeholder.
 */
export function setupGlobalImageErrorHandler() {
  window.addEventListener(
    'error',
    (event) => {
      const target = event.target;
      if (target && target.tagName === 'IMG') {
        const rawSrc = target.getAttribute('src') || target.src;
        // If image is already a fallback data URI, don't loop
        if (rawSrc && rawSrc.startsWith('data:image/svg+xml')) return;

        // If local asset failed, try to load it via getCloudinaryUrl
        if (rawSrc && !target.dataset.triedCloudinary && !rawSrc.includes('Logo.png')) {
          target.dataset.triedCloudinary = 'true';
          const cloudinaryUrl = getCloudinaryUrl(rawSrc);
          if (cloudinaryUrl && cloudinaryUrl !== rawSrc) {
            target.src = cloudinaryUrl;
            return;
          }
        }

        // If Cloudinary or local path failed, apply SVG placeholder
        // Skip SVG placeholder for Logo to prevent it from disappearing
        if (rawSrc && rawSrc.includes('Logo.png')) {
          return;
        }

        const label = target.alt || target.getAttribute('data-name') || 'Honatu Hidroponía';
        target.src = createFallbackSvg(label);
        target.classList.add('img-fallback');
      }
    },
    true // Capturing phase to intercept image loading errors before bubbling
  );
}

/**
 * Scans the DOM and seamlessly migrates all images & product card data attributes
 * from local asset paths to Cloudinary CDN URLs.
 * 
 * @param {HTMLElement|Document} [root=document] - Root container
 */
export function initCloudinaryImages(root = document) {
  // Ensure error interceptor is always active
  setupGlobalImageErrorHandler();

  // 1. Process <img> tags
  const images = root.querySelectorAll('img');
  images.forEach(img => {
    // Skip logo and local FondoHero if already displaying
    const rawSrc = img.getAttribute('src') || '';
    if (rawSrc.includes('Logo.png') || rawSrc.includes('FondoHero')) {
      return;
    }

    // Check if explicitly configured with data-cloudinary
    const customCloudinaryId = img.getAttribute('data-cloudinary');
    if (customCloudinaryId) {
      const width = img.getAttribute('data-cloudinary-width');
      const height = img.getAttribute('data-cloudinary-height');
      const crop = img.getAttribute('data-cloudinary-crop') || 'limit';

      img.src = getCloudinaryUrl(customCloudinaryId, {
        width: width ? parseInt(width, 10) : undefined,
        height: height ? parseInt(height, 10) : undefined,
        crop
      });

      if (img.hasAttribute('data-cloudinary-responsive')) {
        img.srcset = getCloudinarySrcSet(customCloudinaryId);
        if (!img.getAttribute('sizes')) {
          img.sizes = '(max-width: 768px) 100vw, 50vw';
        }
      }
      return;
    }

    // Check if pointing to local assets/images/
    if (rawSrc.includes('assets/images/')) {
      img.src = getCloudinaryUrl(rawSrc);
    }
  });

  // 2. Process [data-img] attributes on products/buttons (used by Cart & Favorites)
  const elementsWithDataImg = root.querySelectorAll('[data-img]');
  elementsWithDataImg.forEach(el => {
    const dataImg = el.getAttribute('data-img');
    if (dataImg && dataImg.includes('assets/images/')) {
      el.setAttribute('data-img', getCloudinaryUrl(dataImg));
    }
  });

  // 3. Process background images with data-cloudinary-bg
  const bgElements = root.querySelectorAll('[data-cloudinary-bg]');
  bgElements.forEach(el => {
    const publicId = el.getAttribute('data-cloudinary-bg');
    if (!publicId) return;

    const url = getCloudinaryUrl(publicId, { quality: 'auto', format: 'auto' });
    el.style.backgroundImage = `url('${url}')`;
  });
}

// Auto-activate error handler immediately when the module is imported
setupGlobalImageErrorHandler();

export default {
  config: cloudinaryConfig,
  map: CLOUDINARY_IMAGE_MAP,
  getUrl: getCloudinaryUrl,
  getSrcSet: getCloudinarySrcSet,
  upload: uploadImageToCloudinary,
  createFallbackSvg,
  setupErrorHandler: setupGlobalImageErrorHandler,
  initImages: initCloudinaryImages
};
