// GastroConnect Telegram Publisher & Community Engine
// Designed for @gastroconnect channel & community

const DEFAULT_CHANNEL = '@gastroconnect';
const DEFAULT_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'REPLACE_ME';
const DEFAULT_CHAT_ID = null;
const SITE_URL = 'https://gastroconnect.ru';
const SITE_WORKERS_URL = 'https://gastroconnect.ru/workers/';
const SITE_REGISTER_URL = 'https://gastroconnect.ru/workers/';
const TELEGRAM_CHAT_URL = 'https://t.me/gastroconnect';

const TEMPLATES = [
  {
    id: 'hot_shift',
    type: 'job',
    title: 'Горячая смена (Горячий цех)',
    category: 'Смены',
    data: {
      role: 'Повар горячего цеха',
      rate: '5 500 ₽ / смена',
      metro: 'Белорусская (5 мин пешком)',
      schedule: '11:00 – 23:00 (12 ч)',
      urgency: 'Срочно на завтра',
      perks: 'Двухразовое питание от шефа, стильная форма, такси после смены, чаевые с банкетов',
      tasks: 'Приготовление горячих блюд европейской/паназиатской кухни по ТТК, поддержание идеальной чистоты на станции.',
      requirements: 'Опыт работы в горцехе от 1 года, действующая медкнижка, пунктуальность и скорость.',
      contacts: '',
      cta: 'Напишите в Telegram или откликнитесь через бота'
    }
  },
  {
    id: 'sushi_shift',
    type: 'job',
    title: 'Повар-сушист на уикенд',
    category: 'Смены',
    data: {
      role: 'Повар-сушист / Суши-шеф',
      rate: '6 000 ₽ / смена',
      metro: 'Китай-город / Чистые пруды',
      schedule: '12:00 – 00:00',
      urgency: 'Пятница и суббота',
      perks: 'Штабное питание, форма, оплата в конце смены на карту или наличными',
      tasks: 'Приготовление роллов, сашими, нигири по авторским ТТК, быстрая отдача в пиковые часы.',
      requirements: 'Опыт на суши от 1.5 лет, безупречная разделка лосося/тунца, аккуратность.',
      contacts: '',
      cta: 'Отправляйте фото работ и опыт в личные сообщения'
    }
  },
  {
    id: 'chef_tip_herbs',
    type: 'tip',
    title: 'Лайфхак: Как снизить списания зелени на 30%',
    category: 'Обучение & Лайфхаки',
    data: {
      headline: 'Секрет свежести зелени и трав в гастроемкостях',
      body: `1️⃣ <b>Ледяной шок:</b> При получении зелени опустите её на 2 минуты в ледяную воду (+1..+3°C). Клетки насыщаются влагой, тургор восстанавливается.\n2️⃣ <b>Сушка в карусели:</b> Влага на листьях — главный враг. Зелень должна быть сухой на ощупь.\n3️⃣ <b>Контейнер с перфорацией и влажной салфеткой:</b> Укладывайте в гастроемкость GN 1/3, на дно — слегка влажное бумажное полотенце, сверху не закрывайте наглухо пленкой.\n4️⃣ <b>Температурная зона:</b> Храните в верхней части холодильной камеры (+4..+6°C), но не у вентилятора.`,
      question: 'А как на вашей кухне борются со списаниями свежих трав? Делитесь в комментариях 👇',
      tags: ['#GastroTips', '#ЛайфхакШефа', '#Техкарты', '#ПовараМосквы', '#HoReCa']
    }
  },
  {
    id: 'poll_fair_rate',
    type: 'poll',
    title: 'Опрос: Честная ставка повара в Москве (2026)',
    category: 'Пульс рынка & Опросы',
    data: {
      headline: 'Какая ставка за 12-часовую смену в горячем цехе сейчас справедлива в Москве?',
      intro: 'С каждым месяцем требования к скорости и качеству растут. Давайте сравним реальные цифры по заведениям столицы.',
      options: [
        '1️⃣ 4 500 – 5 000 ₽ / смена',
        '2️⃣ 5 000 – 5 500 ₽ / смена',
        '3️⃣ 5 500 – 6 500 ₽ / смена',
        '4️⃣ От 6 500 ₽ + процент от выручки'
      ],
      conclusion: 'Напишите в комментариях: сколько часов длится ваша смена и кормят ли нормально? 👇',
      tags: ['#ПульсРынка', '#СтавкиПоваров', '#Опрос', '#GastroConnect', '#РаботаМосква']
    }
  },
  {
    id: 'techcard_sauce',
    type: 'techcard',
    title: 'Разбор техкарты: Идеальный соус Демиглас за 4 часа',
    category: 'Обучение & Техкарты',
    data: {
      headline: 'Ресторанная оптимизация Демигласа без потери глубины вкуса',
      body: `Традиционный демиглас варят 24–36 часов, что сжигает электричество и время персонала. Как сделать концентрат быстрее:\n\n• <b>Обжарка костей:</b> Запекайте говяжьи трубчатые кости с томатной пастой и корнеплодами при 220°C до глубокой карамелизации.\n• <b>Деглазирование:</b> Обязательно смывайте пригар со дна противня сухим красным вином — там 40% вкуса умами.\n• <b>Скороварка / Автоклав:</b> Варка под давлением 1.2 бара сокращает экстракцию коллагена с 20 часов до 3.5 часов!\n• <b>Финиш:</b> Выпаривание на 50% и затягивание холодным сливочным маслом перед подачей.`,
      question: 'Хотите полную техкарту в PDF? Ставьте 🔥 в реакциях!',
      tags: ['#ТехкартаНедели', '#Демиглас', '#СоусыШефа', '#GastroConnect', '#Кухня']
    }
  }
];

/**
 * Format post for Telegram with clean typography, emoji highlights and tags
 */
function formatTelegramPost(rawPayload = {}) {
  const payload = rawPayload.data ? { ...rawPayload, ...rawPayload.data } : rawPayload;
  const type = payload.type || rawPayload.type || 'job';
  const registerLink = payload.registerUrl || SITE_REGISTER_URL;
  const chatLink = payload.chatUrl || TELEGRAM_CHAT_URL;
  let html = '';
  let markdown = '';
  let hashtags = [];

  if (type === 'job') {
    const role = payload.role || payload.title || 'Повар на смену';
    const rate = payload.rate || 'Ставка договорная';
    const metro = payload.metro || 'Москва';
    const schedule = payload.schedule || 'Сменный / Гибкий';
    const perks = payload.perks || 'Питание, форма, своевременные выплаты';
    const tasks = payload.tasks || payload.description || 'Работа на позиции по стандартам заведения';
    const requirements = payload.requirements || 'Опыт работы, действующая медкнижка';
    const contacts = payload.contacts ? String(payload.contacts).trim() : '';
    const urgency = payload.urgency ? `⚡️ <b>${escapeHtml(payload.urgency)}</b>\n` : '';

    // Emoji icon according to role
    let roleEmoji = '👨‍🍳';
    const rLower = role.toLowerCase();
    if (rLower.includes('горяч') || rLower.includes('hot')) roleEmoji = '🔥';
    else if (rLower.includes('холодн') || rLower.includes('cold')) roleEmoji = '❄️';
    else if (rLower.includes('су-шеф') || rLower.includes('шеф') || rLower.includes('chef')) roleEmoji = '👑';
    else if (rLower.includes('суши') || rLower.includes('sushi')) roleEmoji = '🍣';
    else if (rLower.includes('пицц') || rLower.includes('pizza')) roleEmoji = '🍕';
    else if (rLower.includes('кондит') || rLower.includes('пекар')) roleEmoji = '🥐';
    else if (rLower.includes('бариста') || rLower.includes('бар')) roleEmoji = '☕️';

    // Tags
    hashtags = [
      '#' + role.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, ''),
      '#РаботаМосква',
      '#Смена',
      '#GastroConnect'
    ];
    if (metro && metro !== 'Москва') {
      const cleanMetro = metro.split(/[,(]/)[0].trim().replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
      hashtags.push('#м_' + cleanMetro);
    }

    const contactsHtml = contacts ? `\n📱 <b>Прямой контакт для отклика:</b>\n👉 <b>${escapeHtml(contacts)}</b>\n` : '';

    // Compact, punchy, beautiful format: Position, Rate, Location, Contact
    html = `${roleEmoji} <b>${escapeHtml(role)}</b>

💰 <b>${escapeHtml(rate)}</b>
📍 ${escapeHtml(metro)}
⏰ ${escapeHtml(schedule)}
🎁 ${escapeHtml(perks)}

${contactsHtml}⚡️ <b><a href="${registerLink}">Забрать смену / Откликнуться</a></b>
💬 <b><a href="${chatLink}">Чат поваров @gastroconnect</a></b>

${hashtags.slice(0, 3).join(' ')}`;

  } else if (type === 'tip') {
    const headline = payload.headline || payload.title || 'Лайфхак шеф-повара';
    const body = payload.body || payload.description || '';
    const question = payload.question || 'Делитесь вашим мнением в комментариях 👇';
    hashtags = payload.tags || ['#GastroTips', '#ЛайфхакШефа', '#GastroConnect', '#Кухня'];

    html = `💡 <b>ЛАЙФХАК ШЕФА | #GastroTips</b>
━━━━━━━━━━━━━━━━━━━━
👨‍🍳 <b>${escapeHtml(headline)}</b>

${body}

━━━━━━━━━━━━━━━━━━━━
💬 <b>Обсудить в чате:</b> <a href="${chatLink}">Чат @gastroconnect</a>
🌐 <b>Наш сайт:</b> <a href="${registerLink}">GastroConnect.ru</a>

${hashtags.join(' ')}`;

  } else if (type === 'poll') {
    const headline = payload.headline || payload.title || 'Опрос ресторанного сообщества';
    const intro = payload.intro || '';
    const options = payload.options || [];
    const conclusion = payload.conclusion || 'Пишите ваши мысли в комментариях 👇';
    hashtags = payload.tags || ['#ПульсРынка', '#Опрос', '#GastroConnect', '#HoReCa'];

    html = `📊 <b>ПУЛЬС РЫНКА | Опрос GastroConnect</b>
━━━━━━━━━━━━━━━━━━━━
🔥 <b>${escapeHtml(headline)}</b>

${escapeHtml(intro)}

${options.map(opt => `<b>${escapeHtml(opt)}</b>`).join('\n')}

━━━━━━━━━━━━━━━━━━━━
💬 <b>Обсудить в чате:</b> <a href="${chatLink}">Чат @gastroconnect</a>
🌐 <b>Наш сайт:</b> <a href="${registerLink}">GastroConnect.ru</a>

${hashtags.join(' ')}`;

  } else if (type === 'techcard') {
    const headline = payload.headline || payload.title || 'Разбор техкарты недели';
    const body = payload.body || '';
    const question = payload.question || 'Хотите полную техкарту в PDF? Ставьте реакции 🔥';
    hashtags = payload.tags || ['#ТехкартаНедели', '#GastroConnect', '#Фудкост', '#Шеф'];

    html = `🥩 <b>РАЗБОР ТЕХКАРТЫ | GastroConnect</b>
━━━━━━━━━━━━━━━━━━━━
📖 <b>${escapeHtml(headline)}</b>

${body}

━━━━━━━━━━━━━━━━━━━━
💬 <b>Обсудить в чате:</b> <a href="${chatLink}">Чат @gastroconnect</a>
🌐 <b>Наш сайт:</b> <a href="${registerLink}">GastroConnect.ru</a>

${hashtags.join(' ')}`;

  } else {
    // Custom post
    const text = payload.customMessage || payload.text || payload.description || '';
    hashtags = payload.tags || ['#GastroConnect', '#HoReCa'];
    html = `📢 <b>СООБЩЕСТВО GASTROCONNECT</b>
━━━━━━━━━━━━━━━━━━━━
${text}

━━━━━━━━━━━━━━━━━━━━
💬 <b>Обсудить в чате:</b> <a href="${chatLink}">Чат @gastroconnect</a>
🌐 <b>Наш сайт:</b> <a href="${registerLink}">GastroConnect.ru</a>

${hashtags.join(' ')}`;
  }

  // Create clean plain text version (stripping HTML tags)
  const plainText = html.replace(/<[^>]*>/g, '');

  return {
    type,
    html,
    plainText,
    hashtags,
    previewChannel: DEFAULT_CHANNEL
  };
}

/**
 * Publish post to Telegram channel via Bot API
 */
async function publishToTelegram(postData, botToken = null, targetChannel = null) {
  const token = botToken || process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  // If targetChannel is not explicitly provided, always target the public channel @gastroconnect
  const channel = targetChannel || '@gastroconnect';
  
  const formatted = formatTelegramPost(postData);

  // If no bot token is provided in environment, simulate graceful fallback with structured result
  if (!token) {
    return {
      success: false,
      mode: 'manual_ready',
      message: 'Telegram Bot Token не настроен в .env. Сообщение идеально сгенерировано и готово для мгновенной публикации или ручной отправки в @gastroconnect.',
      channel,
      formatted,
      copyReadyText: formatted.html,
      plainText: formatted.plainText,
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent('https://t.me/gastroconnect')}&text=${encodeURIComponent(formatted.plainText)}`
    };
  }

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    // Inline keyboard for interactions
    const inline_keyboard = [];
    const registerLink = postData.registerUrl || SITE_REGISTER_URL;
    const chatLink = postData.chatUrl || TELEGRAM_CHAT_URL;

    if (postData.type === 'job') {
      inline_keyboard.push([
        { text: '⚡️ Зарегистрироваться и откликнуться', url: 'https://gastroconnect.ru/workers/' }
      ]);
      inline_keyboard.push([
        { text: '💬 Чат сообщества @gastroconnect', url: 'https://t.me/gastroconnect' }
      ]);
    } else {
      inline_keyboard.push([
        { text: '🌐 GastroConnect.ru', url: 'https://gastroconnect.ru/' },
        { text: '💬 Чат @gastroconnect', url: 'https://t.me/gastroconnect' }
      ]);
    }

    let htmlToSend = formatted.html;
    if (postData.customHtml) {
      htmlToSend = postData.customHtml;
    }

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channel,
        text: htmlToSend,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard }
      })
    });

    const data = await response.json();
    if (!data.ok) {
      return {
        success: false,
        mode: 'telegram_api_error',
        error: data.description || 'Failed to send message to Telegram channel',
        channel,
        formatted,
        copyReadyText: formatted.html
      };
    }

    return {
      success: true,
      mode: 'sent_via_bot',
      messageId: data.result.message_id,
      channel,
      postUrl: `https://t.me/${channel.replace('@', '')}/${data.result.message_id}`,
      formatted
    };
  } catch (error) {
    return {
      success: false,
      mode: 'network_error',
      error: error.message,
      channel,
      formatted,
      copyReadyText: formatted.html
    };
  }
}

/**
 * Two-step publication flow:
 * 1. Post full shift to the public channel (@gastroconnect)
 * 2. Post notification/teaser into the discussion chat with links to channel post & site
 */
async function publishTwoStepBroadcast(postData, botToken = null, targetChannel = null, targetChatId = null) {
  const token = botToken || process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  const channel = targetChannel || process.env.TELEGRAM_CHANNEL_ID || DEFAULT_CHANNEL;
  const chatId = targetChatId || process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

  // Step 1: Publish to Public Channel
  const channelResult = await publishToTelegram(postData, token, channel);
  if (!channelResult.success) {
    return {
      success: false,
      step: 'channel',
      error: channelResult.error || 'Failed to publish to channel',
      channelResult
    };
  }

  const postUrl = channelResult.postUrl || `https://t.me/${channel.replace('@', '')}/${channelResult.messageId}`;
  const registerLink = postData.registerUrl || SITE_REGISTER_URL;

  // Step 2: If chat ID is available, post teaser to Chat Group
  let chatResult = null;
  if (chatId) {
    try {
      const payload = postData.data ? { ...postData, ...postData.data } : postData;
      const role = payload.role || payload.title || 'Смена в ресторан';
      const rate = payload.rate || payload.salary || 'Оплата договорная';
      const metro = payload.metro || payload.city || 'Москва';

      const chatMessageText = `🔥 <b>НОВАЯ СМЕНА В ПАБЛИКЕ GASTROCONNECT!</b>
━━━━━━━━━━━━━━━━━━━━
📌 <b>Позиция:</b> ${escapeHtml(role)}
💰 <b>Ставка:</b> ${escapeHtml(rate)}
📍 <b>Локация:</b> ${escapeHtml(metro)}

👉 <b>Полные условия и требования:</b> <a href="${postUrl}">Смотреть в канале</a>
⚡️ <b>Быстрый отклик:</b> <a href="${registerLink}">Регистрация на сайте</a>`;

      const chatKeyboard = [
        [
          { text: '📖 Смотреть пост в канале', url: postUrl },
          { text: '⚡️ Откликнуться на сайте', url: registerLink }
        ]
      ];

      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: chatMessageText,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
          reply_markup: { inline_keyboard: chatKeyboard }
        })
      });
      chatResult = await res.json();
    } catch (e) {
      chatResult = { ok: false, error: e.message };
    }
  }

  return {
    success: true,
    channelResult,
    chatResult,
    postUrl,
    chatInviteUrl: TELEGRAM_CHAT_URL,
    siteRegisterUrl: registerLink
  };
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatBulletList(text) {
  if (!text) return '• Все условия уточняются у шефа';
  if (Array.isArray(text)) {
    return text.map(item => `• ${escapeHtml(item.trim())}`).join('\n');
  }
  const items = text.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  if (items.length <= 1) {
    return `• ${escapeHtml(text)}`;
  }
  return items.map(item => `• ${escapeHtml(item)}`).join('\n');
}

module.exports = {
  TEMPLATES,
  formatTelegramPost,
  publishToTelegram,
  publishTwoStepBroadcast,
  DEFAULT_CHANNEL,
  TELEGRAM_CHAT_URL,
  SITE_URL,
  SITE_REGISTER_URL
};
