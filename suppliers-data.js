/**
 * GastroConnect B2B HoReCa Suppliers Database
 * Complete verified registry of Russian & CIS food, equipment, packaging, furniture, IT/automation & service suppliers.
 */

const VERIFIED_SUPPLIERS = [
  // ==========================================
  // КРУПНЫЕ ДИСТРИБЬЮТОРЫ И МАРКЕТПЛЕЙСЫ
  // ==========================================
  {
    id: "sup-dist-01",
    company_name: "Global Foods (Глобал Фудс)",
    short_name: "Global Foods",
    category: "distributors",
    category_label: "Крупный дистрибьютор HoReCa",
    website: "https://www.globalfoods.ru",
    phone: "+7 (495) 787-11-75",
    email: "info@globalfoods.ru",
    telegram: "globalfoods_official",
    rating: 4.95,
    reviews_count: 142,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 15000,
    payment_terms: "Безналичный расчет, отсрочка платежа до 21 дня для HoReCa",
    delivery_schedule: "Ежедневно (включая сб/вс) с 06:00 до 12:00",
    delivery_areas: ["Москва и МО", "Санкт-Петербург", "Краснодарский край", "Федеральная сеть"],
    warehouse: "Москва, Ступинский проезд, 1с2 / Складской логистический хаб",
    description: "Один из ведущих национальных дистрибьюторов продуктов питания и ингредиентов для ресторанов, отелей и кейтеринга в России. Более 4 000 наименований в наличии.",
    badges: ["Топ-дистрибьютор", "ФГИС Меркурий", "Собственный автопарк -18°C..+4°C", "Отсрочка 21 день"],
    products: [
      { id: "gf-1", name: "Сливки кулинарные 33% для соусов и десертов", spec: "Тетра-пак 1 л, жирность 33%", unit: "л", price: 345, in_stock: true },
      { id: "gf-2", name: "Сыр Моцарелла брус 45% (для пиццы)", spec: "Брус 2 кг, превосходное плавление", unit: "кг", price: 475, in_stock: true },
      { id: "gf-3", name: "Вырезка говяжья зачищенная охл. (РФ)", spec: "Вакуум 1.8-2.2 кг, высший сорт", unit: "кг", price: 1250, in_stock: true },
      { id: "gf-4", name: "Лосось атлантический филе Trim D зам.", spec: "Индивидуальный вакуум 1.4-1.8 кг", unit: "кг", price: 1750, in_stock: true }
    ]
  },
  {
    id: "sup-dist-02",
    company_name: "Восток-Запад (East-West Foodservice)",
    short_name: "Восток-Запад",
    category: "distributors",
    category_label: "Федеральный дистрибьютор HoReCa",
    website: "https://ewedigital.ru",
    phone: "+7 (495) 797-90-90",
    email: "horeca@ewgroup.ru",
    telegram: "vostok_zapad_horeca",
    rating: 4.96,
    reviews_count: 188,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 18000,
    payment_terms: "Безнал с НДС, кредитная линия до 30 дней",
    delivery_schedule: "Круглосуточная мультитемпературная логистика",
    delivery_areas: ["Вся Россия (более 50 городов присутствия)"],
    warehouse: "Москва, Домодедово / Ногинск Логистик Парк",
    description: "Крупнейший поставщик продуктов питания и комплексных логистических решений для ресторанов, фастфуд-сетей, кофеен и отелей. Золотой стандарт ресторанного снабжения.",
    badges: ["Крупнейший импортер", "Мультитемпературная доставка", "EDI / 1С / iiko", "ХАССП"],
    products: [
      { id: "vz-1", name: "Картофель фри 9х9 мм высший класс (Lamb Weston)", spec: "Пакет 2.5 кг, короб 10 кг", unit: "кг", price: 185, in_stock: true },
      { id: "vz-2", name: "Масло фритюрное высокоолеиновое 10 л", spec: "Канистра 10 л с дозатором", unit: "шт", price: 1540, in_stock: true },
      { id: "vz-3", name: "Котлета для бургеров говяжья 150г (black angus)", spec: "Шоковая заморозка, короб 4.5 кг", unit: "шт", price: 98, in_stock: true }
    ]
  },
  {
    id: "sup-dist-03",
    company_name: "Марр Руссия (MARR RUSSIA)",
    short_name: "МАРР РУССИЯ",
    category: "distributors",
    category_label: "Производитель и дистрибьютор для общепита",
    website: "https://marr.ru",
    phone: "+7 (495) 787-87-87",
    email: "info@marr.ru",
    telegram: "marr_russia",
    rating: 4.94,
    reviews_count: 130,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 15000,
    payment_terms: "Факторинг, отсрочка до 14-28 дней",
    delivery_schedule: "Ежедневно до 11:00",
    delivery_areas: ["Москва и МО", "СПб", "Новосибирск", "Екатеринбург", "ЮФО"],
    warehouse: "МО, г. Одинцово, ул. Западная",
    description: "Крупнейший в РФ производитель мясных полуфабрикатов и бургерных котлет, а также ключевой дистрибьютор широкого пула продуктов для ресторанного бизнеса.",
    badges: ["Собственное производство", "Мясные полуфабрикаты", "ФГИС Меркурий"],
    products: [
      { id: "mr-1", name: "Котлеты из мраморной говядины 120г", spec: "Короб 40 шт, шоковая заморозка", unit: "шт", price: 89, in_stock: true },
      { id: "mr-2", name: "Сыр Чеддер слайсы для бургеров 1033г", spec: "Пачка 84 ломтика", unit: "упак", price: 680, in_stock: true }
    ]
  },
  {
    id: "sup-dist-04",
    company_name: "Торговая Группа СОЮЗ",
    short_name: "ТГ СОЮЗ",
    category: "distributors",
    category_label: "Комплексный поставщик продуктов HoReCa",
    website: "https://www.tgsind.ru",
    phone: "+7 (499) 577-00-37",
    email: "zakaz@tgsind.ru",
    telegram: "tgsoyuz_opt",
    rating: 4.88,
    reviews_count: 76,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 10000,
    payment_terms: "Безнал / расчет по факту / отсрочка",
    delivery_schedule: "Пн-Сб с 07:00 до 14:00",
    delivery_areas: ["Москва и Московская область"],
    warehouse: "Москва, СВАО / ЮВАО",
    description: "Оптовые поставки всего спектра продуктов питания для ресторанов, кафе, пиццерий и столовых. Более 15 лет на рынке HoReCa.",
    badges: ["Быстрая доставка", "Отсрочка платежа", "Меркурий"],
    products: [
      { id: "tgs-1", name: "Мука пшеничная в/с экстра 50 кг", spec: "Клейковина 28+", unit: "кг", price: 33, in_stock: true },
      { id: "tgs-2", name: "Томаты резаные в с/с (Италия) 2.5 кг", spec: "Ж/б банка 2500г", unit: "шт", price: 385, in_stock: true }
    ]
  },
  {
    id: "sup-dist-05",
    company_name: "GFC (Good Food Club Marketplace)",
    short_name: "GFC Маркетплейс",
    category: "distributors",
    category_label: "B2B Маркетплейс для ресторанов",
    website: "https://gfc-russia.ru",
    phone: "8 (800) 500-89-29",
    email: "support@gfc-russia.ru",
    telegram: "gfc_russia",
    rating: 4.9,
    reviews_count: 94,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 7000,
    payment_terms: "Онлайн оплата, безнал с НДС, СБП, отсрочка",
    delivery_schedule: "Ежедневно от 2 часов",
    delivery_areas: ["Москва, СПб, Казань, Н.Новгород, Самара, Екб и др."],
    warehouse: "Федеральная сеть складов",
    description: "Удобный цифровой B2B маркетплейс и мобильное приложение для шеф-поваров и закупщиков ресторанов с быстрой доставкой и гарантией возврата.",
    badges: ["Мобильное приложение", "Мин. заказ от 7 000 ₽", "Широкий ассортимент"],
    products: [
      { id: "gfc-1", name: "Сыр Cremette Professional 2 кг", spec: "Ведро 2000г для чизкейков и роллов", unit: "кг", price: 530, in_stock: true },
      { id: "gfc-2", name: "Уксус рисовый Мицукан 20 л", spec: "Канистра для суши-баров", unit: "шт", price: 2450, in_stock: true }
    ]
  },
  {
    id: "sup-dist-06",
    company_name: "METRO Cash and Carry (МЕТРО HoReCa)",
    short_name: "METRO Professional",
    category: "distributors",
    category_label: "Оптовый ритейлер и доставка для заведений",
    website: "https://metro-cc.ru",
    phone: "8 (800) 700-10-77",
    email: "horeca@metro-cc.ru",
    telegram: "metro_horeca_russia",
    rating: 4.92,
    reviews_count: 320,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 5000,
    payment_terms: "Безнал / отсрочка по договору поставки / METRO картой",
    delivery_schedule: "Ежедневно круглосуточно (выбор слота)",
    delivery_areas: ["Вся территория РФ (все ТЦ Метро + доставка FSD)"],
    warehouse: "Москва (12 гипермаркетов + FSD хабы)",
    description: "Специализированная программа поставок для предприятий общественного питания METRO Chef: оптовые калибры, контроль качества, сертифицированная продукция.",
    badges: ["METRO Chef", "Доставка до кухни", "Меркурий и Честный Знак"],
    products: [
      { id: "metro-1", name: "Масло подсолнечное рафинированное METRO Chef 5 л", spec: "Бутылка ПЭТ 5 л", unit: "шт", price: 540, in_stock: true },
      { id: "metro-2", name: "Форель радужная охлажденная потр. с/г 1.5-2.5 кг", spec: "Охл на льду", unit: "кг", price: 920, in_stock: true }
    ]
  },
  {
    id: "sup-dist-07",
    company_name: "Свит Лайф Фудсервис (Sweet Life Foodservice)",
    short_name: "Свит Лайф",
    category: "distributors",
    category_label: "Крупнейший независимый дистрибьютор HoReCa",
    website: "https://swlife.ru",
    phone: "+7 (831) 220-00-00",
    email: "horeca@swlife.ru",
    telegram: "sweetlife_foodservice",
    rating: 4.93,
    reviews_count: 110,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 10000,
    payment_terms: "Безнал с НДС, отсрочка до 21 дня",
    delivery_schedule: "Ежедневно собственным автопарком",
    delivery_areas: ["Центральная Россия, Поволжье, Москва и МО"],
    warehouse: "Москва, Н.Новгород, Казань, Самара",
    description: "Более 8 000 позиций продуктов питания для ресторанов, кафе, отелей. Автоматизированная система приема заказов 24/7.",
    badges: ["8000+ товаров", "Высокая точность сборки", "Меркурий ВСД"],
    products: [
      { id: "sw-1", name: "Паста твердых сортов спагетти Barilla 5 кг", spec: "Упаковка 5 кг для HoReCa", unit: "упак", price: 890, in_stock: true }
    ]
  },

  // ==========================================
  // МЯСО, ПТИЦА И ПОЛУФАБРИКАТЫ
  // ==========================================
  {
    id: "sup-meat-01",
    company_name: "АПХ «Мираторг» HoReCa",
    short_name: "Мираторг",
    category: "meat",
    category_label: "Мясо, Птица и Мраморная Говядина",
    website: "https://miratorg.ru",
    phone: "8 (800) 100-80-80",
    email: "b2b@agrohold.ru",
    telegram: "miratorg_horeca",
    rating: 4.98,
    reviews_count: 240,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 15000,
    payment_terms: "Безналичный расчет с НДС, факторинг, отсрочка до 30 дней",
    delivery_schedule: "Ежедневно с 06:00 до 12:00",
    delivery_areas: ["Москва, МО и вся Россия"],
    warehouse: "Москва / Брянск / Домодедово Логистик",
    description: "Крупнейший в России производитель говядины Black Angus grain-fed, свинины, мяса птицы и готовых кулинарных решений для ресторанного бизнеса.",
    badges: ["Black Angus", "ФГИС Меркурий", "Собственные фермы", "ХАССП"],
    products: [
      { id: "mt-1", name: "Рибай стейк из мраморной говядины (Prime/Choice)", spec: "Охлажденный, вакуум 3-4 кг, выдержка 21 день", unit: "кг", price: 2350, in_stock: true },
      { id: "mt-2", name: "Стриплойн стейк (Тонкий край) Black Angus", spec: "Охлажденный кусок 2.5-3.5 кг", unit: "кг", price: 1890, in_stock: true },
      { id: "mt-3", name: "Брискет говяжий (Грудинка для копчения BBQ)", spec: "Охлажденный кусок 4-6 кг", unit: "кг", price: 680, in_stock: true },
      { id: "mt-4", name: "Шея свиная без кости охл.", spec: "Вакуум 2-2.5 кг", unit: "кг", price: 410, in_stock: true }
    ]
  },
  {
    id: "sup-meat-02",
    company_name: "Группа «Черкизово» Food Service",
    short_name: "Черкизово",
    category: "meat",
    category_label: "Мясо птицы, Свинина и Колбасные деликатесы",
    website: "https://cherkizovo.com",
    phone: "8 (800) 200-24-37",
    email: "horeca@cherkizovo.com",
    telegram: "cherkizovo_foodservice",
    rating: 4.91,
    reviews_count: 115,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 12000,
    payment_terms: "Безнал с НДС, отсрочка 14 дней",
    delivery_schedule: "Ежедневно с 07:00",
    delivery_areas: ["Москва, МО, Центральный и Северо-Западный регионы"],
    warehouse: "Москва, Черкизовский МПЗ",
    description: "Прямые поставки куриного филе (Петелинка / Куриное Царство), индейки (Пава-Пава), свинины и специализированных мясных полуфабрикатов для ресторанных кухонь.",
    badges: ["Петелинка / Пава-Пава", "ГОСТ", "Меркурий ВСД"],
    products: [
      { id: "chk-1", name: "Филе грудки цыпленка-бройлера Петелинка охл.", spec: "Монолит в вакууме 2.5 кг, ГОСТ", unit: "кг", price: 320, in_stock: true },
      { id: "chk-2", name: "Бедро бескостное куриное без кожи", spec: "Лоток/монолит 2.5 кг охл.", unit: "кг", price: 345, in_stock: true },
      { id: "chk-3", name: "Крылья куриные 2-х фаланговые (для фритюра)", spec: "Калиброванные 80-100г, зам.", unit: "кг", price: 235, in_stock: true }
    ]
  },
  {
    id: "sup-meat-03",
    company_name: "Мясоперерабатывающий завод РЕМИT (REMIT HoReCa)",
    short_name: "РЕМИТ",
    category: "meat",
    category_label: "Колбасы, Сосиски, Деликатесы и Мясо",
    website: "https://remit.ru",
    phone: "+7 (495) 540-84-84",
    email: "horeca@remit.ru",
    telegram: "remit_horeca",
    rating: 4.93,
    reviews_count: 85,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 10000,
    payment_terms: "Безнал с НДС, отсрочка 10-14 дней",
    delivery_schedule: "Ежедневно до 11:00",
    delivery_areas: ["Москва и Московская область"],
    warehouse: "МО, г. Подольск, Художественный проезд",
    description: "Премиальные колбасные изделия, сосиски для хот-догов и завтраков, бекон для бургеров, мясная нарезка и охлажденное мясо высшего сорта.",
    badges: ["Бекон для бургеров", "Сосиски для гриля", "Меркурий"],
    products: [
      { id: "rmt-1", name: "Бекон варено-копченый слайсированный 1 кг", spec: "Упаковка 1 кг под вакуумом, ровные тонкие слайсы", unit: "кг", price: 590, in_stock: true },
      { id: "rmt-2", name: "Сосиски Венские с сыром для хот-догов и завтраков", spec: "Длина 18 см, натуральная оболочка", unit: "кг", price: 460, in_stock: true }
    ]
  },
  {
    id: "sup-meat-04",
    company_name: "Мясной дом «Гурманин»",
    short_name: "Гурманин",
    category: "meat",
    category_label: "Премиум мясо, Стейки и Дичь",
    website: "https://gurmanin.ru",
    phone: "+7 (812) 600-45-45",
    email: "zakaz@gurmanin.ru",
    telegram: "gurmanin_meat",
    rating: 4.96,
    reviews_count: 67,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 15000,
    payment_terms: "Безнал, карты, отсрочка для постоянных партнеров",
    delivery_schedule: "Пн-Сб с 08:00 до 14:00",
    delivery_areas: ["Москва, Санкт-Петербург"],
    warehouse: "Москва, ул. Рябиновая / СПб, ул. Салова",
    description: "Эксклюзивные стейки сухого и влажного вызревания, баранина, утка, ягненок, перепела и деликатесное мясо для высокой кухни.",
    badges: ["Dry-aged стейки", "Мраморная говядина", "Шеф-выбор"],
    products: [
      { id: "gm-1", name: "Каре ягненка на 8 ребер (Новая Зеландия / Дагестан)", spec: "Охлажденное, вакуум 700-900г", unit: "кг", price: 1850, in_stock: true },
      { id: "gm-2", name: "Утиная грудка Магре охл.", spec: "Вакуум 2 шт (450-550г)", unit: "кг", price: 920, in_stock: true }
    ]
  },

  // ==========================================
  // РЫБА И МОРЕПРОДУКТЫ
  // ==========================================
  {
    id: "sup-fish-01",
    company_name: "Русская Рыбная Компания (РРК)",
    short_name: "РРК",
    category: "fish",
    category_label: "Крупнейший дистрибьютор рыбы и морепродуктов",
    website: "https://rusfishcom.ru",
    phone: "+7 (495) 775-43-34",
    email: "horeca@rusfishcom.ru",
    telegram: "rusfishcom_official",
    rating: 4.97,
    reviews_count: 165,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 20000,
    payment_terms: "Безналичный расчет с НДС, отсрочка до 21 дня",
    delivery_schedule: "Ежедневно до 10:00 в рефрижераторах",
    delivery_areas: ["Вся Россия (филиалы в 30+ регионах)"],
    warehouse: "Москва, Хладокомбинат №14, Дмитровское шоссе",
    description: "Прямой импортер и поставщик охлажденного лосося, белой рыбы, креветок, мидий, гребешка и икры для суши-баров, рыбных ресторанов и отелей.",
    badges: ["Прямой импортер", "Контроль холодовой цепи", "ФГИС Меркурий"],
    products: [
      { id: "rrk-1", name: "Лосось атлантический охл. потр. с головой 5-6 кг", spec: "Мурманск Super Premium, плотное мясо", unit: "кг", price: 1690, in_stock: true },
      { id: "rrk-2", name: "Креветка северная 70/90 варено-мороженая", spec: "Судовая заморозка, короб 5 кг", unit: "кг", price: 780, in_stock: true },
      { id: "rrk-3", name: "Филе судака на коже шоковой заморозки", spec: "Калибр 200-400г, без глазури", unit: "кг", price: 530, in_stock: true }
    ]
  },
  {
    id: "sup-fish-02",
    company_name: "La Marée (Ла Маре HoReCa)",
    short_name: "Ла Маре",
    category: "fish",
    category_label: "Живая и свежая рыба, Устрицы и Деликатесы",
    website: "https://lamaree.ru",
    phone: "+7 (495) 937-05-40",
    email: "opt@lamaree.ru",
    telegram: "lamaree_horeca",
    rating: 4.99,
    reviews_count: 140,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 25000,
    payment_terms: "Безнал, персональный менеджер",
    delivery_schedule: "Ежедневная авиа-доставка день в день",
    delivery_areas: ["Москва и МО, СПб, Сочи"],
    warehouse: "Москва, собственный распределительный терминал с аквариумами",
    description: "Главный премиальный поставщик живых устриц, крабов, морских ежей, дикой рыбы (сибас, дорадо, тюрбо, тунец блюфин) для ресторанов высокой кухни.",
    badges: ["Живые аквариумы", "Авиа-поставки день в день", "Премиум HoReCa"],
    products: [
      { id: "lm-1", name: "Устрицы Хасанские / Императорские (живые)", spec: "Калибр 100-150г, Дальний Восток", unit: "шт", price: 145, in_stock: true },
      { id: "lm-2", name: "Тунец Yellowfin филе Saku (для сашими)", spec: "Вакуум 500г, без прожилок, AAA", unit: "кг", price: 1980, in_stock: true },
      { id: "lm-3", name: "Морской гребешок филе крупный (Сахалин)", spec: "Размер 10/20, сухая заморозка", unit: "кг", price: 2400, in_stock: true }
    ]
  },
  {
    id: "sup-fish-03",
    company_name: "Defa Group (Дефа Групп)",
    short_name: "Дефа Групп",
    category: "fish",
    category_label: "Импортер рыбы и морепродуктов",
    website: "https://defa.org",
    phone: "+7 (812) 380-01-00",
    email: "horeca@defa.org",
    telegram: "defagroup_seafood",
    rating: 4.92,
    reviews_count: 88,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 15000,
    payment_terms: "Безнал с НДС, отсрочка 14 дней",
    delivery_schedule: "Пн-Сб с 07:00 до 12:00",
    delivery_areas: ["Москва, СПб, регионы РФ"],
    warehouse: "Москва, МО, СПб",
    description: "Один из крупнейших импортеров креветок, кальмара, мидий, лососевых и белой рыбы из Аргентины, Индии, Китая, Вьетнама и Дальнего Востока.",
    badges: ["Прямой импорт", "Креветки ваннамей", "Меркурий"],
    products: [
      { id: "df-1", name: "Креветка ваннамей с/м б/г 21/25 (Fish&More)", spec: "Блок 1 кг, чистый вес", unit: "кг", price: 790, in_stock: true },
      { id: "df-2", name: "Кальмар командорский очищенный филе", spec: "Индивидуальная заморозка IQF", unit: "кг", price: 430, in_stock: true }
    ]
  },
  {
    id: "sup-fish-04",
    company_name: "Тамаки (Tamaki / Европродукт)",
    short_name: "Тамаки (Tamaki)",
    category: "fish",
    category_label: "Ингредиенты и продукты для паназиатской кухни",
    website: "https://tamaki.pro",
    phone: "8 (800) 550-73-03",
    email: "sales@tamaki.pro",
    telegram: "tamaki_horeca",
    rating: 4.95,
    reviews_count: 104,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 8000,
    payment_terms: "Безнал с НДС, отсрочка",
    delivery_schedule: "Ежедневно",
    delivery_areas: ["Вся Россия и СНГ"],
    warehouse: "Москва, Люберцы",
    description: "Ведущий российский производитель и поставщик соусов, риса, водорослей нори, угря, панировочных сухарей панко и морепродуктов для японской и паназиатской кухни.",
    badges: ["Топ-1 в паназиатской кухне", "Соусы Унаги / Терияки", "Нори Gold"],
    products: [
      { id: "tm-1", name: "Угорь копченый Унаги 9 oz (Tamaki)", spec: "Вакуум 250г, соус 10%", unit: "кг", price: 1590, in_stock: true },
      { id: "tm-2", name: "Водоросли Нори Gold (Tamaki) 100 листов", spec: "Плотные, не ломаются при скручивании", unit: "упак", price: 650, in_stock: true },
      { id: "tm-3", name: "Соус Спайси Tamaki для запеченных роллов 1 л", spec: "Бутылка 1 л с дозатором", unit: "шт", price: 420, in_stock: true }
    ]
  },

  // ==========================================
  // ОВОЩИ, ФРУКТЫ, ЗЕЛЕНЬ И КОНСЕРВАЦИЯ
  // ==========================================
  {
    id: "sup-veg-01",
    company_name: "ВЕГА (Vegda Product)",
    short_name: "ВЕГА (Vegda)",
    category: "veg",
    category_label: "Свежие овощи, зелень, ягоды и грибы",
    website: "http://www.vegda.ru",
    phone: "+7 (812) 380-42-00",
    email: "info@vegda.ru",
    telegram: "vegda_horeca",
    rating: 4.89,
    reviews_count: 73,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 8000,
    payment_terms: "Безнал, отсрочка 7-14 дней",
    delivery_schedule: "Ежедневно с 05:00 до 09:00",
    delivery_areas: ["Москва и МО", "Санкт-Петербург и ЛО"],
    warehouse: "Москва, Фуд Сити / СПб, Софийская",
    description: "Ежедневная поставка калиброванных овощей, салатов, редких грибов, микрозелени и ягод. Контроль кондиции и обмен прямо у борта машины.",
    badges: ["Ранняя доставка к 07:00", "Калиброванный товар", "Микрозелень"],
    products: [
      { id: "vg-1", name: "Томаты розовые отборные (Баку/Дагестан)", spec: "Калибр 6+, ящик 6 кг", unit: "кг", price: 245, in_stock: true },
      { id: "vg-2", name: "Авокадо Хасс Ready-to-eat (спелое кремовое)", spec: "Калибр 16-18, ящик 4 кг", unit: "кг", price: 495, in_stock: true },
      { id: "vg-3", name: "Микс-салат Романо / Айсберг / Руккола 1 кг", spec: "Свежий срез, мытый, пакет 1 кг", unit: "кг", price: 370, in_stock: true }
    ]
  },
  {
    id: "sup-veg-02",
    company_name: "Агрохолдинг «Новый Урожай»",
    short_name: "Новый Урожай",
    category: "veg",
    category_label: "Очищенные и вакуумированные овощи",
    website: "https://new-harvest.ru",
    phone: "+7 (495) 640-12-88",
    email: "zakaz@new-harvest.ru",
    telegram: "newharvest_veg",
    rating: 4.87,
    reviews_count: 59,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 7000,
    payment_terms: "Безнал с НДС",
    delivery_schedule: "Пн-Вс с 06:00",
    delivery_areas: ["Москва и вся Московская область"],
    warehouse: "Москва, Дмитровское шоссе",
    description: "Готовые очищенные мытые овощи в вакуумной упаковке (картофель цельный/фри, морковь, лук, свекла). Экономия рабочего времени поваров до 3 часов на смену.",
    badges: ["Очищенные в вакууме", "Экономия времени кухни", "ГОСТ"],
    products: [
      { id: "nh-1", name: "Картофель очищенный в вакууме цельный", spec: "Пакет 5 кг / 10 кг, ГОСТ", unit: "кг", price: 54, in_stock: true },
      { id: "nh-2", name: "Морковь очищенная мытая вакуум", spec: "Пакет 5 кг", unit: "кг", price: 48, in_stock: true },
      { id: "nh-3", name: "Лук репчатый очищенный вакуум", spec: "Пакет 5 кг, сухой чистый", unit: "кг", price: 45, in_stock: true }
    ]
  },

  // ==========================================
  // СЫРЫ, МОЛОЧНАЯ ПРОДУКЦИЯ И ДЕЛИКАТЕСЫ
  // ==========================================
  {
    id: "sup-dairy-01",
    company_name: "Чудское Озеро (ТД Демиург)",
    short_name: "Чудское Озеро",
    category: "dairy",
    category_label: "Сливки, Молоко и Крем-сыры для кондитеров и шефов",
    website: "https://chudozero.ru",
    phone: "8 (800) 200-88-21",
    email: "horeca@chudozero.ru",
    telegram: "chudskoeozero_pro",
    rating: 4.96,
    reviews_count: 118,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 10000,
    payment_terms: "Безнал с НДС, отсрочка 14 дней",
    delivery_schedule: "Ежедневно кроме вс",
    delivery_areas: ["Москва, СПб и вся Россия"],
    warehouse: "Москва, Ступино / СПб",
    description: "Профессиональные сливки жирностью 33%, 35%, 38% для взбивания и соусов, сливочное масло 82.5%, сливочные крем-сыры для чизкейков и кремов.",
    badges: ["Любимый бренд кондитеров", "Сливки 33% и 35%", "Меркурий"],
    products: [
      { id: "cho-1", name: "Сливки Чудское Озеро 33% профессиональные 1 л", spec: "Тетра-пак 1 л, взбиваемость 320%", unit: "л", price: 360, in_stock: true },
      { id: "cho-2", name: "Крем-чиз Чудское Озеро 65% (для чизкейков)", spec: "Ведро 3.3 кг, плотная кремовая текстура", unit: "кг", price: 510, in_stock: true },
      { id: "cho-3", name: "Масло сливочное Чудское Озеро 82.5% ГОСТ монолит", spec: "Короб 5 кг / 10 кг", unit: "кг", price: 690, in_stock: true }
    ]
  },
  {
    id: "sup-dairy-02",
    company_name: "Hochland Professional (Хохланд Рус)",
    short_name: "Хохланд Рус",
    category: "dairy",
    category_label: "Творожные сыры Cremette и сыры для бургеров",
    website: "https://hochland-professional.ru",
    phone: "+7 (495) 788-51-70",
    email: "professional@hochland.ru",
    telegram: "cremette_professional",
    rating: 4.99,
    reviews_count: 210,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 12000,
    payment_terms: "Безнал с НДС через дистрибьюторскую сеть",
    delivery_schedule: "Пн-Пт с 08:00 до 16:00",
    delivery_areas: ["Вся Россия и СНГ"],
    warehouse: "МО, Раменский район, пос. РАОС",
    description: "Золотой стандарт творожного сыра в ресторанной индустрии (Cremette Professional), плавленые слайсы Чеддер для бургеров и кулинарные сыры.",
    badges: ["Cremette №1 в суши и кондитерке", "Чеддер для бургеров"],
    products: [
      { id: "hl-1", name: "Сыр творожный Cremette Professional 65% (10 кг)", spec: "Ведро 10 кг для HoReCa", unit: "кг", price: 515, in_stock: true },
      { id: "hl-2", name: "Сыр плавленый Hochland Cheddar слайсы 1033г", spec: "Пачка 84 ломтика для бургеров", unit: "упак", price: 670, in_stock: true }
    ]
  },
  {
    id: "sup-dairy-03",
    company_name: "Умалат (Umalat / Unagrande Foodservice)",
    short_name: "Умалат (Unagrande)",
    category: "dairy",
    category_label: "Свежие сыры: Моцарелла, Маскарпоне, Рикотта, Сулугуни",
    website: "https://umalat.ru",
    phone: "+7 (495) 782-15-15",
    email: "horeca@umalat.ru",
    telegram: "unagrande_horeca",
    rating: 4.94,
    reviews_count: 92,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 10000,
    payment_terms: "Безнал с НДС, отсрочка",
    delivery_schedule: "Ежедневно",
    delivery_areas: ["Москва, СПб, регионы РФ"],
    warehouse: "Москва, Севск (Брянская обл.)",
    description: "Итальянские свежие сыры из 100% отборного молока высшего качества без консервантов и пальмового масла. Идеально для пиццерий и ресторанов.",
    badges: ["Чистый состав", "Моцарелла в воде и для пиццы", "Маскарпоне"],
    products: [
      { id: "um-1", name: "Сыр Моцарелла Unagrande в рассоле 125г", spec: "Шарик в рассоле, для капрезе", unit: "шт", price: 118, in_stock: true },
      { id: "um-2", name: "Сыр Маскарпоне Unagrande 80% (500г / 1.5 кг)", spec: "Для классического тирамису", unit: "кг", price: 620, in_stock: true }
    ]
  },

  // ==========================================
  // КОФЕ, ЧАЙ И НАПИТКИ
  // ==========================================
  {
    id: "sup-bev-01",
    company_name: "Tasty Coffee (Тэйсти Кофе HoReCa)",
    short_name: "Tasty Coffee",
    category: "coffee_tea",
    category_label: "Свежеобжаренный кофе Specialty и Чай",
    website: "https://tastycoffee.ru",
    phone: "8 (800) 333-49-80",
    email: "b2b@tastycoffee.ru",
    telegram: "tastycoffee_b2b",
    rating: 4.99,
    reviews_count: 280,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 5000,
    payment_terms: "Безнал, карты, система бонусов, отсрочка",
    delivery_schedule: "Обжарка под заказ, отправка в день обжарки",
    delivery_areas: ["Вся Россия (бесплатная доставка от 5 кг)"],
    warehouse: "Ижевск (производство) / Москва (хаб)",
    description: "Крупнейший в России обжарщик specialty-кофе для кофеен, ресторанов и отелей. Предоставление и настройка кофемашин, обучение бариста.",
    badges: ["Specialty обжарка", "Обучение бариста", "Свежая обжарка каждый день"],
    products: [
      { id: "tc-1", name: "Кофе в зернах «Бэрри» эспрессо-смесь 1 кг", spec: "100% арабика, дескрипторы: темные ягоды, карамель", unit: "кг", price: 1450, in_stock: true },
      { id: "tc-2", name: "Кофе в зернах «Натти» эспрессо-смесь 1 кг", spec: "100% арабика, дескрипторы: фундук, шоколад", unit: "кг", price: 1390, in_stock: true },
      { id: "tc-3", name: "Дрип-пакеты кофе ассорти (бокс 20 шт)", spec: "Для номеров отелей и навынос", unit: "бокс", price: 850, in_stock: true }
    ]
  },
  {
    id: "sup-bev-02",
    company_name: "Алеф Трейд (Alef Trade)",
    short_name: "Алеф Трейд",
    category: "coffee_tea",
    category_label: "Кофе Danesi, чай Althaus и кофейное оборудование",
    website: "https://alephtrade.com",
    phone: "+7 (495) 787-87-77",
    email: "info@alephtrade.com",
    telegram: "alephtrade_horeca",
    rating: 4.93,
    reviews_count: 98,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 10000,
    payment_terms: "Безнал с НДС, аренда и лизинг кофемашин",
    delivery_schedule: "Пн-Пт с 09:00 до 18:00",
    delivery_areas: ["Москва, СПб, Сочи, Екатеринбург, Казань и др."],
    warehouse: "Москва, ул. Складочная",
    description: "Эксклюзивный поставщик немецкого премиум-чая Althaus, итальянского кофе Danesi, сиропов Monin и профессиональных кофемашин La Marzocco, Nuova Simonelli.",
    badges: ["Чай Althaus", "Сиропы Monin", "Кофемашины La Marzocco"],
    products: [
      { id: "at-1", name: "Чай листовой Althaus в ассортименте 250г", spec: "Премиальный чай для заварочных чайников", unit: "упак", price: 920, in_stock: true },
      { id: "at-2", name: "Сироп Monin (Карамель, Ваниль, Лаванда) 1 л", spec: "Стеклянная бутылка 1000 мл (Франция)", unit: "шт", price: 850, in_stock: true }
    ]
  },

  // ==========================================
  // ПОСУДА, ИНВЕНТАРЬ И ОБОРУДОВАНИЕ
  // ==========================================
  {
    id: "sup-eq-01",
    company_name: "Завод «Чувашторгтехника» (ТМ ABAT)",
    short_name: "ABAT",
    category: "equipment",
    category_label: "Крупнейший российский завод ресторанного оборудования",
    website: "https://abat.ru",
    phone: "8 (800) 200-55-15",
    email: "market@abat.ru",
    telegram: "abat_russia",
    rating: 4.96,
    reviews_count: 175,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 20000,
    payment_terms: "Безнал с НДС, лизинг, рассрочка, монтаж под ключ",
    delivery_schedule: "Отгрузка со склада завода и дилерских центров",
    delivery_areas: ["Вся Россия, Беларусь, Казахстан"],
    warehouse: "Чебоксары (завод) / Москва (дистрибьюторские хабы)",
    description: "Пароконвектоматы, индукционные плиты, посудомоечные машины, холодильные шкафы, расстоечные шкафы и тепловые линии для профессиональных кухонь.",
    badges: ["Заводской производитель", "Гарантия до 3 лет", "Сервисная сеть по РФ"],
    products: [
      { id: "ab-1", name: "Пароконвектомат инжекторный ПКА 6-1/1ПП2 (6 уровней)", spec: "Сенсорное управление, память рецептов, автомойка", unit: "шт", price: 345000, in_stock: true },
      { id: "ab-2", name: "Плита индукционная 4-конфорочная кухонная 14 кВт", spec: "Нержавеющая сталь AISI 304, сплошная поверхность", unit: "шт", price: 115000, in_stock: true },
      { id: "ab-3", name: "Купольная посудомоечная машина МПК-700К", spec: "Производительность до 700 тарелок/час, дозаторы", unit: "шт", price: 210000, in_stock: true }
    ]
  },
  {
    id: "sup-eq-02",
    company_name: "ГК «Деловая Русь» (Food Services Equipment)",
    short_name: "Деловая Русь",
    category: "equipment",
    category_label: "Комплексное оснащение ресторанов, оборудование и посуда",
    website: "https://trapeza.ru",
    phone: "8 (800) 200-40-00",
    email: "dr@trapeza.ru",
    telegram: "delovaya_rus_horeca",
    rating: 4.94,
    reviews_count: 215,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 10000,
    payment_terms: "Безнал с НДС, проектирование, лизинг, шеф-монтаж",
    delivery_schedule: "Ежедневно собственным транспортом",
    delivery_areas: ["Вся Россия и СНГ (35 филиалов)"],
    warehouse: "Москва, Краснобогатырская ул.",
    description: "Более 30 лет опыта комплексного оснащения заведений: грили, фритюрницы, пицца-печи, барный инвентарь, посуда фарфор/стекло, кухонные ножи и гастроемкости.",
    badges: ["30+ лет на рынке", "Шоурумы в 35 городах", "Проектирование кухонь"],
    products: [
      { id: "dr-1", name: "Гастроемкость из нержавеющей стали GN 1/1 глубина 65 мм", spec: "Сталь AISI 304, толщина 0.8 мм", unit: "шт", price: 1250, in_stock: true },
      { id: "dr-2", name: "Фритюрница профессиональная двойная 2х8 л", spec: "Корпус нерж, раздельные термостаты", unit: "шт", price: 32000, in_stock: true }
    ]
  },
  {
    id: "sup-eq-03",
    company_name: "КЛЕН (Компания КЛЕН)",
    short_name: "КЛЕН",
    category: "equipment",
    category_label: "Оборудование, посуда, мебель и инвентарь",
    website: "https://klenmarket.ru",
    phone: "8 (800) 350-00-87",
    email: "info@klenmarket.ru",
    telegram: "klenmarket_pro",
    rating: 4.91,
    reviews_count: 190,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 5000,
    payment_terms: "Безнал, карты, кредит, лизинг",
    delivery_schedule: "Ежедневно",
    delivery_areas: ["Вся Россия (гипермаркеты и доставка)"],
    warehouse: "Москва, Дмитровское / Каширское шоссе",
    description: "Огромный гипермаркет для ресторанов: профессиональный фарфор, бокалы, приборы, ножи шеф-повара, доски ХАССП, сковороды и сотейники, мебель и вытяжки.",
    badges: ["Гипермаркет посуды", "Технологическое проектирование", "ХАССП инвентарь"],
    products: [
      { id: "kl-1", name: "Тарелка плоская фарфор 27 см (Chef's Choice)", spec: "Упрочненный фарфор, устойчивость к сколам", unit: "шт", price: 340, in_stock: true },
      { id: "kl-2", name: "Набор цветных разделочных досок ХАССП (6 шт со стойкой)", spec: "Пищевой полиэтилен 45х30 см, 6 цветов", unit: "компл", price: 4800, in_stock: true }
    ]
  },
  {
    id: "sup-eq-04",
    company_name: "RestInternational (РестИнтернэшнл)",
    short_name: "RestInternational",
    category: "equipment",
    category_label: "Элитная ресторанная посуда, стекло и приборы",
    website: "https://restint.ru",
    phone: "+7 (812) 331-74-20",
    email: "zakaz@restint.ru",
    telegram: "restinternational",
    rating: 4.97,
    reviews_count: 95,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 15000,
    payment_terms: "Безнал, оптовые скидки",
    delivery_schedule: "Пн-Пт с 09:00 до 18:00",
    delivery_areas: ["Москва, Санкт-Петербург, вся Россия"],
    warehouse: "Москва, СПб (шоурумы)",
    description: "Ведущий поставщик премиальной посуды для авторских ресторанов: Steelite, Churchill, Bormioli Luigi, Riedel, Zieher, бокалы из тонкого хрустального стекла.",
    badges: ["Steelite / Churchill", "Хрусталь Riedel", "Дизайнерская сервировка"],
    products: [
      { id: "ri-1", name: "Бокал для красного вина 550 мл (хрустальное стекло)", spec: "Тонкий край, высокая прочность, короб 6 шт", unit: "шт", price: 490, in_stock: true },
      { id: "ri-2", name: "Тарелка глубокая для пасты Churchill 28 см", spec: "Английский фарфор с ручной росписью", unit: "шт", price: 1250, in_stock: true }
    ]
  },

  // ==========================================
  // МЕБЕЛЬ И ТЕКСТИЛЬ ДЛЯ HORECA
  // ==========================================
  {
    id: "sup-fur-01",
    company_name: "Фабрика ChiedoCover (ЧиедоКавер)",
    short_name: "ChiedoCover",
    category: "furniture",
    category_label: "Производство мебели, стульев, столов и текстиля",
    website: "https://chiedocover.ru",
    phone: "+7 (922) 906-67-77",
    email: "info@chiedocover.ru",
    telegram: "chiedocover_horeca",
    rating: 4.95,
    reviews_count: 112,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 20000,
    payment_terms: "Безнал с НДС, предоплата 50/50, изготовление по дизайн-проекту",
    delivery_schedule: "Отгрузка ТК по всей РФ",
    delivery_areas: ["Россия, Казахстан, Беларусь"],
    warehouse: "Киров (фабрика) / Москва (представительство)",
    description: "Собственное производство стульев на металлокаркасе, банкетных кресел, подстолий из чугуна и стали, столешниц Topalit/Werzalit, чехлов и скатертей.",
    badges: ["Собственная фабрика", "Гарантия на металлокаркас 5 лет", "Антивандальные ткани"],
    products: [
      { id: "cc-1", name: "Стул мягкий для ресторанов на металлокаркасе", spec: "Велюр с водоотталкивающей пропиткой, порошковая покраска", unit: "шт", price: 3850, in_stock: true },
      { id: "cc-2", name: "Подстолье чугунное тяжелое черное (для баров)", spec: "Вес 14 кг, устойчивое, порошковое напыление", unit: "шт", price: 4200, in_stock: true },
      { id: "cc-3", name: "Столешница круглая Werzalit d=80 см (Дуб/Мрамор)", spec: "Влагостойкая, устойчива к горячему и царапинам", unit: "шт", price: 3900, in_stock: true }
    ]
  },
  {
    id: "sup-fur-02",
    company_name: "Аптренд (Uptrend Мебель)",
    short_name: "Аптренд",
    category: "furniture",
    category_label: "Мебель для баров, ресторанов, веранд и отелей",
    website: "https://uptrend.ru",
    phone: "+7 (495) 225-54-44",
    email: "info@uptrend.ru",
    telegram: "uptrend_horeca",
    rating: 4.93,
    reviews_count: 84,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 30000,
    payment_terms: "Безнал, поэтапная оплата",
    delivery_schedule: "Служба доставки с заносом и сборкой",
    delivery_areas: ["Москва, МО, все регионы РФ"],
    warehouse: "Москва, МКАД 41 км",
    description: "Один из лидеров рынка контрактной мебели: диваны для кафе, барные стойки, мебель для летних веранд из ротанга, шезлонги и уличные обогреватели.",
    badges: ["Диваны на заказ", "Мебель для веранд", "Сборка под ключ"],
    products: [
      { id: "ut-1", name: "Диван модульный прямой для кафе (120 см)", spec: "Экокожа/велюр повышенной износостойкости 60 000 циклов", unit: "шт", price: 14500, in_stock: true },
      { id: "ut-2", name: "Кресло плетеное из искусственного ротанга для веранды", spec: "Алюминиевый каркас, подушка в комплекте", unit: "шт", price: 6200, in_stock: true }
    ]
  },
  {
    id: "sup-fur-03",
    company_name: "Бифлекс (Biflex Текстиль)",
    short_name: "Бифлекс (Biflex)",
    category: "furniture",
    category_label: "Профессиональный ресторанный и отельный текстиль",
    website: "https://biflex.ru",
    phone: "+7 (495) 789-94-44",
    email: "info@biflex.ru",
    telegram: "biflex_textile",
    rating: 4.9,
    reviews_count: 62,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 10000,
    payment_terms: "Безнал с НДС, пошив по индивидуальным размерам",
    delivery_schedule: "Пн-Пт",
    delivery_areas: ["Вся Россия"],
    warehouse: "Москва, Варшавское шоссе",
    description: "Пошив профессиональных скатертей с тефлоновым грязеотталкивающим покрытием, салфеток, наперонов, плейсматов и формы для персонала.",
    badges: ["Тефлоновое покрытие", "Индивидуальный пошив", "Высокая износостойкость"],
    products: [
      { id: "bf-1", name: "Скатерть профессиональная с тефлоновой пропиткой 150х150", spec: "Плотность 240 г/м², не впитывает вино и жир", unit: "шт", price: 1150, in_stock: true },
      { id: "bf-2", name: "Салфетка сервировочная тканевая 45х45 см", spec: "100% крученая хлопковая нить", unit: "шт", price: 180, in_stock: true }
    ]
  },

  // ==========================================
  // УПАКОВКА И ОДНОРАЗОВАЯ ПОСУДА
  // ==========================================
  {
    id: "sup-pack-01",
    company_name: "PICNECO (Пикнеко Экоупаковка)",
    short_name: "PICNECO",
    category: "pack",
    category_label: "Биоразлагаемая эко-упаковка для доставки еды",
    website: "https://picneco.ru",
    phone: "+7 (495) 789-42-44",
    email: "info@picneco.ru",
    telegram: "picneco_ecopack",
    rating: 4.95,
    reviews_count: 98,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 7000,
    payment_terms: "Безнал с НДС, нанесение логотипа (брендирование)",
    delivery_schedule: "Ежедневно со склада",
    delivery_areas: ["Москва, СПб, доставка ТК по РФ"],
    warehouse: "Москва, Электролитный проезд",
    description: "Крафтовые ланч-боксы, супники из сахарного тростника, биоразлагаемые приборы из кукурузного крахмала, бумажные стаканы и пакеты с кручеными ручками.",
    badges: ["Эко-сертификат", "Брендирование от 1 000 шт", "Трендовый крафт"],
    products: [
      { id: "pn-1", name: "Крафт ланч-бокс с окном 1200 мл (для горячего)", spec: "Влаго- и жиростойкий, короб 250 шт", unit: "шт", price: 14.2, in_stock: true },
      { id: "pn-2", name: "Супник картонный 500 мл с герметичной крышкой", spec: "Двусторонняя ламинация, короб 200 шт", unit: "шт", price: 12.0, in_stock: true },
      { id: "pn-3", name: "Пакет крафт с кручеными ручками (32х20х37 см)", spec: "Плотность 80г/м², выдерживает 10 кг", unit: "шт", price: 17.5, in_stock: true }
    ]
  },
  {
    id: "sup-pack-02",
    company_name: "Триал Маркет (Trial Market)",
    short_name: "Триал Маркет",
    category: "pack",
    category_label: "Расходные материалы, пленка, перчатки и упаковка",
    website: "https://trial-market.ru",
    phone: "8 (800) 777-23-07",
    email: "zakaz@trial-market.ru",
    telegram: "trialmarket_b2b",
    rating: 4.91,
    reviews_count: 140,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 5000,
    payment_terms: "Безнал, отсрочка, регулярный график поставок",
    delivery_schedule: "Ежедневно",
    delivery_areas: ["Вся Россия (крупная сеть филиалов)"],
    warehouse: "Москва, Подольск / СПб, Шушары",
    description: "Пищевая стретч-пленка, фольга профессиональная 44 см, нитриловые перчатки, бумажные полотенца, фасовочные пакеты и контейнеры для СВЧ.",
    badges: ["Широкий ассортимент", "Выгодные оптовые цены", "Расходники под ключ"],
    products: [
      { id: "tm-p1", name: "Перчатки нитриловые черные неопудренные (пачка 100 шт)", spec: "Размеры S, M, L, XL, повышенная прочность", unit: "пачка", price: 420, in_stock: true },
      { id: "tm-p2", name: "Фольга алюминиевая профессиональная 44 см х 100 м (14 мкм)", spec: "В рулоне с резаком", unit: "рулон", price: 790, in_stock: true },
      { id: "tm-p3", name: "Пленка пищевая стретч дышащая 45 см х 1500 м", spec: "Толщина 8.5 мкм, ПВХ для продуктов", unit: "рулон", price: 1150, in_stock: true }
    ]
  },

  // ==========================================
  // АВТОМАТИЗАЦИЯ, IT И СИСТЕМНЫЕ ИНТЕГРАТОРЫ
  // ==========================================
  {
    id: "sup-it-01",
    company_name: "iiko (Айко / iiko Cloud)",
    short_name: "iiko",
    category: "automation",
    category_label: "Система автоматизации ресторанного бизнеса №1",
    website: "https://iiko.ru",
    phone: "8 (800) 700-76-06",
    email: "sales@iiko.ru",
    telegram: "iikorussia",
    rating: 4.99,
    reviews_count: 310,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 0,
    payment_terms: "Ежемесячная подписка iikoCloud от 3 990 ₽ / мес, демо 14 дней",
    delivery_schedule: "Облачное подключение за 1 день + выезд инженера",
    delivery_areas: ["Вся Россия, ОАЭ, СНГ, Европа (более 45 000 ресторанов)"],
    warehouse: "Москва, БЦ «W-Plaza» (головной офис)",
    description: "Безусловный лидер рынка автоматизации общепита. Управление кассой, складом, закупками, кухней (KDS), доставкой, персоналом, программами лояльности и интеграцией с Меркурий / ЕГАИС / Честный Знак.",
    badges: ["№1 в России", "iikoCloud", "ЕГАИС / Меркурий / Честный Знак", "AI-прогнозирование продаж"],
    products: [
      { id: "ik-1", name: "iikoCloud Pro (полный пакет автоматизации)", spec: "Касса, складской учет, техкарты, лояльность, отчеты P&L", unit: "мес", price: 5990, in_stock: true },
      { id: "ik-2", name: "iikoDelivery (модуль управления доставкой и курьерами)", spec: "Автоматическое распределение заказов, приложение курьера", unit: "мес", price: 2990, in_stock: true }
    ]
  },
  {
    id: "sup-it-02",
    company_name: "r_keeper (Эркипер / ООО «ЭРКИПЕР МСК»)",
    short_name: "r_keeper",
    category: "automation",
    category_label: "Легендарная система автоматизации ресторанов",
    website: "https://rkeeper.ru",
    phone: "8 (800) 200-20-40",
    email: "info@rkeeper.ru",
    telegram: "rkeeper_official",
    rating: 4.93,
    reviews_count: 220,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 0,
    payment_terms: "Подписка от 2 490 ₽/мес или бессрочная лицензия",
    delivery_schedule: "Установка и настройка за 24 часа",
    delivery_areas: ["Вся Россия и СНГ (более 65 000 заведений)"],
    warehouse: "Москва, Ленинградский проспект",
    description: "Надежная кассовая и складская система управления для ресторанов, сетей быстрого питания, баров, клубов и фудкортов с поддержкой всех фискальных требований РФ.",
    badges: ["30 лет опыта", "KDS для кухни", "Склад StoreHouse"],
    products: [
      { id: "rk-1", name: "r_keeper Cloud Базовый", spec: "Кассовая станция, отчетность, работа с маркировкой", unit: "мес", price: 2490, in_stock: true },
      { id: "rk-2", name: "StoreHouse 5 (профессиональный складской учет)", spec: "Калькуляционные карты, списания, инвентаризации", unit: "мес", price: 2990, in_stock: true }
    ]
  },
  {
    id: "sup-it-03",
    company_name: "1С-Рарус: Общепит и Ресторан",
    short_name: "1С-Рарус",
    category: "automation",
    category_label: "Разработчик «1С:Общепит» и «1С:Ресторан»",
    website: "https://rarus.ru/food/",
    phone: "+7 (495) 223-04-04",
    email: "food@rarus.ru",
    telegram: "rarus_horeca",
    rating: 4.92,
    reviews_count: 160,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 0,
    payment_terms: "Лицензии 1С, аренда в облаке, доработка под ключ",
    delivery_schedule: "Внедрение и сопровождение 24/7",
    delivery_areas: ["Вся Россия и страны ближнего зарубежья"],
    warehouse: "Москва, Дмитровское шоссе",
    description: "Отраслевые флагманские решения 1С для бухгалтерского, управленческого и калькуляционного учета в ресторанных сетях, фабриках-кухнях и комбинатах питания.",
    badges: ["Бесшовная 1С Бухгалтерия", "Фабрики-кухни и сети", "Калькуляция блюд"],
    products: [
      { id: "1c-1", name: "1С:Общепит 8 (лицензия на рабочее место)", spec: "Учет продуктов, хим-отход, полуфабрикаты, акты проработки", unit: "шт", price: 28600, in_stock: true },
      { id: "1c-2", name: "1С:Общепит в облаке (Рарус Cloud)", spec: "Доступ через браузер без покупки сервера", unit: "мес", price: 1950, in_stock: true }
    ]
  },
  {
    id: "sup-it-04",
    company_name: "Saby Presto (Тензор / СБИС Престо)",
    short_name: "Saby Presto",
    category: "automation",
    category_label: "Экосистема автоматизации общепита и отчетности",
    website: "https://saby.ru/presto",
    phone: "8 (800) 200-30-15",
    email: "presto@tensor.ru",
    telegram: "saby_presto",
    rating: 4.95,
    reviews_count: 145,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 0,
    payment_terms: "Подписка от 1 500 ₽/мес, ЭДО, ОФД и онлайн-касса",
    delivery_schedule: "Быстрый запуск за 1 день",
    delivery_areas: ["Вся Россия (90+ филиалов)"],
    warehouse: "Москва, Ярославль (головной офис)",
    description: "Удобная экосистема для кафе, кофеен, ресторанов и столовых: касса, склад, меню по QR-коду, бронирование столов, интеграция с Честным Знаком и ЕГАИС.",
    badges: ["ЭДО + ОФД + Presto", "QR-меню и чаевые", "Простой интерфейс"],
    products: [
      { id: "sb-1", name: "Тариф Presto Базовый", spec: "Касса на любом планшете, склад, продажи, фискализация", unit: "год", price: 18000, in_stock: true }
    ]
  },
  {
    id: "sup-it-05",
    company_name: "ГК «Флагман» (Flagman IT Integrator)",
    short_name: "ГК Флагман",
    category: "automation",
    category_label: "Официальный дистрибьютор iiko и интегратор 1С",
    website: "https://flagman-it.ru",
    phone: "8 (800) 775-59-83",
    email: "info@flagman-it.ru",
    telegram: "flagman_it_horeca",
    rating: 4.97,
    reviews_count: 88,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 0,
    payment_terms: "Безнал, рассрочка на оборудование и ПО, поддержка 24/7",
    delivery_schedule: "Выезд сервисного инженера в день обращения",
    delivery_areas: ["Москва, Краснодар, Ростов-на-Дону, Крым"],
    warehouse: "Москва, ул. Большая Черемушкинская",
    description: "Комплексное внедрение iiko, POS-моноблоков, фискальных регистраторов АТОЛ, чековых принтеров, кухонных экранов KDS, настройка ЕГАИС и обучение персонала.",
    badges: ["Платиновый партнер iiko", "Круглосуточная техподдержка", "Оборудование POS в наличии"],
    products: [
      { id: "fl-1", name: "Комплект оборудования «POS-Старт» (Моноблок + ФР АТОЛ + Сканер)", spec: "15' сенсорный экран, фискальный регистратор с ФН", unit: "компл", price: 58000, in_stock: true }
    ]
  },
  {
    id: "sup-it-06",
    company_name: "Лемма (Lemma Group)",
    short_name: "Лемма (Lemma)",
    category: "automation",
    category_label: "Официальный партнер iiko и сервис GuestMe",
    website: "https://lemma.group",
    phone: "8 (800) 700-96-60",
    email: "welcome@lemma.group",
    telegram: "lemma_group",
    rating: 4.96,
    reviews_count: 95,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 0,
    payment_terms: "Безнал с НДС, сервисный абонемент",
    delivery_schedule: "Онлайн поддержка и выездные инженеры",
    delivery_areas: ["Москва, СПб, Екатеринбург, Казань, Новосибирск, Сочи"],
    warehouse: "Москва, Пресненская наб. (Москва-Сити)",
    description: "Эксперты по ресторанному учету, автоматизации iiko, маркировке Честный Знак, ЕГАИС, ФГИС Меркурий, а также аудиту фудкоста и предотвращению воровства.",
    badges: ["Аудит фудкоста", "Эксперты iiko", "Сервис GuestMe"],
    products: [
      { id: "lm-s1", name: "Ежемесячное абонентское обслуживание ресторана 24/7", spec: "Решение инцидентов, обновление ПО, контроль обмена с ЕГАИС", unit: "мес", price: 6500, in_stock: true }
    ]
  },

  // ==========================================
  // ПРОФЕССИОНАЛЬНАЯ ХИМИЯ И КЛИНИНГ
  // ==========================================
  {
    id: "sup-chem-01",
    company_name: "НовэлХим (NovelHim Professional)",
    short_name: "НовэлХим",
    category: "cleaning",
    category_label: "Профессиональная химия для кухонь и посудомоек",
    website: "https://novelhim.ru",
    phone: "+7 (495) 748-04-40",
    email: "info@novelhim.ru",
    telegram: "novelhim_horeca",
    rating: 4.9,
    reviews_count: 72,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 6000,
    payment_terms: "Безнал с НДС, установка дозирующих систем бесплатно",
    delivery_schedule: "Пн-Пт с 09:00 до 18:00",
    delivery_areas: ["Москва, МО, регионы РФ"],
    warehouse: "Москва, Ступинский проезд",
    description: "Высокоэффективные моющие средства для посудомоечных машин (щелочные и кислотные ополаскиватели), антижир для пароконвектоматов и грилей, дезинфекция ХАССП.",
    badges: ["Бесплатные дозаторы", "ХАССП протоколы", "Антижир для грилей"],
    products: [
      { id: "nh-c1", name: "Концентрат для посудомоечных машин щелочной 5 л", spec: "Канистра 5 л, удаляет стойкий нагар и чайный налет", unit: "шт", price: 1450, in_stock: true },
      { id: "nh-c2", name: "Гель-антижир для пароконвектоматов и плит (Grill Cleaner) 5 л", spec: "Быстро растворяет пригоревший жир и копоть", unit: "шт", price: 1290, in_stock: true }
    ]
  },
  {
    id: "sup-chem-02",
    company_name: "НПП «Флореаль» (Floreal)",
    short_name: "Флореаль",
    category: "cleaning",
    category_label: "Завод моющих и дезинфицирующих средств для общепита",
    website: "https://floreal.ru",
    phone: "8 (800) 250-71-70",
    email: "sales@floreal.ru",
    telegram: "floreal_him",
    rating: 4.88,
    reviews_count: 54,
    is_verified: true,
    mercury_certified: false,
    min_order_rub: 8000,
    payment_terms: "Безнал с НДС, оптовые заводские цены",
    delivery_schedule: "Пн-Пт со склада завода",
    delivery_areas: ["Вся Россия"],
    warehouse: "Краснодар (завод) / Москва (склад)",
    description: "Сертифицированные дезинфицирующие растворы, кожные антисептики, средства для мытья яиц и овощей, санитарная обработка разделочных поверхностей.",
    badges: ["Заводские цены", "СанПиН / ХАССП", "Антисептики"],
    products: [
      { id: "fl-c1", name: "Дезинфицирующее средство с моющим эффектом «Флори-Дез» 5 л", spec: "Разрешено для контакта с пищевыми поверхностями", unit: "шт", price: 980, in_stock: true }
    ]
  },

  // ==========================================
  // АЛКОГОЛЬНАЯ И ПИВНАЯ ПРОДУКЦИЯ
  // ==========================================
  {
    id: "sup-alc-01",
    company_name: "ГК «NESCO» (Неско Алко Трейд)",
    short_name: "NESCO",
    category: "alcohol",
    category_label: "Дистрибьютор алкогольной продукции и вин для HoReCa",
    website: "https://nesco.ru",
    phone: "+7 (812) 324-44-44",
    email: "horeca@nesco.ru",
    telegram: "nesco_wine",
    rating: 4.94,
    reviews_count: 110,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 20000,
    payment_terms: "Безнал, лицензия ЕГАИС обязательна, отсрочка",
    delivery_schedule: "Ежедневно в соответствии с регламентом ЕГАИС",
    delivery_areas: ["Москва, СПб, Северо-Запад, ЮФО"],
    warehouse: "Москва, СПб (акцизные склады)",
    description: "Широкий портфель вин Старого и Нового Света, крепкого алкоголя, крафтового и импортного пива для винных карт и баров ресторанов.",
    badges: ["ЕГАИС интеграция", "Составление винной карты", "Эксклюзивные бренды"],
    products: [
      { id: "ns-1", name: "Вино сухое белое Pinot Grigio DOC (Италия) 0.75 л", spec: "Короб 6 бут, свежий минеральный вкус", unit: "бут", price: 620, in_stock: true },
      { id: "ns-2", name: "Вино сухое красное Chianti Classico DOCG 0.75 л", spec: "Короб 6 бут, выдержка в дубе", unit: "бут", price: 890, in_stock: true }
    ]
  },
  {
    id: "sup-alc-02",
    company_name: "Московская Пивоваренная Компания (МПК HoReCa)",
    short_name: "МПК",
    category: "alcohol",
    category_label: "Разливное и бутылочное пиво, сидры и лимонады",
    website: "https://mosbrew.ru",
    phone: "+7 (495) 788-54-33",
    email: "horeca@mosbrew.ru",
    telegram: "mpk_horeca",
    rating: 4.92,
    reviews_count: 94,
    is_verified: true,
    mercury_certified: true,
    min_order_rub: 10000,
    payment_terms: "Безнал, ЕГАИС, установка и промывка кегового оборудования",
    delivery_schedule: "Пн-Сб со спецсклада",
    delivery_areas: ["Москва, МО, вся Россия"],
    warehouse: "МО, г. Мытищи, Вокзальный проезд",
    description: "Поставки разливного пива в кегах (Хамовники, Жигули Барное, Faxe, Spaten, Franziskaner), крафтовой линейки Волковская пивоварня, сидров и безалкогольных напитков.",
    badges: ["Бесплатная установка кранов", "Промывка линий раз в 2 недели", "ЕГАИС"],
    products: [
      { id: "mpk-1", name: "Пиво светлое «Хамовники Венское» (Кег 30 л металл / фитинг A)", spec: "Традиционный венский лагер, плотность 11%", unit: "кег (30л)", price: 3450, in_stock: true },
      { id: "mpk-2", name: "Крафтовое пиво «Волковская пивоварня IPA» (Кег 30 л)", spec: "Яркий хмелевой аромат цитрусов и хвои", unit: "кег (30л)", price: 4200, in_stock: true }
    ]
  }
];

// Helper to filter suppliers
function getSuppliers(options = {}) {
  const { category, search, minOrderMax } = options;
  let list = [...VERIFIED_SUPPLIERS];

  if (category && category !== 'all') {
    list = list.filter(s => s.category === category);
  }

  if (minOrderMax && parseInt(minOrderMax, 10) > 0) {
    list = list.filter(s => s.min_order_rub <= parseInt(minOrderMax, 10));
  }

  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(s => 
      s.company_name.toLowerCase().includes(q) ||
      (s.short_name && s.short_name.toLowerCase().includes(q)) ||
      s.category_label.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.warehouse && s.warehouse.toLowerCase().includes(q)) ||
      (s.badges && s.badges.some(b => b.toLowerCase().includes(q))) ||
      (s.products && s.products.some(p => p.name.toLowerCase().includes(q)))
    );
  }

  return list;
}

module.exports = {
  VERIFIED_SUPPLIERS,
  getSuppliers
};
