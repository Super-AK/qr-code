# QR-Code Generator v3.3

Professioneller QR-Code-Generator mit Rahmen-System, 3D-Vorschau und STL-Export.

## Features

### QR-Codes (12 Typen)
- Text, URL, E-Mail, Telefon, SMS, vCard, WiFi
- WhatsApp, Kalender, Geolokalisierung, Kryptowährung, Soziale Medien

### Design
- **5 Punkt-Styles**: Square, Rounded, Dots, Extra-Rounded, Classy
- **2 Augen-Styles**: Square, Rounded
- **Gradient**: Horizontal, Vertikal, Diagonal
- **Logo**: 12 Beispiel-Logos + Drag & Drop Upload

### Rahmen (wie GenQRCode)
- **Text im Rahmen** mit freier Positionierung (oben/unten/links/rechts/herum)
- **Rahmenform**: Rechteck, Abgerundet, Kreis
- **Parameter**: Breite, Eckenradius, Innenabstand, Textgröße
- **Linien-Stil**: durchgezogen, gestrichelt, gepunktet
- **Schrift**: Fett, Kursiv, Text-Schatten
- **8 Symbole**: ★ ● ◆ • - | ~

### 3D-Vorschau (Three.js)
- Interaktive 3D-Szene mit Maus-Rotation
- Zoom und Pan
- Base-Plate + extrudierte Module
- 3D-Rahmen (4 Wände)

### Export (6 Formate)
- PNG, SVG, PDF, STL, 3MF, OBJ

### STL-Optionen
- Modulgröße, Modulhöhe, Basisdicke
- Invert-Modus
- 3D-Rahmen (Breite, Höhe, Innenabstand)
- Magnetlöcher (rund/quadratisch, 2-4 Stück)

### UI/UX
- Tab-basierte QR-Typ-Auswahl
- Einklappbare Sektionen (Accordion)
- Auto-Regeneration bei jeder Änderung
- Drag & Drop Logo-Upload
- 12 Beispiel-Logos
- Dark Mode (System-Erkennung)
- Responsive (Mobile, Tablet, Small Phones)
- Einbettungs-Code (HTML, Markdown, iframe)
- Live-Vorschau

## Quick Start

```bash
npm run dev       # Development Server
npm run build     # Production Build
npm run typecheck # TypeScript prüfen
```

## Projektstruktur

```
qr-code/
├── src/
│   ├── main.ts              ← Entry Point
│   ├── types.ts             ← TypeScript-Typdefinitionen
│   ├── modules/
│   │   ├── qr-types.ts      ← QR-Typen & Formate
│   │   ├── qr-design.ts     ← Design-System (qr-code-styling)
│   │   └── qr-stl.ts        ← STL/3MF/OBJ Export + Matrix-Sampling
│   └── styles/
│       └── main.css         ← Alle Styles
├── index.html               ← Entry HTML
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## License

MIT License
