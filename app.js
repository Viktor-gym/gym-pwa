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
      volumeBarsHint: "Кожен стовпчик = одне тренування",
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
      volumeBarsHint: "Each bar = one workout",
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
      ui: { exCat:"all", exQ:"", statsRange:"week", recordsCat:"all" }
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
    if (!s.prs) s.prs = {};
    if (!s.settings) s.settings = { defaultRestSec: 90 };
    if (!s.ui) s.ui = { exCat:"all", exQ:"", statsRange:"week", recordsCat:"all" };
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
        category: String(ex.category || "other")
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
              reps: parseNum(set?.reps)
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

    { id: uid(), name_ua:"Підтягування", name_en:"Pull-ups", category:"back" },
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

    { id: uid(), name_ua:"Планка", name_en:"Plank", category:"core" },
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
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 10v4M7 9v6M17 9v6M20 10v4"/>
        <path d="M7 12h10"/>
      </svg>`;
  }

  function exerciseIconKind(ex){
    const name = (state.lang==="ua" ? ex.name_ua : ex.name_en).toLowerCase();
    if (name.includes("жим") && name.includes("леж")) return "bench";
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
    return `<div class="exIconWrap ${wrapCls}">${iconSvg(kind)}</div>`;
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
  function maxWeightOfSets(sets){
    return Math.max(0, ...(sets||[]).map(s=>parseNum(s.weight)));
  }
  function countSetsInWorkouts(workouts){
    return workouts.reduce((a,w)=> a + (w.items||[]).reduce((x,it)=> x + (it.sets?.length||0), 0), 0);
  }
  function volumeInWorkouts(workouts){
    return workouts.reduce((a,w)=> a + (w.items||[]).reduce((x,it)=> x + volumeOfSets(it.sets), 0), 0);
  }
  function activeDaysCount(workouts){
    const s = new Set(workouts.map(w=>fmtDate(w.date)));
    return s.size;
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
    const weekStart = startOfWeek(now);

    const weekWorkouts = state.workouts.filter(w => new Date(w.date) >= weekStart);
    const weekDays = activeDaysCount(weekWorkouts);
    const weekTrainings = weekWorkouts.length;
    const weekSets = countSetsInWorkouts(weekWorkouts);
    const weekVol = volumeInWorkouts(weekWorkouts);

    el.appendChild(card(`
      <div style="font-weight:900; font-size:18px; margin-bottom:10px;">${t("thisWeek")}</div>
      <div class="kpiGrid4">
        <div class="kpiBox kpiPurple">
          <div class="ico">📅</div>
          <div class="val">${weekDays}</div>
          <div class="lbl">${t("activeDays")}</div>
        </div>
        <div class="kpiBox kpiTeal">
          <div class="ico">🏋️</div>
          <div class="val">${weekTrainings}</div>
          <div class="lbl">${t("trainings")}</div>
        </div>
        <div class="kpiBox kpiPink">
          <div class="ico">🧱</div>
          <div class="val">${weekSets}</div>
          <div class="lbl">${t("sets")}</div>
        </div>
        <div class="kpiBox kpiGold">
          <div class="ico">🔥</div>
          <div class="val">${fmtVol(weekVol)}</div>
          <div class="lbl">${t("volume")}</div>
        </div>
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

    setTimeout(()=>{
      const btn = $("#homeStart");
      if (btn) btn.onclick = ()=>{
        setTab("workout");
        startWorkoutIfNeeded();
      };
      renderRecentWorkouts();
      renderFavStrip();
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
      return `
        <div class="itemRow" style="cursor:pointer" data-openw="${w.id}">
          <div class="left">
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(title)}</strong></div>
              <div class="muted">${fmtDate(w.date)}</div>
            </div>
          </div>
          <div style="font-weight:900; color: rgba(167,139,250,.95)">${fmtNum(maxW)} kg</div>
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
      const cnt = flat.filter(l=>l.exerciseId===ex.id).length;
      return `
        <div class="card" style="min-width:160px; margin:0; text-align:center;">
          <div style="display:flex; justify-content:center; margin-bottom:10px;">${exIcon(ex)}</div>
          <div style="font-weight:900; font-size:13px; line-height:1.2; height:32px; overflow:hidden;">
            ${escapeHtml(exName(ex))}
          </div>
          <div class="muted" style="margin-top:8px">${cnt} ${t("times")}</div>
        </div>
      `;
    }).join("");
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

      const setsHtml = (it.sets||[]).map((s, idx)=>`
        <div class="setline" style="margin-top:8px">
          <span class="pill">#${idx+1}</span>

          <input type="text" inputmode="numeric"
            data-id="${it.id}" data-i="${idx}" data-k="reps"
            value="${escapeHtml(s.reps ?? "")}" placeholder="reps" />

          <input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="weight"
            value="${escapeHtml(s.weight ?? "")}" placeholder="kg" />

          <button class="btn" data-delset="${it.id}" data-i="${idx}">✖</button>
        </div>
      `).join("");

      const prW = parseNum(state.prs?.[ex?.id]?.weight ?? 0);

      return `
        <div class="card" style="margin-top:12px">
          <div class="row" style="justify-content:space-between; align-items:flex-start">
            <div class="left" style="min-width:0">
              ${ex ? exIcon(ex) : `<div class="exIconWrap">${iconSvg("dumbbell")}</div>`}
              <div style="min-width:0">
                <div class="titleLine"><strong>${escapeHtml(title)}</strong></div>
                <div class="muted">${catName(ex?.category || "")} • ${t("pr")}: ${fmtNum(prW)}</div>
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
        it.sets.push({ reps:"8", weight:"0" });
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
        const prW = parseNum(state.prs?.[ex.id]?.weight ?? 0);
        return `
          <div class="itemRow">
            <div class="left">
              ${exIcon(ex)}
              <div style="min-width:0">
                <div class="titleLine"><strong>${escapeHtml(exName(ex))}</strong></div>
                <div class="muted">${catName(ex.category)} • PR: ${fmtNum(prW)}</div>
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

  function saveWorkoutSession(){
    const workoutId = uid();
    const date = workoutSession.startedAt || new Date().toISOString();

    let gotAnyPR = false;

    const items = workoutSession.items.map(it=>{
      const sets = (it.sets||[]).map(s=>({
        weight: parseNum(s.weight),
        reps: parseNum(s.reps)
      })).filter(s=>s.weight>0 && s.reps>0);

      const exId = it.exerciseId;

      // PR check
      const maxW = maxWeightOfSets(sets);
      const prev = parseNum(state.prs?.[exId]?.weight ?? 0);
      if (maxW > prev){
        const prSet = sets.find(s=>parseNum(s.weight)===maxW) || { reps: 0 };
        state.prs[exId] = { weight: maxW, reps: prSet.reps, date };
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

    state.workouts.unshift({ id: workoutId, date, title, items });
    save();

    workoutSession = { active:false, startedAt:null, title:"", items:[] };
    resetRestTimer();

    alert(gotAnyPR ? `${t("saveOk")} 🏆` : t("saveOk"));
    setTab("home");
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

    const itemsHtml = (w.items||[]).map(it=>{
      const ex = state.exercises.find(e=>e.id===it.exerciseId);
      const name = ex ? exName(ex) : "—";
      const chips = (it.sets||[]).map(s=>{
        return `<span class="chip">${fmtNum(s.weight)}kg × ${fmtNum(s.reps)}</span>`;
      }).join("");

      return `
        <div class="card" style="margin:10px 0 0">
          <div class="row" style="justify-content:space-between">
            <div class="left">
              ${ex ? exIcon(ex) : `<div class="exIconWrap">${iconSvg("dumbbell")}</div>`}
              <div>
                <div style="font-weight:900">${escapeHtml(name)}</div>
                <div class="muted">${catName(ex?.category||"")}</div>
              </div>
            </div>
            <div style="font-weight:900; color: rgba(167,139,250,.95)">${fmtNum(maxWeightOfSets(it.sets))} kg</div>
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
      const prW = parseNum(state.prs?.[ex.id]?.weight ?? 0);
      const lastTs = lastBy[ex.id] || 0;
      const lastTxt = lastTs ? fmtDate(new Date(lastTs)) : "—";
      return `
        <div class="itemRow">
          <div class="left">
            ${exIcon(ex)}
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(exName(ex))}</strong></div>
              <div class="muted">${catName(ex.category)} • PR: <span class="prText">${fmtNum(prW)}</span> • ${t("last")}: ${lastTxt}</div>
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
      if (!name_ua && !name_en) return;

      state.exercises.unshift({
        id: uid(),
        name_ua: name_ua || name_en,
        name_en: name_en || name_ua,
        category
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

      <div class="sectionCard">
        <div class="sectionTitle">${t("volumeProgress")}</div>
        <div class="canvasWrap"><canvas id="chartAllVol"></canvas></div>
        <div class="muted" style="margin-top:10px">${t("volumeBarsHint")}</div>
      </div>

      <div class="sectionCard">
        <div class="sectionTitle">${t("muscleSplit")} (${state.lang==="en" ? "pie" : "кругова"})</div>
        <div class="canvasWrap"><canvas id="chartMusclePie"></canvas></div>
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
    },0);

    return el;
  }

  function drawAllVolumeBars(workouts){
    const canvas = $("#chartAllVol");
    if (!canvas) return;
    const ctx = canvas.getContext?.("2d");
    if (!ctx) return;

    resizeCanvasToDisplaySize(canvas);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (!workouts.length){
      ctx.fillStyle = "rgba(229,231,235,.75)";
      ctx.font = "16px system-ui";
      ctx.fillText(t("noData"), 20, 40);
      return;
    }

    const pts = [...workouts].slice().reverse().map(w=>({
      v: volumeInWorkouts([w]),
      label: fmtDate(w.date)
    }));

    const padL=44, padR=16, padT=18, padB=34;
    const W = canvas.width - padL - padR;
    const H = canvas.height - padT - padB;
    const maxV = Math.max(1, ...pts.map(p=>p.v));

    ctx.strokeStyle = "rgba(255,255,255,.10)";
    for(let i=0;i<=4;i++){
      const y = padT + (H*i/4);
      ctx.beginPath();
      ctx.moveTo(padL,y);
      ctx.lineTo(padL+W,y);
      ctx.stroke();
    }

    const barW = Math.max(10, Math.min(44, W/(pts.length*1.6)));
    ctx.fillStyle = "rgba(167,139,250,.92)";

    pts.forEach((p,i)=>{
      const xCenter = padL + (W * (pts.length===1 ? 0.5 : i/(pts.length-1)));
      const h = H*(p.v/maxV);
      const x = xCenter - barW/2;
      const y = padT + (H - h);

      const r = 10;
      const rr = Math.min(r, barW/2, h/2);

      ctx.beginPath();
      ctx.moveTo(x+rr, y);
      ctx.arcTo(x+barW, y, x+barW, y+h, rr);
      ctx.arcTo(x+barW, y+h, x, y+h, rr);
      ctx.arcTo(x, y+h, x, y, rr);
      ctx.arcTo(x, y, x+barW, y, rr);
      ctx.closePath();
      ctx.fill();
    });

    ctx.fillStyle = "rgba(229,231,235,.70)";
    ctx.font = "12px system-ui";
    ctx.fillText("0", 14, padT+H);
    ctx.fillText(fmtVol(maxV), 6, padT+10);

    ctx.fillText(pts[0].label, padL, padT+H+24);
    if (pts.length>1){
      const last = pts[pts.length-1].label;
      const tw = ctx.measureText(last).width;
      ctx.fillText(last, padL + W - tw, padT+H+24);
    }
  }

  function drawMusclePie(workouts){
    const canvas = $("#chartMusclePie");
    if (!canvas) return;
    const ctx = canvas.getContext?.("2d");
    if (!ctx) return;

    resizeCanvasToDisplaySize(canvas);   // ✅ ДОДАТИ
    ctx.setTransform(1,0,0,1,0,0);        // ✅ ДОДАТИ
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const totals = {};
    for (const w of workouts){
      for (const it of (w.items||[])){
        const ex = state.exercises.find(e=>e.id===it.exerciseId);
        const cat = ex?.category || "other";
        totals[cat] = (totals[cat]||0) + volumeOfSets(it.sets);
      }
    }

    const entries = Object.entries(totals).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    if (!entries.length){
      ctx.fillStyle = "rgba(229,231,235,.75)";
      ctx.font = "16px system-ui";
      ctx.fillText(t("noData"), 20, 40);
      return;
    }

    const total = entries.reduce((a,[,v])=>a+v,0);
    const w = canvas.width;
    const h = canvas.height;

    const cx = Math.min(180, w * 0.22);
    const cy = h / 2;
    const r  = Math.min(90, h * 0.35);

    let start = -Math.PI/2;

    entries.forEach(([cat, v], i)=>{
      const ang = (v/total) * Math.PI*2;
      const hue = (i * 360 / entries.length) % 360;

      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.9)`;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + ang);
      ctx.closePath();
      ctx.fill();

      start += ang;
    });

    ctx.font = "14px system-ui";
    ctx.fillStyle = "rgba(229,231,235,.9)";
    const lx = 300;
    let ly = 50;

    entries.forEach(([cat, v], i)=>{
      const pct = Math.round((v/total)*100);
      const hue = (i * 360 / entries.length) % 360;

      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.9)`;
      ctx.fillRect(lx, ly-12, 14, 14);

      ctx.fillStyle = "rgba(229,231,235,.9)";
      ctx.fillText(`${catName(cat)} — ${pct}%`, lx + 22, ly);
      ly += 26;
    });
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
      const prW = parseNum(state.prs?.[ex.id]?.weight ?? 0);
      return `
        <div class="itemRow">
          <div class="left">
            ${exIcon(ex)}
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(exName(ex))}</strong></div>
              <div class="muted">${catName(ex.category)} • PR: <span class="prText">${fmtNum(prW)}</span> • ${m.count}x</div>
            </div>
          </div>
          <div class="row">
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
        <div class="canvasWrap"><canvas id="chartWeight" width="900" height="260"></canvas></div>
      </div>

      <div class="sectionCard">
        <div class="sectionTitle">${t("volumeProgress")}</div>
        <div class="canvasWrap"><canvas id="chartVolume" width="900" height="260"></canvas></div>
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
    const canvas = $("#chartWeight");
    if (!canvas) return;
    const ctx = canvas.getContext?.("2d");
    if (!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (!logs.length) return;

    const pts = logs.map(l=>({ y: maxWeightOfSets(l.sets), label: fmtDate(l.date) }));
    const padL=44, padR=16, padT=18, padB=34;
    const W = canvas.width-padL-padR;
    const H = canvas.height-padT-padB;
    const maxY = Math.max(1, ...pts.map(p=>p.y));

    ctx.strokeStyle="rgba(255,255,255,.10)";
    for(let i=0;i<=4;i++){
      const y = padT + (H*i/4);
      ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+W,y); ctx.stroke();
    }

    ctx.lineWidth=4;
    ctx.strokeStyle="rgba(255, 200, 87, .95)";

    ctx.beginPath();
    pts.forEach((p,i)=>{
      const x = padL + (W*(pts.length===1 ? 0.5 : i/(pts.length-1)));
      const y = padT + (H*(1 - p.y/maxY));
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();

    ctx.fillStyle="rgba(255, 200, 87, .95)";
    pts.forEach((p,i)=>{
      const x = padL + (W*(pts.length===1 ? 0.5 : i/(pts.length-1)));
      const y = padT + (H*(1 - p.y/maxY));
      ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
    });

    // value labels above points
    ctx.font = "12px system-ui";
    ctx.fillStyle = "rgba(229,231,235,.92)";
    pts.forEach((p,i)=>{
      const x = padL + (W*(pts.length===1 ? 0.5 : i/(pts.length-1)));
      const y = padT + (H*(1 - p.y/maxY));
      const txt = fmtNum(p.y);
      const tw = ctx.measureText(txt).width;
      ctx.fillText(txt, x - tw/2, y - 10);
    });

    ctx.fillStyle="rgba(229,231,235,.70)";
    ctx.font="12px system-ui";
    ctx.fillText("0", 14, padT+H);
    ctx.fillText(String(Math.round(maxY)), 10, padT+10);

    ctx.fillText(pts[0].label, padL, padT+H+24);
    if (pts.length>1){
      const last = pts[pts.length-1].label;
      const tw = ctx.measureText(last).width;
      ctx.fillText(last, padL+W-tw, padT+H+24);
    }
  }

  function drawVolumeBars(logs){
    const canvas = $("#chartVolume");
    if (!canvas) return;
    const ctx = canvas.getContext?.("2d");
    if (!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (!logs.length) return;

    const pts = logs.map(l=>({ v: volumeOfSets(l.sets), label: fmtDate(l.date) }));

    const padL=44, padR=16, padT=18, padB=34;
    const W = canvas.width-padL-padR;
    const H = canvas.height-padT-padB;
    const maxV = Math.max(1, ...pts.map(p=>p.v));

    ctx.strokeStyle="rgba(255,255,255,.10)";
    for(let i=0;i<=4;i++){
      const y = padT + (H*i/4);
      ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+W,y); ctx.stroke();
    }

    const barW = Math.max(10, Math.min(42, W/(pts.length*1.6)));
    ctx.fillStyle="rgba(255, 200, 87, .95)";

    pts.forEach((p,i)=>{
      const xCenter = padL + (W*(pts.length===1 ? 0.5 : i/(pts.length-1)));
      const h = H*(p.v/maxV);
      const x = xCenter - barW/2;
      const y = padT + (H-h);

      const r=10;
      const rr = Math.min(r, barW/2, h/2);

      ctx.beginPath();
      ctx.moveTo(x+rr, y);
      ctx.arcTo(x+barW, y, x+barW, y+h, rr);
      ctx.arcTo(x+barW, y+h, x, y+h, rr);
      ctx.arcTo(x, y+h, x, y, rr);
      ctx.arcTo(x, y, x+barW, y, rr);
      ctx.closePath();
      ctx.fill();

      // label above bar
      ctx.font = "12px system-ui";
      ctx.fillStyle = "rgba(229,231,235,.92)";
      const txt = fmtVol(p.v);
      const tw = ctx.measureText(txt).width;
      ctx.fillText(txt, xCenter - tw/2, y - 10);

      ctx.fillStyle="rgba(255, 200, 87, .95)";
    });

    ctx.fillStyle="rgba(229,231,235,.70)";
    ctx.font="12px system-ui";
    ctx.fillText("0", 14, padT+H);
    ctx.fillText(fmtVol(maxV), 6, padT+10);

    ctx.fillText(pts[0].label, padL, padT+H+24);
    if (pts.length>1){
      const last = pts[pts.length-1].label;
      const tw = ctx.measureText(last).width;
      ctx.fillText(last, padL+W-tw, padT+H+24);
    }
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
        <div class="bodyGrid">
          <div class="bodyField">
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
      <div class="sectionCard">
        <div class="sectionTitle">⚖️ ${state.lang==="en" ? "Weight" : "Вага"}</div>
        <div class="canvasWrap"><canvas id="chartBodyWeight" width="900" height="260"></canvas></div>
      </div>
      <div class="sectionCard">
        <div class="sectionTitle">📏 ${state.lang==="en" ? "Forearm" : "Передпліччя"}</div>
        <div class="canvasWrap"><canvas id="chartBodyForearm" width="900" height="260"></canvas></div>
      </div>
      <div class="sectionCard">
        <div class="sectionTitle">📏 ${state.lang==="en" ? "Chest" : "Груди"}</div>
        <div class="canvasWrap"><canvas id="chartBodyChest" width="900" height="260"></canvas></div>
      </div>
      <div class="sectionCard">
        <div class="sectionTitle">📏 ${state.lang==="en" ? "Waist" : "Талія"}</div>
        <div class="canvasWrap"><canvas id="chartBodyWaist" width="900" height="260"></canvas></div>
      </div>
      <div class="sectionCard">
        <div class="sectionTitle">📏 ${state.lang==="en" ? "Legs" : "Ноги"}</div>
        <div class="canvasWrap"><canvas id="chartBodyLegs" width="900" height="260"></canvas></div>
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
    const canvas = $("#"+canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext?.("2d");
    if (!ctx) return;

    resizeCanvasToDisplaySize(canvas);   // ✅ ОЦЕ ГОЛОВНЕ
    ctx.setTransform(1,0,0,1,0,0);        // скинути трансформ
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (!pts || !pts.length){
      ctx.fillStyle = "rgba(229,231,235,.75)";
      ctx.font = "16px system-ui";
      ctx.fillText(t("noData"), 20, 40);
      return;
    }

    const padL=44, padR=16, padT=18, padB=34;
    const W = canvas.width-padL-padR;
    const H = canvas.height-padT-padB;
    const maxY = Math.max(1, ...pts.map(p=>p.y));
    const minY = Math.min(...pts.map(p=>p.y));
    const span = Math.max(1e-6, maxY - minY);

    ctx.strokeStyle="rgba(255,255,255,.10)";
    for(let i=0;i<=4;i++){
      const y = padT + (H*i/4);
      ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+W,y); ctx.stroke();
    }

    const xAt = (i)=> padL + (W*(pts.length===1 ? 0.5 : i/(pts.length-1)));
    const yAt = (val)=> padT + (H*(1 - (val-minY)/span));

    ctx.lineWidth=4;
    ctx.strokeStyle=stroke;
    ctx.beginPath();
    pts.forEach((p,i)=>{
      const x = xAt(i);
      const y = yAt(p.y);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();

    ctx.fillStyle=stroke;
    pts.forEach((p,i)=>{
      const x = xAt(i);
      const y = yAt(p.y);
      ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
    });

    // labels above points
    ctx.font = "12px system-ui";
    ctx.fillStyle = "rgba(229,231,235,.92)";
    pts.forEach((p,i)=>{
      const x = xAt(i);
      const y = yAt(p.y);
      const txt = fmtNum(p.y);
      const tw = ctx.measureText(txt).width;
      ctx.fillText(txt, x - tw/2, y - 10);
    });

    // x labels (first/last)
    ctx.fillStyle="rgba(229,231,235,.70)";
    ctx.fillText(pts[0].label, padL, padT+H+24);
    if (pts.length>1){
      const last = pts[pts.length-1].label;
      const tw = ctx.measureText(last).width;
      ctx.fillText(last, padL+W-tw, padT+H+24);
    }
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

    list.sort((a,b)=> parseNum(b.pr.weight) - parseNum(a.pr.weight));

    if (cnt) cnt.textContent = state.lang==="en"
      ? `${list.length} records set`
      : `${list.length} рекордів встановлено`;

    if (!list.length){
      box.innerHTML = `<div class="muted">${t("noData")}</div>`;
      return;
    }

    box.innerHTML = list.slice(0, 50).map((x, idx)=>{
      const pr = x.pr || {};
      const w = fmtNum(pr.weight||0);
      const reps = fmtNum(pr.reps||0);
      const d = pr.date ? fmtDate(pr.date) : "—";
      return `
        <div class="itemRow">
          <div class="left">
            <div class="exIconWrap" style="background: rgba(167,139,250,.12); border-color: rgba(167,139,250,.18);">
              <div style="font-weight:900; color: rgba(167,139,250,.95)">#${idx+1}</div>
            </div>
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(exName(x.ex))}</strong></div>
              <div class="muted">${d} • ${reps} ${state.lang==="en" ? "reps" : "повт."}</div>
            </div>
          </div>
          <div class="row" style="gap:10px; align-items:center">
            <div style="text-align:right">
              <div style="font-weight:900; font-size:26px; color: rgba(255,200,87,.95)">${w}</div>
              <div class="muted">kg</div>
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
