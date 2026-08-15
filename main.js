document.addEventListener('DOMContentLoaded', () => {
  
  // --- Premium Page Transition (Safari-friendly Overlay) ---
  // Create transition overlay dynamically
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);

  // Trigger fade-out (entrance)
  requestAnimationFrame(() => {
    setTimeout(() => {
      transitionOverlay.classList.add('fade-out');
    }, 20);
  });

  // Remove overlay from DOM once animation finishes to free memory
  setTimeout(() => {
    if (transitionOverlay.parentNode) {
      transitionOverlay.remove();
    }
  }, 500);

  // Intercept same-origin link clicks for smooth fade-out (exit)
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if the link is relative or on the same domain
    const isLocal = link.hostname === window.location.hostname || !href.includes('//');
    const isSpecialScheme = href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:');
    
    if (isLocal && !isSpecialScheme && link.target !== '_blank') {
      link.addEventListener('click', (e) => {
        // Exclude keyboard modifier clicks
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (e.defaultPrevented) return;
        
        e.preventDefault();
        
        // Re-create the overlay for exit transition
        const exitOverlay = document.createElement('div');
        exitOverlay.className = 'page-transition-overlay';
        exitOverlay.style.opacity = '0';
        document.body.appendChild(exitOverlay);
        
        // Force reflow
        exitOverlay.offsetHeight;
        
        exitOverlay.style.opacity = '1';
        setTimeout(() => {
          window.location.href = href;
        }, 400); // match transition duration
      });
    }
  });

  // Handle back button cache (bfcache) restoration
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      // Remove any lingering overlays
      document.querySelectorAll('.page-transition-overlay').forEach(el => el.remove());
    }
  });

  // --- Mobile Menu Toggle ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta-btn');

  if (mobileNavToggle && mobileMenu) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // --- Scroll Parallax & Zoom Effects ---
  const heroImg = document.querySelector('.hero-bg-img');
  window.addEventListener('scroll', () => {
    if (heroImg) {
      const scrollPosition = window.pageYOffset;
      if (scrollPosition < window.innerHeight) {
        const scaleVal = 1.05 + (scrollPosition / window.innerHeight) * 0.08;
        heroImg.style.transform = `scale(${scaleVal})`;
      }
    }
  });

  // --- Route Sections Intersection Observer ---
  const routeDays = document.querySelectorAll('.route-day');
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -25% 0px',
    threshold: 0.15
  };

  const routeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  routeDays.forEach(day => {
    routeObserver.observe(day);
  });

  // --- Active Nav Links Tracking ---
  const currentPath = window.location.pathname;
  let currentFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  if (!currentFilename || currentFilename === '/') {
    currentFilename = 'index.html';
  }
  
  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFilename) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- Booking Form Handling ---
  const bookingForm = document.getElementById('booking-form');
  const bookingFormContainer = document.getElementById('booking-form-container');
  const bookingSuccessContainer = document.getElementById('booking-success-container');
  const resetBookingBtn = document.getElementById('reset-booking-btn');

  if (bookingForm && bookingFormContainer && bookingSuccessContainer) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Smooth fade-out of form container
      bookingFormContainer.style.opacity = '0';
      bookingFormContainer.style.transform = 'translateY(-15px)';
      bookingFormContainer.style.transition = 'all 0.5s ease';

      setTimeout(() => {
        bookingFormContainer.classList.add('hidden');
        
        // Setup success container entrance
        bookingSuccessContainer.classList.remove('hidden');
        bookingSuccessContainer.style.opacity = '0';
        bookingSuccessContainer.style.transform = 'translateY(15px)';
        
        // Force reflow
        bookingSuccessContainer.offsetHeight;

        bookingSuccessContainer.style.transition = 'all 0.6s ease';
        bookingSuccessContainer.style.opacity = '1';
        bookingSuccessContainer.style.transform = 'translateY(0)';
      }, 500);
    });

    if (resetBookingBtn) {
      resetBookingBtn.addEventListener('click', () => {
        bookingForm.reset();

        bookingSuccessContainer.style.opacity = '0';
        bookingSuccessContainer.style.transform = 'translateY(15px)';
        bookingSuccessContainer.style.transition = 'all 0.5s ease';

        setTimeout(() => {
          bookingSuccessContainer.classList.add('hidden');
          
          bookingFormContainer.classList.remove('hidden');
          bookingFormContainer.style.opacity = '0';
          bookingFormContainer.style.transform = 'translateY(-15px)';
          
          bookingFormContainer.offsetHeight;

          bookingFormContainer.style.transition = 'all 0.5s ease';
          bookingFormContainer.style.opacity = '1';
          bookingFormContainer.style.transform = 'translateY(0)';
        }, 500);
      });
    }
  }

  // --- Translation Dictionary ---
  const translations = {
    ru: {
      site_title: "М А И Р А — 10 Дней Глубокой Экспедиции",
      brand_logo: "М А И Р А",
      nav_num_1: "01",
      nav_journey: "ПУТЬ",
      nav_num_2: "02",
      nav_havens: "ГАВАНЬ",
      nav_num_3: "03",
      nav_rates: "СТОИМОСТЬ",
      nav_num_4: "04",
      nav_manifesto: "МАНИФЕСТ",
      nav_cta: "ЗАБРОНИРОВАТЬ <span class=\"arrow\">→</span>",
      
      // Hero
      havens_hero_tag: "THE HAVEN",
      havens_hero_title: "ТИХОЕ МЕСТО",
      havens_hero_sub: "Природа · Пространство · Тишина",
      entrance_tag: "ВХОД В ГАВАНЬ",
      entrance_sub_tag: "THE HAVEN",
      entrance_desc_text: "Создано в ритме леса.<br>Дерево, камень, вода и тишина.",
      mat_wood: "ДЕРЕВО",
      mat_wood_desc: "Местные породы твердого необработанного дерева, составляющие каркас строений.",
      mat_stone: "КАМЕНЬ",
      mat_stone_desc: "Речные камни, формирующие прочные фундаменты и чаши очагов.",
      mat_water: "ВОДА",
      mat_water_desc: "Природные проточные ручьи, интегрированные в архитектуру лоджа.",
      mat_light: "СВЕТ",
      mat_light_desc: "Мягкие лучи солнца, проникающие сквозь густые кроны деревьев.",
      hero_title: "10 ДНЕЙ<br><span class=\"serif-italic\">В ДИКОЙ ПРИРОДЕ</span>",
      hero_subtitle: "Приватное путешествие в самое сердце Амазонии.",
      hero_btn_primary: "ИССЛЕДОВАТЬ МАРШРУТ",
      hero_btn_outline: "ЗАБРОНИРОВАТЬ ЭКСПЕДИЦИЮ",
      hero_stat_days: "10 ДНЕЙ",
      hero_stat_brand: "М А И Р А",
      hero_stat_group: "ПРИВАТНАЯ ГРУППА",
      hero_stat_forest: "ТРОПИЧЕСКИЙ ЛЕС",
      
      // Route (Journey)
      map_tag: "МАРШРУТ",
      map_title: "КАРТА ЭКСПЕДИЦИИ",
      map_d1: "ПРИБЫТИЕ",
      map_d2: "ЛЕСНАЯ ТРОПА",
      map_d3: "ЧЕРНАЯ ВОДА",
      map_d4: "ВЕКОВАЯ РОЩА",
      map_d5: "ВЫСОТА КРОН",
      map_d6: "НОЧНОЙ ЛЕС",
      map_d7: "РЕЧНОЙ ЛАГЕРЬ",
      map_d8: "ПОИСК ЯГУАРА",
      map_d9: "МУДРОСТЬ ПРЕДКОВ",
      map_d10: "ВОЗВРАЩЕНИЕ",
      route_tag: "ПУТЬ",
      
      // New Cinematic Homepage (index.html)
      home_h_sub_tag: "ГОРЯЧИЙ ТУР",
      home_h_title: "10 ДНЕЙ В АМАЗОНКЕ",
      home_btn_journey: "ОТКРЫТЬ ПУТЬ",
      
      home_journey_title: "10 ДНЕЙ ЭКСПЕДИЦИИ",
      home_journey_sub: "Погружение в нетронутые глубины Амазонии день за днем",
      home_journey_full_btn: "СМОТРЕТЬ ПОДРОБНЫЙ МАРШРУТ →",
      
      // Homepage Journey Cards (Without Numbers)
      home_day1_title: "ПРИБЫТИЕ",
      home_day1_desc: "Прибытие в Амазонию. Приватный лодочный трансфер вглубь первобытных джунглей.<br>Первый вечер в уединенном лодже у тихой воды под чарующие звуки ночного леса.<br>Погружение в атмосферу вневременного спокойствия речного бассейна.",
      
      home_day2_title: "ВГЛУБЬ ЛЕСА",
      home_day2_desc: "Утренний трекинг вглубь тропического леса под руководством опытных гидов.<br>Знакомство с древней целебной флорой, влажными мхами и скрытыми микросредами.<br>Изучение вековых лесных троп и тайн первозданной дикой природы.",
      
      home_day3_title: "РЕКА",
      home_day3_desc: "Тихая экспедиция на деревянной лодке по темным притокам черной воды.<br>Наблюдение за розовыми речными дельфинами и древними птицами.<br>Знакомство с гигантскими кувшинками в глубине извилистых речных протоков.",
      
      home_day4_title: "ГЛУБОКИЕ ДЖУНГЛИ",
      home_day4_desc: "Вход в нетронутый первобытный лес к вековым гигантским деревьям Сейба.<br>Захватывающий маршрут, позволяющий ощутить подлинный масштаб дикой природы.<br>Соприкосновение с величественными исполинами древнего амазонского леса.",
      
      home_day5_title: "НАБЛЮДЕНИЕ С ВЫСОТЫ",
      home_day5_desc: "Подъем на 45-метровую платформу над пологом тропического леса на рассвете.<br>Панорамный вид на бескрайний океан изумрудных крон до самого горизонта.<br>Ощутите первозданную тишину и величие утренних джунглей Амазонии.",
      
      home_day6_title: "НОЧНАЯ ЭКСПЕДИЦИЯ",
      home_day6_desc: "Ночная вылазка на речных шлюпках под таинственный полог дождевого леса.<br>Поиск черных кайманов, светящихся грибов и редких ночных обитателей.<br>Погружение в завораживающую симфонию ночной дикой природы.",
      
      home_day7_title: "ПЛАВУЧИЙ ЛАГЕРЬ",
      home_day7_desc: "Размещение в уединенном плавучем эколагере на зеркальной глади реки.<br>Спокойный сон под мягкий и умиротворяющий ритм древнего течения вод.<br>Абсолютная тишина и слияние с нетронутой природой вдали от мира.",
      
      home_day8_title: "ПОИСК ЯГУАРА",
      home_day8_desc: "Экспедиция следопытов по дальним притокам и скрытым лесным лагунам.<br>Выслеживание скрытных ягуаров, орлов-гарпий и гигантских речных выдр.<br>Редкая возможность наблюдать диких хищников в естественной среде.",
      
      home_day9_title: "МУДРОСТЬ ПРЕДКОВ",
      home_day9_desc: "Теплый визит в традиционную общину коренных жителей бассейна реки.<br>Знакомство с древней философией леса, целебными травами и обрядами.<br>Постижение вековой гармонии человека и великого амазонского леса.",
      
      home_day10_title: "ВОЗВРАЩЕНИЕ",
      home_day10_desc: "Финальный утренний круиз по величественной реке обратно к цивилизации.<br>Панорамный полет на гидросамолете над слиянием двух великих рек.<br>Возвращение домой с вечной тишиной и силой Амазонии в сердце.",
      
      home_havens_sec_title: "УБЕЖИЩЕ В СЕРДЦЕ ДЖУНГЛЕЙ",
      home_havens_sec_sub: "Комфорт мирового уровня в гармонии с дикой природой",
      home_havens_c1_title: "ПРОЖИВАНИЕ",
      home_havens_c1_desc: "Речные лоджи и уединенные кабины из дерева<br>с панорамным остеклением и видом на воду.",
      home_havens_c2_title: "МЕНЮ",
      home_havens_c2_desc: "Авторская гастрономия из свежей рыбы рек,<br>диких тропических фруктов и редких трав.",
      home_havens_c3_title: "ЧТО ВКЛЮЧЕНО",
      home_havens_c3_desc: "Полный пансион, снаряжение, гиды-биологи,<br>катера, гидросамолет и вертолетная помощь.",
      home_havens_c4_title: "СТОИМОСТЬ",
      home_havens_c4_desc: "Эксклюзивная приватная экспедиция вглубь<br>леса для группы до 8 гостей. Все включено.",
      home_havens_full_btn: "ПОДРОБНЕЕ О ГАВАНИ →",
      
      home_manifesto_title: "ФИЛОСОФИЯ УЕДИНЕНИЯ",
      home_manifesto_quote: "«Мы не покоряем джунгли — мы учимся слышать их шепот. Наше путешествие — это глубокое погружение в тишину, дерево, камень и первозданные воды великой реки. Только 8 гостей, абсолютная приватность и возвращение к истокам.»",
      home_man_p1_title: "ТИШИНА",
      home_man_p1_desc: "Отказ от лишнего шума и суеты.",
      home_man_p2_title: "ПРИВАТНОСТЬ",
      home_man_p2_desc: "Только 8 избранных путешественников.",
      home_man_p3_title: "ПЕРВОЗДАННОСТЬ",
      home_man_p3_desc: "Девственная природа в ее чистейшей силе.",
      home_manifesto_full_btn: "ЧИТАТЬ НАШ МАНИФЕСТ →",
      
      home_finale_title: "10 ДНЕЙ ПОЗАДИ",
      home_finale_sub: "ВЫ ВЕРНЕТЕСЬ ДРУГИМ ЧЕЛОВЕКОМ",
      home_finale_desc: "Амазонка оставляет след навсегда. Забронируйте свое место в приватной экспедиции 2026 года.",
      home_finale_btn: "ЗАБРОНИРОВАТЬ ЭКСПЕДИЦИЮ",
      finale_counter: "10 ДНЕЙ ПОЗАДИ",
      finale_quote: "Путь завершается. Дикая природа остается.",
      finale_btn: "ОТКРЫТЬ ГАВАНЬ",
      journey_hero_title: "В ГЛУБИНЕ<br>ПРИРОДЫ",
      journey_hero_sub: "Один путь вглубь Амазонки.",
      journey_hero_btn: "ЗАБРОНИРОВАТЬ",
      intro_days: "ДНЕЙ",
      intro_nights: "НОЧЕЙ",
      intro_pillars: "РЕКА · ЛЕС · ДИКАЯ ПРИРОДА",
      day1_meta: "РЕЧНОЙ ЛОДЖ / 03°08' S / 060°01' W / 18:30",
      day1_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;01</span>ПРИБЫТИЕ",
      day1_desc: "Прибытие в Амазонию. Приватный лодочный трансфер вглубь первобытных джунглей.<br>Первый вечер в уединенном лодже у тихой воды под чарующие звуки ночного леса.<br>Погружение в атмосферу вневременного спокойствия речного бассейна.",
      
      day2_meta: "ЛЕСНАЯ ТРОПА / 03°09' S / 060°03' W / 08:00",
      day2_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;02</span>ВГЛУБЬ&nbsp;ЛЕСА",
      day2_desc: "Утренний трекинг вглубь тропического леса под руководством опытных гидов.<br>Знакомство с древней целебной флорой, влажными мхами и скрытыми микросредами.<br>Изучение вековых лесных троп и тайн первозданной дикой природы.",
      
      day3_meta: "ЧЕРНАЯ ВОДА / 03°11' S / 060°05' W / 06:00",
      day3_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;03</span>РЕКА",
      day3_desc: "Тихая экспедиция на деревянной лодке по темным притокам черной воды.<br>Наблюдение за розовыми речными дельфинами и древними птицами.<br>Знакомство с гигантскими кувшинками в глубине извилистых речных протоков.",
      
      day4_meta: "ВЕКОВАЯ РОЩА / 03°15' S / 060°09' W / 10:30",
      day4_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;04</span>ГЛУБОКИЕ&nbsp;ДЖУНГЛИ",
      day4_desc: "Вход в нетронутый первобытный лес к вековым гигантским деревьям Сейба.<br>Захватывающий маршрут, позволяющий ощутить подлинный масштаб дикой природы.<br>Соприкосновение с величественными исполинами древнего амазонского леса.",
      
      route_ext_title: "ЭКСПЕДИЦИЯ ПРОДОЛЖАЕТСЯ...",
      route_ext_desc: "Углубление нашей связи с лесом по мере продвижения дальше в неизведанные территории бассейна черной воды.",
      
      day5_num: "ДЕНЬ 05",
      day5_num_short: "05-09",
      day5_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;05</span>НАБЛЮДЕНИЕ&nbsp;С&nbsp;ВЫСОТЫ",
      day5_desc: "Подъем на высотную платформу над самыми верхушками древнейших крон джунглей Амазонии,<br>чтобы встретить тихий живописный рассвет над бескрайним зеленым океаном тропического леса.<br>Ощутите масштабы великих крон и непередаваемую тишину утренних джунглей.",
      day5_meta: "БАШНЯ 01 / 03°16' S / 17:15",
      
      day6_num: "ДЕНЬ 06",
      day6_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;06</span>НОЧНАЯ&nbsp;ЭКСПЕДИЦИЯ",
      day6_desc: "Ночная экспедиция под загадочный и густой полог погрузившегося в тишину тропического леса,<br>раскрывающая редкую биолюминесцентную флору и заворожительный гул ночных джунглей.<br>Откройте для себя скрытые ночные тайны дикой природы под покровом темноты.",
      day6_meta: "ПОДЛЕСОК / 03°18' S / 21:00",
      
      day7_num: "ДЕНЬ 07",
      day7_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;07</span>ПЛАВУЧИЙ&nbsp;ЛАГЕРЬ",
      day7_desc: "Переезд в эксклюзивный, глубоко изолированный плавучий лагерь на спокойной глади реки,<br>где вас ждет умиротворяющий сон под мягкий ритмичный шепот древнего течения реки Амазонки.<br>Полное уединение в окружении дикой природы на воде вдали от цивилизации.",
      day7_meta: "РЕЧНОЙ ЛАГЕРЬ / 03°22' S / 05:30",
      
      day8_num: "ДЕНЬ 08",
      day8_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;08</span>ПОИСК&nbsp;ЯГУАРА",
      day8_desc: "Захватывающая экспедиция по выслеживанию скрытных ягуаров, орлов-гарпий и гигантских речных выдр,<br>исследующая самые уединенные охраняемые лагуны в заповедных черных притоках бассейна Амазонки.<br>Уникальная возможность наблюдать редчайших обитателей леса в их естественной среде.",
      day8_meta: "ЛАГУНА / 03°25' S / 09:15",
      
      day9_num: "ДЕНЬ 09",
      day9_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;09</span>МУДРОСТЬ&nbsp;ПРЕДКОВ",
      day9_desc: "Погружение в древнюю философию выживания в лесу, сакральные традиции навигации и этноботанику,<br>принимая бесценные знания и мудрость, передаваемые старейшинами коренных лесных общин Амазонки.<br>Постижение вековой гармонии взаимодействия человека и великого амазонского леса.",
      day9_meta: "ПОСЕЛЕНИЕ / 03°27' S / 14:00",
      
      day10_meta: "МАНАУС / 03°08' S / 060°01' W / 12:00",
      day10_title: "<span class=\"day-num-label\">ДЕНЬ&nbsp;10</span>ВОЗВРАЩЕНИЕ",
      day10_desc: "Финальный утренний круиз по величественной реке обратно к цивилизации.<br>Увезите с собой вечную тишину и вневременность великих джунглей Амазонки.<br>Завершение незабываемого путешествия, которое навсегда останется в вашей памяти.",
      day10_num_short: "10",
      
      // Haven 9 Sections Architecture
      h_sec1_tag: "ГАВАНЬ",
      h_sec1_title: "ТИХОЕ МЕСТО",
      h_sec1_sub: "Природа · Пространство · Тишина",
      
      h_sec2_tag: "02 / ГАВАНЬ",
      h_sec2_title: "ГАВАНЬ",
      h_sec2_sub: "МЕСТО, КУДА ВОЗВРАЩАЮТСЯ",
      h_sec2_mat1_title: "ДЕРЕВО",
      h_sec2_mat1_desc: "Местная твёрдая древесина — основа структуры.",
      h_sec2_mat2_title: "КАМЕНЬ",
      h_sec2_mat2_desc: "Речные камни — фундамент и очаги.",
      h_sec2_mat3_title: "ВОДА",
      h_sec2_mat3_desc: "Природные потоки, вписанные в архитектуру.",
      h_sec2_mat4_title: "ТИШИНА",
      h_sec2_mat4_desc: "Голос древней Амазонии — без слов.",
      
      h_sec3_title: "ПРОЖИВАНИЕ",
      h_sec3_f1: "ЛИЧНЫЙ НОМЕР",
      h_sec3_f1_desc: "Просторное убежище из местного кедра, льна и органических материалов.",
      h_sec3_f2: "ВИД НА РЕКУ",
      h_sec3_f2_desc: "Панорамные окна в пол и потолок с видом на тихие воды Риу-Негру.",
      h_sec3_f3: "ЛИЧНАЯ ВАННАЯ",
      h_sec3_f3_desc: "Открытый душ под небом с речными камнями и ботаническими средствами.",
      h_sec3_f4: "9 НОЧЕЙ",
      h_sec3_title: "ПРОЖИВАНИЕ",
      h_sec3_sub: "ЭКОСИСТЕМА И КОМФОРТ",
      
      h_sec4_title: "СТОЛ",
      h_sec4_sub: "МЕСТНОЕ · СВЕЖЕЕ · ЕЖЕДНЕВНО",
      h_sec4_desc: "Наша кулинарная концепция соединяет лес и ваш стол. Ежедневно собранные травы, открытый огонь и свежая речная рыба, приготовленные по исконным техникам Амазонии.",
      
      h_sec5_title: "МЕНЮ",
      h_sec5_all: "ВСЕ",
      h_sec5_b_title: "ЗАВТРАК",
      h_sec5_b1_title: "Тапиока с сыром Коальо",
      h_sec5_b1_desc: "Свежие блинчики из крахмала маниоки с диким лесным медом.",
      h_sec5_b2_title: "Кускус с плодами Тукума",
      h_sec5_b2_desc: "Паровой кукурузный пирог с маслянистыми дольками тукума.",
      h_sec5_b3_title: "Эликсиры из тропических фруктов",
      h_sec5_b3_desc: "Свежевыжатые соки Гравиолы, Купуасу и Асаи.",
      h_sec5_b4_title: "Яйца с листьями джамбу",
      h_sec5_b4_desc: "Томлёные яйца с диким перцем и пряными лесными травами.",
      h_sec5_b5_title: "Ночной настой Купуасу",
      h_sec5_b5_desc: "Горячий напиток из бобов купуасу с корицей и местным мёдом.",
      
      h_sec5_l_title: "ОБЕД",
      h_sec5_l1_title: "Жареный Тамбаки на углях",
      h_sec5_l1_desc: "Амазонская речная рыба на открытом огне с соусом Тукупи.",
      h_sec5_l2_title: "Мукека по-баиянски",
      h_sec5_l2_desc: "Кокосовое молоко, пальмовое масло и дикие речные травы.",
      h_sec5_l3_title: "Хрустящая Фарофа Уарини",
      h_sec5_l3_desc: "Крафтовая мука из маниоки, обжаренная на топленом масле.",
      h_sec5_l4_title: "Суп из лесных побегов",
      h_sec5_l4_desc: "Бульон из дикого пальмового сердца с имбирём и лимонником.",
      h_sec5_l5_title: "Салат Асаи и Купуасу",
      h_sec5_l5_desc: "Охлаждённые лесные ягоды с листьями водяного кресса и цедрой.",
      
      h_sec5_d_title: "УЖИН",
      h_sec5_d1_title: "Томленое мясо на веточках",
      h_sec5_d1_desc: "Медленное копчение над бревнами амазонского дерева.",
      h_sec5_d2_title: "Филе Пираруку в глиняном горшочке",
      h_sec5_d2_desc: "Запеченный речной гигант с листьями запеченного жамбу.",
      h_sec5_d3_title: "Мусс из Купуасу и дикого Какао",
      h_sec5_d3_desc: "Нежный десерт из лесного плода с темным амазонским шоколадом.",
      h_sec5_d4_title: "Утка в соусе из Тукупи",
      h_sec5_d4_desc: "Традиционное блюдо Пара — утиное конфи в кислом соусе маниоки.",
      h_sec5_d5_title: "Кремё из дикого какао",
      h_sec5_d5_desc: "Нежный шоколадный крем с солью и листьями пипи.",
      
      h_sec6_title: "ИЗ ЗЕМЛИ",
      h_sec6_sub: "МЕСТНЫЕ ПРОДУКТЫ",
      h_sec6_tag1: "БОТАНИКА",
      h_sec6_tag2: "УРОЖАЙ",
      h_sec6_tag3: "ПЧЕЛОВОДСТВО",
      h_sec6_i1: "ДЖАМБУ И ТУКУПИ",
      h_sec6_i1_desc: "Дикие лесные травы и ферментированный сок маниоки по традиционным рецептам.",
      h_sec6_i2: "ДИКИЕ ФРУКТЫ",
      h_sec6_i2_desc: "Свежесобранные Асаи, Тукума, Каму-Каму и Буриту — кладезь природных питательных веществ.",
      h_sec6_i3: "ДИКИЙ МЁД",
      h_sec6_i3_desc: "Чистый мёд местных безжальных пчёл, собранный в нетронутых джунглях.",
      
      h_sec7_title: "ЧТО ВКЛЮЧЕНО",
      h_sec7_sub: "ДЕТАЛИ ЭКСПЕДИЦИИ",
      h_sec7_col_inc: "ВКЛЮЧЕНО",
      h_sec7_col_exc: "НЕ ВКЛЮЧЕНО",
      h_sec7_inc1_title: "9 ночей проживания класса люкс",
      h_sec7_inc1_desc: "Размещение в речных лоджах, плавучих лагерях и лесных кабинах.",
      h_sec7_inc2_title: "Авторская гастрономия",
      h_sec7_inc2_desc: "Полный пансион, лесные деликатесы, напитки и закуски в течение всего дня.",
      h_sec7_inc3_title: "Трансферы по маршруту",
      h_sec7_inc3_desc: "Все лодочные маршруты, внутренние перелеты и гидросамолеты.",
      h_sec7_inc4_title: "Экспедиции и гиды",
      h_sec7_inc4_desc: "Сопровождение биологов, восхождения на полог леса и трекинг с гидами.",
      h_sec7_inc5_title: "Профессиональное снаряжение",
      h_sec7_inc5_desc: "Непромокаемая одежда, трекинговое снаряжение и органическая косметика.",
      h_sec7_inc6_title: "Полевая медицина и страховка",
      h_sec7_inc6_desc: "Включая экстренную медицинскую эвакуацию вертолетом.",
      h_sec7_inc7_title: "Фотограф экспедиции",
      h_sec7_inc7_desc: "Профессиональный натурфотограф сопровождает группу на протяжении всего маршрута.",
      h_sec7_inc8_title: "Ночные экскурсии",
      h_sec7_inc8_desc: "Наблюдение за дикой природой Амазонии при свете луны с опытным проводником.",
      h_sec7_exc1_title: "Авиабилеты до Манауса",
      h_sec7_exc1_desc: "Международные и внутренние перелеты до точки сбора группы.",
      h_sec7_exc2_title: "Премиальный алкоголь",
      h_sec7_exc2_desc: "Коллекционные вина и крепкие напитки вне стандартного барного меню.",
      h_sec7_exc3_title: "Чаевые команде",
      h_sec7_exc3_desc: "Вознаграждение для местных проводников, поваров и экипажа катера.",
      h_sec7_exc4_title: "Личная экипировка",
      h_sec7_exc4_desc: "Индивидуальная трекинговая обувь, специализированное термобелье.",
      
      // Pricing
      pricing_title: "СТОИМОСТЬ",
      pricing_sub: "10 ДНЕЙ · ПОЛНОЕ ПОГРУЖЕНИЕ",
      pricing_badge: "ПОПУЛЯРНО",
      pricing_solo_label: "SOLO",
      pricing_solo_per: "на одного гостя",
      pricing_duo_label: "DUO",
      pricing_duo_per: "за двоих гостей",
      pricing_group_label: "GROUP",
      pricing_group_per: "с человека (от 4 гостей)",
      pricing_f1: "10 ночей в частных гаванях",
      pricing_f2: "Полный пансион — 3 блюда в день",
      pricing_f3: "Все трансферы по маршруту",
      pricing_f4: "Гид-натуралист на каждый день",
      pricing_f5: "Снаряжение и органическая аптечка",
      pricing_f6: "Страховка и медэвакуация",
      pricing_f7: "Фотограф экспедиции",
      pricing_f8: "Приватная вилла с бассейном",
      pricing_f9: "Гидросамолёт над джунглями",
      pricing_f10: "Групповой ценовой приоритет",
      pricing_cta_book: "ЗАБРОНИРОВАТЬ",
      pricing_cta_group: "ЗАПРОСИТЬ ДЕТАЛИ",
      pricing_note: "Стоимость указана без учёта авиаперелётов до Манауса. Возможна рассрочка и индивидуальные условия — свяжитесь с нами.",
      
      h_sec8_title: "ПОСЛЕ ТЕМНОТЫ",
      h_sec8_desc: "Когда ночь спускается над Амазонией, лес преображается. Соберитесь у открытого костра на деке под нетронутым куполом звёзд — слушая ночной гул древней реки.",
      
      h_sec9_title: "До встречи в Гавани",
      h_sec9_quote: "Прибежище дерева, камня и тихой воды.",
      h_sec9_btn_journey: "ОТКРЫТЬ ПУТЬ",
      h_sec9_btn_book: "ЗАБРОНИРОВАТЬ",
      
      // Havens (Stay)
      stay_tag: "ГАВАНИ",
      stay_title: "НАШИ ГАВАНИ",
      stay_subtitle: "Пространства, созданные для того, чтобы стереть границу между гостем и лесом.",
      stay_card1_title: "ЛЕСНОЙ ЛОДЖ",
      stay_card1_desc: "Построен полностью из поваленной твердой древесины и местного сланца. Спроектирован так, чтобы обеспечить абсолютную тишину и вентиляцию. Открывает панорамный вид на тихую гладь дикой лагуны.",
      stay_card2_title: "РЕЧНОЙ ЛАГЕРЬ",
      stay_card2_desc: "Просыпайтесь прямо на естественном движении древней Амазонки. Минималистичные павильоны на устойчивых плавучих доках позволяют слышать глубокий ритм реки без каких-либо преград.",
      stay_card3_title: "ПРИВАТНАЯ ВИЛЛА",
      stay_card3_desc: "Чистая интеграция камня, необработанного стекла и тропической листвы. Абсолютная приватность, персональные минеральные бассейны и видовая панорамная площадка над кронами дикого леса.",
      stay_card_footer_left: "ЧАСТНЫЙ РЕЗЕРВАТ",
      stay_card_footer_right: "ДИЗАЙН НОМЕРА →",
      
      // Cuisine
      menu_tag: "БРАЗИЛЬСКАЯ ГАСТРОНОМИЯ",
      menu_title: "ОТ ЛЕСА К СТОЛУ",
      menu_subtitle: "АМАЗОНСКАЯ ГАСТРОНОМИЯ",
      menu_type_breakfast: "ЗАВТРАК / Café da Manhã",
      menu_type_lunch: "ОБЕД / Almoço",
      menu_type_dinner: "УЖИН / Jantar",
      menu_b1_name: "Tapioca com Queijo Coalho",
      menu_b1_desc: "Тонкие блины из маниокового крахмала с хрустящим сыром коалью и диким медом.",
      menu_b2_name: "Cuscuz Nordestino com Tucumã",
      menu_b2_desc: "Рассыпчатый кукурузный пирог на пару с маслом и ломтиками маслянистого плода тукума.",
      menu_b3_name: "Pão de Queijo de Mandioca",
      menu_b3_desc: "Традиционные теплые сырные булочки из крахмала маниока и выдержанного горного сыра.",
      menu_b4_name: "Frutos do Quintal com Mel",
      menu_b4_desc: "Свежесобранные тропические плоды (купуасу, гравиола, асаи) с чистым лесным медом.",
      menu_b5_name: "Suco de Cacau Fresco",
      menu_b5_desc: "Свежевыжатый сок из мякоти плодов сырого органического какао, холодный отжим.",
      menu_l1_name: "Moqueca de Tambaqui",
      menu_l1_desc: "Густое рыбное рагу в глиняных горшочках с кокосовым молоком, маслом денде и свежим кориандром.",
      menu_l2_name: "Tambaqui na Brasa",
      menu_l2_desc: "Ребрышки рыбы тамбаки на открытом огне, подаются с соусом тукупи и жареной мукой маниока.",
      menu_l3_name: "Pirarucu de Casaca",
      menu_l3_desc: "Слои вяленого пираруку с кусочками банана-плантано, томатами и крошкой обжаренных кешью.",
      menu_l4_name: "Farofa de Uarini",
      menu_l4_desc: "Желтая крупа маниока уарини, обжаренная со сливочным маслом и зеленью кориандра.",
      menu_l5_name: "Soup Tacacá",
      menu_l5_desc: "Традиционный горячий острый бульон из маниока с листьями джамбу и сушеными креветками.",
      menu_d1_name: "Filé de Pirarucu Grelhado",
      menu_d1_desc: "Стейк пираруку с хрустящей корочкой на нежном креме из персиковой пальмы пупунья.",
      menu_d2_name: "Pato no Tucupi",
      menu_d2_desc: "Медленно запеченная утиная грудка в бульоне тукупи с покалывающими язык листьями джамбу.",
      menu_d3_name: "Bobó de Camarão",
      menu_d3_desc: "Крупные креветки в бархатистом пюре из корня маниока, кокосового молока и пальмового масла.",
      menu_d4_name: "Brigadeiro de Cacau Selvagem",
      menu_d4_desc: "Конфеты из дикого амазонского какао с добавлением выдержанной бразильской кашасы.",
      menu_d5_name: "Bolo de Rolo com Sorvete",
      menu_d5_desc: "Тончайший рулет с начинкой из гуавы, подается с домашним мороженым из тапереба.",
      menu_bar_title: "БАР / The Bar",
      menu_bar_items: "Caipirinha de Jambu &nbsp;·&nbsp; Cassava Lager &nbsp;·&nbsp; National Sparkling Wine &nbsp;·&nbsp; Botanical Cocktails &nbsp;·&nbsp; Guaraná Infusions",
      menu_cover_title: "ГАСТРОНОМИЯ",
      menu_cover_sub: "Кулинарная душа лесов Амазонии",
      menu_phil_title: "ФИЛОСОФИЯ",
      menu_phil_text1: "Каждое блюдо — это диалог с рекой и лесом. Мы собираем ингредиенты в собственных садах и у местных фермеров вдоль Риу-Негру.",
      menu_phil_text2: "Приготовление на открытом огне, в глиняных горшках и медленное копчение сохраняют первозданный вкус джунглей. Роскошь абсолютной свежести.",
      menu_phil_sig: "Шеф-повара Maira",
      menu_bar_intro: "Наш бар отражает все биоразнообразие долины. От покалывающих коктейлей с джамбу до медленных отваров диких трав Амазонии.",
      bf_1_desc: "Традиционная кашаса с лаймом, тростниковым сахаром и листьями джамбу, покалывающими язык.",
      bf_2_desc: "Освежающее местное пиво, сваренное на основе сусла сладкого маниока.",
      bf_3_desc: "Медленно заваренные горячие и холодные чаи из лимонной травы, мяты и семян гуараны.",
      
      // Tasting Menu RU
      menu_type_tasting: "ДЕГУСТАЦИЯ / Menu de Degustação",
      menu_t1_name: "Tucupi Shot com Jambu",
      menu_t1_desc: "Шот из дикого бульона маниока (тукупи) с покалывающим эффектом листьев джамбу.",
      menu_t2_name: "Dados de Tapioca",
      menu_t2_desc: "Хрустящие кубики тапиоки с расплавленным сыром коалью и пикантным перечным желе.",
      menu_t3_name: "Ceviche de Tambaqui",
      menu_t3_desc: "Свежайший речной тамбаки, маринованный в соке каму-каму с диким луком и кориандром.",
      menu_t4_name: "Tambaqui ao Mel",
      menu_t4_desc: "Ребрышки тамбаки на гриле, глазированные медом диких пчел, со специями урукум.",
      menu_t5_name: "Pato no Tucupi Defumado",
      menu_t5_desc: "Копченая утиная грудка в концентрированном желтом бульоне маниока с травами.",
      menu_t6_name: "Sorbet de Cupuaçu",
      menu_t6_desc: "Освежающий кисло-сладкий сорбет из плодов купуасу с крошкой жареного бразильского ореха.",
      menu_t7_name: "Infusão de Cacau Selvagem",
      menu_t7_desc: "Горячий настой шелухи дикого амазонского какао с травами лемонграсса.",

      // Wine Cellar RU
      menu_type_wine: "ВИННЫЙ ПОГРЕБ / Carta de Vinhos",
      menu_w1_name: "Cachaça em Amburana",
      menu_w1_desc: "Артизанальная кашаса премиум-класса, выдержанная в бочках из дерева амбурана.",
      menu_w2_name: "Serra Gaúcha Chardonnay",
      menu_w2_desc: "Освежающее белое вино из южного бразильского региона с минеральным вкусом.",
      menu_w3_name: "Vale dos Vinhedos Merlot",
      menu_w3_desc: "Полнотелое красное сухое вино с ароматами сливы, ежевики и лесных пряностей.",
      menu_w4_name: "Amazonian Gin & Tonic",
      menu_w4_desc: "Премиальный джин на амазонских ботаникалах с ягодами асаи и тоником.",

      // Desserts RU
      menu_type_dessert: "ДЕСЕРТЫ / Sobremesas",
      menu_de1_name: "Bolo de Rolo Tradicional",
      menu_de1_desc: "Традиционный тончайший рулет с начинкой из сладкой гуавы.",
      menu_de2_name: "Mousse de Graviola",
      menu_de2_desc: "Нежный воздушный мусс из плодов гравиолы с соусом из диких лесных ягод.",
      menu_de3_name: "Tarta de Castanha-do-Pará",
      menu_de3_desc: "Хрустящий тарт из бразильского ореха с кремом из купуасу.",
      menu_de4_name: "Sorvete de Açaí do Bosque",
      menu_de4_desc: "Настоящее несладкое мороженое из ягод асаи с хрустящими жемчужинами тапиоки.",
      menu_de5_name: "Pudim com Licor de Cupuaçu",
      menu_de5_desc: "Классический сливочный пудинг, сбрызнутый выдержанным ликером купуасу.",

      tab_phil: "ФИЛОСОФИЯ",
      tab_day: "ДНЕВНОЕ МЕНЮ",
      tab_tasting: "ДЕГУСТАЦИЯ",
      tab_wine: "ВИННЫЙ ПОГРЕБ",
      tab_desserts: "ДЕСЕРТЫ & БАР",
      
      // Rates
      price_tag: "СТОИМОСТЬ",
      price_title: "ЭКСПЕДИЦИЯ",
      price_subtitle: "10 ДНЕЙ / 9 НОЧЕЙ",
      price_amount: "ОТ $14,500 <span class=\"per-person\">/ ЧЕЛОВЕК</span>",
      price_included_title: "ВКЛЮЧЕНО",
      price_inc1: "<span class=\"check-icon\">✓</span> Роскошное проживание",
      price_inc2: "<span class=\"check-icon\">✓</span> Все приемы пищи и авторские напитки",
      price_inc3: "<span class=\"check-icon\">✓</span> Индивидуальный трансфер",
      price_inc4: "<span class=\"check-icon\">✓</span> Речной транспорт экспедиции",
      price_inc5: "<span class=\"check-icon\">✓</span> Опытные местные и научные гиды",
      price_inc6: "<span class=\"check-icon\">✓</span> Выходы в джунгли и ночной трекинг",
      price_inc7: "<span class=\"check-icon\">✓</span> Все снаряжение, каяки и средства безопасности",
      price_inc8: "<span class=\"check-icon\">✓</span> Сборы за посещение заповедников",
      price_excluded_title: "НЕ ВКЛЮЧЕНО",
      price_exc1: "<span class=\"dash-icon\">—</span> Международные перелеты до Манауса",
      price_exc2: "<span class=\"dash-icon\">—</span> Личная экспедиционная экипировка",
      price_exc3: "<span class=\"dash-icon\">—</span> Страховка с экстренной эвакуацией (обязательно)",
      price_exc4: "<span class=\"dash-icon\">—</span> Алкоголь премиум-класса из погреба",
      price_limit_title: "ОГРАНИЧЕННОЕ КОЛИЧЕСТВО МЕСТ",
      price_limit_desc: "Чтобы сохранить тишину леса и обеспечить уединение, мы принимаем максимум 8 гостей в одной экспедиции. Размер группы строго ограничен.",
      
      // Manifesto Unified Screens
      m_screen1_tag: "МАНИФЕСТ",
      m_screen1_title: "Есть места,<br>которые не нужно объяснять.<br><span class=\"gold-italic\">Их нужно почувствовать.</span>",
      m_screen2_tag: "ФИЛОСОФИЯ",
      m_screen2_title: "Мы верим в роскошь, которой не требуется демонстрация.<br><br>В пространство, где архитектура не спорит с природой.<br><br><span class=\"gold-italic\">В тишину, которая становится ценнее любого звука.</span>",
      m_screen3_tag: "СУТЬ",
      m_screen3_title: "Гавань — это больше, чем место.<br><br><span class=\"gold-italic\">Это возможность на время выйти из привычного ритма и вернуться к главному.</span>",
      m_screen3_words: "ТИШЕ · БЛИЖЕ · НАСТОЯЩЕЕ",
      m_screen3_cta: "ОТКРЫТЬ ГАВАНЬ",
      
      // Form / Booking (Exact 3 Fields: Name, Phone, Guests by Price)
      book_tag: "БРОНИРОВАНИЕ",
      book_title: "ЗАБРОНИРОВАТЬ ЭКСПЕДИЦИЮ",
      book_subtitle: "Внесите данные для бронирования. Наш персональный консьерж свяжется с вами в течение 15 минут.",
      form_label_name: "ИМЯ",
      form_placeholder_name: "Ваше имя",
      form_label_contact: "ТЕЛЕФОН",
      form_placeholder_contact: "+7 (999) 000-00-00",
      form_label_guests: "КОЛИЧЕСТВО ГОСТЕЙ (ПО ПРАЙСУ)",
      form_opt_guests_default: "Выберите количество гостей",
      form_opt_guest1: "1 гость — $14,500 / гость (Solo)",
      form_opt_guest2: "2 гостя — $12,800 / гость (Duo)",
      form_opt_guest3: "От 4+ гостей — $10,500 / гость (Группа)",
      form_submit: "ЗАБРОНИРОВАТЬ <span class=\"arrow\">→</span>",
      success_title: "ЗАЯВКА ПРИНЯТА",
      success_desc: "Персональный консьерж экспедиции MAIRA свяжется с вами в течение 15 минут для подтверждения бронирования.",
      success_reset: "ОТПРАВИТЬ ЕЩЁ ЗАПРОС",
      
      // Footer
      footer_tagline: "10 дней / Глубокая экспедиция",
      footer_info1_title: "ВОПРОСЫ И ЗАЯВКИ",
      footer_info2_title: "КООРДИНАТЫ",
      footer_info2_p1: "Базовый лагерь: 03°08'43\" S / 060°01'15\" W",
      footer_info2_p2: "Манаус, Амазонас, Бразилия",
      footer_copyright: "&copy; 2026 MAIRA PRIVATE RETREATS. ВСЕ ПРАВА ЗАЩИЩЕНЫ. АССОЦИАЦИЯ ЧАСТНЫХ КЛУБОВ.",
      footer_legal1: "УСЛОВИЯ ИСПОЛЬЗОВАНИЯ",
      footer_legal2: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ",
      footer_nav_title: "НАВИГАЦИЯ",
      footer_nav_book: "ЗАБРОНИРОВАТЬ",
    },
    en: {
      site_title: "MAIRA — 10 Days Deep Green Luxury Expedition",
      brand_logo: "M A I R A",
      nav_num_1: "01",
      nav_journey: "THE PATH",
      nav_num_2: "02",
      nav_havens: "HAVENS",
      nav_num_3: "03",
      nav_rates: "RATES",
      nav_num_4: "04",
      nav_manifesto: "MANIFESTO",
      nav_cta: "BOOK <span class=\"arrow\">→</span>",
      
      // Hero
      havens_hero_tag: "THE HAVEN",
      havens_hero_title: "A QUIET PLACE",
      havens_hero_sub: "NATURE · SPACE · SILENCE",
      entrance_tag: "ENTERING THE HAVEN",
      entrance_sub_tag: "THE HAVEN",
      entrance_desc_text: "Built around the rhythm of the forest.<br>Wood, stone, water and silence.",
      mat_wood: "WOOD",
      mat_wood_desc: "Local untreated hardwoods, framing the structure.",
      mat_stone: "STONE",
      mat_stone_desc: "River stones, forming solid foundations and hearths.",
      mat_water: "WATER",
      mat_water_desc: "Natural stream channels, integrated into the architecture.",
      mat_light: "LIGHT",
      mat_light_desc: "Muted sunbeams filtering through the tree canopy.",
      hero_title: "10 DAYS<br><span class=\"serif-italic\">IN THE WILD</span>",
      hero_subtitle: "A private journey into the heart of the Amazon.",
      hero_btn_primary: "EXPLORE THE JOURNEY",
      hero_btn_outline: "BOOK THE EXPEDITION",
      hero_stat_days: "10 DAYS",
      hero_stat_brand: "M A I R A",
      hero_stat_group: "PRIVATE GROUP",
      hero_stat_forest: "RAINFOREST",
      
      // Route (Journey)
      map_tag: "ROUTE",
      map_title: "EXPEDITION MAP",
      map_d1: "ARRIVAL",
      map_d2: "FOREST TRAIL",
      map_d3: "BLACKWATER",
      map_d4: "ANCIENT GROVE",
      map_d5: "CANOPY HEIGHT",
      map_d6: "NIGHT EXPEDITION",
      map_d7: "FLOATING CAMP",
      map_d8: "JAGUAR LAGOON",
      map_d9: "LOCAL WISDOM",
      map_d10: "RETURN",
      route_tag: "THE PATH",
      
      // New Cinematic Homepage (index.html)
      home_h_sub_tag: "EXCLUSIVE EXPEDITION",
      home_h_title: "10 DAYS IN THE AMAZON",
      home_btn_journey: "OPEN THE PATH",
      
      home_journey_title: "10 DAYS OF EXPEDITION",
      home_journey_sub: "Immerse into the untouched depths of the Amazon day by day",
      home_journey_full_btn: "EXPLORE FULL ITINERARY →",
      
      // Homepage Journey Cards (Without Numbers)
      home_day1_title: "ARRIVAL",
      home_day1_desc: "Arrival in Amazonas. Private boat transfer deep into the pristine rainforest.<br>First evening at the secluded water lodge, listening to the night forest awaken.<br>Immerse yourself in the timeless tranquility of the ancient river basin.",
      
      home_day2_title: "INTO THE FOREST",
      home_day2_desc: "Morning trek into the rainforest guided by native expedition experts.<br>Encounter ancient medicinal flora, damp mosses, and hidden micro-habitats.<br>Explore ancient forest trails and discover secrets of untouched wilderness.",
      
      home_day3_title: "RIVER",
      home_day3_desc: "A quiet wooden boat expedition along dark water tributaries.<br>Spot pink river dolphins and prehistoric hoatzin birds.<br>Encounter giant water lilies deep inside winding river channels.",
      
      home_day4_title: "DEEP JUNGLE",
      home_day4_desc: "Entering the pristine primary forest to stand beneath ancient Ceiba trees.<br>An immersive trek experiencing the true grand scale of untouched nature.<br>Connect with the majestic giant trees of the ancient Amazonian forest.",
      
      home_day5_title: "CANOPY OBSERVATION",
      home_day5_desc: "Ascent to a 45-meter high platform above the rainforest canopy at dawn.<br>Panoramic view of the endless emerald ocean stretching to the horizon.<br>Experience the pristine silence and grand scale of the morning jungle.",
      
      home_day6_title: "NIGHT EXPEDITION",
      home_day6_desc: "Night expedition on river skiffs beneath the mysterious jungle canopy.<br>Search for black caimans, bioluminescent fungi, and nocturnal wildlife.<br>Immersion in the mesmerizing symphony of untouched nocturnal wilderness.",
      
      home_day7_title: "FLOATING CAMP",
      home_day7_desc: "Stay at an exclusive floating eco-lodge moored on the glassy river waters.<br>Deep sleep to the soothing, gentle rhythm of the ancient river currents.<br>Total seclusion and harmony with pristine nature far from civilization.",
      
      home_day8_title: "JAGUAR TRAIL",
      home_day8_desc: "Tracker expedition through remote tributaries and secluded forest lagoons.<br>Spot elusive jaguars, harpy eagles, and giant Amazonian river otters.<br>Rare opportunity to witness apex forest predators in their native habitat.",
      
      home_day9_title: "INDIGENOUS WISDOM",
      home_day9_desc: "Warm visit to an authentic indigenous community of the river basin.<br>Discover ancestral forest philosophy, medicinal botany, and sacred rites.<br>Understand the timeless harmony between humanity and the ancient jungle.",
      
      home_day10_title: "RETURN",
      home_day10_desc: "Final morning river cruise along the historic Amazon back to civilization.<br>Scenic floatplane flight over the majestic meeting of the two great waters.<br>Returning home with the eternal silence and spirit of the Amazon in soul.",
      
      home_havens_sec_title: "A SANCTUARY IN THE JUNGLE",
      home_havens_sec_sub: "World-class comfort in harmony with raw wilderness",
      home_havens_c1_title: "ACCOMMODATION",
      home_havens_c1_desc: "River lodges and secluded wooden cabins<br>with panoramic views across the waters.",
      home_havens_c2_title: "DINING",
      home_havens_c2_desc: "Bespoke rainforest gastronomy with fresh fish,<br>wild tropical fruits, and native herbs.",
      home_havens_c3_title: "WHAT IS INCLUDED",
      home_havens_c3_desc: "Full board, expedition gear, expert biologists,<br>river boats, floatplanes, and insurance.",
      home_havens_c4_title: "EXPEDITION TIERS",
      home_havens_c4_desc: "Exclusive private expedition deep in the wild<br>for up to 8 guests. All-inclusive luxury.",
      home_havens_full_btn: "DISCOVER HAVENS →",
      
      home_manifesto_title: "PHILOSOPHY OF SILENCE",
      home_manifesto_quote: "\"We do not conquer the jungle — we learn to hear its whisper. Our journey is a deep immersion into silence, wood, stone, and the pristine waters of the great river. Only 8 guests, absolute privacy, and a return to the source.\"",
      home_man_p1_title: "SILENCE",
      home_man_p1_desc: "Shedding unnecessary noise and pace.",
      home_man_p2_title: "PRIVACY",
      home_man_p2_desc: "Strictly limited to 8 guests per expedition.",
      home_man_p3_title: "RAW WILDERNESS",
      home_man_p3_desc: "Ancient nature in its purest power.",
      home_manifesto_full_btn: "READ OUR MANIFESTO →",
      
      home_finale_title: "10 DAYS BEHIND",
      home_finale_sub: "YOU RETURN AS SOMEONE ELSE",
      home_finale_desc: "The Amazon leaves a permanent mark on the soul. Reserve your place on the 2026 expedition.",
      home_finale_btn: "RESERVE YOUR EXPEDITION",
      finale_counter: "10 DAYS BEHIND",
      finale_quote: "The journey ends. The wild remains.",
      finale_btn: "OPEN THE HARBOR",
      journey_hero_title: "IN THE DEPTHS<br>OF NATURE",
      journey_hero_sub: "One path into the heart of the Amazon.",
      journey_hero_btn: "BOOK THE EXPEDITION",
      intro_days: "DAYS",
      intro_nights: "NIGHTS",
      intro_pillars: "RIVER · FOREST · WILDERNESS",
      day1_meta: "RIVER LODGE / 03°08' S / 060°01' W / 18:30",
      day1_title: "<span class=\"day-num-label\">DAY&nbsp;01</span>ARRIVAL",
      day1_desc: "Arrival in Amazonas. Private boat transfer deep into the pristine rainforest.<br>First evening at the secluded water lodge, listening to the night forest awaken.<br>Immerse yourself in the timeless tranquility of the ancient river basin.",
      
      day2_meta: "CANOPY TRAIL / 03°09' S / 060°03' W / 08:00",
      day2_title: "<span class=\"day-num-label\">DAY&nbsp;02</span>INTO&nbsp;THE&nbsp;FOREST",
      day2_desc: "Morning trek into the rainforest guided by native expedition experts.<br>Encounter ancient medicinal flora, damp mosses, and hidden micro-habitats.<br>Explore ancient forest trails and discover secrets of untouched wilderness.",
      
      day3_meta: "BLACKWATER / 03°11' S / 060°05' W / 06:00",
      day3_title: "<span class=\"day-num-label\">DAY&nbsp;03</span>RIVER",
      day3_desc: "A quiet wooden boat expedition along dark water tributaries.<br>Spot pink river dolphins and prehistoric hoatzin birds.<br>Encounter giant water lilies deep inside winding river channels.",
      
      day4_meta: "ANCIENT GROVE / 03°15' S / 060°09' W / 10:30",
      day4_title: "<span class=\"day-num-label\">DAY&nbsp;04</span>DEEP&nbsp;JUNGLE",
      day4_desc: "Entering the pristine primary forest to stand beneath ancient Ceiba trees.<br>An immersive trek experiencing the true grand scale of untouched nature.<br>Connect with the majestic giant trees of the ancient Amazonian forest.",
      
      route_ext_title: "THE EXPEDITION CONTINUES...",
      route_ext_desc: "Deepening our connection with the forest as we push further into the uncharted territories of the blackwater basin.",
      
      day5_num: "DAY 05",
      day5_num_short: "05-09",
      day5_title: "<span class=\"day-num-label\">DAY&nbsp;05</span>CANOPY&nbsp;OBSERVATION",
      day5_desc: "Ascend to an elevated canopy platform perched high above the ancient treetops of the tropical rainforest,<br>witnessing a serene, breathtaking sunrise over the endless green ocean of the untouched Amazon basin.<br>Experience the immense scale of the canopy and the silence of the morning jungle.",
      day5_meta: "TOWER 01 / 03°16' S / 17:15",
      
      day6_num: "DAY 06",
      day6_title: "<span class=\"day-num-label\">DAY&nbsp;06</span>NIGHT&nbsp;EXPEDITION",
      day6_desc: "A captivating night expedition beneath the dark, dense understory of the primary Amazonian rainforest,<br>unveiling rare bioluminescent flora and the intense, enchanting nocturnal sounds of untouched nature.<br>Discover the hidden night secrets of the wild beneath the dark forest canopy.",
      day6_meta: "UNDERSTORY / 03°18' S / 21:00",
      
      day7_num: "DAY 07",
      day7_title: "<span class=\"day-num-label\">DAY&nbsp;07</span>REMOTE&nbsp;FLOATING&nbsp;CAMP",
      day7_desc: "Relocate to an exclusive, deeply secluded floating river retreat anchored on the calm Amazonian waters,<br>sleeping soundly to the gentle, soothing rhythm and tranquil whisper of the historic river currents.<br>Total seclusion immersed in pristine nature on the water far from civilization.",
      day7_meta: "RIVER CAMP / 03°22' S / 05:30",
      
      day8_num: "DAY 08",
      day8_title: "<span class=\"day-num-label\">DAY&nbsp;08</span>WILDLIFE&nbsp;TRACKING",
      day8_desc: "An exhilarating wildlife tracking expedition to spot elusive jaguars, rare harpy eagles, and giant otters,<br>exploring the most protected, isolated lagoons hidden along pristine blackwater tributaries of the basin.<br>A unique opportunity to observe the rarest forest wildlife in their natural habitat.",
      day8_meta: "LAGOON / 03°25' S / 09:15",
      
      day9_num: "DAY 09",
      day9_title: "<span class=\"day-num-label\">DAY&nbsp;09</span>LOCAL&nbsp;WISDOM",
      day9_desc: "Immerse in ancient survival philosophy, sacred rainforest navigation, and indigenous ethnobotany,<br>receiving timeless wisdom shared directly by native community elders passed down for generations.<br>Understand the ancient harmony between humanity and the great Amazonian rainforest.",
      day9_meta: "SETTLEMENT / 03°27' S / 14:00",
      
      day10_meta: "MANAUS / 03°08' S / 060°01' W / 12:00",
      day10_title: "<span class=\"day-num-label\">DAY&nbsp;10</span>RETURN",
      day10_desc: "A final morning river cruise along the historic Amazon back to civilization.<br>Carry the silence and timelessness of the great jungle back home with you.<br>The conclusion of an unforgettable journey that will stay in your memory forever.",
      day10_num_short: "10",
      
      // Haven 9 Sections Architecture
      h_sec1_tag: "HAVEN",
      h_sec1_title: "A QUIET PLACE",
      h_sec1_sub: "Nature · Space · Silence",
      
      h_sec2_tag: "02 / HAVEN",
      h_sec2_title: "THE HAVEN",
      h_sec2_sub: "A PLACE TO RETURN",
      h_sec2_mat1_title: "WOOD",
      h_sec2_mat1_desc: "Local untreated hardwoods, framing the structure.",
      h_sec2_mat2_title: "STONE",
      h_sec2_mat2_desc: "River stones, forming solid foundations and hearths.",
      h_sec2_mat3_title: "WATER",
      h_sec2_mat3_desc: "Natural stream channels, integrated into the architecture.",
      h_sec2_mat4_title: "SILENCE",
      h_sec2_mat4_desc: "The ambient hum of the ancient Amazonian forest.",
      
      h_sec3_title: "YOUR STAY",
      h_sec3_sub: "ECOSYSTEM & COMFORT",
      h_sec3_f1: "PRIVATE ROOM",
      h_sec3_f1_desc: "Spacious private sanctuary designed with local cedar, linen, and organic architecture.",
      h_sec3_f2: "RIVER VIEW",
      h_sec3_f2_desc: "Panoramic floor-to-ceiling vistas overlooking the quiet waters of the Rio Negro.",
      h_sec3_f3: "PRIVATE BATH",
      h_sec3_f3_desc: "Open-air rain shower with natural river stones and botanical forest amenities.",
      h_sec3_f4: "9 NIGHTS",
      h_sec3_f4_desc: "Nine restorative nights sleeping to the soothing rhythm of ancient river waters.",
      
      h_sec4_title: "THE TABLE",
      h_sec4_sub: "LOCAL · FRESH · DAILY",
      h_sec4_desc: "Our culinary vision connects the forest with your table. Daily harvested herbs, open-flame grills, and fresh river fish prepared with ancestral Amazonian techniques.",
      
      h_sec5_title: "MENU",
      h_sec5_all: "ALL",
      h_sec5_b_title: "BREAKFAST",
      h_sec5_b1_title: "Tapioca & Coalho Cheese",
      h_sec5_b1_desc: "Fresh cassava starch crepes with wild honey.",
      h_sec5_b2_title: "Cuscuz with Tucumã Fruit",
      h_sec5_b2_desc: "Steamed cornmeal cake with native forest fruit.",
      h_sec5_b3_title: "Tropical Fruit Elixirs",
      h_sec5_b3_desc: "Freshly pressed Graviola, Cupuaçu, and Açaí.",
      h_sec5_b4_title: "Jambu Leaf Eggs",
      h_sec5_b4_desc: "Poached eggs infused with wild pepper and rainforest herbs.",
      h_sec5_b5_title: "Overnight Cupuaçu Brew",
      h_sec5_b5_desc: "Warm artisan cupuaçu bean brew with cinnamon and wild jungle honey.",
      
      h_sec5_l_title: "LUNCH",
      h_sec5_l1_title: "Gilled Tambaqui Fish",
      h_sec5_l1_desc: "Open-fire roasted native river fish with Tucupi sauce.",
      h_sec5_l2_title: "Moqueca Baiana",
      h_sec5_l2_desc: "Coconut milk, dendê oil, and wild river herbs.",
      h_sec5_l3_title: "Crispy Farofa de Uarini",
      h_sec5_l3_desc: "Artisanal yellow cassava flour roasted in clarified butter.",
      h_sec5_l4_title: "Wild Heart of Palm Soup",
      h_sec5_l4_desc: "Fragrant broth of wild heart of palm, ginger, and lemongrass.",
      h_sec5_l5_title: "Chilled Açaí & Watercress Salad",
      h_sec5_l5_desc: "Chilled forest berries with fresh watercress leaves and citrus zest.",
      
      h_sec5_d_title: "DINNER",
      h_sec5_d1_title: "Slow-Smoked Wild Meat",
      h_sec5_d1_desc: "Smoked over native hardwoods with Amazonian herbs.",
      h_sec5_d2_title: "Pirarucu Fillet in Clay Pot",
      h_sec5_d2_desc: "Dauphin of the Amazon baked slowly with jambu leaves.",
      h_sec5_d3_title: "Cupuaçu & Cacao Mousse",
      h_sec5_d3_desc: "Wild rainforest fruit tart with dark raw Amazon chocolate.",
      h_sec5_d4_title: "Pato no Tucupi (Duck Confit)",
      h_sec5_d4_desc: "Traditional Pará delicacy — slow-cooked duck in fermented tucupi broth.",
      h_sec5_d5_title: "Wild Amazonian Cacao Cremeux",
      h_sec5_d5_desc: "Rich dark forest cacao cream with river salt flakes and pipi leaf essence.",
      
      h_sec6_title: "FROM THE LAND",
      h_sec6_sub: "LOCAL INGREDIENTS",
      h_sec6_tag1: "BOTANY",
      h_sec6_tag2: "HARVEST",
      h_sec6_tag3: "APICULTURE",
      h_sec6_i1: "JAMBU & TUCOUPI",
      h_sec6_i1_desc: "Natural tingling forest herbs and fermented cassava nectar extracted using traditional methods.",
      h_sec6_i2: "WILD FRUITS",
      h_sec6_i2_desc: "Freshly harvested Açaí, Tucumã, Camu Camu, and Buriti packed with natural forest nutrients.",
      h_sec6_i3: "NATIVE WILD HONEY",
      h_sec6_i3_desc: "Pure honey gathered from stingless native bees deep inside the untouched primary jungle.",
      
      h_sec7_title: "WHAT IS INCLUDED",
      h_sec7_sub: "EXPEDITION DETAILS",
      h_sec7_col_inc: "INCLUDED",
      h_sec7_col_exc: "EXCLUDED",
      h_sec7_inc1_title: "9 Nights Luxury Accommodations",
      h_sec7_inc1_desc: "Private stays across our river lodges, floating camps, and jungle cabins.",
      h_sec7_inc2_title: "All Meals & Fine Gastronomy",
      h_sec7_inc2_desc: "Full board dining, wild forest delicacies, all day snacks, and local drinks.",
      h_sec7_inc3_title: "Internal Route Transfers",
      h_sec7_inc3_desc: "All wooden boat expeditions, scheduled hydroplanes, and local transits.",
      h_sec7_inc4_title: "Guided Treks & Biologist Escorts",
      h_sec7_inc4_desc: "Biologist-led rainforest hikes, canopy climbs, and native tracking.",
      h_sec7_inc5_title: "Rainforest & Expedition Gear",
      h_sec7_inc5_desc: "Rain coats, specialized explorer gear, and organic wellness care items.",
      h_sec7_inc6_title: "Medical Evacuation Insurance",
      h_sec7_inc6_desc: "Helicopter medical evacuation cover and local paramedic team escort.",
      h_sec7_inc7_title: "Expedition Photographer",
      h_sec7_inc7_desc: "Professional wildlife photographer accompanying the expedition.",
      h_sec7_inc8_title: "Nocturnal Wildlife Expeditions",
      h_sec7_inc8_desc: "Moonlit wildlife observation walks guided by expert native trackers.",
      h_sec7_exc1_title: "Airfare to Manaus",
      h_sec7_exc1_desc: "International and domestic flights to the host city.",
      h_sec7_exc2_title: "Premium Spirits & Rare Wines",
      h_sec7_exc2_desc: "Vintage reserve alcohol outside the standard lodge bar selection.",
      h_sec7_exc3_title: "Team Gratuities",
      h_sec7_exc3_desc: "Tips for native forest trackers, culinary staff, and boat crew.",
      h_sec7_exc4_title: "Personal Hike Clothing",
      h_sec7_exc4_desc: "Individual trekking boots, special layers, and personal items.",

      // Pricing
      pricing_title: "PRICING",
      pricing_sub: "10 DAYS · FULL IMMERSION",
      pricing_badge: "POPULAR",
      pricing_solo_label: "SOLO",
      pricing_solo_per: "per guest",
      pricing_duo_label: "DUO",
      pricing_duo_per: "for two guests",
      pricing_group_label: "GROUP",
      pricing_group_per: "per person (4+ guests)",
      pricing_f1: "10 nights in private havens",
      pricing_f2: "Full board — 3 meals a day",
      pricing_f3: "All route transfers included",
      pricing_f4: "Naturalist guide every day",
      pricing_f5: "Gear & organic medical kit",
      pricing_f6: "Insurance & medevac",
      pricing_f7: "Expedition photographer",
      pricing_f8: "Private villa with plunge pool",
      pricing_f9: "Seaplane flight over jungle",
      pricing_f10: "Group pricing priority",
      pricing_cta_book: "BOOK NOW",
      pricing_cta_group: "REQUEST DETAILS",
      pricing_note: "Prices exclude airfare to Manaus. Instalments and bespoke arrangements available — contact us.",

      h_sec8_title: "AFTER DARK",
      h_sec8_desc: "When night descends over the Amazon, the forest transforms. Gather around the open deck bonfire under a pristine canopy of stars, listening to the nocturnal hum of the ancient river.",
      
      h_sec9_title: "See you in the Haven",
      h_sec9_quote: "A sanctuary of wood, stone, and silent waters.",
      h_sec9_btn_journey: "OPEN THE JOURNEY",
      h_sec9_btn_book: "BOOK",
      
      // Havens (Stay)
      stay_tag: "THE HAVENS",
      stay_title: "THE HAVENS",
      stay_subtitle: "Spaces designed to dissolve the boundary between guest and forest.",
      stay_card1_title: "JUNGLE LODGE",
      stay_card1_desc: "Built entirely from fallen hardwood and local slate stone. Designed to offer absolute silence, natural forest ventilation, and elevated views over the wild blackwater lagoon.",
      stay_card2_title: "RIVER CAMP",
      stay_card2_desc: "Wake up directly on the moving waters of the Amazon. Minimalist canvas pavilions structured on floating docks, letting you hear the deep river rhythm with zero division.",
      stay_card3_title: "PRIVATE CABIN",
      stay_card3_desc: "Pure integration of natural stone, glass, and forest canopy. Absolute privacy, personal mineral water plunge pools, and an open-air observation deck high above the jungle.",
      stay_card_footer_left: "PRIVATE RESERVE",
      stay_card_footer_right: "VIEW DESIGN →",
      
      // Cuisine
      menu_tag: "BRAZILIAN GASTRONOMY",
      menu_title: "FOREST TO TABLE",
      menu_subtitle: "AMAZONIAN GASTRONOMY",
      menu_type_breakfast: "BREAKFAST / Café da Manhã",
      menu_type_lunch: "LUNCH / Almoço",
      menu_type_dinner: "DINNER / Jantar",
      menu_b1_name: "Tapioca com Queijo Coalho",
      menu_b1_desc: "Thin cassava starch crepes filled with golden-crusted coalho cheese and wild honey.",
      menu_b2_name: "Cuscuz Nordestino com Tucumã",
      menu_b2_desc: "Steamed cornmeal cake layered with butter and thin slices of native oily tucumã fruit.",
      menu_b3_name: "Pão de Queijo de Mandioca",
      menu_b3_desc: "Traditional warm cheese buns made with fermented tapioca starch and cured mountain cheese.",
      menu_b4_name: "Frutos do Quintal with Honey",
      menu_b4_desc: "Freshly harvested tropical cupuaçu, açaí, and graviola fruits with raw forest honey.",
      menu_b5_name: "Suco de Cacau Fresco",
      menu_b5_desc: "Raw organic cacao pulp juice, cold-pressed daily.",
      menu_l1_name: "Moqueca de Tambaqui",
      menu_l1_desc: "A slow-simmered fish stew in clay pots with rich coconut milk, dendê oil, and fresh coriander.",
      menu_l2_name: "Tambaqui na Brasa",
      menu_l2_desc: "Open-fire grilled ribs of tambaqui fish, served with a fresh tucupi dressing and roasted cassava flour.",
      menu_l3_name: "Pirarucu de Casaca",
      menu_l3_desc: "Layers of salted shredded pirarucu fish, sweet banana slices, tomatoes, and toasted cashew crumbs.",
      menu_l4_name: "Farofa de Uarini",
      menu_l4_desc: "Fluffy yellow Uarini cassava flour tossed with butter, onions, and crispy coriander stems.",
      menu_l5_name: "Tacacá Soup",
      menu_l5_desc: "Traditional hot and sour broth made from wild manioc root, jambu leaves, and dried shrimps.",
      menu_d1_name: "Filé de Pirarucu Grelhado",
      menu_d1_desc: "Pan-seared skin-on Pirarucu steak served over a smoky cream of pupunha (peach palm fruit).",
      menu_d2_name: "Pato no Tucupi",
      menu_d2_desc: "Slow-roasted duck breast simmered in yellow tucupi broth, seasoned with mouth-numbing jambu leaves.",
      menu_d3_name: "Bobó de Camarão",
      menu_d3_desc: "Plump ocean prawns in a velvety purée of cassava root, coconut milk, and dendê palm oil.",
      menu_d4_name: "Brigadeiro de Cacau Selvagem",
      menu_d4_desc: "Warm dark chocolate truffles made of wild Amazonian cacao, infused with local aged Cachaça.",
      menu_d5_name: "Bolo de Rolo com Sorvete",
      menu_d5_desc: "Micro-thin rolled cake layered with sweet guava paste, served with taperebá fruit ice cream.",
      menu_bar_title: "THE BAR / The Bar",
      menu_bar_items: "Caipirinha de Jambu &nbsp;·&nbsp; Cassava Lager &nbsp;·&nbsp; National Sparkling Wine &nbsp;·&nbsp; Botanical Cocktails &nbsp;·&nbsp; Guaraná Infusions",
      menu_cover_title: "GASTRONOMY",
      menu_cover_sub: "The culinary soul of the Amazon forest",
      menu_phil_title: "THE PHILOSOPHY",
      menu_phil_text1: "Every dish is a dialogue with the river and the forest. We gather ingredients from our own gardens and small local farmers along the Rio Negro.",
      menu_phil_text2: "Cooking with open fire, clay pots, and slow smoking preserves the primary flavors of the jungle. A luxury of absolute freshness.",
      menu_phil_sig: "Chef de Cuisine",
      menu_bar_intro: "Our bar mirrors the biodiversity of the valley. From tingling jambu cocktails that dance on the palate to slow infusions of raw Amazonian herbs.",
      bf_1_desc: "Traditional cachaça muddled with fresh lime, sugar, and jambu leaves that tingle the lips.",
      bf_2_desc: "Crisp, refreshing regional beer brewed using native sweet manioc starches.",
      bf_3_desc: "Slow-steeped hot and iced teas crafted from fresh lemongrass, mint, and guaraná seeds.",
      
      // Tasting Menu EN
      menu_type_tasting: "TASTING MENU / Menu de Degustação",
      menu_t1_name: "Tucupi Shot com Jambu",
      menu_t1_desc: "Warm shot of wild manioc root broth (tucupi) with tongue-tingling jambu leaves.",
      menu_t2_name: "Dados de Tapioca",
      menu_t2_desc: "Crispy tapioca starch cubes with coalho cheese and sweet pepper jelly.",
      menu_t3_name: "Ceviche de Tambaqui",
      menu_t3_desc: "Fresh river tambaqui marinated in wild camu-camu citrus juice with jungle onions.",
      menu_t4_name: "Tambaqui ao Mel",
      menu_t4_desc: "Grilled tambaqui ribs glazed with wild native stingless bee honey and urucum spice.",
      menu_t5_name: "Pato no Tucupi Defumado",
      menu_t5_desc: "Smoked duck breast simmered in concentrated yellow tucupi broth and forest herbs.",
      menu_t6_name: "Sorbet de Cupuaçu",
      menu_t6_desc: "Refreshing tart cupuaçu fruit sorbet topped with toasted Brazil nut crumble.",
      menu_t7_name: "Infusão de Cacau Selvagem",
      menu_t7_desc: "Hot infusion of wild Amazonian cacao husks blended with fresh forest lemongrass.",

      // Wine Cellar EN
      menu_type_wine: "WINE CELLAR / Carta de Vinhos",
      menu_w1_name: "Cachaça em Amburana",
      menu_w1_desc: "Premium artisanal cachaça aged in native Amburana wood casks, yielding sweet vanilla notes.",
      menu_w2_name: "Serra Gaúcha Chardonnay",
      menu_w2_desc: "Crisp, mineral-forward Brazilian white wine sourced from the high-altitude Serra Gaúcha.",
      menu_w3_name: "Vale dos Vinhedos Merlot",
      menu_w3_desc: "Deep, full-bodied dry red wine carrying rich aromas of dark plum and forest spices.",
      menu_w4_name: "Amazonian Gin & Tonic",
      menu_w4_desc: "Craft gin distilled with açaí, guaraná, and Brazil nuts, served with organic tonic.",

      // Desserts EN
      menu_type_dessert: "DESSERTS / Sobremesas",
      menu_de1_name: "Bolo de Rolo Tradicional",
      menu_de1_desc: "Authentic paper-thin rolled sponge cake layered with sweet red guava jam.",
      menu_de2_name: "Mousse de Graviola",
      menu_de2_desc: "Light, velvety soursop fruit mousse drizzled with a wild forest berry reduction.",
      menu_de3_name: "Tarta de Castanha-do-Pará",
      menu_de3_desc: "Crisp pastry tart shell packed with native Brazil nuts and smooth cupuaçu curd.",
      menu_de4_name: "Sorvete de Açaí do Bosque",
      menu_de4_desc: "Authentic unsweetened jungle açaí berry sorbet topped with crunchy tapioca pearls.",
      menu_de5_name: "Pudim com Licor de Cupuaçu",
      menu_de5_desc: "Traditional rich milk pudding infused with a touch of cupuaçu liqueur.",

      tab_phil: "PHILOSOPHY",
      tab_day: "DAY MENU",
      tab_tasting: "TASTING",
      tab_wine: "WINE CELLAR",
      tab_desserts: "DESSERTS & BAR",
      
      // Rates
      price_tag: "RATES",
      price_title: "THE EXPEDITION",
      price_subtitle: "10 DAYS / 9 NIGHTS",
      price_amount: "FROM $14,500 <span class=\"per-person\">/ PERSON</span>",
      price_included_title: "INCLUDED",
      price_inc1: "<span class=\"check-icon\">✓</span> Luxury accommodation",
      price_inc2: "<span class=\"check-icon\">✓</span> All gourmet meals & curated beverages",
      price_inc3: "<span class=\"check-icon\">✓</span> Private airport transfers",
      price_inc4: "<span class=\"check-icon\">✓</span> Dedicated river transportation",
      price_inc5: "<span class=\"check-icon\">✓</span> Expert local & academic guides",
      price_inc6: "<span class=\"check-icon\">✓</span> Jungle expeditions & night tracking",
      price_inc7: "<span class=\"check-icon\">✓</span> All equipment, kayaks, and safety gear",
      price_inc8: "<span class=\"check-icon\">✓</span> Protected reserve access fees",
      price_excluded_title: "NOT INCLUDED",
      price_exc1: "<span class=\"dash-icon\">—</span> International flights to Manaus",
      price_exc2: "<span class=\"dash-icon\">—</span> Personal expedition clothing",
      price_exc3: "<span class=\"dash-icon\">—</span> Travel & evacuation insurance (required)",
      price_exc4: "<span class=\"dash-icon\">—</span> Premium vintage spirits & cellar requests",
      price_limit_title: "LIMITED AVAILABILITY",
      price_limit_desc: "To preserve the silence of the forest and ensure an intimate journey, we accommodate a maximum of 8 guests per expedition. Group size is strictly non-negotiable.",
      
      // Manifesto Unified Screens
      m_screen1_tag: "THE MANIFESTO",
      m_screen1_title: "There are places<br>that need no explanation.<br><span class=\"gold-italic\">They must be felt.</span>",
      m_screen2_tag: "PHILOSOPHY",
      m_screen2_title: "We believe in luxury that requires no demonstration.<br><br>In spaces where architecture does not compete with nature.<br><br><span class=\"gold-italic\">In silence that becomes more precious than any sound.</span>",
      m_screen3_tag: "THE ESSENCE",
      m_screen3_title: "A Haven is more than a place.<br><br><span class=\"gold-italic\">It is an opportunity to step out of the daily rhythm and return to what matters.</span>",
      m_screen3_words: "QUIETER · CLOSER · REAL",
      m_screen3_cta: "OPEN THE HAVEN",
      
      // Form / Booking (Exact 3 Fields: Name, Phone, Guests by Price)
      book_tag: "RESERVATION",
      book_title: "BOOK EXPEDITION",
      book_subtitle: "Enter your details for reservation. Our personal concierge will reach out within 15 minutes.",
      form_label_name: "NAME",
      form_placeholder_name: "Your name",
      form_label_contact: "PHONE NUMBER",
      form_placeholder_contact: "+1 (800) 000-0000",
      form_label_guests: "NUMBER OF GUESTS (BY PRICING)",
      form_opt_guests_default: "Select number of guests",
      form_opt_guest1: "1 Guest — $14,500 / guest (Solo)",
      form_opt_guest2: "2 Guests — $12,800 / guest (Duo)",
      form_opt_guest3: "4+ Guests — $10,500 / guest (Group)",
      form_submit: "BOOK NOW <span class=\"arrow\">→</span>",
      success_title: "RESERVATION RECEIVED",
      success_desc: "Your personal MAIRA expedition concierge will contact you within 15 minutes.",
      success_reset: "SUBMIT ANOTHER REQUEST",
      
      // Footer
      footer_tagline: "10 Days / Deep Green Expedition",
      footer_info1_title: "ENQUIRIES",
      footer_info2_title: "COORDINATES",
      footer_info2_p1: "Base Camp: 03°08'43\" S / 060°01'15\" W",
      footer_info2_p2: "Manaus, Amazonas, Brasil",
      footer_copyright: "&copy; 2026 MAIRA PRIVATE RETREATS. ALL RIGHTS RESERVED. PRIVATE CLUBS ASSOCIATION.",
      footer_legal1: "TERMS of SERVICE",
      footer_legal2: "PRIVACY POLICY",
      footer_nav_title: "EXPLORE",
      footer_nav_book: "BOOKING",
    }
  };

  // State
  let currentLang = localStorage.getItem('maira_lang') || 'ru';

  const updateLanguage = (lang) => {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[lang] && translations[lang][key]) {
        const transValue = translations[lang][key];
        
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = transValue;
        } 
        else if (el.tagName === 'OPTION') {
          el.textContent = transValue;
        } 
        else {
          el.innerHTML = transValue;
        }
      }
    });

    // Update custom Leaflet marker labels
    document.querySelectorAll('.custom-marker-label').forEach(el => {
      const id = el.id.replace('marker-label-', '');
      if (translations[lang] && translations[lang]["map_d" + id]) {
        el.textContent = translations[lang]["map_d" + id];
      }
    });

    // Update document title
    document.title = translations[lang].site_title;

    // Update active class on lang switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    localStorage.setItem('maira_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    currentLang = lang;
  };

  // --- Floating Timeline Scroll Progress ---
  const routeSection = document.getElementById('route');
  if (routeSection) {
    const progressLine = document.querySelector('.timeline-progress');
    const updateTimelineProgress = () => {
      const rect = routeSection.getBoundingClientRect();
      const start = window.pageYOffset + rect.top;
      const totalHeight = rect.height;
      const scrollPosition = window.pageYOffset - start;
      const windowHeight = window.innerHeight;
      const maxScroll = totalHeight - windowHeight;
      const scrollPercent = Math.max(0, Math.min(100, (scrollPosition / maxScroll) * 100));
      if (progressLine) {
        progressLine.style.height = `${scrollPercent}%`;
      }
    };
    
    window.addEventListener('scroll', updateTimelineProgress);
    window.addEventListener('resize', updateTimelineProgress);
    updateTimelineProgress();
  }

  // --- Observe route blocks for active dot indicators ---
  const routeBlocks = document.querySelectorAll('.route-day');
  if (routeBlocks.length > 0) {
    const timelineObserverOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    };

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute('id');
          if (targetId) {
            document.querySelectorAll('.timeline-dot').forEach(dot => {
              if (dot.getAttribute('data-target') === targetId) {
                dot.classList.add('active');
              } else {
                dot.classList.remove('active');
              }
            });
          }
        }
      });
    }, timelineObserverOptions);

    routeBlocks.forEach(block => {
      timelineObserver.observe(block);
    });
  }

  // Bind language switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetLang = e.currentTarget.getAttribute('data-lang');
      updateLanguage(targetLang);
    });
  });

  // Initialize language
  updateLanguage(currentLang);



  // Smooth video fade-in to prevent layout flashing
  const heroVideo = document.querySelector('.journey-hero-video');
  if (heroVideo) {
    if (heroVideo.readyState >= 3) {
      heroVideo.classList.add('video-loaded');
    } else {
      heroVideo.addEventListener('playing', () => {
        heroVideo.classList.add('video-loaded');
      });
      heroVideo.addEventListener('loadeddata', () => {
        heroVideo.classList.add('video-loaded');
      });
    }
  }


  // Finale fade-in on scroll
  const finaleInner = document.querySelector('.finale-inner');
  if (finaleInner) {
    const finaleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          finaleInner.classList.add('visible');
          finaleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    finaleObserver.observe(finaleInner);
  }
  // Interactive 3D Menu Book Navigation Logic
  const leaves = document.querySelectorAll('.book-leaf');
  const tabs = document.querySelectorAll('.tab-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentLeaf = 0;

  if (leaves.length > 0) {
    const updateBook = (index) => {
      currentLeaf = index;
      
      leaves.forEach((leaf, idx) => {
        leaf.classList.toggle('active', idx === index);
        if (idx < index) {
          // Flipped to the left (rotateY is -180deg)
          leaf.style.transform = 'rotateY(-180deg)';
          leaf.style.zIndex = idx + 1;
        } else if (idx === index) {
          // The leaf currently active/turning on top
          leaf.style.transform = 'rotateY(0deg)';
          leaf.style.zIndex = 10;
        } else {
          // Lying flat on the right side
          leaf.style.transform = 'rotateY(0deg)';
          leaf.style.zIndex = leaves.length - idx;
        }
      });

      // Highlight the correct tab based on current leaf
      tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
      });
      
      // Update opacity/accessibility of prev/next buttons
      if (prevBtn) {
        if (index === 0) {
          prevBtn.style.opacity = '0.3';
          prevBtn.style.pointerEvents = 'none';
        } else {
          prevBtn.style.opacity = '1';
          prevBtn.style.pointerEvents = 'auto';
        }
      }
      
      if (nextBtn) {
        if (index === leaves.length - 1) {
          nextBtn.style.opacity = '0.3';
          nextBtn.style.pointerEvents = 'none';
        } else {
          nextBtn.style.opacity = '1';
          nextBtn.style.pointerEvents = 'auto';
        }
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentLeaf > 0) {
          updateBook(currentLeaf - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentLeaf < leaves.length - 1) {
          updateBook(currentLeaf + 1);
        }
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = parseInt(tab.getAttribute('data-target'));
        updateBook(target);
      });
    });

    // Initialize
    updateBook(0);
  }

  // --- New Cinematic Homepage Scroll Interactions ---

  // 1. Navbar transparent transition on scroll
  const navBar = document.querySelector('.nav-bar');
  if (navBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navBar.classList.add('scrolled');
      } else {
        navBar.classList.remove('scrolled');
      }
    });
    // Trigger initially in case of page reload with scroll
    if (window.scrollY > 50) {
      navBar.classList.add('scrolled');
    }
  }

  // 1.5. Hero cinematic typography fade out on scroll
  const cinematicHero = document.querySelector('.home-hero-cinematic');
  const heroCenter = document.querySelector('.hero-center-group');
  const heroTop = document.querySelector('.hero-top-label');
  const heroBottom = document.querySelector('.hero-bottom-indicator');
  const heroCounter = document.querySelector('.hero-right-counter');

  if (cinematicHero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      if (scrollY <= heroHeight) {
        const ratio = scrollY / heroHeight;
        
        // Fade out typography
        const opacity = Math.max(0, 1 - ratio * 1.5);
        if (heroCenter) heroCenter.style.opacity = opacity;
        if (heroTop) heroTop.style.opacity = opacity;
        if (heroBottom) heroBottom.style.opacity = opacity;
        if (heroCounter) heroCounter.style.opacity = opacity;
      }
    });
  }

  // 2. Count-up Stats Animation (Section 03)
  const expeditionSection = document.getElementById('sec-expedition');
  const statNumbers = document.querySelectorAll('.stat-num');
  if (expeditionSection && statNumbers.length > 0) {
    let animated = false;
    
    const countUp = (el) => {
      const target = parseInt(el.getAttribute('data-count-to'));
      const duration = 1500; // ms
      const startTime = performance.now();
      
      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.floor(easeProgress * target);
        
        if (target < 10) {
          el.textContent = '0' + currentCount;
        } else {
          el.textContent = currentCount;
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          if (target < 10) {
            el.textContent = '0' + target;
          } else {
            el.textContent = target;
          }
        }
      };
      
      requestAnimationFrame(updateCount);
    };

    const expObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach(num => countUp(num));
          expObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    expObserver.observe(expeditionSection);
  }

  // 3. Section 02/07 reveal transitions (progressive row fades)
  const revealSections = document.querySelectorAll('.scroll-reveal-sec, .home-manifesto-reveal');
  if (revealSections.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    revealSections.forEach(sec => revealObserver.observe(sec));
  }

  // 4. Section 05 Stays Scroll Sequence (hover & interactive trigger)
  const staysRevealCards = document.querySelectorAll('.haven-reveal-card');
  if (staysRevealCards.length > 0) {
    const handleRevealHover = (cardIndex) => {
      staysRevealCards.forEach((card, i) => {
        if (i + 1 === cardIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    };

    staysRevealCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        handleRevealHover(idx + 1);
      });
    });
  }

  // =========================================================================
  // iPhone Notification Stack / Coverflow Scroll Effect for Journey Cards
  // =========================================================================
  const iphoneCards = document.querySelectorAll('.iphone-card');
  if (iphoneCards.length > 0) {
    const updateIphoneStack = () => {
      const viewportHeight = window.innerHeight;
      const centerY = viewportHeight / 2;

      iphoneCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distanceFromCenter = cardCenter - centerY;
        const normalizedDistance = Math.min(Math.abs(distanceFromCenter) / (viewportHeight * 0.55), 1);

        // Scale: 1.0 at center -> 0.90 at edges
        const scale = 1.0 - (normalizedDistance * 0.10);
        
        // Opacity: 1.0 at center -> 0.40 at edges
        const opacity = Math.max(0.35, 1.0 - (normalizedDistance * 0.65));

        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.filter = 'none';
        card.style.opacity = opacity.toFixed(2);

        if (normalizedDistance < 0.22) {
          card.classList.add('active-center');
        } else {
          card.classList.remove('active-center');
        }
      });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateIphoneStack();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateIphoneStack();
    window.addEventListener('resize', updateIphoneStack);
  }
});

