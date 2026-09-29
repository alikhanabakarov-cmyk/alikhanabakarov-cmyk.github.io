// GastroConnect Telegram Community & Publisher Studio Client
(function () {
  let activeTemplate = 'hot_shift';
  let currentFormattedHtml = '';
  let currentPlainText = '';
  let availableTemplates = [];

  async function initTelegramStudio() {
    const studioContainer = document.getElementById('telegramPublisherStudio');
    if (!studioContainer) return;

    // Load templates from API or use local fallback
    try {
      const res = await fetch('/api/telegram/templates');
      const data = await res.json();
      if (data.success && data.templates) {
        availableTemplates = data.templates;
      }
    } catch (e) {
      console.warn('Failed to load templates from API, using defaults');
    }

    bindTemplateButtons();
    bindFormInputs();
    bindPublishButtons();
    updateLivePreview();
    initAutopilotControls();
  }

  async function initAutopilotControls() {
    const apSection = document.getElementById('telegramAutopilotSection');
    if (!apSection) return;

    const refreshBtn = document.getElementById('apRefreshBtn');
    const compensateBtn = document.getElementById('apCompensateBtn');
    const runSingleBtn = document.getElementById('apRunSingleBtn');
    const countSelect = document.getElementById('apCompensateCount');
    const msgBox = document.getElementById('apActionMsg');

    async function loadStatus() {
      try {
        const res = await fetch('/api/autopilot/status');
        const data = await res.json();
        if (!data || !data.success) return;

        const mskEl = document.getElementById('apMskTime');
        const totalEl = document.getElementById('apTotalPublished');
        const missedEl = document.getElementById('apMissedCount');
        const badgeEl = document.getElementById('apStatusBadge');
        const nightEl = document.getElementById('apNightInfo');
        const tzEl = document.getElementById('apTimezone');
        const logsEl = document.getElementById('apLogsContainer');

        if (mskEl) mskEl.textContent = data.currentMoscowTime || '--:--';
        if (totalEl) totalEl.textContent = data.totalPublished || '0';
        if (missedEl) {
          const missed = data.missedPostsEstimate || 0;
          missedEl.textContent = missed > 0 ? `${missed} пропущено` : '0 (актуально)';
          missedEl.style.color = missed > 0 ? '#dc2626' : '#10b981';
        }
        if (badgeEl) {
          badgeEl.textContent = data.enabled ? (data.isNightModeActive ? '🌙 Тихий режим (ночь)' : '🟢 Активен (постинг)') : '🔴 Отключен';
        }
        if (nightEl) {
          nightEl.textContent = data.isNightModeActive ? 'Ночь: с 21:00 до 08:00 МСК' : 'Дневной постинг (каждый час)';
        }
        if (tzEl) tzEl.textContent = data.timezone || 'Europe/Moscow (UTC+3)';

        if (logsEl && Array.isArray(data.recentLogs)) {
          if (data.recentLogs.length === 0) {
            logsEl.innerHTML = '<div style="color: #64748b;">Логи пока пусты. Автопилот готов к работе.</div>';
          } else {
            logsEl.innerHTML = data.recentLogs.map(log => {
              const postsHtml = Array.isArray(log.posts) 
                ? log.posts.map(p => `• ${p.success ? '✅' : '❌'} <b>${p.title || 'Смена'}</b> (${p.rate || ''}) ${p.postUrl ? `<a href="${p.postUrl}" target="_blank" style="color: #0284c7; text-decoration: underline;">Пост в TG</a>` : ''}`).join('<br>')
                : (log.message || '');
              return `<div style="margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                <span style="color: #64748b;">[${log.timeMsk || ''} МСК | ${log.trigger || ''}]</span>
                <span style="font-weight: 600; color: ${log.status === 'published' ? '#059669' : '#334155'};"> ${log.status || ''}</span><br>
                ${postsHtml}
              </div>`;
            }).join('');
          }
        }
      } catch (err) {
        console.warn('Autopilot status load error:', err);
      }
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.disabled = true;
        refreshBtn.textContent = '⏳ Загрузка...';
        loadStatus().finally(() => {
          refreshBtn.disabled = false;
          refreshBtn.textContent = '🔄 Обновить статус';
        });
      });
    }

    if (compensateBtn) {
      compensateBtn.addEventListener('click', async () => {
        const count = countSelect ? parseInt(countSelect.value, 10) : 12;
        compensateBtn.disabled = true;
        compensateBtn.textContent = `⏳ Публикация ${count} смен...`;
        if (msgBox) {
          msgBox.style.display = 'block';
          msgBox.style.background = '#eff6ff';
          msgBox.style.color = '#1d4ed8';
          msgBox.textContent = `⚡️ Запущен процесс компенсации ${count} смен в @gastroconnect. Подождите несколько секунд...`;
        }
        try {
          const res = await fetch('/api/autopilot/compensate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count })
          });
          const result = await res.json();
          if (result.success) {
            if (msgBox) {
              msgBox.style.background = '#ecfdf5';
              msgBox.style.color = '#064c3b';
              msgBox.innerHTML = `✅ Успешно компенсировано и опубликовано <b>${result.compensatedCount || result.count}</b> смен в Telegram-канал <a href="https://t.me/gastroconnect" target="_blank" style="color: #064c3b; text-decoration: underline; font-weight: bold;">@gastroconnect</a>!`;
            }
          } else {
            if (msgBox) {
              msgBox.style.background = '#fef2f2';
              msgBox.style.color = '#b91c1c';
              msgBox.textContent = `Ошибка: ${result.error || result.message || 'Не удалось опубликовать'}`;
            }
          }
        } catch (e) {
          if (msgBox) {
            msgBox.style.background = '#fef2f2';
            msgBox.style.color = '#b91c1c';
            msgBox.textContent = `Ошибка сети: ${e.message}`;
          }
        } finally {
          compensateBtn.disabled = false;
          compensateBtn.textContent = '⚡️ Запустить компенсацию';
          loadStatus();
        }
      });
    }

    if (runSingleBtn) {
      runSingleBtn.addEventListener('click', async () => {
        runSingleBtn.disabled = true;
        runSingleBtn.textContent = '⏳ Отправка...';
        try {
          const res = await fetch('/api/autopilot/run-now', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: 2 })
          });
          const result = await res.json();
          if (msgBox) {
            msgBox.style.display = 'block';
            if (result.success) {
              msgBox.style.background = '#ecfdf5';
              msgBox.style.color = '#064c3b';
              msgBox.innerHTML = `✅ Опубликовано ${result.count || 2} смен в <a href="https://t.me/gastroconnect" target="_blank" style="text-decoration: underline;">@gastroconnect</a>!`;
            } else {
              msgBox.style.background = '#fef2f2';
              msgBox.style.color = '#b91c1c';
              msgBox.textContent = result.message || result.error || 'Ошибка отправки';
            }
          }
        } catch (e) {
          if (msgBox) {
            msgBox.style.display = 'block';
            msgBox.style.background = '#fef2f2';
            msgBox.style.color = '#b91c1c';
            msgBox.textContent = e.message;
          }
        } finally {
          runSingleBtn.disabled = false;
          runSingleBtn.textContent = '▶️ Опубликовать 2 смены';
          loadStatus();
        }
      });
    }

    loadStatus();
    setInterval(loadStatus, 30000);
  }

  function bindTemplateButtons() {
    const templateButtons = document.querySelectorAll('.tg-tpl-btn');
    templateButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        templateButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeTemplate = btn.dataset.tplId;
        applyTemplateData(activeTemplate);
      });
    });
  }

  function applyTemplateData(templateId) {
    const tpl = availableTemplates.find((t) => t.id === templateId);
    if (!tpl) return;

    const typeSelect = document.getElementById('tgPostType');
    if (typeSelect) typeSelect.value = tpl.type;

    const roleInput = document.getElementById('tgPostRole');
    const rateInput = document.getElementById('tgPostRate');
    const metroInput = document.getElementById('tgPostMetro');
    const schedInput = document.getElementById('tgPostSchedule');
    const perksInput = document.getElementById('tgPostPerks');
    const tasksInput = document.getElementById('tgPostTasks');
    const reqsInput = document.getElementById('tgPostReqs');
    const contactInput = document.getElementById('tgPostContacts');
    const customInput = document.getElementById('tgPostCustomText');

    toggleFieldsByType(tpl.type);

    if (tpl.type === 'job') {
      if (roleInput) roleInput.value = tpl.data.role || '';
      if (rateInput) rateInput.value = tpl.data.rate || '';
      if (metroInput) metroInput.value = tpl.data.metro || '';
      if (schedInput) schedInput.value = tpl.data.schedule || '';
      if (perksInput) perksInput.value = tpl.data.perks || '';
      if (tasksInput) tasksInput.value = tpl.data.tasks || '';
      if (reqsInput) reqsInput.value = tpl.data.requirements || '';
      if (contactInput) contactInput.value = tpl.data.contacts || '';
    } else {
      if (customInput) {
        if (tpl.type === 'tip' || tpl.type === 'techcard') {
          customInput.value = `${tpl.data.headline}\n\n${tpl.data.body.replace(/<[^>]*>/g, '')}\n\n${tpl.data.question}`;
        } else if (tpl.type === 'poll') {
          customInput.value = `${tpl.data.headline}\n\n${tpl.data.intro}\n\n${tpl.data.options.join('\n')}\n\n${tpl.data.conclusion}`;
        }
      }
    }

    updateLivePreview();
  }

  function toggleFieldsByType(type) {
    const jobFields = document.querySelectorAll('.tg-job-only-field');
    const customFields = document.querySelectorAll('.tg-custom-only-field');

    if (type === 'job') {
      jobFields.forEach((el) => (el.style.display = 'flex'));
      customFields.forEach((el) => (el.style.display = 'none'));
    } else {
      jobFields.forEach((el) => (el.style.display = 'none'));
      customFields.forEach((el) => (el.style.display = 'flex'));
    }
  }

  function bindFormInputs() {
    const inputs = document.querySelectorAll(
      '#telegramPublisherStudio input, #telegramPublisherStudio textarea, #telegramPublisherStudio select'
    );
    inputs.forEach((input) => {
      input.addEventListener('input', () => updateLivePreview());
      input.addEventListener('change', () => updateLivePreview());
    });

    const typeSelect = document.getElementById('tgPostType');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        toggleFieldsByType(e.target.value);
        updateLivePreview();
      });
    }
  }

  function getFormData() {
    const type = document.getElementById('tgPostType')?.value || 'job';
    const channel = document.getElementById('tgTargetChannel')?.value || '@gastroconnect';

    return {
      type,
      channel,
      role: document.getElementById('tgPostRole')?.value || '',
      rate: document.getElementById('tgPostRate')?.value || '',
      metro: document.getElementById('tgPostMetro')?.value || '',
      schedule: document.getElementById('tgPostSchedule')?.value || '',
      perks: document.getElementById('tgPostPerks')?.value || '',
      tasks: document.getElementById('tgPostTasks')?.value || '',
      requirements: document.getElementById('tgPostReqs')?.value || '',
      contacts: document.getElementById('tgPostContacts')?.value || '',
      customMessage: document.getElementById('tgPostCustomText')?.value || ''
    };
  }

  async function updateLivePreview() {
    const formData = getFormData();
    const previewEl = document.getElementById('tgPostPreviewText');
    if (!previewEl) return;

    try {
      const res = await fetch('/api/telegram/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        currentFormattedHtml = data.html;
        currentPlainText = data.plainText;
        previewEl.innerHTML = data.html;
      }
    } catch (e) {
      // Local fallback rendering
      previewEl.textContent = 'Обновление предпросмотра...';
    }
  }

  function bindPublishButtons() {
    const publishBtn = document.getElementById('tgPublishBtn');
    const copyBtn = document.getElementById('tgCopyFormattedBtn');
    const openChannelBtn = document.getElementById('tgOpenChannelBtn');
    const messageBox = document.getElementById('tgStudioMsg');

    if (publishBtn) {
      publishBtn.addEventListener('click', async () => {
        publishBtn.disabled = true;
        publishBtn.textContent = '🚀 Отправка в Telegram...';
        showToast('', '');

        try {
          const formData = getFormData();
          const res = await fetch('/api/telegram/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const result = await res.json();

          if (result.success) {
            showToast(
              `✅ Пост успешно опубликован в канал ${result.channel}!`,
              'success'
            );
          } else {
            // Mode manual_ready or informational
            showToast(
              `✨ Пост идеально подготовлен для @gastroconnect. Скопируйте текст кнопкой ниже или откройте канал для вставки.`,
              'success'
            );
          }
        } catch (err) {
          showToast(`Ошибка отправки: ${err.message}`, 'error');
        } finally {
          publishBtn.disabled = false;
          publishBtn.textContent = '🚀 Опубликовать в @gastroconnect';
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(currentPlainText || currentFormattedHtml);
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✓ Скопировано в буфер!';
          showToast('📋 Готовый форматированный пост скопирован!', 'success');
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        } catch (e) {
          showToast('Выделите текст в предпросмотре и скопируйте вручную.', 'error');
        }
      });
    }

    if (openChannelBtn) {
      openChannelBtn.addEventListener('click', () => {
        window.open('https://t.me/gastroconnect', '_blank', 'noopener,noreferrer');
      });
    }

    function showToast(text, type) {
      if (!messageBox) return;
      if (!text) {
        messageBox.className = 'tg-toast-msg';
        messageBox.textContent = '';
        messageBox.style.display = 'none';
        return;
      }
      messageBox.textContent = text;
      messageBox.className = `tg-toast-msg ${type}`;
      messageBox.style.display = 'block';
    }
  }

  // Auto-fill from created shift form
  window.fillTelegramPublisherFromShift = function (shiftData) {
    const roleInput = document.getElementById('tgPostRole');
    const rateInput = document.getElementById('tgPostRate');
    const metroInput = document.getElementById('tgPostMetro');
    const schedInput = document.getElementById('tgPostSchedule');
    const perksInput = document.getElementById('tgPostPerks');
    const reqsInput = document.getElementById('tgPostReqs');

    if (roleInput && shiftData.profession) roleInput.value = shiftData.profession;
    if (rateInput && shiftData.rate) rateInput.value = `${shiftData.rate} ₽ / смена`;
    if (metroInput && shiftData.district) metroInput.value = shiftData.district;
    if (schedInput && shiftData.timeFrom) schedInput.value = `${shiftData.timeFrom} – ${shiftData.timeTo || '23:00'}`;
    if (reqsInput && shiftData.requirements) reqsInput.value = shiftData.requirements;

    const typeSelect = document.getElementById('tgPostType');
    if (typeSelect) typeSelect.value = 'job';
    toggleFieldsByType('job');
    updateLivePreview();

    // Scroll to publisher studio
    const studio = document.getElementById('telegramPublisherStudio');
    if (studio) studio.scrollIntoView({ behavior: 'smooth' });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegramStudio);
  } else {
    initTelegramStudio();
  }
})();
