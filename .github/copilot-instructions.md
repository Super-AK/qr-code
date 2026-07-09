## Kurzüberblick

Dieses Repository ist ein kleiner QR-Code-Generator mit zwei Haupt-Oberflächen: eine browser-basierte Single‑Page UI (`index.php`) und ein Node-Skript zur Erzeugung von 3D‑STL‑Dateien (`test_stl.js`). Die PHP-Datei dient hier vorwiegend als statische HTML/JS‑Hülle — die Logik läuft im Client (inline JS) oder in Node.

## Wichtige Dateien

- `index.php` — Haupt-UI: Formularelemente (`#qrType`, `#qrContent`, `#stlExportBtn`), Frontend-QR-Logik (qrcodejs/qrious via CDN), STL‑Vorschau-Canvas (`#stlPreviewCanvas`).
- `test_stl.js` — Node-Skript, nimmt QR‑Matrix (via `qrcode-generator`) und erzeugt ASCII/Binary STL (`out_qr.stl`, `out_qr_binary.stl`). Wichtige Funktionen: `generateMatrix`, `mergeRectangles`, `optimizeRectangles`, `buildSTL`.
- `package.json` — listet `qrcode-generator` als Abhängigkeit; keine npm scripts definiert.
- `test.php` — enthält eine experimentelle React-Komponente (wahrscheinlich nicht aktiv im Deployment). Behandle das als WIP/Experiment.
- `readmi.md` — einfache Strukturhinweise (Achtung: Tippfehler im Namen `readmi.md`).

## Architektur & Datenfluss (kurz)

- UI (`index.php`) nimmt Nutzereingaben, erzeugt QR im Browser (qrcodejs / qrious) und rendert Canvas/DOM.
- Für STL-Export wird die QR‑Matrix (Module) in rechteckige Blöcke verwandelt (`mergeRectangles`) und als 3D‑Boxen in eine STL‑Meshing‑Routine (`addBoxTriangles` / `buildSTL`) übersetzt. `test_stl.js` demonstriert die vollständige CLI-Erzeugung.

## Entwickler-Workflows (konkret)

- Lokales Testen der UI: PHP Built‑in‑Server reicht, z.B.:

```bash
php -S localhost:8000 -t .
# dann im Browser http://localhost:8000/index.php
```

- Node/CLI STL‑Erzeugung:

```bash
npm install
node test_stl.js
# erzeugt out_qr.stl und out_qr_binary.stl
```

- Wenn du Node-Abhängigkeiten änderst, passe `package.json` an und füge bei Bedarf ein `npm run build` Script hinzu.

## Projekt-spezifische Hinweise & Konventionen

- UI ist stark inline: Styles und Scripts sind in `index.php` enthalten. Kleine UI-Änderungen am schnellsten direkt dort vornehmen.
- IDs/Controls: Achte auf die vorhandenen DOM‑IDs (`#qrSize`, `#borderSize`, `#stlModuleSize`, `#stlInvert` usw.) — JS-Logik greift direkt darauf zu.
- STL-Parameter heißen in `test_stl.js`/UI: `moduleSize`, `moduleHeight`, `baseThickness`, `invert`. Verwende dieselben Namen, um Mapping einfach zu halten.
- `test.php` ist React-basiert — wenn Du eine SPA/Rewrite planst, kopiere/portiere nützliche Helfer (z.B. `generateQRCode`, `addLogoToCanvas`) statt komplett neu zu schreiben.

## Typische Änderungen & wo sie zu implementieren sind

- UI-Feature / Kontroll-Änderungen: `index.php` (Form + inline JS)
- STL-Optimierungen / Performance: `test_stl.js` (rechteck-Merging, triangle count)
- Bibliothek ersetzen / neue QR-Generatoren: `package.json` + `test_stl.js` (Node) und ggf. `<script>`-Tags in `index.php` (Browser)

## Beispiele (konkrete Code-Hinweise)

- Wenn du die STL-Größen vom UI an `test_stl.js` durchreichen willst, mappe `#stlModuleSize` → `moduleSize`, `#stlModuleHeight` → `moduleHeight`, `#stlBaseThickness` → `baseThickness`, `#stlInvert` → `invert`.
- Die Funktion, die die QR-Matrix im Node‑Skript liefert, heißt `generateMatrix(text, typeNumber, errorCorrectLevel)` — nützlich beim Port auf serverseitige Endpunkte.

## Contract für Änderungen (Inputs / Outputs / Fehler)

- Input: Benutzertext, Größe-Optionen, STL-Parameter.
- Output: Canvas/PNG (Client) oder `out_qr(.stl|_binary.stl)` (Node).
- Fehler-Modi: leere Inhalte → kein QR (UI zeigt Platzhalter). Beim Node‑Skript prüfe Dateirechte beim Schreiben der STL-Dateien.

## Offene / nicht-discoverbare Punkte (frag beim Maintainer)

- Soll `test.php` produktiv werden oder ist das Experiment? (kann verkleinert oder in `src/` verschoben werden)
- Möchtest du npm‑Scripts für `test_stl.js` (z.B. `npm run stl`) und ein `README.md` mit Startbefehlen? Ich kann das vorschlagen/erstellen.

---

Wenn etwas unklar ist (z.B. gewünschte Deploy‑Umgebung oder ob `test.php` produktiv genutzt wird), sag mir kurz Bescheid — ich passe die Instruktionen an oder merge sie mit bestehenden Regeln. Möchtest du, dass ich gleich ein `README.md` und ein `npm run stl` Script hinzufüge?
