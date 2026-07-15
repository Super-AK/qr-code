# Changelog

## [3.1.0] - 2026-07-15

### Rahmen-System (wie GenQRCode)
- **Text im Rahmen** mit自由な Positionierung
- **Rahmenform**: Rechteck, Abgerundet, Kreis
- **Rahmenbreite**: 1-20px (Slider)
- **Eckenradius**: 0-50px (Slider)
- **Innenabstand**: 5-60px (Slider)
- **Rahmenfarbe**, **Hintergrundfarbe**, **Textfarbe**
- **Textgröße**: 8-32px (Slider)
- **Textposition**: oben, unten, links, rechts, herum (SVG textPath)
- **Text Abstand**: 0-30px zum QR-Code
- **Deckkraft**: 10-100% für Rahmen
- **Linien-Stil**: durchgezogen, gestrichelt, gepunktet
- **Schrift**: Fett, Kursiv
- **Text-Schatten** für besseren Kontrast auf hellem Hintergrund
- **Symbole**: ★ ● ◆ • - | ~ (8 Stück)
- SVG-Export mit allen Rahmen-Parametern

### Bugfixes
- QR-Code Generierung funktioniert jetzt zuverlässig
- Alle `borderSize` Referenzen entfernt (Element existiert nicht mehr)
- `applyBorder()` komplett neu implementiert

## [3.0.0] - 2026-07-14

### Modernisierung
- **Vite** als Build-System (Hot-Reload, optimierte Bundles)
- **TypeScript** für Typsicherheit
- **Modulare Architektur** (ES-Module statt monolithischer Datei)
- `qr-code-styling` Library für SVG-basierte QR-Codes

### Neue QR-Typen (12 Stück)
- Text, URL, E-Mail, Telefon, SMS, vCard, WiFi
- WhatsApp, Kalender, Geolokalisierung, Kryptowährung, Soziale Medien

### UI/UX
- Tab-basierte QR-Typ-Auswahl
- Einklappbare Sektionen (Accordion)
- QR-Code generiert sich bei jeder Änderung
- Beispiel-Logos (12 Stück) als Vorlagen

### Design-System
- 5 Punkt-Styles: square, rounded, dots, extra-rounded, classy
- 2 Augen-Styles: square, rounded
- Gradient als SVG linearGradient

### Export
- PNG, SVG, PDF, STL, 3MF, OBJ

## [2.2.2] - 2026-07-14

### Behoben
- Three.js Object.assign position Bug
- sampleQRMatrix findet QR-Code auch bei verstecktem Canvas
- Cache-Busting für Browser-Cache

## [2.2.0] - 2026-07-14

### Hinzugefügt
- Dark Mode mit System-Erkennung
- Live-Vorschau beim Tippen
- Logo-Upload
- Farbverlauf-Option

## [2.1.0] - 2026-07-14

### Behoben
- Labels auf QR-Code
- 3D-Vorschau (schwarzer Bildschirm)

## [2.0.0] - 2026-07-14

### Hinzugefügt
- Interaktive 3D-Vorschau (Three.js)
- Beschriftung auf QR-Code
- SVG und PDF Export
- STL mit Rahmen und Text

## [1.0.0] - 2026-07-13

### Initiale Version
- QR-Code Generierung (7 Typen)
- PNG Download
- STL Export
