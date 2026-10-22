/* CG Atelier – Pergola-Konfigurator als Popup auf der Website
 *
 * Einbindung (einmal pro Seite, vor </body>):
 *   <script src="https://…/embed.js" data-lang="fr" defer></script>
 * Öffnen per Button oder Link:
 *   <a href="#" data-cg-pergola>Pergola konfigurieren</a>
 *   <button data-cg-pergola data-lang="de">Pergola konfigurieren</button>
 * Oder per JavaScript: CGPergola.open({ lang: 'de' }) / CGPergola.close()
 *
 * Desktop: große, zentrierte Box über abgedunkeltem Hintergrund (Esc, Klick daneben oder × schließt).
 * Handy/kleine Bildschirme: der Konfigurator öffnet sich als ganze Seite (wie bisher).
 * Die Konfiguration bleibt beim Schließen erhalten, solange die Seite offen ist.
 */
(function () {
  'use strict';
  if (window.CGPergola) return;

  var script = document.currentScript || document.querySelector('script[src*="embed.js"]');
  var BASE = script ? script.src.replace(/embed\.js(\?.*)?$/, '') : './';
  var DEFAULT_LANG = (script && script.getAttribute('data-lang')) || 'fr';
  var BOX_MIN_W = 1100, BOX_MIN_H = 700;           // darunter: ganze Seite statt Popup

  var overlay, frame, closeBtn, lastFocus, currentLang, prevOverflow;

  function configUrl(lang, popup) {
    var q = new URLSearchParams(location.search);       // UTM-Parameter der Seite weiterreichen
    var out = new URLSearchParams();
    q.forEach(function (v, k) { if (/^(utm_|gclid|fbclid|q$)/.test(k)) out.set(k, v); });   // q = Qualitätsstufe zum Testen
    out.set('lang', lang);
    if (popup) out.set('popup', '1');
    return BASE + 'index.html?' + out.toString();
  }

  function css() {
    if (document.getElementById('cg-pergola-css')) return;
    var st = document.createElement('style');
    st.id = 'cg-pergola-css';
    st.textContent =
      '.cgp-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(28,29,31,.62);opacity:0;transition:opacity .25s ease}' +
      '.cgp-overlay.open{opacity:1}' +
      '.cgp-box{position:relative;width:min(1360px,90vw);height:min(880px,88vh);' +
      'border-radius:20px;background:#F7F5F2;box-shadow:0 30px 90px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.06);' +
      'transform:translateY(14px) scale(.985);transition:transform .35s cubic-bezier(.2,.8,.2,1)}' +
      '.cgp-overlay.open .cgp-box{transform:none}' +
      '.cgp-frame{width:100%;height:100%;border:0;border-radius:20px;display:block;background:#F7F5F2}' +
      '.cgp-close{position:absolute;top:0;right:-52px;width:40px;height:40px;border-radius:50%;border:0;cursor:pointer;' +
      'background:#fff;color:#2B2D30;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:0}' +
      '.cgp-close:hover{background:#F1EAE2}' +
      '.cgp-close:focus-visible{outline:3px solid #7B5B3A;outline-offset:2px}' +
      '.cgp-close svg{width:18px;height:18px}' +
      '@media (prefers-reduced-motion:reduce){.cgp-overlay,.cgp-box{transition:none}}';
    document.head.appendChild(st);
  }

  function build(lang) {
    css();
    overlay = document.createElement('div');
    overlay.className = 'cgp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', lang === 'de' ? 'Pergola-Konfigurator' : 'Configurateur de pergola');
    overlay.innerHTML =
      '<div class="cgp-box">' +
      '<iframe class="cgp-frame" title="Pergola" allow="geolocation; clipboard-write" loading="eager"></iframe>' +
      '<button type="button" class="cgp-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>';
    frame = overlay.querySelector('iframe');
    closeBtn = overlay.querySelector('.cgp-close');
    closeBtn.setAttribute('aria-label', lang === 'de' ? 'Schließen' : 'Fermer');
    frame.src = configUrl(lang, true);
    currentLang = lang;
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab' && overlay) {                    // Fokus im Popup halten
      var f = [frame, closeBtn];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[1]) { e.preventDefault(); f[0].focus(); }
    }
  }

  function open(opts) {
    var lang = (opts && opts.lang) || DEFAULT_LANG;
    if (window.innerWidth < BOX_MIN_W || window.innerHeight < BOX_MIN_H) {
      location.href = configUrl(lang, false);            // Handy: ganze Seite
      return;
    }
    if (overlay && currentLang !== lang) { overlay.remove(); overlay = null; }
    if (!overlay) build(lang);
    lastFocus = document.activeElement;
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    overlay.style.display = 'flex';
    requestAnimationFrame(function () { overlay.classList.add('open'); frame.focus(); });
    document.addEventListener('keydown', onKey, true);
    track('config_popup_open');
  }

  function close() {
    if (!overlay || overlay.style.display === 'none') return;
    overlay.classList.remove('open');
    document.removeEventListener('keydown', onKey, true);
    document.documentElement.style.overflow = prevOverflow || '';
    setTimeout(function () { if (!overlay.classList.contains('open')) overlay.style.display = 'none'; }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    track('config_popup_close');
  }

  function track(event, params) {
    var p = params || {};
    p.event = event;
    (window.dataLayer = window.dataLayer || []).push(p);
  }

  // Ereignisse aus dem Konfigurator (Schritte, Lead) an GTM/GA4 der Website weitergeben; Esc im Konfigurator schließt
  window.addEventListener('message', function (e) {
    if (!frame || e.source !== frame.contentWindow || !e.data) return;
    if (e.data.type === 'cg-configurator:event') track(e.data.event, Object.assign({}, e.data.params));
    if (e.data.type === 'cg-configurator:close') close();
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-cg-pergola]');
    if (!el) return;
    e.preventDefault();
    open({ lang: el.getAttribute('data-lang') || DEFAULT_LANG });
  });

  window.CGPergola = { open: open, close: close };
})();
