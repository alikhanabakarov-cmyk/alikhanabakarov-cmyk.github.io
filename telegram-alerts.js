// telegram-alerts.js
// GastroConnect Telegram Shift Alerts Engine
// Manages worker subscriptions to role-specific shift alerts and dispatches Telegram notifications

const fs = require('fs');
const path = require('path');

const ALERTS_FILE = path.join(__dirname, 'telegram-alerts.json');
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8692318442:AAHSI6lUSeZG_hDepBhfJBE43LIuSjrubVU';
const DEFAULT_CHANNEL = '@gastroconnect';
const BOT_USERNAME = 'GastroConnect_Bot';

function loadAlerts() {
  try {
    if (fs.existsSync(ALERTS_FILE)) {
      const raw = fs.readFileSync(ALERTS_FILE, 'utf8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error('[Alerts] Ошибка чтения подписок:', err.message);
  }
  return [];
}

function saveAlerts(alerts) {
  try {
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(alerts, null, 2), 'utf8');
  } catch (err) {
    console.error('[Alerts] Ошибка записи подписок:', err.message);
  }
}

/**
 * Normalize role category for matching
 */
function normalizeCategory(category, roleName = '') {
  const c = String(category || '').toLowerCase().trim();
  const r = String(roleName || '').toLowerCase().trim();

  if (c.includes('sous') || c.includes('шеф') || r.includes('су-шеф') || r.includes('шеф-повар')) return 'sous-chef';
  if (c.includes('hot') || c.includes('горяч') || r.includes('горяч') || r.includes('гриль')) return 'hot-cook';
  if (c.includes('cold') || c.includes('холодн') || r.includes('холодн') || r.includes('бистро')) return 'cold-cook';
  if (c.includes('sushi') || c.includes('суши') || r.includes('суши')) return 'sushi';
  if (c.includes('pizza') || c.includes('пицц') || r.includes('пицц')) return 'pizza';
  if (c.includes('pastry') || c.includes('пекар') || c.includes('кондит') || r.includes('кондит') || r.includes('пекар')) return 'pastry';
  if (c.includes('barista') || c.includes('бариста') || r.includes('бариста')) return 'barista';
  if (c.includes('bar') || c.includes('бар') || r.includes('бармен')) return 'bartender';
  if (c.includes('waiter') || c.includes('официант') || r.includes('официант')) return 'waiter';

  return c || 'cook';
}

/**
 * Register a user alert subscription
 */
async function subscribeAlert({ role, roleCategory, telegram, phone, userId, chatId }) {
  const alerts = loadAlerts();
  const normCategory = normalizeCategory(roleCategory, role);
  const cleanTg = telegram ? (telegram.startsWith('@') ? telegram : `@${telegram.trim()}`) : null;
  const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : null;

  // Search if subscriber already exists for this role
  let existing = alerts.find(a => 
    a.roleCategory === normCategory && 
    ((cleanTg && a.telegram && a.telegram.toLowerCase() === cleanTg.toLowerCase()) || 
     (cleanPhone && a.phone === cleanPhone) ||
     (userId && a.userId === userId) ||
     (chatId && a.chatId === chatId))
  );

  const now = new Date().toISOString();

  if (existing) {
    existing.active = true;
    existing.role = role || existing.role;
    if (cleanTg) existing.telegram = cleanTg;
    if (cleanPhone) existing.phone = cleanPhone;
    if (chatId) existing.chatId = chatId;
    existing.updatedAt = now;
  } else {
    existing = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: role || 'Повар / Су-шеф',
      roleCategory: normCategory,
      telegram: cleanTg || '@gastroconnect',
      phone: cleanPhone || '',
      userId: userId || null,
      chatId: chatId || null,
      active: true,
      createdAt: now,
      updatedAt: now,
      notificationCount: 0,
      lastNotifiedAt: null
    };
    alerts.unshift(existing);
  }

  saveAlerts(alerts);

  // Send an instant confirmation notification via Telegram Bot API
  let directNotificationSent = false;
  let testError = null;

  const botDeepLink = `https://t.me/${BOT_USERNAME}?start=alert_${normCategory}`;

  const confirmationText = `🔔 <b>ПОДПИСКА НА АЛЕРТЫ АКТИВИРОВАНА!</b>
━━━━━━━━━━━━━━━━━━━━
👨‍🍳 <b>Специальность:</b> ${role}
📌 <b>Категория:</b> #${normCategory}
🌐 <b>Сервис:</b> GastroConnect HoReCa Shifts

Вы первыми получите мгновенное уведомление в Telegram, как только в Москве появится новая проверенная смена по этой позиции с прямой ставкой и контактами шефа.

💬 <b>Наш канал со всеми сделками:</b> ${DEFAULT_CHANNEL}
⚡️ <b>Личный кабинет:</b> https://gastroconnect.ru/workers/`;

  if (chatId || (cleanTg && !cleanTg.startsWith('@gastroconnect'))) {
    const targetChat = chatId || cleanTg;
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChat,
          text: confirmationText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: '⚡️ Смотреть горячие смены на сайте', url: 'https://gastroconnect.ru/workers/' }],
              [{ text: '📢 Канал @gastroconnect', url: 'https://t.me/gastroconnect' }]
            ]
          }
        })
      });
      const data = await res.json();
      if (data.ok) {
        directNotificationSent = true;
        existing.chatId = data.result.chat.id;
        saveAlerts(alerts);
      } else {
        testError = data.description;
      }
    } catch (e) {
      testError = e.message;
    }
  }

  console.log(`[Alerts] ✅ Пользователь ${cleanTg || cleanPhone || 'Гость'} подписан на алерты смен [${role} (${normCategory})]`);

  return {
    success: true,
    subscription: existing,
    botDeepLink,
    botUsername: BOT_USERNAME,
    directNotificationSent,
    testError,
    message: `Алерты успешно включены! Вы будете получать уведомления в Telegram о новых сменах для роли «${role}».`
  };
}

/**
 * Unsubscribe user from alerts for a role
 */
function unsubscribeAlert({ id, roleCategory, telegram }) {
  const alerts = loadAlerts();
  const cleanTg = telegram ? (telegram.startsWith('@') ? telegram : `@${telegram.trim()}`).toLowerCase() : null;

  let changed = false;
  alerts.forEach(a => {
    if (id && a.id === id) {
      a.active = false;
      changed = true;
    } else if (roleCategory && a.roleCategory === roleCategory && (!cleanTg || (a.telegram && a.telegram.toLowerCase() === cleanTg))) {
      a.active = false;
      changed = true;
    }
  });

  if (changed) {
    saveAlerts(alerts);
  }

  return { success: true, message: 'Подписка на алерты отключена.' };
}

/**
 * Notify all subscribers matching a shift
 */
async function notifySubscribersForShift(shift) {
  if (!shift) return { notifiedCount: 0 };
  const alerts = loadAlerts().filter(a => a.active);
  if (!alerts.length) return { notifiedCount: 0 };

  const shiftText = `${shift.title || ''} ${shift.role || ''} ${shift.roleCategory || ''}`.toLowerCase();
  const shiftCategory = normalizeCategory(shift.roleCategory, shift.title || shift.role);

  // Find matching subscribers
  const matching = alerts.filter(a => {
    if (a.roleCategory === shiftCategory) return true;
    const roleLower = String(a.role || '').toLowerCase();
    if (roleLower && shiftText.includes(roleLower)) return true;
    return false;
  });

  if (!matching.length) return { notifiedCount: 0 };

  console.log(`[Alerts] Найдено ${matching.length} подписчиков для смены: "${shift.title}" [${shiftCategory}]`);

  let notifiedCount = 0;
  const now = new Date().toISOString();

  for (const subscriber of matching) {
    if (subscriber.chatId) {
      try {
        const text = `🔔 <b>ГОРЯЧАЯ СМЕНА ПО ВАШЕМУ АЛЕРТУ!</b>
━━━━━━━━━━━━━━━━━━━━
👨‍🍳 <b>${shift.title || shift.role}</b>

💰 <b>Ставка:</b> <b>${shift.rate || shift.rateText || 'Высокая ставка'}</b>
📍 <b>Локация:</b> ${shift.metro || 'Москва'}
⏰ <b>График:</b> ${shift.schedule || 'Сменный'}
🎁 <b>Условия:</b> ${shift.perks || shift.benefits || 'Питание, форма, ежедневные выплаты'}

${shift.contacts ? `📞 <b>Контакты:</b> ${shift.contacts}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
⚡️ Вы получаете это уведомление, потому что подписались на алерты для роли <b>${subscriber.role}</b>.`;

        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: subscriber.chatId,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: '⚡️ Откликнуться на сайте', url: 'https://gastroconnect.ru/workers/' }],
                [{ text: '💬 Чат @gastroconnect', url: 'https://t.me/gastroconnect' }]
              ]
            }
          })
        });
        const data = await res.json();
        if (data.ok) {
          notifiedCount++;
          subscriber.notificationCount = (subscriber.notificationCount || 0) + 1;
          subscriber.lastNotifiedAt = now;
        }
      } catch (err) {
        console.error(`[Alerts] Ошибка отправки алерта пользователю ${subscriber.telegram}:`, err.message);
      }
    } else {
      // Marked as notified in feed
      subscriber.notificationCount = (subscriber.notificationCount || 0) + 1;
      subscriber.lastNotifiedAt = now;
      notifiedCount++;
    }
  }

  saveAlerts(alerts);
  return { notifiedCount, totalMatching: matching.length };
}

module.exports = {
  subscribeAlert,
  unsubscribeAlert,
  notifySubscribersForShift,
  loadAlerts,
  normalizeCategory,
  BOT_USERNAME,
  DEFAULT_CHANNEL
};
