# Contributing

Vielen Dank für dein Interesse am QR-Code Generator! Hier findest du Informationen zur Entwicklung.

## Entwicklungsumgebung einrichten

```bash
# Repository klonen
git clone https://github.com/Super-AK/qr-code.git
cd qr-code

# PHP Built-in Server starten
php -S localhost:8000 -t .

# Im Browser öffnen
open http://localhost:8000/
```

## Projektstruktur

```
qr-code/
├── index.php              ← HTML-Struktur (CDN-Links, Formular, Layout)
├── css/
│   └── style.css          ← Alle Styles (CSS-Variablen, Responsive)
├── js/
│   └── app.js             ← JavaScript-Logik (QR, Labels, Export, 3D)
├── test_stl.js            ← Node.js STL-Testscript
├── package.json           ← npm dependencies
├── README.md              ← Dokumentation
├── CHANGELOG.md           ← Versionshistorie
├── CONTRIBUTING.md        ← Diese Datei
├── VERSION                ← Aktuelle Version
├── LICENSE                ← MIT Lizenz
└── .github/
    └── copilot-instructions.md
```

## Code-Style

### JavaScript
- ES5 Kompatibilität (keine Arrow-Functions, kein `let`/`const` außer bei `var`)
- Keine Frameworks (Vanilla JS)
- DOM-Elemente über `document.getElementById()` ansprechen
- Event-Listener innerhalb `DOMContentLoaded` Wrapper

### CSS
- CSS-Variablen in `:root` für Farben
- BEM-ähnliche Namensung (`.btn-generate`, `.qr-label-top`)
- Responsive mit `@media (max-width: 768px)`

### HTML
- Semantische Elements
- Bootstrap 5 Klassen für Layout
- Font Awesome Icons

## Bugfixes

1. Issue auf GitHub erstellen
2. Branch erstellen: `git checkout -b fix/bug-bezeichnung`
3. Fix implementieren
4. Testen: `php -S localhost:8000 -t .`
5. Commit mit konsekutiver Nachricht
6. Pull Request erstellen

## Features

1. Issue auf GitHub erstellen (Discussion)
2. Genehmigung abwarten
3. Branch erstellen: `git checkout -f feature/bezeichnung`
4. Feature implementieren
5. Dokumentation aktualisieren (README, CHANGELOG)
6. Pull Request erstellen

## Wichtige DOM-IDs

Beim Arbeiten an der UI beachten:

| Bereich | IDs |
|---------|-----|
| QR-Typ | `#qrType`, `#qrContent` |
| Größe/Farbe | `#qrSize`, `#qrColorDark`, `#qrColorLight` |
| Rahmen | `#borderEnable`, `#borderSize`, `#borderColor`, `#borderRadius` |
| Gap | `#gapSize`, `#gapColor` |
| Labels | `#labelTopEnable`, `#labelTopText`, `#labelBottomEnable`, `#labelBottomText` |
| STL | `#stlModuleSize`, `#stlModuleHeight`, `#stlBaseThickness`, `#stlInvert` |
| 3D | `#stlFrame3D`, `#stlFrameHeight`, `#stlTextHeight` |
| Export | `#downloadBtn`, `#svgDownloadBtn`, `#pdfDownloadBtn`, `#stlExportBtn` |

## Testing

- Manuell im Browser testen (Chrome, Firefox, Edge)
- QR-Codes mit verschiedenen Inhalten generieren
- Alle Export-Formate prüfen (PNG, SVG, PDF, STL)
- 3D-Vorschau mit verschiedenen Parametern testen
- Responsive auf verschiedenen Bildschirmgrößen prüfen

## Lizenz

Mit deinen Beiträgst stimmst du der MIT Lizenz zu.
