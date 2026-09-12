(function () {
  const PUBLIC_SUBMISSIONS_KEY = "gc_public_submissions";
  const PUBLIC_SUBMISSIONS_TABLE = "public_submissions";
  const SITE_SETTINGS_KEY = "gc_site_settings";
  const SITE_SETTINGS_ROW = "public_site";
  const SITE_ASSETS_BUCKET = "site-assets";
  const SUPABASE_CONFIG_URL = "supabase.js?v=1002";
  const roleLabels = {
    worker: "Ð Ð°Ð±Ð¾ÑÐ½Ð¸Ðº",
    restaurant: "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ",
    supplier: "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸Ðº",
  };
  const defaultSiteSettings = {
    logo: "assets/logo-full.png",
    nav: {
      workers: "Ð¡Ð¾ÑÑÑÐ´Ð½Ð¸ÐºÐ°Ð¼",
      restaurants: "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸ÑÐ¼",
      suppliers: "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°Ð¼",
      contacts: "ÐÐ¾Ð½ÑÐ°ÐºÑÑ",
      workflow: "ÐÐ°Ðº ÑÐ°Ð±Ð¾ÑÐ°ÐµÑ",
      login: "ÐÐ¾Ð¹ÑÐ¸",
      signup: "Ð ÐµÐ³Ð¸ÑÑÑÐ°ÑÐ¸Ñ",
      home: "ÐÐ° Ð³Ð»Ð°Ð²Ð½ÑÑ",
      request: "ÐÑÑÐ°Ð²Ð¸ÑÑ Ð·Ð°ÑÐ²ÐºÑ",
    },
    home: {
      hero: "assets/hero-home.webp",
      eyebrow: "Ð Ð¾ÑÑÐ¸Ð¹ÑÐºÐ°Ñ Ð¿Ð»Ð°ÑÑÐ¾ÑÐ¼Ð° Ð³Ð¸Ð±ÐºÐ¾Ð¹ Ð·Ð°Ð½ÑÑÐ¾ÑÑÐ¸ Ð´Ð»Ñ HoReCa",
      title: "Ð¡Ð¼ÐµÐ½Ñ, Ð¿ÐµÑÑÐ¾Ð½Ð°Ð» Ð¸ Ð¿Ð¾ÑÑÐ°Ð²ÐºÐ¸ Ð±ÐµÐ· ÑÐ°Ð¾ÑÐ° Ð² ÑÐ°ÑÐ°Ñ",
      lead: "GastroConnect Ð¿Ð¾Ð¼Ð¾Ð³Ð°ÐµÑ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸ÑÐ¼ Ð±ÑÑÑÑÐ¾ Ð·Ð°ÐºÑÑÐ²Ð°ÑÑ ÑÐ¼ÐµÐ½Ñ, ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ°Ð¼ Ð½Ð°ÑÐ¾Ð´Ð¸ÑÑ Ð¿Ð¾Ð´ÑÐ°Ð±Ð¾ÑÐºÑ, Ð° Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°Ð¼ Ð¿Ð¾Ð»ÑÑÐ°ÑÑ ÑÐµÐ°Ð»ÑÐ½ÑÐµ Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð¾Ñ ÑÐµÑÑÐ¾ÑÐ°Ð½Ð¾Ð² Ð¸ ÐºÐ°ÑÐµ.",
      ctaPrimary: "ÐÐ°Ð¿ÑÑÑÐ¸ÑÑ Ð¿Ð¾Ð´Ð±Ð¾Ñ",
      ctaSecondary: "ÐÐ°Ð¹ÑÐ¸ ÑÐ¼ÐµÐ½Ñ",
      benefit1: "Ð¡Ð¼ÐµÐ½Ñ Ð·Ð° 24 ÑÐ°ÑÐ°",
      benefit2: "ÐÑÐ¾ÑÐ¸Ð»Ð¸ Ð¸ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸",
      benefit3: "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¸ ÑÑÐ´Ð¾Ð¼",
      dashboard1Label: "Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ",
      dashboard1Value: "18 ÑÐ¼ÐµÐ½",
      dashboard1Text: "Ð¿Ð¾Ð²Ð°ÑÐ°, Ð¾ÑÐ¸ÑÐ¸Ð°Ð½ÑÑ, Ð±Ð°ÑÐ¸ÑÑÐ°",
      dashboard2Label: "ÐÐ°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¾",
      dashboard2Value: "82%",
      dashboard2Text: "Ð¿Ð¾ Ð°ÐºÑÐ¸Ð²Ð½ÑÐ¼ Ð·Ð°ÑÐ²ÐºÐ°Ð¼",
      dashboard3Label: "ÐÐ¾ÑÑÐ°Ð²ÐºÐ¸",
      dashboard3Value: "47 Ð¾ÑÑÐµÑÐ¾Ð²",
      dashboard3Text: "Ð¿ÑÐ¾Ð´ÑÐºÑÑ, ÐºÐ»Ð¸Ð½Ð¸Ð½Ð³, Ð¾Ð±Ð¾ÑÑÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ",
      metric1Value: "24/7",
      metric1Text: "Ð¿ÑÐ±Ð»Ð¸ÐºÐ°ÑÐ¸Ñ ÑÐ¼ÐµÐ½ Ð¸ Ð·Ð°ÑÐ²Ð¾Ðº",
      metric2Value: "3 ÑÐ¾Ð»Ð¸",
      metric2Text: "ÑÐ°Ð±Ð¾ÑÐ½Ð¸Ðº, Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ, Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸Ðº",
      metric3Value: "1 ÐºÐ°Ð±Ð¸Ð½ÐµÑ",
      metric3Text: "Ð¿ÑÐ¾ÑÐ¸Ð»Ð¸, Ð¾ÑÐºÐ»Ð¸ÐºÐ¸, Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ",
      metric4Value: "HoReCa",
      metric4Text: "ÑÐ¾ÐºÑÑ Ð½Ð° ÐºÐ°ÑÐµ, ÑÐµÑÑÐ¾ÑÐ°Ð½Ñ Ð¸ ÐºÑÑÐ½Ð¸",
      boardTitle: "ÐÐ½ÑÑÑÐ¸ Ð½Ðµ Ð»ÐµÐ½Ð´Ð¸Ð½Ð³, Ð° ÑÐ°Ð±Ð¾ÑÐ°Ñ Ð»ÐµÐ½ÑÐ°",
      boardLead:
        "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð¿ÑÐ±Ð»Ð¸ÐºÑÐµÑ ÑÐ¼ÐµÐ½Ñ, ÑÐ°Ð±Ð¾ÑÐ½Ð¸Ðº Ð¾ÑÐºÐ»Ð¸ÐºÐ°ÐµÑÑÑ, Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸Ðº Ð¿Ð¾Ð»ÑÑÐ°ÐµÑ Ð·Ð°Ð¿ÑÐ¾Ñ. ÐÑÑ ÑÑÐ¾ ÑÐ¾Ð±ÑÐ°Ð½Ð¾ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐ°Ñ Ð¿Ð¾ ÑÐ¾Ð»ÑÐ¼.",
      rolesTitle: "ÐÑÐµ ÑÑÐ°ÑÑÐ½Ð¸ÐºÐ¸ HoReCa Ð² Ð¾Ð´Ð½Ð¾Ð¼ Ð¿Ð¾Ð½ÑÑÐ½Ð¾Ð¼ Ð¿ÑÐ¾ÑÐµÑÑÐµ",
      rolesLead:
        "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð²Ð¸Ð´Ð¸Ñ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð², Ð¿ÑÐ±Ð»Ð¸ÐºÑÐµÑ ÑÐ¼ÐµÐ½Ñ, Ð¿Ð¾Ð»ÑÑÐ°ÐµÑ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð¸ Ð´ÐµÑÐ¶Ð¸Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð² Ð¾Ð´Ð½Ð¾Ð¼ Ð¼ÐµÑÑÐµ.",
      restaurantCardLabel: "ÐÐ»Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹",
      restaurantCardTitle: "ÐÐ°ÐºÑÑÐ²Ð°Ð¹ÑÐµ ÑÐ¼ÐµÐ½Ñ Ð±ÑÑÑÑÐµÐµ",
      restaurantCardText:
        "ÐÑÐ±Ð»Ð¸ÐºÑÐ¹ÑÐµ Ð·Ð°ÑÐ²ÐºÐ¸, Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐ°Ð¹ÑÐµ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð² Ð¸Ð· Ð±Ð°Ð·Ñ, ÑÐ¸Ð»ÑÑÑÑÐ¹ÑÐµ Ð¿Ð¾ Ð¿ÑÐ¾ÑÐµÑÑÐ¸Ð¸, ÑÑÐ°Ð²ÐºÐµ, Ð³ÑÐ°ÑÐ¸ÐºÑ Ð¸ Ð³Ð¾ÑÐ¾Ð²Ð½Ð¾ÑÑÐ¸ Ðº Ð²ÑÐµÐ·Ð´Ñ.",
      workerCardLabel: "ÐÐ»Ñ ÑÐ¾ÑÑÑÐ´Ð½Ð¸ÐºÐ¾Ð²",
      workerCardTitle: "ÐÐµÑÐ¸ÑÐµ Ð¿Ð¾Ð½ÑÑÐ½ÑÐµ ÑÐ¼ÐµÐ½Ñ",
      workerCardText:
        "ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ Ð¿ÑÐ¾ÑÐ¸Ð»Ñ, ÑÐ¼Ð¾ÑÑÐ¸ÑÐµ Ð´Ð¾ÑÑÑÐ¿Ð½ÑÐµ ÑÐ¼ÐµÐ½Ñ, Ð¾ÑÐºÐ»Ð¸ÐºÐ°Ð¹ÑÐµÑÑ Ð¸ Ð¿ÑÐ¸Ð½Ð¸Ð¼Ð°Ð¹ÑÐµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ Ð¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹.",
      supplierCardLabel: "ÐÐ»Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²",
      supplierCardTitle: "ÐÐ¾Ð»ÑÑÐ°Ð¹ÑÐµ Ð²ÑÐ¾Ð´ÑÑÐ¸Ðµ Ð·Ð°Ð¿ÑÐ¾ÑÑ",
      supplierCardText:
        "ÐÑÐ±Ð»Ð¸ÐºÑÐ¹ÑÐµ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ ÑÐ¾Ð²Ð°ÑÐ°Ð¼ Ð¸ ÑÑÐ»ÑÐ³Ð°Ð¼, Ð° Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÑÑ Ð·Ð°ÑÐ²ÐºÐ¸ Ð¿ÑÑÐ¼Ð¾ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°.",
      workflowEyebrow:
        "ÐµÐ´Ð¸Ð½ÑÐ¹ Ð¿Ð¾ÑÑÐ´Ð¾Ðº Ð´Ð»Ñ HoReCa",
      workflowTitle: "ÐÐµ Ð´Ð¾ÑÐºÐ° Ð¾Ð±ÑÑÐ²Ð»ÐµÐ½Ð¸Ð¹, Ð° ÑÐ°Ð±Ð¾ÑÐ¸Ð¹ Ð¿ÑÐ¾ÑÐµÑÑ",
      workflowLead:
        "Ð¡Ð¸ÑÑÐµÐ¼Ð° ÑÐ¾Ð±Ð¸ÑÐ°ÐµÑ ÑÐ¼ÐµÐ½Ñ, Ð¿ÑÐ¾ÑÐ¸Ð»Ð¸, Ð¾ÑÐºÐ»Ð¸ÐºÐ¸, Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ Ð¸ Ð¿Ð¾ÑÑÐ°Ð²ÐºÐ¸ Ð² Ð¾Ð´Ð½Ñ Ð¿Ð¾Ð½ÑÑÐ½ÑÑ ÑÐµÐ¿Ð¾ÑÐºÑ: Ð±ÐµÐ· ÑÐ°Ð¾ÑÐ° Ð² Ð¿ÐµÑÐµÐ¿Ð¸ÑÐºÐ°Ñ, Ð¿Ð¾ÑÐµÑÑÐ½Ð½ÑÑ ÐºÐ¾Ð½ÑÐ°ÐºÑÐ¾Ð² Ð¸ ÑÑÑÐ½Ð¾Ð³Ð¾ ÐºÐ¾Ð½ÑÑÐ¾Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð¹ Ð·Ð°ÑÐ²ÐºÐ¸.",
      workflowStep1:
        "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð¿ÑÐ±Ð»Ð¸ÐºÑÐµÑ ÑÐ¼ÐµÐ½Ñ Ð¸Ð»Ð¸ Ð²ÑÐ±Ð¸ÑÐ°ÐµÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ° Ð¸Ð· Ð±Ð°Ð·Ñ.",
      workflowStep2: "Ð Ð°Ð±Ð¾ÑÐ½Ð¸Ðº Ð¾ÑÐºÐ»Ð¸ÐºÐ°ÐµÑÑÑ Ð¸Ð»Ð¸ Ð¿ÑÐ¸Ð½Ð¸Ð¼Ð°ÐµÑ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ðµ Ð½Ð° ÑÐ¼ÐµÐ½Ñ.",
      workflowStep3:
        "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸Ðº Ð¿ÑÐ±Ð»Ð¸ÐºÑÐµÑ Ð¾ÑÑÐµÑ, Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÐµÑ Ð·Ð°Ð¿ÑÐ¾Ñ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑ.",
      workflowStep4:
        "ÐÐ´Ð¼Ð¸Ð½ Ð²Ð¸Ð´Ð¸Ñ Ð¾Ð±ÑÐ¸Ð¹ ÐºÐ¾Ð½ÑÑÑ Ð´Ð°Ð½Ð½ÑÑ Ð¸ ÐºÐ¾Ð½ÑÑÐ¾Ð»Ð¸ÑÑÐµÑ Ð½Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ð¿Ð»Ð°ÑÑÐ¾ÑÐ¼Ñ.",
      mvpTitle: "Ð§ÑÐ¾ ÑÐ¶Ðµ Ð·Ð°Ð»Ð¾Ð¶ÐµÐ½Ð¾ Ð² MVP",
      mvpLead:
        "Ð¤ÑÐ½ÐºÑÐ¸Ð¸, ÐºÐ¾ÑÐ¾ÑÑÐµ Ð½ÑÐ¶Ð½Ñ, ÑÑÐ¾Ð±Ñ ÑÐ°Ð¹Ñ Ð¿ÐµÑÐµÑÑÐ°Ð» Ð±ÑÑÑ âÐ²Ð¸ÑÑÐ¸Ð½Ð¾Ð¹â Ð¸ Ð½Ð°ÑÐ°Ð» ÑÐ°Ð±Ð¾ÑÐ°ÑÑ ÐºÐ°Ðº ÑÐµÑÐ²Ð¸Ñ.",
      mvpCard1Label: "Ð¡Ð¼ÐµÐ½Ñ",
      mvpCard1Title: "ÐÑÐ±Ð»Ð¸ÐºÐ°ÑÐ¸Ñ Ð¸ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸",
      mvpCard1Text:
        "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ ÑÐ¾Ð·Ð´Ð°ÑÑ ÑÐ¼ÐµÐ½Ñ, ÑÐ°Ð±Ð¾ÑÐ½Ð¸Ðº Ð²Ð¸Ð´Ð¸Ñ ÐµÑ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ Ð¸ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÐµÑ Ð¾ÑÐºÐ»Ð¸Ðº.",
      mvpCard2Label: "ÐÑÐ¾ÑÐ¸Ð»Ð¸",
      mvpCard2Title: "ÐÑÐ¾ÑÐ¸Ð»Ð¸ Ð²ÑÐµÑ ÑÐ¾Ð»ÐµÐ¹",
      mvpCard2Text:
        "Ð Ð°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¸, Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¸ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¸ Ð²ÐµÐ´ÑÑ Ð¾ÑÐ´ÐµÐ»ÑÐ½ÑÐµ Ð¿ÑÐ¾ÑÐ¸Ð»Ð¸, ÑÑÐ¾Ð±Ñ Ð·Ð°ÑÐ²ÐºÐ¸ Ð±ÑÐ»Ð¸ Ð¿Ð¾Ð½ÑÑÐ½ÑÐ¼Ð¸ Ð¸ Ð¿ÑÐ¾Ð²ÐµÑÑÐµÐ¼ÑÐ¼Ð¸.",
      mvpCard3Label: "ÐÐ¾ÑÑÐ°Ð²ÐºÐ¸",
      mvpCard3Title: "ÐÑÑÐµÑÑ Ð¸ Ð·Ð°ÑÐ²ÐºÐ¸",
      mvpCard3Text:
        "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¸ Ð¿ÑÐ±Ð»Ð¸ÐºÑÑÑ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ, Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÑÑ Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð¿Ð¾ Ð½ÑÐ¶Ð½ÑÐ¼ Ð¿Ð¾Ð·Ð¸ÑÐ¸ÑÐ¼.",
      finalTitle: "ÐÐ°ÑÐ½Ð¸ÑÐµ Ñ ÑÐµÐ³Ð¸ÑÑÑÐ°ÑÐ¸Ð¸",
      finalLead: "Ð¡Ð¾Ð·Ð´Ð°Ð¹ÑÐµ Ð°ÐºÐºÐ°ÑÐ½Ñ Ð¸ Ð¾ÑÐºÑÐ¾Ð¹ÑÐµ ÐºÐ°Ð±Ð¸Ð½ÐµÑ Ð´Ð»Ñ ÑÐ²Ð¾ÐµÐ¹ ÑÐ¾Ð»Ð¸.",
    },
    workers: {
      hero: "assets/hero-workers.webp",
      eyebrow: "Ð¡Ð¾ÑÑÑÐ´Ð½Ð¸ÐºÐ°Ð¼ HoReCa",
      title: "Ð¡Ð¼ÐµÐ½Ñ Ð² ÑÐµÑÑÐ¾ÑÐ°Ð½Ð°Ñ, ÐºÐ°ÑÐµ Ð¸ Ð´Ð¾ÑÑÐ°Ð²ÐºÐµ ÑÑÐ´Ð¾Ð¼",
      lead: "ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ Ð¿ÑÐ¾ÑÐ¸Ð»Ñ, ÑÐ¼Ð¾ÑÑÐ¸ÑÐµ Ð¾ÑÐºÑÑÑÑÐµ ÑÐ¼ÐµÐ½Ñ, Ð¾ÑÐºÐ»Ð¸ÐºÐ°Ð¹ÑÐµÑÑ Ð½Ð° Ð·Ð°Ð´Ð°Ð½Ð¸Ñ Ð¸ Ð¿ÑÐ¸Ð½Ð¸Ð¼Ð°Ð¹ÑÐµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ Ð¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹.",
      ctaPrimary: "Ð¡Ð¾Ð·Ð´Ð°ÑÑ Ð°Ð½ÐºÐµÑÑ",
      ctaSecondary: "ÐÐ¾Ð¹ÑÐ¸ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑ",
      benefit1: "Ð¡Ð¼ÐµÐ½Ñ ÑÑÐ´Ð¾Ð¼",
      benefit2: "ÐÑÐºÐ»Ð¸ÐºÐ¸ Ð½Ð° Ð·Ð°Ð´Ð°Ð½Ð¸Ñ",
      benefit3: "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ Ð¾Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹",
      stepsTitle: "ÐÐ°Ðº ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÑ Ð·Ð°Ð±Ð¸ÑÐ°ÑÑ ÑÐ¼ÐµÐ½Ñ",
      stepsLead:
        "ÐÐ¾Ð³Ð¸ÐºÐ° ÐºÐ°Ðº Ñ ÑÐµÑÐ²Ð¸ÑÐ¾Ð² Ð³Ð¸Ð±ÐºÐ¾Ð¹ Ð·Ð°Ð½ÑÑÐ¾ÑÑÐ¸: Ð¿ÑÐ¾ÑÐ¸Ð»Ñ, Ð»ÐµÐ½ÑÐ° ÑÐ¼ÐµÐ½, Ð¾ÑÐºÐ»Ð¸Ðº, Ð¿Ð¾Ð´ÑÐ²ÐµÑÐ¶Ð´ÐµÐ½Ð¸Ðµ.",
      step1Label: "ÐÑÐ¾ÑÐ¸Ð»Ñ",
      step1Title: "Ð£ÐºÐ°Ð¶Ð¸ÑÐµ Ð¿ÑÐ¾ÑÐµÑÑÐ¸Ñ Ð¸ ÑÑÐ°Ð²ÐºÑ",
      step1Text:
        "ÐÐ¾Ð²Ð°Ñ, Ð±Ð°ÑÐ¸ÑÑÐ°, Ð¾ÑÐ¸ÑÐ¸Ð°Ð½Ñ, Ð°Ð´Ð¼Ð¸Ð½Ð¸ÑÑÑÐ°ÑÐ¾Ñ, Ð´Ð¾ÑÑÑÐ¿Ð½ÑÐµ Ð´Ð½Ð¸, Ð²ÑÐµÐ¼Ñ Ð¸ Ð³Ð¾ÑÐ¾Ð²Ð½Ð¾ÑÑÑ Ðº Ð²ÑÐµÐ·Ð´Ñ.",
      step2Label: "Ð¡Ð¼ÐµÐ½Ñ",
      step2Title: "Ð¡Ð¼Ð¾ÑÑÐ¸ÑÐµ Ð¾ÑÐºÑÑÑÑÐµ Ð·Ð°Ð´Ð°Ð½Ð¸Ñ",
      step2Text:
        "Ð ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ ÐµÑÑÑ ÑÐ¸Ð»ÑÑÑ Ð¿Ð¾ Ð¿ÑÐ¾ÑÐµÑÑÐ¸Ð¸, Ð³Ð¾ÑÐ¾Ð´Ñ, ÑÑÐ°Ð²ÐºÐµ Ð¸ ÑÑÐµÐ±Ð¾Ð²Ð°Ð½Ð¸ÑÐ¼ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.",
      step3Label: "ÐÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ",
      step3Title: "ÐÑÐ¸Ð½Ð¸Ð¼Ð°Ð¹ÑÐµ Ð¸Ð»Ð¸ Ð¾ÑÐºÐ»Ð¾Ð½ÑÐ¹ÑÐµ",
      step3Text:
        "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¼Ð¾Ð³ÑÑ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÑÑ Ð¿ÑÑÐ¼ÑÐµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ, Ð° ÑÐ°Ð±Ð¾ÑÐ½Ð¸Ðº ÑÐ¿ÑÐ°Ð²Ð»ÑÐµÑ Ð¾ÑÐ²ÐµÑÐ¾Ð¼ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ.",
      formTitle: "ÐÐ½ÐºÐµÑÐ° ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ°",
      formLead:
        "ÐÐ»Ñ Ð¿Ð¾Ð»Ð½Ð¾ÑÐµÐ½Ð½Ð¾Ð¹ Ð°Ð½ÐºÐµÑÑ Ð·Ð°ÑÐµÐ³Ð¸ÑÑÑÐ¸ÑÑÐ¹ÑÐµÑÑ ÐºÐ°Ðº ÑÐ°Ð±Ð¾ÑÐ½Ð¸Ðº Ð¸ Ð·Ð°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ Ð¿ÑÐ¾ÑÐ¸Ð»Ñ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ.",
    },
    restaurants: {
      hero: "assets/hero-restaurants.webp",
      eyebrow: "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸ÑÐ¼ HoReCa",
      title: "ÐÐ°ÐºÑÑÐ²Ð°Ð¹ÑÐµ ÑÐ¼ÐµÐ½Ñ Ð±ÐµÐ· Ð±ÐµÑÐºÐ¾Ð½ÐµÑÐ½ÑÑ ÑÐ°ÑÐ¾Ð²",
      lead: "ÐÑÐ±Ð»Ð¸ÐºÑÐ¹ÑÐµ ÑÐ¼ÐµÐ½Ñ, Ð¿Ð¾Ð»ÑÑÐ°Ð¹ÑÐµ Ð¾ÑÐºÐ»Ð¸ÐºÐ¸, ÑÐ¼Ð¾ÑÑÐ¸ÑÐµ Ð°Ð½ÐºÐµÑÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð² Ð¸ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÐ¹ÑÐµ Ð¿ÑÑÐ¼ÑÐµ Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ.",
      ctaPrimary: "ÐÐ°Ð¹ÑÐ¸ Ð¿ÐµÑÑÐ¾Ð½Ð°Ð»",
      ctaSecondary: "ÐÑÑÐ°Ð²Ð¸ÑÑ Ð·Ð°ÑÐ²ÐºÑ",
      benefit1: "ÐÑÐ±Ð»Ð¸ÐºÐ°ÑÐ¸Ñ ÑÐ¼ÐµÐ½",
      benefit2: "ÐÑÐºÐ»Ð¸ÐºÐ¸ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð²",
      benefit3: "ÐÐ°Ð·Ð° Ð°Ð½ÐºÐµÑ",
      stepsTitle: "Ð§ÑÐ¾ Ð¿Ð¾Ð»ÑÑÐ°ÐµÑ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ",
      stepsLead:
        "ÐÐ¿ÐµÑÐ°ÑÐ¸Ð¾Ð½Ð½ÑÐ¹ ÑÐºÑÐ°Ð½ Ð´Ð»Ñ ÑÐ¿ÑÐ°Ð²Ð»ÑÑÑÐµÐ³Ð¾, ÑÐµÑÐ° Ð¸Ð»Ð¸ HR: ÑÐ¼ÐµÐ½Ñ, Ð°Ð½ÐºÐµÑÑ, Ð¾ÑÐºÐ»Ð¸ÐºÐ¸ Ð¸ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¸.",
      step1Label: "Ð¡Ð¼ÐµÐ½Ñ",
      step1Title: "Ð¡Ð¾Ð·Ð´Ð°Ð²Ð°Ð¹ÑÐµ Ð·Ð°Ð´Ð°Ð½Ð¸Ñ",
      step1Text:
        "ÐÐ°ÑÐ°, Ð²ÑÐµÐ¼Ñ, ÑÑÐ°Ð²ÐºÐ°, Ð¿ÑÐ¾ÑÐµÑÑÐ¸Ñ, ÑÐ°Ð¹Ð¾Ð½, Ð°Ð´ÑÐµÑ Ð¸ ÑÑÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¿Ð¾Ð¿Ð°Ð´Ð°ÑÑ Ð² Ð»ÐµÐ½ÑÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð².",
      step2Label: "Ð Ð°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¸",
      step2Title: "ÐÑÐ¸ÑÐµ Ð¿Ð¾ Ð±Ð°Ð·Ðµ",
      step2Text:
        "Ð¤Ð¸Ð»ÑÑÑÑÐ¹ÑÐµ Ð°Ð½ÐºÐµÑÑ Ð¿Ð¾ Ð¿ÑÐ¾ÑÐµÑÑÐ¸Ð¸, Ð¾Ð¿ÑÑÑ, Ð³ÑÐ°ÑÐ¸ÐºÑ, ÑÑÐ°Ð²ÐºÐµ Ð¸ Ð³Ð¾ÑÐ¾Ð²Ð½Ð¾ÑÑÐ¸ Ð¿ÑÐ¸ÐµÑÐ°ÑÑ.",
      step3Label: "ÐÐ¾ÑÑÐ°Ð²ÐºÐ¸",
      step3Title: "ÐÑÐ¿ÑÐ°Ð²Ð»ÑÐ¹ÑÐµ Ð·Ð°Ð¿ÑÐ¾ÑÑ",
      step3Text:
        "Ð¡Ð¼Ð¾ÑÑÐ¸ÑÐµ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð¸ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÐ¹ÑÐµ Ð·Ð°ÑÐ²ÐºÑ Ð¿ÑÑÐ¼Ð¾ Ð¸Ð· ÐºÐ°Ð±Ð¸Ð½ÐµÑÐ° Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ.",
      formTitle: "ÐÐ°ÑÐ²ÐºÐ° Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ",
      formLead:
        "ÐÐ°Ð¿Ð¾Ð»Ð½Ð¸ÑÐµ ÐºÐ¾ÑÐ¾ÑÐºÑÑ Ð·Ð°ÑÐ²ÐºÑ Ð¸Ð»Ð¸ Ð·Ð°ÑÐµÐ³Ð¸ÑÑÑÐ¸ÑÑÐ¹ÑÐµÑÑ, ÑÑÐ¾Ð±Ñ ÑÐ¼Ð¾ÑÑÐµÑÑ Ð°Ð½ÐºÐµÑÑ ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¾Ð² Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ.",
    },
    suppliers: {
      hero: "assets/hero-suppliers.webp",
      eyebrow: "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°Ð¼ HoReCa",
      title: "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¸ Ð´Ð»Ñ HoReCa Ñ Ð²ÑÐ¾Ð´ÑÑÐ¸Ð¼Ð¸ Ð·Ð°ÑÐ²ÐºÐ°Ð¼Ð¸",
      lead: "ÐÑÐ±Ð»Ð¸ÐºÑÐ¹ÑÐµ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ ÑÐ¾Ð²Ð°ÑÐ°Ð¼ Ð¸ ÑÑÐ»ÑÐ³Ð°Ð¼, Ð¿Ð¾Ð»ÑÑÐ°Ð¹ÑÐµ Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹ Ð¸ Ð²ÐµÐ´Ð¸ÑÐµ ÐºÐ¾Ð¼Ð¼ÑÐ½Ð¸ÐºÐ°ÑÐ¸Ñ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ.",
      ctaPrimary: "Ð¡ÑÐ°ÑÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð¼",
      ctaSecondary: "ÐÐ¾Ð¹ÑÐ¸",
      benefit1: "ÐÑÑÐµÑÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð²",
      benefit2: "ÐÐ°ÑÐ²ÐºÐ¸ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹",
      benefit3: "Ð¤Ð¸Ð»ÑÑÑ Ð¿Ð¾ ÐºÐ°ÑÐµÐ³Ð¾ÑÐ¸ÑÐ¼",
      stepsTitle: "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸Ðº Ð²Ð¸Ð´Ð¸Ñ ÑÐ¿ÑÐ¾Ñ, Ð° Ð½Ðµ ÑÐ»ÑÑÐ°Ð¹Ð½ÑÐµ ÑÐ¾Ð¾Ð±ÑÐµÐ½Ð¸Ñ",
      stepsLead:
        "Ð¡ÐµÑÐ²Ð¸Ñ ÑÐ¾ÐµÐ´Ð¸Ð½ÑÐµÑ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð¸ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¾Ð² Ð²Ð½ÑÑÑÐ¸ Ð¾Ð´Ð½Ð¾Ð³Ð¾ HoReCa-ÐºÐ¾Ð½ÑÑÑÐ°.",
      step1Label: "ÐÐ°ÑÐ°Ð»Ð¾Ð³",
      step1Title: "ÐÑÐ±Ð»Ð¸ÐºÑÐ¹ÑÐµ Ð¾ÑÑÐµÑÑ",
      step1Text:
        "Ð¡ÑÑ, ÑÐ°ÑÐ°Ñ, ÐºÐ¾ÑÐµ, ÐºÐ»Ð¸Ð½Ð¸Ð½Ð³, Ð¾Ð±Ð¾ÑÑÐ´Ð¾Ð²Ð°Ð½Ð¸Ðµ, Ð¿Ð¾ÑÑÐ´Ð°, ÑÐ½Ð¸ÑÐ¾ÑÐ¼Ð° Ð¸ ÑÑÐ»ÑÐ³Ð¸ Ð´Ð»Ñ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹.",
      step2Label: "ÐÐ°ÑÐ²ÐºÐ¸",
      step2Title: "ÐÐ¾Ð»ÑÑÐ°Ð¹ÑÐµ Ð²ÑÐ¾Ð´ÑÑÐ¸Ðµ",
      step2Text:
        "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð²ÑÐ±Ð¸ÑÐ°ÐµÑ Ð¿ÑÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð¸ Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÑÐµÑ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÑ Ð·Ð°Ð¿ÑÐ¾Ñ Ñ ÐºÐ¾Ð»Ð¸ÑÐµÑÑÐ²Ð¾Ð¼, Ð³Ð¾ÑÐ¾Ð´Ð¾Ð¼ Ð¸ Ð±ÑÐ´Ð¶ÐµÑÐ¾Ð¼.",
      step3Label: "Ð¤Ð¸Ð»ÑÑÑÑ",
      step3Title: "Ð Ð°Ð±Ð¾ÑÐ°Ð¹ÑÐµ Ð¿Ð¾ ÐºÐ°ÑÐµÐ³Ð¾ÑÐ¸ÑÐ¼",
      step3Text:
        "Ð ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ° Ð¼Ð¾Ð¶Ð½Ð¾ ÑÐ¼Ð¾ÑÑÐµÑÑ Ð·Ð°Ð¿ÑÐ¾ÑÑ Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ð¹ Ð¸ Ð±ÑÑÑÑÐ¾ Ð½Ð°ÑÐ¾Ð´Ð¸ÑÑ Ð½ÑÐ¶Ð½ÑÐµ Ð¿Ð¾Ð·Ð¸ÑÐ¸Ð¸.",
      formTitle: "ÐÐ½ÐºÐµÑÐ° Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°",
      formLead:
        "ÐÑÑÐ°Ð²ÑÑÐµ Ð´Ð°Ð½Ð½ÑÐµ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸, ÐºÐ°ÑÐµÐ³Ð¾ÑÐ¸Ñ Ð¸ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ¾Ð²Ð°ÑÐ¾Ð² Ð¸Ð»Ð¸ ÑÑÐ»ÑÐ³.",
    },
    auth: {
      hero: "assets/hero-home.webp",
      eyebrow: "ÐÐ´Ð¸Ð½ÑÐ¹ Ð²ÑÐ¾Ð´ GastroConnect",
      title: "ÐÑÐ¾Ð´ Ð¸ ÑÐµÐ³Ð¸ÑÑÑÐ°ÑÐ¸Ñ",
      lead: "ÐÑÐ±ÐµÑÐ¸ÑÐµ ÑÐ¾Ð»Ñ Ð¸ ÑÐ¾Ð·Ð´Ð°Ð¹ÑÐµ Ð°ÐºÐºÐ°ÑÐ½Ñ. ÐÐ¾ÑÐ»Ðµ Ð²ÑÐ¾Ð´Ð° Ð²Ñ Ð¿Ð¾Ð¿Ð°Ð´ÐµÑÐµ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑ.",
    },
    cabinet: {
      hero: "assets/hero-home.webp",
      eyebrow: "Ð Ð°Ð±Ð¾ÑÐµÐµ Ð¿ÑÐ¾ÑÑÑÐ°Ð½ÑÑÐ²Ð¾",
      title: "ÐÐ°Ð±Ð¸Ð½ÐµÑ GastroConnect",
      lead: "ÐÑÐ¾ÑÐ¸Ð»Ð¸, ÑÐ¼ÐµÐ½Ñ, Ð¿ÑÐ¸Ð³Ð»Ð°ÑÐµÐ½Ð¸Ñ Ð¸ Ð·Ð°ÑÐ²ÐºÐ¸ ÑÐ¾Ð±ÑÐ°Ð½Ñ Ð² Ð¾Ð´Ð½Ð¾Ð¼ Ð¼ÐµÑÑÐµ Ð´Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð¹ ÑÐ¾Ð»Ð¸.",
    },
    admin: {
      hero: "assets/hero-home.webp",
      eyebrow: "Ð£Ð¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÐ°Ð¹ÑÐ¾Ð¼",
      title: "ÐÐ°Ð½ÐµÐ»Ñ ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ñ GastroConnect",
      lead: "ÐÐ°Ð½ÐµÐ»Ñ Ð´Ð»Ñ Ð·Ð°ÑÐ²Ð¾Ðº, Ð¸Ð·Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð¸Ð¹, Ð»Ð¾Ð³Ð¾ÑÐ¸Ð¿Ð° Ð¸ Ð³Ð»Ð°Ð²Ð½ÑÑ Ð½Ð°Ð´Ð¿Ð¸ÑÐµÐ¹ ÑÐ°Ð¹ÑÐ°.",
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
    if (!response.ok) throw new Error("supabase.js Ð½Ðµ Ð·Ð°Ð³ÑÑÐ·Ð¸Ð»ÑÑ");
    const source = await response.text();
    const url = source.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    const key = source.match(/SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/i)?.[1];
    if (!url || !key) throw new Error("Supabase config Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½");
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
        reason: "Supabase Auth Ð½Ðµ Ð¿Ð¾Ð´ÐºÐ»ÑÑÐµÐ½ Ð½Ð° ÑÑÐ¾Ð¹ ÑÑÑÐ°Ð½Ð¸ÑÐµ.",
      };
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) {
      return {
        saved: false,
        reason: "ÐÐ¾Ð¹Ð´Ð¸ÑÐµ ÐºÐ°Ðº admin, ÑÑÐ¾Ð±Ñ ÑÐ¾ÑÑÐ°Ð½Ð¸ÑÑ Ð³Ð»Ð¾Ð±Ð°Ð»ÑÐ½Ð¾.",
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
    if (!client) throw new Error("Supabase Auth Ð½Ðµ Ð¿Ð¾Ð´ÐºÐ»ÑÑÐµÐ½.");
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session)
      throw new Error("ÐÐ¾Ð¹Ð´Ð¸ÑÐµ ÐºÐ°Ðº admin, ÑÑÐ¾Ð±Ñ Ð·Ð°Ð³ÑÑÐ·Ð¸ÑÑ ÑÐ°Ð¹Ð».");
    const folder = target.replaceAll(".", "-");
    const filePath = `${folder}/${Date.now()}-${safeAssetName(file.name)}`;
    const { error } = await client.storage
      .from(SITE_ASSETS_BUCKET)
      .upload(filePath, file, { cacheControl: "31536000", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = client.storage
      .from(SITE_ASSETS_BUCKET)
      .getPublicUrl(filePath);
    if (!data?.publicUrl) throw new Error("Supabase Ð½Ðµ Ð²ÐµÑÐ½ÑÐ» Ð¿ÑÐ±Ð»Ð¸ÑÐ½ÑÐ¹ URL.");
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
        message.textContent = `JSON Ð½Ð°ÑÑÑÐ¾ÐµÐº Ð½Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½: ${error.message}`;
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
        ? "ÐÐ°ÑÑÑÐ¾Ð¹ÐºÐ¸ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ñ Ð³Ð»Ð¾Ð±Ð°Ð»ÑÐ½Ð¾ Ð² Supabase."
        : `ÐÐ°ÑÑÑÐ¾Ð¹ÐºÐ¸ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ñ Ð»Ð¾ÐºÐ°Ð»ÑÐ½Ð¾. ÐÐ»Ð¾Ð±Ð°Ð»ÑÐ½Ð¾Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð¸Ðµ: ${remote.reason}`;
    });
    resetButton?.addEventListener("click", async () => {
      writeSiteSettings(defaultSiteSettings);
      applySiteSettings(defaultSiteSettings);
      const jsonField = document.getElementById("siteSettingsJson");
      if (jsonField) jsonField.dataset.dirty = "false";
      fillSiteSettingsForm(defaultSiteSettings);
      const remote = await saveSettingsToSupabase(defaultSiteSettings);
      message.textContent = remote.saved
        ? "ÐÐ°ÑÑÑÐ¾Ð¹ÐºÐ¸ ÑÐ±ÑÐ¾ÑÐµÐ½Ñ Ð³Ð»Ð¾Ð±Ð°Ð»ÑÐ½Ð¾."
        : "ÐÐ°ÑÑÑÐ¾Ð¹ÐºÐ¸ ÑÐ±ÑÐ¾ÑÐµÐ½Ñ Ð»Ð¾ÐºÐ°Ð»ÑÐ½Ð¾.";
    });
    refreshJsonButton?.addEventListener("click", () => {
      const jsonField = document.getElementById("siteSettingsJson");
      if (jsonField) jsonField.dataset.dirty = "false";
      try {
        updateSiteSettingsJson(collectSiteSettingsFromForm(form));
      } catch (error) {
        if (message) message.textContent = `JSON Ð½Ðµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½: ${error.message}`;
        return;
      }
      if (message)
        message.textContent = "JSON Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½ Ð¸Ð· ÑÐµÐºÑÑÐ¸Ñ Ð¿Ð¾Ð»ÐµÐ¹ ÑÐ¾ÑÐ¼Ñ.";
    });
    downloadJsonButton?.addEventListener("click", () => {
      let next;
      try {
        next = collectSiteSettingsFromForm(form);
      } catch (error) {
        if (message) message.textContent = `JSON Ð½Ðµ ÑÐºÐ°ÑÐ°Ð½: ${error.message}`;
        return;
      }
      download(
        "gastroconnect-site-settings.json",
        JSON.stringify(next, null, 2),
        "application/json;charset=utf-8",
      );
      if (message) message.textContent = "JSON Ð½Ð°ÑÑÑÐ¾ÐµÐº ÑÐºÐ°ÑÐ°Ð½.";
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
          if (message) message.textContent = "JSON Ð½Ð°ÑÑÑÐ¾ÐµÐº Ð¿Ð¾ÐºÐ° Ð½ÐµÐ²Ð°Ð»Ð¸Ð´Ð½ÑÐ¹.";
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
          message.textContent = "ÐÐ°Ð³ÑÑÐ¶Ð°ÐµÐ¼ ÑÐ°Ð¹Ð»...";
          const publicUrl = await uploadSiteAsset(file, target);
          if (targetField) targetField.value = publicUrl;
          updateSiteSettingsPreview(collectSiteSettingsFromForm(form));
          message.textContent =
            "Ð¤Ð°Ð¹Ð» Ð·Ð°Ð³ÑÑÐ¶ÐµÐ½. ÐÐ°Ð¶Ð¼Ð¸ÑÐµ Â«Ð¡Ð¾ÑÑÐ°Ð½Ð¸ÑÑ Ð½Ð°ÑÑÑÐ¾Ð¹ÐºÐ¸Â», ÑÑÐ¾Ð±Ñ Ð¿ÑÐ¸Ð¼ÐµÐ½Ð¸ÑÑ Ð½Ð° ÑÐ°Ð¹ÑÐµ.";
        } catch (error) {
          message.textContent = `ÐÐ°Ð³ÑÑÐ·ÐºÐ° Ð½Ðµ ÑÐ´Ð°Ð»Ð°ÑÑ: ${error.message}`;
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
    if (type === "callback") return data.name || "ÐÐ°ÐºÐ°Ð·Ð°ÑÑ Ð·Ð²Ð¾Ð½Ð¾Ðº";
    if (type === "feedback") return data.name || "ÐÐ±ÑÐ°ÑÐ½Ð°Ñ ÑÐ²ÑÐ·Ñ";
    if (type === "telegram_bot") return data.telegram || "Telegram-ÑÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ";
    if (type === "worker") return data.name || "Ð Ð°Ð±Ð¾ÑÐ½Ð¸Ðº";
    if (type === "restaurant") return data.business_name || "ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ";
    return data.company_name || "ÐÐ¾ÑÑÐ°Ð²ÑÐ¸Ðº";
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
      new: "ÐÐ¾Ð²Ð°Ñ",
      in_progress: "Ð ÑÐ°Ð±Ð¾ÑÐµ",
      done: "ÐÐ°ÐºÑÑÑÐ°",
      archived: "ÐÑÑÐ¸Ð²",
    }[status] || "ÐÐ¾Ð²Ð°Ñ";
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
      function getOrCreateErrorBadge(input) {
        const parent = input.closest("label") || input.parentElement;
        let badge = parent.querySelector(".field-error-msg");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "field-error-msg";
          parent.appendChild(badge);
        }
        return badge;
      }

      function validateField(input, isBlur = false) {
        if (!input || input.type === "hidden" || input.type === "submit") return true;
        const val = input.value.trim();
        const badge = getOrCreateErrorBadge(input);
        let isValid = true;
        let errorMsg = "";

        if (input.name === "name") {
          if (!val) {
            isValid = false;
            errorMsg = "ÐÐ¾Ð¶Ð°Ð»ÑÐ¹ÑÑÐ°, ÑÐºÐ°Ð¶Ð¸ÑÐµ Ð¸Ð¼Ñ";
          } else if (val.length < 2) {
            isValid = false;
            errorMsg = "ÐÐ¼Ñ Ð´Ð¾Ð»Ð¶Ð½Ð¾ ÑÐ¾Ð´ÐµÑÐ¶Ð°ÑÑ Ð¾Ñ 2 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²";
          }
        } else if (input.name === "phone" || input.type === "tel") {
          const digits = val.replace(/\D/g, "");
          if (!val) {
            isValid = false;
            errorMsg = "Ð£ÐºÐ°Ð¶Ð¸ÑÐµ Ð½Ð¾Ð¼ÐµÑ ÑÐµÐ»ÐµÑÐ¾Ð½Ð° Ð´Ð»Ñ ÑÐ²ÑÐ·Ð¸";
          } else if (digits.length < 10) {
            isValid = false;
            errorMsg = "ÐÐ²ÐµÐ´Ð¸ÑÐµ ÐºÐ¾ÑÑÐµÐºÑÐ½ÑÐ¹ Ð½Ð¾Ð¼ÐµÑ (10â11 ÑÐ¸ÑÑ)";
          }
        } else if (input.name === "email" || input.type === "email") {
          if (input.required && !val) {
            isValid = false;
            errorMsg = "Ð£ÐºÐ°Ð¶Ð¸ÑÐµ email";
          } else if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            isValid = false;
            errorMsg = "ÐÐµÐºÐ¾ÑÑÐµÐºÑÐ½ÑÐ¹ ÑÐ¾ÑÐ¼Ð°Ñ email";
          }
        } else if (input.required && !val) {
          isValid = false;
          errorMsg = "ÐÐ±ÑÐ·Ð°ÑÐµÐ»ÑÐ½Ð¾Ðµ Ð¿Ð¾Ð»Ðµ Ð´Ð»Ñ Ð·Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ";
        }

        if (isValid) {
          input.classList.remove("is-invalid");
          if (val.length > 0) input.classList.add("is-valid");
          else input.classList.remove("is-valid");
          badge.classList.remove("show");
          badge.textContent = "";
        } else {
          input.classList.remove("is-valid");
          if (isBlur || input.dataset.touched === "true") {
            input.classList.add("is-invalid");
            badge.textContent = errorMsg;
            badge.classList.add("show");
          }
        }
        return isValid;
      }

      form.querySelectorAll("input, select, textarea").forEach((input) => {
        if (input.type === "hidden" || input.type === "submit") return;

        if (input.name === "phone" || input.type === "tel") {
          input.addEventListener("input", () => {
            input.dataset.touched = "true";
            let raw = input.value.replace(/\D/g, "");
            if (raw.startsWith("7") || raw.startsWith("8")) raw = raw.slice(1);
            if (raw.length > 0) {
              let formatted = "+7 (";
              formatted += raw.slice(0, 3);
              if (raw.length > 3) formatted += ") " + raw.slice(3, 6);
              if (raw.length > 6) formatted += "-" + raw.slice(6, 8);
              if (raw.length > 8) formatted += "-" + raw.slice(8, 10);
              input.value = formatted;
            }
            validateField(input);
          });
        } else if (input.type !== "checkbox") {
          input.addEventListener("input", () => {
            input.dataset.touched = "true";
            validateField(input);
          });
        }

        input.addEventListener("blur", () => {
          input.dataset.touched = "true";
          validateField(input, true);
        });
      });

      const consentBox = form.querySelector('input[name="personalDataConsent"]');
      if (consentBox) {
        consentBox.addEventListener("change", () => {
          const wrapper = consentBox.closest(".consent-checkbox") || consentBox.parentElement;
          if (consentBox.checked) {
            wrapper.classList.remove("is-invalid");
          }
        });
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = form.querySelector(
          'button[type="submit"], input[type="submit"]',
        );

        let formIsValid = true;
        let firstInvalid = null;

        form.querySelectorAll("input, select, textarea").forEach((input) => {
          if (input.type === "hidden" || input.type === "submit" || input.type === "checkbox") return;
          input.dataset.touched = "true";
          const valid = validateField(input, true);
          if (!valid) {
            formIsValid = false;
            if (!firstInvalid) firstInvalid = input;
          }
        });

        const consent = form.querySelector('input[name="personalDataConsent"]');
        if (consent && !consent.checked) {
          formIsValid = false;
          const wrapper = consent.closest(".consent-checkbox") || consent.parentElement;
          wrapper.classList.add("is-invalid");
          if (!firstInvalid) firstInvalid = consent;
        }

        if (!formIsValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        if (button) button.disabled = true;
        const type = form.dataset.formType;
        const data = enrichSubmissionData(form, type);
        const box = form.querySelector(".success");
        try {
          const result = await saveSubmission(type, data);
          if (box) {
            box.setAttribute("role", "status");
            box.textContent = result.remote
              ? "ÐÐ¾ÑÐ¾Ð²Ð¾. ÐÐ°ÑÐ²ÐºÐ° Ð¾ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð°, Ð¼Ñ Ð¿Ð¾Ð»ÑÑÐ¸Ð»Ð¸ Ð²Ð°ÑÐ¸ ÐºÐ¾Ð½ÑÐ°ÐºÑÑ Ð¸ ÑÐ²ÑÐ¶ÐµÐ¼ÑÑ Ñ Ð²Ð°Ð¼Ð¸."
              : "ÐÐ°ÑÐ²ÐºÐ° ÑÐ¾ÑÑÐ°Ð½ÐµÐ½Ð° Ð² ÑÑÐ¾Ð¼ Ð±ÑÐ°ÑÐ·ÐµÑÐµ. ÐÑÐ»Ð¸ Ð¸Ð½ÑÐµÑÐ½ÐµÑ Ð¸Ð»Ð¸ Ð±Ð°Ð·Ð° Ð²ÑÐµÐ¼ÐµÐ½Ð½Ð¾ Ð½ÐµÐ´Ð¾ÑÑÑÐ¿Ð½Ñ, Ð¿Ð¾Ð²ÑÐ¾ÑÐ¸ÑÐµ Ð¾ÑÐ¿ÑÐ°Ð²ÐºÑ Ð¿Ð¾Ð·Ð¶Ðµ.";
            box.style.display = "block";
          }
          form.reset();
          form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => el.classList.remove("is-valid", "is-invalid"));
          form.querySelectorAll(".field-error-msg").forEach((el) => el.classList.remove("show"));
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
      worker: "ÑÐ°Ð±Ð¾ÑÐ½Ð¸ÐºÐ°",
      restaurant: "Ð·Ð°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ",
      supplier: "Ð¿Ð¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ°",
    };
    const modeCopy = {
      signup: {
        title: "Ð ÐµÐ³Ð¸ÑÑÑÐ°ÑÐ¸Ñ",
        hint: "ÐÑÐ±ÐµÑÐ¸ÑÐµ ÑÐ¾Ð»Ñ, ÑÐ¾Ð·Ð´Ð°Ð¹ÑÐµ Ð°ÐºÐºÐ°ÑÐ½Ñ Ð¸ ÑÑÐ°Ð·Ñ Ð¿ÐµÑÐµÑÐ¾Ð´Ð¸ÑÐµ Ð² ÑÐ²Ð¾Ð¹ ÐºÐ°Ð±Ð¸Ð½ÐµÑ.",
      },
      login: {
        title: "ÐÑÐ¾Ð´",
        hint: "ÐÐ²ÐµÐ´Ð¸ÑÐµ email Ð¸ Ð¿Ð°ÑÐ¾Ð»Ñ. Ð Ð¾Ð»Ñ Ð¿Ð¾Ð´ÑÑÐ½ÐµÑÑÑ Ð¸Ð· Ð²Ð°ÑÐµÐ³Ð¾ Ð¿ÑÐ¾ÑÐ¸Ð»Ñ.",
      },
    };
    const params = new URLSearchParams(window.location.search);
    const requestedRole = normalizeAuthRole(params.get("role"));
    let authMode = params.get("mode") === "login" ? "login" : "signup";
    roleInput.value = requestedRole;

    function cabinetUrl() {
      return `/cabinet/?role=${encodeURIComponent(roleInput.value)}`;
    }

    function setAuthBusy(isBusy, text = "ÐÑÐ¾Ð²ÐµÑÑÐµÐ¼...") {
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
        authModeHint.textContent = `ÐÑÐ´ÐµÑ ÑÐ¾Ð·Ð´Ð°Ð½ ÐºÐ°Ð±Ð¸Ð½ÐµÑ ${roleLabelsFull[roleInput.value]}.`;
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
        name: user.email || "ÐÐ¾Ð»ÑÐ·Ð¾Ð²Ð°ÑÐµÐ»Ñ",
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
          "ÐÑ ÑÐ¶Ðµ Ð²Ð¾ÑÐ»Ð¸. ÐÐ¾Ð¶Ð½Ð¾ Ð¾ÑÐºÑÑÑÑ ÐºÐ°Ð±Ð¸Ð½ÐµÑ Ð¸Ð»Ð¸ Ð²ÑÐ¹ÑÐ¸ Ð¸Ð· Ð°ÐºÐºÐ°ÑÐ½ÑÐ° Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑÐµ.";
      }
    }

    registerBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const role = normalizeAuthRole(roleInput.value);
      if (!client) {
        message.textContent = "Supabase Ð½Ðµ Ð·Ð°Ð³ÑÑÐ·Ð¸Ð»ÑÑ. ÐÐ±Ð½Ð¾Ð²Ð¸ÑÐµ ÑÑÑÐ°Ð½Ð¸ÑÑ.";
        return;
      }
      if (!email || !password) {
        message.textContent = "ÐÐ²ÐµÐ´Ð¸ÑÐµ email Ð¸ Ð¿Ð°ÑÐ¾Ð»Ñ.";
        return;
      }
      if (password.length < 6) {
        message.textContent = "ÐÐ°ÑÐ¾Ð»Ñ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð±ÑÑÑ Ð¼Ð¸Ð½Ð¸Ð¼ÑÐ¼ 6 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð².";
        return;
      }

      setAuthBusy(true, "Ð¡Ð¾Ð·Ð´Ð°ÐµÐ¼ Ð°ÐºÐºÐ°ÑÐ½Ñ...");
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      if (error) {
        setAuthBusy(false);
        message.textContent = `ÐÑÐ¸Ð±ÐºÐ° ÑÐµÐ³Ð¸ÑÑÑÐ°ÑÐ¸Ð¸: ${error.message}`;
        return;
      }

      if (data?.session?.user) {
        try {
          await ensureProfileAfterAuth(data.session.user, role);
          window.location.href = cabinetUrl();
          return;
        } catch (profileError) {
          setAuthBusy(false);
          message.textContent = `ÐÐºÐºÐ°ÑÐ½Ñ ÑÐ¾Ð·Ð´Ð°Ð½, Ð½Ð¾ Ð¿ÑÐ¾ÑÐ¸Ð»Ñ Ð½Ðµ ÑÐ¾ÑÑÐ°Ð½ÐµÐ½: ${profileError.message}`;
          return;
        }
      }

      setAuthBusy(false);
      message.textContent =
        "ÐÐºÐºÐ°ÑÐ½Ñ ÑÐ¾Ð·Ð´Ð°Ð½. ÐÑÐ»Ð¸ Supabase Ð¿ÑÐ¾ÑÐ¸Ñ Ð¿Ð¾Ð´ÑÐ²ÐµÑÐ¶Ð´ÐµÐ½Ð¸Ðµ email, Ð¿Ð¾Ð´ÑÐ²ÐµÑÐ´Ð¸ÑÐµ Ð¿Ð¾ÑÑÑ Ð¸ Ð²Ð¾Ð¹Ð´Ð¸ÑÐµ.";
      setAuthMode("login");
    });

    loginBtn?.addEventListener("click", async () => {
      const client = window.supabaseClient;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      if (!client) {
        message.textContent = "Supabase Ð½Ðµ Ð·Ð°Ð³ÑÑÐ·Ð¸Ð»ÑÑ. ÐÐ±Ð½Ð¾Ð²Ð¸ÑÐµ ÑÑÑÐ°Ð½Ð¸ÑÑ.";
        return;
      }
      if (!email || !password) {
        message.textContent = "ÐÐ²ÐµÐ´Ð¸ÑÐµ email Ð¸ Ð¿Ð°ÑÐ¾Ð»Ñ.";
        return;
      }

      setAuthBusy(true, "ÐÑÐ¾Ð´Ð¸Ð¼...");
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthBusy(false);
        message.textContent = `ÐÑÐ¸Ð±ÐºÐ° Ð²ÑÐ¾Ð´Ð°: ${error.message}`;
        return;
      }

      try {
        await ensureProfileAfterAuth(data.user, roleInput.value);
        window.location.href = cabinetUrl();
      } catch (profileError) {
        setAuthBusy(false);
        message.textContent = `ÐÑÐ¾Ð´ Ð²ÑÐ¿Ð¾Ð»Ð½ÐµÐ½, Ð½Ð¾ Ð¿ÑÐ¾ÑÐ¸Ð»Ñ Ð½Ðµ Ð¿ÑÐ¾Ð²ÐµÑÐµÐ½: ${profileError.message}`;
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
      <div class="stat">ÐÑÐµÐ³Ð¾: ${counts.all}</div>
      <div class="stat">ÐÐ¾Ð²ÑÐµ: ${counts.new}</div>
      <div class="stat">Ð ÑÐ°Ð±Ð¾ÑÐµ: ${counts.in_progress}</div>
      <div class="stat">ÐÐ°ÐºÑÑÑÑÐµ: ${counts.done}</div>
      <div class="stat">Ð Ð°Ð±Ð¾ÑÐ½Ð¸ÐºÐ¸: ${counts.worker}</div>
      <div class="stat">ÐÐ°Ð²ÐµÐ´ÐµÐ½Ð¸Ñ: ${counts.restaurant}</div>
      <div class="stat">ÐÐ¾ÑÑÐ°Ð²ÑÐ¸ÐºÐ¸: ${counts.supplier}</div>
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
            <button class="btn compact" type="button" data-admin-status="in_progress" data-row-id="${escapeHtml(rowKey)}">Ð ÑÐ°Ð±Ð¾ÑÑ</button>
            <button class="btn compact" type="button" data-admin-status="done" data-row-id="${escapeHtml(rowKey)}">ÐÐ°ÐºÑÑÑÑ</button>
            <button class="btn compact danger" type="button" data-admin-status="archived" data-row-id="${escapeHtml(rowKey)}">ÐÑÑÐ¸Ð²</button>
          </div>
        </td>
      </tr>
    `;
        },
      )
      .join("");
    if (!visibleRows.length) {
      tbody.innerHTML = '<tr><td colspan="8">ÐÐ°ÑÐ²Ð¾Ðº Ð¿Ð¾ÐºÐ° Ð½ÐµÑ.</td></tr>';
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
        "ÐÐ°ÑÐ°,Ð¢Ð¸Ð¿,Ð¡ÑÐ°ÑÑÑ,ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ,Ð¢ÐµÐ»ÐµÑÐ¾Ð½,Email,Telegram,ÐÐ¾ÑÐ¾Ð´,Ð¡Ð¾Ð³Ð»Ð°ÑÐ¸Ðµ,ÐÐ°ÑÐ° ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ñ",
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
            row.personalDataConsent ? "ÐÐ°" : "ÐÐµÑ",
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
      if (confirm("ÐÑÐ¸ÑÑÐ¸ÑÑ Ð»Ð¾ÐºÐ°Ð»ÑÐ½ÑÐµ Ð·Ð°ÑÐ²ÐºÐ¸?")) {
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

