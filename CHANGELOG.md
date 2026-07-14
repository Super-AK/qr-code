# Changelog

Alle wichtigen Änderungen werden in dieser Datei dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

## [2.1.0] - 2026-07-14

### Behoben
- **Labels auf QR-Code**: Positionierung von `position: absolute` auf `relative` mit Flexbox umgestellt. Labels erscheinen jetzt zuverlässig auf dem QR-Code.
- **3D-Vorschau schwarzer Bildschirm**: 
  - CSS `!important` für Canvas-Größe entfernt
  - `THREE.OrbitControls` Guard hinzugefügt (CDN-Fehler Abfang)
  - `alpha: true` für transparenten Hintergrund
  - `threeScene` Object speichert jetzt `camera`, `scene`, `renderer`, `controls`
  - `stlResetCamera` Funktioniert jetzt (kein TypeError mehr)
  - Doppelte Event-Listener entfernt
  - Memory Leak bei Dispose behoben (Animation wird korrekt gestoppt)
- **vCard QR-Code**: Generierung funktioniert jetzt korrekt
- **Gap-Slider**: Live-Update des angezeigten Werts
- **Download-Button**: Farbe lesbar (dunkler Text auf hellem Hintergrund)

### Geändert
- CSS: Labels nutzen `position: relative` + Flexbox `order` statt `position: absolute`
- CSS: 3D-Preview Canvas ohne `!important` Override
- JS: `renderSTLPreview3D()` komplett überarbeitet mit besserer Fehlerbehandlung
- JS: Alle Event-Listener innerhalb `DOMContentLoaded` Wrapper

## [2.0.0] - 2026-07-14

### Hinzugefügt
- Interaktive 3D-Vorschau mit Three.js (OrbitControls)
- Beschriftung auf dem QR-Code (oben/unten, Schriftgröße, Farbe, Fett)
- SVG Export
- PDF Export (via jsPDF)
- 3D-Rahmen im STL-Export
- Extrudierter Text im STL
- Ladeindikator (Spinner) während QR-Generierung

### Geändert
- Code aufgeteilt: `index.php`, `css/style.css`, `js/app.js`
- UI/UX Verbesserungen (responsives Layout)

### Entfernt
- `test.php` (experimentelle React-Komponente)
- `readmi.md` (veraltete Dokumentation)

## [1.0.0] - 2026-07-13

### Hinzugefügt
- Initiale Version
- QR-Code Generierung (Text, URL, E-Mail, Telefon, SMS, vCard, WiFi)
- PNG Download
- STL Export für 3D-Druck
- Rahmen/Gap Einstellungen
- Fehlerkorrektur-Optionen (L/M/Q/H)
