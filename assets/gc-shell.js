(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  var toastEl = $('#toast'), toastTimer;
  function toast(text) {
    if (!toastEl) return;
    toastEl.textContent = text; toastEl.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4500);
  }
  window.GCToast = toast;

  var nav = $('#navigation'), toggle = $('.menu-toggle');
  function closeNav() {
    if (nav) nav.classList.remove('open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Открыть меню'); }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('#navigation a'), function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.header')) closeNav(); });

  var idx = 0, grid = document.getElementById('reviews-grid');
  function render() {
    if (!grid) return;
    var revs = window.GC_REVIEWS || [];
    if (!revs.length) return;
    var n = Math.min(3, revs.length), html = '';
    for (var i = 0; i < n; i++) {
      var k = (idx + i) % revs.length, r = revs[k], num = String(k + 1).padStart(2, '0');
      html += '<article class="card review"><div class="review-top"><img class="avatar" src="/assets/review-' + num + '.webp" width="44" height="44" alt="" loading="lazy"><div><h3>' + esc(r[0]) + '</h3><span class="small">' + esc(r[1]) + '</span></div></div><p>' + esc(r[2]) + '</p></article>';
    }
    grid.innerHTML = html;
  }
  var next = document.getElementById('review-next'), prev = document.getElementById('review-prev');
  if (next && grid) next.addEventListener('click', function () { var revs = window.GC_REVIEWS || []; if (revs.length) { idx = (idx + 3) % revs.length; render(); } });
  if (prev && grid) prev.addEventListener('click', function () { var revs = window.GC_REVIEWS || []; if (revs.length) { idx = (idx - 3 + revs.length * 4) % revs.length; render(); } });
  render();
})();
