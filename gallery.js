/* Chai Center photo gallery. Renders every .cc-gallery element. No dependencies. */
(function () {
  'use strict';
  if (window.ccGalleryLoaded) { return; }
  window.ccGalleryLoaded = true;

  var CSS = [
    '.cc-gallery{container-type:inline-size;display:block;width:100%;max-width:min(1200px,100%);min-width:0;overflow:hidden;overflow:clip;margin:0 auto;padding:8px 0 24px;box-sizing:border-box;font-family:inherit}',
    '.cc-gallery *{box-sizing:border-box;max-width:100%}',
    '.cc-gallery .ccg-head{text-align:center;margin:0 0 22px}',
    '.cc-gallery .ccg-title{margin:0;padding:0;overflow-wrap:break-word;font-size:clamp(26px,5cqi,40px);line-height:1.15;font-weight:700;color:#3251aa;letter-spacing:.3px}',
    '.cc-gallery .ccg-sub{margin:8px 0 0;font-size:clamp(15px,2.4cqi,19px);color:#42b4b9;font-weight:600;letter-spacing:.6px;text-transform:uppercase}',
    '.cc-gallery .ccg-bar{width:64px;height:4px;border-radius:2px;margin:14px auto 0;background:linear-gradient(90deg,#3251aa,#42b4b9)}',
    '.cc-gallery .ccg-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0;padding:0;list-style:none}',
    '@container (min-width:560px){.cc-gallery .ccg-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}}',
    '@container (min-width:860px){.cc-gallery .ccg-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}}',
    '.cc-gallery .ccg-item{margin:0;padding:0;aspect-ratio:1/1;overflow:hidden;border-radius:10px;background:#e8f5f6;box-shadow:0 1px 3px rgba(20,40,90,.12);list-style:none}',
    '.cc-gallery .ccg-item::before,.cc-gallery .ccg-item::marker{content:none;display:none}',
    '.cc-gallery .ccg-item a{display:block;width:100%;height:100%;cursor:zoom-in;outline-offset:3px}',
    '.cc-gallery .ccg-item img{display:block;width:100%;height:100%;object-fit:cover;margin:0;padding:0;border:0;max-width:none;transition:transform .35s ease,opacity .4s ease;opacity:0}',
    '.cc-gallery .ccg-item img.ccg-in{opacity:1}',
    '.cc-gallery .ccg-item a:hover img,.cc-gallery .ccg-item a:focus-visible img{transform:scale(1.05)}',
    '.cc-gallery .ccg-item a:focus-visible{outline:3px solid #42b4b9}',
    '#cc-gallery-lb{position:fixed;top:0;right:0;bottom:0;left:0;width:auto;height:auto;margin:0;padding:0;max-width:none;z-index:2147483000;background:rgba(8,12,24,.96);display:none;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;touch-action:pan-y;user-select:none;-webkit-user-select:none}',
    '#cc-gallery-lb.ccg-open{display:flex}',
    '#cc-gallery-lb *{box-sizing:border-box}',
    '#cc-gallery-lb .ccg-stage{position:absolute;inset:56px 72px 56px;display:flex;align-items:center;justify-content:center}',
    '#cc-gallery-lb .ccg-big{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.5);transition:opacity .25s ease;-webkit-user-drag:none;pointer-events:none}',
    '#cc-gallery-lb button{position:absolute;margin:0;padding:0;border:0;background:rgba(255,255,255,.12);color:#fff;width:48px;height:48px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s ease;-webkit-tap-highlight-color:transparent;box-shadow:none;min-width:0;min-height:0}',
    '#cc-gallery-lb button:hover,#cc-gallery-lb button:focus-visible{background:#42b4b9;outline:none}',
    '#cc-gallery-lb button svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}',
    '#cc-gallery-lb .ccg-close{top:12px;right:12px}',
    '#cc-gallery-lb .ccg-prev{left:14px;top:50%;transform:translateY(-50%)}',
    '#cc-gallery-lb .ccg-next{right:14px;top:50%;transform:translateY(-50%)}',
    '#cc-gallery-lb .ccg-count{position:absolute;top:22px;left:0;right:0;text-align:center;color:rgba(255,255,255,.85);font-size:15px;letter-spacing:1px;pointer-events:none}',
    '#cc-gallery-lb .ccg-cap{position:absolute;bottom:18px;left:0;right:0;text-align:center;color:rgba(255,255,255,.6);font-size:13px;letter-spacing:.5px;pointer-events:none}',
    '@media (max-width:640px){#cc-gallery-lb .ccg-stage{inset:60px 8px 64px}#cc-gallery-lb .ccg-prev,#cc-gallery-lb .ccg-next{top:auto;bottom:10px;transform:none;width:44px;height:44px}#cc-gallery-lb .ccg-prev{left:18px}#cc-gallery-lb .ccg-next{right:18px}#cc-gallery-lb .ccg-cap{bottom:24px}}'
  ].join('\n');

  var SVGNS = 'http://www.w3.org/2000/svg';
  var ICONS = { close: 'M6 6l12 12M18 6L6 18', prev: 'M15 5l-7 7 7 7', next: 'M9 5l7 7-7 7' };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text) { e.textContent = text; }
    return e;
  }
  function icon(d) {
    var s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }
  function button(cls, label, d) {
    var b = el('button', cls);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.appendChild(icon(d));
    return b;
  }
  function pad(i) { return (i + 1 >= 10 ? '' : '0') + (i + 1) + '.jpg'; }

  /* Shared lightbox */
  var lb, big, cnt, cap, state = null, cur = 0, cache = {}, lastFocus = null, prevOverflow = '';

  function buildLightbox() {
    lb = el('div');
    lb.id = 'cc-gallery-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    cnt = el('div', 'ccg-count');
    var stage = el('div', 'ccg-stage');
    big = el('img', 'ccg-big');
    big.alt = '';
    stage.appendChild(big);
    cap = el('div', 'ccg-cap');
    var bClose = button('ccg-close', 'Close', ICONS.close);
    var bPrev = button('ccg-prev', 'Previous photo', ICONS.prev);
    var bNext = button('ccg-next', 'Next photo', ICONS.next);
    lb.appendChild(cnt); lb.appendChild(stage); lb.appendChild(bClose);
    lb.appendChild(bPrev); lb.appendChild(bNext); lb.appendChild(cap);
    document.body.appendChild(lb);

    bClose.addEventListener('click', close);
    bPrev.addEventListener('click', function () { show(cur - 1); });
    bNext.addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === stage) { close(); }
    });
    lb.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('keydown', function (e) {
      if (!state) { return; }
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowRight') { show(cur + 1); }
      else if (e.key === 'ArrowLeft') { show(cur - 1); }
    });
    var sx = null, sy = 0;
    lb.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) { return; }
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { show(dx > 0 ? cur - 1 : cur + 1); }
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) { close(); }
    }, { passive: true });
  }

  function url(i) { return state.base + pad(i); }
  function preload(i) {
    i = (i + state.n) % state.n;
    var u = url(i);
    if (!cache[u]) { var x = new Image(); x.src = u; cache[u] = x; }
  }
  function show(i) {
    cur = (i + state.n) % state.n;
    var u = url(cur);
    big.style.opacity = '0';
    big.setAttribute('data-u', u);
    var t = new Image();
    t.onload = t.onerror = function () {
      if (big.getAttribute('data-u') !== u) { return; }
      big.src = u; big.style.opacity = '1';
    };
    t.src = u;
    big.alt = state.title + ' photo ' + (cur + 1);
    cnt.textContent = (cur + 1) + ' / ' + state.n;
    preload(cur + 1); preload(cur - 1); preload(cur + 2);
  }
  function open(g, i) {
    if (!lb) { buildLightbox(); }
    state = g;
    lb.setAttribute('aria-label', g.title + ' photos');
    cap.textContent = g.title;
    lastFocus = document.activeElement;
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    lb.className = 'ccg-open';
    show(i);
    lb.querySelector('.ccg-close').focus();
  }
  function close() {
    if (!state) { return; }
    state = null;
    lb.className = '';
    document.documentElement.style.overflow = prevOverflow;
    big.removeAttribute('src'); big.removeAttribute('data-u');
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  function render(root) {
    if (root.getAttribute('data-ready')) { return; }
    var base = root.getAttribute('data-base') || '';
    var n = parseInt(root.getAttribute('data-count'), 10) || 0;
    if (!base || !n) { return; }
    if (base.charAt(base.length - 1) !== '/') { base += '/'; }
    root.setAttribute('data-ready', '1');
    var g = { base: base, n: n, title: root.getAttribute('data-title') || 'Photos' };
    var date = root.getAttribute('data-date') || '';

    while (root.firstChild) { root.removeChild(root.firstChild); }
    var head = el('div', 'ccg-head');
    head.appendChild(el('h2', 'ccg-title', g.title));
    // date line intentionally not shown
    head.appendChild(el('div', 'ccg-bar'));
    root.appendChild(head);

    var grid = el('ul', 'ccg-grid');
    var frag = document.createDocumentFragment();
    for (var i = 0; i !== n; i++) {
      var li = el('li', 'ccg-item');
      var a = el('a');
      a.href = base + pad(i);
      a.setAttribute('data-i', String(i));
      a.setAttribute('aria-label', 'Open photo ' + (i + 1) + ' of ' + n);
      var im = el('img');
      im.loading = 'lazy';
      im.decoding = 'async';
      im.alt = g.title + ' photo ' + (i + 1);
      im.onload = function () { this.className = 'ccg-in'; };
      im.src = base + 'thumbs/' + pad(i);
      a.appendChild(im); li.appendChild(a); frag.appendChild(li);
    }
    grid.appendChild(frag);
    root.appendChild(grid);
    grid.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-i]') : null;
      if (!a) { return; }
      e.preventDefault();
      open(g, parseInt(a.getAttribute('data-i'), 10));
    });
  }

  function init() {
    if (!document.getElementById('cc-gallery-css')) {
      var st = document.createElement('style');
      st.id = 'cc-gallery-css';
      st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    var list = document.querySelectorAll('.cc-gallery[data-base]');
    for (var i = 0; i !== list.length; i++) { render(list[i]); }
  }
  window.ccGalleryInit = init;
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
