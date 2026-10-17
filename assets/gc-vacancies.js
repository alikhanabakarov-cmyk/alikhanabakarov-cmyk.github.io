(function () {
  'use strict';

  function escapeText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initInteractiveFilters() {
    var roleContainer = document.getElementById('webRoleFilters');
    var metroContainer = document.getElementById('webMetroPills');
    var grid = document.getElementById('mainVacanciesGrid');
    if (!roleContainer || !metroContainer || !grid) return;

    var selectedRole = 'all';
    var selectedMetro = 'all';
    var loadedShifts = [];
    var sosShifts = [];

    async function fetchDynamicShifts() {
      try {
        var results = await Promise.allSettled([
          fetch('/api/telegram/jobs'),
          fetch('/api/sos/list')
        ]);
        if (results[0].status === 'fulfilled' && results[0].value.ok) {
          var data = await results[0].value.json();
          loadedShifts = data.items || [];
        }
        if (results[1].status === 'fulfilled' && results[1].value.ok) {
          var sos = await results[1].value.json();
          sosShifts = sos.shifts || [];
        }
      } catch (e) {
        console.warn('Dynamic shifts load notice:', e);
      }
    }

    function applyFilters() {
      if (loadedShifts.length > 0 || sosShifts.length > 0) {
        var items = sosShifts.concat(loadedShifts);
        if (selectedRole !== 'all') {
          items = items.filter(function (it) {
            var t = (it.title || '').toLowerCase();
            var r = (it.role || '').toLowerCase();
            return t.indexOf(selectedRole) !== -1 || r.indexOf(selectedRole) !== -1;
          });
        }
        if (selectedMetro !== 'all') {
          items = items.filter(function (it) {
            return (it.metro || '').toLowerCase().indexOf(selectedMetro) !== -1;
          });
        }
        if (items.length > 0) {
          grid.innerHTML = items.slice(0, 12).map(function (item) {
            var isSos = Boolean(item.urgency || (item.badge && item.badge.indexOf('SOS') !== -1) || (item.id && item.id.indexOf('sos-') === 0));
            var rateText = item.rate || item.rateText || '5 500 ₽';
            var metroText = item.metro || 'м. Центр';
            var perks = item.perks || (Array.isArray(item.benefits) ? item.benefits.join(', ') : 'Питание, форма, такси');
            var schedule = item.schedule || item.urgency || 'Сменный график';
            var venue = item.venue || item.restaurant || 'Ресторанный проект';
            return '' +
              '<article class="vacancy-card ' + (isSos ? 'vacancy-card-featured' : '') + '"' + (isSos ? ' style="border:2px solid #ef4444;background:linear-gradient(180deg,rgba(239,68,68,0.06) 0%,rgba(6,46,41,0.95) 100%);"' : '') + '>' +
                '<div>' +
                  '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                    '<span class="vacancy-role-tag"' + (isSos ? ' style="background:#ef4444;color:#fff;"' : '') + '>' + (isSos ? '🚨 СРОЧНЫЙ ВЫХОД' : escapeText(item.role || 'Смена')) + '</span>' +
                    (isSos ? '<span style="font-size:11px;font-weight:800;color:#fca5a5;">Расчет сразу</span>' : '') +
                  '</div>' +
                  '<h3 class="vacancy-title">' + escapeText(item.title || item.role) + '</h3>' +
                  '<div style="font-size:13px;color:var(--gold);margin-bottom:8px;font-weight:700;">' + escapeText(venue) + '</div>' +
                  '<div class="vacancy-rate-box"><span class="vacancy-rate-label">Ставка за смену</span><span class="vacancy-rate-val"' + (isSos ? ' style="color:#f87171;"' : '') + '>' + escapeText(rateText) + '</span></div>' +
                  '<div class="tg-job-meta" style="margin-bottom:14px;display:flex;flex-wrap:wrap;gap:8px;">' +
                    '<span class="tg-meta-item" style="font-size:13px;font-weight:700;color:var(--ink);background:rgba(27,74,52,0.3);padding:4px 10px;border-radius:6px;">📍 ' + escapeText(metroText) + '</span>' +
                    '<span class="tg-meta-item" style="font-size:13px;font-weight:700;color:var(--gold);background:rgba(197,163,103,0.12);padding:4px 10px;border-radius:6px;">⏰ ' + escapeText(schedule) + '</span>' +
                  '</div>' +
                  '<ul class="vacancy-perks-list"><li>' + escapeText(perks) + '</li><li>Официальное сотрудничество и надежные выплаты</li></ul>' +
                '</div>' +
                '<div class="vacancy-actions" style="display:flex;gap:8px;flex-wrap:wrap;">' +
                  '<a class="btn primary" href="/telegram-app" style="flex:1;text-align:center;font-weight:800;' + (isSos ? 'background:#ef4444;border-color:#ef4444;' : '') + '">⚡️ Откликнуться в 1 клик</a>' +
                  '<a class="btn" href="https://t.me/gastroconnect" target="_blank" rel="noopener noreferrer" style="padding:10px 14px;font-size:13px;">💬 Чат</a>' +
                '</div>' +
              '</article>';
          }).join('');
          return;
        }
      }
      grid.querySelectorAll('.vacancy-card').forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var roleMatch = selectedRole === 'all' || text.indexOf(selectedRole) !== -1;
        var metroMatch = selectedMetro === 'all' || text.indexOf(selectedMetro) !== -1;
        card.style.display = (roleMatch && metroMatch) ? '' : 'none';
      });
    }

    roleContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-chip-btn');
      if (!btn) return;
      roleContainer.querySelectorAll('.filter-chip-btn').forEach(function (b) {
        b.classList.remove('active');
        b.style.background = 'rgba(255,255,255,0.05)';
        b.style.color = 'var(--text)';
        b.style.borderColor = 'rgba(255,255,255,0.1)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--green)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--green)';
      selectedRole = btn.dataset.role;
      applyFilters();
    });

    metroContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.metro-filter-pill');
      if (!btn) return;
      metroContainer.querySelectorAll('.metro-filter-pill').forEach(function (b) {
        b.classList.remove('active');
        b.style.background = 'rgba(255,255,255,0.04)';
        b.style.color = 'var(--muted)';
        b.style.borderColor = 'rgba(255,255,255,0.1)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--gold)';
      btn.style.color = '#0b211a';
      btn.style.borderColor = 'var(--gold)';
      selectedMetro = btn.dataset.metro;
      applyFilters();
    });

    fetchDynamicShifts().then(applyFilters);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initInteractiveFilters);
  else initInteractiveFilters();
})();
