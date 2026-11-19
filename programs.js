(function () {
  var MENORAH = 'https://www.chabadhome.com/civicrm/event/register?reset=1&id=58';
  var LATKES = 'https://www.chabadhome.com/civicrm/event/register?reset=1&id=59';
  var TILES = [
    { uuid: '046e7a57-d7fa-4a56-a5d3-10440dda5002', tile: null,
      buttons: [['Menorah Lighting', MENORAH], ['Women\u2019s Latkes & Lights', LATKES]] },
    { uuid: 'f2c3ed5a-d60d-4647-91b4-0a4787f5d88c', tile: '/jewish-womens-circle',
      buttons: [['Latkes & Lights Registration', LATKES]] }
  ];
  function css() {
    if (document.getElementById('cc-prog-btn-css')) return;
    var s = document.createElement('style');
    s.id = 'cc-prog-btn-css';
    s.textContent =
      '.cc-prog-tile{cursor:default}' +
      '.cc-prog-tile.cc-click{cursor:pointer}' +
      '.cc-prog-tile .s-sec-item-static-title{flex-direction:column!important;align-items:flex-start!important;justify-content:flex-end!important;gap:10px}' +
      '.cc-prog-btns{display:flex;flex-wrap:wrap;gap:8px;position:relative;z-index:3}' +
      '.cc-prog-btns a{display:inline-block;padding:9px 14px;border-radius:6px;font:600 13px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.02em;text-decoration:none!important;background:#C9A227;color:#fff!important;box-shadow:0 2px 8px rgba(0,0,0,.25);transition:transform .2s ease,background .2s ease}' +
      '.cc-prog-btns a:hover{background:#b38f1f;transform:translateY(-1px)}' +
      '.cc-prog-btns a.cc-alt{background:rgba(255,255,255,.95);color:#1B3A6B!important}' +
      '.cc-prog-btns a.cc-alt:hover{background:#fff}';
    document.head.appendChild(s);
  }
  function build(cfg) {
    var a = document.querySelector('#section-68 a.s-sec-item-wrapper[data-uuid="' + cfg.uuid + '"]');
    if (!a) return false;
    var d = document.createElement('div');
    d.className = a.className + ' cc-prog-tile';
    d.setAttribute('data-uuid', cfg.uuid);
    while (a.firstChild) d.appendChild(a.firstChild);
    var t = d.querySelector('.s-sec-item-static-title');
    if (!t) { t = document.createElement('div'); t.className = 's-sec-item-static-title'; d.appendChild(t); }
    var bar = document.createElement('div');
    bar.className = 'cc-prog-btns';
    cfg.buttons.forEach(function (b, i) {
      var l = document.createElement('a');
      l.href = b[1];
      l.textContent = b[0];
      if (i > 0) l.className = 'cc-alt';
      l.addEventListener('click', function (e) { e.stopPropagation(); });
      bar.appendChild(l);
    });
    t.appendChild(bar);
    if (cfg.tile) {
      d.className += ' cc-click';
      d.addEventListener('click', function () { window.location.href = cfg.tile; });
    }
    a.parentNode.replaceChild(d, a);
    return true;
  }
  function run() { css(); TILES.forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
