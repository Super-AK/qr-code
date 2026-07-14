<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR-Code Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
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

                            <div class="label-options">
                                <h5 class="mb-3"><i class="fas fa-tag"></i> Beschriftung</h5>
                                <div class="label-row">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="labelTopEnable">
                                        <label class="form-check-label small" for="labelTopEnable">Oben</label>
                                    </div>
                                    <input type="text" class="form-control form-control-sm" id="labelTopText" placeholder="Text über dem QR-Code">
                                </div>
                                <div class="label-row">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="labelBottomEnable">
                                        <label class="form-check-label small" for="labelBottomEnable">Unten</label>
                                    </div>
                                    <input type="text" class="form-control form-control-sm" id="labelBottomText" placeholder="Text unter dem QR-Code">
                                </div>
                                <div class="d-flex gap-3 mt-2">
                                    <div style="flex:1">
                                        <label class="form-label small">Schriftgröße: <span id="labelSizeValue">16</span>px</label>
                                        <input type="range" class="form-range" id="labelSize" min="8" max="48" step="2" value="16">
                                    </div>
                                    <div style="flex:1">
                                        <label class="form-label small">Schriftfarbe</label>
                                        <input type="color" id="labelColor" class="form-control form-control-sm" value="#213547">
                                    </div>
                                    <div class="form-check d-flex align-items-end">
                                        <input class="form-check-input" type="checkbox" id="labelBold">
                                        <label class="form-check-label small ms-1" for="labelBold">Fett</label>
                                    </div>
                                </div>
                            </div>

                            <div class="d-grid mt-4">
                                <button type="submit" class="btn btn-generate">
                                    <i class="fas fa-magic"></i> QR-Code Generieren
                                </button>
                            </div>

                            <div class="mt-3">
                                <h6 class="mb-2">STL-Export (3D-Druck)</h6>
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
                                    <div class="col-12">
                                        <label class="form-label small">Dateiname</label>
                                        <input type="text" id="stlFilename" class="form-control" value="qrcode.stl">
                                    </div>
                                    <div class="col-6">
                                        <div class="form-check mt-2">
                                            <input class="form-check-input" type="checkbox" id="stlFrame3D" checked>
                                            <label class="form-check-label small" for="stlFrame3D">Rahmen im 3D</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label small">Rahmenhöhe (mm)</label>
                                        <input type="number" id="stlFrameHeight" class="form-control" value="2.0" step="0.1">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label small">Text-Höhe (mm)</label>
                                        <input type="number" id="stlTextHeight" class="form-control" value="1.0" step="0.1">
                                    </div>
                                    <div class="col-6 d-grid">
                                        <label class="form-label small">&nbsp;</label>
                                        <button id="stlPreviewBtn" type="button" class="btn btn-outline-secondary">
                                            <i class="fas fa-cube"></i> 3D Vorschau
                                        </button>
                                    </div>
                                    <div class="col-12 mt-2 d-grid">
                                        <button id="stlExportBtn" type="button" class="btn btn-primary">
                                            <i class="fas fa-download"></i> Export STL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="col-lg-6">
                        <div class="qr-result" style="position:relative;">
                            <div id="qrSpinner" class="spinner-overlay">
                                <div class="spinner"></div>
                            </div>
                            <div id="qrPlaceholder" class="qr-placeholder">
                                <i class="fas fa-qrcode fa-5x mb-3"></i>
                                <p>Ihr QR-Code wird hier angezeigt</p>
                            </div>
                            <div id="qrCodeWrapper" style="position:relative;display:inline-block;">
                                <div id="labelTop" class="qr-label qr-label-top" style="display:none;"></div>
                            <div id="qrcode-outer" style="display:inline-block;">
                                <div id="qrcode"></div>
                            </div>
                            <div id="labelBottom" class="qr-label qr-label-bottom" style="display:none;"></div>
                            </div>
                            <div class="export-buttons" id="exportBtns" style="display:none;">
                                <button id="downloadBtn" class="btn btn-download">
                                    <i class="fas fa-download"></i> PNG
                                </button>
                                <button id="svgDownloadBtn" class="btn btn-export">
                                    <i class="fas fa-file-code"></i> SVG
                                </button>
                                <button id="pdfDownloadBtn" class="btn btn-export">
                                    <i class="fas fa-file-pdf"></i> PDF
                                </button>
                            </div>
                            <div id="stlPreviewContainer">
                                <div class="stl-controls">
                                    <button id="stlResetCamera" type="button" class="btn" title="Kamera zurücksetzen">
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                    <button id="stlClosePreview" type="button" class="btn" title="Vorschau schließen">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
