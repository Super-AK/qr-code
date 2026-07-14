const fs = require('fs');
const QRCode = require('qrcode-generator');

function generateMatrix(text, typeNumber=4, errorCorrectLevel='M'){
  const qr = QRCode(typeNumber, errorCorrectLevel);
  qr.addData(text);
  qr.make();
  const moduleCount = qr.getModuleCount();
  const grid = [];
  for (let r=0;r<moduleCount;r++){
    const row = [];
    for (let c=0;c<moduleCount;c++){
      row.push(qr.isDark(r,c) ? 1 : 0);
    }
    grid.push(row);
  }
  return {grid, modules: moduleCount};
}

function mergeRectangles(grid, invert=false){
  const n = grid.length;
  const used = Array.from({length:n}, ()=>Array(n).fill(false));
  const rects = [];
  for (let y=0;y<n;y++){
    for (let x=0;x<n;x++){
      if (used[y][x]) continue;
      const cell = grid[y][x];
      const shouldCell = invert ? (cell===0) : (cell===1);
      if (!shouldCell) continue;
      let w=1; while (x+w<n){ const ok = grid[y][x+w]; const shouldOk = invert ? (ok===0):(ok===1); if (!shouldOk || used[y][x+w]) break; w++; }
      let h=1; outer: while (y+h<n){ for (let xi=0; xi<w; xi++){ const ok = grid[y+h][x+xi]; const shouldOk = invert ? (ok===0):(ok===1); if (!shouldOk || used[y+h][x+xi]) break outer; } h++; }
      for (let yy=0; yy<h; yy++) for (let xx=0; xx<w; xx++) used[y+yy][x+xx]=true;
      rects.push({x,y,w,h});
    }
  }
  return rects;
}

// iterative merging: try to merge horizontally and vertically until stable
function optimizeRectangles(rects){
  let changed = true;
  while(changed){
    changed = false;
    // try horizontal merges
    const byRow = {};
    for (const r of rects) {
      const key = r.y + '|' + r.h;
      (byRow[key] = byRow[key]||[]).push(r);
    }
    for (const key in byRow){
      const arr = byRow[key];
      // sort by x
      arr.sort((a,b)=>a.x-b.x);
      for (let i=0;i<arr.length-1;i++){
        const a = arr[i], b = arr[i+1];
        if (a.x + a.w === b.x && a.h===b.h && a.y===b.y){
          // merge
          a.w = a.w + b.w;
          rects.splice(rects.indexOf(b),1);
          changed = true;
        }
      }
    }
    // try vertical merges
    const byCol = {};
    for (const r of rects) {
      const key = r.x + '|' + r.w;
      (byCol[key] = byCol[key]||[]).push(r);
    }
    for (const key in byCol){
      const arr = byCol[key];
      arr.sort((a,b)=>a.y-b.y);
      for (let i=0;i<arr.length-1;i++){
        const a = arr[i], b = arr[i+1];
        if (a.y + a.h === b.y && a.w===b.w && a.x===b.x){
          a.h = a.h + b.h;
          rects.splice(rects.indexOf(b),1);
          changed = true;
        }
      }
    }
  }
  return rects;
}

function addBoxTriangles(triangles, x,y,w,h,z0,z1){
  const v = [ [x,y,z0],[x+w,y,z0],[x+w,y+h,z0],[x,y+h,z0],[x,y,z1],[x+w,y,z1],[x+w,y+h,z1],[x,y+h,z1] ];
  function tri(a,b,c){ triangles.push([a,b,c]); }
  tri(v[0],v[1],v[2]); tri(v[0],v[2],v[3]);
  tri(v[4],v[6],v[5]); tri(v[4],v[7],v[6]);
  tri(v[0],v[4],v[5]); tri(v[0],v[5],v[1]);
  tri(v[1],v[5],v[6]); tri(v[1],v[6],v[2]);
  tri(v[2],v[6],v[7]); tri(v[2],v[7],v[3]);
  tri(v[3],v[7],v[4]); tri(v[3],v[4],v[0]);
}

function buildSTL(gridInfo, opts){
  const grid = gridInfo.grid; const modules = gridInfo.modules;
  const moduleSize = opts.moduleSize || 1.0; const moduleHeight = opts.moduleHeight || 1.5; const baseThickness = opts.baseThickness || 1.0; const invert = !!opts.invert;
  const triangles = [];
  const totalSize = modules * moduleSize;
  const offsetX = - totalSize/2; const offsetY = - totalSize/2;
  // base
  addBoxTriangles(triangles, offsetX, offsetY, totalSize, totalSize, 0, baseThickness);
  const rects = mergeRectangles(grid, invert);
  // optimize rectangles further
  const opt = optimizeRectangles(rects);
  for (const r of opt){ const px = offsetX + r.x*moduleSize; const py = offsetY + r.y*moduleSize; const w = r.w*moduleSize; const h = r.h*moduleSize; addBoxTriangles(triangles, px, py, w, h, baseThickness, baseThickness+moduleHeight); }
  // produce ascii stl
  let stl = 'solid qr\n';
  function normal(a,b,c){ const ux=b[0]-a[0], uy=b[1]-a[1], uz=b[2]-a[2]; const vx=c[0]-a[0], vy=c[1]-a[1], vz=c[2]-a[2]; const nx=uy*vz-uz*vy; const ny=uz*vx-ux*vz; const nz=ux*vy-uy*vx; const nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1; return [nx/nl,ny/nl,nz/nl]; }
  for (const t of triangles){ const n = normal(t[0],t[1],t[2]); stl += `  facet normal ${n[0].toFixed(6)} ${n[1].toFixed(6)} ${n[2].toFixed(6)}\n    outer loop\n`; for (const v of t){ stl += `      vertex ${v[0].toFixed(6)} ${v[1].toFixed(6)} ${v[2].toFixed(6)}\n`; } stl += `    endloop\n  endfacet\n`; }
  stl += 'endsolid qr\n';
  return {stl, trianglesCount: triangles.length};
}

// run test
const data = generateMatrix('https://example.com', 6, 'M');
console.log('modules', data.modules);
const res = buildSTL(data, {moduleSize:1.0, moduleHeight:1.5, baseThickness:1.0, invert:false});
console.log('triangles', res.trianglesCount);
fs.writeFileSync('out_qr.stl', res.stl);
console.log('wrote out_qr.stl');

// also write binary STL
function writeBinarySTL(triangles, filename){
  // 80-byte header
  const header = Buffer.alloc(80, ' ');
  const triCount = triangles.length;
  const buf = Buffer.alloc(84 + triCount * 50);
  header.copy(buf,0,0,80);
  buf.writeUInt32LE(triCount,80);
  let off=84;
  function writeFloat(v){ buf.writeFloatLE(v, off); off+=4; }
  for (const t of triangles){
    // normal
    const a=t[0], b=t[1], c=t[2];
    const ux=b[0]-a[0], uy=b[1]-a[1], uz=b[2]-a[2];
    const vx=c[0]-a[0], vy=c[1]-a[1], vz=c[2]-a[2];
    const nx=uy*vz-uz*vy; const ny=uz*vx-ux*vz; const nz=ux*vy-uy*vx; const nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
    writeFloat(nx/nl); writeFloat(ny/nl); writeFloat(nz/nl);
    // vertices
    writeFloat(a[0]); writeFloat(a[1]); writeFloat(a[2]);
    writeFloat(b[0]); writeFloat(b[1]); writeFloat(b[2]);
    writeFloat(c[0]); writeFloat(c[1]); writeFloat(c[2]);
    // attribute byte count
    buf.writeUInt16LE(0, off); off+=2;
  }
  fs.writeFileSync(filename, buf);
}

// rebuild triangles for binary write (triangles were local)
// regenerate triangles quickly
function buildTriangles(gridInfo, opts){
  const grid = gridInfo.grid; const modules = gridInfo.modules;
  const moduleSize = opts.moduleSize || 1.0; const moduleHeight = opts.moduleHeight || 1.5; const baseThickness = opts.baseThickness || 1.0; const invert = !!opts.invert;
  const triangles = [];
  const totalSize = modules * moduleSize;
  const offsetX = - totalSize/2; const offsetY = - totalSize/2;
  addBoxTriangles(triangles, offsetX, offsetY, totalSize, totalSize, 0, baseThickness);
  const rects = mergeRectangles(grid, invert);
  const opt = optimizeRectangles(rects);
  for (const r of opt){ const px = offsetX + r.x*moduleSize; const py = offsetY + r.y*moduleSize; const w = r.w*moduleSize; const h = r.h*moduleSize; addBoxTriangles(triangles, px, py, w, h, baseThickness, baseThickness+moduleHeight); }
  return triangles;
}

const triangles = buildTriangles(data, {moduleSize:1.0, moduleHeight:1.5, baseThickness:1.0, invert:false});
writeBinarySTL(triangles, 'out_qr_binary.stl');
console.log('wrote out_qr_binary.stl');
