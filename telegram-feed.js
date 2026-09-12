// GastroConnect Telegram Live Jobs Feed Controller
(function () {
  const feedState = {
    channel: 'Povaramoscow',
    search: '',
    role: 'all',
    metro: '',
    minRate: 0,
    sortBy: 'date_desc',
    isLoading: false,
    items: [],
    lastUpdated: null,
    totalCount: 0,
    filteredCount: 0
  };

  let debounceTimer = null;

  function initTelegramFeed() {
    const container = document.getElementById('telegramJobsFeed');
    if (!container) return;

    // Attach search input handler
    const searchInput = document.getElementById('tgSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          feedState.search = e.target.value.trim();
          loadTelegramJobs();
        }, 300);
      });
    }

    // Attach role select & role chips
    const roleSelect = document.getElementById('tgRoleSelect');
    if (roleSelect) {
      roleSelect.addEventListener('change', function (e) {
        setRoleFilter(e.target.value);
      });
    }

    // Role chips
    const roleChips = document.querySelectorAll('.tg-role-chip');
    roleChips.forEach(chip => {
      chip.addEventListener('click', function () {
        const role = this.getAttribute('data-role') || 'all';
        setRoleFilter(role);
        if (roleSelect) roleSelect.value = role;
      });
    });

    // Attach sort select
    const sortSelect = document.getElementById('tgSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', function (e) {
        feedState.sortBy = e.target.value;
        loadTelegramJobs();
      });
    }

    // Attach rate select
    const rateSelect = document.getElementById('tgRateSelect');
    if (rateSelect) {
      rateSelect.addEventListener('change', function (e) {
        feedState.minRate = parseInt(e.target.value, 10) || 0;
        loadTelegramJobs();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('tgRefreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        loadTelegramJobs(true);
      });
    }

    // Initial load
    loadTelegramJobs();
  }

  function setRoleFilter(role) {
    feedState.role = role;
    const roleChips = document.querySelectorAll('.tg-role-chip');
    roleChips.forEach(chip => {
      if (chip.getAttribute('data-role') === role) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
    loadTelegramJobs();
  }

  async function loadTelegramJobs(forceRefresh = false) {
    const listContainer = document.getElementById('tgJobsList');
    const statsContainer = document.getElementById('tgFeedStats');
    const refreshBtn = document.getElementById('tgRefreshBtn');

    if (!listContainer) return;

    feedState.isLoading = true;
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.textContent = '⏳ Синхронизация...';
    }

    listContainer.innerHTML = `
      <div class="tg-loading-spinner" style="grid-column: 1 / -1;">
        <div class="tg-spinner-icon"></div>
        <span>Подключение к потоку @${feedState.channel} и разбор вакансий...</span>
      </div>
    `;

    try {
      const params = new URLSearchParams({
        channel: feedState.channel,
        search: feedState.search,
        role: feedState.role,
        minRate: feedState.minRate.toString(),
        sortBy: feedState.sortBy,
        refresh: forceRefresh ? 'true' : 'false'
      });

      const response = await fetch(`/api/telegram/jobs?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        feedState.items = data.items || [];
        feedState.totalCount = data.totalCount || 0;
        feedState.filteredCount = data.filteredCount || 0;
        feedState.lastUpdated = data.lastUpdated;

        renderTelegramCards(feedState.items, listContainer);
        renderStats(statsContainer, data);
      } else {
        listContainer.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--muted);">
            Не удалось загрузить данные из Telegram: ${data.message || 'Ошибка сети'}
          </div>
        `;
      }
    } catch (err) {
      console.error('Failed to load telegram jobs:', err);
      listContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--muted);">
          Ошибка синхронизации с каналом @${feedState.channel}. Попробуйте обновить страницу.
        </div>
      `;
    } finally {
      feedState.isLoading = false;
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄 Обновить из TG';
      }
    }
  }

  function renderStats(container, data) {
    if (!container) return;
    const timeFormatted = data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : 'сейчас';
    container.innerHTML = `
      <span class="tg-feed-stats-text">
        Найдено: <strong>${data.filteredCount}</strong> из ${data.totalCount} вакансий • Обновлено в ${timeFormatted}
      </span>
      <span style="font-size: 13px; color: var(--muted); font-weight: 700;">
        Источник: <a href="https://t.me/${data.channel}" target="_blank" rel="noopener" style="color: #2aabee; font-weight: 800;">@${data.channel}</a>
      </span>
    `;
  }

  function formatTimeAgo(dateString) {
    if (!dateString) return 'только что';
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return 'Вчера';
    return `${diffDays} дн назад`;
  }

  function renderTelegramCards(items, container) {
    if (!items || items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--card); border: 1px dashed var(--line); border-radius: 20px; padding: 48px 24px; text-align: center;">
          <h4 style="margin: 0 0 8px; color: var(--green); font-size: 20px; font-weight: 900;">По вашим критериям вакансий не найдено</h4>
          <p style="margin: 0 0 16px; color: var(--muted); font-size: 15px;">Попробуйте сбросить фильтры цеха или изменить поисковый запрос.</p>
          <button class="btn primary" onclick="window.resetTgFilters()" type="button">Сбросить все фильтры</button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map((item, index) => {
      const timeAgo = formatTimeAgo(item.date);
      const tgUsername = item.contacts?.telegram || 'Povaramoscow';
      const tgLink = `https://t.me/${tgUsername.replace('@', '')}`;
      const phoneLink = item.contacts?.phone ? `tel:${item.contacts.phone}` : null;
      const cardId = `tg-card-${item.id || index}`;

      return `
        <article class="tg-job-card" id="${cardId}">
          <div>
            <div class="tg-job-card-top">
              <a class="tg-post-origin" href="${item.postUrl || tgLink}" target="_blank" rel="noopener">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                @${item.channel}
              </a>
              <span class="tg-post-time">${timeAgo}</span>
            </div>

            <h3 class="tg-job-title">${escapeHtml(item.title)}</h3>

            <div class="tg-rate-badge">
              ${escapeHtml(item.rateText)}
            </div>

            <div class="tg-meta-tags">
              <span class="tg-meta-tag">📍 ${escapeHtml(item.metro)}</span>
              <span class="tg-meta-tag">⏰ ${escapeHtml(item.schedule)}</span>
              <span class="tg-meta-tag" style="background: rgba(6, 76, 59, 0.08); color: var(--green);">🏷️ ${escapeHtml(item.role)}</span>
            </div>

            <ul class="tg-benefits-list">
              ${item.benefits.slice(0, 3).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>

            <button class="tg-accordion-toggle" onclick="window.toggleTgRawText('${cardId}')" type="button">
              📄 Показать текст поста из Telegram
            </button>

            <div class="tg-raw-text" id="${cardId}-raw">${escapeHtml(item.rawText)}</div>
          </div>

          <div class="tg-job-actions">
            <a class="btn btn-contact-tg" href="${tgLink}" target="_blank" rel="noopener">
              💬 Написать в TG
            </a>
            ${phoneLink ? `
              <a class="btn" href="${phoneLink}">
                📞 ${item.contacts.phone}
              </a>
            ` : `
              <a class="btn" href="${item.postUrl || tgLink}" target="_blank" rel="noopener">
                ↗️ Открыть пост
              </a>
            `}
          </div>
        </article>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global helpers
  window.toggleTgRawText = function (cardId) {
    const rawElem = document.getElementById(`${cardId}-raw`);
    if (rawElem) {
      const isVisible = rawElem.style.display === 'block';
      rawElem.style.display = isVisible ? 'none' : 'block';
    }
  };

  window.resetTgFilters = function () {
    const searchInput = document.getElementById('tgSearchInput');
    const roleSelect = document.getElementById('tgRoleSelect');
    const rateSelect = document.getElementById('tgRateSelect');
    const sortSelect = document.getElementById('tgSortSelect');

    if (searchInput) searchInput.value = '';
    if (roleSelect) roleSelect.value = 'all';
    if (rateSelect) rateSelect.value = '0';
    if (sortSelect) sortSelect.value = 'date_desc';

    feedState.search = '';
    feedState.role = 'all';
    feedState.minRate = 0;
    feedState.sortBy = 'date_desc';

    const roleChips = document.querySelectorAll('.tg-role-chip');
    roleChips.forEach(c => c.classList.remove('active'));
    const allChip = document.querySelector('.tg-role-chip[data-role="all"]');
    if (allChip) allChip.classList.add('active');

    loadTelegramJobs();
  };

  // Run on DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegramFeed);
  } else {
    initTelegramFeed();
  }
})();
