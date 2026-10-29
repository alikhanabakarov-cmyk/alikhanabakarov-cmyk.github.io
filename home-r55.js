(function () {
  const PUBLIC_SUBMISSIONS_KEY = "gc_public_submissions";
  const SITE_SETTINGS_KEY = "gc_site_settings";
  const SITE_SETTINGS_ROW = "public_site";
  const SITE_ASSETS_BUCKET = "site-assets";
  const SUPABASE_CONFIG_URL = "supabase.js?v=1002";

  const roleLabels = {
    worker: "Работник",
    restaurant: "Заведение",
    supplier: "Поставщик",
    callback: "Заказ звонка",
    feedback: "Обратная связь",
    telegram_bot: "Telegram-уведомления",
  };

  const defaultSiteSettings = {
    logo: "assets/logo-full.png",
    nav: {
      workers: "Сотрудникам",
      restaurants: "Заведениям",
      suppliers: "Поставщикам",
      contacts: "Контакты",
      workflow: "Как работает",
      login: "Войти / регистрация",
      home: "На главную",
      request: "Оставить заявку",
    },
    home: {
      hero: "assets/hero-home.webp",
      eyebrow: "Российская платформа гибкой занятости для HoReCa",
      title: "Смены, персонал и поставки без хаоса в чатах",
      lead:
        "GastroConnect помогает заведениям быстро закрывать смены, работникам находить подработку, а поставщикам получать реальные запросы от ресторанов и кафе.",
      ctaPrimary: "Запустить подбор",
      ctaSecondary: "Найти смену",
      benefit1: "Смены за 24 часа",
      benefit2: "Профили и отклики",
      benefit3: "Поставщики рядом",
      dashboard1Label: "Сегодня",
      dashboard1Value: "18 смен",
      dashboard1Text: "повара, официанты, бариста",
      dashboard2Label: "Заполнено",
      dashboard2Value: "82%",
      dashboard2Text: "по активным заявкам",
      dashboard3Label: "Поставки",
      dashboard3Value: "47 офферов",
      dashboard3Text: "продукты, клининг, оборудование",
    },
    workers: {
      hero: "assets/hero-workers.webp",
      eyebrow: "Сотрудникам HoReCa",
      title: "Смены в ресторанах, кафе и доставке рядом",
      lead:
        "Заполните профиль, смотрите открытые смены, откликайтесь на задания и принимайте приглашения от заведений.",
      ctaPrimary: "Создать анкету",
      ctaSecondary: "Войти в кабинет",
      benefit1: "Смены рядом",
      benefit2: "Отклики на задания",
      benefit3: "Приглашения от заведений",
    },
    restaurants: {
      hero: "assets/hero-restaurants.webp",
      eyebrow: "Заведениям HoReCa",
      title: "Закрывайте смены без бесконечных чатов",
      lead:
        "Публикуйте смены, получайте отклики, смотрите анкеты работников и отправляйте прямые приглашения.",
      ctaPrimary: "Найти персонал",
      ctaSecondary: "Оставить заявку",
      benefit1: "Публикация смен",
      benefit2: "Отклики работников",
      benefit3: "База анкет",
    },
    suppliers: {
      hero: "assets/hero-suppliers.webp",
      eyebrow: "Поставщикам HoReCa",
      title: "Поставщики для HoReCa с входящими заявками",
      lead:
        "Публикуйте предложения по товарам и услугам, получайте запросы заведений и ведите коммуникацию в кабинете.",
      ctaPrimary: "Стать поставщиком",
      ctaSecondary: "Войти",
      benefit1: "Офферы поставщиков",
      benefit2: "Заявки заведений",
      benefit3: "Фильтр по категориям",
    },
    auth: {
      hero: "assets/hero-home.webp",
      eyebrow: "Единый вход GastroConnect",
      title: "Вход и регистрация",
      lead: "Выберите роль и создайте аккаунт. После входа вы попадете в кабинет.",
    },
    cabinet: {
      hero: "assets/hero-home.webp",
      eyebrow: "Рабочее пространство",
      title: "Кабинет GastroConnect",
      lead:
        "Профили, смены, приглашения и заявки собраны в одном месте для каждой роли.",
    },
    admin: {
      hero: "assets/hero-home.webp",
      eyebrow: "Управление сайтом",
      title: "Панель управления GastroConnect",
      lead:
        "Панель для заявок, изображений, логотипа и главных надписей сайта.",
    },
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeSettings(base, override) {
    const result = clone(base);
    Object.entries(override || {}).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = mergeSettings(result[key] || {}, value);
      } else if (value) {
        result[key] = value;
      }
    });
    return result;
  }

  function getPath(object, path) {
    return path.split(".").reduce((current, key) => current?.[key], object);
  }

  function setPath(object, path, value) {
    const keys = path.split(".");
    let cursor = object;
    keys.slice(0, -1).forEach((key) => {
      cursor[key] = cursor[key] || {};
      cursor = cursor[key];
    });
    cursor[keys[keys.length - 1]] = value;
  }

  function readJsonStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function readSiteSettings() {
    return mergeSettings(defaultSiteSettings, readJsonStorage(SITE_SETTINGS_KEY, {}));
  }

  function writeSiteSettings(settings) {
    writeJsonStorage(SITE_SETTINGS_KEY, settings);
  }

  function isSafeImageSrc(src) {
    const value = String(src || "").trim();
    if (!value) return false;
    const lower = value.toLowerCase();
    if (
      lower.startsWith("javascript:") ||
      lower.startsWith("data:") ||
      lower.includes("raw.githubusercontent.com")
    ) {
      return false;
    }
    if (lower.startsWith("assets/")) return true;
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }

  function safeImageSrc(src, fallback) {
    return isSafeImageSrc(src) ? String(src).trim() : fallback;
  }

  function setImageWithFallback(image, src, fallback) {
    const fallbackSrc = fallback || src;
    const nextSrc = safeImageSrc(src, fallbackSrc);
    if (!image || !nextSrc) return;
    if (fallbackSrc) image.dataset.fallbackSrc = fallbackSrc;
    image.onerror = () => {
      const safeSrc = image.dataset.fallbackSrc;
      if (safeSrc && image.getAttribute("src") !== safeSrc) image.src = safeSrc;
    };
    if (image.getAttribute("src") !== nextSrc) image.src = nextSrc;
  }

  function applySiteSettings(settings = readSiteSettings()) {
    document.querySelectorAll("[data-site-logo]").forEach((image) => {
      setImageWithFallback(image, settings.logo, defaultSiteSettings.logo);
    });
    document.querySelectorAll("[data-site-image]").forEach((image) => {
      const src = getPath(settings, image.dataset.siteImage);
      const fallback = getPath(defaultSiteSettings, image.dataset.siteImage);
      setImageWithFallback(image, src, fallback);
    });
    document.querySelectorAll("[data-site-setting]").forEach((element) => {
      const text = getPath(settings, element.dataset.siteSetting);
      if (text) element.textContent = text;
    });
  }

  async function getSupabaseRestConfig() {
    if (window.__gcSupabaseRestConfig) return window.__gcSupabaseRestConfig;
    const client = window.supabaseClient;
    if (client?.supabaseUrl && client?.supabaseKey) {
      window.__gcSupabaseRestConfig = {
        url: client.supabaseUrl,
        key: client.supabaseKey,
      };
      return window.__gcSupabaseRestConfig;
    }
    const config = window.__gcSupabaseConfig;
    if (config?.url && config?.key) {
      window.__gcSupabaseRestConfig = config;
      return config;
    }
    const response = await fetch(SUPABASE_CONFIG_URL, { cache: "force-cache" });
    if (!response.ok) throw new Error("supabase.js не загрузился");
    const source = await response.text();
    const url = source.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    const key = source.match(/SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    if (!url || !key) throw new Error("Supabase config не найден");
    window.__gcSupabaseRestConfig = { url, key };
    return window.__gcSupabaseRestConfig;
  }

  async function supabaseRest(table, options = {}) {
    const { url, key } = await getSupabaseRestConfig();
    const response = await fetch(`${url}/rest/v1/${table}${options.query || ""}`, {
      method: options.method || "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: options.prefer || "",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) throw new Error(`${table}: ${response.status}`);
    if (response.status === 204) return null;
    return response.json();
  }

  const marketFallback = {
    shifts: [
      {
        type: "shift",
        title: "Повар горячего цеха",
        subtitle: "Ресторан · Москва, ЦАО · сегодня 17:00-23:00",
        city: "Москва",
        district: "ЦАО",
        query: "повар горячий цех ресторан",
        rate: 4800,
        meta: ["4 800 ₽", "Сегодня", "Открыта"],
      },
      {
        type: "shift",
        title: "Бариста на утро",
        subtitle: "Кофейня · Арбат · завтра 08:00-14:00",
        city: "Москва",
        district: "Арбат",
        query: "бариста кофейня",
        rate: 2700,
        meta: ["2 700 ₽", "Завтра", "3 отклика"],
      },
      {
        type: "shift",
        title: "Официант на банкет",
        subtitle: "Кафе · центр · вечерняя подработка",
        city: "Москва",
        district: "центр",
        query: "официант банкет подработка",
        rate: 3500,
        meta: ["3 500 ₽", "Вечер", "Срочно"],
      },
    ],
    workers: [
      {
        type: "worker",
        title: "Повар универсал",
        subtitle: "Опыт 3 года · готов к сменам в центре",
        city: "Москва",
        district: "ЦАО",
        query: "повар универсал горячий холодный цех",
        rate: 4500,
        meta: ["от 4 500 ₽", "3 года", "Telegram"],
      },
      {
        type: "worker",
        title: "Официант / хостес",
        subtitle: "Банкеты, кафе, рестораны · вечерний график",
        city: "Москва",
        district: "Арбат",
        query: "официант хостес ресторан кафе",
        rate: 3000,
        meta: ["от 3 000 ₽", "вечер", "готова сегодня"],
      },
      {
        type: "worker",
        title: "Бариста",
        subtitle: "Кофейни, завтраки, касса · гибкий график",
        city: "Москва",
        district: "Пресня",
        query: "бариста кофейня касса",
        rate: 2800,
        meta: ["от 2 800 ₽", "утро", "опыт"],
      },
    ],
    suppliers: [
      {
        type: "supplier",
        title: "Кофе для кофеен",
        subtitle: "Зерно, помол, регулярная доставка по Москве",
        city: "Москва",
        district: "доставка",
        query: "кофе зерно кофейня поставщик",
        rate: 1200,
        meta: ["от 1 200 ₽/кг", "от 10 кг", "доставка"],
      },
      {
        type: "supplier",
        title: "Сыр и молочная продукция",
        subtitle: "Для пиццерий, ресторанов и dark kitchen",
        city: "Москва",
        district: "склад",
        query: "сыр молочная продукция моцарелла",
        rate: 550,
        meta: ["от 550 ₽", "опт", "HoReCa"],
      },
      {
        type: "supplier",
        title: "Клининг после смены",
        subtitle: "Уборка кухонь, залов и производственных помещений",
        city: "Москва",
        district: "выезд",
        query: "клининг уборка кухня ресторан",
        rate: 3000,
        meta: ["от 3 000 ₽", "ночь", "выезд"],
      },
    ],
  };

  const marketCta = {
    shifts: { text: "Найти смену", href: "auth.html?role=worker" },
    workers: { text: "Найти персонал", href: "auth.html?role=restaurant" },
    suppliers: { text: "Стать поставщиком", href: "auth.html?role=supplier" },
  };

  const marketCardAction = {
    shifts: { text: "Откликнуться", href: "auth.html?role=worker" },
    workers: { text: "Пригласить", href: "auth.html?role=restaurant" },
    suppliers: { text: "Отправить заявку", href: "auth.html?role=restaurant" },
  };

  function normalizeMarketText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function marketNumber(value) {
    const number = Number(String(value || "").replace(",", ".").replace(/[^\d.]/g, ""));
    return Number.isFinite(number) ? number : 0;
  }

  function compactList(value) {
    if (Array.isArray(value)) return value.filter(Boolean).join(", ");
    return value || "";
  }

  function mapShiftToMarket(row) {
    return {
      type: "shift",
      title: row.title || row.profession || "Смена HoReCa",
      subtitle: [row.city, row.district, row.date_from, [row.time_from, row.time_to].filter(Boolean).join("-")]
        .filter(Boolean)
        .join(" · "),
      city: row.city || "",
      district: [row.district, row.address].filter(Boolean).join(" "),
      query: [row.title, row.profession, row.requirements].filter(Boolean).join(" "),
      rate: marketNumber(row.rate),
      meta: [row.rate ? `${row.rate} ₽` : "ставка по договоренности", row.status || "open", row.payment_type || "смена"],
    };
  }

  function mapWorkerToMarket(row) {
    const professions = compactList(row.professions);
    return {
      type: "worker",
      title: professions || "Сотрудник HoReCa",
      subtitle: [row.experience, row.available_time, row.about].filter(Boolean).join(" · "),
      city: row.city || row.profile?.city || "",
      district: row.district || row.profile?.district || "",
      query: [professions, row.experience, row.about].filter(Boolean).join(" "),
      rate: marketNumber(row.min_rate),
      meta: [row.min_rate ? `от ${row.min_rate} ₽` : "ставка не указана", row.can_travel ? "выезд" : "рядом", row.telegram ? "Telegram" : "профиль"],
    };
  }

  function mapSupplierToMarket(row) {
    return {
      type: "supplier",
      title: row.title || row.product_name || row.category || "Поставщик HoReCa",
      subtitle: [row.description, compactList(row.delivery_cities)].filter(Boolean).join(" · "),
      city: compactList(row.delivery_cities) || row.supplier?.city || "",
      district: row.min_order || "",
      query: [row.title, row.product_name, row.category, row.description].filter(Boolean).join(" "),
      rate: marketNumber(row.price),
      meta: [row.price ? `${row.price} ${row.unit || "₽"}` : "цена по запросу", row.category || "HoReCa", row.min_order || "оффер"],
    };
  }

  async function loadMarketRows(tab) {
    try {
      if (tab === "shifts") {
        const rows = await supabaseRest("shift_posts", {
          query: "?status=eq.open&select=title,profession,city,district,address,date_from,time_from,time_to,rate,payment_type,requirements,status&order=created_at.desc&limit=9",
        });
        return rows?.map(mapShiftToMarket) || marketFallback.shifts;
      }
      if (tab === "workers") {
        const rows = await supabaseRest("worker_profiles", {
          query: "?select=professions,experience,available_time,min_rate,can_travel,city,district,telegram,about&order=updated_at.desc&limit=9",
        });
        return rows?.map(mapWorkerToMarket) || marketFallback.workers;
      }
      const rows = await supabaseRest("supplier_offers", {
        query: "?status=eq.active&select=title,product_name,category,price,unit,min_order,delivery_cities,description&order=created_at.desc&limit=9",
      });
      return rows?.map(mapSupplierToMarket) || marketFallback.suppliers;
    } catch {
      return marketFallback[tab] || [];
    }
  }

  function marketMatches(item, filters) {
    const city = normalizeMarketText(item.city);
    const district = normalizeMarketText(item.district);
    const query = normalizeMarketText([item.title, item.subtitle, item.query].join(" "));
    const minRate = marketNumber(filters.rate);
    return (
      (!filters.city || city.includes(filters.city)) &&
      (!filters.district || district.includes(filters.district) || query.includes(filters.district)) &&
      (!filters.query || query.includes(filters.query)) &&
      (!minRate || marketNumber(item.rate) >= minRate)
    );
  }

  function renderMarketCards(state) {
    const results = document.getElementById("marketResults");
    const status = document.getElementById("marketStatus");
    if (!results || !status) return;
    const action = marketCardAction[state.tab] || marketCardAction.shifts;
    const filters = {
      city: normalizeMarketText(document.getElementById("marketCity")?.value),
      district: normalizeMarketText(document.getElementById("marketDistrict")?.value),
      query: normalizeMarketText(document.getElementById("marketQuery")?.value),
      rate: document.getElementById("marketRate")?.value || "",
    };
    const rows = (state.rows[state.tab] || []).filter((item) => marketMatches(item, filters));
    status.textContent = rows.length
      ? `Найдено: ${rows.length}. Данные обновляются из кабинетов и Supabase, если доступ разрешен.`
      : "Подходящих карточек не найдено. Попробуйте убрать часть фильтров.";
    if (!rows.length) {
      results.innerHTML = '<div class="platform-empty">Пока нет карточек под эти фильтры. В кабинете можно создать смену, анкету или оффер.</div>';
      return;
    }
    results.innerHTML = rows
      .map(
        (item) => `
          <article class="platform-card">
            <div class="platform-card-kicker">
              <span>${escapeHtml(item.type === "shift" ? "смена" : item.type === "worker" ? "анкета" : "оффер")}</span>
              <span>${escapeHtml(item.city || "HoReCa")}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.subtitle || "Подробности доступны после регистрации.")}</p>
            <div class="platform-card-meta">
              ${(item.meta || []).slice(0, 4).map((meta) => `<span>${escapeHtml(meta)}</span>`).join("")}
            </div>
            <a class="platform-card-action" href="${escapeHtml(action.href)}">${escapeHtml(action.text)}</a>
          </article>
        `,
      )
      .join("");
  }

  function updateMarketCta(tab) {
    const link = document.getElementById("marketPrimaryCta");
    if (!link) return;
    const next = marketCta[tab] || marketCta.shifts;
    link.textContent = next.text;
    link.href = next.href;
  }

  function initPlatformSearch() {
    const root = document.getElementById("marketResults");
    if (!root) return;
    const state = { tab: "shifts", rows: { ...marketFallback } };
    const allowedTabs = ["shifts", "workers", "suppliers"];
    const initialTab = new URLSearchParams(window.location.search).get("tab");
    const load = async (tab) => {
      if (!allowedTabs.includes(tab)) tab = "shifts";
      state.tab = tab;
      document.querySelectorAll("[data-market-tab]").forEach((item) => item.classList.toggle("active", item.dataset.marketTab === tab));
      updateMarketCta(tab);
      renderMarketCards(state);
      state.rows[tab] = await loadMarketRows(tab);
      renderMarketCards(state);
    };
    document.querySelectorAll("[data-market-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.marketTab || "shifts";
        if (window.location.pathname.endsWith("marketplace.html")) {
          const nextUrl = new URL(window.location.href);
          nextUrl.searchParams.set("tab", tab);
          history.replaceState(null, "", nextUrl.toString());
        }
        load(tab);
      });
    });
    ["marketCity", "marketDistrict", "marketQuery", "marketRate"].forEach((id) => {
      document.getElementById(id)?.addEventListener("input", () => renderMarketCards(state));
    });
    load(allowedTabs.includes(initialTab) ? initialTab : "shifts");
  }

  async function fetchRemoteSiteSettings() {
    const rows = await supabaseRest(
      "site_settings",
      { query: `?setting_key=eq.${encodeURIComponent(SITE_SETTINGS_ROW)}&select=settings&limit=1` },
    );
    return rows?.[0]?.settings || null;
  }

  async function loadRemoteSiteSettings() {
    try {
      const remote = await fetchRemoteSiteSettings();
      if (!remote) return;
      const merged = mergeSettings(defaultSiteSettings, remote);
      writeSiteSettings(merged);
      applySiteSettings(merged);
      fillSiteSettingsForm(merged);
    } catch {
      // The public site must keep working even if Supabase is temporarily unavailable.
    }
  }

  async function saveSettingsToSupabase(settings) {
    const client = window.supabaseClient;
    if (!client) return { saved: false, reason: "Supabase Auth не подключен." };
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) {
      return { saved: false, reason: "Войдите как admin, чтобы сохранить глобально." };
    }
    const { error } = await client.from("site_settings").upsert(
      {
        setting_key: SITE_SETTINGS_ROW,
        settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "setting_key" },
    );
    return error ? { saved: false, reason: error.message } : { saved: true };
  }

  function safeAssetName(fileName) {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "asset";
  }

  async function uploadSiteAsset(file, target) {
    const client = window.supabaseClient;
    if (!client) throw new Error("Supabase Auth не подключен.");
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) throw new Error("Войдите как admin, чтобы загрузить файл.");
    const folder = target.replaceAll(".", "-");
    const filePath = `${folder}/${Date.now()}-${safeAssetName(file.name)}`;
    const { error } = await client.storage.from(SITE_ASSETS_BUCKET).upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = client.storage.from(SITE_ASSETS_BUCKET).getPublicUrl(filePath);
    if (!data?.publicUrl) throw new Error("Supabase не вернул публичный URL.");
    return data.publicUrl;
  }

  function fillSiteSettingsForm(settings = readSiteSettings()) {
    const form = document.getElementById("siteSettingsForm");
    if (!form) return;
    [...form.elements].forEach((field) => {
      if (!field.name) return;
      field.value = field.name === "logo" ? settings.logo : getPath(settings, field.name) || "";
    });
    updateSiteSettingsJson(settings);
  }

  function updateSiteSettingsJson(settings = readSiteSettings()) {
    const jsonField = document.getElementById("siteSettingsJson");
    if (!jsonField || jsonField.dataset.dirty === "true") return;
    jsonField.value = JSON.stringify(settings, null, 2);
  }

  function collectSiteSettingsFromForm(form) {
    const next = readSiteSettings();
    [...form.elements].forEach((field) => {
      if (!field.name) return;
      const fieldValue = field.value.trim();
      if (field.name === "logo") {
        next.logo = fieldValue || defaultSiteSettings.logo;
      } else {
        setPath(next, field.name, fieldValue || getPath(defaultSiteSettings, field.name));
      }
    });
    const jsonField = document.getElementById("siteSettingsJson");
    if (jsonField?.dataset.dirty === "true" && jsonField.value.trim()) {
      return mergeSettings(next, JSON.parse(jsonField.value));
    }
    return next;
  }

  function initSiteSettingsForm() {
    const form = document.getElementById("siteSettingsForm");
    if (!form) return;
    const message = document.getElementById("siteSettingsMessage");
    fillSiteSettingsForm();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      let next;
      try {
        next = collectSiteSettingsFromForm(form);
      } catch (error) {
        message.textContent = `JSON настроек не сохранен: ${error.message}`;
        return;
      }
      writeSiteSettings(next);
      applySiteSettings(next);
      const jsonField = document.getElementById("siteSettingsJson");
      if (jsonField) jsonField.dataset.dirty = "false";
      updateSiteSettingsJson(next);
      const remote = await saveSettingsToSupabase(next);
      message.textContent = remote.saved
        ? "Настройки сохранены глобально в Supabase."
        : `Настройки сохранены локально. Глобально: ${remote.reason}`;
    });

    document.getElementById("resetSiteSettings")?.addEventListener("click", async () => {
      writeSiteSettings(defaultSiteSettings);
      applySiteSettings(defaultSiteSettings);
      fillSiteSettingsForm(defaultSiteSettings);
      const remote = await saveSettingsToSupabase(defaultSiteSettings);
      message.textContent = remote.saved ? "Настройки сброшены глобально." : "Настройки сброшены локально.";
    });

    document.getElementById("refreshSiteSettingsJson")?.addEventListener("click", () => {
      const jsonField = document.getElementById("siteSettingsJson");
      if (jsonField) jsonField.dataset.dirty = "false";
      updateSiteSettingsJson(collectSiteSettingsFromForm(form));
      message.textContent = "JSON обновлен.";
    });

    document.getElementById("downloadSiteSettingsJson")?.addEventListener("click", () => {
      download("gastroconnect-site-settings.json", JSON.stringify(collectSiteSettingsFromForm(form), null, 2), "application/json;charset=utf-8");
    });

    document.getElementById("siteSettingsJson")?.addEventListener("input", (event) => {
      event.currentTarget.dataset.dirty = "true";
    });

    form.querySelectorAll("[data-upload-target]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;
        const target = input.dataset.uploadTarget;
        const targetField = form.elements[target];
        try {
          message.textContent = "Загружаем файл...";
          const publicUrl = await uploadSiteAsset(file, target);
          if (targetField) targetField.value = publicUrl;
          message.textContent = "Файл загружен. Нажмите «Сохранить настройки».";
        } catch (error) {
          message.textContent = `Загрузка не удалась: ${error.message}`;
        } finally {
          input.value = "";
        }
      });
    });
  }

  function readRows() {
    return readJsonStorage(PUBLIC_SUBMISSIONS_KEY, []);
  }

  function writeRows(rows) {
    writeJsonStorage(PUBLIC_SUBMISSIONS_KEY, rows);
  }

  function makeId() {
    if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return `gc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getFormTitle(type, data) {
    if (type === "worker") return data.name || "Работник";
    if (type === "restaurant") return data.business_name || "Заведение";
    if (type === "supplier") return data.company_name || "Поставщик";
    if (type === "callback") return `Заказ звонка: ${data.name || data.phone || "контакт"}`;
    if (type === "feedback") return `Обратная связь: ${data.name || data.phone || data.email || "контакт"}`;
    if (type === "telegram_bot") return `Telegram: ${data.telegram || data.name || "подключение"}`;
    return data.name || data.company || "Заявка";
  }

  async function saveSubmission(type, data) {
    const row = {
      id: makeId(),
      type,
      title: getFormTitle(type, data),
      phone: data.phone || "",
      telegram: data.telegram || "",
      city: data.city || "Москва и Московская область",
      data,
      created_at: new Date().toISOString(),
    };
    const rows = readRows();
    rows.unshift(row);
    writeRows(rows);
    try {
      await supabaseRest("public_submissions", {
        method: "POST",
        prefer: "return=minimal",
        body: row,
      });
      row.remote_saved = true;
      writeRows(rows);
    } catch {
      row.remote_saved = false;
      writeRows(rows);
    }
    return row;
  }

  async function fetchRemoteSubmissions() {
    try {
      return await supabaseRest("public_submissions", {
        query: "?select=*&order=created_at.desc&limit=300",
      });
    } catch {
      return [];
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("ru-RU");
  }

  function roleText(type) {
    return roleLabels[type] || type || "-";
  }

  function download(name, text, type) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([text], { type }));
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function initPublicForms() {
    document.querySelectorAll("form[data-form-type]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const type = form.dataset.formType;
        const data = Object.fromEntries(new FormData(form).entries());
        const button = form.querySelector("button[type='submit']");
        const box = form.querySelector(".success");
        if (button) button.disabled = true;
        if (box) {
          box.textContent = "Отправляем...";
          box.style.display = "block";
        }
        const row = await saveSubmission(type, data);
        if (box) {
          const messages = {
            callback: "Заявка на звонок отправлена. Мы свяжемся с вами.",
            feedback: "Обращение отправлено. Ответ придет на указанные контакты.",
            telegram_bot: "Заявка на Telegram-уведомления отправлена. Подключим и напишем вам.",
          };
          box.textContent = messages[type] || "Заявка сохранена. Мы свяжемся с вами.";
          if (!row.remote_saved) box.textContent += " Если интернет/база недоступны, копия сохранена локально.";
        }
        form.reset();
        if (button) button.disabled = false;
      });
    });
  }

  function initAuthPage() {
    if (window.__gcUseDedicatedAuth) return;

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("role");
    const message = document.getElementById("authMessage");
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const authTitle = document.getElementById("authTitle");
    const authLead = document.getElementById("authLead");
    if (!emailInput || !passwordInput || !roleInput || !message) return;

    const roleCopy = {
      worker: {
        title: "Регистрация работника",
        lead: "Создайте аккаунт работника, заполните профиль и откликайтесь на смены в кабинете.",
      },
      restaurant: {
        title: "Регистрация заведения",
        lead: "Создайте аккаунт заведения, публикуйте смены, смотрите работников и заявки поставщикам.",
      },
      supplier: {
        title: "Регистрация поставщика",
        lead: "Создайте аккаунт поставщика, публикуйте предложения и принимайте заявки от заведений.",
      },
    };
    const normalizeAuthRole = (role) =>
      ["worker", "restaurant", "supplier"].includes(role) ? role : "worker";

    function readableAuthError(error) {
      const code = String(error?.code || error?.error_code || "");
      const errorMessage = String(error?.message || "").toLowerCase();
      if (code.includes("over_email_send_rate_limit") || errorMessage.includes("email rate limit")) {
        return "Supabase временно ограничил отправку писем. Попробуйте регистрацию через несколько минут или подключите SMTP в настройках проекта.";
      }
      if (code.includes("email_not_confirmed") || errorMessage.includes("email not confirmed")) {
        return "Email не подтвержден. Откройте письмо Supabase и подтвердите регистрацию.";
      }
      return error?.message || "Неизвестная ошибка авторизации.";
    }

    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (roleCopy[requestedRole]) roleInput.value = requestedRole;

    function updateRoleText() {
      const copy = roleCopy[roleInput.value] || roleCopy.worker;
      if (authTitle && !authTitle.dataset.siteSetting) authTitle.textContent = copy.title;
      if (authLead && !authLead.dataset.siteSetting) authLead.textContent = copy.lead;
    }

    async function ensureProfileAfterAuth(user, role) {
      if (!window.supabaseClient || !user) return;
      const profileRole = normalizeAuthRole(user.user_metadata?.role || role);
      await window.supabaseClient.from("profiles").upsert(
        {
          id: user.id,
          role: profileRole,
          name: user.email || "Пользователь",
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    }

    registerBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const role = normalizeAuthRole(roleInput.value);
      if (!client) return void (message.textContent = "Supabase не загрузился. Обновите страницу.");
      if (!email || !password) return void (message.textContent = "Введите email и пароль.");
      message.textContent = "Регистрируем...";
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      if (!error && data?.session?.user) await ensureProfileAfterAuth(data.session.user, role);
      message.textContent = error ? `Ошибка регистрации: ${readableAuthError(error)}` : "Регистрация успешна. Теперь попробуйте войти.";
    });

    loginBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      if (!client) return void (message.textContent = "Supabase не загрузился. Обновите страницу.");
      if (!email || !password) return void (message.textContent = "Введите email и пароль.");
      message.textContent = "Входим...";
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) return void (message.textContent = `Ошибка входа: ${readableAuthError(error)}`);
      await ensureProfileAfterAuth(data.user, roleInput.value);
      window.location.href = "cabinet.html";
    });

    roleInput.addEventListener("change", updateRoleText);
    updateRoleText();
  }

  function renderStats(rows) {
    const stats = document.getElementById("adminStats");
    if (!stats) return;
    const counts = rows.reduce(
      (acc, row) => {
        acc.all += 1;
        acc[row.type] = (acc[row.type] || 0) + 1;
        return acc;
      },
      { all: 0, worker: 0, restaurant: 0, supplier: 0, callback: 0, feedback: 0, telegram_bot: 0 },
    );
    stats.innerHTML = `
      <div class="stat">Всего: ${counts.all}</div>
      <div class="stat">Работники: ${counts.worker}</div>
      <div class="stat">Заведения: ${counts.restaurant}</div>
      <div class="stat">Поставщики: ${counts.supplier}</div>
      <div class="stat">Звонки: ${counts.callback}</div>
      <div class="stat">Обратная связь: ${counts.feedback}</div>
      <div class="stat">Telegram: ${counts.telegram_bot}</div>
    `;
  }

  async function loadAdminRows() {
    const localRows = readRows();
    const remoteRows = await fetchRemoteSubmissions();
    const map = new Map();
    [...remoteRows, ...localRows].forEach((row) => map.set(row.id, row));
    return [...map.values()].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async function renderAdmin() {
    const tbody = document.querySelector("#adminTable tbody");
    if (!tbody) return;
    const searchInput = document.getElementById("adminSearch");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const rows = await loadAdminRows();
    const visibleRows = query
      ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query))
      : rows;
    renderStats(visibleRows);
    tbody.innerHTML = visibleRows
      .map(
        (row) => `
      <tr>
        <td>${escapeHtml(formatDate(row.created_at))}</td>
        <td>${escapeHtml(roleText(row.type))}</td>
        <td>${escapeHtml(row.title)}</td>
        <td>${row.phone ? `<a href="tel:${escapeHtml(row.phone)}">${escapeHtml(row.phone)}</a>` : "-"}</td>
        <td>${row.telegram ? escapeHtml(row.telegram) : "-"}</td>
        <td>${escapeHtml(JSON.stringify(row.data || {}))}</td>
      </tr>
    `,
      )
      .join("");
    if (!visibleRows.length) {
      tbody.innerHTML = '<tr><td colspan="6">Заявок пока нет.</td></tr>';
    }
  }

  function initAdminActions() {
    const tbody = document.querySelector("#adminTable tbody");
    if (!tbody) return;
    document.getElementById("exportJson")?.addEventListener("click", async () => {
      download("gastroconnect-submissions.json", JSON.stringify(await loadAdminRows(), null, 2), "application/json;charset=utf-8");
    });
    document.getElementById("exportCsv")?.addEventListener("click", async () => {
      const rows = await loadAdminRows();
      const csv = [
        "Дата,Тип,Название,Телефон,Telegram,Город",
        ...rows.map((row) =>
          [formatDate(row.created_at), roleText(row.type), row.title || "", row.phone || "", row.telegram || "", row.city || ""]
            .map((value) => `"${String(value).replaceAll('"', '""')}"`)
            .join(","),
        ),
      ].join("\n");
      download("gastroconnect-submissions.csv", `\ufeff${csv}`, "text/csv;charset=utf-8");
    });
    document.getElementById("clearData")?.addEventListener("click", () => {
      if (confirm("Очистить локальные заявки в этом браузере?")) {
        writeRows([]);
        renderAdmin();
      }
    });
    document.getElementById("adminSearch")?.addEventListener("input", renderAdmin);
  }

  applySiteSettings();
  loadRemoteSiteSettings();
  initSiteSettingsForm();
  initPublicForms();
  initAuthPage();
  initPlatformSearch();
  initAdminActions();
  renderAdmin();
})();
