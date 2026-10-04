/* GastroConnect — cookie consent banner */
(function () {
  var KEY = 'gc_cookie_consent';
  try {
    if (localStorage.getItem(KEY)) return;
  } catch (e) { return; }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    try {
      document.cookie = 'gc_cookie_consent=' + v + '; max-age=31536000; path=/; SameSite=Lax';
    } catch (e) {}
    var el = document.getElementById('gcCookieBanner');
    if (el) el.parentNode.removeChild(el);
  }

  function build() {
    var css = [
      '#gcCookieBanner{position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:0 16px 16px;font-family:inherit;animation:gcCookieIn .3s ease-out;}',
      '@keyframes gcCookieIn{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}',
      '#gcCookieBanner .gc-cookie-card{max-width:1000px;margin:0 auto;background:#fffdf8;border:1px solid rgba(201,154,63,.35);border-radius:14px;box-shadow:0 12px 40px rgba(42,33,18,.18);padding:16px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;}',
      '#gcCookieBanner .gc-cookie-text{flex:1 1 420px;font-size:13.5px;line-height:1.55;color:#374151;}',
      '#gcCookieBanner .gc-cookie-text b{color:var(--green,#064c3b);}',
      '#gcCookieBanner .gc-cookie-text a{color:var(--green,#064c3b);font-weight:600;text-decoration:underline;}',
      '#gcCookieBanner .gc-cookie-actions{display:flex;gap:10px;align-items:center;}',
      '#gcCookieBanner .gc-cookie-btn{border:none;border-radius:10px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;transition:all .15s;}',
      '#gcCookieBanner .gc-cookie-btn-accept{background:var(--green,#064c3b);color:#fff;}',
      '#gcCookieBanner .gc-cookie-btn-accept:hover{background:var(--green-2,#0a6b52);}',
      '#gcCookieBanner .gc-cookie-btn-decline{background:#f6ecdf;color:#2a2112;border:1px solid rgba(201,154,63,.4);}',
      '@media(max-width:640px){#gcCookieBanner .gc-cookie-actions{width:100%}#gcCookieBanner .gc-cookie-actions .gc-cookie-btn{flex:1}}'
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var n = document.createElement('div');
    n.id = 'gcCookieBanner';
    n.setAttribute('role', 'dialog');
    n.setAttribute('aria-live', 'polite');
    n.innerHTML =
      '<div class="gc-cookie-card">' +
      '<div class="gc-cookie-text">' +
      '<b>🍪 Файлы cookie</b> — мы используем cookie и локальные данные, чтобы сайт работал корректно и становился удобнее. Продолжая пользоваться сервисом или нажимая «Принять», вы соглашаетесь с <a href="/privacy/">политикой конфиденциальности</a> и <a href="/terms/">условиями использования</a>.' +
      '</div>' +
      '<div class="gc-cookie-actions">' +
      '<button type="button" class="gc-cookie-btn gc-cookie-btn-accept" id="gcCookieAccept">Принять</button>' +
      '<button type="button" class="gc-cookie-btn gc-cookie-btn-decline" id="gcCookieDecline">Отклонить</button>' +
      '</div></div>';
    document.body.appendChild(n);
    document.getElementById('gcCookieAccept').addEventListener('click', function () { setConsent('accepted'); });
    document.getElementById('gcCookieDecline').addEventListener('click', function () { setConsent('declined'); });
  }

  ready(build);
})();