<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR-Code Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            /* helleres, leicht graublaues Farbschema */
            --primary-gradient: linear-gradient(135deg, #a9c4ff 0%, #9fb3d7 100%);
            --secondary-gradient: linear-gradient(135deg, #e9eef8 0%, #d6e2f0 100%);
            --muted-border: #e6eef9;
            --muted-text: #6b7c93;
        }
        
        body {
            /* leichter, heller blau-grauer Hintergrund */
            background: linear-gradient(135deg, #f3f7fb 0%, #e6eef9 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #213547;
        }
        
        .main-container {
            padding: 40px 0;
        }
        
        .card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
        }
        
        .card-header {
            background: var(--primary-gradient);
            color: #12324a;
            padding: 30px;
            border: none;
            box-shadow: 0 6px 18px rgba(30,50,70,0.06);
        }
        
        .card-header h1 {
            margin: 0;
            font-weight: 700;
            font-size: 2.5rem;
        }
        
        .card-header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        
        .form-label {
            font-weight: 600;
            color: var(--muted-text);
            margin-bottom: 8px;
        }
        
        .form-control, .form-select {
            border-radius: 12px;
            border: 2px solid var(--muted-border);
            padding: 12px 16px;
            transition: all 0.3s ease;
            background: white;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .btn-generate {
            background: linear-gradient(90deg, #7faeff 0%, #7aa6d1 100%);
            border: none;
            border-radius: 12px;
            padding: 14px 40px;
            font-weight: 600;
            font-size: 1.1rem;
            color: #072033;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(60,100,160,0.12);
        }
        
        .btn-generate:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        .btn-download {
            background: var(--secondary-gradient);
            border: none;
            border-radius: 12px;
            padding: 12px 30px;
            font-weight: 600;
            color: white;
            transition: all 0.3s ease;
        }
        
        .btn-download:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
        }
        
        .qr-result {
            background: linear-gradient(180deg, #ffffff 0%, #f4f8fc 60%);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            min-height: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--muted-border);
        }
        
        .qr-placeholder {
            color: #9ca3af;
            font-size: 1.1rem;
        }
        
        #qrcode {
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 15px;
            display: inline-block;
        }

        /* support for visual border wrapper that can be applied via JS */
        #qrcode.wrapper-bordered {
            display: inline-block;
        }
        
        .color-picker-group {
            display: flex;
            gap: 15px;
            align-items: end;
        }
        
        .color-input-wrapper {
            flex: 1;
        }
        
        input[type="color"] {
            height: 50px;
            border-radius: 12px;
            border: 2px solid #e0e7ff;
            cursor: pointer;
        }
        
        .advanced-options {
            background: #f7f9fc;
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            border: 1px solid var(--muted-border);
        }
        
        @media (max-width: 768px) {
            .card-header h1 {
                font-size: 2rem;
            }
            
            .color-picker-group {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container main-container">
        <div class="card">
            <div class="card-header text-center">
                <h1><i class="fas fa-qrcode"></i> QR-Code Generator</h1>
                <p>Erstellen Sie professionelle QR-Codes in Sekunden</p>
            </div>
            <div class="card-body p-4">
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <form id="qrForm">
                            <div class="mb-4">
                                <label for="qrType" class="form-label">
                                    <i class="fas fa-layer-group"></i> QR-Code Typ
                                </label>
                                <select class="form-select" id="qrType">
                                    <option value="text">Text</option>
                                    <option value="url">URL/Webseite</option>
                                    <option value="email">E-Mail</option>
                                    <option value="phone">Telefon</option>
                                    <option value="sms">SMS</option>
                                    <option value="vcard">Kontakt-Karte (vCard)</option>
                                    <option value="wifi">WiFi</option>
                                </select>
                            </div>
                            
                            <div class="mb-4" id="contentFields">
                                <label for="qrContent" class="form-label">
                                    <i class="fas fa-keyboard"></i> Inhalt
                                </label>
                                <textarea class="form-control" id="qrContent" rows="3" placeholder="Geben Sie den Inhalt ein..."></textarea>
                            </div>
                            
                            <div class="advanced-options">
                                <h5 class="mb-3"><i class="fas fa-sliders-h"></i> Erweiterte Optionen</h5>
                                
                                <div class="mb-3">
                                    <label for="qrSize" class="form-label">Größe: <span id="sizeValue">256</span>px</label>
                                    <input type="range" class="form-range" id="qrSize" min="128" max="512" step="32" value="256">
                                </div>
                                
                                <div class="color-picker-group mb-3">
                                    <div class="color-input-wrapper">
                                        <label for="qrColorDark" class="form-label">Vordergrund</label>
                                        <input type="color" class="form-control" id="qrColorDark" value="#000000">
                                    </div>
                                    <div class="color-input-wrapper">
                                        <label for="qrColorLight" class="form-label">Hintergrund</label>
                                        <input type="color" class="form-control" id="qrColorLight" value="#ffffff">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Umrandung (Rahmen)</label>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="borderEnable">
                                            <label class="form-check-label" for="borderEnable">Aktivieren</label>
                                        </div>
                                        <div style="flex:1">
                                            <label for="borderSize" class="form-label small">Breite: <span id="borderSizeValue">8</span>px</label>
                                            <input type="range" class="form-range" id="borderSize" min="0" max="40" value="8">
                                        </div>
                                    </div>
                                    <div class="d-flex gap-3 mt-2">
                                        <div style="flex:1">
                                            <label for="borderColor" class="form-label small">Farbe</label>
                                            <input type="color" id="borderColor" class="form-control" value="#ffffff">
                                        </div>
                                        <div style="flex:1">
                                            <label for="borderRadius" class="form-label small">Radius: <span id="borderRadiusValue">15</span>px</label>
                                            <input type="range" class="form-range" id="borderRadius" min="0" max="50" value="15">
                                        </div>
                                    </div>

                                    <div class="mt-3">
                                        <label class="form-label small">Abstand zwischen Rahmen und QR (Gap): <span id="gapSizeValue">8</span>px</label>
                                        <input type="range" id="gapSize" class="form-range" min="0" max="40" value="8">
                                        <div class="d-flex gap-3 mt-2">
                                            <div style="flex:1">
                                                <label for="gapColor" class="form-label small">Gap-Farbe</label>
                                                <input type="color" id="gapColor" class="form-control" value="#ffffff">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="qrErrorLevel" class="form-label">Fehlerkorrektur</label>
                                    <select class="form-select" id="qrErrorLevel">
                                        <option value="L">Niedrig (7%)</option>
                                        <option value="M" selected>Mittel (15%)</option>
                                        <option value="Q">Hoch (25%)</option>
                                        <option value="H">Sehr Hoch (30%)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="d-grid mt-4">
                                <button type="submit" class="btn btn-generate">
                                    <i class="fas fa-magic"></i> QR-Code Generieren
                                </button>
                            </div>
                            
                            <div class="mt-3">
                                <h6 class="mb-2">STL-Export</h6>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <label class="form-label small">Modulgröße (mm)</label>
                                        <input type="number" id="stlModuleSize" class="form-control" value="2.0" step="0.1">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label small">Modulhöhe (mm)</label>
                                        <input type="number" id="stlModuleHeight" class="form-control" value="2.0" step="0.1">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label small">Basisdicke (mm)</label>
                                        <input type="number" id="stlBaseThickness" class="form-control" value="2.0" step="0.1">
                                    </div>
                                    <div class="col-6 d-flex align-items-end">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="stlInvert">
                                            <label class="form-check-label small" for="stlInvert">Invert (weiß=erhöht)</label>
                                        </div>
                                    </div>
                                    <div class="col-8">
                                        <label class="form-label small">Dateiname</label>
                                        <input type="text" id="stlFilename" class="form-control" value="qrcode.stl">
                                    </div>
                                    <div class="col-4 d-grid">
                                        <label class="form-label small">Vorschau</label>
                                        <button id="stlPreviewBtn" type="button" class="btn btn-outline-secondary">Preview</button>
                                    </div>
                                    <div class="col-12 mt-2 d-grid">
                                        <button id="stlExportBtn" type="button" class="btn btn-primary">Export STL</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="col-lg-6">
                            <div class="qr-result">
                            <div id="qrPlaceholder" class="qr-placeholder">
                                <i class="fas fa-qrcode fa-5x mb-3"></i>
                                <p>Ihr QR-Code wird hier angezeigt</p>
                            </div>
                            <div id="qrcode-outer" style="display:inline-block;">
                                <div id="qrcode"></div>
                            </div>
                            <button id="downloadBtn" class="btn btn-download mt-3" style="display: none;">
                                <i class="fas fa-download"></i> Als PNG herunterladen
                            </button>
                            <canvas id="stlPreviewCanvas" width="240" height="240" style="display:block;margin-top:12px;border:1px solid var(--muted-border);background:white"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script>
        let qrcode = null;
        
        // Größen-Slider Update
        document.getElementById('qrSize').addEventListener('input', function() {
            document.getElementById('sizeValue').textContent = this.value;
        });

        // Border slider value displays live update
        document.getElementById('borderSize').addEventListener('input', function() {
            document.getElementById('borderSizeValue').textContent = this.value;
        });
        document.getElementById('borderRadius').addEventListener('input', function() {
            document.getElementById('borderRadiusValue').textContent = this.value;
        });
        
        // QR-Code Typ Änderung
        document.getElementById('qrType').addEventListener('change', function() {
            updateContentFields(this.value);
        });
        
        function updateContentFields(type) {
            const contentFields = document.getElementById('contentFields');
            let html = '';
            
            switch(type) {
                case 'url':
                    html = `
                        <label for="qrContent" class="form-label">
                            <i class="fas fa-link"></i> URL
                        </label>
                        <input type="url" class="form-control" id="qrContent" placeholder="https://beispiel.de">
                    `;
                    break;
                case 'email':
                    html = `
                        <label class="form-label"><i class="fas fa-envelope"></i> E-Mail Details</label>
                        <input type="email" class="form-control mb-2" id="emailAddress" placeholder="E-Mail Adresse">
                        <input type="text" class="form-control mb-2" id="emailSubject" placeholder="Betreff (optional)">
                        <textarea class="form-control" id="emailBody" rows="2" placeholder="Nachricht (optional)"></textarea>
                    `;
                    break;
                case 'phone':
                    html = `
                        <label for="qrContent" class="form-label">
                            <i class="fas fa-phone"></i> Telefonnummer
                        </label>
                        <input type="tel" class="form-control" id="qrContent" placeholder="+49 123 456789">
                    `;
                    break;
                case 'sms':
                    html = `
                        <label class="form-label"><i class="fas fa-sms"></i> SMS Details</label>
                        <input type="tel" class="form-control mb-2" id="smsNumber" placeholder="Telefonnummer">
                        <textarea class="form-control" id="smsMessage" rows="2" placeholder="Nachricht (optional)"></textarea>
                    `;
                    break;
                case 'vcard':
                    html = `
                        <label class="form-label"><i class="fas fa-address-card"></i> Kontakt-Informationen</label>
                        <div class="row">
                            <div class="col-md-6 mb-2">
                                <input type="text" class="form-control" id="vcardFirstName" placeholder="Vorname*">
                            </div>
                            <div class="col-md-6 mb-2">
                                <input type="text" class="form-control" id="vcardLastName" placeholder="Nachname*">
                            </div>
                        </div>
                        <input type="text" class="form-control mb-2" id="vcardOrg" placeholder="Organisation/Firma">
                        <input type="text" class="form-control mb-2" id="vcardTitle" placeholder="Position/Titel">
                        <input type="tel" class="form-control mb-2" id="vcardPhone" placeholder="Telefon">
                        <input type="tel" class="form-control mb-2" id="vcardMobile" placeholder="Mobil">
                        <input type="email" class="form-control mb-2" id="vcardEmail" placeholder="E-Mail">
                        <input type="url" class="form-control mb-2" id="vcardWebsite" placeholder="Website">
                        <input type="text" class="form-control mb-2" id="vcardStreet" placeholder="Straße und Hausnummer">
                        <div class="row">
                            <div class="col-md-4 mb-2">
                                <input type="text" class="form-control" id="vcardCity" placeholder="Stadt">
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="text" class="form-control" id="vcardZip" placeholder="PLZ">
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="text" class="form-control" id="vcardCountry" placeholder="Land">
                            </div>
                        </div>
                    `;
                    break;
                case 'wifi':
                    html = `
                        <label class="form-label"><i class="fas fa-wifi"></i> WiFi Details</label>
                        <input type="text" class="form-control mb-2" id="wifiSSID" placeholder="Netzwerkname (SSID)">
                        <input type="password" class="form-control mb-2" id="wifiPassword" placeholder="Passwort">
                        <select class="form-select" id="wifiEncryption">
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">Kein Passwort</option>
                        </select>
                    `;
                    break;
                default:
                    html = `
                        <label for="qrContent" class="form-label">
                            <i class="fas fa-keyboard"></i> Inhalt
                        </label>
                        <textarea class="form-control" id="qrContent" rows="3" placeholder="Geben Sie den Inhalt ein..."></textarea>
                    `;
            }
            
            contentFields.innerHTML = html;
        }
        
        function getQRContent(type) {
            switch(type) {
                case 'email':
                    const email = document.getElementById('emailAddress').value;
                    const subject = document.getElementById('emailSubject').value;
                    const body = document.getElementById('emailBody').value;
                    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    
                case 'sms':
                    const smsNum = document.getElementById('smsNumber').value;
                    const smsMsg = document.getElementById('smsMessage').value;
                    return `sms:${smsNum}${smsMsg ? '?body=' + encodeURIComponent(smsMsg) : ''}`;
                    
                case 'phone':
                    return `tel:${document.getElementById('qrContent').value}`;
                    
                case 'wifi':
                    const ssid = document.getElementById('wifiSSID').value;
                    const pass = document.getElementById('wifiPassword').value;
                    const enc = document.getElementById('wifiEncryption').value;
                    return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
                    
                default:
                    return document.getElementById('qrContent').value;
            }
        }
        
        // Form Submit
        document.getElementById('qrForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('Form submitted');
            const type = document.getElementById('qrType').value;
            const content = getQRContent(type);
            console.log('Content:', content, 'Type:', type);
            
            if (!content) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus!');
                return;
            }
            
            const size = parseInt(document.getElementById('qrSize').value);
            const colorDark = document.getElementById('qrColorDark').value;
            const colorLight = document.getElementById('qrColorLight').value;
            const errorLevel = document.getElementById('qrErrorLevel').value;
            console.log('QR params:', {size, colorDark, colorLight, errorLevel});
            
            // QR-Code Container leeren
            document.getElementById('qrcode').innerHTML = '';
            document.getElementById('qrPlaceholder').style.display = 'none';
            
            // Neuen QR-Code erstellen
            try {
                if (typeof QRCode === 'undefined') {
                    throw new Error('QRCode library not loaded');
                }
                qrcode = new QRCode(document.getElementById('qrcode'), {
                    text: content,
                    width: size,
                    height: size,
                    colorDark: colorDark,
                    colorLight: colorLight,
                    correctLevel: QRCode.CorrectLevel[errorLevel]
                });
                console.log('QR created successfully');
            } catch(e) {
                console.error('QR creation failed:', e);
                alert('QR-Code konnte nicht erstellt werden: ' + e.message);
                return;
            }
            
            // Border- und Gap-Einstellungen anwenden
            const borderEnabled = document.getElementById('borderEnable').checked;
            const borderSize = parseInt(document.getElementById('borderSize').value);
            const borderColor = document.getElementById('borderColor').value;
            const borderRadius = parseInt(document.getElementById('borderRadius').value);
            const gapSize = parseInt(document.getElementById('gapSize').value);
            const gapColor = document.getElementById('gapColor').value;

            const qrcodeOuter = document.getElementById('qrcode-outer');
            const qrcodeEl = document.getElementById('qrcode');
            // reset styles
            qrcodeOuter.style.background = '';
            qrcodeOuter.style.padding = '';
            qrcodeOuter.style.borderRadius = '';
            qrcodeEl.style.background = '';
            qrcodeEl.style.padding = '';
            qrcodeEl.style.borderRadius = '';

            if (borderEnabled && borderSize > 0) {
                // outer: border background color and radius
                qrcodeOuter.style.background = borderColor;
                qrcodeOuter.style.borderRadius = borderRadius + 'px';
                qrcodeOuter.style.padding = borderSize + 'px';
                qrcodeOuter.style.display = 'inline-block';

                // inner: gap background and gap padding
                qrcodeEl.style.background = gapColor;
                qrcodeEl.style.padding = gapSize + 'px';
                qrcodeEl.style.borderRadius = Math.max(0, borderRadius - borderSize) + 'px';
            } else {
                // no border: use gap directly on outer
                qrcodeOuter.style.background = gapColor;
                qrcodeOuter.style.padding = gapSize + 'px';
                qrcodeOuter.style.borderRadius = borderRadius + 'px';
                qrcodeEl.style.background = '';
                qrcodeEl.style.padding = '';
                qrcodeEl.style.borderRadius = '';
            }

            document.getElementById('downloadBtn').style.display = 'inline-block';
        });
        
        // Download Funktion
        document.getElementById('downloadBtn').addEventListener('click', function() {
            const innerCanvas = document.querySelector('#qrcode canvas');
            if (!innerCanvas) return;

            const borderEnabledDL = document.getElementById('borderEnable').checked;
            const borderSizeDL = parseInt(document.getElementById('borderSize').value);
            const borderColorDL = document.getElementById('borderColor').value;
            const borderRadiusDL = parseInt(document.getElementById('borderRadius').value);
            const gapSizeDL = parseInt(document.getElementById('gapSize').value);
            const gapColorDL = document.getElementById('gapColor').value;

            const innerW = innerCanvas.width;
            const innerH = innerCanvas.height;

            // total sizes: inner + 2*gap + 2*border
            const totalW = innerW + (gapSizeDL * 2) + (borderSizeDL * 2 * (borderEnabledDL ? 1 : 0));
            const totalH = innerH + (gapSizeDL * 2) + (borderSizeDL * 2 * (borderEnabledDL ? 1 : 0));

            const outCanvas = document.createElement('canvas');
            outCanvas.width = totalW;
            outCanvas.height = totalH;
            const ctx = outCanvas.getContext('2d');

            // draw border background (outermost)
            if (borderEnabledDL && borderSizeDL > 0) {
                ctx.fillStyle = borderColorDL;
                drawRoundedRect(ctx, 0, 0, totalW, totalH, borderRadiusDL);
                ctx.fill();
            }

            // draw gap rectangle inside border (or as outermost if no border)
            const gapOffset = (borderEnabledDL ? borderSizeDL : 0);
            const gapX = gapOffset;
            const gapY = gapOffset;
            const gapW = totalW - gapOffset * 2;
            const gapH = totalH - gapOffset * 2;

            ctx.fillStyle = gapColorDL;
            const gapRadius = Math.max(0, borderRadiusDL - (borderEnabledDL ? borderSizeDL : 0));
            drawRoundedRect(ctx, gapX, gapY, gapW, gapH, gapRadius);
            ctx.fill();

            // finally draw the inner QR canvas centered (after gap)
            const innerX = gapOffset + gapSizeDL;
            const innerY = gapOffset + gapSizeDL;
            ctx.drawImage(innerCanvas, innerX, innerY, innerW, innerH);

            const url = outCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = url;
            link.click();
        });

        // helper: draw rounded rectangle path
        function drawRoundedRect(ctx, x, y, width, height, radius) {
            if (radius <= 0) {
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.closePath();
                return;
            }
            const r = Math.min(radius, width / 2, height / 2);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + width, y, x + width, y + height, r);
            ctx.arcTo(x + width, y + height, x, y + height, r);
            ctx.arcTo(x, y + height, x, y, r);
            ctx.arcTo(x, y, x + width, y, r);
            ctx.closePath();
        }
        
        // --- STL Export / Preview Logic ---
        // Sample QR module grid by drawing the QR canvas at high resolution and sampling cells
        function sampleQRMatrix() {
            const innerCanvas = document.querySelector('#qrcode canvas');
            if (!innerCanvas) return null;

            const tmp = document.createElement('canvas');
            tmp.width = innerCanvas.width;
            tmp.height = innerCanvas.height;
            const tctx = tmp.getContext('2d');
            tctx.drawImage(innerCanvas, 0, 0);
            const img = tctx.getImageData(0, 0, tmp.width, tmp.height);
            const data = img.data;
            const threshold = 128;

            // Finde die drei Finder-Patterns (die großen Quadrate in den Ecken)
            let patterns = [];
            const minPatternSize = Math.min(tmp.width, tmp.height) / 8; // Mindestgröße für Finder-Pattern
            
            for (let y = 0; y < tmp.height; y += 4) {
                for (let x = 0; x < tmp.width; x += 4) {
                    let darkCount = 0;
                    let size = 0;
                    
                    // Überprüfe ob wir ein dunkles Pixel gefunden haben
                    const idx = (y * tmp.width + x) * 4;
                    const lum = (data[idx] + data[idx+1] + data[idx+2]) / 3;
                    
                    if (lum < threshold) {
                        // Bestimme die Größe des dunklen Bereichs
                        let right = x;
                        let bottom = y;
                        
                        while (right < tmp.width) {
                            const ridx = (y * tmp.width + right) * 4;
                            const rlum = (data[ridx] + data[ridx+1] + data[ridx+2]) / 3;
                            if (rlum >= threshold) break;
                            right++;
                        }
                        
                        while (bottom < tmp.height) {
                            const bidx = (bottom * tmp.width + x) * 4;
                            const blum = (data[bidx] + data[bidx+1] + data[bidx+2]) / 3;
                            if (blum >= threshold) break;
                            bottom++;
                        }
                        
                        size = Math.min(right - x, bottom - y);
                        
                        if (size >= minPatternSize) {
                            patterns.push({x: x, y: y, size: size});
                            y += size; // Überspringe den gefundenen Bereich
                            break;
                        }
                    }
                }
            }
            
            // Sortiere nach Größe und nimm die 3 größten
            patterns.sort((a, b) => b.size - a.size);
            patterns = patterns.slice(0, 3);
            
            if (patterns.length !== 3) return null;

            // Bestimme die Modulgröße aus dem durchschnittlichen Finder-Pattern
            const avgPatternSize = patterns.reduce((sum, p) => sum + p.size, 0) / 3;
            const moduleSize = Math.round(avgPatternSize / 7); // Finder-Pattern ist 7 Module groß

            // Bestimme die QR-Code-Größe basierend auf den Finder-Patterns
            const topLeft = patterns[0];
            let minX = topLeft.x;
            let minY = topLeft.y;
            let maxX = 0;
            let maxY = 0;
            
            patterns.forEach(p => {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x + p.size);
                maxY = Math.max(maxY, p.y + p.size);
            });

            // QR-Code-Version aus der Größe bestimmen (Version 1 hat 21 Module)
            const estimatedSize = Math.max(maxX - minX, maxY - minY);
            const modules = Math.round(estimatedSize / moduleSize);
            
            // Sample-Grid erstellen mit genauerer Positionierung
            const grid = [];
            for (let y = 0; y < modules; y++) {
                const rowArr = [];
                for (let x = 0; x < modules; x++) {
                    // Mittelpunkt des Moduls berechnen
                    const cx = Math.floor(minX + (x + 0.5) * moduleSize);
                    const cy = Math.floor(minY + (y + 0.5) * moduleSize);
                    
                    // 3x3 Sampling für bessere Genauigkeit
                    let darkCount = 0;
                    for (let sy = -1; sy <= 1; sy++) {
                        for (let sx = -1; sx <= 1; sx++) {
                            const sx2 = cx + sx;
                            const sy2 = cy + sy;
                            if (sx2 < 0 || sx2 >= tmp.width || sy2 < 0 || sy2 >= tmp.height) continue;
                            const idx = (sy2 * tmp.width + sx2) * 4;
                            const lum = (data[idx] + data[idx+1] + data[idx+2]) / 3;
                            if (lum < threshold) darkCount++;
                        }
                    }
                    // Modul ist dunkel wenn mehr als die Hälfte der Sample-Punkte dunkel sind
                    rowArr.push(darkCount > 4 ? 1 : 0);
                }
                grid.push(rowArr);
            }

            return {grid, moduleSize, modules};
        }

        function renderSTLPreview() {
            const sample = sampleQRMatrix();
            const canvas = document.getElementById('stlPreviewCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if (!sample) return;
            const {grid, modules} = sample;
            const cell = Math.floor(canvas.width / modules);
            for (let y=0;y<modules;y++){
                for (let x=0;x<modules;x++){
                    ctx.fillStyle = grid[y][x] ? '#0b0b0b' : '#ffffff';
                    ctx.fillRect(x*cell, y*cell, cell, cell);
                }
            }
        }

        function generateSTL() {
            const sample = sampleQRMatrix();
            if (!sample) { alert('Konnte QR-Matrix nicht erkennen. Bitte generiere zuerst einen QR-Code.'); return; }
            const {grid, modules} = sample;

            const moduleSize = parseFloat(document.getElementById('stlModuleSize').value) || 1.0;
            const moduleHeight = parseFloat(document.getElementById('stlModuleHeight').value) || 1.5;
            const baseThickness = parseFloat(document.getElementById('stlBaseThickness').value) || 1.0;
            const invert = document.getElementById('stlInvert').checked;
            const filename = document.getElementById('stlFilename').value || 'qrcode.stl';

            // Build ASCII STL: base plate + modules as prisms
            let triangles = [];
            // helper to push triangle from 3 vertices
            function tri(a,b,c){ 
                // Ensure correct vertex order for face normals
                triangles.push({
                    a: a.slice(), // Copy arrays to avoid reference issues
                    b: b.slice(),
                    c: c.slice()
                }); 
            }

            // coordinates: place origin at (0,0)
            const totalSize = modules * moduleSize;

            // base top at z = baseThickness
            // base as rectangular prism from z=0 to z=baseThickness
            function addBox(x,y,w,h,z0,z1){
                if (w <= 0 || h <= 0 || z1 <= z0) return; // Skip invalid boxes
                
                // create 8 vertices
                const v = [
                    [x,y,z0],[x+w,y,z0],[x+w,y+h,z0],[x,y+h,z0],  // Bottom vertices 0-3
                    [x,y,z1],[x+w,y,z1],[x+w,y+h,z1],[x,y+h,z1]   // Top vertices 4-7
                ];
                
                // Bottom face
                tri(v[0],v[2],v[1]); tri(v[0],v[3],v[2]);
                
                // Top face
                tri(v[4],v[5],v[6]); tri(v[4],v[6],v[7]);
                
                // Front face (y=0)
                tri(v[0],v[1],v[5]); tri(v[0],v[5],v[4]);
                
                // Right face (x=w)
                tri(v[1],v[2],v[6]); tri(v[1],v[6],v[5]);
                
                // Back face (y=h)
                tri(v[2],v[3],v[7]); tri(v[2],v[7],v[6]);
                
                // Left face (x=0)
                tri(v[3],v[0],v[4]); tri(v[3],v[4],v[7]);
            }

            // add base (centered)
            const offsetX = - totalSize / 2;
            const offsetY = - totalSize / 2;
            addBox(offsetX, offsetY, totalSize, totalSize, 0, baseThickness);

            // helper: merge adjacent 'on' cells into rectangles to reduce box count
            function mergeRectangles(grid){
                const n = grid.length;
                const used = Array.from({length:n}, ()=>Array(n).fill(false));
                const rects = [];
                for (let y=0;y<n;y++){
                    for (let x=0;x<n;x++){
                        if (used[y][x]) continue;
                        const cell = grid[y][x];
                        const shouldCell = invert ? (cell===0) : (cell===1);
                        if (!shouldCell) continue;
                        // determine max width
                        let w = 1;
                        while (x+w < n){
                            const ok = grid[y][x+w];
                            const shouldOk = invert ? (ok===0) : (ok===1);
                            if (!shouldOk || used[y][x+w]) break;
                            w++;
                        }
                        // determine max height by checking subsequent rows have same run
                        let h = 1;
                        outer: while (y+h < n){
                            for (let xi=0; xi<w; xi++){
                                const ok = grid[y+h][x+xi];
                                const shouldOk = invert ? (ok===0) : (ok===1);
                                if (!shouldOk || used[y+h][x+xi]) break outer;
                            }
                            h++;
                        }
                        // mark used
                        for (let yy=0; yy<h; yy++) for (let xx=0; xx<w; xx++) used[y+yy][x+xx] = true;
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
                                            arr.sort((a,b)=>a.x-b.x);
                                            for (let i=0;i<arr.length-1;i++){
                                                const a = arr[i], b = arr[i+1];
                                                if (a.x + a.w === b.x && a.h===b.h && a.y===b.y){
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

            const rects = mergeRectangles(grid);
            // reuse totalSize and offsets from earlier
            for (const r of rects){
                const px = r.x * moduleSize + offsetX;
                const py = r.y * moduleSize + offsetY;
                const w = r.w * moduleSize;
                const h = r.h * moduleSize;
                addBox(px, py, w, h, baseThickness, baseThickness + moduleHeight);
            }

            // Build triangles from boxes (boxes already added via addBox)
            // Triangles are in 'triangles' array
            // For browser download we produce a binary STL (smaller)
            function normal(a,b,c){
                // Berechne Vektoren
                const ux = b[0]-a[0], uy = b[1]-a[1], uz = b[2]-a[2];
                const vx = c[0]-a[0], vy = c[1]-a[1], vz = c[2]-a[2];
                
                // Kreuzprodukt für Normale
                const nx = uy*vz - uz*vy;
                const ny = uz*vx - ux*vz;
                const nz = ux*vy - uy*vx;
                
                // Normalisierung
                const nl = Math.sqrt(nx*nx+ny*ny+nz*nz);
                if (nl === 0) return [0,0,1]; // Fallback für entartete Dreiecke
                
                return [nx/nl, ny/nl, nz/nl];
            }

            // optimize rectangles before final triangle generation (triangles already created for base and boxes, but we built boxes per rects earlier)
            // In this browser implementation, rectangles were already merged by mergeRectangles; optionally we could re-run optimize here if needed.

            // assemble binary STL
            const triCount = triangles.length;
            const buffer = new ArrayBuffer(84 + triCount * 50);
            const view = new DataView(buffer);
            // 80-byte header left as zeros
            view.setUint32(80, triCount, true);
            let off = 84;
            function writeFloat(v){ view.setFloat32(off, v, true); off += 4; }
            function writeUInt16(v){ view.setUint16(off, v, true); off += 2; }

            for (const t of triangles){
                const n = normal(t.a, t.b, t.c);
                writeFloat(n[0]); writeFloat(n[1]); writeFloat(n[2]);
                writeFloat(t.a[0]); writeFloat(t.a[1]); writeFloat(t.a[2]);
                writeFloat(t.b[0]); writeFloat(t.b[1]); writeFloat(t.b[2]);
                writeFloat(t.c[0]); writeFloat(t.c[1]); writeFloat(t.c[2]);
                writeUInt16(0);
            }

            const blob = new Blob([buffer], {type: 'application/octet-stream'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename.replace(/\.stl$/i,'') + '.stl'; a.click();
            URL.revokeObjectURL(url);
        }

        // wire up buttons
        document.getElementById('stlPreviewBtn').addEventListener('click', function(){ renderSTLPreview(); });
        document.getElementById('stlExportBtn').addEventListener('click', function(){ generateSTL(); });
    </script>
</body>
</html>