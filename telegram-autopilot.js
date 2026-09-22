// telegram-autopilot.js
// Автопилот публикации смен в Telegram-канал @gastroconnect
// Режим: каждый час с 08:00 до 21:00 МСК по 2–3 смены из базы проверенных вакансий

const fs = require('fs');
const path = require('path');
const { fetchAllChannelsVacancies } = require('./telegram-scraper');
const { publishToTelegram, DEFAULT_CHANNEL } = require('./telegram-publisher');
const { HORECA_ACTIVE_SHIFTS } = require('./horeca-shifts-pool');
const { notifySubscribersForShift } = require('./telegram-alerts');

// Файл для хранения истории опубликованных смен (чтобы исключить дубли)
const PUBLISHED_HISTORY_FILE = path.join(__dirname, 'autopilot-published.json');

// Файл постоянного состояния автопилота
const AUTOPILOT_STATE_FILE = path.join(__dirname, 'autopilot-state.json');

// Конфигурация частого расписания по Московскому времени (UTC+3)
// Публикация каждый час с 08:00 до 21:00 по 2 смены за раз (ночью с 21:00 до 08:00 тихий режим)
const AUTOPILOT_CONFIG = {
  enabled: true,
  intervalHours: 1,
  activeStartHour: 8, // с 08:00 МСК
  activeEndHour: 21,  // до 21:00 МСК
  postsPerSlot: 2,    // по 2 смены в каждый часовой слот (26–30 смен за день)
  activeHours: [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ],
  channel: '@gastroconnect',
  timezone: 'Europe/Moscow (UTC+3)'
};

// Загрузка постоянного состояния автопилота
function loadAutopilotState() {
  try {
    if (fs.existsSync(AUTOPILOT_STATE_FILE)) {
      const raw = fs.readFileSync(AUTOPILOT_STATE_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[Autopilot] Ошибка чтения состояния:', err.message);
  }
  return {
    lastRunTime: null,
    lastPublishedDate: null,
    lastTriggeredSlot: null,
    totalPublished: 0
  };
}

function saveAutopilotState(state) {
  try {
    fs.writeFileSync(AUTOPILOT_STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('[Autopilot] Ошибка записи состояния:', err.message);
  }
}

// Загрузка истории ранее опубликованных смен
function loadPublishedHistory() {
  try {
    if (fs.existsSync(PUBLISHED_HISTORY_FILE)) {
      const raw = fs.readFileSync(PUBLISHED_HISTORY_FILE, 'utf8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error('[Autopilot] Ошибка чтения истории публикаций:', err.message);
  }
  return [];
}

// Сохранение истории
function savePublishedHistory(history) {
  try {
    const trimmed = history.slice(-500);
    fs.writeFileSync(PUBLISHED_HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('[Autopilot] Ошибка записи истории публикаций:', err.message);
  }
}

// Проверка разрешенного времени (с 08:00 до 21:00 МСК)
function isAllowedPublishingTime(hours) {
  return hours >= AUTOPILOT_CONFIG.activeStartHour && hours < AUTOPILOT_CONFIG.activeEndHour;
}

// Получение текущего времени в Москве
function getMoscowTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const moscowDate = new Date(utc + (3600000 * 3));
  const year = moscowDate.getFullYear();
  const month = String(moscowDate.getMonth() + 1).padStart(2, '0');
  const day = String(moscowDate.getDate()).padStart(2, '0');
  const hours = String(moscowDate.getHours()).padStart(2, '0');
  const minutes = String(moscowDate.getMinutes()).padStart(2, '0');
  return {
    dateKey: `${year}-${month}-${day}`,
    timeStr: `${hours}:${minutes}`,
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10)
  };
}

// Состояние работы автопилота
const savedState = loadAutopilotState();
const autopilotState = {
  enabled: true,
  lastRunTime: savedState.lastRunTime || null,
  lastPublishedItem: savedState.lastPublishedItem || null,
  lastStatus: 'active',
  totalPublished: savedState.totalPublished || 0,
  lastTriggeredSlot: savedState.lastTriggeredSlot || null,
  lastDateKey: savedState.lastDateKey || null,
  log: []
};

// Задержка между отправками постов
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Получение объединенного пула смен:
 * 1) Наша проверенная база HORECA_ACTIVE_SHIFTS (32+ смены по всем цехам)
 * 2) Свежие спарсенные смены из каналов
 */
async function getAggregatedShiftsPool() {
  const customItems = (HORECA_ACTIVE_SHIFTS || []).map(item => ({
    id: item.id,
    title: item.title,
    role: item.role,
    rate: item.rate,
    metro: item.metro,
    schedule: item.schedule,
    perks: item.perks,
    contacts: item.contacts,
    description: `Работа на позиции ${item.role} в Москве`,
    requirements: 'Опыт работы, медкнижка РФ',
    source: 'horeca_pool'
  }));

  let scrapedItems = [];
  try {
    const res = await fetchAllChannelsVacancies({ forceRefresh: true });
    if (res && Array.isArray(res.items)) {
      scrapedItems = res.items
        .filter(item => item.hasDirectContact || (item.contacts && (item.contacts.phone || item.contacts.telegram || (item.contacts.phones && item.contacts.phones.length > 0))))
        .map(item => {
          let contactStr = '';
          if (item.contacts && typeof item.contacts === 'object') {
            const parts = [];
            if (item.contacts.phone) parts.push(item.contacts.phone);
            if (item.contacts.telegram) parts.push(`@${item.contacts.telegram.replace(/^@/, '')}`);
            if (item.contacts.name) parts.push(item.contacts.name);
            contactStr = parts.join(' | ');
          } else {
            contactStr = item.contacts || '';
          }
          return {
            id: item.id,
            title: item.title,
            role: item.role,
            venue: item.venue || '',
            rate: item.rateText || item.rate || 'Ставка договорная',
            metro: item.metro || 'м. Тверская',
            schedule: item.schedule || 'Сменный график',
            perks: Array.isArray(item.benefits) ? item.benefits.join(', ') : (item.perks || 'Питание, форма, своевременные выплаты'),
            contacts: contactStr,
            description: item.description || 'Работа на позиции по стандартам заведения',
            requirements: 'Опыт работы, наличие медкнижки РФ',
            source: 'telegram_scraped'
          };
        });
    }
  } catch (err) {
    console.warn('[Autopilot] Ошибка подгрузки спарсенных смен:', err.message);
  }

  // Если спарсены свежие вакансии из Telegram-каналов, используем их в первую очередь
  if (scrapedItems.length > 0) {
    const map = new Map();
    for (const it of scrapedItems) {
      if (it && it.title && !map.has(it.id)) {
        map.set(it.id, it);
      }
    }
    return Array.from(map.values());
  }

  // Запасной fallback только при полном отсутствии доступа к сети
  const map = new Map();
  for (const it of customItems) {
    if (it && it.title && !map.has(it.id)) {
      map.set(it.id, it);
    }
  }
  return Array.from(map.values());
}

/**
 * Основной рабочий цикл автопилота
 * Публикует заданное количество смен (по умолчанию count = 2) с бережной паузой
 */
async function runAutopilotCycle(reason = 'scheduled', batchCount = 2) {
  const moscow = getMoscowTime();
  const logEntry = {
    timestamp: new Date().toISOString(),
    timeMsk: moscow.timeStr,
    trigger: reason,
    posts: []
  };

  // 1. Проверка ночного режима (с 21:00 до 08:00)
  if (!isAllowedPublishingTime(moscow.hours) && reason.startsWith('scheduled')) {
    logEntry.status = 'skipped_night_mode';
    logEntry.message = `Ночной тихий режим с 21:00 до 08:00 МСК (текущее время: ${moscow.timeStr}). Публикации спят.`;
    console.log(`[Autopilot] ${logEntry.message}`);
    addLog(logEntry);
    return { success: false, reason: 'night_mode', message: logEntry.message };
  }

  console.log(`[Autopilot] Запуск цикла автопостинга (${reason}) на ${batchCount} смен в ${moscow.timeStr} МСК...`);

  try {
    const allItems = await getAggregatedShiftsPool();

    if (allItems.length === 0) {
      logEntry.status = 'no_items';
      logEntry.message = 'Нет доступных смен для публикации.';
      addLog(logEntry);
      return { success: false, reason: 'empty_pool' };
    }

    const publishedHistory = loadPublishedHistory();
    const publishedIds = new Set(publishedHistory.map(h => h.id).filter(Boolean));
    const publishedTitleKeys = new Set(publishedHistory.map(h => h.titleKey).filter(Boolean));
    const publishedPhones = new Set(publishedHistory.map(h => h.cleanPhone).filter(Boolean));

    // Сортировка: приоритет свежим реальным вакансиям из каналов с прямыми контактами
    const sortedCandidates = [...allItems].sort((a, b) => {
      const sourceScoreA = a.source === 'telegram_scraped' ? 2 : 1;
      const sourceScoreB = b.source === 'telegram_scraped' ? 2 : 1;
      if (sourceScoreB !== sourceScoreA) return sourceScoreB - sourceScoreA;

      const hasDirectContactA = a.contacts && (/\+7|89/.test(a.contacts) || (/@/.test(a.contacts) && !a.contacts.includes('gastroconnect'))) ? 1 : 0;
      const hasDirectContactB = b.contacts && (/\+7|89/.test(b.contacts) || (/@/.test(b.contacts) && !b.contacts.includes('gastroconnect'))) ? 1 : 0;
      if (hasDirectContactB !== hasDirectContactA) return hasDirectContactB - hasDirectContactA;

      return 0;
    });

    // Выбираем только те смены, которые ЕЩЕ НИ РАЗУ НЕ ПУБЛИКОВАЛИСЬ (СТРОГИЙ ДЕДУП)
    const selectedShifts = [];
    const usedContacts = new Set();

    for (const item of sortedCandidates) {
      const titleKey = `${item.title}_${item.rate}_${item.metro}`.toLowerCase();
      const phoneMatch = String(item.contacts || '').match(/(?:(?:\+7|8)[\s(.-]*\d{3}[\s).-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}|\b8\d{10}\b|\b\+7\d{10}\b)/);
      const cleanPhone = phoneMatch ? phoneMatch[0].replace(/\D/g, '') : null;

      // Если вакансия уже была опубликована ранее — пропускаем
      if (publishedIds.has(item.id) || publishedTitleKeys.has(titleKey)) {
        continue;
      }

      // Не публиковать одинаковый номер телефона повторно
      if (cleanPhone && (publishedPhones.has(cleanPhone) || usedContacts.has(cleanPhone))) {
        continue;
      }

      // Обязательно наличие реального контакта работодателя
      if (!item.contacts || item.contacts === '@gastroconnect') {
        continue;
      }

      selectedShifts.push({ ...item, titleKey, cleanPhone });
      publishedIds.add(item.id);
      publishedTitleKeys.add(titleKey);
      if (cleanPhone) usedContacts.add(cleanPhone);

      if (selectedShifts.length >= batchCount) break;
    }

    // Если нет новых непубликовавшихся постов, НЕ ДУБЛИРУЕМ старые!
    if (selectedShifts.length === 0) {
      logEntry.status = 'up_to_date';
      logEntry.message = 'Все текущие вакансии из Telegram-групп уже были опубликованы ранее. Ожидаем появления свежих постов.';
      console.log(`[Autopilot] ${logEntry.message}`);
      addLog(logEntry);
      return { success: true, count: 0, message: logEntry.message };
    }

    const publishedResults = [];

    // Публикуем каждую смену с паузой 2.5 секунды между постами
    for (let i = 0; i < selectedShifts.length; i++) {
      const shift = selectedShifts[i];
      if (i > 0) {
        await sleep(2500); // пауза против лимитов Telegram
      }

      const rateText = shift.rate ? (shift.rate.includes('₽') ? shift.rate : `${shift.rate} ₽ / смена`) : 'Ставка договорная';
      const postPayload = {
        type: 'job',
        role: shift.title || shift.role || 'Повар на смену',
        rate: rateText,
        metro: shift.metro || 'Москва',
        schedule: shift.schedule || '11:00 – 23:00 (12 ч)',
        perks: shift.perks || 'Питание от заведения, форма, развоз',
        tasks: shift.description || 'Работа на станции кухни по ТТК заведения',
        requirements: 'Опыт работы, наличие медкнижки РФ',
        contacts: shift.contacts || '@gastroconnect'
      };

      const publishResult = await publishToTelegram(postPayload, null, AUTOPILOT_CONFIG.channel);

      if (publishResult.success) {
        publishedHistory.push({
          id: shift.id,
          titleKey: shift.titleKey,
          cleanPhone: shift.cleanPhone || null,
          role: shift.title,
          rate: shift.rate,
          metro: shift.metro,
          publishedAt: new Date().toISOString(),
          postUrl: publishResult.postUrl || null,
          messageId: publishResult.messageId || null
        });

        autopilotState.lastRunTime = new Date().toISOString();
        autopilotState.lastPublishedItem = shift.title;
        autopilotState.totalPublished += 1;

        publishedResults.push({
          success: true,
          title: shift.title,
          rate: rateText,
          metro: shift.metro,
          postUrl: publishResult.postUrl,
          messageId: publishResult.messageId
        });

        // Сохраняем историю сразу же после каждого успешного поста, чтобы прогресс не терялся
        savePublishedHistory(publishedHistory);
        saveAutopilotState({
          lastRunTime: autopilotState.lastRunTime,
          lastPublishedItem: autopilotState.lastPublishedItem,
          totalPublished: autopilotState.totalPublished,
          lastTriggeredSlot: autopilotState.lastTriggeredSlot,
          lastDateKey: autopilotState.lastDateKey
        });

        console.log(`[Autopilot] ✅ (${i + 1}/${selectedShifts.length}) Опубликован: "${shift.title}" (${rateText}) в ${AUTOPILOT_CONFIG.channel}`);
        
        // Оповещаем подписчиков персональных Telegram-алертов для этой специальности
        notifySubscribersForShift({ ...shift, rateText }).catch(err => {
          console.error('[Autopilot] Ошибка отправки алертов подписчикам:', err.message);
        });
      } else {
        publishedResults.push({
          success: false,
          title: shift.title,
          error: publishResult.error || publishResult.message
        });
        console.error(`[Autopilot] ❌ Ошибка публикации ${shift.title}:`, publishResult.error);
      }
    }

    savePublishedHistory(publishedHistory);

    saveAutopilotState({
      lastRunTime: autopilotState.lastRunTime,
      lastPublishedItem: autopilotState.lastPublishedItem,
      totalPublished: autopilotState.totalPublished,
      lastTriggeredSlot: autopilotState.lastTriggeredSlot,
      lastDateKey: autopilotState.lastDateKey
    });

    logEntry.status = publishedResults.some(r => r.success) ? 'published' : 'failed';
    logEntry.posts = publishedResults;
    addLog(logEntry);

    return {
      success: publishedResults.some(r => r.success),
      count: publishedResults.filter(r => r.success).length,
      results: publishedResults
    };
  } catch (err) {
    logEntry.status = 'error';
    logEntry.error = err.message;
    addLog(logEntry);
    console.error('[Autopilot] Критическая ошибка цикла автопилота:', err);
    return { success: false, error: err.message };
  }
}

function addLog(entry) {
  autopilotState.log.unshift(entry);
  if (autopilotState.log.length > 50) {
    autopilotState.log.pop();
  }
}

let autopilotTimer = null;

/**
 * Определение наступившего часового слота дня
 */
function getDueSlot(moscow, lastPublishedSlotKey) {
  const currentMinutes = moscow.hours * 60 + moscow.minutes;
  const passedSlots = [];
  for (const slot of AUTOPILOT_CONFIG.activeHours) {
    const [h, m] = slot.split(':').map(Number);
    const slotMinutes = h * 60 + m;
    if (currentMinutes >= slotMinutes) {
      passedSlots.push(slot);
    }
  }
  if (passedSlots.length === 0) return null;
  const currentSlot = passedSlots[passedSlots.length - 1];
  const slotKey = `${moscow.dateKey}_${currentSlot}`;
  if (slotKey === lastPublishedSlotKey) {
    return null;
  }
  return { slot: currentSlot, slotKey };
}

/**
 * Запуск циклического таймера частого автопостинга
 * Проверяет текущее время раз в 20 секунд.
 * Запускает публикацию 2 смен каждый час с 08:00 до 21:00 МСК
 */
function startAutopilot() {
  if (autopilotTimer) {
    clearInterval(autopilotTimer);
  }

  autopilotState.enabled = true;
  console.log(`[Autopilot] 🚀 Автопилот активирован в ЧАСТОМ РЕЖИМЕ!`);
  console.log(`[Autopilot] Расписание: каждый час с 08:00 до 21:00 МСК по ${AUTOPILOT_CONFIG.postsPerSlot} смены.`);
  console.log(`[Autopilot] Тихий ночной режим: с 21:00 до 08:00 МСК.`);

  const checkSchedule = async () => {
    if (!autopilotState.enabled) return;

    const moscow = getMoscowTime();
    
    if (!isAllowedPublishingTime(moscow.hours)) {
      return;
    }

    const lastSlotKey = autopilotState.lastTriggeredSlot;
    const due = getDueSlot(moscow, lastSlotKey);

    if (due) {
      autopilotState.lastTriggeredSlot = due.slotKey;
      autopilotState.lastDateKey = moscow.dateKey;
      saveAutopilotState({
        lastRunTime: autopilotState.lastRunTime,
        lastPublishedItem: autopilotState.lastPublishedItem,
        totalPublished: autopilotState.totalPublished,
        lastTriggeredSlot: autopilotState.lastTriggeredSlot,
        lastDateKey: autopilotState.lastDateKey
      });

      console.log(`[Autopilot] Наступил часовой слот ${due.slot} (ключ ${due.slotKey}). Публикация ${AUTOPILOT_CONFIG.postsPerSlot} смен...`);
      await runAutopilotCycle(`scheduled_slot_${due.slot}`, AUTOPILOT_CONFIG.postsPerSlot);
    }
  };

  setTimeout(checkSchedule, 5000);
  autopilotTimer = setInterval(checkSchedule, 20000);
}

/**
 * Получение текущего статуса автопилота для API / панели управления
 */
function getAutopilotStatus() {
  const moscow = getMoscowTime();
  const isNight = !isAllowedPublishingTime(moscow.hours);

  return {
    success: true,
    enabled: autopilotState.enabled,
    timezone: AUTOPILOT_CONFIG.timezone,
    currentMoscowTime: moscow.timeStr,
    currentHours: moscow.hours,
    isNightModeActive: isNight,
    nightModeRule: 'Тихий режим с 21:00 до 08:00 МСК (публикации спят)',
    scheduleInterval: 'Каждый час с 08:00 до 20:00 (по 2 смены за слот)',
    postsPerDay: 'Около 26–30 постов в день',
    activeSlots: AUTOPILOT_CONFIG.activeHours,
    channel: AUTOPILOT_CONFIG.channel,
    lastRunTime: autopilotState.lastRunTime,
    lastPublishedShift: autopilotState.lastPublishedItem,
    totalPublished: autopilotState.totalPublished,
    recentLogs: autopilotState.log.slice(0, 15)
  };
}

module.exports = {
  startAutopilot,
  runAutopilotCycle,
  getAutopilotStatus,
  getAggregatedShiftsPool,
  AUTOPILOT_CONFIG
};
