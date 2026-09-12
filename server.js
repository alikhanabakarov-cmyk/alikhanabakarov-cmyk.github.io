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
const { VERIFIED_SUPPLIERS, getSuppliers } = require('./suppliers-data');

const app = express();
const PORT = 3000;
const rootDir = __dirname;

app.use(express.json());

// Start the 4-times daily automated scraper scheduler (09:00, 13:00, 17:00, 22:00 MSK)
startSchedulerTimer(async (scrapeResult) => {
  if (scrapeResult && scrapeResult.items && scrapeResult.items.length > 0) {
    const topShift = scrapeResult.items[0];
    console.log(`[Auto-Publisher] Auto-broadcasting top verified shift to Telegram: ${topShift.title}`);
    try {
      await publishToTelegram({
        type: 'job',
        role: topShift.title,
        rate: `${topShift.rate} â½ / ÑÐ¼ÐµÐ½Ð°`,
        metro: topShift.metro || 'ÐÐ¾ÑÐºÐ²Ð°',
        schedule: topShift.schedule || 'Ð¡Ð¼ÐµÐ½Ð° 12 ÑÐ°ÑÐ¾Ð²',
        urgency: 'ÐÐ¾ÑÑÑÐ°Ñ ÑÐ¼ÐµÐ½Ð° Ð½Ð° ÑÐµÐ³Ð¾Ð´Ð½Ñ',
        perks: 'ÐÐ¸ÑÐ°Ð½Ð¸Ðµ, ÑÐ¾ÑÐ¼Ð°, ÐµÐ¶ÐµÐ´Ð½ÐµÐ²Ð½ÑÐµ Ð²ÑÐ¿Ð»Ð°ÑÑ',
        tasks: topShift.description || 'Ð Ð°Ð±Ð¾ÑÐ° Ð½Ð° Ð¿Ð¾Ð·Ð¸ÑÐ¸Ð¸ Ð¿Ð¾ Ð¢Ð¢Ð Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ',
        requirements: 'ÐÐ¿ÑÑ ÑÐ°Ð±Ð¾ÑÑ, Ð¼ÐµÐ´ÐºÐ½Ð¸Ð¶ÐºÐ° Ð Ð¤',
        contacts: topShift.contacts || ''
      });
    } catch (e) {
      console.error('[Auto-Publisher] Error auto-publishing shift:', e.message);
    }
  }
});

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
      badge: 'ÐÑÐ¾Ð²ÐµÑÐµÐ½Ð¾ GastroConnect',
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
