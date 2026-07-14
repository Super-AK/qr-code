# QR-Code Generator v2.0

Browser-basierter QR-Code-Generator mit 3D-Vorschau, Beschriftung und STL-Export für 3D-Druck.

## Features

### QR-Codes
- **7 Typen**: Text, URL, E-Mail, Telefon, SMS, vCard (Kontakt), WiFi
- **Anpassung**: Größe (128-512px), Vorder-/Hintergrundfarbe, Fehlerkorrektur (L/M/Q/H)
- **Rahmen**: Aktivierbar mit Breite, Farbe, Radius und Gap-Abstand

### Beschriftung
- Text **auf dem QR-Code** (oben und/oder unten)
- Einstellbare Schriftgröße (8-48px), Farbe und Stil (Fett)
- Echtzeit-Vorschau beim Tippen

### Export
- **PNG**: Mit Rahmen, Gap und Beschriftung
- **SVG**: Vektorgrafik mit Beschriftung
- **PDF**: Über jsPDF (wird dynamisch geladen)
- **STL**: 3D-Druck-Format mit:
  - Base-Plate, extrudierte Module
  - Optionaler 3D-Rahmen
  - Extrudierter Beschriftungstext

### 3D-Vorschau
- Interaktive Three.js-Vorschau vor dem STL-Export
- Rotation (Maus), Zoom (Scrollrad), Pan (Rechte Maustaste)
- Kamera-Reset und Schließen-Button

## Projektstruktur

```
qr-code/
├── index.php              ← HTML-Struktur (251 Zeilen)
├── css/
│   └── style.css          ← Styles (130 Zeilen)
├── js/
│   └── app.js             ← JavaScript-Logik (644 Zeilen)
├── test_stl.js            ← Node.js STL-Testscript
├── package.json           ← npm dependencies
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── LICENSE                ← MIT
└── README.md
```

## Technologien

| Technologie | Version | Zweck |
|-------------|---------|-------|
| HTML5/CSS3 | - | Struktur & Styling |
| Vanilla JavaScript | ES6+ | Logik |
| Bootstrap | 5.3.2 | UI-Komponenten |
| Font Awesome | 6.4.0 | Icons |
| QRCode.js | 1.0.0 | QR-Generierung (Client) |
| Three.js | r128 | 3D-Vorschau |
| OrbitControls | r128 | 3D-Kamera-Steuerung |
| jsPDF | 2.5.1 | PDF-Export (dynamisch) |

## Lokales Testen

```bash
# PHP Built-in Server
php -S localhost:8000 -t .
# dann: http://localhost:8000/

# Node STL-Test (optional)
npm install
node test_stl.js
```

## Deployment

Das Projekt läuft auf einem nginx-Server mit PHP-FPM:

```
Server: apps.knutas.de
Webroot: /var/www/apps.knutas.de/
URL: http://apps.knutas.de/qr-code/
```

## Changelog

### v2.0.0 (2026-07-14)
- 3D-Vorschau mit Three.js (interaktiv)
- Beschriftung auf dem QR-Code (oben/unten)
- SVG und PDF Export
- 3D-Rahmen im STL-Export
- Extrudierter Text im STL
- Code-Aufteilung (CSS/JS ausgelagert)
- UI/UX Verbesserungen (Spinner, responsive)

### v1.0.0 (2026-07-13)
- Initiale Version
- QR-Code Generierung (Text, URL, Email, Telefon, SMS, vCard, WiFi)
- PNG Download
- STL Export für 3D-Druck
- Rahmen/Gap Einstellungen

## Lizenz

MIT License - siehe [LICENSE](LICENSE)
