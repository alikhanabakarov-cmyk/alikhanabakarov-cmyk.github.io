(function () {
  'use strict';
  var PERSON_ICON = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></svg>';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  function init() {
    var roleBox = document.getElementById('webRoleFilters');
    var metroBox = document.getElementById('webMetroPills');
    var grid = document.getElementById('mainVacanciesGrid');
    if (!grid) return;
    var role = (roleBox && roleBox.querySelector('.active') && roleBox.querySelector('.active').dataset.role) || 'all';
    var metro = (metroBox && metroBox.querySelector('.active') && metroBox.querySelector('.active').dataset.metro) || 'all';
    var live = [];

    function cardHTML(it) {
      var rate = it.rate || it.rateText || '5 500 \u20bd';
      var metroText = it.metro || '\u043c. \u0426\u0435\u043d\u0442\u0440';
      var schedule = it.schedule || it.urgency || '\u0421\u043c\u0435\u043d\u043d\u044b\u0439 \u0433\u0440\u0430\u0444\u0438\u043a';
      var venue = it.venue || it.restaurant || '\u0420\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442';
      var roleText = it.role || '\u0421\u043c\u0435\u043d\u0430';
      return '<article class="card listing">' +
        '<div class="listing-top"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></svg><span class="tag">' + esc(roleText) + '</span></div>' +
        '<h3>' + esc(it.title || roleText) + '</h3>' +
        '<p class="small">' + esc(venue) + '<br>' + esc(metroText) + ' \u00b7 ' + esc(schedule) + '</p>' +
        '<span class="price">' + esc(rate) + ' <span class="small">/ \u0441\u043c\u0435\u043d\u0430</span></span>' +
        '<a class="btn btn-outline" href="/auth/?mode=signup&role=worker">\u041e\u0442\u043a\u043b\u0438\u043a\u043d\u0443\u0442\u044c\u0441\u044f</a>' +
        '</article>';
    }

    function paint() {
      var items = live;
      if (role !== 'all') items = items.filter(function (it) { var t = ((it.title || '') + ' ' + (it.role || '')).toLowerCase(); return t.indexOf(role) !== -1; });
      if (metro !== 'all') items = items.filter(function (it) { return (it.metro || '').toLowerCase().indexOf(metro) !== -1; });
      if (live.length && items.length) {
        grid.innerHTML = items.slice(0, 12).map(cardHTML).join('');
        return;
      }
      Array.prototype.forEach.call(grid.children, function (card) {
        var text = card.textContent.toLowerCase();
        var ok = (role === 'all' || text.indexOf(role) !== -1) && (metro === 'all' || text.indexOf(metro) !== -1);
        card.hidden = !ok;
      });
    }

    function chip(btn, box, key, value, onBg, onColor, offBg, offColor) {
      Array.prototype.forEach.call(box.querySelectorAll('button'), function (b) {
        b.classList.remove('active'); b.style.background = offBg; b.style.color = offColor;
      });
      btn.classList.add('active'); btn.style.background = onBg; btn.style.color = onColor;
      if (key === 'role') role = value; else metro = value;
      paint();
    }

    if (roleBox) roleBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.role) chip(b, roleBox, 'role', b.dataset.role, 'var(--gold)', 'var(--bg)', 'transparent', 'var(--muted)'); });
    if (metroBox) metroBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.metro) chip(b, metroBox, 'metro', b.dataset.metro, 'var(--gold)', 'var(--bg)', 'transparent', 'var(--muted)'); });

    (function load() {
      Promise.allSettled([fetch('/api/telegram/jobs'), fetch('/api/sos/list')]).then(function (res) {
        if (res[0].status === 'fulfilled' && res[0].value.ok) res[0].value.json().then(function (d) { live = (d.items || []).concat(live); paint(); }).catch(function () {});
        if (res[1].status === 'fulfilled' && res[1].value.ok) res[1].value.json().then(function (d) { live = (d.shifts || []).concat(live); paint(); }).catch(function () {});
      });
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
