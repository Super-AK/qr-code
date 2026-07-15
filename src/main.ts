import { QR_TYPES, generateQRContent } from './modules/qr-types';
import type { QRConfig, QRType, QRShape, HistoryItem } from './types';

// =============================================
// App State
// =============================================
let currentType: QRType = 'text';
let currentShape: QRShape = 'square';
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
  initHistory();
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
    html = `
      <label for="qrContent" class="form-label">
        <i class="${config.icon}"></i> ${f.label}
      </label>
      <${f.type === 'textarea' ? 'textarea class="form-control" id="qrContent" rows="3"' : `input type="${f.type}" class="form-control" id="qrContent"`} 
        placeholder="${f.placeholder || ''}"${f.required ? ' required' : ''}>
      ${f.type === 'textarea' ? '</textarea>' : ''}
    `;
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
  updateLivePreview();
}

// =============================================
// Sliders
// =============================================
function initSliders(): void {
  $('qrSize').addEventListener('input', (e) => {
    $('sizeValue').textContent = (e.target as HTMLInputElement).value;
  });
  $('labelSize').addEventListener('input', (e) => {
    $('labelSizeValue').textContent = (e.target as HTMLInputElement).value;
  });
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
function initLogo(): void {
  const area = $('logoUploadArea');
  const input = $('logoInput');
  const preview = $('logoPreview') as HTMLImageElement;
  const remove = $('logoRemove');

  area.addEventListener('click', () => input.click());

  input.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        logoImage = img;
        preview.src = (ev.target as FileReader).result as string;
        preview.style.display = 'block';
        remove.style.display = 'inline-block';
        area.classList.add('has-logo');
      };
      img.src = (ev.target as FileReader).result as string;
    };
    reader.readAsDataURL(file);
  });

  remove.addEventListener('click', (e) => {
    e.stopPropagation();
    logoImage = null;
    preview.style.display = 'none';
    remove.style.display = 'none';
    area.classList.remove('has-logo');
    (input as HTMLInputElement).value = '';
  });
}

// =============================================
// Gradient
// =============================================
function initGradient(): void {
  $('gradientEnable').addEventListener('change', (e) => {
    $('gradientOptions').classList.toggle('visible', (e.target as HTMLInputElement).checked);
  });
}

// =============================================
// Border
// =============================================
function initBorder(): void {
  $('borderEnable').addEventListener('change', (e) => {
    $('borderOptions').style.display = (e.target as HTMLInputElement).checked ? 'block' : 'none';
  });
}

// =============================================
// Shape Buttons
// =============================================
function initShapeButtons(): void {
  document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
      (e.target as HTMLElement).classList.add('active');
      currentShape = (e.target as HTMLElement).dataset.shape as QRShape;
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
    const content = contentField.value;
    if (!content) { $('livePreview').classList.remove('visible'); return; }

    $('livePreview').classList.add('visible');
    const canvas = $('livePreviewCanvas') as HTMLCanvasElement;
    const size = 150;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const tmpDiv = document.createElement('div');
      new (window as any).QRCode(tmpDiv, {
        text: content,
        width: size,
        height: size,
        colorDark: ($('qrColorDark') as HTMLInputElement).value,
        colorLight: ($('qrColorLight') as HTMLInputElement).value,
        correctLevel: (window as any).QRCode.CorrectLevel[($('qrErrorLevel') as HTMLInputElement).value],
      });
      setTimeout(() => {
        const srcCanvas = tmpDiv.querySelector('canvas');
        if (srcCanvas) ctx.drawImage(srcCanvas, 0, 0);
      }, 100);
    } catch (e) { /* ignore */ }
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

function generateQR(): void {
  const content = generateQRContent(currentType, (id) => {
    const el = $(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    return el ? el.value : '';
  });

  if (!content) {
    alert('Bitte füllen Sie alle Pflichtfelder aus!');
    return;
  }

  const size = parseInt(($('qrSize') as HTMLInputElement).value);
  const colorDark = ($('qrColorDark') as HTMLInputElement).value;
  const colorLight = ($('qrColorLight') as HTMLInputElement).value;
  const errorLevel = ($('qrErrorLevel') as HTMLInputElement).value;

  $('qrcode').innerHTML = '';
  $('qrPlaceholder').style.display = 'none';

  try {
    qrcode = new (window as any).QRCode($('qrcode'), {
      text: content,
      width: size,
      height: size,
      colorDark,
      colorLight,
      correctLevel: (window as any).QRCode.CorrectLevel[errorLevel],
    });
  } catch (ex: any) {
    alert('QR-Code Fehler: ' + ex.message);
    return;
  }

  // Apply gradient
  if (($('gradientEnable') as HTMLInputElement).checked && !logoImage) {
    setTimeout(() => {
      const canvas = $('qrcode')?.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return;
      applyGradient(canvas);
    }, 200);
  }

  // Apply logo
  if (logoImage) {
    setTimeout(() => {
      const canvas = $('qrcode')?.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const logoSize = canvas.width * 0.2;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;
      ctx.fillStyle = 'white';
      ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
      ctx.drawImage(logoImage!, x, y, logoSize, logoSize);
    }, 250);
  }

  // Apply border
  applyBorder();

  updateLabels();
  $('downloadBtn').style.display = 'inline-block';
  $('exportBtns').style.display = 'flex';
  saveToHistory(content, currentType);
}

function applyGradient(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const colorDark = ($('qrColorDark') as HTMLInputElement).value;
  const gradColor = ($('gradientColor') as HTMLInputElement).value;
  const gradDir = ($('gradientDirection') as HTMLInputElement).value;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx + 3] > 0) {
        let t = 0;
        if (gradDir === 'horizontal') t = x / canvas.width;
        else if (gradDir === 'vertical') t = y / canvas.height;
        else t = (x + y) / (canvas.width + canvas.height);

        t = Math.min(1, Math.max(0, t));
        const dc = hexToRgb(colorDark);
        const gc = hexToRgb(gradColor);
        data[idx] = Math.round(dc.r + (gc.r - dc.r) * t);
        data[idx + 1] = Math.round(dc.g + (gc.g - dc.g) * t);
        data[idx + 2] = Math.round(dc.b + (gc.b - dc.b) * t);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function applyBorder(): void {
  const enabled = ($('borderEnable') as HTMLInputElement).checked;
  const size = parseInt(($('borderSize') as HTMLInputElement).value);
  const color = ($('borderColor') as HTMLInputElement).value;
  const qo = $('qrcode-outer');
  const qe = $('qrcode');

  qo.style.background = '';
  qo.style.padding = '';
  qo.style.borderRadius = '';
  qe.style.background = '';
  qe.style.padding = '';
  qe.style.borderRadius = '';

  if (enabled && size > 0) {
    qo.style.background = color;
    qo.style.padding = size + 'px';
    qo.style.borderRadius = '15px';
    qo.style.display = 'inline-block';
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
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

function exportPNG(): void {
  const ic = $('qrcode')?.querySelector('canvas') as HTMLCanvasElement;
  if (!ic) return;

  const lb = getLabelConfig();
  const iw = ic.width;
  const ih = ic.height;
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

  ctx.drawImage(ic, ox, tlh, iw, ih);

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
}

function exportSVG(): void {
  const ic = $('qrcode')?.querySelector('canvas') as HTMLCanvasElement;
  if (!ic) return;

  const lb = getLabelConfig();
  const sz = ic.width;
  const ctx = ic.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, sz, sz);
  const d = imgData.data;
  const colorDark = ($('qrColorDark') as HTMLInputElement).value;
  const colorLight = ($('qrColorLight') as HTMLInputElement).value;

  let ms = 1;
  for (let x = 1; x < sz; x++) {
    const lum = (d[x * 4] + d[x * 4 + 1] + d[x * 4 + 2]) / 3;
    const pl = (d[(x - 1) * 4] + d[(x - 1) * 4 + 1] + d[(x - 1) * 4 + 2]) / 3;
    if ((lum < 128) !== (pl < 128)) { ms = x; break; }
  }

  const mods = Math.round(sz / ms);
  const tlh = (lb.topEnabled && lb.topText) ? lb.size + 16 : 0;
  const blh = (lb.bottomEnabled && lb.bottomText) ? lb.size + 16 : 0;
  const totalH = tlh + sz + blh;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${totalH}" viewBox="0 0 ${sz} ${totalH}">\n<rect width="${sz}" height="${totalH}" fill="${colorLight}"/>\n`;

  if (lb.topEnabled && lb.topText) {
    svg += `<text x="${sz / 2}" y="${tlh / 2}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="${lb.size}" fill="${lb.color}"${lb.bold ? ' font-weight="bold"' : ''}>${escapeXml(lb.topText)}</text>\n`;
  }

  const qrY = tlh;
  for (let y = 0; y < mods; y++) {
    for (let x2 = 0; x2 < mods; x2++) {
      const cx = Math.floor((x2 + 0.5) * ms);
      const cy = Math.floor((y + 0.5) * ms);
      const idx = (cy * sz + cx) * 4;
      if ((d[idx] + d[idx + 1] + d[idx + 2]) / 3 < 128) {
        svg += `<rect x="${x2 * ms}" y="${qrY + y * ms}" width="${ms}" height="${ms}" fill="${colorDark}"/>\n`;
      }
    }
  }

  if (lb.bottomEnabled && lb.bottomText) {
    svg += `<text x="${sz / 2}" y="${qrY + sz + blh / 2}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="${lb.size}" fill="${lb.color}"${lb.bold ? ' font-weight="bold"' : ''}>${escapeXml(lb.bottomText)}</text>\n`;
  }

  svg += '</svg>';

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'qrcode.svg';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
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
// History
// =============================================
function initHistory(): void {
  renderHistory();
}

function getHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem('qr-history') || '[]'); }
  catch { return []; }
}

function saveToHistory(content: string, type: QRType): void {
  const history = getHistory();
  history.unshift({ content, type, timestamp: Date.now() });
  if (history.length > 10) history.length = 10;
  localStorage.setItem('qr-history', JSON.stringify(history));
  renderHistory();
}

function renderHistory(): void {
  const history = getHistory();
  const list = $('historyList');
  if (history.length === 0) {
    list.innerHTML = '<div class="history-item text-muted" style="justify-content:center;">Noch keine QR-Codes</div>';
    return;
  }
  list.innerHTML = '';
  history.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const txt = item.content.substring(0, 40) + (item.content.length > 40 ? '...' : '');
    div.innerHTML = `<span class="text"><i class="fas fa-qrcode me-2"></i>${escapeXml(txt)}</span><span class="delete" data-idx="${idx}"><i class="fas fa-trash"></i></span>`;
    div.querySelector('.text')!.addEventListener('click', () => {
      // Restore from history
      const tabs = $('qrTypeTabs');
      tabs.querySelectorAll('.qr-type-tab').forEach(t => t.classList.remove('active'));
      const targetTab = tabs.querySelector(`[data-type="${item.type}"]`) as HTMLElement;
      if (targetTab) targetTab.classList.add('active');
      currentType = item.type;
      renderContentFields(item.type);
      setTimeout(() => {
        const el = $('qrContent') as HTMLTextAreaElement;
        if (el) { el.value = item.content; updateLivePreview(); }
      }, 50);
    });
    div.querySelector('.delete')!.addEventListener('click', (e) => {
      e.stopPropagation();
      const h = getHistory();
      h.splice(idx, 1);
      localStorage.setItem('qr-history', JSON.stringify(h));
      renderHistory();
    });
    list.appendChild(div);
  });
}

// =============================================
// STL Export (placeholder - will be full module later)
// =============================================
function initSTLExport(): void {
  $('stlExportBtn').addEventListener('click', () => {
    alert('STL-Export wird in Phase 4 implementiert.');
  });
  $('threeMFExportBtn')?.addEventListener('click', () => {
    alert('3MF-Export wird in Phase 4 implementiert.');
  });
  $('objExportBtn')?.addEventListener('click', () => {
    alert('OBJ-Export wird in Phase 4 implementiert.');
  });
}

// =============================================
// 3D Preview (placeholder)
// =============================================
function init3DPreview(): void {
  $('stlPreviewBtn').addEventListener('click', () => {
    alert('3D-Vorschau wird in Phase 4 implementiert.');
  });
}
