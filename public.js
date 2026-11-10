(function () {
  const SETTINGS_KEY = "gc_site_settings";
  const SETTINGS_ROW = "public_site";
  const SUBMISSIONS_KEY = "gc_public_submissions";
  const SUBMISSIONS_TABLE = "public_submissions";
  const roles = ["worker", "restaurant", "supplier"];
  let allowBackgrounds = false;
  const roleName = {
    worker: "работника",
    restaurant: "заведения",
    supplier: "поставщика",
  };

  const normalizeRole = (role) => (roles.includes(role) ? role : "worker");

  function getPath(source, path) {
    return path.split(".").reduce((value, key) => value?.[key], source);
  }

  function mergeDeep(base, extra) {
    if (!extra || typeof extra !== "object") return base || {};
    const result = { ...(base || {}) };
    Object.entries(extra).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = mergeDeep(result[key], value);
      } else if (value !== undefined && value !== null && value !== "") {
        result[key] = value;
      }
    });
    return result;
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "") || fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function applySettings(settings) {
    if (!settings || typeof settings !== "object") return;
    document.querySelectorAll("[data-site-setting]").forEach((node) => {
      const value = getPath(settings, node.dataset.siteSetting);
      if (typeof value === "string") node.textContent = value;
    });
    document.querySelectorAll("[data-site-image]").forEach((image) => {
      const value = getPath(settings, image.dataset.siteImage);
      setSafeLocalImage(image, value);
    });
    if (allowBackgrounds) {
      document.querySelectorAll("[data-site-bg]").forEach((node) => {
        const value = getPath(settings, node.dataset.siteBg);
        setSafeLocalBackground(node, value);
      });
    }
    document.querySelectorAll("[data-site-logo]").forEach((image) => {
      setSafeLocalImage(image, settings.logo);
    });
  }

  function safeLocalAsset(src) {
    const value = String(src || "").trim();
    if (!value) return "";
    const lower = value.toLowerCase();
    if (
      lower.startsWith("javascript:") ||
      lower.startsWith("data:") ||
      (lower.includes("githubusercontent") && lower.includes("raw"))
    ) {
      return "";
    }
    if (lower.startsWith("assets/")) return value;
    if (lower.startsWith("/assets/")) return value.slice(1);
    try {
      const url = new URL(value, window.location.href);
      return url.origin === window.location.origin && url.pathname.startsWith("/assets/")
        ? `${url.pathname}${url.search}`
        : "";
    } catch {
      return "";
    }
  }

  function setSafeLocalImage(image, src) {
    if (!image || typeof src !== "string") return;
    const nextSrc = safeLocalAsset(src);
    if (!nextSrc || image.getAttribute("src") === nextSrc) return;
    const fallback = image.getAttribute("src") || nextSrc;
    image.onerror = () => {
      if (fallback && image.getAttribute("src") !== fallback) image.src = fallback;
    };
    image.src = nextSrc;
  }

  function setSafeLocalBackground(node, src) {
    if (!node || typeof src !== "string") return;
    const nextSrc = safeLocalAsset(src);
    if (!nextSrc) return;
    const escaped = nextSrc.replace(/["\\]/g, "\\$&");
    node.style.setProperty("--hero-image", `url("${escaped}")`);
  }

  function applyDefaultBackgrounds() {
    allowBackgrounds = true;
    document.querySelectorAll("[data-bg-default]").forEach((node) => {
      setSafeLocalBackground(node, node.dataset.bgDefault);
    });
    applySettings(readJson(SETTINGS_KEY, {}));
  }

  function scheduleBackgrounds() {
    const run = () => setTimeout(applyDefaultBackgrounds, 0);
    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run, { once: true });
    }
  }

  async function refreshSettings() {
    const client = window.supabaseClient;
    if (!client) return;
    try {
      const { data, error } = await client
        .from("site_settings")
        .select("settings")
        .eq("id", SETTINGS_ROW)
        .maybeSingle();
      if (error || !data?.settings) return;
      const next = mergeDeep(readJson(SETTINGS_KEY, {}), data.settings);
      writeJson(SETTINGS_KEY, next);
      applySettings(next);
    } catch {}
  }

  async function getSupabaseRestConfig() {
    if (window.__gcSupabaseRestConfig) return window.__gcSupabaseRestConfig;
    if (window.supabaseClient?.supabaseUrl && window.supabaseClient?.supabaseKey) {
      window.__gcSupabaseRestConfig = {
        url: window.supabaseClient.supabaseUrl,
        key: window.supabaseClient.supabaseKey,
      };
      return window.__gcSupabaseRestConfig;
    }
    const response = await fetch("/supabase.js?v=1002", { cache: "force-cache" });
    if (!response.ok) throw new Error("supabase.js не загрузился");
    const source = await response.text();
    const url = source.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    const key = source.match(/SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    if (!url || !key) throw new Error("Supabase config не найден");
    window.__gcSupabaseRestConfig = { url, key };
    return window.__gcSupabaseRestConfig;
  }

  function readSubmissions() {
    return readJson(SUBMISSIONS_KEY, []);
  }

  function saveLocalSubmission(row) {
    const rows = readSubmissions();
    rows.unshift(row);
    writeJson(SUBMISSIONS_KEY, rows.slice(0, 100));
  }

  function createSubmissionId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (value) =>
      (Number(value) ^ (Math.random() * 16 >> Number(value) / 4)).toString(16),
    );
  }

  function makeSubmission(type, data) {
    const consentDate = data.personalDataConsentDate || new Date().toISOString();
    const personalDataConsent = data.personalDataConsent === true || data.personalDataConsent === "true" || data.personalDataConsent === "on";
    const phone = String(data.phone || "")
      .replace(/[^\d+]/g, "")
      .replace(/^8(\d{10})$/, "+7$1");
    const telegramRaw = String(data.telegram || "").trim();
    const telegram = telegramRaw && !telegramRaw.startsWith("@") && !telegramRaw.startsWith("https://t.me/")
      ? `@${telegramRaw.replace(/^t\.me\//i, "")}`
      : telegramRaw;
    const normalizedData = {
      ...data,
      personalDataConsent,
      personalDataConsentDate: personalDataConsent ? consentDate : "",
      email: data.email || "",
      phone,
      telegram,
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      ipAddress: data.ipAddress || "",
      userAgent: data.userAgent || navigator.userAgent || "",
    };
    const title =
      type === "callback"
        ? `\u0417\u0430\u043a\u0430\u0437 \u0437\u0432\u043e\u043d\u043a\u0430: ${normalizedData.name || normalizedData.phone || "\u043a\u043e\u043d\u0442\u0430\u043a\u0442"}`
        : type === "feedback"
          ? `\u041e\u0431\u0440\u0430\u0442\u043d\u0430\u044f \u0441\u0432\u044f\u0437\u044c: ${normalizedData.name || normalizedData.phone || "\u043a\u043e\u043d\u0442\u0430\u043a\u0442"}`
          : type === "telegram_bot"
            ? `Telegram-\u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f: ${normalizedData.telegram || normalizedData.name || "\u043a\u043e\u043d\u0442\u0430\u043a\u0442"}`
            : normalizedData.name || normalizedData.company || normalizedData.role || normalizedData.product || "\u0417\u0430\u044f\u0432\u043a\u0430";
    return {
      id: createSubmissionId(),
      type,
      title,
      phone: normalizedData.phone || "",
      telegram: normalizedData.telegram || "",
      city: normalizedData.city || "",
      email: normalizedData.email || "",
      personalDataConsent: normalizedData.personalDataConsent,
      personalDataConsentDate: normalizedData.personalDataConsentDate,
      ipAddress: normalizedData.ipAddress,
      userAgent: normalizedData.userAgent,
      data: normalizedData,
      source: "site",
      status: "new",
      created_at: new Date().toISOString(),
    };
  }
  async function saveRemoteSubmission(row) {
    const payload = {
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
    };
    const client = window.supabaseClient;
    if (client) {
      const { error } = await client.from(SUBMISSIONS_TABLE).insert(payload);
      if (error) throw error;
      return true;
    }
    const { url, key } = await getSupabaseRestConfig();
    const response = await fetch(`${url}/rest/v1/${SUBMISSIONS_TABLE}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`public_submissions ${response.status}`);
    return true;
  }
  function initPublicForms() {
    document.querySelectorAll("form[data-form-type]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"], input[type="submit"]');
        const box = form.querySelector(".success");
        if (button) button.disabled = true;
        const rawData = Object.fromEntries(new FormData(form).entries());
        if (rawData.personalDataConsent !== "true" && rawData.personalDataConsent !== "on") {
          if (box) {
            box.textContent = "\u041d\u0443\u0436\u043d\u043e \u043f\u0440\u0438\u043d\u044f\u0442\u044c \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u0438 \u0434\u0430\u0442\u044c \u0441\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445.";
            box.style.display = "block";
          }
          if (button) button.disabled = false;
          return;
        }
        rawData.personalDataConsentDate = new Date().toISOString();
        rawData.userAgent = navigator.userAgent || "";
        rawData.ipAddress = "";
        const row = makeSubmission(form.dataset.formType, rawData);
        saveLocalSubmission(row);
        try {
          await saveRemoteSubmission(row);
          if (box) {
            box.setAttribute("role", "status");
            box.textContent =
              form.dataset.formType === "callback"
                ? "\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0437\u0432\u043e\u043d\u043e\u043a \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430. \u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438 \u043f\u043e \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u043c\u0443 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0443."
                : form.dataset.formType === "feedback"
                  ? "\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e. \u041c\u044b \u043e\u0442\u0432\u0435\u0442\u0438\u043c \u043f\u043e \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u044b\u043c \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0430\u043c."
                  : form.dataset.formType === "telegram_bot"
                    ? "\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 Telegram-\u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430. \u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0434\u043b\u044f \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f."
                    : "\u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430. \u041c\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u0438 \u0432\u0430\u0448\u0438 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0438 \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438.";
          }
        } catch {
          if (box) box.textContent = "\u0417\u0430\u044f\u0432\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430 \u0432 \u044d\u0442\u043e\u043c \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435. \u0415\u0441\u043b\u0438 \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442 \u0438\u043b\u0438 \u0431\u0430\u0437\u0430 \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b, \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0443 \u043f\u043e\u0437\u0436\u0435.";
        } finally {
          if (box) box.style.display = "block";
          form.reset();
          if (button) button.disabled = false;
        }
      });
    });
  }
  function initAuthPage() {
    const methodInput = document.getElementById("authMethod");
    const nameInput = document.getElementById("displayName");
    const cityInput = document.getElementById("city");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const emailField = document.getElementById("emailField");
    const phoneField = document.getElementById("phoneField");
    const nameField = document.getElementById("nameField");
    const cityField = document.getElementById("cityField");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("role");
    const roleField = document.getElementById("roleField");
    const message = document.getElementById("authMessage");
    const authConsent = document.getElementById("authConsent");
    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const showLoginBtn = document.getElementById("showLoginBtn");
    const showRegisterBtn = document.getElementById("showRegisterBtn");
    const formTitle = document.getElementById("authFormTitle");
    const modeHint = document.getElementById("authModeHint");
    const cabinetShortcut = document.getElementById("cabinetShortcut");
    if (!methodInput || !emailInput || !phoneInput || !passwordInput || !roleInput || !message) return;

    const params = new URLSearchParams(window.location.search);
    let mode = params.get("mode") === "login" ? "login" : "signup";
    let roleWasExplicit = roles.includes(params.get("role"));
    roleInput.value = normalizeRole(params.get("role"));
    methodInput.value = params.get("method") === "phone" ? "phone" : "email";

    const profileCabinetUrl = (profile) => {
      const role = profile?.role || roleInput.value;
      return `/cabinet/?role=${encodeURIComponent(role)}`;
    };

    function cleanPhone(value) {
      let digits = String(value || "").replace(/\D/g, "");
      if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
      if (digits.length === 10) digits = `7${digits}`;
      return digits ? `+${digits}` : "";
    }

    function emailValue() {
      return emailInput.value.trim().toLowerCase();
    }

    function phoneValue() {
      return cleanPhone(phoneInput.value);
    }

    function roleFromUser(user) {
      return roles.find((role) => role === user?.app_metadata?.role || role === user?.user_metadata?.role) || "";
    }

    function setBusy(isBusy, text) {
      [registerBtn, loginBtn, showLoginBtn, showRegisterBtn, methodInput, roleInput].forEach((control) => {
        if (control) control.disabled = isBusy;
      });
      if (text) message.textContent = text;
    }

    function updateHistory() {
      const next = new URLSearchParams(window.location.search);
      next.set("mode", mode);
      next.set("role", roleInput.value);
      next.set("method", methodInput.value);
      window.history.replaceState(null, "", `/auth/?${next}`);
    }

    function setContactVisibility(updateUrl = true) {
      const byPhone = methodInput.value === "phone";
      const loginMode = mode === "login";
      if (emailField) emailField.hidden = loginMode && byPhone;
      if (phoneField) phoneField.hidden = loginMode && !byPhone;
      if (nameField) nameField.hidden = loginMode;
      if (cityField) cityField.hidden = loginMode;
      emailInput.required = loginMode ? !byPhone : methodInput.value === "email";
      phoneInput.required = loginMode ? byPhone : methodInput.value === "phone";
      emailInput.placeholder = byPhone ? "Можно указать дополнительно" : "example@mail.ru";
      phoneInput.placeholder = byPhone ? "+7 910 000-00-00" : "Можно указать дополнительно";
      if (updateUrl) updateHistory();
    }

    function setMode(nextMode, updateUrl = true) {
      mode = nextMode === "login" ? "login" : "signup";
      if (formTitle) formTitle.textContent = mode === "login" ? "Вход" : "Регистрация";
      if (roleField) roleField.hidden = mode === "login";
      if (registerBtn) registerBtn.hidden = mode !== "signup";
      if (loginBtn) loginBtn.hidden = mode !== "login";
      passwordInput.autocomplete = mode === "login" ? "current-password" : "new-password";
      showLoginBtn?.classList.toggle("is-active", mode === "login");
      showRegisterBtn?.classList.toggle("is-active", mode === "signup");
      if (modeHint) {
        modeHint.textContent =
          mode === "login"
            ? "Введите email или телефон и пароль. Роль подтянется из вашего профиля."
            : `Будет создан кабинет ${roleName[roleInput.value]}. Данные сохранятся в базе и админке.`;
      }
      if (cabinetShortcut) cabinetShortcut.href = profileCabinetUrl({ role: roleInput.value });
      setContactVisibility(false);
      if (updateUrl) updateHistory();
    }

    async function upsertAdminAccount(user, role, payload = {}) {
      if (!user || !window.supabaseClient) return;
      const metadata = user.user_metadata || {};
      const consentGranted =
        payload.personalDataConsent === true ||
        metadata.personalDataConsent === true ||
        metadata.personalDataConsent === "true";
      const basePayload = {
        user_id: user.id,
        role: normalizeRole(role),
        email: user.email || payload.email || emailValue() || null,
        phone: user.phone || payload.phone || phoneValue() || null,
        name: payload.name || nameInput?.value.trim() || user.email || user.phone || "Пользователь",
        city: payload.city || cityInput?.value.trim() || null,
        auth_provider: payload.auth_provider || metadata.auth_provider || methodInput.value,
        status: "active",
        source: "auth_page",
        raw_meta: metadata,
        updated_at: new Date().toISOString(),
      };
      const consentPayload = {
        ...basePayload,
        personal_data_consent: consentGranted,
        personal_data_consent_date: payload.personalDataConsentDate || metadata.personalDataConsentDate || null,
        user_agent: payload.userAgent || metadata.userAgent || navigator.userAgent || "",
        ip_address: payload.ipAddress || metadata.ipAddress || "",
      };
      const { error } = await window.supabaseClient
        .from("admin_user_accounts")
        .upsert(consentPayload, { onConflict: "user_id" });
      if (error && /personal_data_consent|personal_data_consent_date|user_agent|ip_address/i.test(error.message || "")) {
        await window.supabaseClient.from("admin_user_accounts").upsert(basePayload, { onConflict: "user_id" });
      }
    }

    async function ensureProfile(user, role) {
      if (!user) return null;
      const profileRole = roleFromUser(user) || (roles.includes(role) ? role : "");
      const authEmail = user.email || emailValue();
      const authPhone = user.phone || phoneValue();
      const authProvider = authPhone && !authEmail ? "phone" : "email";
      const profileName = nameInput?.value.trim() || authEmail || authPhone || "Пользователь";
      const profileCity = cityInput?.value.trim() || "";
      const { data: existing, error: readError } = await window.supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (readError) throw readError;
      if (existing) {
        const patch = {
          email: existing.email || authEmail || null,
          phone: existing.phone || authPhone || null,
          auth_provider: existing.auth_provider || authProvider,
          updated_at: new Date().toISOString(),
        };
        const { data: updated } = await window.supabaseClient
          .from("profiles")
          .update(patch)
          .eq("id", user.id)
          .select("*")
          .maybeSingle();
        await upsertAdminAccount(user, existing.role, { ...existing, ...patch, ...user.user_metadata });
        return updated || existing;
      }
      if (!profileRole) {
        throw new Error("Профиль не найден. Откройте регистрацию, выберите роль и создайте профиль.");
      }
      const payload = {
        id: user.id,
        role: profileRole,
        name: profileName,
        city: profileCity || null,
        email: authEmail || null,
        phone: authPhone || null,
        auth_provider: authProvider,
        status: "active",
        updated_at: new Date().toISOString(),
      };
      const { error } = await window.supabaseClient.from("profiles").upsert(payload, { onConflict: "id" });
      if (error) throw error;
      await upsertAdminAccount(user, profileRole, payload);
      return payload;
    }

    async function refreshSession() {
      const client = window.supabaseClient;
      if (!client || !cabinetShortcut) return;
      const { data } = await client.auth.getSession();
      if (data?.session?.user) {
        try {
          const sessionProfile = await ensureProfile(data.session.user, roleWasExplicit ? roleInput.value : "");
          cabinetShortcut.hidden = false;
          cabinetShortcut.href = profileCabinetUrl(sessionProfile);
          message.textContent = "Вы уже вошли. Можно открыть кабинет.";
        } catch (error) {
          cabinetShortcut.hidden = true;
          message.textContent = error.message;
        }
      }
    }

    registerBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const method = methodInput.value === "phone" ? "phone" : "email";
      const email = emailValue();
      const phone = phoneValue();
      const password = passwordInput.value;
      const role = normalizeRole(roleInput.value);
      const name = nameInput?.value.trim() || "";
      const city = cityInput?.value.trim() || "";
      if (!client) return (message.textContent = "Supabase не загрузился. Обновите страницу.");
      if (method === "email" && !email) return (message.textContent = "Введите email.");
      if (method === "phone" && !phone) return (message.textContent = "Введите телефон в формате +7...");
      if (!password) return (message.textContent = "Введите пароль.");
      if (authConsent && !authConsent.checked) return (message.textContent = "Нужно принять документы и дать согласие на обработку персональных данных.");
      if (password.length < 6) return (message.textContent = "Пароль должен быть минимум 6 символов.");

      setBusy(true, "Создаем аккаунт...");
      const consentDate = new Date().toISOString();
      const options = { data: { role, name, city, email, phone, auth_provider: method, personalDataConsent: true, personalDataConsentDate: consentDate, userAgent: navigator.userAgent || "", ipAddress: "" } };
      const signUpPayload = method === "phone" ? { phone, password, options } : { email, password, options };
      const { data, error } = await client.auth.signUp(signUpPayload);
      if (error) {
        setBusy(false);
        return (message.textContent = `Ошибка регистрации: ${error.message}`);
      }
      if (data?.session?.user) {
        try {
          const profile = await ensureProfile(data.session.user, role);
          window.location.href = profileCabinetUrl(profile);
          return;
        } catch (profileError) {
          setBusy(false);
          return (message.textContent = `Аккаунт создан, но профиль не сохранен: ${profileError.message}`);
        }
      }
      setBusy(false);
      message.textContent =
        method === "phone"
          ? "Аккаунт создан. Если Supabase просит SMS-код, подтвердите телефон и войдите."
          : "Аккаунт создан. Если Supabase просит подтверждение email, подтвердите почту и войдите.";
      setMode("login");
    });

    loginBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const method = methodInput.value === "phone" ? "phone" : "email";
      const email = emailValue();
      const phone = phoneValue();
      const password = passwordInput.value;
      if (!client) return (message.textContent = "Supabase не загрузился. Обновите страницу.");
      if (method === "email" && !email) return (message.textContent = "Введите email.");
      if (method === "phone" && !phone) return (message.textContent = "Введите телефон.");
      if (!password) return (message.textContent = "Введите пароль.");

      setBusy(true, "Входим...");
      const credentials = method === "phone" ? { phone, password } : { email, password };
      const { data, error } = await client.auth.signInWithPassword(credentials);
      if (error) {
        setBusy(false);
        return (message.textContent = `Ошибка входа: ${error.message}`);
      }
      try {
        const profile = await ensureProfile(data.user, roleWasExplicit ? roleInput.value : "");
        window.location.href = profileCabinetUrl(profile);
      } catch (profileError) {
        setBusy(false);
        message.textContent = `Вход выполнен, но профиль не проверен: ${profileError.message}`;
      }
    });

    showLoginBtn?.addEventListener("click", () => setMode("login"));
    showRegisterBtn?.addEventListener("click", () => setMode("signup"));
    roleInput.addEventListener("change", () => {
      roleWasExplicit = true;
      setMode(mode);
    });
    methodInput.addEventListener("change", () => setContactVisibility(true));
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      (mode === "login" ? loginBtn : registerBtn)?.click();
    });

    setMode(mode, false);
    setContactVisibility(false);
    refreshSession();
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initReviewsCarousel() {
    const track = document.querySelector("[data-reviews-carousel] .reviews-track");
    if (!track) return;

    track.querySelectorAll(".review-avatar").forEach((image, index) => {
      const src = image.getAttribute("src") || "";
      image.loading = index < 6 ? "eager" : "lazy";
      image.decoding = "async";
      image.setAttribute("fetchpriority", "low");

      if (src.startsWith("/assets/review-") && !src.includes("?")) {
        image.src = `${src}?v=2`;
      }

      image.onerror = () => {
        image.onerror = null;
        image.src = "/assets/review-01.webp?v=2";
      };
    });
  }

  applySettings(readJson(SETTINGS_KEY, {}));
  scheduleBackgrounds();
  initPublicForms();
  initAuthPage();
  initReviewsCarousel();
  window.addEventListener("load", () => setTimeout(refreshSettings, 400), { once: true });
})();


