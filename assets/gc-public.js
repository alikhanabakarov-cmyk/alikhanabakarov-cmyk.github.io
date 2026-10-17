(function () {
  'use strict';

  var SUBMISSIONS_TABLE = 'public_submissions';
  var SUBMISSIONS_KEY = 'gc_public_submissions';

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || '') || fallback; } catch (e) { return fallback; }
  }
  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function timeoutSignal(ms) {
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, ms);
    return { signal: controller.signal, clear: function () { clearTimeout(timeoutId); } };
  }
  function withTimeout(promise, ms, message) {
    var timeoutId;
    var timeout = new Promise(function (_, reject) { timeoutId = setTimeout(function () { reject(new Error(message || 'request timeout')); }, ms); });
    return Promise.race([promise, timeout]).finally(function () { clearTimeout(timeoutId); });
  }

  async function getSupabaseRestConfig() {
    if (window.__gcSupabaseRestConfig) return window.__gcSupabaseRestConfig;
    if (window.supabaseClient && window.supabaseClient.supabaseUrl && window.supabaseClient.supabaseKey) {
      window.__gcSupabaseRestConfig = { url: window.supabaseClient.supabaseUrl, key: window.supabaseClient.supabaseKey };
      return window.__gcSupabaseRestConfig;
    }
    var timeout = timeoutSignal(1500), response;
    try {
      response = await fetch('/supabase.js?v=1002', { cache: 'force-cache', signal: timeout.signal });
    } finally { timeout.clear(); }
    if (!response.ok) throw new Error('supabase.js not loaded');
    var source = await response.text();
    var url = (source.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/i) || [])[1];
    var key = (source.match(/SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/i) || [])[1];
    if (!url || !key) throw new Error('Supabase config not found');
    window.__gcSupabaseRestConfig = { url: url, key: key };
    return window.__gcSupabaseRestConfig;
  }

  function readSubmissions() { return readJson(SUBMISSIONS_KEY, []); }
  function saveLocalSubmission(row) {
    var rows = readSubmissions(); rows.unshift(row); writeJson(SUBMISSIONS_KEY, rows.slice(0, 100));
  }
  function createSubmissionId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, function (value) {
      return (Number(value) ^ (Math.random() * 16 >> Number(value) / 4)).toString(16);
    });
  }

  function makeSubmission(type, data) {
    var consentDate = data.personalDataConsentDate || new Date().toISOString();
    var personalDataConsent = data.personalDataConsent === true || data.personalDataConsent === 'true' || data.personalDataConsent === 'on';
    var phone = String(data.phone || '').replace(/[^0-9+]/g, '').replace(/^8(\d{10})$/, '+7$1');
    var telegram = String(data.telegram || '').trim();
    if (telegram && telegram.charAt(0) !== '@') telegram = '@' + telegram.replace(/^https?:\/\/t\.me\//i, '').replace(/^t\.me\//i, '');
    var normalized = Object.assign({}, data, {
      personalDataConsent: personalDataConsent,
      personalDataConsentDate: personalDataConsent ? consentDate : '',
      email: data.email || '',
      phone: phone,
      telegram: telegram,
      pageUrl: window.location.href,
      pagePath: window.location.pathname,
      ipAddress: data.ipAddress || '',
      userAgent: data.userAgent || navigator.userAgent || ''
    });
    var title = type === 'callback' ? ('Заказ звонка: ' + (normalized.name || normalized.phone || 'контакт'))
      : type === 'feedback' ? ('Обратная связь: ' + (normalized.name || normalized.phone || 'контакт'))
      : (normalized.name || normalized.company || normalized.company_name || normalized.role || normalized.product || 'Заявка');
    return {
      id: createSubmissionId(), type: type, title: title,
      phone: normalized.phone || '', telegram: normalized.telegram || '', city: normalized.city || '',
      email: normalized.email || '', personalDataConsent: normalized.personalDataConsent,
      personalDataConsentDate: normalized.personalDataConsentDate, ipAddress: normalized.ipAddress,
      userAgent: normalized.userAgent, data: normalized, source: 'site', status: 'new',
      created_at: new Date().toISOString()
    };
  }

  async function saveRemoteSubmission(row) {
    var payload = {
      type: row.type, title: row.title, phone: row.phone, telegram: row.telegram, city: row.city,
      email: row.email || (row.data && row.data.email) || null,
      personal_data_consent: Boolean(row.personalDataConsent),
      personal_data_consent_date: row.personalDataConsentDate || null,
      ip_address: row.ipAddress || null, user_agent: row.userAgent || null,
      data: row.data, source: row.source || 'site', status: row.status || 'new'
    };
    var compactPayload = {
      type: row.type, title: row.title, phone: row.phone, telegram: row.telegram, city: row.city,
      data: Object.assign({}, row.data, {
        email: row.email || row.data.email || '', personalDataConsent: Boolean(row.personalDataConsent),
        personalDataConsentDate: row.personalDataConsentDate || '', ipAddress: row.ipAddress || '',
        userAgent: row.userAgent || '', source: row.source || 'site', status: row.status || 'new'
      })
    };
    var isSchemaMismatch = function (error) {
      return /PGRST204|schema cache|personal_data_consent|personal_data_consent_date|ip_address|user_agent|email|status|source/i.test(String((error && (error.code || error.message)) || error || ''));
    };
    var client = window.supabaseClient;
    if (client) {
      var res = await withTimeout(client.from(SUBMISSIONS_TABLE).insert(payload), 3500, 'submissions timeout');
      if (res.error) {
        if (!isSchemaMismatch(res.error)) throw res.error;
        var res2 = await withTimeout(client.from(SUBMISSIONS_TABLE).insert(compactPayload), 3500, 'submissions timeout');
        if (res2.error) throw res2.error;
      }
      return true;
    }
    var cfg = await getSupabaseRestConfig();
    var post = async function (body) {
      var timeout = timeoutSignal(3500);
      try {
        var response = await fetch(cfg.url + '/rest/v1/' + SUBMISSIONS_TABLE, {
          method: 'POST',
          signal: timeout.signal,
          headers: { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify(body)
        });
        var text = response.ok ? '' : await response.text().catch(function () { return ''; });
        return { response: response, text: text };
      } finally { timeout.clear(); }
    };
    var first = await post(payload);
    if (!first.response.ok && isSchemaMismatch(first.text)) {
      var retry = await post(compactPayload);
      if (!retry.response.ok) throw new Error('public_submissions ' + retry.response.status);
      return true;
    }
    if (!first.response.ok) throw new Error('public_submissions ' + first.response.status);
    return true;
  }

  function initPublicForms() {
    document.querySelectorAll('form[data-form-type]').forEach(function (form) {
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        var button = form.querySelector('button[type="submit"], input[type="submit"]');
        var box = form.querySelector('.success');
        if (button) button.disabled = true;
        var rawData = Object.fromEntries(new FormData(form).entries());
        if (rawData.personalDataConsent !== 'true' && rawData.personalDataConsent !== 'on') {
          if (box) { box.textContent = 'Нужно принять документы и дать согласие на обработку персональных данных.'; box.style.display = 'block'; }
          if (button) button.disabled = false;
          return;
        }
        rawData.personalDataConsentDate = new Date().toISOString();
        rawData.userAgent = navigator.userAgent;
        rawData.ipAddress = '';
        var row = makeSubmission(form.dataset.formType, rawData);
        saveLocalSubmission(row);
        try {
          await saveRemoteSubmission(row);
          if (box) {
            box.setAttribute('role', 'status');
            box.textContent = form.dataset.formType === 'callback'
              ? 'Заявка на звонок отправлена. Мы свяжемся с вами по указанному телефону.'
              : form.dataset.formType === 'feedback'
                ? 'Обратная связь отправлена. Мы ответим вам.'
                : 'Заявка отправлена. Мы получили ваши контакты и свяжемся с вами.';
          }
        } catch (e) {
          if (box) box.textContent = 'Заявка сохранена в этом браузере. Если интернет или база временно недоступны, повторите отправку позже.';
        } finally {
          if (box) box.style.display = 'block';
          form.reset();
          if (button) button.disabled = false;
        }
      });
    });
  }

  window.GCSubmission = { makeSubmission: makeSubmission, saveRemoteSubmission: saveRemoteSubmission, getSupabaseRestConfig: getSupabaseRestConfig };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPublicForms);
  else initPublicForms();
})();
