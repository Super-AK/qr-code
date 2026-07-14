# QR-Code Generator v2.1

Browser-basierter QR-Code-Generator mit 3D-Vorschau, Beschriftung und STL-Export für 3D-Druck.

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/Super-AK/qr-code)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

### QR-Codes
- **7 Typen**: Text, URL, E-Mail, Telefon, SMS, vCard (Kontakt), WiFi
- **Anpassung**: Größe (128-512px), Vorder-/Hintergrundfarbe, Fehlerkorrektur (L/M/Q/H)
- **Rahmen**: Aktivierbar mit Breite, Farbe, Radius und Gap-Abstand

### Beschriftung
- Text **auf dem QR-Code** (oben und/oder unten)
- Einstellbare Schriftgröße (8-48px), Farbe und Stil (Fett)
- Echtzeit-Vorschau beim Tippen
- Labels in allen Exporten (PNG, SVG, PDF, STL)

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

## Quick Start

```bash
# PHP Built-in Server
php -S localhost:8000 -t .

# Öffnen im Browser
open http://localhost:8000/
```

## Projektstruktur

```
qr-code/
├── index.php              ← HTML-Struktur
├── css/
│   └── style.css          ← Styles
├── js/
│   └── app.js             ← JavaScript-Logik
├── test_stl.js            ← Node.js STL-Testscript
├── package.json           ← npm dependencies
├── CHANGELOG.md           ← Versionshistorie
├── CONTRIBUTING.md        ← Entwickler-Leitfaden
├── VERSION                ← Aktuelle Version
└── LICENSE                ← MIT
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

## Deployment

```
Server: apps.knutas.de
Webroot: /var/www/apps.knutas.de/
URL: http://apps.knutas.de/qr-code/
```

## Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für Details.

### v2.1.0 (2026-07-14)
- Bugfixes: Labels auf QR-Code, 3D-Vorschau
- Verbesserte Stabilität

### v2.0.0 (2026-07-14)
- 3D-Vorschau mit Three.js
- Beschriftung auf dem QR-Code
- SVG und PDF Export
- Code-Aufteilung (CSS/JS)

### v1.0.0 (2026-07-13)
- Initiale Version

## Contributing

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Entwickler-Informationen.

## Lizenz

MIT License - siehe [LICENSE](LICENSE)
