(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(n) + ' ₽'; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  var toastEl = $('#toast'), toastTimer;
  function toast(text) {
    if (!toastEl) return;
    toastEl.textContent = text; toastEl.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4500);
  }

  var toggle = $('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      var nav = $('#navigation'); if (nav) nav.classList.toggle('open', open);
    });
  }
  $$('#navigation a').forEach(function (a) {
    a.addEventListener('click', function () {
      var nav = $('#navigation'); if (nav) nav.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  var rate = $('#rate'), days = $('#days');
  if (rate && days) {
    var update = function () {
      var r = Number(rate.value), n = Number(days.value);
      var rv = $('#rate-value'); if (rv) rv.textContent = money(r);
      var dv = $('#days-value');
      if (dv) dv.textContent = n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? 'смена' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'смены' : 'смен'));
      var inc = $('#income'); if (inc) inc.textContent = money(r * n);
    };
    rate.addEventListener('input', update); days.addEventListener('input', update); update();
  }

  var reviewIndex = 0, reviewGrid = $('#reviews-grid');
  function renderReviews() {
    if (!reviewGrid) return;
    var revs = window.GC_REVIEWS || [];
    if (!revs.length) return;
    reviewGrid.innerHTML = Array.from({ length: Math.min(3, revs.length) }, function (_, i) {
      return revs[(reviewIndex + i) % revs.length];
    }).map(function (r) {
      return '<article class="card review"><span class="quote" aria-hidden="true">\u201c</span><blockquote>' + esc(r[2]) + '</blockquote>' +
        '<div class="person"><span class="avatar" aria-hidden="true">' + esc(r[0].split(' ').map(function (x) { return x[0]; }).join('')) + '</span>' +
        '<div><strong>' + esc(r[0]) + '</strong><small>' + esc(r[1]) + '</small></div></div></article>';
    }).join('');
  }
  var next = $('#review-next'), prev = $('#review-prev');
  if (next && reviewGrid && (window.GC_REVIEWS || []).length) {
    next.addEventListener('click', function () { reviewIndex = (reviewIndex + 3) % window.GC_REVIEWS.length; renderReviews(); });
  }
  if (prev && reviewGrid && (window.GC_REVIEWS || []).length) {
    prev.addEventListener('click', function () { reviewIndex = (reviewIndex - 3 + window.GC_REVIEWS.length) % window.GC_REVIEWS.length; renderReviews(); });
  }
  renderReviews();

  window.GCToast = toast;
})();
