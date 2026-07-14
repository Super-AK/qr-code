## Kurzüberblick

QR-Code-Generator v2.0 — browser-basierte Single-Page UI mit 3D-Vorschau und STL-Export für 3D-Druck.

## Wichtige Dateien

- `index.php` — HTML-Struktur (251 Zeilen). Enthält CDN-Links für Bootstrap, Font Awesome, Three.js, OrbitControls.
- `css/style.css` — Alle Styles (130 Zeilen).
- `js/app.js` — JavaScript-Logik (644 Zeilen). QR-Generierung, Labels, PNG/SVG/PDF-Export, Three.js 3D-Vorschau, STL-Export.
- `test_stl.js` — Node.js STL-Testscript (unverändert).
- `package.json` — Version 2.0.0, dependency: qrcode-generator.

## Architektur

- UI ist in 3 Dateien aufgeteilt: HTML (`index.php`), CSS (`css/style.css`), JS (`js/app.js`)
- QR-Generierung komplett clientseitig via QRCode.js (CDN)
- 3D-Vorschau via Three.js r128 + OrbitControls (CDN)
- PDF-Export via jsPDF (wird dynamisch bei Bedarf geladen)
- STL-Export als Binärformat (ArrayBuffer)

## DOM-IDs (Wichtig für Änderungen)

- QR: `#qrType`, `#qrContent`, `#qrSize`, `#qrColorDark`, `#qrColorLight`, `#qrErrorLevel`
- Border: `#borderEnable`, `#borderSize`, `#borderColor`, `#borderRadius`, `#gapSize`, `#gapColor`
- Labels: `#labelTopEnable`, `#labelTopText`, `#labelBottomEnable`, `#labelBottomText`, `#labelSize`, `#labelColor`, `#labelBold`
- STL: `#stlModuleSize`, `#stlModuleHeight`, `#stlBaseThickness`, `#stlInvert`, `#stlFrame3D`, `#stlFrameHeight`, `#stlTextHeight`
- Export: `#downloadBtn` (PNG), `#svgDownloadBtn`, `#pdfDownloadBtn`, `#stlExportBtn`
- 3D: `#stlPreviewBtn`, `#stlPreviewContainer`, `#stlResetCamera`, `#stlClosePreview`

## Entwicklung

```bash
php -S localhost:8000 -t .
# http://localhost:8000/
```

## Labels

Labels werden AUF dem QR-Code angezeigt (position: absolute innerhalb `#qrCodeWrapper`). Die `updateLabels()` Funktion wird bei jeder Eingabe/Checkbox-Änderung aufgerufen.

## 3D-Vorschau

Three.js Szene in `renderSTLPreview3D()`. Wichtig: `threeScene` wird NACH `animate()` gesetzt (nicht davor). Camera-Position: `(maxDim, maxDim*0.8, maxDim*0.9)`.
