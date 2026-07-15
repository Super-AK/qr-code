# QR-Code Generator v3.1

Professioneller QR-Code-Generator mit Rahmen-System, Design-Optionen und 3D-Export.

## Features

### QR-Codes (12 Typen)
- Text, URL, E-Mail, Telefon, SMS, vCard, WiFi
- WhatsApp, Kalender, Geolokalisierung, Kryptowährung, Soziale Medien

### Design
- **5 Punkt-Styles**: Square, Rounded, Dots, Extra-Rounded, Classy
- **2 Augen-Styles**: Square, Rounded
- **Gradient**: Horizontal, Vertikal, Diagonal
- **Logo**: 12 Beispiel-Logos + eigener Upload
- **Farben**: Vordergrund, Hintergrund, separate Augen-Farben

### Rahmen (wie GenQRCode)
- **Text im Rahmen** mit freier Positionierung
- **Rahmenform**: Rechteck, Abgerundet, Kreis
- **Parameter**: Breite, Eckenradius, Innenabstand, Textgröße
- **Textposition**: oben, unten, links, rechts, herum
- **Linien-Stil**: durchgezogen, gestrichelt, gepunktet
- **Schrift**: Fett, Kursiv, Text-Schatten
- **Symbole**: ★ ● ◆ • - | ~

### Export (6 Formate)
- PNG, SVG, PDF, STL, 3MF, OBJ

### 3D-Vorschau
- Interaktive Three.js-Vorschau
- OrbitControls (Rotation, Zoom, Pan)

### UI/UX
- Tab-basierte QR-Typ-Auswahl
- Einklappbare Sektionen
- Auto-Regeneration bei jeder Änderung
- Dark Mode (System-Erkennung)
- Responsive Design

## Quick Start

```bash
# Development
npm run dev

# Production Build
npm run build

# TypeScript prüfen
npm run typecheck
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
│   │   └── qr-stl.ts        ← STL/3MF/OBJ Export
│   └── styles/
│       └── main.css         ← Alle Styles
├── index.html               ← Entry HTML
├── vite.config.ts           ← Vite-Konfiguration
├── tsconfig.json            ← TypeScript-Konfiguration
├── package.json
└── README.md
```

## Technologien

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Vite | 6.0 | Build-System |
| TypeScript | 5.5 | Typsicherheit |
| Three.js | 0.170 | 3D-Vorschau |
| Bootstrap | 5.3.2 | UI-Komponenten |
| qr-code-styling | 1.5 | SVG-basierte QR-Codes |

## License

MIT License
