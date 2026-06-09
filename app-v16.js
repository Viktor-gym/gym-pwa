// GymTracker Pro — local-first PWA (no backend)
// Single-file app.js — robust init + no DOM null crashes + full features
// Features:
// - Exercises: list, filters, search, add new exercise modal, favorites, add-to-workout
// - Workout: title, add exercise modal picker, add/remove sets, save workout, PR updates
// - Home: week KPIs, recent workouts list (open detail modal), favorites strip
// - Stats: range chips (week/month/all), volume bars, muscle group pie, per-exercise detail + charts + history
// - Records: PR leaderboard + category filter
// - Settings: language, rest seconds, export/import JSON, reset

document.addEventListener("DOMContentLoaded", () => {
  const $ = (q) => document.querySelector(q);
  const $$ = (q) => Array.from(document.querySelectorAll(q));

  const STORAGE_KEY = "gymPwaData_v3";

  // ---------- i18n ----------
  const i18n = {
    ua: {
      home: "Головна",
      workout: "Тренування",
      exercises: "Вправи",
      stats: "Статистика",
      records: "Рекорди",
      body: "Тіло",
      settings: "Налаштування",
      startWorkout: "Почати тренування",
      addExerciseToWorkout: "➕ Додати вправу",
      addSet: "➕ Додати підхід",
      saveWorkout: "💾 Зберегти тренування",
      clearWorkout: "🗑 Очистити тренування",
      chooseCategory: "Фільтр",
      search: "Пошук вправ…",
      thisWeek: "Цей тиждень",
      thisMonth: "Цей місяць",
      allTime: "Все",
      trainings: "тренувань",
      activeDays: "активних днів",
      sets: "підходів",
      volume: "обʼєм",
      lastWorkouts: "Останні тренування",
      favorites: "Улюблені вправи",
      open: "Відкрити",
      close: "Назад",
      pr: "PR",
      noData: "Поки немає даних.",
      pickExerciseFirst: "Додай хоча б одну вправу в тренування.",
      saveOk: "Збережено!",
      lang: "Мова",
      defaultRest: "Відпочинок (сек)",
      restTimer: "Таймер відпочинку",
      timerReady: "Готовий до наступного підходу",
      timerStart: "Старт",
      timerPause: "Пауза",
      timerReset: "Скинути",
      importOk: "Дані успішно імпортовано.",
      importSummary: "Тренування, вправи, рекорди та заміри відновлено.",
      save: "Зберегти",
      export: "Експорт JSON",
      import: "Імпорт JSON",
      confirmReset: "Точно очистити всі дані?",
      workoutTitle: "Назва тренування",
      deleteWorkout: "Видалити тренування",
      confirmDeleteWorkout: "Точно видалити це тренування?",
      last: "Останнє",
      confirmClearRecords: "Очистити всі рекорди?",
      addMeasure: "Додати вимір",
      bodyDate: "Дата",
      bodyWeight: "Вага (кг)",
      bodyForearm: "Передпліччя (см)",
      bodyChest: "Груди (см)",
      bodyWaist: "Талія (см)",
      bodyLegs: "Ноги (см)",
      bodyProgress: "Прогрес тіла",
      bodyHistory: "Історія вимірів",
      deleteMeasure: "Видалити",
      confirmDeleteMeasure: "Видалити цей вимір?",
      addExercise: "Додати вправу",
      pickExercise: "Вибери вправу для цього тренування",
      newExercise: "Нова вправа",
      create: "Створити",
      created: "Створено!",
      ok: "OK",
      maxWeight: "Макс. вага",
      exercisesCount: "Вправ",
      totalTrainings: "всього тренувань",
      totalSets: "всього підходів",
      totalVolume: "загальний обʼєм",
      calories: "Спалені калорії",
      caloriesApprox: "приблизна оцінка",
      goals: "Мої цілі",
      addGoal: "Додати ціль",
      nextWorkout: "Рекомендації на наступне тренування",
      volumeProgress: "Прогрес обʼєму",
      muscleSplit: "Розподіл навантаження",
      muscleSplitHint: "Частка обʼєму по групах",
      trainedOnly: "Вправи (тільки з заняттями)",
      weightProgress: "Прогрес ваги",
      history: "Історія",
      reset: "🗑 Reset",
      importFail: "Не вдалося імпортувати файл.",
      needSet: "Додай хоча б один підхід з вагою і повторами.",
      tapToOpen: "Натисни на тренування, щоб відкрити деталі або видалити",
      times: "раз(ів)",
      month: "Місяць",
      week: "Тиждень",
      all: "Все",
      volumeBarsHint: "Показано останні тренування — без масштабування",
      addToWorkout: "＋",
      deleteExercise: "Видалити вправу",
      confirmDeleteExercise: "Точно видалити цю вправу?",
      exerciseUsedInWorkouts: "Ця вправа вже є в тренуваннях. Спочатку видали її з історії або зміни логіку видалення.",  
    },
    en: {
      home: "Home",
      workout: "Workout",
      exercises: "Exercises",
      stats: "Stats",
      records: "Records",
      body: "Body",
      settings: "Settings",
      startWorkout: "Start workout",
      addExerciseToWorkout: "➕ Add exercise",
      addSet: "➕ Add set",
      saveWorkout: "💾 Save workout",
      clearWorkout: "🗑 Clear workout",
      chooseCategory: "Filter",
      search: "Search exercises…",
      thisWeek: "This week",
      thisMonth: "This month",
      allTime: "All",
      trainings: "trainings",
      activeDays: "active days",
      sets: "sets",
      volume: "volume",
      lastWorkouts: "Recent workouts",
      favorites: "Favorite exercises",
      open: "Open",
      close: "Back",
      pr: "PR",
      noData: "No data yet.",
      pickExerciseFirst: "Add at least one exercise to the workout.",
      saveOk: "Saved!",
      lang: "Language",
      defaultRest: "Rest (sec)",
      restTimer: "Rest timer",
      timerReady: "Ready for the next set",
      timerStart: "Start",
      timerPause: "Pause",
      timerReset: "Reset",
      importOk: "Data imported successfully.",
      importSummary: "Workouts, exercises, records and measurements restored.",
      save: "Save",
      export: "Export JSON",
      import: "Import JSON",
      confirmReset: "Clear all data?",
      workoutTitle: "Workout title",
      deleteWorkout: "Delete workout",
      confirmDeleteWorkout: "Delete this workout?",
      last: "Last",
      confirmClearRecords: "Clear all records?",
      addMeasure: "Add measurement",
      bodyDate: "Date",
      bodyWeight: "Weight (kg)",
      bodyForearm: "Forearm (cm)",
      bodyChest: "Chest (cm)",
      bodyWaist: "Waist (cm)",
      bodyLegs: "Legs (cm)",
      bodyProgress: "Body progress",
      bodyHistory: "Measurements history",
      deleteMeasure: "Delete",
      confirmDeleteMeasure: "Delete this measurement?",
      addExercise: "Add exercise",
      pickExercise: "Pick an exercise for this workout",
      newExercise: "New exercise",
      create: "Create",
      created: "Created!",
      ok: "OK",
      maxWeight: "Max weight",
      exercisesCount: "Exercises",
      totalTrainings: "total trainings",
      totalSets: "total sets",
      totalVolume: "total volume",
      calories: "Calories burned",
      caloriesApprox: "approximate estimate",
      goals: "My goals",
      addGoal: "Add goal",
      nextWorkout: "Next workout recommendations",
      volumeProgress: "Volume progress",
      muscleSplit: "Muscle split",
      muscleSplitHint: "Share of volume by muscle group",
      trainedOnly: "Exercises (trained only)",
      weightProgress: "Weight progress",
      history: "History",
      reset: "🗑 Reset",
      importFail: "Import failed.",
      needSet: "Add at least one set with weight and reps.",
      tapToOpen: "Tap a workout to open details or delete",
      times: "times",
      month: "Month",
      week: "Week",
      all: "All",
      volumeBarsHint: "Latest workouts shown clearly without zooming",
      addToWorkout: "＋",
      deleteExercise: "Delete exercise",
      confirmDeleteExercise: "Delete this exercise?",
      exerciseUsedInWorkouts: "This exercise is already used in workouts. Delete it from history first or change delete logic.",
    }
  };

  // ---------- categories ----------
  const CATEGORIES = [
    { id:"all", ua:"Все", en:"All", tone:"purple" },
    { id:"back", ua:"Спина", en:"Back", tone:"teal" },
    { id:"legs", ua:"Ноги", en:"Legs", tone:"pink" },
    { id:"chest", ua:"Груди", en:"Chest", tone:"gold" },
    { id:"shoulders", ua:"Плечі", en:"Shoulders", tone:"purple" },
    { id:"arms", ua:"Руки", en:"Arms", tone:"teal" },
    { id:"core", ua:"Прес", en:"Core", tone:"pink" },
  ];

  // ---------- helpers ----------
  function uid(){ return Math.random().toString(16).slice(2) + Date.now().toString(16); }

  function resizeCanvasToDisplaySize(canvas){
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h){
      canvas.width = w;
      canvas.height = h;
    }
  }

  function parseNum(v){
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    if (typeof v !== "string") return 0;
    const x = Number(v.replace(",", "."));
    return Number.isFinite(x) ? x : 0;
  }

  function fmtNum(v){
    const x = parseNum(v);
    const s = (Math.round(x * 100) / 100).toFixed(2).replace(/\.?0+$/,"");
    return s === "" ? "0" : s;
  }

  function fmtVol(v){
    const x = parseNum(v);
    if (x >= 1_000_000) return `${fmtNum(x/1_000_000)}M`;
    if (x >= 1_000) return `${fmtNum(x/1_000)}k`;
    return `${Math.round(x)}`;
  }

  function fmtDate(iso){
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2,"0");
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}`;
  }

  function startOfWeek(d){
    const x = new Date(d);
    const day = (x.getDay()+6)%7; // Mon=0
    x.setHours(0,0,0,0);
    x.setDate(x.getDate()-day);
    return x;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (m)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
  }
  function inferTrackingType(ex){
    const name=`${ex?.name_ua||ex?.name||""} ${ex?.name_en||""}`.toLowerCase();
    if(/доріж|біг|ходьб|treadmill|running|walking/.test(name)) return "distance";
    if(/планк|plank|утриман|hold/.test(name)) return "time";
    if(/підтяг|віджим|pull.?up|push.?up/.test(name)) return "reps";
    return "strength";
  }

  // ---------- data model ----------
  function migrate(old){
    const base = {
      lang: "ua",
      settings: { defaultRestSec: 90 },
      exercises: [],
      workouts: [],     // {id, date, title, items:[{exerciseId, sets:[{reps,weight}]}]}
      prs: {},          // exerciseId -> {weight, reps, date}
      favorites: [],
      body: [],         // {id, date, weight, forearm, chest, waist, legs}
      goals: [],
      recommendations: [],
      ui: { exCat:"all", exQ:"", statsRange:"week", homeRange:"week", recordsCat:"all" }
    };
    if (!old) return base;

    const s = { ...base, ...old };

    if (Array.isArray(s.logs) && (!Array.isArray(old.workouts) || old.workouts.length === 0)){
      s.workouts = s.logs.map(l => ({
        id: l.workoutId || uid(),
        date: l.date,
        title: l.title || (s.lang==="en" ? `Workout ${fmtDate(l.date)}` : `Тренування ${fmtDate(l.date)}`),
        items: Array.isArray(l.items)
          ? l.items
          : [{ exerciseId: l.exerciseId, sets: l.sets || [] }]
      }));
      delete s.logs;
    }

    if (!Array.isArray(s.exercises)) s.exercises = [];
    if (!Array.isArray(s.workouts)) s.workouts = [];
    if (!Array.isArray(s.favorites)) s.favorites = [];
    if (!Array.isArray(s.body)) s.body = [];
    if (!Array.isArray(s.goals)) s.goals = [];
    if (!Array.isArray(s.recommendations)) s.recommendations = [];
    if (!s.prs) s.prs = {};
    if (!s.settings) s.settings = { defaultRestSec: 90 };
    if (!s.ui) s.ui = { exCat:"all", exQ:"", statsRange:"week", homeRange:"week", recordsCat:"all" };
    if (!s.lang) s.lang = "ua";

    s.settings = { ...base.settings, ...(s.settings || {}) };
    s.ui = { ...base.ui, ...(s.ui || {}) };
    s.lang = s.lang === "en" ? "en" : "ua";

    s.exercises = s.exercises
      .filter(Boolean)
      .map(ex => ({
        ...ex,
        id: String(ex.id || uid()),
        name_ua: String(ex.name_ua || ex.name || ex.name_en || "Вправа"),
        name_en: String(ex.name_en || ex.name || ex.name_ua || "Exercise"),
        category: String(ex.category || "other"),
        trackingType: ["strength","reps","time","distance"].includes(ex.trackingType) ? ex.trackingType : inferTrackingType(ex)
      }));

    s.workouts = s.workouts
      .filter(Boolean)
      .map(w => {
        const date = w.date || w.createdAt || new Date().toISOString();
        const rawItems = Array.isArray(w.items)
          ? w.items
          : (w.exerciseId ? [{ exerciseId:w.exerciseId, sets:w.sets || [] }] : []);
        return {
          ...w,
          id: String(w.id || w.workoutId || uid()),
          date,
          title: w.title || (s.lang==="en" ? `Workout ${fmtDate(date)}` : `Тренування ${fmtDate(date)}`),
          items: rawItems.filter(Boolean).map(it => ({
            exerciseId: String(it.exerciseId || ""),
            sets: (Array.isArray(it.sets) ? it.sets : []).map(set => ({
              weight: parseNum(set?.weight),
              reps: parseNum(set?.reps),
              duration: parseNum(set?.duration),
              distance: parseNum(set?.distance)
            }))
          })).filter(it => it.exerciseId)
        };
      });

    s.body = s.body.filter(Boolean).map(m => ({
      ...m,
      id: String(m.id || uid()),
      date: m.date || new Date().toISOString(),
      createdAt: Number(m.createdAt || 0),
      weight: parseNum(m.weight),
      forearm: parseNum(m.forearm),
      chest: parseNum(m.chest),
      waist: parseNum(m.waist),
      legs: parseNum(m.legs)
    }));

    s.favorites = [...new Set(s.favorites.map(String))];
    s.goals = s.goals.filter(Boolean).map(g=>({
      ...g,
      id:String(g.id || uid()),
      type:g.type === "exercise" ? "exercise" : "body",
      target:parseNum(g.target),
      start:parseNum(g.start),
      createdAt:Number(g.createdAt || Date.now())
    })).filter(g=>g.target>0);

    return s;
  }

  function load(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try{ return JSON.parse(raw); } catch { return null; }
  }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  // ---------- default exercises ----------
  const DEFAULT_EXERCISES = [
    { id: uid(), name_ua:"Жим штанги лежачи", name_en:"Bench Press", category:"chest" },
    { id: uid(), name_ua:"Жим гантелей лежачи", name_en:"DB Bench Press", category:"chest" },
    { id: uid(), name_ua:"Жим під кутом", name_en:"Incline Press", category:"chest" },
    { id: uid(), name_ua:"Кросовер", name_en:"Cable Fly", category:"chest" },

    { id: uid(), name_ua:"Підтягування", name_en:"Pull-ups", category:"back", trackingType:"reps" },
    { id: uid(), name_ua:"Тяга верхнього блоку", name_en:"Lat Pulldown", category:"back" },
    { id: uid(), name_ua:"Тяга штанги в нахилі", name_en:"Barbell Row", category:"back" },
    { id: uid(), name_ua:"Тяга нижнього блоку", name_en:"Seated Cable Row", category:"back" },
    { id: uid(), name_ua:"Гіперекстензія", name_en:"Hyperextension", category:"back" },

    { id: uid(), name_ua:"Присідання зі штангою", name_en:"Barbell Squat", category:"legs" },
    { id: uid(), name_ua:"Жим ногами", name_en:"Leg Press", category:"legs" },
    { id: uid(), name_ua:"Румунська тяга", name_en:"Romanian Deadlift", category:"legs" },
    { id: uid(), name_ua:"Згинання ніг лежачи", name_en:"Leg Curl", category:"legs" },
    { id: uid(), name_ua:"Ягодичний міст", name_en:"Hip Thrust", category:"legs" },

    { id: uid(), name_ua:"Жим над головою", name_en:"Overhead Press", category:"shoulders" },
    { id: uid(), name_ua:"Розведення в сторони", name_en:"Lateral Raise", category:"shoulders" },
    { id: uid(), name_ua:"Шраги", name_en:"Shrugs", category:"shoulders" },

    { id: uid(), name_ua:"Згинання на біцепс (гантелі)", name_en:"DB Curl", category:"arms" },
    { id: uid(), name_ua:"Французький жим", name_en:"Skull Crushers", category:"arms" },
    { id: uid(), name_ua:"Розгинання на тріцепс (канат)", name_en:"Rope Pushdown", category:"arms" },

    { id: uid(), name_ua:"Планка", name_en:"Plank", category:"core", trackingType:"time" },
    { id: uid(), name_ua:"Підйом ніг у висі", name_en:"Hanging Leg Raise", category:"core" },
  ];

  // ---------- state ----------
  let state = migrate(load());
  if (!state.exercises.length) state.exercises = DEFAULT_EXERCISES;

  function t(key){ return i18n[state.lang]?.[key] || key; }
  function catName(id){
    const c = CATEGORIES.find(x=>x.id===id);
    return state.lang==="ua" ? (c?.ua||id) : (c?.en||id);
  }
  function catTone(id){
    const c = CATEGORIES.find(x=>x.id===id);
    return c?.tone || "purple";
  }
  function toneWrapClass(tone){
    if (tone==="teal") return "teal";
    if (tone==="pink") return "pink";
    if (tone==="gold") return "gold";
    return "";
  }
  function exName(ex){ return state.lang==="ua" ? ex.name_ua : ex.name_en; }
  function isFav(id){ return state.favorites.includes(id); }
  function toggleFav(id){
    if (isFav(id)) state.favorites = state.favorites.filter(x=>x!==id);
    else state.favorites.unshift(id);
    save();
  }

  function deleteExerciseById(id){
    if (!id) return;

    const usedInWorkouts = (state.workouts || []).some(w =>
      (w.items || []).some(it => it.exerciseId === id)
    );

    if (usedInWorkouts){
      alert(t("exerciseUsedInWorkouts"));
      return;
    }

    if (!confirm(t("confirmDeleteExercise"))) return;

    state.exercises = (state.exercises || []).filter(ex => ex.id !== id);
    state.favorites = (state.favorites || []).filter(favId => favId !== id);

    if (state.prs && state.prs[id]) {
      const copy = { ...state.prs };
      delete copy[id];
      state.prs = copy;
    }

    save();
    renderExList();
  }

  // ---------- icons ----------
  function iconSvg(kind){
    const stroke = "rgba(229,231,235,.92)";
    if (kind==="bench") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 16h16"/>
        <path d="M6 16v-3c0-1 .8-1.8 1.8-1.8h8.4c1 0 1.8.8 1.8 1.8v3"/>
        <path d="M8 10l2-2h4l2 2"/>
        <path d="M7 20v-4M17 20v-4"/>
      </svg>`;
    if (kind==="squat") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="6" r="2"/>
        <path d="M7 21v-5c0-1.2 1-2.2 2.2-2.2h5.6C16 13.8 17 14.8 17 16v5"/>
        <path d="M9 14l-2-2M15 14l2-2"/>
        <path d="M5 12h4M15 12h4"/>
      </svg>`;
    if (kind==="pullup") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 5h16"/>
        <path d="M9 8c0-1.7 1.3-3 3-3s3 1.3 3 3"/>
        <path d="M12 8v4"/>
        <path d="M10 12l2 2 2-2"/>
        <path d="M8 21v-5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v5"/>
      </svg>`;
    if (kind==="deadlift") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 16h3v-4H3v4zm18 0h-3v-4h3v4z"/>
        <path d="M6 14h12"/>
        <circle cx="12" cy="6" r="2"/>
        <path d="M12 8v4"/>
        <path d="M9 12l3 3 3-3"/>
        <path d="M10 21v-5M14 21v-5"/>
      </svg>`;
    if (kind==="run") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="15" cy="5.5" r="2"/>
        <path d="M10 21l2-5-2-3 3-2 2 2h3"/>
        <path d="M7 13l3 3"/>
        <path d="M5 21h4"/>
      </svg>`;
    if (kind==="incline") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 18h14M7 18l6-9 4 3M7 21v-3M18 21v-3"/>
        <circle cx="15.5" cy="8" r="1.7"/><path d="M10 7h10M9 5v4M21 5v4"/>
      </svg>`;
    if (kind==="fly") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="5" r="2"/><path d="M12 7v8M12 10L5 8M12 10l7-2M5 6v4M19 6v4M9 21l3-6 3 6"/>
      </svg>`;
    if (kind==="row") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="5" r="2"/><path d="M9 7l3 5 5 2M12 12l-4 3M8 15l-2 6M11 14l3 7M16 11h5M18 9v4"/>
      </svg>`;
    if (kind==="pulldown") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16M6 4v3M18 4v3M6 7h12"/><circle cx="12" cy="10" r="2"/><path d="M12 12v5M12 13L7 9M12 13l5-4M8 21v-4h8v4"/>
      </svg>`;
    if (kind==="legpress") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 19h6l3-5M5 19V9M3 9h5"/><circle cx="10" cy="9" r="1.8"/><path d="M11 11l3 3 4-5M16 7l4 4M18 5l4 4"/>
      </svg>`;
    if (kind==="legcurl") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 15h9M5 18v-3M13 18v-3"/><circle cx="8" cy="10" r="2"/><path d="M10 11l5 3 3-3M18 11l2 2M20 11v4"/>
      </svg>`;
    if (kind==="hipthrust") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 17h6M4 20v-3M9 20v-3"/><circle cx="9" cy="11" r="2"/><path d="M11 12l4 3 5-1M13 14l-2 6M18 14l2 6M12 13h7"/>
      </svg>`;
    if (kind==="overhead") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="2"/><path d="M12 10v6M9 21l3-5 3 5M8 8L6 4M16 8l2-4M3 4h6M15 4h6M4 2v4M20 2v4"/>
      </svg>`;
    if (kind==="lateral") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="6" r="2"/><path d="M12 8v7M8 21l4-6 4 6M12 10L5 12M12 10l7 2M3 10v4M21 10v4"/>
      </svg>`;
    if (kind==="curl") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="10" cy="5" r="2"/><path d="M10 7v7M8 21l2-7 3 7M10 9l5 3 2-4M15 7l4 2M18 7v4"/>
      </svg>`;
    if (kind==="triceps") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3v4M9 3h6"/><circle cx="12" cy="9" r="2"/><path d="M12 11v5M12 13L8 18M12 13l4 5M6 18h4M14 18h4M9 22l3-6 3 6"/>
      </svg>`;
    if (kind==="plank") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="9" r="2"/><path d="M16 10L9 13 4 12M9 13l6 3M4 12l-2 5M15 16h5M2 20h20"/>
      </svg>`;
    if (kind==="legraise") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 3h16M7 3v5M17 3v5"/><circle cx="12" cy="8" r="2"/><path d="M12 10v5M12 15l-5 5M12 15l5 5"/>
      </svg>`;
    if (kind==="hyper") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 18h7l4-6M7 21l2-3M14 21l-2-3"/><circle cx="17" cy="8" r="2"/><path d="M15 9l-5 5"/>
      </svg>`;
    if (kind==="shrug") return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="6" r="2"/><path d="M12 8v8M8 21l4-5 4 5M12 10l-5 2M12 10l5 2M4 11v4M20 11v4"/>
      </svg>`;
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 10v4M7 9v6M17 9v6M20 10v4"/>
        <path d="M7 12h10"/>
      </svg>`;
  }

  function exerciseIconKind(ex){
    const name = `${ex.name_ua || ""} ${ex.name_en || ""}`.toLowerCase();
    if (name.includes("жим під кут") || name.includes("incline")) return "incline";
    if (name.includes("кросовер") || name.includes("fly")) return "fly";
    if (name.includes("жим ногами") || name.includes("leg press")) return "legpress";
    if (name.includes("згинання ніг") || name.includes("leg curl")) return "legcurl";
    if (name.includes("ягодич") || name.includes("hip thrust")) return "hipthrust";
    if (name.includes("жим над голов") || name.includes("overhead")) return "overhead";
    if (name.includes("розведення") || name.includes("lateral")) return "lateral";
    if (name.includes("шраг") || name.includes("shrug")) return "shrug";
    if (name.includes("біцепс") || name.includes("curl")) return "curl";
    if (name.includes("тріцепс") || name.includes("француз") || name.includes("pushdown") || name.includes("skull")) return "triceps";
    if (name.includes("планк") || name.includes("plank")) return "plank";
    if (name.includes("підйом ніг") || name.includes("leg raise")) return "legraise";
    if (name.includes("гіперекст") || name.includes("hyperextension")) return "hyper";
    if (name.includes("верхнього блоку") || name.includes("lat pulldown")) return "pulldown";
    if (name.includes("тяга нижнього") || name.includes("тяга штанги") || name.includes("row")) return "row";
    if ((name.includes("жим") && name.includes("леж")) || name.includes("bench press")) return "bench";
    if (name.includes("присідан")) return "squat";
    if (name.includes("підтяг")) return "pullup";
    if (name.includes("станов") || name.includes("deadlift") || name.includes("румун")) return "deadlift";
    if (name.includes("біг") || name.includes("run")) return "run";
    if (ex.category==="legs") return "squat";
    if (ex.category==="chest") return "bench";
    if (ex.category==="back") return "pullup";
    if (ex.category==="core") return "run";
    return "dumbbell";
  }

  function exIcon(ex){
    const tone = catTone(ex.category);
    const wrapCls = toneWrapClass(tone);
    const kind = exerciseIconKind(ex);
    return `<div class="exIconWrap exerciseArt ${wrapCls}">${iconSvg(kind)}</div>`;
  }

  // ---------- session ----------
  let currentTab = "home";
  let selectedStatsExerciseId = null;

  let workoutSession = {
    active: false,
    startedAt: null,
    title: "",
    items: [] // [{id, exerciseId, sets:[{reps:"", weight:""}]}]
  };

  let rest = { left: state.settings.defaultRestSec, running:false, interval:null };

  function restDefault(){
    return Math.max(10, parseInt(state.settings.defaultRestSec || 90, 10));
  }

  function formatRest(sec){
    const value = Math.max(0, Number(sec) || 0);
    return `${String(Math.floor(value/60)).padStart(2,"0")}:${String(value%60).padStart(2,"0")}`;
  }

  function updateRestUI(){
    const value = $("#restValue");
    const label = $("#restLabel");
    const ring = $("#restRing");
    const toggle = $("#restToggle");
    if (value) value.textContent = formatRest(rest.left);
    if (label) label.textContent = rest.left === 0 ? t("timerReady") : t("restTimer");
    if (toggle) toggle.textContent = rest.running ? `Ⅱ ${t("timerPause")}` : `▶ ${t("timerStart")}`;
    if (ring){
      const max = Math.max(restDefault(), rest.left, 1);
      const pct = Math.max(0, Math.min(100, ((max-rest.left)/max)*100));
      ring.style.setProperty("--timer-progress", `${pct}%`);
    }
  }

  function stopRestTimer(){
    if (rest.interval) clearInterval(rest.interval);
    rest.interval = null;
    rest.running = false;
    updateRestUI();
  }

  function startRestTimer(){
    if (rest.running) return stopRestTimer();
    if (rest.left <= 0) rest.left = restDefault();
    rest.running = true;
    updateRestUI();
    rest.interval = setInterval(()=>{
      rest.left = Math.max(0, rest.left - 1);
      updateRestUI();
      if (rest.left <= 0){
        stopRestTimer();
        if (navigator.vibrate) navigator.vibrate([160,80,160]);
      }
    },1000);
  }

  function resetRestTimer(){
    stopRestTimer();
    rest.left = restDefault();
    updateRestUI();
  }

  // ---------- flatten stats ----------
  function allLogsFlat(){
    const out = [];
    for (const w of state.workouts){
      for (const it of (w.items||[])){
        out.push({ date: w.date, workoutId: w.id, exerciseId: it.exerciseId, sets: it.sets || [] });
      }
    }
    return out;
  }
  function volumeOfSets(sets){
    return (sets||[]).reduce((a,s)=> a + parseNum(s.weight)*parseNum(s.reps), 0);
  }
  function exerciseTracking(ex){
    return ["strength","reps","time","distance"].includes(ex?.trackingType) ? ex.trackingType : "strength";
  }
  function trackingLabel(ex){
    const labels={
      strength:["Вага + повтори","Weight + reps"],
      reps:["Кількість повторів","Repetitions"],
      time:["Час виконання","Duration"],
      distance:["Дистанція + час","Distance + time"]
    };
    return labels[exerciseTracking(ex)][state.lang==="en"?1:0];
  }
  function primarySetValue(ex,set){
    const type=exerciseTracking(ex);
    if(type==="reps") return parseNum(set?.reps);
    if(type==="time") return parseNum(set?.duration);
    if(type==="distance") return parseNum(set?.distance);
    return parseNum(set?.weight);
  }
  function primaryUnit(ex){
    const type=exerciseTracking(ex);
    if(type==="reps") return state.lang==="en" ? "reps" : "повт.";
    if(type==="time") return state.lang==="en" ? "min" : "хв";
    if(type==="distance") return "km";
    return "kg";
  }
  function maxPrimaryOfSets(ex,sets){
    return Math.max(0,...(sets||[]).map(set=>primarySetValue(ex,set)));
  }
  function exercisePRValue(ex){
    const pr=state.prs?.[ex?.id] || {};
    return parseNum(pr.value ?? (exerciseTracking(ex)==="strength" ? pr.weight : 0));
  }
  function formatExerciseSet(ex,set){
    const type=exerciseTracking(ex);
    if(type==="reps") return `${fmtNum(set.reps)} ${primaryUnit(ex)}`;
    if(type==="time") return `${fmtNum(set.duration)} ${primaryUnit(ex)}`;
    if(type==="distance") return `${fmtNum(set.distance)} km${parseNum(set.duration)>0?` · ${fmtNum(set.duration)} ${state.lang==="en"?"min":"хв"}`:""}`;
    return `${fmtNum(set.weight)}kg × ${fmtNum(set.reps)}`;
  }
  function maxWeightOfSets(sets){
    return Math.max(0, ...(sets||[]).map(s=>parseNum(s.weight)));
  }
  function countSetsInWorkouts(workouts){
    return workouts.reduce((a,w)=> a + (w.items||[]).reduce((x,it)=> x + (it.sets?.length||0), 0), 0);
  }
  function volumeInWorkouts(workouts){
    return workouts.reduce((a,w)=> a + (w.items||[]).reduce((x,it)=> x + volumeOfSets(it.sets), 0), 0);
  }
  function latestBodyWeight(){
    const measurements = [...(state.body||[])]
      .filter(x=>parseNum(x?.weight)>0)
      .sort((a,b)=>new Date(b.date)-new Date(a.date));
    return parseNum(measurements[0]?.weight) || 80;
  }
  function estimatedWorkoutMinutes(workout){
    const trackedMinutes=(workout?.items||[]).reduce((sum,it)=>
      sum+(it.sets||[]).reduce((setSum,set)=>setSum+parseNum(set.duration),0),0);
    if(trackedMinutes>0) return Math.min(300,Math.max(1,Math.round(trackedMinutes)));
    const sets = countSetsInWorkouts([workout]);
    return Math.min(180, Math.max(12, Math.round(sets * 2.5)));
  }
  function estimateWorkoutCalories(workout){
    const sets = countSetsInWorkouts([workout]);
    if (!sets) return 0;
    const weight = latestBodyWeight();
    const minutes = estimatedWorkoutMinutes(workout);
    const met = sets >= 20 ? 6.5 : sets >= 10 ? 6 : 5.5;
    return Math.round(met * 3.5 * weight / 200 * minutes);
  }
  function estimateCaloriesInWorkouts(workouts){
    return workouts.reduce((sum,w)=>sum+estimateWorkoutCalories(w),0);
  }
  function latestBodyMetric(metric){
    const list = [...(state.body||[])]
      .filter(x=>parseNum(x?.[metric])>0)
      .sort((a,b)=>new Date(b.date)-new Date(a.date));
    return parseNum(list[0]?.[metric]);
  }
  function goalCurrent(goal){
    if (goal.type==="exercise"){
      const ex=state.exercises.find(x=>x.id===goal.exerciseId);
      return exercisePRValue(ex);
    }
    return latestBodyMetric(goal.metric);
  }
  function goalLabel(goal){
    if (goal.type==="exercise"){
      const ex = state.exercises.find(x=>x.id===goal.exerciseId);
      return ex ? exName(ex) : (state.lang==="en" ? "Exercise" : "Вправа");
    }
    const names = {
      weight:["Вага","Weight"], forearm:["Передпліччя","Forearm"],
      chest:["Груди","Chest"], waist:["Талія","Waist"], legs:["Ноги","Legs"]
    };
    return names[goal.metric]?.[state.lang==="en"?1:0] || goal.metric;
  }
  function goalProgress(goal){
    const current = goalCurrent(goal);
    const start = parseNum(goal.start);
    const target = parseNum(goal.target);
    if (!current || start===target) return current===target ? 100 : 0;
    const raw = target>start
      ? (current-start)/(target-start)
      : (start-current)/(start-target);
    return Math.max(0,Math.min(100,Math.round(raw*100)));
  }
  function activeDaysCount(workouts){
    const s = new Set(workouts.map(w=>fmtDate(w.date)));
    return s.size;
  }
  function homePeriodBounds(range, now=new Date()){
    const end = new Date(now);
    let start = new Date(0);
    let previousStart = new Date(0);
    let previousEnd = new Date(0);
    if (range==="week"){
      start=startOfWeek(now);
      previousEnd=new Date(start.getTime()-1);
      previousStart=new Date(start);
      previousStart.setDate(previousStart.getDate()-7);
    }else if(range==="month"){
      start=new Date(now.getFullYear(),now.getMonth(),1);
      previousStart=new Date(now.getFullYear(),now.getMonth()-1,1);
      previousEnd=new Date(start.getTime()-1);
    }else if(range==="year"){
      start=new Date(now.getFullYear(),0,1);
      previousStart=new Date(now.getFullYear()-1,0,1);
      previousEnd=new Date(start.getTime()-1);
    }
    return {start,end,previousStart,previousEnd};
  }
  function workoutsInBounds(start,end){
    return state.workouts.filter(w=>{
      const d=new Date(w.date);
      return d>=start && d<=end;
    });
  }
  function percentageDelta(current,previous){
    if (!previous) return current ? 100 : 0;
    return Math.round((current-previous)/previous*100);
  }
  function activeWeekStreak(){
    const weeks=new Set(state.workouts.map(w=>startOfWeek(new Date(w.date)).toISOString().slice(0,10)));
    let cursor=startOfWeek(new Date());
    let streak=0;
    while (weeks.has(cursor.toISOString().slice(0,10))){
      streak+=1;
      cursor=new Date(cursor);
      cursor.setDate(cursor.getDate()-7);
    }
    return streak;
  }
  function strongestExercise(){
    let best=null;
    Object.entries(state.prs||{}).forEach(([id,pr])=>{
      const ex=state.exercises.find(x=>x.id===id);
      const weight=parseNum(pr?.weight);
      if (ex && (!best || weight>best.weight)) best={ex,weight};
    });
    return best;
  }

  // ---------- UI helpers ----------
  function card(html){
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = html;
    return el;
  }

  // ---------- safe setTab/render ----------
  function setTab(tab){
    currentTab = tab;
    $$(".navBtn").forEach(b=>{
      b.classList.toggle("active", b.getAttribute("data-tab")===tab);
    });
    render();
  }

  function render(){
    const langBtn = $("#langBtn");
    if (langBtn) langBtn.textContent = state.lang.toUpperCase();

    const app = $("#app");
    if (!app) return;
    app.innerHTML = "";

    if (currentTab==="home") app.appendChild(viewHome());
    if (currentTab==="workout") app.appendChild(viewWorkout());
    if (currentTab==="exercises") app.appendChild(viewExercises());
    if (currentTab==="stats") app.appendChild(viewStats());
    if (currentTab==="body") app.appendChild(viewBody());
    if (currentTab==="records") app.appendChild(viewRecords());
    if (currentTab==="settings") app.appendChild(viewSettings());
  }

  // ---------- HOME ----------
  function viewHome(){
    const el = document.createElement("div");

    const now = new Date();
    const homeRange = state.ui.homeRange || "week";
    const bounds = homePeriodBounds(homeRange,now);
    const periodWorkouts = homeRange==="all" ? [...state.workouts] : workoutsInBounds(bounds.start,bounds.end);
    const previousWorkouts = homeRange==="all" ? [] : workoutsInBounds(bounds.previousStart,bounds.previousEnd);
    const periodDays = activeDaysCount(periodWorkouts);
    const periodTrainings = periodWorkouts.length;
    const periodSets = countSetsInWorkouts(periodWorkouts);
    const periodVol = volumeInWorkouts(periodWorkouts);
    const periodCalories = estimateCaloriesInWorkouts(periodWorkouts);
    const previousVol = volumeInWorkouts(previousWorkouts);
    const volDelta = percentageDelta(periodVol,previousVol);
    const periodNames = {
      week:state.lang==="en"?"This week":"Цей тиждень",
      month:state.lang==="en"?"This month":"Цей місяць",
      year:state.lang==="en"?"This year":"Цей рік",
      all:state.lang==="en"?"All time":"За весь час"
    };
    const spotlight=[...(state.goals||[])].sort((a,b)=>goalProgress(b)-goalProgress(a))[0];
    const strongest=strongestExercise();

    el.appendChild(card(`
      <div class="goalHero">
        <div class="goalHeroHead">
          <div>
            <div class="muted" style="text-transform:uppercase;letter-spacing:.13em;font-size:10px">${state.lang==="en"?"Your direction":"Твій напрям"}</div>
            <div class="goalHeroTitle">${t("goals")}</div>
          </div>
          <button class="btn primary" id="addGoalBtn">＋ ${t("addGoal")}</button>
        </div>
        ${spotlight ? `
          <div class="goalSpotlight">
            <div class="muted">${state.lang==="en"?"Closest target":"Найближча ціль"}</div>
            <div class="goalSpotValue">${escapeHtml(goalLabel(spotlight))}</div>
            <div class="goalTrack"><span class="goalFill" style="width:${goalProgress(spotlight)}%"></span></div>
            <div class="goalMeta"><span>${state.lang==="en"?"Current":"Зараз"}: ${fmtNum(goalCurrent(spotlight))}</span><strong>${goalProgress(spotlight)}%</strong><span>${state.lang==="en"?"Target":"Ціль"}: ${fmtNum(spotlight.target)}</span></div>
          </div>` : `
          <div class="goalSpotlight"><strong>${state.lang==="en"?"Set your first measurable target":"Постав першу вимірювану ціль"}</strong><div class="muted" style="margin-top:5px">${state.lang==="en"?"For example: 100 kg bench press, 80 kg body weight or 85 cm waist.":"Наприклад: жим 100 кг, вага 80 кг або талія 85 см."}</div></div>`}
        <div class="goalList" id="goalList" style="margin-top:12px"></div>
      </div>
    `));

    el.appendChild(card(`
      <div class="detailHeader">
        <div><div style="font-weight:900;font-size:18px">${periodNames[homeRange]}</div><div class="muted">${state.lang==="en"?"Performance overview":"Огляд результативності"}</div></div>
        ${homeRange!=="all"?`<span class="periodDelta ${volDelta<0?"down":""}">${volDelta>=0?"+":""}${volDelta}% ${state.lang==="en"?"volume":"обʼєм"}</span>`:""}
      </div>
      <div class="periodTabs" id="homeRanges">
        <button class="periodBtn ${homeRange==="week"?"active":""}" data-home-range="week">${t("week")}</button>
        <button class="periodBtn ${homeRange==="month"?"active":""}" data-home-range="month">${t("month")}</button>
        <button class="periodBtn ${homeRange==="year"?"active":""}" data-home-range="year">${state.lang==="en"?"Year":"Рік"}</button>
        <button class="periodBtn ${homeRange==="all"?"active":""}" data-home-range="all">${t("all")}</button>
      </div>
      <div class="kpiGrid4">
        <div class="kpiBox kpiPurple">
          <div class="ico">📅</div>
          <div class="val">${periodDays}</div>
          <div class="lbl">${t("activeDays")}</div>
        </div>
        <div class="kpiBox kpiTeal">
          <div class="ico">🏋️</div>
          <div class="val">${periodTrainings}</div>
          <div class="lbl">${t("trainings")}</div>
        </div>
        <div class="kpiBox kpiPink">
          <div class="ico">🧱</div>
          <div class="val">${periodSets}</div>
          <div class="lbl">${t("sets")}</div>
        </div>
        <div class="kpiBox kpiGold">
          <div class="ico">🔥</div>
          <div class="val">${fmtVol(periodVol)}</div>
          <div class="lbl">${t("volume")}</div>
        </div>
      </div>
      <div class="calorieCard">
        <div><div style="font-weight:900">🔥 ${t("calories")}</div><div class="muted">${t("caloriesApprox")} · ${fmtNum(latestBodyWeight())} kg</div></div>
        <div class="calorieValue">≈ ${periodCalories} kcal</div>
      </div>
      <div class="insightGrid">
        <div class="insightCard"><div class="insightIcon">⚡</div><div class="insightValue">${activeWeekStreak()}</div><div class="insightLabel">${state.lang==="en"?"active-week streak":"тижнів активної серії"}</div></div>
        <div class="insightCard"><div class="insightIcon">👑</div><div class="insightValue">${strongest?fmtNum(strongest.weight):"—"}</div><div class="insightLabel">${strongest?escapeHtml(exName(strongest.ex)):(state.lang==="en"?"strongest exercise":"найсильніша вправа")}</div></div>
        <div class="insightCard"><div class="insightIcon">🎯</div><div class="insightValue">${spotlight?goalProgress(spotlight):0}%</div><div class="insightLabel">${state.lang==="en"?"closest goal progress":"прогрес найближчої цілі"}</div></div>
      </div>

      <div style="margin-top:12px">
        <button class="btn primary" id="homeStart">${t("startWorkout")}</button>
      </div>
    `));

    el.appendChild(card(`
      <div style="font-weight:900; font-size:16px; margin-bottom:10px;">${t("lastWorkouts")}</div>
      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px;" id="recentList"></div>
      <div class="muted" style="margin-top:10px">${t("tapToOpen")}</div>
    `));

    el.appendChild(card(`
      <div style="font-weight:900; font-size:16px; margin-bottom:10px;">${t("favorites")}</div>
      <div class="row" style="gap:10px; flex-wrap:nowrap; overflow:auto; padding-bottom:6px;" id="favStrip"></div>
    `));

    if ((state.recommendations||[]).length){
      el.appendChild(card(`
        <div style="font-weight:900;font-size:16px">${t("nextWorkout")}</div>
        <div>${state.recommendations.slice(0,6).map(r=>`<div class="recommendation"><strong>${escapeHtml(r.title)}</strong><div class="muted" style="margin-top:4px">${escapeHtml(r.text)}</div></div>`).join("")}</div>
      `));
    }

    setTimeout(()=>{
      const btn = $("#homeStart");
      if (btn) btn.onclick = ()=>{
        setTab("workout");
        startWorkoutIfNeeded();
      };
      renderRecentWorkouts();
      renderFavStrip();
      renderGoals();
      const addGoal = $("#addGoalBtn");
      if (addGoal) addGoal.onclick = openGoalModal;
      const homeRanges = $("#homeRanges");
      if (homeRanges) homeRanges.querySelectorAll("[data-home-range]").forEach(btn=>{
        btn.onclick=()=>{
          state.ui.homeRange=btn.getAttribute("data-home-range");
          save();
          render();
        };
      });
    },0);

    return el;
  }

  function renderRecentWorkouts(){
    const box = $("#recentList");
    if (!box) return;

    const last = state.workouts.slice(0, 12);
    if (!last.length){
      box.innerHTML = `<div class="muted">${t("noData")}</div>`;
      return;
    }

    box.innerHTML = last.map(w=>{
      const title = w.title || (state.lang==="en" ? "Workout" : "Тренування");
      const maxW = Math.max(0, ...(w.items||[]).map(it=>maxWeightOfSets(it.sets)));
      const calories = estimateWorkoutCalories(w);
      return `
        <div class="itemRow" style="cursor:pointer" data-openw="${w.id}">
          <div class="left">
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(title)}</strong></div>
              <div class="muted">${fmtDate(w.date)}</div>
            </div>
          </div>
          <div style="text-align:right"><div style="font-weight:900;color:rgba(167,139,250,.95)">${fmtNum(maxW)} kg</div><div class="muted">≈ ${calories} kcal</div></div>
        </div>
      `;
    }).join("");

    box.querySelectorAll("[data-openw]").forEach(row=>{
      row.onclick = ()=>{
        const id = row.getAttribute("data-openw");
        if (id) openWorkoutDetailModal(id);
      };
    });
  }

  function renderFavStrip(){
    const box = $("#favStrip");
    if (!box) return;

    const fav = state.exercises.filter(e=>isFav(e.id)).slice(0, 12);
    if (!fav.length){
      box.innerHTML = `<div class="muted">${t("noData")}</div>`;
      return;
    }

    const flat = allLogsFlat();
    box.innerHTML = fav.map(ex=>{
      const logs = flat.filter(l=>l.exerciseId===ex.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const cnt = logs.length;
      const pr = parseNum(state.prs?.[ex.id]?.weight);
      const totalVolume = logs.reduce((sum,l)=>sum+volumeOfSets(l.sets),0);
      const lastDate = logs[0]?.date ? fmtDate(logs[0].date) : "—";
      return `
        <div class="card favCard" data-favstats="${ex.id}" role="button" tabindex="0">
          <div class="row" style="flex-wrap:nowrap">
            ${exIcon(ex)}
            <div style="min-width:0">
              <div style="font-weight:900;font-size:13px;line-height:1.25">${escapeHtml(exName(ex))}</div>
              <div class="muted" style="margin-top:3px">${escapeHtml(catName(ex.category))}</div>
            </div>
          </div>
          <div class="favMetrics">
            <div class="favMetric"><span>PR</span><strong>${fmtNum(pr)} kg</strong></div>
            <div class="favMetric"><span>${state.lang==="en"?"Trainings":"Тренувань"}</span><strong>${cnt}</strong></div>
            <div class="favMetric"><span>${state.lang==="en"?"Volume":"Обʼєм"}</span><strong>${fmtVol(totalVolume)} kg</strong></div>
            <div class="favMetric"><span>${t("last")}</span><strong>${lastDate}</strong></div>
          </div>
          <div class="muted" style="margin-top:10px;color:#c4b5fd">${state.lang==="en"?"Open statistics →":"Відкрити статистику →"}</div>
        </div>
      `;
    }).join("");
    box.querySelectorAll("[data-favstats]").forEach(item=>{
      const open=()=>{
        selectedStatsExerciseId=item.getAttribute("data-favstats");
        setTab("stats");
      };
      item.onclick=open;
      item.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}};
    });
  }

  // ---------- workout session ----------
  function startWorkoutIfNeeded(){
    if (workoutSession.active) return;
    workoutSession.active = true;
    workoutSession.startedAt = new Date().toISOString();
    if (!workoutSession.title){
      workoutSession.title = state.lang==="en"
        ? `Workout ${fmtDate(workoutSession.startedAt)}`
        : `Тренування ${fmtDate(workoutSession.startedAt)}`;
    }
  }

  function viewWorkout(){
    const el = document.createElement("div");
    startWorkoutIfNeeded();

    el.appendChild(card(`
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div style="min-width:0; flex:1">
          <div style="font-weight:900; font-size:18px">${t("workout")}</div>
          <div class="muted">${workoutSession.active ? `⏱ ${fmtDate(workoutSession.startedAt)}` : t("noData")}</div>

          <div style="margin-top:10px">
            <div class="muted" style="margin-bottom:6px">${t("workoutTitle")}</div>
            <input id="workoutTitleInput" class="btn" style="width:100%"
              value="${escapeHtml(workoutSession.title || "")}"
              placeholder="${t("workoutTitle")}" />
          </div>
        </div>

        <div class="row">
          <button class="btn" id="addExToW">${t("addExerciseToWorkout")}</button>
        </div>
      </div>
    `));

    el.appendChild(card(`
      <div class="restPanel">
        <div class="restRing" id="restRing">
          <div class="restValue" id="restValue">${formatRest(rest.left)}</div>
        </div>
        <div>
          <div style="font-weight:900;font-size:17px" id="restLabel">${t("restTimer")}</div>
          <div class="muted" style="margin-top:4px">${state.lang==="en" ? "Stay precise between working sets" : "Тримай точний темп між робочими підходами"}</div>
        </div>
        <div class="restActions">
          <button class="btn primary" id="restToggle">▶ ${t("timerStart")}</button>
          <button class="btn" id="restPlus">+30</button>
          <button class="btn" id="restReset">${t("timerReset")}</button>
        </div>
      </div>
    `));

    const list = document.createElement("div");
    list.id = "workoutItems";
    el.appendChild(list);

    el.appendChild(card(`
      <div class="row" style="justify-content:space-between">
        <button class="btn primary" id="saveWorkoutBtn">${t("saveWorkout")}</button>
        <button class="btn" id="clearWorkoutBtn">${t("clearWorkout")}</button>
      </div>
    `));

    setTimeout(()=>{
      renderWorkoutItems();

      const titleInput = $("#workoutTitleInput");
      if (titleInput){
        titleInput.addEventListener("input", (e)=>{
          workoutSession.title = e.target.value || "";
        });
      }

      const addBtn = $("#addExToW");
      if (addBtn) addBtn.onclick = ()=> openExercisePickerForWorkout();

      const restToggle = $("#restToggle");
      const restPlus = $("#restPlus");
      const restReset = $("#restReset");
      if (restToggle) restToggle.onclick = startRestTimer;
      if (restPlus) restPlus.onclick = ()=>{
        rest.left += 30;
        updateRestUI();
      };
      if (restReset) restReset.onclick = resetRestTimer;
      updateRestUI();

      const clearBtn = $("#clearWorkoutBtn");
      if (clearBtn) clearBtn.onclick = ()=>{
        resetRestTimer();
        workoutSession = { active:false, startedAt:null, title:"", items:[] };
        render();
      };

      const saveBtn = $("#saveWorkoutBtn");
      if (saveBtn) saveBtn.onclick = ()=>{
        if (!workoutSession.items.length){
          alert(t("pickExerciseFirst"));
          return;
        }
        saveWorkoutSession();
      };
    },0);

    return el;
  }

  function renderWorkoutItems(){
    const box = $("#workoutItems");
    if (!box) return;

    if (!workoutSession.items.length){
      box.innerHTML = `<div class="card"><div class="muted">${state.lang==="en" ? "Tap “Add exercise” to build a workout." : "Натисни “Додати вправу” і збереш тренування."}</div></div>`;
      return;
    }

    box.innerHTML = workoutSession.items.map((it)=> {
      const ex = state.exercises.find(e=>e.id===it.exerciseId);
      const title = ex ? exName(ex) : "—";
      const type = exerciseTracking(ex);

      const setsHtml = (it.sets||[]).map((s, idx)=>`
        <div class="setline setline-${type}" style="margin-top:8px">
          <span class="pill">#${idx+1}</span>
          ${type==="strength" || type==="reps" ? `<input type="text" inputmode="numeric"
            data-id="${it.id}" data-i="${idx}" data-k="reps"
            value="${escapeHtml(s.reps ?? "")}" placeholder="${state.lang==="en"?"reps":"повтори"}" />` : ""}
          ${type==="strength" ? `<input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="weight"
            value="${escapeHtml(s.weight ?? "")}" placeholder="kg" />` : ""}
          ${type==="time" || type==="distance" ? `<input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="duration"
            value="${escapeHtml(s.duration ?? "")}" placeholder="${state.lang==="en"?"minutes":"хвилини"}" />` : ""}
          ${type==="distance" ? `<input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="distance"
            value="${escapeHtml(s.distance ?? "")}" placeholder="km" />` : ""}
          <button class="btn" data-delset="${it.id}" data-i="${idx}">✖</button>
        </div>
      `).join("");

      const prValue = maxPrimaryOfSets(ex, allLogsFlat().filter(l=>l.exerciseId===ex?.id).flatMap(l=>l.sets||[]));

      return `
        <div class="card" style="margin-top:12px">
          <div class="row" style="justify-content:space-between; align-items:flex-start">
            <div class="left" style="min-width:0">
              ${ex ? exIcon(ex) : `<div class="exIconWrap">${iconSvg("dumbbell")}</div>`}
              <div style="min-width:0">
                <div class="titleLine"><strong>${escapeHtml(title)}</strong></div>
                <div class="muted">${catName(ex?.category || "")} • ${trackingLabel(ex)} • ${t("pr")}: ${fmtNum(prValue)} ${primaryUnit(ex)}</div>
              </div>
            </div>
            <div class="row">
              <button class="btn" data-rm="${it.id}">🗑</button>
            </div>
          </div>

          <div>
            ${setsHtml || `<div class="muted" style="margin-top:10px">${state.lang==="en" ? "Add your first set 👇" : "Додай перший підхід 👇"}</div>`}
          </div>

          <div class="row" style="margin-top:12px; justify-content:space-between">
            <button class="btn" data-addset="${it.id}">${t("addSet")}</button>
          </div>
        </div>
      `;
    }).join("");

    // add set
    box.querySelectorAll("[data-addset]").forEach(btn=>{
      btn.onclick = ()=>{
        const id = btn.getAttribute("data-addset");
        const it = workoutSession.items.find(x=>x.id===id);
        if (!it) return;
        const ex=state.exercises.find(e=>e.id===it.exerciseId);
        const type=exerciseTracking(ex);
        it.sets.push(type==="strength"
          ? {reps:"8",weight:"0"}
          : type==="reps"
            ? {reps:"8"}
            : type==="time"
              ? {duration:"10"}
              : {distance:"1",duration:"10"});
        resetRestTimer();
        renderWorkoutItems();
      };
    });

    // remove exercise
    box.querySelectorAll("[data-rm]").forEach(btn=>{
      btn.onclick = ()=>{
        const id = btn.getAttribute("data-rm");
        workoutSession.items = workoutSession.items.filter(x=>x.id!==id);
        renderWorkoutItems();
      };
    });

    // delete set
    box.querySelectorAll("[data-delset]").forEach(btn=>{
      btn.onclick = ()=>{
        const id = btn.getAttribute("data-delset");
        const idx = Number(btn.getAttribute("data-i"));
        const it = workoutSession.items.find(x=>x.id===id);
        if (!it) return;
        it.sets.splice(idx,1);
        renderWorkoutItems();
      };
    });

    // input bind (NO rerender on every key)
    box.querySelectorAll("input[data-id]").forEach(inp=>{
      inp.addEventListener("input", (e)=>{
        const id = e.target.getAttribute("data-id");
        const idx = Number(e.target.getAttribute("data-i"));
        const k = e.target.getAttribute("data-k");
        const it = workoutSession.items.find(x=>x.id===id);
        if (!it || !it.sets[idx]) return;
        it.sets[idx][k] = e.target.value;
      });

      inp.addEventListener("blur", (e)=>{
        const id = e.target.getAttribute("data-id");
        const idx = Number(e.target.getAttribute("data-i"));
        const k = e.target.getAttribute("data-k");
        const it = workoutSession.items.find(x=>x.id===id);
        if (!it || !it.sets[idx]) return;

        const raw = (it.sets[idx][k] ?? "").toString().trim();
        if (raw === ""){
          it.sets[idx][k] = "";
          e.target.value = "";
          return;
        }
        const num = parseNum(raw);
        it.sets[idx][k] = fmtNum(num);
        e.target.value = it.sets[idx][k];
      });
    });
  }

  function openExercisePickerForWorkout(){
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,.45)";
    overlay.style.backdropFilter = "blur(6px)";
    overlay.style.zIndex = "100";
    overlay.style.padding = "16px";
    overlay.style.display = "grid";
    overlay.style.placeItems = "center";

    const modal = document.createElement("div");
    modal.className = "card";
    modal.style.width = "min(720px, 96vw)";
    modal.style.maxHeight = "78vh";
    modal.style.overflow = "auto";

    const cat = state.ui.exCat || "all";
    const q = state.ui.exQ || "";

    modal.innerHTML = `
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("addExercise")}</h2>
          <div class="sub">${t("pickExercise")}</div>
        </div>
        <button class="btn" id="pickClose" style="border-radius:50%; width:42px; height:42px; padding:0;">✕</button>
      </div>

      <div class="filters" id="pickCats"></div>

      <input id="pickQ" class="btn" style="width:100%; margin-top:10px" placeholder="${t("search")}" value="${escapeHtml(q)}"/>

      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px; margin-top:12px" id="pickList"></div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = ()=> overlay.remove();
    const closeBtn = modal.querySelector("#pickClose");
    if (closeBtn) closeBtn.onclick = close;
    overlay.addEventListener("click",(e)=>{ if (e.target===overlay) close(); });

    function renderCats(active){
      const box = modal.querySelector("#pickCats");
      if (!box) return;
      box.innerHTML = CATEGORIES.map(c=>{
        const isA = c.id===active;
        return `<button class="fchip ${isA?"active":""}" data-pcat="${c.id}">${state.lang==="ua"?c.ua:c.en}</button>`;
      }).join("");
      box.querySelectorAll("[data-pcat]").forEach(b=>{
        b.onclick = ()=>{
          state.ui.exCat = b.getAttribute("data-pcat");
          save();
          renderCats(state.ui.exCat);
          renderList();
        };
      });
    }

    function renderList(){
      const listBox = modal.querySelector("#pickList");
      const qInput = modal.querySelector("#pickQ");
      if (!listBox || !qInput) return;

      const activeCat = state.ui.exCat || "all";
      const qq = (qInput.value||"").trim().toLowerCase();
      state.ui.exQ = qInput.value || "";
      save();

      let list = [...state.exercises];
      if (activeCat!=="all") list = list.filter(x=>x.category===activeCat);
      if (qq) list = list.filter(x=> (x.name_ua+" "+x.name_en).toLowerCase().includes(qq));

      list.sort((a,b)=>{
        const fa = isFav(a.id)?1:0;
        const fb = isFav(b.id)?1:0;
        if (fa!==fb) return fb-fa;
        return exName(a).localeCompare(exName(b));
      });

      listBox.innerHTML = list.map(ex=>{
        const prW = exercisePRValue(ex);
        return `
          <div class="itemRow">
            <div class="left">
              ${exIcon(ex)}
              <div style="min-width:0">
                <div class="titleLine"><strong>${escapeHtml(exName(ex))}</strong></div>
                <div class="muted">${catName(ex.category)} • ${trackingLabel(ex)} • PR: ${fmtNum(prW)} ${primaryUnit(ex)}</div>
              </div>
            </div>
            <div class="row">
              <button class="btn" data-fav="${ex.id}">${isFav(ex.id)?"⭐":"☆"}</button>
              <button class="btn primary" data-add="${ex.id}">${t("addToWorkout")}</button>
            </div>
          </div>
        `;
      }).join("");

      listBox.querySelectorAll("[data-fav]").forEach(b=>{
        b.onclick = ()=>{
          toggleFav(b.getAttribute("data-fav"));
          renderCats(state.ui.exCat);
          renderList();
        };
      });

      listBox.querySelectorAll("[data-add]").forEach(b=>{
        b.onclick = ()=>{
          const id = b.getAttribute("data-add");
          const exists = workoutSession.items.some(x=>x.exerciseId===id);
          if (!exists){
            workoutSession.items.push({ id: uid(), exerciseId:id, sets:[] });
            workoutSession.active = true;
            if (!workoutSession.startedAt) workoutSession.startedAt = new Date().toISOString();
            if (!workoutSession.title) workoutSession.title = state.lang==="en"
              ? `Workout ${fmtDate(workoutSession.startedAt)}`
              : `Тренування ${fmtDate(workoutSession.startedAt)}`;
          }
          close();
          renderWorkoutItems();
        };
      });
    }

    renderCats(cat);
    renderList();

    const qInput = modal.querySelector("#pickQ");
    if (qInput) qInput.oninput = renderList;
  }

  function buildWorkoutRecommendations(items){
    return items.map(it=>{
      const ex=state.exercises.find(e=>e.id===it.exerciseId);
      if (!ex || !(it.sets||[]).length) return null;
      const type=exerciseTracking(ex);
      if(type!=="strength"){
        const best=maxPrimaryOfSets(ex,it.sets);
        const unit=primaryUnit(ex);
        const next=type==="reps" ? best+1 : type==="time" ? best+1 : Math.round((best+0.1)*10)/10;
        const text=state.lang==="en"
          ? `Current best: ${fmtNum(best)} ${unit}. Next time aim for ${fmtNum(next)} ${unit} while keeping a comfortable pace and clean technique.`
          : `Поточний максимум: ${fmtNum(best)} ${unit}. Наступного разу спробуй ${fmtNum(next)} ${unit}, зберігаючи комфортний темп і якісну техніку.`;
        return {exerciseId:it.exerciseId,title:exName(ex),text};
      }
      const maxWeight=maxWeightOfSets(it.sets);
      const repsAtMax=Math.max(0,...it.sets.filter(s=>parseNum(s.weight)===maxWeight).map(s=>parseNum(s.reps)));
      const previous=allLogsFlat()
        .filter(l=>l.exerciseId===it.exerciseId)
        .sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
      const previousMax=previous ? maxWeightOfSets(previous.sets) : 0;
      const increment=["legs","back"].includes(ex.category)?5:2.5;
      let text;
      if (repsAtMax>=8){
        text=state.lang==="en"
          ? `Try ${fmtNum(maxWeight+increment)} kg for 6–8 reps. You completed ${fmtNum(maxWeight)} kg for ${fmtNum(repsAtMax)} reps.`
          : `Спробуй ${fmtNum(maxWeight+increment)} кг на 6–8 повторень. Зараз виконано ${fmtNum(maxWeight)} кг × ${fmtNum(repsAtMax)}.`;
      }else if(repsAtMax>=6){
        text=state.lang==="en"
          ? `Keep ${fmtNum(maxWeight)} kg and aim for ${fmtNum(repsAtMax+1)} reps before increasing weight.`
          : `Залиши ${fmtNum(maxWeight)} кг і спробуй ${fmtNum(repsAtMax+1)} повторень перед підвищенням ваги.`;
      }else{
        text=state.lang==="en"
          ? `Repeat ${fmtNum(maxWeight)} kg and stabilize technique at 6 reps. Reduce by 2.5–5 kg if form breaks down.`
          : `Повтори ${fmtNum(maxWeight)} кг і закріпи техніку на 6 повтореннях. Якщо техніка погіршується — зменш вагу на 2.5–5 кг.`;
      }
      if (maxWeight>previousMax && previousMax>0){
        text += state.lang==="en" ? " New working-weight progress." : " Є прогрес робочої ваги.";
      }
      return {exerciseId:it.exerciseId,title:exName(ex),text};
    }).filter(Boolean);
  }

  function openRecommendationsModal(recommendations,gotAnyPR){
    const overlay=document.createElement("div");
    overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(9px);z-index:180;display:grid;place-items:center;padding:16px";
    const modal=document.createElement("div");
    modal.className="card";
    modal.style.cssText="width:min(680px,96vw);max-height:84vh;overflow:auto";
    modal.innerHTML=`
      <div class="detailHeader"><div class="detailTitle"><h2>${gotAnyPR?"🏆 ":""}${t("saveOk")}</h2><div class="sub">${t("nextWorkout")}</div></div><button class="btn" id="recClose">✕</button></div>
      <div style="margin-top:12px">${recommendations.map(r=>`<div class="recommendation"><strong>${escapeHtml(r.title)}</strong><div class="muted" style="margin-top:5px">${escapeHtml(r.text)}</div></div>`).join("")}</div>
      <div class="premiumNote" style="margin-top:14px">${state.lang==="en"?"Recommendations use your completed weight and reps. Adjust them if technique or recovery is poor.":"Рекомендації враховують виконану вагу й повторення. Коригуй їх, якщо техніка або відновлення недостатні."}</div>
      <button class="btn primary" id="recOk" style="width:100%;margin-top:14px">${t("ok")}</button>`;
    overlay.appendChild(modal);document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    modal.querySelector("#recClose").onclick=close;
    modal.querySelector("#recOk").onclick=close;
  }

  function saveWorkoutSession(){
    const workoutId = uid();
    const date = workoutSession.startedAt || new Date().toISOString();

    let gotAnyPR = false;

    const items = workoutSession.items.map(it=>{
      const exId = it.exerciseId;
      const ex = state.exercises.find(e=>e.id===exId);
      const type = exerciseTracking(ex);
      const sets = (it.sets||[]).map(s=>({
        weight: parseNum(s.weight),
        reps: parseNum(s.reps),
        duration: parseNum(s.duration),
        distance: parseNum(s.distance)
      })).filter(s=>{
        if(type==="reps") return s.reps>0;
        if(type==="time") return s.duration>0;
        if(type==="distance") return s.distance>0;
        return s.weight>0 && s.reps>0;
      });

      // PR check
      const best = maxPrimaryOfSets(ex,sets);
      const prev = parseNum(state.prs?.[exId]?.value ?? state.prs?.[exId]?.weight ?? 0);
      if (best > prev){
        const prSet = sets.find(s=>primarySetValue(ex,s)===best) || {};
        state.prs[exId] = {
          type,
          value:best,
          weight:parseNum(prSet.weight),
          reps:parseNum(prSet.reps),
          duration:parseNum(prSet.duration),
          distance:parseNum(prSet.distance),
          date
        };
        gotAnyPR = true;
      }

      return { exerciseId: exId, sets };
    }).filter(it=>it.sets.length);

    if (!items.length){
      alert(t("needSet"));
      return;
    }

    const fallbackTitle = state.lang==="en" ? `Workout ${fmtDate(date)}` : `Тренування ${fmtDate(date)}`;
    const title = (workoutSession.title || "").trim() || fallbackTitle;
    const recommendations=buildWorkoutRecommendations(items);

    state.workouts.unshift({ id: workoutId, date, title, items });
    state.recommendations=recommendations;
    save();

    workoutSession = { active:false, startedAt:null, title:"", items:[] };
    resetRestTimer();

    setTab("home");
    setTimeout(()=>openRecommendationsModal(recommendations,gotAnyPR),0);
  }

  // ---------- workout detail modal (history) ----------
  function openWorkoutDetailModal(workoutId){
    const w = state.workouts.find(x=>x.id===workoutId);
    if (!w) return;

    const overlay = document.createElement("div");
    overlay.style.position="fixed";
    overlay.style.inset="0";
    overlay.style.background="rgba(0,0,0,.45)";
    overlay.style.backdropFilter="blur(6px)";
    overlay.style.zIndex="140";
    overlay.style.display="grid";
    overlay.style.placeItems="center";
    overlay.style.padding="16px";

    const modal = document.createElement("div");
    modal.className="card";
    modal.style.width="min(760px, 96vw)";
    modal.style.maxHeight="80vh";
    modal.style.overflow="auto";

    const totalVol = volumeInWorkouts([w]);
    const totalSets = countSetsInWorkouts([w]);
    const maxW = Math.max(0, ...(w.items||[]).map(it=>maxWeightOfSets(it.sets)));
    const calories = estimateWorkoutCalories(w);
    const estimatedMinutes = estimatedWorkoutMinutes(w);

    const itemsHtml = (w.items||[]).map(it=>{
      const ex = state.exercises.find(e=>e.id===it.exerciseId);
      const name = ex ? exName(ex) : "—";
      const chips = (it.sets||[]).map(s=>{
        return `<span class="chip">${formatExerciseSet(ex,s)}</span>`;
      }).join("");

      return `
        <div class="card" style="margin:10px 0 0">
          <div class="row" style="justify-content:space-between">
            <div class="left">
              ${ex ? exIcon(ex) : `<div class="exIconWrap">${iconSvg("dumbbell")}</div>`}
              <div>
                <div style="font-weight:900">${escapeHtml(name)}</div>
                <div class="muted">${catName(ex?.category||"")} • ${trackingLabel(ex)}</div>
              </div>
            </div>
            <div style="font-weight:900; color: rgba(167,139,250,.95)">${fmtNum(maxPrimaryOfSets(ex,it.sets))} ${primaryUnit(ex)}</div>
          </div>
          <div class="chips">${chips || `<span class="muted">${t("noData")}</span>`}</div>
        </div>
      `;
    }).join("");

    modal.innerHTML = `
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${escapeHtml(w.title || (state.lang==="en" ? "Workout" : "Тренування"))}</h2>
          <div class="sub">${fmtDate(w.date)}</div>
        </div>
        <button class="btn" id="wdClose" style="border-radius:50%; width:42px; height:42px; padding:0;">✕</button>
      </div>

      <div class="kpiGrid2" style="margin-top:12px">
        <div class="kpi gold"><div class="label">${t("maxWeight")}</div><div class="value">${fmtNum(maxW)}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "Sets" : "Підходів"}</div><div class="value">${totalSets}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "Volume" : "Обʼєм"}</div><div class="value sm">${fmtVol(totalVol)} kg</div></div>
        <div class="kpi"><div class="label">${t("exercisesCount")}</div><div class="value">${(w.items||[]).length}</div></div>
        <div class="kpi"><div class="label">${t("calories")} · ≈</div><div class="value sm">${calories} kcal</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "Estimated duration" : "Орієнтовний час"}</div><div class="value sm">≈ ${estimatedMinutes} ${state.lang==="en"?"min":"хв"}</div></div>
      </div>

      ${itemsHtml}

      <div class="row" style="justify-content:space-between; margin-top:14px">
        <button class="btn" id="wdDelete">🗑 ${t("deleteWorkout")}</button>
        <button class="btn primary" id="wdOk">${t("ok")}</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = ()=> overlay.remove();
    const x = modal.querySelector("#wdClose");
    const ok = modal.querySelector("#wdOk");
    if (x) x.onclick = close;
    if (ok) ok.onclick = close;
    overlay.addEventListener("click",(e)=>{ if (e.target===overlay) close(); });

    const del = modal.querySelector("#wdDelete");
    if (del) del.onclick = ()=>{
      if (!confirm(t("confirmDeleteWorkout"))) return;
      state.workouts = state.workouts.filter(x=>x.id!==workoutId);
      save();
      close();
      render();
    };
  }

  // ---------- EXERCISES ----------
  function viewExercises(){
    const el = document.createElement("div");

    el.appendChild(card(`
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("exercises")}</h2>
          <div class="sub">${state.lang==="en" ? "List + filters" : "Списком + фільтр по категоріях"}</div>
        </div>
        <button class="btn primary" id="exPlus" title="Add" style="border-radius:50%; width:44px; height:44px; padding:0;">＋</button>
      </div>

      <div class="filters" id="exCats"></div>

      <input id="exQ" class="btn" style="width:100%; margin-top:10px; box-sizing:border-box;" placeholder="${t("search")}" value="${escapeHtml(state.ui.exQ||"")}"/>

      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px; margin-top:12px" id="exList"></div>
    `));

    setTimeout(()=>{
      renderExCats();
      renderExList();

      const exQ = $("#exQ");
      if (exQ){
        exQ.oninput = ()=>{
          state.ui.exQ = exQ.value || "";
          save();
          renderExList();
        };
      }

      const plus = $("#exPlus");
      if (plus) plus.onclick = ()=> openAddExerciseModal();
    },0);

    return el;
  }

  function renderExCats(){
    const box = $("#exCats");
    if (!box) return;
    const active = state.ui.exCat || "all";
    box.innerHTML = CATEGORIES.map(c=>{
      const isA = c.id===active;
      return `<button class="fchip ${isA?"active":""}" data-cat="${c.id}">${state.lang==="ua"?c.ua:c.en}</button>`;
    }).join("");
    box.querySelectorAll("[data-cat]").forEach(b=>{
      b.onclick = ()=>{
        state.ui.exCat = b.getAttribute("data-cat");
        save();
        renderExCats();
        renderExList();
      };
    });
  }

  function renderExList(){
    const box = $("#exList");
    if (!box) return;

    const active = state.ui.exCat || "all";
    const q = (state.ui.exQ || "").trim().toLowerCase();

    let list = [...state.exercises];
    if (active!=="all") list = list.filter(x=>x.category===active);
    if (q) list = list.filter(x=> (x.name_ua+" "+x.name_en).toLowerCase().includes(q));

    list.sort((a,b)=>{
      const fa = isFav(a.id)?1:0;
      const fb = isFav(b.id)?1:0;
      if (fa!==fb) return fb-fa;
      return exName(a).localeCompare(exName(b));
    });

    // last trained date per exercise
    const lastBy = {};
    const srcWorkouts = Array.isArray(state.workouts) ? state.workouts : [];
    const srcLogs = Array.isArray(state.logs) ? state.logs : []; // legacy imports
    [...srcWorkouts, ...srcLogs].forEach(w=>{
      const ts = new Date(w?.date || w?.ts || 0).getTime();
      if (!Number.isFinite(ts) || ts<=0) return;
      (w?.items||[]).forEach(it=>{
        const exId = it?.exerciseId;
        if (!exId) return;
        if (!lastBy[exId] || ts > lastBy[exId]) lastBy[exId] = ts;
      });
    });

    box.innerHTML = list.map(ex=>{
      const prW = exercisePRValue(ex);
      const lastTs = lastBy[ex.id] || 0;
      const lastTxt = lastTs ? fmtDate(new Date(lastTs)) : "—";
      return `
        <div class="itemRow">
          <div class="left">
            ${exIcon(ex)}
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(exName(ex))}</strong></div>
              <div class="muted">${catName(ex.category)} • ${trackingLabel(ex)} • PR: <span class="prText">${fmtNum(prW)} ${primaryUnit(ex)}</span> • ${t("last")}: ${lastTxt}</div>
            </div>
          </div>
          <div class="row">
            <button class="btn" data-fav="${ex.id}">${isFav(ex.id)?"⭐":"☆"}</button>
            <button class="btn" data-delex="${ex.id}" title="${t("deleteExercise")}">🗑</button>
            <button class="btn primary" data-addw="${ex.id}">${t("addToWorkout")}</button>
          </div>
        </div>
      `;
    }).join("");

    box.querySelectorAll("[data-fav]").forEach(b=>{
      b.onclick = ()=>{
        toggleFav(b.getAttribute("data-fav"));
        renderExList();
      };
    });

    box.querySelectorAll("[data-delex]").forEach(b=>{
      b.onclick = ()=>{
        deleteExerciseById(b.getAttribute("data-delex"));
      };
    });

    box.querySelectorAll("[data-addw]").forEach(b=>{
      b.onclick = ()=>{
        setTab("workout");
        startWorkoutIfNeeded();
        const id = b.getAttribute("data-addw");
        const exists = workoutSession.items.some(x=>x.exerciseId===id);
        if (!exists) workoutSession.items.push({ id: uid(), exerciseId:id, sets:[] });
        renderWorkoutItems();
      };
    });
  }

  function openAddExerciseModal(){
    const overlay = document.createElement("div");
    overlay.style.position="fixed";
    overlay.style.inset="0";
    overlay.style.background="rgba(0,0,0,.45)";
    overlay.style.backdropFilter="blur(6px)";
    overlay.style.zIndex="120";
    overlay.style.display="grid";
    overlay.style.placeItems="center";
    overlay.style.padding="16px";

    const modal = document.createElement("div");
    modal.className="card";
    modal.style.width="min(720px, 96vw)";

    modal.innerHTML = `
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("newExercise")}</h2>
          <div class="sub">${state.lang==="en" ? "Add your own exercise" : "Додай свою вправу"}</div>
        </div>
        <button class="btn" id="addClose" style="border-radius:50%; width:42px; height:42px; padding:0;">✕</button>
      </div>

      <div class="row" style="margin-top:12px; flex-wrap:wrap;">
        <input id="nUa" class="btn" style="flex:1; min-width:220px" placeholder="Назва (UA)" />
        <input id="nEn" class="btn" style="flex:1; min-width:220px" placeholder="Name (EN)" />
        <select id="nCat" class="btn">
          ${CATEGORIES.filter(c=>c.id!=="all").map(c=>`<option value="${c.id}">${state.lang==="ua"?c.ua:c.en}</option>`).join("")}
        </select>
        <select id="nTracking" class="btn">
          <option value="strength">${state.lang==="en"?"Weight + reps":"Вага + повтори"}</option>
          <option value="reps">${state.lang==="en"?"Repetitions only":"Лише повтори"}</option>
          <option value="time">${state.lang==="en"?"Duration":"Час виконання"}</option>
          <option value="distance">${state.lang==="en"?"Distance + time":"Дистанція + час"}</option>
        </select>
        <button class="btn primary" id="addDo">${t("create")}</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = ()=> overlay.remove();
    const x = modal.querySelector("#addClose");
    if (x) x.onclick = close;
    overlay.addEventListener("click",(e)=>{ if (e.target===overlay) close(); });

    const addDo = modal.querySelector("#addDo");
    if (addDo) addDo.onclick = ()=>{
      const name_ua = (modal.querySelector("#nUa")?.value || "").trim();
      const name_en = (modal.querySelector("#nEn")?.value || "").trim();
      const category = modal.querySelector("#nCat")?.value || "back";
      const trackingType = modal.querySelector("#nTracking")?.value || "strength";
      if (!name_ua && !name_en) return;

      state.exercises.unshift({
        id: uid(),
        name_ua: name_ua || name_en,
        name_en: name_en || name_ua,
        category,
        trackingType
      });
      save();
      close();
      renderExList();
    };
  }

  // ---------- STATS ----------
  function viewStats(){
    const el = document.createElement("div");

    const range = state.ui.statsRange || "week";
    const now = new Date();

    let from = new Date(0);
    if (range==="week") from = startOfWeek(now);
    if (range==="month") from = new Date(now.getFullYear(), now.getMonth(), 1);

    const workouts = state.workouts.filter(w => new Date(w.date) >= from);

    const trainings = workouts.length;
    const days = activeDaysCount(workouts);
    const sets = countSetsInWorkouts(workouts);
    const vol = volumeInWorkouts(workouts);
    const calories = estimateCaloriesInWorkouts(workouts);

    el.appendChild(card(`
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("stats")}</h2>
          <div class="sub">${state.lang==="en" ? "Overview" : "Загальна статистика"}</div>
        </div>
      </div>

      <div class="filters" id="statsRanges">
        <button class="fchip ${range==="week"?"active":""}" data-r="week">${t("week")}</button>
        <button class="fchip ${range==="month"?"active":""}" data-r="month">${t("month")}</button>
        <button class="fchip ${range==="all"?"active":""}" data-r="all">${t("all")}</button>
      </div>

      <div class="kpiGrid4" style="margin-top:10px">
        <div class="kpiBox kpiPurple"><div class="ico">🏋️</div><div class="val">${trainings}</div><div class="lbl">${t("totalTrainings")}</div></div>
        <div class="kpiBox kpiTeal"><div class="ico">📅</div><div class="val">${days}</div><div class="lbl">${t("activeDays")}</div></div>
        <div class="kpiBox kpiPink"><div class="ico">🧱</div><div class="val">${sets}</div><div class="lbl">${t("totalSets")}</div></div>
        <div class="kpiBox kpiGold"><div class="ico">🔥</div><div class="val">${fmtVol(vol)}</div><div class="lbl">${t("totalVolume")}</div></div>
      </div>
      <div class="calorieCard">
        <div><div style="font-weight:900">🔥 ${t("calories")}</div><div class="muted">${t("caloriesApprox")} · MET + ${fmtNum(latestBodyWeight())} kg</div></div>
        <div class="calorieValue">≈ ${calories} kcal</div>
      </div>

      <div class="sectionCard">
        <div class="sectionTitle">${t("volumeProgress")}</div>
        <div class="chartSurface" id="chartAllVol"></div>
        <div class="muted" style="margin-top:10px">${t("volumeBarsHint")}</div>
      </div>

      <div class="sectionCard">
        <div class="sectionTitle">${t("muscleSplit")}</div>
        <div class="chartSurface" id="chartMusclePie"></div>
        <div class="muted" style="margin-top:10px">${t("muscleSplitHint")}</div>
      </div>
    `));

    el.appendChild(card(`
      <div class="sectionTitle" style="margin:0 0 10px">${t("trainedOnly")}</div>
      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px" id="statsExList"></div>
      <div id="detailBox"></div>
    `));

    setTimeout(()=>{
      const ranges = $("#statsRanges");
      if (ranges){
        ranges.querySelectorAll("[data-r]").forEach(b=>{
          b.onclick = ()=>{
            state.ui.statsRange = b.getAttribute("data-r");
            save();
            render();
          };
        });
      }

      drawAllVolumeBars(workouts);
      drawMusclePie(workouts);
      renderStatsExercisesOnlyTrained();
      if (selectedStatsExerciseId) renderExerciseDetail();
    },0);

    return el;
  }

  function recentPoints(points, limit=9){
    return points.slice(Math.max(0, points.length-limit));
  }

  function renderGoals(){
    const box = $("#goalList");
    if (!box) return;
    if (!(state.goals||[]).length){
      box.innerHTML = `<div class="muted">${state.lang==="en" ? "Set a target such as 100 kg bench press or 85 cm waist." : "Постав ціль: наприклад, жим 100 кг або талія 85 см."}</div>`;
      return;
    }
    box.innerHTML = state.goals.map(goal=>{
      const current = goalCurrent(goal);
      const progress = goalProgress(goal);
      const goalEx=goal.type==="exercise" ? state.exercises.find(ex=>ex.id===goal.exerciseId) : null;
      const unit = goal.type==="exercise" ? primaryUnit(goalEx) : goal.metric==="weight" ? "kg" : "cm";
      return `<div class="goalItem">
        <div class="goalTop">
          <div><strong>${escapeHtml(goalLabel(goal))}</strong><div class="muted">${progress>=100 ? (state.lang==="en"?"Goal achieved":"Ціль досягнута") : `${progress}%`}</div></div>
          <button class="btn" data-delgoal="${goal.id}" title="${t("deleteMeasure")}">✕</button>
        </div>
        <div class="goalTrack"><span class="goalFill" style="width:${progress}%"></span></div>
        <div class="goalMeta"><span>${state.lang==="en"?"Current":"Зараз"}: ${fmtNum(current)} ${unit}</span><span>${state.lang==="en"?"Target":"Ціль"}: ${fmtNum(goal.target)} ${unit}</span></div>
      </div>`;
    }).join("");
    box.querySelectorAll("[data-delgoal]").forEach(btn=>{
      btn.onclick=()=>{
        state.goals=state.goals.filter(g=>g.id!==btn.getAttribute("data-delgoal"));
        save();
        renderGoals();
      };
    });
  }

  function openGoalModal(){
    const overlay=document.createElement("div");
    overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.58);backdrop-filter:blur(8px);z-index:160;display:grid;place-items:center;padding:16px";
    const modal=document.createElement("div");
    modal.className="card";
    modal.style.cssText="width:min(620px,96vw);max-height:84vh;overflow:auto";
    modal.innerHTML=`
      <div class="detailHeader"><div class="detailTitle"><h2>${t("addGoal")}</h2><div class="sub">${state.lang==="en"?"Choose a measurable target":"Обери вимірювану ціль"}</div></div><button class="btn" id="goalClose">✕</button></div>
      <div class="bodyGrid" style="margin-top:14px">
        <div class="bodyField"><div class="muted">${state.lang==="en"?"Goal type":"Тип цілі"}</div><select class="btn" id="goalType"><option value="exercise">${state.lang==="en"?"Exercise PR":"Рекорд у вправі"}</option><option value="body">${state.lang==="en"?"Body metric":"Показник тіла"}</option></select></div>
        <div class="bodyField" id="goalExerciseField"><div class="muted">${t("exercises")}</div><select class="btn" id="goalExercise">${state.exercises.map(ex=>`<option value="${ex.id}">${escapeHtml(exName(ex))}</option>`).join("")}</select></div>
        <div class="bodyField" id="goalMetricField" style="display:none"><div class="muted">${state.lang==="en"?"Metric":"Показник"}</div><select class="btn" id="goalMetric"><option value="weight">${state.lang==="en"?"Weight":"Вага"}</option><option value="waist">${state.lang==="en"?"Waist":"Талія"}</option><option value="chest">${state.lang==="en"?"Chest":"Груди"}</option><option value="forearm">${state.lang==="en"?"Forearm":"Передпліччя"}</option><option value="legs">${state.lang==="en"?"Legs":"Ноги"}</option></select></div>
        <div class="bodyField"><div class="muted">${state.lang==="en"?"Target value":"Цільове значення"}</div><input class="btn" id="goalTarget" inputmode="decimal" placeholder="100"></div>
        <div class="bodyActions"><button class="btn primary" id="goalSave">${t("save")}</button></div>
      </div>`;
    overlay.appendChild(modal);document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    modal.querySelector("#goalClose").onclick=close;
    overlay.onclick=e=>{if(e.target===overlay)close();};
    const type=modal.querySelector("#goalType");
    type.onchange=()=>{
      modal.querySelector("#goalExerciseField").style.display=type.value==="exercise"?"grid":"none";
      modal.querySelector("#goalMetricField").style.display=type.value==="body"?"grid":"none";
    };
    modal.querySelector("#goalSave").onclick=()=>{
      const target=parseNum(modal.querySelector("#goalTarget").value);
      if (!(target>0)) return;
      const isExercise=type.value==="exercise";
      const exerciseId=modal.querySelector("#goalExercise").value;
      const metric=modal.querySelector("#goalMetric").value;
      const start=isExercise ? exercisePRValue(state.exercises.find(ex=>ex.id===exerciseId)) : latestBodyMetric(metric);
      state.goals.unshift({id:uid(),type:isExercise?"exercise":"body",exerciseId:isExercise?exerciseId:null,metric:isExercise?null:metric,target,start,createdAt:Date.now()});
      save();close();renderGoals();
    };
  }

  function trendMarkup(points, options={}){
    if (!points.length) return `<div class="muted">${t("noData")}</div>`;
    const pts = recentPoints(points, options.limit || 9);
    const values = pts.map(p=>parseNum(p.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max-min);
    const coords = pts.map((p,i)=>{
      const x = pts.length===1 ? 50 : 4 + (92*i/(pts.length-1));
      const y = 92 - ((parseNum(p.value)-min)/span)*48;
      return { ...p, x, y };
    });
    const line = coords.map(p=>`${p.x},${p.y}`).join(" ");
    const area = `4,92 ${line} 96,92`;
    const first = values[0];
    const last = values[values.length-1];
    const delta = last-first;
    const deltaText = `${delta>=0?"+":""}${fmtNum(delta)}${options.unit ? ` ${options.unit}` : ""}`;
    const color = options.color || "#8b5cf6";
    const unit = options.unit || "";
    const id = `g${Math.random().toString(16).slice(2)}`;
    const labelStep = pts.length > 7 ? 2 : 1;
    const labelValue = (v)=> options.pointFormat ? options.pointFormat(v) : fmtNum(v);
    return `
      <div class="chartHeader">
        <div>
          <div class="muted">${options.caption || (state.lang==="en" ? "Latest result" : "Останній результат")}</div>
          <div class="chartBig">${options.format ? options.format(last) : fmtNum(last)}${unit ? ` <small style="font-size:.48em;color:var(--muted)">${unit}</small>` : ""}</div>
        </div>
        ${values.length>1 ? `<div class="chartDelta ${delta<0?"down":""}">${deltaText}</div>` : ""}
      </div>
      <div class="plotArea">
      <svg class="trendSvg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${color}" stop-opacity=".34"/>
            <stop offset="1" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M4 25H96 M4 58H96 M4 91H96" stroke="rgba(255,255,255,.07)" stroke-width=".7" vector-effect="non-scaling-stroke"/>
        <polygon points="${area}" fill="url(#${id})"/>
        <polyline points="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
        ${coords.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="${i===coords.length-1?2.5:1.35}" fill="${color}" stroke="#111827" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join("")}
      </svg>
        ${coords.map((p,i)=>{
          if (i%labelStep!==0 && i!==coords.length-1) return "";
          const edge = i===0 ? "edgeStart" : i===coords.length-1 ? "edgeEnd" : "";
          return `<span class="plotLabel ${edge} ${i===coords.length-1?"last":""}" style="left:${p.x}%;top:${Math.max(18,p.y-8)}%">${escapeHtml(labelValue(p.value))}</span>`;
        }).join("")}
      </div>
      <div class="trendLabels"><span>${escapeHtml(pts[0].label)}</span><span>${escapeHtml(pts[pts.length-1].label)}</span></div>
      <div class="chartStats">
        <div class="chartStat"><span>${state.lang==="en"?"Minimum":"Мінімум"}</span><strong>${labelValue(min)}${unit?` ${unit}`:""}</strong></div>
        <div class="chartStat"><span>${state.lang==="en"?"Average":"Середнє"}</span><strong>${labelValue(values.reduce((a,v)=>a+v,0)/values.length)}${unit?` ${unit}`:""}</strong></div>
        <div class="chartStat"><span>${state.lang==="en"?"Maximum":"Максимум"}</span><strong>${labelValue(max)}${unit?` ${unit}`:""}</strong></div>
      </div>
    `;
  }

  function drawAllVolumeBars(workouts){
    const box = $("#chartAllVol");
    if (!box) return;
    const points = [...workouts].reverse().map(w=>({
      value:volumeInWorkouts([w]),
      label:fmtDate(w.date)
    }));
    box.innerHTML = trendMarkup(points,{
      color:"#a78bfa",
      unit:"kg",
      format:fmtVol,
      pointFormat:fmtVol,
      caption:state.lang==="en" ? "Volume of latest workout" : "Обʼєм останнього тренування"
    });
  }

  function drawMusclePie(workouts){
    const box = $("#chartMusclePie");
    if (!box) return;
    const totals = {};
    for (const w of workouts){
      for (const it of (w.items||[])){
        const ex = state.exercises.find(e=>e.id===it.exerciseId);
        const cat = ex?.category || "other";
        totals[cat] = (totals[cat]||0) + volumeOfSets(it.sets);
      }
    }

    const entries = Object.entries(totals).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    if (!entries.length) return void (box.innerHTML = `<div class="muted">${t("noData")}</div>`);
    const total = entries.reduce((a,[,v])=>a+v,0);
    const colors = [
      ["#8b5cf6","#c4b5fd","rgba(139,92,246,.45)"],
      ["#0891b2","#67e8f9","rgba(34,211,238,.4)"],
      ["#db2777","#f9a8d4","rgba(251,113,133,.38)"],
      ["#d97706","#fde68a","rgba(251,191,36,.38)"],
      ["#059669","#6ee7b7","rgba(52,211,153,.38)"],
      ["#2563eb","#93c5fd","rgba(96,165,250,.38)"],
      ["#7c3aed","#ddd6fe","rgba(167,139,250,.38)"]
    ];
    box.innerHTML = `
      <div class="chartHeader">
        <div><div class="muted">${state.lang==="en" ? "Total load" : "Сумарне навантаження"}</div><div class="chartBig">${fmtVol(total)} <small style="font-size:.48em;color:var(--muted)">kg</small></div></div>
      </div>
      <div class="distribution">
        ${entries.map(([cat,v],i)=>{
          const pct = Math.round(v/total*100);
          const palette = colors[i%colors.length];
          return `<div class="distRow">
            <div class="distName">${escapeHtml(catName(cat))}<small>${fmtVol(v)} kg</small></div>
            <div class="distTrack"><span class="distFill" style="width:${Math.max(2,pct)}%;--bar-color:${palette[0]};--bar-color-light:${palette[1]};--bar-glow:${palette[2]}"></span></div>
            <div class="distValue" title="${fmtVol(v)} kg">${pct}%</div>
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderStatsExercisesOnlyTrained(){
    const box = $("#statsExList");
    const detail = $("#detailBox");
    if (!box) return;
    if (detail) detail.innerHTML = "";

    const flat = allLogsFlat();
    if (!flat.length){
      box.innerHTML = `<div class="muted">${t("noData")}</div>`;
      return;
    }

    const map = new Map();
    for (const l of flat){
      const ts = new Date(l.date).getTime();
      const cur = map.get(l.exerciseId) || { lastTs:0, count:0, vol:0 };
      cur.lastTs = Math.max(cur.lastTs, ts);
      cur.count += 1;
      cur.vol += volumeOfSets(l.sets);
      map.set(l.exerciseId, cur);
    }

    const list = state.exercises
      .filter(ex => map.has(ex.id))
      .sort((a,b)=>{
        const fa = isFav(a.id)?1:0;
        const fb = isFav(b.id)?1:0;
        if (fa!==fb) return fb-fa;
        return (map.get(b.id).lastTs - map.get(a.id).lastTs);
      });

    box.innerHTML = list.map(ex=>{
      const m = map.get(ex.id);
      const prW = exercisePRValue(ex);
      return `
        <div class="itemRow statsExerciseRow">
          <div class="left">
            ${exIcon(ex)}
            <div class="statsExerciseInfo">
              <div class="titleLine statsExerciseTitle"><strong>${escapeHtml(exName(ex))}</strong></div>
              <div class="muted statsExerciseMeta">${catName(ex.category)} • ${trackingLabel(ex)} • PR: <span class="prText">${fmtNum(prW)} ${primaryUnit(ex)}</span> • ${m.count}x</div>
            </div>
          </div>
          <div class="statsExerciseActions">
            <button class="btn" data-fav="${ex.id}">${isFav(ex.id)?"⭐":"☆"}</button>
            <button class="btn primary" data-open="${ex.id}">${t("open")}</button>
          </div>
        </div>
      `;
    }).join("");

    box.querySelectorAll("[data-fav]").forEach(b=>{
      b.onclick = ()=>{
        toggleFav(b.getAttribute("data-fav"));
        renderStatsExercisesOnlyTrained();
      };
    });

    box.querySelectorAll("[data-open]").forEach(b=>{
      b.onclick = ()=>{
        selectedStatsExerciseId = b.getAttribute("data-open");
        renderExerciseDetail();
        $("#detailBox")?.scrollIntoView?.({ behavior:"smooth", block:"start" });
      };
    });
  }

  function renderExerciseDetail(){
    const box = $("#detailBox");
    if (!box) return;
    box.innerHTML = "";
    if (!selectedStatsExerciseId) return;

    const ex = state.exercises.find(e=>e.id===selectedStatsExerciseId);
    if (!ex) return;

    const flat = allLogsFlat()
      .filter(l=>l.exerciseId===selectedStatsExerciseId)
      .sort((a,b)=> new Date(a.date)-new Date(b.date));
    if(exerciseTracking(ex)!=="strength"){
      renderMetricExerciseDetail(box,ex,flat);
      return;
    }

    const name = exName(ex);
    const cat = catName(ex.category);

    const trainings = flat.length;
    const setsTotal = flat.reduce((a,l)=>a + (l.sets?.length||0), 0);
    const repsTotal = flat.reduce((a,l)=>a + (l.sets||[]).reduce((x,s)=> x + parseNum(s.reps), 0), 0);

    const prObj = state.prs?.[ex.id] || { weight:0, reps:0, date:null };
    const prW = parseNum(prObj.weight || 0);

    const allSetWeights = flat.flatMap(l => (l.sets||[]).map(s => parseNum(s.weight))).filter(x=>x>0);
    const avgWeight = allSetWeights.length ? (allSetWeights.reduce((a,x)=>a+x,0) / allSetWeights.length) : 0;

    const totalVol = flat.reduce((a,l)=> a + volumeOfSets(l.sets), 0);

    const detail = document.createElement("div");
    detail.className = "card";
    detail.innerHTML = `
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${escapeHtml(name)}</h2>
          <div class="sub">${escapeHtml(cat)}</div>
        </div>
        <button class="btn" id="closeDetail" style="border-radius:50%; width:42px; height:42px; padding:0;">
          <span style="font-size:18px;">←</span>
        </button>
      </div>

      <div class="kpiGrid2">
        <div class="kpi gold"><div class="label">${state.lang==="en" ? "trainings" : "тренувань"}</div><div class="value">${trainings}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "sets" : "підходів"}</div><div class="value">${setsTotal}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "reps total" : "всього повторень"}</div><div class="value">${repsTotal}</div></div>
        <div class="kpi gold"><div class="label">${state.lang==="en" ? "max weight" : "макс. вага"}</div><div class="value">${fmtNum(prW)}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "avg weight" : "середня вага"}</div><div class="value sm">${fmtNum(avgWeight)} kg</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "total volume" : "Загальний об’єм"}</div><div class="value sm">${fmtVol(totalVol)} kg</div></div>
      </div>

      <div class="sectionCard">
        <div class="sectionTitle">${t("weightProgress")}</div>
        <div class="chartSurface" id="chartWeight"></div>
      </div>

      <div class="sectionCard">
        <div class="sectionTitle">${t("volumeProgress")}</div>
        <div class="chartSurface" id="chartVolume"></div>
      </div>

      <div class="sectionCard">
        <div class="sectionTitle">${t("history")}</div>
        <div class="row" style="flex-direction:column; align-items:stretch; gap:12px" id="historyList"></div>
      </div>
    `;

    box.appendChild(detail);

    setTimeout(()=>{
      const back = $("#closeDetail");
      if (back) back.onclick = ()=>{
        selectedStatsExerciseId = null;
        box.innerHTML = "";
      };

      const list = $("#historyList");
      if (list){
        if (!flat.length){
          list.innerHTML = `<div class="muted">${t("noData")}</div>`;
        } else {
          list.innerHTML = flat.slice(-60).reverse().map(l=>{
            const mw = maxWeightOfSets(l.sets);
            const vol = volumeOfSets(l.sets);
            const isThisPR = (mw >= prW && prW > 0);

            const chips = (l.sets||[]).map(s=>{
              const reps = fmtNum(s.reps);
              const w = fmtNum(s.weight);
              const cls = (parseNum(s.weight)===prW && prW>0) ? "chip pr" : "chip";
              return `<span class="${cls}">${w}kg × ${reps}</span>`;
            }).join("");

            return `
              <div class="histItem">
                <div class="histTop">
                  <div>
                    <div class="histDate">${fmtDate(l.date)}</div>
                    <div class="chips">${chips}</div>
                  </div>
                </div>
                <div class="histBottom">
                  <div class="histLeftBig">${fmtNum(mw)} kg ${isThisPR ? `<span class="prText">${t("pr")}</span>` : ""}</div>
                  <div class="histRight">${Math.round(vol)} kg</div>
                </div>
              </div>
            `;
          }).join("");
        }
      }

      drawWeightChart(flat);
      drawVolumeBars(flat);
    },0);
  }

  function drawWeightChart(logs){
    const box = $("#chartWeight");
    if (!box) return;
    box.innerHTML = trendMarkup(logs.map(l=>({
      value:maxWeightOfSets(l.sets),
      label:fmtDate(l.date)
    })),{
      color:"#fbbf24",
      unit:"kg",
      caption:state.lang==="en" ? "Working weight" : "Робоча вага"
    });
  }

  function renderMetricExerciseDetail(box,ex,flat){
    const type=exerciseTracking(ex);
    const unit=primaryUnit(ex);
    const sets=flat.flatMap(log=>log.sets||[]);
    const best=maxPrimaryOfSets(ex,sets);
    const total=sets.reduce((sum,set)=>sum+primarySetValue(ex,set),0);
    const secondary=type==="distance"
      ? sets.reduce((sum,set)=>sum+parseNum(set.duration),0)
      : 0;
    const points=flat.map(log=>({
      value:maxPrimaryOfSets(ex,log.sets),
      label:fmtDate(log.date)
    }));
    const detail=document.createElement("div");
    detail.className="card";
    detail.innerHTML=`
      <div class="detailHeader">
        <div class="detailTitle"><h2>${escapeHtml(exName(ex))}</h2><div class="sub">${escapeHtml(catName(ex.category))} • ${trackingLabel(ex)}</div></div>
        <button class="btn" id="closeDetail" style="border-radius:50%;width:42px;height:42px;padding:0">←</button>
      </div>
      <div class="kpiGrid2">
        <div class="kpi gold"><div class="label">${state.lang==="en"?"trainings":"тренувань"}</div><div class="value">${flat.length}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en"?"entries":"підходів"}</div><div class="value">${sets.length}</div></div>
        <div class="kpi gold"><div class="label">${state.lang==="en"?"personal best":"особистий рекорд"}</div><div class="value sm">${fmtNum(best)} ${unit}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en"?"total":"загалом"}</div><div class="value sm">${fmtNum(total)} ${unit}</div></div>
        ${type==="distance"?`<div class="kpi"><div class="label">${state.lang==="en"?"total time":"загальний час"}</div><div class="value sm">${fmtNum(secondary)} ${state.lang==="en"?"min":"хв"}</div></div>`:""}
      </div>
      <div class="sectionCard"><div class="sectionTitle">${state.lang==="en"?"Progress":"Прогрес"}</div><div class="chartSurface">${trendMarkup(points,{color:type==="distance"?"#22d3ee":"#a78bfa",unit,caption:trackingLabel(ex)})}</div></div>
      <div class="sectionCard"><div class="sectionTitle">${t("history")}</div><div class="row" style="flex-direction:column;align-items:stretch;gap:12px">
        ${flat.length?flat.slice(-60).reverse().map(log=>`
          <div class="histItem">
            <div class="histDate">${fmtDate(log.date)}</div>
            <div class="chips">${(log.sets||[]).map(set=>`<span class="chip">${formatExerciseSet(ex,set)}</span>`).join("")}</div>
            <div class="histBottom"><div class="histLeftBig">${fmtNum(maxPrimaryOfSets(ex,log.sets))} ${unit}</div></div>
          </div>`).join(""):`<div class="muted">${t("noData")}</div>`}
      </div></div>`;
    box.appendChild(detail);
    detail.querySelector("#closeDetail").onclick=()=>{selectedStatsExerciseId=null;box.innerHTML="";};
  }

  function drawVolumeBars(logs){
    const box = $("#chartVolume");
    if (!box) return;
    box.innerHTML = trendMarkup(logs.map(l=>({
      value:volumeOfSets(l.sets),
      label:fmtDate(l.date)
    })),{
      color:"#22d3ee",
      unit:"kg",
      format:fmtVol,
      pointFormat:fmtVol,
      caption:state.lang==="en" ? "Exercise volume" : "Обʼєм вправи"
    });
  }

  // ---------- BODY ----------
  function isoToday(){
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function parseDateInput(v){
    // expects YYYY-MM-DD
    if (!v) return new Date().toISOString();
    const d = new Date(v + "T12:00:00");
    return Number.isFinite(d.getTime()) ? d.toISOString() : new Date().toISOString();
  }

  function viewBody(){
    const el = document.createElement("div");

    el.appendChild(card(`
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("body")}</h2>
          <div class="sub">${state.lang==="en" ? "Weight + measurements" : "Вага + об’єми"}</div>
        </div>
      </div>

      <div class="sectionCard" style="margin-top:12px">
        <div class="sectionTitle">${t("addMeasure")}</div>
        <div class="bodyGrid bodyMeasureGrid">
          <div class="bodyField bodyDateField">
            <div class="muted">${t("bodyDate")}</div>
            <input id="bDate" class="btn" type="date" value="${isoToday()}" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyWeight")}</div>
            <input id="bWeight" class="btn" inputmode="decimal" placeholder="90.5" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyForearm")}</div>
            <input id="bForearm" class="btn" inputmode="decimal" placeholder="—" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyChest")}</div>
            <input id="bChest" class="btn" inputmode="decimal" placeholder="—" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyWaist")}</div>
            <input id="bWaist" class="btn" inputmode="decimal" placeholder="—" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyLegs")}</div>
            <input id="bLegs" class="btn" inputmode="decimal" placeholder="—" />
          </div>
          <div class="bodyActions">
            <button class="btn primary" id="bSave">💾 ${t("save")}</button>
          </div>
        </div>
      </div>
    `));

    el.appendChild(card(`
      <div class="sectionTitle" style="margin:0 0 10px">${t("bodyProgress")}</div>
      <div class="bodyCharts">
        <div class="bodyTrendCard primary" id="chartBodyWeight"></div>
        <div class="bodyTrendCard" id="chartBodyForearm"></div>
        <div class="bodyTrendCard" id="chartBodyChest"></div>
        <div class="bodyTrendCard" id="chartBodyWaist"></div>
        <div class="bodyTrendCard" id="chartBodyLegs"></div>
      </div>
    `));

    el.appendChild(card(`
      <div class="sectionTitle" style="margin:0 0 10px">${t("bodyHistory")}</div>
      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px" id="bodyHist"></div>
    `));

    setTimeout(()=>{
      const saveBtn = $("#bSave");
      if (saveBtn) saveBtn.onclick = ()=>{
        const date = parseDateInput($("#bDate")?.value);
        const entry = {
          id: uid(),
          createdAt: Date.now(),   // <-- додай це
          date,
          weight: parseNum($("#bWeight")?.value),
          forearm: parseNum($("#bForearm")?.value),
          chest: parseNum($("#bChest")?.value),
          waist: parseNum($("#bWaist")?.value),
          legs: parseNum($("#bLegs")?.value),
        };
        // allow saving even if only weight is filled
        if (!(entry.weight>0 || entry.forearm>0 || entry.chest>0 || entry.waist>0 || entry.legs>0)) return;
        state.body.unshift(entry);
        save();
        render();
      };

      renderBodyHistory();
      drawBodyAll();
    },0);

    return el;
  }

  function bodySortedAsc(){
    return [...(state.body||[])]
      .filter(x => x && x.date)
      .sort((a,b)=>{
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        if (da !== db) return da - db;

        // якщо однакова дата — сортуємо за порядком додавання
        const ca = Number(a.createdAt || 0);
        const cb = Number(b.createdAt || 0);
        if (ca !== cb) return ca - cb;

        // fallback, якщо нема createdAt (старі записи)
        return String(a.id || "").localeCompare(String(b.id || ""));
      });
  }

  function renderBodyHistory(){
    const box = $("#bodyHist");
    if (!box) return;
    const list = [...(state.body||[])];
    if (!list.length){
      box.innerHTML = `<div class="muted">${t("noData")}</div>`;
      return;
    }

    box.innerHTML = list.slice(0, 40).map(m=>{
      const parts = [];
      if (m.weight>0) parts.push(`⚖️ ${fmtNum(m.weight)}kg`);
      if (m.forearm>0) parts.push(`🦾 ${fmtNum(m.forearm)}cm`);
      if (m.chest>0) parts.push(`🫁 ${fmtNum(m.chest)}cm`);
      if (m.waist>0) parts.push(`⭕ ${fmtNum(m.waist)}cm`);
      if (m.legs>0) parts.push(`🦵 ${fmtNum(m.legs)}cm`);
      return `
        <div class="itemRow">
          <div class="left">
            <div class="exIconWrap" style="background: rgba(167,139,250,.12); border-color: rgba(167,139,250,.18);">
              📏
            </div>
            <div style="min-width:0">
              <div class="titleLine"><strong>${fmtDate(m.date)}</strong></div>
              <div class="muted" style="white-space:normal">${parts.join(" • ")}</div>
            </div>
          </div>
          <div class="row">
            <button class="btn" data-delm="${m.id}">🗑</button>
          </div>
        </div>
      `;
    }).join("");

    box.querySelectorAll("[data-delm]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.getAttribute("data-delm");
        if (!id) return;
        if (!confirm(t("confirmDeleteMeasure"))) return;
        state.body = (state.body||[]).filter(x=>x.id!==id);
        save();
        render();
      };
    });
  }

  function drawBodyAll(){
    const data = bodySortedAsc();
    const wPts = data.filter(x=>x.weight>0).map(x=>({ y:x.weight, label: fmtDate(x.date) }));
    const fPts = data.filter(x=>x.forearm>0).map(x=>({ y:x.forearm, label: fmtDate(x.date) }));
    const cPts = data.filter(x=>x.chest>0).map(x=>({ y:x.chest, label: fmtDate(x.date) }));
    const waPts = data.filter(x=>x.waist>0).map(x=>({ y:x.waist, label: fmtDate(x.date) }));
    const lPts = data.filter(x=>x.legs>0).map(x=>({ y:x.legs, label: fmtDate(x.date) }));

    drawSimpleLineWithLabels("chartBodyWeight", wPts, "rgba(255, 200, 87, .95)");
    drawSimpleLineWithLabels("chartBodyForearm", fPts, "rgba(94, 234, 212, .95)");
    drawSimpleLineWithLabels("chartBodyChest", cPts, "rgba(167, 139, 250, .95)");
    drawSimpleLineWithLabels("chartBodyWaist", waPts, "rgba(251, 113, 133, .95)");
    drawSimpleLineWithLabels("chartBodyLegs", lPts, "rgba(255, 200, 87, .95)");
  }

  function drawSimpleLineWithLabels(canvasId, pts, stroke){
    const box = $("#"+canvasId);
    if (!box) return;
    const meta = {
      chartBodyWeight: { icon:"⚖️", ua:"Вага", en:"Weight", unit:"kg" },
      chartBodyForearm: { icon:"🦾", ua:"Передпліччя", en:"Forearm", unit:"cm" },
      chartBodyChest: { icon:"◫", ua:"Груди", en:"Chest", unit:"cm" },
      chartBodyWaist: { icon:"◎", ua:"Талія", en:"Waist", unit:"cm" },
      chartBodyLegs: { icon:"◒", ua:"Ноги", en:"Legs", unit:"cm" }
    }[canvasId];
    if (!pts || !pts.length){
      box.innerHTML = `<div class="bodyTrendName">${meta.icon} ${state.lang==="en"?meta.en:meta.ua}</div><div class="muted" style="margin-top:12px">${t("noData")}</div>`;
      return;
    }
    const data = recentPoints(pts.map(p=>({value:p.y,label:p.label})),8);
    const values = data.map(p=>p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1,max-min);
    const coords = data.map((p,i)=>({
      x:data.length===1?50:3+(94*i/(data.length-1)),
      y:78-((p.value-min)/span)*36
    }));
    const line = coords.map(p=>`${p.x},${p.y}`).join(" ");
    const area = `3,84 ${line} 97,84`;
    const last = values[values.length-1];
    const delta = last-values[0];
    const labelStep = data.length > 6 ? 2 : 1;
    box.innerHTML = `
      <div class="bodyTrendTop">
        <div>
          <div class="bodyTrendName">${meta.icon} ${state.lang==="en"?meta.en:meta.ua}</div>
          <div class="bodyTrendValue">${fmtNum(last)} <small style="font-size:.48em;color:var(--muted)">${meta.unit}</small></div>
        </div>
        ${values.length>1?`<div class="chartDelta ${delta<0?"down":""}">${delta>=0?"+":""}${fmtNum(delta)}</div>`:""}
      </div>
      <div class="miniPlotArea">
      <svg class="miniTrend" viewBox="0 0 100 92" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="${canvasId}Fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stroke}" stop-opacity=".28"/><stop offset="1" stop-color="${stroke}" stop-opacity="0"/></linearGradient></defs>
        <path d="M3 84H97" stroke="rgba(255,255,255,.07)" stroke-width=".8" vector-effect="non-scaling-stroke"/>
        <polygon points="${area}" fill="url(#${canvasId}Fill)"/>
        <polyline points="${line}" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
        ${coords.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="${i===coords.length-1?2.7:1.3}" fill="${stroke}" stroke="#111827" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join("")}
      </svg>
        ${coords.map((p,i)=>{
          if (i%labelStep!==0 && i!==coords.length-1) return "";
          const edge = i===0 ? "edgeStart" : i===coords.length-1 ? "edgeEnd" : "";
          return `<span class="plotLabel ${edge} ${i===coords.length-1?"last":""}" style="left:${p.x}%;top:${Math.max(20,p.y-7)}%">${escapeHtml(fmtNum(values[i]))}</span>`;
        }).join("")}
      </div>
      <div class="trendLabels"><span>${escapeHtml(data[0].label)}</span><span>${escapeHtml(data[data.length-1].label)}</span></div>`;
  }

  // ---------- RECORDS ----------
  function viewRecords(){
    const el = document.createElement("div");

    el.appendChild(card(`
      <div style="text-align:center; padding:8px 0 2px">
        <div style="width:64px;height:64px;border-radius:999px;display:inline-grid;place-items:center;
                    background: rgba(255,200,87,.14); border:1px solid rgba(255,200,87,.18); margin-bottom:10px;">
          🏆
        </div>
        <div style="font-size:22px; font-weight:900;">${state.lang==="en" ? "Personal records" : "Особисті рекорди"}</div>
        <div class="muted" id="recCount" style="margin-top:4px"></div>
      </div>

      <div class="filters" id="recCats"></div>
      <div class="row" style="justify-content:flex-end; margin-top:10px">
        <button class="btn" id="clearPrBtn">🗑 ${state.lang==="en" ? "Clear records" : "Очистити рекорди"}</button>
      </div>
      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px; margin-top:12px" id="recList"></div>
    `));

    setTimeout(()=>{
      renderRecCats();
      renderRecList();
      const clearBtn = $("#clearPrBtn");
      if (clearBtn) clearBtn.onclick = ()=>{
        if (!Object.keys(state.prs || {}).length) return;
        if (!confirm(t("confirmClearRecords"))) return;
        state.prs = {};
        save();
        renderRecList();
      };
    },0);

    return el;
  }

  function renderRecCats(){
    const box = $("#recCats");
    if (!box) return;
    const active = state.ui.recordsCat || "all";
    box.innerHTML = CATEGORIES.map(c=>{
      const isA = c.id===active;
      return `<button class="fchip ${isA?"active":""}" data-rc="${c.id}">${state.lang==="ua"?c.ua:c.en}</button>`;
    }).join("");
    box.querySelectorAll("[data-rc]").forEach(b=>{
      b.onclick = ()=>{
        state.ui.recordsCat = b.getAttribute("data-rc");
        save();
        renderRecCats();
        renderRecList();
      };
    });
  }

  function renderRecList(){
    const box = $("#recList");
    const cnt = $("#recCount");
    if (!box) return;

    let list = Object.entries(state.prs || {})
      .map(([exerciseId, pr])=>{
        const ex = state.exercises.find(e=>e.id===exerciseId);
        if (!ex) return null;
        return { ex, pr };
      })
      .filter(Boolean);

    const active = state.ui.recordsCat || "all";
    if (active!=="all") list = list.filter(x=>x.ex.category===active);

    list.sort((a,b)=> exercisePRValue(b.ex) - exercisePRValue(a.ex));

    if (cnt) cnt.textContent = state.lang==="en"
      ? `${list.length} records set`
      : `${list.length} рекордів встановлено`;

    if (!list.length){
      box.innerHTML = `<div class="muted">${t("noData")}</div>`;
      return;
    }

    box.innerHTML = list.slice(0, 50).map((x, idx)=>{
      const pr = x.pr || {};
      const w = fmtNum(exercisePRValue(x.ex));
      const reps = fmtNum(pr.reps||0);
      const d = pr.date ? fmtDate(pr.date) : "—";
      const type=exerciseTracking(x.ex);
      const detail=type==="strength"
        ? `${reps} ${state.lang==="en" ? "reps" : "повт."}`
        : trackingLabel(x.ex);
      return `
        <div class="itemRow">
          <div class="left">
            <div class="exIconWrap" style="background: rgba(167,139,250,.12); border-color: rgba(167,139,250,.18);">
              <div style="font-weight:900; color: rgba(167,139,250,.95)">#${idx+1}</div>
            </div>
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(exName(x.ex))}</strong></div>
              <div class="muted">${d} • ${detail}</div>
            </div>
          </div>
          <div class="row" style="gap:10px; align-items:center">
            <div style="text-align:right">
              <div style="font-weight:900; font-size:26px; color: rgba(255,200,87,.95)">${w}</div>
              <div class="muted">${primaryUnit(x.ex)}</div>
            </div>
            <button class="btn" data-delpr="${x.ex.id}" title="${t("deleteMeasure")}">🗑</button>
          </div>
        </div>
      `;
    }).join("");

    box.querySelectorAll("[data-delpr]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.getAttribute("data-delpr");
        if (!id) return;
        if (!confirm(t("confirmDeleteMeasure"))) return;
        const copy = { ...(state.prs||{}) };
        delete copy[id];
        state.prs = copy;
        save();
        renderRecList();
      };
    });
  }

  // ---------- SETTINGS ----------
  function viewSettings(){
    const el = document.createElement("div");

    el.appendChild(card(`
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("settings")}</h2>
          <div class="sub">${state.lang==="en" ? "Data stored in browser (localStorage)" : "Дані зберігаються у браузері (localStorage)"}</div>
        </div>
      </div>

      <div class="row" style="margin-top:12px">
        <span class="pill">${t("lang")}</span>
        <button class="btn" id="langUa">UA</button>
        <button class="btn" id="langEn">EN</button>
      </div>

      <div class="row" style="margin-top:12px">
        <span class="pill">${t("defaultRest")}</span>
        <input id="defRest" class="btn" type="number" min="10" step="5" style="width:180px" value="${state.settings.defaultRestSec}">
        <button class="btn primary" id="saveSettings">${t("save")}</button>
      </div>

      <div class="row" style="margin-top:12px; flex-wrap:wrap;">
        <button class="btn" id="exportBtn">${t("export")}</button>
        <button class="btn" id="importBtn">${t("import")}</button>
        <button class="btn" id="resetBtn">${t("reset")}</button>
        <input id="importFile" type="file" accept="application/json" style="display:none" />
      </div>

      <div class="premiumNote" style="margin-top:16px">
        <strong>${state.lang==="en" ? "Local-first and compatible" : "Локально та сумісно"}</strong>
        <div style="margin-top:4px;font-size:13px;opacity:.86">${state.lang==="en"
          ? "Your existing gymPwaData_v3 export remains supported. Importing restores exercise IDs, workout history, PRs, favorites and body measurements."
          : "Старий експорт gymPwaData_v3 підтримується. Імпорт відновлює ID вправ, історію тренувань, PR, улюблені вправи та заміри тіла."}</div>
      </div>
    `));

    setTimeout(()=>{
      const ua = $("#langUa");
      const en = $("#langEn");
      if (ua) ua.onclick = ()=>{ state.lang="ua"; save(); render(); };
      if (en) en.onclick = ()=>{ state.lang="en"; save(); render(); };

      const saveBtn = $("#saveSettings");
      if (saveBtn) saveBtn.onclick = ()=>{
        const v = Math.max(10, parseInt($("#defRest")?.value || "90", 10));
        state.settings.defaultRestSec = v;
        rest.left = v;
        save();
        render();
      };

      const exportBtn = $("#exportBtn");
      if (exportBtn) exportBtn.onclick = ()=>{
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "gym-tracker-data.json";
        a.click();
        URL.revokeObjectURL(a.href);
      };

      const importBtn = $("#importBtn");
      const importFile = $("#importFile");
      if (importBtn && importFile) importBtn.onclick = ()=> importFile.click();

      if (importFile) importFile.onchange = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const txt = await file.text();
        try{
          const parsed = JSON.parse(txt);
          const importedState = parsed && typeof parsed === "object" && parsed.data && typeof parsed.data === "object"
            ? parsed.data
            : parsed;
          state = migrate(importedState);
          if (!state.exercises.length) state.exercises = DEFAULT_EXERCISES;
          save();
          resetRestTimer();
          render();
          alert(`${t("importOk")}\n${t("importSummary")}`);
        }catch{
          alert(t("importFail"));
        }
      };

      const resetBtn = $("#resetBtn");
      if (resetBtn) resetBtn.onclick = ()=>{
        if (!confirm(t("confirmReset"))) return;
        localStorage.removeItem(STORAGE_KEY);
        state = migrate(null);
        state.exercises = DEFAULT_EXERCISES;
        save();
        resetRestTimer();
        workoutSession = { active:false, startedAt:null, title:"", items:[] };
        selectedStatsExerciseId = null;
        render();
      };
    },0);

    return el;
  }

  // ---------- nav handlers (SAFE) ----------
  $$(".navBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const tab = btn.getAttribute("data-tab");
      if (tab) setTab(tab);
    });
  });

  const langBtn = $("#langBtn");
  if (langBtn){
    langBtn.onclick = ()=>{
      state.lang = (state.lang==="ua") ? "en" : "ua";
      save();
      render();
    };
  }

  // initial
  save();
  render();
});
