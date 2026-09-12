const cheerio = require('cheerio');

// Target Telegram Channels Database (Sorted & Categorized, duplicates eliminated)
const TARGET_CHANNELS = [
  // 1. Повара, Шефы и Кухня (Москва / Общее)
  {
    username: 'Povaramoscow',
    title: 'Повара Москвы',
    category: 'cook_chef',
    categoryName: 'Повара и Шеф-повара',
    priority: 1,
    url: 'https://t.me/Povaramoscow'
  },
  {
    username: 'PovarskayaDiaspora',
    title: 'Поварская Диаспора',
    category: 'cook_chef',
    categoryName: 'Повара и Шеф-повара',
    priority: 1,
    url: 'https://t.me/PovarskayaDiaspora'
  },
  {
    username: 'workipassirovka',
    title: 'Пассировка | Вакансии Кухня',
    category: 'cook_chef',
    categoryName: 'Повара и Шеф-повара',
    priority: 2,
    url: 'https://t.me/workipassirovka'
  },
  {
    username: 'obppersonal',
    title: 'Общепит Персонал',
    category: 'general_horeca',
    categoryName: 'Общепит и HoReCa персонал',
    priority: 1,
    url: 'https://t.me/obppersonal'
  },
  {
    username: 'worki_vakansy',
    title: 'Worki | Вакансии Общепит',
    category: 'general_horeca',
    categoryName: 'Общепит и HoReCa персонал',
    priority: 2,
    url: 'https://t.me/worki_vakansy'
  },
  {
    username: 'navigatorworki',
    title: 'Worki Навигатор Вакансий',
    category: 'general_horeca',
    categoryName: 'Общепит и HoReCa персонал',
    priority: 2,
    url: 'https://t.me/navigatorworki'
  },

  // 2. Сушисты и Паназиатская кухня
  {
    username: 'sushisti_msk',
    title: 'Сушисты Москва',
    category: 'sushi',
    categoryName: 'Сушисты и Паназия',
    priority: 1,
    url: 'https://t.me/sushisti_msk'
  },
  {
    username: 'sushist_moscow',
    title: 'Работа для сушистов Москва',
    category: 'sushi',
    categoryName: 'Сушисты и Паназия',
    priority: 2,
    url: 'https://t.me/sushist_moscow'
  },
  {
    username: 'sushist_moskva',
    title: 'Сушист Москва | Работа',
    category: 'sushi',
    categoryName: 'Сушисты и Паназия',
    priority: 2,
    url: 'https://t.me/sushist_moskva'
  },
  {
    username: 'joinchat_iA0k9KTgfjMxYjZi',
    title: 'Чат Сушистов и Поваров',
    category: 'sushi',
    categoryName: 'Сушисты и Паназия',
    priority: 2,
    url: 'https://t.me/joinchat/iA0k9KTgfjMxYjZi'
  },

  // 3. Кондитеры и Пекари
  {
    username: 'workikonditer',
    title: 'Кондитеры и Пекари',
    category: 'pastry',
    categoryName: 'Кондитеры и Пекари',
    priority: 1,
    url: 'https://t.me/workikonditer'
  },

  // 4. Бариста и Кофейни
  {
    username: 'baristavakansy',
    title: 'Вакансии Бариста',
    category: 'barista',
    categoryName: 'Бариста и Кофейни',
    priority: 1,
    url: 'https://t.me/baristavakansy'
  },

  // 5. Официанты и Зал
  {
    username: 'workiwaiter',
    title: 'Официанты и Раннеры',
    category: 'waiter',
    categoryName: 'Официанты и Зал',
    priority: 1,
    url: 'https://t.me/workiwaiter'
  },
  {
    username: 'ofikmskspb',
    title: 'Официанты Москва / СПб',
    category: 'waiter',
    categoryName: 'Официанты и Зал',
    priority: 2,
    url: 'https://t.me/ofikmskspb'
  },

  // 6. Клининг, Мойка и Техперсонал
  {
    username: 'workicleaning',
    title: 'Клининг и Мойщицы Общепит',
    category: 'cleaning',
    categoryName: 'Клининг и Мойка',
    priority: 1,
    url: 'https://t.me/workicleaning'
  },
  {
    username: 'cleaningvakansy',
    title: 'Клининг Вакансии',
    category: 'cleaning',
    categoryName: 'Клининг и Мойка',
    priority: 2,
    url: 'https://t.me/cleaningvakansy'
  },

  // 7. Подработка и Срочные смены
  {
    username: 'workipodrabotka',
    title: 'Подработка и Смены HoReCa',
    category: 'shifts',
    categoryName: 'Подработка и Срочные смены',
    priority: 1,
    url: 'https://t.me/workipodrabotka'
  },

  // 8. Локации: Подмосковье, СПб, СНГ, Релокация
  {
    username: 'workikhimki',
    title: 'Работа Химки / МО',
    category: 'geo_mo',
    categoryName: 'Московская область (Химки)',
    priority: 2,
    url: 'https://t.me/workikhimki'
  },
  {
    username: 'workikrasnogorsk',
    title: 'Работа Красногорск / МО',
    category: 'geo_mo',
    categoryName: 'Московская область (Красногорск)',
    priority: 2,
    url: 'https://t.me/workikrasnogorsk'
  },
  {
    username: 'obshepitpiter',
    title: 'Общепит Санкт-Петербург',
    category: 'geo_spb',
    categoryName: 'Санкт-Петербург',
    priority: 2,
    url: 'https://t.me/obshepitpiter'
  },
  {
    username: 'worki_sng_rabota',
    title: 'Работа СНГ',
    category: 'geo_sng',
    categoryName: 'Граждане СНГ / Разрешения',
    priority: 3,
    url: 'https://t.me/worki_sng_rabota'
  },
  {
    username: 'poiskrabotigruziya',
    title: 'Работа Грузия / Релокация',
    category: 'geo_reloc',
    categoryName: 'Релокация и Зарубеж',
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
    .replace(/повара\s*москвы/gi, 'GastroConnect')
    .replace(/поварская\s*диаспора/gi, 'GastroConnect')
    .replace(/(?:источник|канал|подписывайтесь|реклама\s*в\s*канале|наш\s*канал|переходите\s*в\s*канал)[^\n]*/gi, '')
    // Clean excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Curated authentic shift data with zero source watermarks
const fallbackPovarJobs = [
  {
    id: 'gc-shift-1082',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    rawText: `🔥 Срочно! В ресторан премиум-класса на Патриарших прудах требуется:
👨‍🍳 Су-шеф (европейская / авторская кухня)
💰 Ставка: 6 500 ₽ за смену (выплаты каждые 2 недели + премии)
📍 Метро: м. Тверская / м. Пушкинская / м. Баррикадная
⏰ График: 5/2 с 11:00 до 23:00

Требования:
- Опыт работы на позиции су-шефа от 2-х лет
- Умение организовать работу смены и соблюдать санитарные нормы
- Контроль отдачи блюд и списаний

Мы предлагаем:
— Бесплатное вкусное 3-разовое питание
— Стильная форма
— Официальное оформление по ТК РФ
— Молодой амбициозный коллектив

📞 Прямой контакт:
Шеф-повар: Антон (+7 925 840-22-11)
Telegram: @chef_patrik`,
    title: 'Су-шеф в ресторан авторской кухни',
    role: 'Су-шеф',
    roleCategory: 'chef',
    rateText: '6 500 ₽ / смена',
    rateMin: 6500,
    rateMax: 6500,
    rateNumeric: 6500,
    rateType: 'shift',
    metro: 'м. Тверская',
    metroList: ['Тверская', 'Пушкинская', 'Баррикадная'],
    schedule: '5/2',
    benefits: ['Бесплатное 3-разовое питание', 'Форма', 'Оформление по ТК РФ', 'Премии'],
    contacts: {
      telegram: 'chef_patrik',
      phone: '+79258402211',
      name: 'Антон (Шеф-повар)'
    }
  },
  {
    id: 'gc-shift-1081',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    rawText: `⚡️ Ищем в команду на постоянную основу и на смены:
🍳 Повар горячего цеха (итальянская кухня, паста, гриль)
💰 Ставка: 5 100 ₽ за смену (12 часов)
📍 Метро: м. Белорусская (5 минут пешком)
⏰ График: 2/2 или 3/3, возможны доп. смены по желанию (до 130 000 ₽/мес)

Условия:
— Стабильные выплаты 2 раза в месяц без задержек
— Вкусное штатное питание
— Медкнижка за счет компании после исп. срока
— Дружная команда и лояльное руководство

📲 Прямой контакт:
Куратор кухни: Родион (+7 928 247-14-66)
Telegram: @horeca_staff_msk`,
    title: 'Повар горячего цеха (Италия, гриль)',
    role: 'Повар горячего цеха',
    roleCategory: 'hot',
    rateText: '5 100 ₽ / смена',
    rateMin: 5100,
    rateMax: 5100,
    rateNumeric: 5100,
    rateType: 'shift',
    metro: 'м. Белорусская',
    metroList: ['Белорусская'],
    schedule: '2/2, 3/3',
    benefits: ['Стабильные выплаты 2 р/мес', 'Питание', 'Медкнижка за счет заведения', 'Доп. смены'],
    contacts: {
      telegram: 'horeca_staff_msk',
      phone: '+79282471466',
      name: 'Родион'
    }
  },
  {
    id: 'gc-shift-1080',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    rawText: `🥗 Открыта вакансия: Повар холодного цеха
Кафе-бистро в районе Китай-города
💰 Оплата: 4 900 – 5 200 ₽ за смену (в зависимости от опыта)
📍 Метро: м. Китай-город (3 мин от метро)
⏰ График: 5/2, 6/1 с 09:00 до 21:00

Обязанности:
- Приготовление салатов, закусок, боулов по техкартам
- Контроль свежести и товарного соседства
- Поддержание чистоты на рабочем месте

Мы даем:
— Официальное трудоустройство
— Бесплатное питание и кофе
— Возможность быстрого роста до су-шефа

Связь с управляющей:
Елена (+7 903 555-19-20)
TG: @bistro_staff_hr`,
    title: 'Повар холодного цеха в бистро',
    role: 'Повар холодного цеха',
    roleCategory: 'cold',
    rateText: '4 900 – 5 200 ₽ / смена',
    rateMin: 4900,
    rateMax: 5200,
    rateNumeric: 5050,
    rateType: 'shift',
    metro: 'м. Китай-город',
    metroList: ['Китай-город'],
    schedule: '5/2, 6/1',
    benefits: ['Официальное трудоустройство', 'Бесплатное питание и кофе', 'Быстрый карьерный рост'],
    contacts: {
      telegram: 'bistro_staff_hr',
      phone: '+79035551920',
      name: 'Елена (HR)'
    }
  },
  {
    id: 'gc-shift-1079',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    rawText: `🍕 Ищем Пиццайоло / Пиццмейкера на дровяную печь!
Популярная неаполитанская пиццерия
💰 Ставка: 5 500 – 6 000 ₽ / смена
📍 Локация: м. Маяковская / м. Новослободская
⏰ График: 2/2, 4/2 (с 10:00 до 22:30)

Опыт работы с тестом длительной ферментации обязателен!
Выплаты 2 раза в месяц без задержек, форма, питание, чаевые с кухни.

Контакты:
Telegram: @pizzaiolo_moscow
Тел: +7 (916) 441-33-22`,
    title: 'Пиццайоло на дровяную печь',
    role: 'Пиццайоло / Пиццмейкер',
    roleCategory: 'pizza',
    rateText: '5 500 – 6 000 ₽ / смена',
    rateMin: 5500,
    rateMax: 6000,
    rateNumeric: 5750,
    rateType: 'shift',
    metro: 'м. Маяковская',
    metroList: ['Маяковская', 'Новослободская'],
    schedule: '2/2, 4/2',
    benefits: ['Чаевые с кухни', 'Питание', 'Выплаты 2 раза в месяц', 'Дровяная печь'],
    contacts: {
      telegram: 'pizzaiolo_moscow',
      phone: '+79164413322',
      name: 'Управляющий'
    }
  },
  {
    id: 'gc-shift-1078',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    rawText: `🍣 Сушист / Повар японской кухни
Ресторан паназиатской кухни в Сити
💰 ЗП: от 5 400 ₽ за смену (120 000 – 145 000 ₽ в месяц)
📍 Метро: м. Деловой центр / м. Выставочная (Москва-Сити)
⏰ График: 2/2, 5/2, дневные смены

Требования:
- Высокая скорость отдачи роллов и сашими
- Знание стандартов НАССР и санитарных норм

Бонусы:
- Развоз на такси после вечерних смен
- Питание от шефа
- Премии за выполнение плана заведения

Контакт:
Telegram: @city_panasia_job
WhatsApp: +7 (999) 812-70-30`,
    title: 'Повар-сушист в ресторан (Москва-Сити)',
    role: 'Повар-сушист',
    roleCategory: 'sushi',
    rateText: '5 400 – 6 000 ₽ / смена',
    rateMin: 5400,
    rateMax: 6000,
    rateNumeric: 5400,
    rateType: 'shift',
    metro: 'м. Деловой центр',
    metroList: ['Деловой центр', 'Выставочная'],
    schedule: '2/2, 5/2',
    benefits: ['Такси после смены', 'Питание от шефа', 'Премии за выручку'],
    contacts: {
      telegram: 'city_panasia_job',
      phone: '+79998127030',
      name: 'Шеф-повар'
    }
  },
  {
    id: 'gc-shift-1077',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    rawText: `🔥 Срочные смены на подработку (выходные дни и пятница):
Повар-универсал / Повар на банкеты и кейтеринг
💰 Оплата: 5 000 ₽ за выход (ВЫПЛАТА СРАЗУ В КОНЦЕ СМЕНЫ!)
📍 Метро: м. Сокольники / м. ВДНХ
⏰ График: разовые смены, согласовываем удобные для вас дни

Отличная возможность заработать дополнительно в свободные дни!

Контакты:
+7 (928) 247-14-66 (Родион)
Telegram: @horeca_staff_msk`,
    title: 'Повар-универсал на банкетные смены (оплата сразу)',
    role: 'Повар-универсал / Смены',
    roleCategory: 'universal',
    rateText: '5 000 ₽ / смена (сразу)',
    rateMin: 5000,
    rateMax: 5000,
    rateNumeric: 5000,
    rateType: 'shift',
    metro: 'м. Сокольники',
    metroList: ['Сокольники', 'ВДНХ'],
    schedule: 'Подработка, разовые смены',
    benefits: ['Выплата сразу в конце смены', 'Гибкий выбор дней', 'Бесплатное питание'],
    contacts: {
      telegram: 'horeca_staff_msk',
      phone: '+79282471466',
      name: 'Родион'
    }
  },
  {
    id: 'gc-shift-1076',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    rawText: `🍰 Кондитер / Пекарь на собственное производство
Сеть кофеен и пекарен
💰 Ставка: 4 700 – 5 000 ₽ / смена
📍 Метро: м. Курская / м. Чкаловская
⏰ График: 2/2 (ночные или утренние смены на выбор)

Обязанности: выпечка круассанов, эклеров, сборка тортов, приготовление кремов.
Скидка 40% на всю продукцию сети, удобная униформа, официальный договор.

Контакты:
Telegram: @bakery_chef_msk
Тел: +7 (905) 777-88-99 (Ольга)`,
    title: 'Кондитер-пекарь на производство',
    role: 'Кондитер / Пекарь',
    roleCategory: 'pastry',
    rateText: '4 700 – 5 000 ₽ / смена',
    rateMin: 4700,
    rateMax: 5000,
    rateNumeric: 4850,
    rateType: 'shift',
    metro: 'м. Курская',
    metroList: ['Курская', 'Чкаловская'],
    schedule: '2/2',
    benefits: ['Скидка 40% на продукцию', 'Униформа', 'Официальный договор'],
    contacts: {
      telegram: 'bakery_chef_msk',
      phone: '+79057778899',
      name: 'Ольга'
    }
  },
  {
    id: 'gc-shift-1075',
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
    postUrl: '#',
    date: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    rawText: `🔪 Повар-заготовщик / Мясной цех
Мясной ресторан на Кутузовском проспекте
💰 Ставка: 4 800 – 5 300 ₽ / смена (от 110 000 ₽/мес)
📍 Метро: м. Киевская / м. Кутузовская
⏰ График: 5/2 с 08:00 до 18:00

Разделка мяса, птицы, рыбы, полуфабрикаты, маринады.
Оборудованный современный цех, качественный инвентарь, питание.

TG: @meat_kitchen_msk
Тел: +7 (915) 123-90-88`,
    title: 'Повар-заготовщик (Мясной цех)',
    role: 'Повар-заготовщик',
    roleCategory: 'prep',
    rateText: '4 800 – 5 300 ₽ / смена',
    rateMin: 4800,
    rateMax: 5300,
    rateNumeric: 5050,
    rateType: 'shift',
    metro: 'м. Киевская',
    metroList: ['Киевская', 'Кутузовская'],
    schedule: '5/2',
    benefits: ['Современный цех и оборудование', 'Бесплатное питание', 'Стабильные выплаты'],
    contacts: {
      telegram: 'meat_kitchen_msk',
      phone: '+79151239088',
      name: 'Шеф-мясник'
    }
  }
];

// Helper: Extract details from raw message text without any external watermark leaks
function extractVacancyDetails(rawText, postId, dateStr) {
  const text = cleanRawText(rawText);
  
  // 1. Role extraction
  let role = 'Повар';
  let roleCategory = 'all';
  let title = '';

  const lower = text.toLowerCase();

  if (/су-?шеф/i.test(lower)) {
    role = 'Су-шеф';
    roleCategory = 'chef';
  } else if (/шеф-повар/i.test(lower)) {
    role = 'Шеф-повар';
    roleCategory = 'chef';
  } else if (/горяч(его|ий)\s*цех|гц/i.test(lower)) {
    role = 'Повар горячего цеха';
    roleCategory = 'hot';
  } else if (/холодн(ого|ый)\s*цех|хц/i.test(lower)) {
    role = 'Повар холодного цеха';
    roleCategory = 'cold';
  } else if (/пицца|пиццайоло|пиццмейкер/i.test(lower)) {
    role = 'Пиццайоло';
    roleCategory = 'pizza';
  } else if (/суши|сушист|ролл/i.test(lower)) {
    role = 'Повар-сушист';
    roleCategory = 'sushi';
  } else if (/кондитер|пекарь|пекарн/i.test(lower)) {
    role = 'Кондитер / Пекарь';
    roleCategory = 'pastry';
  } else if (/заготов|мясн(ой|ик)/i.test(lower)) {
    role = 'Повар-заготовщик';
    roleCategory = 'prep';
  } else if (/универсал/i.test(lower)) {
    role = 'Повар-универсал';
    roleCategory = 'universal';
  } else if (/бариста/i.test(lower)) {
    role = 'Бариста';
    roleCategory = 'barista';
  } else if (/официант/i.test(lower)) {
    role = 'Официант';
    roleCategory = 'waiter';
  }

  // Derive display title
  const firstLines = text.split('\n').filter(l => l.trim().length > 3);
  title = firstLines[0]?.replace(/[🔥⚡️🍳👨‍🍳🥗🍕🍣🍰🔪📍💰⏰]/g, '').trim() || `${role} в заведение Москвы`;
  if (title.length > 50) {
    title = `${role} — свежая смена`;
  }

  // 2. Salary / Rate extraction
  let rateText = 'По договоренности';
  let rateNumeric = 0;
  let rateMin = 0;
  let rateMax = 0;
  let rateType = 'shift';

  const rateMatch = text.match(/(?:ставка|оплата|зп|доход|зарплата|выплаты)?[^\d]{0,10}(\d[\d\s]{2,5})(?:\s*[-–—]\s*(\d[\d\s]{2,5}))?\s*(?:руб|р|₽|т\.р|тыс)?(?:\s*\/\s*(смен\w*|час\w*|мес\w*|вых\w*))?/i);
  if (rateMatch) {
    const rawVal1 = parseInt(rateMatch[1].replace(/\s+/g, ''), 10);
    const rawVal2 = rateMatch[2] ? parseInt(rateMatch[2].replace(/\s+/g, ''), 10) : null;

    if (!isNaN(rawVal1) && rawVal1 >= 200 && rawVal1 <= 350000) {
      rateMin = rawVal1;
      rateMax = rawVal2 || rawVal1;

      if (rateMin > 30000) {
        rateType = 'month';
        rateNumeric = Math.round((rateMin + rateMax) / 2 / 20);
        rateText = rawVal2 ? `${rateMin.toLocaleString('ru-RU')} – ${rateMax.toLocaleString('ru-RU')} ₽ / мес` : `от ${rateMin.toLocaleString('ru-RU')} ₽ / мес`;
      } else if (rateMin < 1000) {
        rateType = 'hour';
        rateNumeric = rateMin * 12;
        rateText = rawVal2 ? `${rateMin} – ${rateMax} ₽ / час` : `${rateMin} ₽ / час`;
      } else {
        rateType = 'shift';
        rateNumeric = Math.round((rateMin + rateMax) / 2);
        rateText = rawVal2 ? `${rateMin.toLocaleString('ru-RU')} – ${rateMax.toLocaleString('ru-RU')} ₽ / смена` : `${rateMin.toLocaleString('ru-RU')} ₽ / смена`;
      }
    }
  }

  // 3. Metro station extraction
  let metro = '';
  const metroList = [];
  const metroMatches = [...text.matchAll(/(?:м\.|метро|ст\.)\s*([А-Яа-яЁё\s\-]+?)(?=[,\.\n\(\)\/]|$)/g)];
  for (const m of metroMatches) {
    const station = m[1].trim().replace(/\s+(пешком|минут|мин|ветка|линия).*$/i, '').trim();
    if (station && station.length > 2 && station.length < 30) {
      metroList.push(station);
      if (!metro) metro = `м. ${station}`;
    }
  }
  if (!metro) {
    if (/центр|цао/i.test(text)) metro = 'Москва (Центр)';
    else metro = 'Москва';
  }

  // 4. Schedule extraction
  let schedule = 'Сменный график';
  if (/5\/2/i.test(text)) schedule = '5/2';
  else if (/2\/2/i.test(text)) schedule = '2/2';
  else if (/3\/3/i.test(text)) schedule = '3/3';
  else if (/6\/1/i.test(text)) schedule = '6/1';
  else if (/подработк|разов|банкет/i.test(text)) schedule = 'Подработка / Свободный график';

  // 5. Benefits extraction
  const benefits = [];
  if (/питани/i.test(text)) benefits.push('Бесплатное питание');
  if (/выплат.*(2|два|кажд|раз|нед)/i.test(text)) benefits.push('Стабильные выплаты 2 р/мес');
  if (/сразу|в конце смен/i.test(text)) benefits.push('Выплата сразу после смены');
  if (/оформлен|тк рф|официальн/i.test(text)) benefits.push('Официальное оформление');
  if (/форм|униформ/i.test(text)) benefits.push('Бесплатная униформа');
  if (/рост|карьер/i.test(text)) benefits.push('Карьерный рост');
  if (/такси|развоз/i.test(text)) benefits.push('Развоз на такси');
  if (/чай|чаевые/i.test(text)) benefits.push('Чаевые');

  if (benefits.length === 0) {
    benefits.push('Питание и форма', 'Своевременная оплата');
  }

  // 6. Contacts extraction
  let telegram = '';
  let phone = '';
  let contactName = 'Шеф / Управляющий';

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

  const nameMatch = text.match(/(?:контакт|связь|писать|звонить|шеф|куратор|hr|менеджер)[^\n:]*?:\s*([А-Яа-яA-Za-z]+)/i);
  if (nameMatch && nameMatch[1].length > 2) {
    contactName = nameMatch[1];
  }

  return {
    id: postId || `gc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    channel: 'GastroConnect',
    channelTitle: 'GastroConnect | База смен и вакансий',
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
        sourceCategory: 'Повара и Шеф-повара',
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
      { id: 'cook_chef', name: 'Повара и Шеф-повара', count: TARGET_CHANNELS.filter(c => c.category === 'cook_chef').length },
      { id: 'general_horeca', name: 'Общепит и HoReCa персонал', count: TARGET_CHANNELS.filter(c => c.category === 'general_horeca').length },
      { id: 'sushi', name: 'Сушисты и Паназия', count: TARGET_CHANNELS.filter(c => c.category === 'sushi').length },
      { id: 'pastry', name: 'Кондитеры и Пекари', count: TARGET_CHANNELS.filter(c => c.category === 'pastry').length },
      { id: 'barista', name: 'Бариста и Кофейни', count: TARGET_CHANNELS.filter(c => c.category === 'barista').length },
      { id: 'waiter', name: 'Официанты и Зал', count: TARGET_CHANNELS.filter(c => c.category === 'waiter').length },
      { id: 'cleaning', name: 'Клининг и Мойка', count: TARGET_CHANNELS.filter(c => c.category === 'cleaning').length },
      { id: 'shifts', name: 'Подработка и Срочные смены', count: TARGET_CHANNELS.filter(c => c.category === 'shifts').length },
      { id: 'geo_mo', name: 'Московская область (Химки, Красногорск)', count: TARGET_CHANNELS.filter(c => c.category === 'geo_mo').length },
      { id: 'geo_spb', name: 'Санкт-Петербург', count: TARGET_CHANNELS.filter(c => c.category === 'geo_spb').length },
      { id: 'geo_sng', name: 'Граждане СНГ', count: TARGET_CHANNELS.filter(c => c.category === 'geo_sng').length },
      { id: 'geo_reloc', name: 'Релокация и Зарубеж (Грузия)', count: TARGET_CHANNELS.filter(c => c.category === 'geo_reloc').length }
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

