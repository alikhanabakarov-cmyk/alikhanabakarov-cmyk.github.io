// worker-dashboard.js
// GastroConnect Worker Earnings Dashboard powered by Recharts & React
// Visualizes monthly earnings with exact breakdown by shift base pay and tip-based bonuses

(function () {
  'use strict';

  const STORAGE_KEY = 'gastroconnect_worker_shifts_ledger_v2';

  // Realistic verified HoReCa shifts for Moscow workers
  const SEED_SHIFTS = [
    // Сентябрь 2026
    { id: 'sh-sep-01', date: '2026-09-24', restaurant: 'Ресторан «Никитская Kitchen»', metro: 'м. Тверская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5500, tipBonuses: 2200, tipType: 'Банкетный процент (10%)', status: 'paid', paymentMethod: 'СБП на карту Тинькофф' },
    { id: 'sh-sep-02', date: '2026-09-22', restaurant: 'Гастробар «Belorusskaya Grill»', metro: 'м. Белорусская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5200, tipBonuses: 1800, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-sep-03', date: '2026-09-19', restaurant: 'Бистро «Малая Бронная»', metro: 'м. Маяковская', role: 'Су-шеф смены', category: 'kitchen', shiftPay: 7200, tipBonuses: 2900, tipType: 'Премия шефа за пиковые часы', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-sep-04', date: '2026-09-16', restaurant: 'Ресторан «Северяне»', metro: 'м. Арбатская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5500, tipBonuses: 2100, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'Наличные в конце смены' },
    { id: 'sh-sep-05', date: '2026-09-13', restaurant: 'Гастробар «Loro»', metro: 'м. Тверская', role: 'Су-шеф смены', category: 'kitchen', shiftPay: 7000, tipBonuses: 3200, tipType: 'Банкетный процент (10%)', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-sep-06', date: '2026-09-10', restaurant: 'Ресторан «Горыныч»', metro: 'м. Трубная', role: 'Повар гриль/ГЦ', category: 'kitchen', shiftPay: 5800, tipBonuses: 2400, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-sep-07', date: '2026-09-07', restaurant: 'Бар «Клава»', metro: 'м. Пушкинская', role: 'Бармен / Сменщик', category: 'floor_bar', shiftPay: 4800, tipBonuses: 3600, tipType: 'Барные чаевые (наличные + СБП)', status: 'paid', paymentMethod: 'Наличные в конце смены' },
    { id: 'sh-sep-08', date: '2026-09-04', restaurant: 'Бистро «Margarita»', metro: 'м. Патриаршие', role: 'Повар холодного цеха', category: 'kitchen', shiftPay: 5200, tipBonuses: 1600, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-sep-09', date: '2026-09-01', restaurant: 'Кофейня-пекарня «Sapiens»', metro: 'м. Парк Культуры', role: 'Бариста на смену', category: 'floor_bar', shiftPay: 4200, tipBonuses: 2400, tipType: 'Чаевые на баре', status: 'paid', paymentMethod: 'СБП на карту' },

    // Август 2026
    { id: 'sh-aug-01', date: '2026-08-29', restaurant: 'Гастробар «Belorusskaya Grill»', metro: 'м. Белорусская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5200, tipBonuses: 1700, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-aug-02', date: '2026-08-26', restaurant: 'Ресторан «Никитская Kitchen»', metro: 'м. Тверская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5500, tipBonuses: 2300, tipType: 'Банкетный процент (10%)', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-aug-03', date: '2026-08-23', restaurant: 'Гастробар «Loro»', metro: 'м. Тверская', role: 'Су-шеф смены', category: 'kitchen', shiftPay: 7000, tipBonuses: 3000, tipType: 'Премия шефа', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-aug-04', date: '2026-08-20', restaurant: 'Ресторан «Северяне»', metro: 'м. Арбатская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5500, tipBonuses: 2000, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-aug-05', date: '2026-08-16', restaurant: 'Бистро «Малая Бронная»', metro: 'м. Маяковская', role: 'Повар холодного цеха', category: 'kitchen', shiftPay: 5000, tipBonuses: 1500, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-aug-06', date: '2026-08-12', restaurant: 'Бар «Клава»', metro: 'м. Пушкинская', role: 'Официант на банкет', category: 'floor_bar', shiftPay: 4500, tipBonuses: 4200, tipType: 'Банкетный чай', status: 'paid', paymentMethod: 'Наличные в конце смены' },
    { id: 'sh-aug-07', date: '2026-08-08', restaurant: 'Ресторан «Горыныч»', metro: 'м. Трубная', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5600, tipBonuses: 2200, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-aug-08', date: '2026-08-04', restaurant: 'Кофейня-пекарня «Sapiens»', metro: 'м. Парк Культуры', role: 'Бариста на смену', category: 'floor_bar', shiftPay: 4200, tipBonuses: 2100, tipType: 'Чаевые на баре', status: 'paid', paymentMethod: 'СБП на карту' },

    // Июль 2026
    { id: 'sh-jul-01', date: '2026-07-28', restaurant: 'Ресторан «Никитская Kitchen»', metro: 'м. Тверская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5500, tipBonuses: 2100, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jul-02', date: '2026-07-24', restaurant: 'Гастробар «Belorusskaya Grill»', metro: 'м. Белорусская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5200, tipBonuses: 1900, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jul-03', date: '2026-07-20', restaurant: 'Бистро «Малая Бронная»', metro: 'м. Маяковская', role: 'Су-шеф смены', category: 'kitchen', shiftPay: 7000, tipBonuses: 2800, tipType: 'Банкетный процент (10%)', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jul-04', date: '2026-07-16', restaurant: 'Гастробар «Loro»', metro: 'м. Тверская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5500, tipBonuses: 2200, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jul-05', date: '2026-07-11', restaurant: 'Бар «Клава»', metro: 'м. Пушкинская', role: 'Бармен / Сменщик', category: 'floor_bar', shiftPay: 4800, tipBonuses: 3500, tipType: 'Барные чаевые', status: 'paid', paymentMethod: 'Наличные в конце смены' },
    { id: 'sh-jul-06', date: '2026-07-06', restaurant: 'Ресторан «Северяне»', metro: 'м. Арбатская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5400, tipBonuses: 1800, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jul-07', date: '2026-07-02', restaurant: 'Кофейня-пекарня «Sapiens»', metro: 'м. Парк Культуры', role: 'Бариста на смену', category: 'floor_bar', shiftPay: 4200, tipBonuses: 2000, tipType: 'Чаевые на баре', status: 'paid', paymentMethod: 'СБП на карту' },

    // Июнь 2026
    { id: 'sh-jun-01', date: '2026-06-27', restaurant: 'Ресторан «Никитская Kitchen»', metro: 'м. Тверская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5500, tipBonuses: 2000, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jun-02', date: '2026-06-23', restaurant: 'Гастробар «Loro»', metro: 'м. Тверская', role: 'Су-шеф смены', category: 'kitchen', shiftPay: 6800, tipBonuses: 2600, tipType: 'Премия шефа', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jun-03', date: '2026-06-18', restaurant: 'Гастробар «Belorusskaya Grill»', metro: 'м. Белорусская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5200, tipBonuses: 1600, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jun-04', date: '2026-06-13', restaurant: 'Бистро «Малая Бронная»', metro: 'м. Маяковская', role: 'Повар холодного цеха', category: 'kitchen', shiftPay: 4900, tipBonuses: 1400, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-jun-05', date: '2026-06-08', restaurant: 'Бар «Клава»', metro: 'м. Пушкинская', role: 'Официант на смену', category: 'floor_bar', shiftPay: 4000, tipBonuses: 3800, tipType: 'Гостевой чай', status: 'paid', paymentMethod: 'Наличные в конце смены' },
    { id: 'sh-jun-06', date: '2026-06-03', restaurant: 'Ресторан «Горыныч»', metro: 'м. Трубная', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5400, tipBonuses: 1900, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },

    // Май 2026
    { id: 'sh-may-01', date: '2026-05-28', restaurant: 'Ресторан «Никитская Kitchen»', metro: 'м. Тверская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5300, tipBonuses: 1800, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-may-02', date: '2026-05-22', restaurant: 'Гастробар «Belorusskaya Grill»', metro: 'м. Белорусская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5000, tipBonuses: 1500, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-may-03', date: '2026-05-16', restaurant: 'Бистро «Малая Бронная»', metro: 'м. Маяковская', role: 'Повар холодного цеха', category: 'kitchen', shiftPay: 4800, tipBonuses: 1300, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-may-04', date: '2026-05-10', restaurant: 'Ресторан «Северяне»', metro: 'м. Арбатская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5300, tipBonuses: 1700, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-may-05', date: '2026-05-04', restaurant: 'Бар «Клава»', metro: 'м. Пушкинская', role: 'Бармен на уикенд', category: 'floor_bar', shiftPay: 4600, tipBonuses: 3200, tipType: 'Барные чаевые', status: 'paid', paymentMethod: 'Наличные в конце смены' },

    // Апрель 2026
    { id: 'sh-apr-01', date: '2026-04-26', restaurant: 'Ресторан «Никитская Kitchen»', metro: 'м. Тверская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5200, tipBonuses: 1600, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-apr-02', date: '2026-04-20', restaurant: 'Гастробар «Belorusskaya Grill»', metro: 'м. Белорусская', role: 'Повар горячего цеха', category: 'kitchen', shiftPay: 5000, tipBonuses: 1400, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-apr-03', date: '2026-04-14', restaurant: 'Бистро «Малая Бронная»', metro: 'м. Маяковская', role: 'Повар холодного цеха', category: 'kitchen', shiftPay: 4800, tipBonuses: 1200, tipType: 'Личные чаевые гостей', status: 'paid', paymentMethod: 'СБП на карту' },
    { id: 'sh-apr-04', date: '2026-04-07', restaurant: 'Кофейня-пекарня «Sapiens»', metro: 'м. Парк Культуры', role: 'Бариста на смену', category: 'floor_bar', shiftPay: 4000, tipBonuses: 1800, tipType: 'Чаевые на баре', status: 'paid', paymentMethod: 'СБП на карту' }
  ];

  function loadShiftsFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[Dashboard] Ошибка загрузки смен из localStorage:', e);
    }
    saveShiftsToStorage(SEED_SHIFTS);
    return SEED_SHIFTS;
  }

  function saveShiftsToStorage(shifts) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts));
    } catch (e) {
      console.error('[Dashboard] Ошибка записи смен в localStorage:', e);
    }
  }

  function formatRubles(val) {
    return Number(val || 0).toLocaleString('ru-RU') + ' ₽';
  }

  function formatMonthLabel(monthKey) {
    const months = {
      '2026-01': 'Янв 26', '2026-02': 'Фев 26', '2026-03': 'Мар 26',
      '2026-04': 'Апр 26', '2026-05': 'Май 26', '2026-06': 'Июн 26',
      '2026-07': 'Июл 26', '2026-08': 'Авг 26', '2026-09': 'Сен 26',
      '2026-10': 'Окт 26', '2026-11': 'Ноя 26', '2026-12': 'Дек 26'
    };
    return months[monthKey] || monthKey;
  }

  function formatMonthFullName(monthKey) {
    const months = {
      '2026-01': 'Январь 2026', '2026-02': 'Февраль 2026', '2026-03': 'Март 2026',
      '2026-04': 'Апрель 2026', '2026-05': 'Май 2026', '2026-06': 'Июнь 2026',
      '2026-07': 'Июль 2026', '2026-08': 'Август 2026', '2026-09': 'Сентябрь 2026',
      '2026-10': 'Октябрь 2026', '2026-11': 'Ноябрь 2026', '2026-12': 'Декабрь 2026'
    };
    return months[monthKey] || monthKey;
  }

  // Aggregate shifts into monthly Recharts format
  function aggregateMonthlyData(shifts, roleFilter, period) {
    let filtered = shifts;
    if (roleFilter !== 'all') {
      filtered = filtered.filter(s => s.category === roleFilter);
    }

    // Determine month keys based on period
    let targetMonths = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    if (period === 'current') {
      targetMonths = ['2026-09'];
    } else if (period === '12m') {
      targetMonths = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    }

    const monthMap = {};
    targetMonths.forEach(m => {
      monthMap[m] = {
        monthKey: m,
        month: formatMonthLabel(m),
        monthFullName: formatMonthFullName(m),
        shiftPay: 0,
        tipBonuses: 0,
        total: 0,
        shiftsCount: 0,
        avgTips: 0,
        avgShiftPay: 0,
        tipSharePercent: 0
      };
    });

    filtered.forEach(s => {
      const mKey = s.date.slice(0, 7);
      if (monthMap[mKey]) {
        monthMap[mKey].shiftPay += Number(s.shiftPay || 0);
        monthMap[mKey].tipBonuses += Number(s.tipBonuses || 0);
        monthMap[mKey].shiftsCount += 1;
      }
    });

    const result = targetMonths.map(m => {
      const data = monthMap[m];
      data.total = data.shiftPay + data.tipBonuses;
      if (data.shiftsCount > 0) {
        data.avgShiftPay = Math.round(data.shiftPay / data.shiftsCount);
        data.avgTips = Math.round(data.tipBonuses / data.shiftsCount);
      }
      if (data.total > 0) {
        data.tipSharePercent = Math.round((data.tipBonuses / data.total) * 100);
      }
      return data;
    });

    return result;
  }

  // Calculate totals and overall summary metrics
  function calculateSummaryMetrics(monthlyData, allFilteredShifts) {
    const totalShiftPay = monthlyData.reduce((acc, m) => acc + m.shiftPay, 0);
    const totalTipBonuses = monthlyData.reduce((acc, m) => acc + m.tipBonuses, 0);
    const totalEarnings = totalShiftPay + totalTipBonuses;
    const totalShiftsCount = monthlyData.reduce((acc, m) => acc + m.shiftsCount, 0);

    const avgEarningsPerShift = totalShiftsCount > 0 ? Math.round(totalEarnings / totalShiftsCount) : 0;
    const avgTipsPerShift = totalShiftsCount > 0 ? Math.round(totalTipBonuses / totalShiftsCount) : 0;
    const avgBaseShiftPay = totalShiftsCount > 0 ? Math.round(totalShiftPay / totalShiftsCount) : 0;
    const tipShareOverall = totalEarnings > 0 ? Math.round((totalTipBonuses / totalEarnings) * 100) : 0;
    const shiftBaseShareOverall = totalEarnings > 0 ? (100 - tipShareOverall) : 100;

    return {
      totalEarnings,
      totalShiftPay,
      totalTipBonuses,
      totalShiftsCount,
      avgEarningsPerShift,
      avgTipsPerShift,
      avgBaseShiftPay,
      tipShareOverall,
      shiftBaseShareOverall
    };
  }

  // Custom Recharts Tooltip
  function CustomBarTooltip(props) {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload || {};
    const shiftPay = data.shiftPay || 0;
    const tipBonuses = data.tipBonuses || 0;
    const total = data.total || (shiftPay + tipBonuses);
    const shiftPct = total > 0 ? Math.round((shiftPay / total) * 100) : 0;
    const tipPct = total > 0 ? Math.round((tipBonuses / total) * 100) : 0;

    const h = window.React.createElement;

    return h('div', {
      style: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
        minWidth: '240px',
        fontSize: '13px',
        lineHeight: 1.4,
        color: '#0f172a'
      }
    },
      h('div', { style: { fontWeight: 800, fontSize: '14px', marginBottom: '8px', color: '#064c3b', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' } },
        '📅 ' + (data.monthFullName || label) + ' · ' + data.shiftsCount + ' смен'
      ),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' } },
        h('span', { style: { color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' } },
          h('span', { style: { width: '8px', height: '8px', borderRadius: '2px', background: '#064c3b', display: 'inline-block' } }),
          'Базовая ставка за смены:'
        ),
        h('strong', { style: { color: '#064c3b' } }, formatRubles(shiftPay) + ' (' + shiftPct + '%)')
      ),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' } },
        h('span', { style: { color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' } },
          h('span', { style: { width: '8px', height: '8px', borderRadius: '2px', background: '#d97706', display: 'inline-block' } }),
          'Чаевые и бонусы:'
        ),
        h('strong', { style: { color: '#d97706' } }, '+' + formatRubles(tipBonuses) + ' (' + tipPct + '%)')
      ),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0', fontWeight: 800 } },
        h('span', { style: { color: '#0f172a' } }, 'Итого на руки:'),
        h('span', { style: { color: '#047857', fontSize: '15px' } }, formatRubles(total))
      ),
      h('div', { style: { fontSize: '11px', color: '#64748b', marginTop: '6px' } },
        '~' + formatRubles(data.avgTips) + ' чаевых в среднем за смену'
      )
    );
  }

  // Toast Notification helper
  function showToast(message) {
    let toast = document.getElementById('dashboardToastNotify');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dashboardToastNotify';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.zIndex = '99999';
      toast.style.background = '#064c3b';
      toast.style.color = '#ffffff';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '10px';
      toast.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
      toast.style.fontSize = '14px';
      toast.style.fontWeight = '700';
      toast.style.transition = 'all 0.3s ease';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }

  // Main React Application for Worker Recharts Dashboard
  function WorkerRechartsDashboardApp() {
    const React = window.React;
    const Recharts = window.Recharts;
    const h = React.createElement;

    // React State
    const [shifts, setShifts] = React.useState(() => loadShiftsFromStorage());
    const [period, setPeriod] = React.useState('6m'); // '6m' | '12m' | 'current'
    const [roleFilter, setRoleFilter] = React.useState('all'); // 'all' | 'kitchen' | 'floor_bar'
    const [chartMode, setChartMode] = React.useState('stacked'); // 'stacked' | 'area' | 'donut'
    const [selectedMonthKey, setSelectedMonthKey] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Form inputs state
    const [formDate, setFormDate] = React.useState('2026-09-25');
    const [formRestaurant, setFormRestaurant] = React.useState('Ресторан «Никитская Kitchen»');
    const [formMetro, setFormMetro] = React.useState('м. Тверская');
    const [formRole, setFormRole] = React.useState('Повар горячего цеха');
    const [formCategory, setFormCategory] = React.useState('kitchen');
    const [formShiftPay, setFormShiftPay] = React.useState('5500');
    const [formTipBonuses, setFormTipBonuses] = React.useState('2200');
    const [formTipType, setFormTipType] = React.useState('Личные чаевые гостей');
    const [formPaymentMethod, setFormPaymentMethod] = React.useState('СБП на карту Тинькофф');

    // Aggregate monthly data based on filters
    const monthlyData = React.useMemo(() => {
      return aggregateMonthlyData(shifts, roleFilter, period);
    }, [shifts, roleFilter, period]);

    const summary = React.useMemo(() => {
      return calculateSummaryMetrics(monthlyData, shifts);
    }, [monthlyData, shifts]);

    // Donut chart pie data
    const pieData = React.useMemo(() => {
      let guestTips = 0;
      let banquetTips = 0;
      shifts.forEach(s => {
        if (s.tipType && s.tipType.includes('Банкет')) {
          banquetTips += Number(s.tipBonuses || 0);
        } else {
          guestTips += Number(s.tipBonuses || 0);
        }
      });
      return [
        { name: 'Базовая ставка за смены', value: summary.totalShiftPay, color: '#064c3b' },
        { name: 'Личные чаевые гостей', value: guestTips, color: '#d97706' },
        { name: 'Банкетные надбавки и бонусы', value: banquetTips, color: '#0d9488' }
      ];
    }, [shifts, summary]);

    // Filter shifts for the ledger
    const ledgerShifts = React.useMemo(() => {
      let list = [...shifts];
      if (roleFilter !== 'all') {
        list = list.filter(s => s.category === roleFilter);
      }
      if (selectedMonthKey) {
        list = list.filter(s => s.date.startsWith(selectedMonthKey));
      }
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return list;
    }, [shifts, roleFilter, selectedMonthKey]);

    // Save new shift handler
    const handleAddShiftSubmit = (e) => {
      e.preventDefault();
      const newShift = {
        id: 'sh-custom-' + Date.now(),
        date: formDate,
        restaurant: formRestaurant.trim() || 'Ресторан',
        metro: formMetro.trim() || 'Москва',
        role: formRole.trim() || 'Сотрудник HoReCa',
        category: formCategory,
        shiftPay: parseInt(formShiftPay, 10) || 5000,
        tipBonuses: parseInt(formTipBonuses, 10) || 0,
        tipType: formTipType,
        status: 'paid',
        paymentMethod: formPaymentMethod
      };

      const updated = [newShift, ...shifts];
      setShifts(updated);
      saveShiftsToStorage(updated);
      setIsModalOpen(false);
      showToast('✅ Смена и чаевые успешно добавлены! Графики Recharts обновлены.');
    };

    // Quick delete shift handler
    const handleDeleteShift = (id) => {
      const updated = shifts.filter(s => s.id !== id);
      setShifts(updated);
      saveShiftsToStorage(updated);
      showToast('Смена удалена из журнала начислений.');
    };

    // CSV Export Handler
    const handleExportCsv = () => {
      const headers = ['Дата', 'Заведение', 'Метро', 'Должность', 'Базовая ставка (₽)', 'Чаевые и бонусы (₽)', 'Итого (₽)', 'Тип бонуса', 'Способ оплаты'];
      const rows = ledgerShifts.map(s => [
        s.date,
        `"${s.restaurant.replace(/"/g, '""')}"`,
        `"${s.metro.replace(/"/g, '""')}"`,
        `"${s.role.replace(/"/g, '""')}"`,
        s.shiftPay,
        s.tipBonuses,
        s.shiftPay + s.tipBonuses,
        `"${(s.tipType || '').replace(/"/g, '""')}"`,
        `"${(s.paymentMethod || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `GastroConnect_Earnings_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📥 Выписка успешно сохранена в файл CSV!');
    };

    // Render View
    return h('div', { className: 'worker-recharts-dashboard-container' },
      
      // Top Hero & Controls Bar
      h('div', { className: 'dashboard-hero-header' },
        h('div', null,
          h('div', { className: 'dashboard-eyebrow' },
            '📊 Аналитика выплат соискателя',
            h('span', { className: 'dashboard-live-indicator' }, '● Данные актуальны')
          ),
          h('h2', { className: 'dashboard-main-title' }, 'Дашборд доходов: Смены и Чаевые'),
          h('p', { className: 'dashboard-subtitle' },
            'Наглядная визуализация ежемесячного дохода с детализацией базовой ставки за смены и чаевых надбавок на интерактивных графиках Recharts.'
          )
        ),
        h('div', { className: 'dashboard-header-actions' },
          h('button', {
            type: 'button',
            className: 'dashboard-btn-primary',
            onClick: () => setIsModalOpen(true)
          },
            '➕ Зафиксировать смену и чаевые'
          ),
          h('button', {
            type: 'button',
            className: 'dashboard-btn-secondary',
            onClick: handleExportCsv,
            title: 'Скачать финансовый отчет в формате CSV'
          },
            '📥 Экспорт CSV'
          )
        )
      ),

      // Filter Segmented Controls Bar (Functional Buttons)
      h('div', { className: 'dashboard-filter-toolbar' },
        // Period Filter
        h('div', { className: 'filter-group' },
          h('span', { className: 'filter-label' }, 'Период:'),
          h('div', { className: 'segmented-controls' },
            h('button', {
              type: 'button',
              className: `segmented-btn ${period === '6m' ? 'active' : ''}`,
              onClick: () => setPeriod('6m')
            }, 'Последние 6 мес'),
            h('button', {
              type: 'button',
              className: `segmented-btn ${period === '12m' ? 'active' : ''}`,
              onClick: () => setPeriod('12m')
            }, 'Весь 2026 год'),
            h('button', {
              type: 'button',
              className: `segmented-btn ${period === 'current' ? 'active' : ''}`,
              onClick: () => setPeriod('current')
            }, 'Сентябрь (Текущий)')
          )
        ),

        // Role Category Filter
        h('div', { className: 'filter-group' },
          h('span', { className: 'filter-label' }, 'Направление:'),
          h('div', { className: 'segmented-controls' },
            h('button', {
              type: 'button',
              className: `segmented-btn ${roleFilter === 'all' ? 'active' : ''}`,
              onClick: () => setRoleFilter('all')
            }, 'Все смены'),
            h('button', {
              type: 'button',
              className: `segmented-btn ${roleFilter === 'kitchen' ? 'active' : ''}`,
              onClick: () => setRoleFilter('kitchen')
            }, '🍳 Кухня (ГЦ/ХЦ/Шеф)'),
            h('button', {
              type: 'button',
              className: `segmented-btn ${roleFilter === 'floor_bar' ? 'active' : ''}`,
              onClick: () => setRoleFilter('floor_bar')
            }, '🍷 Зал и Бар (Официант/Бариста)')
          )
        ),

        // Chart Type Switcher
        h('div', { className: 'filter-group' },
          h('span', { className: 'filter-label' }, 'Вид графика:'),
          h('div', { className: 'segmented-controls' },
            h('button', {
              type: 'button',
              className: `segmented-btn ${chartMode === 'stacked' ? 'active' : ''}`,
              onClick: () => setChartMode('stacked')
            }, '📊 Стековые бары'),
            h('button', {
              type: 'button',
              className: `segmented-btn ${chartMode === 'area' ? 'active' : ''}`,
              onClick: () => setChartMode('area')
            }, '📈 Тренд и динамика'),
            h('button', {
              type: 'button',
              className: `segmented-btn ${chartMode === 'donut' ? 'active' : ''}`,
              onClick: () => setChartMode('donut')
            }, '🍩 Доли дохода')
          )
        )
      ),

      // 4 High-Impact KPI Metric Cards
      h('div', { className: 'dashboard-kpi-grid' },
        // Card 1: Total
        h('div', { className: 'dashboard-kpi-card highlight-emerald' },
          h('div', { className: 'kpi-card-top' },
            h('span', { className: 'kpi-card-title' }, 'Общий заработок за период'),
            h('span', { className: 'kpi-card-badge' }, '✓ Выплачено 100%')
          ),
          h('div', { className: 'kpi-card-val' }, formatRubles(summary.totalEarnings)),
          h('div', { className: 'kpi-card-desc' },
            'За ' + summary.totalShiftsCount + ' отработанных смен напрямую от заведений'
          ),
          h('div', { className: 'kpi-card-meta' },
            h('span', null, 'В среднем: ' + formatRubles(summary.avgEarningsPerShift) + ' / смена')
          )
        ),

        // Card 2: Shift Base Pay
        h('div', { className: 'dashboard-kpi-card' },
          h('div', { className: 'kpi-card-top' },
            h('span', { className: 'kpi-card-title' }, 'Базовая ставка за смены'),
            h('span', { className: 'kpi-card-tag green-tag' }, summary.shiftBaseShareOverall + '% дохода')
          ),
          h('div', { className: 'kpi-card-val', style: { color: '#064c3b' } }, formatRubles(summary.totalShiftPay)),
          h('div', { className: 'kpi-card-desc' },
            'Фиксированная почасовая и сменная оплата от шефов'
          ),
          h('div', { className: 'kpi-card-meta' },
            h('span', null, 'Средняя базовая ставка: ' + formatRubles(summary.avgBaseShiftPay))
          )
        ),

        // Card 3: Tip-Based Bonuses
        h('div', { className: 'dashboard-kpi-card highlight-gold' },
          h('div', { className: 'kpi-card-top' },
            h('span', { className: 'kpi-card-title' }, 'Чаевые и надбавки'),
            h('span', { className: 'kpi-card-tag amber-tag' }, summary.tipShareOverall + '% дохода')
          ),
          h('div', { className: 'kpi-card-val', style: { color: '#d97706' } }, '+' + formatRubles(summary.totalTipBonuses)),
          h('div', { className: 'kpi-card-desc' },
            'Личный чай гостей, банкетные 10% и бонусы шефа'
          ),
          h('div', { className: 'kpi-card-meta' },
            h('span', null, 'В среднем: +' + formatRubles(summary.avgTipsPerShift) + ' чаевых за смену')
          )
        ),

        // Card 4: Efficiency & Reliability
        h('div', { className: 'dashboard-kpi-card' },
          h('div', { className: 'kpi-card-top' },
            h('span', { className: 'kpi-card-title' }, 'Эффективность смены'),
            h('span', { className: 'kpi-card-tag blue-tag' }, 'Рейтинг 5.0')
          ),
          h('div', { className: 'kpi-card-val' },
            summary.totalShiftsCount > 0 ? (Math.round((summary.totalTipBonuses / summary.totalShiftPay) * 100) + '%') : '0%'
          ),
          h('div', { className: 'kpi-card-desc' },
            'Прирост к базовому окладу за счет качества работы'
          ),
          h('div', { className: 'kpi-card-meta' },
            h('span', null, 'Выход на смены: 100% без штрафов и опозданий')
          )
        )
      ),

      // Main Recharts Visualizations Area
      h('div', { className: 'dashboard-charts-layout' },
        
        // Primary Chart Card
        h('div', { className: 'dashboard-chart-box' },
          h('div', { className: 'chart-box-header' },
            h('div', null,
              h('h3', { className: 'chart-title' },
                chartMode === 'stacked'
                  ? 'Структура ежемесячного дохода: Базовая ставка vs Чаевые'
                  : chartMode === 'area'
                    ? 'Динамика совокупного дохода и рост чаевых (Тренд)'
                    : 'Долевое распределение источников выплат соискателя'
              ),
              h('p', { className: 'chart-caption' },
                chartMode === 'stacked'
                  ? 'Зеленый цвет — гарантированная ставка за смену; янтарный — чаевые и банкетные надбавки.'
                  : chartMode === 'area'
                    ? 'Траектория накопленного дохода и помесячная стабильность выплат.'
                    : 'Соотношение базового оклада, личных чаевых от гостей и банкетных процентов.'
              )
            ),
            selectedMonthKey && h('button', {
              type: 'button',
              className: 'reset-filter-btn',
              onClick: () => setSelectedMonthKey(null)
            }, 'Сбросить фильтр месяца ✕')
          ),

          // Render Recharts based on chartMode
          chartMode === 'stacked' && h(Recharts.ResponsiveContainer, { width: '100%', height: 380 },
            h(Recharts.BarChart, {
              data: monthlyData,
              margin: { top: 20, right: 24, left: 10, bottom: 20 },
              onClick: (e) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  const mKey = e.activePayload[0].payload.monthKey;
                  setSelectedMonthKey(selectedMonthKey === mKey ? null : mKey);
                }
              }
            },
              h(Recharts.CartesianGrid, { strokeDasharray: '3 3', stroke: '#f1f5f9', vertical: false }),
              h(Recharts.XAxis, {
                dataKey: 'month',
                tickLine: false,
                axisLine: { stroke: '#cbd5e1' },
                tick: { fill: '#475569', fontSize: 13, fontWeight: 600 }
              }),
              h(Recharts.YAxis, {
                tickLine: false,
                axisLine: false,
                tickFormatter: (v) => `${Math.round(v / 1000)}k ₽`,
                tick: { fill: '#64748b', fontSize: 12 }
              }),
              h(Recharts.Tooltip, {
                content: h(CustomBarTooltip)
              }),
              h(Recharts.Legend, {
                verticalAlign: 'top',
                align: 'right',
                wrapperStyle: { paddingBottom: 16, fontSize: 13, fontWeight: 600 }
              }),
              // Stacked Bar 1: Shift Pay (bottom)
              h(Recharts.Bar, {
                dataKey: 'shiftPay',
                name: 'Базовая ставка за смены',
                stackId: 'earnings',
                fill: '#064c3b',
                radius: [0, 0, 4, 4],
                maxBarSize: 58
              }),
              // Stacked Bar 2: Tip Bonuses (top)
              h(Recharts.Bar, {
                dataKey: 'tipBonuses',
                name: 'Чаевые и надбавки',
                stackId: 'earnings',
                fill: '#d97706',
                radius: [6, 6, 0, 0],
                maxBarSize: 58
              })
            )
          ),

          chartMode === 'area' && h(Recharts.ResponsiveContainer, { width: '100%', height: 380 },
            h(Recharts.AreaChart, {
              data: monthlyData,
              margin: { top: 20, right: 24, left: 10, bottom: 20 }
            },
              h('defs', null,
                h('linearGradient', { id: 'shiftGrad', x1: '0', y1: '0', x2: '0', y2: '1' },
                  h('stop', { offset: '5%', stopColor: '#064c3b', stopOpacity: 0.6 }),
                  h('stop', { offset: '95%', stopColor: '#064c3b', stopOpacity: 0.05 })
                ),
                h('linearGradient', { id: 'tipGrad', x1: '0', y1: '0', x2: '0', y2: '1' },
                  h('stop', { offset: '5%', stopColor: '#d97706', stopOpacity: 0.7 }),
                  h('stop', { offset: '95%', stopColor: '#d97706', stopOpacity: 0.05 })
                )
              ),
              h(Recharts.CartesianGrid, { strokeDasharray: '3 3', stroke: '#f1f5f9', vertical: false }),
              h(Recharts.XAxis, {
                dataKey: 'month',
                tickLine: false,
                axisLine: { stroke: '#cbd5e1' },
                tick: { fill: '#475569', fontSize: 13, fontWeight: 600 }
              }),
              h(Recharts.YAxis, {
                tickLine: false,
                axisLine: false,
                tickFormatter: (v) => `${Math.round(v / 1000)}k ₽`,
                tick: { fill: '#64748b', fontSize: 12 }
              }),
              h(Recharts.Tooltip, { content: h(CustomBarTooltip) }),
              h(Recharts.Legend, {
                verticalAlign: 'top',
                align: 'right',
                wrapperStyle: { paddingBottom: 16, fontSize: 13, fontWeight: 600 }
              }),
              h(Recharts.Area, {
                type: 'monotone',
                dataKey: 'shiftPay',
                name: 'Базовая ставка за смены',
                stroke: '#064c3b',
                strokeWidth: 2.5,
                fill: 'url(#shiftGrad)'
              }),
              h(Recharts.Area, {
                type: 'monotone',
                dataKey: 'tipBonuses',
                name: 'Чаевые и бонусы',
                stroke: '#d97706',
                strokeWidth: 2.5,
                fill: 'url(#tipGrad)'
              })
            )
          ),

          chartMode === 'donut' && h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px', flexWrap: 'wrap', gap: '30px' } },
            h(Recharts.ResponsiveContainer, { width: 340, height: 340 },
              h(Recharts.PieChart, null,
                h(Recharts.Pie, {
                  data: pieData,
                  cx: '50%',
                  cy: '50%',
                  innerRadius: 80,
                  outerRadius: 130,
                  paddingAngle: 3,
                  dataKey: 'value'
                },
                  pieData.map((entry, index) =>
                    h(Recharts.Cell, { key: `cell-${index}`, fill: entry.color })
                  )
                ),
                h(Recharts.Tooltip, {
                  formatter: (val) => [formatRubles(val), 'Доход']
                })
              )
            ),
            h('div', { className: 'donut-legend-box' },
              pieData.map((item, idx) => {
                const pct = summary.totalEarnings > 0 ? Math.round((item.value / summary.totalEarnings) * 100) : 0;
                return h('div', { key: idx, className: 'donut-legend-item' },
                  h('span', { className: 'donut-bullet', style: { background: item.color } }),
                  h('div', null,
                    h('div', { className: 'donut-item-label' }, item.name),
                    h('div', { className: 'donut-item-val' },
                      formatRubles(item.value) + ' (' + pct + '%)'
                    )
                  )
                );
              })
            )
          )
        )
      ),

      // Interactive Shifts Ledger Table
      h('div', { className: 'dashboard-ledger-section' },
        h('div', { className: 'ledger-header' },
          h('div', null,
            h('h3', { className: 'ledger-title' },
              selectedMonthKey
                ? `Журнал смен за ${formatMonthFullName(selectedMonthKey)} (${ledgerShifts.length})`
                : `Журнал всех подтвержденных смен (${ledgerShifts.length})`
            ),
            h('p', { className: 'ledger-sub' },
              'Детальный реестр с разделением фиксированной ставки заведения и чаевых надбавок'
            )
          ),
          selectedMonthKey && h('button', {
            type: 'button',
            className: 'btn-show-all-shifts',
            onClick: () => setSelectedMonthKey(null)
          }, 'Показать все месяцы')
        ),

        h('div', { className: 'ledger-table-wrap' },
          h('table', { className: 'dashboard-ledger-table' },
            h('thead', null,
              h('tr', null,
                h('th', null, 'Дата и локация'),
                h('th', null, 'Заведение и цех'),
                h('th', { style: { textAlign: 'right' } }, 'Ставка за смену'),
                h('th', { style: { textAlign: 'right' } }, 'Чаевые / Бонусы'),
                h('th', { style: { textAlign: 'right' } }, 'Итого на руки'),
                h('th', null, 'Выплата'),
                h('th', { style: { textAlign: 'center' } }, 'Действия')
              )
            ),
            h('tbody', null,
              ledgerShifts.map((s) => {
                const total = Number(s.shiftPay) + Number(s.tipBonuses);
                return h('tr', { key: s.id },
                  h('td', null,
                    h('div', { style: { fontWeight: 700, color: '#0f172a' } }, s.date),
                    h('div', { style: { fontSize: '12px', color: '#64748b' } }, s.metro)
                  ),
                  h('td', null,
                    h('div', { style: { fontWeight: 700, color: '#064c3b' } }, s.restaurant),
                    h('div', { style: { fontSize: '12px', color: '#475569' } }, s.role)
                  ),
                  h('td', { style: { textAlign: 'right', fontWeight: 700, color: '#064c3b' } },
                    formatRubles(s.shiftPay)
                  ),
                  h('td', { style: { textAlign: 'right' } },
                    h('span', { style: { fontWeight: 700, color: '#d97706' } }, '+' + formatRubles(s.tipBonuses)),
                    s.tipType && h('div', { style: { fontSize: '11px', color: '#64748b' } }, s.tipType)
                  ),
                  h('td', { style: { textAlign: 'right', fontWeight: 800, color: '#047857', fontSize: '14.5px' } },
                    formatRubles(total)
                  ),
                  h('td', null,
                    h('span', { className: 'payout-chip' },
                      '🟢 ' + (s.paymentMethod || 'СБП на карту')
                    )
                  ),
                  h('td', { style: { textAlign: 'center' } },
                    h('button', {
                      type: 'button',
                      className: 'del-shift-btn',
                      onClick: () => handleDeleteShift(s.id),
                      title: 'Удалить смену'
                    }, '🗑')
                  )
                );
              })
            )
          )
        )
      ),

      // Modal Dialog: Log New Shift & Tips
      isModalOpen && h('div', { className: 'dashboard-modal-backdrop', onClick: () => setIsModalOpen(false) },
        h('div', { className: 'dashboard-modal-card', onClick: (e) => e.stopPropagation() },
          h('div', { className: 'modal-head' },
            h('h3', { style: { margin: 0, fontSize: '19px', color: '#064c3b' } }, '➕ Зафиксировать смену и чаевые'),
            h('button', {
              type: 'button',
              className: 'modal-close-btn',
              onClick: () => setIsModalOpen(false)
            }, '✕')
          ),
          h('form', { onSubmit: handleAddShiftSubmit, className: 'modal-form' },
            h('div', { className: 'modal-form-grid' },
              h('label', null,
                'Дата смены:',
                h('input', {
                  type: 'date',
                  required: true,
                  value: formDate,
                  onChange: (e) => setFormDate(e.target.value)
                })
              ),
              h('label', null,
                'Заведение (ресторан/бар):',
                h('input', {
                  type: 'text',
                  required: true,
                  value: formRestaurant,
                  placeholder: 'Например: Ресторан «Никитская Kitchen»',
                  onChange: (e) => setFormRestaurant(e.target.value)
                })
              ),
              h('label', null,
                'Метро / Локация:',
                h('input', {
                  type: 'text',
                  required: true,
                  value: formMetro,
                  placeholder: 'м. Тверская',
                  onChange: (e) => setFormMetro(e.target.value)
                })
              ),
              h('label', null,
                'Позиция / Должность:',
                h('input', {
                  type: 'text',
                  required: true,
                  value: formRole,
                  placeholder: 'Повар горячего цеха',
                  onChange: (e) => setFormRole(e.target.value)
                })
              ),
              h('label', null,
                'Категория цеха:',
                h('select', {
                  value: formCategory,
                  onChange: (e) => setFormCategory(e.target.value)
                },
                  h('option', { value: 'kitchen' }, 'Кухня (ГЦ/ХЦ/Су-шеф/Кондитер)'),
                  h('option', { value: 'floor_bar' }, 'Зал и Бар (Официант/Бариста/Бармен)')
                )
              ),
              h('label', null,
                'Базовая ставка за смену (₽):',
                h('input', {
                  type: 'number',
                  required: true,
                  min: '1000',
                  step: '100',
                  value: formShiftPay,
                  onChange: (e) => setFormShiftPay(e.target.value)
                })
              ),
              h('label', null,
                'Чаевые и надбавки (₽):',
                h('input', {
                  type: 'number',
                  required: true,
                  min: '0',
                  step: '50',
                  value: formTipBonuses,
                  onChange: (e) => setFormTipBonuses(e.target.value)
                })
              ),
              h('label', null,
                'Категория чаевых / бонуса:',
                h('select', {
                  value: formTipType,
                  onChange: (e) => setFormTipType(e.target.value)
                },
                  h('option', { value: 'Личные чаевые гостей' }, 'Личные чаевые гостей'),
                  h('option', { value: 'Банкетный процент (10%)' }, 'Банкетный процент (10%)'),
                  h('option', { value: 'Барные чаевые' }, 'Барные чаевые'),
                  h('option', { value: 'Премия шефа за пиковые часы' }, 'Премия шефа за пиковые часы')
                )
              ),
              h('label', { className: 'full-width' },
                'Способ получения оплаты:',
                h('select', {
                  value: formPaymentMethod,
                  onChange: (e) => setFormPaymentMethod(e.target.value)
                },
                  h('option', { value: 'СБП на карту Тинькофф' }, 'СБП на карту Тинькофф / Сбер'),
                  h('option', { value: 'Наличные в конце смены' }, 'Наличные на руки в конце смены'),
                  h('option', { value: 'Банковский перевод' }, 'Банковский перевод (самозанятый)')
                )
              )
            ),
            h('div', { className: 'modal-footer' },
              h('button', {
                type: 'button',
                className: 'modal-cancel-btn',
                onClick: () => setIsModalOpen(false)
              }, 'Отмена'),
              h('button', {
                type: 'submit',
                className: 'modal-save-btn'
              }, 'Сохранить и пересчитать Recharts')
            )
          )
        )
      )
    );
  }

  // Tab view switcher for worker cabinet
  function initWorkerViewTabs() {
    const tabs = document.querySelectorAll('.worker-view-tab');
    if (!tabs.length) return;

    function switchView(viewName) {
      tabs.forEach(t => {
        const isTarget = t.dataset.workerView === viewName;
        t.classList.toggle('active', isTarget);
      });

      const paneElements = document.querySelectorAll('[data-worker-pane]');
      paneElements.forEach(p => {
        const isTarget = p.dataset.workerPane === viewName;
        p.style.display = isTarget ? '' : 'none';
        p.classList.toggle('active', isTarget);
      });

      if (viewName === 'dashboard') {
        window.dispatchEvent(new Event('resize'));
        if (window.initWorkerRechartsDashboard) {
          window.initWorkerRechartsDashboard();
        }
      }
    }

    tabs.forEach(t => {
      t.addEventListener('click', () => {
        const view = t.dataset.workerView;
        switchView(view);
        try {
          history.replaceState(null, null, `#${view}`);
        } catch (_) {}
      });
    });

    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    const initialView = ['dashboard', 'shifts', 'calc', 'profile'].includes(hash) ? hash : 'dashboard';
    switchView(initialView);
  }

  // Global Mounting Function
  window.initWorkerRechartsDashboard = function () {
    initWorkerViewTabs();
    const mountEl = document.getElementById('workerRechartsDashboardMount');
    if (!mountEl) return;

    if (!window.React || !window.ReactDOM || !window.Recharts) {
      console.warn('[Dashboard] Ожидание инициализации React и Recharts...');
      setTimeout(window.initWorkerRechartsDashboard, 150);
      return;
    }

    try {
      if (window.ReactDOM.createRoot) {
        if (!mountEl._reactRoot) {
          mountEl._reactRoot = window.ReactDOM.createRoot(mountEl);
        }
        mountEl._reactRoot.render(window.React.createElement(WorkerRechartsDashboardApp));
      } else {
        window.ReactDOM.render(window.React.createElement(WorkerRechartsDashboardApp), mountEl);
      }
      console.log('[Dashboard] ✅ Recharts Worker Earnings Dashboard успешно смонтирован!');
    } catch (err) {
      console.error('[Dashboard] Ошибка монтирования Recharts:', err);
    }
  };

  // Auto-init on load if target element exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(window.initWorkerRechartsDashboard, 200);
    });
  } else {
    setTimeout(window.initWorkerRechartsDashboard, 200);
  }

})();
