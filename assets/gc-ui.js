(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(n) + ' \u20bd'; };

  var rate = document.getElementById('rate'), shifts = document.getElementById('shifts');
  function updateIncome() {
    if (!rate || !shifts) return;
    var rv = document.getElementById('rate-value');
    var sv = document.getElementById('shifts-value');
    var inc = document.getElementById('income');
    if (rv) rv.textContent = money(+rate.value);
    if (sv) sv.textContent = shifts.value;
    if (inc) inc.textContent = money(+rate.value * +shifts.value);
    [rate, shifts].forEach(function (el) {
      var p = ((+el.value - +el.min) / (+el.max - +el.min)) * 100;
      el.style.setProperty('--progress', p + '%');
      el.setAttribute('aria-valuetext', el === rate ? money(+el.value) : el.value + ' \u0441\u043c\u0435\u043d');
    });
  }
  if (rate && shifts) { [rate, shifts].forEach(function (el) { el.addEventListener('input', updateIncome); }); updateIncome(); }

  var faqButtons = $$('.faq-button');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      faqButtons.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        var panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
        var sign = $('.faq-sign', other); if (sign) sign.textContent = '+';
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        var p = document.getElementById(btn.getAttribute('aria-controls'));
        if (p) p.hidden = false;
        var s = $('.faq-sign', btn); if (s) s.textContent = '\u2212';
      }
    });
    btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') || 'false');
  });

  $$('.filters').forEach(function (bar) {
    var btns = $$('[data-filter]', bar);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        var cat = b.dataset.filter;
        $$('[data-category]').forEach(function (card) {
          card.hidden = cat !== 'all' && card.dataset.category !== cat;
        });
      });
    });
  });

  var lastFocus = null;
  window.gcOpenDialog = function (d) {
    if (!d) return;
    lastFocus = document.activeElement;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  };
  $$('dialog').forEach(function (d) {
    var close = $('[data-close]', d);
    if (close) close.addEventListener('click', function () { d.close(); });
    d.addEventListener('close', function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
    d.addEventListener('click', function (e) {
      if (e.target === d) {
        var r = d.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
      }
    });
  });
})();
