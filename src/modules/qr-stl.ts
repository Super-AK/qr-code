import type { QRMatrix } from '../types';

// =============================================
// QR Matrix Sampling (from canvas)
// =============================================
export function sampleQRMatrix(): QRMatrix | null {
  const ic = document.querySelector('#qrcode canvas') as HTMLCanvasElement;
  if (!ic) {
    const img = document.querySelector('#qrcode img') as HTMLImageElement;
    if (!img || !img.src) return null;
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return sampleFromCanvas(c);
  }
  const wasHidden = ic.style.display === 'none';
  if (wasHidden) ic.style.display = 'block';
  const result = sampleFromCanvas(ic);
  if (wasHidden) ic.style.display = 'none';
  return result;
}

function sampleFromCanvas(canvas: HTMLCanvasElement): QRMatrix | null {
  const tmp = document.createElement('canvas');
  tmp.width = canvas.width;
  tmp.height = canvas.height;
  const tc = tmp.getContext('2d')!;
  tc.drawImage(canvas, 0, 0);
  const img = tc.getImageData(0, 0, tmp.width, tmp.height);
  const d = img.data;
  const threshold = 128;

  // Find 3 finder patterns
  const patterns: { x: number; y: number; size: number }[] = [];
  const minPatternSize = Math.min(tmp.width, tmp.height) / 8;

  for (let y = 0; y < tmp.height; y += 4) {
    for (let x = 0; x < tmp.width; x += 4) {
      const li = (y * tmp.width + x) * 4;
      const lum = (d[li] + d[li + 1] + d[li + 2]) / 3;
      if (lum < threshold) {
        let rx = x, by = y;
        while (rx < tmp.width) {
          const ri = (y * tmp.width + rx) * 4;
          if ((d[ri] + d[ri + 1] + d[ri + 2]) / 3 >= threshold) break;
          rx++;
        }
        while (by < tmp.height) {
          const bi = (by * tmp.width + x) * 4;
          if ((d[bi] + d[bi + 1] + d[bi + 2]) / 3 >= threshold) break;
          by++;
        }
        const sz = Math.min(rx - x, by - y);
        if (sz >= minPatternSize) {
          patterns.push({ x, y, size: sz });
          y += sz;
          break;
        }
      }
    }
  }

  patterns.sort((a, b) => b.size - a.size);
  const top3 = patterns.slice(0, 3);
  if (top3.length !== 3) return null;

  const avgSize = (top3[0].size + top3[1].size + top3[2].size) / 3;
  const moduleSize = Math.round(avgSize / 7);

  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  top3.forEach(p => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x + p.size);
    maxY = Math.max(maxY, p.y + p.size);
  });

  const modules = Math.round(Math.max(maxX - minX, maxY - minY) / moduleSize);
  const grid: number[][] = [];

  for (let gy = 0; gy < modules; gy++) {
    const row: number[] = [];
    for (let gx = 0; gx < modules; gx++) {
      const cx = Math.floor(minX + (gx + 0.5) * moduleSize);
      const cy = Math.floor(minY + (gy + 0.5) * moduleSize);
      let darkCount = 0;
      for (let sy = -1; sy <= 1; sy++) {
        for (let sx = -1; sx <= 1; sx++) {
          const sx2 = cx + sx, sy2 = cy + sy;
          if (sx2 < 0 || sx2 >= tmp.width || sy2 < 0 || sy2 >= tmp.height) continue;
          const di = (sy2 * tmp.width + sx2) * 4;
          if ((d[di] + d[di + 1] + d[di + 2]) / 3 < threshold) darkCount++;
        }
      }
      row.push(darkCount > 4 ? 1 : 0);
    }
    grid.push(row);
  }

  return { grid, moduleSize, modules };
}

// =============================================
// Rectangle Merge & Optimize
// =============================================
export function mergeRectangles(grid: number[][], invert: boolean): { x: number; y: number; w: number; h: number }[] {
  const n = grid.length;
  const used = Array.from({ length: n }, () => Array(n).fill(false));
  const rects: { x: number; y: number; w: number; h: number }[] = [];

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (used[y][x]) continue;
      const should = invert ? (grid[y][x] === 0) : (grid[y][x] === 1);
      if (!should) continue;

      let w = 1;
      while (x + w < n) {
        const ok = grid[y][x + w];
        if (!(invert ? ok === 0 : ok === 1) || used[y][x + w]) break;
        w++;
      }

      let h = 1;
      outer: while (y + h < n) {
        for (let xi = 0; xi < w; xi++) {
          const ok = grid[y + h][x + xi];
          if (!(invert ? ok === 0 : ok === 1) || used[y + h][x + xi]) break outer;
        }
        h++;
      }

      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) used[y + yy][x + xx] = true;
      rects.push({ x, y, w, h });
    }
  }
  return rects;
}

export function optimizeRectangles(rects: { x: number; y: number; w: number; h: number }[]): { x: number; y: number; w: number; h: number }[] {
  let changed = true;
  while (changed) {
    changed = false;
    const byRow: Record<string, { x: number; y: number; w: number; h: number }[]> = {};
    rects.forEach(r => { const k = r.y + '|' + r.h; (byRow[k] = byRow[k] || []).push(r); });
    for (const k in byRow) {
      const arr = byRow[k].sort((a, b) => a.x - b.x);
      for (let i = 0; i < arr.length - 1; i++) {
        const a = arr[i], b = arr[i + 1];
        if (a.x + a.w === b.x && a.h === b.h && a.y === b.y) {
          a.w += b.w;
          rects.splice(rects.indexOf(b), 1);
          changed = true;
        }
      }
    }
    const byCol: Record<string, { x: number; y: number; w: number; h: number }[]> = {};
    rects.forEach(r => { const k = r.x + '|' + r.w; (byCol[k] = byCol[k] || []).push(r); });
    for (const k in byCol) {
      const arr = byCol[k].sort((a, b) => a.y - b.y);
      for (let i = 0; i < arr.length - 1; i++) {
        const a = arr[i], b = arr[i + 1];
        if (a.y + a.h === b.y && a.w === b.w && a.x === b.x) {
          a.h += b.h;
          rects.splice(rects.indexOf(b), 1);
          changed = true;
        }
      }
    }
  }
  return rects;
}

// =============================================
// STL Binary Export
// =============================================
interface STLTriangle { a: number[]; b: number[]; c: number[] }

export function generateSTL(
  matrix: QRMatrix,
  moduleSizeMM: number,
  qrHeight: number,
  baseThickness: number,
  withBase: boolean
): Blob {
  const tris: STLTriangle[] = [];
  const { grid, modules } = matrix;
  const ts = modules * moduleSizeMM;
  const ox = -ts / 2, oy = -ts / 2;

  function tri(a: number[], b: number[], c: number[]) {
    tris.push({ a: [...a], b: [...b], c: [...c] });
  }

  function addBox(x: number, y: number, w: number, h: number, z0: number, z1: number) {
    if (w <= 0 || h <= 0 || z1 <= z0) return;
    const v = [
      [x, y, z0], [x + w, y, z0], [x + w, y + h, z0], [x, y + h, z0],
      [x, y, z1], [x + w, y, z1], [x + w, y + h, z1], [x, y + h, z1],
    ];
    tri(v[0], v[2], v[1]); tri(v[0], v[3], v[2]);
    tri(v[4], v[5], v[6]); tri(v[4], v[6], v[7]);
    tri(v[0], v[1], v[5]); tri(v[0], v[5], v[4]);
    tri(v[1], v[2], v[6]); tri(v[1], v[6], v[5]);
    tri(v[2], v[3], v[7]); tri(v[2], v[7], v[6]);
    tri(v[3], v[0], v[4]); tri(v[3], v[4], v[7]);
  }

  // Base plate
  if (withBase) {
    addBox(ox, oy, ts, ts, 0, baseThickness);
  }

  // Module extrusions
  const rects = optimizeRectangles(mergeRectangles(grid, false));
  rects.forEach(r => {
    const w = r.w * moduleSizeMM, h = r.h * moduleSizeMM;
    addBox(
      r.x * moduleSizeMM + ox,
      r.y * moduleSizeMM + oy,
      w, h,
      withBase ? baseThickness : 0,
      (withBase ? baseThickness : 0) + qrHeight
    );
  });

  // Build binary STL
  function normal(a: number[], b: number[], c: number[]): number[] {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
    return nl === 0 ? [0, 0, 1] : [nx / nl, ny / nl, nz / nl];
  }

  const triCount = tris.length;
  const buffer = new ArrayBuffer(84 + triCount * 50);
  const view = new DataView(buffer);
  view.setUint32(80, triCount, true);
  let off = 84;

  tris.forEach(t => {
    const n = normal(t.a, t.b, t.c);
    view.setFloat32(off, n[0], true); off += 4;
    view.setFloat32(off, n[1], true); off += 4;
    view.setFloat32(off, n[2], true); off += 4;
    view.setFloat32(off, t.a[0], true); off += 4;
    view.setFloat32(off, t.a[1], true); off += 4;
    view.setFloat32(off, t.a[2], true); off += 4;
    view.setFloat32(off, t.b[0], true); off += 4;
    view.setFloat32(off, t.b[1], true); off += 4;
    view.setFloat32(off, t.b[2], true); off += 4;
    view.setFloat32(off, t.c[0], true); off += 4;
    view.setFloat32(off, t.c[1], true); off += 4;
    view.setFloat32(off, t.c[2], true); off += 4;
    view.setUint16(off, 0, true); off += 2;
  });

  return new Blob([buffer], { type: 'application/octet-stream' });
}

// =============================================
// 3MF Export (simplified)
// =============================================
export function generate3MF(
  matrix: QRMatrix,
  moduleSizeMM: number,
  qrHeight: number,
  baseThickness: number,
  withBase: boolean,
  colorDark: string,
  colorLight: string
): Blob {
  // 3MF is XML-based, generate a minimal valid file
  const { grid, modules } = matrix;
  const ts = modules * moduleSizeMM;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<model unit="millimeter" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">\n';
  xml += '  <metadata name="Application">QR-Code Generator v3.0</metadata>\n';
  xml += '  <resources>\n';

  let meshId = 1;

  // Base plate mesh
  if (withBase) {
    xml += buildBoxMesh(meshId++, 0, 0, 0, ts, ts, baseThickness, colorLight);
  }

  // Module meshes
  const rects = optimizeRectangles(mergeRectangles(grid, false));
  rects.forEach(r => {
    const w = r.w * moduleSizeMM, h = r.h * moduleSizeMM;
    const x = r.x * moduleSizeMM;
    const y = r.y * moduleSizeMM;
    const z = withBase ? baseThickness : 0;
    xml += buildBoxMesh(meshId++, x, y, z, w, h, qrHeight, colorDark);
  });

  xml += '  </resources>\n';
  xml += '  <build>\n';
  for (let i = 1; i < meshId; i++) {
    xml += `    <item objectid="${i}"/>\n`;
  }
  xml += '  </build>\n';
  xml += '</model>';

  return new Blob([xml], { type: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml' });
}

function buildBoxMesh(id: number, x: number, y: number, z: number, w: number, h: number, d: number, color: string): string {
  const v = [
    [x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],
    [x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d],
  ];

  let mesh = `    <object id="${id}" type="model">\n`;
  mesh += '      <mesh>\n';
  mesh += '        <vertices>\n';
  v.forEach(p => { mesh += `          <vertex x="${p[0]}" y="${p[1]}" z="${p[2]}"/>\n`; });
  mesh += '        </vertices>\n';
  mesh += '        <triangles>\n';

  const faces = [
    [0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7],
    [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5],
    [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7],
  ];
  faces.forEach((f, i) => {
    mesh += `          <triangle v1="${f[0]}" v2="${f[1]}" v3="${f[2]}"/>\n`;
  });

  mesh += '        </triangles>\n';
  mesh += '      </mesh>\n';
  mesh += `      <metadatums><metadatum name="pid" type="xs:string">1</metadatum><metadatum name="pindex" type="xs:string">0</metadatum></metadatums>\n`;
  mesh += '    </object>\n';
  return mesh;
}

// =============================================
// OBJ Export
// =============================================
export function generateOBJ(
  matrix: QRMatrix,
  moduleSizeMM: number,
  qrHeight: number,
  baseThickness: number,
  withBase: boolean
): Blob {
  const { grid, modules } = matrix;
  const ts = modules * moduleSizeMM;
  let obj = '# QR-Code OBJ Export\n# Generated by QR-Code Generator v3.0\n\n';

  let vertexOffset = 0;

  function addBox(x: number, y: number, z: number, w: number, h: number, d: number) {
    const v = [
      [x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],
      [x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d],
    ];

    v.forEach(p => { obj += `v ${p[0]} ${p[1]} ${p[2]}\n`; });
    obj += '\n';

    const faces = [
      [1, 3, 2], [1, 4, 3], [5, 6, 7], [5, 7, 8],
      [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6],
      [3, 4, 8], [3, 8, 7], [4, 1, 5], [4, 5, 8],
    ];
    faces.forEach(f => {
      obj += `f ${f[0] + vertexOffset} ${f[1] + vertexOffset} ${f[2] + vertexOffset}\n`;
    });
    obj += '\n';

    vertexOffset += 8;
  }

  if (withBase) {
    addBox(0, 0, 0, ts, ts, baseThickness);
  }

  const rects = optimizeRectangles(mergeRectangles(grid, false));
  rects.forEach(r => {
    const w = r.w * moduleSizeMM, h = r.h * moduleSizeMM;
    const x = r.x * moduleSizeMM;
    const y = r.y * moduleSizeMM;
    const z = withBase ? baseThickness : 0;
    addBox(x, y, z, w, h, qrHeight);
  });

  return new Blob([obj], { type: 'text/plain' });
}

// =============================================
// Download Helper
// =============================================
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
