var qrcode = null;
var threeScene = null;

// =============================================
// INIT - Wait for DOM ready
// =============================================
document.addEventListener('DOMContentLoaded', function() {

// Slider live updates
document.getElementById('qrSize').addEventListener('input', function() {
    document.getElementById('sizeValue').textContent = this.value;
});
document.getElementById('borderSize').addEventListener('input', function() {
    document.getElementById('borderSizeValue').textContent = this.value;
});
document.getElementById('borderRadius').addEventListener('input', function() {
    document.getElementById('borderRadiusValue').textContent = this.value;
});
document.getElementById('gapSize').addEventListener('input', function() {
    document.getElementById('gapSizeValue').textContent = this.value;
});
document.getElementById('labelSize').addEventListener('input', function() {
    document.getElementById('labelSizeValue').textContent = this.value;
});


// Real-time label updates
document.getElementById('labelTopEnable').addEventListener('change', function() {
    updateLabels();
});
document.getElementById('labelBottomEnable').addEventListener('change', function() {
    updateLabels();
});
document.getElementById('labelTopText').addEventListener('input', function() {
    updateLabels();
});
document.getElementById('labelBottomText').addEventListener('input', function() {
    updateLabels();
});
document.getElementById('labelSize').addEventListener('input', function() {
    updateLabels();
});
document.getElementById('labelColor').addEventListener('input', function() {
    updateLabels();
});
document.getElementById('labelBold').addEventListener('change', function() {
    updateLabels();
});
// =============================================
// LABEL MANAGEMENT
// =============================================
function updateLabels() {
    var topOn = document.getElementById('labelTopEnable').checked;
    var botOn = document.getElementById('labelBottomEnable').checked;
    var topTxt = document.getElementById('labelTopText').value;
    var botTxt = document.getElementById('labelBottomText').value;
    var sz = document.getElementById('labelSize').value;
    var clr = document.getElementById('labelColor').value;
    var bld = document.getElementById('labelBold').checked;
    var fw = bld ? 'bold ' : '';

    var elTop = document.getElementById('labelTop');
    var elBot = document.getElementById('labelBottom');

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

function getLabelConfig() {
    return {
        topEnabled: document.getElementById('labelTopEnable').checked,
        bottomEnabled: document.getElementById('labelBottomEnable').checked,
        topText: document.getElementById('labelTopText').value,
        bottomText: document.getElementById('labelBottomText').value,
        size: parseInt(document.getElementById('labelSize').value),
        color: document.getElementById('labelColor').value,
        bold: document.getElementById('labelBold').checked
    };
}

// =============================================
// QR TYPE CHANGE
// =============================================
document.getElementById('qrType').addEventListener('change', function() {
    updateContentFields(this.value);
});

function updateContentFields(type) {
    var cf = document.getElementById('contentFields');
    var h = '';
    if (type === 'url') {
        h = '<label for="qrContent" class="form-label"><i class="fas fa-link"></i> URL</label><input type="url" class="form-control" id="qrContent" placeholder="https://beispiel.de">';
    } else if (type === 'email') {
        h = '<label class="form-label"><i class="fas fa-envelope"></i> E-Mail</label><input type="email" class="form-control mb-2" id="emailAddress" placeholder="E-Mail Adresse"><input type="text" class="form-control mb-2" id="emailSubject" placeholder="Betreff"><textarea class="form-control" id="emailBody" rows="2" placeholder="Nachricht"></textarea>';
    } else if (type === 'phone') {
        h = '<label for="qrContent" class="form-label"><i class="fas fa-phone"></i> Telefonnummer</label><input type="tel" class="form-control" id="qrContent" placeholder="+49 123 456789">';
    } else if (type === 'sms') {
        h = '<label class="form-label"><i class="fas fa-sms"></i> SMS</label><input type="tel" class="form-control mb-2" id="smsNumber" placeholder="Nummer"><textarea class="form-control" id="smsMessage" rows="2" placeholder="Nachricht"></textarea>';
    } else if (type === 'vcard') {
        h = '<label class="form-label"><i class="fas fa-address-card"></i> Kontakt</label>' +
            '<div class="row"><div class="col-md-6 mb-2"><input type="text" class="form-control" id="vcardFirstName" placeholder="Vorname*"></div><div class="col-md-6 mb-2"><input type="text" class="form-control" id="vcardLastName" placeholder="Nachname*"></div></div>' +
            '<input type="text" class="form-control mb-2" id="vcardOrg" placeholder="Organisation"><input type="text" class="form-control mb-2" id="vcardTitle" placeholder="Titel">' +
            '<input type="tel" class="form-control mb-2" id="vcardPhone" placeholder="Telefon"><input type="tel" class="form-control mb-2" id="vcardMobile" placeholder="Mobil">' +
            '<input type="email" class="form-control mb-2" id="vcardEmail" placeholder="E-Mail"><input type="url" class="form-control mb-2" id="vcardWebsite" placeholder="Website">' +
            '<input type="text" class="form-control mb-2" id="vcardStreet" placeholder="Straße">' +
            '<div class="row"><div class="col-md-4 mb-2"><input type="text" class="form-control" id="vcardCity" placeholder="Stadt"></div><div class="col-md-4 mb-2"><input type="text" class="form-control" id="vcardZip" placeholder="PLZ"></div><div class="col-md-4 mb-2"><input type="text" class="form-control" id="vcardCountry" placeholder="Land"></div></div>';
    } else if (type === 'wifi') {
        h = '<label class="form-label"><i class="fas fa-wifi"></i> WiFi</label><input type="text" class="form-control mb-2" id="wifiSSID" placeholder="SSID"><input type="password" class="form-control mb-2" id="wifiPassword" placeholder="Passwort"><select class="form-select" id="wifiEncryption"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Kein Passwort</option></select>';
    } else {
        h = '<label for="qrContent" class="form-label"><i class="fas fa-keyboard"></i> Inhalt</label><textarea class="form-control" id="qrContent" rows="3" placeholder="Geben Sie den Inhalt ein..."></textarea>';
    }
    cf.innerHTML = h;
}

function getQRContent(type) {
    if (type === 'email') return 'mailto:' + document.getElementById('emailAddress').value + '?subject=' + encodeURIComponent(document.getElementById('emailSubject').value) + '&body=' + encodeURIComponent(document.getElementById('emailBody').value);
    if (type === 'sms') { var n = document.getElementById('smsNumber').value; var m = document.getElementById('smsMessage').value; return 'sms:' + n + (m ? '?body=' + encodeURIComponent(m) : ''); }
    if (type === 'phone') return 'tel:' + document.getElementById('qrContent').value;
    if (type === 'wifi') return 'WIFI:T:' + document.getElementById('wifiEncryption').value + ';S:' + document.getElementById('wifiSSID').value + ';P:' + document.getElementById('wifiPassword').value + ';;';
    if (type === 'vcard') {
        var fn = document.getElementById('vcardFirstName').value; var ln = document.getElementById('vcardLastName').value;
        if (!fn && !ln) return '';
        var v = 'BEGIN:VCARD\nVERSION:3.0\nN:' + ln + ';' + fn + ';;;\nFN:' + fn + ' ' + ln + '\n';
        var f = [['vcardOrg','ORG'],['vcardTitle','TITLE'],['vcardPhone','TEL;TYPE=WORK'],['vcardMobile','TEL;TYPE=CELL'],['vcardEmail','EMAIL'],['vcardWebsite','URL']];
        f.forEach(function(p) { var val = document.getElementById(p[0]).value; if (val) v += p[1] + ':' + val + '\n'; });
        var st = document.getElementById('vcardStreet').value; var ci = document.getElementById('vcardCity').value; var zi = document.getElementById('vcardZip').value; var co = document.getElementById('vcardCountry').value;
        if (st || ci || zi || co) v += 'ADR;TYPE=WORK:;;' + st + ';' + ci + ';;' + zi + ';' + co + '\n';
        return v + 'END:VCARD';
    }
    return document.getElementById('qrContent').value;
}

// =============================================
// FORM SUBMIT
// =============================================
document.getElementById('qrForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var type = document.getElementById('qrType').value;
    var content = getQRContent(type);
    if (!content) { alert('Bitte füllen Sie alle Felder aus!'); return; }

    var sz = parseInt(document.getElementById('qrSize').value);
    var cd = document.getElementById('qrColorDark').value;
    var cl = document.getElementById('qrColorLight').value;
    var el = document.getElementById('qrErrorLevel').value;

    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('qrPlaceholder').style.display = 'none';

    try {
        qrcode = new QRCode(document.getElementById('qrcode'), { text: content, width: sz, height: sz, colorDark: cd, colorLight: cl, correctLevel: QRCode.CorrectLevel[el] });
    } catch(ex) { alert('QR-Code Fehler: ' + ex.message); return; }

    // Apply border/gap
    var be = document.getElementById('borderEnable').checked;
    var bs = parseInt(document.getElementById('borderSize').value);
    var bc = document.getElementById('borderColor').value;
    var br = parseInt(document.getElementById('borderRadius').value);
    var gs = parseInt(document.getElementById('gapSize').value);
    var gc = document.getElementById('gapColor').value;
    var qo = document.getElementById('qrcode-outer');
    var qe = document.getElementById('qrcode');
    qo.style.background = ''; qo.style.padding = ''; qo.style.borderRadius = '';
    qe.style.background = ''; qe.style.padding = ''; qe.style.borderRadius = '';
    if (be && bs > 0) {
        qo.style.background = bc; qo.style.borderRadius = br + 'px'; qo.style.padding = bs + 'px'; qo.style.display = 'inline-block';
        qe.style.background = gc; qe.style.padding = gs + 'px'; qe.style.borderRadius = Math.max(0, br - bs) + 'px';
    } else {
        qo.style.background = gc; qo.style.padding = gs + 'px'; qo.style.borderRadius = br + 'px';
    }

    updateLabels();
    document.getElementById('downloadBtn').style.display = 'inline-block';
    document.getElementById('exportBtns').style.display = 'flex';
});

// =============================================
// HELPERS
// =============================================
function drawRoundedRect(ctx, x, y, w, h, r) {
    if (r <= 0) { ctx.beginPath(); ctx.rect(x, y, w, h); ctx.closePath(); return; }
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function escapeXml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// =============================================
// QR MATRIX SAMPLING
// =============================================
function sampleQRMatrix() {
    var ic = document.querySelector('#qrcode canvas');
    if (!ic) return null;
    var tmp = document.createElement('canvas');
    tmp.width = ic.width; tmp.height = ic.height;
    var tc = tmp.getContext('2d'); tc.drawImage(ic, 0, 0);
    var img = tc.getImageData(0, 0, tmp.width, tmp.height);
    var d = img.data; var th = 128;
    var patterns = []; var mps = Math.min(tmp.width, tmp.height) / 8;

    for (var y = 0; y < tmp.height; y += 4) {
        for (var x = 0; x < tmp.width; x += 4) {
            var li = (y * tmp.width + x) * 4;
            var lum = (d[li] + d[li+1] + d[li+2]) / 3;
            if (lum < th) {
                var rx = x, by = y;
                while (rx < tmp.width) { var ri = (y * tmp.width + rx) * 4; if ((d[ri]+d[ri+1]+d[ri+2])/3 >= th) break; rx++; }
                while (by < tmp.height) { var bi = (by * tmp.width + x) * 4; if ((d[bi]+d[bi+1]+d[bi+2])/3 >= th) break; by++; }
                var sz = Math.min(rx - x, by - y);
                if (sz >= mps) { patterns.push({x:x,y:y,size:sz}); y += sz; break; }
            }
        }
    }
    patterns.sort(function(a,b){return b.size-a.size;});
    patterns = patterns.slice(0, 3);
    if (patterns.length !== 3) return null;

    var avg = (patterns[0].size + patterns[1].size + patterns[2].size) / 3;
    var ms = Math.round(avg / 7);
    var mnx = Infinity, mny = Infinity, mxx = 0, mxy = 0;
    patterns.forEach(function(p){mnx=Math.min(mnx,p.x);mny=Math.min(mny,p.y);mxx=Math.max(mxx,p.x+p.size);mxy=Math.max(mxy,p.y+p.size);});
    var mods = Math.round(Math.max(mxx-mnx, mxy-mny) / ms);
    var grid = [];
    for (var gy = 0; gy < mods; gy++) {
        var row = [];
        for (var gx = 0; gx < mods; gx++) {
            var cx = Math.floor(mnx + (gx+0.5) * ms);
            var cy = Math.floor(mny + (gy+0.5) * ms);
            var dc = 0;
            for (var sy = -1; sy <= 1; sy++) for (var sx = -1; sx <= 1; sx++) {
                var sx2 = cx+sx, sy2 = cy+sy;
                if (sx2<0||sx2>=tmp.width||sy2<0||sy2>=tmp.height) continue;
                var di = (sy2*tmp.width+sx2)*4;
                if ((d[di]+d[di+1]+d[di+2])/3 < th) dc++;
            }
            row.push(dc > 4 ? 1 : 0);
        }
        grid.push(row);
    }
    return {grid:grid, moduleSize:ms, modules:mods};
}

// =============================================
// MERGE & OPTIMIZE RECTANGLES
// =============================================
function mergeRectangles(grid, invert) {
    var n = grid.length;
    var used = []; for(var i=0;i<n;i++){used[i]=[];for(var j=0;j<n;j++)used[i][j]=false;}
    var rects = [];
    for (var y=0;y<n;y++) for (var x=0;x<n;x++) {
        if (used[y][x]) continue;
        var sh = invert ? (grid[y][x]===0) : (grid[y][x]===1);
        if (!sh) continue;
        var w = 1;
        while(x+w<n){var ok=grid[y][x+w];if(!(invert?(ok===0):(ok===1))||used[y][x+w])break;w++;}
        var h = 1;
        while(y+h<n){var al=true;for(var xi=0;xi<w;xi++){var ok2=grid[y+h][x+xi];if(!(invert?(ok2===0):(ok2===1))||used[y+h][x+xi]){al=false;break;}}if(!al)break;h++;}
        for(var yy=0;yy<h;yy++)for(var xx=0;xx<w;xx++)used[y+yy][x+xx]=true;
        rects.push({x:x,y:y,w:w,h:h});
    }
    return rects;
}

function optimizeRectangles(rects) {
    var ch = true;
    while(ch){
        ch=false;
        var byRow={};
        rects.forEach(function(r){var k=r.y+'|'+r.h;if(!byRow[k])byRow[k]=[];byRow[k].push(r);});
        for(var k in byRow){var arr=byRow[k].sort(function(a,b){return a.x-b.x;});for(var i=0;i<arr.length-1;i++){var a=arr[i],b=arr[i+1];if(a.x+a.w===b.x&&a.h===b.h&&a.y===b.y){a.w+=b.w;rects.splice(rects.indexOf(b),1);ch=true;}}}
        var byCol={};
        rects.forEach(function(r){var k=r.x+'|'+r.w;if(!byCol[k])byCol[k]=[];byCol[k].push(r);});
        for(var k2 in byCol){var arr2=byCol[k2].sort(function(a,b){return a.y-b.y;});for(var i2=0;i2<arr2.length-1;i2++){var a2=arr2[i2],b2=arr2[i2+1];if(a2.y+a2.h===b2.y&&a2.w===b2.w&&a2.x===b2.x){a2.h+=b2.h;rects.splice(rects.indexOf(b2),1);ch=true;}}}
    }
    return rects;
}

// =============================================
// PNG DOWNLOAD
// =============================================
document.getElementById('downloadBtn').addEventListener('click', function() {
    var ic = document.querySelector('#qrcode canvas');
    if (!ic) return;
    var lb = getLabelConfig();
    var be = document.getElementById('borderEnable').checked;
    var bs = parseInt(document.getElementById('borderSize').value);
    var bc = document.getElementById('borderColor').value;
    var br = parseInt(document.getElementById('borderRadius').value);
    var gs = parseInt(document.getElementById('gapSize').value);
    var gc = document.getElementById('gapColor').value;
    var iw = ic.width, ih = ic.height;
    var tw = iw + gs*2 + bs*2*(be?1:0);

    var tc = document.createElement('canvas').getContext('2d');
    var fw = lb.bold ? 'bold ' : '';
    tc.font = fw + lb.size + 'px Segoe UI, sans-serif';
    var tlh = (lb.topEnabled && lb.topText) ? lb.size+16 : 0;
    var blh = (lb.bottomEnabled && lb.bottomText) ? lb.size+16 : 0;
    var totalH = tlh + tw + blh;
    var totalW = Math.max(tw, tc.measureText(lb.topText||'').width+32, tc.measureText(lb.bottomText||'').width+32);

    var oc = document.createElement('canvas'); oc.width = totalW; oc.height = totalH;
    var ctx = oc.getContext('2d');
    var ox = (totalW - tw) / 2;

    if (lb.topEnabled && lb.topText) {
        ctx.fillStyle = lb.color; ctx.font = fw + lb.size + 'px Segoe UI, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(lb.topText, totalW/2, tlh/2);
    }
    var qrY = tlh;
    if (be && bs > 0) { ctx.fillStyle = bc; drawRoundedRect(ctx, ox, qrY, tw, tw, br); ctx.fill(); }
    var go = be ? bs : 0;
    ctx.fillStyle = gc; drawRoundedRect(ctx, ox+go, qrY+go, tw-go*2, tw-go*2, Math.max(0, br-go)); ctx.fill();
    ctx.drawImage(ic, ox+go+gs, qrY+go+gs, iw, ih);
    if (lb.bottomEnabled && lb.bottomText) {
        ctx.fillStyle = lb.color; ctx.font = fw + lb.size + 'px Segoe UI, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(lb.bottomText, totalW/2, qrY+tw+blh/2);
    }
    var link = document.createElement('a'); link.download = 'qrcode.png'; link.href = oc.toDataURL('image/png'); link.click();
});

// =============================================
// SVG DOWNLOAD
// =============================================
document.getElementById('svgDownloadBtn').addEventListener('click', function() {
    var ic = document.querySelector('#qrcode canvas');
    if (!ic) return;
    var lb = getLabelConfig();
    var sz = ic.width, ctx = ic.getContext('2d');
    var imgData = ctx.getImageData(0, 0, sz, sz); var d = imgData.data;
    var cd = document.getElementById('qrColorDark').value; var cl = document.getElementById('qrColorLight').value;
    var ms = 1; var th = 128;
    for (var x=1;x<sz;x++){var lum=(d[x*4]+d[x*4+1]+d[x*4+2])/3;var pl=(d[(x-1)*4]+d[(x-1)*4+1]+d[(x-1)*4+2])/3;if((lum<th)!==(pl<th)){ms=x;break;}}
    var mods = Math.round(sz/ms);
    var tlh = (lb.topEnabled && lb.topText) ? lb.size+16 : 0;
    var blh = (lb.bottomEnabled && lb.bottomText) ? lb.size+16 : 0;
    var totalH = tlh + sz + blh;
    var fw = lb.bold ? ' font-weight="bold"' : '';
    var svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="'+sz+'" height="'+totalH+'" viewBox="0 0 '+sz+' '+totalH+'">\n<rect width="'+sz+'" height="'+totalH+'" fill="'+cl+'"/>\n';
    if (lb.topEnabled && lb.topText) svg += '<text x="'+(sz/2)+'" y="'+(tlh/2)+'" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="'+lb.size+'" fill="'+lb.color+'"'+fw+'>'+escapeXml(lb.topText)+'</text>\n';
    var qrY = tlh;
    for(var y=0;y<mods;y++)for(var x2=0;x2<mods;x2++){var cx=Math.floor((x2+0.5)*ms);var cy=Math.floor((y+0.5)*ms);var idx=(cy*sz+cx)*4;if((d[idx]+d[idx+1]+d[idx+2])/3<th)svg+='<rect x="'+(x2*ms)+'" y="'+(qrY+y*ms)+'" width="'+ms+'" height="'+ms+'" fill="'+cd+'"/>\n';}
    if (lb.bottomEnabled && lb.bottomText) svg += '<text x="'+(sz/2)+'" y="'+(qrY+sz+blh/2)+'" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="'+lb.size+'" fill="'+lb.color+'"'+fw+'>'+escapeXml(lb.bottomText)+'</text>\n';
    svg += '</svg>';
    var blob = new Blob([svg],{type:'image/svg+xml'}); var url = URL.createObjectURL(blob);
    var link = document.createElement('a'); link.download = 'qrcode.svg'; link.href = url; link.click(); URL.revokeObjectURL(url);
});

// =============================================
// PDF DOWNLOAD
// =============================================
document.getElementById('pdfDownloadBtn').addEventListener('click', function() {
    var ic = document.querySelector('#qrcode canvas');
    if (!ic) return;
    if (typeof window.jspdf === 'undefined') {
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = function(){doExportPDF(ic);}; document.head.appendChild(s);
    } else { doExportPDF(ic); }
});

function doExportPDF(canvas) {
    var jsPDF = window.jspdf.jsPDF;
    var lb = getLabelConfig();
    var imgData = canvas.toDataURL('image/png');
    var pdf = new jsPDF('p','mm','a4');
    var pw = pdf.internal.pageSize.getWidth();
    var y = 20;
    if (lb.topEnabled && lb.topText) { pdf.setFont('helvetica',lb.bold?'bold':'normal'); pdf.setFontSize(lb.size*0.75); pdf.text(lb.topText,pw/2,y,{align:'center'}); y += lb.size*0.75/2+5; }
    var isz = Math.min(pw-40,150); pdf.addImage(imgData,'PNG',(pw-isz)/2,y,isz,isz); y += isz+5;
    if (lb.bottomEnabled && lb.bottomText) { pdf.setFont('helvetica',lb.bold?'bold':'normal'); pdf.setFontSize(lb.size*0.75); pdf.text(lb.bottomText,pw/2,y,{align:'center'}); }
    pdf.save('qrcode.pdf');
}

// =============================================
// THREE.JS 3D PREVIEW
// =============================================
function disposeThreeScene() {
    if (threeScene) {
        if (threeScene.renderer) threeScene.renderer.dispose();
        if (threeScene.controls) threeScene.controls.dispose();
        if (threeScene.animId) cancelAnimationFrame(threeScene.animId);
        if (threeScene.resizeH) window.removeEventListener('resize', threeScene.resizeH);
        threeScene = null;
    }
}


document.getElementById('stlResetCamera').addEventListener('click', function() {
    if (!threeScene) return;
    var s = sampleQRMatrix(); if (!s) return;
    var smm = parseFloat(document.getElementById('stlModuleSize').value) || 2.0;
    var bt = parseFloat(document.getElementById('stlBaseThickness').value) || 2.0;
    var md = s.modules * smm * 1.3;
    threeScene.camera.position.set(md*0.7, md*0.7, md*0.6);
    threeScene.controls.target.set(0, 0, bt/2);
    threeScene.controls.update();
});

document.getElementById('stlClosePreview').addEventListener('click', function() {
    disposeThreeScene();
    document.getElementById('stlPreviewContainer').classList.remove('visible');
});

// =============================================
// STL EXPORT
// =============================================
document.getElementById('stlExportBtn').addEventListener('click', function() {
    var sample = sampleQRMatrix();
    if (!sample) { alert('Kein QR-Code erkannt.'); return; }
    var smm = parseFloat(document.getElementById('stlModuleSize').value) || 2.0;
    var mh = parseFloat(document.getElementById('stlModuleHeight').value) || 2.0;
    var bt = parseFloat(document.getElementById('stlBaseThickness').value) || 1.0;
    var inv = document.getElementById('stlInvert').checked;
    var fn = document.getElementById('stlFilename').value || 'qrcode.stl';
    var fe = document.getElementById('stlFrame3D').checked;
    var fh = parseFloat(document.getElementById('stlFrameHeight').value) || 2.0;
    var th3d = parseFloat(document.getElementById('stlTextHeight').value) || 1.0;
    var labels = getLabelConfig();
    var grid = sample.grid;
    var mods = sample.modules;
    var ts = mods * smm;
    var ox = -ts/2, oy = -ts/2;
    var tris = [];
    function tri(a,b,c){tris.push({a:[a[0],a[1],a[2]],b:[b[0],b[1],b[2]],c:[c[0],c[1],c[2]]});}
    function addBox(x,y,w,h,z0,z1){
        if(w<=0||h<=0||z1<=z0)return;
        var v=[[x,y,z0],[x+w,y,z0],[x+w,y+h,z0],[x,y+h,z0],[x,y,z1],[x+w,y,z1],[x+w,y+h,z1],[x,y+h,z1]];
        tri(v[0],v[2],v[1]);tri(v[0],v[3],v[2]);tri(v[4],v[5],v[6]);tri(v[4],v[6],v[7]);
        tri(v[0],v[1],v[5]);tri(v[0],v[5],v[4]);tri(v[1],v[2],v[6]);tri(v[1],v[6],v[5]);
        tri(v[2],v[3],v[7]);tri(v[2],v[7],v[6]);tri(v[3],v[0],v[4]);tri(v[3],v[4],v[7]);
    }
    addBox(ox,oy,ts,ts,0,bt);
    var rects = optimizeRectangles(mergeRectangles(grid, inv));
    rects.forEach(function(r){addBox(r.x*smm+ox,r.y*smm+oy,r.w*smm,r.h*smm,bt,bt+mh);});
    if(fe){var bw=Math.max(smm*2,2);addBox(ox-bw,oy-bw,ts+bw*2,bw,0,fh);addBox(ox-bw,oy+ts,ts+bw*2,bw,0,fh);addBox(ox-bw,oy,bw,ts,0,fh);addBox(ox+ts,oy,bw,ts,0,fh);}
    if(labels.topEnabled||labels.bottomEnabled){
        var cw=smm*1.5,cd=smm*2.5;
        function addT(t,yb){if(!t)return;var tw=t.length*cw;var sx=-tw/2;for(var i=0;i<t.length;i++)addBox(sx+i*cw+cw*0.1,yb-cd/2,cw*0.8,cd,bt,bt+th3d);}
        if(labels.topEnabled)addT(labels.topText,oy-ts*0.2);
        if(labels.bottomEnabled)addT(labels.bottomText,oy+ts+ts*0.2);
    }
    function normal(a,b,c){var ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];var nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;var nl=Math.sqrt(nx*nx+ny*ny+nz*nz);return nl===0?[0,0,1]:[nx/nl,ny/nl,nz/nl];}
    var tc2 = tris.length;
    var buf = new ArrayBuffer(84 + tc2*50);
    var vw = new DataView(buf);
    vw.setUint32(80,tc2,true);
    var off=84;
    function wf(v){vw.setFloat32(off,v,true);off+=4;}
    function wu(v){vw.setUint16(off,v,true);off+=2;}
    tris.forEach(function(t){var n=normal(t.a,t.b,t.c);wf(n[0]);wf(n[1]);wf(n[2]);wf(t.a[0]);wf(t.a[1]);wf(t.a[2]);wf(t.b[0]);wf(t.b[1]);wf(t.b[2]);wf(t.c[0]);wf(t.c[1]);wf(t.c[2]);wu(0);});
    var blob=new Blob([buf],{type:'application/octet-stream'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');a.href=url;a.download=fn.replace(/\.stl$/i,'')+'.stl';a.click();
    URL.revokeObjectURL(url);
});

function renderSTLPreview3D() {
    if (typeof THREE === 'undefined') { alert('Three.js wird noch geladen. Bitte Seite neu laden.'); return; }
    var sample = sampleQRMatrix();
    if (!sample) { alert('Kein QR-Code erkannt. Bitte zuerst QR-Code generieren.'); return; }

    disposeThreeScene();

    var container = document.getElementById('stlPreviewContainer');
    container.classList.add('visible');

    var width = container.clientWidth || 400;
    var height = container.clientHeight || 320;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e8e8);

    var camera = new THREE.PerspectiveCamera(40, width/height, 0.1, 1000);

    var renderer;
    try {
        renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
    } catch(e) {
        alert('WebGL Fehler: ' + e.message);
        container.classList.remove('visible');
        return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xe8e8e8, 1);
    var oldC = container.querySelector('canvas');
    if (oldC) oldC.remove();
    container.insertBefore(renderer.domElement, container.firstChild);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.8;

    // Lighting
    var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemiLight);
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 200, 150);
    scene.add(dirLight);
    var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-100, 50, -100);
    scene.add(dirLight2);

    // Parameters
    var smm = parseFloat(document.getElementById('stlModuleSize').value) || 2.0;
    var mh = parseFloat(document.getElementById('stlModuleHeight').value) || 2.0;
    var bt = parseFloat(document.getElementById('stlBaseThickness').value) || 2.0;
    var inv = document.getElementById('stlInvert').checked;
    var fe = document.getElementById('stlFrame3D').checked;
    var fh = parseFloat(document.getElementById('stlFrameHeight').value) || 2.0;
    var grid = sample.grid;
    var mods = sample.modules;
    var ts = mods * smm;
    var ht = ts / 2;

    // Materials
    var baseMat = new THREE.MeshPhongMaterial({color: 0xcccccc, shininess: 20, specular: 0x222222});
    var modMat = new THREE.MeshPhongMaterial({color: 0x1a1a1a, shininess: 40, specular: 0x444444});
    var frameMat = new THREE.MeshPhongMaterial({color: 0x999999, shininess: 30, specular: 0x333333});

    // Base plate
    var baseGeo = new THREE.BoxGeometry(ts, ts, bt);
    var baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, 0, bt/2);
    scene.add(baseMesh);

    // Modules
    var rects = optimizeRectangles(mergeRectangles(grid, inv));
    rects.forEach(function(r) {
        var w = r.w * smm, h = r.h * smm;
        var geo = new THREE.BoxGeometry(w, h, mh);
        var mesh = new THREE.Mesh(geo, modMat);
        mesh.position.set(r.x*smm + w/2 - ht, r.y*smm + h/2 - ht, bt + mh/2);
        scene.add(mesh);
    });

    // Frame
    if (fe) {
        var bw = Math.max(smm * 2, 2);
        var zc = (bt + fh) / 2;
        var tg = new THREE.BoxGeometry(ts+bw*2, bw, fh);
        var tm = new THREE.Mesh(tg, frameMat); tm.position.set(0, -ht-bw/2, zc); scene.add(tm);
        var bm2 = new THREE.Mesh(tg.clone(), frameMat); bm2.position.set(0, ht+bw/2, zc); scene.add(bm2);
        var sg = new THREE.BoxGeometry(bw, ts, fh);
        var lm = new THREE.Mesh(sg, frameMat); lm.position.set(-ht-bw/2, 0, zc); scene.add(lm);
        var rm = new THREE.Mesh(sg.clone(), frameMat); rm.position.set(ht+bw/2, 0, zc); scene.add(rm);
    }

    // Text labels in 3D
    var labels = getLabelConfig();
    var th3d = parseFloat(document.getElementById('stlTextHeight').value) || 1.0;
    var textMat = new THREE.MeshPhongMaterial({color: 0x444444, shininess: 40});

    function addText3D(text, yPos) {
        if (!text) return;
        var cw = smm * 1.5, ch = smm * 2.5;
        var tw = text.length * cw;
        var sx = -tw / 2;
        for (var i = 0; i < text.length; i++) {
            var geo = new THREE.BoxGeometry(cw*0.8, ch, th3d);
            var mesh = new THREE.Mesh(geo, textMat);
            mesh.position.set(sx + i*cw + cw/2, yPos, bt + th3d/2);
            scene.add(mesh);
        }
    }
    if (labels.topEnabled && labels.topText) addText3D(labels.topText, -ht - ts*0.2);
    if (labels.bottomEnabled && labels.bottomText) addText3D(labels.bottomText, ht + ts*0.2);

    // Camera - position to see the whole model
    var maxDim = Math.max(ts, fh) * 1.4;
    camera.position.set(maxDim, maxDim * 0.8, maxDim * 0.9);
    camera.lookAt(0, 0, bt/2);
    controls.target.set(0, 0, bt/2);
    controls.update();

    // Store scene data BEFORE animation starts
    var animFrameId = null;

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

    // Set threeScene with the actual animation ID
    threeScene = {
        renderer: renderer,
        controls: controls,
        animId: animFrameId,
        resizeH: onResize
    };
}

document.getElementById('stlPreviewBtn').addEventListener('click', function() { renderSTLPreview3D(); });

document.getElementById('stlResetCamera').addEventListener('click', function() {
    if (!threeScene) return;
    var s = sampleQRMatrix(); if (!s) return;
    var smm = parseFloat(document.getElementById('stlModuleSize').value) || 2.0;
    var bt = parseFloat(document.getElementById('stlBaseThickness').value) || 2.0;
    var ts = s.modules * smm;
    var maxDim = Math.max(ts, parseFloat(document.getElementById('stlFrameHeight').value) || 2.0) * 1.4;
    threeScene.camera.position.set(maxDim, maxDim * 0.8, maxDim * 0.9);
    threeScene.controls.target.set(0, 0, bt/2);
    threeScene.controls.update();
});

document.getElementById('stlClosePreview').addEventListener('click', function() {
    disposeThreeScene();
    document.getElementById('stlPreviewContainer').classList.remove('visible');
});
}); // end DOMContentLoaded
