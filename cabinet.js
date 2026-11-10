(function () {
  const db = window.supabaseClient;

  const ids = [
    "userInfo",
    "workerCabinet",
    "restaurantCabinet",
    "supplierCabinet",
    "adminCabinet",
    "unknownRole",
    "logoutBtn",
    "workerProfileMessage",
    "restaurantProfileMessage",
    "supplierProfileMessage",
    "workersList",
    "workersMessage",
    "workerSearchInput",
    "restaurantInvitesList",
    "restaurantInvitesMessage",
    "invitesList",
    "invitesMessage",
    "workerApplicationsList",
    "workerApplicationsMessage",
    "shiftPostsList",
    "shiftPostsMessage",
    "shiftSearchInput",
    "restaurantShiftPostsList",
    "shiftApplicationsList",
    "shiftPostMessage",
    "supplierOffersList",
    "supplierOffersSearchInput",
    "restaurantSupplyRequestsMessage",
    "restaurantSupplyRequestsList",
    "supplyRequestMessageBox",
    "supplyResponsesMessage",
    "supplyResponsesList",
    "supplyRequestsList",
    "supplyRequestsSearchInput",
    "supplierOfferMessageBox",
    "supplierOwnOffersList",
    "supplierResponsesMessage",
    "supplierResponsesList",
    "supplierInquiriesMessage",
    "supplierInquiriesList",
    "adminMessage",
    "adminDataList",
  ];

  const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

  const state = {
    user: null,
    profile: null,
    workers: [],
    shifts: [],
    supplierOffers: [],
    restaurantSupplyRequests: [],
    supplyRequests: [],
    workerApplications: [],
    supplierResponses: [],
    ownSupplierResponses: [],
    supplierInquiries: [],
    supplierInquiryFilter: "",
    ownSupplierOffers: [],
    restaurantInvites: [],
    restaurantShifts: [],
    restaurantApplications: [],
    restaurantApplicationFilter: "",
  };

  const rolePanels = {
    worker: el.workerCabinet,
    restaurant: el.restaurantCabinet,
    supplier: el.supplierCabinet,
    admin: el.adminCabinet,
  };

  const publicRoles = ["worker", "restaurant", "supplier"];

  const profileFields = {
    worker: {
      workerProfessions: "professions",
      workerPhone: "phone",
      workerEmail: "email",
      workerAvailableDays: "available_days",
      workerExperience: "experience",
      workerAvailableTime: "available_time",
      workerPaymentType: "payment_type",
      workerCanTravel: "can_travel",
      workerTravelCities: "travel_cities",
      workerAbout: "about",
    },
    restaurant: {
      restaurantBusinessName: "business_name",
      restaurantBusinessType: "business_type",
      restaurantContactPerson: "contact_person",
      restaurantPhone: "phone",
      restaurantEmail: "email",
      restaurantCity: "city",
      restaurantAddress: "address",
      restaurantAbout: "about",
    },
    supplier: {
      supplierCompanyName: "company_name",
      supplierProfileCategory: "category",
      supplierContactPerson: "contact_person",
      supplierPhone: "phone",
      supplierEmail: "email",
      supplierProfileCity: "city",
      supplierDeliveryCities: "delivery_cities",
      supplierProfileAbout: "about",
    },
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function setMessage(target, text) {
    if (target) target.textContent = text || "";
  }

  function value(id) {
    return (byId(id)?.value || "").trim();
  }

  function cleanPhone(rawValue) {
    let digits = String(rawValue || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
    if (digits.length === 10) digits = `7${digits}`;
    return digits ? `+${digits}` : "";
  }

  function numberValue(id) {
    const raw = value(id).replace(",", ".").replace(/[^\d.]/g, "");
    const parsed = Number(raw);
    return Number.isFinite(parsed) && raw ? parsed : null;
  }

  function listValue(id) {
    return value(id)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function clearValues(ids) {
    ids.forEach((id) => {
      const field = byId(id);
      if (field) field.value = "";
    });
  }

  function escapeHtml(input) {
    return String(input ?? "").replace(/[&<>"']/g, (char) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[char];
    });
  }

  function listText(items) {
    return Array.isArray(items) && items.length ? items.join(", ") : "-";
  }

  function money(value) {
    return value || value === 0 ? `${value} ₽` : "-";
  }

  function statusText(status) {
    return (
      {
        pending: "ожидает",
        new: "новая",
        accepted: "принята",
        declined: "отклонена",
        cancelled: "отменена",
        done: "завершена",
        open: "открыта",
        closed: "закрыта",
        active: "активно",
        paused: "пауза",
      }[status] ||
      status ||
      "-"
    );
  }

  function matchesSearch(item, search) {
    return !search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
  }

  function card(title, bodyHtml, actionsHtml = "") {
    const article = document.createElement("article");
    article.className = "data-card";
    article.innerHTML = `<h4>${escapeHtml(title)}</h4>${bodyHtml}${actionsHtml}`;
    return article;
  }

  function showEmpty(list, title, text = "Данные появятся здесь после публикации или отклика.") {
    if (!list) return;
    list.innerHTML = "";
    list.appendChild(card(title, `<p>${escapeHtml(text)}</p>`));
  }

  function setBusy(button, busy, text = "Сохраняем...") {
    if (!button) return;
    if (busy) {
      button.dataset.defaultText = button.textContent;
      button.textContent = text;
      button.disabled = true;
    } else {
      button.textContent = button.dataset.defaultText || button.textContent;
      button.disabled = false;
    }
  }

  function errorText(error, duplicateText) {
    if (!error) return "";
    if (error.code === "23505" && duplicateText) return duplicateText;
    return error.message || "Неизвестная ошибка Supabase";
  }

  function normalizePublicRole(role) {
    return publicRoles.includes(role) ? role : "worker";
  }

  function relatedProfile(row, relation = "profiles") {
    const value = row?.[relation];
    return Array.isArray(value) ? value[0] : value || {};
  }

  function displayName(profile, fallback = "-") {
    return profile?.name || profile?.email || fallback;
  }

  function displayPlace(profile) {
    return [profile?.city, profile?.district].filter(Boolean).join(", ");
  }

  function shiftSummary(shift) {
    return [shift?.title, shift?.profession, shift?.city, shift?.date_from].filter(Boolean).join(" / ") || "Смена";
  }

  function fillMainProfileFields(role) {
    if (role === "worker") {
      if (byId("workerName")) byId("workerName").value = state.profile?.name || "";
      if (byId("workerCity")) byId("workerCity").value = state.profile?.city || "";
      if (byId("workerDistrict")) byId("workerDistrict").value = state.profile?.district || "";
      if (byId("workerEmail")) byId("workerEmail").value = state.profile?.email || state.user?.email || "";
      if (byId("workerPhone")) byId("workerPhone").value = state.profile?.phone || state.user?.phone || "";
    }
    if (role === "restaurant") {
      if (byId("restaurantEmail")) byId("restaurantEmail").value = state.profile?.email || state.user?.email || "";
      if (byId("restaurantPhone")) byId("restaurantPhone").value = state.profile?.phone || state.user?.phone || "";
    }
    if (role === "supplier") {
      if (byId("supplierEmail")) byId("supplierEmail").value = state.profile?.email || state.user?.email || "";
      if (byId("supplierPhone")) byId("supplierPhone").value = state.profile?.phone || state.user?.phone || "";
    }
  }

  async function updateMainProfile(payload) {
    const { data, error } = await db
      .from("profiles")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", state.user.id)
      .select("*")
      .maybeSingle();

    if (!error && data) state.profile = data;
    return { error };
  }

  async function saveAdminAccount(payload = {}) {
    if (!state.user || !state.profile) return { error: null };
    const metadata = state.user.user_metadata || {};
    const consentGranted =
      payload.personalDataConsent === true ||
      metadata.personalDataConsent === true ||
      metadata.personalDataConsent === "true";
    const basePayload = {
      user_id: state.user.id,
      role: state.profile.role,
      email: payload.email || state.profile.email || state.user.email || null,
      phone: payload.phone || state.profile.phone || state.user.phone || null,
      name: payload.name || state.profile.name || state.user.email || state.user.phone || "Пользователь",
      city: payload.city || state.profile.city || null,
      auth_provider: state.profile.auth_provider || metadata.auth_provider || (state.user.phone && !state.user.email ? "phone" : "email"),
      status: state.profile.status || "active",
      source: "cabinet",
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
    const result = await db.from("admin_user_accounts").upsert(consentPayload, { onConflict: "user_id" });
    if (result.error && /personal_data_consent|personal_data_consent_date|user_agent|ip_address/i.test(result.error.message || "")) {
      return db.from("admin_user_accounts").upsert(basePayload, { onConflict: "user_id" });
    }
    return result;
  }

  function collectProfile(fields) {
    const payload = {};

    Object.entries(fields).forEach(([fieldId, column]) => {
      const input = byId(fieldId);
      if (!input) return;

      if (input.type === "checkbox") {
        payload[column] = input.checked;
        return;
      }

      const name = fieldId.toLowerCase();
      if (name.includes("cities") || name.includes("professions") || name.includes("days")) {
        payload[column] = listValue(fieldId);
      } else {
        payload[column] = value(fieldId);
      }
    });

    return payload;
  }

  function requireValues(fields, messageTarget) {
    const missing = fields.filter((field) => !value(field.id));
    if (!missing.length) return true;

    setMessage(messageTarget, `Заполните: ${missing.map((field) => field.label).join(", ")}.`);
    byId(missing[0].id)?.focus();
    return false;
  }

  function fillProfile(fields, data) {
    Object.entries(fields).forEach(([fieldId, column]) => {
      const input = byId(fieldId);
      if (!input) return;

      const nextValue = data?.[column];
      if (input.type === "checkbox") {
        input.checked = Boolean(nextValue);
      } else {
        input.value = Array.isArray(nextValue) ? nextValue.join(", ") : nextValue ?? "";
      }
    });
  }

  function showRolePanel(role) {
    Object.values(rolePanels).forEach((panel) => {
      if (panel) panel.style.display = "none";
    });

    if (rolePanels[role]) {
      rolePanels[role].style.display = "block";
    } else if (el.unknownRole) {
      el.unknownRole.style.display = "block";
    }
  }

  async function upsertProfile(table, payload) {
    return db.from(table).upsert(payload, { onConflict: "user_id" });
  }

  async function insertRow(table, payload) {
    return db.from(table).insert(payload);
  }

  async function updateRows(table, filters, payload) {
    let query = db.from(table).update(payload);
    Object.entries(filters).forEach(([key, filterValue]) => {
      query = query.eq(key, filterValue);
    });
    return query;
  }

  async function selectRows(table, filters = {}, options = {}) {
    let query = db.from(table).select(options.select || "*");

    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue !== undefined && filterValue !== null) query = query.eq(key, filterValue);
    });

    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
    }

    if (options.limit) query = query.limit(options.limit);
    return query;
  }

  async function selectRowsWithFallback(table, filters = {}, options = {}) {
    const result = await selectRows(table, filters, options);
    if (!result.error || !options.select || options.select === "*") return result;

    const fallback = await selectRows(table, filters, { ...options, select: "*" });
    if (fallback.error) return result;
    return { ...fallback, warning: result.error.message };
  }

  async function rowExists(table, filters) {
    const { data, error } = await selectRows(table, filters, { select: "id", limit: 1 });
    return { exists: Boolean(data?.length), error };
  }

  async function saveWorkerProfile(event) {
    const button = event?.currentTarget;
    setBusy(button, true);

    const mainProfile = {
      name: value("workerName") || state.profile?.name || state.user.email || "Работник",
      city: value("workerCity"),
      district: value("workerDistrict"),
      email: value("workerEmail") || state.profile?.email || state.user.email || null,
      phone: cleanPhone(value("workerPhone")) || state.profile?.phone || state.user.phone || null,
      auth_provider: state.profile?.auth_provider || (state.user.phone && !state.user.email ? "phone" : "email"),
    };

    const payload = {
      user_id: state.user.id,
      ...collectProfile(profileFields.worker),
      min_rate: numberValue("workerMinRate"),
      travel_radius_km: numberValue("workerTravelRadiusKm"),
      updated_at: new Date().toISOString(),
    };

    const [{ error: mainError }, { error }] = await Promise.all([
      updateMainProfile(mainProfile),
      upsertProfile("worker_profiles", payload),
    ]);
    const { error: adminError } = await saveAdminAccount(mainProfile);
    const errors = [mainError, error, adminError].filter(Boolean);
    setMessage(
      el.workerProfileMessage,
      errors.length
        ? `Ошибка: ${errors.map((item) => item.message).join("; ")}`
        : "Профиль работника сохранен."
    );
    setBusy(button, false);
  }

  async function loadWorkerProfile() {
    fillMainProfileFields("worker");
    const { data, error } = await db
      .from("worker_profiles")
      .select("*")
      .eq("user_id", state.user.id)
      .maybeSingle();

    if (error) return;
    fillProfile(profileFields.worker, data);
    if (byId("workerMinRate")) byId("workerMinRate").value = data?.min_rate ?? "";
    if (byId("workerTravelRadiusKm")) {
      byId("workerTravelRadiusKm").value = data?.travel_radius_km ?? "";
    }
  }

  async function loadShiftPosts() {
    setMessage(el.shiftPostsMessage, "Загружаем смены...");
    const { data, error } = await selectRowsWithFallback(
      "shift_posts",
      { status: "open" },
      {
        select: "*, restaurant:profiles!shift_posts_restaurant_id_fkey(name, city)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.shiftPostsMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.shifts = data || [];
    renderShiftPosts();
  }

  function renderShiftPosts() {
    const search = value("shiftSearchInput");
    const shifts = state.shifts.filter((item) => matchesSearch(item, search));
    const applicationsByShift = new Map(
      state.workerApplications.map((application) => [application.shift_id, application])
    );

    if (!el.shiftPostsList) return;
    el.shiftPostsList.innerHTML = "";

    if (!shifts.length) {
      showEmpty(el.shiftPostsList, "Смен пока нет", "Подходящих смен пока нет.");
      setMessage(el.shiftPostsMessage, "Подходящих смен нет.");
      return;
    }

    shifts.forEach((shift) => {
      const restaurant = relatedProfile(shift, "restaurant");
      const application = applicationsByShift.get(shift.id);
      const node = card(
        shift.title || "Смена",
        `
          <p>Заведение: ${escapeHtml(displayName(restaurant, "не указано"))}</p>
          <p>${escapeHtml(shift.profession || "-")} / ${escapeHtml(shift.city || "-")}</p>
          <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
          <p>Ставка: ${escapeHtml(money(shift.rate))}</p>
          <p>${escapeHtml(shift.requirements || "")}</p>
        `,
        application
          ? `<p class="message">Вы уже откликнулись. Статус: ${escapeHtml(statusText(application.status))}</p>`
          : '<button type="button" data-action="apply-shift">Откликнуться</button><p class="message"></p>'
      );

      node.querySelector("[data-action='apply-shift']")?.addEventListener("click", (event) => {
        applyToShift(shift, node, event.currentTarget);
      });

      el.shiftPostsList.appendChild(node);
    });

    setMessage(el.shiftPostsMessage, `Смен найдено: ${shifts.length}`);
  }

  async function applyToShift(shift, node, button) {
    setBusy(button, true, "Отправляем...");
    const message = node.querySelector(".message");
    const duplicate = await rowExists("shift_applications", {
      shift_id: shift.id,
      worker_id: state.user.id,
    });

    if (duplicate.error) {
      setMessage(message, `Ошибка: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "Вы уже откликались на эту смену.");
      button.textContent = "Отклик уже есть";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("shift_applications", {
      shift_id: shift.id,
      worker_id: state.user.id,
      restaurant_id: shift.restaurant_id,
      message: "Отклик работника",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `Ошибка: ${errorText(error, "вы уже откликались на эту смену")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "Отклик отправлен заведению.");
    button.textContent = "Отклик отправлен";
    button.disabled = true;
    await loadWorkerApplications();
    renderShiftPosts();
  }

  async function loadWorkerApplications() {
    setMessage(el.workerApplicationsMessage, "Загружаем ваши отклики...");
    const { data, error } = await selectRowsWithFallback(
      "shift_applications",
      { worker_id: state.user.id },
      {
        select:
          "*, restaurant:profiles!shift_applications_restaurant_id_fkey(name, city), shift:shift_posts!shift_applications_shift_id_fkey(title, profession, city, district, date_from, time_from, time_to, rate)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.workerApplicationsMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.workerApplications = data || [];
    renderWorkerApplications();
  }

  function renderWorkerApplications() {
    if (!el.workerApplicationsList) return;
    el.workerApplicationsList.innerHTML = "";

    if (!state.workerApplications.length) {
      showEmpty(
        el.workerApplicationsList,
        "Откликов пока нет",
        "Откликнитесь на смену, и статус появится здесь."
      );
      setMessage(el.workerApplicationsMessage, "Откликов пока нет.");
      return;
    }

    state.workerApplications.forEach((application) => {
      const shift = relatedProfile(application, "shift");
      const restaurant = relatedProfile(application, "restaurant");
      el.workerApplicationsList.appendChild(
        card(
          shift.title || "Отклик на смену",
          `
            <p>Заведение: ${escapeHtml(displayName(restaurant, application.restaurant_id))}</p>
            <p>Смена: ${escapeHtml(shift.profession || application.shift_id || "-")} / ${escapeHtml(shift.city || restaurant.city || "-")}</p>
            <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
            <p>Ставка: ${escapeHtml(money(shift.rate))}</p>
            <p>Статус: ${escapeHtml(statusText(application.status))}</p>
            <p>${escapeHtml(application.message || "")}</p>
          `
        )
      );
    });

    setMessage(el.workerApplicationsMessage, `Ваших откликов: ${state.workerApplications.length}`);
  }

  async function loadWorkerInvites() {
    setMessage(el.invitesMessage, "Загружаем приглашения...");
    const { data, error } = await selectRowsWithFallback(
      "shift_invites",
      { worker_id: state.user.id },
      {
        select:
          "*, shift:shift_posts!shift_invites_shift_id_fkey(title, profession, city, date_from, time_from, time_to, rate)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.invitesMessage, `Ошибка: ${error.message}`);
      return;
    }

    renderWorkerInvites(data || []);
  }

  function renderWorkerInvites(invites) {
    if (!el.invitesList) return;
    el.invitesList.innerHTML = "";

    if (!invites.length) {
      showEmpty(el.invitesList, "Приглашений нет", "Входящих приглашений пока нет.");
      setMessage(el.invitesMessage, "Входящих приглашений пока нет.");
      return;
    }

    invites.forEach((invite) => {
      const pending = invite.status === "pending";
      const shift = relatedProfile(invite, "shift");
      const shiftTitle = shiftSummary(shift);
      const node = card(
        shiftTitle,
        `
          <p>Статус: ${escapeHtml(statusText(invite.status))}</p>
          <p>Смена: ${escapeHtml(shift.profession || "-")} / ${escapeHtml(shift.city || "-")}</p>
          <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
          <p>Ставка: ${escapeHtml(money(shift.rate))}</p>
          <p>${escapeHtml(invite.message || "Заведение приглашает вас на смену.")}</p>
        `,
        pending
          ? '<button type="button" data-status="accepted">Принять</button><button class="btn" type="button" data-status="declined">Отклонить</button><p class="message"></p>'
          : '<p class="message">Решение уже сохранено.</p>'
      );

      node.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateInviteStatus(invite.id, button.dataset.status, node);
        });
      });

      el.invitesList.appendChild(node);
    });

    setMessage(el.invitesMessage, `Приглашений: ${invites.length}`);
  }

  async function updateInviteStatus(id, status, node) {
    const buttons = node.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));

    const { error } = await updateRows(
      "shift_invites",
      { id, worker_id: state.user.id },
      { status, updated_at: new Date().toISOString() }
    );

    setMessage(
      node.querySelector(".message"),
      error ? `Ошибка: ${error.message}` : "Решение сохранено."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadWorkerInvites();
  }

  async function saveRestaurantProfile(event) {
    const button = event?.currentTarget;
    if (
      !requireValues(
        [{ id: "restaurantBusinessName", label: "название заведения" }],
        el.restaurantProfileMessage
      )
    ) {
      return;
    }

    setBusy(button, true);

    const profilePayload = collectProfile(profileFields.restaurant);
    const contactPayload = {
      email: profilePayload.email || state.profile?.email || state.user.email || null,
      phone: cleanPhone(profilePayload.phone) || state.profile?.phone || state.user.phone || null,
    };
    const [{ error: mainError }, { error }] = await Promise.all([
      updateMainProfile({
        name:
          profilePayload.business_name ||
          profilePayload.contact_person ||
          state.profile?.name ||
          state.user.email ||
          "Заведение",
        city: profilePayload.city || state.profile?.city || "",
        ...contactPayload,
        auth_provider: state.profile?.auth_provider || (state.user.phone && !state.user.email ? "phone" : "email"),
      }),
      upsertProfile("restaurant_profiles", {
        user_id: state.user.id,
        ...profilePayload,
        ...contactPayload,
        updated_at: new Date().toISOString(),
      }),
    ]);
    const { error: adminError } = await saveAdminAccount({
      name: profilePayload.business_name || profilePayload.contact_person,
      city: profilePayload.city,
      ...contactPayload,
    });
    const errors = [mainError, error, adminError].filter(Boolean);

    setMessage(
      el.restaurantProfileMessage,
      errors.length
        ? `Ошибка: ${errors.map((item) => item.message).join("; ")}`
        : "Профиль заведения сохранен."
    );
    setBusy(button, false);
  }

  async function loadRestaurantProfile() {
    fillMainProfileFields("restaurant");
    const { data } = await db
      .from("restaurant_profiles")
      .select("*")
      .eq("user_id", state.user.id)
      .maybeSingle();
    fillProfile(profileFields.restaurant, data);
  }

  async function createShiftPost(event) {
    const button = event?.currentTarget;
    const title = value("shiftTitle");
    const profession = value("shiftProfession");
    const city = value("shiftCity");

    if (!title || !profession || !city) {
      setMessage(el.shiftPostMessage, "Заполните название смены, профессию и город.");
      return;
    }

    setBusy(button, true, "Публикуем...");
    const { error } = await insertRow("shift_posts", {
      restaurant_id: state.user.id,
      title,
      profession,
      city,
      district: value("shiftDistrict"),
      address: value("shiftAddress"),
      date_from: value("shiftDateFrom") || null,
      time_from: value("shiftTimeFrom") || null,
      time_to: value("shiftTimeTo") || null,
      rate: numberValue("shiftRate"),
      requirements: value("shiftRequirements"),
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setMessage(el.shiftPostMessage, error ? `Ошибка: ${error.message}` : "Смена опубликована.");
    setBusy(button, false);
    if (!error) {
      [
        "shiftTitle",
        "shiftProfession",
        "shiftCity",
        "shiftDistrict",
        "shiftAddress",
        "shiftDateFrom",
        "shiftTimeFrom",
        "shiftTimeTo",
        "shiftRate",
        "shiftRequirements",
      ].forEach((id) => {
        const input = byId(id);
        if (input) input.value = "";
      });
      await Promise.all([loadRestaurantShiftPosts(), loadShiftApplications()]);
    }
  }

  async function loadRestaurantShiftPosts() {
    const { data, error } = await selectRows(
      "shift_posts",
      { restaurant_id: state.user.id },
      { order: { column: "created_at", ascending: false } }
    );

    if (error) {
      setMessage(el.shiftPostMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.restaurantShifts = data || [];
    if (state.workers.length) renderWorkers();
    renderRestaurantShiftPosts();
  }

  function restaurantApplicationCounts() {
    return state.restaurantApplications.reduce((counts, application) => {
      const shiftId = application.shift_id;
      if (!shiftId) return counts;

      const current = counts.get(shiftId) || { total: 0, pending: 0, accepted: 0 };
      current.total += 1;
      if (application.status === "pending") current.pending += 1;
      if (application.status === "accepted") current.accepted += 1;
      counts.set(shiftId, current);
      return counts;
    }, new Map());
  }

  function renderRestaurantShiftPosts() {
    if (!el.restaurantShiftPostsList) return;
    el.restaurantShiftPostsList.innerHTML = "";

    if (!state.restaurantShifts.length) {
      showEmpty(el.restaurantShiftPostsList, "Смены еще не опубликованы");
      return;
    }

    const applicationCounts = restaurantApplicationCounts();

    state.restaurantShifts.forEach((shift) => {
      const counts = applicationCounts.get(shift.id) || { total: 0, pending: 0, accepted: 0 };
      const isOpen = shift.status === "open";
      const node = card(
        shift.title || "Смена",
        `
          <p>${escapeHtml(shift.profession || "-")} / ${escapeHtml(shift.city || "-")}</p>
          <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
          <p>Ставка: ${escapeHtml(money(shift.rate))}</p>
          <p>Статус: ${escapeHtml(statusText(shift.status))}</p>
          <p>Отклики: ${counts.total}, ждут: ${counts.pending}, принято: ${counts.accepted}</p>
        `,
        `
          <button class="btn" type="button" data-action="view-shift-applications">Отклики</button>
          ${
            isOpen
              ? '<button type="button" data-shift-status="closed">Закрыть</button><button class="btn" type="button" data-shift-status="cancelled">Отменить</button>'
              : ""
          }
          <p class="message"></p>
        `
      );

      node.querySelector("[data-action='view-shift-applications']")?.addEventListener("click", async () => {
        await loadShiftApplications(shift.id);
        el.shiftApplicationsList?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      node.querySelectorAll("[data-shift-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateRestaurantShiftStatus(shift.id, button.dataset.shiftStatus, node);
        });
      });

      el.restaurantShiftPostsList.appendChild(node);
    });
  }

  async function updateRestaurantShiftStatus(id, status, node) {
    const buttons = node.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));

    const { error } = await updateRows(
      "shift_posts",
      { id, restaurant_id: state.user.id },
      { status, updated_at: new Date().toISOString() }
    );

    setMessage(
      node.querySelector(".message"),
      error ? `Ошибка: ${error.message}` : "Статус смены обновлен."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await Promise.all([loadRestaurantShiftPosts(), loadShiftApplications(state.restaurantApplicationFilter)]);
  }

  async function loadShiftApplications(filterShiftId = "") {
    const selectedShiftId = typeof filterShiftId === "string" ? filterShiftId : "";
    state.restaurantApplicationFilter = selectedShiftId;
    setMessage(el.shiftPostMessage, "Загружаем отклики работников...");
    const { data, error } = await selectRowsWithFallback(
      "shift_applications",
      { restaurant_id: state.user.id },
      {
        select:
          "*, worker:profiles!shift_applications_worker_id_fkey(name, city, district), shift:shift_posts!shift_applications_shift_id_fkey(title, profession, city, date_from)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.shiftPostMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.restaurantApplications = data || [];
    renderShiftApplications(selectedShiftId);
    if (state.restaurantShifts.length) renderRestaurantShiftPosts();
  }

  function renderShiftApplications(filterShiftId = state.restaurantApplicationFilter) {
    const selectedShiftId = typeof filterShiftId === "string" ? filterShiftId : "";
    state.restaurantApplicationFilter = selectedShiftId;
    const applications = selectedShiftId
      ? state.restaurantApplications.filter((application) => application.shift_id === selectedShiftId)
      : state.restaurantApplications;

    if (!el.shiftApplicationsList) return;
    el.shiftApplicationsList.innerHTML = "";

    if (!applications.length) {
      showEmpty(
        el.shiftApplicationsList,
        selectedShiftId ? "Откликов по этой смене пока нет" : "Откликов работников пока нет"
      );
      setMessage(
        el.shiftPostMessage,
        selectedShiftId ? "Откликов по выбранной смене пока нет." : "Откликов работников пока нет."
      );
      return;
    }

    applications.forEach((application) => {
      const pending = application.status === "pending";
      const worker = relatedProfile(application, "worker");
      const shift = relatedProfile(application, "shift");
      const workerPlace = displayPlace(worker);
      const node = card(
        shift.title || "Отклик работника",
        `<p>Работник: ${escapeHtml(displayName(worker, application.worker_id))}</p><p>${escapeHtml(workerPlace || shift.city || "-")}</p><p>Смена: ${escapeHtml(shift.profession || application.shift_id || "-")}</p><p>Статус: ${escapeHtml(statusText(application.status))}</p><p>${escapeHtml(application.message || "")}</p>`,
        pending
          ? '<button type="button" data-status="accepted">Принять</button><button class="btn" type="button" data-status="declined">Отклонить</button><p class="message"></p>'
          : '<p class="message">Решение уже сохранено.</p>'
      );

      node.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateShiftApplication(application.id, button.dataset.status, node);
        });
      });

      el.shiftApplicationsList.appendChild(node);
    });

    setMessage(
      el.shiftPostMessage,
      selectedShiftId
        ? `Откликов по смене: ${applications.length}`
        : `Откликов работников: ${applications.length}`
    );
  }

  async function updateShiftApplication(id, status, node) {
    const buttons = node.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));

    const { error } = await updateRows(
      "shift_applications",
      { id, restaurant_id: state.user.id },
      { status, updated_at: new Date().toISOString() }
    );

    setMessage(
      node.querySelector(".message"),
      error ? `Ошибка: ${error.message}` : "Решение сохранено."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadShiftApplications(state.restaurantApplicationFilter);
  }

  async function loadWorkers() {
    setMessage(el.workersMessage, "Загружаем анкеты работников...");
    const { data, error } = await selectRowsWithFallback(
      "worker_profiles",
      {},
      {
        select: "*, profile:profiles!worker_profiles_user_id_fkey(name, city, district, is_verified)",
        order: { column: "updated_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.workersMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.workers = data || [];
    renderWorkers();
  }

  function renderWorkers() {
    const search = value("workerSearchInput");
    const workers = state.workers.filter((worker) => matchesSearch(worker, search));

    if (!el.workersList) return;
    el.workersList.innerHTML = "";

    if (!workers.length) {
      showEmpty(el.workersList, "Анкет работников пока нет", "Подходящих анкет нет.");
      setMessage(el.workersMessage, "Подходящих анкет нет.");
      return;
    }

    workers.forEach((worker) => {
      const profile = relatedProfile(worker, "profile");
      const place = displayPlace(profile);
      const professions = listText(worker.professions);
      const openShifts = state.restaurantShifts.filter((shift) => shift.status === "open");
      const shiftOptions = openShifts
        .map((shift) => `<option value="${escapeHtml(shift.id)}">${escapeHtml(shiftSummary(shift))}</option>`)
        .join("");
      const inviteActions = openShifts.length
        ? `<label class="invite-shift-label">Смена<select data-invite-shift>${shiftOptions}</select></label><button type="button" data-action="invite-worker">Пригласить</button><p class="message"></p>`
        : '<p class="message">Сначала опубликуйте открытую смену, чтобы пригласить работника.</p>';
      const node = card(
        displayName(profile, professions === "-" ? "Работник" : professions),
        `
          <p>${escapeHtml(professions)}</p>
          <p>${escapeHtml(place || "Город не указан")}</p>
          <p>${escapeHtml(worker.experience || "Опыт не указан")}</p>
          <p>Дни: ${escapeHtml(listText(worker.available_days))}</p>
          <p>Ставка: ${escapeHtml(money(worker.min_rate))}</p>
          <p>${worker.can_travel ? "Готов к выезду" : "Без выезда"}</p>
        `,
        inviteActions
      );

      node.querySelector("[data-action='invite-worker']")?.addEventListener("click", (event) => {
        inviteWorker(worker, node, event.currentTarget);
      });

      el.workersList.appendChild(node);
    });

    setMessage(el.workersMessage, `Анкет найдено: ${workers.length}`);
  }

  async function inviteWorker(worker, node, button) {
    if (!worker.user_id) {
      setMessage(node.querySelector(".message"), "У анкеты нет user_id, приглашение не отправлено.");
      return;
    }

    setBusy(button, true, "Отправляем...");
    const message = node.querySelector(".message");
    const shiftId = node.querySelector("[data-invite-shift]")?.value || "";
    const shift = state.restaurantShifts.find((item) => item.id === shiftId);
    if (!shiftId || !shift) {
      setMessage(message, "Выберите опубликованную смену для приглашения.");
      setBusy(button, false);
      return;
    }

    const duplicate = await rowExists("shift_invites", {
      restaurant_id: state.user.id,
      worker_id: worker.user_id,
      shift_id: shiftId,
      status: "pending",
    });

    if (duplicate.error) {
      setMessage(message, `Ошибка: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "Активное приглашение этому работнику уже отправлено.");
      button.textContent = "Приглашение уже есть";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("shift_invites", {
      restaurant_id: state.user.id,
      worker_id: worker.user_id,
      shift_id: shiftId,
      message: `Приглашение на смену: ${shiftSummary(shift)}`,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `Ошибка: ${errorText(error, "активное приглашение этому работнику уже отправлено")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "Приглашение отправлено работнику.");
    button.textContent = "Приглашение отправлено";
    button.disabled = true;
    await loadRestaurantInvites();
  }

  async function loadRestaurantInvites() {
    setMessage(el.restaurantInvitesMessage, "Загружаем приглашения...");
    const { data, error } = await selectRowsWithFallback(
      "shift_invites",
      { restaurant_id: state.user.id },
      {
        select:
          "*, shift:shift_posts!shift_invites_shift_id_fkey(title, profession, city, date_from, time_from, time_to, rate)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.restaurantInvitesMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.restaurantInvites = data || [];
    if (!el.restaurantInvitesList) return;
    el.restaurantInvitesList.innerHTML = "";

    if (!state.restaurantInvites.length) {
      showEmpty(el.restaurantInvitesList, "Приглашений пока нет", "Найдите работника и отправьте приглашение.");
      setMessage(el.restaurantInvitesMessage, "Приглашений пока нет.");
      return;
    }

    const workerIds = [...new Set(state.restaurantInvites.map((invite) => invite.worker_id).filter(Boolean))];
    let profilesById = new Map();
    if (workerIds.length) {
      const { data: profiles } = await db.from("profiles").select("id, name, city, district").in("id", workerIds);
      profilesById = new Map((profiles || []).map((profile) => [profile.id, profile]));
    }

    state.restaurantInvites.forEach((invite) => {
      const worker = profilesById.get(invite.worker_id) || {};
      const shift = relatedProfile(invite, "shift");
      el.restaurantInvitesList.appendChild(
        card(
          displayName(worker, "Работник"),
          `<p>Статус: ${escapeHtml(statusText(invite.status))}</p><p>${escapeHtml(displayPlace(worker) || "-")}</p><p>Смена: ${escapeHtml(shiftSummary(shift))}</p><p>${escapeHtml(invite.message || "")}</p>`
        )
      );
    });

    setMessage(el.restaurantInvitesMessage, `Приглашений: ${state.restaurantInvites.length}`);
  }

  async function createSupplyRequest(event) {
    const button = event?.currentTarget;
    const title = value("supplyRequestTitle");

    if (!title) {
      setMessage(el.supplyRequestMessageBox, "Заполните, что нужно заведению.");
      return;
    }

    setBusy(button, true, "Публикуем...");
    const { error } = await insertRow("supply_requests", {
      restaurant_id: state.user.id,
      title,
      category: value("supplyRequestCategory"),
      quantity: value("supplyRequestQuantity"),
      budget: value("supplyRequestBudget"),
      city: value("supplyRequestCity"),
      message: value("supplyRequestMessage"),
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setMessage(
      el.supplyRequestMessageBox,
      error ? `Ошибка: ${error.message}` : "Запрос опубликован для поставщиков."
    );
    setBusy(button, false);
    if (!error) {
      clearValues([
        "supplyRequestTitle",
        "supplyRequestCategory",
        "supplyRequestQuantity",
        "supplyRequestBudget",
        "supplyRequestCity",
        "supplyRequestMessage",
      ]);
      await loadRestaurantSupplyRequests();
    }
  }

  async function loadRestaurantSupplyRequests() {
    setMessage(el.restaurantSupplyRequestsMessage, "Загружаем ваши запросы поставщикам...");
    const { data, error } = await selectRows(
      "supply_requests",
      { restaurant_id: state.user.id },
      { order: { column: "created_at", ascending: false } }
    );

    if (error) {
      setMessage(el.restaurantSupplyRequestsMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.restaurantSupplyRequests = data || [];
    renderRestaurantSupplyRequests();
  }

  function renderRestaurantSupplyRequests() {
    if (!el.restaurantSupplyRequestsList) return;
    el.restaurantSupplyRequestsList.innerHTML = "";
    const responsesByRequest = state.supplierResponses.reduce((counts, response) => {
      const requestId = response.request_id;
      if (!requestId) return counts;
      counts.set(requestId, (counts.get(requestId) || 0) + 1);
      return counts;
    }, new Map());

    if (!state.restaurantSupplyRequests.length) {
      showEmpty(
        el.restaurantSupplyRequestsList,
        "Запросов поставщикам пока нет",
        "Опубликуйте запрос, и он появится у поставщиков в кабинете."
      );
      setMessage(el.restaurantSupplyRequestsMessage, "Запросов поставщикам пока нет.");
      return;
    }

    state.restaurantSupplyRequests.forEach((request) => {
      const isOpen = request.status === "open";
      const responseCount = responsesByRequest.get(request.id) || 0;
      const node = card(
        request.title || "Запрос поставщику",
        `
          <p>Категория: ${escapeHtml(request.category || "-")}</p>
          <p>Количество: ${escapeHtml(request.quantity || "-")}</p>
          <p>Бюджет: ${escapeHtml(request.budget || "-")}</p>
          <p>Город: ${escapeHtml(request.city || "-")}</p>
          <p>Откликов поставщиков: ${escapeHtml(responseCount)}</p>
          <p>Статус: ${escapeHtml(statusText(request.status))}</p>
          <p>${escapeHtml(request.message || "")}</p>
        `,
        isOpen ? '<button class="btn" type="button" data-action="close-supply-request">Закрыть запрос</button><p class="message"></p>' : ""
      );

      node.querySelector("[data-action='close-supply-request']")?.addEventListener("click", () => {
        closeSupplyRequest(request.id, node);
      });

      el.restaurantSupplyRequestsList.appendChild(node);
    });

    setMessage(el.restaurantSupplyRequestsMessage, `Ваших запросов: ${state.restaurantSupplyRequests.length}`);
  }

  async function closeSupplyRequest(id, node) {
    const buttons = node.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));

    const { error } = await updateRows(
      "supply_requests",
      { id, restaurant_id: state.user.id },
      { status: "closed", updated_at: new Date().toISOString() }
    );

    setMessage(
      node.querySelector(".message"),
      error ? `Ошибка: ${error.message}` : "Запрос закрыт."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadRestaurantSupplyRequests();
  }

  async function loadSupplierOffers() {
    setMessage(el.supplyRequestMessageBox, "Загружаем предложения поставщиков...");
    const { data, error } = await selectRowsWithFallback(
      "supplier_offers",
      { status: "active" },
      {
        select: "*, supplier:profiles!supplier_offers_supplier_id_fkey(name, city)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.supplyRequestMessageBox, `Ошибка: ${error.message}`);
      return;
    }

    state.supplierOffers = data || [];
    renderSupplierOffers();
  }

  function renderSupplierOffers() {
    const search = value("supplierOffersSearchInput");
    const offers = state.supplierOffers.filter((offer) => matchesSearch(offer, search));

    if (!el.supplierOffersList) return;
    el.supplierOffersList.innerHTML = "";

    if (!offers.length) {
      showEmpty(el.supplierOffersList, "Предложений поставщиков пока нет");
      return;
    }

    offers.forEach((offer) => {
      const supplier = relatedProfile(offer, "supplier");
      const delivery = listText(offer.delivery_cities);
      const node = card(
        offer.title || "Предложение",
        `
          <p>Поставщик: ${escapeHtml(displayName(supplier, "не указан"))}</p>
          <p>${escapeHtml(offer.category || "-")} / ${escapeHtml(money(offer.price))} ${escapeHtml(offer.unit || "")}</p>
          <p>Минимум: ${escapeHtml(offer.min_order || "-")}</p>
          <p>Доставка: ${escapeHtml(delivery === "-" ? supplier.city || "-" : delivery)}</p>
          <p>${escapeHtml(offer.description || "")}</p>
        `,
        '<button type="button" data-action="send-supplier-inquiry">Отправить запрос</button><p class="message"></p>'
      );

      node.querySelector("[data-action='send-supplier-inquiry']")?.addEventListener("click", (event) => {
        sendSupplierInquiry(offer, node, event.currentTarget);
      });

      el.supplierOffersList.appendChild(node);
    });
  }

  async function sendSupplierInquiry(offer, node, button) {
    setBusy(button, true, "Отправляем...");
    const message = node.querySelector(".message");
    const duplicate = await rowExists("supplier_inquiries", {
      offer_id: offer.id,
      restaurant_id: state.user.id,
    });

    if (duplicate.error) {
      setMessage(message, `Ошибка: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "Запрос по этому предложению уже отправлен.");
      button.textContent = "Запрос уже есть";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("supplier_inquiries", {
      offer_id: offer.id,
      restaurant_id: state.user.id,
      supplier_id: offer.supplier_id,
      message: value("supplyRequestMessage") || "Запрос от заведения",
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `Ошибка: ${errorText(error, "запрос по этому предложению уже отправлен")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "Запрос отправлен поставщику.");
    button.textContent = "Запрос отправлен";
    button.disabled = true;
  }

  async function loadSupplyResponses() {
    setMessage(el.supplyResponsesMessage, "Загружаем отклики поставщиков...");
    const { data, error } = await selectRowsWithFallback(
      "supplier_responses",
      { restaurant_id: state.user.id },
      {
        select:
          "*, supplier:profiles!supplier_responses_supplier_id_fkey(name, city), request:supply_requests!supplier_responses_request_id_fkey(title, category, quantity)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.supplyResponsesMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.supplierResponses = data || [];
    renderSupplyResponses();
    if (state.restaurantSupplyRequests.length) renderRestaurantSupplyRequests();
  }

  function renderSupplyResponses() {
    if (!el.supplyResponsesList) return;
    el.supplyResponsesList.innerHTML = "";

    if (!state.supplierResponses.length) {
      showEmpty(el.supplyResponsesList, "Откликов поставщиков пока нет");
      setMessage(el.supplyResponsesMessage, "Откликов поставщиков пока нет.");
      return;
    }

    state.supplierResponses.forEach((response) => {
      const pending = response.status === "new";
      const supplier = relatedProfile(response, "supplier");
      const request = relatedProfile(response, "request");
      const node = card(
        request.title || "Отклик поставщика",
        `<p>Поставщик: ${escapeHtml(displayName(supplier, response.supplier_id))}</p><p>Запрос: ${escapeHtml(request.category || response.category || "-")} / ${escapeHtml(request.quantity || "-")}</p><p>${escapeHtml(response.message || "")}</p><p>Статус: ${escapeHtml(statusText(response.status))}</p>`,
        pending
          ? '<button type="button" data-status="accepted">Принять</button><button class="btn" type="button" data-status="declined">Отклонить</button><p class="message"></p>'
          : '<p class="message">Решение уже сохранено.</p>'
      );

      node.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateSupplierResponse(response, button.dataset.status, node);
        });
      });

      el.supplyResponsesList.appendChild(node);
    });

    setMessage(el.supplyResponsesMessage, `Откликов: ${state.supplierResponses.length}`);
  }

  async function updateSupplierResponse(response, status, node) {
    const buttons = node.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));
    const responseId = typeof response === "object" ? response.id : response;
    const requestId = typeof response === "object" ? response.request_id : "";

    const { error } = await updateRows(
      "supplier_responses",
      { id: responseId, restaurant_id: state.user.id },
      { status, updated_at: new Date().toISOString() }
    );

    setMessage(
      node.querySelector(".message"),
      error ? `Ошибка: ${error.message}` : "Решение сохранено."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    if (status === "accepted" && requestId) {
      const { error: requestError } = await updateRows(
        "supply_requests",
        { id: requestId, restaurant_id: state.user.id },
        { status: "closed", updated_at: new Date().toISOString() }
      );

      if (requestError) {
        setMessage(
          node.querySelector(".message"),
          `Решение сохранено, но запрос не закрыт: ${requestError.message}`
        );
        buttons.forEach((button) => (button.disabled = false));
        await loadSupplyResponses();
        return;
      }
    }

    await Promise.all([loadSupplyResponses(), loadRestaurantSupplyRequests()]);
  }

  async function saveSupplierProfile(event) {
    const button = event?.currentTarget;
    if (
      !requireValues(
        [{ id: "supplierCompanyName", label: "название компании" }],
        el.supplierProfileMessage
      )
    ) {
      return;
    }

    setBusy(button, true);

    const profilePayload = collectProfile(profileFields.supplier);
    const contactPayload = {
      email: profilePayload.email || state.profile?.email || state.user.email || null,
      phone: cleanPhone(profilePayload.phone) || state.profile?.phone || state.user.phone || null,
    };
    const [{ error: mainError }, { error }] = await Promise.all([
      updateMainProfile({
        name:
          profilePayload.company_name ||
          profilePayload.contact_person ||
          state.profile?.name ||
          state.user.email ||
          "Поставщик",
        city: profilePayload.city || state.profile?.city || "",
        ...contactPayload,
        auth_provider: state.profile?.auth_provider || (state.user.phone && !state.user.email ? "phone" : "email"),
      }),
      upsertProfile("supplier_profiles", {
        user_id: state.user.id,
        ...profilePayload,
        ...contactPayload,
        updated_at: new Date().toISOString(),
      }),
    ]);
    const { error: adminError } = await saveAdminAccount({
      name: profilePayload.company_name || profilePayload.contact_person,
      city: profilePayload.city,
      ...contactPayload,
    });
    const errors = [mainError, error, adminError].filter(Boolean);

    setMessage(
      el.supplierProfileMessage,
      errors.length
        ? `Ошибка: ${errors.map((item) => item.message).join("; ")}`
        : "Профиль поставщика сохранен."
    );
    setBusy(button, false);
  }

  async function loadSupplierProfile() {
    fillMainProfileFields("supplier");
    const { data } = await db
      .from("supplier_profiles")
      .select("*")
      .eq("user_id", state.user.id)
      .maybeSingle();
    fillProfile(profileFields.supplier, data);
  }

  async function createSupplierOffer(event) {
    const button = event?.currentTarget;
    const title = value("supplierOfferTitle");
    const category = value("supplierOfferCategory");

    if (!title || !category) {
      setMessage(el.supplierOfferMessageBox, "Заполните товар/услугу и категорию.");
      return;
    }

    setBusy(button, true, "Публикуем...");
    const { error } = await insertRow("supplier_offers", {
      supplier_id: state.user.id,
      title,
      category,
      product_name: title,
      price: numberValue("supplierOfferPrice"),
      unit: "руб.",
      min_order: value("supplierOfferQuantity"),
      delivery_cities: listValue("supplierOfferCity"),
      description: value("supplierOfferMessage"),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setMessage(
      el.supplierOfferMessageBox,
      error ? `Ошибка: ${error.message}` : "Предложение опубликовано для заведений."
    );
    setBusy(button, false);
    if (!error) await loadSupplierOwnOffers();
  }

  async function loadSupplierOwnOffers() {
    const { data, error } = await selectRows(
      "supplier_offers",
      { supplier_id: state.user.id },
      { order: { column: "created_at", ascending: false } }
    );

    if (error) {
      setMessage(el.supplierOfferMessageBox, `Ошибка: ${error.message}`);
      return;
    }

    state.ownSupplierOffers = data || [];
    renderSupplierOwnOffers();
    if (state.supplierInquiries.length) renderSupplierInquiries();
  }

  function renderSupplierOwnOffers() {
    if (!el.supplierOwnOffersList) return;
    el.supplierOwnOffersList.innerHTML = "";

    if (!state.ownSupplierOffers.length) {
      showEmpty(el.supplierOwnOffersList, "Ваших предложений пока нет");
      return;
    }

    state.ownSupplierOffers.forEach((offer) => {
      const active = offer.status === "active";
      const paused = offer.status === "paused";
      const node = card(
        offer.title || "Предложение",
        `
          <p>${escapeHtml(offer.category || "-")} / ${escapeHtml(money(offer.price))} ${escapeHtml(offer.unit || "")}</p>
          <p>Минимум: ${escapeHtml(offer.min_order || "-")}</p>
          <p>Доставка: ${escapeHtml(listText(offer.delivery_cities))}</p>
          <p>Статус: ${escapeHtml(statusText(offer.status))}</p>
          <p>${escapeHtml(offer.description || "")}</p>
        `,
        `
          <button class="btn" type="button" data-action="view-offer-inquiries">Заявки</button>
          ${active ? '<button type="button" data-offer-status="paused">Пауза</button>' : ""}
          ${paused ? '<button type="button" data-offer-status="active">Активировать</button>' : ""}
          ${
            offer.status !== "closed"
              ? '<button class="btn" type="button" data-offer-status="closed">Закрыть</button>'
              : ""
          }
          <p class="message"></p>
        `
      );

      node.querySelector("[data-action='view-offer-inquiries']")?.addEventListener("click", async () => {
        await loadSupplierInquiries(offer.id);
        el.supplierInquiriesList?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      node.querySelectorAll("[data-offer-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateSupplierOfferStatus(offer.id, button.dataset.offerStatus, node);
        });
      });

      el.supplierOwnOffersList.appendChild(node);
    });
  }

  async function updateSupplierOfferStatus(id, status, node) {
    const buttons = node.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));

    const { error } = await updateRows(
      "supplier_offers",
      { id, supplier_id: state.user.id },
      { status, updated_at: new Date().toISOString() }
    );

    setMessage(
      node.querySelector(".message"),
      error ? `Ошибка: ${error.message}` : "Статус предложения обновлен."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadSupplierOwnOffers();
    if (state.supplierInquiryFilter) await loadSupplierInquiries(state.supplierInquiryFilter);
  }

  async function loadSupplyRequests() {
    setMessage(el.supplierOfferMessageBox, "Загружаем запросы заведений...");
    const { data, error } = await selectRowsWithFallback(
      "supply_requests",
      { status: "open" },
      {
        select: "*, restaurant:profiles!supply_requests_restaurant_id_fkey(name, city)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.supplierOfferMessageBox, `Ошибка: ${error.message}`);
      return;
    }

    state.supplyRequests = data || [];
    renderSupplyRequests();
  }

  function renderSupplyRequests() {
    const search = value("supplyRequestsSearchInput");
    const requests = state.supplyRequests.filter((request) => matchesSearch(request, search));
    const responsesByRequest = new Map(
      state.ownSupplierResponses.map((response) => [response.request_id, response])
    );

    if (!el.supplyRequestsList) return;
    el.supplyRequestsList.innerHTML = "";

    if (!requests.length) {
      showEmpty(el.supplyRequestsList, "Запросов заведений пока нет");
      return;
    }

    requests.forEach((request) => {
      const restaurant = relatedProfile(request, "restaurant");
      const response = responsesByRequest.get(request.id);
      const node = card(
        request.title || "Запрос",
        `
          <p>Заведение: ${escapeHtml(displayName(restaurant, "не указано"))}</p>
          <p>${escapeHtml(request.category || "-")} / ${escapeHtml(request.quantity || "-")}</p>
          <p>Бюджет: ${escapeHtml(request.budget || "-")}</p>
          <p>Город: ${escapeHtml(request.city || restaurant.city || "-")}</p>
          <p>${escapeHtml(request.message || "")}</p>
        `,
        response
          ? `<p class="message">Вы уже откликнулись. Статус: ${escapeHtml(statusText(response.status))}</p>`
          : '<button type="button" data-action="respond-supply-request">Откликнуться</button><p class="message"></p>'
      );

      node.querySelector("[data-action='respond-supply-request']")?.addEventListener("click", (event) => {
        respondToSupplyRequest(request, node, event.currentTarget);
      });

      el.supplyRequestsList.appendChild(node);
    });
  }

  async function respondToSupplyRequest(request, node, button) {
    setBusy(button, true, "Отправляем...");
    const message = node.querySelector(".message");
    const duplicate = await rowExists("supplier_responses", {
      request_id: request.id,
      supplier_id: state.user.id,
    });

    if (duplicate.error) {
      setMessage(message, `Ошибка: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "Вы уже откликались на этот запрос.");
      button.textContent = "Отклик уже есть";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("supplier_responses", {
      request_id: request.id,
      restaurant_id: request.restaurant_id,
      supplier_id: state.user.id,
      category: value("supplierOfferCategory") || request.category,
      message: value("supplierOfferMessage") || "Отклик поставщика",
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `Ошибка: ${errorText(error, "вы уже откликались на этот запрос")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "Отклик отправлен заведению.");
    button.textContent = "Отклик отправлен";
    button.disabled = true;
    await loadSupplierOwnResponses();
    renderSupplyRequests();
  }

  async function loadSupplierOwnResponses() {
    setMessage(el.supplierResponsesMessage, "Загружаем ваши отклики...");
    const { data, error } = await selectRowsWithFallback(
      "supplier_responses",
      { supplier_id: state.user.id },
      {
        select:
          "*, request:supply_requests!supplier_responses_request_id_fkey(title, category, quantity, city), restaurant:profiles!supplier_responses_restaurant_id_fkey(name, city)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.supplierResponsesMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.ownSupplierResponses = data || [];
    renderSupplierOwnResponses();
  }

  function renderSupplierOwnResponses() {
    if (!el.supplierResponsesList) return;
    el.supplierResponsesList.innerHTML = "";

    if (!state.ownSupplierResponses.length) {
      showEmpty(
        el.supplierResponsesList,
        "Откликов на запросы пока нет",
        "Откликнитесь на запрос заведения, и статус появится здесь."
      );
      setMessage(el.supplierResponsesMessage, "Откликов на запросы пока нет.");
      return;
    }

    state.ownSupplierResponses.forEach((response) => {
      const request = relatedProfile(response, "request");
      const restaurant = relatedProfile(response, "restaurant");
      el.supplierResponsesList.appendChild(
        card(
          request.title || "Отклик на запрос",
          `
            <p>Заведение: ${escapeHtml(displayName(restaurant, response.restaurant_id))}</p>
            <p>Запрос: ${escapeHtml(request.category || response.category || "-")} / ${escapeHtml(request.quantity || "-")}</p>
            <p>Город: ${escapeHtml(request.city || restaurant.city || "-")}</p>
            <p>Статус: ${escapeHtml(statusText(response.status))}</p>
            <p>${escapeHtml(response.message || "")}</p>
          `
        )
      );
    });

    setMessage(el.supplierResponsesMessage, `Ваших откликов: ${state.ownSupplierResponses.length}`);
  }

  async function loadSupplierInquiries(filterOfferId = "") {
    const selectedOfferId = typeof filterOfferId === "string" ? filterOfferId : "";
    state.supplierInquiryFilter = selectedOfferId;
    setMessage(el.supplierInquiriesMessage, "Загружаем входящие заявки...");
    const { data, error } = await selectRowsWithFallback(
      "supplier_inquiries",
      { supplier_id: state.user.id },
      {
        select:
          "*, restaurant:profiles!supplier_inquiries_restaurant_id_fkey(name, city), offer:supplier_offers!supplier_inquiries_offer_id_fkey(title, category)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.supplierInquiriesMessage, `Ошибка: ${error.message}`);
      return;
    }

    state.supplierInquiries = data || [];
    renderSupplierInquiries(selectedOfferId);
  }

  function renderSupplierInquiries(filterOfferId = state.supplierInquiryFilter) {
    const selectedOfferId = typeof filterOfferId === "string" ? filterOfferId : "";
    state.supplierInquiryFilter = selectedOfferId;
    const inquiries = selectedOfferId
      ? state.supplierInquiries.filter((inquiry) => inquiry.offer_id === selectedOfferId)
      : state.supplierInquiries;

    if (!el.supplierInquiriesList) return;
    el.supplierInquiriesList.innerHTML = "";

    if (!inquiries.length) {
      showEmpty(
        el.supplierInquiriesList,
        selectedOfferId ? "Заявок по этому предложению пока нет" : "Входящих заявок пока нет"
      );
      setMessage(
        el.supplierInquiriesMessage,
        selectedOfferId ? "Заявок по выбранному предложению пока нет." : "Входящих заявок пока нет."
      );
      return;
    }

    inquiries.forEach((inquiry) => {
      const pending = inquiry.status === "new";
      const restaurant = relatedProfile(inquiry, "restaurant");
      const offer = relatedProfile(inquiry, "offer");
      const node = card(
        offer.title || "Заявка от заведения",
        `<p>Заведение: ${escapeHtml(displayName(restaurant, "не указано"))}</p><p>${escapeHtml(offer.category || "-")}</p><p>${escapeHtml(inquiry.message || "Заведение заинтересовалось предложением.")}</p><p>Статус: ${escapeHtml(statusText(inquiry.status))}</p>`,
        pending
          ? '<button type="button" data-status="accepted">Принять</button><button class="btn" type="button" data-status="declined">Отклонить</button><p class="message"></p>'
          : '<p class="message">Решение уже сохранено.</p>'
      );

      node.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateSupplierInquiry(inquiry.id, button.dataset.status, node);
        });
      });

      el.supplierInquiriesList.appendChild(node);
    });

    setMessage(
      el.supplierInquiriesMessage,
      selectedOfferId ? `Заявок по предложению: ${inquiries.length}` : `Заявок: ${inquiries.length}`
    );
  }

  async function updateSupplierInquiry(id, status, node) {
    const buttons = node.querySelectorAll("button");
    buttons.forEach((button) => (button.disabled = true));

    const { error } = await updateRows(
      "supplier_inquiries",
      { id, supplier_id: state.user.id },
      { status, updated_at: new Date().toISOString() }
    );

    setMessage(
      node.querySelector(".message"),
      error ? `Ошибка: ${error.message}` : "Решение сохранено."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadSupplierInquiries(state.supplierInquiryFilter);
  }

  async function loadAdminData() {
    const tables = [
      "profiles",
      "admin_user_accounts",
      "worker_profiles",
      "restaurant_profiles",
      "supplier_profiles",
      "shift_posts",
      "shift_applications",
      "shift_invites",
      "supplier_offers",
      "supplier_inquiries",
      "supply_requests",
      "supplier_responses",
    ];

    if (!el.adminDataList) return;
    el.adminDataList.innerHTML = "";
    setMessage(el.adminMessage, "Загружаем данные...");

    for (const table of tables) {
      const { data, error } = await db.from(table).select("*").limit(50);
      el.adminDataList.appendChild(
        card(table, `<p>${error ? escapeHtml(error.message) : `Записей в выборке: ${(data || []).length}`}</p>`)
      );
    }

    setMessage(el.adminMessage, "Данные обновлены.");
  }

  async function loadProfile() {
    const { data: sessionData } = await db.auth.getSession();
    const session = sessionData?.session;

    if (!session) {
      window.location.href = "/auth/";
      return null;
    }

    state.user = session.user;

    const { data: existing, error: readError } = await db
      .from("profiles")
      .select("*")
      .eq("id", state.user.id)
      .maybeSingle();

    if (readError) {
      setMessage(el.userInfo, `Ошибка профиля: ${readError.message}`);
      return null;
    }

    if (existing) {
      state.profile = existing;
      await saveAdminAccount(existing);
      return existing;
    }

    const fallbackRole = normalizePublicRole(state.user.user_metadata?.role);
    const metadata = state.user.user_metadata || {};
    const payload = {
      id: state.user.id,
      role: fallbackRole,
      name: metadata.name || state.user.email || state.user.phone || "Пользователь",
      email: state.user.email || metadata.email || null,
      phone: state.user.phone || metadata.phone || null,
      city: metadata.city || null,
      auth_provider: metadata.auth_provider || (state.user.phone && !state.user.email ? "phone" : "email"),
      status: "active",
      updated_at: new Date().toISOString(),
    };

    const { error } = await db.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      setMessage(el.userInfo, `Профиль не создан: ${error.message}`);
      state.profile = payload;
      return payload;
    }

    state.profile = payload;
    await saveAdminAccount(payload);
    return payload;
  }

  async function loadRestaurantWorkspace() {
    await Promise.all([
      loadRestaurantShiftPosts(),
      loadShiftApplications(),
      loadWorkers(),
      loadRestaurantInvites(),
      loadRestaurantSupplyRequests(),
      loadSupplierOffers(),
      loadSupplyResponses(),
    ]);
  }

  async function loadSupplierWorkspace() {
    await Promise.all([loadSupplierOwnOffers(), loadSupplierOwnResponses(), loadSupplierInquiries()]);
    await loadSupplyRequests();
  }

  async function openCabinet(profile) {
    const label = {
      worker: "работник",
      restaurant: "заведение",
      supplier: "поставщик",
      admin: "админ",
    }[profile.role] || profile.role;

    setMessage(el.userInfo, `${state.user.email || profile.name || "Пользователь"} / ${label}`);
    showRolePanel(profile.role);

    if (profile.role === "worker") {
      await loadWorkerProfile();
      await Promise.all([loadWorkerInvites(), loadWorkerApplications()]);
      await loadShiftPosts();
      return;
    }

    if (profile.role === "restaurant") {
      await loadRestaurantProfile();
      await loadRestaurantWorkspace();
      return;
    }

    if (profile.role === "supplier") {
      await loadSupplierProfile();
      await loadSupplierWorkspace();
      return;
    }

    if (profile.role === "admin") {
      await loadAdminData();
    }
  }

  function bindEvents() {
    const onClick = (id, handler) => byId(id)?.addEventListener("click", handler);
    const onInput = (id, handler) => byId(id)?.addEventListener("input", handler);

    onClick("saveWorkerProfileBtn", saveWorkerProfile);
    onClick("loadInvitesBtn", loadWorkerInvites);
    onClick("loadWorkerApplicationsBtn", loadWorkerApplications);
    onClick("loadShiftPostsBtn", loadShiftPosts);
    onInput("shiftSearchInput", renderShiftPosts);

    onClick("saveRestaurantProfileBtn", saveRestaurantProfile);
    onClick("createShiftPostBtn", createShiftPost);
    onClick("loadRestaurantShiftPostsBtn", loadRestaurantShiftPosts);
    onClick("loadShiftApplicationsBtn", loadShiftApplications);
    onClick("loadWorkersBtn", loadWorkers);
    onClick("loadRestaurantInvitesBtn", loadRestaurantInvites);
    onInput("workerSearchInput", renderWorkers);
    onClick("createSupplyRequestBtn", createSupplyRequest);
    onClick("loadRestaurantSupplyRequestsBtn", loadRestaurantSupplyRequests);
    onClick("loadSupplierOffersBtn", loadSupplierOffers);
    onInput("supplierOffersSearchInput", renderSupplierOffers);
    onClick("loadSupplyResponsesBtn", loadSupplyResponses);

    onClick("saveSupplierProfileBtn", saveSupplierProfile);
    onClick("createSupplierOfferBtn", createSupplierOffer);
    onClick("loadSupplierOwnOffersBtn", loadSupplierOwnOffers);
    onClick("loadSupplyRequestsBtn", loadSupplyRequests);
    onClick("loadSupplierResponsesBtn", loadSupplierOwnResponses);
    onInput("supplyRequestsSearchInput", renderSupplyRequests);
    onClick("loadSupplierInquiriesBtn", loadSupplierInquiries);

    onClick("loadAdminDataBtn", loadAdminData);

    el.logoutBtn?.addEventListener("click", async () => {
      await db.auth.signOut();
      window.location.href = "/auth/";
    });
  }

  async function init() {
    if (!db) {
      setMessage(el.userInfo, "Supabase не загрузился. Обновите страницу.");
      return;
    }

    bindEvents();
    const profile = await loadProfile();
    if (profile) await openCabinet(profile);
  }

  init();
})();
