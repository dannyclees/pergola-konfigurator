# Pergola-Konfigurator · CG Atelier

Eine einzige Datei: `index.html`. Sie läuft per Doppelklick oder auf jedem statischen Hosting. Extern geladen werden nur three.js (jsDelivr), Google Fonts und, sobald der Besucher eine Adresse sucht, OpenStreetMap.

## Anpassen ohne Programmierer

Alle Einstellungen stehen oben im `<script>`-Block unter **1. CONFIG**.

| Was | Wo | Hinweis |
|---|---|---|
| Preise | `const PRICES = { … }` | Grundpreis + €/m² je Modell, Optionen, Montage, Spanne (`rangeLow`/`rangeHigh`), Rundung. Zurzeit Schätzwerte aus der Marktrecherche (siehe unten). Sobald echte Preise drinstehen, `pricesVersion` ändern (ohne „schaetzung“), dann verschwindet das Etikett „Demo-Preise“. |
| Preisanzeige | `const PRICE_MODE`, `PRICE_REVEAL_AFTER_LEAD` | `'blur'` (Standard): keine Zahlen sichtbar. Die Preisleiste zeigt „Persönlicher Preis“ mit Schloss, Einzelpreise bei Optionen, Seiten und Modellen entfallen; den Preis gibt es im Beratungsgespräch (`PRICE_REVEAL_AFTER_LEAD = false`). Mit `true` wird der Preis nach dem Absenden der Anfrage freigeschaltet. `'range'`: Spanne live sichtbar. `'from'`: nur „ab“-Preis. Im gesperrten Modus steht kein Preis auf der Seite; im Lead steht er vollständig. |
| Maßgrenzen, Pfosten, Lamellenwinkel, Solar | `const MODELS = { … }` | Je Montageart eine Liste erlaubter Bereiche in cm (z. B. Varia Wandanbau 4,50 × 7,20 m **oder** 7,20 × 4,50 m). `midW`/`midD`: ab welcher Breite/Tiefe zusätzliche Pfosten kommen. |
| Empfehlung je Nutzungszweck | `const RECOMMEND` | |
| Farben | `const COLORS` | `hex` = Darstellung in 3D und auf dem Farbchip. |
| Referenzen | `const REFERENCES` | `image: 'https://…/foto.jpg'` eintragen, dann ersetzt das Foto die Platzhalterzeichnung. Texte stehen in `I18N.*.s8.refs`. |
| Google-Bewertung | `const GOOGLE_RATING` | z. B. `{ score: '4,9', count: 37 }` |
| Standardort für den Sonnenverlauf | `const DEFAULT_SITE` | Zurzeit Ortsmitte Tarchamps. Exakte Koordinaten des Showrooms eintragen. |
| Lead-Versand | `const WEBHOOK_URL` | Leer = Demo (Lead nur in der Browser-Konsole). Live: URL eines Make-, Zapier- oder n8n-Webhooks. Dieser verschickt die E-Mail an info@cgatelier.lu und legt den Eintrag im CRM an (z. B. monday). Gesendet wird per `POST` als JSON (Content-Type `text/plain`, damit kein CORS-Preflight nötig ist). |
| Datenschutzlink | `const PRIVACY_URL` | |
| Tracking erst nach Einwilligung | `const TRACKING_REQUIRES_CONSENT` | Bei `true` wartet das Tracking auf `window.CG_CONSENT = true` oder auf `postMessage({type:'cg-configurator:consent', granted:true})` von der Elternseite. |
| Texte FR/DE | `const I18N = { fr: …, de: … }` | Jeder sichtbare Text steht hier. Standardsprache FR, `?lang=de` schaltet um. |
| Akzentfarbe | CSS ganz oben: `--accent`, `--accent-soft` | Farbe aus dem Logo übernehmen. Weißer Text auf `--accent` braucht mindestens 4,5:1 Kontrast. |

## Einbindung auf der Website (MUM)

**Direktlink (empfohlen für Ads):** `https://…/index.html?lang=fr&utm_source=…`

**Popup (empfohlen für die Website):** Der Konfigurator öffnet sich auf dem Desktop als große, zentrierte Box über der abgedunkelten Seite (Esc, Klick daneben oder × schließt; die Konfiguration bleibt erhalten). Auf dem Handy und bei kleinen Fenstern (unter 1100 × 700 px) öffnet er sich als ganze Seite.
```html
<script src="https://…/embed.js" data-lang="fr" defer></script>
<a href="#" data-cg-pergola>Configurer ma pergola</a>
<a href="#" data-cg-pergola data-lang="de">Pergola konfigurieren</a>
```
Per JavaScript: `CGPergola.open({ lang: 'de' })`, `CGPergola.close()`. UTM-Parameter der Seite werden weitergereicht, Schritte und Leads landen im `dataLayer` der Website (zusätzlich `config_popup_open` / `config_popup_close`). Testseite: `demo.html`.

**Direktlink auf dem Desktop:** erscheint ebenfalls als Box auf ruhigem Hintergrund (ab 1100 × 700 px), auf dem Handy randlos.

**iframe (fest in die Seite eingebettet):**
```html
<iframe id="cg-config" src="https://…/index.html?embed=1&lang=fr"
        style="width:100%;border:0;height:780px" allow="geolocation; clipboard-write"
        title="Pergola-Konfigurator"></iframe>
<script>
  // UTM-Parameter der Seite an den Konfigurator weiterreichen
  (function () {
    var f = document.getElementById('cg-config');
    if (location.search) f.src += '&' + location.search.slice(1);
    window.addEventListener('message', function (e) {
      if (!e.data) return;
      if (e.data.type === 'cg-configurator:height') f.style.height = e.data.height + 'px';
      if (e.data.type === 'cg-configurator:event') (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: e.data.event }, e.data.params));
    });
  })();
</script>
```
`allow="geolocation"` braucht es für „Meinen Standort verwenden“.

## Bedienung der 3D-Ansicht

- Ziehen: drehen · Mausrad: zur Mausposition hinfahren (bis unter das Dach) · Rechtsklick / zwei Finger: verschieben
- Man kann auf Augenhöhe gehen und von unten ins Dach schauen; Boden und Hauswand werden nicht durchdrungen.
- Buttons rechts: nach links / rechts drehen, Ansicht zurücksetzen
- Schritt 7 (Komfort): Beim Zubuchen von LED, Heizstrahler, Sensor, Solar oder Lichtband fährt die Kamera kurz an die Stelle, schwenkt langsam mit und fährt danach zurück. Greift der Nutzer währenddessen ein, übernimmt er die Kamera.
- Schatten bleiben auch auf schwächeren Geräten an; bei Bedarf wird nur die Auflösung gesenkt.

## Darstellung und Vorführung

- **Material:** Aluprofile mit leicht gerundeten Kanten und pulverbeschichteter Oberfläche (matte Struktur, leichter Klarlack-Glanz), gewölbtes Lamellenprofil, Fußplatten mit Schrauben, Rinnen im Rahmen, Wasseraustritt an den Pfosten, ZIP-Führungsschienen. Kontaktschatten unter Pfosten, Möbeln und Pflanzen.
- **Qualitäts-Hotspots** (Schritte 3, 5, 8): Punkte am Modell zu Lamellen, Entwässerung, ZIP/Seiten und Motor/Automatik; Texte in `I18N.*.hs`.
- **Regen-Demo** (Button „Regen“): Himmel zieht zu, Regen fällt, die Lamellen schließen (Tuchdach fährt aus), Wasser tritt an den Pfosten aus; danach zurück zum vorherigen Zustand. Texte in `I18N.*.rain`.
- **Nacht:** Lichtteppich der LED und Glühen der Heizstrahler am Boden. Ein direkt auf Schritt 7 geöffneter Link startet ebenfalls im Abend.
- **Umgebung:** Hauswand mit Faschen und Fensterbänken, Terrasse mit Randsteinen, Lounge mit Polstern und Zierkissen, Pflanzkübel mit Bäumchen, Hecke, Wolken.
- **Profil-Details:** umlaufende Regenrinne mit Profillippen im Träger, Endkappen an jeder Lamelle, Motorgehäuse unter dem Seitenträger, Pfostenkappen, Sockelblende und Edelstahl-Sechskantschrauben mit Unterlegscheiben auf der Fußplatte. Geschlossene Lamellen überlappen, ohne Lichtspalt.
- **Optionen in 3D:**
  - **LED:** umlaufendes, in den Träger eingelassenes Alu-Profil mit Opal-Abdeckung; bei Lamellendächern zusätzlich LED-Linien in jeder dritten Lamelle (drehen mit). Auf dem Desktop leuchtet das Licht als Flächenlicht in Leistenform (linienförmige Reflexe).
  - **Heizstrahler:** Infrarot-Strahler (ca. 90 cm) mit Gehäuse, poliertem Reflektor, Heizstab und Schutzgitter, an zwei Haltern unter dem Träger, zum Sitzbereich geneigt; glüht abends.
  - **Wind-/Regensensor:** so montiert, wie es bei Lamellendächern üblich ist: flacher Regensensor oben auf dem vorderen Träger nahe der Ecke (Sensorfläche frei zum Himmel), kleines Schalenkreuz-Anemometer auf einem Winkelhalter außen am Seitenträger. Die genaue Position beim jeweiligen Hersteller bitte beim Kunden bestätigen lassen; Gibus verbaut je nach Modell auch integrierte Sensoren.
- **Oberflächen:** Holzdielen mit Maserung, Ästen, Fugen und Relief, Scheibenputz an der Fassade, Leinwandgewebe beim Tuch-/PVC-Dach, feine Pulverstruktur auf dem Aluminium (Desktop), Rasen mit Grasbüscheln rund um die Terrasse, buschige Hecke, Bäumchen mit unregelmäßiger Krone.
- **Glas:** klare Scheibe plus Spiegelschicht (Fresnel: frontal durchsichtig, im flachen Winkel spiegelnd). Auf dem Desktop spiegeln Glas und Fenster die tatsächliche Szene samt Tageszeit (Würfelkamera, wird nur bei Änderungen neu aufgenommen).
- **Qualitätsstufen:**
  - **Desktop / starke Geräte (HQ):** Umgebungsverdeckung (GTAO) für die feinen Verschattungen in Ecken, Fugen, zwischen den Lamellen und an der Hauswand; MSAA-Kantenglättung; abends ein dezenter Lichtschein um LED und Heizstrahler; weiche Schatten, die mit dem Abstand zum Schattenwerfer unschärfer werden (PCSS); doppelte Texturauflösung; Schattenauflösung 2048.
  - **Handys und kleine Bildschirme:** die bisherige, schnelle Darstellung (Schattenauflösung 1024, Kontaktschatten, keine Nachbearbeitung). Schatten bleiben immer an.
  - **Automatik:** Ist ein Gerät zu langsam (unter etwa 28 Bilder/s), schaltet der Konfigurator nach rund 1,5 s zuerst die HQ-Effekte ab und senkt danach bei Bedarf die Auflösung.
  - **Zum Testen:** `?q=hq` erzwingt die hohe, `?q=lo` die einfache Stufe (ohne Automatik).

## Tracking

`track(event, params)` schreibt in `window.dataLayer` (GA4/GTM), ruft `fbq('trackCustom', …)` auf und meldet im iframe an die Elternseite. Events:

- `config_start`, `config_step_1` … `config_step_8` (Schritt erreicht), jeweils mit `model`, `price_low`, `price_high`, `value`, `purpose`, `mount`, `lang`
- `lead_quote`, `lead_showroom` (zusätzlich Meta-Standard-Event `Lead` mit Wert)
- `sun_view` (Sonnenverlauf geöffnet), `site_set` (Adresse oder Standort gesetzt), `rain_demo`, `hotspot_open`

Meta CAPI braucht einen Server: über den Webhook (Make/Zapier) oder GTM Server-Side.

## Sonnenverlauf

- **Rechnung:** NOAA-Sonnenstandsalgorithmus (Höhe/Azimut ca. ±0,01°, Auf-/Untergang ca. ±1 min), inklusive Refraktion. Die Sommer- und Winterzeit ergibt sich automatisch aus der Zeitzone des Landes (LU, BE, FR, DE). Abgeglichen mit Referenzwerten für Luxemburg-Stadt am 21.06.2026: Aufgang 5:28, wahrer Mittag 13:37 bei 63,8° Sonnenhöhe, Untergang 21:46.
- **Darstellung:** immer am 21. Juni (längster Tag), Zeitpunkte 10, 12, 16 und 20 Uhr (`SUN_TIMES`). Die Sonne wirkt nur über Licht und Schatten; ein Kompasskreis am Boden zeigt die Himmelsrichtungen und mit einer Markierung, aus welcher Richtung die Sonne kommt. Das 3D-Haus ist symbolisch; Sonnenstand und Ausrichtung entsprechen dem echten Standort.
- **Ort:** Adresssuche über OpenStreetMap Nominatim oder Gerätestandort. Ohne Adresse rechnet der Konfigurator mit `DEFAULT_SITE`.
- **Ausrichtung:** Gebäudegrundriss aus OpenStreetMap (Overpass). Der Besucher tippt auf die Hauswand an der Terrasse, die Außennormale dieser Wand ergibt den Azimut gradgenau. Ohne Grundriss: 8 Schnellwahl-Richtungen plus Feinregler 0–359°.
- **Nicht berücksichtigt:** Gelände, Bäume und Nachbargebäude. Darauf wird der Besucher im Konfigurator hingewiesen.
- **Nutzungsregeln:** Nominatim erlaubt höchstens 1 Anfrage pro Sekunde. Gesucht wird deshalb nur auf Klick, mit Sperre. Bei hohem Volumen einen eigenen oder kommerziellen Geocoder eintragen (`Geo`-Modul). Der Quellenhinweis „© OpenStreetMap-Mitwirkende“ muss sichtbar bleiben.
- **Im Lead:** `configuration.site` (Koordinaten, Adresse) und `configuration.orientation` (Azimut, Quelle). Im Teilen-Link stehen nur auf 3 Nachkommastellen gerundete Koordinaten (ca. 100 m), keine Adresse.

## Preisquellen (Schätzwerte, Stand Oktober 2026)

Gibus und TS Aluminium veröffentlichen keine Listenpreise. Die Werte sind aus Händlerpreisen und Kalkulatoren abgeleitet (DE/IT/BE/UK, inkl. MwSt.) und am oberen Segment kalibriert. Die Quellen konnten nur über Suchauszüge geprüft werden; Stichproben im Browser lohnen sich.

| Position | Wert | Grundlage |
|---|---|---|
| Gibus Joy | 6.500 € + 450 €/m² | Joy 2 × 2,1 m freistehend ca. 8.640 € (terrassendach-direkt.de Kalkulator); Solona „ab 11.999 €“ |
| Gibus Twist | 8.500 € + 500 €/m² | Twist 2 × 2,1 m ca. 11.330 € (terrassendach-direkt.de); Med Twist 4 × 3,5 m Liste 19.600 € + MwSt. (borgognogroup.com) |
| Gibus Varia | 10.500 € + 550 €/m² | Varia 2 × 2 m ca. 14.200 € (terrassendach-direkt.de); Varia 3 × 3 m ab 17.625 € (mueheoutdoorliving.de); Gibus 5 × 4 m Wandanbau ca. 22.300 € inkl. Montage (pina-design.de) |
| TS Aluminium Lamellendach | 5.500 € + 600 €/m² | Schätzung: Branchenwerte Lamellendach 3 × 3 m ca. 11.600 €, 3 × 5 m ca. 15.700 € inkl. Montage (vario-kielgast.de) |
| TS Aluminium Glasdach | 3.000 € + 500 €/m² | Schätzung: Alu-Glasdach 4 × 3 m 7.800–14.500 € inkl. Montage (Fachbetriebe AT/DE) |
| Gibus Med Room | 7.000 € + 350 €/m² | Schätzung: Med Room Wandanbau ca. 11.730 € (suntec-shop.de, Maß unbekannt) |
| Markilux pergola stretch | 16.500 € + 300 €/m² | UVP ab 19.500 € für 3,50 × 2,57 m ohne Montage (pergola-ratgeber.de, stoffdach-sonnenschutz.de) |
| Freistehend | + 1.500 € | 2 zusätzliche Pfosten mit Entwässerung |
| ZIP-Screen | 800 € je Seite + 350 €/lfm | Renson Fixscreen ab 2.189 €; Belgien 1.200–2.500 € je Seite (ainhpro.be) |
| Glas-Schiebewand | 950 €/lfm | 799 €/m inkl. Montage (glasschiebewaende-wille.de) bis 3.000–6.000 € je Seite |
| LED | 1.200 € (bis 15 m²), 1.800 € darüber | Renson Lineo ab 990 €, indirekte LED ab 1.500 € |
| Heizstrahler | 1.100 €/Stück | Heatscope Spot 769–959 € plus Elektroanschluss |
| Sensor / Smart Home | 450 € / 400 € | Renson Regensensor 253–335 €; Somfy TaHoma 150–205 € plus Einrichtung |
| Solar-Lamellen | 1.500 € + 350 €/m² | Schätzung, Gibus nennt keinen Aufpreis |
| Sonderfarbe | + 10 %, mind. 500 € | Händlerangaben 8–15 % |
| Lieferung und Montage | 1.550 € + 50 €/m² | Montage 800–2.500 € je nach Größe (Ratgeber, Mildenberger), plus Lieferung LU/BE |

Kontrollrechnung: Varia 4 × 3 m Wandanbau mit 2 ZIP-Seiten à 3 m, LED und Sensor ergibt 24.600 € und damit „ca. 22.500 – 27.000 €“. Zum Vergleich: Renson Camargue in ähnlicher Ausstattung nach Händlerpreisen ca. 26.900 €.

MwSt.: Die Quellen rechnen meist mit 19 % (DE). Luxemburg hat 17 % (Preise ca. 1,7 % niedriger), Belgien 21 %. Ob in Belgien für Pergolen der ermäßigte Satz gilt, bitte prüfen.

## Akzeptanzkriterien

- [x] Kontrollbeispiel ergibt mit den Briefing-Werten exakt 25.650 € und „ca. 23.500 – 28.000 €“. Ein Selbsttest beim Laden prüft die Formel mit diesen Referenzwerten (`REFERENCE_PRICES`), Ergebnis in `window.__CG_SELFTEST__`.
- [x] Jede Auswahl ändert 3D-Modell und Preis ohne Neuladen. Gemessen: ca. 16 ms von Klick bis fertigem Update (Software-Renderer).
- [x] Maßgrenzen gelten je Modell und Montageart, inklusive der zwei Gibus-Ausführungen im Wandanbau. Zu große Eingaben werden begrenzt, mit Hinweis auf die andere Ausführung, „Module koppeln“ oder ein passendes Alternativmodell.
- [x] Solar nur bei Twist und Varia, sonst ausgegraut mit Hinweis.
- [x] Lamellen drehen sich live (in Schritt 4 einmal automatisch auf und zu), ZIP-Screens und Glaswände fahren animiert.
- [x] Kein horizontales Scrollen bei 375 px Breite (getestet in Chromium mit Touch-Emulation). Auf echten iPhones und Android-Geräten vor dem Livegang testen.
- [x] FR/DE vollständig, alle Texte in `I18N`.
- [x] Lead-JSON enthält Konfiguration, Preis inkl. Aufschlüsselung, Kontakt, Standort/Ausrichtung und UTM-Parameter.
- [x] Konfiguration bleibt über den URL-Hash erhalten, auch nach Neuladen und als Teilen-Link.

## Offene Punkte vor dem Livegang

1. Echte Preise und Margen eintragen (ersetzen die Schätzwerte), Preismodus festlegen (`blur` / `range` / `from`).
2. Maßgrenzen beim Inhaber bestätigen, vor allem Med Room, TS-Glasdach und die Mindesttiefe der Markilux stretch.
3. Exakte Showroom-Koordinaten in `DEFAULT_SITE`.
4. Webhook (Make/Zapier/n8n) für die E-Mail an info@cgatelier.lu und das CRM einrichten.
5. Inter selbst hosten (DSGVO) und Tracking an das Cookie-Banner der Website koppeln.
6. Referenzfotos, Logo, Akzentfarbe, Gibus-Atelier-Siegel (Freigabe) einsetzen.
7. Für Belgien prüfen, ob die OSM-Gebäudedaten flächendeckend vorhanden sind. In Luxemburg stammen sie aus dem Kataster.
