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
