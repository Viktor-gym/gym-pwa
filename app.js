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
  const APP_STORAGE_KEY = "gymPwaApp_v4";

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
      customCategories: [],
      body: [],         // {id, date, weight, forearm, chest, waist, legs}
      goals: [],
      plannedWorkouts: [],
      workoutTemplates: [],
      recommendations: [],
      ui: { exCat:"all", exQ:"", statsRange:"week", homeRange:"week", recordsCat:"all", planCalendarView:"month", planCalendarCursor:new Date().toISOString().slice(0,10) }
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
    if (!Array.isArray(s.customCategories)) s.customCategories = [];
    if (!Array.isArray(s.body)) s.body = [];
    if (!Array.isArray(s.goals)) s.goals = [];
    if (!Array.isArray(s.plannedWorkouts)) s.plannedWorkouts = [];
    if (!Array.isArray(s.workoutTemplates)) s.workoutTemplates = [];
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
    s.customCategories = s.customCategories
      .filter(Boolean)
      .map(c=>({
        id:String(c.id || `custom-${uid()}`),
        ua:String(c.ua || c.name || "Інше"),
        en:String(c.en || c.name || c.ua || "Other"),
        tone:["purple","teal","pink","gold"].includes(c.tone) ? c.tone : "purple"
      }))
      .filter((c,index,list)=>c.id!=="all" && list.findIndex(x=>x.id===c.id)===index);

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

    s.workoutTemplates = s.workoutTemplates.filter(Boolean).map(template=>({
      id:String(template.id || `template-${uid()}`),
      title:String(template.title || (s.lang==="en" ? "Workout template" : "Шаблон тренування")),
      createdAt:Number(template.createdAt || Date.now()),
      items:(Array.isArray(template.items) ? template.items : []).map(item=>({
        exerciseId:String(item.exerciseId || "")
      })).filter(item=>item.exerciseId)
    })).filter(template=>template.items.length);

    s.plannedWorkouts = s.plannedWorkouts.filter(Boolean).map(plan=>({
      id:String(plan.id || `plan-${uid()}`),
      date:String(plan.date || new Date().toISOString().slice(0,10)),
      title:String(plan.title || (s.lang==="en" ? "Planned workout" : "Заплановане тренування")),
      templateId:plan.templateId ? String(plan.templateId) : "",
      status:["planned","started","completed","skipped"].includes(plan.status) ? plan.status : "planned",
      createdAt:Number(plan.createdAt || Date.now()),
      completedWorkoutId:plan.completedWorkoutId ? String(plan.completedWorkoutId) : "",
      items:(Array.isArray(plan.items) ? plan.items : []).map(item=>({
        exerciseId:String(item.exerciseId || "")
      })).filter(item=>item.exerciseId)
    })).filter(plan=>plan.items.length);

    return s;
  }

  function load(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try{ return JSON.parse(raw); } catch { return null; }
  }
  function loadAppShell(){
    const raw=localStorage.getItem(APP_STORAGE_KEY);
    if(!raw) return null;
    try{return JSON.parse(raw);}catch{return null;}
  }
  let appShell=null;
  function save(){
    if(!appShell) return;
    const profile=appShell.profiles.find(item=>item.id===appShell.activeProfileId);
    if(profile) profile.data=state;
    appShell.uiLang=state.lang;
    localStorage.setItem(APP_STORAGE_KEY,JSON.stringify(appShell));
    if(appShell.mode==="user") localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }

  function downloadJson(filename,payload){
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function safeFilePart(value){
    return String(value||"profile").trim().toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu,"-")
      .replace(/^-+|-+$/g,"")
      .slice(0,48) || "profile";
  }

  function activeExportProfile(){
    if(appShell.mode==="trainer") return activeProfile();
    return personalProfile();
  }

  function makeProfileExport(profile){
    const data=migrate(profile?.data || state);
    return {
      format:"gymPwaProfile_v1",
      exportedAt:new Date().toISOString(),
      profile:{
        id:profile?.id || "personal",
        role:profile?.role || "personal",
        name:profileDisplayName(profile),
        status:profile?.status || "active"
      },
      data
    };
  }

  function extractImportProfileData(parsed){
    if(parsed?.format==="gymPwaProfile_v1" && parsed.data) return parsed.data;
    if(parsed?.format==="gymPwaApp_v4" && parsed.app){
      const profiles=Array.isArray(parsed.app.profiles) ? parsed.app.profiles : [];
      if(profiles.length===1) return profiles[0].data;
      if(parsed.app.mode==="user"){
        const personal=profiles.find(profile=>profile.role==="personal") || profiles[0];
        if(personal?.data) return personal.data;
      }
      return null;
    }
    if(parsed && typeof parsed==="object" && parsed.data && typeof parsed.data==="object") return parsed.data;
    return parsed;
  }

  function exMergeKey(ex){
    return [
      String(ex?.name_ua||"").trim().toLowerCase(),
      String(ex?.name_en||"").trim().toLowerCase(),
      String(ex?.category||""),
      String(exerciseTracking(ex)||"strength")
    ].join("|");
  }

  function setFingerprint(set){
    return [parseNum(set?.weight),parseNum(set?.reps),parseNum(set?.duration),parseNum(set?.distance)].join(":");
  }

  function workoutFingerprint(workout){
    const items=(workout?.items||[]).map(item=>
      `${item.exerciseId}:${(item.sets||[]).map(setFingerprint).join(",")}`
    ).sort().join("|");
    return `${new Date(workout?.date||0).toISOString().slice(0,10)}|${String(workout?.title||"").trim().toLowerCase()}|${items}`;
  }

  function bodyFingerprint(measure){
    const day=new Date(measure?.date||0).toISOString().slice(0,10);
    return [day,parseNum(measure?.weight),parseNum(measure?.forearm),parseNum(measure?.chest),parseNum(measure?.waist),parseNum(measure?.legs)].join("|");
  }

  function goalFingerprint(goal){
    return [goal?.type,goal?.exerciseId||"",goal?.metric||"",parseNum(goal?.target),parseNum(goal?.start),Number(goal?.createdAt||0)].join("|");
  }

  function mergeProfileData(targetRaw,incomingRaw){
    const target=migrate(targetRaw);
    const incoming=migrate(incomingRaw);
    const stats={exercises:0,workouts:0,body:0,goals:0,categories:0};
    const exerciseIdMap=new Map();
    const byId=new Map(target.exercises.map(ex=>[ex.id,ex]));
    const byKey=new Map(target.exercises.map(ex=>[exMergeKey(ex),ex]));

    incoming.exercises.forEach(ex=>{
      const existing=byId.get(ex.id) || byKey.get(exMergeKey(ex));
      if(existing){
        exerciseIdMap.set(ex.id,existing.id);
        existing.trackingType=existing.trackingType || ex.trackingType;
        return;
      }
      const copy={...ex};
      if(byId.has(copy.id)) copy.id=uid();
      target.exercises.push(copy);
      byId.set(copy.id,copy);
      byKey.set(exMergeKey(copy),copy);
      exerciseIdMap.set(ex.id,copy.id);
      stats.exercises++;
    });

    const categoryIds=new Set(target.customCategories.map(cat=>cat.id));
    incoming.customCategories.forEach(cat=>{
      if(categoryIds.has(cat.id)) return;
      target.customCategories.push({...cat});
      categoryIds.add(cat.id);
      stats.categories++;
    });

    const workoutIds=new Set(target.workouts.map(workout=>workout.id));
    const workoutKeys=new Set(target.workouts.map(workoutFingerprint));
    incoming.workouts.forEach(workout=>{
      const copy={
        ...workout,
        items:(workout.items||[]).map(item=>({
          ...item,
          exerciseId:exerciseIdMap.get(item.exerciseId) || item.exerciseId,
          sets:(item.sets||[]).map(set=>({...set}))
        }))
      };
      const key=workoutFingerprint(copy);
      if(workoutKeys.has(key)) return;
      if(workoutIds.has(copy.id)) copy.id=uid();
      target.workouts.push(copy);
      workoutIds.add(copy.id);
      workoutKeys.add(key);
      stats.workouts++;
    });

    const bodyIds=new Set(target.body.map(measure=>measure.id));
    const bodyKeys=new Set(target.body.map(bodyFingerprint));
    incoming.body.forEach(measure=>{
      const copy={...measure};
      const key=bodyFingerprint(copy);
      if(bodyKeys.has(key)) return;
      if(bodyIds.has(copy.id)) copy.id=uid();
      target.body.push(copy);
      bodyIds.add(copy.id);
      bodyKeys.add(key);
      stats.body++;
    });

    const goalIds=new Set(target.goals.map(goal=>goal.id));
    const goalKeys=new Set(target.goals.map(goalFingerprint));
    incoming.goals.forEach(goal=>{
      const copy={...goal};
      if(copy.exerciseId) copy.exerciseId=exerciseIdMap.get(copy.exerciseId) || copy.exerciseId;
      const key=goalFingerprint(copy);
      if(goalKeys.has(key)) return;
      if(goalIds.has(copy.id)) copy.id=uid();
      target.goals.push(copy);
      goalIds.add(copy.id);
      goalKeys.add(key);
      stats.goals++;
    });

    target.favorites=[...new Set([...(target.favorites||[]),...(incoming.favorites||[]).map(id=>exerciseIdMap.get(id)||id)])]
      .filter(id=>target.exercises.some(ex=>ex.id===id));

    target.lang=state.lang;
    target.workouts.sort((a,b)=>new Date(b.date)-new Date(a.date));
    target.body.sort((a,b)=>new Date(b.date)-new Date(a.date));
    return {data:target,stats};
  }

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
  function freshProfileData(){
    const data=migrate(null);
    data.exercises=DEFAULT_EXERCISES.map(ex=>({...ex}));
    return data;
  }
  function normalizeAppShell(shell,legacy){
    const fallbackData=migrate(legacy);
    if(!fallbackData.exercises.length) fallbackData.exercises=DEFAULT_EXERCISES.map(ex=>({...ex}));
    const normalized=shell && typeof shell==="object" ? shell : {};
    normalized.version=4;
    normalized.mode=["user","trainer"].includes(normalized.mode) ? normalized.mode : null;
    normalized.uiLang=normalized.uiLang==="en"?"en":"ua";
    normalized.profiles=Array.isArray(normalized.profiles) ? normalized.profiles : [];
    normalized.profiles=normalized.profiles.filter(Boolean).map((profile,index)=>{
      const data=migrate(profile.data||profile);
      if(!data.exercises.length) data.exercises=DEFAULT_EXERCISES.map(ex=>({...ex}));
      return {
        id:String(profile.id||`profile-${uid()}`),
        name:String(profile.name||`Клієнт ${index+1}`),
        role:profile.role==="personal" || profile.id==="personal" ? "personal" : "client",
        status:profile.role==="personal" || profile.id==="personal" ? "active" : (profile.status==="paused"?"paused":"active"),
        data
      };
    });
    if(!normalized.profiles.length){
      normalized.profiles.push({id:"personal",name:"Мій прогрес",role:"personal",data:fallbackData});
    }
    if(!normalized.profiles.some(profile=>profile.role==="personal")){
      normalized.profiles[0].role="personal";
    }
    normalized.profiles.forEach(profile=>{
      if(profile.role==="personal") profile.name="Мій прогрес";
    });
    normalized.activeProfileId=normalized.activeProfileId==null ? null : String(normalized.activeProfileId);
    if(normalized.activeProfileId && !normalized.profiles.some(profile=>profile.id===normalized.activeProfileId)){
      normalized.activeProfileId=null;
    }
    const clientIds=new Set(normalized.profiles.filter(profile=>profile.role==="client").map(profile=>profile.id));
    normalized.appointments=Array.isArray(normalized.appointments)
      ? normalized.appointments.filter(Boolean).map(item=>({
          id:String(item.id||uid()),
          profileId:String(item.profileId||""),
          date:String(item.date||""),
          time:String(item.time||""),
          note:String(item.note||""),
          notified:Boolean(item.notified),
          updatedAt:Number(item.updatedAt||Date.now()),
          syncStatus:["local","pending","synced","error"].includes(item.syncStatus)?item.syncStatus:"local",
          externalEventId:item.externalEventId?String(item.externalEventId):null
        })).filter(item=>clientIds.has(item.profileId))
      : [];
    normalized.integrations={
      googleCalendar:{
        enabled:false,
        calendarId:null,
        lastSyncAt:null,
        ...(normalized.integrations?.googleCalendar||{})
      }
    };
    normalized.calendarOutbox=Array.isArray(normalized.calendarOutbox)?normalized.calendarOutbox.filter(Boolean):[];
    normalized.coachUi={
      calendarView:normalized.coachUi?.calendarView==="month"?"month":"week",
      calendarCursor:String(normalized.coachUi?.calendarCursor||new Date().toISOString().slice(0,10))
    };
    return normalized;
  }
  appShell=normalizeAppShell(loadAppShell(),load());
  if(appShell.mode==="trainer") appShell.activeProfileId=null;
  let state=(appShell.profiles.find(profile=>profile.id===appShell.activeProfileId)||appShell.profiles[0]).data;
  if(!appShell.activeProfileId) state.lang=appShell.uiLang;
  if (state.settings.derivedDataVersion !== 4) rebuildWorkoutDerivedData();

  function t(key){ return i18n[state.lang]?.[key] || key; }
  function allCategories(){
    const custom=Array.isArray(state.customCategories) ? state.customCategories : [];
    return [...CATEGORIES,...custom.filter(c=>!CATEGORIES.some(base=>base.id===c.id))];
  }
  function catName(id){
    const c = allCategories().find(x=>x.id===id);
    return state.lang==="ua" ? (c?.ua||id) : (c?.en||id);
  }
  function catTone(id){
    const c = allCategories().find(x=>x.id===id);
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

  function activeProfile(){
    return appShell.profiles.find(profile=>profile.id===appShell.activeProfileId) || null;
  }
  function personalProfile(){
    return appShell.profiles.find(profile=>profile.role==="personal") || appShell.profiles[0];
  }
  function clientProfiles(status="active"){
    return appShell.profiles.filter(profile=>profile.role==="client" && (!status || profile.status===status));
  }
  function profileDisplayName(profile){
    if(profile?.role==="personal") return state.lang==="en" ? "My progress" : "Мій прогрес";
    return profile?.name || (state.lang==="en"?"Client":"Клієнт");
  }

  function resetTransientSession(){
    workoutSession={active:false,startedAt:null,title:"",workoutId:null,planId:null,items:[]};
    selectedStatsExerciseId=null;
    if(typeof resetRestTimer==="function") resetRestTimer();
    publishWorkoutToNative("reset");
  }

  function switchProfile(profileId,targetTab="home"){
    const next=appShell.profiles.find(profile=>profile.id===profileId);
    if(!next) return;
    if(workoutSession?.active && workoutSession.items?.length && !confirm(state.lang==="en"
      ? "Switch client and discard the unsaved workout?"
      : "Перемкнути клієнта й очистити незбережене тренування?")) return;
    const current=activeProfile();
    if(current) current.data=state;
    appShell.activeProfileId=next.id;
    state=migrate(next.data);
    next.data=state;
    resetTransientSession();
    currentTab=targetTab;
    save();
    render();
  }

  function clearProfileSelection(){
    const current=activeProfile();
    if(current) current.data=state;
    appShell.activeProfileId=null;
    resetTransientSession();
    currentTab="coach";
    save();
    render();
  }

  // ---------- session ----------
  let currentTab = appShell.mode==="trainer" ? "coach" : "home";
  let selectedStatsExerciseId = null;

  let workoutSession = {
    active: false,
    startedAt: null,
    title: "",
    workoutId: null,
    planId: null,
    items: [] // [{id, exerciseId, sets:[{reps:"", weight:""}]}]
  };

  let rest = { left: state.settings.defaultRestSec, running:false, interval:null };

  function nativeWorkoutBridge(){
    return window.Capacitor?.Plugins?.GymWatchBridge || null;
  }

  function workoutNativeSnapshot(eventName="update"){
    const sessionItems = workoutSession.items || [];
    const currentItem = sessionItems[sessionItems.length-1] || null;
    const exercise = currentItem ? state.exercises.find(e=>e.id===currentItem.exerciseId) : null;
    const sets = currentItem?.sets || [];
    return {
      event:eventName,
      active:!!workoutSession.active,
      workoutId:workoutSession.workoutId || "",
      title:workoutSession.title || "",
      startedAt:workoutSession.startedAt || "",
      exercise:exercise ? exName(exercise) : "",
      currentExercise:exercise ? exName(exercise) : "",
      setNumber:sets.length ? sets.length : 0,
      currentSetIndex:sets.length ? sets.length : 0,
      restSeconds:rest.left,
      restLeft:rest.left,
      restRunning:rest.running,
      totalExercises:sessionItems.length,
      items:(workoutSession.items||[]).map(item=>{
        const itemExercise=state.exercises.find(e=>e.id===item.exerciseId);
        return {
          exerciseId:item.exerciseId,
          exercise:itemExercise?.name || "",
          metricType:exerciseTracking(itemExercise),
          sets:(item.sets||[]).map(set=>({
            reps:parseNum(set.reps),
            weight:parseNum(set.weight),
            duration:parseNum(set.duration),
            distance:parseNum(set.distance)
          }))
        };
      })
    };
  }

  function publishWorkoutToNative(eventName="update"){
    const bridge=nativeWorkoutBridge();
    if(!bridge?.updateWorkout) return;
    bridge.updateWorkout(workoutNativeSnapshot(eventName)).catch(()=>{});
  }

  function installNativeWorkoutListeners(){
    const bridge=nativeWorkoutBridge();
    if(!bridge?.addListener) return;
    bridge.addListener("watchWorkoutCommand",(payload)=>{
      const command=payload?.command;
      if(command==="pauseRest" && rest.running) stopRestTimer();
      if(command==="resumeRest" && !rest.running) runRestTimer(false);
      if(command==="finishWorkout" && workoutSession.items?.length) saveWorkoutSession();
      if(command==="requestSnapshot") publishWorkoutToNative("snapshot");
    }).catch(()=>{});
  }

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
    publishWorkoutToNative("timer");
  }

  function stopRestTimer(){
    if (rest.interval) clearInterval(rest.interval);
    rest.interval = null;
    rest.running = false;
    updateRestUI();
  }

  function runRestTimer(restart=false){
    if (rest.running && !restart) return stopRestTimer();
    if (rest.interval) clearInterval(rest.interval);
    if (restart || rest.left <= 0) rest.left = restDefault();
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
  function startRestTimer(){ runRestTimer(false); }
  function startAutomaticRestTimer(){ runRestTimer(true); }

  function resetRestTimer(){
    stopRestTimer();
    rest.left = restDefault();
    updateRestUI();
  }

  function setIsComplete(ex,set){
    const type=exerciseTracking(ex);
    if(type==="reps") return parseNum(set?.reps)>0;
    if(type==="time") return parseNum(set?.duration)>0;
    if(type==="distance") return parseNum(set?.distance)>0 && parseNum(set?.duration)>0;
    return parseNum(set?.weight)>0 && parseNum(set?.reps)>0;
  }

  function maybeStartRestForSet(item,index){
    const set=item?.sets?.[index];
    const ex=state.exercises.find(e=>e.id===item?.exerciseId);
    if(!set || !ex || !setIsComplete(ex,set) || set._restTriggered) return;
    set._restTriggered=true;
    startAutomaticRestTimer();
    publishWorkoutToNative("setCompleted");
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
    render();
  }

  function viewProfileRequired(){
    const el=document.createElement("div");
    el.appendChild(card(`
      <div class="profileRequired">
        <div class="profileRequiredIcon">◇</div>
        <h2>${state.lang==="en"?"Choose whose data to open":"Оберіть, чиї дані відкрити"}</h2>
        <p>${state.lang==="en"?"No trainer or client profile is selected, so this section is intentionally empty.":"Профіль тренера або клієнта не вибрано, тому цей розділ навмисно порожній."}</p>
        <button class="btn primary" id="chooseProfileBtn">${state.lang==="en"?"Open trainer dashboard":"Відкрити панель тренера"}</button>
      </div>`));
    setTimeout(()=>$("#chooseProfileBtn")?.addEventListener("click",()=>setTab("coach")),0);
    return el;
  }

  function render(){
    $$(".navBtn").forEach(b=>{
      b.classList.toggle("active", b.getAttribute("data-tab")===currentTab);
    });
    const langBtn = $("#langBtn");
    if (langBtn) langBtn.textContent = state.lang.toUpperCase();
    const profileBtn=$("#profileBtn");
    if(profileBtn){
      profileBtn.style.display=appShell.mode==="trainer" ? "" : "none";
      profileBtn.textContent=activeProfile()?`◉ ${profileDisplayName(activeProfile())}`:(state.lang==="en"?"Choose profile":"Обрати профіль");
      profileBtn.onclick=clearProfileSelection;
    }

    const app = $("#app");
    if (!app) return;
    app.innerHTML = "";

    if (currentTab==="coach") app.appendChild(viewCoach());
    else if(appShell.mode==="trainer" && !activeProfile() && currentTab!=="settings") app.appendChild(viewProfileRequired());
    else if (currentTab==="home") app.appendChild(viewHome());
    else if (currentTab==="workout") app.appendChild(viewWorkout());
    else if (currentTab==="exercises") app.appendChild(viewExercises());
    else if (currentTab==="stats") app.appendChild(viewStats());
    else if (currentTab==="body") app.appendChild(viewBody());
    else if (currentTab==="records") app.appendChild(viewRecords());
    else if (currentTab==="settings") app.appendChild(viewSettings());
  }

  function openModeSetup(force=false){
    if(appShell.mode && !force) return;
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`
      <div class="modePanel">
        <div class="brandEyebrow">${state.lang==="en"?"Choose workspace":"Оберіть режим роботи"}</div>
        <h2 style="font-size:30px;margin:8px 0 6px">${state.lang==="en"?"How will you use GymTracker?":"Як ви користуватиметесь GymTracker?"}</h2>
        <div class="muted">${state.lang==="en"?"Your existing workouts are preserved in either mode.":"Ваші наявні тренування збережуться в будь-якому режимі."}</div>
        <div class="modeChoices">
          <button class="modeChoice" data-mode="user"><div style="font-size:30px">◎</div><strong>${state.lang==="en"?"User":"Користувач"}</strong><span>${state.lang==="en"?"Your personal workouts, goals, body metrics and statistics.":"Особисті тренування, цілі, показники тіла та статистика, як зараз."}</span></button>
          <button class="modeChoice" data-mode="trainer"><div style="font-size:30px">◇</div><strong>${state.lang==="en"?"Trainer":"Тренер"}</strong><span>${state.lang==="en"?"Multiple independent clients, session planning and a shared calendar.":"Кілька незалежних клієнтів, планування занять і спільний календар."}</span></button>
        </div>
        <button class="btn" id="modeGuideBtn" style="width:100%;margin-top:12px">▤ ${state.lang==="en"?"How it works":"Як це працює"}</button>
        ${force?`<button class="btn" data-close style="width:100%;margin-top:12px">${state.lang==="en"?"Cancel":"Скасувати"}</button>`:""}
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelectorAll("[data-mode]").forEach(button=>{
      button.onclick=()=>{
        const mode=button.getAttribute("data-mode");
        appShell.mode=mode;
        if(mode==="trainer"){
          appShell.activeProfileId=null;
          currentTab="coach";
        }else{
          appShell.activeProfileId=personalProfile().id;
          state=personalProfile().data;
          currentTab="home";
        }
        save();
        overlay.remove();
        render();
      };
    });
    overlay.querySelector("#modeGuideBtn")?.addEventListener("click",openQuickGuide);
    overlay.querySelector("[data-close]")?.addEventListener("click",()=>overlay.remove());
  }

  function openQuickGuide(){
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel guideModalPanel"><div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"GymTracker guide":"Інструкція GymTracker"}</div><h2 style="margin:6px 0">${state.lang==="en"?"How the app works":"Як працює застосунок"}</h2></div><button class="btn" data-close>✕</button></div><div style="margin-top:14px">${usageGuideMarkup()}</div></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("[data-close]").onclick=()=>overlay.remove();
  }

  function openClientModal(profile=null){
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel" style="max-width:480px">
      <div class="detailHeader"><div><div class="brandEyebrow">${profile?(state.lang==="en"?"Edit client":"Редагування клієнта"):(state.lang==="en"?"New client":"Новий клієнт")}</div><h2 style="margin:6px 0">${profile?escapeHtml(profile.name):(state.lang==="en"?"Add a client":"Додати клієнта")}</h2></div><button class="btn" data-close>✕</button></div>
      <label class="bodyField" style="margin-top:16px"><span class="muted">${state.lang==="en"?"Client name":"Ім’я клієнта"}</span><input class="btn" id="clientName" maxlength="60" value="${escapeHtml(profile?.name||"")}" placeholder="${state.lang==="en"?"For example: Anna":"Наприклад: Анна"}"></label>
      <button class="btn primary" id="clientSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Save client":"Зберегти клієнта"}</button>
      ${profile?`<button class="btn" id="clientPause" style="width:100%;margin-top:8px">${profile.status==="paused"?(state.lang==="en"?"Restore active client":"Повернути до активних"):(state.lang==="en"?"Put client on pause":"Поставити клієнта на паузу")}</button>`:""}
      ${profile&&appShell.profiles.length>1?`<button class="btn" id="clientDelete" style="width:100%;margin-top:8px;color:#fda4af">${state.lang==="en"?"Delete client":"Видалити клієнта"}</button>`:""}
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#clientSave").onclick=()=>{
      const name=overlay.querySelector("#clientName").value.trim();
      if(!name) return;
      if(profile){
        profile.name=name;
      }else{
        const data=freshProfileData();
        data.lang=state.lang;
        const created={id:`client-${uid()}`,name,role:"client",status:"active",data};
        appShell.profiles.push(created);
      }
      save();close();render();
    };
    overlay.querySelector("#clientPause")?.addEventListener("click",()=>{
      profile.status=profile.status==="paused"?"active":"paused";
      if(profile.status==="paused" && appShell.activeProfileId===profile.id){
        appShell.activeProfileId=null;
        resetTransientSession();
      }
      save();close();render();
    });
    overlay.querySelector("#clientDelete")?.addEventListener("click",()=>{
      if(!confirm(state.lang==="en"?"Delete this client and all their local data?":"Видалити цього клієнта та всі його локальні дані?")) return;
      appShell.appointments.filter(item=>item.profileId===profile.id).forEach(item=>queueCalendarChange("delete",item));
      appShell.profiles=appShell.profiles.filter(item=>item.id!==profile.id);
      appShell.appointments=appShell.appointments.filter(item=>item.profileId!==profile.id);
      if(appShell.activeProfileId===profile.id){
        appShell.activeProfileId=null;
        resetTransientSession();
      }
      save();close();render();
    });
  }

  function openAppointmentModal(initialDate=null){
    const clients=clientProfiles();
    if(!clients.length){
      alert(state.lang==="en"?"Add a real client before planning a session.":"Спочатку додай реального клієнта, а потім плануй заняття.");
      return;
    }
    const now=new Date();
    const date=initialDate||now.toISOString().slice(0,10);
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel" style="max-width:520px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Calendar":"Календар"}</div><h2 style="margin:6px 0">${state.lang==="en"?"Plan a session":"Запланувати заняття"}</h2></div><button class="btn" data-close>✕</button></div>
      <div class="bodyGrid" style="margin-top:16px">
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Client":"Клієнт"}</span><select class="btn" id="appointmentClient">${clients.map(profile=>`<option value="${profile.id}" ${profile.id===appShell.activeProfileId?"selected":""}>${escapeHtml(profile.name)}</option>`).join("")}</select></label>
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Date":"Дата"}</span><input class="btn" id="appointmentDate" type="date" value="${date}"></label>
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Time":"Час"}</span><input class="btn" id="appointmentTime" type="time" value="18:00"></label>
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Note":"Нотатка"}</span><input class="btn" id="appointmentNote" maxlength="100" placeholder="${state.lang==="en"?"Leg day, technique...":"Ноги, техніка..."}"></label>
      </div>
      <button class="btn primary" id="appointmentSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Add to calendar":"Додати в календар"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#appointmentSave").onclick=()=>{
      const plannedDate=overlay.querySelector("#appointmentDate").value;
      const plannedTime=overlay.querySelector("#appointmentTime").value;
      if(!plannedDate||!plannedTime) return;
      addAppointment({
        id:`appointment-${uid()}`,
        profileId:overlay.querySelector("#appointmentClient").value,
        date:plannedDate,
        time:plannedTime,
        note:overlay.querySelector("#appointmentNote").value.trim(),
        notified:false
      });
      save();close();render();
    };
  }

  function openCalendarDayModal(day){
    const clients=clientProfiles();
    const appointments=[...(appShell.appointments||[])]
      .filter(item=>item.date===day && clients.some(profile=>profile.id===item.profileId))
      .sort((a,b)=>String(a.time||"").localeCompare(String(b.time||"")));
    const dateLabel=new Date(`${day}T12:00:00`).toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel" style="max-width:560px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Calendar day":"День календаря"}</div><h2 style="margin:6px 0">${escapeHtml(dateLabel)}</h2></div><button class="btn" data-close>✕</button></div>
      <div class="appointmentList" style="margin-top:14px">${appointments.length?appointments.map(item=>{
        const profile=appShell.profiles.find(candidate=>candidate.id===item.profileId);
        return `<div class="appointmentRow"><div class="appointmentDate"><strong>${escapeHtml(item.time||"")}</strong></div><div><strong>${escapeHtml(profile?.name||"Клієнт")}</strong><div class="muted">${escapeHtml(item.note || (state.lang==="en"?"Training session":"Тренування"))}</div></div><button class="btn" data-del-day-appointment="${item.id}">✕</button></div>`;
      }).join(""):`<div class="emptyCalendar">${state.lang==="en"?"Nothing is planned for this day yet.":"На цей день ще нічого не заплановано."}</div>`}</div>
      <button class="btn primary" id="dayAddAppointment" style="width:100%;margin-top:14px">＋ ${state.lang==="en"?"Add session":"Додати запис"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#dayAddAppointment").onclick=()=>{close();openAppointmentModal(day);};
    overlay.querySelectorAll("[data-del-day-appointment]").forEach(button=>button.onclick=()=>{
      if(!confirm(state.lang==="en"?"Delete this calendar entry?":"Видалити цей запис із календаря?")) return;
      deleteAppointment(button.getAttribute("data-del-day-appointment"));
      save();
      close();
      render();
    });
  }

  function appointmentTimestamp(item){
    return new Date(`${item.date}T${item.time||"00:00"}`).getTime();
  }

  function queueCalendarChange(operation,appointment){
    appShell.calendarOutbox.push({
      id:`sync-${uid()}`,
      operation,
      appointmentId:appointment.id,
      payload:operation==="delete"?null:{...appointment},
      createdAt:Date.now()
    });
  }

  function addAppointment(appointment){
    const item={...appointment,updatedAt:Date.now(),syncStatus:"pending",externalEventId:null};
    appShell.appointments.push(item);
    queueCalendarChange("upsert",item);
  }

  function deleteAppointment(appointmentId){
    const item=appShell.appointments.find(appointment=>appointment.id===appointmentId);
    if(!item) return;
    queueCalendarChange("delete",item);
    appShell.appointments=appShell.appointments.filter(appointment=>appointment.id!==appointmentId);
  }

  function dateKey(date){
    const y=date.getFullYear();
    const m=String(date.getMonth()+1).padStart(2,"0");
    const d=String(date.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
  }

  function calendarPeriod(){
    const view=appShell.coachUi.calendarView;
    const cursor=new Date(`${appShell.coachUi.calendarCursor}T12:00:00`);
    if(view==="month"){
      const first=new Date(cursor.getFullYear(),cursor.getMonth(),1);
      const start=new Date(first);
      start.setDate(start.getDate()-((start.getDay()+6)%7));
      const days=Array.from({length:42},(_,index)=>{
        const day=new Date(start);day.setDate(start.getDate()+index);return day;
      });
      return {view,cursor,days,title:cursor.toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{month:"long",year:"numeric"})};
    }
    const start=startOfWeek(cursor);
    const days=Array.from({length:7},(_,index)=>{
      const day=new Date(start);day.setDate(start.getDate()+index);return day;
    });
    const end=days[6];
    return {view,cursor,days,title:`${days[0].toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{day:"numeric",month:"short"})} — ${end.toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{day:"numeric",month:"short",year:"numeric"})}`};
  }

  function calendarMarkup(appointments){
    const period=calendarPeriod();
    const byDate=new Map();
    appointments.forEach(item=>{
      const list=byDate.get(item.date)||[];
      list.push(item);byDate.set(item.date,list);
    });
    const weekNames=(state.lang==="en"?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]:["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]);
    const weekdayHead=period.view==="month"?`<div class="calendarWeekdays">${weekNames.map(name=>`<span>${name}</span>`).join("")}</div>`:"";
    return `<div class="calendarToolbar">
      <div class="calendarTabs"><button class="periodBtn ${period.view==="week"?"active":""}" data-calendar-view="week">${state.lang==="en"?"Week":"Тиждень"}</button><button class="periodBtn ${period.view==="month"?"active":""}" data-calendar-view="month">${state.lang==="en"?"Month":"Місяць"}</button></div>
      <div class="calendarNav"><button class="btn" data-calendar-shift="-1">‹</button><strong>${escapeHtml(period.title)}</strong><button class="btn" data-calendar-shift="1">›</button></div>
    </div>${weekdayHead}<div class="calendarGrid ${period.view}">${period.days.map(day=>{
      const key=dateKey(day);
      const events=(byDate.get(key)||[]).sort((a,b)=>a.time.localeCompare(b.time));
      const outside=period.view==="month" && day.getMonth()!==period.cursor.getMonth();
      const today=key===dateKey(new Date());
      return `<button class="calendarDay ${outside?"outside":""} ${today?"today":""}" data-calendar-date="${key}">
        <span class="calendarDayTop">${period.view==="week"?weekNames[(day.getDay()+6)%7]:""}<strong>${day.getDate()}</strong></span>
        <span class="calendarEvents">${events.slice(0,3).map(item=>{
          const profile=appShell.profiles.find(candidate=>candidate.id===item.profileId);
          return `<span class="calendarEvent">${item.time} · ${escapeHtml(profile?.name||"")}</span>`;
        }).join("")}${events.length>3?`<small>+${events.length-3}</small>`:""}</span>
      </button>`;
    }).join("")}</div>`;
  }

  function clientComparisonMarkup(clients){
    if(!clients.length) return `<div class="emptyCalendar">${state.lang==="en"?"Add clients to see comparison statistics.":"Додай клієнтів, щоб побачити порівняльну статистику."}</div>`;
    const since=Date.now()-30*24*60*60*1000;
    const rows=clients.map(profile=>{
      const data=profile.data||{};
      const recent=(data.workouts||[]).filter(workout=>new Date(workout.date).getTime()>=since);
      const sets=countSetsInWorkouts(recent);
      const volume=volumeInWorkouts(recent);
      const goals=(data.goals||[]);
      const goalAvg=goals.length?Math.round(goals.reduce((sum,goal)=>{
        const oldState=state;state=data;
        const value=goalProgress(goal);
        state=oldState;
        return sum+value;
      },0)/goals.length):0;
      return {profile,recent:recent.length,sets,volume,goalAvg};
    });
    const maxWorkouts=Math.max(1,...rows.map(row=>row.recent));
    return `<div class="comparisonTable">${rows.sort((a,b)=>b.recent-a.recent).map((row,index)=>`
      <div class="comparisonRow">
        <div class="comparisonRank">${index+1}</div>
        <div class="comparisonMain"><strong>${escapeHtml(row.profile.name)}</strong><span>${state.lang==="en"?"Last 30 days":"Останні 30 днів"}</span><div class="comparisonBar"><i style="width:${Math.round(row.recent/maxWorkouts*100)}%"></i></div></div>
        <div class="comparisonMetric"><strong>${row.recent}</strong><span>${state.lang==="en"?"sessions":"занять"}</span></div>
        <div class="comparisonMetric"><strong>${row.sets}</strong><span>${state.lang==="en"?"sets":"підходів"}</span></div>
        <div class="comparisonMetric"><strong>${fmtVol(row.volume)}</strong><span>${state.lang==="en"?"volume":"обʼєм"}</span></div>
        <div class="comparisonMetric"><strong>${row.goalAvg}%</strong><span>${state.lang==="en"?"goals":"цілі"}</span></div>
      </div>`).join("")}</div>`;
  }

  function checkAppointmentReminders(){
    if(appShell.mode!=="trainer" || !("Notification" in window) || Notification.permission!=="granted") return;
    const now=Date.now();
    let changed=false;
    (appShell.appointments||[]).forEach(item=>{
      const starts=appointmentTimestamp(item);
      if(item.notified || starts<now || starts-now>15*60*1000) return;
      const profile=appShell.profiles.find(candidate=>candidate.id===item.profileId);
      new Notification(state.lang==="en"?"Training in 15 minutes":"Тренування через 15 хвилин",{
        body:`${profile?.name||"Клієнт"} · ${item.time}${item.note?` · ${item.note}`:""}`,
        icon:"./icons/icon-192.png"
      });
      item.notified=true;
      changed=true;
    });
    if(changed) save();
  }

  function viewCoach(){
    const el=document.createElement("div");
    const personal=personalProfile();
    const clients=clientProfiles();
    const pausedClients=clientProfiles("paused");
    const clientIds=new Set(clients.map(profile=>profile.id));
    const appointments=[...(appShell.appointments||[])]
      .filter(item=>clientIds.has(item.profileId))
      .sort((a,b)=>appointmentTimestamp(a)-appointmentTimestamp(b));
    const upcoming=appointments.filter(item=>appointmentTimestamp(item)>=Date.now()-60*60*1000).slice(0,12);
    const visibleDateKeys=new Set(calendarPeriod().days.map(dateKey));
    const periodAppointments=appointments.filter(item=>visibleDateKeys.has(item.date));
    const personalData=personal?.data||{};
    el.appendChild(card(`
      <div class="coachHeader"><div class="detailTitle"><div class="brandEyebrow">${state.lang==="en"?"Trainer workspace":"Робочий простір тренера"}</div><h2>${state.lang==="en"?"Clients and schedule":"Клієнти та розклад"}</h2><div class="sub">${clients.length} ${state.lang==="en"?"real clients":"реальних клієнтів"} · ${upcoming.length} ${state.lang==="en"?"upcoming sessions":"найближчих занять"}</div></div><button class="btn primary" id="addClientBtn">＋ ${state.lang==="en"?"Client":"Клієнт"}</button></div>
      <section class="personalProgressCard">
        <div class="personalProgressIcon">◎</div>
        <div class="personalProgressMain"><div class="muted">${state.lang==="en"?"Trainer's own profile":"Особистий профіль тренера"}</div><strong>${state.lang==="en"?"My progress":"Мій прогрес"}</strong><span>${(personalData.workouts||[]).length} ${state.lang==="en"?"workouts":"тренувань"} · ${(personalData.goals||[]).length} ${state.lang==="en"?"goals":"цілей"} · ${state.lang==="en"?"not included in calendar":"не додається до календаря"}</span></div>
        <button class="btn ${personal?.id===appShell.activeProfileId?"primary":""}" data-open-client="${personal?.id}">${personal?.id===appShell.activeProfileId?(state.lang==="en"?"Open progress":"Відкрити прогрес"):(state.lang==="en"?"Switch":"Перейти")}</button>
      </section>
      <div class="coachStack">
        <section class="coachSection">
          <div class="coachSectionHead"><div><strong>${state.lang==="en"?"Clients":"Клієнти"}</strong><div class="muted">${state.lang==="en"?"Separate progress for each person":"Окремий прогрес для кожної людини"}</div></div></div>
          <div class="clientGrid">${clients.length?clients.map(profile=>{
            const data=profile.data||{};
            const next=appointments.find(item=>item.profileId===profile.id && appointmentTimestamp(item)>=Date.now());
            return `<article class="clientCard ${profile.id===appShell.activeProfileId?"active":""}">
              <div class="detailHeader"><div><strong style="font-size:17px">${escapeHtml(profile.name)}</strong><div class="muted" style="margin-top:4px">${(data.workouts||[]).length} ${state.lang==="en"?"workouts":"тренувань"} · ${(data.goals||[]).length} ${state.lang==="en"?"goals":"цілей"}</div></div><button class="btn" data-edit-client="${profile.id}">•••</button></div>
              <div class="premiumNote" style="margin-top:11px;font-size:11px">${next?`${state.lang==="en"?"Next":"Далі"}: ${fmtDate(next.date)} · ${next.time}`:(state.lang==="en"?"No planned sessions":"Немає запланованих занять")}</div>
              <button class="btn ${profile.id===appShell.activeProfileId?"primary":""}" data-open-client="${profile.id}" style="width:100%;margin-top:10px">${profile.id===appShell.activeProfileId?(state.lang==="en"?"Open active client":"Відкрити активного клієнта"):(state.lang==="en"?"Switch to client":"Перейти до клієнта")}</button>
            </article>`;
          }).join(""):`<div class="emptyClients"><strong>${state.lang==="en"?"No clients yet":"Клієнтів поки немає"}</strong><span>${state.lang==="en"?"Add the first person to start tracking and scheduling.":"Додай першу людину, щоб вести прогрес і планувати заняття."}</span></div>`}</div>
          ${pausedClients.length?`<details class="pausedClients"><summary>${state.lang==="en"?"On pause":"На паузі"} · ${pausedClients.length}</summary><div class="pausedList">${pausedClients.map(profile=>`<div class="pausedRow"><div><strong>${escapeHtml(profile.name)}</strong><span>${(profile.data?.workouts||[]).length} ${state.lang==="en"?"workouts":"тренувань"}</span></div><button class="btn" data-restore-client="${profile.id}">${state.lang==="en"?"Restore":"Відновити"}</button></div>`).join("")}</div></details>`:""}
        </section>
        <section class="coachSection calendarSection">
          <div class="coachSectionHead"><div><strong>${state.lang==="en"?"Planning calendar":"Календар планування"}</strong><div class="muted">${state.lang==="en"?"Week or month view · active clients only":"Перегляд тижня або місяця · лише активні клієнти"}</div></div><button class="btn" id="addAppointmentBtn" ${clients.length?"":"disabled"}>＋ ${state.lang==="en"?"Plan":"Запис"}</button></div>
          ${clients.length?calendarMarkup(appointments):`<div class="emptyCalendar">${state.lang==="en"?"Calendar becomes available after adding an active client.":"Календар стане доступним після додавання активного клієнта."}</div>`}
          <div class="appointmentList">${periodAppointments.length?periodAppointments.map(item=>{
            const profile=appShell.profiles.find(candidate=>candidate.id===item.profileId);
            const day=new Date(`${item.date}T00:00:00`);
            return `<div class="appointmentRow"><div class="appointmentDate">${day.toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{month:"short"})}<strong>${day.getDate()}</strong></div><div><strong>${escapeHtml(profile?.name||"Клієнт")} · ${item.time}</strong><div class="muted">${escapeHtml(item.note|| (state.lang==="en"?"Training session":"Тренування"))}</div></div><button class="btn" data-del-appointment="${item.id}">✕</button></div>`;
          }).join(""):`<div class="muted" style="padding:10px">${state.lang==="en"?"No entries in this period.":"У цьому періоді записів немає."}</div>`}</div>
          ${clients.length?`<button class="btn" id="notificationBtn" style="width:100%;margin-top:10px">${state.lang==="en"?"Enable calendar notifications":"Увімкнути сповіщення календаря"}</button>`:""}
          <div class="calendarIntegration"><div><strong>Google Calendar</strong><span>${state.lang==="en"?"Data structure is ready; account connection will be added later.":"Структура даних підготовлена; підключення акаунта буде додано пізніше."}</span></div><span class="pill">${state.lang==="en"?"Prepared":"Підготовлено"}</span></div>
        </section>
      </div>
      <section class="coachSection comparisonSection">
        <div class="coachSectionHead"><div><strong>${state.lang==="en"?"Client comparison":"Порівняння клієнтів"}</strong><div class="muted">${state.lang==="en"?"Training activity, sets, volume and goal progress":"Активність, підходи, обʼєм і прогрес цілей"}</div></div></div>
        ${clientComparisonMarkup(clients)}
      </section>`));
    setTimeout(()=>{
      $("#addClientBtn")?.addEventListener("click",()=>openClientModal());
      $("#addAppointmentBtn")?.addEventListener("click",openAppointmentModal);
      el.querySelectorAll("[data-open-client]").forEach(button=>button.onclick=()=>switchProfile(button.getAttribute("data-open-client"),"home"));
      el.querySelectorAll("[data-edit-client]").forEach(button=>button.onclick=()=>{
        const profile=appShell.profiles.find(item=>item.id===button.getAttribute("data-edit-client"));
        if(profile) openClientModal(profile);
      });
      el.querySelectorAll("[data-restore-client]").forEach(button=>button.onclick=()=>{
        const profile=appShell.profiles.find(item=>item.id===button.getAttribute("data-restore-client"));
        if(profile){profile.status="active";save();render();}
      });
      el.querySelectorAll("[data-calendar-view]").forEach(button=>button.onclick=()=>{
        appShell.coachUi.calendarView=button.getAttribute("data-calendar-view");
        save();render();
      });
      el.querySelectorAll("[data-calendar-shift]").forEach(button=>button.onclick=()=>{
        const cursor=new Date(`${appShell.coachUi.calendarCursor}T12:00:00`);
        const direction=Number(button.getAttribute("data-calendar-shift"));
        if(appShell.coachUi.calendarView==="month") cursor.setMonth(cursor.getMonth()+direction);
        else cursor.setDate(cursor.getDate()+7*direction);
        appShell.coachUi.calendarCursor=dateKey(cursor);
        save();render();
      });
      el.querySelectorAll("[data-calendar-date]").forEach(button=>button.onclick=()=>openCalendarDayModal(button.getAttribute("data-calendar-date")));
      el.querySelectorAll("[data-del-appointment]").forEach(button=>button.onclick=()=>{
        if(!confirm(state.lang==="en"?"Delete this calendar entry?":"Видалити цей запис із календаря?")) return;
        deleteAppointment(button.getAttribute("data-del-appointment"));
        save();render();
      });
      $("#notificationBtn")?.addEventListener("click",async()=>{
        if(!("Notification" in window)) return alert(state.lang==="en"?"Notifications are not supported on this device.":"Цей пристрій не підтримує веб-сповіщення.");
        const result=await Notification.requestPermission();
        alert(result==="granted"?(state.lang==="en"?"Notifications enabled.":"Сповіщення увімкнено."):(state.lang==="en"?"Notification permission was not granted.":"Дозвіл на сповіщення не надано."));
      });
    },0);
    return el;
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
    const todayWorkout=latestWorkoutToday();

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
      <div class="workoutLaunch">
        <div class="workoutLaunchIcon">${todayWorkout?"↻":"▶"}</div>
        <div class="workoutLaunchCopy">
          <div class="muted" style="text-transform:uppercase;letter-spacing:.12em;font-size:9px">${todayWorkout?(state.lang==="en"?"Today is still active":"Сьогоднішній день ще активний"):(state.lang==="en"?"Ready when you are":"Готовий, коли готовий ти")}</div>
          <div class="workoutLaunchTitle">${todayWorkout?(state.lang==="en"?"Continue today's workout":"Продовжити тренування") : t("startWorkout")}</div>
          <div class="muted">${todayWorkout?escapeHtml(todayWorkout.title):(state.lang==="en"?"Build the session and track every working set":"Склади заняття та зафіксуй кожен робочий підхід")}</div>
        </div>
        <button class="btn primary workoutLaunchBtn" id="homeStart">${todayWorkout?(state.lang==="en"?"Continue":"Продовжити"):(state.lang==="en"?"Start":"Почати")}</button>
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
        <div class="kpiBox kpiTeal kpiClickable" id="homeTrainingsKpi" role="button" tabindex="0">
          <div class="ico">🏋️</div>
          <div class="val">${periodTrainings}</div>
          <div class="lbl">${t("trainings")} · ${state.lang==="en"?"tap list":"до списку"}</div>
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
    `));

    el.appendChild(card(`
      <div style="font-weight:900; font-size:16px; margin-bottom:10px;">${t("favorites")}</div>
      <div class="favoriteRows" id="favStrip"></div>
    `));

    el.appendChild(card(`
      <div style="font-weight:900; font-size:16px; margin-bottom:10px;">${t("lastWorkouts")}</div>
      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px;" id="recentList"></div>
      <div class="muted" style="margin-top:10px">${t("tapToOpen")}</div>
    `)).id = "recentWorkoutsCard";

    setTimeout(()=>{
      const btn = $("#homeStart");
      if (btn) btn.onclick = ()=>{
        if(todayWorkout) continueSavedWorkout(todayWorkout);
        else{
          setTab("workout");
          startWorkoutIfNeeded();
        }
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
      const homeTrainingsKpi=$("#homeTrainingsKpi");
      const scrollToRecent=()=>{
        $("#recentWorkoutsCard")?.scrollIntoView({behavior:"smooth",block:"start"});
      };
      homeTrainingsKpi?.addEventListener("click",scrollToRecent);
      homeTrainingsKpi?.addEventListener("keydown",(event)=>{
        if(event.key==="Enter" || event.key===" "){
          event.preventDefault();
          scrollToRecent();
        }
      });
    },0);

    return el;
  }

  function recommendationCardMarkup(){
    if ((state.recommendations||[]).length){
      const summary=state.recommendations[0];
      const details=state.recommendations.slice(1);
      return `
        <div class="recommendationHero">
          <div>
            <div class="muted" style="text-transform:uppercase;letter-spacing:.12em;font-size:9px">${state.lang==="en"?"Program forecast":"Прогноз програми"}</div>
            <div class="recommendationHeroTitle">${t("nextWorkout")}</div>
            <div class="recommendationSession">${escapeHtml(summary.title)}</div>
            <div class="muted">${escapeHtml(summary.prescription||"")}</div>
          </div>
          <div class="recommendationConfidence">${state.lang==="en"?"Analysis":"Аналіз"}<br><strong>${state.workouts.length}</strong> ${state.lang==="en"?"sessions":"занять"}</div>
        </div>
        <div class="recommendationReason">${escapeHtml(summary.text||"")}</div>
        <div class="recommendationPlan">${details.map(rec=>`
          <div class="recommendationPlanRow">
            <div class="recommendationPlanMain"><strong>${escapeHtml(rec.title)}</strong><span>${escapeHtml(rec.text||"")}</span></div>
            <div class="recommendationPrescription">${escapeHtml(rec.prescription||"")}</div>
          </div>`).join("")}</div>`;
    }
    if(state.workouts.length>0 && state.workouts.length<5){
      return `
        <div class="recommendationLearning">
          <div class="recommendationLearningIcon">◌</div>
          <div><strong>${state.lang==="en"?"Learning your program":"Вивчаю твою програму"}</strong><div class="muted" style="margin-top:4px">${state.lang==="en"
            ? `Complete ${5-state.workouts.length} more workout(s). Recommendations will start after at least 5 sessions reveal your rotation.`
            : `Проведи ще ${5-state.workouts.length} заняття. Рекомендації з’являться після щонайменше 5 тренувань, коли буде видно чергування.`}</div></div>
        </div>`;
    }
    return "";
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
      const pr = exercisePRValue(ex);
      const lastDate = logs[0]?.date ? fmtDate(logs[0].date) : "—";
      return `
        <div class="favoriteRow" data-favstats="${ex.id}" role="button" tabindex="0">
          ${exIcon(ex)}
          <div class="favoriteRowMain">
            <div class="favoriteRowTitle">${escapeHtml(exName(ex))}</div>
            <div class="favoriteRowMeta">${escapeHtml(catName(ex.category))} · ${trackingLabel(ex)} · ${t("last")}: ${lastDate}</div>
          </div>
          <div class="favoriteRowStats">
            <div><span>PR</span><strong>${fmtNum(pr)} ${primaryUnit(ex)}</strong></div>
            <div><span>${state.lang==="en"?"Sessions":"Занять"}</span><strong>${cnt}</strong></div>
          </div>
          <span class="favoriteRowArrow">›</span>
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
    workoutSession.workoutId = null;
    if (!workoutSession.title){
      workoutSession.title = state.lang==="en"
        ? `Workout ${fmtDate(workoutSession.startedAt)}`
        : `Тренування ${fmtDate(workoutSession.startedAt)}`;
    }
    publishWorkoutToNative("start");
  }

  function viewWorkout(){
    const el = document.createElement("div");
    startWorkoutIfNeeded();

    el.appendChild(card(`
      <div class="row" style="justify-content:space-between; align-items:flex-start">
        <div style="min-width:0; flex:1">
          <div style="font-weight:900; font-size:18px">${t("workout")}</div>
          <div class="muted">${workoutSession.workoutId
            ? `${state.lang==="en"?"Editing saved workout":"Редагування збереженого тренування"} · ${fmtDate(workoutSession.startedAt)}`
            : workoutSession.active ? `⏱ ${fmtDate(workoutSession.startedAt)}` : t("noData")}</div>

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

    el.appendChild(card(workoutPlanningPanelMarkup()));

    el.appendChild(card(`
      <div class="restPanel">
        <div class="restRing" id="restRing">
          <div class="restValue" id="restValue">${formatRest(rest.left)}</div>
        </div>
        <div>
          <div style="font-weight:900;font-size:17px" id="restLabel">${t("restTimer")}</div>
          <div class="muted" style="margin-top:4px">${state.lang==="en" ? "Starts automatically after a completed set · vibration at zero" : "Запускається автоматично після внесеного підходу · вібрація на нулі"}</div>
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
        <button class="btn primary" id="saveWorkoutBtn">${workoutSession.workoutId?(state.lang==="en"?"💾 Update workout":"💾 Оновити тренування"):t("saveWorkout")}</button>
        <button class="btn" id="clearWorkoutBtn">${t("clearWorkout")}</button>
      </div>
    `));

    const recommendationMarkup=recommendationCardMarkup();
    if(recommendationMarkup){
      el.appendChild(card(recommendationMarkup));
    }

    setTimeout(()=>{
      renderWorkoutItems();

      const titleInput = $("#workoutTitleInput");
      if (titleInput){
        titleInput.addEventListener("input", (e)=>{
          workoutSession.title = e.target.value || "";
          publishWorkoutToNative("title");
        });
      }

      const addBtn = $("#addExToW");
      if (addBtn) addBtn.onclick = ()=> openExercisePickerForWorkout();

      $("#newPlanBtn")?.addEventListener("click",()=>openWorkoutPlanModal());
      $("#newTemplateBtn")?.addEventListener("click",()=>openWorkoutTemplateModal());
      bindPlannedWorkoutActions(el);
      bindTemplateActions(el);
      el.querySelectorAll("[data-plan-view]").forEach(button=>button.onclick=()=>{
        state.ui.planCalendarView=button.getAttribute("data-plan-view");
        save();render();
      });
      el.querySelectorAll("[data-plan-shift]").forEach(button=>button.onclick=()=>{
        const cursor=new Date(`${state.ui.planCalendarCursor||dateKey(new Date())}T12:00:00`);
        const direction=Number(button.getAttribute("data-plan-shift"));
        if((state.ui.planCalendarView||"month")==="month") cursor.setMonth(cursor.getMonth()+direction);
        else cursor.setDate(cursor.getDate()+7*direction);
        state.ui.planCalendarCursor=dateKey(cursor);
        save();render();
      });
      el.querySelectorAll("[data-plan-date]").forEach(button=>button.onclick=()=>openPlanDayModal(button.getAttribute("data-plan-date")));

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
        const message=state.lang==="en"
          ? "Clear the current workout draft? All entered exercises and sets in this draft will be lost."
          : "Очистити поточний набір тренування? Усі внесені вправи та підходи в цьому наборі буде втрачено.";
        if(!confirm(message)) return;
        resetRestTimer();
        workoutSession = { active:false, startedAt:null, title:"", workoutId:null, planId:null, items:[] };
        publishWorkoutToNative("clear");
        render();
      };

      const saveBtn = $("#saveWorkoutBtn");
      if (saveBtn) saveBtn.onclick = ()=>{
        if (!workoutSession.items.length){
          alert(t("pickExerciseFirst"));
          return;
        }
        const message=workoutSession.workoutId
          ? (state.lang==="en"
            ? "Update this saved workout and recalculate records, statistics and recommendations?"
            : "Оновити це збережене тренування та перерахувати рекорди, статистику й рекомендації?")
          : (state.lang==="en"
            ? "Save and finish this workout? You can continue today's saved workout later from Home."
            : "Зберегти й завершити це тренування? Сьогодні його можна буде продовжити з головної сторінки.");
        if(!confirm(message)) return;
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
          ${type==="strength" || type==="reps" ? `<label class="setField"><span>${state.lang==="en"?"Reps":"Повтори"}</span><input type="text" inputmode="numeric"
            data-id="${it.id}" data-i="${idx}" data-k="reps"
            value="${escapeHtml(s.reps ?? "")}" placeholder="8" /></label>` : ""}
          ${type==="strength" ? `<label class="setField"><span>${state.lang==="en"?"Weight, kg":"Вага, кг"}</span><input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="weight"
            value="${escapeHtml(s.weight ?? "")}" placeholder="80" /></label>` : ""}
          ${type==="time" || type==="distance" ? `<label class="setField"><span>${state.lang==="en"?"Time, min":"Час, хв"}</span><input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="duration"
            value="${escapeHtml(s.duration ?? "")}" placeholder="10" /></label>` : ""}
          ${type==="distance" ? `<label class="setField"><span>${state.lang==="en"?"Distance, km":"Дистанція, км"}</span><input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="distance"
            value="${escapeHtml(s.distance ?? "")}" placeholder="2.5" /></label>` : ""}
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
        publishWorkoutToNative("setAdded");
        renderWorkoutItems();
      };
    });

    // remove exercise
    box.querySelectorAll("[data-rm]").forEach(btn=>{
      btn.onclick = ()=>{
        const id = btn.getAttribute("data-rm");
        workoutSession.items = workoutSession.items.filter(x=>x.id!==id);
        publishWorkoutToNative("exerciseRemoved");
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
        publishWorkoutToNative("setDeleted");
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
        it.sets[idx]._restTriggered=false;
        publishWorkoutToNative("setInput");
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
        maybeStartRestForSet(it,idx);
        publishWorkoutToNative("setBlur");
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
      box.innerHTML = allCategories().map(c=>{
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
            publishWorkoutToNative("exerciseAdded");
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
  function isSameLocalDay(a,b=new Date()){
    const x=new Date(a);
    const y=new Date(b);
    return Number.isFinite(x.getTime()) &&
      x.getFullYear()===y.getFullYear() &&
      x.getMonth()===y.getMonth() &&
      x.getDate()===y.getDate();
  }
  function latestWorkoutToday(){
    return [...(state.workouts||[])]
      .filter(w=>isSameLocalDay(w.date))
      .sort((a,b)=>new Date(b.date)-new Date(a.date))[0] || null;
  }

  function exerciseIdsFromTemplate(templateId){
    const template=(state.workoutTemplates||[]).find(item=>item.id===templateId);
    return template ? template.items.map(item=>item.exerciseId).filter(Boolean) : [];
  }

  function plannedWorkoutItems(plan){
    const ids=plan?.items?.length ? plan.items.map(item=>item.exerciseId) : exerciseIdsFromTemplate(plan?.templateId);
    return [...new Set(ids.filter(id=>state.exercises.some(ex=>ex.id===id)))].map(exerciseId=>({exerciseId}));
  }

  function startPlannedWorkout(planId){
    const plan=(state.plannedWorkouts||[]).find(item=>item.id===planId);
    if(!plan) return;
    const items=plannedWorkoutItems(plan);
    if(!items.length){
      alert(state.lang==="en"?"This plan has no exercises yet.":"У цьому плані ще немає вправ.");
      return;
    }
    if(workoutSession.active && workoutSession.items?.length && !confirm(state.lang==="en"
      ? "Replace the current workout draft with this planned workout?"
      : "Замінити поточний набір тренування цим запланованим заняттям?")) return;
    workoutSession={
      active:true,
      startedAt:new Date().toISOString(),
      title:plan.title || (state.lang==="en"?"Planned workout":"Заплановане тренування"),
      workoutId:null,
      planId:plan.id,
      items:items.map(item=>({id:uid(),exerciseId:item.exerciseId,sets:[]}))
    };
    plan.status="started";
    save();
    resetRestTimer();
    publishWorkoutToNative("plannedStart");
    setTab("workout");
  }

  function addExercisesToSession(exerciseIds){
    const unique=[...new Set(exerciseIds)].filter(id=>state.exercises.some(ex=>ex.id===id));
    unique.forEach(id=>{
      if(!workoutSession.items.some(item=>item.exerciseId===id)){
        workoutSession.items.push({id:uid(),exerciseId:id,sets:[]});
      }
    });
    if(unique.length){
      workoutSession.active=true;
      if(!workoutSession.startedAt) workoutSession.startedAt=new Date().toISOString();
      if(!workoutSession.title) workoutSession.title=state.lang==="en"
        ? `Workout ${fmtDate(workoutSession.startedAt)}`
        : `Тренування ${fmtDate(workoutSession.startedAt)}`;
      publishWorkoutToNative("templateApplied");
    }
  }

  function planCalendarPeriod(){
    const view=state.ui.planCalendarView==="week"?"week":"month";
    const cursor=new Date(`${state.ui.planCalendarCursor||dateKey(new Date())}T12:00:00`);
    if(view==="week"){
      const start=startOfWeek(cursor);
      const days=Array.from({length:7},(_,index)=>{const day=new Date(start);day.setDate(start.getDate()+index);return day;});
      const end=days[6];
      return {view,cursor,days,title:`${days[0].toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{day:"numeric",month:"short"})} - ${end.toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{day:"numeric",month:"short",year:"numeric"})}`};
    }
    const first=new Date(cursor.getFullYear(),cursor.getMonth(),1);
    const start=new Date(first);
    start.setDate(start.getDate()-((start.getDay()+6)%7));
    const days=Array.from({length:42},(_,index)=>{const day=new Date(start);day.setDate(start.getDate()+index);return day;});
    return {view,cursor,days,title:cursor.toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{month:"long",year:"numeric"})};
  }

  function userPlanCalendarMarkup(){
    const period=planCalendarPeriod();
    const byDate=new Map();
    (state.plannedWorkouts||[]).filter(plan=>plan.status!=="completed").forEach(plan=>{
      const list=byDate.get(plan.date)||[];
      list.push(plan);byDate.set(plan.date,list);
    });
    const weekNames=(state.lang==="en"?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]:["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]);
    const weekdayHead=period.view==="month"?`<div class="calendarWeekdays">${weekNames.map(name=>`<span>${name}</span>`).join("")}</div>`:"";
    return `<div class="calendarToolbar">
      <div class="calendarTabs"><button class="periodBtn ${period.view==="week"?"active":""}" data-plan-view="week">${state.lang==="en"?"Week":"Тиждень"}</button><button class="periodBtn ${period.view==="month"?"active":""}" data-plan-view="month">${state.lang==="en"?"Month":"Місяць"}</button></div>
      <div class="calendarNav"><button class="btn" data-plan-shift="-1">‹</button><strong>${escapeHtml(period.title)}</strong><button class="btn" data-plan-shift="1">›</button></div>
    </div>${weekdayHead}<div class="calendarGrid ${period.view}">${period.days.map(day=>{
      const key=dateKey(day);
      const plans=(byDate.get(key)||[]).sort((a,b)=>String(a.title).localeCompare(String(b.title)));
      const outside=period.view==="month" && day.getMonth()!==period.cursor.getMonth();
      const today=key===dateKey(new Date());
      return `<button class="calendarDay ${outside?"outside":""} ${today?"today":""}" data-plan-date="${key}">
        <span class="calendarDayTop">${period.view==="week"?weekNames[(day.getDay()+6)%7]:""}<strong>${day.getDate()}</strong></span>
        <span class="calendarEvents">${plans.slice(0,3).map(plan=>`<span class="calendarEvent">${escapeHtml(plan.title)}</span>`).join("")}${plans.length>3?`<small>+${plans.length-3}</small>`:""}</span>
      </button>`;
    }).join("")}</div>`;
  }

  function selectedPlanExercises(overlay){
    return Array.from(overlay.querySelectorAll("[data-plan-exercise]:checked")).map(input=>input.value);
  }

  function exerciseChecklistMarkup(selectedIds=[]){
    const selected=new Set(selectedIds);
    return `<div class="planExerciseGrid">${state.exercises.map(ex=>`
      <label class="planExercisePick">
        <input type="checkbox" data-plan-exercise value="${ex.id}" ${selected.has(ex.id)?"checked":""}>
        ${exIcon(ex)}
        <span><strong>${escapeHtml(exName(ex))}</strong><small>${catName(ex.category)} · ${trackingLabel(ex)}</small></span>
      </label>`).join("")}</div>`;
  }

  function openWorkoutPlanModal(initialDate=null,plan=null){
    const date=initialDate || plan?.date || dateKey(new Date());
    const selectedIds=plan ? plannedWorkoutItems(plan).map(item=>item.exerciseId) : [];
    const templates=state.workoutTemplates||[];
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel planModalPanel" style="max-width:620px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Workout planning":"Планування тренування"}</div><h2 style="margin:6px 0">${plan?(state.lang==="en"?"Edit planned workout":"Редагувати план"):(state.lang==="en"?"Plan workout":"Запланувати тренування")}</h2></div><button class="btn" data-close>✕</button></div>
      <div class="bodyGrid bodyMeasureGrid" style="margin-top:14px">
        <label class="bodyField bodyDateField"><span class="muted">${state.lang==="en"?"Date":"Дата"}</span><input class="btn" id="planDate" type="date" value="${escapeHtml(date)}"></label>
        <label class="bodyField bodyDateField"><span class="muted">${state.lang==="en"?"Workout name":"Назва тренування"}</span><input class="btn" id="planTitle" maxlength="80" value="${escapeHtml(plan?.title||"")}" placeholder="${state.lang==="en"?"Push / Pull":"Жим / Тяга"}"></label>
      </div>
      <label class="bodyField" style="display:block;margin-top:12px"><span class="muted">${state.lang==="en"?"Use template":"Використати шаблон"}</span><select class="btn" id="planTemplate" style="width:100%"><option value="">${state.lang==="en"?"No template":"Без шаблону"}</option>${templates.map(template=>`<option value="${template.id}" ${template.id===plan?.templateId?"selected":""}>${escapeHtml(template.title)}</option>`).join("")}</select></label>
      <div class="planPickerHead"><strong>${state.lang==="en"?"Exercises":"Вправи"}</strong><span class="muted">${state.lang==="en"?"Choose separate exercises or load a template above.":"Обери окремі вправи або завантаж шаблон вище."}</span></div>
      ${exerciseChecklistMarkup(selectedIds)}
      <button class="btn primary" id="planSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Save planned workout":"Зберегти заплановане тренування"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#planTemplate").onchange=e=>{
      const ids=exerciseIdsFromTemplate(e.target.value);
      overlay.querySelectorAll("[data-plan-exercise]").forEach(input=>{ input.checked=ids.includes(input.value); });
      const template=templates.find(item=>item.id===e.target.value);
      const titleInput=overlay.querySelector("#planTitle");
      if(template && !titleInput.value.trim()) titleInput.value=template.title;
    };
    overlay.querySelector("#planSave").onclick=()=>{
      const exerciseIds=selectedPlanExercises(overlay);
      if(!exerciseIds.length){
        alert(state.lang==="en"?"Choose at least one exercise.":"Обери хоча б одну вправу.");
        return;
      }
      const item={
        id:plan?.id || `plan-${uid()}`,
        date:overlay.querySelector("#planDate").value || dateKey(new Date()),
        title:overlay.querySelector("#planTitle").value.trim() || (state.lang==="en"?"Planned workout":"Заплановане тренування"),
        templateId:overlay.querySelector("#planTemplate").value || "",
        status:plan?.status && plan.status!=="completed" ? plan.status : "planned",
        createdAt:plan?.createdAt || Date.now(),
        completedWorkoutId:plan?.completedWorkoutId || "",
        items:exerciseIds.map(exerciseId=>({exerciseId}))
      };
      if(plan) state.plannedWorkouts=state.plannedWorkouts.map(existing=>existing.id===plan.id?item:existing);
      else state.plannedWorkouts.unshift(item);
      save();close();render();
    };
  }

  function openWorkoutTemplateModal(template=null){
    const selectedIds=(template?.items||[]).map(item=>item.exerciseId);
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel planModalPanel" style="max-width:620px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Workout template":"Шаблон комплексу"}</div><h2 style="margin:6px 0">${template?(state.lang==="en"?"Edit template":"Редагувати шаблон"):(state.lang==="en"?"New template":"Новий шаблон")}</h2></div><button class="btn" data-close>✕</button></div>
      <label class="bodyField" style="display:block;margin-top:14px"><span class="muted">${state.lang==="en"?"Template name":"Назва шаблону"}</span><input class="btn" id="templateTitle" maxlength="80" style="width:100%" value="${escapeHtml(template?.title||"")}" placeholder="${state.lang==="en"?"Chest + back":"Жим / тяга"}"></label>
      <div class="planPickerHead"><strong>${state.lang==="en"?"Exercises":"Вправи"}</strong><span class="muted">${state.lang==="en"?"This set can be used while planning or during a workout.":"Цю заготовку можна вибрати при плануванні або вже під час заняття."}</span></div>
      ${exerciseChecklistMarkup(selectedIds)}
      <button class="btn primary" id="templateSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Save template":"Зберегти шаблон"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#templateSave").onclick=()=>{
      const exerciseIds=selectedPlanExercises(overlay);
      if(!exerciseIds.length){
        alert(state.lang==="en"?"Choose at least one exercise.":"Обери хоча б одну вправу.");
        return;
      }
      const item={
        id:template?.id || `template-${uid()}`,
        title:overlay.querySelector("#templateTitle").value.trim() || (state.lang==="en"?"Workout template":"Шаблон тренування"),
        createdAt:template?.createdAt || Date.now(),
        items:exerciseIds.map(exerciseId=>({exerciseId}))
      };
      if(template) state.workoutTemplates=state.workoutTemplates.map(existing=>existing.id===template.id?item:existing);
      else state.workoutTemplates.unshift(item);
      save();close();render();
    };
  }

  function plannedWorkoutRowMarkup(plan){
    const items=plannedWorkoutItems(plan);
    const names=items.slice(0,4).map(item=>{
      const ex=state.exercises.find(candidate=>candidate.id===item.exerciseId);
      return ex ? exName(ex) : "";
    }).filter(Boolean).join(" · ");
    return `<article class="plannedWorkoutRow">
      <div class="plannedDate"><span>${fmtDate(plan.date)}</span><strong>${items.length}</strong><small>${state.lang==="en"?"ex.":"впр."}</small></div>
      <div class="plannedMain"><strong>${escapeHtml(plan.title)}</strong><span>${escapeHtml(names || (state.lang==="en"?"No exercises":"Немає вправ"))}${items.length>4?` · +${items.length-4}`:""}</span></div>
      <div class="plannedActions"><button class="btn primary" data-start-plan="${plan.id}">${state.lang==="en"?"Start":"Почати"}</button><button class="btn" data-edit-plan="${plan.id}">⋯</button><button class="btn" data-delete-plan="${plan.id}">✕</button></div>
    </article>`;
  }

  function bindPlannedWorkoutActions(root,afterAction=()=>{}){
    root.querySelectorAll("[data-start-plan]").forEach(button=>button.onclick=()=>{afterAction();startPlannedWorkout(button.getAttribute("data-start-plan"));});
    root.querySelectorAll("[data-edit-plan]").forEach(button=>button.onclick=()=>{
      const plan=state.plannedWorkouts.find(item=>item.id===button.getAttribute("data-edit-plan"));
      if(plan){afterAction();openWorkoutPlanModal(plan.date,plan);}
    });
    root.querySelectorAll("[data-delete-plan]").forEach(button=>button.onclick=()=>{
      if(!confirm(state.lang==="en"?"Delete this planned workout?":"Видалити це заплановане тренування?")) return;
      state.plannedWorkouts=state.plannedWorkouts.filter(plan=>plan.id!==button.getAttribute("data-delete-plan"));
      save();afterAction();render();
    });
  }

  function openPlanDayModal(day){
    const plans=(state.plannedWorkouts||[]).filter(plan=>plan.date===day && plan.status!=="completed");
    const dateLabel=new Date(`${day}T12:00:00`).toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel" style="max-width:560px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Planned workouts":"Заплановані тренування"}</div><h2 style="margin:6px 0">${escapeHtml(dateLabel)}</h2></div><button class="btn" data-close>✕</button></div>
      <div class="plannedList" style="margin-top:14px">${plans.length?plans.map(plan=>plannedWorkoutRowMarkup(plan)).join(""):`<div class="emptyCalendar">${state.lang==="en"?"No planned workouts for this day.":"На цей день тренувань ще не заплановано."}</div>`}</div>
      <button class="btn primary" id="dayAddPlan" style="width:100%;margin-top:14px">＋ ${state.lang==="en"?"Plan workout":"Запланувати тренування"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#dayAddPlan").onclick=()=>{close();openWorkoutPlanModal(day);};
    bindPlannedWorkoutActions(overlay,close);
  }

  function bindTemplateActions(root){
    root.querySelectorAll("[data-use-template]").forEach(button=>button.onclick=()=>{
      addExercisesToSession(exerciseIdsFromTemplate(button.getAttribute("data-use-template")));
      save();
      renderWorkoutItems();
    });
    root.querySelectorAll("[data-edit-template]").forEach(button=>button.onclick=()=>{
      const template=state.workoutTemplates.find(item=>item.id===button.getAttribute("data-edit-template"));
      if(template) openWorkoutTemplateModal(template);
    });
    root.querySelectorAll("[data-delete-template]").forEach(button=>button.onclick=()=>{
      if(!confirm(state.lang==="en"?"Delete this template?":"Видалити цей шаблон?")) return;
      state.workoutTemplates=state.workoutTemplates.filter(template=>template.id!==button.getAttribute("data-delete-template"));
      save();render();
    });
  }

  function workoutPlanningPanelMarkup(){
    const upcoming=(state.plannedWorkouts||[])
      .filter(plan=>plan.status!=="completed")
      .sort((a,b)=>String(a.date).localeCompare(String(b.date)) || String(a.title).localeCompare(String(b.title)))
      .slice(0,8);
    const templates=state.workoutTemplates||[];
    return `
      <section class="planningSuite">
        <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Training planner":"Планувальник тренувань"}</div><h2 style="margin:4px 0">${state.lang==="en"?"Planned workouts and templates":"Заплановані тренування і шаблони"}</h2><div class="muted">${state.lang==="en"?"Plan future days, then start with exercises already loaded.":"Плануй майбутні дні, а потім запускай заняття вже з набраними вправами."}</div></div><button class="btn primary" id="newPlanBtn">＋ ${state.lang==="en"?"Plan":"План"}</button></div>
        <div class="planningGrid">
          <div class="planningCalendar">${userPlanCalendarMarkup()}</div>
          <div class="planningSide">
            <div class="planningSubhead"><strong>${state.lang==="en"?"Upcoming":"Найближчі"}</strong><button class="btn" id="newTemplateBtn">＋ ${state.lang==="en"?"Template":"Шаблон"}</button></div>
            <div class="plannedList">${upcoming.length?upcoming.map(plan=>plannedWorkoutRowMarkup(plan)).join(""):`<div class="emptyCalendar">${state.lang==="en"?"No planned workouts yet.":"Запланованих тренувань поки немає."}</div>`}</div>
            <div class="planningSubhead" style="margin-top:12px"><strong>${state.lang==="en"?"Templates":"Шаблони комплексів"}</strong><span class="muted">${templates.length}</span></div>
            <div class="templateList">${templates.length?templates.slice(0,8).map(template=>{
              const names=template.items.slice(0,3).map(item=>{
                const ex=state.exercises.find(candidate=>candidate.id===item.exerciseId);
                return ex ? exName(ex) : "";
              }).filter(Boolean).join(" · ");
              return `<article class="templateRow"><div><strong>${escapeHtml(template.title)}</strong><span>${escapeHtml(names)}${template.items.length>3?` · +${template.items.length-3}`:""}</span></div><div class="templateActions"><button class="btn primary" data-use-template="${template.id}">${state.lang==="en"?"Use":"Додати"}</button><button class="btn" data-edit-template="${template.id}">⋯</button><button class="btn" data-delete-template="${template.id}">✕</button></div></article>`;
            }).join(""):`<div class="emptyCalendar">${state.lang==="en"?"Create sets like Bench/Row or Biceps/Triceps once and reuse them.":"Створи заготовки типу Жим/Тяга або Біцепс/Трицепс і використовуй повторно."}</div>`}</div>
          </div>
        </div>
      </section>`;
  }

  function continueSavedWorkout(workout){
    if(!workout) return;
    workoutSession={
      active:true,
      startedAt:workout.date,
      title:workout.title || "",
      workoutId:workout.id,
      planId:null,
      items:(workout.items||[]).map(it=>({
        id:uid(),
        exerciseId:it.exerciseId,
        sets:(it.sets||[]).map(set=>({...set,_restTriggered:true}))
      }))
    };
    publishWorkoutToNative("continue");
    setTab("workout");
  }

  function normalizedWorkoutTitle(workout){
    const title=String(workout?.title||"")
      .toLowerCase()
      .replace(/\d{1,4}([./-]\d{1,2}){1,2}/g,"")
      .replace(/\b\d+\b/g,"")
      .replace(/\b(тренування|workout)\b/g,"")
      .replace(/[^\p{L}\p{N}]+/gu," ")
      .trim();
    return title.length>=3 ? title : "";
  }

  function workoutExerciseSet(workout){
    return new Set((workout?.items||[]).map(item=>item.exerciseId).filter(Boolean));
  }

  function setSimilarity(a,b){
    const union=new Set([...a,...b]);
    if(!union.size) return 0;
    let common=0;
    a.forEach(value=>{if(b.has(value)) common+=1;});
    return common/union.size;
  }

  function clusterWorkoutTemplates(workouts){
    const ordered=[...workouts].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const clusters=[];
    const sequence=[];
    ordered.forEach(workout=>{
      const title=normalizedWorkoutTitle(workout);
      const exercises=workoutExerciseSet(workout);
      let best=null;
      clusters.forEach(cluster=>{
        const titleMatch=title && cluster.title && title===cluster.title;
        const similarity=Math.max(0,...cluster.exerciseSets.map(set=>setSimilarity(exercises,set)));
        const score=titleMatch ? 1.5 : similarity;
        if((titleMatch || similarity>=0.55) && (!best || score>best.score)) best={cluster,score};
      });
      if(!best){
        const cluster={id:`template-${clusters.length+1}`,title,exerciseSets:[],workouts:[]};
        clusters.push(cluster);
        best={cluster,score:1};
      }
      const cluster=best.cluster;
      cluster.workouts.push(workout);
      cluster.exerciseSets.push(exercises);
      if(!cluster.title && title) cluster.title=title;
      sequence.push({workout,cluster});
    });
    return {ordered,clusters,sequence};
  }

  function inferNextWorkoutTemplate(workouts){
    const {ordered,clusters,sequence}=clusterWorkoutTemplates(workouts);
    if(ordered.length<5) return null;
    const latestEntry=sequence[sequence.length-1];
    const latestCluster=latestEntry.cluster;
    const transitions=new Map();
    for(let i=0;i<sequence.length-1;i++){
      if(sequence[i].cluster.id!==latestCluster.id) continue;
      const nextCluster=sequence[i+1].cluster;
      const entry=transitions.get(nextCluster.id)||{cluster:nextCluster,count:0,lastIndex:0};
      entry.count+=1;
      entry.lastIndex=i+1;
      transitions.set(nextCluster.id,entry);
    }
    let predictedCluster=null;
    if(transitions.size){
      predictedCluster=[...transitions.values()]
        .filter(entry=>entry.cluster.id!==latestCluster.id)
        .sort((a,b)=>b.count-a.count || b.lastIndex-a.lastIndex)[0]?.cluster || null;
    }
    if(!predictedCluster){
      const lastSeen=new Map();
      sequence.forEach((entry,index)=>lastSeen.set(entry.cluster.id,{cluster:entry.cluster,index}));
      predictedCluster=[...lastSeen.values()]
        .filter(entry=>entry.cluster.id!==latestCluster.id)
        .sort((a,b)=>a.index-b.index)[0]?.cluster || null;
    }
    let strategy=predictedCluster ? (transitions.has(predictedCluster.id)?"transition":"least-recent") : "single";
    if(!predictedCluster){
      const latestSet=workoutExerciseSet(latestEntry.workout);
      const distinct=[...sequence.slice(0,-1)]
        .map((entry,index)=>({
          entry,
          index,
          similarity:setSimilarity(latestSet,workoutExerciseSet(entry.workout))
        }))
        .filter(candidate=>candidate.similarity<0.999)
        .sort((a,b)=>a.similarity-b.similarity || b.index-a.index)[0];
      if(distinct){
        predictedCluster=distinct.entry.cluster;
        strategy="different-history";
        const template=distinct.entry.workout;
        return {
          template,
          programLength:Math.max(2,clusters.length),
          confidence:Math.max(35,Math.round((1-distinct.similarity)*100)),
          repeatsLatest:false,
          strategy
        };
      }
    }
    if(!predictedCluster) predictedCluster=latestCluster;
    const template=[...predictedCluster.workouts].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    if(!template) return null;
    const matchingTransitions=transitions.get(predictedCluster.id)?.count||0;
    const latestOccurrences=latestCluster.workouts.length;
    return {
      template,
      programLength:clusters.length,
      confidence:clusters.length===1 ? 25 : latestOccurrences>1 ? Math.round(matchingTransitions/Math.max(1,latestOccurrences-1)*100) : 50,
      repeatsLatest:predictedCluster.id===latestCluster.id,
      strategy
    };
  }

  function exerciseHistory(exerciseId){
    return allLogsFlat()
      .filter(log=>log.exerciseId===exerciseId)
      .sort((a,b)=>new Date(a.date)-new Date(b.date));
  }

  function averageSetCount(logs){
    if(!logs.length) return 0;
    return Math.max(1,Math.round(logs.reduce((sum,log)=>sum+(log.sets?.length||0),0)/logs.length));
  }

  function goalForExercise(exerciseId){
    return (state.goals||[])
      .filter(goal=>goal.type==="exercise" && goal.exerciseId===exerciseId && goalProgress(goal)<100)
      .sort((a,b)=>goalProgress(b)-goalProgress(a))[0] || null;
  }

  function recommendExerciseFromHistory(item){
    const ex=state.exercises.find(exercise=>exercise.id===item.exerciseId);
    if(!ex) return null;
    const logs=exerciseHistory(ex.id);
    const recent=logs.slice(-4);
    const last=recent[recent.length-1] || {sets:item.sets||[]};
    const previous=recent[recent.length-2];
    const setCount=averageSetCount(recent) || Math.max(1,item.sets?.length||1);
    const type=exerciseTracking(ex);
    const goal=goalForExercise(ex.id);
    const goalNote=goal
      ? (state.lang==="en"
        ? ` Goal: ${fmtNum(goal.target)} ${primaryUnit(ex)} (${goalProgress(goal)}%).`
        : ` Ціль: ${fmtNum(goal.target)} ${primaryUnit(ex)} (${goalProgress(goal)}%).`)
      : "";
    if(type==="strength"){
      const weight=maxWeightOfSets(last.sets);
      const reps=Math.max(0,...(last.sets||[]).filter(set=>parseNum(set.weight)===weight).map(set=>parseNum(set.reps)));
      const previousWeight=previous?maxWeightOfSets(previous.sets):0;
      const increment=["legs","back"].includes(ex.category)?5:2.5;
      let targetWeight=weight;
      let targetReps=Math.max(6,reps||8);
      let reason=state.lang==="en"?"stabilize the current working load":"закріпити поточну робочу вагу";
      if(reps>=8 && recent.length>=2){
        targetWeight=weight+increment;
        targetReps=6;
        reason=state.lang==="en"?"recent sessions show room to progress":"останні заняття дають запас для прогресії";
      }else if(reps>=6){
        targetReps=reps+1;
        reason=state.lang==="en"?"add one clean rep before increasing weight":"додати одне чисте повторення перед підвищенням ваги";
      }else if(previousWeight>0 && weight<previousWeight){
        targetWeight=weight;
        targetReps=6;
        reason=state.lang==="en"?"return to stable technique after a load reduction":"повернути стабільну техніку після зниження ваги";
      }
      if(goal && parseNum(goal.target)>weight && reps>=7){
        targetWeight=Math.min(parseNum(goal.target),Math.max(targetWeight,weight+increment));
        reason=state.lang==="en"?"the active strength goal raises priority for gradual overload":"активна силова ціль підвищує пріоритет поступового навантаження";
      }
      return {
        kind:"exercise",exerciseId:ex.id,title:exName(ex),
        prescription:`${setCount} × ${targetReps} · ${fmtNum(targetWeight)} kg`,
        text:(state.lang==="en"?`Based on ${recent.length} recent performances: ${reason}.`:`На основі ${recent.length} останніх виконань: ${reason}.`)+goalNote
      };
    }
    const best=maxPrimaryOfSets(ex,last.sets);
    let target=best;
    if(type==="reps") target=best+1;
    if(type==="time") target=Math.round((best+1)*10)/10;
    if(type==="distance") target=Math.round((best+0.1)*10)/10;
    if(goal) target=Math.min(parseNum(goal.target),Math.max(target,best));
    return {
      kind:"exercise",exerciseId:ex.id,title:exName(ex),
      prescription:`${setCount} × ${fmtNum(target)} ${primaryUnit(ex)}`,
      text:(state.lang==="en"
        ? `Progress from the recent ${fmtNum(best)} ${primaryUnit(ex)} without breaking pace or technique.`
        : `Прогресуй від останніх ${fmtNum(best)} ${primaryUnit(ex)}, не втрачаючи темп і техніку.`)+goalNote
    };
  }

  function bodyGoalRecommendation(){
    const goal=(state.goals||[])
      .filter(goal=>goal.type==="body" && goalProgress(goal)<100)
      .sort((a,b)=>goalProgress(b)-goalProgress(a))[0];
    if(!goal) return null;
    const current=goalCurrent(goal);
    const reducing=parseNum(goal.target)<parseNum(goal.start||current);
    if(["weight","waist"].includes(goal.metric) && reducing){
      return {
        kind:"goal",title:state.lang==="en"?"Goal adjustment":"Корекція під ціль",
        prescription:state.lang==="en"?"10–20 min easy cardio":"10–20 хв легкого кардіо",
        text:state.lang==="en"
          ? `${goalLabel(goal)}: ${fmtNum(current)} → ${fmtNum(goal.target)}. Keep strength work, add moderate cardio only if recovery is good.`
          : `${goalLabel(goal)}: ${fmtNum(current)} → ${fmtNum(goal.target)}. Збережи силову частину й додай помірне кардіо лише за нормального відновлення.`
      };
    }
    return {
      kind:"goal",title:state.lang==="en"?"Goal adjustment":"Корекція під ціль",
      prescription:state.lang==="en"?"Add 1 set to the priority movement":"Додай 1 підхід до пріоритетної вправи",
      text:state.lang==="en"
        ? `${goalLabel(goal)}: ${fmtNum(current)} → ${fmtNum(goal.target)}. Increase weekly volume gradually, without changing the program rotation.`
        : `${goalLabel(goal)}: ${fmtNum(current)} → ${fmtNum(goal.target)}. Поступово збільшуй тижневий обсяг, не ламаючи чергування програми.`
    };
  }

  function buildProgramRecommendations(){
    const prediction=inferNextWorkoutTemplate(state.workouts||[]);
    if(!prediction) return [];
    const template=prediction.template;
    const recommendations=(template.items||[])
      .map(recommendExerciseFromHistory)
      .filter(Boolean);
    const activeExerciseGoal=(state.goals||[])
      .filter(goal=>goal.type==="exercise" && goalProgress(goal)<100)
      .sort((a,b)=>goalProgress(b)-goalProgress(a))[0];
    if(activeExerciseGoal && !(template.items||[]).some(item=>item.exerciseId===activeExerciseGoal.exerciseId)){
      const goalEx=state.exercises.find(ex=>ex.id===activeExerciseGoal.exerciseId);
      if(goalEx) recommendations.push({
        kind:"goal",title:state.lang==="en"?"Goal stays in rotation":"Ціль залишається в ротації",
        prescription:`${exName(goalEx)}: ${fmtNum(goalCurrent(activeExerciseGoal))} → ${fmtNum(activeExerciseGoal.target)} ${primaryUnit(goalEx)}`,
        text:state.lang==="en"
          ? "This exercise is not part of the predicted next session, so it is not added artificially. Progress it on its regular program day."
          : "Цієї вправи немає у прогнозованому наступному занятті, тому вона не додається штучно. Прогресуй її у звичний день програми."
      });
    }
    const goalAdjustment=bodyGoalRecommendation();
    if(goalAdjustment) recommendations.push(goalAdjustment);
    return [{
      kind:"summary",
      title:prediction.repeatsLatest
        ? (state.lang==="en"?"Rotation not detected":"Ротацію ще не визначено")
        : template.title || (state.lang==="en"?"Predicted session":"Прогнозоване заняття"),
      prescription:state.lang==="en"
        ? prediction.repeatsLatest
          ? `${(template.items||[]).length} exercises · one repeated session type`
          : `${(template.items||[]).length} exercises · ${prediction.programLength}-session rotation`
        : prediction.repeatsLatest
          ? `${(template.items||[]).length} вправ · один повторюваний тип заняття`
          : `${(template.items||[]).length} вправ · ротація з ${prediction.programLength} типів занять`,
      text:state.lang==="en"
        ? prediction.repeatsLatest
          ? `The ${state.workouts.length} saved workouts do not yet show a distinct exercise rotation. The app will adjust load, but will not invent a different program day.`
          : `Suggested from the sequence of ${state.workouts.length} workouts. Pattern confidence: ${prediction.confidence}%.`
        : prediction.repeatsLatest
          ? `У ${state.workouts.length} збережених тренуваннях ще не видно окремого чергування вправ. Додаток скоригує навантаження, але не вигадуватиме інший день програми.`
          : `Запропоновано за послідовністю ${state.workouts.length} тренувань. Впевненість у патерні: ${prediction.confidence}%.`,
      templateWorkoutId:template.id
    },...recommendations].slice(0,8);
  }

  function rebuildWorkoutDerivedData(){
    const rebuilt={};
    const ordered=[...(state.workouts||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
    ordered.forEach(workout=>{
      (workout.items||[]).forEach(item=>{
        const ex=state.exercises.find(e=>e.id===item.exerciseId);
        if(!ex) return;
        const best=maxPrimaryOfSets(ex,item.sets);
        const current=parseNum(rebuilt[item.exerciseId]?.value);
        if(best<=current) return;
        const prSet=(item.sets||[]).find(set=>primarySetValue(ex,set)===best) || {};
        rebuilt[item.exerciseId]={
          type:exerciseTracking(ex),
          value:best,
          weight:parseNum(prSet.weight),
          reps:parseNum(prSet.reps),
          duration:parseNum(prSet.duration),
          distance:parseNum(prSet.distance),
          date:workout.date,
          workoutId:workout.id
        };
      });
    });
    state.prs=rebuilt;
    state.recommendations=buildProgramRecommendations();
    state.settings.derivedDataVersion=4;
  }

  function openRecommendationsModal(recommendations,gotAnyPR){
    if(!recommendations?.length) return;
    const summary=recommendations[0];
    const details=recommendations.slice(1);
    const overlay=document.createElement("div");
    overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(9px);z-index:180;display:grid;place-items:center;padding:16px";
    const modal=document.createElement("div");
    modal.className="card";
    modal.style.cssText="width:min(680px,96vw);max-height:84vh;overflow:auto";
    modal.innerHTML=`
      <div class="detailHeader"><div class="detailTitle"><h2>${gotAnyPR?"🏆 ":""}${t("saveOk")}</h2><div class="sub">${state.lang==="en"?"Program forecast updated":"Прогноз програми оновлено"}</div></div><button class="btn" id="recClose">✕</button></div>
      <div class="recommendationHero" style="margin-top:12px"><div><div class="recommendationSession">${escapeHtml(summary.title)}</div><div class="muted">${escapeHtml(summary.prescription||"")}</div></div></div>
      <div class="recommendationReason">${escapeHtml(summary.text||"")}</div>
      <div class="recommendationPlan">${details.map(rec=>`<div class="recommendationPlanRow"><div class="recommendationPlanMain"><strong>${escapeHtml(rec.title)}</strong><span>${escapeHtml(rec.text||"")}</span></div><div class="recommendationPrescription">${escapeHtml(rec.prescription||"")}</div></div>`).join("")}</div>
      <div class="premiumNote" style="margin-top:14px">${state.lang==="en"?"The forecast follows your workout rotation and recent performance. Adjust it if recovery or technique is poor.":"Прогноз враховує чергування твоїх занять та останні результати. Коригуй його, якщо відновлення або техніка недостатні."}</div>
      <button class="btn primary" id="recOk" style="width:100%;margin-top:14px">${t("ok")}</button>`;
    overlay.appendChild(modal);document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    modal.querySelector("#recClose").onclick=close;
    modal.querySelector("#recOk").onclick=close;
  }

  function saveWorkoutSession(){
    const workoutId = workoutSession.workoutId || uid();
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
    const savedWorkout={ id:workoutId,date,title,items };
    const nativeFinishedSnapshot=workoutNativeSnapshot("finish");
    const completedPlanId=workoutSession.planId;
    if(workoutSession.workoutId){
      state.workouts=state.workouts.map(workout=>workout.id===workoutId?savedWorkout:workout);
    }else{
      state.workouts.unshift(savedWorkout);
    }
    if(completedPlanId){
      state.plannedWorkouts=(state.plannedWorkouts||[]).map(plan=>plan.id===completedPlanId
        ? {...plan,status:"completed",completedWorkoutId:workoutId}
        : plan);
    }
    rebuildWorkoutDerivedData();
    save();

    workoutSession = { active:false, startedAt:null, title:"", workoutId:null, planId:null, items:[] };
    resetRestTimer();
    nativeWorkoutBridge()?.finishWorkout?.({ ...nativeFinishedSnapshot, savedWorkout }).catch(()=>{});

    setTab("home");
    if(state.recommendations.length) setTimeout(()=>openRecommendationsModal(state.recommendations,gotAnyPR),0);
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
      if(workoutSession.workoutId===workoutId){
        workoutSession={active:false,startedAt:null,title:"",workoutId:null,planId:null,items:[]};
      }
      rebuildWorkoutDerivedData();
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

      <div class="categoryRail" id="exCats"></div>

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
    box.innerHTML = allCategories().map(c=>{
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
          ${allCategories().filter(c=>c.id!=="all").map(c=>`<option value="${c.id}">${state.lang==="ua"?c.ua:c.en}</option>`).join("")}
          <option value="__new">${state.lang==="en"?"+ New category":"+ Нова категорія"}</option>
        </select>
        <div id="newCategoryFields" class="newCategoryFields" style="display:none">
          <input id="nCatUa" class="btn" placeholder="${state.lang==="en"?"Category name":"Назва категорії"}" />
          <input id="nCatEn" class="btn" placeholder="${state.lang==="en"?"English name (optional)":"Назва англійською (необов’язково)"}" />
        </div>
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
    const categorySelect=modal.querySelector("#nCat");
    const newCategoryFields=modal.querySelector("#newCategoryFields");
    categorySelect.onchange=()=>{
      newCategoryFields.style.display=categorySelect.value==="__new" ? "grid" : "none";
    };

    const addDo = modal.querySelector("#addDo");
    if (addDo) addDo.onclick = ()=>{
      const name_ua = (modal.querySelector("#nUa")?.value || "").trim();
      const name_en = (modal.querySelector("#nEn")?.value || "").trim();
      let category = modal.querySelector("#nCat")?.value || "back";
      const trackingType = modal.querySelector("#nTracking")?.value || "strength";
      if (!name_ua && !name_en) return;
      if(category==="__new"){
        const ua=(modal.querySelector("#nCatUa")?.value||"").trim();
        const en=(modal.querySelector("#nCatEn")?.value||"").trim();
        if(!ua && !en) return;
        const base=(ua||en).toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"") || uid();
        category=`custom-${base}-${Date.now().toString(36)}`;
        state.customCategories.push({
          id:category,
          ua:ua||en,
          en:en||ua,
          tone:["purple","teal","pink","gold"][state.customCategories.length%4]
        });
      }

      state.exercises.unshift({
        id: uid(),
        name_ua: name_ua || name_en,
        name_en: name_en || name_ua,
        category,
        trackingType
      });
      save();
      close();
      renderExCats();
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
        state.recommendations=buildProgramRecommendations();
        save();
        render();
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
      state.recommendations=buildProgramRecommendations();
      save();close();render();
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

      <div class="sectionCard bodyMeasureCard">
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
        state.recommendations=buildProgramRecommendations();
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
        state.recommendations=buildProgramRecommendations();
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

      <div class="categoryRail" id="recCats"></div>
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
    box.innerHTML = allCategories().map(c=>{
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
        <div class="itemRow recordRow" data-open-record-stat="${x.ex.id}" role="button" tabindex="0">
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
      b.onclick = (event)=>{
        event.stopPropagation();
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
    box.querySelectorAll("[data-open-record-stat]").forEach(row=>{
      const open=()=>{
        selectedStatsExerciseId = row.getAttribute("data-open-record-stat");
        setTab("stats");
        setTimeout(()=>$("#detailBox")?.scrollIntoView?.({ behavior:"smooth", block:"start" }),40);
      };
      row.onclick = open;
      row.onkeydown = (event)=>{
        if(event.key==="Enter" || event.key===" "){
          event.preventDefault();
          open();
        }
      };
    });
  }

  // ---------- SETTINGS ----------
  function legacyUsageGuideMarkup(){
    const en=state.lang==="en";
    const steps=[
      {
        title:en?"1. Create or choose exercises":"1. Створи або обери вправи",
        sub:en?"Exercise type defines what you enter":"Тип вправи визначає поля введення",
        copy:en
          ? "Open Exercises and tap +. Choose an existing category or New category. Then select tracking: weight + reps, reps only, duration, or distance + time."
          : "Відкрий «Вправи» й натисни +. Обери наявну категорію або «Нова категорія». Далі вкажи тип обліку: вага + повтори, лише повтори, час або дистанція + час.",
        example:en?"Example: Pull-ups → Reps only. Treadmill → Distance + time.":"Приклад: Підтягування → Лише повтори. Доріжка → Дистанція + час.",
        mini:`<div class="miniTitle">＋ ${en?"New exercise":"Нова вправа"}</div><div class="miniField">${en?"Pull-ups":"Підтягування"}</div><div class="miniRow"><div class="miniField">${en?"Back":"Спина"}</div><div class="miniField">${en?"Reps only":"Лише повтори"}</div></div><div class="miniButton" style="margin-top:6px;text-align:center">${en?"Create":"Створити"}</div>`
      },
      {
        title:en?"2. Start a workout":"2. Почни тренування",
        sub:en?"Build today's exercise list":"Склади список вправ на сьогодні",
        copy:en
          ? "Open Workout, set a title if needed, then tap Add exercise. Add every exercise you plan to perform."
          : "Відкрий «Тренування», за потреби зміни назву й натисни «Додати вправу». Додай усі вправи, які плануєш виконати.",
        example:en?"Example: Chest Monday → Bench press, incline press, push-ups.":"Приклад: Груди понеділок → Жим лежачи, жим під кутом, віджимання.",
        mini:`<div class="miniTitle">${en?"Workout":"Тренування"}</div><div class="miniField">${en?"Chest Monday":"Груди понеділок"}</div><div class="miniRow"><div class="miniButton">＋ ${en?"Add exercise":"Додати вправу"}</div></div>`
      },
      {
        title:en?"3. Enter sets correctly":"3. Правильно внеси підходи",
        sub:en?"Fields change automatically by exercise type":"Поля змінюються за типом вправи",
        copy:en
          ? "Add a set and enter the actual result. Strength uses reps and kg; bodyweight uses reps; timed exercises use minutes; cardio uses distance and minutes. When all required fields are filled, the rest timer starts automatically."
          : "Додай підхід і внеси фактичний результат. Силова вправа має повтори та кг; власна вага — повтори; вправа на час — хвилини; кардіо — дистанцію та хвилини. Коли всі потрібні поля заповнені, таймер відпочинку запускається автоматично.",
        example:en?"80 kg × 8 starts the timer. At zero the phone vibrates if vibration is supported and enabled.":"80 кг × 8 запускає таймер. На нулі телефон вібрує, якщо пристрій підтримує вібрацію і вона дозволена.",
        mini:`<div class="miniTitle">${en?"Sets":"Підходи"}</div><div class="miniRow"><div class="miniField">#1</div><div class="miniField">8 ${en?"reps":"повт."}</div><div class="miniField">80 kg</div></div><div class="miniRow"><div class="miniField">2.5 km</div><div class="miniField">30 ${en?"min":"хв"}</div></div>`
      },
      {
        title:en?"4. Save and review advice":"4. Збережи й переглянь пораду",
        sub:en?"The workout enters history and updates PRs":"Тренування потрапить в історію та оновить рекорди",
        copy:en
          ? "After the final set tap Save workout. Records and statistics update immediately. After at least 5 sessions, the app compares exercise combinations, learns your A/B/C rotation, and predicts the next program day from the full history."
          : "Після останнього підходу натисни «Зберегти тренування». Рекорди й статистика оновляться одразу. Після щонайменше 5 занять додаток порівнює поєднання вправ, вивчає ротацію A/B/C і прогнозує наступний день з усієї історії.",
        example:en?"A → B → C → A means the next forecast is B. If every saved workout has the same exercises, the app says that no rotation is visible instead of inventing one.":"A → B → C → A означає, що наступним прогнозується B. Якщо всі збережені заняття мають однакові вправи, додаток повідомить, що ротації ще не видно, а не вигадуватиме її.",
        mini:`<div class="miniButton" style="text-align:center">💾 ${en?"Save workout":"Зберегти тренування"}</div><div class="miniRow"><div class="miniStat">${en?"Calories":"Калорії"}<strong>≈ 420</strong></div><div class="miniStat">PR<strong>+2.5 kg</strong></div></div>`
      },
      {
        title:en?"5. Add body measurements":"5. Додай заміри тіла",
        sub:en?"Use the same conditions for comparable data":"Роби заміри в однакових умовах",
        copy:en
          ? "In Body choose the date, then enter only the measurements you took. Empty fields are allowed. For a clean trend, measure at the same time of day."
          : "У «Тіло» спочатку обери дату, потім внеси лише ті показники, які виміряв. Порожні поля дозволені. Для чесного графіка вимірюйся приблизно в однаковий час.",
        example:en?"Weight 89 kg · waist 90 cm. You do not have to fill every field.":"Вага 89 кг · талія 90 см. Заповнювати всі поля не обов’язково.",
        mini:`<div class="miniTitle">${en?"Body measurement":"Заміри тіла"}</div><div class="miniField">09.06.2026</div><div class="miniRow"><div class="miniField">89 kg</div><div class="miniField">90 cm</div></div><div class="miniButton" style="margin-top:6px;text-align:center">${en?"Save":"Зберегти"}</div>`
      },
      {
        title:en?"6. Set goals and read progress":"6. Постав цілі й аналізуй прогрес",
        sub:en?"Goals appear first on Home":"Цілі відображаються першими на головній",
        copy:en
          ? "Create a strength, repetition, time, distance, weight, or body measurement target. The forecast keeps your program rotation but changes progression priority, volume, or cardio advice to match the active goal."
          : "Створи ціль для ваги, повторів, часу, дистанції або показника тіла. Прогноз зберігає чергування програми, але змінює пріоритет прогресії, обсяг або пораду щодо кардіо відповідно до активної цілі.",
        example:en?"Bench 100 kg raises overload priority on bench day; waist 85 cm may add 10–20 min easy cardio without replacing strength work.":"Жим 100 кг підвищує пріоритет навантаження у день жиму; талія 85 см може додати 10–20 хв легкого кардіо без заміни силової частини.",
        mini:`<div class="miniTitle">${en?"Goal":"Ціль"} · ${en?"Bench press":"Жим лежачи"}</div><div style="font-size:17px;font-weight:950">92 → 100 kg</div><div class="miniBar"><span></span></div><div class="miniRow"><div class="miniStat">${en?"Progress":"Прогрес"}<strong>60%</strong></div><div class="miniStat">${en?"Period":"Період"}<strong>${en?"Month":"Місяць"}</strong></div></div>`
      },
      {
        title:en?"7. Protect your data":"7. Захисти свої дані",
        sub:en?"Export JSON regularly":"Регулярно роби експорт JSON",
        copy:en
          ? "All information is stored on this device. In Settings tap Export JSON and keep the file. After reinstalling or changing phones, use Import JSON."
          : "Усі дані зберігаються на цьому пристрої. У «Налаштуваннях» натисни «Експорт JSON» і збережи файл. Після перевстановлення або зміни телефона використай «Імпорт JSON».",
        example:en?"Recommended: export after important workouts or at least once a month.":"Рекомендація: експортуй після важливих тренувань або щонайменше раз на місяць.",
        mini:`<div class="miniTitle">${en?"Backup":"Резервна копія"}</div><div class="miniRow"><div class="miniButton">${en?"Export JSON":"Експорт JSON"}</div><div class="miniField">${en?"Import JSON":"Імпорт JSON"}</div></div><div class="miniField" style="margin-top:6px">gym-tracker-data.json</div>`
      }
    ];
    if(appShell.mode!=="user") steps.push({
      title:en?"8. Manage clients and calendar":"8. Керуй клієнтами й календарем",
      sub:en?"Your progress is separate from real clients":"Твій прогрес відокремлений від реальних клієнтів",
      copy:en
        ? "The trainer dashboard starts with no selected profile, so regular tabs stay empty until you explicitly open My progress or a client. My progress is never included in the calendar. Use Week or Month to plan sessions, pause inactive clients, restore them later, and compare active clients over the last 30 days. Calendar records already contain sync metadata for a future Google Calendar connection, but no Google account is connected yet."
        : "Панель тренера відкривається без вибраного профілю, тому звичайні вкладки порожні, доки ти явно не відкриєш «Мій прогрес» або клієнта. «Мій прогрес» ніколи не входить до календаря. Плануй заняття у режимі «Тиждень» або «Місяць», став неактивних клієнтів на паузу, відновлюй їх і порівнюй активних клієнтів за останні 30 днів. Записи вже мають службові поля для майбутнього підключення Google Calendar, але Google-акаунт зараз ще не під’єднується.",
      example:en
        ? "Anna · June 15 · 18:00. Deleting the entry asks for confirmation. A paused client disappears from active planning but remains recoverable."
        : "Анна · 15 червня · 18:00. Видалення запису потребує підтвердження. Клієнт на паузі зникає з активного планування, але його можна відновити.",
      mini:`<div class="miniTitle">${en?"Trainer calendar":"Календар тренера"} · ${en?"Month":"Місяць"}</div><div class="miniRow"><div class="miniField">${en?"Active":"Активні"}: 4</div><div class="miniField">${en?"Paused":"На паузі"}: 1</div></div><div class="miniRow"><div class="miniField">${en?"Anna":"Анна"} · 18:00</div><div class="miniField">${en?"Compare":"Порівняння"}</div></div>`
    });
    return `
      <div class="guideHero">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#67e8f9">${en?"Quick start":"Швидкий старт"}</div>
        <div style="font-size:22px;font-weight:950;margin-top:5px">${en?"How to use GymTracker Pro":"Як користуватися GymTracker Pro"}</div>
        <div class="muted" style="margin-top:6px">${en?"Follow the route once, then the app becomes a simple training diary.":"Пройди цей маршрут один раз — далі додаток працюватиме як зрозумілий щоденник тренувань."}</div>
        <div class="guideFlow">${steps.map((_,i)=>`${i?`<span class="guideFlowArrow">›</span>`:""}<span class="guideFlowStep">${i+1}</span>`).join("")}</div>
      </div>
      <div class="guideList">${steps.map((step,i)=>`
        <details class="guideStep" ${i===0?"open":""}>
          <summary><span class="guideNumber">${i+1}</span><span class="guideSummaryText"><strong>${step.title}</strong><span>${step.sub}</span></span><span class="guideChevron">⌄</span></summary>
          <div class="guideContent">
            <div class="guideCopy">${step.copy}<div class="guideExample"><strong>${en?"Example":"Приклад"}:</strong> ${step.example}</div></div>
            <div class="miniScreen"><div class="miniTop"></div>${step.mini}</div>
          </div>
        </details>`).join("")}</div>`;
  }

  function usageGuideMarkup(){
    const en=state.lang==="en";
    const userSteps=[
      {
        title:en?"Choose User mode":"Обери режим «Користувач»",
        sub:en?"Your personal training space":"Особистий простір для тренувань",
        copy:en
          ?"Choose User on the first screen. Your workouts, measurements, goals and records stay in one personal profile. Changing modes does not delete existing information."
          :"На першому екрані обери «Користувач». Тренування, заміри, цілі та рекорди зберігаються в одному особистому профілі. Зміна режиму не видаляє наявні дані.",
        example:en?"Use Settings → Change mode whenever you need to switch.":"Перемикатися можна через «Налаштування» → «Змінити режим».",
        mini:`<div class="miniTitle">${en?"Workspace":"Режим роботи"}</div><div class="miniButton">${en?"User":"Користувач"}</div>`
      },
      {
        title:en?"Prepare exercises":"Підготуй вправи",
        sub:en?"Category and tracking type control the fields":"Категорія і тип обліку визначають поля",
        copy:en
          ?"Open Exercises, use an existing exercise or tap +. Choose a category or create a new one, then select weight + reps, reps only, duration, or distance + time."
          :"Відкрий «Вправи», обери наявну вправу або натисни +. Вкажи категорію чи створи нову, а також тип обліку: вага + повтори, лише повтори, тривалість або дистанція + час.",
        example:en?"Bench press: weight + reps. Pull-ups: reps only. Treadmill: distance + time.":"Жим лежачи: вага + повтори. Підтягування: лише повтори. Доріжка: дистанція + час.",
        mini:`<div class="miniTitle">＋ ${en?"Exercise":"Вправа"}</div><div class="miniField">${en?"Pull-ups":"Підтягування"}</div><div class="miniRow"><div class="miniField">${en?"Back":"Спина"}</div><div class="miniField">${en?"Reps":"Повтори"}</div></div>`
      },
      {
        title:en?"Start or continue a workout":"Почни або продовж тренування",
        sub:en?"Build today's list and keep unfinished work":"Склади план дня і не втрачай незавершене",
        copy:en
          ?"Start from Home or Workout, add exercises and enter a title. A workout from the current day can be continued. Saving and clearing require confirmation to prevent accidental taps."
          :"Почни з «Головної» або «Тренування», додай вправи та назву. Тренування поточного дня можна продовжити. Збереження й очищення потребують підтвердження, щоб уникнути випадкового натискання.",
        example:en?"Chest day: bench press, incline press, push-ups.":"День грудей: жим лежачи, жим під кутом, віджимання.",
        mini:`<div class="miniTitle">${en?"Today's workout":"Сьогоднішнє тренування"}</div><div class="miniField">${en?"Chest day":"Груди"}</div><div class="miniButton">＋ ${en?"Add exercise":"Додати вправу"}</div>`
      },
      {
        title:en?"Record sets and rest":"Внось підходи та відпочинок",
        sub:en?"The form adapts to each exercise":"Форма підлаштовується під тип вправи",
        copy:en
          ?"Enter the actual result in the labeled fields. When the required values are filled, the rest timer starts automatically. At zero the app can vibrate on supported devices."
          :"Внось фактичний результат у підписані поля. Після заповнення потрібних значень таймер відпочинку запускається автоматично. Після завершення телефон може вібрувати, якщо пристрій це підтримує.",
        example:en?"Strength: 80 kg × 8. Cardio: 2.5 km in 30 min.":"Силова: 80 кг × 8. Кардіо: 2,5 км за 30 хв.",
        mini:`<div class="miniTitle">${en?"Set 1":"Підхід 1"}</div><div class="miniRow"><div class="miniField">80 kg</div><div class="miniField">8 ${en?"reps":"повт."}</div></div><div class="miniField">01:30 ${en?"rest":"відпочинок"}</div>`
      },
      {
        title:en?"Save, edit or delete correctly":"Зберігай, редагуй і видаляй правильно",
        sub:en?"All derived results are recalculated":"Усі похідні результати перераховуються",
        copy:en
          ?"After the last set save the workout. Statistics, records, favorites and recommendations update from saved history. If a workout is deleted, its records and traces are removed as well."
          :"Після останнього підходу збережи тренування. Статистика, рекорди, улюблені вправи й рекомендації оновлюються зі збереженої історії. Якщо тренування видалити, його рекорди та сліди також прибираються.",
        example:en?"A deleted test workout no longer affects the maximum weight.":"Видалене тестове тренування більше не впливає на максимальну вагу.",
        mini:`<div class="miniButton">${en?"Save workout":"Зберегти тренування"}</div><div class="miniRow"><div class="miniField">${en?"Edit":"Редагувати"}</div><div class="miniField">${en?"Delete":"Видалити"}</div></div>`
      },
      {
        title:en?"Set goals and use recommendations":"Постав цілі та користуйся рекомендаціями",
        sub:en?"Advice learns from history and workout rotation":"Поради враховують історію й чергування програми",
        copy:en
          ?"Create strength, reps, time, distance, weight or body goals. After at least 5 saved sessions, recommendations appear in Workout above the current session, so they are available right before training."
          :"Створи ціль для сили, повторів, часу, дистанції, ваги або замірів тіла. Після щонайменше 5 збережених занять рекомендації показуються в розділі «Тренування» над поточним заняттям, щоб вони були під рукою перед роботою.",
        example:en?"Bench 105 kg and body weight 90 kg may change priorities without replacing your program.":"Жим 105 кг і вага тіла 90 кг можуть змінювати пріоритети, не підміняючи твою програму.",
        mini:`<div class="miniTitle">${en?"Goal":"Ціль"} · ${en?"Bench press":"Жим лежачи"}</div><div style="font-weight:950">92 → 105 kg</div><div class="miniBar"><span></span></div>`
      },
      {
        title:en?"Read Home, Statistics and Body":"Аналізуй головну, статистику й тіло",
        sub:en?"Choose a period and open exercise details":"Обирай період і відкривай деталі вправ",
        copy:en
          ?"Home shows goals, a weekly/monthly/yearly overview, favorites and recent sessions. Tap the workout count to jump to the workout list. Tap a favorite or a record to open that exercise's statistics. Body stores partial measurements in a compact form."
          :"Головна показує цілі, огляд за тиждень/місяць/рік, улюблені вправи й останні заняття. Натисни кількість тренувань, щоб перейти до списку. Натисни улюблену вправу або рекорд, щоб відкрити статистику цієї вправи. «Тіло» зберігає часткові заміри в компактній формі.",
        example:en?"Enter only weight and waist today; empty body fields are allowed.":"Сьогодні можна внести лише вагу й талію; порожні поля дозволені.",
        mini:`<div class="miniRow"><div class="miniStat">${en?"Month":"Місяць"}<strong>12</strong></div><div class="miniStat">${en?"Calories":"Калорії"}<strong>≈420</strong></div></div>`
      },
      {
        title:en?"Plan future workouts and templates":"Плануй майбутні тренування і шаблони",
        sub:en?"Prepare Tuesday or Thursday before the day comes":"Заготуй вівторок чи четвер ще до тренування",
        copy:en
          ?"In Workout use the planner calendar to create a future workout. Pick a date, name it, choose exercises manually or load a saved template. On the planned day tap Start, adjust the title or exercises if needed, enter real sets, then save. Statistics update only after saving the actual workout."
          :"У розділі «Тренування» використовуй календар планування: обери дату, назву, вправи вручну або готовий шаблон. У потрібний день натисни «Почати», за потреби зміни назву чи вправи, внеси фактичні підходи й збережи. У статистику потрапляє тільки реально завершене тренування.",
        example:en?"Sunday: plan Push for Tuesday and Pull for Thursday. Thursday: open the plan and start with exercises already loaded.":"Неділя: заплануй «Жим» на вівторок і «Тяга» на четвер. У четвер відкрий план і почни вже з набраними вправами.",
        mini:`<div class="miniTitle">${en?"Planner":"Планувальник"} · ${en?"Templates":"Шаблони"}</div><div class="miniRow"><div class="miniField">${en?"Tue":"Вт"} · ${en?"Push":"Жим"}</div><div class="miniField">${en?"Thu":"Чт"} · ${en?"Pull":"Тяга"}</div></div><div class="miniButton">${en?"Start planned workout":"Почати план"}</div>`
      },
      {
        title:en?"Back up and restore data":"Створюй резервну копію та відновлюй дані",
        sub:en?"JSON keeps your local data portable":"JSON дозволяє перенести локальні дані",
        copy:en
          ?"Data is stored on this device. Use Export all for a complete backup, or Export active profile when you need only one client or My progress. Merge into active profile adds new workouts, body records, goals and exercises without replacing existing history."
          :"Дані зберігаються на цьому пристрої. Використовуй «Експорт всього» для повної копії або «Експорт активного профілю», коли потрібен лише один клієнт чи «Мій прогрес». «Доповнити активний профіль» додає нові тренування, заміри, цілі та вправи без затирання наявної історії.",
        example:en?"A client can receive their own JSON file, train alone, then send it back so the trainer merges the new progress.":"Клієнт може отримати свій JSON, займатись самостійно, а потім надіслати файл назад, щоб тренер доповнив новий прогрес.",
        mini:`<div class="miniTitle">${en?"Backup":"Резервна копія"}</div><div class="miniRow"><div class="miniButton">${en?"Export profile":"Експорт профілю"}</div><div class="miniField">${en?"Merge":"Доповнити"}</div></div>`
      }
    ];
    const trainerSteps=[
      {
        title:en?"Choose Trainer mode":"Обери режим «Тренер»",
        sub:en?"The dashboard opens without selecting anyone":"Панель відкривається без вибраного профілю",
        copy:en
          ?"Trainer mode manages several independent people. Until you explicitly select My progress or a client, the regular tabs intentionally show no personal data."
          :"Режим тренера веде кількох незалежних людей. Поки ти явно не обереш «Мій прогрес» або клієнта, звичайні вкладки навмисно не показують чиїсь персональні дані.",
        example:en?"This prevents accidentally entering a workout for the wrong person.":"Це захищає від випадкового внесення тренування не тій людині.",
        mini:`<div class="miniTitle">${en?"Trainer dashboard":"Панель тренера"}</div><div class="miniField">${en?"No profile selected":"Профіль не вибрано"}</div>`
      },
      {
        title:en?"Use My progress":"Використовуй «Мій прогрес»",
        sub:en?"The trainer's own diary is separate":"Особистий щоденник тренера відокремлений",
        copy:en
          ?"Open My progress when you want to record your own workouts. It has the complete user workflow but is not treated as a client and never appears in the appointment calendar."
          :"Відкрий «Мій прогрес», коли хочеш вести власні тренування. Тут доступний весь звичайний функціонал користувача, але цей профіль не вважається клієнтом і не потрапляє до календаря записів.",
        example:en?"Your bench session stays separate from every client's history.":"Твоє тренування жиму не змішується з історією клієнтів.",
        mini:`<div class="miniButton">${en?"My progress":"Мій прогрес"}</div><div class="miniField">${en?"Personal data only":"Лише особисті дані"}</div>`
      },
      {
        title:en?"Add and open a client":"Додай і відкрий клієнта",
        sub:en?"Every client has independent data":"Кожен клієнт має незалежні дані",
        copy:en
          ?"Create a client by name, then tap the client card to open the profile. Exercises, workouts, goals, body measurements, records and recommendations are stored separately for that client."
          :"Створи клієнта за ім’ям, а потім натисни його картку, щоб відкрити профіль. Вправи, тренування, цілі, заміри тіла, рекорди й рекомендації зберігаються окремо для цього клієнта.",
        example:en?"Anna and Viktor can have different exercises, goals and rest settings.":"Анна й Віктор можуть мати різні вправи, цілі та налаштування відпочинку.",
        mini:`<div class="miniTitle">＋ ${en?"New client":"Новий клієнт"}</div><div class="miniField">${en?"Anna":"Анна"}</div><div class="miniButton">${en?"Open profile":"Відкрити профіль"}</div>`
      },
      {
        title:en?"Work inside the selected profile":"Працюй у вибраному профілі",
        sub:en?"The standard tabs now belong to that person":"Звичайні вкладки тепер належать цій людині",
        copy:en
          ?"After choosing a profile, use Home, Workout, Exercises, Statistics, Body and Records exactly as in User mode. The profile button in the header returns to the trainer dashboard and clears the selection."
          :"Після вибору профілю використовуй «Головну», «Тренування», «Вправи», «Статистику», «Тіло» й «Рекорди» так само, як у режимі користувача. Кнопка профілю у шапці повертає до панелі тренера та скидає вибір.",
        example:en?"Always check the profile name before entering a set.":"Перед внесенням підходу перевір ім’я активного профілю.",
        mini:`<div class="miniTitle">◉ ${en?"Anna":"Анна"}</div><div class="miniRow"><div class="miniField">${en?"Workout":"Тренування"}</div><div class="miniField">${en?"Stats":"Статистика"}</div></div>`
      },
      {
        title:en?"Plan appointments in the calendar":"Плануй записи в календарі",
        sub:en?"Week and month views show the schedule":"Тиждень і місяць показують розклад",
        copy:en
          ?"Use Week for the near schedule and Month for broader planning. Tap a date to first see what is already planned for that day, then use Add session below the list to choose an active client, time and optional note."
          :"Використовуй «Тиждень» для найближчого розкладу, а «Місяць» — для довшого планування. Натисни дату, щоб спершу побачити всі записи цього дня, а нижче через «Додати запис» обери активного клієнта, час і примітку.",
        example:en?"Anna · June 15 · 18:00 · Leg day.":"Анна · 15 червня · 18:00 · Ноги.",
        mini:`<div class="miniTitle">${en?"Calendar":"Календар"} · ${en?"Month":"Місяць"}</div><div class="miniField">15 · ${en?"Anna":"Анна"} · 18:00</div>`
      },
      {
        title:en?"Manage appointments safely":"Керуй записами безпечно",
        sub:en?"Reminders work locally while the app is active":"Нагадування працюють локально, поки застосунок активний",
        copy:en
          ?"Planned sessions are shown in the trainer calendar. Deleting an appointment always asks for confirmation. Local notifications depend on browser permission and the app being able to run."
          :"Заплановані заняття відображаються в календарі тренера. Видалення запису завжди потребує підтвердження. Локальні сповіщення залежать від дозволу браузера та можливості застосунку працювати.",
        example:en?"Confirm deletion only after checking the client, date and time.":"Підтверджуй видалення лише після перевірки клієнта, дати й часу.",
        mini:`<div class="miniTitle">${en?"Appointment":"Запис"}</div><div class="miniField">${en?"Delete this appointment?":"Видалити цей запис?"}</div><div class="miniButton">${en?"Confirm":"Підтвердити"}</div>`
      },
      {
        title:en?"Pause and restore clients":"Став клієнтів на паузу та відновлюй",
        sub:en?"Data remains stored during a break":"Дані зберігаються під час перерви",
        copy:en
          ?"Put an inactive client on pause. The client disappears from the active list, new planning and comparison, but the profile is not deleted. Restore it later from the Paused section."
          :"Постав неактивного клієнта на паузу. Він зникне з активного списку, нового планування й порівняння, але профіль не видаляється. Пізніше віднови його в розділі «На паузі».",
        example:en?"A one-month break does not erase workout history.":"Місячна перерва не стирає історію тренувань.",
        mini:`<div class="miniRow"><div class="miniField">${en?"Active":"Активні"} · 4</div><div class="miniField">${en?"Paused":"На паузі"} · 1</div></div><div class="miniButton">${en?"Restore":"Відновити"}</div>`
      },
      {
        title:en?"Compare active clients":"Порівнюй активних клієнтів",
        sub:en?"See the last 30 days in one place":"Переглядай останні 30 днів в одному місці",
        copy:en
          ?"The comparison block summarizes sessions, sets, volume and goal progress for active clients. Use it as context; different programs and exercise types are not a direct competition."
          :"Блок порівняння підсумовує заняття, підходи, обсяг і прогрес цілей активних клієнтів. Використовуй це як контекст: різні програми й типи вправ не є прямим змаганням.",
        example:en?"Compare attendance consistency before comparing training volume.":"Спочатку порівнюй регулярність відвідувань, а вже потім обсяг роботи.",
        mini:`<div class="miniTitle">${en?"Last 30 days":"Останні 30 днів"}</div><div class="miniRow"><div class="miniStat">${en?"Anna":"Анна"}<strong>8</strong></div><div class="miniStat">${en?"Viktor":"Віктор"}<strong>6</strong></div></div>`
      },
      {
        title:en?"Export the whole trainer workspace":"Експортуй увесь простір тренера",
        sub:en?"Version 4 includes profiles and calendar":"Версія 4 містить профілі та календар",
        copy:en
          ?"Export all includes mode, My progress, all clients and appointments. Export active profile creates a separate file for only the selected client or My progress. Merge into active profile is for returning clients: it compares the file with existing data and adds what is missing."
          :"«Експорт всього» містить режим, «Мій прогрес», усіх клієнтів і записи календаря. «Експорт активного профілю» створює окремий файл лише для вибраного клієнта або «Мій прогрес». «Доповнити активний профіль» потрібне для клієнтів, які повертаються: файл порівнюється з наявними даними й додається те, чого бракує.",
        example:en?"If one of 20 clients leaves, export only that client. If they return later with their own JSON, open their profile and merge it back.":"Якщо з 20 клієнтів один завершує, експортуй лише його. Якщо він згодом повертається зі своїм JSON, відкрий його профіль і доповни дані.",
        mini:`<div class="miniTitle">${en?"Trainer backup":"Копія тренера"}</div><div class="miniRow"><div class="miniField">${en?"All clients":"Усі клієнти"}</div><div class="miniField">${en?"One client":"Один клієнт"}</div></div>`
      },
      {
        title:en?"Google Calendar status":"Стан Google Calendar",
        sub:en?"Prepared for future sync, not connected yet":"Підготовлено до майбутньої синхронізації, але ще не підключено",
        copy:en
          ?"Appointments already have technical sync metadata and an outbox for a future integration. No Google account authorization or live two-way synchronization is active in this version."
          :"Записи вже мають технічні поля синхронізації та чергу для майбутньої інтеграції. У цій версії ще немає авторизації Google-акаунта чи живої двосторонньої синхронізації.",
        example:en?"For now, the in-app calendar is the source of truth.":"Наразі основним є календар усередині застосунку.",
        mini:`<div class="miniTitle">Google Calendar</div><div class="miniField">${en?"Prepared · not connected":"Підготовлено · не підключено"}</div>`
      }
    ];
    const renderSteps=(steps)=>`<div class="guideList">${steps.map((step,i)=>`
      <details class="guideStep" ${i===0?"open":""}>
        <summary><span class="guideNumber">${i+1}</span><span class="guideSummaryText"><strong>${step.title}</strong><span>${step.sub}</span></span><span class="guideChevron">⌄</span></summary>
        <div class="guideContent"><div class="guideCopy">${step.copy}<div class="guideExample"><strong>${en?"Example":"Приклад"}:</strong> ${step.example}</div></div><div class="miniScreen"><div class="miniTop"></div>${step.mini}</div></div>
      </details>`).join("")}</div>`;
    return `
      <div class="guideHero">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#67e8f9">${en?"Complete guide":"Повна інструкція"}</div>
        <div style="font-size:22px;font-weight:950;margin-top:5px">${en?"Two modes, two clear workflows":"Два режими — два зрозумілі сценарії"}</div>
        <div class="muted" style="margin-top:6px">${en?"Open the route you need. Every step includes an example and a small visual cue.":"Відкрий потрібний маршрут. Кожен крок має приклад і невелику візуальну підказку."}</div>
      </div>
      <details class="guideRole" open>
        <summary><span class="guideRoleIcon">◉</span><span><strong>${en?"For the user":"Для користувача"}</strong><small>${en?"Personal workouts, goals, body and statistics":"Особисті тренування, цілі, тіло та статистика"}</small></span><span class="guideRoleChevron">⌄</span></summary>
        <div class="guideRoleBody">${renderSteps(userSteps)}</div>
      </details>
      <details class="guideRole">
        <summary><span class="guideRoleIcon trainer">◇</span><span><strong>${en?"For the trainer":"Для тренера"}</strong><small>${en?"Profiles, clients, calendar and comparison":"Профілі, клієнти, календар і порівняння"}</small></span><span class="guideRoleChevron">⌄</span></summary>
        <div class="guideRoleBody">${renderSteps(trainerSteps)}</div>
      </details>`;
  }

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
        <input id="defRest" class="btn" type="number" min="10" step="5" style="width:180px" value="${state.settings.defaultRestSec}" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>
        <button class="btn primary" id="saveSettings" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>${t("save")}</button>
      </div>
      <div class="row" style="margin-top:12px">
        <span class="pill">${state.lang==="en"?"Mode":"Режим"}</span>
        <strong>${appShell.mode==="trainer"?(state.lang==="en"?"Trainer":"Тренер"):(state.lang==="en"?"User":"Користувач")}</strong>
        <button class="btn" id="changeModeBtn">${state.lang==="en"?"Change mode":"Змінити режим"}</button>
        ${appShell.mode==="trainer"?`<button class="btn" id="openCoachBtn">${state.lang==="en"?"Clients and calendar":"Клієнти та календар"}</button>`:""}
      </div>

      <div class="settingsActions">
        <button class="btn" id="exportBtn">${state.lang==="en"?"Export all":"Експорт всього"}</button>
        <button class="btn" id="importBtn">${state.lang==="en"?"Import all":"Імпорт всього"}</button>
        <button class="btn" id="exportProfileBtn" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>${state.lang==="en"?"Export active profile":"Експорт активного профілю"}</button>
        <button class="btn" id="mergeProfileBtn" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>${state.lang==="en"?"Merge into active profile":"Доповнити активний профіль"}</button>
        <button class="btn" id="resetBtn" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>${t("reset")}</button>
        <input id="importFile" type="file" accept="application/json" style="display:none" />
        <input id="mergeProfileFile" type="file" accept="application/json" style="display:none" />
      </div>

      <div class="premiumNote" style="margin-top:16px">
        <strong>${state.lang==="en" ? "Local-first and compatible" : "Локально та сумісно"}</strong>
        <div style="margin-top:4px;font-size:13px;opacity:.86">${state.lang==="en"
          ? "Full export keeps all clients and calendar. Profile export gives one client or My progress as a separate file. Merge import adds new data to the active profile without replacing existing history."
          : "Повний експорт зберігає всіх клієнтів і календар. Експорт профілю віддає одного клієнта або «Мій прогрес» окремим файлом. Імпорт з доповненням додає нові дані в активний профіль без заміни наявної історії."}</div>
      </div>
    `));
    el.appendChild(card(`
      <details class="guideMaster">
        <summary>
          <span class="guideMasterIcon">📖</span>
          <span class="guideMasterTitle"><strong>${state.lang==="en"?"User and trainer guide":"Інструкція для користувача і тренера"}</strong><span>${state.lang==="en"?"All workflows, examples and mini screens":"Усі сценарії, приклади та мініскріни"}</span></span>
          <span class="guideMasterChevron">⌄</span>
        </summary>
        <div class="guideMasterBody">${usageGuideMarkup()}</div>
      </details>
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
      $("#changeModeBtn")?.addEventListener("click",()=>openModeSetup(true));
      $("#openCoachBtn")?.addEventListener("click",clearProfileSelection);

      const exportBtn = $("#exportBtn");
      if (exportBtn) exportBtn.onclick = ()=>{
        save();
        downloadJson("gym-tracker-v4-backup.json",{format:"gymPwaApp_v4",app:appShell});
      };

      const exportProfileBtn = $("#exportProfileBtn");
      if (exportProfileBtn) exportProfileBtn.onclick = ()=>{
        const profile=activeExportProfile();
        if(!profile){
          alert(state.lang==="en"?"Choose My progress or a client first.":"Спочатку обери «Мій прогрес» або клієнта.");
          return;
        }
        save();
        const payload=makeProfileExport(profile);
        downloadJson(`gym-tracker-profile-${safeFilePart(payload.profile.name)}.json`,payload);
      };

      const importBtn = $("#importBtn");
      const importFile = $("#importFile");
      if (importBtn && importFile) importBtn.onclick = ()=> importFile.click();

      const mergeProfileBtn = $("#mergeProfileBtn");
      const mergeProfileFile = $("#mergeProfileFile");
      if (mergeProfileBtn && mergeProfileFile) mergeProfileBtn.onclick = ()=>{
        if(appShell.mode==="trainer" && !activeProfile()){
          alert(state.lang==="en"?"Choose My progress or a client before merging profile data.":"Перед доповненням даних обери «Мій прогрес» або клієнта.");
          return;
        }
        mergeProfileFile.click();
      };

      if (importFile) importFile.onchange = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const txt = await file.text();
        try{
          const parsed = JSON.parse(txt);
          if(parsed?.format==="gymPwaApp_v4" && parsed.app){
            appShell=normalizeAppShell(parsed.app,null);
            if(appShell.mode==="trainer") appShell.activeProfileId=null;
            state=(activeProfile()||personalProfile()).data;
            state.lang=appShell.uiLang;
            currentTab=appShell.mode==="trainer"?"coach":"home";
          }else{
            if(appShell.mode==="trainer" && !activeProfile()){
              alert(state.lang==="en"?"Choose My progress or a client before importing an old backup.":"Перед імпортом старої резервної копії обери «Мій прогрес» або клієнта.");
              return;
            }
            const importedState = parsed && typeof parsed === "object" && parsed.data && typeof parsed.data === "object"
              ? parsed.data
              : parsed;
            state = migrate(importedState);
            if (!state.exercises.length) state.exercises = DEFAULT_EXERCISES.map(ex=>({...ex}));
            activeProfile().data=state;
            rebuildWorkoutDerivedData();
          }
          save();
          resetRestTimer();
          render();
          alert(`${t("importOk")}\n${t("importSummary")}`);
        }catch{
          alert(t("importFail"));
        }
      };

      if (mergeProfileFile) mergeProfileFile.onchange = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const txt = await file.text();
        try{
          const parsed = JSON.parse(txt);
          const importedData = extractImportProfileData(parsed);
          if(!importedData){
            alert(state.lang==="en"
              ? "This looks like a full multi-client backup. Open the source app, export only the needed profile, then merge it here."
              : "Схоже, це повна копія з кількома клієнтами. Відкрий вихідний додаток, експортуй лише потрібний профіль і тоді доповни його тут.");
            return;
          }
          const targetProfile=activeExportProfile();
          if(!targetProfile){
            alert(state.lang==="en"?"Choose My progress or a client first.":"Спочатку обери «Мій прогрес» або клієнта.");
            return;
          }
          const merged=mergeProfileData(targetProfile.data,importedData);
          state=merged.data;
          targetProfile.data=state;
          rebuildWorkoutDerivedData();
          save();
          resetRestTimer();
          render();
          const s=merged.stats;
          alert(state.lang==="en"
            ? `Profile merged: +${s.workouts} workouts, +${s.body} body records, +${s.goals} goals, +${s.exercises} exercises.`
            : `Профіль доповнено: +${s.workouts} тренувань, +${s.body} замірів тіла, +${s.goals} цілей, +${s.exercises} вправ.`);
        }catch{
          alert(t("importFail"));
        }finally{
          mergeProfileFile.value="";
        }
      };

      const resetBtn = $("#resetBtn");
      if (resetBtn) resetBtn.onclick = ()=>{
        if(appShell.mode==="trainer" && !activeProfile()) return;
        const message=appShell.mode==="trainer"
          ? (state.lang==="en"?"Clear all data for the active client? Other clients and calendar remain.":"Очистити всі дані активного клієнта? Інші клієнти й календар залишаться.")
          : t("confirmReset");
        if (!confirm(message)) return;
        state=freshProfileData();
        state.lang=activeProfile().data.lang||"ua";
        activeProfile().data=state;
        save();
        resetRestTimer();
        workoutSession = { active:false, startedAt:null, title:"", workoutId:null, planId:null, items:[] };
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
  installNativeWorkoutListeners();
  setTimeout(()=>openModeSetup(false),0);
  checkAppointmentReminders();
  setInterval(checkAppointmentReminders,60*1000);
});
