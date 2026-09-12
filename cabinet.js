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
    return value || value === 0 ? `${value} â½` : "-";
  }

  function statusText(status) {
    return (
      {
        pending: "Ð¾Ð¶Ð¸Ð´Ð°ÐµÑ",
        new: "Ð½Ð¾Ð²Ð°Ñ",
        accepted: "Ð¿ÑÐ¸Ð½ÑÑÐ°",
        declined: "Ð¾ÑÐºÐ»Ð¾Ð½ÐµÐ½Ð°",
        cancelled: "Ð¾ÑÐ¼ÐµÐ½ÐµÐ½Ð°",
        done: "Ð·Ð°Ð²ÐµÑÑÐµÐ½Ð°",
        open: "Ð¾ÑÐºÑÑÑÐ°",
        closed: "Ð·Ð°ÐºÑÑÑÐ°",
        active: "Ð°ÐºÑÐ¸Ð²Ð½Ð¾",
        paused: "Ð¿Ð°ÑÐ·Ð°",
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

  function showEmpty(list, title, text = "ÐÐ°Ð½Ð½ÑÐµ Ð¿Ð¾ÑÐ²ÑÑÑÑ Ð·Ð´ÐµÑÑ Ð¿Ð¾ÑÐ»Ðµ Ð¿ÑÐ±Ð»Ð¸ÐºÐ°ÑÐ¸Ð¸ Ð¸Ð»Ð¸ Ð¾ÑÐºÐ»Ð¸ÐºÐ°.") {
    if (!list) return;
    list.innerHTML = "";
    list.appendChild(card(title, `<p>${escapeHtml(text)}</p>`));
  }

  function setBusy(button, busy, text = "Ð¡Ð¾ÑÑÐ°Ð½ÑÐµÐ¼...") {
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
    return error.message || "ÐÐµÐ¸Ð·Ð²ÐµÑÑÐ½Ð°Ñ Ð¾ÑÐ¸Ð±ÐºÐ° Supabase";
  }

  function withTimeout(promise, ms = 6000, label = "Supabase") {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`${label}: Ð¿ÑÐµÐ²ÑÑÐµÐ½Ð¾ Ð²ÑÐµÐ¼Ñ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ñ`)),
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
    return [shift?.title, shift?.profession, shift?.city, shift?.date_from].filter(Boolean).join(" / ") || "Ð¡Ð¼ÐµÐ½Ð°";
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
      name: payload.name || state.profile.name || state.user.email || state.user.phone || "ÐÐ¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ",
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

    setMessage(messageTarget, `ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ: ${missing.map((field) => field.label).join(", ")}.`);
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
      name: value("workerName") || state.profile?.name || state.user.email || "Ð Ð°Ð±Ð¾ÑÐ½Ð¸Ðº",
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
        ? `ÐÑÐ¸Ð±ÐºÐ°: ${errors.map((item) => item.message).join("; ")}`
        : "ÐÑÐ¾ÑÐ¸Ð»Ñ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ° ÑÐ¾ÑÑÐ°Ð½ÐµÐ½."
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
    setMessage(el.shiftPostsMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ ÑÐ¼ÐµÐ½Ñ...");
    const { data, error } = await selectRowsWithFallback(
      "shift_posts",
      { status: "open" },
      {
        select: "*, restaurant:profiles!shift_posts_restaurant_id_fkey(name, city)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.shiftPostsMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
      showEmpty(el.shiftPostsList, "Ð¡Ð¼ÐµÐ½ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ", "ÐÐ¾Ð´ÑÐ¾Ð´ÑÑÐ¸Ñ ÑÐ¼ÐµÐ½ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
      setMessage(el.shiftPostsMessage, "ÐÐ¾Ð´ÑÐ¾Ð´ÑÑÐ¸Ñ ÑÐ¼ÐµÐ½ Ð½ÐµÑ.");
      return;
    }

    shifts.forEach((shift) => {
      const restaurant = relatedProfile(shift, "restaurant");
      const application = applicationsByShift.get(shift.id);
      const node = card(
        shift.title || "Ð¡Ð¼ÐµÐ½Ð°",
        `
          <p>ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ: ${escapeHtml(displayName(restaurant, "Ð½Ðµ ÑÐºÐ°Ð·Ð°Ð½Ð¾"))}</p>
          <p>${escapeHtml(shift.profession || "-")} / ${escapeHtml(shift.city || "-")}</p>
          <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
          <p>Ð¡ÑÐ°Ð²ÐºÐ°: ${escapeHtml(money(shift.rate))}</p>
          <p>${escapeHtml(shift.requirements || "")}</p>
        `,
        application
          ? `<p class="message">ÐÑ ÑÐ¶Ðµ Ð¾ÑÐºÐ»Ð¸ÐºÐ½ÑÐ»Ð¸ÑÑ. Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(application.status))}</p>`
          : '<button type="button" data-action="apply-shift">ÐÑÐºÐ»Ð¸ÐºÐ½ÑÑÑÑÑ</button><p class="message"></p>'
      );

      node.querySelector("[data-action='apply-shift']")?.addEventListener("click", (event) => {
        applyToShift(shift, node, event.currentTarget);
      });

      el.shiftPostsList.appendChild(node);
    });

    setMessage(el.shiftPostsMessage, `Ð¡Ð¼ÐµÐ½ Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾: ${shifts.length}`);
  }

  async function applyToShift(shift, node, button) {
    setBusy(button, true, "ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐµÐ¼...");
    const message = node.querySelector(".message");
    const duplicate = await rowExists("shift_applications", {
      shift_id: shift.id,
      worker_id: state.user.id,
    });

    if (duplicate.error) {
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "ÐÑ ÑÐ¶Ðµ Ð¾ÑÐºÐ»Ð¸ÐºÐ°Ð»Ð¸ÑÑ Ð½Ð° ÑÑÑ ÑÐ¼ÐµÐ½Ñ.");
      button.textContent = "ÐÑÐºÐ»Ð¸Ðº ÑÐ¶Ðµ ÐµÑÑÑ";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("shift_applications", {
      shift_id: shift.id,
      worker_id: state.user.id,
      restaurant_id: shift.restaurant_id,
      message: "ÐÑÐºÐ»Ð¸Ðº ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ°",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${errorText(error, "Ð²Ñ ÑÐ¶Ðµ Ð¾ÑÐºÐ»Ð¸ÐºÐ°Ð»Ð¸ÑÑ Ð½Ð° ÑÑÑ ÑÐ¼ÐµÐ½Ñ")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "ÐÑÐºÐ»Ð¸Ðº Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.");
    button.textContent = "ÐÑÐºÐ»Ð¸Ðº Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½";
    button.disabled = true;
    await loadWorkerApplications();
    renderShiftPosts();
  }

  async function loadWorkerApplications() {
    setMessage(el.workerApplicationsMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð²Ð°ÑÐ¸ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸...");
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
      setMessage(el.workerApplicationsMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
        "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ",
        "ÐÑÐºÐ»Ð¸ÐºÐ½Ð¸ÑÐµÑÑ Ð½Ð° ÑÐ¼ÐµÐ½Ñ, Ð¸ ÑÑÐ°ÑÑÑ Ð¿Ð¾ÑÐ²Ð¸ÑÑÑ Ð·Ð´ÐµÑÑ."
      );
      setMessage(el.workerApplicationsMessage, "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
      return;
    }

    state.workerApplications.forEach((application) => {
      const shift = relatedProfile(application, "shift");
      const restaurant = relatedProfile(application, "restaurant");
      el.workerApplicationsList.appendChild(
        card(
          shift.title || "ÐÑÐºÐ»Ð¸Ðº Ð½Ð° ÑÐ¼ÐµÐ½Ñ",
          `
            <p>ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ: ${escapeHtml(displayName(restaurant, application.restaurant_id))}</p>
            <p>Ð¡Ð¼ÐµÐ½Ð°: ${escapeHtml(shift.profession || application.shift_id || "-")} / ${escapeHtml(shift.city || restaurant.city || "-")}</p>
            <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
            <p>Ð¡ÑÐ°Ð²ÐºÐ°: ${escapeHtml(money(shift.rate))}</p>
            <p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(application.status))}</p>
            <p>${escapeHtml(application.message || "")}</p>
          `
        )
      );
    });

    setMessage(el.workerApplicationsMessage, `ÐÐ°ÑÐ¸Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ¾Ð²: ${state.workerApplications.length}`);
  }

  async function loadWorkerInvites() {
    setMessage(el.invitesMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ...");
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
      setMessage(el.invitesMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
      return;
    }

    renderWorkerInvites(data || []);
  }

  function renderWorkerInvites(invites) {
    if (!el.invitesList) return;
    el.invitesList.innerHTML = "";

    if (!invites.length) {
      showEmpty(el.invitesList, "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ð¹ Ð½ÐµÑ", "ÐÑÐ¾Ð´ÑÑÐ¸Ñ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
      setMessage(el.invitesMessage, "ÐÑÐ¾Ð´ÑÑÐ¸Ñ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
      return;
    }

    invites.forEach((invite) => {
      const pending = invite.status === "pending";
      const shift = relatedProfile(invite, "shift");
      const shiftTitle = shiftSummary(shift);
      const node = card(
        shiftTitle,
        `
          <p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(invite.status))}</p>
          <p>Ð¡Ð¼ÐµÐ½Ð°: ${escapeHtml(shift.profession || "-")} / ${escapeHtml(shift.city || "-")}</p>
          <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
          <p>Ð¡ÑÐ°Ð²ÐºÐ°: ${escapeHtml(money(shift.rate))}</p>
          <p>${escapeHtml(invite.message || "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐ°ÐµÑ Ð²Ð°Ñ Ð½Ð° ÑÐ¼ÐµÐ½Ñ.")}</p>
        `,
        pending
          ? '<button type="button" data-status="accepted">ÐÑÐ¸Ð½ÑÑÑ</button><button class="btn" type="button" data-status="declined">ÐÑÐºÐ»Ð¾Ð½Ð¸ÑÑ</button><p class="message"></p>'
          : '<p class="message">Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¶Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾.</p>'
      );

      node.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateInviteStatus(invite.id, button.dataset.status, node);
        });
      });

      el.invitesList.appendChild(node);
    });

    setMessage(el.invitesMessage, `ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ð¹: ${invites.length}`);
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾."
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
      restaurant_name: "Ð ÐµÑÑÐ¾ÑÐ°Ð½ Â«Ð¡ÐµÐ²ÐµÑÑÐ½ÐµÂ» (ÐÐ¾Ð»ÑÑÐ°Ñ ÐÐ¸ÐºÐ¸ÑÑÐºÐ°Ñ)",
      restaurant_city: "ÐÐ¾ÑÐºÐ²Ð°, Ð¦ÐÐ",
      shift_title: "ÐÐ¾Ð²Ð°Ñ Ð³Ð¾ÑÑÑÐµÐ³Ð¾ ÑÐµÑÐ°",
      rating: 5,
      tags: ["â¡ï¸ 100% Ð²ÑÑÐ¾Ð´", "ðª Ð¡ÑÑÐ¾Ð³Ð¾ Ð¿Ð¾ Ð¢Ð¢Ð", "â¨ ÐÐ´ÐµÐ°Ð»ÑÐ½Ð°Ñ ÑÐ¸ÑÑÐ¾ÑÐ°"],
      comment: "ÐÑÐ»Ð¸ÑÐ½Ð¾ Ð¾ÑÑÐ°Ð±Ð¾ÑÐ°Ð» Ð¿Ð¸ÐºÐ¾Ð²ÑÑ Ð¿ÑÑÐ½Ð¸ÑÐ½ÑÑ ÑÐ¼ÐµÐ½Ñ. ÐÑÑÐ¾ÐºÐ°Ñ ÑÐºÐ¾ÑÐ¾ÑÑÑ Ð½Ð° ÑÐµÐºÐ°Ñ, Ð±ÐµÐ·ÑÐ¿ÑÐµÑÐ½Ð°Ñ Ð¾ÑÐ´Ð°ÑÐ° Ð±Ð»ÑÐ´ Ð¿Ð¾ ÑÐµÑÐºÐ°ÑÑÐ°Ð¼, Ð¾ÑÑÐ°Ð²Ð¸Ð» ÑÐµÑ Ð² Ð¸Ð´ÐµÐ°Ð»ÑÐ½Ð¾Ð¹ ÑÐ¸ÑÑÐ¾ÑÐµ. Ð¡ ÑÐ´Ð¾Ð²Ð¾Ð»ÑÑÑÐ²Ð¸ÐµÐ¼ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐ¸Ð¼ Ð½Ð° Ð¿Ð¾ÑÑÐ¾ÑÐ½Ð½ÑÐµ ÑÐ¼ÐµÐ½Ñ!",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "rev-seed-2",
      worker_id: "default",
      restaurant_name: "ÐÐ°ÑÑÑÐ¾Ð±Ð°Ñ Â«LoroÂ»",
      restaurant_city: "ÐÐ¾ÑÐºÐ²Ð°, ÐÐ°ÑÑÐ¸Ð°ÑÑÐ¸Ðµ",
      shift_title: "Ð¡Ñ-ÑÐµÑ / ÐÑÐ¸Ð³Ð°Ð´Ð¸Ñ ÑÐ¼ÐµÐ½Ñ",
      rating: 5,
      tags: ["ð¤ ÐÐ¾Ð¼Ð°Ð½Ð´Ð½Ð°Ñ ÑÐ°Ð±Ð¾ÑÐ°", "ð¥ ÐÑÑÐ¾ÐºÐ°Ñ ÑÐºÐ¾ÑÐ¾ÑÑÑ", "ð³ ÐÐ°ÑÐµÑÑÐ²Ð¾ Ð¾ÑÐ´Ð°ÑÐ¸"],
      comment: "ÐÑÐ½ÐºÑÑÐ°Ð»ÑÐ½ÑÐ¹, Ð´Ð¸ÑÑÐ¸Ð¿Ð»Ð¸Ð½Ð¸ÑÐ¾Ð²Ð°Ð½Ð½ÑÐ¹ ÑÐ¿ÐµÑÐ¸Ð°Ð»Ð¸ÑÑ. ÐÐµÐ· Ð»Ð¸ÑÐ½Ð¸Ñ Ð²Ð¾Ð¿ÑÐ¾ÑÐ¾Ð² Ð²Ð¾ÑÐµÐ» Ð² Ð¿ÑÐ¾ÑÐµÑÑ, Ð¿Ð¾Ð´Ð´ÐµÑÐ¶Ð°Ð» ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ Ð²Ð¾ Ð²ÑÐµÐ¼Ñ Ð½Ð°Ð¿Ð»ÑÐ²Ð° Ð³Ð¾ÑÑÐµÐ¹. Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑÐµÐ¼ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸ÑÐ¼ ÐºÐ°Ðº Ð½Ð°Ð´ÐµÐ¶Ð½Ð¾Ð³Ð¾ Ð¿ÑÐ¾ÑÐµÑÑÐ¸Ð¾Ð½Ð°Ð»Ð°.",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "rev-seed-3",
      worker_id: "default",
      restaurant_name: "ÐÑÐ°Ð»ÑÑÐ½ÑÐºÐ¸Ð¹ ÑÐµÑÑÐ¾ÑÐ°Ð½ Â«Margarita BistroÂ»",
      restaurant_city: "ÐÐ¾ÑÐºÐ²Ð°, ÐÐ°ÑÑÐ¸Ð°ÑÑÐ¸Ðµ Ð¿ÑÑÐ´Ñ",
      shift_title: "ÐÐ¾Ð²Ð°Ñ ÑÐ¾Ð»Ð¾Ð´Ð½Ð¾Ð³Ð¾ ÑÐµÑÐ° / ÐÐ°Ð³Ð¾ÑÐ¾Ð²ÑÐ¸Ðº",
      rating: 5,
      tags: ["ðª Ð§ÐµÑÐºÐ¾ Ð¿Ð¾ Ð¢Ð¢Ð", "â¡ï¸ ÐÐµÐ· Ð¾Ð¿Ð¾Ð·Ð´Ð°Ð½Ð¸Ð¹"],
      comment: "ÐÑÐµÐ½Ñ Ð°ÐºÐºÑÑÐ°ÑÐ½Ð°Ñ ÑÐ°Ð±Ð¾ÑÐ° Ñ Ð¿ÑÐ¾Ð´ÑÐºÑÐ¾Ð¼, Ð¿ÑÐ°Ð²Ð¸Ð»ÑÐ½Ð°Ñ Ð½Ð°ÑÐµÐ·ÐºÐ° Ð¸ Ð¼Ð°ÑÐºÐ¸ÑÐ¾Ð²ÐºÐ°. Ð¡Ð¼ÐµÐ½Ñ Ð·Ð°ÐºÑÑÐ» Ð½Ð° Ð¾ÑÐ»Ð¸ÑÐ½Ð¾.",
      created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    },
    {
      id: "rev-seed-4",
      worker_id: "default",
      restaurant_name: "ÐÐ¾ÑÐµÐ¹Ð½Ñ-Ð¿ÐµÐºÐ°ÑÐ½Ñ Â«SapiensÂ»",
      restaurant_city: "ÐÐ¾ÑÐºÐ²Ð°, Ð¥Ð°Ð¼Ð¾Ð²Ð½Ð¸ÐºÐ¸",
      shift_title: "ÐÐ°ÑÐ¸ÑÑÐ° / ÐÐ¾Ð¼Ð¾ÑÐ½Ð¸Ðº ÐºÐ¾Ð½Ð´Ð¸ÑÐµÑÐ°",
      rating: 4,
      tags: ["â¡ï¸ ÐÑÐ½ÐºÑÑÐ°Ð»ÑÐ½Ð¾ÑÑÑ", "â¨ Ð§Ð¸ÑÑÐ¾ÑÐ°"],
      comment: "Ð¥Ð¾ÑÐ¾ÑÐ°Ñ ÑÐ¼ÐµÐ½Ð°, Ð±ÑÑÑÑÐ°Ñ Ð¾ÑÐ´Ð°ÑÐ° Ð·Ð°ÐºÐ°Ð·Ð¾Ð², Ð²ÐµÐ¶Ð»Ð¸Ð²Ð¾Ðµ Ð¾ÑÐ½Ð¾ÑÐµÐ½Ð¸Ðµ Ðº Ð³Ð¾ÑÑÑÐ¼ Ð¸ ÐºÐ¾Ð»Ð»ÐµÐ³Ð°Ð¼.",
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
    if (!isoStr) return "ÐÐµÐ´Ð°Ð²Ð½Ð¾";
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "ÐÐµÐ´Ð°Ð²Ð½Ð¾";
    }
  }

  async function loadWorkerReviews() {
    setMessage(el.workerReviewsMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð¾ÑÐ·ÑÐ²Ñ Ð¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹...");

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
      el.workerRatingStars.textContent = "â".repeat(rounded) + "â".repeat(5 - rounded);
    }
    if (el.workerTotalReviewsCount) {
      el.workerTotalReviewsCount.textContent = `ÐÐ° Ð¾ÑÐ½Ð¾Ð²Ðµ ${total} ${declOfNum(total, ["Ð¾ÑÐ·ÑÐ²Ð°", "Ð¾ÑÐ·ÑÐ²Ð¾Ð²", "Ð¾ÑÐ·ÑÐ²Ð¾Ð²"])}`;
    }

    if (el.workerRating5Bar) el.workerRating5Bar.style.width = `${pct5}%`;
    if (el.workerRating5Val) el.workerRating5Val.textContent = `${pct5}%`;
    if (el.workerRating4Bar) el.workerRating4Bar.style.width = `${pct4}%`;
    if (el.workerRating4Val) el.workerRating4Val.textContent = `${pct4}%`;
    if (el.workerRating3Bar) el.workerRating3Bar.style.width = `${pct3}%`;
    if (el.workerRating3Val) el.workerRating3Val.textContent = `${pct3}%`;

    reviews.forEach((review) => {
      const rawName = review.restaurant_name || "Ð ÐµÑÑÐ¾ÑÐ°Ð½ ÐÐ¾ÑÐºÐ²Ñ";
      const cleanName = rawName.replace(/^Â«|Â»$/g, "");
      const initials = cleanName
        .split(/\s+/)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "GC";

      const ratingNum = Math.min(5, Math.max(1, Number(review.rating) || 5));
      const starsHtml = "â".repeat(ratingNum) + "â".repeat(5 - ratingNum);

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
                <span>${escapeHtml(review.shift_title || "Ð¡Ð¼ÐµÐ½Ð° Ð² Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¸")}</span> â¢ 
                <span>${escapeHtml(review.restaurant_city || "ÐÐ¾ÑÐºÐ²Ð°")}</span> â¢ 
                <span>${formatReviewDate(review.created_at)}</span>
              </div>
            </div>
          </div>
          <div class="worker-review-score-badge">
            <span style="color: #f59e0b;">${starsHtml}</span> ${ratingNum}.0
          </div>
        </div>
        <blockquote class="worker-review-text">Â«${escapeHtml(review.comment || "Ð¡Ð¼ÐµÐ½Ð° Ð²ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð° ÐºÐ°ÑÐµÑÑÐ²ÐµÐ½Ð½Ð¾ Ð¸ Ð² ÑÑÐ¾Ðº.")}Â»</blockquote>
        ${tagsHtml ? `<div class="worker-review-tags">${tagsHtml}</div>` : ""}
      `;

      el.workerReviewsList.appendChild(item);
    });

    setMessage(el.workerReviewsMessage, `ÐÑÐµÐ³Ð¾ Ð¾ÑÐ·ÑÐ²Ð¾Ð²: ${reviews.length}`);
  }

  /* ==========================================================================
     Worker Earnings, Income Calculator & Payout Tracker
     ========================================================================== */

  const DEFAULT_WORKER_PAYOUTS = [
    {
      id: "pay-1",
      restaurant_name: "Ð ÐµÑÑÐ¾ÑÐ°Ð½ Â«Ð¡ÐµÐ²ÐµÑÑÐ½ÐµÂ» (ÐÐ¾Ð»ÑÑÐ°Ñ ÐÐ¸ÐºÐ¸ÑÑÐºÐ°Ñ)",
      shift_title: "ÐÐ¾Ð²Ð°Ñ Ð³Ð¾ÑÑÑÐµÐ³Ð¾ ÑÐµÑÐ° (12 Ñ)",
      amount: 5500,
      payout_type: "Ð¡ÐÐ (Ð¢-ÐÐ°Ð½Ðº)",
      status: "paid",
      status_label: "ÐÑÐ¿Ð»Ð°ÑÐµÐ½Ð¾",
      date: "ÐÑÐµÑÐ°, 23:15",
    },
    {
      id: "pay-2",
      restaurant_name: "ÐÐ°ÑÑÑÐ¾Ð±Ð°Ñ Â«LoroÂ» (ÐÐ°ÑÑÐ¸Ð°ÑÑÐ¸Ðµ)",
      shift_title: "Ð¡Ñ-ÑÐµÑ ÑÐ¼ÐµÐ½Ñ (12 Ñ)",
      amount: 7200,
      payout_type: "Ð¡ÐÐ (Ð¡Ð±ÐµÑ)",
      status: "paid",
      status_label: "ÐÑÐ¿Ð»Ð°ÑÐµÐ½Ð¾",
      date: "3 Ð´Ð½Ñ Ð½Ð°Ð·Ð°Ð´",
    },
    {
      id: "pay-3",
      restaurant_name: "Ð ÐµÑÑÐ¾ÑÐ°Ð½ Â«Margarita BistroÂ»",
      shift_title: "ÐÐ¾Ð²Ð°Ñ Ð¥Ð¦ / ÐÐ°Ð³Ð¾ÑÐ¾Ð²ÑÐ¸Ðº (10 Ñ)",
      amount: 5200,
      payout_type: "ÐÐ°Ð»Ð¸ÑÐ½ÑÐµ Ð² ÐºÐ°ÑÑÐµ",
      status: "paid",
      status_label: "ÐÑÐ¿Ð»Ð°ÑÐµÐ½Ð¾",
      date: "5 Ð´Ð½ÐµÐ¹ Ð½Ð°Ð·Ð°Ð´",
    },
    {
      id: "pay-4",
      restaurant_name: "ÐÐ¾ÑÐµÐ¹Ð½Ñ-Ð¿ÐµÐºÐ°ÑÐ½Ñ Â«SapiensÂ» (Ð¥Ð°Ð¼Ð¾Ð²Ð½Ð¸ÐºÐ¸)",
      shift_title: "ÐÐ°ÑÐ¸ÑÑÐ° / ÐÐ¾Ð¼Ð¾ÑÐ½Ð¸Ðº (10 Ñ)",
      amount: 4200,
      payout_type: "Ð¡ÐÐ (ÐÐ»ÑÑÐ°-ÐÐ°Ð½Ðº)",
      status: "paid",
      status_label: "ÐÑÐ¿Ð»Ð°ÑÐµÐ½Ð¾",
      date: "12 Ð´Ð½ÐµÐ¹ Ð½Ð°Ð·Ð°Ð´",
    },
    {
      id: "pay-5",
      restaurant_name: "Ð ÐµÑÑÐ¾ÑÐ°Ð½ Â«ÐÐ¾ÑÑÐ½ÑÑÂ» (Ð¦ÐµÐ½ÑÑÐ°Ð»ÑÐ½ÑÐ¹ ÑÑÐ½Ð¾Ðº)",
      shift_title: "ÐÐ¾Ð²Ð°Ñ ÐÐ¦ / ÐÑÐ¸Ð»Ñ (12 Ñ)",
      amount: 5500,
      payout_type: "Ð¡ÐÐ (Ð¿ÐµÑÐµÐ²Ð¾Ð´ Ð² ÐºÐ¾Ð½ÑÐµ ÑÐ¼ÐµÐ½Ñ)",
      status: "pending",
      status_label: "ÐÐ¶Ð¸Ð´Ð°ÐµÑ Ð¿ÐµÑÐµÐ²Ð¾Ð´ (ÑÐµÐ³Ð¾Ð´Ð½Ñ Ð² 23:00)",
      date: "Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ",
    },
    {
      id: "pay-6",
      restaurant_name: "ÐÐ°Ñ Â«ÐÐ»Ð°Ð²Ð°Â» (ÐÐ°ÑÑÐ¸Ð°ÑÑÐ¸Ðµ)",
      shift_title: "ÐÐ°ÑÐ¼ÐµÐ½ (10 Ñ)",
      amount: 6000,
      payout_type: "Ð¡ÐÐ + Ð§Ð°Ð¹",
      status: "pending",
      status_label: "ÐÐ¾Ð´ÑÐ²ÐµÑÐ¶Ð´ÐµÐ½Ð½Ð°Ñ ÑÐ¼ÐµÐ½Ð° (Ð·Ð°Ð²ÑÑÐ°)",
      date: "ÐÐ°Ð²ÑÑÐ°",
    },
  ];

  function formatMoneyRub(num) {
    return `${Number(num || 0).toLocaleString("ru-RU")} â½`;
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
    if (el.workerCompletedShiftsCount) el.workerCompletedShiftsCount.textContent = `${completedShiftsCount} ${declOfNum(completedShiftsCount, ["ÑÐ¼ÐµÐ½Ð°", "ÑÐ¼ÐµÐ½Ñ", "ÑÐ¼ÐµÐ½"])}`;

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
            <span>${escapeHtml(p.shift_title)}</span> â¢ 
            <span>${escapeHtml(p.date)}</span> â¢ 
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

    let shiftsSubText = `${shiftsCount} ${declOfNum(shiftsCount, ["ÑÐ¼ÐµÐ½Ð°", "ÑÐ¼ÐµÐ½Ñ", "ÑÐ¼ÐµÐ½"])}`;
    if (shiftsCount === 8) shiftsSubText += " (Ð¿Ð¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ°)";
    else if (shiftsCount === 15) shiftsSubText += " (Ð³ÑÐ°ÑÐ¸Ðº 2/2 Ð¸Ð»Ð¸ 3/3)";
    else if (shiftsCount === 18) shiftsSubText += " (Ð³ÑÐ°ÑÐ¸Ðº 4/3)";
    else if (shiftsCount === 22) shiftsSubText += " (Ð³ÑÐ°ÑÐ¸Ðº 5/2)";
    else if (shiftsCount === 26) shiftsSubText += " (Ð¿Ð»Ð¾ÑÐ½ÑÐ¹ 6/1)";

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
    if (el.workerCalcPeriodNote) el.workerCalcPeriodNote.textContent = `Ð·Ð° ${shiftsCount} ${declOfNum(shiftsCount, ["ÑÐ¼ÐµÐ½Ñ", "ÑÐ¼ÐµÐ½Ñ", "ÑÐ¼ÐµÐ½"])} Ð² Ð¼ÐµÑÑÑ Ð½Ð° ÑÑÐºÐ¸`;
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
          const title = btn.dataset.title || "Ð¤Ð¸Ð½Ð°Ð½ÑÐ¾Ð²Ð°Ñ ÑÐµÐ»Ñ";
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
          el.savingsTargetNamePreview.textContent = el.savingsGoalTitleInput.value.trim() || "Ð¤Ð¸Ð½Ð°Ð½ÑÐ¾Ð²Ð°Ñ ÑÐµÐ»Ñ";
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
      el.savingsAvgRateBadge.textContent = `${formatMoneyRub(avgRate)} / ÑÐ¼ÐµÐ½Ð°`;
    }

    const goalTitle = el.savingsGoalTitleInput?.value.trim() || "Ð¤Ð¸Ð½Ð°Ð½ÑÐ¾Ð²Ð°Ñ ÑÐµÐ»Ñ";
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
    let shiftsPerWeekText = `${shiftsPerWeek} ${declOfNum(shiftsPerWeek, ["ÑÐ¼ÐµÐ½Ð°", "ÑÐ¼ÐµÐ½Ñ", "ÑÐ¼ÐµÐ½"])}`;
    if (shiftsPerWeek === 1) shiftsPerWeekText += " (ÑÐ°Ð·Ð¾Ð²Ð°Ñ Ð¿Ð¾Ð´ÑÐ°Ð±Ð¾ÑÐºÐ°)";
    else if (shiftsPerWeek === 2) shiftsPerWeekText += " (Ð²ÑÑÐ¾Ð´Ð½ÑÐµ Ð´Ð½Ð¸)";
    else if (shiftsPerWeek === 3) shiftsPerWeekText += " (ÑÐ²Ð¾Ð±Ð¾Ð´Ð½ÑÐ¹ Ð³ÑÐ°ÑÐ¸Ðº)";
    else if (shiftsPerWeek === 4) shiftsPerWeekText += " (Ð³ÑÐ°ÑÐ¸Ðº 2/2 Ð¸Ð»Ð¸ 4/3)";
    else if (shiftsPerWeek === 5) shiftsPerWeekText += " (Ð³ÑÐ°ÑÐ¸Ðº 5/2)";
    else if (shiftsPerWeek >= 6) shiftsPerWeekText += " (Ð¸Ð½ÑÐµÐ½ÑÐ¸Ð² 6/1)";

    if (el.savingsShiftsPerWeekLabel) {
      el.savingsShiftsPerWeekLabel.textContent = shiftsPerWeekText;
    }

    depositPerShift = Math.max(100, depositPerShift);
    const requiredShifts = Math.max(1, Math.ceil(targetAmount / depositPerShift));
    const requiredWeeks = Math.max(1, Math.ceil(requiredShifts / shiftsPerWeek));
    const requiredDays = Math.ceil((requiredShifts / shiftsPerWeek) * 7);
    const requiredMonths = (requiredWeeks / 4.33).toFixed(1);

    if (el.savingsRequiredShifts) {
      el.savingsRequiredShifts.textContent = `${requiredShifts} ${declOfNum(requiredShifts, ["ÑÐ¼ÐµÐ½Ð°", "ÑÐ¼ÐµÐ½Ñ", "ÑÐ¼ÐµÐ½"])}`;
    }

    let timeEstimateStr = "";
    if (requiredWeeks <= 2) {
      timeEstimateStr = `~${requiredDays} ${declOfNum(requiredDays, ["Ð´ÐµÐ½Ñ", "Ð´Ð½Ñ", "Ð´Ð½ÐµÐ¹"])} (${requiredWeeks} ${declOfNum(requiredWeeks, ["Ð½ÐµÐ´ÐµÐ»Ñ", "Ð½ÐµÐ´ÐµÐ»Ð¸", "Ð½ÐµÐ´ÐµÐ»Ñ"])})`;
    } else if (requiredWeeks < 8) {
      timeEstimateStr = `~${requiredWeeks} ${declOfNum(requiredWeeks, ["Ð½ÐµÐ´ÐµÐ»Ñ", "Ð½ÐµÐ´ÐµÐ»Ð¸", "Ð½ÐµÐ´ÐµÐ»Ñ"])} (~${requiredMonths} Ð¼ÐµÑ)`;
    } else {
      timeEstimateStr = `~${requiredMonths} ${declOfNum(Math.round(Number(requiredMonths)), ["Ð¼ÐµÑÑÑ", "Ð¼ÐµÑÑÑÐ°", "Ð¼ÐµÑÑÑÐµÐ²"])} (${requiredWeeks} Ð½ÐµÐ´.)`;
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
      el.savingsProgressPaceLabel.textContent = `~${formatMoneyRub(weeklyDeposit)} / Ð½ÐµÐ´.`;
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
        ð¡ <strong>Ð£ÑÐºÐ¾ÑÐµÐ½Ð¸Ðµ ÑÐµÐ»Ð¸:</strong> +1 Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸ÑÐµÐ»ÑÐ½Ð°Ñ ÑÐ¼ÐµÐ½Ð° Ð² Ð½ÐµÐ´ÐµÐ»Ñ (${extraShiftsPerWeek} Ð²Ð¼ÐµÑÑÐ¾ ${shiftsPerWeek}) ÑÐ¾ÐºÑÐ°ÑÐ¸Ñ ÑÑÐ¾Ðº Ð½Ð°ÐºÐ¾Ð¿Ð»ÐµÐ½Ð¸Ñ Ð½Ð° <strong>${daysSaved} ${declOfNum(daysSaved, ["Ð´ÐµÐ½Ñ", "Ð´Ð½Ñ", "Ð´Ð½ÐµÐ¹"])}</strong>!
      `;
    }
  }

  async function saveRestaurantProfile(event) {
    const button = event?.currentTarget;
    if (
      !requireValues(
        [{ id: "restaurantBusinessName", label: "Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ" }],
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
          "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ",
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
        ? `ÐÑÐ¸Ð±ÐºÐ°: ${errors.map((item) => item.message).join("; ")}`
        : "ÐÑÐ¾ÑÐ¸Ð»Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½."
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
      setMessage(el.shiftPostMessage, "ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ ÑÐ¼ÐµÐ½Ñ, Ð¿ÑÐ¾ÑÐµÑÑÐ¸Ñ Ð¸ Ð³Ð¾ÑÐ¾Ð´.");
      return;
    }

    setBusy(button, true, "ÐÑÐ±Ð»Ð¸ÐºÑÐµÐ¼...");
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

    setMessage(el.shiftPostMessage, error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "Ð¡Ð¼ÐµÐ½Ð° Ð¾Ð¿ÑÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð°.");
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
      setMessage(el.shiftPostMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
      showEmpty(el.restaurantShiftPostsList, "Ð¡Ð¼ÐµÐ½Ñ ÐµÑÐµ Ð½Ðµ Ð¾Ð¿ÑÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ñ");
      return;
    }

    const applicationCounts = restaurantApplicationCounts();

    state.restaurantShifts.forEach((shift) => {
      const counts = applicationCounts.get(shift.id) || { total: 0, pending: 0, accepted: 0 };
      const isOpen = shift.status === "open";
      const node = card(
        shift.title || "Ð¡Ð¼ÐµÐ½Ð°",
        `
          <p>${escapeHtml(shift.profession || "-")} / ${escapeHtml(shift.city || "-")}</p>
          <p>${escapeHtml(shift.date_from || "")} ${escapeHtml(shift.time_from || "")}-${escapeHtml(shift.time_to || "")}</p>
          <p>Ð¡ÑÐ°Ð²ÐºÐ°: ${escapeHtml(money(shift.rate))}</p>
          <p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(shift.status))}</p>
          <p>ÐÑÐºÐ»Ð¸ÐºÐ¸: ${counts.total}, Ð¶Ð´ÑÑ: ${counts.pending}, Ð¿ÑÐ¸Ð½ÑÑÐ¾: ${counts.accepted}</p>
        `,
        `
          <button class="btn" type="button" data-action="view-shift-applications">ÐÑÐºÐ»Ð¸ÐºÐ¸</button>
          <button class="btn primary" type="button" data-action="publish-to-telegram" style="background:#229ED9; border-color:#229ED9; color:#fff;">ð Ð Telegram</button>
          ${
            isOpen
              ? '<button type="button" data-shift-status="closed">ÐÐ°ÐºÑÑÑÑ</button><button class="btn" type="button" data-shift-status="cancelled">ÐÑÐ¼ÐµÐ½Ð¸ÑÑ</button>'
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "Ð¡ÑÐ°ÑÑÑ ÑÐ¼ÐµÐ½Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½."
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
    setMessage(el.shiftPostMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð²...");
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
      setMessage(el.shiftPostMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
        selectedShiftId ? "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ ÑÑÐ¾Ð¹ ÑÐ¼ÐµÐ½Ðµ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ" : "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ"
      );
      setMessage(
        el.shiftPostMessage,
        selectedShiftId ? "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ Ð²ÑÐ±ÑÐ°Ð½Ð½Ð¾Ð¹ ÑÐ¼ÐµÐ½Ðµ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ." : "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ."
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
            <button type="button" data-status="accepted" class="btn primary">ÐÑÐ¸Ð½ÑÑÑ</button>
            <button class="btn" type="button" data-status="declined">ÐÑÐºÐ»Ð¾Ð½Ð¸ÑÑ</button>
          </div>
          <p class="message"></p>
        `;
      } else {
        actionHtml = `
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:10px;">
            ${isAccepted ? `<button type="button" class="btn primary" data-action="complete-app" style="font-size:13px; padding:6px 12px;">â ÐÐ°Ð²ÐµÑÑÐ¸ÑÑ ÑÐ¼ÐµÐ½Ñ</button>` : `<span class="worker-badge-trust" style="color:#059669;background:#ecfdf5;border-color:#a7f3d0;font-size:11.5px;padding:4px 8px;">â Ð¡Ð¼ÐµÐ½Ð° Ð·Ð°Ð²ÐµÑÑÐµÐ½Ð°</span>`}
            <button type="button" class="btn" data-action="toggle-review-box" style="font-size:13px; padding:6px 12px;">
              ${existingReview ? `â­ï¸ ÐÑÐ·ÑÐ² (${existingReview.rating}â) â¢ ÐÐ·Ð¼ÐµÐ½Ð¸ÑÑ` : `â­ï¸ ÐÑÐµÐ½Ð¸ÑÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ° / ÐÑÐ·ÑÐ²`}
            </button>
          </div>
          <p class="message"></p>
        `;
      }

      const reviewBoxHtml = `
        <div class="restaurant-review-box" data-review-container style="display: none; margin-top: 14px;">
          <h5 style="margin: 0 0 6px; font-size: 15px; color: var(--green);">â­ï¸ ÐÑÐµÐ½ÐºÐ° ÑÐ°Ð±Ð¾ÑÑ: ${escapeHtml(workerName)}</h5>
          <p style="margin: 0 0 10px; font-size: 13px; color: #64748b;">Ð¡Ð¼ÐµÐ½Ð°: ${escapeHtml(shift.profession || shift.title || "Ð¡Ð¼ÐµÐ½Ð°")}</p>
          
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12.5px; font-weight: 750; color: #334155; margin-bottom: 4px;">ÐÐ°ÑÐ° Ð¾ÑÐµÐ½ÐºÐ° ÑÐ¼ÐµÐ½Ñ:</div>
            <div class="rating-stars-input" data-stars-input>
              <button type="button" class="rating-star-btn active" data-rating="1">â</button>
              <button type="button" class="rating-star-btn active" data-rating="2">â</button>
              <button type="button" class="rating-star-btn active" data-rating="3">â</button>
              <button type="button" class="rating-star-btn active" data-rating="4">â</button>
              <button type="button" class="rating-star-btn active" data-rating="5">â</button>
              <span class="rating-score-label" data-score-label>5/5 â ÐÑÐ»Ð¸ÑÐ½Ð¾, ÑÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑÐµÐ¼!</span>
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <div style="font-size: 12.5px; font-weight: 750; color: #334155; margin-bottom: 4px;">Ð¡Ð¸Ð»ÑÐ½ÑÐµ ÑÑÐ¾ÑÐ¾Ð½Ñ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ°:</div>
            <div class="rating-tags-selector" data-tags-selector>
              <button type="button" class="rating-tag-chip active" data-tag="â¡ï¸ ÐÑÐ½ÐºÑÑÐ°Ð»ÑÐ½Ð¾ÑÑÑ">â¡ï¸ ÐÑÐ½ÐºÑÑÐ°Ð»ÑÐ½Ð¾ÑÑÑ</button>
              <button type="button" class="rating-tag-chip active" data-tag="ðª Ð§ÐµÑÐºÐ¾ Ð¿Ð¾ Ð¢Ð¢Ð">ðª Ð§ÐµÑÐºÐ¾ Ð¿Ð¾ Ð¢Ð¢Ð</button>
              <button type="button" class="rating-tag-chip active" data-tag="â¨ Ð§Ð¸ÑÑÐ¾ÑÐ° ÑÑÐ°Ð½ÑÐ¸Ð¸">â¨ Ð§Ð¸ÑÑÐ¾ÑÐ° ÑÑÐ°Ð½ÑÐ¸Ð¸</button>
              <button type="button" class="rating-tag-chip" data-tag="ð¤ ÐÐ¾Ð¼Ð°Ð½Ð´Ð½Ð°Ñ ÑÐ°Ð±Ð¾ÑÐ°">ð¤ ÐÐ¾Ð¼Ð°Ð½Ð´Ð½Ð°Ñ ÑÐ°Ð±Ð¾ÑÐ°</button>
              <button type="button" class="rating-tag-chip" data-tag="ð¥ ÐÑÑÐ¾ÐºÐ°Ñ ÑÐºÐ¾ÑÐ¾ÑÑÑ">ð¥ ÐÑÑÐ¾ÐºÐ°Ñ ÑÐºÐ¾ÑÐ¾ÑÑÑ</button>
              <button type="button" class="rating-tag-chip" data-tag="ð³ ÐÐ°ÑÐµÑÑÐ²Ð¾ Ð¾ÑÐ´Ð°ÑÐ¸">ð³ ÐÐ°ÑÐµÑÑÐ²Ð¾ Ð¾ÑÐ´Ð°ÑÐ¸</button>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="font-size: 12.5px; font-weight: 750; color: #334155; display: block; margin-bottom: 4px;">Ð¢ÐµÐºÑÑÐ¾Ð²ÑÐ¹ Ð¾ÑÐ·ÑÐ² Ð¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ:</label>
            <textarea rows="3" data-review-text placeholder="ÐÐ°Ð¿Ð¸ÑÐ¸ÑÐµ Ð¿Ð°ÑÑ ÑÐ»Ð¾Ð²: ÑÐºÐ¾ÑÐ¾ÑÑÑ Ð½Ð° ÑÐµÐºÐ°Ñ, Ð°ÐºÐºÑÑÐ°ÑÐ½Ð¾ÑÑÑ, Ð¿ÑÐ½ÐºÑÑÐ°Ð»ÑÐ½Ð¾ÑÑÑ, Ð¾ÑÐ½Ð¾ÑÐµÐ½Ð¸Ðµ Ðº ÑÐ°Ð±Ð¾ÑÐµ..." style="width: 100%; box-sizing: border-box; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px; font-size: 13.5px; font-family: inherit;">${existingReview ? escapeHtml(existingReview.comment) : ""}</textarea>
          </div>

          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn primary" data-action="save-review" style="padding: 7px 16px; font-size: 13.5px;">
              ð¾ Ð¡Ð¾ÑÑÐ°Ð½Ð¸ÑÑ Ð¾ÑÐ·ÑÐ²
            </button>
            <button type="button" class="btn" data-action="close-review" style="padding: 7px 14px; font-size: 13px;">
              Ð¡ÐºÑÑÑÑ
            </button>
            <span class="message" data-review-msg style="margin: 0; font-size: 13px;"></span>
          </div>
        </div>
      `;

      const node = card(
        shift.title || "ÐÑÐºÐ»Ð¸Ðº ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ°",
        `<p>Ð Ð°Ð±Ð¾ÑÐ½Ð¸Ðº: ${escapeHtml(workerName)}</p><p>${escapeHtml(workerPlace || shift.city || "-")}</p><p>Ð¡Ð¼ÐµÐ½Ð°: ${escapeHtml(shift.profession || application.shift_id || "-")}</p><p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(application.status))}</p><p>${escapeHtml(application.message || "")}</p>`,
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
        1: "1/5 â ÐÑÐ»Ð¸ ÑÐµÑÑÐµÐ·Ð½ÑÐµ Ð·Ð°Ð¼ÐµÑÐ°Ð½Ð¸Ñ",
        2: "2/5 â ÐÐ¸Ð¶Ðµ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ð¹ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ",
        3: "3/5 â ÐÐ¾ÑÐ¼Ð°Ð»ÑÐ½Ð¾, ÑÑÐ°Ð½Ð´Ð°ÑÑÐ½Ð°Ñ ÑÐ¼ÐµÐ½Ð°",
        4: "4/5 â Ð¥Ð¾ÑÐ¾ÑÐ¾, ÐºÐ°ÑÐµÑÑÐ²ÐµÐ½Ð½Ð°Ñ ÑÐ°Ð±Ð¾ÑÐ°",
        5: "5/5 â ÐÑÐ»Ð¸ÑÐ½Ð¾, ÑÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑÐµÐ¼ ÐºÐ¾Ð»Ð»ÐµÐ³Ð°Ð¼!",
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
        setBusy(saveBtn, true, "Ð¡Ð¾ÑÑÐ°Ð½ÑÐµÐ¼...");
        const msgEl = node.querySelector("[data-review-msg]");
        const commentInput = node.querySelector("[data-review-text]");
        const comment = (commentInput?.value || "").trim() || "Ð¡Ð¼ÐµÐ½Ð° Ð²ÑÐ¿Ð¾Ð»Ð½ÐµÐ½Ð° ÐºÐ°ÑÐµÑÑÐ²ÐµÐ½Ð½Ð¾ Ð¸ Ð² Ð¿Ð¾Ð»Ð½Ð¾Ð¼ ÑÐ¾Ð¾ÑÐ²ÐµÑÑÑÐ²Ð¸Ð¸ Ñ Ð¢Ð¢Ð.";

        const selectedTags = Array.from(
          node.querySelectorAll("[data-tags-selector] .rating-tag-chip.active")
        ).map((c) => c.dataset.tag);

        const restName =
          state.profile?.business_name ||
          state.profile?.name ||
          state.user?.email ||
          "Ð ÐµÑÑÐ¾ÑÐ°Ð½ ÐÐ¾ÑÐºÐ²Ñ";

        const reviewPayload = {
          id: existingReview?.id || `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          worker_id: application.worker_id,
          restaurant_id: state.user.id,
          restaurant_name: restName,
          restaurant_city: state.profile?.city || "ÐÐ¾ÑÐºÐ²Ð°",
          shift_id: application.shift_id || null,
          shift_title: shift.profession || shift.title || "Ð¡Ð¼ÐµÐ½Ð° Ð² Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¸",
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
        setMessage(msgEl, "â ÐÑÐ·ÑÐ² ÑÑÐ¿ÐµÑÐ½Ð¾ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½!");
        if (toggleReviewBtn) {
          toggleReviewBtn.textContent = `â­ï¸ ÐÑÐ·ÑÐ² (${currentRating}â) â¢ ÐÐ·Ð¼ÐµÐ½Ð¸ÑÑ`;
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
        ? `ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ ÑÐ¼ÐµÐ½Ðµ: ${applications.length}`
        : `ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð²: ${applications.length}`
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadShiftApplications(state.restaurantApplicationFilter);
  }

  async function loadWorkers() {
    setMessage(el.workersMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð°Ð½ÐºÐµÑÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð²...");
    const { data, error } = await selectRowsWithFallback(
      "worker_profiles",
      {},
      {
        select: "*, profile:profiles!worker_profiles_user_id_fkey(name, city, district, is_verified)",
        order: { column: "updated_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.workersMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
      showEmpty(el.workersList, "ÐÐ½ÐºÐµÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ", "ÐÐ¾Ð´ÑÐ¾Ð´ÑÑÐ¸Ñ Ð°Ð½ÐºÐµÑ Ð½ÐµÑ.");
      setMessage(el.workersMessage, "ÐÐ¾Ð´ÑÐ¾Ð´ÑÑÐ¸Ñ Ð°Ð½ÐºÐµÑ Ð½ÐµÑ.");
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
        ? `<label class="invite-shift-label">Ð¡Ð¼ÐµÐ½Ð°<select data-invite-shift>${shiftOptions}</select></label><button type="button" data-action="invite-worker">ÐÑÐ¸Ð³Ð»Ð°ÑÐ¸ÑÑ</button><p class="message"></p>`
        : '<p class="message">Ð¡Ð½Ð°ÑÐ°Ð»Ð° Ð¾Ð¿ÑÐ±Ð»Ð¸ÐºÑÐ¹ÑÐµ Ð¾ÑÐºÑÑÑÑÑ ÑÐ¼ÐµÐ½Ñ, ÑÑÐ¾Ð±Ñ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐ¸ÑÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ°.</p>';

      const workerReviews = getWorkerReviewsList(worker.user_id);
      const avgRating = workerReviews.length
        ? (workerReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / workerReviews.length).toFixed(1)
        : "5.0";
      const reviewsCount = workerReviews.length;

      const workerTitle = `${displayName(profile, professions === "-" ? "Ð Ð°Ð±Ð¾ÑÐ½Ð¸Ðº" : professions)} <span class="worker-rating-badge-mini">â­ ${avgRating} (${reviewsCount} ${declOfNum(reviewsCount, ["Ð¾ÑÐ·ÑÐ²", "Ð¾ÑÐ·ÑÐ²Ð°", "Ð¾ÑÐ·ÑÐ²Ð¾Ð²"])})</span>`;

      const node = card(
        workerTitle,
        `
          <p>${escapeHtml(professions)}</p>
          <p>${escapeHtml(place || "ÐÐ¾ÑÐ¾Ð´ Ð½Ðµ ÑÐºÐ°Ð·Ð°Ð½")}</p>
          <p>${escapeHtml(worker.experience || "ÐÐ¿ÑÑ Ð½Ðµ ÑÐºÐ°Ð·Ð°Ð½")}</p>
          <p>ÐÐ½Ð¸: ${escapeHtml(listText(worker.available_days))}</p>
          <p>Ð¡ÑÐ°Ð²ÐºÐ°: ${escapeHtml(money(worker.min_rate))}</p>
          <p>${worker.can_travel ? "ÐÐ¾ÑÐ¾Ð² Ðº Ð²ÑÐµÐ·Ð´Ñ" : "ÐÐµÐ· Ð²ÑÐµÐ·Ð´Ð°"}</p>
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

    setMessage(el.workersMessage, `ÐÐ½ÐºÐµÑ Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾: ${workers.length}`);
  }

  async function inviteWorker(worker, node, button) {
    if (!worker.user_id) {
      setMessage(node.querySelector(".message"), "Ð£ Ð°Ð½ÐºÐµÑÑ Ð½ÐµÑ user_id, Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ Ð½Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¾.");
      return;
    }

    setBusy(button, true, "ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐµÐ¼...");
    const message = node.querySelector(".message");
    const shiftId = node.querySelector("[data-invite-shift]")?.value || "";
    const shift = state.restaurantShifts.find((item) => item.id === shiftId);
    if (!shiftId || !shift) {
      setMessage(message, "ÐÑÐ±ÐµÑÐ¸ÑÐµ Ð¾Ð¿ÑÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð½ÑÑ ÑÐ¼ÐµÐ½Ñ Ð´Ð»Ñ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ.");
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
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "ÐÐºÑÐ¸Ð²Ð½Ð¾Ðµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ ÑÑÐ¾Ð¼Ñ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÑ ÑÐ¶Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¾.");
      button.textContent = "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ ÑÐ¶Ðµ ÐµÑÑÑ";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("shift_invites", {
      restaurant_id: state.user.id,
      worker_id: worker.user_id,
      shift_id: shiftId,
      message: `ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ Ð½Ð° ÑÐ¼ÐµÐ½Ñ: ${shiftSummary(shift)}`,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${errorText(error, "Ð°ÐºÑÐ¸Ð²Ð½Ð¾Ðµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ ÑÑÐ¾Ð¼Ñ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÑ ÑÐ¶Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¾")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¾ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÑ.");
    button.textContent = "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¾";
    button.disabled = true;
    await loadRestaurantInvites();
  }

  async function loadRestaurantInvites() {
    setMessage(el.restaurantInvitesMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ...");
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
      setMessage(el.restaurantInvitesMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
      return;
    }

    state.restaurantInvites = data || [];
    if (!el.restaurantInvitesList) return;
    el.restaurantInvitesList.innerHTML = "";

    if (!state.restaurantInvites.length) {
      showEmpty(el.restaurantInvitesList, "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ", "ÐÐ°Ð¹Ð´Ð¸ÑÐµ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ° Ð¸ Ð¾ÑÐ¿ÑÐ°Ð²ÑÑÐµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ.");
      setMessage(el.restaurantInvitesMessage, "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
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
          displayName(worker, "Ð Ð°Ð±Ð¾ÑÐ½Ð¸Ðº"),
          `<p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(invite.status))}</p><p>${escapeHtml(displayPlace(worker) || "-")}</p><p>Ð¡Ð¼ÐµÐ½Ð°: ${escapeHtml(shiftSummary(shift))}</p><p>${escapeHtml(invite.message || "")}</p>`
        )
      );
    });

    setMessage(el.restaurantInvitesMessage, `ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ð¹: ${state.restaurantInvites.length}`);
  }

  async function createSupplyRequest(event) {
    const button = event?.currentTarget;
    const title = value("supplyRequestTitle");

    if (!title) {
      setMessage(el.supplyRequestMessageBox, "ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ, ÑÑÐ¾ Ð½ÑÐ¶Ð½Ð¾ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.");
      return;
    }

    setBusy(button, true, "ÐÑÐ±Ð»Ð¸ÐºÑÐµÐ¼...");
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "ÐÐ°Ð¿ÑÐ¾Ñ Ð¾Ð¿ÑÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½ Ð´Ð»Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²."
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
    setMessage(el.restaurantSupplyRequestsMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð²Ð°ÑÐ¸ Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°Ð¼...");
    const { data, error } = await selectRows(
      "supply_requests",
      { restaurant_id: state.user.id },
      { order: { column: "created_at", ascending: false } }
    );

    if (error) {
      setMessage(el.restaurantSupplyRequestsMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
        "ÐÐ°Ð¿ÑÐ¾ÑÐ¾Ð² Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°Ð¼ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ",
        "ÐÐ¿ÑÐ±Ð»Ð¸ÐºÑÐ¹ÑÐµ Ð·Ð°Ð¿ÑÐ¾Ñ, Ð¸ Ð¾Ð½ Ð¿Ð¾ÑÐ²Ð¸ÑÑÑ Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ."
      );
      setMessage(el.restaurantSupplyRequestsMessage, "ÐÐ°Ð¿ÑÐ¾ÑÐ¾Ð² Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°Ð¼ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
      return;
    }

    state.restaurantSupplyRequests.forEach((request) => {
      const isOpen = request.status === "open";
      const responseCount = responsesByRequest.get(request.id) || 0;
      const node = card(
        request.title || "ÐÐ°Ð¿ÑÐ¾Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÑ",
        `
          <p>ÐÐ°ÑÐµÐ³Ð¾ÑÐ¸Ñ: ${escapeHtml(request.category || "-")}</p>
          <p>ÐÐ¾Ð»Ð¸ÑÐµÑÑÐ²Ð¾: ${escapeHtml(request.quantity || "-")}</p>
          <p>ÐÑÐ´Ð¶ÐµÑ: ${escapeHtml(request.budget || "-")}</p>
          <p>ÐÐ¾ÑÐ¾Ð´: ${escapeHtml(request.city || "-")}</p>
          <p>ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²: ${escapeHtml(responseCount)}</p>
          <p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(request.status))}</p>
          <p>${escapeHtml(request.message || "")}</p>
        `,
        isOpen ? '<button class="btn" type="button" data-action="close-supply-request">ÐÐ°ÐºÑÑÑÑ Ð·Ð°Ð¿ÑÐ¾Ñ</button><p class="message"></p>' : ""
      );

      node.querySelector("[data-action='close-supply-request']")?.addEventListener("click", () => {
        closeSupplyRequest(request.id, node);
      });

      el.restaurantSupplyRequestsList.appendChild(node);
    });

    setMessage(el.restaurantSupplyRequestsMessage, `ÐÐ°ÑÐ¸Ñ Ð·Ð°Ð¿ÑÐ¾ÑÐ¾Ð²: ${state.restaurantSupplyRequests.length}`);
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "ÐÐ°Ð¿ÑÐ¾Ñ Ð·Ð°ÐºÑÑÑ."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadRestaurantSupplyRequests();
  }

  async function loadSupplierOffers() {
    setMessage(el.supplyRequestMessageBox, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²...");
    const { data, error } = await selectRowsWithFallback(
      "supplier_offers",
      { status: "active" },
      {
        select: "*, supplier:profiles!supplier_offers_supplier_id_fkey(name, city)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.supplyRequestMessageBox, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
      showEmpty(el.supplierOffersList, "ÐÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ð¹ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ");
      return;
    }

    offers.forEach((offer) => {
      const supplier = relatedProfile(offer, "supplier");
      const delivery = listText(offer.delivery_cities);
      const node = card(
        offer.title || "ÐÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ",
        `
          <p>ÐÐ¾ÑÑÐ°Ð²ÑÐ¸Ðº: ${escapeHtml(displayName(supplier, "Ð½Ðµ ÑÐºÐ°Ð·Ð°Ð½"))}</p>
          <p>${escapeHtml(offer.category || "-")} / ${escapeHtml(money(offer.price))} ${escapeHtml(offer.unit || "")}</p>
          <p>ÐÐ¸Ð½Ð¸Ð¼ÑÐ¼: ${escapeHtml(offer.min_order || "-")}</p>
          <p>ÐÐ¾ÑÑÐ°Ð²ÐºÐ°: ${escapeHtml(delivery === "-" ? supplier.city || "-" : delivery)}</p>
          <p>${escapeHtml(offer.description || "")}</p>
        `,
        '<button type="button" data-action="send-supplier-inquiry">ÐÑÐ¿ÑÐ°Ð²Ð¸ÑÑ Ð·Ð°Ð¿ÑÐ¾Ñ</button><p class="message"></p>'
      );

      node.querySelector("[data-action='send-supplier-inquiry']")?.addEventListener("click", (event) => {
        sendSupplierInquiry(offer, node, event.currentTarget);
      });

      el.supplierOffersList.appendChild(node);
    });
  }

  async function sendSupplierInquiry(offer, node, button) {
    setBusy(button, true, "ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐµÐ¼...");
    const message = node.querySelector(".message");
    const duplicate = await rowExists("supplier_inquiries", {
      offer_id: offer.id,
      restaurant_id: state.user.id,
    });

    if (duplicate.error) {
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "ÐÐ°Ð¿ÑÐ¾Ñ Ð¿Ð¾ ÑÑÐ¾Ð¼Ñ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ ÑÐ¶Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½.");
      button.textContent = "ÐÐ°Ð¿ÑÐ¾Ñ ÑÐ¶Ðµ ÐµÑÑÑ";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("supplier_inquiries", {
      offer_id: offer.id,
      restaurant_id: state.user.id,
      supplier_id: offer.supplier_id,
      message: value("supplyRequestMessage") || "ÐÐ°Ð¿ÑÐ¾Ñ Ð¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ",
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${errorText(error, "Ð·Ð°Ð¿ÑÐ¾Ñ Ð¿Ð¾ ÑÑÐ¾Ð¼Ñ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ ÑÐ¶Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "ÐÐ°Ð¿ÑÐ¾Ñ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÑ.");
    button.textContent = "ÐÐ°Ð¿ÑÐ¾Ñ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½";
    button.disabled = true;
  }

  async function loadSupplyResponses() {
    setMessage(el.supplyResponsesMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²...");
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
      setMessage(el.supplyResponsesMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
      showEmpty(el.supplyResponsesList, "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ");
      setMessage(el.supplyResponsesMessage, "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
      return;
    }

    state.supplierResponses.forEach((response) => {
      const pending = response.status === "new";
      const supplier = relatedProfile(response, "supplier");
      const request = relatedProfile(response, "request");
      const node = card(
        request.title || "ÐÑÐºÐ»Ð¸Ðº Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°",
        `<p>ÐÐ¾ÑÑÐ°Ð²ÑÐ¸Ðº: ${escapeHtml(displayName(supplier, response.supplier_id))}</p><p>ÐÐ°Ð¿ÑÐ¾Ñ: ${escapeHtml(request.category || response.category || "-")} / ${escapeHtml(request.quantity || "-")}</p><p>${escapeHtml(response.message || "")}</p><p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(response.status))}</p>`,
        pending
          ? '<button type="button" data-status="accepted">ÐÑÐ¸Ð½ÑÑÑ</button><button class="btn" type="button" data-status="declined">ÐÑÐºÐ»Ð¾Ð½Ð¸ÑÑ</button><p class="message"></p>'
          : '<p class="message">Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¶Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾.</p>'
      );

      node.querySelectorAll("[data-status]").forEach((button) => {
        button.addEventListener("click", () => {
          updateSupplierResponse(response, button.dataset.status, node);
        });
      });

      el.supplyResponsesList.appendChild(node);
    });

    setMessage(el.supplyResponsesMessage, `ÐÑÐºÐ»Ð¸ÐºÐ¾Ð²: ${state.supplierResponses.length}`);
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾."
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
          `Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾, Ð½Ð¾ Ð·Ð°Ð¿ÑÐ¾Ñ Ð½Ðµ Ð·Ð°ÐºÑÑÑ: ${requestError.message}`
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
        [{ id: "supplierCompanyName", label: "Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸" }],
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
          "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸Ðº",
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
        ? `ÐÑÐ¸Ð±ÐºÐ°: ${errors.map((item) => item.message).join("; ")}`
        : "ÐÑÐ¾ÑÐ¸Ð»Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ° ÑÐ¾ÑÑÐ°Ð½ÐµÐ½."
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
      setMessage(el.supplierOfferMessageBox, "ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ ÑÐ¾Ð²Ð°Ñ/ÑÑÐ»ÑÐ³Ñ Ð¸ ÐºÐ°ÑÐµÐ³Ð¾ÑÐ¸Ñ.");
      return;
    }

    setBusy(button, true, "ÐÑÐ±Ð»Ð¸ÐºÑÐµÐ¼...");
    const { error } = await insertRow("supplier_offers", {
      supplier_id: state.user.id,
      title,
      category,
      product_name: title,
      price: numberValue("supplierOfferPrice"),
      unit: "ÑÑÐ±.",
      min_order: value("supplierOfferQuantity"),
      delivery_cities: listValue("supplierOfferCity"),
      description: value("supplierOfferMessage"),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setMessage(
      el.supplierOfferMessageBox,
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "ÐÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð¾Ð¿ÑÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð¾ Ð´Ð»Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹."
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
      setMessage(el.supplierOfferMessageBox, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
      showEmpty(el.supplierOwnOffersList, "ÐÐ°ÑÐ¸Ñ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ");
      return;
    }

    state.ownSupplierOffers.forEach((offer) => {
      const active = offer.status === "active";
      const paused = offer.status === "paused";
      const node = card(
        offer.title || "ÐÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ",
        `
          <p>${escapeHtml(offer.category || "-")} / ${escapeHtml(money(offer.price))} ${escapeHtml(offer.unit || "")}</p>
          <p>ÐÐ¸Ð½Ð¸Ð¼ÑÐ¼: ${escapeHtml(offer.min_order || "-")}</p>
          <p>ÐÐ¾ÑÑÐ°Ð²ÐºÐ°: ${escapeHtml(listText(offer.delivery_cities))}</p>
          <p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(offer.status))}</p>
          <p>${escapeHtml(offer.description || "")}</p>
        `,
        `
          <button class="btn" type="button" data-action="view-offer-inquiries">ÐÐ°ÑÐ²ÐºÐ¸</button>
          ${active ? '<button type="button" data-offer-status="paused">ÐÐ°ÑÐ·Ð°</button>' : ""}
          ${paused ? '<button type="button" data-offer-status="active">ÐÐºÑÐ¸Ð²Ð¸ÑÐ¾Ð²Ð°ÑÑ</button>' : ""}
          ${
            offer.status !== "closed"
              ? '<button class="btn" type="button" data-offer-status="closed">ÐÐ°ÐºÑÑÑÑ</button>'
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "Ð¡ÑÐ°ÑÑÑ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½."
    );

    if (error) {
      buttons.forEach((button) => (button.disabled = false));
      return;
    }

    await loadSupplierOwnOffers();
    if (state.supplierInquiryFilter) await loadSupplierInquiries(state.supplierInquiryFilter);
  }

  async function loadSupplyRequests() {
    setMessage(el.supplierOfferMessageBox, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹...");
    const { data, error } = await selectRowsWithFallback(
      "supply_requests",
      { status: "open" },
      {
        select: "*, restaurant:profiles!supply_requests_restaurant_id_fkey(name, city)",
        order: { column: "created_at", ascending: false },
      }
    );

    if (error) {
      setMessage(el.supplierOfferMessageBox, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
      showEmpty(el.supplyRequestsList, "ÐÐ°Ð¿ÑÐ¾ÑÐ¾Ð² Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ");
      return;
    }

    requests.forEach((request) => {
      const restaurant = relatedProfile(request, "restaurant");
      const response = responsesByRequest.get(request.id);
      const node = card(
        request.title || "ÐÐ°Ð¿ÑÐ¾Ñ",
        `
          <p>ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ: ${escapeHtml(displayName(restaurant, "Ð½Ðµ ÑÐºÐ°Ð·Ð°Ð½Ð¾"))}</p>
          <p>${escapeHtml(request.category || "-")} / ${escapeHtml(request.quantity || "-")}</p>
          <p>ÐÑÐ´Ð¶ÐµÑ: ${escapeHtml(request.budget || "-")}</p>
          <p>ÐÐ¾ÑÐ¾Ð´: ${escapeHtml(request.city || restaurant.city || "-")}</p>
          <p>${escapeHtml(request.message || "")}</p>
        `,
        response
          ? `<p class="message">ÐÑ ÑÐ¶Ðµ Ð¾ÑÐºÐ»Ð¸ÐºÐ½ÑÐ»Ð¸ÑÑ. Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(response.status))}</p>`
          : '<button type="button" data-action="respond-supply-request">ÐÑÐºÐ»Ð¸ÐºÐ½ÑÑÑÑÑ</button><p class="message"></p>'
      );

      node.querySelector("[data-action='respond-supply-request']")?.addEventListener("click", (event) => {
        respondToSupplyRequest(request, node, event.currentTarget);
      });

      el.supplyRequestsList.appendChild(node);
    });
  }

  async function respondToSupplyRequest(request, node, button) {
    setBusy(button, true, "ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐµÐ¼...");
    const message = node.querySelector(".message");
    const duplicate = await rowExists("supplier_responses", {
      request_id: request.id,
      supplier_id: state.user.id,
    });

    if (duplicate.error) {
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${duplicate.error.message}`);
      setBusy(button, false);
      return;
    }

    if (duplicate.exists) {
      setMessage(message, "ÐÑ ÑÐ¶Ðµ Ð¾ÑÐºÐ»Ð¸ÐºÐ°Ð»Ð¸ÑÑ Ð½Ð° ÑÑÐ¾Ñ Ð·Ð°Ð¿ÑÐ¾Ñ.");
      button.textContent = "ÐÑÐºÐ»Ð¸Ðº ÑÐ¶Ðµ ÐµÑÑÑ";
      button.disabled = true;
      return;
    }

    const { error } = await insertRow("supplier_responses", {
      request_id: request.id,
      restaurant_id: request.restaurant_id,
      supplier_id: state.user.id,
      category: value("supplierOfferCategory") || request.category,
      message: value("supplierOfferMessage") || "ÐÑÐºÐ»Ð¸Ðº Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°",
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(message, `ÐÑÐ¸Ð±ÐºÐ°: ${errorText(error, "Ð²Ñ ÑÐ¶Ðµ Ð¾ÑÐºÐ»Ð¸ÐºÐ°Ð»Ð¸ÑÑ Ð½Ð° ÑÑÐ¾Ñ Ð·Ð°Ð¿ÑÐ¾Ñ")}`);
      setBusy(button, false);
      return;
    }

    setMessage(message, "ÐÑÐºÐ»Ð¸Ðº Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.");
    button.textContent = "ÐÑÐºÐ»Ð¸Ðº Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½";
    button.disabled = true;
    await loadSupplierOwnResponses();
    renderSupplyRequests();
  }

  async function loadSupplierOwnResponses() {
    setMessage(el.supplierResponsesMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð²Ð°ÑÐ¸ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸...");
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
      setMessage(el.supplierResponsesMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
        "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð½Ð° Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ",
        "ÐÑÐºÐ»Ð¸ÐºÐ½Ð¸ÑÐµÑÑ Ð½Ð° Ð·Ð°Ð¿ÑÐ¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ, Ð¸ ÑÑÐ°ÑÑÑ Ð¿Ð¾ÑÐ²Ð¸ÑÑÑ Ð·Ð´ÐµÑÑ."
      );
      setMessage(el.supplierResponsesMessage, "ÐÑÐºÐ»Ð¸ÐºÐ¾Ð² Ð½Ð° Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.");
      return;
    }

    state.ownSupplierResponses.forEach((response) => {
      const request = relatedProfile(response, "request");
      const restaurant = relatedProfile(response, "restaurant");
      el.supplierResponsesList.appendChild(
        card(
          request.title || "ÐÑÐºÐ»Ð¸Ðº Ð½Ð° Ð·Ð°Ð¿ÑÐ¾Ñ",
          `
            <p>ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ: ${escapeHtml(displayName(restaurant, response.restaurant_id))}</p>
            <p>ÐÐ°Ð¿ÑÐ¾Ñ: ${escapeHtml(request.category || response.category || "-")} / ${escapeHtml(request.quantity || "-")}</p>
            <p>ÐÐ¾ÑÐ¾Ð´: ${escapeHtml(request.city || restaurant.city || "-")}</p>
            <p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(response.status))}</p>
            <p>${escapeHtml(response.message || "")}</p>
          `
        )
      );
    });

    setMessage(el.supplierResponsesMessage, `ÐÐ°ÑÐ¸Ñ Ð¾ÑÐºÐ»Ð¸ÐºÐ¾Ð²: ${state.ownSupplierResponses.length}`);
  }

  async function loadSupplierInquiries(filterOfferId = "") {
    const selectedOfferId = typeof filterOfferId === "string" ? filterOfferId : "";
    state.supplierInquiryFilter = selectedOfferId;
    setMessage(el.supplierInquiriesMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð²ÑÐ¾Ð´ÑÑÐ¸Ðµ Ð·Ð°ÑÐ²ÐºÐ¸...");
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
      setMessage(el.supplierInquiriesMessage, `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}`);
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
        selectedOfferId ? "ÐÐ°ÑÐ²Ð¾Ðº Ð¿Ð¾ ÑÑÐ¾Ð¼Ñ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ" : "ÐÑÐ¾Ð´ÑÑÐ¸Ñ Ð·Ð°ÑÐ²Ð¾Ðº Ð¿Ð¾ÐºÐ° Ð½ÐµÑ"
      );
      setMessage(
        el.supplierInquiriesMessage,
        selectedOfferId ? "ÐÐ°ÑÐ²Ð¾Ðº Ð¿Ð¾ Ð²ÑÐ±ÑÐ°Ð½Ð½Ð¾Ð¼Ñ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ." : "ÐÑÐ¾Ð´ÑÑÐ¸Ñ Ð·Ð°ÑÐ²Ð¾Ðº Ð¿Ð¾ÐºÐ° Ð½ÐµÑ."
      );
      return;
    }

    inquiries.forEach((inquiry) => {
      const pending = inquiry.status === "new";
      const restaurant = relatedProfile(inquiry, "restaurant");
      const offer = relatedProfile(inquiry, "offer");
      const node = card(
        offer.title || "ÐÐ°ÑÐ²ÐºÐ° Ð¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ",
        `<p>ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ: ${escapeHtml(displayName(restaurant, "Ð½Ðµ ÑÐºÐ°Ð·Ð°Ð½Ð¾"))}</p><p>${escapeHtml(offer.category || "-")}</p><p>${escapeHtml(inquiry.message || "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð·Ð°Ð¸Ð½ÑÐµÑÐµÑÐ¾Ð²Ð°Ð»Ð¾ÑÑ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸ÐµÐ¼.")}</p><p>Ð¡ÑÐ°ÑÑÑ: ${escapeHtml(statusText(inquiry.status))}</p>`,
        pending
          ? '<button type="button" data-status="accepted">ÐÑÐ¸Ð½ÑÑÑ</button><button class="btn" type="button" data-status="declined">ÐÑÐºÐ»Ð¾Ð½Ð¸ÑÑ</button><p class="message"></p>'
          : '<p class="message">Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¶Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾.</p>'
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
      selectedOfferId ? `ÐÐ°ÑÐ²Ð¾Ðº Ð¿Ð¾ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ: ${inquiries.length}` : `ÐÐ°ÑÐ²Ð¾Ðº: ${inquiries.length}`
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
      error ? `ÐÑÐ¸Ð±ÐºÐ°: ${error.message}` : "Ð ÐµÑÐµÐ½Ð¸Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¾."
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
    setMessage(el.adminMessage, "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ Ð´Ð°Ð½Ð½ÑÐµ...");

    for (const table of tables) {
      const { data, error } = await db.from(table).select("*").limit(50);
      el.adminDataList.appendChild(
        card(table, `<p>${error ? escapeHtml(error.message) : `ÐÐ°Ð¿Ð¸ÑÐµÐ¹ Ð² Ð²ÑÐ±Ð¾ÑÐºÐµ: ${(data || []).length}`}</p>`)
      );
    }

    setMessage(el.adminMessage, "ÐÐ°Ð½Ð½ÑÐµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ñ.");
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
      setMessage(el.userInfo, `ÐÑÐ¸Ð±ÐºÐ° Ð¿ÑÐ¾ÑÐ¸Ð»Ñ: ${readError.message}`);
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
      name: metadata.name || state.user.email || state.user.phone || "ÐÐ¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ",
      email: state.user.email || metadata.email || null,
      phone: state.user.phone || metadata.phone || null,
      city: metadata.city || null,
      auth_provider: metadata.auth_provider || (state.user.phone && !state.user.email ? "phone" : "email"),
      status: "active",
      updated_at: new Date().toISOString(),
    };

    const { error } = await db.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      setMessage(el.userInfo, `ÐÑÐ¾ÑÐ¸Ð»Ñ Ð½Ðµ ÑÐ¾Ð·Ð´Ð°Ð½: ${error.message}`);
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
      worker: "ÑÐ°Ð±Ð¾ÑÐ½Ð¸Ðº",
      restaurant: "Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ",
      supplier: "Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸Ðº",
      admin: "Ð°Ð´Ð¼Ð¸Ð½",
    }[profile.role] || profile.role;

    setMessage(el.userInfo, `${state.user.email || profile.name || "ÐÐ¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ"} / ${label}`);
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
      stats.innerHTML = `<span class="tg-feed-stats-text">ÐÐ°Ð³ÑÑÐ·ÐºÐ° Ð¾ÑÐºÑÑÑÑÑ ÑÐ¼ÐµÐ½...</span>`;
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
            ÐÐ°Ð¹Ð´ÐµÐ½Ð¾ Ð¿ÑÐ¾Ð²ÐµÑÐµÐ½Ð½ÑÑ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ð¹: <strong>${state.workerLiveShifts.length}</strong>
          </span>
          <span class="tg-feed-stats-text" style="color: var(--muted); font-size: 13px;">
            ÐÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾: ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
        `;
      }
    } catch (err) {
      console.error("Failed to load worker live shifts:", err);
      if (list) {
        list.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 24px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; text-align: center;">
            <p style="margin: 0 0 12px; color: #f87171;">ÐÐµ ÑÐ´Ð°Ð»Ð¾ÑÑ Ð·Ð°Ð³ÑÑÐ·Ð¸ÑÑ Ð»ÐµÐ½ÑÑ ÑÐ¼ÐµÐ½. ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ Ð¾Ð±Ð½Ð¾Ð²Ð¸ÑÑ.</p>
            <button id="retryWorkerShiftsBtn" class="btn" type="button">ÐÐ¾Ð²ÑÐ¾ÑÐ¸ÑÑ Ð¿Ð¾Ð¿ÑÑÐºÑ</button>
          </div>
        `;
        byId("retryWorkerShiftsBtn")?.addEventListener("click", () => loadWorkerLiveShifts(true));
      }
      if (stats) stats.innerHTML = `<span style="color: #f87171;">ÐÑÐ¸Ð±ÐºÐ° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ</span>`;
    }
  }

  function renderWorkerLiveShifts() {
    const list = byId("workerLiveShiftsList");
    if (!list) return;

    const items = state.workerLiveShifts || [];
    if (!items.length) {
      list.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 36px 20px; text-align: center; background: rgba(255,255,255,0.02); border: 1px dashed var(--line); border-radius: 14px;">
          <div style="font-size: 32px; margin-bottom: 12px;">ð</div>
          <h4 style="margin: 0 0 8px; font-size: 18px;">ÐÐ¾Ð´ÑÐ¾Ð´ÑÑÐ¸Ñ ÑÐ¼ÐµÐ½ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾</h4>
          <p style="color: var(--muted); margin: 0 0 16px; font-size: 14px;">ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ ÑÐ¼ÑÐ³ÑÐ¸ÑÑ ÑÐ¸Ð»ÑÑÑÑ Ð¸Ð»Ð¸ Ð²ÑÐ±ÑÐ°ÑÑ Ð´ÑÑÐ³Ð¾Ð¹ ÑÐµÑ.</p>
          <button id="resetWorkerFiltersBtn" class="btn" type="button">Ð¡Ð±ÑÐ¾ÑÐ¸ÑÑ ÑÐ¸Ð»ÑÑÑÑ</button>
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
              <span class="vacancy-role-tag">${escapeHtml(job.role || 'ÐÐ¾Ð²Ð°Ñ')}</span>
              <span style="font-size: 12px; color: var(--muted); white-space: nowrap;">${formattedDate}</span>
            </div>

            <h3 class="vacancy-title" style="font-size: 20px; line-height: 1.35; margin-bottom: 12px;">${escapeHtml(job.title)}</h3>

            <div class="vacancy-rate-box" style="padding: 10px 14px; margin-bottom: 14px;">
              <span class="vacancy-rate-label">ÐÐ¿Ð»Ð°ÑÐ° / Ð¡Ð¼ÐµÐ½Ð°</span>
              <span class="vacancy-rate-val" style="font-size: 22px;">${escapeHtml(job.rateText)}</span>
            </div>

            <div class="tg-job-meta" style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
              ${job.metro ? `<span class="tg-meta-item">ð ${escapeHtml(job.metro)}</span>` : ''}
              ${job.schedule ? `<span class="tg-meta-item">â° ${escapeHtml(job.schedule)}</span>` : ''}
              <span class="tg-meta-item" style="color: #34d399; background: rgba(52, 211, 153, 0.1);">â ÐÑÐ¾Ð²ÐµÑÐµÐ½Ð¾</span>
            </div>

            ${benefitsHtml}

            ${rawTextExcerpt ? `
              <details style="margin: 10px 0 14px; font-size: 13px; color: var(--muted);">
                <summary style="cursor: pointer; color: var(--gold); user-select: none;">ÐÐ¾ÐºÐ°Ð·Ð°ÑÑ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ¼ÐµÐ½Ñ</summary>
                <div style="margin-top: 8px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; white-space: pre-wrap; font-size: 13px; line-height: 1.5; color: var(--text);">
                  ${escapeHtml(job.rawText)}
                </div>
              </details>
            ` : ''}
          </div>

          <div class="vacancy-actions" style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px;">
            ${job.contacts && job.contacts.telegram ? `
              <a class="btn primary" href="https://t.me/${job.contacts.telegram.replace(/^@/, '')}" target="_blank" rel="noopener" style="flex: 1 1 auto; text-align: center;">
                ð¬ ÐÑÐºÐ»Ð¸ÐºÐ½ÑÑÑÑÑ Ð² Telegram
              </a>
            ` : ''}
            ${job.contacts && job.contacts.phone ? `
              <a class="btn" href="tel:${job.contacts.phone}" style="flex: 1 1 auto; text-align: center;">
                ð ${escapeHtml(job.contacts.phone)}
              </a>
            ` : ''}
            ${(!job.contacts || (!job.contacts.telegram && !job.contacts.phone)) ? `
              <span class="tg-meta-item" style="color: var(--muted); font-size: 13px;">ÐÐ¾Ð½ÑÐ°ÐºÑÑ ÑÑÐ¾ÑÐ½ÑÑÑÑÑ ÑÐµÑÐµÐ· Ð¿Ð¾Ð´Ð´ÐµÑÐ¶ÐºÑ</span>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');
  }

  function formatLiveShiftDate(dateStr) {
    if (!dateStr) return 'Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMinutes < 5) return 'Ð¢Ð¾Ð»ÑÐºÐ¾ ÑÑÐ¾';
      if (diffMinutes < 60) return `${diffMinutes} Ð¼Ð¸Ð½. Ð½Ð°Ð·Ð°Ð´`;
      if (diffHours < 24) return `${diffHours} Ñ. Ð½Ð°Ð·Ð°Ð´`;
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    } catch {
      return 'Ð¡Ð²ÐµÐ¶Ð°Ñ';
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
    if (msgEl) msgEl.textContent = "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ ÐºÐ°ÑÐ°Ð»Ð¾Ð³ Ð¾Ð¿ÑÐ¾Ð²ÑÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð¿ÑÐ¾Ð´ÑÐºÑÐ¾Ð²...";
    
    try {
      const res = await fetch("/api/suppliers");
      const json = await res.json();
      if (json.success && Array.isArray(json.suppliers)) {
        b2bSuppliersCache = json.suppliers;
        if (msgEl) msgEl.textContent = `ÐÐ¾ÑÑÑÐ¿Ð½Ð¾ ${b2bSuppliersCache.length} Ð¿ÑÐ¾Ð²ÐµÑÐµÐ½Ð½ÑÑ Ð¾Ð¿ÑÐ¾Ð²ÑÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð´Ð»Ñ Ð¾Ð±ÑÐµÐ¿Ð¸ÑÐ°`;
        renderB2BSuppliers();
      } else {
        if (msgEl) msgEl.textContent = "ÐÐµ ÑÐ´Ð°Ð»Ð¾ÑÑ Ð·Ð°Ð³ÑÑÐ·Ð¸ÑÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð².";
      }
    } catch (e) {
      if (msgEl) msgEl.textContent = "ÐÑÐ¸Ð±ÐºÐ° Ð¿ÑÐ¸ Ð·Ð°Ð³ÑÑÐ·ÐºÐµ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²: " + e.message;
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
      msgEl.textContent = `ÐÐ°Ð¹Ð´ÐµÐ½Ð¾ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²: ${filtered.length}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; background: #fff; border-radius: 16px; border: 1px dashed var(--line);">
          <div style="font-size: 32px; margin-bottom: 12px;">ð</div>
          <h4 style="margin: 0 0 6px; font-size: 18px; color: var(--ink);">ÐÐ¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð¿Ð¾ Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾</h4>
          <p style="margin: 0; color: #64748b; font-size: 14px;">ÐÐ¾Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ ÑÐ±ÑÐ¾ÑÐ¸ÑÑ ÑÐ¸Ð»ÑÑÑÑ Ð¸Ð»Ð¸ Ð²ÑÐ±ÑÐ°ÑÑ Ð´ÑÑÐ³ÑÑ ÐºÐ°ÑÐµÐ³Ð¾ÑÐ¸Ñ Ð¿ÑÐ¾Ð´ÑÐºÑÐ¾Ð².</p>
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
        <span class="b2b-mini-badge">â ${escapeHtml(b)}</span>
      `).join("");

      return `
        <div class="b2b-supplier-card" id="card-${supplier.id}">
          <div class="b2b-card-top">
            <div>
              <div class="b2b-sup-cat">${escapeHtml(supplier.category_label)}</div>
              <h4 class="b2b-sup-name">${escapeHtml(supplier.company_name)}</h4>
              <div style="font-size: 12px; color: #64748b;">ÐÑÑÐ¾ÑÐ½Ð¸Ðº: ${escapeHtml(supplier.source)}</div>
            </div>
            <div class="b2b-rating-pill">â­ ${supplier.rating} (${supplier.reviews_count})</div>
          </div>

          <p class="b2b-sup-desc">${escapeHtml(supplier.description)}</p>

          <div class="b2b-badges-wrap">${badgesHtml}</div>

          <div class="b2b-sup-meta">
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">ÐÐ¸Ð½. Ð·Ð°ÐºÐ°Ð·:</span>
              <span class="b2b-meta-value">${money(supplier.min_order_rub)}</span>
            </div>
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">ÐÑÐ°ÑÐ¸Ðº Ð´Ð¾ÑÑÐ°Ð²ÐºÐ¸:</span>
              <span class="b2b-meta-value">${escapeHtml(supplier.delivery_schedule)}</span>
            </div>
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">ÐÐ¿Ð»Ð°ÑÐ°:</span>
              <span class="b2b-meta-value" style="font-size: 12px;">${escapeHtml(supplier.payment_terms)}</span>
            </div>
            <div class="b2b-meta-row">
              <span class="b2b-meta-label">Ð¡ÐºÐ»Ð°Ð´:</span>
              <span class="b2b-meta-value" style="font-size: 12px;">${escapeHtml(supplier.warehouse)}</span>
            </div>
          </div>

          <button type="button" class="b2b-products-toggle" onclick="
            var list = this.nextElementSibling;
            if (list.classList.contains('expanded')) {
              list.classList.remove('expanded');
              this.innerHTML = 'ð ÐÐ¾ÐºÐ°Ð·Ð°ÑÑ Ð¿ÑÐ°Ð¹Ñ-Ð»Ð¸ÑÑ Ð¾Ð¿ÑÐ¾Ð²ÑÑ ÑÐµÐ½ (' + ${supplier.products.length} + ') â¼';
            } else {
              list.classList.add('expanded');
              this.innerHTML = 'ð Ð¡ÐºÑÑÑÑ Ð¿ÑÐ°Ð¹Ñ-Ð»Ð¸ÑÑ Ð¾Ð¿ÑÐ¾Ð²ÑÑ ÑÐµÐ½ â²';
            }
          ">
            ð ÐÐ¾ÐºÐ°Ð·Ð°ÑÑ Ð¿ÑÐ°Ð¹Ñ-Ð»Ð¸ÑÑ Ð¾Ð¿ÑÐ¾Ð²ÑÑ ÑÐµÐ½ (${supplier.products.length}) â¼
          </button>
          <div class="b2b-products-list">
            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">ÐÑÐ°Ð¹Ñ-Ð»Ð¸ÑÑ Ð´Ð»Ñ HoReCa (Ñ ÐÐÐ¡)</div>
            ${productsHtml}
          </div>

          <div class="b2b-card-actions">
            <div class="b2b-action-row">
              ${supplier.website ? `
                <a href="${escapeHtml(supplier.website)}" target="_blank" rel="noopener" class="b2b-btn-web">
                  ð Ð¡Ð°Ð¹Ñ
                </a>
              ` : ''}
              <a href="${tgLink}" target="_blank" rel="noopener" class="b2b-btn-tg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.93-1.28 4.88-2.12 5.86-2.54 2.79-1.16 3.37-1.36 3.75-1.36.08 0 .28.02.4.12.1.08.13.19.14.27-.01.06.01.24 0 .36z"/></svg>
                Telegram
              </a>
              <a href="${phoneLink}" class="b2b-btn-phone">
                ð ÐÐ²Ð¾Ð½Ð¾Ðº
              </a>
            </div>
            <button type="button" class="b2b-btn-order" onclick="
              const reqInput = document.getElementById('supplyRequestTitle');
              const catInput = document.getElementById('supplyRequestCategory');
              const cityInput = document.getElementById('supplyRequestCity');
              const msgInput = document.getElementById('supplyRequestMessage');
              if (reqInput) reqInput.value = 'ÐÐ°ÐºÐ°Ð· ÑÐ¾Ð²Ð°ÑÐ¾Ð² Ñ ${escapeHtml(supplier.short_name)}';
              if (catInput) catInput.value = '${escapeHtml(supplier.category_label)}';
              if (cityInput) cityInput.value = 'ÐÐ¾ÑÐºÐ²Ð°';
              if (msgInput) msgInput.value = 'ÐÐ´ÑÐ°Ð²ÑÑÐ²ÑÐ¹ÑÐµ! Ð¥Ð¾ÑÐ¸Ð¼ Ð·Ð°Ð¿ÑÐ¾ÑÐ¸ÑÑ Ð¿Ð¾ÑÑÐ°Ð²ÐºÑ Ð² Ð½Ð°ÑÐµ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ (${escapeHtml(supplier.company_name)}).';
              document.getElementById('supplyRequestTitle')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              document.getElementById('supplyRequestTitle')?.focus();
            ">
              â¡ï¸ ÐÑÐ¾ÑÐ¼Ð¸ÑÑ Ð·Ð°ÑÐ²ÐºÑ ÑÐµÑÐµÐ· GastroConnect
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
      setMessage(el.userInfo, "Supabase Ð½Ðµ Ð·Ð°Ð³ÑÑÐ·Ð¸Ð»ÑÑ. ÐÐ±Ð½Ð¾Ð²Ð¸ÑÐµ ÑÑÑÐ°Ð½Ð¸ÑÑ.");
      return;
    }

    bindEvents();
    const profile = await loadProfile();
    if (profile) await openCabinet(profile);
  }

  init();
})();
