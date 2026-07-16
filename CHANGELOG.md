# Changelog

## [3.3.0] - 2026-07-15

### 3D-Vorschau (Three.js)
- Interaktive 3D-Szene mit OrbitControls
- Rotation, Zoom, Pan mit Maus
- Beleuchtung (Ambient + Hemisphere + 2x Directional)
- Base-Plate + extrudierte Module sichtbar
- Kamera-Reset und Schließen-Button
- QR-Matrix wird zuverlässig erkannt (4 Methoden)

### 3D-Rahmen im STL
- 4 Wände um den QR-Code herum
- Rahmenbreite (1-20mm) einstellbar
- Rahmenhöhe einstellbar
- Rahmen Innenabstand (0-10mm)

### STL/3D Export korrigiert
- 3D-Vorschau und Export entsprechen jetzt dem QR-Code
- Kein Mismatch zwischen angezeigtem und exportiertem QR-Code
- sampleQRMatrix() nutzt QRCode.js mit gleichen Parametern

### Bugfixes
- Object.assign mit Three.js Position (read-only) → .position.set()
- stlModuleHeight Input im HTML hinzugefügt
- stlInvert Input im HTML hinzugefügt
- STL-Frame Elemente im HTML hinzugefügt
- Three.js CDN-Links wiederhergestellt

## [3.2.0] - 2026-07-15

### Magnetlöcher für STL-Export
- Magnet-Typ: keine, rund, quadratisch
- Magnet-Anzahl: 2, 3, 4
- Magnet-Durchmesser: 2-20mm
- Magnet-Tiefe: 0.5-10mm

### Fehlerbehandlung und Validierung
- E-Mail Validierung (Regex)
- URL Validierung (URL API)
- Telefon Validierung (Regex)
- Benutzerfreundliche Fehlermeldungen

## [3.1.0] - 2026-07-15

### Rahmen-System (wie GenQRCode)
- Text im Rahmen mit 5 Positionen
- Rahmenform, Breite, Eckenradius, Innenabstand
- 8 Symbole
- Linien-Stil, Schrift, Text-Schatten
- Deckkraft, Text-Abstand

### Drag & Drop
- Logo per Drag & Drop hochladen

### Responsive
- Mobile, Tablet, Small Phones optimiert

### Einbettungs-Code
- HTML, Markdown, iframe Embed-Codes
- Copy-to-Clipboard

## [3.0.0] - 2026-07-14

### Modernisierung
- Vite + TypeScript + modulare Architektur
- 12 QR-Typen
- Design-System (qr-code-styling)
- STL/3MF/OBJ Export
- Dark Mode, Auto-Regeneration
