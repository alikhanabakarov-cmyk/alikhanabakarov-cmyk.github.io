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
      previewEl.textContent = 'ÐÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿ÑÐµÐ´Ð¿ÑÐ¾ÑÐ¼Ð¾ÑÑÐ°...';
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
        publishBtn.textContent = 'ð ÐÑÐ¿ÑÐ°Ð²ÐºÐ° Ð² Telegram...';
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
              `â ÐÐ¾ÑÑ ÑÑÐ¿ÐµÑÐ½Ð¾ Ð¾Ð¿ÑÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½ Ð² ÐºÐ°Ð½Ð°Ð» ${result.channel}!`,
              'success'
            );
          } else {
            // Mode manual_ready or informational
            showToast(
              `â¨ ÐÐ¾ÑÑ Ð¸Ð´ÐµÐ°Ð»ÑÐ½Ð¾ Ð¿Ð¾Ð´Ð³Ð¾ÑÐ¾Ð²Ð»ÐµÐ½ Ð´Ð»Ñ @gastroconnect. Ð¡ÐºÐ¾Ð¿Ð¸ÑÑÐ¹ÑÐµ ÑÐµÐºÑÑ ÐºÐ½Ð¾Ð¿ÐºÐ¾Ð¹ Ð½Ð¸Ð¶Ðµ Ð¸Ð»Ð¸ Ð¾ÑÐºÑÐ¾Ð¹ÑÐµ ÐºÐ°Ð½Ð°Ð» Ð´Ð»Ñ Ð²ÑÑÐ°Ð²ÐºÐ¸.`,
              'success'
            );
          }
        } catch (err) {
          showToast(`ÐÑÐ¸Ð±ÐºÐ° Ð¾ÑÐ¿ÑÐ°Ð²ÐºÐ¸: ${err.message}`, 'error');
        } finally {
          publishBtn.disabled = false;
          publishBtn.textContent = 'ð ÐÐ¿ÑÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°ÑÑ Ð² @gastroconnect';
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(currentPlainText || currentFormattedHtml);
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'â Ð¡ÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½Ð¾ Ð² Ð±ÑÑÐµÑ!';
          showToast('ð ÐÐ¾ÑÐ¾Ð²ÑÐ¹ ÑÐ¾ÑÐ¼Ð°ÑÐ¸ÑÐ¾Ð²Ð°Ð½Ð½ÑÐ¹ Ð¿Ð¾ÑÑ ÑÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½!', 'success');
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        } catch (e) {
          showToast('ÐÑÐ´ÐµÐ»Ð¸ÑÐµ ÑÐµÐºÑÑ Ð² Ð¿ÑÐµÐ´Ð¿ÑÐ¾ÑÐ¼Ð¾ÑÑÐµ Ð¸ ÑÐºÐ¾Ð¿Ð¸ÑÑÐ¹ÑÐµ Ð²ÑÑÑÐ½ÑÑ.', 'error');
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
    if (rateInput && shiftData.rate) rateInput.value = `${shiftData.rate} â½ / ÑÐ¼ÐµÐ½Ð°`;
    if (metroInput && shiftData.district) metroInput.value = shiftData.district;
    if (schedInput && shiftData.timeFrom) schedInput.value = `${shiftData.timeFrom} â ${shiftData.timeTo || '23:00'}`;
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
