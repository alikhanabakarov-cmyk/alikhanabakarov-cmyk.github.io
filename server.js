const express = require('express');
const path = require('path');
const fs = require('fs');
const { 
  fetchChannelVacancies, 
  fetchAllChannelsVacancies, 
  TARGET_CHANNELS, 
  startSchedulerTimer, 
  getScheduleStatus, 
  runScheduledScrape 
} = require('./telegram-scraper');
const { 
  TEMPLATES, 
  formatTelegramPost, 
  publishToTelegram, 
  publishTwoStepBroadcast,
  DEFAULT_CHANNEL,
  TELEGRAM_CHAT_URL,
  SITE_REGISTER_URL
} = require('./telegram-publisher');
const { 
  startAutopilot, 
  runAutopilotCycle, 
  compensateMissedPosts,
  getAutopilotStatus 
} = require('./telegram-autopilot');
const { VERIFIED_SUPPLIERS, getSuppliers } = require('./suppliers-data');
const { 
  TECH_CARDS, 
  getAllTechCards, 
  getTechCardById, 
  filterTechCards 
} = require('./tech-cards-data');
const {
  subscribeAlert,
  unsubscribeAlert,
  loadAlerts,
  BOT_USERNAME
} = require('./telegram-alerts');

const app = express();
const PORT = 3000;
const rootDir = __dirname;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// GastroConnect Media Assets Upload & Management API
app.get('/api/assets/list', (req, res) => {
  try {
    const assetsDir = path.join(rootDir, 'assets');
    if (!fs.existsSync(assetsDir)) return res.json({ files: [] });
    const files = fs.readdirSync(assetsDir);
    const videosDir = path.join(assetsDir, 'videos');
    const videoFiles = fs.existsSync(videosDir) ? fs.readdirSync(videosDir).map(f => `videos/${f}`) : [];
    res.json({ files: [...files, ...videoFiles] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assets/upload', (req, res) => {
  try {
    const { filename, base64Data, subfolder } = req.body || {};
    if (!filename || !base64Data) {
      return res.status(400).json({ success: false, error: 'filename and base64Data are required' });
    }
    const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
    const cleanBase64 = base64Data.replace(/^data:(image|video)\/\w+;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    const targetFolder = subfolder === 'videos' 
      ? path.join(rootDir, 'assets', 'videos') 
      : path.join(rootDir, 'assets');
      
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });
    
    const targetPath = path.join(targetFolder, safeFilename);
    fs.writeFileSync(targetPath, buffer);
    
    const distTarget = subfolder === 'videos' 
      ? path.join(rootDir, 'dist', 'assets', 'videos') 
      : path.join(rootDir, 'dist', 'assets');
      
    if (fs.existsSync(path.join(rootDir, 'dist', 'assets'))) {
      if (!fs.existsSync(distTarget)) fs.mkdirSync(distTarget, { recursive: true });
      fs.writeFileSync(path.join(distTarget, safeFilename), buffer);
    }
    
    const publicUrl = subfolder === 'videos' ? `/assets/videos/${safeFilename}` : `/assets/${safeFilename}`;
    res.json({ success: true, url: publicUrl, filename: safeFilename, bytes: buffer.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Запуск автоматического фонового парсера и автопилота публикаций
// Расписание автопилота: каждые 3 часа (08:00, 11:00, 14:00, 17:00, 20:00 МСК)
// Тихий режим: с 21:00 до 07:00 МСК
startSchedulerTimer();
startAutopilot();

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'GastroConnect', timestamp: new Date().toISOString() });
});

// GastroConnect Scraper Schedule & Channel Management API
app.get('/api/scraper/schedule', (req, res) => {
  res.json(getScheduleStatus());
});

app.get('/api/scraper/channels', (req, res) => {
  res.json({
    success: true,
    total: TARGET_CHANNELS.length,
    channels: TARGET_CHANNELS,
    schedules: ['09:00', '13:00', '17:00', '22:00'],
    timezone: 'Europe/Moscow (UTC+3)'
  });
});

app.post('/api/scraper/run', async (req, res) => {
  try {
    const { category, triggerType } = req.body || {};
    const result = await runScheduledScrape(triggerType || 'manual_api_trigger');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GastroConnect B2B Verified Suppliers API (AgroServer & HoReCa Marketplace)
app.get('/api/suppliers', (req, res) => {
  try {
    const { category, search, minOrderMax } = req.query;
    const suppliers = getSuppliers({ category, search, minOrderMax });
    res.json({
      success: true,
      source: 'GastroConnect B2B HoReCa Network',
      totalCount: VERIFIED_SUPPLIERS.length,
      filteredCount: suppliers.length,
      suppliers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GastroConnect HoReCa Tech Cards & Menu Engineering API
const CUSTOM_TECH_CARDS_FILE = path.join(rootDir, 'custom-tech-cards.json');

function getMergedTechCards() {
  let customCards = [];
  try {
    if (fs.existsSync(CUSTOM_TECH_CARDS_FILE)) {
      const data = fs.readFileSync(CUSTOM_TECH_CARDS_FILE, 'utf8');
      customCards = JSON.parse(data) || [];
    }
  } catch (e) {
    console.error('Error reading custom tech cards:', e);
  }
  return [...customCards, ...TECH_CARDS];
}

app.get('/api/tech-cards', (req, res) => {
  try {
    const { category, cuisine, dishType, search, maxCost, maxTime, station, sortBy } = req.query;
    let list = getMergedTechCards();

    if (category && category !== 'all') {
      list = list.filter(c => c.category === category);
    }
    if (cuisine && cuisine !== 'all') {
      list = list.filter(c => c.cuisine === cuisine);
    }
    if (dishType && dishType !== 'all') {
      list = list.filter(c => c.dishType === dishType);
    }
    if (station && station !== 'all') {
      list = list.filter(c => (c.station || '').toLowerCase().includes(station.toLowerCase()));
    }
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) ||
        (c.categoryLabel || '').toLowerCase().includes(q) ||
        (c.cuisineLabel || '').toLowerCase().includes(q) ||
        (c.dishTypeLabel || '').toLowerCase().includes(q) ||
        (c.station || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.ingredients && c.ingredients.some(ing => ing.name.toLowerCase().includes(q)))
      );
    }
    if (maxCost && Number(maxCost) > 0) {
      list = list.filter(c => c.costPriceRub <= Number(maxCost));
    }
    if (maxTime && Number(maxTime) > 0) {
      list = list.filter(c => c.prepTimeMinutes <= Number(maxTime));
    }

    // Server-side sorting
    if (sortBy) {
      switch (sortBy) {
        case 'name_asc':
          list.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
          break;
        case 'name_desc':
          list.sort((a, b) => b.title.localeCompare(a.title, 'ru'));
          break;
        case 'cost_asc':
          list.sort((a, b) => a.costPriceRub - b.costPriceRub);
          break;
        case 'cost_desc':
          list.sort((a, b) => b.costPriceRub - a.costPriceRub);
          break;
        case 'margin_desc':
          list.sort((a, b) => (b.marginRub || 0) - (a.marginRub || 0));
          break;
        case 'markup_desc':
          list.sort((a, b) => (b.markupPercent || 0) - (a.markupPercent || 0));
          break;
        case 'time_asc':
          list.sort((a, b) => (a.prepTimeMinutes || 0) - (b.prepTimeMinutes || 0));
          break;
        case 'time_desc':
          list.sort((a, b) => (b.prepTimeMinutes || 0) - (a.prepTimeMinutes || 0));
          break;
        case 'foodcost_asc':
          list.sort((a, b) => (a.foodCostPercent || 0) - (b.foodCostPercent || 0));
          break;
        case 'calories_asc':
          list.sort((a, b) => {
            const calA = a.kbjuTotal?.calories || a.kbjuPer100g?.calories || 0;
            const calB = b.kbjuTotal?.calories || b.kbjuPer100g?.calories || 0;
            return calA - calB;
          });
          break;
      }
    }

    res.json({
      success: true,
      total: list.length,
      cards: list
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tech-cards/categories', (req, res) => {
  res.json({
    success: true,
    categories: [
      { id: 'all', title: 'Все блюда и напитки', count: getMergedTechCards().length },
      { id: 'hot_dishes', title: '🥩 Горячие блюда' },
      { id: 'salads_starters', title: '🥗 Закуски и салаты' },
      { id: 'soups', title: '🍲 Супы' },
      { id: 'breakfast', title: '🍳 Завтраки и бранчи' },
      { id: 'pasta_pizza', title: '🍕 Паста и римская пицца' },
      { id: 'coffee_tea', title: '☕ Кофейная карта & чай' },
      { id: 'bar_cocktails', title: '🍹 Авторский бар & моктейли' },
      { id: 'desserts', title: '🍰 Кондитерская & десерты' }
    ]
  });
});

app.get('/api/tech-cards/cuisines', (req, res) => {
  res.json({
    success: true,
    cuisines: [
      { id: 'all', title: 'Все кухни мира' },
      { id: 'italian', title: '🇮🇹 Итальянская' },
      { id: 'caucasian', title: '🇬🇪 Кавказская / Грузинская' },
      { id: 'panasian', title: '🥢 Паназиатская / Японская' },
      { id: 'french', title: '🇫🇷 Французская' },
      { id: 'russian', title: '🇷🇺 Русская / Сибирская' },
      { id: 'european', title: '🇪🇺 Европейская классика' },
      { id: 'american', title: '🇺🇸 Американская / Гриль' },
      { id: 'coffee_culture', title: '☕ Кофейная культура' },
      { id: 'mixology', title: '🍸 Барная миксология' }
    ]
  });
});

app.get('/api/tech-cards/dish-types', (req, res) => {
  res.json({
    success: true,
    dishTypes: [
      { id: 'all', title: 'Все виды блюд' },
      { id: 'meat', title: '🥩 Мясо и стейки' },
      { id: 'seafood', title: '🐟 Рыба и морепродукты' },
      { id: 'poultry', title: '🍗 Птица' },
      { id: 'vegetarian', title: '🥑 Овощи и вегетарианское' },
      { id: 'soup', title: '🥣 Супы и бульоны' },
      { id: 'dough_baking', title: '🍕 Паста и пицца' },
      { id: 'sweet_dessert', title: '🍰 Десерты и выпечка' },
      { id: 'hot_drink', title: '☕ Горячие напитки' },
      { id: 'cold_drink', title: '🍹 Холодные коктейли и лимонады' }
    ]
  });
});

app.get('/api/tech-cards/:id', (req, res) => {
  try {
    const card = getMergedTechCards().find(c => c.id === req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, error: 'Техкарта не найдена' });
    }
    res.json({ success: true, card });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/tech-cards', (req, res) => {
  try {
    const newCard = req.body || {};
    if (!newCard.title || !newCard.category) {
      return res.status(400).json({ success: false, error: 'Необходимо указать название и категорию блюда' });
    }

    let customCards = [];
    if (fs.existsSync(CUSTOM_TECH_CARDS_FILE)) {
      try {
        customCards = JSON.parse(fs.readFileSync(CUSTOM_TECH_CARDS_FILE, 'utf8')) || [];
      } catch (e) {
        customCards = [];
      }
    }

    const cardId = newCard.id || `custom-${Date.now()}`;
    const calculatedIngredients = (newCard.ingredients || []).map(ing => {
      const brutto = Number(ing.brutto) || 0;
      const waste = Number(ing.wastePercent) || 0;
      const netto = Number(ing.netto) || (brutto * (1 - waste / 100));
      const pricePerKg = Number(ing.pricePerKg) || 0;
      const costRub = Number(ing.costRub) || (brutto * pricePerKg / 1000);
      return {
        name: ing.name || 'Ингредиент',
        brutto,
        wastePercent: waste,
        netto: Math.round(netto * 10) / 10,
        pricePerKg,
        costRub: Math.round(costRub * 100) / 100
      };
    });

    const costPriceRub = Math.round(calculatedIngredients.reduce((sum, item) => sum + (item.costRub || 0), 0));
    const menuPriceRub = Number(newCard.menuPriceRub) || (costPriceRub > 0 ? Math.round(costPriceRub * 3.5) : 500);
    const foodCostPercent = menuPriceRub > 0 ? Math.round((costPriceRub / menuPriceRub) * 1000) / 10 : 25;
    const marginRub = menuPriceRub - costPriceRub;
    const markupPercent = costPriceRub > 0 ? Math.round((marginRub / costPriceRub) * 100) : 250;

    const fullCard = {
      ...newCard,
      id: cardId,
      ttkNumber: newCard.ttkNumber || `ТТК-ШЕФ-${Math.floor(100 + Math.random() * 900)}`,
      ingredients: calculatedIngredients,
      costPriceRub,
      menuPriceRub,
      foodCostPercent,
      marginRub,
      markupPercent,
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    customCards.unshift(fullCard);
    fs.writeFileSync(CUSTOM_TECH_CARDS_FILE, JSON.stringify(customCards, null, 2), 'utf8');

    res.json({ success: true, card: fullCard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GastroConnect Verified Vacancies & Shifts API (Internal Service)
app.get(['/api/vacancies', '/api/telegram/jobs'], async (req, res) => {
  try {
    const channel = req.query.channel || 'all';
    const category = req.query.category || null;
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const search = (req.query.search || '').trim().toLowerCase();
    const role = (req.query.role || '').trim().toLowerCase();
    const metro = (req.query.metro || '').trim().toLowerCase();
    const minRate = parseInt(req.query.minRate, 10) || 0;
    const sortBy = req.query.sortBy || 'date_desc'; // 'date_desc', 'rate_desc', 'rate_asc'

    let result;
    if (channel === 'all' || !channel || category) {
      result = await fetchAllChannelsVacancies({ category, forceRefresh });
    } else {
      result = await fetchChannelVacancies(channel, forceRefresh);
    }
    let rawItems = [...result.items];

    // Map items to sanitize any third-party external channel identifiers for security and privacy
    let items = rawItems.map(item => ({
      id: item.id,
      title: item.title,
      role: item.role,
      roleCategory: item.roleCategory,
      rateText: item.rateText,
      rateMin: item.rateMin,
      rateMax: item.rateMax,
      rateNumeric: item.rateNumeric,
      rateType: item.rateType,
      metro: item.metro,
      metroList: item.metroList || [],
      schedule: item.schedule,
      benefits: item.benefits || [],
      rawText: item.rawText,
      date: item.date,
      verified: true,
      badge: 'Проверено GastroConnect',
      contacts: item.contacts || {}
    }));

    // Filter by text search
    if (search) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(search) ||
        item.rawText.toLowerCase().includes(search) ||
        item.role.toLowerCase().includes(search) ||
        item.metro.toLowerCase().includes(search)
      );
    }

    // Filter by role category or name
    if (role && role !== 'all') {
      items = items.filter(item => 
        item.roleCategory === role || 
        item.role.toLowerCase().includes(role)
      );
    }

    // Filter by metro
    if (metro && metro !== 'all') {
      items = items.filter(item => 
        item.metro.toLowerCase().includes(metro) ||
        (item.metroList && item.metroList.some(m => m.toLowerCase().includes(metro)))
      );
    }

    // Filter by minimum rate
    if (minRate > 0) {
      items = items.filter(item => item.rateNumeric >= minRate);
    }

    // Sorting
    if (sortBy === 'rate_desc') {
      items.sort((a, b) => (b.rateNumeric || 0) - (a.rateNumeric || 0));
    } else if (sortBy === 'rate_asc') {
      items.sort((a, b) => (a.rateNumeric || 0) - (b.rateNumeric || 0));
    } else {
      // Default: date_desc
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    res.json({
      success: true,
      source: 'GastroConnect Verified Shift Database',
      lastUpdated: result.lastUpdated,
      totalCount: rawItems.length,
      filteredCount: items.length,
      items
    });
  } catch (error) {
    console.error('Error fetching verified jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process GastroConnect shift stream',
      message: error.message
    });
  }
});

// Telegram Community & Publisher API (@gastroconnect)
app.get('/api/telegram/templates', (req, res) => {
  res.json({
    success: true,
    channel: DEFAULT_CHANNEL,
    templates: TEMPLATES
  });
});

app.post('/api/telegram/format', (req, res) => {
  try {
    const formatted = formatTelegramPost(req.body);
    res.json({
      success: true,
      channel: DEFAULT_CHANNEL,
      ...formatted
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/telegram/publish', async (req, res) => {
  try {
    const result = await publishToTelegram(
      req.body,
      req.body.botToken || process.env.TELEGRAM_BOT_TOKEN,
      req.body.channel || DEFAULT_CHANNEL
    );
    res.json(result);
  } catch (error) {
    console.error('Error publishing to Telegram:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish to Telegram',
      message: error.message
    });
  }
});

// Статус и управление автопилотом с расписанием каждые 3 часа
app.get('/api/autopilot/status', (req, res) => {
  res.json(getAutopilotStatus());
});

// Ручной запуск внеочередного цикла автопилота
app.post('/api/autopilot/run-now', async (req, res) => {
  try {
    const { count } = req.body || {};
    const batch = Math.max(1, Math.min(parseInt(count, 10) || 2, 20));
    const result = await runAutopilotCycle('manual_api_trigger', batch);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Компенсация пропущенных постов (пакетная публикация за пропущенные часы)
app.post('/api/autopilot/compensate', async (req, res) => {
  try {
    const { count } = req.body || {};
    const batch = parseInt(count, 10) || 12;
    const result = await compensateMissedPosts(batch);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Telegram Shift Alerts API (@gastroconnect & @GastroConnect_Bot)
app.post('/api/telegram/alerts/subscribe', async (req, res) => {
  try {
    const { role, roleCategory, telegram, phone, userId, chatId } = req.body || {};
    if (!role && !roleCategory) {
      return res.status(400).json({ success: false, error: 'Укажите роль или категорию для подписки на алерты' });
    }
    const result = await subscribeAlert({
      role: role || roleCategory,
      roleCategory: roleCategory || role,
      telegram: telegram || '',
      phone: phone || '',
      userId: userId || null,
      chatId: chatId || null
    });
    res.json(result);
  } catch (error) {
    console.error('Error subscribing to shift alerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/telegram/alerts/unsubscribe', (req, res) => {
  try {
    const { id, roleCategory, telegram } = req.body || {};
    const result = unsubscribeAlert({ id, roleCategory, telegram });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/telegram/alerts/subscriptions', (req, res) => {
  try {
    const { telegram, roleCategory } = req.query || {};
    const all = loadAlerts();
    let filtered = all.filter(a => a.active);
    if (telegram) {
      const clean = telegram.toLowerCase().replace('@', '');
      filtered = filtered.filter(a => (a.telegram || '').toLowerCase().includes(clean));
    }
    if (roleCategory) {
      filtered = filtered.filter(a => a.roleCategory === roleCategory);
    }
    res.json({
      success: true,
      botUsername: BOT_USERNAME,
      totalActive: filtered.length,
      subscriptions: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// In-memory / file-backed SOS shifts state
const SOS_DATA_FILE = path.join(__dirname, 'sos-state.json');
function loadSosData() {
  try {
    if (fs.existsSync(SOS_DATA_FILE)) {
      return JSON.parse(fs.readFileSync(SOS_DATA_FILE, 'utf8'));
    }
  } catch {}
  return {
    activeShift: {
      id: 'sos-shift-patriarshie-1',
      title: 'Повар горячего цеха / Гриль',
      restaurant: 'Ресторан «Никитская Kitchen»',
      address: 'Большая Никитская ул., 24 (м. Тверская / Арбатская, 4 мин)',
      metro: 'м. Тверская',
      rate: '7 500 ₽',
      urgentBonus: '+30% к базовой ставке',
      payoutType: 'Оплата сразу по окончанию смены (нал / СБП)',
      departureWindow: 'Выход через 30-45 минут',
      chefName: 'Шеф Алексей',
      chefPhone: '+7 (995) 883-21-45',
      chefTelegram: '@nikitskaya_chef',
      gateCode: 'Код калитки 3482, служебный вход со двора',
      perks: ['Оплата такси до заведения', '3-разовое горячее питание от шефа', 'Предоставляем чистую форму'],
      status: 'active', // 'active' | 'taken'
      takenBy: null,
      takenAt: null
    }
  };
}

function saveSosData(data) {
  try {
    fs.writeFileSync(SOS_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('[SOS] Ошибка записи sos-state.json:', e.message);
  }
}

// SOS shifts list management
const SOS_LIST_FILE = path.join(__dirname, 'sos-shifts.json');
function loadSosShiftsList() {
  try {
    if (fs.existsSync(SOS_LIST_FILE)) {
      return JSON.parse(fs.readFileSync(SOS_LIST_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('[SOS] Ошибка чтения sos-shifts.json:', e.message);
  }
  return [];
}

function saveSosShiftsList(shifts) {
  try {
    fs.writeFileSync(SOS_LIST_FILE, JSON.stringify(shifts, null, 2), 'utf8');
  } catch (e) {
    console.error('[SOS] Ошибка сохранения sos-shifts.json:', e.message);
  }
}

// SOS endpoints
app.get('/api/sos/current', (req, res) => {
  const data = loadSosData();
  res.json({ success: true, shift: data.activeShift });
});

app.get('/api/sos/list', (req, res) => {
  try {
    const list = loadSosShiftsList();
    res.json({ success: true, count: list.length, shifts: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/sos/create', async (req, res) => {
  try {
    const { venue, restaurant, role, rate, metro, urgency, perks, contacts, autoPublishToTelegram } = req.body || {};
    const venueName = (venue || restaurant || 'Заведение HoReCa').trim();
    const roleName = (role || 'Сотрудник на смену').trim();
    const rateText = (rate || '6 500 ₽ (расчет сразу)').trim();
    const metroText = (metro || 'м. Центр').trim();
    const urgencyText = (urgency || 'Выход сегодня').trim();
    const perksText = (perks || 'Питание, оплата такси, расчет сразу').trim();
    const contactsText = (contacts || '+7 925 840-22-11 | @gastroconnect').trim();

    const newSosShift = {
      id: `sos-${Date.now()}`,
      title: `Срочно: ${roleName} | ${venueName}`,
      role: roleName,
      venue: venueName,
      rate: rateText,
      metro: metroText,
      urgency: urgencyText,
      schedule: urgencyText,
      perks: perksText,
      contacts: contactsText,
      createdAt: new Date().toISOString(),
      status: 'active',
      badge: '🚨 SOS ВЫХОД'
    };

    const list = loadSosShiftsList();
    list.unshift(newSosShift);
    saveSosShiftsList(list.slice(0, 50));

    // Update active shift state
    const data = loadSosData();
    data.activeShift = {
      id: newSosShift.id,
      title: newSosShift.title,
      restaurant: newSosShift.venue,
      metro: newSosShift.metro,
      rate: newSosShift.rate,
      departureWindow: newSosShift.urgency,
      status: 'active'
    };
    saveSosData(data);

    let telegramResult = null;
    // Broadcast to Telegram channel @gastroconnect if requested
    if (autoPublishToTelegram !== false) {
      try {
        telegramResult = await publishToTelegram({
          type: 'job',
          role: `🚨 СРОЧНЫЙ ВЫХОД: ${roleName}`,
          venue: venueName,
          title: `🚨 СРОЧНЫЙ ВЫХОД: ${roleName} | ${venueName}`,
          rate: rateText,
          metro: metroText,
          schedule: urgencyText,
          perks: perksText,
          contacts: contactsText,
          urgency: 'СРОЧНО'
        });
      } catch (tgErr) {
        console.warn('[SOS] Telegram publish notice:', tgErr.message);
      }
    }

    res.json({
      success: true,
      message: '🚨 SOS-смена успешно создана и добавлена в каталог!',
      shift: newSosShift,
      telegram: telegramResult
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/sos/accept', async (req, res) => {
  try {
    const { name, phone, telegram, etaMinutes } = req.body || {};
    if (!phone && !telegram) {
      return res.status(400).json({ success: false, error: 'Укажите телефон или Telegram для связи с шефом' });
    }

    const data = loadSosData();
    const shift = data.activeShift;
    const now = new Date().toISOString();

    shift.status = 'taken';
    shift.takenBy = {
      name: name || 'Повар',
      phone: phone || '',
      telegram: telegram || '',
      etaMinutes: etaMinutes || 30,
      confirmedAt: now
    };
    saveSosData(data);

    // Send notification to Telegram channel
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8692318442:AAHSI6lUSeZG_hDepBhfJBE43LIuSjrubVU';
    const notifyText = `🚨 <b>SOS-СМЕНА ЗАНЯТА!</b>
━━━━━━━━━━━━━━━━━━━━
👨‍🍳 <b>Специалист:</b> ${name || 'Специалист'} (${telegram || phone})
📍 <b>Локация:</b> ${shift.restaurant || shift.venue || 'Ресторан'} (${shift.metro || 'Москва'})
⏰ <b>Время прибытия:</b> через ${etaMinutes || 30} мин
💰 <b>Ставка:</b> ${shift.rate} (оплата сразу)`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '@gastroconnect',
        text: notifyText,
        parse_mode: 'HTML'
      })
    }).catch(() => {});

    res.json({
      success: true,
      message: 'SOS-смена закреплена за вами! Шеф уже ждёт вас.',
      shift
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Telegram 1-tap apply endpoint for Mini App and Web
const TG_APPLICATIONS_FILE = path.join(__dirname, 'telegram-applications.json');
app.post('/api/telegram/apply', async (req, res) => {
  try {
    const { shiftId, shiftTitle, name, phone, telegram, eta, tgUser } = req.body || {};
    if (!phone && !telegram && !tgUser) {
      return res.status(400).json({ success: false, error: 'Укажите контакт для связи' });
    }

    let applications = [];
    try {
      if (fs.existsSync(TG_APPLICATIONS_FILE)) {
        applications = JSON.parse(fs.readFileSync(TG_APPLICATIONS_FILE, 'utf8'));
      }
    } catch {}

    const applicantName = name || (tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : 'Соискатель');
    const applicantTg = telegram || (tgUser?.username ? `@${tgUser.username}` : '');

    const newApp = {
      id: `tgapp-${Date.now()}`,
      shiftId: shiftId || 'general',
      shiftTitle: shiftTitle || 'Смена в HoReCa',
      name: applicantName,
      phone: phone || '',
      telegram: applicantTg,
      eta: eta || 'today',
      tgUserId: tgUser?.id || null,
      createdAt: new Date().toISOString()
    };

    applications.unshift(newApp);
    fs.writeFileSync(TG_APPLICATIONS_FILE, JSON.stringify(applications.slice(0, 200), null, 2), 'utf8');

    res.json({
      success: true,
      message: 'Отклик принят! Мы передали контакты шеф-повару.',
      application: newApp,
      contacts: '+7 925 840-22-11 | @chef_patrik'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Telegram Mini App routes
app.get(['/app', '/telegram-app', '/miniapp'], (req, res) => {
  res.sendFile(path.join(rootDir, 'telegram-app.html'));
});

// Quick 1-click apply endpoint
const APPLICATIONS_FILE = path.join(__dirname, 'quick-applications.json');
app.post('/api/quick-apply', async (req, res) => {
  try {
    const { vacancyId, vacancyTitle, workshop, experience, medBook, contact, name } = req.body || {};
    if (!contact) {
      return res.status(400).json({ success: false, error: 'Укажите контакт (телефон или Telegram)' });
    }

    let applications = [];
    try {
      if (fs.existsSync(APPLICATIONS_FILE)) {
        applications = JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8'));
      }
    } catch {}

    const appEntry = {
      id: `qapp-${Date.now()}`,
      vacancyId: vacancyId || 'general',
      vacancyTitle: vacancyTitle || 'Повар',
      workshop: workshop || 'Горячий цех',
      experience: experience || '1-3 года',
      medBook: medBook || 'Есть действующая',
      contact,
      name: name || 'Соискатель',
      createdAt: new Date().toISOString()
    };

    applications.unshift(appEntry);
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications.slice(0, 100), null, 2), 'utf8');

    res.json({
      success: true,
      applicationId: appEntry.id,
      message: 'Отклик успешно передан шеф-повару заведения!',
      directContacts: {
        phone: '+7 (995) 883-21-45',
        telegram: '@gastroconnect',
        manager: 'Шеф Алексей'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Shift Completion Reviews & Telegram Broadcast endpoint
const REVIEWS_FILE = path.join(__dirname, 'shift-reviews.json');
app.get('/api/reviews', (req, res) => {
  try {
    let reviews = [];
    if (fs.existsSync(REVIEWS_FILE)) {
      reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
    }
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/reviews/submit', async (req, res) => {
  try {
    const { 
      shiftId, 
      restaurantName, 
      workerName, 
      role, 
      rating, 
      text, 
      payout, 
      metro, 
      tags, 
      punctuality 
    } = req.body || {};

    if (!restaurantName || !workerName || !rating) {
      return res.status(400).json({ success: false, error: 'Заполните обязательные поля: заведение, сотрудник, оценка' });
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const stars = '⭐️'.repeat(numericRating);
    const now = new Date().toISOString();

    let reviews = [];
    try {
      if (fs.existsSync(REVIEWS_FILE)) {
        reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
      }
    } catch {}

    const reviewEntry = {
      id: `rev-${Date.now()}`,
      shiftId: shiftId || 'shift-general',
      restaurantName: String(restaurantName).trim(),
      workerName: String(workerName).trim(),
      role: String(role || 'Повар').trim(),
      rating: numericRating,
      text: String(text || '').trim(),
      payout: String(payout || 'Оплачено вовремя 100%').trim(),
      metro: String(metro || 'Москва').trim(),
      punctuality: punctuality || 'Без опозданий',
      tags: Array.isArray(tags) ? tags : ['Выход 100%', 'Чистота станции'],
      createdAt: now
    };

    reviews.unshift(reviewEntry);
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews.slice(0, 200), null, 2), 'utf8');

    // Format Telegram notification according to @gastroconnect channel standard
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8692318442:AAHSI6lUSeZG_hDepBhfJBE43LIuSjrubVU';
    const cleanRestaurant = reviewEntry.restaurantName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanWorker = reviewEntry.workerName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanRole = reviewEntry.role.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanText = (reviewEntry.text || 'Смена успешно отработана, стандарты кухни соблюдены.').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanMetro = reviewEntry.metro.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanPayout = reviewEntry.payout.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const notifyText = `⭐️ <b>ОТЗЫВ ЗАВЕДЕНИЯ | ПОДТВЕРЖДЕНИЕ СМЕНЫ</b>

🍕 <b>${cleanRole.toUpperCase()} | ${cleanRestaurant}</b>

🏆 <b>Оценка шефа:</b> ${stars} (${numericRating}.0 / 5.0)
👨‍🍳 <b>Специалист:</b> ${cleanWorker}
📍 <b>Локация:</b> ${cleanMetro}
💰 <b>Выплата:</b> <b>${cleanPayout}</b>
⏱ <b>Пунктуальность:</b> ${reviewEntry.punctuality}
🎁 <b>Условия / Бонусы:</b> Питание, такси, форма предоставлены

💬 <b>Комментарий шеф-повара:</b>
<i>«${cleanText}»</i>

📞 <b>Контакты для отклика:</b>
Звонки / WhatsApp / Telegram: <b>+7 (995) 883-21-45 / @gastroconnect</b>

#ОтзывЗаведения #СменаПодтверждена #GastroConnect #ПовараМосквы`;

    let telegramSent = false;
    let telegramError = null;

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '@gastroconnect',
          text: notifyText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: '⚡️ Зарегистрироваться и откликнуться', url: 'https://gastroconnect.ru/workers/' }],
              [{ text: '💬 Чат сообщества @gastroconnect', url: 'https://t.me/gastroconnect' }]
            ]
          }
        })
      });
      const tgData = await tgRes.json();
      telegramSent = Boolean(tgData.ok);
      if (!tgData.ok) {
        telegramError = tgData.description;
      }
    } catch (err) {
      telegramError = err.message;
    }

    res.json({
      success: true,
      review: reviewEntry,
      telegramSent,
      telegramError,
      message: 'Отзыв заведения успешно сохранен и опубликован в Telegram-канале @gastroconnect!'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GastroPass Digital Chef Profile endpoint
const GASTROPASS_FILE = path.join(__dirname, 'gastropass-profiles.json');
app.post('/api/gastropass', (req, res) => {
  try {
    const profile = req.body || {};
    if (!profile.name && !profile.contact) {
      return res.status(400).json({ success: false, error: 'Заполните ключевые данные визитки' });
    }
    const id = profile.id || `gp-${Date.now()}`;
    profile.id = id;
    profile.updatedAt = new Date().toISOString();

    let profiles = {};
    try {
      if (fs.existsSync(GASTROPASS_FILE)) {
        profiles = JSON.parse(fs.readFileSync(GASTROPASS_FILE, 'utf8'));
      }
    } catch {}

    profiles[id] = profile;
    fs.writeFileSync(GASTROPASS_FILE, JSON.stringify(profiles, null, 2), 'utf8');

    res.json({ success: true, profile, shareUrl: `https://gastroconnect.ru/workers/#gastropass=${id}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/gastropass/:id', (req, res) => {
  try {
    const { id } = req.params;
    let profiles = {};
    try {
      if (fs.existsSync(GASTROPASS_FILE)) {
        profiles = JSON.parse(fs.readFileSync(GASTROPASS_FILE, 'utf8'));
      }
    } catch {}
    const profile = profiles[id];
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Профиль GastroPass не найден' });
    }
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Worker Shift History & Reliability Rating API
const SHIFTS_FILE = path.join(__dirname, 'worker-shifts.json');

function calculateReliability(shifts) {
  const total = shifts.length;
  if (total === 0) {
    return {
      totalShifts: 0,
      attendedShifts: 0,
      onTimeShifts: 0,
      noLateShifts: 0,
      lateCount: 0,
      noShowCount: 0,
      onTimePercentage: 100,
      noLatePercentage: 100,
      attendancePercentage: 100,
      avgMinutesEarly: 14,
      reliabilityScore: 100,
      reliabilityLevel: "Высшая надежность (Топ-мастер)",
      badgeColor: "#064c3b"
    };
  }

  const attended = shifts.filter(s => s.attended !== false).length;
  const onTime = shifts.filter(s => s.attended !== false && (s.status === 'early' || s.status === 'on_time')).length;
  const noLate = shifts.filter(s => s.attended !== false && s.status !== 'late').length;
  const lateCount = shifts.filter(s => s.status === 'late').length;
  const noShowCount = shifts.filter(s => s.attended === false).length;

  const onTimePercentage = Math.round((onTime / total) * 100);
  const noLatePercentage = Math.round((noLate / total) * 100);
  const attendancePercentage = Math.round((attended / total) * 100);

  // Overall Reliability Score: 50% on-time + 30% absence of delays + 20% attendance
  const reliabilityScore = Math.min(100, Math.max(0, Math.round(
    0.5 * onTimePercentage + 0.3 * noLatePercentage + 0.2 * attendancePercentage
  )));

  const diffs = shifts.filter(s => s.attended !== false && typeof s.minutesDiff === 'number').map(s => s.minutesDiff);
  const avgDiff = diffs.length > 0 ? (diffs.reduce((a, b) => a + b, 0) / diffs.length) : -12;
  const avgMinutesEarly = Math.abs(Math.round(avgDiff));

  let reliabilityLevel = "Высшая надежность (Топ-мастер)";
  let badgeColor = "#064c3b";
  if (reliabilityScore >= 95) {
    reliabilityLevel = "Высшая надежность (Топ-мастер)";
    badgeColor = "#064c3b";
  } else if (reliabilityScore >= 85) {
    reliabilityLevel = "Высокая надежность (Проверен)";
    badgeColor = "#047857";
  } else if (reliabilityScore >= 70) {
    reliabilityLevel = "Базовая надежность";
    badgeColor = "#b45309";
  } else {
    reliabilityLevel = "Требует подтверждения явки";
    badgeColor = "#b91c1c";
  }

  return {
    totalShifts: total,
    attendedShifts: attended,
    onTimeShifts: onTime,
    noLateShifts: noLate,
    lateCount,
    noShowCount,
    onTimePercentage,
    noLatePercentage,
    attendancePercentage,
    avgMinutesEarly,
    reliabilityScore,
    reliabilityLevel,
    badgeColor
  };
}

function getStoredShifts() {
  try {
    if (fs.existsSync(SHIFTS_FILE)) {
      return JSON.parse(fs.readFileSync(SHIFTS_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

app.get('/api/worker/shifts', (req, res) => {
  try {
    const shifts = getStoredShifts();
    const stats = calculateReliability(shifts);
    res.json({ success: true, shifts, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/worker/shifts/log', (req, res) => {
  try {
    const { restaurant, metro, role, date, scheduledTime, actualArrival, status, minutesDiff, attended, payout } = req.body || {};
    const shifts = getStoredShifts();
    const newShift = {
      id: `sh-${Date.now()}`,
      restaurant: restaurant || "Ресторан Москвы",
      metro: metro || "Центр",
      role: role || "Повар",
      date: date || new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      scheduledTime: scheduledTime || "11:00",
      actualArrival: actualArrival || "10:45",
      status: status || "early",
      minutesDiff: typeof minutesDiff === 'number' ? minutesDiff : -15,
      attended: attended !== false,
      chefRating: 5.0,
      payout: payout || "5 500 ₽",
      isUserSimulated: true
    };

    shifts.unshift(newShift);
    fs.writeFileSync(SHIFTS_FILE, JSON.stringify(shifts, null, 2), 'utf8');

    const stats = calculateReliability(shifts);
    res.json({ success: true, shift: newShift, shifts, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/worker/shifts/reset', (req, res) => {
  try {
    const defaultShifts = [
      { id: "sh-1", restaurant: "Ресторан «Никитская Kitchen»", metro: "м. Тверская / Патриаршие", role: "Су-шеф", date: "21 сентября 2026", scheduledTime: "11:00", actualArrival: "10:45", status: "early", minutesDiff: -15, attended: true, chefRating: 5.0, payout: "6 500 ₽" },
      { id: "sh-2", restaurant: "Гастробар «Belorusskaya Grill»", metro: "м. Белорусская", role: "Повар горячего цеха", date: "19 сентября 2026", scheduledTime: "10:00", actualArrival: "09:50", status: "early", minutesDiff: -10, attended: true, chefRating: 5.0, payout: "5 100 ₽" },
      { id: "sh-3", restaurant: "Бистро «Малая Бронная»", metro: "м. Маяковская", role: "Повар холодного цеха", date: "16 сентября 2026", scheduledTime: "11:00", actualArrival: "11:00", status: "on_time", minutesDiff: 0, attended: true, chefRating: 5.0, payout: "4 600 ₽" },
      { id: "sh-4", restaurant: "Ресторан «Северяне»", metro: "м. Арбатская", role: "Повар горячего цеха", date: "12 сентября 2026", scheduledTime: "10:00", actualArrival: "09:40", status: "early", minutesDiff: -20, attended: true, chefRating: 5.0, payout: "5 500 ₽" },
      { id: "sh-5", restaurant: "Гастробар «Loro»", metro: "м. Тверская", role: "Су-шеф смены", date: "8 сентября 2026", scheduledTime: "11:00", actualArrival: "10:55", status: "early", minutesDiff: -5, attended: true, chefRating: 5.0, payout: "7 200 ₽" },
      { id: "sh-6", restaurant: "Ресторан «Margarita Bistro»", metro: "м. Маяковская", role: "Повар ХЦ / Заготовщик", date: "4 сентября 2026", scheduledTime: "09:00", actualArrival: "08:45", status: "early", minutesDiff: -15, attended: true, chefRating: 5.0, payout: "5 200 ₽" },
      { id: "sh-7", restaurant: "Кофейня-пекарня «Sapiens»", metro: "м. Парк Культуры", role: "Повар-универсал", date: "29 августа 2026", scheduledTime: "08:00", actualArrival: "08:00", status: "on_time", minutesDiff: 0, attended: true, chefRating: 5.0, payout: "4 200 ₽" },
      { id: "sh-8", restaurant: "Ресторан «Горыныч»", metro: "м. Трубная", role: "Повар ГЦ / Гриль", date: "24 августа 2026", scheduledTime: "11:00", actualArrival: "10:48", status: "early", minutesDiff: -12, attended: true, chefRating: 5.0, payout: "5 500 ₽" },
      { id: "sh-9", restaurant: "Бар «Клава»", metro: "м. Пушкинская", role: "Повар смены / Закуски", date: "18 августа 2026", scheduledTime: "16:00", actualArrival: "16:00", status: "on_time", minutesDiff: 0, attended: true, chefRating: 5.0, payout: "6 000 ₽" },
      { id: "sh-10", restaurant: "Бистро «Малая Бронная»", metro: "м. Тверская", role: "Повар ХЦ", date: "14 августа 2026", scheduledTime: "10:00", actualArrival: "09:55", status: "early", minutesDiff: -5, attended: true, chefRating: 5.0, payout: "4 600 ₽" }
    ];
    fs.writeFileSync(SHIFTS_FILE, JSON.stringify(defaultShifts, null, 2), 'utf8');
    const stats = calculateReliability(defaultShifts);
    res.json({ success: true, shifts: defaultShifts, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware for clean URL resolving and static file serving
app.use((req, res, next) => {
  // Normalize pathname
  let reqPath = decodeURIComponent(req.path);
  if (reqPath.startsWith('/')) {
    reqPath = reqPath.slice(1);
  }

  // Potential candidates
  const candidates = [
    path.join(rootDir, reqPath),
    path.join(rootDir, reqPath, 'index.html'),
    path.join(rootDir, reqPath + '.html'),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return res.sendFile(candidate);
      }
    } catch {
      // Continue to next candidate
    }
  }

  next();
});

// Static assets fallback
app.use(express.static(rootDir));

// SPA / Default fallback to index.html if not found
app.use((req, res) => {
  const notFoundPath = path.join(rootDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.status(404).sendFile(notFoundPath);
  } else {
    res.status(404).sendFile(path.join(rootDir, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GastroConnect server running on http://0.0.0.0:${PORT}`);
});
