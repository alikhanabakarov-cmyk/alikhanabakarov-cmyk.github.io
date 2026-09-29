// instagram-studio.js
// GastroConnect Instagram & SMM Studio Client
// Designed for generating viral Reels, Stories, and Feed Posts focused on gastroconnect.ru

(function () {
  'use strict';

  const INSTAGRAM_TEMPLATES = [
    {
      id: 'reels_sos_lion',
      title: '🦁 Reels: SOS-смена в пятницу (Шеф-Лев)',
      format: 'reels',
      aspectRatio: '9:16',
      mediaPreview: '/assets/hero-home.webp',
      audioTrack: 'GastroConnect Audio • Трендовый динамичный бит (HoReCa)',
      hook: '🚨 Пятница 18:30, горячий цех горит, а повар не вышел? Знакомо каждому ресторатору Москвы 😤',
      scriptTimeline: `[00:00 - 00:03] Крупный план: Шеф в панике держится за голову, стопка чеков растет, сотейники дымят.\n[00:03 - 00:15] Су-шеф открывает ноутбук на gastroconnect.ru и в 1 клик жмет «Вызвать SOS-повара».\n[00:15 - 00:30] Через 35 минут на кухню входит повар с ножами и подтвержденным рейтингом GastroPass 5.0.\n[00:30 - 00:45] Смена закрыта идеально, гости довольны, расчет сразу на карту по СБП!`,
      caption: `🚨 <b>В пятницу вечером запара, а повар не вышел?</b>\n\nХватит судорожно строчить в чаты и молиться, чтобы кто-то доехал! На платформе <b>gastroconnect.ru</b> проверенные повара, су-шефы, бариста и официанты Москвы выезжают на смену за 30–45 минут.\n\n✨ <b>Почему заведения выбирают GastroConnect:</b>\n• ⚡️ Выезд от 30 минут по всей Москве и МО\n• 🛡 Проверенный паспорт квалификации GastroPass (5.0 рейтинг)\n• 🤝 0% комиссия сервиса — прямой расчет с мастером\n\n💰 <b>Для сменщиков:</b> ставки от 5 100 до 7 500 ₽ за 12 часов с выплатой сразу в конце смены!\n\n🔗 <b>Ссылка на регистрацию и вызов поваров — в шапке профиля @gastroconnect.ru</b>\n\n#ПоварМосква #HoReCa #РестораныМосквы #РаботаНаКухне #ШефПовар #GastroConnect #СменыМосква #Общепит`,
      hashtags: ['#ПоварМосква', '#HoReCa', '#РестораныМосквы', '#РаботаНаКухне', '#ШефПовар', '#GastroConnect', '#СменыМосква', '#Общепит', '#СушефМосква']
    },
    {
      id: 'reels_rates_2026',
      title: '💰 Reels/Карусель: Реальные ставки поваров 2026',
      format: 'reels',
      aspectRatio: '9:16',
      mediaPreview: '/assets/cluster-belorusskaya.webp',
      audioTrack: 'Original Sound • Пульс рынка HoReCa',
      hook: '💸 Сколько реально зарабатывает повар в Москве в 2026 году? Без сказок про «договорную ставку» 👇',
      scriptTimeline: `[00:00 - 00:04] Хук в камеру с планшетом: сравнение официальных окладов и реальных выплат за смену.\n[00:04 - 00:18] Разбор позиций: Горячий цех (5 200 – 6 500 ₽), Су-шефы (7 000 – 9 200 ₽), Сушисты (5 800 – 6 800 ₽).\n[00:18 - 00:32] Почему сменщики получают больше постоянщиков: график 2/2 или 3/3 дает от 95 000 до 160 000 ₽ чистыми.\n[00:32 - 00:45] Где брать смены с ежедневным расчетом — демонстрация gastroconnect.ru.`,
      caption: `💸 <b>Сколько РЕАЛЬНО зарабатывает повар в Москве в 2026 году?</b>\n\nСобрали честную статистику по более чем 100 заведениям Москвы (Патриаршие, Белорусская, Сити, Китай-город):\n\n🍳 <b>Повар горячего цеха:</b> 5 200 – 6 500 ₽ / смена (~450–540 ₽/час)\n🥗 <b>Повар холодного цеха:</b> 4 800 – 5 500 ₽ / смена\n👑 <b>Су-шеф смены:</b> 7 000 – 9 500 ₽ / смена\n🍣 <b>Сушист / Пиццайоло:</b> 5 800 – 6 800 ₽ / смена\n☕️ <b>Бариста / Бармен:</b> 4 200 – 5 000 ₽ + личный чай от 2 500 ₽\n\n🔥 Работая по графику 2/2 со ставкой от 5 500 ₽, соискатель зарабатывает от 82 500 ₽, а с плотным графиком и банкетами — <b>до 140 000 ₽</b> с выплатой сразу на руки или по СБП!\n\n📲 Каталог проверенных смен без посредников: <b>gastroconnect.ru/workers/</b> (ссылка в шапке профиля)`,
      hashtags: ['#СтавкиПоваров', '#РаботаПоваром', '#ЗарплатаОбщепит', '#ПовараМосквы', '#РаботаМосква', '#GastroConnect', '#Кухня']
    },
    {
      id: 'reels_gastropass',
      title: '🛡 Reels: Как повару выйти на смену без собеседований',
      format: 'reels',
      aspectRatio: '9:16',
      mediaPreview: '/assets/hero-workers.webp',
      audioTrack: 'Trending Beat • Секреты рестораторов',
      hook: '🤦‍♂️ Хватит заполнять 10 резюме и ждать ответа днями. Вот как выходить на кухню сразу за 45 минут:',
      scriptTimeline: `[00:00 - 00:05] Соискатель показывает переписки в мессенджерах, где ему не отвечают часами.\n[00:05 - 00:20] Показывает свой цифровой паспорт GastroPass на gastroconnect.ru с рейтингом 5.0 и верификацией цеха.\n[00:20 - 00:35] Шеф ресторана видит паспорт, мгновенно жмет «Одобрить», и повар уже на смене.\n[00:35 - 00:45] Смена окончена — автоматический отзыв в профиль и оплата на СБП.`,
      caption: `🤦‍♂️ <b>Устали от бесконечных собеседований и молчания управляющих?</b>\n\nВ 2026 году повара Москвы выходят на смены с цифровым паспортом <b>GastroPass</b> на <b>gastroconnect.ru</b>:\n\n1️⃣ Заполните квалификацию (цех, опыт, станция)\n2️⃣ Получите цифровой паспорт с гарантией надежности\n3️⃣ Откликайтесь в 1 клик — шефы подтверждают выход за 5 минут!\n\n⭐️ За каждую отработанную смену ваш рейтинг растет, открывая доступ к вип-сменам с оплатой до <b>9 000 ₽ за выход</b>.\n\n🔗 Создай свой бесплатный GastroPass по ссылке в шапке профиля: <b>gastroconnect.ru</b>`,
      hashtags: ['#GastroPass', '#РаботаВРесторане', '#ПоварМосква', '#ОбщепитМосква', '#GastroConnect', '#ШефПовар']
    },
    {
      id: 'reels_zero_fee',
      title: '🤝 Reels: 0% скрытых комиссий — почему шефы с нами',
      format: 'reels',
      aspectRatio: '9:16',
      mediaPreview: '/assets/cluster-siti.webp',
      audioTrack: 'GastroConnect Sound • Чистый расчет',
      hook: '🛑 Куда уходят 25% вашей зарплаты в агентствах? Мы отменили эту грабительскую комиссию!',
      scriptTimeline: `[00:00 - 00:05] Ведущий на фоне ресторана: почему посредники забирают четверть дохода поваров.\n[00:05 - 00:22] Как работает GastroConnect: прямая связь заведения и мастера, прозрачные ставки без посредников.\n[00:22 - 00:35] Заведение платит повару ровно ту ставку, которая указана в карточке смены.\n[00:35 - 00:45] Итог: доволен шеф, доволен сменщик, еда готовится без задержек.`,
      caption: `🛑 <b>Хватит кормить посредников!</b>\n\nТрадиционные агентства забирают до 30% от ставки повара. На <b>gastroconnect.ru</b> комиссия сервиса для сменщика — <b>0%</b>.\n\nВсе заработанные деньги (базовая ставка + 100% чаевых) вы получаете напрямую от заведения в конце смены наличными или переводом через СБП.\n\n⚡️ Прозрачно. Честно. Без задержек.\n\n🔗 Присоединяйтесь к сообществу поваров и рестораторов Москвы: <b>gastroconnect.ru</b> (активная ссылка в био!)`,
      hashtags: ['#ЧестнаяКухня', '#РаботаБезКомиссий', '#ПовараМосквы', '#GastroConnect', '#СменыHoReCa', '#Рестораторы']
    }
  ];

  let currentTemplate = INSTAGRAM_TEMPLATES[0];
  let isLiked = false;
  let likesCount = 1428;

  function initInstagramStudio() {
    const studio = document.getElementById('instagramSmmStudio');
    if (!studio) return;

    bindTemplateButtons();
    bindFormControls();
    bindActionButtons();
    updateMockupPreview();
  }

  function bindTemplateButtons() {
    const buttons = document.querySelectorAll('.ig-tpl-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tplId = btn.dataset.tplId;
        const found = INSTAGRAM_TEMPLATES.find(t => t.id === tplId);
        if (found) {
          currentTemplate = found;
          applyTemplateToForm(found);
          updateMockupPreview();
        }
      });
    });
  }

  function applyTemplateToForm(tpl) {
    const hookInput = document.getElementById('igPostHook');
    const timelineInput = document.getElementById('igPostTimeline');
    const captionInput = document.getElementById('igPostCaption');
    const audioInput = document.getElementById('igPostAudio');
    const formatSelect = document.getElementById('igPostFormat');

    if (hookInput) hookInput.value = tpl.hook || '';
    if (timelineInput) timelineInput.value = tpl.scriptTimeline || '';
    if (captionInput) captionInput.value = tpl.caption || '';
    if (audioInput) audioInput.value = tpl.audioTrack || '';
    if (formatSelect) formatSelect.value = tpl.format || 'reels';

    renderHashtagsChips(tpl.hashtags || []);
  }

  function renderHashtagsChips(tags) {
    const container = document.getElementById('igHashtagsContainer');
    if (!container) return;
    container.innerHTML = tags.map(tag => `
      <span class="ig-tag-chip" data-tag="${escapeHtml(tag)}">
        ${escapeHtml(tag)}
        <span class="remove-tag" onclick="this.parentElement.remove(); window.updateIgCaptionHashtags();">✕</span>
      </span>
    `).join('');
  }

  window.updateIgCaptionHashtags = function () {
    const chips = document.querySelectorAll('#igHashtagsContainer .ig-tag-chip');
    const tags = Array.from(chips).map(c => c.dataset.tag);
    currentTemplate.hashtags = tags;
  };

  function bindFormControls() {
    const captionInput = document.getElementById('igPostCaption');
    const hookInput = document.getElementById('igPostHook');
    const formatSelect = document.getElementById('igPostFormat');

    if (captionInput) {
      captionInput.addEventListener('input', () => {
        updateMockupPreview();
      });
    }

    if (hookInput) {
      hookInput.addEventListener('input', () => {
        updateMockupPreview();
      });
    }

    if (formatSelect) {
      formatSelect.addEventListener('change', () => {
        const previewBox = document.getElementById('igPhoneMockupScreen');
        if (previewBox) {
          if (formatSelect.value === 'feed') {
            previewBox.classList.add('aspect-square');
            previewBox.classList.remove('aspect-reels');
          } else {
            previewBox.classList.add('aspect-reels');
            previewBox.classList.remove('aspect-square');
          }
        }
      });
    }
  }

  function bindActionButtons() {
    // 1. Copy formatted text for Instagram
    const copyBtn = document.getElementById('copyIgPostBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const captionText = document.getElementById('igPostCaption')?.value || '';
        // Format with clean spacing
        const cleanText = captionText
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<b>(.*?)<\/b>/gi, '$1')
          .replace(/<strong>(.*?)<\/strong>/gi, '$1');

        navigator.clipboard.writeText(cleanText).then(() => {
          showIgToast('📋 Текст и хэштеги скопированы для Instagram!');
        }).catch(() => {
          showIgToast('Скопировано в буфер обмена.');
        });
      });
    }

    // 2. Download Reels Script File
    const downloadScriptBtn = document.getElementById('downloadReelsScriptBtn');
    if (downloadScriptBtn) {
      downloadScriptBtn.addEventListener('click', () => {
        const title = currentTemplate.title || 'Reels';
        const hook = document.getElementById('igPostHook')?.value || '';
        const timeline = document.getElementById('igPostTimeline')?.value || '';
        const caption = document.getElementById('igPostCaption')?.value || '';
        const audio = document.getElementById('igPostAudio')?.value || '';

        const fullScript = `=====================================================
СЦЕНАРИЙ ДЛЯ INSTAGRAM REELS & SHORTS | GASTROCONNECT
=====================================================
Тема: ${title}
Аудио: ${audio}
Целевой сайт: https://gastroconnect.ru

[ХУК ПЕРВЫХ 3 СЕКУНД]:
${hook}

[ТАЙМЛАЙН И РАСКАДРОВКА]:
${timeline}

[ТЕКСТ ПОД ВИДЕО И ХЭШТЕГИ]:
${caption.replace(/<[^>]+>/g, '')}
=====================================================`;

        const blob = new Blob([fullScript], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GastroConnect_Reels_Script_${currentTemplate.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showIgToast('🎬 Сценарий Reels скачан в формате TXT!');
      });
    }

    // 3. Announce in Telegram @gastroconnect
    const announceTgBtn = document.getElementById('announceReelsInTgBtn');
    if (announceTgBtn) {
      announceTgBtn.addEventListener('click', async () => {
        announceTgBtn.disabled = true;
        announceTgBtn.innerHTML = '⏳ Отправляем в Telegram...';

        try {
          const caption = document.getElementById('igPostCaption')?.value || '';
          const hook = document.getElementById('igPostHook')?.value || '';

          const tgText = `🎬 <b>НОВОЕ ВИДЕО В INSTAGRAM REELS @gastroconnect.ru</b>\n━━━━━━━━━━━━━━━━━━━━\n${hook}\n\n${caption.slice(0, 450)}...\n\n👉 <b>Смотрите видео в нашем Instagram:</b> instagram.com/gastroconnect.ru\n⚡️ <b>Сайт платформы:</b> gastroconnect.ru`;

          const res = await fetch('/api/telegram/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'tip',
              customHtml: tgText,
              channel: '@gastroconnect'
            })
          });

          const json = await res.json();
          if (json.success) {
            showIgToast('🚀 Анонс Reels опубликован в Telegram-канал @gastroconnect!');
          } else {
            showIgToast('Анонс подготовлен (статус: ' + (json.error || 'ok') + ')');
          }
        } catch (e) {
          showIgToast('Ошибка публикации: ' + e.message);
        } finally {
          announceTgBtn.disabled = false;
          announceTgBtn.innerHTML = '🚀 Анонсировать в Telegram @gastroconnect';
        }
      });
    }

    // Interactive Like Button on Mockup
    const mockLikeBtn = document.getElementById('igMockLikeBtn');
    if (mockLikeBtn) {
      mockLikeBtn.addEventListener('click', () => {
        isLiked = !isLiked;
        likesCount += isLiked ? 1 : -1;
        mockLikeBtn.style.color = isLiked ? '#ef4444' : '#ffffff';
        mockLikeBtn.innerHTML = isLiked ? '❤️' : '🤍';
        const likesLabel = document.getElementById('igMockLikesCount');
        if (likesLabel) {
          likesLabel.textContent = `${likesCount.toLocaleString('ru-RU')} отметок «Нравится»`;
        }
      });
    }
  }

  function updateMockupPreview() {
    const hook = document.getElementById('igPostHook')?.value || currentTemplate.hook;
    const caption = document.getElementById('igPostCaption')?.value || currentTemplate.caption;
    const audio = document.getElementById('igPostAudio')?.value || currentTemplate.audioTrack;

    const mockHookEl = document.getElementById('igMockOverlayHook');
    if (mockHookEl) {
      mockHookEl.textContent = hook;
    }

    const mockCaptionEl = document.getElementById('igMockCaptionText');
    if (mockCaptionEl) {
      mockCaptionEl.innerHTML = caption.replace(/\n/g, '<br/>');
    }

    const mockAudioEl = document.getElementById('igMockAudioText');
    if (mockAudioEl) {
      mockAudioEl.textContent = audio;
    }

    const mockBgImg = document.getElementById('igMockMediaImg');
    if (mockBgImg && currentTemplate.mediaPreview) {
      mockBgImg.src = currentTemplate.mediaPreview;
    }
  }

  function showIgToast(msg) {
    let toast = document.getElementById('igToastBox');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'igToastBox';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = '#064c3b';
      toast.style.color = '#fff';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '30px';
      toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      toast.style.fontSize = '14px';
      toast.style.fontWeight = '750';
      toast.style.zIndex = '99999';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3000);
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Auto-init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstagramStudio);
  } else {
    setTimeout(initInstagramStudio, 150);
  }

})();
