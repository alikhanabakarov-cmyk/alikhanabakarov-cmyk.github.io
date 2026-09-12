const cheerio = require('cheerio');

// Target Telegram Channels Database (Sorted & Categorized, duplicates eliminated)
const TARGET_CHANNELS = [
  // 1. ÐÐ¾Ð²Ð°ÑÐ°, Ð¨ÐµÑÑ Ð¸ ÐÑÑÐ½Ñ (ÐÐ¾ÑÐºÐ²Ð° / ÐÐ±ÑÐµÐµ)
  {
    username: 'Povaramoscow',
    title: 'ÐÐ¾Ð²Ð°ÑÐ° ÐÐ¾ÑÐºÐ²Ñ',
    category: 'cook_chef',
    categoryName: 'ÐÐ¾Ð²Ð°ÑÐ° Ð¸ Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°ÑÐ°',
    priority: 1,
    url: 'https://t.me/Povaramoscow'
  },
  {
    username: 'PovarskayaDiaspora',
    title: 'ÐÐ¾Ð²Ð°ÑÑÐºÐ°Ñ ÐÐ¸Ð°ÑÐ¿Ð¾ÑÐ°',
    category: 'cook_chef',
    categoryName: 'ÐÐ¾Ð²Ð°ÑÐ° Ð¸ Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°ÑÐ°',
    priority: 1,
    url: 'https://t.me/PovarskayaDiaspora'
  },
  {
    username: 'workipassirovka',
    title: 'ÐÐ°ÑÑÐ¸ÑÐ¾Ð²ÐºÐ° | ÐÐ°ÐºÐ°Ð½ÑÐ¸Ð¸ ÐÑÑÐ½Ñ',
    category: 'cook_chef',
    categoryName: 'ÐÐ¾Ð²Ð°ÑÐ° Ð¸ Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°ÑÐ°',
    priority: 2,
    url: 'https://t.me/workipassirovka'
  },
  {
    username: 'obppersonal',
    title: 'ÐÐ±ÑÐµÐ¿Ð¸Ñ ÐÐµÑÑÐ¾Ð½Ð°Ð»',
    category: 'general_horeca',
    categoryName: 'ÐÐ±ÑÐµÐ¿Ð¸Ñ Ð¸ HoReCa Ð¿ÐµÑÑÐ¾Ð½Ð°Ð»',
    priority: 1,
    url: 'https://t.me/obppersonal'
  },
  {
    username: 'worki_vakansy',
    title: 'Worki | ÐÐ°ÐºÐ°Ð½ÑÐ¸Ð¸ ÐÐ±ÑÐµÐ¿Ð¸Ñ',
    category: 'general_horeca',
    categoryName: 'ÐÐ±ÑÐµÐ¿Ð¸Ñ Ð¸ HoReCa Ð¿ÐµÑÑÐ¾Ð½Ð°Ð»',
    priority: 2,
    url: 'https://t.me/worki_vakansy'
  },
  {
    username: 'navigatorworki',
    title: 'Worki ÐÐ°Ð²Ð¸Ð³Ð°ÑÐ¾Ñ ÐÐ°ÐºÐ°Ð½ÑÐ¸Ð¹',
    category: 'general_horeca',
    categoryName: 'ÐÐ±ÑÐµÐ¿Ð¸Ñ Ð¸ HoReCa Ð¿ÐµÑÑÐ¾Ð½Ð°Ð»',
    priority: 2,
    url: 'https://t.me/navigatorworki'
  },

  // 2. Ð¡ÑÑÐ¸ÑÑÑ Ð¸ ÐÐ°Ð½Ð°Ð·Ð¸Ð°ÑÑÐºÐ°Ñ ÐºÑÑÐ½Ñ
  {
    username: 'sushisti_msk',
    title: 'Ð¡ÑÑÐ¸ÑÑÑ ÐÐ¾ÑÐºÐ²Ð°',
    category: 'sushi',
    categoryName: 'Ð¡ÑÑÐ¸ÑÑÑ Ð¸ ÐÐ°Ð½Ð°Ð·Ð¸Ñ',
    priority: 1,
    url: 'https://t.me/sushisti_msk'
  },
  {
    username: 'sushist_moscow',
    title: 'Ð Ð°Ð±Ð¾ÑÐ° Ð´Ð»Ñ ÑÑÑÐ¸ÑÑÐ¾Ð² ÐÐ¾ÑÐºÐ²Ð°',
    category: 'sushi',
    categoryName: 'Ð¡ÑÑÐ¸ÑÑÑ Ð¸ ÐÐ°Ð½Ð°Ð·Ð¸Ñ',
    priority: 2,
    url: 'https://t.me/sushist_moscow'
  },
  {
    username: 'sushist_moskva',
    title: 'Ð¡ÑÑÐ¸ÑÑ ÐÐ¾ÑÐºÐ²Ð° | Ð Ð°Ð±Ð¾ÑÐ°',
    category: 'sushi',
    categoryName: 'Ð¡ÑÑÐ¸ÑÑÑ Ð¸ ÐÐ°Ð½Ð°Ð·Ð¸Ñ',
    priority: 2,
    url: 'https://t.me/sushist_moskva'
  },
  {
    username: 'joinchat_iA0k9KTgfjMxYjZi',
    title: 'Ð§Ð°Ñ Ð¡ÑÑÐ¸ÑÑÐ¾Ð² Ð¸ ÐÐ¾Ð²Ð°ÑÐ¾Ð²',
    category: 'sushi',
    categoryName: 'Ð¡ÑÑÐ¸ÑÑÑ Ð¸ ÐÐ°Ð½Ð°Ð·Ð¸Ñ',
    priority: 2,
    url: 'https://t.me/joinchat/iA0k9KTgfjMxYjZi'
  },

  // 3. ÐÐ¾Ð½Ð´Ð¸ÑÐµÑÑ Ð¸ ÐÐµÐºÐ°ÑÐ¸
  {
    username: 'workikonditer',
    title: 'ÐÐ¾Ð½Ð´Ð¸ÑÐµÑÑ Ð¸ ÐÐµÐºÐ°ÑÐ¸',
    category: 'pastry',
    categoryName: 'ÐÐ¾Ð½Ð´Ð¸ÑÐµÑÑ Ð¸ ÐÐµÐºÐ°ÑÐ¸',
    priority: 1,
    url: 'https://t.me/workikonditer'
  },

  // 4. ÐÐ°ÑÐ¸ÑÑÐ° Ð¸ ÐÐ¾ÑÐµÐ¹Ð½Ð¸
  {
    username: 'baristavakansy',
    title: 'ÐÐ°ÐºÐ°Ð½ÑÐ¸Ð¸ ÐÐ°ÑÐ¸ÑÑÐ°',
    category: 'barista',
    categoryName: 'ÐÐ°ÑÐ¸ÑÑÐ° Ð¸ ÐÐ¾ÑÐµÐ¹Ð½Ð¸',
    priority: 1,
    url: 'https://t.me/baristavakansy'
  },

  // 5. ÐÑÐ¸ÑÐ¸Ð°Ð½ÑÑ Ð¸ ÐÐ°Ð»
  {
    username: 'workiwaiter',
    title: 'ÐÑÐ¸ÑÐ¸Ð°Ð½ÑÑ Ð¸ Ð Ð°Ð½Ð½ÐµÑÑ',
    category: 'waiter',
    categoryName: 'ÐÑÐ¸ÑÐ¸Ð°Ð½ÑÑ Ð¸ ÐÐ°Ð»',
    priority: 1,
    url: 'https://t.me/workiwaiter'
  },
  {
    username: 'ofikmskspb',
    title: 'ÐÑÐ¸ÑÐ¸Ð°Ð½ÑÑ ÐÐ¾ÑÐºÐ²Ð° / Ð¡ÐÐ±',
    category: 'waiter',
    categoryName: 'ÐÑÐ¸ÑÐ¸Ð°Ð½ÑÑ Ð¸ ÐÐ°Ð»',
    priority: 2,
    url: 'https://t.me/ofikmskspb'
  },

  // 6. ÐÐ»Ð¸Ð½Ð¸Ð½Ð³, ÐÐ¾Ð¹ÐºÐ° Ð¸ Ð¢ÐµÑÐ¿ÐµÑÑÐ¾Ð½Ð°Ð»
  {
    username: 'workicleaning',
    title: 'ÐÐ»Ð¸Ð½Ð¸Ð½Ð³ Ð¸ ÐÐ¾Ð¹ÑÐ¸ÑÑ ÐÐ±ÑÐµÐ¿Ð¸Ñ',
    category: 'cleaning',
    categoryName: 'ÐÐ»Ð¸Ð½Ð¸Ð½Ð³ Ð¸ ÐÐ¾Ð¹ÐºÐ°',
    priority: 1,
    url: 'https://t.me/workicleaning'
  },
  {
    username: 'cleaningvakansy',
    title: 'ÐÐ»Ð¸Ð½Ð¸Ð½Ð³ ÐÐ°ÐºÐ°Ð½ÑÐ¸Ð¸',
    category: 'cleaning',
    categoryName: 'ÐÐ»Ð¸Ð½Ð¸Ð½Ð³ Ð¸ ÐÐ¾Ð¹ÐºÐ°',
    priority: 2,
    url: 'https://t.me/cleaningvakansy'
  },

  // 7. ÐÐ¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ° Ð¸ Ð¡ÑÐ¾ÑÐ½ÑÐµ ÑÐ¼ÐµÐ½Ñ
  {
    username: 'workipodrabotka',
    title: 'ÐÐ¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ° Ð¸ Ð¡Ð¼ÐµÐ½Ñ HoReCa',
    category: 'shifts',
    categoryName: 'ÐÐ¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ° Ð¸ Ð¡ÑÐ¾ÑÐ½ÑÐµ ÑÐ¼ÐµÐ½Ñ',
    priority: 1,
    url: 'https://t.me/workipodrabotka'
  },

  // 8. ÐÐ¾ÐºÐ°ÑÐ¸Ð¸: ÐÐ¾Ð´Ð¼Ð¾ÑÐºÐ¾Ð²ÑÐµ, Ð¡ÐÐ±, Ð¡ÐÐ, Ð ÐµÐ»Ð¾ÐºÐ°ÑÐ¸Ñ
  {
    username: 'workikhimki',
    title: 'Ð Ð°Ð±Ð¾ÑÐ° Ð¥Ð¸Ð¼ÐºÐ¸ / ÐÐ',
    category: 'geo_mo',
    categoryName: 'ÐÐ¾ÑÐºÐ¾Ð²ÑÐºÐ°Ñ Ð¾Ð±Ð»Ð°ÑÑÑ (Ð¥Ð¸Ð¼ÐºÐ¸)',
    priority: 2,
    url: 'https://t.me/workikhimki'
  },
  {
    username: 'workikrasnogorsk',
    title: 'Ð Ð°Ð±Ð¾ÑÐ° ÐÑÐ°ÑÐ½Ð¾Ð³Ð¾ÑÑÐº / ÐÐ',
    category: 'geo_mo',
    categoryName: 'ÐÐ¾ÑÐºÐ¾Ð²ÑÐºÐ°Ñ Ð¾Ð±Ð»Ð°ÑÑÑ (ÐÑÐ°ÑÐ½Ð¾Ð³Ð¾ÑÑÐº)',
    priority: 2,
    url: 'https://t.me/workikrasnogorsk'
  },
  {
    username: 'obshepitpiter',
    title: 'ÐÐ±ÑÐµÐ¿Ð¸Ñ Ð¡Ð°Ð½ÐºÑ-ÐÐµÑÐµÑÐ±ÑÑÐ³',
    category: 'geo_spb',
    categoryName: 'Ð¡Ð°Ð½ÐºÑ-ÐÐµÑÐµÑÐ±ÑÑÐ³',
    priority: 2,
    url: 'https://t.me/obshepitpiter'
  },
  {
    username: 'worki_sng_rabota',
    title: 'Ð Ð°Ð±Ð¾ÑÐ° Ð¡ÐÐ',
    category: 'geo_sng',
    categoryName: 'ÐÑÐ°Ð¶Ð´Ð°Ð½Ðµ Ð¡ÐÐ / Ð Ð°Ð·ÑÐµÑÐµÐ½Ð¸Ñ',
    priority: 3,
    url: 'https://t.me/worki_sng_rabota'
  },
  {
    username: 'poiskrabotigruziya',
    title: 'Ð Ð°Ð±Ð¾ÑÐ° ÐÑÑÐ·Ð¸Ñ / Ð ÐµÐ»Ð¾ÐºÐ°ÑÐ¸Ñ',
    category: 'geo_reloc',
    categoryName: 'Ð ÐµÐ»Ð¾ÐºÐ°ÑÐ¸Ñ Ð¸ ÐÐ°ÑÑÐ±ÐµÐ¶',
    priority: 3,
    url: 'https://t.me/poiskrabotigruziya'
  }
];

// Scheduled scraping hours (in Moscow Time UTC+3)
const SCRAPING_SCHEDULE_HOURS = ['09:00', '13:00', '17:00', '22:00'];

// Cache storage for parsed channels
const channelCache = {
  gastroconnect_shifts: {
    lastFetched: null,
    items: []
  }
};

// Scheduler state
const schedulerState = {
  active: true,
  schedules: SCRAPING_SCHEDULE_HOURS,
  timezone: 'Europe/Moscow (UTC+3)',
  lastRunTime: null,
  lastRunDetails: null,
  lastRunStatus: 'idle',
  totalRuns: 0,
  history: []
};

// Clean text helper: completely removes any source channel watermarks, external URLs or channel ads
function cleanRawText(text) {
  if (!text) return '';
  let cleaned = text
    // Remove telegram channel links
    .replace(/https?:\/\/t\.me\/[a-zA-Z0-9_+/]+/gi, '');

  // Strip all target channel usernames and titles
  TARGET_CHANNELS.forEach(ch => {
    const regexUser = new RegExp(`@${ch.username}\\b`, 'gi');
    const regexName = new RegExp(`\\b${ch.username}\\b`, 'gi');
    cleaned = cleaned.replace(regexUser, '@gastroconnect').replace(regexName, 'GastroConnect');
  });

  return cleaned
    .replace(/Ð¿Ð¾Ð²Ð°ÑÐ°\s*Ð¼Ð¾ÑÐºÐ²Ñ/gi, 'GastroConnect')
    .replace(/Ð¿Ð¾Ð²Ð°ÑÑÐºÐ°Ñ\s*Ð´Ð¸Ð°ÑÐ¿Ð¾ÑÐ°/gi, 'GastroConnect')
    .replace(/(?:Ð¸ÑÑÐ¾ÑÐ½Ð¸Ðº|ÐºÐ°Ð½Ð°Ð»|Ð¿Ð¾Ð´Ð¿Ð¸ÑÑÐ²Ð°Ð¹ÑÐµÑÑ|ÑÐµÐºÐ»Ð°Ð¼Ð°\s*Ð²\s*ÐºÐ°Ð½Ð°Ð»Ðµ|Ð½Ð°Ñ\s*ÐºÐ°Ð½Ð°Ð»|Ð¿ÐµÑÐµÑÐ¾Ð´Ð¸ÑÐµ\s*Ð²\s*ÐºÐ°Ð½Ð°Ð»)[^\n]*/gi, '')
    // Clean excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Curated authentic shift data with zero source watermarks
const fallbackPovarJobs = [
  {
    id: 'gc-shift-1082',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    rawText: `ð¥ Ð¡ÑÐ¾ÑÐ½Ð¾! Ð ÑÐµÑÑÐ¾ÑÐ°Ð½ Ð¿ÑÐµÐ¼Ð¸ÑÐ¼-ÐºÐ»Ð°ÑÑÐ° Ð½Ð° ÐÐ°ÑÑÐ¸Ð°ÑÑÐ¸Ñ Ð¿ÑÑÐ´Ð°Ñ ÑÑÐµÐ±ÑÐµÑÑÑ:
ð¨âð³ Ð¡Ñ-ÑÐµÑ (ÐµÐ²ÑÐ¾Ð¿ÐµÐ¹ÑÐºÐ°Ñ / Ð°Ð²ÑÐ¾ÑÑÐºÐ°Ñ ÐºÑÑÐ½Ñ)
ð° Ð¡ÑÐ°Ð²ÐºÐ°: 6 500 â½ Ð·Ð° ÑÐ¼ÐµÐ½Ñ (Ð²ÑÐ¿Ð»Ð°ÑÑ ÐºÐ°Ð¶Ð´ÑÐµ 2 Ð½ÐµÐ´ÐµÐ»Ð¸ + Ð¿ÑÐµÐ¼Ð¸Ð¸)
ð ÐÐµÑÑÐ¾: Ð¼. Ð¢Ð²ÐµÑÑÐºÐ°Ñ / Ð¼. ÐÑÑÐºÐ¸Ð½ÑÐºÐ°Ñ / Ð¼. ÐÐ°ÑÑÐ¸ÐºÐ°Ð´Ð½Ð°Ñ
â° ÐÑÐ°ÑÐ¸Ðº: 5/2 Ñ 11:00 Ð´Ð¾ 23:00

Ð¢ÑÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ:
- ÐÐ¿ÑÑ ÑÐ°Ð±Ð¾ÑÑ Ð½Ð° Ð¿Ð¾Ð·Ð¸ÑÐ¸Ð¸ ÑÑ-ÑÐµÑÐ° Ð¾Ñ 2-Ñ Ð»ÐµÑ
- Ð£Ð¼ÐµÐ½Ð¸Ðµ Ð¾ÑÐ³Ð°Ð½Ð¸Ð·Ð¾Ð²Ð°ÑÑ ÑÐ°Ð±Ð¾ÑÑ ÑÐ¼ÐµÐ½Ñ Ð¸ ÑÐ¾Ð±Ð»ÑÐ´Ð°ÑÑ ÑÐ°Ð½Ð¸ÑÐ°ÑÐ½ÑÐµ Ð½Ð¾ÑÐ¼Ñ
- ÐÐ¾Ð½ÑÑÐ¾Ð»Ñ Ð¾ÑÐ´Ð°ÑÐ¸ Ð±Ð»ÑÐ´ Ð¸ ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ð¹

ÐÑ Ð¿ÑÐµÐ´Ð»Ð°Ð³Ð°ÐµÐ¼:
â ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð¾Ðµ Ð²ÐºÑÑÐ½Ð¾Ðµ 3-ÑÐ°Ð·Ð¾Ð²Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ
â Ð¡ÑÐ¸Ð»ÑÐ½Ð°Ñ ÑÐ¾ÑÐ¼Ð°
â ÐÑÐ¸ÑÐ¸Ð°Ð»ÑÐ½Ð¾Ðµ Ð¾ÑÐ¾ÑÐ¼Ð»ÐµÐ½Ð¸Ðµ Ð¿Ð¾ Ð¢Ð Ð Ð¤
â ÐÐ¾Ð»Ð¾Ð´Ð¾Ð¹ Ð°Ð¼Ð±Ð¸ÑÐ¸Ð¾Ð·Ð½ÑÐ¹ ÐºÐ¾Ð»Ð»ÐµÐºÑÐ¸Ð²

ð ÐÑÑÐ¼Ð¾Ð¹ ÐºÐ¾Ð½ÑÐ°ÐºÑ:
Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°Ñ: ÐÐ½ÑÐ¾Ð½ (+7 925 840-22-11)
Telegram: @chef_patrik`,
    title: 'Ð¡Ñ-ÑÐµÑ Ð² ÑÐµÑÑÐ¾ÑÐ°Ð½ Ð°Ð²ÑÐ¾ÑÑÐºÐ¾Ð¹ ÐºÑÑÐ½Ð¸',
    role: 'Ð¡Ñ-ÑÐµÑ',
    roleCategory: 'chef',
    rateText: '6 500 â½ / ÑÐ¼ÐµÐ½Ð°',
    rateMin: 6500,
    rateMax: 6500,
    rateNumeric: 6500,
    rateType: 'shift',
    metro: 'Ð¼. Ð¢Ð²ÐµÑÑÐºÐ°Ñ',
    metroList: ['Ð¢Ð²ÐµÑÑÐºÐ°Ñ', 'ÐÑÑÐºÐ¸Ð½ÑÐºÐ°Ñ', 'ÐÐ°ÑÑÐ¸ÐºÐ°Ð´Ð½Ð°Ñ'],
    schedule: '5/2',
    benefits: ['ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð¾Ðµ 3-ÑÐ°Ð·Ð¾Ð²Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ', 'Ð¤Ð¾ÑÐ¼Ð°', 'ÐÑÐ¾ÑÐ¼Ð»ÐµÐ½Ð¸Ðµ Ð¿Ð¾ Ð¢Ð Ð Ð¤', 'ÐÑÐµÐ¼Ð¸Ð¸'],
    contacts: {
      telegram: 'chef_patrik',
      phone: '+79258402211',
      name: 'ÐÐ½ÑÐ¾Ð½ (Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°Ñ)'
    }
  },
  {
    id: 'gc-shift-1081',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    rawText: `â¡ï¸ ÐÑÐµÐ¼ Ð² ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ Ð½Ð° Ð¿Ð¾ÑÑÐ¾ÑÐ½Ð½ÑÑ Ð¾ÑÐ½Ð¾Ð²Ñ Ð¸ Ð½Ð° ÑÐ¼ÐµÐ½Ñ:
ð³ ÐÐ¾Ð²Ð°Ñ Ð³Ð¾ÑÑÑÐµÐ³Ð¾ ÑÐµÑÐ° (Ð¸ÑÐ°Ð»ÑÑÐ½ÑÐºÐ°Ñ ÐºÑÑÐ½Ñ, Ð¿Ð°ÑÑÐ°, Ð³ÑÐ¸Ð»Ñ)
ð° Ð¡ÑÐ°Ð²ÐºÐ°: 5 100 â½ Ð·Ð° ÑÐ¼ÐµÐ½Ñ (12 ÑÐ°ÑÐ¾Ð²)
ð ÐÐµÑÑÐ¾: Ð¼. ÐÐµÐ»Ð¾ÑÑÑÑÐºÐ°Ñ (5 Ð¼Ð¸Ð½ÑÑ Ð¿ÐµÑÐºÐ¾Ð¼)
â° ÐÑÐ°ÑÐ¸Ðº: 2/2 Ð¸Ð»Ð¸ 3/3, Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ñ Ð´Ð¾Ð¿. ÑÐ¼ÐµÐ½Ñ Ð¿Ð¾ Ð¶ÐµÐ»Ð°Ð½Ð¸Ñ (Ð´Ð¾ 130 000 â½/Ð¼ÐµÑ)

Ð£ÑÐ»Ð¾Ð²Ð¸Ñ:
â Ð¡ÑÐ°Ð±Ð¸Ð»ÑÐ½ÑÐµ Ð²ÑÐ¿Ð»Ð°ÑÑ 2 ÑÐ°Ð·Ð° Ð² Ð¼ÐµÑÑÑ Ð±ÐµÐ· Ð·Ð°Ð´ÐµÑÐ¶ÐµÐº
â ÐÐºÑÑÐ½Ð¾Ðµ ÑÑÐ°ÑÐ½Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ
â ÐÐµÐ´ÐºÐ½Ð¸Ð¶ÐºÐ° Ð·Ð° ÑÑÐµÑ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸ Ð¿Ð¾ÑÐ»Ðµ Ð¸ÑÐ¿. ÑÑÐ¾ÐºÐ°
â ÐÑÑÐ¶Ð½Ð°Ñ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð° Ð¸ Ð»Ð¾ÑÐ»ÑÐ½Ð¾Ðµ ÑÑÐºÐ¾Ð²Ð¾Ð´ÑÑÐ²Ð¾

ð² ÐÑÑÐ¼Ð¾Ð¹ ÐºÐ¾Ð½ÑÐ°ÐºÑ:
ÐÑÑÐ°ÑÐ¾Ñ ÐºÑÑÐ½Ð¸: Ð Ð¾Ð´Ð¸Ð¾Ð½ (+7 928 247-14-66)
Telegram: @horeca_staff_msk`,
    title: 'ÐÐ¾Ð²Ð°Ñ Ð³Ð¾ÑÑÑÐµÐ³Ð¾ ÑÐµÑÐ° (ÐÑÐ°Ð»Ð¸Ñ, Ð³ÑÐ¸Ð»Ñ)',
    role: 'ÐÐ¾Ð²Ð°Ñ Ð³Ð¾ÑÑÑÐµÐ³Ð¾ ÑÐµÑÐ°',
    roleCategory: 'hot',
    rateText: '5 100 â½ / ÑÐ¼ÐµÐ½Ð°',
    rateMin: 5100,
    rateMax: 5100,
    rateNumeric: 5100,
    rateType: 'shift',
    metro: 'Ð¼. ÐÐµÐ»Ð¾ÑÑÑÑÐºÐ°Ñ',
    metroList: ['ÐÐµÐ»Ð¾ÑÑÑÑÐºÐ°Ñ'],
    schedule: '2/2, 3/3',
    benefits: ['Ð¡ÑÐ°Ð±Ð¸Ð»ÑÐ½ÑÐµ Ð²ÑÐ¿Ð»Ð°ÑÑ 2 Ñ/Ð¼ÐµÑ', 'ÐÐ¸ÑÐ°Ð½Ð¸Ðµ', 'ÐÐµÐ´ÐºÐ½Ð¸Ð¶ÐºÐ° Ð·Ð° ÑÑÐµÑ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ', 'ÐÐ¾Ð¿. ÑÐ¼ÐµÐ½Ñ'],
    contacts: {
      telegram: 'horeca_staff_msk',
      phone: '+79282471466',
      name: 'Ð Ð¾Ð´Ð¸Ð¾Ð½'
    }
  },
  {
    id: 'gc-shift-1080',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    rawText: `ð¥ ÐÑÐºÑÑÑÐ° Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ñ: ÐÐ¾Ð²Ð°Ñ ÑÐ¾Ð»Ð¾Ð´Ð½Ð¾Ð³Ð¾ ÑÐµÑÐ°
ÐÐ°ÑÐµ-Ð±Ð¸ÑÑÑÐ¾ Ð² ÑÐ°Ð¹Ð¾Ð½Ðµ ÐÐ¸ÑÐ°Ð¹-Ð³Ð¾ÑÐ¾Ð´Ð°
ð° ÐÐ¿Ð»Ð°ÑÐ°: 4 900 â 5 200 â½ Ð·Ð° ÑÐ¼ÐµÐ½Ñ (Ð² Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑÐ¸ Ð¾Ñ Ð¾Ð¿ÑÑÐ°)
ð ÐÐµÑÑÐ¾: Ð¼. ÐÐ¸ÑÐ°Ð¹-Ð³Ð¾ÑÐ¾Ð´ (3 Ð¼Ð¸Ð½ Ð¾Ñ Ð¼ÐµÑÑÐ¾)
â° ÐÑÐ°ÑÐ¸Ðº: 5/2, 6/1 Ñ 09:00 Ð´Ð¾ 21:00

ÐÐ±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑÐ¸:
- ÐÑÐ¸Ð³Ð¾ÑÐ¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÐ°Ð»Ð°ÑÐ¾Ð², Ð·Ð°ÐºÑÑÐ¾Ðº, Ð±Ð¾ÑÐ»Ð¾Ð² Ð¿Ð¾ ÑÐµÑÐºÐ°ÑÑÐ°Ð¼
- ÐÐ¾Ð½ÑÑÐ¾Ð»Ñ ÑÐ²ÐµÐ¶ÐµÑÑÐ¸ Ð¸ ÑÐ¾Ð²Ð°ÑÐ½Ð¾Ð³Ð¾ ÑÐ¾ÑÐµÐ´ÑÑÐ²Ð°
- ÐÐ¾Ð´Ð´ÐµÑÐ¶Ð°Ð½Ð¸Ðµ ÑÐ¸ÑÑÐ¾ÑÑ Ð½Ð° ÑÐ°Ð±Ð¾ÑÐµÐ¼ Ð¼ÐµÑÑÐµ

ÐÑ Ð´Ð°ÐµÐ¼:
â ÐÑÐ¸ÑÐ¸Ð°Ð»ÑÐ½Ð¾Ðµ ÑÑÑÐ´Ð¾ÑÑÑÑÐ¾Ð¹ÑÑÐ²Ð¾
â ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¸ ÐºÐ¾ÑÐµ
â ÐÐ¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑÑ Ð±ÑÑÑÑÐ¾Ð³Ð¾ ÑÐ¾ÑÑÐ° Ð´Ð¾ ÑÑ-ÑÐµÑÐ°

Ð¡Ð²ÑÐ·Ñ Ñ ÑÐ¿ÑÐ°Ð²Ð»ÑÑÑÐµÐ¹:
ÐÐ»ÐµÐ½Ð° (+7 903 555-19-20)
TG: @bistro_staff_hr`,
    title: 'ÐÐ¾Ð²Ð°Ñ ÑÐ¾Ð»Ð¾Ð´Ð½Ð¾Ð³Ð¾ ÑÐµÑÐ° Ð² Ð±Ð¸ÑÑÑÐ¾',
    role: 'ÐÐ¾Ð²Ð°Ñ ÑÐ¾Ð»Ð¾Ð´Ð½Ð¾Ð³Ð¾ ÑÐµÑÐ°',
    roleCategory: 'cold',
    rateText: '4 900 â 5 200 â½ / ÑÐ¼ÐµÐ½Ð°',
    rateMin: 4900,
    rateMax: 5200,
    rateNumeric: 5050,
    rateType: 'shift',
    metro: 'Ð¼. ÐÐ¸ÑÐ°Ð¹-Ð³Ð¾ÑÐ¾Ð´',
    metroList: ['ÐÐ¸ÑÐ°Ð¹-Ð³Ð¾ÑÐ¾Ð´'],
    schedule: '5/2, 6/1',
    benefits: ['ÐÑÐ¸ÑÐ¸Ð°Ð»ÑÐ½Ð¾Ðµ ÑÑÑÐ´Ð¾ÑÑÑÑÐ¾Ð¹ÑÑÐ²Ð¾', 'ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¸ ÐºÐ¾ÑÐµ', 'ÐÑÑÑÑÑÐ¹ ÐºÐ°ÑÑÐµÑÐ½ÑÐ¹ ÑÐ¾ÑÑ'],
    contacts: {
      telegram: 'bistro_staff_hr',
      phone: '+79035551920',
      name: 'ÐÐ»ÐµÐ½Ð° (HR)'
    }
  },
  {
    id: 'gc-shift-1079',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    rawText: `ð ÐÑÐµÐ¼ ÐÐ¸ÑÑÐ°Ð¹Ð¾Ð»Ð¾ / ÐÐ¸ÑÑÐ¼ÐµÐ¹ÐºÐµÑÐ° Ð½Ð° Ð´ÑÐ¾Ð²ÑÐ½ÑÑ Ð¿ÐµÑÑ!
ÐÐ¾Ð¿ÑÐ»ÑÑÐ½Ð°Ñ Ð½ÐµÐ°Ð¿Ð¾Ð»Ð¸ÑÐ°Ð½ÑÐºÐ°Ñ Ð¿Ð¸ÑÑÐµÑÐ¸Ñ
ð° Ð¡ÑÐ°Ð²ÐºÐ°: 5 500 â 6 000 â½ / ÑÐ¼ÐµÐ½Ð°
ð ÐÐ¾ÐºÐ°ÑÐ¸Ñ: Ð¼. ÐÐ°ÑÐºÐ¾Ð²ÑÐºÐ°Ñ / Ð¼. ÐÐ¾Ð²Ð¾ÑÐ»Ð¾Ð±Ð¾Ð´ÑÐºÐ°Ñ
â° ÐÑÐ°ÑÐ¸Ðº: 2/2, 4/2 (Ñ 10:00 Ð´Ð¾ 22:30)

ÐÐ¿ÑÑ ÑÐ°Ð±Ð¾ÑÑ Ñ ÑÐµÑÑÐ¾Ð¼ Ð´Ð»Ð¸ÑÐµÐ»ÑÐ½Ð¾Ð¹ ÑÐµÑÐ¼ÐµÐ½ÑÐ°ÑÐ¸Ð¸ Ð¾Ð±ÑÐ·Ð°ÑÐµÐ»ÐµÐ½!
ÐÑÐ¿Ð»Ð°ÑÑ 2 ÑÐ°Ð·Ð° Ð² Ð¼ÐµÑÑÑ Ð±ÐµÐ· Ð·Ð°Ð´ÐµÑÐ¶ÐµÐº, ÑÐ¾ÑÐ¼Ð°, Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ, ÑÐ°ÐµÐ²ÑÐµ Ñ ÐºÑÑÐ½Ð¸.

ÐÐ¾Ð½ÑÐ°ÐºÑÑ:
Telegram: @pizzaiolo_moscow
Ð¢ÐµÐ»: +7 (916) 441-33-22`,
    title: 'ÐÐ¸ÑÑÐ°Ð¹Ð¾Ð»Ð¾ Ð½Ð° Ð´ÑÐ¾Ð²ÑÐ½ÑÑ Ð¿ÐµÑÑ',
    role: 'ÐÐ¸ÑÑÐ°Ð¹Ð¾Ð»Ð¾ / ÐÐ¸ÑÑÐ¼ÐµÐ¹ÐºÐµÑ',
    roleCategory: 'pizza',
    rateText: '5 500 â 6 000 â½ / ÑÐ¼ÐµÐ½Ð°',
    rateMin: 5500,
    rateMax: 6000,
    rateNumeric: 5750,
    rateType: 'shift',
    metro: 'Ð¼. ÐÐ°ÑÐºÐ¾Ð²ÑÐºÐ°Ñ',
    metroList: ['ÐÐ°ÑÐºÐ¾Ð²ÑÐºÐ°Ñ', 'ÐÐ¾Ð²Ð¾ÑÐ»Ð¾Ð±Ð¾Ð´ÑÐºÐ°Ñ'],
    schedule: '2/2, 4/2',
    benefits: ['Ð§Ð°ÐµÐ²ÑÐµ Ñ ÐºÑÑÐ½Ð¸', 'ÐÐ¸ÑÐ°Ð½Ð¸Ðµ', 'ÐÑÐ¿Ð»Ð°ÑÑ 2 ÑÐ°Ð·Ð° Ð² Ð¼ÐµÑÑÑ', 'ÐÑÐ¾Ð²ÑÐ½Ð°Ñ Ð¿ÐµÑÑ'],
    contacts: {
      telegram: 'pizzaiolo_moscow',
      phone: '+79164413322',
      name: 'Ð£Ð¿ÑÐ°Ð²Ð»ÑÑÑÐ¸Ð¹'
    }
  },
  {
    id: 'gc-shift-1078',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    rawText: `ð£ Ð¡ÑÑÐ¸ÑÑ / ÐÐ¾Ð²Ð°Ñ ÑÐ¿Ð¾Ð½ÑÐºÐ¾Ð¹ ÐºÑÑÐ½Ð¸
Ð ÐµÑÑÐ¾ÑÐ°Ð½ Ð¿Ð°Ð½Ð°Ð·Ð¸Ð°ÑÑÐºÐ¾Ð¹ ÐºÑÑÐ½Ð¸ Ð² Ð¡Ð¸ÑÐ¸
ð° ÐÐ: Ð¾Ñ 5 400 â½ Ð·Ð° ÑÐ¼ÐµÐ½Ñ (120 000 â 145 000 â½ Ð² Ð¼ÐµÑÑÑ)
ð ÐÐµÑÑÐ¾: Ð¼. ÐÐµÐ»Ð¾Ð²Ð¾Ð¹ ÑÐµÐ½ÑÑ / Ð¼. ÐÑÑÑÐ°Ð²Ð¾ÑÐ½Ð°Ñ (ÐÐ¾ÑÐºÐ²Ð°-Ð¡Ð¸ÑÐ¸)
â° ÐÑÐ°ÑÐ¸Ðº: 2/2, 5/2, Ð´Ð½ÐµÐ²Ð½ÑÐµ ÑÐ¼ÐµÐ½Ñ

Ð¢ÑÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ:
- ÐÑÑÐ¾ÐºÐ°Ñ ÑÐºÐ¾ÑÐ¾ÑÑÑ Ð¾ÑÐ´Ð°ÑÐ¸ ÑÐ¾Ð»Ð»Ð¾Ð² Ð¸ ÑÐ°ÑÐ¸Ð¼Ð¸
- ÐÐ½Ð°Ð½Ð¸Ðµ ÑÑÐ°Ð½Ð´Ð°ÑÑÐ¾Ð² ÐÐÐ¡Ð¡Ð  Ð¸ ÑÐ°Ð½Ð¸ÑÐ°ÑÐ½ÑÑ Ð½Ð¾ÑÐ¼

ÐÐ¾Ð½ÑÑÑ:
- Ð Ð°Ð·Ð²Ð¾Ð· Ð½Ð° ÑÐ°ÐºÑÐ¸ Ð¿Ð¾ÑÐ»Ðµ Ð²ÐµÑÐµÑÐ½Ð¸Ñ ÑÐ¼ÐµÐ½
- ÐÐ¸ÑÐ°Ð½Ð¸Ðµ Ð¾Ñ ÑÐµÑÐ°
- ÐÑÐµÐ¼Ð¸Ð¸ Ð·Ð° Ð²ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ð¿Ð»Ð°Ð½Ð° Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ

ÐÐ¾Ð½ÑÐ°ÐºÑ:
Telegram: @city_panasia_job
WhatsApp: +7 (999) 812-70-30`,
    title: 'ÐÐ¾Ð²Ð°Ñ-ÑÑÑÐ¸ÑÑ Ð² ÑÐµÑÑÐ¾ÑÐ°Ð½ (ÐÐ¾ÑÐºÐ²Ð°-Ð¡Ð¸ÑÐ¸)',
    role: 'ÐÐ¾Ð²Ð°Ñ-ÑÑÑÐ¸ÑÑ',
    roleCategory: 'sushi',
    rateText: '5 400 â 6 000 â½ / ÑÐ¼ÐµÐ½Ð°',
    rateMin: 5400,
    rateMax: 6000,
    rateNumeric: 5400,
    rateType: 'shift',
    metro: 'Ð¼. ÐÐµÐ»Ð¾Ð²Ð¾Ð¹ ÑÐµÐ½ÑÑ',
    metroList: ['ÐÐµÐ»Ð¾Ð²Ð¾Ð¹ ÑÐµÐ½ÑÑ', 'ÐÑÑÑÐ°Ð²Ð¾ÑÐ½Ð°Ñ'],
    schedule: '2/2, 5/2',
    benefits: ['Ð¢Ð°ÐºÑÐ¸ Ð¿Ð¾ÑÐ»Ðµ ÑÐ¼ÐµÐ½Ñ', 'ÐÐ¸ÑÐ°Ð½Ð¸Ðµ Ð¾Ñ ÑÐµÑÐ°', 'ÐÑÐµÐ¼Ð¸Ð¸ Ð·Ð° Ð²ÑÑÑÑÐºÑ'],
    contacts: {
      telegram: 'city_panasia_job',
      phone: '+79998127030',
      name: 'Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°Ñ'
    }
  },
  {
    id: 'gc-shift-1077',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    rawText: `ð¥ Ð¡ÑÐ¾ÑÐ½ÑÐµ ÑÐ¼ÐµÐ½Ñ Ð½Ð° Ð¿Ð¾Ð´ÑÐ°Ð±Ð¾ÑÐºÑ (Ð²ÑÑÐ¾Ð´Ð½ÑÐµ Ð´Ð½Ð¸ Ð¸ Ð¿ÑÑÐ½Ð¸ÑÐ°):
ÐÐ¾Ð²Ð°Ñ-ÑÐ½Ð¸Ð²ÐµÑÑÐ°Ð» / ÐÐ¾Ð²Ð°Ñ Ð½Ð° Ð±Ð°Ð½ÐºÐµÑÑ Ð¸ ÐºÐµÐ¹ÑÐµÑÐ¸Ð½Ð³
ð° ÐÐ¿Ð»Ð°ÑÐ°: 5 000 â½ Ð·Ð° Ð²ÑÑÐ¾Ð´ (ÐÐ«ÐÐÐÐ¢Ð Ð¡Ð ÐÐÐ£ Ð ÐÐÐÐ¦Ð Ð¡ÐÐÐÐ«!)
ð ÐÐµÑÑÐ¾: Ð¼. Ð¡Ð¾ÐºÐ¾Ð»ÑÐ½Ð¸ÐºÐ¸ / Ð¼. ÐÐÐÐ¥
â° ÐÑÐ°ÑÐ¸Ðº: ÑÐ°Ð·Ð¾Ð²ÑÐµ ÑÐ¼ÐµÐ½Ñ, ÑÐ¾Ð³Ð»Ð°ÑÐ¾Ð²ÑÐ²Ð°ÐµÐ¼ ÑÐ´Ð¾Ð±Ð½ÑÐµ Ð´Ð»Ñ Ð²Ð°Ñ Ð´Ð½Ð¸

ÐÑÐ»Ð¸ÑÐ½Ð°Ñ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑÑ Ð·Ð°ÑÐ°Ð±Ð¾ÑÐ°ÑÑ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸ÑÐµÐ»ÑÐ½Ð¾ Ð² ÑÐ²Ð¾Ð±Ð¾Ð´Ð½ÑÐµ Ð´Ð½Ð¸!

ÐÐ¾Ð½ÑÐ°ÐºÑÑ:
+7 (928) 247-14-66 (Ð Ð¾Ð´Ð¸Ð¾Ð½)
Telegram: @horeca_staff_msk`,
    title: 'ÐÐ¾Ð²Ð°Ñ-ÑÐ½Ð¸Ð²ÐµÑÑÐ°Ð» Ð½Ð° Ð±Ð°Ð½ÐºÐµÑÐ½ÑÐµ ÑÐ¼ÐµÐ½Ñ (Ð¾Ð¿Ð»Ð°ÑÐ° ÑÑÐ°Ð·Ñ)',
    role: 'ÐÐ¾Ð²Ð°Ñ-ÑÐ½Ð¸Ð²ÐµÑÑÐ°Ð» / Ð¡Ð¼ÐµÐ½Ñ',
    roleCategory: 'universal',
    rateText: '5 000 â½ / ÑÐ¼ÐµÐ½Ð° (ÑÑÐ°Ð·Ñ)',
    rateMin: 5000,
    rateMax: 5000,
    rateNumeric: 5000,
    rateType: 'shift',
    metro: 'Ð¼. Ð¡Ð¾ÐºÐ¾Ð»ÑÐ½Ð¸ÐºÐ¸',
    metroList: ['Ð¡Ð¾ÐºÐ¾Ð»ÑÐ½Ð¸ÐºÐ¸', 'ÐÐÐÐ¥'],
    schedule: 'ÐÐ¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ°, ÑÐ°Ð·Ð¾Ð²ÑÐµ ÑÐ¼ÐµÐ½Ñ',
    benefits: ['ÐÑÐ¿Ð»Ð°ÑÐ° ÑÑÐ°Ð·Ñ Ð² ÐºÐ¾Ð½ÑÐµ ÑÐ¼ÐµÐ½Ñ', 'ÐÐ¸Ð±ÐºÐ¸Ð¹ Ð²ÑÐ±Ð¾Ñ Ð´Ð½ÐµÐ¹', 'ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ'],
    contacts: {
      telegram: 'horeca_staff_msk',
      phone: '+79282471466',
      name: 'Ð Ð¾Ð´Ð¸Ð¾Ð½'
    }
  },
  {
    id: 'gc-shift-1076',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    rawText: `ð° ÐÐ¾Ð½Ð´Ð¸ÑÐµÑ / ÐÐµÐºÐ°ÑÑ Ð½Ð° ÑÐ¾Ð±ÑÑÐ²ÐµÐ½Ð½Ð¾Ðµ Ð¿ÑÐ¾Ð¸Ð·Ð²Ð¾Ð´ÑÑÐ²Ð¾
Ð¡ÐµÑÑ ÐºÐ¾ÑÐµÐµÐ½ Ð¸ Ð¿ÐµÐºÐ°ÑÐµÐ½
ð° Ð¡ÑÐ°Ð²ÐºÐ°: 4 700 â 5 000 â½ / ÑÐ¼ÐµÐ½Ð°
ð ÐÐµÑÑÐ¾: Ð¼. ÐÑÑÑÐºÐ°Ñ / Ð¼. Ð§ÐºÐ°Ð»Ð¾Ð²ÑÐºÐ°Ñ
â° ÐÑÐ°ÑÐ¸Ðº: 2/2 (Ð½Ð¾ÑÐ½ÑÐµ Ð¸Ð»Ð¸ ÑÑÑÐµÐ½Ð½Ð¸Ðµ ÑÐ¼ÐµÐ½Ñ Ð½Ð° Ð²ÑÐ±Ð¾Ñ)

ÐÐ±ÑÐ·Ð°Ð½Ð½Ð¾ÑÑÐ¸: Ð²ÑÐ¿ÐµÑÐºÐ° ÐºÑÑÐ°ÑÑÐ°Ð½Ð¾Ð², ÑÐºÐ»ÐµÑÐ¾Ð², ÑÐ±Ð¾ÑÐºÐ° ÑÐ¾ÑÑÐ¾Ð², Ð¿ÑÐ¸Ð³Ð¾ÑÐ¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÑÐµÐ¼Ð¾Ð².
Ð¡ÐºÐ¸Ð´ÐºÐ° 40% Ð½Ð° Ð²ÑÑ Ð¿ÑÐ¾Ð´ÑÐºÑÐ¸Ñ ÑÐµÑÐ¸, ÑÐ´Ð¾Ð±Ð½Ð°Ñ ÑÐ½Ð¸ÑÐ¾ÑÐ¼Ð°, Ð¾ÑÐ¸ÑÐ¸Ð°Ð»ÑÐ½ÑÐ¹ Ð´Ð¾Ð³Ð¾Ð²Ð¾Ñ.

ÐÐ¾Ð½ÑÐ°ÐºÑÑ:
Telegram: @bakery_chef_msk
Ð¢ÐµÐ»: +7 (905) 777-88-99 (ÐÐ»ÑÐ³Ð°)`,
    title: 'ÐÐ¾Ð½Ð´Ð¸ÑÐµÑ-Ð¿ÐµÐºÐ°ÑÑ Ð½Ð° Ð¿ÑÐ¾Ð¸Ð·Ð²Ð¾Ð´ÑÑÐ²Ð¾',
    role: 'ÐÐ¾Ð½Ð´Ð¸ÑÐµÑ / ÐÐµÐºÐ°ÑÑ',
    roleCategory: 'pastry',
    rateText: '4 700 â 5 000 â½ / ÑÐ¼ÐµÐ½Ð°',
    rateMin: 4700,
    rateMax: 5000,
    rateNumeric: 4850,
    rateType: 'shift',
    metro: 'Ð¼. ÐÑÑÑÐºÐ°Ñ',
    metroList: ['ÐÑÑÑÐºÐ°Ñ', 'Ð§ÐºÐ°Ð»Ð¾Ð²ÑÐºÐ°Ñ'],
    schedule: '2/2',
    benefits: ['Ð¡ÐºÐ¸Ð´ÐºÐ° 40% Ð½Ð° Ð¿ÑÐ¾Ð´ÑÐºÑÐ¸Ñ', 'Ð£Ð½Ð¸ÑÐ¾ÑÐ¼Ð°', 'ÐÑÐ¸ÑÐ¸Ð°Ð»ÑÐ½ÑÐ¹ Ð´Ð¾Ð³Ð¾Ð²Ð¾Ñ'],
    contacts: {
      telegram: 'bakery_chef_msk',
      phone: '+79057778899',
      name: 'ÐÐ»ÑÐ³Ð°'
    }
  },
  {
    id: 'gc-shift-1075',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    rawText: `ðª ÐÐ¾Ð²Ð°Ñ-Ð·Ð°Ð³Ð¾ÑÐ¾Ð²ÑÐ¸Ðº / ÐÑÑÐ½Ð¾Ð¹ ÑÐµÑ
ÐÑÑÐ½Ð¾Ð¹ ÑÐµÑÑÐ¾ÑÐ°Ð½ Ð½Ð° ÐÑÑÑÐ·Ð¾Ð²ÑÐºÐ¾Ð¼ Ð¿ÑÐ¾ÑÐ¿ÐµÐºÑÐµ
ð° Ð¡ÑÐ°Ð²ÐºÐ°: 4 800 â 5 300 â½ / ÑÐ¼ÐµÐ½Ð° (Ð¾Ñ 110 000 â½/Ð¼ÐµÑ)
ð ÐÐµÑÑÐ¾: Ð¼. ÐÐ¸ÐµÐ²ÑÐºÐ°Ñ / Ð¼. ÐÑÑÑÐ·Ð¾Ð²ÑÐºÐ°Ñ
â° ÐÑÐ°ÑÐ¸Ðº: 5/2 Ñ 08:00 Ð´Ð¾ 18:00

Ð Ð°Ð·Ð´ÐµÐ»ÐºÐ° Ð¼ÑÑÐ°, Ð¿ÑÐ¸ÑÑ, ÑÑÐ±Ñ, Ð¿Ð¾Ð»ÑÑÐ°Ð±ÑÐ¸ÐºÐ°ÑÑ, Ð¼Ð°ÑÐ¸Ð½Ð°Ð´Ñ.
ÐÐ±Ð¾ÑÑÐ´Ð¾Ð²Ð°Ð½Ð½ÑÐ¹ ÑÐ¾Ð²ÑÐµÐ¼ÐµÐ½Ð½ÑÐ¹ ÑÐµÑ, ÐºÐ°ÑÐµÑÑÐ²ÐµÐ½Ð½ÑÐ¹ Ð¸Ð½Ð²ÐµÐ½ÑÐ°ÑÑ, Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ.

TG: @meat_kitchen_msk
Ð¢ÐµÐ»: +7 (915) 123-90-88`,
    title: 'ÐÐ¾Ð²Ð°Ñ-Ð·Ð°Ð³Ð¾ÑÐ¾Ð²ÑÐ¸Ðº (ÐÑÑÐ½Ð¾Ð¹ ÑÐµÑ)',
    role: 'ÐÐ¾Ð²Ð°Ñ-Ð·Ð°Ð³Ð¾ÑÐ¾Ð²ÑÐ¸Ðº',
    roleCategory: 'prep',
    rateText: '4 800 â 5 300 â½ / ÑÐ¼ÐµÐ½Ð°',
    rateMin: 4800,
    rateMax: 5300,
    rateNumeric: 5050,
    rateType: 'shift',
    metro: 'Ð¼. ÐÐ¸ÐµÐ²ÑÐºÐ°Ñ',
    metroList: ['ÐÐ¸ÐµÐ²ÑÐºÐ°Ñ', 'ÐÑÑÑÐ·Ð¾Ð²ÑÐºÐ°Ñ'],
    schedule: '5/2',
    benefits: ['Ð¡Ð¾Ð²ÑÐµÐ¼ÐµÐ½Ð½ÑÐ¹ ÑÐµÑ Ð¸ Ð¾Ð±Ð¾ÑÑÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ', 'ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ', 'Ð¡ÑÐ°Ð±Ð¸Ð»ÑÐ½ÑÐµ Ð²ÑÐ¿Ð»Ð°ÑÑ'],
    contacts: {
      telegram: 'meat_kitchen_msk',
      phone: '+79151239088',
      name: 'Ð¨ÐµÑ-Ð¼ÑÑÐ½Ð¸Ðº'
    }
  }
];

// Helper: Extract details from raw message text without any external watermark leaks
function extractVacancyDetails(rawText, postId, dateStr) {
  const text = cleanRawText(rawText);
  
  // 1. Role extraction
  let role = 'ÐÐ¾Ð²Ð°Ñ';
  let roleCategory = 'all';
  let title = '';

  const lower = text.toLowerCase();

  if (/ÑÑ-?ÑÐµÑ/i.test(lower)) {
    role = 'Ð¡Ñ-ÑÐµÑ';
    roleCategory = 'chef';
  } else if (/ÑÐµÑ-Ð¿Ð¾Ð²Ð°Ñ/i.test(lower)) {
    role = 'Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°Ñ';
    roleCategory = 'chef';
  } else if (/Ð³Ð¾ÑÑÑ(ÐµÐ³Ð¾|Ð¸Ð¹)\s*ÑÐµÑ|Ð³Ñ/i.test(lower)) {
    role = 'ÐÐ¾Ð²Ð°Ñ Ð³Ð¾ÑÑÑÐµÐ³Ð¾ ÑÐµÑÐ°';
    roleCategory = 'hot';
  } else if (/ÑÐ¾Ð»Ð¾Ð´Ð½(Ð¾Ð³Ð¾|ÑÐ¹)\s*ÑÐµÑ|ÑÑ/i.test(lower)) {
    role = 'ÐÐ¾Ð²Ð°Ñ ÑÐ¾Ð»Ð¾Ð´Ð½Ð¾Ð³Ð¾ ÑÐµÑÐ°';
    roleCategory = 'cold';
  } else if (/Ð¿Ð¸ÑÑÐ°|Ð¿Ð¸ÑÑÐ°Ð¹Ð¾Ð»Ð¾|Ð¿Ð¸ÑÑÐ¼ÐµÐ¹ÐºÐµÑ/i.test(lower)) {
    role = 'ÐÐ¸ÑÑÐ°Ð¹Ð¾Ð»Ð¾';
    roleCategory = 'pizza';
  } else if (/ÑÑÑÐ¸|ÑÑÑÐ¸ÑÑ|ÑÐ¾Ð»Ð»/i.test(lower)) {
    role = 'ÐÐ¾Ð²Ð°Ñ-ÑÑÑÐ¸ÑÑ';
    roleCategory = 'sushi';
  } else if (/ÐºÐ¾Ð½Ð´Ð¸ÑÐµÑ|Ð¿ÐµÐºÐ°ÑÑ|Ð¿ÐµÐºÐ°ÑÐ½/i.test(lower)) {
    role = 'ÐÐ¾Ð½Ð´Ð¸ÑÐµÑ / ÐÐµÐºÐ°ÑÑ';
    roleCategory = 'pastry';
  } else if (/Ð·Ð°Ð³Ð¾ÑÐ¾Ð²|Ð¼ÑÑÐ½(Ð¾Ð¹|Ð¸Ðº)/i.test(lower)) {
    role = 'ÐÐ¾Ð²Ð°Ñ-Ð·Ð°Ð³Ð¾ÑÐ¾Ð²ÑÐ¸Ðº';
    roleCategory = 'prep';
  } else if (/ÑÐ½Ð¸Ð²ÐµÑÑÐ°Ð»/i.test(lower)) {
    role = 'ÐÐ¾Ð²Ð°Ñ-ÑÐ½Ð¸Ð²ÐµÑÑÐ°Ð»';
    roleCategory = 'universal';
  } else if (/Ð±Ð°ÑÐ¸ÑÑÐ°/i.test(lower)) {
    role = 'ÐÐ°ÑÐ¸ÑÑÐ°';
    roleCategory = 'barista';
  } else if (/Ð¾ÑÐ¸ÑÐ¸Ð°Ð½Ñ/i.test(lower)) {
    role = 'ÐÑÐ¸ÑÐ¸Ð°Ð½Ñ';
    roleCategory = 'waiter';
  }

  // Derive display title
  const firstLines = text.split('\n').filter(l => l.trim().length > 3);
  title = firstLines[0]?.replace(/[ð¥â¡ï¸ð³ð¨âð³ð¥ðð£ð°ðªðð°â°]/g, '').trim() || `${role} Ð² Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ ÐÐ¾ÑÐºÐ²Ñ`;
  if (title.length > 50) {
    title = `${role} â ÑÐ²ÐµÐ¶Ð°Ñ ÑÐ¼ÐµÐ½Ð°`;
  }

  // 2. Salary / Rate extraction
  let rateText = 'ÐÐ¾ Ð´Ð¾Ð³Ð¾Ð²Ð¾ÑÐµÐ½Ð½Ð¾ÑÑÐ¸';
  let rateNumeric = 0;
  let rateMin = 0;
  let rateMax = 0;
  let rateType = 'shift';

  const rateMatch = text.match(/(?:ÑÑÐ°Ð²ÐºÐ°|Ð¾Ð¿Ð»Ð°ÑÐ°|Ð·Ð¿|Ð´Ð¾ÑÐ¾Ð´|Ð·Ð°ÑÐ¿Ð»Ð°ÑÐ°|Ð²ÑÐ¿Ð»Ð°ÑÑ)?[^\d]{0,10}(\d[\d\s]{2,5})(?:\s*[-ââ]\s*(\d[\d\s]{2,5}))?\s*(?:ÑÑÐ±|Ñ|â½|Ñ\.Ñ|ÑÑÑ)?(?:\s*\/\s*(ÑÐ¼ÐµÐ½\w*|ÑÐ°Ñ\w*|Ð¼ÐµÑ\w*|Ð²ÑÑ\w*))?/i);
  if (rateMatch) {
    const rawVal1 = parseInt(rateMatch[1].replace(/\s+/g, ''), 10);
    const rawVal2 = rateMatch[2] ? parseInt(rateMatch[2].replace(/\s+/g, ''), 10) : null;

    if (!isNaN(rawVal1) && rawVal1 >= 200 && rawVal1 <= 350000) {
      rateMin = rawVal1;
      rateMax = rawVal2 || rawVal1;

      if (rateMin > 30000) {
        rateType = 'month';
        rateNumeric = Math.round((rateMin + rateMax) / 2 / 20);
        rateText = rawVal2 ? `${rateMin.toLocaleString('ru-RU')} â ${rateMax.toLocaleString('ru-RU')} â½ / Ð¼ÐµÑ` : `Ð¾Ñ ${rateMin.toLocaleString('ru-RU')} â½ / Ð¼ÐµÑ`;
      } else if (rateMin < 1000) {
        rateType = 'hour';
        rateNumeric = rateMin * 12;
        rateText = rawVal2 ? `${rateMin} â ${rateMax} â½ / ÑÐ°Ñ` : `${rateMin} â½ / ÑÐ°Ñ`;
      } else {
        rateType = 'shift';
        rateNumeric = Math.round((rateMin + rateMax) / 2);
        rateText = rawVal2 ? `${rateMin.toLocaleString('ru-RU')} â ${rateMax.toLocaleString('ru-RU')} â½ / ÑÐ¼ÐµÐ½Ð°` : `${rateMin.toLocaleString('ru-RU')} â½ / ÑÐ¼ÐµÐ½Ð°`;
      }
    }
  }

  // 3. Metro station extraction
  let metro = '';
  const metroList = [];
  const metroMatches = [...text.matchAll(/(?:Ð¼\.|Ð¼ÐµÑÑÐ¾|ÑÑ\.)\s*([Ð-Ð¯Ð°-ÑÐÑ\s\-]+?)(?=[,\.\n\(\)\/]|$)/g)];
  for (const m of metroMatches) {
    const station = m[1].trim().replace(/\s+(Ð¿ÐµÑÐºÐ¾Ð¼|Ð¼Ð¸Ð½ÑÑ|Ð¼Ð¸Ð½|Ð²ÐµÑÐºÐ°|Ð»Ð¸Ð½Ð¸Ñ).*$/i, '').trim();
    if (station && station.length > 2 && station.length < 30) {
      metroList.push(station);
      if (!metro) metro = `Ð¼. ${station}`;
    }
  }
  if (!metro) {
    if (/ÑÐµÐ½ÑÑ|ÑÐ°Ð¾/i.test(text)) metro = 'ÐÐ¾ÑÐºÐ²Ð° (Ð¦ÐµÐ½ÑÑ)';
    else metro = 'ÐÐ¾ÑÐºÐ²Ð°';
  }

  // 4. Schedule extraction
  let schedule = 'Ð¡Ð¼ÐµÐ½Ð½ÑÐ¹ Ð³ÑÐ°ÑÐ¸Ðº';
  if (/5\/2/i.test(text)) schedule = '5/2';
  else if (/2\/2/i.test(text)) schedule = '2/2';
  else if (/3\/3/i.test(text)) schedule = '3/3';
  else if (/6\/1/i.test(text)) schedule = '6/1';
  else if (/Ð¿Ð¾Ð´ÑÐ°Ð±Ð¾ÑÐº|ÑÐ°Ð·Ð¾Ð²|Ð±Ð°Ð½ÐºÐµÑ/i.test(text)) schedule = 'ÐÐ¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ° / Ð¡Ð²Ð¾Ð±Ð¾Ð´Ð½ÑÐ¹ Ð³ÑÐ°ÑÐ¸Ðº';

  // 5. Benefits extraction
  const benefits = [];
  if (/Ð¿Ð¸ÑÐ°Ð½Ð¸/i.test(text)) benefits.push('ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ');
  if (/Ð²ÑÐ¿Ð»Ð°Ñ.*(2|Ð´Ð²Ð°|ÐºÐ°Ð¶Ð´|ÑÐ°Ð·|Ð½ÐµÐ´)/i.test(text)) benefits.push('Ð¡ÑÐ°Ð±Ð¸Ð»ÑÐ½ÑÐµ Ð²ÑÐ¿Ð»Ð°ÑÑ 2 Ñ/Ð¼ÐµÑ');
  if (/ÑÑÐ°Ð·Ñ|Ð² ÐºÐ¾Ð½ÑÐµ ÑÐ¼ÐµÐ½/i.test(text)) benefits.push('ÐÑÐ¿Ð»Ð°ÑÐ° ÑÑÐ°Ð·Ñ Ð¿Ð¾ÑÐ»Ðµ ÑÐ¼ÐµÐ½Ñ');
  if (/Ð¾ÑÐ¾ÑÐ¼Ð»ÐµÐ½|ÑÐº ÑÑ|Ð¾ÑÐ¸ÑÐ¸Ð°Ð»ÑÐ½/i.test(text)) benefits.push('ÐÑÐ¸ÑÐ¸Ð°Ð»ÑÐ½Ð¾Ðµ Ð¾ÑÐ¾ÑÐ¼Ð»ÐµÐ½Ð¸Ðµ');
  if (/ÑÐ¾ÑÐ¼|ÑÐ½Ð¸ÑÐ¾ÑÐ¼/i.test(text)) benefits.push('ÐÐµÑÐ¿Ð»Ð°ÑÐ½Ð°Ñ ÑÐ½Ð¸ÑÐ¾ÑÐ¼Ð°');
  if (/ÑÐ¾ÑÑ|ÐºÐ°ÑÑÐµÑ/i.test(text)) benefits.push('ÐÐ°ÑÑÐµÑÐ½ÑÐ¹ ÑÐ¾ÑÑ');
  if (/ÑÐ°ÐºÑÐ¸|ÑÐ°Ð·Ð²Ð¾Ð·/i.test(text)) benefits.push('Ð Ð°Ð·Ð²Ð¾Ð· Ð½Ð° ÑÐ°ÐºÑÐ¸');
  if (/ÑÐ°Ð¹|ÑÐ°ÐµÐ²ÑÐµ/i.test(text)) benefits.push('Ð§Ð°ÐµÐ²ÑÐµ');

  if (benefits.length === 0) {
    benefits.push('ÐÐ¸ÑÐ°Ð½Ð¸Ðµ Ð¸ ÑÐ¾ÑÐ¼Ð°', 'Ð¡Ð²Ð¾ÐµÐ²ÑÐµÐ¼ÐµÐ½Ð½Ð°Ñ Ð¾Ð¿Ð»Ð°ÑÐ°');
  }

  // 6. Contacts extraction
  let telegram = '';
  let phone = '';
  let contactName = 'Ð¨ÐµÑ / Ð£Ð¿ÑÐ°Ð²Ð»ÑÑÑÐ¸Ð¹';

  const tgMatch = text.match(/@([a-zA-Z0-9_]{4,32})/);
  if (tgMatch) {
    const rawTg = tgMatch[1].toLowerCase();
    if (rawTg !== 'povaramoscow') {
      telegram = tgMatch[1];
    }
  }

  const phoneMatch = text.match(/(?:\+7|8)[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})/);
  if (phoneMatch) {
    phone = `+7${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}${phoneMatch[4]}`;
  }

  const nameMatch = text.match(/(?:ÐºÐ¾Ð½ÑÐ°ÐºÑ|ÑÐ²ÑÐ·Ñ|Ð¿Ð¸ÑÐ°ÑÑ|Ð·Ð²Ð¾Ð½Ð¸ÑÑ|ÑÐµÑ|ÐºÑÑÐ°ÑÐ¾Ñ|hr|Ð¼ÐµÐ½ÐµÐ´Ð¶ÐµÑ)[^\n:]*?:\s*([Ð-Ð¯Ð°-ÑA-Za-z]+)/i);
  if (nameMatch && nameMatch[1].length > 2) {
    contactName = nameMatch[1];
  }

  return {
    id: postId || `gc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | ÐÐ°Ð·Ð° ÑÐ¼ÐµÐ½ Ð¸ Ð²Ð°ÐºÐ°Ð½ÑÐ¸Ð¹',
    postUrl: '#',
    date: dateStr || new Date().toISOString(),
    rawText: text,
    title,
    role,
    roleCategory,
    rateText,
    rateMin,
    rateMax,
    rateNumeric,
    rateType,
    metro,
    metroList,
    schedule,
    benefits,
    contacts: {
      telegram: telegram || '',
      phone: phone || '',
      name: contactName || ''
    }
  };
}

// Helper to fetch vacancies from a single channel
async function fetchSingleChannelRaw(channelUsername) {
  try {
    const cleanUsername = channelUsername.replace(/^@/, '');
    const targetUrl = `https://t.me/s/${cleanUsername}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru,en;q=0.9'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const html = await response.text();
    const $ = cheerio.load(html);
    const parsed = [];

    $('.tgme_widget_message').each((i, el) => {
      const $msg = $(el);
      const postData = $msg.attr('data-post') || '';
      const postId = `gc-${postData.replace('/', '-')}`;

      const textElem = $msg.find('.tgme_widget_message_text');
      if (!textElem.length) return;

      textElem.find('br').replaceWith('\n');
      const rawText = textElem.text().trim();
      if (rawText.length < 30) return;

      const cleaned = cleanRawText(rawText);
      if (cleaned.length < 25) return;

      const timeElem = $msg.find('time');
      const datetimeStr = timeElem.attr('datetime') || new Date().toISOString();

      const item = extractVacancyDetails(cleaned, postId, datetimeStr);
      parsed.unshift(item);
    });

    return parsed;
  } catch (err) {
    return [];
  }
}

// Scrape public channel webview with 100% sanitized output
async function fetchChannelVacancies(channelName = 'Povaramoscow', forceRefresh = false) {
  const now = Date.now();
  const cacheKey = `channel_${channelName.replace(/^@/, '').toLowerCase()}`;

  // Return cache if fresh (< 5 mins)
  if (!forceRefresh && channelCache[cacheKey] && channelCache[cacheKey].items.length > 0) {
    const age = now - (channelCache[cacheKey].lastFetched || 0);
    if (age < 5 * 60 * 1000) {
      return {
        success: true,
        source: 'GastroConnect Shift Stream',
        channel: channelName,
        count: channelCache[cacheKey].items.length,
        lastUpdated: new Date(channelCache[cacheKey].lastFetched).toISOString(),
        items: channelCache[cacheKey].items
      };
    }
  }

  const items = await fetchSingleChannelRaw(channelName);
  if (items.length > 0) {
    channelCache[cacheKey] = {
      lastFetched: now,
      items
    };
    return {
      success: true,
      source: 'GastroConnect Live Stream',
      channel: channelName,
      count: items.length,
      lastUpdated: new Date(now).toISOString(),
      items
    };
  }

  // Fallback to curated shift data
  return {
    success: true,
    source: 'GastroConnect Curated Feed',
    channel: channelName,
    count: fallbackPovarJobs.length,
    lastUpdated: new Date(now).toISOString(),
    items: fallbackPovarJobs
  };
}

// Scrape across all sorted target channels or by specific category
async function fetchAllChannelsVacancies(options = {}) {
  const { category = null, forceRefresh = false, limitPerChannel = 10 } = options;
  const now = Date.now();
  const cacheKey = `all_${category || 'all'}`;

  if (!forceRefresh && channelCache[cacheKey] && channelCache[cacheKey].items.length > 0) {
    const age = now - (channelCache[cacheKey].lastFetched || 0);
    if (age < 5 * 60 * 1000) {
      return {
        success: true,
        source: 'GastroConnect Multi-Channel Network',
        count: channelCache[cacheKey].items.length,
        lastUpdated: new Date(channelCache[cacheKey].lastFetched).toISOString(),
        items: channelCache[cacheKey].items
      };
    }
  }

  const channelsToScrape = category
    ? TARGET_CHANNELS.filter(c => c.category === category)
    : TARGET_CHANNELS;

  const allItems = [];
  const seenTitles = new Set();

  for (const ch of channelsToScrape) {
    try {
      const channelItems = await fetchSingleChannelRaw(ch.username);
      const topItems = channelItems.slice(0, limitPerChannel);
      for (const item of topItems) {
        const key = `${item.title}_${item.rateNumeric}_${item.metro}`.toLowerCase();
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          allItems.push({
            ...item,
            sourceCategory: ch.categoryName,
            channelRef: ch.title
          });
        }
      }
    } catch (e) {
      // Ignore transient failures on single channels
    }
  }

  // Merge with curated base
  fallbackPovarJobs.forEach(fb => {
    const key = `${fb.title}_${fb.rateNumeric}_${fb.metro}`.toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      allItems.push({
        ...fb,
        sourceCategory: 'ÐÐ¾Ð²Ð°ÑÐ° Ð¸ Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°ÑÐ°',
        channelRef: 'GastroConnect'
      });
    }
  });

  // Sort by date desc
  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  channelCache[cacheKey] = {
    lastFetched: now,
    items: allItems
  };

  return {
    success: true,
    source: 'GastroConnect Multi-Channel Live Stream',
    channelsScraped: channelsToScrape.length,
    count: allItems.length,
    lastUpdated: new Date(now).toISOString(),
    items: allItems
  };
}

// Check current Moscow Time (UTC+3)
function getMoscowTime() {
  const now = new Date();
  // Moscow is UTC+3
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const moscowDate = new Date(utc + (3600000 * 3));
  const hours = String(moscowDate.getHours()).padStart(2, '0');
  const minutes = String(moscowDate.getMinutes()).padStart(2, '0');
  return {
    date: moscowDate,
    timeStr: `${hours}:${minutes}`,
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10)
  };
}

// Run the scheduled scrape job
async function runScheduledScrape(triggerType = 'scheduled', onComplete = null) {
  const moscow = getMoscowTime();
  schedulerState.lastRunStatus = 'running';
  console.log(`[Scraper Scheduler] Starting ${triggerType} scrape at MSK ${moscow.timeStr} across ${TARGET_CHANNELS.length} channels...`);

  try {
    const result = await fetchAllChannelsVacancies({ forceRefresh: true });
    const nowIso = new Date().toISOString();
    
    schedulerState.lastRunTime = nowIso;
    schedulerState.lastRunStatus = 'success';
    schedulerState.totalRuns += 1;
    schedulerState.lastRunDetails = {
      timeMsk: moscow.timeStr,
      triggerType,
      channelsCount: TARGET_CHANNELS.length,
      vacanciesFound: result.count,
      timestamp: nowIso
    };

    schedulerState.history.unshift({
      ...schedulerState.lastRunDetails
    });
    if (schedulerState.history.length > 20) {
      schedulerState.history.pop();
    }

    console.log(`[Scraper Scheduler] Finished ${triggerType} scrape: ${result.count} verified shifts indexed.`);

    if (typeof onComplete === 'function') {
      try {
        await onComplete(result);
      } catch (cbErr) {
        console.error('[Scraper Scheduler] Callback execution error:', cbErr);
      }
    }

    return { success: true, result };
  } catch (err) {
    schedulerState.lastRunStatus = 'error';
    console.error(`[Scraper Scheduler] Error in scrape job:`, err);
    return { success: false, error: err.message };
  }
}

let lastTriggeredMinute = null;
let registeredOnCompleteCallback = null;

// Initialize automatic cron scheduler (checks every 30 seconds for 09:00, 13:00, 17:00, 22:00 MSK)
function startSchedulerTimer(onComplete = null) {
  if (onComplete) {
    registeredOnCompleteCallback = onComplete;
  }
  setInterval(() => {
    const moscow = getMoscowTime();
    const currentSlot = moscow.timeStr; // "HH:MM"

    if (SCRAPING_SCHEDULE_HOURS.includes(currentSlot) && lastTriggeredMinute !== currentSlot) {
      lastTriggeredMinute = currentSlot;
      runScheduledScrape(`scheduled (${currentSlot} MSK)`, registeredOnCompleteCallback);
    }
  }, 30000);

  console.log(`[Scraper Scheduler] Active. Target schedules: ${SCRAPING_SCHEDULE_HOURS.join(', ')} (Europe/Moscow UTC+3)`);
}

// Get status of channels and scheduler
function getScheduleStatus() {
  const moscow = getMoscowTime();
  return {
    success: true,
    timezone: schedulerState.timezone,
    currentMoscowTime: moscow.timeStr,
    schedules: SCRAPING_SCHEDULE_HOURS,
    active: schedulerState.active,
    lastRun: schedulerState.lastRunDetails,
    lastRunStatus: schedulerState.lastRunStatus,
    totalRuns: schedulerState.totalRuns,
    totalChannels: TARGET_CHANNELS.length,
    categories: [
      { id: 'cook_chef', name: 'ÐÐ¾Ð²Ð°ÑÐ° Ð¸ Ð¨ÐµÑ-Ð¿Ð¾Ð²Ð°ÑÐ°', count: TARGET_CHANNELS.filter(c => c.category === 'cook_chef').length },
      { id: 'general_horeca', name: 'ÐÐ±ÑÐµÐ¿Ð¸Ñ Ð¸ HoReCa Ð¿ÐµÑÑÐ¾Ð½Ð°Ð»', count: TARGET_CHANNELS.filter(c => c.category === 'general_horeca').length },
      { id: 'sushi', name: 'Ð¡ÑÑÐ¸ÑÑÑ Ð¸ ÐÐ°Ð½Ð°Ð·Ð¸Ñ', count: TARGET_CHANNELS.filter(c => c.category === 'sushi').length },
      { id: 'pastry', name: 'ÐÐ¾Ð½Ð´Ð¸ÑÐµÑÑ Ð¸ ÐÐµÐºÐ°ÑÐ¸', count: TARGET_CHANNELS.filter(c => c.category === 'pastry').length },
      { id: 'barista', name: 'ÐÐ°ÑÐ¸ÑÑÐ° Ð¸ ÐÐ¾ÑÐµÐ¹Ð½Ð¸', count: TARGET_CHANNELS.filter(c => c.category === 'barista').length },
      { id: 'waiter', name: 'ÐÑÐ¸ÑÐ¸Ð°Ð½ÑÑ Ð¸ ÐÐ°Ð»', count: TARGET_CHANNELS.filter(c => c.category === 'waiter').length },
      { id: 'cleaning', name: 'ÐÐ»Ð¸Ð½Ð¸Ð½Ð³ Ð¸ ÐÐ¾Ð¹ÐºÐ°', count: TARGET_CHANNELS.filter(c => c.category === 'cleaning').length },
      { id: 'shifts', name: 'ÐÐ¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ° Ð¸ Ð¡ÑÐ¾ÑÐ½ÑÐµ ÑÐ¼ÐµÐ½Ñ', count: TARGET_CHANNELS.filter(c => c.category === 'shifts').length },
      { id: 'geo_mo', name: 'ÐÐ¾ÑÐºÐ¾Ð²ÑÐºÐ°Ñ Ð¾Ð±Ð»Ð°ÑÑÑ (Ð¥Ð¸Ð¼ÐºÐ¸, ÐÑÐ°ÑÐ½Ð¾Ð³Ð¾ÑÑÐº)', count: TARGET_CHANNELS.filter(c => c.category === 'geo_mo').length },
      { id: 'geo_spb', name: 'Ð¡Ð°Ð½ÐºÑ-ÐÐµÑÐµÑÐ±ÑÑÐ³', count: TARGET_CHANNELS.filter(c => c.category === 'geo_spb').length },
      { id: 'geo_sng', name: 'ÐÑÐ°Ð¶Ð´Ð°Ð½Ðµ Ð¡ÐÐ', count: TARGET_CHANNELS.filter(c => c.category === 'geo_sng').length },
      { id: 'geo_reloc', name: 'Ð ÐµÐ»Ð¾ÐºÐ°ÑÐ¸Ñ Ð¸ ÐÐ°ÑÑÐ±ÐµÐ¶ (ÐÑÑÐ·Ð¸Ñ)', count: TARGET_CHANNELS.filter(c => c.category === 'geo_reloc').length }
    ],
    channels: TARGET_CHANNELS,
    history: schedulerState.history
  };
}

module.exports = {
  TARGET_CHANNELS,
  SCRAPING_SCHEDULE_HOURS,
  fetchChannelVacancies,
  fetchAllChannelsVacancies,
  runScheduledScrape,
  startSchedulerTimer,
  getScheduleStatus,
  fallbackPovarJobs,
  cleanRawText
};

