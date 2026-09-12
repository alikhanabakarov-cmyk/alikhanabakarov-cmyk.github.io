ï»¿// GastroConnect Telegram Publisher & Community Engine
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
    title: 'ÐÐ¾ÑÑÑÐ°Ñ ÑÐ¼ÐµÐ½Ð° (ÐÐ¾ÑÑÑÐ¸Ð¹ ÑÐµÑ)',
    category: 'Ð¡Ð¼ÐµÐ½Ñ',
    data: {
      role: 'ÐÐ¾Ð²Ð°Ñ Ð³Ð¾ÑÑÑÐµÐ³Ð¾ ÑÐµÑÐ°',
      rate: '5 500 â½ / ÑÐ¼ÐµÐ½Ð°',
      metro: 'ÐÐµÐ»Ð¾ÑÑÑÑÐºÐ°Ñ (5 Ð¼Ð¸Ð½ Ð¿ÐµÑÐºÐ¾Ð¼)',
      schedule: '11:00 â 23:00 (12 Ñ)',
      urgency: 'Ð¡ÑÐ¾ÑÐ½Ð¾ Ð½Ð° Ð·Ð°Ð²ÑÑÐ°',
      perks: 'ÐÐ²ÑÑÑÐ°Ð·Ð¾Ð²Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¾Ñ ÑÐµÑÐ°, ÑÑÐ¸Ð»ÑÐ½Ð°Ñ ÑÐ¾ÑÐ¼Ð°, ÑÐ°ÐºÑÐ¸ Ð¿Ð¾ÑÐ»Ðµ ÑÐ¼ÐµÐ½Ñ, ÑÐ°ÐµÐ²ÑÐµ Ñ Ð±Ð°Ð½ÐºÐµÑÐ¾Ð²',
      tasks: 'ÐÑÐ¸Ð³Ð¾ÑÐ¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð³Ð¾ÑÑÑÐ¸Ñ Ð±Ð»ÑÐ´ ÐµÐ²ÑÐ¾Ð¿ÐµÐ¹ÑÐºÐ¾Ð¹/Ð¿Ð°Ð½Ð°Ð·Ð¸Ð°ÑÑÐºÐ¾Ð¹ ÐºÑÑÐ½Ð¸ Ð¿Ð¾ Ð¢Ð¢Ð, Ð¿Ð¾Ð´Ð´ÐµÑÐ¶Ð°Ð½Ð¸Ðµ Ð¸Ð´ÐµÐ°Ð»ÑÐ½Ð¾Ð¹ ÑÐ¸ÑÑÐ¾ÑÑ Ð½Ð° ÑÑÐ°Ð½ÑÐ¸Ð¸.',
      requirements: 'ÐÐ¿ÑÑ ÑÐ°Ð±Ð¾ÑÑ Ð² Ð³Ð¾ÑÑÐµÑÐµ Ð¾Ñ 1 Ð³Ð¾Ð´Ð°, Ð´ÐµÐ¹ÑÑÐ²ÑÑÑÐ°Ñ Ð¼ÐµÐ´ÐºÐ½Ð¸Ð¶ÐºÐ°, Ð¿ÑÐ½ÐºÑÑÐ°Ð»ÑÐ½Ð¾ÑÑÑ Ð¸ ÑÐºÐ¾ÑÐ¾ÑÑÑ.',
      contacts: '',
      cta: 'ÐÐ°Ð¿Ð¸ÑÐ¸ÑÐµ Ð² Telegram Ð¸Ð»Ð¸ Ð¾ÑÐºÐ»Ð¸ÐºÐ½Ð¸ÑÐµÑÑ ÑÐµÑÐµÐ· Ð±Ð¾ÑÐ°'
    }
  },
  {
    id: 'sushi_shift',
    type: 'job',
    title: 'ÐÐ¾Ð²Ð°Ñ-ÑÑÑÐ¸ÑÑ Ð½Ð° ÑÐ¸ÐºÐµÐ½Ð´',
    category: 'Ð¡Ð¼ÐµÐ½Ñ',
    data: {
      role: 'ÐÐ¾Ð²Ð°Ñ-ÑÑÑÐ¸ÑÑ / Ð¡ÑÑÐ¸-ÑÐµÑ',
      rate: '6 000 â½ / ÑÐ¼ÐµÐ½Ð°',
      metro: 'ÐÐ¸ÑÐ°Ð¹-Ð³Ð¾ÑÐ¾Ð´ / Ð§Ð¸ÑÑÑÐµ Ð¿ÑÑÐ´Ñ',
      schedule: '12:00 â 00:00',
      urgency: 'ÐÑÑÐ½Ð¸ÑÐ° Ð¸ ÑÑÐ±Ð±Ð¾ÑÐ°',
      perks: 'Ð¨ÑÐ°Ð±Ð½Ð¾Ðµ Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ, ÑÐ¾ÑÐ¼Ð°, Ð¾Ð¿Ð»Ð°ÑÐ° Ð² ÐºÐ¾Ð½ÑÐµ ÑÐ¼ÐµÐ½Ñ Ð½Ð° ÐºÐ°ÑÑÑ Ð¸Ð»Ð¸ Ð½Ð°Ð»Ð¸ÑÐ½ÑÐ¼Ð¸',
      tasks: 'ÐÑÐ¸Ð³Ð¾ÑÐ¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÐ¾Ð»Ð»Ð¾Ð², ÑÐ°ÑÐ¸Ð¼Ð¸, Ð½Ð¸Ð³Ð¸ÑÐ¸ Ð¿Ð¾ Ð°Ð²ÑÐ¾ÑÑÐºÐ¸Ð¼ Ð¢Ð¢Ð, Ð±ÑÑÑÑÐ°Ñ Ð¾ÑÐ´Ð°ÑÐ° Ð² Ð¿Ð¸ÐºÐ¾Ð²ÑÐµ ÑÐ°ÑÑ.',
      requirements: 'ÐÐ¿ÑÑ Ð½Ð° ÑÑÑÐ¸ Ð¾Ñ 1.5 Ð»ÐµÑ, Ð±ÐµÐ·ÑÐ¿ÑÐµÑÐ½Ð°Ñ ÑÐ°Ð·Ð´ÐµÐ»ÐºÐ° Ð»Ð¾ÑÐ¾ÑÑ/ÑÑÐ½ÑÐ°, Ð°ÐºÐºÑÑÐ°ÑÐ½Ð¾ÑÑÑ.',
      contacts: '',
      cta: 'ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐ¹ÑÐµ ÑÐ¾ÑÐ¾ ÑÐ°Ð±Ð¾Ñ Ð¸ Ð¾Ð¿ÑÑ Ð² Ð»Ð¸ÑÐ½ÑÐµ ÑÐ¾Ð¾Ð±ÑÐµÐ½Ð¸Ñ'
    }
  },
  {
    id: 'chef_tip_herbs',
    type: 'tip',
    title: 'ÐÐ°Ð¹ÑÑÐ°Ðº: ÐÐ°Ðº ÑÐ½Ð¸Ð·Ð¸ÑÑ ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ñ Ð·ÐµÐ»ÐµÐ½Ð¸ Ð½Ð° 30%',
    category: 'ÐÐ±ÑÑÐµÐ½Ð¸Ðµ & ÐÐ°Ð¹ÑÑÐ°ÐºÐ¸',
    data: {
      headline: 'Ð¡ÐµÐºÑÐµÑ ÑÐ²ÐµÐ¶ÐµÑÑÐ¸ Ð·ÐµÐ»ÐµÐ½Ð¸ Ð¸ ÑÑÐ°Ð² Ð² Ð³Ð°ÑÑÑÐ¾ÐµÐ¼ÐºÐ¾ÑÑÑÑ',
      body: `1ï¸â£ <b>ÐÐµÐ´ÑÐ½Ð¾Ð¹ ÑÐ¾Ðº:</b> ÐÑÐ¸ Ð¿Ð¾Ð»ÑÑÐµÐ½Ð¸Ð¸ Ð·ÐµÐ»ÐµÐ½Ð¸ Ð¾Ð¿ÑÑÑÐ¸ÑÐµ ÐµÑ Ð½Ð° 2 Ð¼Ð¸Ð½ÑÑÑ Ð² Ð»ÐµÐ´ÑÐ½ÑÑ Ð²Ð¾Ð´Ñ (+1..+3Â°C). ÐÐ»ÐµÑÐºÐ¸ Ð½Ð°ÑÑÑÐ°ÑÑÑÑ Ð²Ð»Ð°Ð³Ð¾Ð¹, ÑÑÑÐ³Ð¾Ñ Ð²Ð¾ÑÑÑÐ°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÑÑÑ.\n2ï¸â£ <b>Ð¡ÑÑÐºÐ° Ð² ÐºÐ°ÑÑÑÐµÐ»Ð¸:</b> ÐÐ»Ð°Ð³Ð° Ð½Ð° Ð»Ð¸ÑÑÑÑÑ â Ð³Ð»Ð°Ð²Ð½ÑÐ¹ Ð²ÑÐ°Ð³. ÐÐµÐ»ÐµÐ½Ñ Ð´Ð¾Ð»Ð¶Ð½Ð° Ð±ÑÑÑ ÑÑÑÐ¾Ð¹ Ð½Ð° Ð¾ÑÑÐ¿Ñ.\n3ï¸â£ <b>ÐÐ¾Ð½ÑÐµÐ¹Ð½ÐµÑ Ñ Ð¿ÐµÑÑÐ¾ÑÐ°ÑÐ¸ÐµÐ¹ Ð¸ Ð²Ð»Ð°Ð¶Ð½Ð¾Ð¹ ÑÐ°Ð»ÑÐµÑÐºÐ¾Ð¹:</b> Ð£ÐºÐ»Ð°Ð´ÑÐ²Ð°Ð¹ÑÐµ Ð² Ð³Ð°ÑÑÑÐ¾ÐµÐ¼ÐºÐ¾ÑÑÑ GN 1/3, Ð½Ð° Ð´Ð½Ð¾ â ÑÐ»ÐµÐ³ÐºÐ° Ð²Ð»Ð°Ð¶Ð½Ð¾Ðµ Ð±ÑÐ¼Ð°Ð¶Ð½Ð¾Ðµ Ð¿Ð¾Ð»Ð¾ÑÐµÐ½ÑÐµ, ÑÐ²ÐµÑÑÑ Ð½Ðµ Ð·Ð°ÐºÑÑÐ²Ð°Ð¹ÑÐµ Ð½Ð°Ð³Ð»ÑÑÐ¾ Ð¿Ð»ÐµÐ½ÐºÐ¾Ð¹.\n4ï¸â£ <b>Ð¢ÐµÐ¼Ð¿ÐµÑÐ°ÑÑÑÐ½Ð°Ñ Ð·Ð¾Ð½Ð°:</b> Ð¥ÑÐ°Ð½Ð¸ÑÐµ Ð² Ð²ÐµÑÑÐ½ÐµÐ¹ ÑÐ°ÑÑÐ¸ ÑÐ¾Ð»Ð¾Ð´Ð¸Ð»ÑÐ½Ð¾Ð¹ ÐºÐ°Ð¼ÐµÑÑ (+4..+6Â°C), Ð½Ð¾ Ð½Ðµ Ñ Ð²ÐµÐ½ÑÐ¸Ð»ÑÑÐ¾ÑÐ°.`,
      question: 'Ð ÐºÐ°Ðº Ð½Ð° Ð²Ð°ÑÐµÐ¹ ÐºÑÑÐ½Ðµ Ð±Ð¾ÑÑÑÑÑ ÑÐ¾ ÑÐ¿Ð¸ÑÐ°Ð½Ð¸ÑÐ¼Ð¸ ÑÐ²ÐµÐ¶Ð¸Ñ ÑÑÐ°Ð²? ÐÐµÐ»Ð¸ÑÐµÑÑ Ð² ÐºÐ¾Ð¼Ð¼ÐµÐ½ÑÐ°ÑÐ¸ÑÑ ð',
      tags: ['#GastroTips', '#ÐÐ°Ð¹ÑÑÐ°ÐºÐ¨ÐµÑÐ°', '#Ð¢ÐµÑÐºÐ°ÑÑÑ', '#ÐÐ¾Ð²Ð°ÑÐ°ÐÐ¾ÑÐºÐ²Ñ', '#HoReCa']
    }
  },
  {
    id: 'poll_fair_rate',
    type: 'poll',
    title: 'ÐÐ¿ÑÐ¾Ñ: Ð§ÐµÑÑÐ½Ð°Ñ ÑÑÐ°Ð²ÐºÐ° Ð¿Ð¾Ð²Ð°ÑÐ° Ð² ÐÐ¾ÑÐºÐ²Ðµ (2026)',
    category: 'ÐÑÐ»ÑÑ ÑÑÐ½ÐºÐ° & ÐÐ¿ÑÐ¾ÑÑ',
    data: {
      headline: 'ÐÐ°ÐºÐ°Ñ ÑÑÐ°Ð²ÐºÐ° Ð·Ð° 12-ÑÐ°ÑÐ¾Ð²ÑÑ ÑÐ¼ÐµÐ½Ñ Ð² Ð³Ð¾ÑÑÑÐµÐ¼ ÑÐµÑÐµ ÑÐµÐ¹ÑÐ°Ñ ÑÐ¿ÑÐ°Ð²ÐµÐ´Ð»Ð¸Ð²Ð° Ð² ÐÐ¾ÑÐºÐ²Ðµ?',
      intro: 'Ð¡ ÐºÐ°Ð¶Ð´ÑÐ¼ Ð¼ÐµÑÑÑÐµÐ¼ ÑÑÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ðº ÑÐºÐ¾ÑÐ¾ÑÑÐ¸ Ð¸ ÐºÐ°ÑÐµÑÑÐ²Ñ ÑÐ°ÑÑÑÑ. ÐÐ°Ð²Ð°Ð¹ÑÐµ ÑÑÐ°Ð²Ð½Ð¸Ð¼ ÑÐµÐ°Ð»ÑÐ½ÑÐµ ÑÐ¸ÑÑÑ Ð¿Ð¾ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸ÑÐ¼ ÑÑÐ¾Ð»Ð¸ÑÑ.',
      options: [
        '1ï¸â£ 4 500 â 5 000 â½ / ÑÐ¼ÐµÐ½Ð°',
        '2ï¸â£ 5 000 â 5 500 â½ / ÑÐ¼ÐµÐ½Ð°',
        '3ï¸â£ 5 500 â 6 500 â½ / ÑÐ¼ÐµÐ½Ð°',
        '4ï¸â£ ÐÑ 6 500 â½ + Ð¿ÑÐ¾ÑÐµÐ½Ñ Ð¾Ñ Ð²ÑÑÑÑÐºÐ¸'
      ],
      conclusion: 'ÐÐ°Ð¿Ð¸ÑÐ¸ÑÐµ Ð² ÐºÐ¾Ð¼Ð¼ÐµÐ½ÑÐ°ÑÐ¸ÑÑ: ÑÐºÐ¾Ð»ÑÐºÐ¾ ÑÐ°ÑÐ¾Ð² Ð´Ð»Ð¸ÑÑÑ Ð²Ð°ÑÐ° ÑÐ¼ÐµÐ½Ð° Ð¸ ÐºÐ¾ÑÐ¼ÑÑ Ð»Ð¸ Ð½Ð¾ÑÐ¼Ð°Ð»ÑÐ½Ð¾? ð',
      tags: ['#ÐÑÐ»ÑÑÐ ÑÐ½ÐºÐ°', '#Ð¡ÑÐ°Ð²ÐºÐ¸ÐÐ¾Ð²Ð°ÑÐ¾Ð²', '#ÐÐ¿ÑÐ¾Ñ', '#GastroConnect', '#Ð Ð°Ð±Ð¾ÑÐ°ÐÐ¾ÑÐºÐ²Ð°']
    }
  },
  {
    id: 'techcard_sauce',
    type: 'techcard',
    title: 'Ð Ð°Ð·Ð±Ð¾Ñ ÑÐµÑÐºÐ°ÑÑÑ: ÐÐ´ÐµÐ°Ð»ÑÐ½ÑÐ¹ ÑÐ¾ÑÑ ÐÐµÐ¼Ð¸Ð³Ð»Ð°Ñ Ð·Ð° 4 ÑÐ°ÑÐ°',
    category: 'ÐÐ±ÑÑÐµÐ½Ð¸Ðµ & Ð¢ÐµÑÐºÐ°ÑÑÑ',
    data: {
      headline: 'Ð ÐµÑÑÐ¾ÑÐ°Ð½Ð½Ð°Ñ Ð¾Ð¿ÑÐ¸Ð¼Ð¸Ð·Ð°ÑÐ¸Ñ ÐÐµÐ¼Ð¸Ð³Ð»Ð°ÑÐ° Ð±ÐµÐ· Ð¿Ð¾ÑÐµÑÐ¸ Ð³Ð»ÑÐ±Ð¸Ð½Ñ Ð²ÐºÑÑÐ°',
      body: `Ð¢ÑÐ°Ð´Ð¸ÑÐ¸Ð¾Ð½Ð½ÑÐ¹ Ð´ÐµÐ¼Ð¸Ð³Ð»Ð°Ñ Ð²Ð°ÑÑÑ 24â36 ÑÐ°ÑÐ¾Ð², ÑÑÐ¾ ÑÐ¶Ð¸Ð³Ð°ÐµÑ ÑÐ»ÐµÐºÑÑÐ¸ÑÐµÑÑÐ²Ð¾ Ð¸ Ð²ÑÐµÐ¼Ñ Ð¿ÐµÑÑÐ¾Ð½Ð°Ð»Ð°. ÐÐ°Ðº ÑÐ´ÐµÐ»Ð°ÑÑ ÐºÐ¾Ð½ÑÐµÐ½ÑÑÐ°Ñ Ð±ÑÑÑÑÐµÐµ:\n\nâ¢ <b>ÐÐ±Ð¶Ð°ÑÐºÐ° ÐºÐ¾ÑÑÐµÐ¹:</b> ÐÐ°Ð¿ÐµÐºÐ°Ð¹ÑÐµ Ð³Ð¾Ð²ÑÐ¶ÑÐ¸ ÑÑÑÐ±ÑÐ°ÑÑÐµ ÐºÐ¾ÑÑÐ¸ Ñ ÑÐ¾Ð¼Ð°ÑÐ½Ð¾Ð¹ Ð¿Ð°ÑÑÐ¾Ð¹ Ð¸ ÐºÐ¾ÑÐ½ÐµÐ¿Ð»Ð¾Ð´Ð°Ð¼Ð¸ Ð¿ÑÐ¸ 220Â°C Ð´Ð¾ Ð³Ð»ÑÐ±Ð¾ÐºÐ¾Ð¹ ÐºÐ°ÑÐ°Ð¼ÐµÐ»Ð¸Ð·Ð°ÑÐ¸Ð¸.\nâ¢ <b>ÐÐµÐ³Ð»Ð°Ð·Ð¸ÑÐ¾Ð²Ð°Ð½Ð¸Ðµ:</b> ÐÐ±ÑÐ·Ð°ÑÐµÐ»ÑÐ½Ð¾ ÑÐ¼ÑÐ²Ð°Ð¹ÑÐµ Ð¿ÑÐ¸Ð³Ð°Ñ ÑÐ¾ Ð´Ð½Ð° Ð¿ÑÐ¾ÑÐ¸Ð²Ð½Ñ ÑÑÑÐ¸Ð¼ ÐºÑÐ°ÑÐ½ÑÐ¼ Ð²Ð¸Ð½Ð¾Ð¼ â ÑÐ°Ð¼ 40% Ð²ÐºÑÑÐ° ÑÐ¼Ð°Ð¼Ð¸.\nâ¢ <b>Ð¡ÐºÐ¾ÑÐ¾Ð²Ð°ÑÐºÐ° / ÐÐ²ÑÐ¾ÐºÐ»Ð°Ð²:</b> ÐÐ°ÑÐºÐ° Ð¿Ð¾Ð´ Ð´Ð°Ð²Ð»ÐµÐ½Ð¸ÐµÐ¼ 1.2 Ð±Ð°ÑÐ° ÑÐ¾ÐºÑÐ°ÑÐ°ÐµÑ ÑÐºÑÑÑÐ°ÐºÑÐ¸Ñ ÐºÐ¾Ð»Ð»Ð°Ð³ÐµÐ½Ð° Ñ 20 ÑÐ°ÑÐ¾Ð² Ð´Ð¾ 3.5 ÑÐ°ÑÐ¾Ð²!\nâ¢ <b>Ð¤Ð¸Ð½Ð¸Ñ:</b> ÐÑÐ¿Ð°ÑÐ¸Ð²Ð°Ð½Ð¸Ðµ Ð½Ð° 50% Ð¸ Ð·Ð°ÑÑÐ³Ð¸Ð²Ð°Ð½Ð¸Ðµ ÑÐ¾Ð»Ð¾Ð´Ð½ÑÐ¼ ÑÐ»Ð¸Ð²Ð¾ÑÐ½ÑÐ¼ Ð¼Ð°ÑÐ»Ð¾Ð¼ Ð¿ÐµÑÐµÐ´ Ð¿Ð¾Ð´Ð°ÑÐµÐ¹.`,
      question: 'Ð¥Ð¾ÑÐ¸ÑÐµ Ð¿Ð¾Ð»Ð½ÑÑ ÑÐµÑÐºÐ°ÑÑÑ Ð² PDF? Ð¡ÑÐ°Ð²ÑÑÐµ ð¥ Ð² ÑÐµÐ°ÐºÑÐ¸ÑÑ!',
      tags: ['#Ð¢ÐµÑÐºÐ°ÑÑÐ°ÐÐµÐ´ÐµÐ»Ð¸', '#ÐÐµÐ¼Ð¸Ð³Ð»Ð°Ñ', '#Ð¡Ð¾ÑÑÑÐ¨ÐµÑÐ°', '#GastroConnect', '#ÐÑÑÐ½Ñ']
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
    const role = payload.role || payload.title || 'ÐÐ¾Ð²Ð°Ñ Ð½Ð° ÑÐ¼ÐµÐ½Ñ';
    const rate = payload.rate || 'Ð¡ÑÐ°Ð²ÐºÐ° Ð´Ð¾Ð³Ð¾Ð²Ð¾ÑÐ½Ð°Ñ';
    const metro = payload.metro || 'ÐÐ¾ÑÐºÐ²Ð°';
    const schedule = payload.schedule || 'Ð¡Ð¼ÐµÐ½Ð½ÑÐ¹ / ÐÐ¸Ð±ÐºÐ¸Ð¹';
    const perks = payload.perks || 'ÐÐ¸ÑÐ°Ð½Ð¸Ðµ, ÑÐ¾ÑÐ¼Ð°, ÑÐ²Ð¾ÐµÐ²ÑÐµÐ¼ÐµÐ½Ð½ÑÐµ Ð²ÑÐ¿Ð»Ð°ÑÑ';
    const tasks = payload.tasks || payload.description || 'Ð Ð°Ð±Ð¾ÑÐ° Ð½Ð° Ð¿Ð¾Ð·Ð¸ÑÐ¸Ð¸ Ð¿Ð¾ ÑÑÐ°Ð½Ð´Ð°ÑÑÐ°Ð¼ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ';
    const requirements = payload.requirements || 'ÐÐ¿ÑÑ ÑÐ°Ð±Ð¾ÑÑ, Ð´ÐµÐ¹ÑÑÐ²ÑÑÑÐ°Ñ Ð¼ÐµÐ´ÐºÐ½Ð¸Ð¶ÐºÐ°';
    const contacts = payload.contacts ? String(payload.contacts).trim() : '';
    const urgency = payload.urgency ? `â¡ï¸ <b>${escapeHtml(payload.urgency)}</b>\n` : '';

    // Emoji icon according to role
    let roleEmoji = 'ð¨âð³';
    const rLower = role.toLowerCase();
    if (rLower.includes('Ð³Ð¾ÑÑÑ') || rLower.includes('hot')) roleEmoji = 'ð¥';
    else if (rLower.includes('ÑÐ¾Ð»Ð¾Ð´Ð½') || rLower.includes('cold')) roleEmoji = 'âï¸';
    else if (rLower.includes('ÑÑ-ÑÐµÑ') || rLower.includes('ÑÐµÑ') || rLower.includes('chef')) roleEmoji = 'ð';
    else if (rLower.includes('ÑÑÑÐ¸') || rLower.includes('sushi')) roleEmoji = 'ð£';
    else if (rLower.includes('Ð¿Ð¸ÑÑ') || rLower.includes('pizza')) roleEmoji = 'ð';
    else if (rLower.includes('ÐºÐ¾Ð½Ð´Ð¸Ñ') || rLower.includes('Ð¿ÐµÐºÐ°Ñ')) roleEmoji = 'ð¥';
    else if (rLower.includes('Ð±Ð°ÑÐ¸ÑÑÐ°') || rLower.includes('Ð±Ð°Ñ')) roleEmoji = 'âï¸';

    // Tags
    hashtags = [
      '#' + role.replace(/[^a-zA-ZÐ°-ÑÐ-Ð¯0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, ''),
      '#Ð Ð°Ð±Ð¾ÑÐ°ÐÐ¾ÑÐºÐ²Ð°',
      '#Ð¡Ð¼ÐµÐ½Ð°',
      '#GastroConnect'
    ];
    if (metro && metro !== 'ÐÐ¾ÑÐºÐ²Ð°') {
      const cleanMetro = metro.split(/[,(]/)[0].trim().replace(/[^a-zA-ZÐ°-ÑÐ-Ð¯0-9]/g, '_');
      hashtags.push('#Ð¼_' + cleanMetro);
    }

    const contactsHtml = contacts ? `\nð± <b>ÐÑÑÐ¼Ð¾Ð¹ ÐºÐ¾Ð½ÑÐ°ÐºÑ Ð´Ð»Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ°:</b>\nð <b>${escapeHtml(contacts)}</b>\n` : '';

    // Compact, punchy, beautiful format: Position, Rate, Location, Contact
    html = `${roleEmoji} <b>${escapeHtml(role)}</b>

ð° <b>${escapeHtml(rate)}</b>
ð ${escapeHtml(metro)}
â° ${escapeHtml(schedule)}
ð ${escapeHtml(perks)}

${contactsHtml}â¡ï¸ <b><a href="${registerLink}">ÐÐ°Ð±ÑÐ°ÑÑ ÑÐ¼ÐµÐ½Ñ / ÐÑÐºÐ»Ð¸ÐºÐ½ÑÑÑÑÑ</a></b>
ð¬ <b><a href="${chatLink}">Ð§Ð°Ñ Ð¿Ð¾Ð²Ð°ÑÐ¾Ð² @gastroconnect</a></b>

${hashtags.slice(0, 3).join(' ')}`;

  } else if (type === 'tip') {
    const headline = payload.headline || payload.title || 'ÐÐ°Ð¹ÑÑÐ°Ðº ÑÐµÑ-Ð¿Ð¾Ð²Ð°ÑÐ°';
    const body = payload.body || payload.description || '';
    const question = payload.question || 'ÐÐµÐ»Ð¸ÑÐµÑÑ Ð²Ð°ÑÐ¸Ð¼ Ð¼Ð½ÐµÐ½Ð¸ÐµÐ¼ Ð² ÐºÐ¾Ð¼Ð¼ÐµÐ½ÑÐ°ÑÐ¸ÑÑ ð';
    hashtags = payload.tags || ['#GastroTips', '#ÐÐ°Ð¹ÑÑÐ°ÐºÐ¨ÐµÑÐ°', '#GastroConnect', '#ÐÑÑÐ½Ñ'];

    html = `ð¡ <b>ÐÐÐÐ¤Ð¥ÐÐ Ð¨ÐÐ¤Ð | #GastroTips</b>
ââââââââââââââââââââ
ð¨âð³ <b>${escapeHtml(headline)}</b>

${body}

ââââââââââââââââââââ
ð¬ <b>ÐÐ±ÑÑÐ´Ð¸ÑÑ Ð² ÑÐ°ÑÐµ:</b> <a href="${chatLink}">Ð§Ð°Ñ @gastroconnect</a>
ð <b>ÐÐ°Ñ ÑÐ°Ð¹Ñ:</b> <a href="${registerLink}">GastroConnect.ru</a>

${hashtags.join(' ')}`;

  } else if (type === 'poll') {
    const headline = payload.headline || payload.title || 'ÐÐ¿ÑÐ¾Ñ ÑÐµÑÑÐ¾ÑÐ°Ð½Ð½Ð¾Ð³Ð¾ ÑÐ¾Ð¾Ð±ÑÐµÑÑÐ²Ð°';
    const intro = payload.intro || '';
    const options = payload.options || [];
    const conclusion = payload.conclusion || 'ÐÐ¸ÑÐ¸ÑÐµ Ð²Ð°ÑÐ¸ Ð¼ÑÑÐ»Ð¸ Ð² ÐºÐ¾Ð¼Ð¼ÐµÐ½ÑÐ°ÑÐ¸ÑÑ ð';
    hashtags = payload.tags || ['#ÐÑÐ»ÑÑÐ ÑÐ½ÐºÐ°', '#ÐÐ¿ÑÐ¾Ñ', '#GastroConnect', '#HoReCa'];

    html = `ð <b>ÐÐ£ÐÐ¬Ð¡ Ð Ð«ÐÐÐ | ÐÐ¿ÑÐ¾Ñ GastroConnect</b>
ââââââââââââââââââââ
ð¥ <b>${escapeHtml(headline)}</b>

${escapeHtml(intro)}

${options.map(opt => `<b>${escapeHtml(opt)}</b>`).join('\n')}

ââââââââââââââââââââ
ð¬ <b>ÐÐ±ÑÑÐ´Ð¸ÑÑ Ð² ÑÐ°ÑÐµ:</b> <a href="${chatLink}">Ð§Ð°Ñ @gastroconnect</a>
ð <b>ÐÐ°Ñ ÑÐ°Ð¹Ñ:</b> <a href="${registerLink}">GastroConnect.ru</a>

${hashtags.join(' ')}`;

  } else if (type === 'techcard') {
    const headline = payload.headline || payload.title || 'Ð Ð°Ð·Ð±Ð¾Ñ ÑÐµÑÐºÐ°ÑÑÑ Ð½ÐµÐ´ÐµÐ»Ð¸';
    const body = payload.body || '';
    const question = payload.question || 'Ð¥Ð¾ÑÐ¸ÑÐµ Ð¿Ð¾Ð»Ð½ÑÑ ÑÐµÑÐºÐ°ÑÑÑ Ð² PDF? Ð¡ÑÐ°Ð²ÑÑÐµ ÑÐµÐ°ÐºÑÐ¸Ð¸ ð¥';
    hashtags = payload.tags || ['#Ð¢ÐµÑÐºÐ°ÑÑÐ°ÐÐµÐ´ÐµÐ»Ð¸', '#GastroConnect', '#Ð¤ÑÐ´ÐºÐ¾ÑÑ', '#Ð¨ÐµÑ'];

    html = `ð¥© <b>Ð ÐÐÐÐÐ  Ð¢ÐÐ¥ÐÐÐ Ð¢Ð« | GastroConnect</b>
ââââââââââââââââââââ
ð <b>${escapeHtml(headline)}</b>

${body}

ââââââââââââââââââââ
ð¬ <b>ÐÐ±ÑÑÐ´Ð¸ÑÑ Ð² ÑÐ°ÑÐµ:</b> <a href="${chatLink}">Ð§Ð°Ñ @gastroconnect</a>
ð <b>ÐÐ°Ñ ÑÐ°Ð¹Ñ:</b> <a href="${registerLink}">GastroConnect.ru</a>

${hashtags.join(' ')}`;

  } else {
    // Custom post
    const text = payload.customMessage || payload.text || payload.description || '';
    hashtags = payload.tags || ['#GastroConnect', '#HoReCa'];
    html = `ð¢ <b>Ð¡ÐÐÐÐ©ÐÐ¡Ð¢ÐÐ GASTROCONNECT</b>
ââââââââââââââââââââ
${text}

ââââââââââââââââââââ
ð¬ <b>ÐÐ±ÑÑÐ´Ð¸ÑÑ Ð² ÑÐ°ÑÐµ:</b> <a href="${chatLink}">Ð§Ð°Ñ @gastroconnect</a>
ð <b>ÐÐ°Ñ ÑÐ°Ð¹Ñ:</b> <a href="${registerLink}">GastroConnect.ru</a>

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
      message: 'Telegram Bot Token Ð½Ðµ Ð½Ð°ÑÑÑÐ¾ÐµÐ½ Ð² .env. Ð¡Ð¾Ð¾Ð±ÑÐµÐ½Ð¸Ðµ Ð¸Ð´ÐµÐ°Ð»ÑÐ½Ð¾ ÑÐ³ÐµÐ½ÐµÑÐ¸ÑÐ¾Ð²Ð°Ð½Ð¾ Ð¸ Ð³Ð¾ÑÐ¾Ð²Ð¾ Ð´Ð»Ñ Ð¼Ð³Ð½Ð¾Ð²ÐµÐ½Ð½Ð¾Ð¹ Ð¿ÑÐ±Ð»Ð¸ÐºÐ°ÑÐ¸Ð¸ Ð¸Ð»Ð¸ ÑÑÑÐ½Ð¾Ð¹ Ð¾ÑÐ¿ÑÐ°Ð²ÐºÐ¸ Ð² @gastroconnect.',
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
        { text: 'â¡ï¸ ÐÐ°ÑÐµÐ³Ð¸ÑÑÑÐ¸ÑÐ¾Ð²Ð°ÑÑÑÑ Ð¸ Ð¾ÑÐºÐ»Ð¸ÐºÐ½ÑÑÑÑÑ', url: 'https://gastroconnect.ru/workers/' }
      ]);
      inline_keyboard.push([
        { text: 'ð¬ Ð§Ð°Ñ ÑÐ¾Ð¾Ð±ÑÐµÑÑÐ²Ð° @gastroconnect', url: 'https://t.me/gastroconnect' }
      ]);
    } else {
      inline_keyboard.push([
        { text: 'ð GastroConnect.ru', url: 'https://gastroconnect.ru/' },
        { text: 'ð¬ Ð§Ð°Ñ @gastroconnect', url: 'https://t.me/gastroconnect' }
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
      const role = payload.role || payload.title || 'Ð¡Ð¼ÐµÐ½Ð° Ð² ÑÐµÑÑÐ¾ÑÐ°Ð½';
      const rate = payload.rate || payload.salary || 'ÐÐ¿Ð»Ð°ÑÐ° Ð´Ð¾Ð³Ð¾Ð²Ð¾ÑÐ½Ð°Ñ';
      const metro = payload.metro || payload.city || 'ÐÐ¾ÑÐºÐ²Ð°';

      const chatMessageText = `ð¥ <b>ÐÐÐÐÐ¯ Ð¡ÐÐÐÐ Ð ÐÐÐÐÐÐÐ GASTROCONNECT!</b>
ââââââââââââââââââââ
ð <b>ÐÐ¾Ð·Ð¸ÑÐ¸Ñ:</b> ${escapeHtml(role)}
ð° <b>Ð¡ÑÐ°Ð²ÐºÐ°:</b> ${escapeHtml(rate)}
ð <b>ÐÐ¾ÐºÐ°ÑÐ¸Ñ:</b> ${escapeHtml(metro)}

ð <b>ÐÐ¾Ð»Ð½ÑÐµ ÑÑÐ»Ð¾Ð²Ð¸Ñ Ð¸ ÑÑÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ:</b> <a href="${postUrl}">Ð¡Ð¼Ð¾ÑÑÐµÑÑ Ð² ÐºÐ°Ð½Ð°Ð»Ðµ</a>
â¡ï¸ <b>ÐÑÑÑÑÑÐ¹ Ð¾ÑÐºÐ»Ð¸Ðº:</b> <a href="${registerLink}">Ð ÐµÐ³Ð¸ÑÑÑÐ°ÑÐ¸Ñ Ð½Ð° ÑÐ°Ð¹ÑÐµ</a>`;

      const chatKeyboard = [
        [
          { text: 'ð Ð¡Ð¼Ð¾ÑÑÐµÑÑ Ð¿Ð¾ÑÑ Ð² ÐºÐ°Ð½Ð°Ð»Ðµ', url: postUrl },
          { text: 'â¡ï¸ ÐÑÐºÐ»Ð¸ÐºÐ½ÑÑÑÑÑ Ð½Ð° ÑÐ°Ð¹ÑÐµ', url: registerLink }
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
  if (!text) return 'â¢ ÐÑÐµ ÑÑÐ»Ð¾Ð²Ð¸Ñ ÑÑÐ¾ÑÐ½ÑÑÑÑÑ Ñ ÑÐµÑÐ°';
  if (Array.isArray(text)) {
    return text.map(item => `â¢ ${escapeHtml(item.trim())}`).join('\n');
  }
  const items = text.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  if (items.length <= 1) {
    return `â¢ ${escapeHtml(text)}`;
  }
  return items.map(item => `â¢ ${escapeHtml(item)}`).join('\n');
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
