import { QR_TYPES, generateQRContent } from './modules/qr-types';
import { createStyledQR, getStyledQRAsCanvas, getStyledQRAsDataURL, type DotStyle, type EyeStyle } from './modules/qr-design';
import type { QRConfig, QRType, QRShape, HistoryItem } from './types';

declare var THREE: any;

// =============================================
// App State
// =============================================
let currentType: QRType = 'text';
let currentDotStyle: DotStyle = 'square';
let currentEyeStyle: EyeStyle = 'square';
let currentShape: QRShape = 'square';
let currentFrameShape: 'rectangle' | 'rounded' | 'circle' = 'rectangle';
let currentFrameSymbol: string = '';
let currentFramePos: 'top' | 'bottom' | 'left' | 'right' | 'around' = 'top';
let currentFrameLineStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
let logoImage: HTMLImageElement | null = null;
let qrcode: any = null;

// =============================================
// DOM References
// =============================================
function $(id: string): HTMLElement {
  return document.getElementById(id) as HTMLElement;
}

function $$(selector: string): HTMLElement {
  return document.querySelector(selector) as HTMLElement;
}

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initTypeTabs();
  initContentFields();
  initSliders();
  initLabels();
  initLogo();
  initGradient();
  initBorder();
  initShapeButtons();
  initLivePreview();
  initGenerate();
  initExport();

  initSTLExport();
  init3DPreview();
});

// =============================================
// Dark Mode
// =============================================
function initDarkMode(): void {
  const toggle = $('darkModeToggle');
  const icon = $('darkModeIcon');

  const saved = localStorage.getItem('qr-darkmode');
  if (saved === 'true') setDarkMode(true);
  else if (saved === 'false') setDarkMode(false);
  else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) setDarkMode(true);

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setDarkMode(!isDark);
  });

  function setDarkMode(dark: boolean): void {
    document.body.classList.toggle('dark-mode', dark);
    document.body.classList.toggle('light-mode', !dark);
    icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('qr-darkmode', dark ? 'true' : 'false');
  }
}

// =============================================
// QR Type Tabs
// =============================================
function initTypeTabs(): void {
  const tabs = $('qrTypeTabs');
  tabs.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const tab = target.closest('.qr-type-tab') as HTMLElement;
    if (!tab) return;

    tabs.querySelectorAll('.qr-type-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentType = tab.dataset.type as QRType;
    renderContentFields(currentType);
  });
}

// =============================================
// Content Fields
// =============================================
function initContentFields(): void {
  renderContentFields('text');
}

function renderContentFields(type: QRType): void {
  const container = $('contentFields');
  const config = QR_TYPES[type];
  if (!config) return;

  let html = '';
  if (config.fields.length === 1 && config.fields[0].id === 'qrContent') {
    const f = config.fields[0];
    if (f.type === 'textarea') {
      html = `
        <label for="qrContent" class="form-label">
          <i class="${config.icon}"></i> ${f.label}
        </label>
        <textarea class="form-control" id="qrContent" rows="3" placeholder="${f.placeholder || ''}"${f.required ? ' required' : ''}></textarea>
      `;
    } else {
      html = `
        <label for="qrContent" class="form-label">
          <i class="${config.icon}"></i> ${f.label}
        </label>
        <input type="${f.type}" class="form-control" id="qrContent" placeholder="${f.placeholder || ''}"${f.required ? ' required' : ''}>
      `;
    }
  } else {
    html = `<label class="form-label"><i class="${config.icon}"></i> ${config.label}</label>`;
    config.fields.forEach(f => {
      if (f.type === 'select' && f.options) {
        html += `<select class="form-select mb-2" id="${f.id}">
          ${f.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
        </select>`;
      } else if (f.type === 'textarea') {
        html += `<textarea class="form-control mb-2" id="${f.id}" rows="2" placeholder="${f.placeholder || ''}"${f.required ? ' required' : ''}></textarea>`;
      } else {
        html += `<input type="${f.type}" class="form-control mb-2" id="${f.id}" placeholder="${f.placeholder || ''}"${f.required ? ' required' : ''}>`;
      }
    });
  }

  container.innerHTML = html;
  // Re-attach live preview listener
  const newContentField = $('qrContent');
  if (newContentField) {
    newContentField.addEventListener('input', updateLivePreview);
    newContentField.addEventListener('blur', () => {
      (newContentField as HTMLInputElement).value = (newContentField as HTMLInputElement).value.trim();
    });
  }
  updateLivePreview();
}

// =============================================
// Sliders
// =============================================
function initSliders(): void {
  $('qrSize').addEventListener('input', (e) => {
    $('sizeValue').textContent = (e.target as HTMLInputElement).value;
    regenerateIfActive();
  });
  $('labelSize').addEventListener('input', (e) => {
    $('labelSizeValue').textContent = (e.target as HTMLInputElement).value;
  });
  // Color changes trigger regeneration
  $('qrColorDark').addEventListener('input', () => regenerateIfActive());
  $('qrColorLight').addEventListener('input', () => regenerateIfActive());
}

// =============================================
// Labels
// =============================================
function initLabels(): void {
  ['labelTopEnable', 'labelBottomEnable', 'labelTopText', 'labelBottomText', 'labelSize', 'labelColor', 'labelBold'].forEach(id => {
    $(id).addEventListener('input', updateLabels);
    $(id).addEventListener('change', updateLabels);
  });
}

function updateLabels(): void {
  const topOn = ($('labelTopEnable') as HTMLInputElement).checked;
  const botOn = ($('labelBottomEnable') as HTMLInputElement).checked;
  const topTxt = ($('labelTopText') as HTMLInputElement).value;
  const botTxt = ($('labelBottomText') as HTMLInputElement).value;
  const sz = ($('labelSize') as HTMLInputElement).value;
  const clr = ($('labelColor') as HTMLInputElement).value;
  const bld = ($('labelBold') as HTMLInputElement).checked;

  const elTop = $('labelTop');
  const elBot = $('labelBottom');

  if (topOn && topTxt) {
    elTop.textContent = topTxt;
    elTop.style.display = 'block';
    elTop.style.fontSize = sz + 'px';
    elTop.style.color = clr;
    elTop.style.fontWeight = bld ? '700' : '400';
  } else { elTop.style.display = 'none'; }

  if (botOn && botTxt) {
    elBot.textContent = botTxt;
    elBot.style.display = 'block';
    elBot.style.fontSize = sz + 'px';
    elBot.style.color = clr;
    elBot.style.fontWeight = bld ? '700' : '400';
  } else { elBot.style.display = 'none'; }
}

// =============================================
// Logo
// =============================================

// Preset logo icons as SVG data URIs
const PRESET_LOGOS: Record<string, string> = {
  wifi: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>'),
  heart: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e74c3c"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'),
  star: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f39c12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'),
  home: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'),
  phone: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>'),
  mail: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'),
  whatsapp: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2325D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'),
  instagram: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'),
  facebook: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'),
  twitter: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231DA1F2"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'),
  linkedin: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.647H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'),
  youtube: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'),
};

function initLogo(): void {
  const area = $('logoUploadArea');
  const input = $('logoInput');
  const preview = $('logoPreview') as HTMLImageElement;
  const remove = $('logoRemove');

  // Preset logo buttons
  document.querySelectorAll('.preset-logo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const logoBtn = target.closest('.preset-logo-btn') as HTMLElement;
      if (!logoBtn) return;

      const logoKey = logoBtn.dataset.logo;
      if (!logoKey || !PRESET_LOGOS[logoKey]) return;

      const img = new Image();
      img.onload = () => {
        logoImage = img;
        preview.src = PRESET_LOGOS[logoKey];
        preview.style.display = 'block';
        remove.style.display = 'inline-block';
        area.classList.add('has-logo');
        document.querySelectorAll('.preset-logo-btn').forEach(b => b.classList.remove('active'));
        logoBtn.classList.add('active');
        regenerateIfActive();
      };
      img.src = PRESET_LOGOS[logoKey];
    });
  });

  // Drag & Drop handlers
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    area.classList.add('dragover');
  });

  area.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    area.classList.remove('dragover');
  });

  area.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    area.classList.remove('dragover');

    const files = (e as DragEvent).dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleLogoFile(file);
      }
    }
  });

  area.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.preset-logo-btn')) return;
    input.click();
  });

  // File handling function
  function handleLogoFile(file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        logoImage = img;
        preview.src = (ev.target as FileReader).result as string;
        preview.style.display = 'block';
        remove.style.display = 'inline-block';
        area.classList.add('has-logo');
        regenerateIfActive();
      };
      img.src = (ev.target as FileReader).result as string;
    };
    reader.readAsDataURL(file);
  }

  input.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) handleLogoFile(file);
  });

  remove.addEventListener('click', (e) => {
    e.stopPropagation();
    logoImage = null;
    preview.style.display = 'none';
    remove.style.display = 'none';
    area.classList.remove('has-logo');
    (input as HTMLInputElement).value = '';
    document.querySelectorAll('.preset-logo-btn').forEach(b => b.classList.remove('active'));
  });
}

// =============================================
// Gradient
// =============================================
function initGradient(): void {
  $('gradientEnable').addEventListener('change', (e) => {
    $('gradientOptions').classList.toggle('visible', (e.target as HTMLInputElement).checked);
    regenerateIfActive();
  });
  $('gradientColor').addEventListener('input', () => {
    regenerateIfActive();
  });
  $('gradientDirection').addEventListener('change', () => {
    regenerateIfActive();
  });
}

// =============================================
// Border
// =============================================
function initBorder(): void {
  $('borderEnable').addEventListener('change', (e) => {
    $('borderOptions').style.display = (e.target as HTMLInputElement).checked ? 'block' : 'none';
    regenerateIfActive();
  });
  $('borderColor').addEventListener('input', () => regenerateIfActive());
  $('frameText').addEventListener('input', () => regenerateIfActive());
  $('frameBgColor').addEventListener('input', () => regenerateIfActive());
  $('frameTextColor').addEventListener('input', () => regenerateIfActive());

  // Frame shape buttons
  document.querySelectorAll('.frame-shape-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const btn = target.closest('.frame-shape-btn') as HTMLElement;
      if (!btn) return;
      document.querySelectorAll('.frame-shape-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFrameShape = (btn.dataset.frame || 'rectangle') as 'rectangle' | 'rounded' | 'circle';
      regenerateIfActive();
    });
  });

  // Frame symbol buttons
  document.querySelectorAll('.frame-symbol-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const btn = target.closest('.frame-symbol-btn') as HTMLElement;
      if (!btn) return;
      document.querySelectorAll('.frame-symbol-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFrameSymbol = btn.dataset.symbol || '';
      regenerateIfActive();
    });
  });

  // Frame position buttons
  document.querySelectorAll('.frame-pos-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const btn = target.closest('.frame-pos-btn') as HTMLElement;
      if (!btn) return;
      document.querySelectorAll('.frame-pos-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFramePos = (btn.dataset.pos || 'top') as 'top' | 'bottom' | 'left' | 'right' | 'around';
      regenerateIfActive();
    });
  });

  // Frame parameter sliders
  $('frameWidth').addEventListener('input', (e) => {
    $('frameWidthValue').textContent = (e.target as HTMLInputElement).value;
    regenerateIfActive();
  });
  $('frameCornerRadius').addEventListener('input', (e) => {
    $('frameCornerRadiusValue').textContent = (e.target as HTMLInputElement).value;
    regenerateIfActive();
  });
  $('framePadding').addEventListener('input', (e) => {
    $('framePaddingValue').textContent = (e.target as HTMLInputElement).value;
    regenerateIfActive();
  });
  $('frameTextSize').addEventListener('input', (e) => {
    $('frameTextSizeValue').textContent = (e.target as HTMLInputElement).value;
    regenerateIfActive();
  });
  $('frameTextOffset').addEventListener('input', (e) => {
    $('frameTextOffsetValue').textContent = (e.target as HTMLInputElement).value;
    regenerateIfActive();
  });
  $('frameOpacity').addEventListener('input', (e) => {
    $('frameOpacityValue').textContent = (e.target as HTMLInputElement).value;
    regenerateIfActive();
  });
  $('frameTextBold').addEventListener('change', () => regenerateIfActive());
  $('frameTextItalic').addEventListener('change', () => regenerateIfActive());
  $('frameTextShadow').addEventListener('change', () => regenerateIfActive());

  // Frame line style buttons
  document.querySelectorAll('.frame-style-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const btn = target.closest('.frame-style-btn') as HTMLElement;
      if (!btn) return;
      document.querySelectorAll('.frame-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFrameLineStyle = (btn.dataset.style || 'solid') as 'solid' | 'dashed' | 'dotted';
      regenerateIfActive();
    });
  });
}

// =============================================
// Shape Buttons
// =============================================
function regenerateIfActive(): void {
  if ($('qrcode').querySelector('svg') || $('qrcode').querySelector('canvas')) {
    generateQR();
  }
}

function initShapeButtons(): void {
  // Dot style buttons
  document.querySelectorAll('.dot-style-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const btn = target.closest('.dot-style-btn') as HTMLElement;
      if (!btn) return;
      document.querySelectorAll('.dot-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDotStyle = (btn.dataset.dot || 'square') as DotStyle;
      regenerateIfActive();
    });
  });

  // Eye style buttons
  document.querySelectorAll('.eye-style-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const btn = target.closest('.eye-style-btn') as HTMLElement;
      if (!btn) return;
      document.querySelectorAll('.eye-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEyeStyle = (btn.dataset.eye || 'square') as EyeStyle;
      regenerateIfActive();
    });
  });
}

// =============================================
// Live Preview
// =============================================
function initLivePreview(): void {
  const contentField = $('qrContent');
  if (contentField) {
    contentField.addEventListener('input', updateLivePreview);
  }
}

let livePreviewTimer: number | null = null;
function updateLivePreview(): void {
  if (livePreviewTimer) clearTimeout(livePreviewTimer);
  livePreviewTimer = window.setTimeout(() => {
    const contentField = $('qrContent') as HTMLTextAreaElement | HTMLInputElement;
    if (!contentField) return;
    const content = contentField.value.trim();
    if (!content) { $('livePreview').classList.remove('visible'); return; }

    $('livePreview').classList.add('visible');
    const previewContainer = $('livePreview');
    const size = 150;

    createStyledQR({
      text: content,
      size,
      colorDark: ($('qrColorDark') as HTMLInputElement).value,
      colorLight: ($('qrColorLight') as HTMLInputElement).value,
      dotStyle: currentDotStyle,
      eyeStyle: currentEyeStyle,
      gradientEnabled: ($('gradientEnable') as HTMLInputElement).checked,
      gradientColor: ($('gradientColor') as HTMLInputElement).value,
      gradientType: 'linear',
      logoEnabled: false,
      logoImage: null,
    }, previewContainer);
  }, 300);
}

// =============================================
// Generate QR Code
// =============================================
function initGenerate(): void {
  $('qrForm').addEventListener('submit', (e) => {
    e.preventDefault();
    generateQR();
  });
}

// =============================================
// INPUT VALIDATION
// =============================================
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validatePhone(phone: string): boolean {
  const re = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  return re.test(phone);
}

function showValidationError(message: string): void {
  alert(message);
}

// =============================================
// GENERATE QR CODE
// =============================================
function generateQR(): void {
  const content = generateQRContent(currentType, (id) => {
    const el = $(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    return el ? el.value.trim() : '';
  });

  console.log('Generated content:', content);

  if (!content || content.trim().length === 0) {
    showValidationError('Bitte füllen Sie alle Pflichtfelder aus!');
    return;
  }

  // Validate content based on type
  if (currentType === 'email') {
    const emailField = $('emailAddress') as HTMLInputElement;
    if (emailField && emailField.value && !validateEmail(emailField.value)) {
      showValidationError('Bitte geben Sie eine gültige E-Mail-Adresse ein!');
      return;
    }
  } else if (currentType === 'phone') {
    const phoneField = $('qrContent') as HTMLInputElement;
    if (phoneField && phoneField.value && !validatePhone(phoneField.value)) {
      showValidationError('Bitte geben Sie eine gültige Telefonnummer ein!');
      return;
    }
  } else if (currentType === 'url') {
    const urlField = $('qrContent') as HTMLInputElement;
    if (urlField && urlField.value && !validateUrl(urlField.value)) {
      showValidationError('Bitte geben Sie eine gültige URL ein (z.B. https://beispiel.de)!');
      return;
    }
  } else if (currentType === 'sms') {
    const smsField = $('smsNumber') as HTMLInputElement;
    if (smsField && smsField.value && !validatePhone(smsField.value)) {
      showValidationError('Bitte geben Sie eine gültige Telefonnummer für SMS ein!');
      return;
    }
  } else if (currentType === 'whatsapp') {
    const waField = $('whatsappPhone') as HTMLInputElement;
    if (waField && waField.value && !validatePhone(waField.value)) {
      showValidationError('Bitte geben Sie eine gültige Telefonnummer für WhatsApp ein!');
      return;
    }
  }

  const size = parseInt(($('qrSize') as HTMLInputElement).value);
  const colorDark = ($('qrColorDark') as HTMLInputElement).value;
  const colorLight = ($('qrColorLight') as HTMLInputElement).value;
  const gradientEnabled = ($('gradientEnable') as HTMLInputElement).checked;
  const gradientColor = ($('gradientColor') as HTMLInputElement).value;
  const gradientType = ($('gradientDirection') as HTMLInputElement).value === 'vertical' ? 'linear' : 'linear';
  const logoEnabled = logoImage !== null;

  $('qrcode').innerHTML = '';
  $('qrPlaceholder').style.display = 'none';

  // Use qr-code-styling for styled QR
  try {
    createStyledQR({
      text: content,
      size,
      colorDark,
      colorLight,
      dotStyle: currentDotStyle,
      eyeStyle: currentEyeStyle,
      gradientEnabled,
      gradientColor,
      gradientType: gradientEnabled ? 'linear' : 'linear',
      logoEnabled,
      logoImage: logoEnabled ? logoImage!.src : null,
    }, $('qrcode'));
  } catch (e: any) {
    console.error('QR generation error:', e);
    showValidationError('QR-Code konnte nicht erstellt werden: ' + e.message);
  }

  // Apply border
  applyBorder();

  updateLabels();
  updateEmbedCode();
  $('downloadBtn').style.display = 'inline-block';
  $('exportBtns').style.display = 'flex';

}

function applyBorder(): void {
  const enabled = ($('borderEnable') as HTMLInputElement).checked;
  if (!enabled) {
    const qo = $('qrcode-outer');
    const qe = $('qrcode');
    qo.style.background = '';
    qo.style.padding = '';
    qo.style.borderRadius = '';
    qo.style.border = '';
    qo.style.position = '';
    qe.style.background = '';
    qe.style.padding = '';
    qe.style.borderRadius = '';
    const existingText = qo.querySelector('.frame-text-overlay');
    if (existingText) existingText.remove();
    return;
  }

  const frameColor = ($('borderColor') as HTMLInputElement).value;
  const frameBg = ($('frameBgColor') as HTMLInputElement).value;
  const frameTextColor = ($('frameTextColor') as HTMLInputElement).value;
  const frameText = ($('frameText') as HTMLInputElement).value;
  const frameWidth = parseInt(($('frameWidth') as HTMLInputElement).value) || 4;
  const frameCornerRadius = parseInt(($('frameCornerRadius') as HTMLInputElement).value) || 0;
  const framePadding = parseInt(($('framePadding') as HTMLInputElement).value) || 20;
  const frameTextSize = parseInt(($('frameTextSize') as HTMLInputElement).value) || 14;
  const frameTextOffset = parseInt(($('frameTextOffset') as HTMLInputElement).value) || 5;
  const frameOpacity = parseInt(($('frameOpacity') as HTMLInputElement).value) / 100 || 1;
  const frameTextBold = ($('frameTextBold') as HTMLInputElement).checked;
  const frameTextItalic = ($('frameTextItalic') as HTMLInputElement).checked;
  const frameTextShadow = ($('frameTextShadow') as HTMLInputElement).checked;

  const qo = $('qrcode-outer');
  const qe = $('qrcode');

  // Apply frame styling
  const borderStyle = currentFrameLineStyle === 'dashed' ? 'dashed' : currentFrameLineStyle === 'dotted' ? 'dotted' : 'solid';
  qo.style.background = frameBg;
  qo.style.opacity = String(frameOpacity);
  qo.style.padding = framePadding + 'px';
  qo.style.borderRadius = frameCornerRadius + 'px';
  qo.style.border = frameWidth + 'px ' + borderStyle + ' ' + frameColor;
  qo.style.display = 'inline-block';
  qo.style.position = 'relative';
  qe.style.background = 'white';
  qe.style.padding = '0';
  qe.style.borderRadius = '0';

  // Remove existing text overlay
  const existingText = qo.querySelector('.frame-text-overlay');
  if (existingText) existingText.remove();

  // Add frame text if present
  if (frameText) {
    const textDiv = document.createElement('div');
    textDiv.className = 'frame-text-overlay';

    const fontStyle = (frameTextBold ? 'font-weight:bold;' : '') + (frameTextItalic ? 'font-style:italic;' : '');
    const textShadow = frameTextShadow ? 'text-shadow: 0 0 3px ' + frameBg + ', 0 0 6px ' + frameBg + ';' : '';

    if (currentFramePos === 'around') {
      const fullText = currentFrameSymbol ? frameText.split('').join(currentFrameSymbol) + currentFrameSymbol : frameText;
      const repeatText = (fullText + '   ').repeat(4);
      textDiv.innerHTML = '<svg width="100%" height="100%" style="position:absolute;top:0;left:0;pointer-events:none;"><defs><path id="textCircle" d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"/></defs><text fill="' + frameTextColor + '" font-size="' + frameTextSize + '" font-family="Arial, sans-serif" ' + fontStyle + '><textPath href="#textCircle" startOffset="0%">' + escapeXml(repeatText.substring(0, 60)) + '</textPath></text></svg>';
      textDiv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    } else {
      let cssText = 'position:absolute;font-size:' + frameTextSize + 'px;color:' + frameTextColor + ';background:' + frameColor + ';padding:4px 12px;border-radius:6px;white-space:nowrap;z-index:10;' + fontStyle + textShadow;

      if (currentFramePos === 'top') {
        cssText += 'top:-' + (frameTextOffset + frameTextSize/2) + 'px;left:50%;transform:translateX(-50%);';
      } else if (currentFramePos === 'bottom') {
        cssText += 'bottom:-' + (frameTextOffset + frameTextSize/2) + 'px;left:50%;transform:translateX(-50%);';
      } else if (currentFramePos === 'left') {
        cssText += 'left:-' + (frameTextOffset + frameTextSize + 10) + 'px;top:50%;transform:translateY(-50%) rotate(-90deg);';
      } else if (currentFramePos === 'right') {
        cssText += 'right:-' + (frameTextOffset + frameTextSize + 10) + 'px;top:50%;transform:translateY(-50%) rotate(90deg);';
      }

      textDiv.textContent = frameText;
      textDiv.style.cssText = cssText;
    }

    qo.appendChild(textDiv);
  }
}

function getDesignConfig() {
  return {
    text: generateQRContent(currentType, (id) => {
      const el = $(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      return el ? el.value : '';
    }),
    size: parseInt(($('qrSize') as HTMLInputElement).value) || 256,
    colorDark: ($('qrColorDark') as HTMLInputElement).value,
    colorLight: ($('qrColorLight') as HTMLInputElement).value,
    dotStyle: currentDotStyle,
    eyeStyle: currentEyeStyle,
    gradientEnabled: ($('gradientEnable') as HTMLInputElement).checked,
    gradientColor: ($('gradientColor') as HTMLInputElement).value,
    gradientType: 'linear' as const,
    logoEnabled: logoImage !== null,
    logoImage: logoImage ? logoImage.src : null,
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function renderFrame(svgContent: string, size: number): string {
  if (!($('borderEnable') as HTMLInputElement).checked) return svgContent;

  const frameText = ($('frameText') as HTMLInputElement).value;
  const frameColor = ($('borderColor') as HTMLInputElement).value;
  const frameBg = ($('frameBgColor') as HTMLInputElement).value;
  const frameTextColor = ($('frameTextColor') as HTMLInputElement).value;
  const symbol = currentFrameSymbol;
  const frameWidth = parseInt(($('frameWidth') as HTMLInputElement).value) || 4;
  const frameCornerRadius = parseInt(($('frameCornerRadius') as HTMLInputElement).value) || 0;
  const framePadding = parseInt(($('framePadding') as HTMLInputElement).value) || 20;
  const frameTextSize = parseInt(($('frameTextSize') as HTMLInputElement).value) || 14;

  const padding = framePadding;
  const frameSize = size + padding * 2;
  const centerX = frameSize / 2;
  const centerY = frameSize / 2;

  let frameSvg = '';

  if (currentFrameShape === 'circle') {
    frameSvg = `<circle cx="${centerX}" cy="${centerY}" r="${size/2 + padding/2}" fill="none" stroke="${frameColor}" stroke-width="${frameWidth}"/>`;
  } else if (currentFrameShape === 'rounded') {
    frameSvg = `<rect x="${padding/2}" y="${padding/2}" width="${size + padding}" height="${size + padding}" rx="${frameCornerRadius}" fill="none" stroke="${frameColor}" stroke-width="${frameWidth}"/>`;
  } else {
    frameSvg = `<rect x="${padding/2}" y="${padding/2}" width="${size + padding}" height="${size + padding}" rx="${frameCornerRadius}" fill="none" stroke="${frameColor}" stroke-width="${frameWidth}"/>`;
  }

  // Add text around the frame
  if (frameText) {
    const fullText = symbol ? frameText.split('').join(symbol) + symbol : frameText;
    const repeatText = (fullText + '   ').repeat(4);

    if (currentFramePos === 'around') {
      frameSvg += `<defs><path id="textCircle" d="M ${centerX},${centerY} m -${size/2 + 5},0 a ${size/2 + 5},${size/2 + 5} 0 1,1 ${(size/2 + 5) * 2},0 a ${size/2 + 5},${size/2 + 5} 0 1,1 -${(size/2 + 5) * 2},0"/></defs>`;
      frameSvg += `<text fill="${frameTextColor}" font-size="${frameTextSize}" font-family="Arial, sans-serif" font-weight="bold"><textPath href="#textCircle" startOffset="0%">${escapeXml(repeatText.substring(0, 60))}</textPath></text>`;
    } else if (currentFramePos === 'top') {
      frameSvg += `<text x="${centerX}" y="${padding/2 - 5}" text-anchor="middle" fill="${frameTextColor}" font-size="${frameTextSize}" font-family="Arial, sans-serif" font-weight="bold">${escapeXml(frameText)}</text>`;
    } else if (currentFramePos === 'bottom') {
      frameSvg += `<text x="${centerX}" y="${size + padding + padding/2 + 15}" text-anchor="middle" fill="${frameTextColor}" font-size="${frameTextSize}" font-family="Arial, sans-serif" font-weight="bold">${escapeXml(frameText)}</text>`;
    } else if (currentFramePos === 'left') {
      frameSvg += `<text x="${padding/2 - 5}" y="${centerY}" text-anchor="middle" fill="${frameTextColor}" font-size="${frameTextSize}" font-family="Arial, sans-serif" font-weight="bold" transform="rotate(-90, ${padding/2 - 5}, ${centerY})">${escapeXml(frameText)}</text>`;
    } else if (currentFramePos === 'right') {
      frameSvg += `<text x="${size + padding + padding/2 + 5}" y="${centerY}" text-anchor="middle" fill="${frameTextColor}" font-size="${frameTextSize}" font-family="Arial, sans-serif" font-weight="bold" transform="rotate(90, ${size + padding + padding/2 + 5}, ${centerY})">${escapeXml(frameText)}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${frameSize}" height="${frameSize}" viewBox="0 0 ${frameSize} ${frameSize}"><rect width="${frameSize}" height="${frameSize}" fill="white"/>${frameSvg}<g transform="translate(${padding}, ${padding})">${svgContent}</g></svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  if (r <= 0) { ctx.beginPath(); ctx.rect(x, y, w, h); ctx.closePath(); return; }
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// =============================================
// Export Functions
// =============================================
function initExport(): void {
  $('downloadBtn').addEventListener('click', exportPNG);
  $('svgDownloadBtn').addEventListener('click', exportSVG);
  $('pdfDownloadBtn').addEventListener('click', exportPDF);
}

async function exportPNG(): Promise<void> {
  try {
  var dataURL = await getStyledQRAsDataURL(getDesignConfig());
  if (!dataURL) return;

  const img = new Image();
  img.onload = () => {
    const lb = getLabelConfig();
    const iw = img.width;
    const ih = img.height;
    const tc = document.createElement('canvas').getContext('2d')!;
    const fw = lb.bold ? 'bold ' : '';
    tc.font = fw + lb.size + 'px Segoe UI, sans-serif';
    const tlh = (lb.topEnabled && lb.topText) ? lb.size + 16 : 0;
    const blh = (lb.bottomEnabled && lb.bottomText) ? lb.size + 16 : 0;
    const totalH = tlh + iw + blh;
    const totalW = Math.max(iw, tc.measureText(lb.topText || '').width + 32, tc.measureText(lb.bottomText || '').width + 32);

    const oc = document.createElement('canvas');
    oc.width = totalW;
    oc.height = totalH;
    const ctx = oc.getContext('2d')!;
    const ox = (totalW - iw) / 2;

    if (lb.topEnabled && lb.topText) {
      ctx.fillStyle = lb.color;
      ctx.font = fw + lb.size + 'px Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lb.topText, totalW / 2, tlh / 2);
    }

    ctx.drawImage(img, ox, tlh, iw, ih);

    if (lb.bottomEnabled && lb.bottomText) {
      ctx.fillStyle = lb.color;
      ctx.font = fw + lb.size + 'px Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lb.bottomText, totalW / 2, tlh + iw + blh / 2);
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = oc.toDataURL('image/png');
    link.click();
  };
  img.src = dataURL;
  } catch (e: any) {
    console.error('PNG export error:', e);
    showValidationError('PNG-Export fehlgeschlagen: ' + e.message);
  }
}

async function exportSVG(): Promise<void> {
  const ic = $('qrcode')?.querySelector('canvas') as HTMLImageElement | HTMLCanvasElement;
  if (!ic) return;

  const lb = getLabelConfig();
  const sz = parseInt(($('qrSize') as HTMLInputElement).value) || 256;

  // Build QR modules SVG
  const designConfig = getDesignConfig();
  const dataURL = await getStyledQRAsDataURL(designConfig);
  if (!dataURL) return;

  // Create QR module rectangles from the data URL
  const img = new Image();
  img.onload = () => {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = img.width;
    tmpCanvas.height = img.height;
    const ctx = tmpCanvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
    const d = imgData.data;

    let ms = 1;
    for (let x = 1; x < tmpCanvas.width; x++) {
      const lum = (d[x * 4] + d[x * 4 + 1] + d[x * 4 + 2]) / 3;
      const pl = (d[(x - 1) * 4] + d[(x - 1) * 4 + 1] + d[(x - 1) * 4 + 2]) / 3;
      if ((lum < 128) !== (pl < 128)) { ms = x; break; }
    }

    const mods = Math.round(tmpCanvas.width / ms);
    const tlh = (lb.topEnabled && lb.topText) ? lb.size + 16 : 0;
    const blh = (lb.bottomEnabled && lb.bottomText) ? lb.size + 16 : 0;
    const totalH = tlh + tmpCanvas.height + blh;
    const totalW = Math.max(tmpCanvas.width, 200);

    let qrSvg = '';
    for (let y = 0; y < mods; y++) {
      for (let x2 = 0; x2 < mods; x2++) {
        const cx = Math.floor((x2 + 0.5) * ms);
        const cy = Math.floor((y + 0.5) * ms);
        const idx = (cy * tmpCanvas.width + cx) * 4;
        if ((d[idx] + d[idx + 1] + d[idx + 2]) / 3 < 128) {
          qrSvg += `<rect x="${x2 * ms}" y="${y * ms}" width="${ms}" height="${ms}" fill="${designConfig.colorDark}"/>`;
        }
      }
    }

    // Wrap with frame
    let svg = renderFrame(qrSvg, tmpCanvas.width);

    // Add labels
    if (lb.topEnabled || lb.bottomEnabled) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgEl = doc.documentElement;
      const frameSize = tmpCanvas.width + 80;

      if (lb.topEnabled && lb.topText) {
        const text = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(frameSize / 2));
        text.setAttribute('y', String(frameSize + 20));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', lb.color);
        text.setAttribute('font-size', String(lb.size));
        text.setAttribute('font-family', 'Arial, sans-serif');
        if (lb.bold) text.setAttribute('font-weight', 'bold');
        text.textContent = lb.topText;
        svgEl.appendChild(text);
      }

      if (lb.bottomEnabled && lb.bottomText) {
        const text = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(frameSize / 2));
        text.setAttribute('y', String(frameSize + 40 + lb.size));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', lb.color);
        text.setAttribute('font-size', String(lb.size));
        text.setAttribute('font-family', 'Arial, sans-serif');
        if (lb.bold) text.setAttribute('font-weight', 'bold');
        text.textContent = lb.bottomText;
        svgEl.appendChild(text);
      }

      svg = new XMLSerializer().serializeToString(svgEl);
    }

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };
  img.src = dataURL;
}

function exportPDF(): void {
  const ic = $('qrcode')?.querySelector('canvas') as HTMLCanvasElement;
  if (!ic) return;

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => {
    const { jsPDF } = (window as any).jspdf;
    const lb = getLabelConfig();
    const imgData = ic.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth();
    let y = 20;

    if (lb.topEnabled && lb.topText) {
      pdf.setFont('helvetica', lb.bold ? 'bold' : 'normal');
      pdf.setFontSize(lb.size * 0.75);
      pdf.text(lb.topText, pw / 2, y, { align: 'center' });
      y += lb.size * 0.75 / 2 + 5;
    }

    const isz = Math.min(pw - 40, 150);
    pdf.addImage(imgData, 'PNG', (pw - isz) / 2, y, isz, isz);
    y += isz + 5;

    if (lb.bottomEnabled && lb.bottomText) {
      pdf.setFont('helvetica', lb.bold ? 'bold' : 'normal');
      pdf.setFontSize(lb.size * 0.75);
      pdf.text(lb.bottomText, pw / 2, y, { align: 'center' });
    }

    pdf.save('qrcode.pdf');
  };
  document.head.appendChild(script);
}

function getLabelConfig() {
  return {
    topEnabled: ($('labelTopEnable') as HTMLInputElement).checked,
    bottomEnabled: ($('labelBottomEnable') as HTMLInputElement).checked,
    topText: ($('labelTopText') as HTMLInputElement).value,
    bottomText: ($('labelBottomText') as HTMLInputElement).value,
    size: parseInt(($('labelSize') as HTMLInputElement).value),
    color: ($('labelColor') as HTMLInputElement).value,
    bold: ($('labelBold') as HTMLInputElement).checked,
  };
}



// =============================================
// STL Export (placeholder - will be full module later)
// =============================================
import { sampleQRMatrix, generateSTL, generate3MF, generateOBJ, downloadBlob, mergeRectangles, optimizeRectangles } from './modules/qr-stl';

function initSTLExport(): void {
  // Magnet type change handler
  $('magnetType').addEventListener('change', (e) => {
    const type = (e.target as HTMLSelectElement).value;
    document.querySelectorAll('.magnet-options').forEach(el => {
      (el as HTMLElement).style.display = type === 'none' ? 'none' : 'block';
    });
    regenerateIfActive();
  });

  $('stlExportBtn').addEventListener('click', () => {
    const sample = sampleQRMatrix();
    if (!sample) { alert('Kein QR-Code erkannt!'); return; }
    const magnetConfig = {
      type: ($('magnetType') as HTMLSelectElement).value as 'none' | 'round' | 'square',
      count: parseInt(($('magnetCount') as HTMLSelectElement).value) || 4,
      diameter: parseFloat(($('magnetDiameter') as HTMLInputElement).value) || 6.0,
      depth: parseFloat(($('magnetDepth') as HTMLInputElement).value) || 2.0
    };
    const frameConfig = {
      enabled: ($('stlFrame3D') as HTMLInputElement).checked,
      width: parseFloat(($('stlFrameWidth') as HTMLInputElement).value) || 3.0,
      height: parseFloat(($('stlFrameHeight') as HTMLInputElement).value) || 2.0,
      padding: parseFloat(($('stlFramePadding') as HTMLInputElement).value) || 2.0,
      cornerRadius: 0
    };
    const blob = generateSTL(
      sample,
      parseFloat(($('stlModuleSize') as HTMLInputElement).value) || 2.0,
      parseFloat(($('stlQrHeight') as HTMLInputElement).value) || 0.5,
      parseFloat(($('stlBaseThickness') as HTMLInputElement).value) || 2.0,
      ($('stlWithBase') as HTMLInputElement).checked,
      magnetConfig,
      frameConfig
    );
    downloadBlob(blob, (($('stlFilename') as HTMLInputElement).value || 'qrcode') + '.stl');
  });
  $('threeMFExportBtn')?.addEventListener('click', () => {
    const sample = sampleQRMatrix();
    if (!sample) { alert('Kein QR-Code erkannt!'); return; }
    const blob = generate3MF(
      sample,
      parseFloat(($('stlModuleSize') as HTMLInputElement).value) || 2.0,
      parseFloat(($('stlQrHeight') as HTMLInputElement).value) || 0.5,
      parseFloat(($('stlBaseThickness') as HTMLInputElement).value) || 2.0,
      ($('stlWithBase') as HTMLInputElement).checked,
      ($('qrColorDark') as HTMLInputElement).value,
      ($('qrColorLight') as HTMLInputElement).value
    );
    downloadBlob(blob, (($('stlFilename') as HTMLInputElement).value || 'qrcode') + '.3mf');
  });
  $('objExportBtn')?.addEventListener('click', () => {
    const sample = sampleQRMatrix();
    if (!sample) { alert('Kein QR-Code erkannt!'); return; }
    const blob = generateOBJ(
      sample,
      parseFloat(($('stlModuleSize') as HTMLInputElement).value) || 2.0,
      parseFloat(($('stlQrHeight') as HTMLInputElement).value) || 0.5,
      parseFloat(($('stlBaseThickness') as HTMLInputElement).value) || 2.0,
      ($('stlWithBase') as HTMLInputElement).checked
    );
    downloadBlob(blob, (($('stlFilename') as HTMLInputElement).value || 'qrcode') + '.obj');
  });
}

// =============================================
// 3D Preview (placeholder)
// =============================================
// =============================================
// THREE.JS 3D PREVIEW
// =============================================
var threeScene: any = null;

function disposeThreeScene(): void {
  if (threeScene) {
    if (threeScene.animId) cancelAnimationFrame(threeScene.animId);
    if (threeScene.renderer) threeScene.renderer.dispose();
    if (threeScene.controls) threeScene.controls.dispose();
    if (threeScene.resizeH) window.removeEventListener('resize', threeScene.resizeH);
    threeScene = null;
  }
}

function renderSTLPreview3D(): void {
  if (typeof THREE === 'undefined') { alert('Three.js wird noch geladen.'); return; }
  if (typeof THREE.OrbitControls === 'undefined') { alert('OrbitControls wird noch geladen.'); return; }

  var sample = sampleQRMatrix();
  if (!sample) { alert('Kein QR-Code erkannt. Bitte zuerst QR-Code generieren.'); return; }

  disposeThreeScene();

  var container = document.getElementById('stlPreviewContainer') as HTMLElement;
  container.classList.add('visible');

  var width = container.clientWidth || 400;
  var height = container.clientHeight || 320;

  // Scene
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // Camera
  var camera = new THREE.PerspectiveCamera(40, width/height, 0.1, 1000);

  // Renderer
  var renderer: any;
  try {
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  } catch(e) {
    alert('WebGL nicht unterstützt.');
    container.classList.remove('visible');
    return;
  }
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0xf0f0f0, 1);
  var oldC = container.querySelector('canvas');
  if (oldC) oldC.remove();
  container.insertBefore(renderer.domElement, container.firstChild);

  // Controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));
  var dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(100, 200, 150); scene.add(dl);
  var dl2 = new THREE.DirectionalLight(0xffffff, 0.3);
  dl2.position.set(-100, 50, -100); scene.add(dl2);

  // Parameters
  var smm = parseFloat(($('stlModuleSize') as HTMLInputElement).value) || 2.0;
  var mh = parseFloat(($('stlModuleHeight') as HTMLInputElement).value) || 2.0;
  var bt = parseFloat(($('stlBaseThickness') as HTMLInputElement).value) || 2.0;
  var inv = ($('stlInvert') as HTMLInputElement).checked;
  var fe = ($('stlFrame3D') as HTMLInputElement).checked;
  var fh = parseFloat(($('stlFrameHeight') as HTMLInputElement).value) || 2.0;
  var grid = sample.grid;
  var mods = sample.modules;
  var ts = mods * smm;
  var ht = ts / 2;

  // Materials
  var baseMat = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 20});
  var modMat = new THREE.MeshPhongMaterial({color: 0x1a1a1a, shininess: 40});
  var frameMat = new THREE.MeshPhongMaterial({color: 0x999999, shininess: 30});

  // Base plate
  var baseGeo = new THREE.BoxGeometry(ts, ts, bt);
  var baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.set(0, 0, bt/2);
  scene.add(baseMesh);

  // Modules (merged rectangles)
  var rects = mergeRectangles(grid, inv);
  rects = optimizeRectangles(rects);
  rects.forEach(function(r) {
    var w = r.w * smm, h = r.h * smm;
    var geo = new THREE.BoxGeometry(w, h, mh);
    var mesh = new THREE.Mesh(geo, modMat);
    mesh.position.set(r.x*smm + w/2 - ht, r.y*smm + h/2 - ht, bt + mh/2);
    scene.add(mesh);
  });

  // 3D Frame
  if (fe) {
    var bw = Math.max(smm * 2, 2);
    var zc = (bt + fh) / 2;
    var tg = new THREE.BoxGeometry(ts+bw*2, bw, fh);
    scene.add(Object.assign(new THREE.Mesh(tg, frameMat), {position: new THREE.Vector3(0, -ht-bw/2, zc)}));
    scene.add(Object.assign(new THREE.Mesh(tg.clone(), frameMat), {position: new THREE.Vector3(0, ht+bw/2, zc)}));
    var sg = new THREE.BoxGeometry(bw, ts, fh);
    scene.add(Object.assign(new THREE.Mesh(sg, frameMat), {position: new THREE.Vector3(-ht-bw/2, 0, zc)}));
    scene.add(Object.assign(new THREE.Mesh(sg.clone(), frameMat), {position: new THREE.Vector3(ht+bw/2, 0, zc)}));
  }

  // Camera
  var maxDim = Math.max(ts, fh) * 1.4;
  camera.position.set(maxDim, maxDim * 0.8, maxDim * 0.9);
  camera.lookAt(0, 0, bt/2);
  controls.target.set(0, 0, bt/2);
  controls.update();

  // Animation loop
  var animFrameId: number | null = null;
  function animate() {
    animFrameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    var w2 = container.clientWidth, h2 = container.clientHeight;
    if (w2 > 0 && h2 > 0) {
      camera.aspect = w2/h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    }
  }
  window.addEventListener('resize', onResize);

  threeScene = {scene: scene, camera: camera, renderer: renderer, controls: controls, animId: animFrameId, resizeH: onResize};
}

function init3DPreview(): void {
  $('stlPreviewBtn').addEventListener('click', function() { renderSTLPreview3D(); });
  $('stlResetCamera').addEventListener('click', function() {
    if (!threeScene || !threeScene.camera) return;
    var s = sampleQRMatrix(); if (!s) return;
    var smm = parseFloat(($('stlModuleSize') as HTMLInputElement).value) || 2.0;
    var bt = parseFloat(($('stlBaseThickness') as HTMLInputElement).value) || 2.0;
    var ts = s.modules * smm;
    var maxDim = Math.max(ts, parseFloat(($('stlFrameHeight') as HTMLInputElement).value) || 2.0) * 1.4;
    threeScene.camera.position.set(maxDim, maxDim * 0.8, maxDim * 0.9);
    threeScene.controls.target.set(0, 0, bt/2);
    threeScene.controls.update();
  });
  $('stlClosePreview').addEventListener('click', function() {
    disposeThreeScene();
    $('stlPreviewContainer').classList.remove('visible');
  });
}

// =============================================
// EMBED CODE
// =============================================
function updateEmbedCode(): void {
  var embedSection = document.getElementById('embedSection');
  if (!embedSection) return;

  var content = generateQRContent(currentType, function(id) {
    var el = document.getElementById(id);
    return el ? (el as HTMLInputElement).value.trim() : '';
  });

  if (!content) {
    embedSection.style.display = 'none';
    return;
  }

  embedSection.style.display = 'block';
  (document.getElementById('embedHtml') as HTMLInputElement).value = '<img src="qrcode.svg" alt="QR-Code" width="200" height="200">';
  (document.getElementById('embedMarkdown') as HTMLInputElement).value = '![QR-Code](qrcode.svg)';
  (document.getElementById('embedIframe') as HTMLInputElement).value = '<iframe src="qrcode.svg" width="200" height="200" frameborder="0"></iframe>';
}

function copyToClipboard(inputId: string, feedbackId: string): void {
  var input = document.getElementById(inputId) as HTMLInputElement;
  var feedback = document.getElementById(feedbackId) as HTMLElement;
  navigator.clipboard.writeText(input.value).then(function() {
    feedback.style.display = 'block';
    setTimeout(function() { feedback.style.display = 'none'; }, 2000);
  }).catch(function() {
    input.select();
    document.execCommand('copy');
    feedback.style.display = 'block';
    setTimeout(function() { feedback.style.display = 'none'; }, 2000);
  });
}

var copyHtmlBtn = document.getElementById('copyHtmlBtn');
if (copyHtmlBtn) copyHtmlBtn.addEventListener('click', function() { copyToClipboard('embedHtml', 'copyFeedback'); });
var copyMdBtn = document.getElementById('copyMarkdownBtn');
if (copyMdBtn) copyMdBtn.addEventListener('click', function() { copyToClipboard('embedMarkdown', 'copyFeedback'); });
var copyIframeBtn = document.getElementById('copyIframeBtn');
if (copyIframeBtn) copyIframeBtn.addEventListener('click', function() { copyToClipboard('embedIframe', 'copyFeedback'); });
