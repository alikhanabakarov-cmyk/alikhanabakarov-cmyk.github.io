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
    "workerReviewsList",
    "workerReviewsMessage",
    "refreshWorkerReviewsBtn",
    "workerAvgRatingNum",
    "workerRatingStars",
    "workerTotalReviewsCount",
    "workerRating5Bar",
    "workerRating5Val",
    "workerRating4Bar",
    "workerRating4Val",
    "workerRating3Bar",
    "workerRating3Val",
    "refreshWorkerEarningsBtn",
    "workerTotalEarned",
    "workerPendingPayout",
    "workerAvgShiftRate",
    "workerCompletedShiftsCount",
    "workerCalcRateInput",
    "workerCalcRateVal",
    "workerCalcShiftsInput",
    "workerCalcShiftsVal",
    "workerCalcTipsCheck",
    "workerCalcNightCheck",
    "workerCalcMonthSum",
    "workerCalcPeriodNote",
    "workerCalcSingleShift",
    "workerCalcWeekSum",
    "workerCalcYearSum",
    "workerPayoutsList",
    "savingsAvgRateBadge",
    "savingsGoalTitleInput",
    "savingsGoalAmountSlider",
    "savingsGoalAmountLabel",
    "savingsCustomAmountRow",
    "savingsCustomPerShiftSlider",
    "savingsCustomPerShiftVal",
    "savingsShiftsPerWeekSlider",
    "savingsShiftsPerWeekLabel",
    "savingsTargetNamePreview",
    "savingsRequiredShifts",
    "savingsTimeEstimateLabel",
    "savingsProgressPaceLabel",
    "savingsProgressTargetLabel",
    "savingsProgressBar",
    "savingsMilestonesLabels",
    "savingsDepositPerShift",
    "savingsDepositPerWeek",
    "savingsDepositPerMonth",
    "savingsTargetDateEstimated",
    "savingsAccelerationTip",
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
    workerReviews: [],
    restaurantReviews: [],
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

  function withTimeout(promise, ms = 6000, label = "Supabase") {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`${label}: превышено время ожидания`)),
        ms,
      );
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
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
    const { data, error } = await withTimeout(
      db
        .from("profiles")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", state.user.id)
        .select("*")
        .maybeSingle(),
      6000,
      "profiles",
    );

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
    const result = await withTimeout(
      db.from("admin_user_accounts").upsert(consentPayload, { onConflict: "user_id" }),
      6000,
      "admin_user_accounts",
    );
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
    return withTimeout(db.from(table).upsert(payload, { onConflict: "user_id" }), 6000, table);
  }

  async function insertRow(table, payload) {
    return withTimeout(db.from(table).insert(payload), 6000, table);
  }

  async function updateRows(table, filters, payload) {
    let query = db.from(table).update(payload);
    Object.entries(filters).forEach(([key, filterValue]) => {
      query = query.eq(key, filterValue);
    });
    return withTimeout(query, 6000, table);
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
    return withTimeout(query, 6000, table);
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

  /* ==========================================================================
     Worker Reviews & Rating System (HoReCa Trust & Reputation)
     ========================================================================== */

  const REVIEWS_STORAGE_KEY = "gc_worker_reviews_store";

  const DEFAULT_WORKER_REVIEWS = [
    {
      id: "rev-seed-1",
      worker_id: "default",
      restaurant_name: "Ресторан «Северяне» (Большая Никитская)",
      restaurant_city: "Москва, ЦАО",
      shift_title: "Повар горячего цеха",
      rating: 5,
      tags: ["⚡️ 100% выход", "🔪 Строго по ТТК", "✨ Идеальная чистота"],
      comment: "Отлично отработал пиковую пятничную смену. Высокая скорость на чеках, безупречная отдача блюд по техкартам, оставил цех в идеальной чистоте. С удовольствием пригласим на постоянные смены!",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "rev-seed-2",
      worker_id: "default",
      restaurant_name: "Гастробар «Loro»",
      restaurant_city: "Москва, Патриаршие",
      shift_title: "Су-шеф / Бригадир смены",
      rating: 5,
      tags: ["🤝 Командная работа", "🔥 Высокая скорость", "🍳 Качество отдачи"],
      comment: "Пунктуальный, дисциплинированный специалист. Без лишних вопросов вошел в процесс, поддержал команду во время наплыва гостей. Рекомендуем заведениям как надежного профессионала.",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "rev-seed-3",
      worker_id: "default",
      restaurant_name: "Итальянский ресторан «Margarita Bistro»",
      restaurant_city: "Москва, Патриаршие пруды",
      shift_title: "Повар холодного цеха / Заготовщик",
      rating: 5,
      tags: ["🔪 Четко по ТТК", "⚡️ Без опозданий"],
      comment: "Очень аккуратная работа с продуктом, правильная нарезка и маркировка. Смену закрыл на отлично.",
      created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    },
    {
      id: "rev-seed-4",
      worker_id: "default",
      restaurant_name: "Кофейня-пекарня «Sapiens»",
      restaurant_city: "Москва, Хамовники",
      shift_title: "Бариста / Помощник кондитера",
      rating: 4,
      tags: ["⚡️ Пунктуальность", "✨ Чистота"],
      comment: "Хорошая смена, быстрая отдача заказов, вежливое отношение к гостям и коллегам.",
      created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
  ];

  function getStoredWorkerReviews() {
    try {
      const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredWorkerReviews(reviews) {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn("Local storage save error:", e);
    }
  }

  function getWorkerReviewsList(workerId) {
    const stored = getStoredWorkerReviews();
    const forWorker = stored.filter((r) => r.worker_id === workerId);
    if (forWorker.length > 0) return forWorker;
    return DEFAULT_WORKER_REVIEWS;
  }

  function findReviewForWorkerShift(workerId, shiftId) {
    const stored = getStoredWorkerReviews();
    return stored.find(
      (r) => r.worker_id === workerId && (shiftId ? r.shift_id === shiftId : true)
    );
  }

  function declOfNum(n, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]
    ];
  }

  function formatReviewDate(isoStr) {
    if (!isoStr) return "Недавно";
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "Недавно";
    }
  }

  async function loadWorkerReviews() {
    setMessage(el.workerReviewsMessage, "Загружаем отзывы от заведений...");

    let dbReviews = [];
    try {
      if (state.user?.id) {
        const { data, error } = await selectRowsWithFallback(
          "worker_reviews",
          { worker_id: state.user.id },
          { order: { column: "created_at", ascending: false } }
        );
        if (!error && Array.isArray(data)) {
          dbReviews = data;
        }
      }
    } catch (err) {
      console.warn("Supabase worker_reviews query error:", err);
    }

    const stored = getStoredWorkerReviews();
    const localReviews = state.user?.id
      ? stored.filter((r) => r.worker_id === state.user.id)
      : [];

    const map = new Map();
    dbReviews.forEach((r) => map.set(r.id, r));
    localReviews.forEach((r) => map.set(r.id, r));

    let finalReviews = Array.from(map.values());
    if (!finalReviews.length) {
      finalReviews = DEFAULT_WORKER_REVIEWS;
    }

    state.workerReviews = finalReviews;
    renderWorkerReviews(finalReviews);
  }

  function renderWorkerReviews(reviews) {
    if (!el.workerReviewsList) return;
    el.workerReviewsList.innerHTML = "";

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    const avg = total > 0 ? (sum / total).toFixed(1) : "5.0";

    const count5 = reviews.filter((r) => Number(r.rating) === 5).length;
    const count4 = reviews.filter((r) => Number(r.rating) === 4).length;
    const count3 = reviews.filter((r) => Number(r.rating) <= 3).length;

    const pct5 = total > 0 ? Math.round((count5 / total) * 100) : 100;
    const pct4 = total > 0 ? Math.round((count4 / total) * 100) : 0;
    const pct3 = total > 0 ? Math.round((count3 / total) * 100) : 0;

    if (el.workerAvgRatingNum) el.workerAvgRatingNum.textContent = avg;
    if (el.workerRatingStars) {
      const rounded = Math.round(Number(avg));
      el.workerRatingStars.textContent = "★".repeat(rounded) + "☆".repeat(5 - rounded);
    }
    if (el.workerTotalReviewsCount) {
      el.workerTotalReviewsCount.textContent = `На основе ${total} ${declOfNum(total, ["отзыва", "отзывов", "отзывов"])}`;
    }

    if (el.workerRating5Bar) el.workerRating5Bar.style.width = `${pct5}%`;
    if (el.workerRating5Val) el.workerRating5Val.textContent = `${pct5}%`;
    if (el.workerRating4Bar) el.workerRating4Bar.style.width = `${pct4}%`;
    if (el.workerRating4Val) el.workerRating4Val.textContent = `${pct4}%`;
    if (el.workerRating3Bar) el.workerRating3Bar.style.width = `${pct3}%`;
    if (el.workerRating3Val) el.workerRating3Val.textContent = `${pct3}%`;

    reviews.forEach((review) => {
      const rawName = review.restaurant_name || "Ресторан Москвы";
      const cleanName = rawName.replace(/^«|»$/g, "");
      const initials = cleanName
        .split(/\s+/)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "GC";

      const ratingNum = Math.min(5, Math.max(1, Number(review.rating) || 5));
      const starsHtml = "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);

      const tags = Array.isArray(review.tags)
        ? review.tags
        : typeof review.tags === "string" && review.tags
        ? review.tags.split(",")
        : [];

      const tagsHtml = tags
        .filter(Boolean)
        .map((t) => `<span class="worker-review-tag">${escapeHtml(t.trim())}</span>`)
        .join("");

      const item = document.createElement("div");
      item.className = "worker-review-item";
      item.innerHTML = `
        <div class="worker-review-item-head">
          <div class="worker-review-author">
            <div class="worker-review-avatar">${escapeHtml(initials)}</div>
            <div>
              <h5 class="worker-review-rest-name">${escapeHtml(rawName)}</h5>
              <div class="worker-review-rest-meta">
                <span>${escapeHtml(review.shift_title || "Смена в заведении")}</span> • 
                <span>${escapeHtml(review.restaurant_city || "Москва")}</span> • 
                <span>${formatReviewDate(review.created_at)}</span>
              </div>
            </div>
          </div>
          <div class="worker-review-score-badge">
            <span style="color: #f59e0b;">${starsHtml}</span> ${ratingNum}.0
          </div>
        </div>
        <blockquote class="worker-review-text">«${escapeHtml(review.comment || "Смена выполнена качественно и в срок.")}»</blockquote>
        ${tagsHtml ? `<div class="worker-review-tags">${tagsHtml}</div>` : ""}
      `;

      el.workerReviewsList.appendChild(item);
    });

    setMessage(el.workerReviewsMessage, `Всего отзывов: ${reviews.length}`);
  }

  /* ==========================================================================
     Worker Earnings, Income Calculator & Payout Tracker
     ========================================================================== */

  const DEFAULT_WORKER_PAYOUTS = [
    {
      id: "pay-1",
      restaurant_name: "Ресторан «Северяне» (Большая Никитская)",
      shift_title: "Повар горячего цеха (12 ч)",
      amount: 5500,
      payout_type: "СБП (Т-Банк)",
      status: "paid",
      status_label: "Выплачено",
      date: "Вчера, 23:15",
    },
    {
      id: "pay-2",
      restaurant_name: "Гастробар «Loro» (Патриаршие)",
      shift_title: "Су-шеф смены (12 ч)",
      amount: 7200,
      payout_type: "СБП (Сбер)",
      status: "paid",
      status_label: "Выплачено",
      date: "3 дня назад",
    },
    {
      id: "pay-3",
      restaurant_name: "Ресторан «Margarita Bistro»",
      shift_title: "Повар ХЦ / Заготовщик (10 ч)",
      amount: 5200,
      payout_type: "Наличные в кассе",
      status: "paid",
      status_label: "Выплачено",
      date: "5 дней назад",
    },
    {
      id: "pay-4",
      restaurant_name: "Кофейня-пекарня «Sapiens» (Хамовники)",
      shift_title: "Бариста / Помощник (10 ч)",
      amount: 4200,
      payout_type: "СБП (Альфа-Банк)",
      status: "paid",
      status_label: "Выплачено",
      date: "12 дней назад",
    },
    {
      id: "pay-5",
      restaurant_name: "Ресторан «Горыныч» (Центральный рынок)",
      shift_title: "Повар ГЦ / Гриль (12 ч)",
      amount: 5500,
      payout_type: "СБП (перевод в конце смены)",
      status: "pending",
      status_label: "Ожидает перевод (сегодня в 23:00)",
      date: "Сегодня",
    },
    {
      id: "pay-6",
      restaurant_name: "Бар «Клава» (Патриаршие)",
      shift_title: "Бармен (10 ч)",
      amount: 6000,
      payout_type: "СБП + Чай",
      status: "pending",
      status_label: "Подтвержденная смена (завтра)",
      date: "Завтра",
    },
  ];

  function formatMoneyRub(num) {
    return `${Number(num || 0).toLocaleString("ru-RU")} ₽`;
  }

  async function loadWorkerEarnings() {
    // 1. Calculate actual payouts from accepted and completed applications
    const workerApps = state.workerApplications || [];
    let completedShiftsCount = 25; // default benchmark
    let totalEarned = 136500;
    let pendingPayout = 16500;
    let avgRate = 5500;

    // If worker profile has min_rate set, sync default rate
    const profileMinRate = Number(state.profile?.min_rate || 0);
    if (profileMinRate > 2000) {
      avgRate = profileMinRate;
    }

    if (workerApps.length > 0) {
      let calcEarned = 0;
      let calcPending = 0;
      let countAccepted = 0;

      workerApps.forEach(app => {
        const shift = relatedProfile(app, "shift") || {};
        const rate = Number(shift.rate) || avgRate;
        if (app.status === "accepted" || app.status === "done") {
          countAccepted++;
          calcEarned += rate;
        } else if (app.status === "pending") {
          calcPending += rate;
        }
      });

      if (countAccepted > 0) {
        completedShiftsCount = countAccepted;
        totalEarned = calcEarned;
        pendingPayout = calcPending;
        avgRate = Math.round(calcEarned / countAccepted);
      }
    }

    if (el.workerTotalEarned) el.workerTotalEarned.textContent = formatMoneyRub(totalEarned);
    if (el.workerPendingPayout) el.workerPendingPayout.textContent = formatMoneyRub(pendingPayout);
    if (el.workerAvgShiftRate) el.workerAvgShiftRate.textContent = formatMoneyRub(avgRate);
    if (el.workerCompletedShiftsCount) el.workerCompletedShiftsCount.textContent = `${completedShiftsCount} ${declOfNum(completedShiftsCount, ["смена", "смены", "смен"])}`;

    renderWorkerPayouts(DEFAULT_WORKER_PAYOUTS);
    recalcWorkerEarnings();
    recalcWorkerSavingsGoal(avgRate);
  }

  function renderWorkerPayouts(payouts) {
    if (!el.workerPayoutsList) return;
    el.workerPayoutsList.innerHTML = "";

    payouts.forEach(p => {
      const isPaid = p.status === "paid";
      const card = document.createElement("div");
      card.className = "payout-item-card";
      card.innerHTML = `
        <div class="payout-item-info">
          <div class="payout-item-title">${escapeHtml(p.restaurant_name)}</div>
          <div class="payout-item-meta">
            <span>${escapeHtml(p.shift_title)}</span> • 
            <span>${escapeHtml(p.date)}</span> • 
            <span>${escapeHtml(p.payout_type)}</span>
          </div>
        </div>
        <div class="payout-item-amount-box">
          <div class="payout-item-sum" style="color: ${isPaid ? '#047857' : '#b45309'};">
            +${formatMoneyRub(p.amount)}
          </div>
          <span class="payout-status-pill ${isPaid ? 'payout-status-paid' : 'payout-status-pending'}">
            ${escapeHtml(p.status_label)}
          </span>
        </div>
      `;
      el.workerPayoutsList.appendChild(card);
    });
  }

  let currentTipsBonus = 0;

  function initWorkerEarningsCalc() {
    // Preset buttons
    const presetContainer = document.getElementById("workerCalcPresets");
    if (presetContainer) {
      presetContainer.querySelectorAll(".calc-preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          presetContainer.querySelectorAll(".calc-preset-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const rate = Number(btn.dataset.rate || 5500);
          const tips = Number(btn.dataset.tips || 0);
          currentTipsBonus = tips;

          if (el.workerCalcRateInput) {
            el.workerCalcRateInput.value = rate;
          }
          if (el.workerCalcTipsCheck) {
            el.workerCalcTipsCheck.checked = tips > 0;
          }
          recalcWorkerEarnings();
        });
      });
    }

    if (el.workerCalcRateInput) {
      el.workerCalcRateInput.addEventListener("input", recalcWorkerEarnings);
    }
    if (el.workerCalcShiftsInput) {
      el.workerCalcShiftsInput.addEventListener("input", recalcWorkerEarnings);
    }
    if (el.workerCalcTipsCheck) {
      el.workerCalcTipsCheck.addEventListener("change", recalcWorkerEarnings);
    }
    if (el.workerCalcNightCheck) {
      el.workerCalcNightCheck.addEventListener("change", recalcWorkerEarnings);
    }
  }

  function recalcWorkerEarnings() {
    const rateInput = el.workerCalcRateInput;
    const shiftsInput = el.workerCalcShiftsInput;
    if (!rateInput || !shiftsInput) return;

    let baseRate = Number(rateInput.value) || 5500;
    const shiftsCount = Number(shiftsInput.value) || 15;
    const isNight = el.workerCalcNightCheck?.checked || false;
    const isTips = el.workerCalcTipsCheck?.checked || false;

    // Display labels
    if (el.workerCalcRateVal) {
      el.workerCalcRateVal.textContent = formatMoneyRub(baseRate);
    }

    let shiftsSubText = `${shiftsCount} ${declOfNum(shiftsCount, ["смена", "смены", "смен"])}`;
    if (shiftsCount === 8) shiftsSubText += " (подработка)";
    else if (shiftsCount === 15) shiftsSubText += " (график 2/2 или 3/3)";
    else if (shiftsCount === 18) shiftsSubText += " (график 4/3)";
    else if (shiftsCount === 22) shiftsSubText += " (график 5/2)";
    else if (shiftsCount === 26) shiftsSubText += " (плотный 6/1)";

    if (el.workerCalcShiftsVal) {
      el.workerCalcShiftsVal.textContent = shiftsSubText;
    }

    // Rate calculations
    let effectiveShiftRate = baseRate;
    if (isNight) {
      effectiveShiftRate = Math.round(effectiveShiftRate * 1.2);
    }
    if (isTips) {
      const tipsVal = currentTipsBonus > 0 ? currentTipsBonus : 2500;
      effectiveShiftRate += tipsVal;
    }

    const monthIncome = effectiveShiftRate * shiftsCount;
    const weekShifts = Math.max(1, Math.min(shiftsCount, Math.round(shiftsCount / 4)));
    const weekIncome = effectiveShiftRate * weekShifts;
    const yearIncome = monthIncome * 12;

    if (el.workerCalcMonthSum) el.workerCalcMonthSum.textContent = formatMoneyRub(monthIncome);
    if (el.workerCalcPeriodNote) el.workerCalcPeriodNote.textContent = `за ${shiftsCount} ${declOfNum(shiftsCount, ["смену", "смены", "смен"])} в месяц на руки`;
    if (el.workerCalcSingleShift) el.workerCalcSingleShift.textContent = formatMoneyRub(effectiveShiftRate);
    if (el.workerCalcWeekSum) el.workerCalcWeekSum.textContent = formatMoneyRub(weekIncome);
    if (el.workerCalcYearSum) el.workerCalcYearSum.textContent = formatMoneyRub(yearIncome);
  }

  /* ==========================================================================
     Worker Savings Goal & Planning Calculator
     ========================================================================== */
  let currentSavingsWorkerAvgRate = 5500;
  let currentSavingsPctMode = 50; // 100, 50, 30, or "custom"

  function initWorkerSavingsGoalCalc() {
    const presetsContainer = document.getElementById("savingsPresetsList");
    if (presetsContainer) {
      presetsContainer.querySelectorAll(".savings-preset-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          presetsContainer.querySelectorAll(".savings-preset-chip").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const title = btn.dataset.title || "Финансовая цель";
          const amount = Number(btn.dataset.amount || 120000);

          if (el.savingsGoalTitleInput) {
            el.savingsGoalTitleInput.value = title;
          }
          if (el.savingsGoalAmountSlider) {
            el.savingsGoalAmountSlider.value = amount;
          }
          recalcWorkerSavingsGoal();
        });
      });
    }

    const modeTabs = document.getElementById("savingsModeTabs");
    if (modeTabs) {
      modeTabs.querySelectorAll(".savings-mode-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          modeTabs.querySelectorAll(".savings-mode-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const mode = btn.dataset.pct;
          if (mode === "custom") {
            currentSavingsPctMode = "custom";
            if (el.savingsCustomAmountRow) el.savingsCustomAmountRow.style.display = "block";
          } else {
            currentSavingsPctMode = Number(mode || 50);
            if (el.savingsCustomAmountRow) el.savingsCustomAmountRow.style.display = "none";
          }
          recalcWorkerSavingsGoal();
        });
      });
    }

    if (el.savingsGoalTitleInput) {
      el.savingsGoalTitleInput.addEventListener("input", () => {
        if (el.savingsTargetNamePreview) {
          el.savingsTargetNamePreview.textContent = el.savingsGoalTitleInput.value.trim() || "Финансовая цель";
        }
      });
    }

    if (el.savingsGoalAmountSlider) {
      el.savingsGoalAmountSlider.addEventListener("input", () => recalcWorkerSavingsGoal());
    }
    if (el.savingsCustomPerShiftSlider) {
      el.savingsCustomPerShiftSlider.addEventListener("input", () => recalcWorkerSavingsGoal());
    }
    if (el.savingsShiftsPerWeekSlider) {
      el.savingsShiftsPerWeekSlider.addEventListener("input", () => recalcWorkerSavingsGoal());
    }
  }

  function recalcWorkerSavingsGoal(forcedAvgRate) {
    if (typeof forcedAvgRate === "number" && forcedAvgRate > 0) {
      currentSavingsWorkerAvgRate = forcedAvgRate;
    }

    const avgRate = currentSavingsWorkerAvgRate || 5500;
    if (el.savingsAvgRateBadge) {
      el.savingsAvgRateBadge.textContent = `${formatMoneyRub(avgRate)} / смена`;
    }

    const goalTitle = el.savingsGoalTitleInput?.value.trim() || "Финансовая цель";
    if (el.savingsTargetNamePreview) {
      el.savingsTargetNamePreview.textContent = goalTitle;
    }

    const targetAmount = Number(el.savingsGoalAmountSlider?.value || 120000);
    if (el.savingsGoalAmountLabel) {
      el.savingsGoalAmountLabel.textContent = formatMoneyRub(targetAmount);
    }

    // Determine deposit per shift
    let depositPerShift = Math.round(avgRate * 0.5);
    if (currentSavingsPctMode === 100) {
      depositPerShift = avgRate;
    } else if (currentSavingsPctMode === 30) {
      depositPerShift = Math.round(avgRate * 0.3);
    } else if (currentSavingsPctMode === "custom") {
      depositPerShift = Number(el.savingsCustomPerShiftSlider?.value || 2500);
    }

    if (el.savingsCustomPerShiftVal) {
      el.savingsCustomPerShiftVal.textContent = formatMoneyRub(depositPerShift);
    }

    // Shifts per week
    const shiftsPerWeek = Number(el.savingsShiftsPerWeekSlider?.value || 4);
    let shiftsPerWeekText = `${shiftsPerWeek} ${declOfNum(shiftsPerWeek, ["смена", "смены", "смен"])}`;
    if (shiftsPerWeek === 1) shiftsPerWeekText += " (разовая подработка)";
    else if (shiftsPerWeek === 2) shiftsPerWeekText += " (выходные дни)";
    else if (shiftsPerWeek === 3) shiftsPerWeekText += " (свободный график)";
    else if (shiftsPerWeek === 4) shiftsPerWeekText += " (график 2/2 или 4/3)";
    else if (shiftsPerWeek === 5) shiftsPerWeekText += " (график 5/2)";
    else if (shiftsPerWeek >= 6) shiftsPerWeekText += " (интенсив 6/1)";

    if (el.savingsShiftsPerWeekLabel) {
      el.savingsShiftsPerWeekLabel.textContent = shiftsPerWeekText;
    }

    depositPerShift = Math.max(100, depositPerShift);
    const requiredShifts = Math.max(1, Math.ceil(targetAmount / depositPerShift));
    const requiredWeeks = Math.max(1, Math.ceil(requiredShifts / shiftsPerWeek));
    const requiredDays = Math.ceil((requiredShifts / shiftsPerWeek) * 7);
    const requiredMonths = (requiredWeeks / 4.33).toFixed(1);

    if (el.savingsRequiredShifts) {
      el.savingsRequiredShifts.textContent = `${requiredShifts} ${declOfNum(requiredShifts, ["смена", "смены", "смен"])}`;
    }

    let timeEstimateStr = "";
    if (requiredWeeks <= 2) {
      timeEstimateStr = `~${requiredDays} ${declOfNum(requiredDays, ["день", "дня", "дней"])} (${requiredWeeks} ${declOfNum(requiredWeeks, ["неделя", "недели", "недель"])})`;
    } else if (requiredWeeks < 8) {
      timeEstimateStr = `~${requiredWeeks} ${declOfNum(requiredWeeks, ["неделя", "недели", "недель"])} (~${requiredMonths} мес)`;
    } else {
      timeEstimateStr = `~${requiredMonths} ${declOfNum(Math.round(Number(requiredMonths)), ["месяц", "месяца", "месяцев"])} (${requiredWeeks} нед.)`;
    }

    if (el.savingsTimeEstimateLabel) {
      el.savingsTimeEstimateLabel.textContent = timeEstimateStr;
    }

    // Financial flows
    const weeklyDeposit = depositPerShift * shiftsPerWeek;
    const monthlyDeposit = Math.round(weeklyDeposit * 4.33);

    if (el.savingsDepositPerShift) el.savingsDepositPerShift.textContent = formatMoneyRub(depositPerShift);
    if (el.savingsDepositPerWeek) el.savingsDepositPerWeek.textContent = formatMoneyRub(weeklyDeposit);
    if (el.savingsDepositPerMonth) el.savingsDepositPerMonth.textContent = formatMoneyRub(monthlyDeposit);

    // Forecast date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + requiredDays);
    const dateFormatted = targetDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (el.savingsTargetDateEstimated) el.savingsTargetDateEstimated.textContent = dateFormatted;

    // Progress bar and labels
    if (el.savingsProgressPaceLabel) {
      el.savingsProgressPaceLabel.textContent = `~${formatMoneyRub(weeklyDeposit)} / нед.`;
    }
    if (el.savingsProgressTargetLabel) {
      el.savingsProgressTargetLabel.textContent = formatMoneyRub(targetAmount);
    }
    if (el.savingsProgressBar) {
      const pacePct = Math.min(100, Math.max(15, Math.round((weeklyDeposit / targetAmount) * 100 * 3)));
      el.savingsProgressBar.style.width = `${pacePct}%`;
    }

    if (el.savingsMilestonesLabels) {
      const q1 = Math.round(targetAmount * 0.25);
      const q2 = Math.round(targetAmount * 0.5);
      const q3 = Math.round(targetAmount * 0.75);
      el.savingsMilestonesLabels.innerHTML = `
        <span>25% (${formatMoneyRub(q1)})</span>
        <span>50% (${formatMoneyRub(q2)})</span>
        <span>75% (${formatMoneyRub(q3)})</span>
      `;
    }

    // Acceleration tip (+1 shift per week)
    if (el.savingsAccelerationTip) {
      const extraShiftsPerWeek = shiftsPerWeek + 1;
      const acceleratedDays = Math.ceil((requiredShifts / extraShiftsPerWeek) * 7);
      const daysSaved = Math.max(1, requiredDays - acceleratedDays);
      el.savingsAccelerationTip.innerHTML = `
        💡 <strong>Ускорение цели:</strong> +1 дополнительная смена в неделю (${extraShiftsPerWeek} вместо ${shiftsPerWeek}) сократит срок накопления на <strong>${daysSaved} ${declOfNum(daysSaved, ["день", "дня", "дней"])}</strong>!
      `;
    }
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
          <button class="btn primary" type="button" data-action="publish-to-telegram" style="background:#229ED9; border-color:#229ED9; color:#fff;">🚀 В Telegram</button>
          ${
            isOpen
              ? '<button type="button" data-shift-status="closed">Закрыть</button><button class="btn" type="button" data-shift-status="cancelled">Отменить</button>'
              : ""
          }
          <p class="message"></p>
        `
      );

      node.querySelector("[data-action='publish-to-telegram']")?.addEventListener("click", () => {
        if (window.fillTelegramPublisherFromShift) {
          window.fillTelegramPublisherFromShift(shift);
        }
      });

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
      const isAccepted = application.status === "accepted";
      const isDone = application.status === "done";
      const worker = relatedProfile(application, "worker");
      const shift = relatedProfile(application, "shift");
      const workerPlace = displayPlace(worker);
      const workerName = displayName(worker, application.worker_id);
      const existingReview = findReviewForWorkerShift(application.worker_id, application.shift_id);

      let actionHtml = "";
      if (pending) {
        actionHtml = `
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button type="button" data-status="accepted" class="btn primary">Принять</button>
            <button class="btn" type="button" data-status="declined">Отклонить</button>
          </div>
          <p class="message"></p>
        `;
      } else {
        actionHtml = `
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:10px;">
            ${isAccepted ? `<button type="button" class="btn primary" data-action="complete-app" style="font-size:13px; padding:6px 12px;">✅ Завершить смену</button>` : `<span class="worker-badge-trust" style="color:#059669;background:#ecfdf5;border-color:#a7f3d0;font-size:11.5px;padding:4px 8px;">✓ Смена завершена</span>`}
            <button type="button" class="btn" data-action="toggle-review-box" style="font-size:13px; padding:6px 12px;">
              ${existingReview ? `⭐️ Отзыв (${existingReview.rating}★) • Изменить` : `⭐️ Оценить работника / Отзыв`}
            </button>
          </div>
          <p class="message"></p>
        `;
      }

      const reviewBoxHtml = `
        <div class="restaurant-review-box" data-review-container style="display: none; margin-top: 14px;">
          <h5 style="margin: 0 0 6px; font-size: 15px; color: var(--green);">⭐️ Оценка работы: ${escapeHtml(workerName)}</h5>
          <p style="margin: 0 0 10px; font-size: 13px; color: #64748b;">Смена: ${escapeHtml(shift.profession || shift.title || "Смена")}</p>
          
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12.5px; font-weight: 750; color: #334155; margin-bottom: 4px;">Ваша оценка смены:</div>
            <div class="rating-stars-input" data-stars-input>
              <button type="button" class="rating-star-btn active" data-rating="1">★</button>
              <button type="button" class="rating-star-btn active" data-rating="2">★</button>
              <button type="button" class="rating-star-btn active" data-rating="3">★</button>
              <button type="button" class="rating-star-btn active" data-rating="4">★</button>
              <button type="button" class="rating-star-btn active" data-rating="5">★</button>
              <span class="rating-score-label" data-score-label>5/5 — Отлично, рекомендуем!</span>
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <div style="font-size: 12.5px; font-weight: 750; color: #334155; margin-bottom: 4px;">Сильные стороны работника:</div>
            <div class="rating-tags-selector" data-tags-selector>
              <button type="button" class="rating-tag-chip active" data-tag="⚡️ Пунктуальность">⚡️ Пунктуальность</button>
              <button type="button" class="rating-tag-chip active" data-tag="🔪 Четко по ТТК">🔪 Четко по ТТК</button>
              <button type="button" class="rating-tag-chip active" data-tag="✨ Чистота станции">✨ Чистота станции</button>
              <button type="button" class="rating-tag-chip" data-tag="🤝 Командная работа">🤝 Командная работа</button>
              <button type="button" class="rating-tag-chip" data-tag="🔥 Высокая скорость">🔥 Высокая скорость</button>
              <button type="button" class="rating-tag-chip" data-tag="🍳 Качество отдачи">🍳 Качество отдачи</button>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="font-size: 12.5px; font-weight: 750; color: #334155; display: block; margin-bottom: 4px;">Текстовый отзыв от заведения:</label>
            <textarea rows="3" data-review-text placeholder="Напишите пару слов: скорость на чеках, аккуратность, пунктуальность, отношение к работе..." style="width: 100%; box-sizing: border-box; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px; font-family: inherit;">${existingReview ? escapeHtml(existingReview.comment) : ""}</textarea>
          </div>

          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn primary" data-action="save-review" style="padding: 7px 16px; font-size: 13.5px;">
              💾 Сохранить отзыв
            </button>
            <button type="button" class="btn" data-action="close-review" style="padding: 7px 14px; font-size: 13px;">
              Скрыть
            </button>
            <span class="message" data-review-msg style="margin: 0; font-size: 13px;"></span>
          </div>
        </div>
      `;

      const node = card(
        shift.title || "Отклик работника",
        `<p>Работник: ${escapeHtml(workerName)}</p><p>${escapeHtml(workerPlace || shift.city || "-")}</p><p>Смена: ${escapeHtml(shift.profession || application.shift_id || "-")}</p><p>Статус: ${escapeHtml(statusText(application.status))}</p><p>${escapeHtml(application.message || "")}</p>`,
        actionHtml + reviewBoxHtml
      );

      // Status buttons (Accept / Decline)
      node.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateShiftApplication(application.id, button.dataset.status, node);
        });
      });

      // Complete shift button
      node.querySelector("[data-action='complete-app']")?.addEventListener("click", async () => {
        await updateShiftApplication(application.id, "done", node);
        // Auto-open review box after finishing shift
        const reviewBox = node.querySelector("[data-review-container]");
        if (reviewBox) reviewBox.style.display = "block";
      });

      // Toggle review box
      const toggleReviewBtn = node.querySelector("[data-action='toggle-review-box']");
      const reviewBox = node.querySelector("[data-review-container]");
      toggleReviewBtn?.addEventListener("click", () => {
        if (!reviewBox) return;
        const isHidden = reviewBox.style.display === "none";
        reviewBox.style.display = isHidden ? "block" : "none";
      });

      node.querySelector("[data-action='close-review']")?.addEventListener("click", () => {
        if (reviewBox) reviewBox.style.display = "none";
      });

      // Interactive Star Rating Logic
      let currentRating = existingReview?.rating || 5;
      const starButtons = node.querySelectorAll("[data-stars-input] .rating-star-btn");
      const scoreLabel = node.querySelector("[data-score-label]");

      const ratingLabels = {
        1: "1/5 — Были серьезные замечания",
        2: "2/5 — Ниже ожиданий заведения",
        3: "3/5 — Нормально, стандартная смена",
        4: "4/5 — Хорошо, качественная работа",
        5: "5/5 — Отлично, рекомендуем коллегам!",
      };

      function updateStarsUI(val) {
        starButtons.forEach((s) => {
          const sVal = Number(s.dataset.rating);
          s.classList.toggle("active", sVal <= val);
        });
        if (scoreLabel) scoreLabel.textContent = ratingLabels[val] || `${val}/5`;
      }

      // Pre-set existing review values if present
      if (existingReview) {
        updateStarsUI(existingReview.rating);
        if (Array.isArray(existingReview.tags)) {
          node.querySelectorAll("[data-tags-selector] .rating-tag-chip").forEach((chip) => {
            chip.classList.toggle("active", existingReview.tags.includes(chip.dataset.tag));
          });
        }
      }

      starButtons.forEach((starBtn) => {
        starBtn.addEventListener("click", () => {
          currentRating = Number(starBtn.dataset.rating);
          updateStarsUI(currentRating);
        });
        starBtn.addEventListener("mouseenter", () => {
          const hoverVal = Number(starBtn.dataset.rating);
          starButtons.forEach((s) => {
            s.classList.toggle("hovered", Number(s.dataset.rating) <= hoverVal);
          });
        });
        starBtn.addEventListener("mouseleave", () => {
          starButtons.forEach((s) => s.classList.remove("hovered"));
        });
      });

      // Tags selection toggle
      node.querySelectorAll("[data-tags-selector] .rating-tag-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          chip.classList.toggle("active");
        });
      });

      // Save Review action
      node.querySelector("[data-action='save-review']")?.addEventListener("click", async (event) => {
        const saveBtn = event.currentTarget;
        setBusy(saveBtn, true, "Сохраняем...");
        const msgEl = node.querySelector("[data-review-msg]");
        const commentInput = node.querySelector("[data-review-text]");
        const comment = (commentInput?.value || "").trim() || "Смена выполнена качественно и в полном соответствии с ТТК.";

        const selectedTags = Array.from(
          node.querySelectorAll("[data-tags-selector] .rating-tag-chip.active")
        ).map((c) => c.dataset.tag);

        const restName =
          state.profile?.business_name ||
          state.profile?.name ||
          state.user?.email ||
          "Ресторан Москвы";

        const reviewPayload = {
          id: existingReview?.id || `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          worker_id: application.worker_id,
          restaurant_id: state.user.id,
          restaurant_name: restName,
          restaurant_city: state.profile?.city || "Москва",
          shift_id: application.shift_id || null,
          shift_title: shift.profession || shift.title || "Смена в заведении",
          rating: currentRating,
          tags: selectedTags,
          comment,
          created_at: existingReview?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // 1. Save to Supabase
        try {
          await insertRow("worker_reviews", reviewPayload);
        } catch (err) {
          console.warn("Supabase worker_reviews insert:", err);
        }

        // 2. Save to local storage store
        const storedReviews = getStoredWorkerReviews();
        const filtered = storedReviews.filter((r) => r.id !== reviewPayload.id && !(r.worker_id === application.worker_id && r.shift_id === application.shift_id));
        filtered.unshift(reviewPayload);
        saveStoredWorkerReviews(filtered);

        setBusy(saveBtn, false);
        setMessage(msgEl, "✅ Отзыв успешно сохранен!");
        if (toggleReviewBtn) {
          toggleReviewBtn.textContent = `⭐️ Отзыв (${currentRating}★) • Изменить`;
        }

        setTimeout(() => {
          setMessage(msgEl, "");
          if (reviewBox) reviewBox.style.display = "none";
        }, 1500);
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

      const workerReviews = getWorkerReviewsList(worker.user_id);
      const avgRating = workerReviews.length
        ? (workerReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / workerReviews.length).toFixed(1)
        : "5.0";
      const reviewsCount = workerReviews.length;

      const workerTitle = `${displayName(profile, professions === "-" ? "Работник" : professions)} <span class="worker-rating-badge-mini">⭐ ${avgRating} (${reviewsCount} ${declOfNum(reviewsCount, ["отзыв", "отзыва", "отзывов"])})</span>`;

      const node = card(
        workerTitle,
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

      // card returns innerHTML so sanitize title handling with HTML is preserved
      node.querySelector("h4").innerHTML = workerTitle;

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
      await Promise.all([loadWorkerInvites(), loadWorkerApplications(), loadWorkerReviews(), loadWorkerEarnings()]);
      await loadShiftPosts();
      await loadWorkerLiveShifts();
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

  // Live Verified Shift Stream for Workers
  state.workerLiveShifts = [];
  state.workerLiveShiftsFilter = {
    search: "",
    role: "all",
    minRate: 0,
    sortBy: "date_desc"
  };

  async function loadWorkerLiveShifts(forceRefresh = false) {
    const list = byId("workerLiveShiftsList");
    const stats = byId("workerShiftStats");
    if (!list) return;

    if (stats) {
      stats.innerHTML = `<span class="tg-feed-stats-text">Загрузка открытых смен...</span>`;
    }

    try {
      const search = value("workerShiftSearch");
      const role = value("workerShiftRoleSelect") || "all";
      const minRate = numberValue("workerShiftMinRate") || 0;
      const sortBy = value("workerShiftSortSelect") || "date_desc";

      const queryParams = new URLSearchParams({
        search,
        role,
        minRate: String(minRate),
        sortBy,
        refresh: forceRefresh ? "true" : "false"
      });

      const res = await fetch(`/api/vacancies?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      state.workerLiveShifts = data.items || [];
      renderWorkerLiveShifts();

      if (stats) {
        stats.innerHTML = `
          <span class="tg-feed-stats-text">
            Найдено проверенных предложений: <strong>${state.workerLiveShifts.length}</strong>
          </span>
          <span class="tg-feed-stats-text" style="color: var(--muted); font-size: 13px;">
            Обновлено: ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
        `;
      }
    } catch (err) {
      console.error("Failed to load worker live shifts:", err);
      if (list) {
        list.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 24px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; text-align: center;">
            <p style="margin: 0 0 12px; color: #f87171;">Не удалось загрузить ленту смен. Попробуйте обновить.</p>
            <button id="retryWorkerShiftsBtn" class="btn" type="button">Повторить попытку</button>
          </div>
        `;
        byId("retryWorkerShiftsBtn")?.addEventListener("click", () => loadWorkerLiveShifts(true));
      }
      if (stats) stats.innerHTML = `<span style="color: #f87171;">Ошибка обновления</span>`;
    }
  }

  function renderWorkerLiveShifts() {
    const list = byId("workerLiveShiftsList");
    if (!list) return;

    const items = state.workerLiveShifts || [];
    if (!items.length) {
      list.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 36px 20px; text-align: center; background: rgba(255,255,255,0.02); border: 1px dashed var(--line); border-radius: 14px;">
          <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
          <h4 style="margin: 0 0 8px; font-size: 18px;">Подходящих смен не найдено</h4>
          <p style="color: var(--muted); margin: 0 0 16px; font-size: 14px;">Попробуйте смягчить фильтры или выбрать другой цех.</p>
          <button id="resetWorkerFiltersBtn" class="btn" type="button">Сбросить фильтры</button>
        </div>
      `;
      byId("resetWorkerFiltersBtn")?.addEventListener("click", () => {
        if (byId("workerShiftSearch")) byId("workerShiftSearch").value = "";
        if (byId("workerShiftRoleSelect")) byId("workerShiftRoleSelect").value = "all";
        if (byId("workerShiftMinRate")) byId("workerShiftMinRate").value = "0";
        if (byId("workerShiftSortSelect")) byId("workerShiftSortSelect").value = "date_desc";
        document.querySelectorAll("#workerCabinet .tg-role-chip").forEach(c => c.classList.toggle("active", c.dataset.role === "all"));
        loadWorkerLiveShifts();
      });
      return;
    }

    list.innerHTML = items.map(job => {
      const isFeatured = job.roleCategory === 'chef' || (job.rateNumeric && job.rateNumeric >= 6000);
      const formattedDate = formatLiveShiftDate(job.date);
      const benefitsHtml = (job.benefits && job.benefits.length > 0)
        ? `<ul class="vacancy-perks-list" style="margin: 12px 0 16px; font-size: 14px;">
            ${job.benefits.slice(0, 4).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>`
        : '';

      const rawTextExcerpt = job.rawText ? job.rawText.slice(0, 180).replace(/\n+/g, ' ') + '...' : '';

      return `
        <article class="vacancy-card ${isFeatured ? 'vacancy-card-featured' : ''}" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px;">
              <span class="vacancy-role-tag">${escapeHtml(job.role || 'Повар')}</span>
              <span style="font-size: 12px; color: var(--muted); white-space: nowrap;">${formattedDate}</span>
            </div>

            <h3 class="vacancy-title" style="font-size: 20px; line-height: 1.35; margin-bottom: 12px;">${escapeHtml(job.title)}</h3>

            <div class="vacancy-rate-box" style="padding: 10px 14px; margin-bottom: 14px;">
              <span class="vacancy-rate-label">Оплата / Смена</span>
              <span class="vacancy-rate-val" style="font-size: 22px;">${escapeHtml(job.rateText)}</span>
            </div>

            <div class="tg-job-meta" style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
              ${job.metro ? `<span class="tg-meta-item">📍 ${escapeHtml(job.metro)}</span>` : ''}
              ${job.schedule ? `<span class="tg-meta-item">⏰ ${escapeHtml(job.schedule)}</span>` : ''}
              <span class="tg-meta-item" style="color: #34d399; background: rgba(52, 211, 153, 0.1);">✓ Проверено</span>
            </div>

            ${benefitsHtml}

            ${rawTextExcerpt ? `
              <details style="margin: 10px 0 14px; font-size: 13px; color: var(--muted);">
                <summary style="cursor: pointer; color: var(--gold); user-select: none;">Показать описание смены</summary>
                <div style="margin-top: 8px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; white-space: pre-wrap; font-size: 13px; line-height: 1.5; color: var(--text);">
                  ${escapeHtml(job.rawText)}
                </div>
              </details>
            ` : ''}
          </div>

          <div class="vacancy-actions" style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px;">
            ${job.contacts && job.contacts.telegram ? `
              <a class="btn primary" href="https://t.me/${job.contacts.telegram.replace(/^@/, '')}" target="_blank" rel="noopener" style="flex: 1 1 auto; text-align: center;">
                💬 Откликнуться в Telegram
              </a>
            ` : ''}
            ${job.contacts && job.contacts.phone ? `
              <a class="btn" href="tel:${job.contacts.phone}" style="flex: 1 1 auto; text-align: center;">
                📞 ${escapeHtml(job.contacts.phone)}
              </a>
            ` : ''}
            ${(!job.contacts || (!job.contacts.telegram && !job.contacts.phone)) ? `
              <span class="tg-meta-item" style="color: var(--muted); font-size: 13px;">Контакты уточняются через поддержку</span>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');
  }

  function formatLiveShiftDate(dateStr) {
    if (!dateStr) return 'Сегодня';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMinutes < 5) return 'Только что';
      if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
      if (diffHours < 24) return `${diffHours} ч. назад`;
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    } catch {
      return 'Свежая';
    }
  }

  // =========================================================
  // GastroConnect B2B HoReCa Marketplace (AgroServer verified)
  // =========================================================
  let b2bSuppliersCache = [];
  let b2bActiveCategory = "all";

  function initB2BSuppliers() {
    const refreshBtn = byId("refreshB2BSuppliersBtn");
    const searchInput = byId("b2bSupplierSearch");
    const minOrderSelect = byId("b2bMinOrderFilter");
    const applyFilterBtn = byId("b2bApplyFilterBtn");
    const categoryChips = document.querySelectorAll("#b2bCategoryChips button");

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => fetchB2BSuppliers());
    }

    if (searchInput) {
      searchInput.addEventListener("input", debounce(() => renderB2BSuppliers(), 250));
    }

    if (minOrderSelect) {
      minOrderSelect.addEventListener("change", () => renderB2BSuppliers());
    }

    if (applyFilterBtn) {
      applyFilterBtn.addEventListener("click", () => renderB2BSuppliers());
    }

    categoryChips.forEach(chip => {
      chip.addEventListener("click", () => {
        categoryChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        b2bActiveCategory = chip.dataset.b2bCat || "all";
        renderB2BSuppliers();
      });
    });

    // Auto-fetch if container exists
    if (byId("b2bSuppliersContainer")) {
      fetchB2BSuppliers();
    }
  }

  async function fetchB2BSuppliers() {
    const msgEl = byId("b2bSuppliersMessage");
    const container = byId("b2bSuppliersContainer");
    if (msgEl) msgEl.textContent = "Загружаем каталог оптовых поставщиков продуктов...";
    
    try {
      const res = await fetch("/api/suppliers");
      const json = await res.json();
      if (json.success && Array.isArray(json.suppliers)) {
        b2bSuppliersCache = json.suppliers;
        if (msgEl) msgEl.textContent = `Доступно ${b2bSuppliersCache.length} проверенных оптовых поставщиков для общепита`;
        renderB2BSuppliers();
      } else {
        if (msgEl) msgEl.textContent = "Не удалось загрузить поставщиков.";
      }
    } catch (e) {
      if (msgEl) msgEl.textContent = "Ошибка при загрузке поставщиков: " + e.message;
    }
  }

  function renderB2BSuppliers() {
    const container = byId("b2bSuppliersContainer");
    const msgEl = byId("b2bSuppliersMessage");
    if (!container) return;

    const query = (byId("b2bSupplierSearch")?.value || "").trim().toLowerCase();
    const minOrderMax = parseInt(byId("b2bMinOrderFilter")?.value || "0", 10);

    let filtered = [...b2bSuppliersCache];

    if (b2bActiveCategory && b2bActiveCategory !== "all") {
      filtered = filtered.filter(s => s.category === b2bActiveCategory);
    }

    if (minOrderMax > 0) {
      filtered = filtered.filter(s => s.min_order_rub <= minOrderMax);
    }

    if (query) {
      filtered = filtered.filter(s => 
        s.company_name.toLowerCase().includes(query) ||
        s.category_label.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        (s.products && s.products.some(p => p.name.toLowerCase().includes(query)))
      );
    }

    if (msgEl) {
      msgEl.textContent = `Найдено поставщиков: ${filtered.length}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; background: #fff; border-radius: 16px; border: 1px dashed var(--line);">
          <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
          <h4 style="margin: 0 0 6px; font-size: 18px; color: var(--ink);">Поставщиков по запросу не найдено</h4>
          <p style="margin: 0; color: #64748b; font-size: 14px;">Попробуйте сбросить фильтры или выбрать другую категорию продуктов.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(supplier => {
      const tgUsername = (supplier.telegram || "").replace(/^@/, "");
      const tgLink = tgUsername ? `https://t.me/${tgUsername}` : "https://t.me/gastroconnect";
      const phoneLink = `tel:${supplier.phone.replace(/[^\d+]/g, "")}`;
      const productsHtml = (supplier.products || []).map(p => `
        <div class="b2b-prod-item">
          <div>
            <div style="font-weight: 750; color: var(--ink);">${escapeHtml(p.name)}</div>
            <div style="font-size: 11.5px; color: #64748b;">${escapeHtml(p.spec || "")}</div>
          </div>
          <div class="b2b-prod-price">${money(p.price)} / ${escapeHtml(p.unit)}</div>
        </div>
      `).join("");

      const badgesHtml = (supplier.badges || []).map(b => `
        <span class="b2b-mini-badge">✓ ${escapeHtml(b)}</span>
      `).join("");

      return `
        <div class="b2b-supplier-card" id="card-${supplier.id}">
          <div class="b2b-card-top">
            <div>
              <div class="b2b-sup-cat">${escapeHtml(supplier.category_label)}</div>
              <h4 class="b2b-sup-name">${escapeHtml(supplier.company_name)}</h4>
              <div style="font-size: 12px; color: #64748b;">Источник: ${escapeHtml(supplier.source)}</div>
            </div>
            <div class="b2b-rating-pill">⭐ ${supplier.rating} (${supplier.reviews_count})</div>
          </div>

          <p class="b2b-sup-desc">${escapeHtml(supplier.description)}</p>

          <div class="b2b-badges-wrap">${badgesHtml}</div>

          <div class="b2b-sup-meta">
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">Мин. заказ:</span>
              <span class="b2b-meta-value">${money(supplier.min_order_rub)}</span>
            </div>
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">График доставки:</span>
              <span class="b2b-meta-value">${escapeHtml(supplier.delivery_schedule)}</span>
            </div>
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">Оплата:</span>
              <span class="b2b-meta-value" style="font-size: 12px;">${escapeHtml(supplier.payment_terms)}</span>
            </div>
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">Склад:</span>
              <span class="b2b-meta-value" style="font-size: 12px;">${escapeHtml(supplier.warehouse)}</span>
            </div>
          </div>

          <button type="button" class="b2b-products-toggle" onclick="
            var list = this.nextElementSibling;
            if (list.classList.contains('expanded')) {
              list.classList.remove('expanded');
              this.innerHTML = '📋 Показать прайс-лист оптовых цен (' + ${supplier.products.length} + ') ▼';
            } else {
              list.classList.add('expanded');
              this.innerHTML = '📋 Скрыть прайс-лист оптовых цен ▲';
            }
          ">
            📋 Показать прайс-лист оптовых цен (${supplier.products.length}) ▼
          </button>
          <div class="b2b-products-list">
            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Прайс-лист для HoReCa (с НДС)</div>
            ${productsHtml}
          </div>

          <div class="b2b-card-actions">
            <div class="b2b-action-row">
              ${supplier.website ? `
                <a href="${escapeHtml(supplier.website)}" target="_blank" rel="noopener" class="b2b-btn-web">
                  🌐 Сайт
                </a>
              ` : ''}
              <a href="${tgLink}" target="_blank" rel="noopener" class="b2b-btn-tg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.93-1.28 4.88-2.12 5.86-2.54 2.79-1.16 3.37-1.36 3.75-1.36.08 0 .28.02.4.12.1.08.13.19.14.27-.01.06.01.24 0 .36z"/></svg>
                Telegram
              </a>
              <a href="${phoneLink}" class="b2b-btn-phone">
                📞 Звонок
              </a>
            </div>
            <button type="button" class="b2b-btn-order" onclick="
              const reqInput = document.getElementById('supplyRequestTitle');
              const catInput = document.getElementById('supplyRequestCategory');
              const cityInput = document.getElementById('supplyRequestCity');
              const msgInput = document.getElementById('supplyRequestMessage');
              if (reqInput) reqInput.value = 'Заказ товаров у ${escapeHtml(supplier.short_name)}';
              if (catInput) catInput.value = '${escapeHtml(supplier.category_label)}';
              if (cityInput) cityInput.value = 'Москва';
              if (msgInput) msgInput.value = 'Здравствуйте! Хотим запросить поставку в наше заведение (${escapeHtml(supplier.company_name)}).';
              document.getElementById('supplyRequestTitle')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              document.getElementById('supplyRequestTitle')?.focus();
            ">
              ⚡️ Оформить заявку через GastroConnect
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  function bindEvents() {
    const onClick = (id, handler) => byId(id)?.addEventListener("click", handler);
    const onInput = (id, handler) => byId(id)?.addEventListener("input", handler);
    const onChange = (id, handler) => byId(id)?.addEventListener("change", handler);

    // Worker Live Shifts Controls
    onClick("refreshWorkerShiftsBtn", () => loadWorkerLiveShifts(true));
    onInput("workerShiftSearch", debounce(() => loadWorkerLiveShifts(), 300));
    onChange("workerShiftRoleSelect", () => {
      const selected = value("workerShiftRoleSelect");
      document.querySelectorAll("#workerCabinet .tg-role-chip").forEach(c => {
        c.classList.toggle("active", c.dataset.role === selected);
      });
      loadWorkerLiveShifts();
    });
    onChange("workerShiftMinRate", () => loadWorkerLiveShifts());
    onChange("workerShiftSortSelect", () => loadWorkerLiveShifts());

    // Worker Role Chips
    document.querySelectorAll("#workerCabinet .tg-role-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#workerCabinet .tg-role-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const role = chip.dataset.role || "all";
        if (byId("workerShiftRoleSelect")) byId("workerShiftRoleSelect").value = role;
        loadWorkerLiveShifts();
      });
    });

    onClick("saveWorkerProfileBtn", saveWorkerProfile);
    onClick("loadInvitesBtn", loadWorkerInvites);
    onClick("loadWorkerApplicationsBtn", loadWorkerApplications);
    onClick("refreshWorkerReviewsBtn", () => loadWorkerReviews());
    onClick("refreshWorkerEarningsBtn", () => loadWorkerEarnings());
    onClick("loadShiftPostsBtn", loadShiftPosts);
    onInput("shiftSearchInput", renderShiftPosts);

    // Initialize Worker Earnings & Savings Goal Calculators
    initWorkerEarningsCalc();
    initWorkerSavingsGoalCalc();

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

    // B2B Verified Suppliers Controller
    initB2BSuppliers();

    el.logoutBtn?.addEventListener("click", async () => {
      await db.auth.signOut();
      window.location.href = "/auth/";
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
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
