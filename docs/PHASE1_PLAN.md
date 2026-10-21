# Pergola-Konfigurator CG Atelier – Phase 1: Plan

Stand: 21.10.2026 · Status: **wartet auf „OK“ oder Änderungen** · Noch kein Code.

---

## 1. Ziel in 3 Sätzen

Besucher aus Website-, Meta- und Google-Traffic stellen ihre Pergola in rund zwei Minuten selbst zusammen, sehen sie maßstabsgetreu in 3D auf ihrer Terrasse und kennen live den Preisrahmen.
Kontaktdaten kosten erst das detaillierte Richtangebot oder der Showroom-Termin in Tarchamps. So bleibt die Hürde niedrig und jeder Lead kommt mit Maßen, Modell, Optionen, Budget, Ort und Zeitrahmen an.
Das Ganze ist eine einzelne, eigenständige `index.html` (per Link oder iframe einzubinden, ohne Eingriff in die MUM-Website). Jeder Schritt wird getrackt, damit Kampagnen auf echte Leads statt auf Klicks optimiert werden können.

---

## 2. Informationsarchitektur

Globale Elemente (immer sichtbar):

| Element | Inhalt |
|---|---|
| Kopfzeile | Logo-Platzhalter „CG Atelier“, Fortschrittsbalken (8 Segmente, klickbar für bereits besuchte Schritte), Sprachumschalter FR/DE |
| 3D-Overlay | Tag/Abend-Umschalter, Regler „Lamellen öffnen“ (nur bioklimatisch) bzw. „Dach ausfahren“ (nur ausfahrbar), Hinweis „Ziehen zum Drehen“ (verschwindet nach erster Interaktion) |
| Preisleiste | „ca. 23.500 – 28.000 €“ (animiert, 400 ms), Kleintext „Richtpreis inkl. Montage und MwSt. Verbindliches Angebot nach kostenlosem Aufmaß.“, Buttons „Zurück“ (Text) und „Weiter“ (primär) |

Ab Schritt 3 lautet die Ansprache „Ihre Pergola“ (Besitztumseffekt).

### Schritte

| # | Titel (DE) | Felder | Standard | Abhängigkeiten / Regeln |
|---|---|---|---|---|
| 1 | Wofür wünschen Sie sich Ihre Pergola? | 4 Karten: Wohnzimmer draußen · Sonnenschutz · Ganzjährig nutzen · Pool oder Jacuzzi | keine Auswahl | Tippen wählt und springt nach 250 ms automatisch weiter (Mikro-Ja). Setzt `recommended`: Wohnzimmer → **Twist**, Sonnenschutz → **Joy**, Ganzjährig → **Varia** (+ Glas-Schiebewände in Schritt 6 vorbelegt), Pool → **Twist** (+ Montage „freistehend“ vorbelegt, Lamellen lüften Feuchtigkeit ab). Solange `model` vom Nutzer nicht aktiv gewählt wurde, folgt es der Empfehlung. |
| 2 | Wo soll sie stehen? | 2 Karten: An der Hauswand · Freistehend | Hauswand (bei Pool: freistehend) | Auto-Weiter. Ändert Grenzen (Varia), Seitenanzahl (3/4), +1.200 € bei freistehend, 3D-Hauswand ein/aus. |
| 3 | Wie groß soll Ihre Pergola werden? | Breite: Slider + Zahlenfeld (cm, Schritt 10), Tiefe: dito, Fläche m² live | 400 × 300 cm | Grenzen aus `model` × `mount` (Tabelle unten). Eingabe außerhalb → auf Grenze gesetzt + Meldung „Größer? Wir koppeln zwei Module – sprechen Sie uns an.“ plus Vorschlag eines Modells, das passt („Markilux pergola stretch: bis 7 × 7 m“). 3D zeigt Maßketten „4,00 m“. |
| 4 | Welches Dach passt zu Ihnen? | Segment: Bioklimatisch · Glasdach · Ausfahrbar; darunter Modellkarten (Marke, Name, 1 Satz Nutzen, „ab“-Preis für aktuelle Maße) | Typ + Modell der Empfehlung, Badge „Empfohlen für Sie“ | Karte eines Modells, dessen Grenzen die aktuellen Maße nicht zulassen: bleibt wählbar, Hinweis „passt bis 4,50 m – Maße werden angepasst“. Beim Wechsel auf Nicht-Solar-Modell wird `solar` auf false gesetzt (Toast). Beim Betreten mit Lamellenmodell fahren die Lamellen einmal auf und zu (Wow-Moment, 1× pro Sitzung). |
| 5 | Ihre Farbe | Chips „Struktur“ und „Lamellen / Dach“ getrennt: Anthrazit RAL 7016 · Weiß RAL 9016 · Grau RAL 9007 · Sand/Bronze · Sonderfarbe (RAL-Feld, optional) | beide 7016 | Zweite Chipreihe heißt bei Glasdach „Sprossen“, bei ausfahrbar „Tuch“ (Tuchfarben: Anthrazit, Weiß, Grau, Sand; keine Sonderfarbe). Sonderfarbe → +6 % auf Grundpreis + Fläche. |
| 6 | Wie offen soll sie sein? | Pro Seite: Offen · ZIP-Screen · Glas-Schiebewand (Segmentschalter mit Seitenlänge in m), zusätzlich Klick auf Seite im 3D | alle offen (bei „Ganzjährig“ alle Glas) | Wandanbau: Links, Vorne, Rechts. Freistehend: Vorne, Hinten, Links, Rechts. Erklärzeile: „ZIP-Screen = windfester, senkrechter Stoff, der per Knopfdruck herunterfährt.“ Bei Varia Zusatz „unsichtbar im Profil integriert“. |
| 7 | Mehr Komfort | Schalter: LED · Wind-/Regensensor · Smart Home (Gibus Connect) · Solar-Lamellen; Stepper Heizstrahler 0–4; nur TS Lamellendach + Wand: Glas-Lichtband | alles aus, 0 Heizer | Solar nur bei Twist/Varia aktiv, sonst ausgegraut mit Hinweis „Nur bei Gibus Twist und Varia“. Szene schaltet auf Abend, damit LED/Heizer sichtbar werden. |
| 8 | Ihre Pergola | Zusammenfassung (je Zeile „Ändern“ → springt in den Schritt), große Preisspanne, 3 Referenzkarten (Grosbous, Eschweiler, Wiltz), Vertrauenszeile, Google-Bewertungs-Platzhalter, Gibus-Atelier-Siegel-Platzhalter. CTA primär „Richtangebot per E-Mail erhalten“, sekundär „Showroom-Termin in Tarchamps“, Link „Konfiguration teilen/merken“ | – | Beide CTAs öffnen dasselbe Formular, Showroom-Variante mit optionalem Wunschtermin. |
| – | Formular | Vorname*, E-Mail*, Telefon, PLZ/Ort*, Land* (LU/BE), Zeitrahmen* (sofort / in 3 Monaten / später), Kontaktweg (E-Mail/Telefon/WhatsApp), [Showroom: Wunschtermin Werktag vormittags / nachmittags / Samstag], Einwilligung DSGVO* | Land LU | Inline-Validierung beim Verlassen des Feldes, E-Mail-Regex, PLZ: LU 4-stellig (optional „L-“), BE 4-stellig. Button erst aktiv bei gültigen Pflichtfeldern? Nein: immer aktiv, Fehler werden beim Klick gesammelt angezeigt (bessere Zugänglichkeit). |
| 9 | Danke | Zusammenfassung, „CG Atelier meldet sich innerhalb von 24 h“, Adresse Showroom, Link zur gespeicherten Konfiguration | – | Löst `lead_quote` bzw. `lead_showroom` aus. |

### Modelle und Maßgrenzen (cm)

| Key | Typ | Modell | Wand B × T | Frei B × T | Lamellen max | Solar | Pfosten frei |
|---|---|---|---|---|---|---|---|
| joy | bio | Gibus Joy | 200–450 × 200–500 | 200–450 × 200–500 | 120° | nein | 4 |
| twist | bio | Gibus Twist | 200–500 × 200–600 | 200–500 × 200–600 | 120° | ja | 4 |
| varia | bio | Gibus Varia | 200–600 × 200–450 | 200–450 × 200–720 | 135° | ja | 4, ab T > 620: 6 |
| ts_lamellen | bio | TS Aluminium Lamellendach | 200–600 × 200–500 | 200–600 × 200–500 | 120° (Ann.) | nein | 4 |
| ts_glas | glass | TS Aluminium Glas-Terrassendach | 200–700 × 200–500 | 200–700 × 200–500 | – | nein | 4 |
| medroom | retract | Gibus Med Room | 200–600 × 200–600 | 200–600 × 200–600 | – | nein | 4 |
| stretch | retract | Markilux pergola stretch | 200–700 × 200–700 | 200–700 × 200–700 | – | nein | 4 |

Allgemeine Pfostenregel (außer Varia): ein zusätzliches Pfostenpaar, sobald eine Spannweite > 450 cm ist (Breite → Mittelpfosten vorne/hinten, Tiefe → Mittelpfosten links/rechts). Wandanbau: Pfosten nur vorne, hinten trägt der Wandträger.

---

## 3. Datenmodell

### state (einzige Wahrheit, jede Änderung über `setState(patch)` → `render()`)

```js
const state = {
  v: 1,                       // Schema-Version für Hash/Lead
  lang: 'fr',                 // 'fr' | 'de'
  step: 1,                    // 1–8, 9 = Danke
  maxStep: 1,                 // weitester besuchter Schritt (Fortschrittsbalken klickbar)
  purpose: null,              // 'living' | 'sun' | 'yearround' | 'pool'
  mount: 'wall',              // 'wall' | 'free'
  width: 400, depth: 300,     // cm
  roofType: 'bio',            // 'bio' | 'glass' | 'retract'
  model: 'varia',             // Key aus MODELS
  recommended: 'varia',
  modelTouched: false,        // true, sobald Nutzer in Schritt 4 aktiv wählt
  colorFrame: 'ral7016',      // 'ral7016'|'ral9016'|'ral9007'|'sand'|'custom'
  colorRoof:  'ral7016',
  customRal: '',              // z. B. 'RAL 8019'
  sides: { front:'open', left:'open', right:'open', back:'open' }, // 'open'|'zip'|'glass'; back nur frei
  sidesTouched: false,
  options: { led:false, heaters:0, sensor:false, smarthome:false, solar:false, lightband:false },
  view: { louver: 0, roofExtend: 1, night: false }, // nur Darstellung, nicht im Preis
  ui: { toast:null, errors:{}, formMode:null },      // 'quote'|'showroom'
  lead: { firstName:'', email:'', phone:'', zipCity:'', country:'LU',
          timeframe:'', contactPref:'email', slot:'', consent:false },
  utm: {}                     // beim Start aus URL gelesen
};
```

**URL-Hash** (nur Konfiguration, nie Kontaktdaten), lesbar und kurz:
`#p=yearround&m=wall&w=400&d=300&mo=varia&cf=ral7016&cr=ral7016&s=front:glass,left:zip,right:zip&led=1&h=2&se=1&sh=0&so=0&lb=0&st=6`
Wird bei jeder Änderung per `history.replaceState` aktualisiert (kein Verlaufsspam), beim Laden validiert (Clamp auf Grenzen, unbekannte Werte → Standard).

### Lead-JSON (POST an `WEBHOOK_URL`, Demo: `console.log`)

```json
{
  "schema": "cg-pergola-lead/1",
  "type": "quote",                       // "quote" | "showroom"
  "createdAt": "2026-10-23T09:14:02.000Z",
  "lang": "fr",
  "contact": {
    "firstName": "Marie", "email": "marie@example.lu", "phone": "+352 621 000 000",
    "zipCity": "9573 Wiltz", "country": "LU",
    "timeframe": "3m", "contactPref": "phone", "showroomSlot": null,
    "consent": true, "consentText": "J'accepte que CG Atelier …"
  },
  "configuration": {
    "purpose": "yearround",
    "mount": "wall",
    "roofType": "bio",
    "model": { "key": "varia", "brand": "Gibus", "name": "Varia" },
    "recommendedModel": "varia",
    "dimensions": { "widthCm": 400, "depthCm": 300, "areaM2": 12, "heightCm": 240, "posts": 2 },
    "colors": { "frame": "RAL 7016", "roof": "RAL 7016", "custom": null },
    "sides": [
      { "side": "left",  "lengthM": 3, "type": "zip" },
      { "side": "front", "lengthM": 4, "type": "open" },
      { "side": "right", "lengthM": 3, "type": "zip" }
    ],
    "options": { "led": true, "heaters": 0, "sensor": true, "smarthome": false, "solar": false, "lightband": false }
  },
  "price": {
    "currency": "EUR",
    "total": 25650, "low": 23500, "high": 28000,
    "display": "ca. 23.500 – 28.000 €",
    "breakdown": [
      { "item": "base", "amount": 4500 }, { "item": "area", "amount": 15000 },
      { "item": "zip", "amount": 2700 }, { "item": "led", "amount": 1200 },
      { "item": "sensor", "amount": 450 }, { "item": "install", "amount": 1800 }
    ],
    "pricesVersion": "demo-placeholder"
  },
  "tracking": {
    "utm_source": "facebook", "utm_medium": "paid", "utm_campaign": "pergola_lu_q4",
    "utm_content": null, "utm_term": null, "gclid": null, "fbclid": "…",
    "referrer": "https://www.cgatelier.lu/", "landing": "https://…/index.html?utm_source=…"
  },
  "shareUrl": "https://…/index.html#p=yearround&m=wall&…"
}
```

---

## 4. 3D-Plan

### Szenengraph (1 Einheit = 1 m, y oben, Hauswand bei z = 0, Pergola wächst nach +z, Breite entlang x, zentriert)

```
Scene
├─ Sky                  große Kugel (BackSide), ShaderMaterial Gradient, Uniforms tag/abend
├─ Lights
│  ├─ HemisphereLight   Himmel/Boden-Fülllicht
│  └─ DirectionalLight  Sonne, castShadow, Map 1024, Schattenkamera eng auf Pergola-Bounds
├─ Environment
│  ├─ Lawn              Plane 40×40, grünes Standardmaterial, leichte Canvas-Noise-Textur
│  ├─ Terrace           Box (Pergola + 1 m Rand), Canvas-Textur Holzdielen bzw. Großformatfliesen, receiveShadow
│  └─ House (nur Wand)  Putz-Box 12 × 4,5 m, Canvas-Putztextur; Glasschiebetür 3,2 × 2,4 m mit Alu-Rahmen; Fensterbank
├─ Pergola (Group, wird bei Struktur-Änderung neu gebaut)
│  ├─ Posts             BoxGeometry 0,13 × 2,40 × 0,13 (Varia/Twist 0,15), Anzahl nach Regel aus §2
│  ├─ Frame             4 (frei) bzw. 3 + Wandträger Boxen, Höhe 0,25 m, umlaufend
│  ├─ Roof (je Typ)
│  │  ├─ bio:     InstancedMesh Lamellen (Profil 0,20 × 0,035, Abstand 0,20 m, Länge = Breite), Pivot je Lamelle mittig, Rotation x
│  │  │           Solar: Lamellen-Oberseite dunkelblaues Zellraster (Canvas-Textur), Unterseite Strukturfarbe
│  │  │           TS + Lichtband: 0,6 m Glasstreifen an der Wand
│  │  ├─ glass:   Glasplatten (MeshPhysicalMaterial, transmission-frei → opacity 0,25 + envMap), Gefälle 3°, Sprossen alle ~0,9 m
│  │  └─ retract: Führungsschienen links/rechts, Stoffbahn (Plane, leicht durchhängend per Vertex-Offset), Querprofile alle 0,5 m,
│  │              Stoff + Profile skaliert mit view.roofExtend (0 = gerafft an der Wand/hinten, 1 = ganz ausgefahren)
│  ├─ Sides (je Seite eine Group)
│  │  ├─ HitBox         unsichtbare Plane für Raycast (Schritt 6), Hover = dezenter Akzent-Umriss
│  │  ├─ ZIP            Kassette oben, Stoff-Plane (opacity 0,85, Lochmuster-Textur), Fallstab; scale.y animiert 0 → 1 (700 ms)
│  │  └─ Glass          2–4 Schiebeelemente (je ≤ 1,2 m), dünne Rahmen, Glas mit envMap-Reflexion, fährt beim Aktivieren auf (500 ms Fade + Slide)
│  ├─ LED               schmale emissive Leisten innen am Rahmen + 2 PointLights (warm 2700 K, ohne Schatten), nur abends sichtbar hell
│  └─ Heaters           0–4 Geräte an Rahmen-Innenseite, Heizstab emissive orange + 1 gemeinsames PointLight, Glühen nur abends voll
└─ Dimensions           2 Maßketten (Linie + Endstriche) + Sprite-Labels aus CanvasTexture („4,00 m“), nur Schritt 3
```

Glas-Reflexion: `PMREMGenerator` + `RoomEnvironment` einmalig als `scene.environment` (kein externes HDR).

### Abbildung state → Geometrie

| Änderung | Aktion | Kosten |
|---|---|---|
| width, depth, mount, model, roofType | `buildPergola()` neu (alte Geometrien `dispose()`), Terrasse/Haus anpassen, Schattenkamera neu einpassen | < 5 ms |
| Farben | nur `material.color.set()` auf geteilten Materialien (Struktur, Lamellen/Dach) | < 1 ms |
| sides | nur betroffene Seitengruppe ein/aus + Animation starten | < 1 ms |
| options | Sichtbarkeit LED/Heizer/Solar-Textur | < 1 ms |
| view.louver / roofExtend / night | Ziel-Wert setzen, Tween im Loop | – |

Materialien: Pulverbeschichtung = `MeshStandardMaterial` roughness 0,55, metalness 0,35. Farbtabelle: 7016 `#383E42`, 9016 `#F1F0EA`, 9007 `#878581`, Sand/Bronze `#8C7A63`, Sonderfarbe Vorschau `#6E5A4B` (Platzhalter, Hinweis „Farbe nach RAL-Fächer im Showroom“).

### Animationen

- Mini-Tween-Engine im Render-Loop (eigene ~30 Zeilen, easeInOutCubic), keine Zusatzbibliothek.
- Lamellen: `view.louver` 0 → Modellmaximum, Regler live; Schritt 4: einmal 0 → max → 0 in 2,8 s.
- ZIP: Herunterfahren 700 ms; Glas: 500 ms; Tuchdach: Regler „Dach ausfahren“.
- Preis: Zahl zählt in 400 ms (requestAnimationFrame, easeOut) von alt zu neu.
- Tag/Abend: 800 ms Überblendung (Himmel-Uniforms, Lichtintensitäten, Emissive).
- Kamera: Preset je Schritt, Fahrt 1 s easeInOutCubic (Position + Target):
  1–2 Totale schräg vorne · 3 frontal erhöht (Maßketten lesbar) · 4 Untersicht schräg (Lamellen) · 5 nah an Pfostenecke · 6 Dreiviertel von oben, alle Seiten sichtbar · 7 Abend, Blick unter das Dach · 8 Totale.
- `prefers-reduced-motion`: Kamera springt, Preis ohne Zählanimation, keine Autorotation, Wow-Animation entfällt, ZIP/Glas erscheinen sofort.

### Kamera / Steuerung

OrbitControls: `enablePan=false`, `minDistance` 4 m, `maxDistance` 18 m, `maxPolarAngle` 1,45 rad (nicht unter den Boden), `minPolarAngle` 0,2, `enableDamping`. Idle-Autorotation (0,5 °/s-Bereich, `autoRotateSpeed` 0,6) nach 6 s ohne Eingabe, Stopp bei jeder Interaktion. Bei Wandanbau Azimut auf ±80° begrenzt (nicht hinter die Wand).

### Performance

- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, `antialias` nur bei DPR < 2.
- Schatten: nur DirectionalLight, 1024er Map, PCFSoft, nur Pfosten/Rahmen/Dach werfen Schatten (Lamellen als ein InstancedMesh).
- **Render-on-demand**: Loop rendert nur, wenn sich etwas bewegt (Tween aktiv, Damping, Autorotation); sonst 0 GPU-Last → Akku auf dem Handy.
- Pause bei `visibilitychange` (Tab versteckt) und per `IntersectionObserver`, wenn das iframe aus dem Sichtbereich gescrollt ist.
- Geometrien geteilt/instanziert, Canvas-Texturen einmalig erzeugt (≤ 512 px), keine PointLight-Schatten, max. 3 Zusatzlichter.
- `ResizeObserver` auf den Canvas-Container; WebGL-Check vorab → Fallback-Karte „Ihr Browser zeigt keine 3D-Vorschau. Der Konfigurator funktioniert trotzdem.“ (Schritte und Preis laufen weiter, Klick-Auswahl der Seiten über Liste).

---

## 5. Layout-Skizzen

### Desktop (≥ 1024 px)

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ CG ATELIER        ▰▰▰▱▱▱▱▱  Schritt 3 von 8 · Maße                           FR | DE │
├─────────────────────────────────────────────────────┬─────────────────────────────────┤
│                                                     │  Wie groß soll Ihre Pergola     │
│                                                     │  werden?                        │
│                                                     │                                 │
│                3D-VORSCHAU (62 %)                   │  Breite        [ 400 ] cm       │
│                                                     │  ○━━━━━━━━●━━━━━━━━━━━○         │
│             ┌──────────────────────┐                │  200                    600     │
│             │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ← 4,00 m →     │                                 │
│             │ │                  │ │                │  Tiefe         [ 300 ] cm       │
│             │ │                  │ │                │  ○━━━━━━●━━━━━━━━━━━━━○         │
│           ══╧═╧══════════════════╧═╧══              │                                 │
│                                                     │  Fläche  12,0 m²                │
│                                                     │                                 │
│  [☀ Tag | ☾ Abend]      Lamellen öffnen ○━━━●━━     │  ⓘ Größer? Wir koppeln zwei     │
│                                                     │    Module – sprechen Sie uns an.│
│                                                     ├─────────────────────────────────┤
│                                                     │ ca. 23.500 – 28.000 €           │
│                                                     │ Richtpreis inkl. Montage u. MwSt│
│                                                     │ ‹ Zurück          [  Weiter  ›] │
└─────────────────────────────────────────────────────┴─────────────────────────────────┘
```

### Mobil (< 1024 px, Priorität)

```
┌─────────────────────────────┐
│ CG ATELIER      3/8   FR|DE │  56 px
│ ▰▰▰▱▱▱▱▱                    │
├─────────────────────────────┤
│                             │
│        3D-VORSCHAU          │  45 svh, fixiert
│      ┌───────────────┐      │
│      │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│      │
│      │ │           │ │      │
│  [☀|☾]     Lamellen ━━●━━   │
├─────────────────────────────┤
│ Wie groß soll Ihre Pergola  │  scrollt
│ werden?                     │
│ Breite          [ 400 ] cm  │
│ ○━━━━━━━●━━━━━━━━━━━━━○     │
│ Tiefe           [ 300 ] cm  │
│ ○━━━━━●━━━━━━━━━━━━━━━○     │
│ Fläche 12,0 m²              │
│ (Platz für Preisleiste)     │
├─────────────────────────────┤
│ ca. 23.500 – 28.000 €   [›] │  fixiert, safe-area-inset-bottom
│ Richtpreis inkl. Montage …  │
└─────────────────────────────┘
```

Mobil zeigt die Preisleiste „Zurück“ als kleinen Pfeil links, „Weiter“ als 44 × 44+ Primärbutton rechts. Schritt 8 auf Mobil: Referenzkarten horizontal scrollbar (Scroll-Snap, innerhalb des Containers, kein Seiten-Querscroll).

Design-Token: Fläche `#F7F5F2`, Karten `#FFFFFF`, Text `#2B2D30`, Sekundärtext `#5C5F64` (Kontrast 6,2:1 auf Fläche), Linien `#E4E0DA`, Akzent-Platzhalter `--accent: #7B5B3A` (Bronze; weißer Text darauf 6,2:1), Fehler `#B3261E`. Schrift Inter 400/500/600, Fließtext 17 px, Überschrift 26/28 px, Radius 12 px, keine Verläufe, keine Schatten außer 1 px-Linien.

---

## 6. Preisberechnung

### Pseudocode

```
function calcPrice(s):
  m      = PRICES.models[s.model]
  areaM2 = (s.width / 100) * (s.depth / 100)
  core   = m.base + areaM2 * m.perM2                         // Grundpreis + Fläche
  colorSurcharge = (s.colorFrame == 'custom' or s.colorRoof == 'custom')
                   ? core * PRICES.customColorPct : 0
  mount  = s.mount == 'free' ? PRICES.freestanding : 0

  sides = 0
  for side in activeSides(s.mount):                          // wall: left, front, right; free: + back
     lenM = (side in [front, back]) ? s.width/100 : s.depth/100
     if s.sides[side] == 'zip'   : sides += lenM * PRICES.zipPerM
     if s.sides[side] == 'glass' : sides += lenM * PRICES.glassPerM

  opts  = (led ? PRICES.led : 0) + heaters * PRICES.heaterEach
        + (sensor ? PRICES.sensor : 0) + (smarthome ? PRICES.smarthome : 0)
        + (solar && MODELS[model].solar ? PRICES.solar : 0)
        + (lightband && model=='ts_lamellen' && mount=='wall' ? width/100 * PRICES.lightbandPerM : 0)

  P     = round(core + colorSurcharge + mount + sides + opts + PRICES.install)   // auf ganze €
  low   = roundTo(P * PRICES.rangeLow,  PRICES.roundTo)      // kaufmännisch auf nächste 500
  high  = roundTo(P * PRICES.rangeHigh, PRICES.roundTo)
  return { P, low, high, breakdown }

roundTo(x, step) = Math.round(x / step) * step
format: de → "ca. 23.500 – 28.000 €" (Intl.NumberFormat('de-DE')), fr → "env. 23 500 – 28 000 €" (fr-FR, schmales Leerzeichen)
```

Gleitkomma: Fläche wird intern in cm² gerechnet und erst am Ende geteilt (`width*depth*perM2/10000`), damit z. B. 4,1 × 3,3 m keine Rundungsfehler erzeugt.

### Kontrollbeispiel: Varia, Wandanbau, 400 × 300 cm, ZIP links + rechts (je 3 m), LED, Sensor

| Position | Rechnung | Betrag |
|---|---|---|
| Grundpreis Varia | | 4.500 € |
| Fläche | 4,00 × 3,00 = 12 m² × 1.250 € | 15.000 € |
| Sonderfarbe | nein | 0 € |
| Freistehend | nein (Wand) | 0 € |
| ZIP links | 3 m × 450 € | 1.350 € |
| ZIP rechts | 3 m × 450 € | 1.350 € |
| Vorne | offen | 0 € |
| LED | | 1.200 € |
| Wind-/Regensensor | | 450 € |
| Montage | | 1.800 € |
| **P** | | **25.650 €** |
| Untergrenze | 25.650 × 0,92 = 23.598 → /500 = 47,196 → round 47 → | **23.500 €** |
| Obergrenze | 25.650 × 1,10 = 28.215 → /500 = 56,43 → round 56 → | **28.000 €** |
| **Anzeige** | | **„ca. 23.500 – 28.000 €“** ✔ |

Maßprüfung: Varia Wandanbau erlaubt B 200–600 × T 200–450 → 400 × 300 zulässig ✔. Dieses Beispiel wird in Phase 2 als Selbsttest beim Laden ausgeführt (`console.assert`, Ausgabe nur mit `?debug=1`).

---

## 7. Annahmen und Risiken

### Annahmen (getroffen, bitte bestätigen oder korrigieren)

1. **Empfehlungslogik:** Wohnzimmer → Twist, Sonnenschutz → Joy, Ganzjährig → Varia + Glaswände vorbelegt, Pool → Twist freistehend. Vorbelegungen gelten nur, solange der Nutzer die Felder nicht selbst geändert hat.
2. **Grenzen unabhängig von Montage** für alle Modelle außer Varia (Quelle nennt nur Varia getrennt).
3. **Pfostenregel:** Mittelpfosten ab Spannweite > 450 cm (außer Varia: 6 Pfosten ab T > 620). Höhe für alle Modelle 240 cm.
4. **Rundung:** „gerundet auf 500“ = kaufmännisch auf die nächste 500 (nur so ergibt das Kontrollbeispiel 23.500 / 28.000).
5. **Sonderfarbe:** Aufschlag einmal +6 % auf (Grundpreis + Fläche), egal ob Struktur, Lamellen oder beides. Sand/Bronze gilt als Standardfarbe ohne Aufschlag.
6. **Glas-Lichtband** (TS Lamellendach, nur Wandanbau): neuer Preis-Key `lightbandPerM: 600` €/m Breite als Platzhalter – nicht in der Vorgabe enthalten. Alternativ weglassen.
7. **Glas-Schiebewände und ZIP** sind bei allen Dachtypen wählbar; bei Varia als „unsichtbar integriert“ beschriftet, ohne Preisunterschied.
8. **Preisleiste ab Schritt 1 sichtbar** (mit Standardkonfiguration), damit die Transparenz sofort wirkt. Schalter `PRICE_MODE: 'range' | 'from'` im Konfigurationsblock bereitet die Alternative „nur ab-Preis, Spanne nach E-Mail“ für Freitag vor.
9. **Formular:** zusätzlich zur Vorgabe optional „Kontaktweg“ (aus dem Konzept) und bei Showroom ein optionaler Wunschtermin (Zeitfenster, kein Kalender).
10. **Referenzbilder:** gezeichnete Platzhalter (ruhige Flächen + Linienzeichnung, keine Stockfotos), austauschbar über eine Bild-URL je Karte.
11. **Akzentfarbe Bronze `#7B5B3A`** bis zum Logo-Abgleich; Logo als Text-Platzhalter.
12. **Webhook-Format:** `fetch(WEBHOOK_URL, {method:'POST', body: JSON, headers:{'Content-Type':'text/plain'}})` – `text/plain` vermeidet den CORS-Preflight, damit Make/Zapier/n8n-Webhooks direkt aus dem Browser funktionieren. Die E-Mail an info@cgatelier.lu verschickt das Automations-Tool, nicht der Browser.
13. **Tracking-Events** feuern beim Verlassen eines Schritts per „Weiter“ (`config_step_n` = Schritt n abgeschlossen); `config_start` bei der ersten Interaktion. Parameter: `model`, `price_low`, `price_high`, `purpose`, `mount`, `lang`.
14. **Zahlenformat** FR mit schmalem Leerzeichen und „env.“, DE mit Punkt und „ca.“.

### Risiken

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| **Platzhalterpreise** | Falsche Erwartung beim Kunden, wenn live | Konstante `PRICES` mit `pricesVersion: 'demo-placeholder'`; Banner „Demo-Preise“ per Flag; vor Livegang echte EK/Margen. Inhaber muss Freitag entscheiden, ob Preise gezeigt werden. |
| **Google Fonts extern = DSGVO** | Abmahnrisiko (LG München 2022, IP-Übertragung in die USA) | Demo mit Google Fonts wie gefordert; für Livegang Inter selbst hosten (2 woff2-Dateien) oder Systemschrift-Fallback – im Code als Kommentar markiert. |
| **Tracking ohne Consent** | DSGVO/ePrivacy in LU/BE | `track()` prüft eine Consent-Variable (`window.CG_CONSENT` oder postMessage von der Elternseite); ohne Zustimmung nur interner Log. CMP der MUM-Website muss angebunden werden. Meta CAPI braucht einen Server (über das Webhook-Tool oder GTM Server-Side), das kann die statische Datei nicht. |
| **iframe-Höhe vs. App-Layout** | Fixe 3D-/Preisleiste funktionieren nicht, wenn das iframe so hoch wie der Inhalt wird | Zwei Modi: `?embed=1` meldet Höhe per `postMessage({type:'cg-configurator:height', height})`; Empfehlung an MUM: iframe mit `height: 100svh` bzw. auf Mobil Direktlink (Ads ohnehin direkt auf die Konfigurator-URL). Snippet für die Elternseite liefere ich mit. |
| **iOS Safari < 16.4** ohne Import-Maps | three.js lädt nicht | Feature-Check, dann Fallback ohne 3D (Konfigurator bleibt nutzbar). Betrifft < 3 % der Geräte. |
| **jsDelivr nicht erreichbar / file://** | Kein 3D bei Doppelklick ohne Internet | Fallback-Karte; mit Internet funktioniert `file://` (jsDelivr liefert CORS-Header). |
| **Performance auf alten Android-Geräten** | Ruckeln | Render-on-demand, DPR-Deckel, Schatten-Auto-Off, wenn erste 60 Frames < 30 fps im Schnitt. |
| **Maße der Nicht-Varia-Modelle sind Annahmen** | Konfiguration, die nicht lieferbar ist | Alle Grenzen in `MODELS` am Dateianfang, beim Inhaber erfragen. |
| **Markenrechte (Gibus/Markilux-Namen, Siegel)** | Nutzung offizieller Logos | Nur Textnennung; Siegel als Platzhalter, bis CG Atelier die Freigabe-Logos liefert. |
| **Spam-Leads** | Unbrauchbare Einträge im CRM | Honeypot-Feld + Mindestzeit (3 s) im Formular, kein CAPTCHA (Konversion). |

---

**Nächster Schritt:** Ihr „OK“ (oder Änderungen zu den Annahmen 1–14), dann liefere ich in Phase 2 die vollständige `index.html`, Anpassungsanleitung und die abgehakte Akzeptanz-Checkliste.
