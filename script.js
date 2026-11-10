(function () {
  const PUBLIC_SUBMISSIONS_KEY = "gc_public_submissions";
  const PUBLIC_SUBMISSIONS_TABLE = "public_submissions";
  const SITE_SETTINGS_KEY = "gc_site_settings";
  const SITE_SETTINGS_ROW = "public_site";
  const SITE_ASSETS_BUCKET = "site-assets";
  const SUPABASE_CONFIG_URL = "supabase.js?v=1002";
  const roleLabels = {
    worker: "Работник",
    restaurant: "Заведение",
    supplier: "Поставщик",
  };
  const defaultSiteSettings = {
    logo: "assets/logo-full.png",
    nav: {
      workers: "Сотрудникам",
      restaurants: "Заведениям",
      suppliers: "Поставщикам",
      contacts: "Контакты",
      workflow: "Как работает",
      login: "Войти",
      signup: "Регистрация",
      home: "На главную",
      request: "Оставить заявку",
    },
    home: {
      hero: "assets/hero-home.webp",
      eyebrow: "Российская платформа гибкой занятости для HoReCa",
      title: "Смены, персонал и поставки без хаоса в чатах",
      lead: "GastroConnect помогает заведениям быстро закрывать смены, работникам находить подработку, а поставщикам получать реальные запросы от ресторанов и кафе.",
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
      metric1Value: "24/7",
      metric1Text: "публикация смен и заявок",
      metric2Value: "3 роли",
      metric2Text: "работник, заведение, поставщик",
      metric3Value: "1 кабинет",
      metric3Text: "профили, отклики, приглашения",
      metric4Value: "HoReCa",
      metric4Text: "фокус на кафе, рестораны и кухни",
      boardTitle: "Внутри не лендинг, а рабочая лента",
      boardLead:
        "Заведение публикует смену, работник откликается, поставщик получает запрос. Всё это собрано в кабинетах по ролям.",
      rolesTitle: "Все участники HoReCa в одном понятном процессе",
      rolesLead:
        "Заведение видит работников, публикует смены, получает отклики и держит поставщиков в одном месте.",
      restaurantCardLabel: "Для заведений",
      restaurantCardTitle: "Закрывайте смены быстрее",
      restaurantCardText:
        "Публикуйте заявки, приглашайте работников из базы, фильтруйте по профессии, ставке, графику и готовности к выезду.",
      workerCardLabel: "Для сотрудников",
      workerCardTitle: "Берите понятные смены",
      workerCardText:
        "Заполните профиль, смотрите доступные смены, откликайтесь и принимайте приглашения от заведений.",
      supplierCardLabel: "Для поставщиков",
      supplierCardTitle: "Получайте входящие запросы",
      supplierCardText:
        "Публикуйте предложения по товарам и услугам, а заведения отправляют заявки прямо в кабинет поставщика.",
      workflowEyebrow:
        "единый порядок для HoReCa",
      workflowTitle: "Не доска объявлений, а рабочий процесс",
      workflowLead:
        "Система собирает смены, профили, отклики, приглашения и поставки в одну понятную цепочку: без хаоса в переписках, потерянных контактов и ручного контроля каждой заявки.",
      workflowStep1:
        "Заведение публикует смену или выбирает работника из базы.",
      workflowStep2: "Работник откликается или принимает приглашение на смену.",
      workflowStep3:
        "Поставщик публикует оффер, заведение отправляет запрос в кабинет.",
      workflowStep4:
        "Админ видит общий контур данных и контролирует наполнение платформы.",
      mvpTitle: "Что уже заложено в MVP",
      mvpLead:
        "Функции, которые нужны, чтобы сайт перестал быть “витриной” и начал работать как сервис.",
      mvpCard1Label: "Смены",
      mvpCard1Title: "Публикация и отклики",
      mvpCard1Text:
        "Заведение создаёт смену, работник видит её в кабинете и отправляет отклик.",
      mvpCard2Label: "Профили",
      mvpCard2Title: "Профили всех ролей",
      mvpCard2Text:
        "Работники, заведения и поставщики ведут отдельные профили, чтобы заявки были понятными и проверяемыми.",
      mvpCard3Label: "Поставки",
      mvpCard3Title: "Офферы и заявки",
      mvpCard3Text:
        "Поставщики публикуют предложения, заведения отправляют запросы по нужным позициям.",
      finalTitle: "Начните с регистрации",
      finalLead: "Создайте аккаунт и откройте кабинет для своей роли.",
    },
    workers: {
      hero: "assets/hero-workers.webp",
      eyebrow: "Сотрудникам HoReCa",
      title: "Смены в ресторанах, кафе и доставке рядом",
      lead: "Заполните профиль, смотрите открытые смены, откликайтесь на задания и принимайте приглашения от заведений.",
      ctaPrimary: "Создать анкету",
      ctaSecondary: "Войти в кабинет",
      benefit1: "Смены рядом",
      benefit2: "Отклики на задания",
      benefit3: "Приглашения от заведений",
      stepsTitle: "Как работнику забирать смены",
      stepsLead:
        "Логика как у сервисов гибкой занятости: профиль, лента смен, отклик, подтверждение.",
      step1Label: "Профиль",
      step1Title: "Укажите профессию и ставку",
      step1Text:
        "Повар, бариста, официант, администратор, доступные дни, время и готовность к выезду.",
      step2Label: "Смены",
      step2Title: "Смотрите открытые задания",
      step2Text:
        "В кабинете есть фильтр по профессии, городу, ставке и требованиям заведения.",
      step3Label: "Приглашения",
      step3Title: "Принимайте или отклоняйте",
      step3Text:
        "Заведения могут отправлять прямые приглашения, а работник управляет ответом в кабинете.",
      formTitle: "Анкета работника",
      formLead:
        "Для полноценной анкеты зарегистрируйтесь как работник и заполните профиль в кабинете.",
    },
    restaurants: {
      hero: "assets/hero-restaurants.webp",
      eyebrow: "Заведениям HoReCa",
      title: "Закрывайте смены без бесконечных чатов",
      lead: "Публикуйте смены, получайте отклики, смотрите анкеты работников и отправляйте прямые приглашения.",
      ctaPrimary: "Найти персонал",
      ctaSecondary: "Оставить заявку",
      benefit1: "Публикация смен",
      benefit2: "Отклики работников",
      benefit3: "База анкет",
      stepsTitle: "Что получает заведение",
      stepsLead:
        "Операционный экран для управляющего, шефа или HR: смены, анкеты, отклики и поставщики.",
      step1Label: "Смены",
      step1Title: "Создавайте задания",
      step1Text:
        "Дата, время, ставка, профессия, район, адрес и требования попадают в ленту работников.",
      step2Label: "Работники",
      step2Title: "Ищите по базе",
      step2Text:
        "Фильтруйте анкеты по профессии, опыту, графику, ставке и готовности приехать.",
      step3Label: "Поставки",
      step3Title: "Отправляйте запросы",
      step3Text:
        "Смотрите предложения поставщиков и отправляйте заявку прямо из кабинета заведения.",
      formTitle: "Заявка заведения",
      formLead:
        "Заполните короткую заявку или зарегистрируйтесь, чтобы смотреть анкеты работников в кабинете.",
    },
    suppliers: {
      hero: "assets/hero-suppliers.webp",
      eyebrow: "Поставщикам HoReCa",
      title: "Поставщики для HoReCa с входящими заявками",
      lead: "Публикуйте предложения по товарам и услугам, получайте запросы заведений и ведите коммуникацию в кабинете.",
      ctaPrimary: "Стать поставщиком",
      ctaSecondary: "Войти",
      benefit1: "Офферы поставщиков",
      benefit2: "Заявки заведений",
      benefit3: "Фильтр по категориям",
      stepsTitle: "Поставщик видит спрос, а не случайные сообщения",
      stepsLead:
        "Сервис соединяет заведения и поставщиков внутри одного HoReCa-контура.",
      step1Label: "Каталог",
      step1Title: "Публикуйте офферы",
      step1Text:
        "Сыр, сахар, кофе, клининг, оборудование, посуда, униформа и услуги для заведений.",
      step2Label: "Заявки",
      step2Title: "Получайте входящие",
      step2Text:
        "Заведение выбирает предложение и отправляет поставщику запрос с количеством, городом и бюджетом.",
      step3Label: "Фильтры",
      step3Title: "Работайте по категориям",
      step3Text:
        "В кабинете поставщика можно смотреть запросы заведений и быстро находить нужные позиции.",
      formTitle: "Анкета поставщика",
      formLead:
        "Оставьте данные компании, категорию и описание товаров или услуг.",
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
      lead: "Профили, смены, приглашения и заявки собраны в одном месте для каждой роли.",
    },
    admin: {
      hero: "assets/hero-home.webp",
      eyebrow: "Управление сайтом",
      title: "Панель управления GastroConnect",
      lead: "Панель для заявок, изображений, логотипа и главных надписей сайта.",
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
  function readSiteSettings() {
    return mergeSettings(
      defaultSiteSettings,
      readJsonStorage(SITE_SETTINGS_KEY, {}),
    );
  }
  function writeSiteSettings(settings) {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
  }
  function isSafeImageSrc(src) {
    const value = String(src || "").trim();
    if (!value) return false;
    const lower = value.toLowerCase();
    if (
      lower.startsWith("javascript:") ||
      lower.startsWith("data:") ||
      lower.includes(["raw", "githubusercontent", "com"].join("."))
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
    if (image.getAttribute("src") === nextSrc) return;
    const preload = new Image();
    preload.decoding = "async";
    preload.onload = () => {
      if (image.getAttribute("src") !== nextSrc) image.src = nextSrc;
    };
    preload.onerror = () => {
      const safeSrc = image.dataset.fallbackSrc;
      if (safeSrc && image.getAttribute("src") !== safeSrc) image.src = safeSrc;
    };
    preload.src = nextSrc;
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
      return window.__gcSupabaseRestConfig;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    let response;
    try {
      response = await fetch(SUPABASE_CONFIG_URL, {
        cache: "force-cache",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) throw new Error("supabase.js не загрузился");
    const source = await response.text();
    const url = source.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    const key = source.match(/SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    if (!url || !key) throw new Error("Supabase config не найден");
    window.__gcSupabaseRestConfig = { url, key };
    return window.__gcSupabaseRestConfig;
  }
  async function fetchRemoteSiteSettings() {
    const { url, key } = await getSupabaseRestConfig();
    const endpoint = `${url}/rest/v1/site_settings?setting_key=eq.${encodeURIComponent(SITE_SETTINGS_ROW)}&select=settings&limit=1`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    let response;
    try {
      response = await fetch(endpoint, {
        signal: controller.signal,
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) throw new Error(`site_settings ${response.status}`);
    const rows = await response.json();
    return rows[0]?.settings || null;
  }
  async function loadRemoteSiteSettings() {
    try {
      const remote = await fetchRemoteSiteSettings();
      if (!remote) return;
      const merged = mergeSettings(defaultSiteSettings, remote);
      writeSiteSettings(merged);
      applySiteSettings(merged);
      fillSiteSettingsForm(merged);
    } catch {}
  }
  function scheduleRemoteSiteSettings() {
    const run = () => loadRemoteSiteSettings();
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 2500 });
      return;
    }
    if (document.readyState === "complete") {
      setTimeout(run, 400);
      return;
    }
    window.addEventListener("load", () => setTimeout(run, 400), { once: true });
  }
  async function saveSettingsToSupabase(settings) {
    const client = window.supabaseClient;
    if (!client)
      return {
        saved: false,
        reason: "Supabase Auth не подключен на этой странице.",
      };
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) {
      return {
        saved: false,
        reason: "Войдите как admin, чтобы сохранить глобально.",
      };
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
    const normalized = fileName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return normalized || "asset";
  }
  async function uploadSiteAsset(file, target) {
    const client = window.supabaseClient;
    if (!client) throw new Error("Supabase Auth не подключен.");
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session)
      throw new Error("Войдите как admin, чтобы загрузить файл.");
    const folder = target.replaceAll(".", "-");
    const filePath = `${folder}/${Date.now()}-${safeAssetName(file.name)}`;
    const { error } = await client.storage
      .from(SITE_ASSETS_BUCKET)
      .upload(filePath, file, { cacheControl: "31536000", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = client.storage
      .from(SITE_ASSETS_BUCKET)
      .getPublicUrl(filePath);
    if (!data?.publicUrl) throw new Error("Supabase не вернул публичный URL.");
    return data.publicUrl;
  }
  function fillSiteSettingsForm(settings = readSiteSettings()) {
    const form = document.getElementById("siteSettingsForm");
    if (!form) return;
    [...form.elements].forEach((field) => {
      if (!field.name) return;
      field.value =
        field.name === "logo"
          ? settings.logo
          : getPath(settings, field.name) || "";
    });
    updateSiteSettingsPreview(settings);
    updateSiteSettingsJson(settings);
  }
  function updateSiteSettingsPreview(settings = readSiteSettings()) {
    document.querySelectorAll("[data-setting-preview]").forEach((image) => {
      const path = image.dataset.settingPreview;
      const src = path === "logo" ? settings.logo : getPath(settings, path);
      const fallback =
        path === "logo"
          ? defaultSiteSettings.logo
          : getPath(defaultSiteSettings, path);
      setImageWithFallback(image, src, fallback);
    });
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
        setPath(
          next,
          field.name,
          fieldValue || getPath(defaultSiteSettings, field.name),
        );
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
    const resetButton = document.getElementById("resetSiteSettings");
    const refreshJsonButton = document.getElementById(
      "refreshSiteSettingsJson",
    );
    const downloadJsonButton = document.getElementById(
      "downloadSiteSettingsJson",
    );
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
      updateSiteSettingsPreview(next);
      const jsonField = document.getElementById("siteSettingsJson");
      if (jsonField) jsonField.dataset.dirty = "false";
      updateSiteSettingsJson(next);
      const remote = await saveSettingsToSupabase(next);
      message.textContent = remote.saved
        ? "Настройки сохранены глобально в Supabase."
        : `Настройки сохранены локально. Глобальное сохранение: ${remote.reason}`;
    });
    resetButton?.addEventListener("click", async () => {
      writeSiteSettings(defaultSiteSettings);
      applySiteSettings(defaultSiteSettings);
      const jsonField = document.getElementById("siteSettingsJson");
      if (jsonField) jsonField.dataset.dirty = "false";
      fillSiteSettingsForm(defaultSiteSettings);
      const remote = await saveSettingsToSupabase(defaultSiteSettings);
      message.textContent = remote.saved
        ? "Настройки сброшены глобально."
        : "Настройки сброшены локально.";
    });
    refreshJsonButton?.addEventListener("click", () => {
      const jsonField = document.getElementById("siteSettingsJson");
      if (jsonField) jsonField.dataset.dirty = "false";
      try {
        updateSiteSettingsJson(collectSiteSettingsFromForm(form));
      } catch (error) {
        if (message) message.textContent = `JSON не обновлен: ${error.message}`;
        return;
      }
      if (message)
        message.textContent = "JSON обновлен из текущих полей формы.";
    });
    downloadJsonButton?.addEventListener("click", () => {
      let next;
      try {
        next = collectSiteSettingsFromForm(form);
      } catch (error) {
        if (message) message.textContent = `JSON не скачан: ${error.message}`;
        return;
      }
      download(
        "gastroconnect-site-settings.json",
        JSON.stringify(next, null, 2),
        "application/json;charset=utf-8",
      );
      if (message) message.textContent = "JSON настроек скачан.";
    });
    form.querySelectorAll("input[name], textarea[name]").forEach((field) => {
      field.addEventListener("input", () => {
        try {
          updateSiteSettingsPreview(collectSiteSettingsFromForm(form));
        } catch {}
      });
    });
    const jsonField = document.getElementById("siteSettingsJson");
    if (jsonField) {
      updateSiteSettingsJson();
      jsonField.addEventListener("input", () => {
        jsonField.dataset.dirty = "true";
        try {
          updateSiteSettingsPreview(
            mergeSettings(
              readSiteSettings(),
              JSON.parse(jsonField.value || "{}"),
            ),
          );
          if (message) message.textContent = "";
        } catch {
          if (message) message.textContent = "JSON настроек пока невалидный.";
        }
      });
    }
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
          updateSiteSettingsPreview(collectSiteSettingsFromForm(form));
          message.textContent =
            "Файл загружен. Нажмите «Сохранить настройки», чтобы применить на сайте.";
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
    localStorage.setItem(PUBLIC_SUBMISSIONS_KEY, JSON.stringify(rows));
  }
  function makeId() {
    if (window.crypto && typeof crypto.randomUUID === "function")
      return crypto.randomUUID();
    return `gc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  function getFormTitle(type, data) {
    if (type === "callback") return data.name || "Заказать звонок";
    if (type === "feedback") return data.name || "Обратная связь";
    if (type === "telegram_bot") return data.telegram || "Telegram-уведомления";
    if (type === "worker") return data.name || "Работник";
    if (type === "restaurant") return data.business_name || "Заведение";
    return data.company_name || "Поставщик";
  }
  function normalizePhone(value) {
    return String(value || "")
      .replace(/[^\d+]/g, "")
      .replace(/^8(\d{10})$/, "+7$1");
  }
  function normalizeTelegram(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (raw.startsWith("https://t.me/")) return raw;
    return raw.startsWith("@") ? raw : `@${raw.replace(/^t\.me\//i, "")}`;
  }
  function enrichSubmissionData(form, type) {
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.phone) data.phone = normalizePhone(data.phone);
    if (data.telegram) data.telegram = normalizeTelegram(data.telegram);
    data.formType = type;
    data.pageUrl = window.location.href;
    data.pagePath = window.location.pathname;
    data.personalDataConsent = data.personalDataConsent === "true";
    data.personalDataConsentDate = data.personalDataConsent
      ? new Date().toISOString()
      : "";
    data.userAgent = navigator.userAgent || "";
    data.ipAddress = "";
    return data;
  }
  function makeSubmissionRow(type, data) {
    return {
      id: makeId(),
      type,
      title: getFormTitle(type, data),
      phone: data.phone || "",
      telegram: data.telegram || "",
      city: data.city || "",
      email: data.email || "",
      personalDataConsent: Boolean(data.personalDataConsent),
      personalDataConsentDate: data.personalDataConsentDate || "",
      ipAddress: data.ipAddress || "",
      userAgent: data.userAgent || "",
      data,
      source: "site",
      status: "new",
      created_at: new Date().toISOString(),
    };
  }
  function saveLocalSubmission(row) {
    const rows = readRows();
    rows.unshift(row);
    writeRows(rows);
  }
  async function saveRemoteSubmission(row) {
    const { url, key } = await getSupabaseRestConfig();
    const endpoint = `${url}/rest/v1/${PUBLIC_SUBMISSIONS_TABLE}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        signal: controller.signal,
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          type: row.type,
          title: row.title,
          phone: row.phone,
          telegram: row.telegram,
          city: row.city,
          email: row.email || row.data?.email || null,
          personal_data_consent: Boolean(row.personalDataConsent),
          personal_data_consent_date: row.personalDataConsentDate || null,
          ip_address: row.ipAddress || null,
          user_agent: row.userAgent || null,
          data: row.data,
          source: row.source || "site",
          status: row.status || "new",
        }),
      });
      if (!response.ok)
        throw new Error(`public_submissions ${response.status}`);
      return true;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  async function saveSubmission(type, data) {
    const row = makeSubmissionRow(type, data);
    saveLocalSubmission(row);
    try {
      return { row, remote: await saveRemoteSubmission(row) };
    } catch (error) {
      return { row, remote: false, error };
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
  function statusText(status) {
    return {
      new: "Новая",
      in_progress: "В работе",
      done: "Закрыта",
      archived: "Архив",
    }[status] || "Новая";
  }
  function normalizeSubmissionStatus(status) {
    return ["new", "in_progress", "done", "archived"].includes(status)
      ? status
      : "new";
  }
  function getSubmissionKey(row) {
    return row.id || `${row.type}-${row.created_at}-${row.phone || ""}`;
  }
  function telegramHref(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (raw.startsWith("@")) return `https://t.me/${raw.slice(1)}`;
    if (/^https:\/\/t\.me\/[a-z0-9_/?=&.-]+$/i.test(raw)) return raw;
    return "";
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
        const button = form.querySelector(
          'button[type="submit"], input[type="submit"]',
        );
        if (button) button.disabled = true;
        const type = form.dataset.formType;
        const data = enrichSubmissionData(form, type);
        const box = form.querySelector(".success");
        try {
          const result = await saveSubmission(type, data);
          if (box) {
            box.setAttribute("role", "status");
            box.textContent = result.remote
              ? "Готово. Заявка отправлена, мы получили ваши контакты и свяжемся с вами."
              : "Заявка сохранена в этом браузере. Если интернет или база временно недоступны, повторите отправку позже.";
            box.style.display = "block";
          }
          form.reset();
          form
            .querySelectorAll("input, select, textarea, button")
            .forEach((field) => field.blur());
        } finally {
          if (button) button.disabled = false;
        }
      });
    });
  }
  function initAuthPage() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("role");
    const roleField = document.getElementById("roleField");
    const message = document.getElementById("authMessage");
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const showLoginBtn = document.getElementById("showLoginBtn");
    const showRegisterBtn = document.getElementById("showRegisterBtn");
    const authFormTitle = document.getElementById("authFormTitle");
    const authModeHint = document.getElementById("authModeHint");
    const cabinetShortcut = document.getElementById("cabinetShortcut");
    if (!emailInput || !passwordInput || !roleInput || !message) return;

    const publicAuthRoles = ["worker", "restaurant", "supplier"];
    const normalizeAuthRole = (role) =>
      publicAuthRoles.includes(role) ? role : "worker";
    const roleLabelsFull = {
      worker: "работника",
      restaurant: "заведения",
      supplier: "поставщика",
    };
    const modeCopy = {
      signup: {
        title: "Регистрация",
        hint: "Выберите роль, создайте аккаунт и сразу переходите в свой кабинет.",
      },
      login: {
        title: "Вход",
        hint: "Введите email и пароль. Роль подтянется из вашего профиля.",
      },
    };
    const params = new URLSearchParams(window.location.search);
    const requestedRole = normalizeAuthRole(params.get("role"));
    let authMode = params.get("mode") === "login" ? "login" : "signup";
    roleInput.value = requestedRole;

    function cabinetUrl() {
      return `/cabinet/?role=${encodeURIComponent(roleInput.value)}`;
    }

    function setAuthBusy(isBusy, text = "Проверяем...") {
      [registerBtn, loginBtn, showLoginBtn, showRegisterBtn].forEach(
        (button) => {
          if (!button) return;
          button.disabled = isBusy;
        },
      );
      if (isBusy) message.textContent = text;
    }

    function updateRoleHint() {
      if (!authModeHint) return;
      if (authMode === "signup") {
        authModeHint.textContent = `Будет создан кабинет ${roleLabelsFull[roleInput.value]}.`;
        return;
      }
      authModeHint.textContent = modeCopy.login.hint;
    }

    function setAuthMode(nextMode, updateUrl = true) {
      authMode = nextMode === "login" ? "login" : "signup";
      const copy = modeCopy[authMode];
      if (authFormTitle) authFormTitle.textContent = copy.title;
      if (roleField) roleField.hidden = authMode === "login";
      if (registerBtn) registerBtn.hidden = authMode !== "signup";
      if (loginBtn) loginBtn.hidden = authMode !== "login";
      if (passwordInput) {
        passwordInput.autocomplete =
          authMode === "login" ? "current-password" : "new-password";
      }
      showLoginBtn?.classList.toggle("is-active", authMode === "login");
      showRegisterBtn?.classList.toggle("is-active", authMode === "signup");
      updateRoleHint();

      if (updateUrl) {
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.set("mode", authMode);
        nextParams.set("role", roleInput.value);
        window.history.replaceState(null, "", `/auth/?${nextParams}`);
      }
    }

    async function ensureProfileAfterAuth(user, role) {
      if (!user) return null;
      const profileRole = normalizeAuthRole(user.user_metadata?.role || role);
      const { data: existing, error: readError } = await window.supabaseClient
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .maybeSingle();
      if (existing) return existing;
      if (readError) throw readError;

      const payload = {
        id: user.id,
        role: profileRole,
        name: user.email || "Пользователь",
        status: "active",
        updated_at: new Date().toISOString(),
      };
      const { error } = await window.supabaseClient
        .from("profiles")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      return payload;
    }

    async function refreshSessionState() {
      const client = window.supabaseClient;
      if (!client) return;
      const { data } = await client.auth.getSession();
      if (data?.session?.user && cabinetShortcut) {
        cabinetShortcut.hidden = false;
        cabinetShortcut.href = cabinetUrl();
        message.textContent =
          "Вы уже вошли. Можно открыть кабинет или выйти из аккаунта в кабинете.";
      }
    }

    registerBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const role = normalizeAuthRole(roleInput.value);
      if (!client) {
        message.textContent = "Supabase не загрузился. Обновите страницу.";
        return;
      }
      if (!email || !password) {
        message.textContent = "Введите email и пароль.";
        return;
      }
      if (password.length < 6) {
        message.textContent = "Пароль должен быть минимум 6 символов.";
        return;
      }

      setAuthBusy(true, "Создаем аккаунт...");
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      if (error) {
        setAuthBusy(false);
        message.textContent = `Ошибка регистрации: ${error.message}`;
        return;
      }

      if (data?.session?.user) {
        try {
          await ensureProfileAfterAuth(data.session.user, role);
          window.location.href = cabinetUrl();
          return;
        } catch (profileError) {
          setAuthBusy(false);
          message.textContent = `Аккаунт создан, но профиль не сохранен: ${profileError.message}`;
          return;
        }
      }

      setAuthBusy(false);
      message.textContent =
        "Аккаунт создан. Если Supabase просит подтверждение email, подтвердите почту и войдите.";
      setAuthMode("login");
    });

    loginBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      if (!client) {
        message.textContent = "Supabase не загрузился. Обновите страницу.";
        return;
      }
      if (!email || !password) {
        message.textContent = "Введите email и пароль.";
        return;
      }

      setAuthBusy(true, "Входим...");
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthBusy(false);
        message.textContent = `Ошибка входа: ${error.message}`;
        return;
      }

      try {
        await ensureProfileAfterAuth(data.user, roleInput.value);
        window.location.href = cabinetUrl();
      } catch (profileError) {
        setAuthBusy(false);
        message.textContent = `Вход выполнен, но профиль не проверен: ${profileError.message}`;
      }
    });

    showLoginBtn?.addEventListener("click", () => setAuthMode("login"));
    showRegisterBtn?.addEventListener("click", () => setAuthMode("signup"));
    roleInput.addEventListener("change", () => {
      updateRoleHint();
      if (cabinetShortcut) cabinetShortcut.href = cabinetUrl();
      setAuthMode(authMode);
    });
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      if (authMode === "login") loginBtn?.click();
      else registerBtn?.click();
    });

    setAuthMode(authMode, false);
    refreshSessionState();
  }
  let adminRowsCache = [];
  async function readRemoteRows() {
    const client = window.supabaseClient;
    if (!client) return [];
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) return [];
    const { data, error } = await client
      .from(PUBLIC_SUBMISSIONS_TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data || []).map((row) => ({
      ...row,
      remote: true,
      data: row.data || {},
      personalDataConsent: Boolean(row.personal_data_consent),
      personalDataConsentDate: row.personal_data_consent_date || "",
      ipAddress: row.ip_address || "",
      userAgent: row.user_agent || "",
    }));
  }
  function mergeSubmissionRows(localRows, remoteRows) {
    const map = new Map();
    [...remoteRows, ...localRows].forEach((row) => {
      const key = getSubmissionKey(row);
      if (!map.has(key)) {
        map.set(key, {
          ...row,
          status: normalizeSubmissionStatus(row.status),
        });
      }
    });
    return [...map.values()].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  }
  function updateLocalSubmissionStatus(rowId, nextStatus) {
    const rows = readRows();
    const normalized = normalizeSubmissionStatus(nextStatus);
    writeRows(
      rows.map((row) =>
        getSubmissionKey(row) === rowId
          ? { ...row, status: normalized, updated_at: new Date().toISOString() }
          : row,
      ),
    );
  }
  async function updateRemoteSubmissionStatus(rowId, nextStatus) {
    const client = window.supabaseClient;
    if (!client) return false;
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) return false;
    const { error } = await client
      .from(PUBLIC_SUBMISSIONS_TABLE)
      .update({
        status: normalizeSubmissionStatus(nextStatus),
        updated_at: new Date().toISOString(),
      })
      .eq("id", rowId);
    if (error) throw error;
    return true;
  }
  function getExportRows() {
    return adminRowsCache.length ? adminRowsCache : readRows();
  }
  function renderStats(rows) {
    const stats = document.getElementById("adminStats");
    if (!stats) return;
    const counts = rows.reduce(
      (acc, row) => {
        acc.all += 1;
        acc[row.type] = (acc[row.type] || 0) + 1;
        acc[normalizeSubmissionStatus(row.status)] += 1;
        return acc;
      },
      {
        all: 0,
        worker: 0,
        restaurant: 0,
        supplier: 0,
        new: 0,
        in_progress: 0,
        done: 0,
        archived: 0,
      },
    );
    stats.innerHTML = `
      <div class="stat">Всего: ${counts.all}</div>
      <div class="stat">Новые: ${counts.new}</div>
      <div class="stat">В работе: ${counts.in_progress}</div>
      <div class="stat">Закрытые: ${counts.done}</div>
      <div class="stat">Работники: ${counts.worker}</div>
      <div class="stat">Заведения: ${counts.restaurant}</div>
      <div class="stat">Поставщики: ${counts.supplier}</div>
    `;
  }
  async function renderAdmin() {
    const tbody = document.querySelector("#adminTable tbody");
    if (!tbody) return;
    const searchInput = document.getElementById("adminSearch");
    const typeFilter = document.getElementById("adminTypeFilter");
    const statusFilter = document.getElementById("adminStatusFilter");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const typeValue = typeFilter?.value || "";
    const statusValue = statusFilter?.value || "";
    let rows = readRows();
    try {
      rows = mergeSubmissionRows(rows, await readRemoteRows());
    } catch {}
    adminRowsCache = rows;
    const visibleRows = rows.filter((row) => {
      const status = normalizeSubmissionStatus(row.status);
      const searchOk = query
        ? JSON.stringify(row).toLowerCase().includes(query)
        : true;
      const typeOk = typeValue ? row.type === typeValue : true;
      const statusOk = statusValue ? status === statusValue : true;
      return searchOk && typeOk && statusOk;
    });
    renderStats(visibleRows);
    tbody.innerHTML = visibleRows
      .map(
        (row) => {
          const rowKey = getSubmissionKey(row);
          const status = normalizeSubmissionStatus(row.status);
          const telegramUrl = telegramHref(row.telegram);
          return `
      <tr>
        <td>${escapeHtml(formatDate(row.created_at))}</td>
        <td>${escapeHtml(roleText(row.type))}</td>
        <td><span class="status-pill status-${escapeHtml(status)}">${escapeHtml(statusText(status))}</span></td>
        <td>${escapeHtml(row.title)}${row.remote ? " (Supabase)" : ""}</td>
        <td>${row.phone ? `<a href="tel:${escapeHtml(row.phone)}">${escapeHtml(row.phone)}</a>` : "-"}</td>
        <td>${row.telegram ? (telegramUrl ? `<a href="${escapeHtml(telegramUrl)}" target="_blank" rel="noopener">${escapeHtml(row.telegram)}</a>` : escapeHtml(row.telegram)) : "-"}</td>
        <td><pre class="admin-json">${escapeHtml(JSON.stringify(row.data, null, 2))}</pre></td>
        <td>
          <div class="admin-row-actions">
            <button class="btn compact" type="button" data-admin-status="in_progress" data-row-id="${escapeHtml(rowKey)}">В работу</button>
            <button class="btn compact" type="button" data-admin-status="done" data-row-id="${escapeHtml(rowKey)}">Закрыть</button>
            <button class="btn compact danger" type="button" data-admin-status="archived" data-row-id="${escapeHtml(rowKey)}">Архив</button>
          </div>
        </td>
      </tr>
    `;
        },
      )
      .join("");
    if (!visibleRows.length) {
      tbody.innerHTML = '<tr><td colspan="8">Заявок пока нет.</td></tr>';
    }
  }
  function initAdminActions() {
    const tbody = document.querySelector("#adminTable tbody");
    if (!tbody) return;
    document.getElementById("exportJson")?.addEventListener("click", () => {
      download(
        "gastroconnect-submissions.json",
        JSON.stringify(getExportRows(), null, 2),
        "application/json;charset=utf-8",
      );
    });
    document.getElementById("exportCsv")?.addEventListener("click", () => {
      const csv = [
        "Дата,Тип,Статус,Название,Телефон,Email,Telegram,Город,Согласие,Дата согласия",
        ...getExportRows().map((row) =>
          [
            formatDate(row.created_at),
            roleText(row.type),
            statusText(normalizeSubmissionStatus(row.status)),
            row.title || "",
            row.phone || "",
            row.email || row.data?.email || "",
            row.telegram || "",
            row.city || "",
            row.personalDataConsent ? "Да" : "Нет",
            row.personalDataConsentDate || "",
          ]
            .map((value) => `"${String(value).replaceAll('"', '""')}"`)
            .join(","),
        ),
      ].join("\n");
      download(
        "gastroconnect-submissions.csv",
        `\ufeff${csv}`,
        "text/csv;charset=utf-8",
      );
    });
    document.getElementById("clearData")?.addEventListener("click", () => {
      if (confirm("Очистить локальные заявки?")) {
        writeRows([]);
        renderAdmin();
      }
    });
    document
      .getElementById("adminSearch")
      ?.addEventListener("input", renderAdmin);
    document
      .getElementById("adminTypeFilter")
      ?.addEventListener("change", renderAdmin);
    document
      .getElementById("adminStatusFilter")
      ?.addEventListener("change", renderAdmin);
    tbody.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-admin-status]");
      if (!button) return;
      const rowId = button.dataset.rowId;
      const nextStatus = normalizeSubmissionStatus(button.dataset.adminStatus);
      if (!rowId) return;
      button.disabled = true;
      updateLocalSubmissionStatus(rowId, nextStatus);
      try {
        await updateRemoteSubmissionStatus(rowId, nextStatus);
      } catch {}
      await renderAdmin();
    });
  }
  applySiteSettings();
  scheduleRemoteSiteSettings();
  initSiteSettingsForm();
  initPublicForms();
  initAuthPage();
  initAdminActions();
  renderAdmin();
})();

