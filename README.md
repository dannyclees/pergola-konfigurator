# Pergola-Konfigurator · CG Atelier

Eine einzige Datei: `index.html`. Sie läuft per Doppelklick oder auf jedem statischen Hosting. Extern geladen werden nur three.js (jsDelivr), Google Fonts und, sobald der Besucher eine Adresse sucht, OpenStreetMap.

## Anpassen ohne Programmierer

Alle Einstellungen stehen oben im `<script>`-Block unter **1. CONFIG**.

| Was | Wo | Hinweis |
|---|---|---|
| Preise | `const PRICES = { … }` | Grundpreis + €/m² je Modell, Optionen, Montage, Spanne (`rangeLow`/`rangeHigh`), Rundung. Vor dem Livegang `pricesVersion` ändern, dann verschwindet das Etikett „Demo-Preise“ (oder `SHOW_DEMO_BADGE = false`). |
| Preisanzeige | `const PRICE_MODE` | `'blur'` (Standard): alle Preise unscharf, freigeschaltet erst nach dem Absenden der Anfrage. Die Freischaltung bleibt im Browser gespeichert. `'range'`: Spanne live sichtbar. `'from'`: nur „ab“-Preis. Im Blur-Modus stehen im Quelltext der Seite nur Platzhalterziffern, nie der echte Preis. |
| Maßgrenzen, Lamellenwinkel, Solar | `const MODELS = { … }` | Grenzen in cm je Montageart. |
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

**iframe:**
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

## Tracking

`track(event, params)` schreibt in `window.dataLayer` (GA4/GTM), ruft `fbq('trackCustom', …)` auf und meldet im iframe an die Elternseite. Events:

- `config_start`, `config_step_1` … `config_step_8` (Schritt erreicht), jeweils mit `model`, `price_low`, `price_high`, `value`, `purpose`, `mount`, `lang`
- `lead_quote`, `lead_showroom` (zusätzlich Meta-Standard-Event `Lead` mit Wert)
- `sun_view` (Sonnenverlauf geöffnet), `site_set` (Adresse oder Standort gesetzt)

Meta CAPI braucht einen Server: über den Webhook (Make/Zapier) oder GTM Server-Side.

## Sonnenverlauf

- **Rechnung:** NOAA-Sonnenstandsalgorithmus (Höhe/Azimut ca. ±0,01°, Auf-/Untergang ca. ±1 min), inklusive Refraktion. Die Sommer- und Winterzeit ergibt sich automatisch aus der Zeitzone des Landes (LU, BE, FR, DE). Abgeglichen mit Referenzwerten für Luxemburg-Stadt am 21.06.2026: Aufgang 5:28, wahrer Mittag 13:37 bei 63,8° Sonnenhöhe, Untergang 21:46.
- **Ort:** Adresssuche über OpenStreetMap Nominatim oder Gerätestandort. Ohne Adresse rechnet der Konfigurator mit `DEFAULT_SITE`.
- **Ausrichtung:** Gebäudegrundriss aus OpenStreetMap (Overpass). Der Besucher tippt auf die Hauswand an der Terrasse, die Außennormale dieser Wand ergibt den Azimut gradgenau. Ohne Grundriss: 8 Schnellwahl-Richtungen plus Feinregler 0–359°.
- **Nicht berücksichtigt:** Gelände, Bäume und Nachbargebäude. Darauf wird der Besucher im Konfigurator hingewiesen.
- **Nutzungsregeln:** Nominatim erlaubt höchstens 1 Anfrage pro Sekunde. Gesucht wird deshalb nur auf Klick, mit Sperre. Bei hohem Volumen einen eigenen oder kommerziellen Geocoder eintragen (`Geo`-Modul). Der Quellenhinweis „© OpenStreetMap-Mitwirkende“ muss sichtbar bleiben.
- **Im Lead:** `configuration.site` (Koordinaten, Adresse) und `configuration.orientation` (Azimut, Quelle). Im Teilen-Link stehen nur auf 3 Nachkommastellen gerundete Koordinaten (ca. 100 m), keine Adresse.

## Akzeptanzkriterien

- [x] Kontrollbeispiel ergibt exakt 25.650 € und „ca. 23.500 – 28.000 €“. Ein Selbsttest beim Laden prüft das, Ergebnis in `window.__CG_SELFTEST__`.
- [x] Jede Auswahl ändert 3D-Modell und Preis ohne Neuladen. Gemessen: ca. 16 ms von Klick bis fertigem Update (Software-Renderer).
- [x] Maßgrenzen gelten je Modell und Montageart. Zu große Eingaben werden begrenzt, mit Hinweis „Module koppeln“ und einem passenden Alternativmodell.
- [x] Solar nur bei Twist und Varia, sonst ausgegraut mit Hinweis.
- [x] Lamellen drehen sich live (in Schritt 4 einmal automatisch auf und zu), ZIP-Screens und Glaswände fahren animiert.
- [x] Kein horizontales Scrollen bei 375 px Breite (getestet in Chromium mit Touch-Emulation). Auf echten iPhones und Android-Geräten vor dem Livegang testen.
- [x] FR/DE vollständig, alle Texte in `I18N`.
- [x] Lead-JSON enthält Konfiguration, Preis inkl. Aufschlüsselung, Kontakt, Standort/Ausrichtung und UTM-Parameter.
- [x] Konfiguration bleibt über den URL-Hash erhalten, auch nach Neuladen und als Teilen-Link.

## Offene Punkte vor dem Livegang

1. Echte Preise und Margen eintragen, Preismodus festlegen (`blur` / `range` / `from`).
2. Maßgrenzen der Modelle außer Varia beim Inhaber bestätigen.
3. Exakte Showroom-Koordinaten in `DEFAULT_SITE`.
4. Webhook (Make/Zapier/n8n) für die E-Mail an info@cgatelier.lu und das CRM einrichten.
5. Inter selbst hosten (DSGVO) und Tracking an das Cookie-Banner der Website koppeln.
6. Referenzfotos, Logo, Akzentfarbe, Gibus-Atelier-Siegel (Freigabe) einsetzen.
7. Für Belgien prüfen, ob die OSM-Gebäudedaten flächendeckend vorhanden sind. In Luxemburg stammen sie aus dem Kataster.
