// GymTracker Pro вЂ” local-first PWA (no backend)
// Single-file app.js вЂ” robust init + no DOM null crashes + full features
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
      home: "Р“РѕР»РѕРІРЅР°",
      workout: "РўСЂРµРЅСѓРІР°РЅРЅСЏ",
      exercises: "Р’РїСЂР°РІРё",
      stats: "РЎС‚Р°С‚РёСЃС‚РёРєР°",
      records: "Р РµРєРѕСЂРґРё",
      body: "РўС–Р»Рѕ",
      settings: "РќР°Р»Р°С€С‚СѓРІР°РЅРЅСЏ",
      startWorkout: "РџРѕС‡Р°С‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      addExerciseToWorkout: "вћ• Р”РѕРґР°С‚Рё РІРїСЂР°РІСѓ",
      addSet: "вћ• Р”РѕРґР°С‚Рё РїС–РґС…С–Рґ",
      saveWorkout: "рџ’ѕ Р—Р±РµСЂРµРіС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      clearWorkout: "рџ—‘ РћС‡РёСЃС‚РёС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      chooseCategory: "Р¤С–Р»СЊС‚СЂ",
      search: "РџРѕС€СѓРє РІРїСЂР°РІвЂ¦",
      thisWeek: "Р¦РµР№ С‚РёР¶РґРµРЅСЊ",
      thisMonth: "Р¦РµР№ РјС–СЃСЏС†СЊ",
      allTime: "Р’СЃРµ",
      trainings: "С‚СЂРµРЅСѓРІР°РЅСЊ",
      activeDays: "Р°РєС‚РёРІРЅРёС… РґРЅС–РІ",
      sets: "РїС–РґС…РѕРґС–РІ",
      volume: "РѕР±КјС”Рј",
      lastWorkouts: "РћСЃС‚Р°РЅРЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      favorites: "РЈР»СЋР±Р»РµРЅС– РІРїСЂР°РІРё",
      open: "Р’С–РґРєСЂРёС‚Рё",
      close: "РќР°Р·Р°Рґ",
      pr: "PR",
      noData: "РџРѕРєРё РЅРµРјР°С” РґР°РЅРёС….",
      pickExerciseFirst: "Р”РѕРґР°Р№ С…РѕС‡Р° Р± РѕРґРЅСѓ РІРїСЂР°РІСѓ РІ С‚СЂРµРЅСѓРІР°РЅРЅСЏ.",
      saveOk: "Р—Р±РµСЂРµР¶РµРЅРѕ!",
      lang: "РњРѕРІР°",
      defaultRest: "Р’С–РґРїРѕС‡РёРЅРѕРє (СЃРµРє)",
      restTimer: "РўР°Р№РјРµСЂ РІС–РґРїРѕС‡РёРЅРєСѓ",
      timerReady: "Р“РѕС‚РѕРІРёР№ РґРѕ РЅР°СЃС‚СѓРїРЅРѕРіРѕ РїС–РґС…РѕРґСѓ",
      timerStart: "РЎС‚Р°СЂС‚",
      timerPause: "РџР°СѓР·Р°",
      timerReset: "РЎРєРёРЅСѓС‚Рё",
      importOk: "Р”Р°РЅС– СѓСЃРїС–С€РЅРѕ С–РјРїРѕСЂС‚РѕРІР°РЅРѕ.",
      importSummary: "РўСЂРµРЅСѓРІР°РЅРЅСЏ, РІРїСЂР°РІРё, СЂРµРєРѕСЂРґРё С‚Р° Р·Р°РјС–СЂРё РІС–РґРЅРѕРІР»РµРЅРѕ.",
      save: "Р—Р±РµСЂРµРіС‚Рё",
      export: "Р•РєСЃРїРѕСЂС‚ JSON",
      import: "Р†РјРїРѕСЂС‚ JSON",
      confirmReset: "РўРѕС‡РЅРѕ РѕС‡РёСЃС‚РёС‚Рё РІСЃС– РґР°РЅС–?",
      workoutTitle: "РќР°Р·РІР° С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      deleteWorkout: "Р’РёРґР°Р»РёС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      confirmDeleteWorkout: "РўРѕС‡РЅРѕ РІРёРґР°Р»РёС‚Рё С†Рµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ?",
      last: "РћСЃС‚Р°РЅРЅС”",
      confirmClearRecords: "РћС‡РёСЃС‚РёС‚Рё РІСЃС– СЂРµРєРѕСЂРґРё?",
      addMeasure: "Р”РѕРґР°С‚Рё РІРёРјС–СЂ",
      bodyDate: "Р”Р°С‚Р°",
      bodyWeight: "Р’Р°РіР° (РєРі)",
      bodyForearm: "РџРµСЂРµРґРїР»С–С‡С‡СЏ (СЃРј)",
      bodyChest: "Р“СЂСѓРґРё (СЃРј)",
      bodyWaist: "РўР°Р»С–СЏ (СЃРј)",
      bodyLegs: "РќРѕРіРё (СЃРј)",
      bodyProgress: "РџСЂРѕРіСЂРµСЃ С‚С–Р»Р°",
      bodyHistory: "Р†СЃС‚РѕСЂС–СЏ РІРёРјС–СЂС–РІ",
      deleteMeasure: "Р’РёРґР°Р»РёС‚Рё",
      confirmDeleteMeasure: "Р’РёРґР°Р»РёС‚Рё С†РµР№ РІРёРјС–СЂ?",
      addExercise: "Р”РѕРґР°С‚Рё РІРїСЂР°РІСѓ",
      pickExercise: "Р’РёР±РµСЂРё РІРїСЂР°РІСѓ РґР»СЏ С†СЊРѕРіРѕ С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      newExercise: "РќРѕРІР° РІРїСЂР°РІР°",
      create: "РЎС‚РІРѕСЂРёС‚Рё",
      created: "РЎС‚РІРѕСЂРµРЅРѕ!",
      ok: "OK",
      maxWeight: "РњР°РєСЃ. РІР°РіР°",
      exercisesCount: "Р’РїСЂР°РІ",
      totalTrainings: "РІСЃСЊРѕРіРѕ С‚СЂРµРЅСѓРІР°РЅСЊ",
      totalSets: "РІСЃСЊРѕРіРѕ РїС–РґС…РѕРґС–РІ",
      totalVolume: "Р·Р°РіР°Р»СЊРЅРёР№ РѕР±КјС”Рј",
      calories: "РЎРїР°Р»РµРЅС– РєР°Р»РѕСЂС–С—",
      caloriesApprox: "РїСЂРёР±Р»РёР·РЅР° РѕС†С–РЅРєР°",
      goals: "РњРѕС— С†С–Р»С–",
      addGoal: "Р”РѕРґР°С‚Рё С†С–Р»СЊ",
      nextWorkout: "Р РµРєРѕРјРµРЅРґР°С†С–С— РЅР° РЅР°СЃС‚СѓРїРЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
      volumeProgress: "РџСЂРѕРіСЂРµСЃ РѕР±КјС”РјСѓ",
      muscleSplit: "Р РѕР·РїРѕРґС–Р» РЅР°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ",
      muscleSplitHint: "Р§Р°СЃС‚РєР° РѕР±КјС”РјСѓ РїРѕ РіСЂСѓРїР°С…",
      trainedOnly: "Р’РїСЂР°РІРё (С‚С–Р»СЊРєРё Р· Р·Р°РЅСЏС‚С‚СЏРјРё)",
      weightProgress: "РџСЂРѕРіСЂРµСЃ РІР°РіРё",
      history: "Р†СЃС‚РѕСЂС–СЏ",
      reset: "рџ—‘ Reset",
      importFail: "РќРµ РІРґР°Р»РѕСЃСЏ С–РјРїРѕСЂС‚СѓРІР°С‚Рё С„Р°Р№Р».",
      needSet: "Р”РѕРґР°Р№ С…РѕС‡Р° Р± РѕРґРёРЅ РїС–РґС…С–Рґ Р· РІР°РіРѕСЋ С– РїРѕРІС‚РѕСЂР°РјРё.",
      tapToOpen: "РќР°С‚РёСЃРЅРё РЅР° С‚СЂРµРЅСѓРІР°РЅРЅСЏ, С‰РѕР± РІС–РґРєСЂРёС‚Рё РґРµС‚Р°Р»С– Р°Р±Рѕ РІРёРґР°Р»РёС‚Рё",
      times: "СЂР°Р·(С–РІ)",
      month: "РњС–СЃСЏС†СЊ",
      week: "РўРёР¶РґРµРЅСЊ",
      all: "Р’СЃРµ",
      volumeBarsHint: "РџРѕРєР°Р·Р°РЅРѕ РѕСЃС‚Р°РЅРЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ вЂ” Р±РµР· РјР°СЃС€С‚Р°Р±СѓРІР°РЅРЅСЏ",
      addToWorkout: "пј‹",
      deleteExercise: "Р’РёРґР°Р»РёС‚Рё РІРїСЂР°РІСѓ",
      confirmDeleteExercise: "РўРѕС‡РЅРѕ РІРёРґР°Р»РёС‚Рё С†СЋ РІРїСЂР°РІСѓ?",
      exerciseUsedInWorkouts: "Р¦СЏ РІРїСЂР°РІР° РІР¶Рµ С” РІ С‚СЂРµРЅСѓРІР°РЅРЅСЏС…. РЎРїРѕС‡Р°С‚РєСѓ РІРёРґР°Р»Рё С—С— Р· С–СЃС‚РѕСЂС–С— Р°Р±Рѕ Р·РјС–РЅРё Р»РѕРіС–РєСѓ РІРёРґР°Р»РµРЅРЅСЏ.",  
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
      addExerciseToWorkout: "вћ• Add exercise",
      addSet: "вћ• Add set",
      saveWorkout: "рџ’ѕ Save workout",
      clearWorkout: "рџ—‘ Clear workout",
      chooseCategory: "Filter",
      search: "Search exercisesвЂ¦",
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
      reset: "рџ—‘ Reset",
      importFail: "Import failed.",
      needSet: "Add at least one set with weight and reps.",
      tapToOpen: "Tap a workout to open details or delete",
      times: "times",
      month: "Month",
      week: "Week",
      all: "All",
      volumeBarsHint: "Latest workouts shown clearly without zooming",
      addToWorkout: "пј‹",
      deleteExercise: "Delete exercise",
      confirmDeleteExercise: "Delete this exercise?",
      exerciseUsedInWorkouts: "This exercise is already used in workouts. Delete it from history first or change delete logic.",
    }
  };

  // ---------- categories ----------
  const CATEGORIES = [
    { id:"all", ua:"Р’СЃРµ", en:"All", tone:"purple" },
    { id:"back", ua:"РЎРїРёРЅР°", en:"Back", tone:"teal" },
    { id:"legs", ua:"РќРѕРіРё", en:"Legs", tone:"pink" },
    { id:"chest", ua:"Р“СЂСѓРґРё", en:"Chest", tone:"gold" },
    { id:"shoulders", ua:"РџР»РµС‡С–", en:"Shoulders", tone:"purple" },
    { id:"arms", ua:"Р СѓРєРё", en:"Arms", tone:"teal" },
    { id:"core", ua:"РџСЂРµСЃ", en:"Core", tone:"pink" },
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
    if(/РґРѕСЂС–Р¶|Р±С–Рі|С…РѕРґСЊР±|treadmill|running|walking/.test(name)) return "distance";
    if(/РїР»Р°РЅРє|plank|СѓС‚СЂРёРјР°РЅ|hold/.test(name)) return "time";
    if(/РїС–РґС‚СЏРі|РІС–РґР¶РёРј|pull.?up|push.?up/.test(name)) return "reps";
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
        title: l.title || (s.lang==="en" ? `Workout ${fmtDate(l.date)}` : `РўСЂРµРЅСѓРІР°РЅРЅСЏ ${fmtDate(l.date)}`),
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
        name_ua: String(ex.name_ua || ex.name || ex.name_en || "Р’РїСЂР°РІР°"),
        name_en: String(ex.name_en || ex.name || ex.name_ua || "Exercise"),
        category: String(ex.category || "other"),
        trackingType: ["strength","reps","time","distance"].includes(ex.trackingType) ? ex.trackingType : inferTrackingType(ex)
      }));
    s.customCategories = s.customCategories
      .filter(Boolean)
      .map(c=>({
        id:String(c.id || `custom-${uid()}`),
        ua:String(c.ua || c.name || "Р†РЅС€Рµ"),
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
          title: w.title || (s.lang==="en" ? `Workout ${fmtDate(date)}` : `РўСЂРµРЅСѓРІР°РЅРЅСЏ ${fmtDate(date)}`),
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
      title:String(template.title || (s.lang==="en" ? "Workout template" : "РЁР°Р±Р»РѕРЅ С‚СЂРµРЅСѓРІР°РЅРЅСЏ")),
      createdAt:Number(template.createdAt || Date.now()),
      items:(Array.isArray(template.items) ? template.items : []).map(item=>({
        exerciseId:String(item.exerciseId || "")
      })).filter(item=>item.exerciseId)
    })).filter(template=>template.items.length);

    s.plannedWorkouts = s.plannedWorkouts.filter(Boolean).map(plan=>({
      id:String(plan.id || `plan-${uid()}`),
      date:String(plan.date || new Date().toISOString().slice(0,10)),
      time:String(plan.time || ""),
      title:String(plan.title || (s.lang==="en" ? "Planned workout" : "Р—Р°РїР»Р°РЅРѕРІР°РЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ")),
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
    { id: uid(), name_ua:"Р–РёРј С€С‚Р°РЅРіРё Р»РµР¶Р°С‡Рё", name_en:"Bench Press", category:"chest" },
    { id: uid(), name_ua:"Р–РёРј РіР°РЅС‚РµР»РµР№ Р»РµР¶Р°С‡Рё", name_en:"DB Bench Press", category:"chest" },
    { id: uid(), name_ua:"Р–РёРј РїС–Рґ РєСѓС‚РѕРј", name_en:"Incline Press", category:"chest" },
    { id: uid(), name_ua:"РљСЂРѕСЃРѕРІРµСЂ", name_en:"Cable Fly", category:"chest" },

    { id: uid(), name_ua:"РџС–РґС‚СЏРіСѓРІР°РЅРЅСЏ", name_en:"Pull-ups", category:"back", trackingType:"reps" },
    { id: uid(), name_ua:"РўСЏРіР° РІРµСЂС…РЅСЊРѕРіРѕ Р±Р»РѕРєСѓ", name_en:"Lat Pulldown", category:"back" },
    { id: uid(), name_ua:"РўСЏРіР° С€С‚Р°РЅРіРё РІ РЅР°С…РёР»С–", name_en:"Barbell Row", category:"back" },
    { id: uid(), name_ua:"РўСЏРіР° РЅРёР¶РЅСЊРѕРіРѕ Р±Р»РѕРєСѓ", name_en:"Seated Cable Row", category:"back" },
    { id: uid(), name_ua:"Р“С–РїРµСЂРµРєСЃС‚РµРЅР·С–СЏ", name_en:"Hyperextension", category:"back" },

    { id: uid(), name_ua:"РџСЂРёСЃС–РґР°РЅРЅСЏ Р·С– С€С‚Р°РЅРіРѕСЋ", name_en:"Barbell Squat", category:"legs" },
    { id: uid(), name_ua:"Р–РёРј РЅРѕРіР°РјРё", name_en:"Leg Press", category:"legs" },
    { id: uid(), name_ua:"Р СѓРјСѓРЅСЃСЊРєР° С‚СЏРіР°", name_en:"Romanian Deadlift", category:"legs" },
    { id: uid(), name_ua:"Р—РіРёРЅР°РЅРЅСЏ РЅС–Рі Р»РµР¶Р°С‡Рё", name_en:"Leg Curl", category:"legs" },
    { id: uid(), name_ua:"РЇРіРѕРґРёС‡РЅРёР№ РјС–СЃС‚", name_en:"Hip Thrust", category:"legs" },

    { id: uid(), name_ua:"Р–РёРј РЅР°Рґ РіРѕР»РѕРІРѕСЋ", name_en:"Overhead Press", category:"shoulders" },
    { id: uid(), name_ua:"Р РѕР·РІРµРґРµРЅРЅСЏ РІ СЃС‚РѕСЂРѕРЅРё", name_en:"Lateral Raise", category:"shoulders" },
    { id: uid(), name_ua:"РЁСЂР°РіРё", name_en:"Shrugs", category:"shoulders" },

    { id: uid(), name_ua:"Р—РіРёРЅР°РЅРЅСЏ РЅР° Р±С–С†РµРїСЃ (РіР°РЅС‚РµР»С–)", name_en:"DB Curl", category:"arms" },
    { id: uid(), name_ua:"Р¤СЂР°РЅС†СѓР·СЊРєРёР№ Р¶РёРј", name_en:"Skull Crushers", category:"arms" },
    { id: uid(), name_ua:"Р РѕР·РіРёРЅР°РЅРЅСЏ РЅР° С‚СЂС–С†РµРїСЃ (РєР°РЅР°С‚)", name_en:"Rope Pushdown", category:"arms" },

    { id: uid(), name_ua:"РџР»Р°РЅРєР°", name_en:"Plank", category:"core", trackingType:"time" },
    { id: uid(), name_ua:"РџС–РґР№РѕРј РЅС–Рі Сѓ РІРёСЃС–", name_en:"Hanging Leg Raise", category:"core" },
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
        name:String(profile.name||`РљР»С–С”РЅС‚ ${index+1}`),
        role:profile.role==="personal" || profile.id==="personal" ? "personal" : "client",
        status:profile.role==="personal" || profile.id==="personal" ? "active" : (profile.status==="paused"?"paused":"active"),
        data
      };
    });
    if(!normalized.profiles.length){
      normalized.profiles.push({id:"personal",name:"РњС–Р№ РїСЂРѕРіСЂРµСЃ",role:"personal",data:fallbackData});
    }
    if(!normalized.profiles.some(profile=>profile.role==="personal")){
      normalized.profiles[0].role="personal";
    }
    normalized.profiles.forEach(profile=>{
      if(profile.role==="personal") profile.name="РњС–Р№ РїСЂРѕРіСЂРµСЃ";
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
    if (name.includes("Р¶РёРј РїС–Рґ РєСѓС‚") || name.includes("incline")) return "incline";
    if (name.includes("РєСЂРѕСЃРѕРІРµСЂ") || name.includes("fly")) return "fly";
    if (name.includes("Р¶РёРј РЅРѕРіР°РјРё") || name.includes("leg press")) return "legpress";
    if (name.includes("Р·РіРёРЅР°РЅРЅСЏ РЅС–Рі") || name.includes("leg curl")) return "legcurl";
    if (name.includes("СЏРіРѕРґРёС‡") || name.includes("hip thrust")) return "hipthrust";
    if (name.includes("Р¶РёРј РЅР°Рґ РіРѕР»РѕРІ") || name.includes("overhead")) return "overhead";
    if (name.includes("СЂРѕР·РІРµРґРµРЅРЅСЏ") || name.includes("lateral")) return "lateral";
    if (name.includes("С€СЂР°Рі") || name.includes("shrug")) return "shrug";
    if (name.includes("Р±С–С†РµРїСЃ") || name.includes("curl")) return "curl";
    if (name.includes("С‚СЂС–С†РµРїСЃ") || name.includes("С„СЂР°РЅС†СѓР·") || name.includes("pushdown") || name.includes("skull")) return "triceps";
    if (name.includes("РїР»Р°РЅРє") || name.includes("plank")) return "plank";
    if (name.includes("РїС–РґР№РѕРј РЅС–Рі") || name.includes("leg raise")) return "legraise";
    if (name.includes("РіС–РїРµСЂРµРєСЃС‚") || name.includes("hyperextension")) return "hyper";
    if (name.includes("РІРµСЂС…РЅСЊРѕРіРѕ Р±Р»РѕРєСѓ") || name.includes("lat pulldown")) return "pulldown";
    if (name.includes("С‚СЏРіР° РЅРёР¶РЅСЊРѕРіРѕ") || name.includes("С‚СЏРіР° С€С‚Р°РЅРіРё") || name.includes("row")) return "row";
    if ((name.includes("Р¶РёРј") && name.includes("Р»РµР¶")) || name.includes("bench press")) return "bench";
    if (name.includes("РїСЂРёСЃС–РґР°РЅ")) return "squat";
    if (name.includes("РїС–РґС‚СЏРі")) return "pullup";
    if (name.includes("СЃС‚Р°РЅРѕРІ") || name.includes("deadlift") || name.includes("СЂСѓРјСѓРЅ")) return "deadlift";
    if (name.includes("Р±С–Рі") || name.includes("run")) return "run";
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
    if(profile?.role==="personal") return state.lang==="en" ? "My progress" : "РњС–Р№ РїСЂРѕРіСЂРµСЃ";
    return profile?.name || (state.lang==="en"?"Client":"РљР»С–С”РЅС‚");
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
      : "РџРµСЂРµРјРєРЅСѓС‚Рё РєР»С–С”РЅС‚Р° Р№ РѕС‡РёСЃС‚РёС‚Рё РЅРµР·Р±РµСЂРµР¶РµРЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ?")) return;
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
    if (toggle) toggle.textContent = rest.running ? `в…Ў ${t("timerPause")}` : `в–¶ ${t("timerStart")}`;
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
      strength:["Р’Р°РіР° + РїРѕРІС‚РѕСЂРё","Weight + reps"],
      reps:["РљС–Р»СЊРєС–СЃС‚СЊ РїРѕРІС‚РѕСЂС–РІ","Repetitions"],
      time:["Р§Р°СЃ РІРёРєРѕРЅР°РЅРЅСЏ","Duration"],
      distance:["Р”РёСЃС‚Р°РЅС†С–СЏ + С‡Р°СЃ","Distance + time"]
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
    if(type==="reps") return state.lang==="en" ? "reps" : "РїРѕРІС‚.";
    if(type==="time") return state.lang==="en" ? "min" : "С…РІ";
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
    if(type==="distance") return `${fmtNum(set.distance)} km${parseNum(set.duration)>0?` В· ${fmtNum(set.duration)} ${state.lang==="en"?"min":"С…РІ"}`:""}`;
    return `${fmtNum(set.weight)}kg Г— ${fmtNum(set.reps)}`;
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
      return ex ? exName(ex) : (state.lang==="en" ? "Exercise" : "Р’РїСЂР°РІР°");
    }
    const names = {
      weight:["Р’Р°РіР°","Weight"], forearm:["РџРµСЂРµРґРїР»С–С‡С‡СЏ","Forearm"],
      chest:["Р“СЂСѓРґРё","Chest"], waist:["РўР°Р»С–СЏ","Waist"], legs:["РќРѕРіРё","Legs"]
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
        <div class="profileRequiredIcon">в—‡</div>
        <h2>${state.lang==="en"?"Choose whose data to open":"РћР±РµСЂС–С‚СЊ, С‡РёС— РґР°РЅС– РІС–РґРєСЂРёС‚Рё"}</h2>
        <p>${state.lang==="en"?"No trainer or client profile is selected, so this section is intentionally empty.":"РџСЂРѕС„С–Р»СЊ С‚СЂРµРЅРµСЂР° Р°Р±Рѕ РєР»С–С”РЅС‚Р° РЅРµ РІРёР±СЂР°РЅРѕ, С‚РѕРјСѓ С†РµР№ СЂРѕР·РґС–Р» РЅР°РІРјРёСЃРЅРѕ РїРѕСЂРѕР¶РЅС–Р№."}</p>
        <button class="btn primary" id="chooseProfileBtn">${state.lang==="en"?"Open trainer dashboard":"Р’С–РґРєСЂРёС‚Рё РїР°РЅРµР»СЊ С‚СЂРµРЅРµСЂР°"}</button>
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
      profileBtn.textContent=activeProfile()?`в—‰ ${profileDisplayName(activeProfile())}`:(state.lang==="en"?"Choose profile":"РћР±СЂР°С‚Рё РїСЂРѕС„С–Р»СЊ");
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
        <div class="brandEyebrow">${state.lang==="en"?"Choose workspace":"РћР±РµСЂС–С‚СЊ СЂРµР¶РёРј СЂРѕР±РѕС‚Рё"}</div>
        <h2 style="font-size:30px;margin:8px 0 6px">${state.lang==="en"?"How will you use GymTracker?":"РЇРє РІРё РєРѕСЂРёСЃС‚СѓРІР°С‚РёРјРµС‚РµСЃСЊ GymTracker?"}</h2>
        <div class="muted">${state.lang==="en"?"Your existing workouts are preserved in either mode.":"Р’Р°С€С– РЅР°СЏРІРЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ Р·Р±РµСЂРµР¶СѓС‚СЊСЃСЏ РІ Р±СѓРґСЊ-СЏРєРѕРјСѓ СЂРµР¶РёРјС–."}</div>
        <div class="modeChoices">
          <button class="modeChoice" data-mode="user"><div style="font-size:30px">в—Ћ</div><strong>${state.lang==="en"?"User":"РљРѕСЂРёСЃС‚СѓРІР°С‡"}</strong><span>${state.lang==="en"?"Your personal workouts, goals, body metrics and statistics.":"РћСЃРѕР±РёСЃС‚С– С‚СЂРµРЅСѓРІР°РЅРЅСЏ, С†С–Р»С–, РїРѕРєР°Р·РЅРёРєРё С‚С–Р»Р° С‚Р° СЃС‚Р°С‚РёСЃС‚РёРєР°, СЏРє Р·Р°СЂР°Р·."}</span></button>
          <button class="modeChoice" data-mode="trainer"><div style="font-size:30px">в—‡</div><strong>${state.lang==="en"?"Trainer":"РўСЂРµРЅРµСЂ"}</strong><span>${state.lang==="en"?"Multiple independent clients, session planning and a shared calendar.":"РљС–Р»СЊРєР° РЅРµР·Р°Р»РµР¶РЅРёС… РєР»С–С”РЅС‚С–РІ, РїР»Р°РЅСѓРІР°РЅРЅСЏ Р·Р°РЅСЏС‚СЊ С– СЃРїС–Р»СЊРЅРёР№ РєР°Р»РµРЅРґР°СЂ."}</span></button>
        </div>
        <button class="btn" id="modeGuideBtn" style="width:100%;margin-top:12px">в–¤ ${state.lang==="en"?"How it works":"РЇРє С†Рµ РїСЂР°С†СЋС”"}</button>
        ${force?`<button class="btn" data-close style="width:100%;margin-top:12px">${state.lang==="en"?"Cancel":"РЎРєР°СЃСѓРІР°С‚Рё"}</button>`:""}
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
    overlay.innerHTML=`<div class="modePanel guideModalPanel"><div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"GymTracker guide":"Р†РЅСЃС‚СЂСѓРєС†С–СЏ GymTracker"}</div><h2 style="margin:6px 0">${state.lang==="en"?"How the app works":"РЇРє РїСЂР°С†СЋС” Р·Р°СЃС‚РѕСЃСѓРЅРѕРє"}</h2></div><button class="btn" data-close>вњ•</button></div><div style="margin-top:14px">${usageGuideMarkup()}</div></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("[data-close]").onclick=()=>overlay.remove();
  }

  function openClientModal(profile=null){
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel" style="max-width:480px">
      <div class="detailHeader"><div><div class="brandEyebrow">${profile?(state.lang==="en"?"Edit client":"Р РµРґР°РіСѓРІР°РЅРЅСЏ РєР»С–С”РЅС‚Р°"):(state.lang==="en"?"New client":"РќРѕРІРёР№ РєР»С–С”РЅС‚")}</div><h2 style="margin:6px 0">${profile?escapeHtml(profile.name):(state.lang==="en"?"Add a client":"Р”РѕРґР°С‚Рё РєР»С–С”РЅС‚Р°")}</h2></div><button class="btn" data-close>вњ•</button></div>
      <label class="bodyField" style="margin-top:16px"><span class="muted">${state.lang==="en"?"Client name":"Р†РјвЂ™СЏ РєР»С–С”РЅС‚Р°"}</span><input class="btn" id="clientName" maxlength="60" value="${escapeHtml(profile?.name||"")}" placeholder="${state.lang==="en"?"For example: Anna":"РќР°РїСЂРёРєР»Р°Рґ: РђРЅРЅР°"}"></label>
      <button class="btn primary" id="clientSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Save client":"Р—Р±РµСЂРµРіС‚Рё РєР»С–С”РЅС‚Р°"}</button>
      ${profile?`<button class="btn" id="clientPause" style="width:100%;margin-top:8px">${profile.status==="paused"?(state.lang==="en"?"Restore active client":"РџРѕРІРµСЂРЅСѓС‚Рё РґРѕ Р°РєС‚РёРІРЅРёС…"):(state.lang==="en"?"Put client on pause":"РџРѕСЃС‚Р°РІРёС‚Рё РєР»С–С”РЅС‚Р° РЅР° РїР°СѓР·Сѓ")}</button>`:""}
      ${profile&&appShell.profiles.length>1?`<button class="btn" id="clientDelete" style="width:100%;margin-top:8px;color:#fda4af">${state.lang==="en"?"Delete client":"Р’РёРґР°Р»РёС‚Рё РєР»С–С”РЅС‚Р°"}</button>`:""}
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
      if(!confirm(state.lang==="en"?"Delete this client and all their local data?":"Р’РёРґР°Р»РёС‚Рё С†СЊРѕРіРѕ РєР»С–С”РЅС‚Р° С‚Р° РІСЃС– Р№РѕРіРѕ Р»РѕРєР°Р»СЊРЅС– РґР°РЅС–?")) return;
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
      alert(state.lang==="en"?"Add a real client before planning a session.":"РЎРїРѕС‡Р°С‚РєСѓ РґРѕРґР°Р№ СЂРµР°Р»СЊРЅРѕРіРѕ РєР»С–С”РЅС‚Р°, Р° РїРѕС‚С–Рј РїР»Р°РЅСѓР№ Р·Р°РЅСЏС‚С‚СЏ.");
      return;
    }
    const now=new Date();
    const date=initialDate||now.toISOString().slice(0,10);
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel" style="max-width:520px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Calendar":"РљР°Р»РµРЅРґР°СЂ"}</div><h2 style="margin:6px 0">${state.lang==="en"?"Plan a session":"Р—Р°РїР»Р°РЅСѓРІР°С‚Рё Р·Р°РЅСЏС‚С‚СЏ"}</h2></div><button class="btn" data-close>вњ•</button></div>
      <div class="bodyGrid" style="margin-top:16px">
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Client":"РљР»С–С”РЅС‚"}</span><select class="btn" id="appointmentClient">${clients.map(profile=>`<option value="${profile.id}" ${profile.id===appShell.activeProfileId?"selected":""}>${escapeHtml(profile.name)}</option>`).join("")}</select></label>
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Date":"Р”Р°С‚Р°"}</span><input class="btn" id="appointmentDate" type="date" value="${date}"></label>
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Time":"Р§Р°СЃ"}</span><input class="btn" id="appointmentTime" type="time" value="18:00"></label>
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Note":"РќРѕС‚Р°С‚РєР°"}</span><input class="btn" id="appointmentNote" maxlength="100" placeholder="${state.lang==="en"?"Leg day, technique...":"РќРѕРіРё, С‚РµС…РЅС–РєР°..."}"></label>
      </div>
      <button class="btn primary" id="appointmentSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Add to calendar":"Р”РѕРґР°С‚Рё РІ РєР°Р»РµРЅРґР°СЂ"}</button>
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
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Calendar day":"Р”РµРЅСЊ РєР°Р»РµРЅРґР°СЂСЏ"}</div><h2 style="margin:6px 0">${escapeHtml(dateLabel)}</h2></div><button class="btn" data-close>вњ•</button></div>
      <div class="appointmentList" style="margin-top:14px">${appointments.length?appointments.map(item=>{
        const profile=appShell.profiles.find(candidate=>candidate.id===item.profileId);
        return `<div class="appointmentRow"><div class="appointmentDate"><strong>${escapeHtml(item.time||"")}</strong></div><div><strong>${escapeHtml(profile?.name||"РљР»С–С”РЅС‚")}</strong><div class="muted">${escapeHtml(item.note || (state.lang==="en"?"Training session":"РўСЂРµРЅСѓРІР°РЅРЅСЏ"))}</div></div><button class="btn" data-del-day-appointment="${item.id}">вњ•</button></div>`;
      }).join(""):`<div class="emptyCalendar">${state.lang==="en"?"Nothing is planned for this day yet.":"РќР° С†РµР№ РґРµРЅСЊ С‰Рµ РЅС–С‡РѕРіРѕ РЅРµ Р·Р°РїР»Р°РЅРѕРІР°РЅРѕ."}</div>`}</div>
      <button class="btn primary" id="dayAddAppointment" style="width:100%;margin-top:14px">пј‹ ${state.lang==="en"?"Add session":"Р”РѕРґР°С‚Рё Р·Р°РїРёСЃ"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#dayAddAppointment").onclick=()=>{close();openAppointmentModal(day);};
    overlay.querySelectorAll("[data-del-day-appointment]").forEach(button=>button.onclick=()=>{
      if(!confirm(state.lang==="en"?"Delete this calendar entry?":"Р’РёРґР°Р»РёС‚Рё С†РµР№ Р·Р°РїРёСЃ С–Р· РєР°Р»РµРЅРґР°СЂСЏ?")) return;
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
    return {view,cursor,days,title:`${days[0].toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{day:"numeric",month:"short"})} вЂ” ${end.toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{day:"numeric",month:"short",year:"numeric"})}`};
  }

  function calendarMarkup(appointments){
    const period=calendarPeriod();
    const byDate=new Map();
    appointments.forEach(item=>{
      const list=byDate.get(item.date)||[];
      list.push(item);byDate.set(item.date,list);
    });
    const weekNames=(state.lang==="en"?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]:["РџРЅ","Р’С‚","РЎСЂ","Р§С‚","РџС‚","РЎР±","РќРґ"]);
    const weekdayHead=period.view==="month"?`<div class="calendarWeekdays">${weekNames.map(name=>`<span>${name}</span>`).join("")}</div>`:"";
    return `<div class="calendarToolbar">
      <div class="calendarTabs"><button class="periodBtn ${period.view==="week"?"active":""}" data-calendar-view="week">${state.lang==="en"?"Week":"РўРёР¶РґРµРЅСЊ"}</button><button class="periodBtn ${period.view==="month"?"active":""}" data-calendar-view="month">${state.lang==="en"?"Month":"РњС–СЃСЏС†СЊ"}</button></div>
      <div class="calendarNav"><button class="btn" data-calendar-shift="-1">вЂ№</button><strong>${escapeHtml(period.title)}</strong><button class="btn" data-calendar-shift="1">вЂє</button></div>
    </div>${weekdayHead}<div class="calendarGrid ${period.view}">${period.days.map(day=>{
      const key=dateKey(day);
      const events=(byDate.get(key)||[]).sort((a,b)=>a.time.localeCompare(b.time));
      const outside=period.view==="month" && day.getMonth()!==period.cursor.getMonth();
      const today=key===dateKey(new Date());
      return `<button class="calendarDay ${outside?"outside":""} ${today?"today":""}" data-calendar-date="${key}">
        <span class="calendarDayTop">${period.view==="week"?weekNames[(day.getDay()+6)%7]:""}<strong>${day.getDate()}</strong></span>
        <span class="calendarEvents">${events.slice(0,3).map(item=>{
          const profile=appShell.profiles.find(candidate=>candidate.id===item.profileId);
          return `<span class="calendarEvent">${item.time} В· ${escapeHtml(profile?.name||"")}</span>`;
        }).join("")}${events.length>3?`<small>+${events.length-3}</small>`:""}</span>
      </button>`;
    }).join("")}</div>`;
  }

  function clientComparisonMarkup(clients){
    if(!clients.length) return `<div class="emptyCalendar">${state.lang==="en"?"Add clients to see comparison statistics.":"Р”РѕРґР°Р№ РєР»С–С”РЅС‚С–РІ, С‰РѕР± РїРѕР±Р°С‡РёС‚Рё РїРѕСЂС–РІРЅСЏР»СЊРЅСѓ СЃС‚Р°С‚РёСЃС‚РёРєСѓ."}</div>`;
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
        <div class="comparisonMain"><strong>${escapeHtml(row.profile.name)}</strong><span>${state.lang==="en"?"Last 30 days":"РћСЃС‚Р°РЅРЅС– 30 РґРЅС–РІ"}</span><div class="comparisonBar"><i style="width:${Math.round(row.recent/maxWorkouts*100)}%"></i></div></div>
        <div class="comparisonMetric"><strong>${row.recent}</strong><span>${state.lang==="en"?"sessions":"Р·Р°РЅСЏС‚СЊ"}</span></div>
        <div class="comparisonMetric"><strong>${row.sets}</strong><span>${state.lang==="en"?"sets":"РїС–РґС…РѕРґС–РІ"}</span></div>
        <div class="comparisonMetric"><strong>${fmtVol(row.volume)}</strong><span>${state.lang==="en"?"volume":"РѕР±КјС”Рј"}</span></div>
        <div class="comparisonMetric"><strong>${row.goalAvg}%</strong><span>${state.lang==="en"?"goals":"С†С–Р»С–"}</span></div>
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
      new Notification(state.lang==="en"?"Training in 15 minutes":"РўСЂРµРЅСѓРІР°РЅРЅСЏ С‡РµСЂРµР· 15 С…РІРёР»РёРЅ",{
        body:`${profile?.name||"РљР»С–С”РЅС‚"} В· ${item.time}${item.note?` В· ${item.note}`:""}`,
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
      <div class="coachHeader"><div class="detailTitle"><div class="brandEyebrow">${state.lang==="en"?"Trainer workspace":"Р РѕР±РѕС‡РёР№ РїСЂРѕСЃС‚С–СЂ С‚СЂРµРЅРµСЂР°"}</div><h2>${state.lang==="en"?"Clients and schedule":"РљР»С–С”РЅС‚Рё С‚Р° СЂРѕР·РєР»Р°Рґ"}</h2><div class="sub">${clients.length} ${state.lang==="en"?"real clients":"СЂРµР°Р»СЊРЅРёС… РєР»С–С”РЅС‚С–РІ"} В· ${upcoming.length} ${state.lang==="en"?"upcoming sessions":"РЅР°Р№Р±Р»РёР¶С‡РёС… Р·Р°РЅСЏС‚СЊ"}</div></div><button class="btn primary" id="addClientBtn">пј‹ ${state.lang==="en"?"Client":"РљР»С–С”РЅС‚"}</button></div>
      <section class="personalProgressCard">
        <div class="personalProgressIcon">в—Ћ</div>
        <div class="personalProgressMain"><div class="muted">${state.lang==="en"?"Trainer's own profile":"РћСЃРѕР±РёСЃС‚РёР№ РїСЂРѕС„С–Р»СЊ С‚СЂРµРЅРµСЂР°"}</div><strong>${state.lang==="en"?"My progress":"РњС–Р№ РїСЂРѕРіСЂРµСЃ"}</strong><span>${(personalData.workouts||[]).length} ${state.lang==="en"?"workouts":"С‚СЂРµРЅСѓРІР°РЅСЊ"} В· ${(personalData.goals||[]).length} ${state.lang==="en"?"goals":"С†С–Р»РµР№"} В· ${state.lang==="en"?"not included in calendar":"РЅРµ РґРѕРґР°С”С‚СЊСЃСЏ РґРѕ РєР°Р»РµРЅРґР°СЂСЏ"}</span></div>
        <button class="btn ${personal?.id===appShell.activeProfileId?"primary":""}" data-open-client="${personal?.id}">${personal?.id===appShell.activeProfileId?(state.lang==="en"?"Open progress":"Р’С–РґРєСЂРёС‚Рё РїСЂРѕРіСЂРµСЃ"):(state.lang==="en"?"Switch":"РџРµСЂРµР№С‚Рё")}</button>
      </section>
      <div class="coachStack">
        <section class="coachSection">
          <div class="coachSectionHead"><div><strong>${state.lang==="en"?"Clients":"РљР»С–С”РЅС‚Рё"}</strong><div class="muted">${state.lang==="en"?"Separate progress for each person":"РћРєСЂРµРјРёР№ РїСЂРѕРіСЂРµСЃ РґР»СЏ РєРѕР¶РЅРѕС— Р»СЋРґРёРЅРё"}</div></div></div>
          <div class="clientGrid">${clients.length?clients.map(profile=>{
            const data=profile.data||{};
            const next=appointments.find(item=>item.profileId===profile.id && appointmentTimestamp(item)>=Date.now());
            return `<article class="clientCard ${profile.id===appShell.activeProfileId?"active":""}">
              <div class="detailHeader"><div><strong style="font-size:17px">${escapeHtml(profile.name)}</strong><div class="muted" style="margin-top:4px">${(data.workouts||[]).length} ${state.lang==="en"?"workouts":"С‚СЂРµРЅСѓРІР°РЅСЊ"} В· ${(data.goals||[]).length} ${state.lang==="en"?"goals":"С†С–Р»РµР№"}</div></div><button class="btn" data-edit-client="${profile.id}">вЂўвЂўвЂў</button></div>
              <div class="premiumNote" style="margin-top:11px;font-size:11px">${next?`${state.lang==="en"?"Next":"Р”Р°Р»С–"}: ${fmtDate(next.date)} В· ${next.time}`:(state.lang==="en"?"No planned sessions":"РќРµРјР°С” Р·Р°РїР»Р°РЅРѕРІР°РЅРёС… Р·Р°РЅСЏС‚СЊ")}</div>
              <button class="btn ${profile.id===appShell.activeProfileId?"primary":""}" data-open-client="${profile.id}" style="width:100%;margin-top:10px">${profile.id===appShell.activeProfileId?(state.lang==="en"?"Open active client":"Р’С–РґРєСЂРёС‚Рё Р°РєС‚РёРІРЅРѕРіРѕ РєР»С–С”РЅС‚Р°"):(state.lang==="en"?"Switch to client":"РџРµСЂРµР№С‚Рё РґРѕ РєР»С–С”РЅС‚Р°")}</button>
            </article>`;
          }).join(""):`<div class="emptyClients"><strong>${state.lang==="en"?"No clients yet":"РљР»С–С”РЅС‚С–РІ РїРѕРєРё РЅРµРјР°С”"}</strong><span>${state.lang==="en"?"Add the first person to start tracking and scheduling.":"Р”РѕРґР°Р№ РїРµСЂС€Сѓ Р»СЋРґРёРЅСѓ, С‰РѕР± РІРµСЃС‚Рё РїСЂРѕРіСЂРµСЃ С– РїР»Р°РЅСѓРІР°С‚Рё Р·Р°РЅСЏС‚С‚СЏ."}</span></div>`}</div>
          ${pausedClients.length?`<details class="pausedClients"><summary>${state.lang==="en"?"On pause":"РќР° РїР°СѓР·С–"} В· ${pausedClients.length}</summary><div class="pausedList">${pausedClients.map(profile=>`<div class="pausedRow"><div><strong>${escapeHtml(profile.name)}</strong><span>${(profile.data?.workouts||[]).length} ${state.lang==="en"?"workouts":"С‚СЂРµРЅСѓРІР°РЅСЊ"}</span></div><button class="btn" data-restore-client="${profile.id}">${state.lang==="en"?"Restore":"Р’С–РґРЅРѕРІРёС‚Рё"}</button></div>`).join("")}</div></details>`:""}
        </section>
        <section class="coachSection calendarSection">
          <div class="coachSectionHead"><div><strong>${state.lang==="en"?"Planning calendar":"РљР°Р»РµРЅРґР°СЂ РїР»Р°РЅСѓРІР°РЅРЅСЏ"}</strong><div class="muted">${state.lang==="en"?"Week or month view В· active clients only":"РџРµСЂРµРіР»СЏРґ С‚РёР¶РЅСЏ Р°Р±Рѕ РјС–СЃСЏС†СЏ В· Р»РёС€Рµ Р°РєС‚РёРІРЅС– РєР»С–С”РЅС‚Рё"}</div></div><button class="btn" id="addAppointmentBtn" ${clients.length?"":"disabled"}>пј‹ ${state.lang==="en"?"Plan":"Р—Р°РїРёСЃ"}</button></div>
          ${clients.length?calendarMarkup(appointments):`<div class="emptyCalendar">${state.lang==="en"?"Calendar becomes available after adding an active client.":"РљР°Р»РµРЅРґР°СЂ СЃС‚Р°РЅРµ РґРѕСЃС‚СѓРїРЅРёРј РїС–СЃР»СЏ РґРѕРґР°РІР°РЅРЅСЏ Р°РєС‚РёРІРЅРѕРіРѕ РєР»С–С”РЅС‚Р°."}</div>`}
          <div class="appointmentList">${periodAppointments.length?periodAppointments.map(item=>{
            const profile=appShell.profiles.find(candidate=>candidate.id===item.profileId);
            const day=new Date(`${item.date}T00:00:00`);
            return `<div class="appointmentRow"><div class="appointmentDate">${day.toLocaleDateString(state.lang==="en"?"en-US":"uk-UA",{month:"short"})}<strong>${day.getDate()}</strong></div><div><strong>${escapeHtml(profile?.name||"РљР»С–С”РЅС‚")} В· ${item.time}</strong><div class="muted">${escapeHtml(item.note|| (state.lang==="en"?"Training session":"РўСЂРµРЅСѓРІР°РЅРЅСЏ"))}</div></div><button class="btn" data-del-appointment="${item.id}">вњ•</button></div>`;
          }).join(""):`<div class="muted" style="padding:10px">${state.lang==="en"?"No entries in this period.":"РЈ С†СЊРѕРјСѓ РїРµСЂС–РѕРґС– Р·Р°РїРёСЃС–РІ РЅРµРјР°С”."}</div>`}</div>
          ${clients.length?`<button class="btn" id="notificationBtn" style="width:100%;margin-top:10px">${state.lang==="en"?"Enable calendar notifications":"РЈРІС–РјРєРЅСѓС‚Рё СЃРїРѕРІС–С‰РµРЅРЅСЏ РєР°Р»РµРЅРґР°СЂСЏ"}</button>`:""}
          <div class="calendarIntegration"><div><strong>Google Calendar</strong><span>${state.lang==="en"?"Data structure is ready; account connection will be added later.":"РЎС‚СЂСѓРєС‚СѓСЂР° РґР°РЅРёС… РїС–РґРіРѕС‚РѕРІР»РµРЅР°; РїС–РґРєР»СЋС‡РµРЅРЅСЏ Р°РєР°СѓРЅС‚Р° Р±СѓРґРµ РґРѕРґР°РЅРѕ РїС–Р·РЅС–С€Рµ."}</span></div><span class="pill">${state.lang==="en"?"Prepared":"РџС–РґРіРѕС‚РѕРІР»РµРЅРѕ"}</span></div>
        </section>
      </div>
      <section class="coachSection comparisonSection">
        <div class="coachSectionHead"><div><strong>${state.lang==="en"?"Client comparison":"РџРѕСЂС–РІРЅСЏРЅРЅСЏ РєР»С–С”РЅС‚С–РІ"}</strong><div class="muted">${state.lang==="en"?"Training activity, sets, volume and goal progress":"РђРєС‚РёРІРЅС–СЃС‚СЊ, РїС–РґС…РѕРґРё, РѕР±КјС”Рј С– РїСЂРѕРіСЂРµСЃ С†С–Р»РµР№"}</div></div></div>
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
        if(!confirm(state.lang==="en"?"Delete this calendar entry?":"Р’РёРґР°Р»РёС‚Рё С†РµР№ Р·Р°РїРёСЃ С–Р· РєР°Р»РµРЅРґР°СЂСЏ?")) return;
        deleteAppointment(button.getAttribute("data-del-appointment"));
        save();render();
      });
      $("#notificationBtn")?.addEventListener("click",async()=>{
        if(!("Notification" in window)) return alert(state.lang==="en"?"Notifications are not supported on this device.":"Р¦РµР№ РїСЂРёСЃС‚СЂС–Р№ РЅРµ РїС–РґС‚СЂРёРјСѓС” РІРµР±-СЃРїРѕРІС–С‰РµРЅРЅСЏ.");
        const result=await Notification.requestPermission();
        alert(result==="granted"?(state.lang==="en"?"Notifications enabled.":"РЎРїРѕРІС–С‰РµРЅРЅСЏ СѓРІС–РјРєРЅРµРЅРѕ."):(state.lang==="en"?"Notification permission was not granted.":"Р”РѕР·РІС–Р» РЅР° СЃРїРѕРІС–С‰РµРЅРЅСЏ РЅРµ РЅР°РґР°РЅРѕ."));
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
      week:state.lang==="en"?"This week":"Р¦РµР№ С‚РёР¶РґРµРЅСЊ",
      month:state.lang==="en"?"This month":"Р¦РµР№ РјС–СЃСЏС†СЊ",
      year:state.lang==="en"?"This year":"Р¦РµР№ СЂС–Рє",
      all:state.lang==="en"?"All time":"Р—Р° РІРµСЃСЊ С‡Р°СЃ"
    };
    const spotlight=[...(state.goals||[])].sort((a,b)=>goalProgress(b)-goalProgress(a))[0];
    const strongest=strongestExercise();
    const todayWorkout=latestWorkoutToday();

    el.appendChild(card(`
      <div class="goalHero">
        <div class="goalHeroHead">
          <div>
            <div class="muted" style="text-transform:uppercase;letter-spacing:.13em;font-size:10px">${state.lang==="en"?"Your direction":"РўРІС–Р№ РЅР°РїСЂСЏРј"}</div>
            <div class="goalHeroTitle">${t("goals")}</div>
          </div>
          <button class="btn primary" id="addGoalBtn">пј‹ ${t("addGoal")}</button>
        </div>
        ${spotlight ? `
          <div class="goalSpotlight">
            <div class="muted">${state.lang==="en"?"Closest target":"РќР°Р№Р±Р»РёР¶С‡Р° С†С–Р»СЊ"}</div>
            <div class="goalSpotValue">${escapeHtml(goalLabel(spotlight))}</div>
            <div class="goalTrack"><span class="goalFill" style="width:${goalProgress(spotlight)}%"></span></div>
            <div class="goalMeta"><span>${state.lang==="en"?"Current":"Р—Р°СЂР°Р·"}: ${fmtNum(goalCurrent(spotlight))}</span><strong>${goalProgress(spotlight)}%</strong><span>${state.lang==="en"?"Target":"Р¦С–Р»СЊ"}: ${fmtNum(spotlight.target)}</span></div>
          </div>` : `
          <div class="goalSpotlight"><strong>${state.lang==="en"?"Set your first measurable target":"РџРѕСЃС‚Р°РІ РїРµСЂС€Сѓ РІРёРјС–СЂСЋРІР°РЅСѓ С†С–Р»СЊ"}</strong><div class="muted" style="margin-top:5px">${state.lang==="en"?"For example: 100 kg bench press, 80 kg body weight or 85 cm waist.":"РќР°РїСЂРёРєР»Р°Рґ: Р¶РёРј 100 РєРі, РІР°РіР° 80 РєРі Р°Р±Рѕ С‚Р°Р»С–СЏ 85 СЃРј."}</div></div>`}
        <div class="goalList" id="goalList" style="margin-top:12px"></div>
      </div>
    `));

    el.appendChild(card(`
      <div class="workoutLaunch">
        <div class="workoutLaunchIcon">${todayWorkout?"в†»":"в–¶"}</div>
        <div class="workoutLaunchCopy">
          <div class="muted" style="text-transform:uppercase;letter-spacing:.12em;font-size:9px">${todayWorkout?(state.lang==="en"?"Today is still active":"РЎСЊРѕРіРѕРґРЅС–С€РЅС–Р№ РґРµРЅСЊ С‰Рµ Р°РєС‚РёРІРЅРёР№"):(state.lang==="en"?"Ready when you are":"Р“РѕС‚РѕРІРёР№, РєРѕР»Рё РіРѕС‚РѕРІРёР№ С‚Рё")}</div>
          <div class="workoutLaunchTitle">${todayWorkout?(state.lang==="en"?"Continue today's workout":"РџСЂРѕРґРѕРІР¶РёС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ") : t("startWorkout")}</div>
          <div class="muted">${todayWorkout?escapeHtml(todayWorkout.title):(state.lang==="en"?"Build the session and track every working set":"РЎРєР»Р°РґРё Р·Р°РЅСЏС‚С‚СЏ С‚Р° Р·Р°С„С–РєСЃСѓР№ РєРѕР¶РµРЅ СЂРѕР±РѕС‡РёР№ РїС–РґС…С–Рґ")}</div>
        </div>
        <button class="btn primary workoutLaunchBtn" id="homeStart">${todayWorkout?(state.lang==="en"?"Continue":"РџСЂРѕРґРѕРІР¶РёС‚Рё"):(state.lang==="en"?"Start":"РџРѕС‡Р°С‚Рё")}</button>
      </div>
    `));

    el.appendChild(card(`
      <div class="detailHeader">
        <div><div style="font-weight:900;font-size:18px">${periodNames[homeRange]}</div><div class="muted">${state.lang==="en"?"Performance overview":"РћРіР»СЏРґ СЂРµР·СѓР»СЊС‚Р°С‚РёРІРЅРѕСЃС‚С–"}</div></div>
        ${homeRange!=="all"?`<span class="periodDelta ${volDelta<0?"down":""}">${volDelta>=0?"+":""}${volDelta}% ${state.lang==="en"?"volume":"РѕР±КјС”Рј"}</span>`:""}
      </div>
      <div class="periodTabs" id="homeRanges">
        <button class="periodBtn ${homeRange==="week"?"active":""}" data-home-range="week">${t("week")}</button>
        <button class="periodBtn ${homeRange==="month"?"active":""}" data-home-range="month">${t("month")}</button>
        <button class="periodBtn ${homeRange==="year"?"active":""}" data-home-range="year">${state.lang==="en"?"Year":"Р С–Рє"}</button>
        <button class="periodBtn ${homeRange==="all"?"active":""}" data-home-range="all">${t("all")}</button>
      </div>
      <div class="kpiGrid4">
        <div class="kpiBox kpiPurple">
          <div class="ico">рџ“…</div>
          <div class="val">${periodDays}</div>
          <div class="lbl">${t("activeDays")}</div>
        </div>
        <div class="kpiBox kpiTeal kpiClickable" id="homeTrainingsKpi" role="button" tabindex="0">
          <div class="ico">рџЏ‹пёЏ</div>
          <div class="val">${periodTrainings}</div>
          <div class="lbl">${t("trainings")} В· ${state.lang==="en"?"tap list":"РґРѕ СЃРїРёСЃРєСѓ"}</div>
        </div>
        <div class="kpiBox kpiPink">
          <div class="ico">рџ§±</div>
          <div class="val">${periodSets}</div>
          <div class="lbl">${t("sets")}</div>
        </div>
        <div class="kpiBox kpiGold">
          <div class="ico">рџ”Ґ</div>
          <div class="val">${fmtVol(periodVol)}</div>
          <div class="lbl">${t("volume")}</div>
        </div>
      </div>
      <div class="calorieCard">
        <div><div style="font-weight:900">рџ”Ґ ${t("calories")}</div><div class="muted">${t("caloriesApprox")} В· ${fmtNum(latestBodyWeight())} kg</div></div>
        <div class="calorieValue">в‰€ ${periodCalories} kcal</div>
      </div>
      <div class="insightGrid">
        <div class="insightCard"><div class="insightIcon">вљЎ</div><div class="insightValue">${activeWeekStreak()}</div><div class="insightLabel">${state.lang==="en"?"active-week streak":"С‚РёР¶РЅС–РІ Р°РєС‚РёРІРЅРѕС— СЃРµСЂС–С—"}</div></div>
        <div class="insightCard"><div class="insightIcon">рџ‘‘</div><div class="insightValue">${strongest?fmtNum(strongest.weight):"вЂ”"}</div><div class="insightLabel">${strongest?escapeHtml(exName(strongest.ex)):(state.lang==="en"?"strongest exercise":"РЅР°Р№СЃРёР»СЊРЅС–С€Р° РІРїСЂР°РІР°")}</div></div>
        <div class="insightCard"><div class="insightIcon">рџЋЇ</div><div class="insightValue">${spotlight?goalProgress(spotlight):0}%</div><div class="insightLabel">${state.lang==="en"?"closest goal progress":"РїСЂРѕРіСЂРµСЃ РЅР°Р№Р±Р»РёР¶С‡РѕС— С†С–Р»С–"}</div></div>
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
            <div class="muted" style="text-transform:uppercase;letter-spacing:.12em;font-size:9px">${state.lang==="en"?"Program forecast":"РџСЂРѕРіРЅРѕР· РїСЂРѕРіСЂР°РјРё"}</div>
            <div class="recommendationHeroTitle">${t("nextWorkout")}</div>
            <div class="recommendationSession">${escapeHtml(summary.title)}</div>
            <div class="muted">${escapeHtml(summary.prescription||"")}</div>
          </div>
          <div class="recommendationConfidence">${state.lang==="en"?"Analysis":"РђРЅР°Р»С–Р·"}<br><strong>${state.workouts.length}</strong> ${state.lang==="en"?"sessions":"Р·Р°РЅСЏС‚СЊ"}</div>
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
          <div class="recommendationLearningIcon">в—Њ</div>
          <div><strong>${state.lang==="en"?"Learning your program":"Р’РёРІС‡Р°СЋ С‚РІРѕСЋ РїСЂРѕРіСЂР°РјСѓ"}</strong><div class="muted" style="margin-top:4px">${state.lang==="en"
            ? `Complete ${5-state.workouts.length} more workout(s). Recommendations will start after at least 5 sessions reveal your rotation.`
            : `РџСЂРѕРІРµРґРё С‰Рµ ${5-state.workouts.length} Р·Р°РЅСЏС‚С‚СЏ. Р РµРєРѕРјРµРЅРґР°С†С–С— Р·вЂ™СЏРІР»СЏС‚СЊСЃСЏ РїС–СЃР»СЏ С‰РѕРЅР°Р№РјРµРЅС€Рµ 5 С‚СЂРµРЅСѓРІР°РЅСЊ, РєРѕР»Рё Р±СѓРґРµ РІРёРґРЅРѕ С‡РµСЂРіСѓРІР°РЅРЅСЏ.`}</div></div>
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
      const title = w.title || (state.lang==="en" ? "Workout" : "РўСЂРµРЅСѓРІР°РЅРЅСЏ");
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
          <div style="text-align:right"><div style="font-weight:900;color:rgba(167,139,250,.95)">${fmtNum(maxW)} kg</div><div class="muted">в‰€ ${calories} kcal</div></div>
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
      const lastDate = logs[0]?.date ? fmtDate(logs[0].date) : "вЂ”";
      return `
        <div class="favoriteRow" data-favstats="${ex.id}" role="button" tabindex="0">
          ${exIcon(ex)}
          <div class="favoriteRowMain">
            <div class="favoriteRowTitle">${escapeHtml(exName(ex))}</div>
            <div class="favoriteRowMeta">${escapeHtml(catName(ex.category))} В· ${trackingLabel(ex)} В· ${t("last")}: ${lastDate}</div>
          </div>
          <div class="favoriteRowStats">
            <div><span>PR</span><strong>${fmtNum(pr)} ${primaryUnit(ex)}</strong></div>
            <div><span>${state.lang==="en"?"Sessions":"Р—Р°РЅСЏС‚СЊ"}</span><strong>${cnt}</strong></div>
          </div>
          <span class="favoriteRowArrow">вЂє</span>
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
        : `РўСЂРµРЅСѓРІР°РЅРЅСЏ ${fmtDate(workoutSession.startedAt)}`;
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
            ? `${state.lang==="en"?"Editing saved workout":"Р РµРґР°РіСѓРІР°РЅРЅСЏ Р·Р±РµСЂРµР¶РµРЅРѕРіРѕ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"} В· ${fmtDate(workoutSession.startedAt)}`
            : workoutSession.active ? `вЏ± ${fmtDate(workoutSession.startedAt)}` : t("noData")}</div>

          <div style="margin-top:10px">
            <div class="muted" style="margin-bottom:6px">${t("workoutTitle")}</div>
            <input id="workoutTitleInput" class="btn" style="width:100%"
              value="${escapeHtml(workoutSession.title || "")}"
              placeholder="${t("workoutTitle")}" />
          </div>
        </div>

        <div class="row workoutQuickActions">
          <button class="btn" id="addExToW">${t("addExerciseToWorkout")}</button>
          <button class="btn" id="addTemplateToW">${state.lang==="en"?"пј‹ Add complex":"пј‹ Р”РѕРґР°С‚Рё РєРѕРјРїР»РµРєСЃ"}</button>
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
          <div class="muted" style="margin-top:4px">${state.lang==="en" ? "Starts automatically after a completed set В· vibration at zero" : "Р—Р°РїСѓСЃРєР°С”С‚СЊСЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РЅРѕ РїС–СЃР»СЏ РІРЅРµСЃРµРЅРѕРіРѕ РїС–РґС…РѕРґСѓ В· РІС–Р±СЂР°С†С–СЏ РЅР° РЅСѓР»С–"}</div>
        </div>
        <div class="restActions">
          <button class="btn primary" id="restToggle">в–¶ ${t("timerStart")}</button>
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
        <button class="btn primary" id="saveWorkoutBtn">${workoutSession.workoutId?(state.lang==="en"?"рџ’ѕ Update workout":"рџ’ѕ РћРЅРѕРІРёС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ"):t("saveWorkout")}</button>
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
      const addTemplateBtn = $("#addTemplateToW");
      if (addTemplateBtn) addTemplateBtn.onclick = ()=> openTemplatePickerForWorkout();

      $("#newPlanBtn")?.addEventListener("click",()=>openWorkoutPlanModal());
      $("#newTemplateBtn")?.addEventListener("click",()=>openWorkoutTemplateModal());
      bindPlannedWorkoutActions(el);
      bindTemplateActions(el);

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
          : "РћС‡РёСЃС‚РёС‚Рё РїРѕС‚РѕС‡РЅРёР№ РЅР°Р±С–СЂ С‚СЂРµРЅСѓРІР°РЅРЅСЏ? РЈСЃС– РІРЅРµСЃРµРЅС– РІРїСЂР°РІРё С‚Р° РїС–РґС…РѕРґРё РІ С†СЊРѕРјСѓ РЅР°Р±РѕСЂС– Р±СѓРґРµ РІС‚СЂР°С‡РµРЅРѕ.";
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
            : "РћРЅРѕРІРёС‚Рё С†Рµ Р·Р±РµСЂРµР¶РµРЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ С‚Р° РїРµСЂРµСЂР°С…СѓРІР°С‚Рё СЂРµРєРѕСЂРґРё, СЃС‚Р°С‚РёСЃС‚РёРєСѓ Р№ СЂРµРєРѕРјРµРЅРґР°С†С–С—?")
          : (state.lang==="en"
            ? "Save and finish this workout? You can continue today's saved workout later from Home."
            : "Р—Р±РµСЂРµРіС‚Рё Р№ Р·Р°РІРµСЂС€РёС‚Рё С†Рµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ? РЎСЊРѕРіРѕРґРЅС– Р№РѕРіРѕ РјРѕР¶РЅР° Р±СѓРґРµ РїСЂРѕРґРѕРІР¶РёС‚Рё Р· РіРѕР»РѕРІРЅРѕС— СЃС‚РѕСЂС–РЅРєРё.");
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
      box.innerHTML = `<div class="card"><div class="muted">${state.lang==="en" ? "Tap вЂњAdd exerciseвЂќ to build a workout." : "РќР°С‚РёСЃРЅРё вЂњР”РѕРґР°С‚Рё РІРїСЂР°РІСѓвЂќ С– Р·Р±РµСЂРµС€ С‚СЂРµРЅСѓРІР°РЅРЅСЏ."}</div></div>`;
      return;
    }

    box.innerHTML = workoutSession.items.map((it)=> {
      const ex = state.exercises.find(e=>e.id===it.exerciseId);
      const title = ex ? exName(ex) : "вЂ”";
      const type = exerciseTracking(ex);

      const setsHtml = (it.sets||[]).map((s, idx)=>`
        <div class="setline setline-${type}" style="margin-top:8px">
          <span class="pill">#${idx+1}</span>
          ${type==="strength" || type==="reps" ? `<label class="setField"><span>${state.lang==="en"?"Reps":"РџРѕРІС‚РѕСЂРё"}</span><input type="text" inputmode="numeric"
            data-id="${it.id}" data-i="${idx}" data-k="reps"
            value="${escapeHtml(s.reps ?? "")}" placeholder="8" /></label>` : ""}
          ${type==="strength" ? `<label class="setField"><span>${state.lang==="en"?"Weight, kg":"Р’Р°РіР°, РєРі"}</span><input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="weight"
            value="${escapeHtml(s.weight ?? "")}" placeholder="80" /></label>` : ""}
          ${type==="time" || type==="distance" ? `<label class="setField"><span>${state.lang==="en"?"Time, min":"Р§Р°СЃ, С…РІ"}</span><input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="duration"
            value="${escapeHtml(s.duration ?? "")}" placeholder="10" /></label>` : ""}
          ${type==="distance" ? `<label class="setField"><span>${state.lang==="en"?"Distance, km":"Р”РёСЃС‚Р°РЅС†С–СЏ, РєРј"}</span><input type="text" inputmode="decimal"
            data-id="${it.id}" data-i="${idx}" data-k="distance"
            value="${escapeHtml(s.distance ?? "")}" placeholder="2.5" /></label>` : ""}
          <button class="btn" data-delset="${it.id}" data-i="${idx}">вњ–</button>
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
                <div class="muted">${catName(ex?.category || "")} вЂў ${trackingLabel(ex)} вЂў ${t("pr")}: ${fmtNum(prValue)} ${primaryUnit(ex)}</div>
              </div>
            </div>
            <div class="row">
              <button class="btn" data-rm="${it.id}">рџ—‘</button>
            </div>
          </div>

          <div>
            ${setsHtml || `<div class="muted" style="margin-top:10px">${state.lang==="en" ? "Add your first set рџ‘‡" : "Р”РѕРґР°Р№ РїРµСЂС€РёР№ РїС–РґС…С–Рґ рџ‘‡"}</div>`}
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
    const selected = new Set((workoutSession.items||[]).map(item=>item.exerciseId));

    modal.innerHTML = `
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("addExercise")}</h2>
          <div class="sub">${state.lang==="en"?"Select several exercises, then confirm.":"РћР±РµСЂРё РєС–Р»СЊРєР° РІРїСЂР°РІ, РїРѕС‚С–Рј РїС–РґС‚РІРµСЂРґСЊ РґРѕРґР°РІР°РЅРЅСЏ."}</div>
        </div>
        <button class="btn" id="pickClose" style="border-radius:50%; width:42px; height:42px; padding:0;">вњ•</button>
      </div>

      <div class="filters" id="pickCats"></div>

      <input id="pickQ" class="btn" style="width:100%; margin-top:10px" placeholder="${t("search")}" value="${escapeHtml(q)}"/>

      <div class="row" style="flex-direction:column; align-items:stretch; gap:10px; margin-top:12px" id="pickList"></div>
      <div class="pickerFooter">
        <span class="muted" id="pickSelectedCount"></span>
        <button class="btn primary" id="pickConfirm">${state.lang==="en"?"Add selected":"Р”РѕРґР°С‚Рё РІРёР±СЂР°РЅС–"}</button>
      </div>
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
        const picked = selected.has(ex.id);
        return `
          <div class="itemRow ${picked?"selectedPick":""}">
            <div class="left">
              ${exIcon(ex)}
              <div style="min-width:0">
                <div class="titleLine"><strong>${escapeHtml(exName(ex))}</strong></div>
                <div class="muted">${catName(ex.category)} вЂў ${trackingLabel(ex)} вЂў PR: ${fmtNum(prW)} ${primaryUnit(ex)}</div>
              </div>
            </div>
            <div class="row">
              <button class="btn" data-fav="${ex.id}">${isFav(ex.id)?"в­ђ":"в†"}</button>
              <button class="btn ${picked?"primary":""}" data-toggle-pick="${ex.id}">${picked?(state.lang==="en"?"Selected":"Р’РёР±СЂР°РЅРѕ"):"пј‹"}</button>
            </div>
          </div>
        `;
      }).join("");
      const counter = modal.querySelector("#pickSelectedCount");
      if(counter) counter.textContent = state.lang==="en" ? `${selected.size} selected` : `Р’РёР±СЂР°РЅРѕ: ${selected.size}`;

      listBox.querySelectorAll("[data-fav]").forEach(b=>{
        b.onclick = ()=>{
          toggleFav(b.getAttribute("data-fav"));
          renderCats(state.ui.exCat);
          renderList();
        };
      });

      listBox.querySelectorAll("[data-toggle-pick]").forEach(b=>{
        b.onclick = ()=>{
          const id = b.getAttribute("data-toggle-pick");
          if (selected.has(id)) selected.delete(id);
          else selected.add(id);
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
              : `РўСЂРµРЅСѓРІР°РЅРЅСЏ ${fmtDate(workoutSession.startedAt)}`;
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
    const confirmBtn = modal.querySelector("#pickConfirm");
    if (confirmBtn) confirmBtn.onclick = ()=>{
      addExercisesToSession([...selected]);
      save();
      close();
      renderWorkoutItems();
    };
  }

  function openTemplatePickerForWorkout(){
    const templates=state.workoutTemplates||[];
    if(!templates.length){
      alert(state.lang==="en"?"Create a complex template first.":"РЎРїРѕС‡Р°С‚РєСѓ СЃС‚РІРѕСЂРё С€Р°Р±Р»РѕРЅ РєРѕРјРїР»РµРєСЃСѓ.");
      return;
    }
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel" style="max-width:560px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Workout complexes":"РљРѕРјРїР»РµРєСЃРё РІРїСЂР°РІ"}</div><h2 style="margin:6px 0">${state.lang==="en"?"Add complex to workout":"Р”РѕРґР°С‚Рё РєРѕРјРїР»РµРєСЃ Сѓ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</h2><div class="muted">${state.lang==="en"?"Select one or more templates, then confirm.":"РћР±РµСЂРё РѕРґРёРЅ Р°Р±Рѕ РєС–Р»СЊРєР° С€Р°Р±Р»РѕРЅС–РІ, РїРѕС‚С–Рј РїС–РґС‚РІРµСЂРґСЊ."}</div></div><button class="btn" data-close>вњ•</button></div>
      <div class="templateList" style="margin-top:14px">${templates.map(template=>{
        const names=template.items.slice(0,4).map(item=>{
          const ex=state.exercises.find(candidate=>candidate.id===item.exerciseId);
          return ex ? exName(ex) : "";
        }).filter(Boolean).join(" В· ");
        return `<label class="templateRow templatePickRow"><input type="checkbox" data-template-pick value="${template.id}"><div><strong>${escapeHtml(template.title)}</strong><span>${escapeHtml(names)}${template.items.length>4?` В· +${template.items.length-4}`:""}</span></div></label>`;
      }).join("")}</div>
      <button class="btn primary" id="templatePickConfirm" style="width:100%;margin-top:14px">${state.lang==="en"?"Add selected complexes":"Р”РѕРґР°С‚Рё РІРёР±СЂР°РЅС– РєРѕРјРїР»РµРєСЃРё"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.addEventListener("click",(event)=>{if(event.target===overlay) close();});
    overlay.querySelector("#templatePickConfirm").onclick=()=>{
      const ids=Array.from(overlay.querySelectorAll("[data-template-pick]:checked")).map(input=>input.value);
      const exerciseIds=ids.flatMap(exerciseIdsFromTemplate);
      if(!exerciseIds.length){
        alert(state.lang==="en"?"Choose at least one complex.":"РћР±РµСЂРё С…РѕС‡Р° Р± РѕРґРёРЅ РєРѕРјРїР»РµРєСЃ.");
        return;
      }
      addExercisesToSession(exerciseIds);
      save();
      close();
      renderWorkoutItems();
    };
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
      alert(state.lang==="en"?"This plan has no exercises yet.":"РЈ С†СЊРѕРјСѓ РїР»Р°РЅС– С‰Рµ РЅРµРјР°С” РІРїСЂР°РІ.");
      return;
    }
    if(workoutSession.active && workoutSession.items?.length && !confirm(state.lang==="en"
      ? "Replace the current workout draft with this planned workout?"
      : "Р—Р°РјС–РЅРёС‚Рё РїРѕС‚РѕС‡РЅРёР№ РЅР°Р±С–СЂ С‚СЂРµРЅСѓРІР°РЅРЅСЏ С†РёРј Р·Р°РїР»Р°РЅРѕРІР°РЅРёРј Р·Р°РЅСЏС‚С‚СЏРј?")) return;
    workoutSession={
      active:true,
      startedAt:new Date().toISOString(),
      title:plan.title || (state.lang==="en"?"Planned workout":"Р—Р°РїР»Р°РЅРѕРІР°РЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"),
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
        : `РўСЂРµРЅСѓРІР°РЅРЅСЏ ${fmtDate(workoutSession.startedAt)}`;
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
    const weekNames=(state.lang==="en"?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]:["РџРЅ","Р’С‚","РЎСЂ","Р§С‚","РџС‚","РЎР±","РќРґ"]);
    const weekdayHead=period.view==="month"?`<div class="calendarWeekdays">${weekNames.map(name=>`<span>${name}</span>`).join("")}</div>`:"";
    return `<div class="calendarToolbar">
      <div class="calendarTabs"><button class="periodBtn ${period.view==="week"?"active":""}" data-plan-view="week">${state.lang==="en"?"Week":"РўРёР¶РґРµРЅСЊ"}</button><button class="periodBtn ${period.view==="month"?"active":""}" data-plan-view="month">${state.lang==="en"?"Month":"РњС–СЃСЏС†СЊ"}</button></div>
      <div class="calendarNav"><button class="btn" data-plan-shift="-1">вЂ№</button><strong>${escapeHtml(period.title)}</strong><button class="btn" data-plan-shift="1">вЂє</button></div>
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
    const categories=allCategories().filter(category=>category.id!=="all" && state.exercises.some(ex=>ex.category===category.id));
    return `<div class="planExerciseGrouped">${categories.map(category=>{
      const exercises=state.exercises
        .filter(ex=>ex.category===category.id)
        .sort((a,b)=>exName(a).localeCompare(exName(b)));
      return `<section class="planCategoryBlock">
        <div class="planCategoryTitle">${escapeHtml(catName(category.id))}</div>
        <div class="planExerciseGrid">${exercises.map(ex=>`
          <label class="planExercisePick">
            <input type="checkbox" data-plan-exercise value="${ex.id}" ${selected.has(ex.id)?"checked":""}>
            ${exIcon(ex)}
            <span><strong>${escapeHtml(exName(ex))}</strong><small>${trackingLabel(ex)}</small></span>
          </label>`).join("")}</div>
      </section>`;
    }).join("")}</div>`;
  }

  function openWorkoutPlanModal(initialDate=null,plan=null){
    const date=initialDate || plan?.date || dateKey(new Date());
    const selectedIds=plan ? plannedWorkoutItems(plan).map(item=>item.exerciseId) : [];
    const templates=state.workoutTemplates||[];
    const overlay=document.createElement("div");
    overlay.className="modeOverlay";
    overlay.innerHTML=`<div class="modePanel planModalPanel" style="max-width:620px">
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Workout planning":"РџР»Р°РЅСѓРІР°РЅРЅСЏ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</div><h2 style="margin:6px 0">${plan?(state.lang==="en"?"Edit planned workout":"Р РµРґР°РіСѓРІР°С‚Рё РїР»Р°РЅ"):(state.lang==="en"?"Plan workout":"Р—Р°РїР»Р°РЅСѓРІР°С‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ")}</h2></div><button class="btn" data-close>вњ•</button></div>
      <div class="bodyGrid bodyMeasureGrid" style="margin-top:14px">
        <label class="bodyField bodyDateField"><span class="muted">${state.lang==="en"?"Date":"Р”Р°С‚Р°"}</span><input class="btn" id="planDate" type="date" value="${escapeHtml(date)}"></label>
        <label class="bodyField"><span class="muted">${state.lang==="en"?"Time":"Час"}</span><input class="btn" id="planTime" type="time" value="${escapeHtml(plan?.time||"")}"></label>
        <label class="bodyField bodyDateField"><span class="muted">${state.lang==="en"?"Workout name":"РќР°Р·РІР° С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</span><input class="btn" id="planTitle" maxlength="80" value="${escapeHtml(plan?.title||"")}" placeholder="${state.lang==="en"?"Push / Pull":"Р–РёРј / РўСЏРіР°"}"></label>
      </div>
      <label class="bodyField" style="display:block;margin-top:12px"><span class="muted">${state.lang==="en"?"Use template":"Р’РёРєРѕСЂРёСЃС‚Р°С‚Рё С€Р°Р±Р»РѕРЅ"}</span><select class="btn" id="planTemplate" style="width:100%"><option value="">${state.lang==="en"?"No template":"Р‘РµР· С€Р°Р±Р»РѕРЅСѓ"}</option>${templates.map(template=>`<option value="${template.id}" ${template.id===plan?.templateId?"selected":""}>${escapeHtml(template.title)}</option>`).join("")}</select></label>
      <div class="planPickerHead"><strong>${state.lang==="en"?"Exercises":"Р’РїСЂР°РІРё"}</strong><span class="muted">${state.lang==="en"?"Choose separate exercises or load a template above.":"РћР±РµСЂРё РѕРєСЂРµРјС– РІРїСЂР°РІРё Р°Р±Рѕ Р·Р°РІР°РЅС‚Р°Р¶ С€Р°Р±Р»РѕРЅ РІРёС‰Рµ."}</span></div>
      ${exerciseChecklistMarkup(selectedIds)}
      <button class="btn primary" id="planSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Save planned workout":"Р—Р±РµСЂРµРіС‚Рё Р·Р°РїР»Р°РЅРѕРІР°РЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</button>
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
        alert(state.lang==="en"?"Choose at least one exercise.":"РћР±РµСЂРё С…РѕС‡Р° Р± РѕРґРЅСѓ РІРїСЂР°РІСѓ.");
        return;
      }
      const item={
        id:plan?.id || `plan-${uid()}`,
        date:overlay.querySelector("#planDate").value || dateKey(new Date()),
        time:overlay.querySelector("#planTime")?.value || "",
        title:overlay.querySelector("#planTitle").value.trim() || (state.lang==="en"?"Planned workout":"Р—Р°РїР»Р°РЅРѕРІР°РЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"),
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
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Workout template":"РЁР°Р±Р»РѕРЅ РєРѕРјРїР»РµРєСЃСѓ"}</div><h2 style="margin:6px 0">${template?(state.lang==="en"?"Edit template":"Р РµРґР°РіСѓРІР°С‚Рё С€Р°Р±Р»РѕРЅ"):(state.lang==="en"?"New template":"РќРѕРІРёР№ С€Р°Р±Р»РѕРЅ")}</h2></div><button class="btn" data-close>вњ•</button></div>
      <label class="bodyField" style="display:block;margin-top:14px"><span class="muted">${state.lang==="en"?"Template name":"РќР°Р·РІР° С€Р°Р±Р»РѕРЅСѓ"}</span><input class="btn" id="templateTitle" maxlength="80" style="width:100%" value="${escapeHtml(template?.title||"")}" placeholder="${state.lang==="en"?"Chest + back":"Р–РёРј / С‚СЏРіР°"}"></label>
      <div class="planPickerHead"><strong>${state.lang==="en"?"Exercises":"Р’РїСЂР°РІРё"}</strong><span class="muted">${state.lang==="en"?"This set can be used while planning or during a workout.":"Р¦СЋ Р·Р°РіРѕС‚РѕРІРєСѓ РјРѕР¶РЅР° РІРёР±СЂР°С‚Рё РїСЂРё РїР»Р°РЅСѓРІР°РЅРЅС– Р°Р±Рѕ РІР¶Рµ РїС–Рґ С‡Р°СЃ Р·Р°РЅСЏС‚С‚СЏ."}</span></div>
      ${exerciseChecklistMarkup(selectedIds)}
      <button class="btn primary" id="templateSave" style="width:100%;margin-top:14px">${state.lang==="en"?"Save template":"Р—Р±РµСЂРµРіС‚Рё С€Р°Р±Р»РѕРЅ"}</button>
    </div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("[data-close]").onclick=close;
    overlay.querySelector("#templateSave").onclick=()=>{
      const exerciseIds=selectedPlanExercises(overlay);
      if(!exerciseIds.length){
        alert(state.lang==="en"?"Choose at least one exercise.":"РћР±РµСЂРё С…РѕС‡Р° Р± РѕРґРЅСѓ РІРїСЂР°РІСѓ.");
        return;
      }
      const item={
        id:template?.id || `template-${uid()}`,
        title:overlay.querySelector("#templateTitle").value.trim() || (state.lang==="en"?"Workout template":"РЁР°Р±Р»РѕРЅ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"),
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
    }).filter(Boolean).join(" В· ");
    const timeText=plan.time ? ` В· ${escapeHtml(plan.time)}` : "";
    return `<article class="plannedWorkoutRow">
      <div class="plannedDate"><span>${fmtDate(plan.date)}</span>${plan.time?`<small>${escapeHtml(plan.time)}</small>`:""}<strong>${items.length}</strong><small>${state.lang==="en"?"ex.":"РІРїСЂ."}</small></div>
      <div class="plannedMain"><strong>${escapeHtml(plan.title)}</strong><span>${fmtDate(plan.date)}${timeText} В· ${escapeHtml(names || (state.lang==="en"?"No exercises":"РќРµРјР°С” РІРїСЂР°РІ"))}${items.length>4?` В· +${items.length-4}`:""}</span></div>
      <div class="plannedActions"><button class="btn primary" data-start-plan="${plan.id}">${state.lang==="en"?"Start":"РџРѕС‡Р°С‚Рё"}</button><button class="btn" data-edit-plan="${plan.id}">в‹Ї</button><button class="btn" data-delete-plan="${plan.id}">вњ•</button></div>
    </article>`;
  }

  function bindPlannedWorkoutActions(root,afterAction=()=>{}){
    root.querySelectorAll("[data-start-plan]").forEach(button=>button.onclick=()=>{afterAction();startPlannedWorkout(button.getAttribute("data-start-plan"));});
    root.querySelectorAll("[data-edit-plan]").forEach(button=>button.onclick=()=>{
      const plan=state.plannedWorkouts.find(item=>item.id===button.getAttribute("data-edit-plan"));
      if(plan){afterAction();openWorkoutPlanModal(plan.date,plan);}
    });
    root.querySelectorAll("[data-delete-plan]").forEach(button=>button.onclick=()=>{
      if(!confirm(state.lang==="en"?"Delete this planned workout?":"Р’РёРґР°Р»РёС‚Рё С†Рµ Р·Р°РїР»Р°РЅРѕРІР°РЅРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ?")) return;
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
      <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Planned workouts":"Р—Р°РїР»Р°РЅРѕРІР°РЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</div><h2 style="margin:6px 0">${escapeHtml(dateLabel)}</h2></div><button class="btn" data-close>вњ•</button></div>
      <div class="plannedList" style="margin-top:14px">${plans.length?plans.map(plan=>plannedWorkoutRowMarkup(plan)).join(""):`<div class="emptyCalendar">${state.lang==="en"?"No planned workouts for this day.":"РќР° С†РµР№ РґРµРЅСЊ С‚СЂРµРЅСѓРІР°РЅСЊ С‰Рµ РЅРµ Р·Р°РїР»Р°РЅРѕРІР°РЅРѕ."}</div>`}</div>
      <button class="btn primary" id="dayAddPlan" style="width:100%;margin-top:14px">пј‹ ${state.lang==="en"?"Plan workout":"Р—Р°РїР»Р°РЅСѓРІР°С‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</button>
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
      if(!confirm(state.lang==="en"?"Delete this template?":"Р’РёРґР°Р»РёС‚Рё С†РµР№ С€Р°Р±Р»РѕРЅ?")) return;
      state.workoutTemplates=state.workoutTemplates.filter(template=>template.id!==button.getAttribute("data-delete-template"));
      save();render();
    });
  }

  function workoutPlanningPanelMarkup(){
    const upcoming=(state.plannedWorkouts||[])
      .filter(plan=>plan.status!=="completed")
      .sort((a,b)=>String(a.date).localeCompare(String(b.date)) || String(a.time||"").localeCompare(String(b.time||"")) || String(a.title).localeCompare(String(b.title)))
      .slice(0,8);
    const templates=state.workoutTemplates||[];
    return `
      <section class="planningSuite">
        <div class="detailHeader"><div><div class="brandEyebrow">${state.lang==="en"?"Training planner":"РџР»Р°РЅСѓРІР°Р»СЊРЅРёРє С‚СЂРµРЅСѓРІР°РЅСЊ"}</div><h2 style="margin:4px 0">${state.lang==="en"?"Planned workouts and templates":"Р—Р°РїР»Р°РЅРѕРІР°РЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ С– С€Р°Р±Р»РѕРЅРё"}</h2><div class="muted">${state.lang==="en"?"Plan future days, then start with exercises already loaded.":"РџР»Р°РЅСѓР№ РјР°Р№Р±СѓС‚РЅС– РґРЅС–, Р° РїРѕС‚С–Рј Р·Р°РїСѓСЃРєР°Р№ Р·Р°РЅСЏС‚С‚СЏ РІР¶Рµ Р· РЅР°Р±СЂР°РЅРёРјРё РІРїСЂР°РІР°РјРё."}</div></div><button class="btn primary" id="newPlanBtn">пј‹ ${state.lang==="en"?"Plan":"РџР»Р°РЅ"}</button></div>
        <div class="planningSide planningTopList">
          <div class="planningSubhead"><strong>${state.lang==="en"?"Planned workouts":"Р—Р°РїР»Р°РЅРѕРІР°РЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</strong><span class="muted">${upcoming.length}</span></div>
          <div class="plannedList">${upcoming.length?upcoming.map(plan=>plannedWorkoutRowMarkup(plan)).join(""):`<div class="emptyCalendar">${state.lang==="en"?"No planned workouts yet.":"Р—Р°РїР»Р°РЅРѕРІР°РЅРёС… С‚СЂРµРЅСѓРІР°РЅСЊ РїРѕРєРё РЅРµРјР°С”."}</div>`}</div>
          <div class="planningSubhead" style="margin-top:12px"><strong>${state.lang==="en"?"Complex templates":"РЁР°Р±Р»РѕРЅРё РєРѕРјРїР»РµРєСЃС–РІ"}</strong><button class="btn" id="newTemplateBtn">пј‹ ${state.lang==="en"?"Template":"РЁР°Р±Р»РѕРЅ"}</button></div>
          <div class="templateList">${templates.length?templates.slice(0,8).map(template=>{
            const names=template.items.slice(0,3).map(item=>{
              const ex=state.exercises.find(candidate=>candidate.id===item.exerciseId);
              return ex ? exName(ex) : "";
            }).filter(Boolean).join(" В· ");
            return `<article class="templateRow"><div><strong>${escapeHtml(template.title)}</strong><span>${escapeHtml(names)}${template.items.length>3?` В· +${template.items.length-3}`:""}</span></div><div class="templateActions"><button class="btn" data-edit-template="${template.id}">в‹Ї</button><button class="btn" data-delete-template="${template.id}">вњ•</button></div></article>`;
          }).join(""):`<div class="emptyCalendar">${state.lang==="en"?"Create sets like Bench/Row or Biceps/Triceps once and reuse them.":"РЎС‚РІРѕСЂРё Р·Р°РіРѕС‚РѕРІРєРё С‚РёРїСѓ Р–РёРј/РўСЏРіР° Р°Р±Рѕ Р‘С–С†РµРїСЃ/РўСЂРёС†РµРїСЃ С– РІРёРєРѕСЂРёСЃС‚РѕРІСѓР№ РїРѕРІС‚РѕСЂРЅРѕ."}</div>`}</div>
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
      .replace(/\b(С‚СЂРµРЅСѓРІР°РЅРЅСЏ|workout)\b/g,"")
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
        : ` Р¦С–Р»СЊ: ${fmtNum(goal.target)} ${primaryUnit(ex)} (${goalProgress(goal)}%).`)
      : "";
    if(type==="strength"){
      const weight=maxWeightOfSets(last.sets);
      const reps=Math.max(0,...(last.sets||[]).filter(set=>parseNum(set.weight)===weight).map(set=>parseNum(set.reps)));
      const previousWeight=previous?maxWeightOfSets(previous.sets):0;
      const increment=["legs","back"].includes(ex.category)?5:2.5;
      let targetWeight=weight;
      let targetReps=Math.max(6,reps||8);
      let reason=state.lang==="en"?"stabilize the current working load":"Р·Р°РєСЂС–РїРёС‚Рё РїРѕС‚РѕС‡РЅСѓ СЂРѕР±РѕС‡Сѓ РІР°РіСѓ";
      if(reps>=8 && recent.length>=2){
        targetWeight=weight+increment;
        targetReps=6;
        reason=state.lang==="en"?"recent sessions show room to progress":"РѕСЃС‚Р°РЅРЅС– Р·Р°РЅСЏС‚С‚СЏ РґР°СЋС‚СЊ Р·Р°РїР°СЃ РґР»СЏ РїСЂРѕРіСЂРµСЃС–С—";
      }else if(reps>=6){
        targetReps=reps+1;
        reason=state.lang==="en"?"add one clean rep before increasing weight":"РґРѕРґР°С‚Рё РѕРґРЅРµ С‡РёСЃС‚Рµ РїРѕРІС‚РѕСЂРµРЅРЅСЏ РїРµСЂРµРґ РїС–РґРІРёС‰РµРЅРЅСЏРј РІР°РіРё";
      }else if(previousWeight>0 && weight<previousWeight){
        targetWeight=weight;
        targetReps=6;
        reason=state.lang==="en"?"return to stable technique after a load reduction":"РїРѕРІРµСЂРЅСѓС‚Рё СЃС‚Р°Р±С–Р»СЊРЅСѓ С‚РµС…РЅС–РєСѓ РїС–СЃР»СЏ Р·РЅРёР¶РµРЅРЅСЏ РІР°РіРё";
      }
      if(goal && parseNum(goal.target)>weight && reps>=7){
        targetWeight=Math.min(parseNum(goal.target),Math.max(targetWeight,weight+increment));
        reason=state.lang==="en"?"the active strength goal raises priority for gradual overload":"Р°РєС‚РёРІРЅР° СЃРёР»РѕРІР° С†С–Р»СЊ РїС–РґРІРёС‰СѓС” РїСЂС–РѕСЂРёС‚РµС‚ РїРѕСЃС‚СѓРїРѕРІРѕРіРѕ РЅР°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ";
      }
      return {
        kind:"exercise",exerciseId:ex.id,title:exName(ex),
        prescription:`${setCount} Г— ${targetReps} В· ${fmtNum(targetWeight)} kg`,
        text:(state.lang==="en"?`Based on ${recent.length} recent performances: ${reason}.`:`РќР° РѕСЃРЅРѕРІС– ${recent.length} РѕСЃС‚Р°РЅРЅС–С… РІРёРєРѕРЅР°РЅСЊ: ${reason}.`)+goalNote
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
      prescription:`${setCount} Г— ${fmtNum(target)} ${primaryUnit(ex)}`,
      text:(state.lang==="en"
        ? `Progress from the recent ${fmtNum(best)} ${primaryUnit(ex)} without breaking pace or technique.`
        : `РџСЂРѕРіСЂРµСЃСѓР№ РІС–Рґ РѕСЃС‚Р°РЅРЅС–С… ${fmtNum(best)} ${primaryUnit(ex)}, РЅРµ РІС‚СЂР°С‡Р°СЋС‡Рё С‚РµРјРї С– С‚РµС…РЅС–РєСѓ.`)+goalNote
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
        kind:"goal",title:state.lang==="en"?"Goal adjustment":"РљРѕСЂРµРєС†С–СЏ РїС–Рґ С†С–Р»СЊ",
        prescription:state.lang==="en"?"10вЂ“20 min easy cardio":"10вЂ“20 С…РІ Р»РµРіРєРѕРіРѕ РєР°СЂРґС–Рѕ",
        text:state.lang==="en"
          ? `${goalLabel(goal)}: ${fmtNum(current)} в†’ ${fmtNum(goal.target)}. Keep strength work, add moderate cardio only if recovery is good.`
          : `${goalLabel(goal)}: ${fmtNum(current)} в†’ ${fmtNum(goal.target)}. Р—Р±РµСЂРµР¶Рё СЃРёР»РѕРІСѓ С‡Р°СЃС‚РёРЅСѓ Р№ РґРѕРґР°Р№ РїРѕРјС–СЂРЅРµ РєР°СЂРґС–Рѕ Р»РёС€Рµ Р·Р° РЅРѕСЂРјР°Р»СЊРЅРѕРіРѕ РІС–РґРЅРѕРІР»РµРЅРЅСЏ.`
      };
    }
    return {
      kind:"goal",title:state.lang==="en"?"Goal adjustment":"РљРѕСЂРµРєС†С–СЏ РїС–Рґ С†С–Р»СЊ",
      prescription:state.lang==="en"?"Add 1 set to the priority movement":"Р”РѕРґР°Р№ 1 РїС–РґС…С–Рґ РґРѕ РїСЂС–РѕСЂРёС‚РµС‚РЅРѕС— РІРїСЂР°РІРё",
      text:state.lang==="en"
        ? `${goalLabel(goal)}: ${fmtNum(current)} в†’ ${fmtNum(goal.target)}. Increase weekly volume gradually, without changing the program rotation.`
        : `${goalLabel(goal)}: ${fmtNum(current)} в†’ ${fmtNum(goal.target)}. РџРѕСЃС‚СѓРїРѕРІРѕ Р·Р±С–Р»СЊС€СѓР№ С‚РёР¶РЅРµРІРёР№ РѕР±СЃСЏРі, РЅРµ Р»Р°РјР°СЋС‡Рё С‡РµСЂРіСѓРІР°РЅРЅСЏ РїСЂРѕРіСЂР°РјРё.`
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
        kind:"goal",title:state.lang==="en"?"Goal stays in rotation":"Р¦С–Р»СЊ Р·Р°Р»РёС€Р°С”С‚СЊСЃСЏ РІ СЂРѕС‚Р°С†С–С—",
        prescription:`${exName(goalEx)}: ${fmtNum(goalCurrent(activeExerciseGoal))} в†’ ${fmtNum(activeExerciseGoal.target)} ${primaryUnit(goalEx)}`,
        text:state.lang==="en"
          ? "This exercise is not part of the predicted next session, so it is not added artificially. Progress it on its regular program day."
          : "Р¦С–С”С— РІРїСЂР°РІРё РЅРµРјР°С” Сѓ РїСЂРѕРіРЅРѕР·РѕРІР°РЅРѕРјСѓ РЅР°СЃС‚СѓРїРЅРѕРјСѓ Р·Р°РЅСЏС‚С‚С–, С‚РѕРјСѓ РІРѕРЅР° РЅРµ РґРѕРґР°С”С‚СЊСЃСЏ С€С‚СѓС‡РЅРѕ. РџСЂРѕРіСЂРµСЃСѓР№ С—С— Сѓ Р·РІРёС‡РЅРёР№ РґРµРЅСЊ РїСЂРѕРіСЂР°РјРё."
      });
    }
    const goalAdjustment=bodyGoalRecommendation();
    if(goalAdjustment) recommendations.push(goalAdjustment);
    return [{
      kind:"summary",
      title:prediction.repeatsLatest
        ? (state.lang==="en"?"Rotation not detected":"Р РѕС‚Р°С†С–СЋ С‰Рµ РЅРµ РІРёР·РЅР°С‡РµРЅРѕ")
        : template.title || (state.lang==="en"?"Predicted session":"РџСЂРѕРіРЅРѕР·РѕРІР°РЅРµ Р·Р°РЅСЏС‚С‚СЏ"),
      prescription:state.lang==="en"
        ? prediction.repeatsLatest
          ? `${(template.items||[]).length} exercises В· one repeated session type`
          : `${(template.items||[]).length} exercises В· ${prediction.programLength}-session rotation`
        : prediction.repeatsLatest
          ? `${(template.items||[]).length} РІРїСЂР°РІ В· РѕРґРёРЅ РїРѕРІС‚РѕСЂСЋРІР°РЅРёР№ С‚РёРї Р·Р°РЅСЏС‚С‚СЏ`
          : `${(template.items||[]).length} РІРїСЂР°РІ В· СЂРѕС‚Р°С†С–СЏ Р· ${prediction.programLength} С‚РёРїС–РІ Р·Р°РЅСЏС‚СЊ`,
      text:state.lang==="en"
        ? prediction.repeatsLatest
          ? `The ${state.workouts.length} saved workouts do not yet show a distinct exercise rotation. The app will adjust load, but will not invent a different program day.`
          : `Suggested from the sequence of ${state.workouts.length} workouts. Pattern confidence: ${prediction.confidence}%.`
        : prediction.repeatsLatest
          ? `РЈ ${state.workouts.length} Р·Р±РµСЂРµР¶РµРЅРёС… С‚СЂРµРЅСѓРІР°РЅРЅСЏС… С‰Рµ РЅРµ РІРёРґРЅРѕ РѕРєСЂРµРјРѕРіРѕ С‡РµСЂРіСѓРІР°РЅРЅСЏ РІРїСЂР°РІ. Р”РѕРґР°С‚РѕРє СЃРєРѕСЂРёРіСѓС” РЅР°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ, Р°Р»Рµ РЅРµ РІРёРіР°РґСѓРІР°С‚РёРјРµ С–РЅС€РёР№ РґРµРЅСЊ РїСЂРѕРіСЂР°РјРё.`
          : `Р—Р°РїСЂРѕРїРѕРЅРѕРІР°РЅРѕ Р·Р° РїРѕСЃР»С–РґРѕРІРЅС–СЃС‚СЋ ${state.workouts.length} С‚СЂРµРЅСѓРІР°РЅСЊ. Р’РїРµРІРЅРµРЅС–СЃС‚СЊ Сѓ РїР°С‚РµСЂРЅС–: ${prediction.confidence}%.`,
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
      <div class="detailHeader"><div class="detailTitle"><h2>${gotAnyPR?"рџЏ† ":""}${t("saveOk")}</h2><div class="sub">${state.lang==="en"?"Program forecast updated":"РџСЂРѕРіРЅРѕР· РїСЂРѕРіСЂР°РјРё РѕРЅРѕРІР»РµРЅРѕ"}</div></div><button class="btn" id="recClose">вњ•</button></div>
      <div class="recommendationHero" style="margin-top:12px"><div><div class="recommendationSession">${escapeHtml(summary.title)}</div><div class="muted">${escapeHtml(summary.prescription||"")}</div></div></div>
      <div class="recommendationReason">${escapeHtml(summary.text||"")}</div>
      <div class="recommendationPlan">${details.map(rec=>`<div class="recommendationPlanRow"><div class="recommendationPlanMain"><strong>${escapeHtml(rec.title)}</strong><span>${escapeHtml(rec.text||"")}</span></div><div class="recommendationPrescription">${escapeHtml(rec.prescription||"")}</div></div>`).join("")}</div>
      <div class="premiumNote" style="margin-top:14px">${state.lang==="en"?"The forecast follows your workout rotation and recent performance. Adjust it if recovery or technique is poor.":"РџСЂРѕРіРЅРѕР· РІСЂР°С…РѕРІСѓС” С‡РµСЂРіСѓРІР°РЅРЅСЏ С‚РІРѕС—С… Р·Р°РЅСЏС‚СЊ С‚Р° РѕСЃС‚Р°РЅРЅС– СЂРµР·СѓР»СЊС‚Р°С‚Рё. РљРѕСЂРёРіСѓР№ Р№РѕРіРѕ, СЏРєС‰Рѕ РІС–РґРЅРѕРІР»РµРЅРЅСЏ Р°Р±Рѕ С‚РµС…РЅС–РєР° РЅРµРґРѕСЃС‚Р°С‚РЅС–."}</div>
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

    const fallbackTitle = state.lang==="en" ? `Workout ${fmtDate(date)}` : `РўСЂРµРЅСѓРІР°РЅРЅСЏ ${fmtDate(date)}`;
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
      const name = ex ? exName(ex) : "вЂ”";
      const chips = (it.sets||[]).map(s=>{
        return `<span class="chip">${formatExerciseSet(ex,s)}</span>`;
      }).join("");
      const counter = modal.querySelector("#pickSelectedCount");
      if(counter) counter.textContent = state.lang==="en" ? `${selected.size} selected` : `Р’РёР±СЂР°РЅРѕ: ${selected.size}`;

      return `
        <div class="card" style="margin:10px 0 0">
          <div class="row" style="justify-content:space-between">
            <div class="left">
              ${ex ? exIcon(ex) : `<div class="exIconWrap">${iconSvg("dumbbell")}</div>`}
              <div>
                <div style="font-weight:900">${escapeHtml(name)}</div>
                <div class="muted">${catName(ex?.category||"")} вЂў ${trackingLabel(ex)}</div>
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
          <h2>${escapeHtml(w.title || (state.lang==="en" ? "Workout" : "РўСЂРµРЅСѓРІР°РЅРЅСЏ"))}</h2>
          <div class="sub">${fmtDate(w.date)}</div>
        </div>
        <button class="btn" id="wdClose" style="border-radius:50%; width:42px; height:42px; padding:0;">вњ•</button>
      </div>

      <div class="kpiGrid2" style="margin-top:12px">
        <div class="kpi gold"><div class="label">${t("maxWeight")}</div><div class="value">${fmtNum(maxW)}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "Sets" : "РџС–РґС…РѕРґС–РІ"}</div><div class="value">${totalSets}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "Volume" : "РћР±КјС”Рј"}</div><div class="value sm">${fmtVol(totalVol)} kg</div></div>
        <div class="kpi"><div class="label">${t("exercisesCount")}</div><div class="value">${(w.items||[]).length}</div></div>
        <div class="kpi"><div class="label">${t("calories")} В· в‰€</div><div class="value sm">${calories} kcal</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "Estimated duration" : "РћСЂС–С”РЅС‚РѕРІРЅРёР№ С‡Р°СЃ"}</div><div class="value sm">в‰€ ${estimatedMinutes} ${state.lang==="en"?"min":"С…РІ"}</div></div>
      </div>

      ${itemsHtml}

      <div class="row" style="justify-content:space-between; margin-top:14px">
        <button class="btn" id="wdDelete">рџ—‘ ${t("deleteWorkout")}</button>
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
          <div class="sub">${state.lang==="en" ? "List + filters" : "РЎРїРёСЃРєРѕРј + С„С–Р»СЊС‚СЂ РїРѕ РєР°С‚РµРіРѕСЂС–СЏС…"}</div>
        </div>
        <button class="btn primary" id="exPlus" title="Add" style="border-radius:50%; width:44px; height:44px; padding:0;">пј‹</button>
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
      const lastTxt = lastTs ? fmtDate(new Date(lastTs)) : "вЂ”";
      return `
        <div class="itemRow">
          <div class="left">
            ${exIcon(ex)}
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(exName(ex))}</strong></div>
              <div class="muted">${catName(ex.category)} вЂў ${trackingLabel(ex)} вЂў PR: <span class="prText">${fmtNum(prW)} ${primaryUnit(ex)}</span> вЂў ${t("last")}: ${lastTxt}</div>
            </div>
          </div>
          <div class="row">
            <button class="btn" data-fav="${ex.id}">${isFav(ex.id)?"в­ђ":"в†"}</button>
            <button class="btn" data-delex="${ex.id}" title="${t("deleteExercise")}">рџ—‘</button>
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
          <div class="sub">${state.lang==="en" ? "Add your own exercise" : "Р”РѕРґР°Р№ СЃРІРѕСЋ РІРїСЂР°РІСѓ"}</div>
        </div>
        <button class="btn" id="addClose" style="border-radius:50%; width:42px; height:42px; padding:0;">вњ•</button>
      </div>

      <div class="row" style="margin-top:12px; flex-wrap:wrap;">
        <input id="nUa" class="btn" style="flex:1; min-width:220px" placeholder="РќР°Р·РІР° (UA)" />
        <input id="nEn" class="btn" style="flex:1; min-width:220px" placeholder="Name (EN)" />
        <select id="nCat" class="btn">
          ${allCategories().filter(c=>c.id!=="all").map(c=>`<option value="${c.id}">${state.lang==="ua"?c.ua:c.en}</option>`).join("")}
          <option value="__new">${state.lang==="en"?"+ New category":"+ РќРѕРІР° РєР°С‚РµРіРѕСЂС–СЏ"}</option>
        </select>
        <div id="newCategoryFields" class="newCategoryFields" style="display:none">
          <input id="nCatUa" class="btn" placeholder="${state.lang==="en"?"Category name":"РќР°Р·РІР° РєР°С‚РµРіРѕСЂС–С—"}" />
          <input id="nCatEn" class="btn" placeholder="${state.lang==="en"?"English name (optional)":"РќР°Р·РІР° Р°РЅРіР»С–Р№СЃСЊРєРѕСЋ (РЅРµРѕР±РѕРІвЂ™СЏР·РєРѕРІРѕ)"}" />
        </div>
        <select id="nTracking" class="btn">
          <option value="strength">${state.lang==="en"?"Weight + reps":"Р’Р°РіР° + РїРѕРІС‚РѕСЂРё"}</option>
          <option value="reps">${state.lang==="en"?"Repetitions only":"Р›РёС€Рµ РїРѕРІС‚РѕСЂРё"}</option>
          <option value="time">${state.lang==="en"?"Duration":"Р§Р°СЃ РІРёРєРѕРЅР°РЅРЅСЏ"}</option>
          <option value="distance">${state.lang==="en"?"Distance + time":"Р”РёСЃС‚Р°РЅС†С–СЏ + С‡Р°СЃ"}</option>
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
          <div class="sub">${state.lang==="en" ? "Overview" : "Р—Р°РіР°Р»СЊРЅР° СЃС‚Р°С‚РёСЃС‚РёРєР°"}</div>
        </div>
      </div>

      <div class="filters" id="statsRanges">
        <button class="fchip ${range==="week"?"active":""}" data-r="week">${t("week")}</button>
        <button class="fchip ${range==="month"?"active":""}" data-r="month">${t("month")}</button>
        <button class="fchip ${range==="all"?"active":""}" data-r="all">${t("all")}</button>
      </div>

      <div class="kpiGrid4" style="margin-top:10px">
        <div class="kpiBox kpiPurple"><div class="ico">рџЏ‹пёЏ</div><div class="val">${trainings}</div><div class="lbl">${t("totalTrainings")}</div></div>
        <div class="kpiBox kpiTeal"><div class="ico">рџ“…</div><div class="val">${days}</div><div class="lbl">${t("activeDays")}</div></div>
        <div class="kpiBox kpiPink"><div class="ico">рџ§±</div><div class="val">${sets}</div><div class="lbl">${t("totalSets")}</div></div>
        <div class="kpiBox kpiGold"><div class="ico">рџ”Ґ</div><div class="val">${fmtVol(vol)}</div><div class="lbl">${t("totalVolume")}</div></div>
      </div>
      <div class="calorieCard">
        <div><div style="font-weight:900">рџ”Ґ ${t("calories")}</div><div class="muted">${t("caloriesApprox")} В· MET + ${fmtNum(latestBodyWeight())} kg</div></div>
        <div class="calorieValue">в‰€ ${calories} kcal</div>
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
      box.innerHTML = `<div class="muted">${state.lang==="en" ? "Set a target such as 100 kg bench press or 85 cm waist." : "РџРѕСЃС‚Р°РІ С†С–Р»СЊ: РЅР°РїСЂРёРєР»Р°Рґ, Р¶РёРј 100 РєРі Р°Р±Рѕ С‚Р°Р»С–СЏ 85 СЃРј."}</div>`;
      return;
    }
    box.innerHTML = state.goals.map(goal=>{
      const current = goalCurrent(goal);
      const progress = goalProgress(goal);
      const goalEx=goal.type==="exercise" ? state.exercises.find(ex=>ex.id===goal.exerciseId) : null;
      const unit = goal.type==="exercise" ? primaryUnit(goalEx) : goal.metric==="weight" ? "kg" : "cm";
      return `<div class="goalItem">
        <div class="goalTop">
          <div><strong>${escapeHtml(goalLabel(goal))}</strong><div class="muted">${progress>=100 ? (state.lang==="en"?"Goal achieved":"Р¦С–Р»СЊ РґРѕСЃСЏРіРЅСѓС‚Р°") : `${progress}%`}</div></div>
          <button class="btn" data-delgoal="${goal.id}" title="${t("deleteMeasure")}">вњ•</button>
        </div>
        <div class="goalTrack"><span class="goalFill" style="width:${progress}%"></span></div>
        <div class="goalMeta"><span>${state.lang==="en"?"Current":"Р—Р°СЂР°Р·"}: ${fmtNum(current)} ${unit}</span><span>${state.lang==="en"?"Target":"Р¦С–Р»СЊ"}: ${fmtNum(goal.target)} ${unit}</span></div>
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
      <div class="detailHeader"><div class="detailTitle"><h2>${t("addGoal")}</h2><div class="sub">${state.lang==="en"?"Choose a measurable target":"РћР±РµСЂРё РІРёРјС–СЂСЋРІР°РЅСѓ С†С–Р»СЊ"}</div></div><button class="btn" id="goalClose">вњ•</button></div>
      <div class="bodyGrid" style="margin-top:14px">
        <div class="bodyField"><div class="muted">${state.lang==="en"?"Goal type":"РўРёРї С†С–Р»С–"}</div><select class="btn" id="goalType"><option value="exercise">${state.lang==="en"?"Exercise PR":"Р РµРєРѕСЂРґ Сѓ РІРїСЂР°РІС–"}</option><option value="body">${state.lang==="en"?"Body metric":"РџРѕРєР°Р·РЅРёРє С‚С–Р»Р°"}</option></select></div>
        <div class="bodyField" id="goalExerciseField"><div class="muted">${t("exercises")}</div><select class="btn" id="goalExercise">${state.exercises.map(ex=>`<option value="${ex.id}">${escapeHtml(exName(ex))}</option>`).join("")}</select></div>
        <div class="bodyField" id="goalMetricField" style="display:none"><div class="muted">${state.lang==="en"?"Metric":"РџРѕРєР°Р·РЅРёРє"}</div><select class="btn" id="goalMetric"><option value="weight">${state.lang==="en"?"Weight":"Р’Р°РіР°"}</option><option value="waist">${state.lang==="en"?"Waist":"РўР°Р»С–СЏ"}</option><option value="chest">${state.lang==="en"?"Chest":"Р“СЂСѓРґРё"}</option><option value="forearm">${state.lang==="en"?"Forearm":"РџРµСЂРµРґРїР»С–С‡С‡СЏ"}</option><option value="legs">${state.lang==="en"?"Legs":"РќРѕРіРё"}</option></select></div>
        <div class="bodyField"><div class="muted">${state.lang==="en"?"Target value":"Р¦С–Р»СЊРѕРІРµ Р·РЅР°С‡РµРЅРЅСЏ"}</div><input class="btn" id="goalTarget" inputmode="decimal" placeholder="100"></div>
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
          <div class="muted">${options.caption || (state.lang==="en" ? "Latest result" : "РћСЃС‚Р°РЅРЅС–Р№ СЂРµР·СѓР»СЊС‚Р°С‚")}</div>
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
        <div class="chartStat"><span>${state.lang==="en"?"Minimum":"РњС–РЅС–РјСѓРј"}</span><strong>${labelValue(min)}${unit?` ${unit}`:""}</strong></div>
        <div class="chartStat"><span>${state.lang==="en"?"Average":"РЎРµСЂРµРґРЅС”"}</span><strong>${labelValue(values.reduce((a,v)=>a+v,0)/values.length)}${unit?` ${unit}`:""}</strong></div>
        <div class="chartStat"><span>${state.lang==="en"?"Maximum":"РњР°РєСЃРёРјСѓРј"}</span><strong>${labelValue(max)}${unit?` ${unit}`:""}</strong></div>
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
      caption:state.lang==="en" ? "Volume of latest workout" : "РћР±КјС”Рј РѕСЃС‚Р°РЅРЅСЊРѕРіРѕ С‚СЂРµРЅСѓРІР°РЅРЅСЏ"
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
        <div><div class="muted">${state.lang==="en" ? "Total load" : "РЎСѓРјР°СЂРЅРµ РЅР°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ"}</div><div class="chartBig">${fmtVol(total)} <small style="font-size:.48em;color:var(--muted)">kg</small></div></div>
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
              <div class="muted statsExerciseMeta">${catName(ex.category)} вЂў ${trackingLabel(ex)} вЂў PR: <span class="prText">${fmtNum(prW)} ${primaryUnit(ex)}</span> вЂў ${m.count}x</div>
            </div>
          </div>
          <div class="statsExerciseActions">
            <button class="btn" data-fav="${ex.id}">${isFav(ex.id)?"в­ђ":"в†"}</button>
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
          <span style="font-size:18px;">в†ђ</span>
        </button>
      </div>

      <div class="kpiGrid2">
        <div class="kpi gold"><div class="label">${state.lang==="en" ? "trainings" : "С‚СЂРµРЅСѓРІР°РЅСЊ"}</div><div class="value">${trainings}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "sets" : "РїС–РґС…РѕРґС–РІ"}</div><div class="value">${setsTotal}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "reps total" : "РІСЃСЊРѕРіРѕ РїРѕРІС‚РѕСЂРµРЅСЊ"}</div><div class="value">${repsTotal}</div></div>
        <div class="kpi gold"><div class="label">${state.lang==="en" ? "max weight" : "РјР°РєСЃ. РІР°РіР°"}</div><div class="value">${fmtNum(prW)}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "avg weight" : "СЃРµСЂРµРґРЅСЏ РІР°РіР°"}</div><div class="value sm">${fmtNum(avgWeight)} kg</div></div>
        <div class="kpi"><div class="label">${state.lang==="en" ? "total volume" : "Р—Р°РіР°Р»СЊРЅРёР№ РѕР±вЂ™С”Рј"}</div><div class="value sm">${fmtVol(totalVol)} kg</div></div>
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
              return `<span class="${cls}">${w}kg Г— ${reps}</span>`;
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
      caption:state.lang==="en" ? "Working weight" : "Р РѕР±РѕС‡Р° РІР°РіР°"
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
        <div class="detailTitle"><h2>${escapeHtml(exName(ex))}</h2><div class="sub">${escapeHtml(catName(ex.category))} вЂў ${trackingLabel(ex)}</div></div>
        <button class="btn" id="closeDetail" style="border-radius:50%;width:42px;height:42px;padding:0">в†ђ</button>
      </div>
      <div class="kpiGrid2">
        <div class="kpi gold"><div class="label">${state.lang==="en"?"trainings":"С‚СЂРµРЅСѓРІР°РЅСЊ"}</div><div class="value">${flat.length}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en"?"entries":"РїС–РґС…РѕРґС–РІ"}</div><div class="value">${sets.length}</div></div>
        <div class="kpi gold"><div class="label">${state.lang==="en"?"personal best":"РѕСЃРѕР±РёСЃС‚РёР№ СЂРµРєРѕСЂРґ"}</div><div class="value sm">${fmtNum(best)} ${unit}</div></div>
        <div class="kpi"><div class="label">${state.lang==="en"?"total":"Р·Р°РіР°Р»РѕРј"}</div><div class="value sm">${fmtNum(total)} ${unit}</div></div>
        ${type==="distance"?`<div class="kpi"><div class="label">${state.lang==="en"?"total time":"Р·Р°РіР°Р»СЊРЅРёР№ С‡Р°СЃ"}</div><div class="value sm">${fmtNum(secondary)} ${state.lang==="en"?"min":"С…РІ"}</div></div>`:""}
      </div>
      <div class="sectionCard"><div class="sectionTitle">${state.lang==="en"?"Progress":"РџСЂРѕРіСЂРµСЃ"}</div><div class="chartSurface">${trendMarkup(points,{color:type==="distance"?"#22d3ee":"#a78bfa",unit,caption:trackingLabel(ex)})}</div></div>
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
      caption:state.lang==="en" ? "Exercise volume" : "РћР±КјС”Рј РІРїСЂР°РІРё"
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
          <div class="sub">${state.lang==="en" ? "Weight + measurements" : "Р’Р°РіР° + РѕР±вЂ™С”РјРё"}</div>
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
            <input id="bForearm" class="btn" inputmode="decimal" placeholder="вЂ”" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyChest")}</div>
            <input id="bChest" class="btn" inputmode="decimal" placeholder="вЂ”" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyWaist")}</div>
            <input id="bWaist" class="btn" inputmode="decimal" placeholder="вЂ”" />
          </div>
          <div class="bodyField">
            <div class="muted">${t("bodyLegs")}</div>
            <input id="bLegs" class="btn" inputmode="decimal" placeholder="вЂ”" />
          </div>
          <div class="bodyActions">
            <button class="btn primary" id="bSave">рџ’ѕ ${t("save")}</button>
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
          createdAt: Date.now(),   // <-- РґРѕРґР°Р№ С†Рµ
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

        // СЏРєС‰Рѕ РѕРґРЅР°РєРѕРІР° РґР°С‚Р° вЂ” СЃРѕСЂС‚СѓС”РјРѕ Р·Р° РїРѕСЂСЏРґРєРѕРј РґРѕРґР°РІР°РЅРЅСЏ
        const ca = Number(a.createdAt || 0);
        const cb = Number(b.createdAt || 0);
        if (ca !== cb) return ca - cb;

        // fallback, СЏРєС‰Рѕ РЅРµРјР° createdAt (СЃС‚Р°СЂС– Р·Р°РїРёСЃРё)
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
      if (m.weight>0) parts.push(`вљ–пёЏ ${fmtNum(m.weight)}kg`);
      if (m.forearm>0) parts.push(`рџ¦ѕ ${fmtNum(m.forearm)}cm`);
      if (m.chest>0) parts.push(`рџ«Ѓ ${fmtNum(m.chest)}cm`);
      if (m.waist>0) parts.push(`в­• ${fmtNum(m.waist)}cm`);
      if (m.legs>0) parts.push(`рџ¦µ ${fmtNum(m.legs)}cm`);
      return `
        <div class="itemRow">
          <div class="left">
            <div class="exIconWrap" style="background: rgba(167,139,250,.12); border-color: rgba(167,139,250,.18);">
              рџ“Џ
            </div>
            <div style="min-width:0">
              <div class="titleLine"><strong>${fmtDate(m.date)}</strong></div>
              <div class="muted" style="white-space:normal">${parts.join(" вЂў ")}</div>
            </div>
          </div>
          <div class="row">
            <button class="btn" data-delm="${m.id}">рџ—‘</button>
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
      chartBodyWeight: { icon:"вљ–пёЏ", ua:"Р’Р°РіР°", en:"Weight", unit:"kg" },
      chartBodyForearm: { icon:"рџ¦ѕ", ua:"РџРµСЂРµРґРїР»С–С‡С‡СЏ", en:"Forearm", unit:"cm" },
      chartBodyChest: { icon:"в—«", ua:"Р“СЂСѓРґРё", en:"Chest", unit:"cm" },
      chartBodyWaist: { icon:"в—Ћ", ua:"РўР°Р»С–СЏ", en:"Waist", unit:"cm" },
      chartBodyLegs: { icon:"в—’", ua:"РќРѕРіРё", en:"Legs", unit:"cm" }
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
          рџЏ†
        </div>
        <div style="font-size:22px; font-weight:900;">${state.lang==="en" ? "Personal records" : "РћСЃРѕР±РёСЃС‚С– СЂРµРєРѕСЂРґРё"}</div>
        <div class="muted" id="recCount" style="margin-top:4px"></div>
      </div>

      <div class="categoryRail" id="recCats"></div>
      <div class="row" style="justify-content:flex-end; margin-top:10px">
        <button class="btn" id="clearPrBtn">рџ—‘ ${state.lang==="en" ? "Clear records" : "РћС‡РёСЃС‚РёС‚Рё СЂРµРєРѕСЂРґРё"}</button>
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
      : `${list.length} СЂРµРєРѕСЂРґС–РІ РІСЃС‚Р°РЅРѕРІР»РµРЅРѕ`;

    if (!list.length){
      box.innerHTML = `<div class="muted">${t("noData")}</div>`;
      return;
    }

    box.innerHTML = list.slice(0, 50).map((x, idx)=>{
      const pr = x.pr || {};
      const w = fmtNum(exercisePRValue(x.ex));
      const reps = fmtNum(pr.reps||0);
      const d = pr.date ? fmtDate(pr.date) : "вЂ”";
      const type=exerciseTracking(x.ex);
      const detail=type==="strength"
        ? `${reps} ${state.lang==="en" ? "reps" : "РїРѕРІС‚."}`
        : trackingLabel(x.ex);
      return `
        <div class="itemRow recordRow" data-open-record-stat="${x.ex.id}" role="button" tabindex="0">
          <div class="left">
            <div class="exIconWrap" style="background: rgba(167,139,250,.12); border-color: rgba(167,139,250,.18);">
              <div style="font-weight:900; color: rgba(167,139,250,.95)">#${idx+1}</div>
            </div>
            <div style="min-width:0">
              <div class="titleLine"><strong>${escapeHtml(exName(x.ex))}</strong></div>
              <div class="muted">${d} вЂў ${detail}</div>
            </div>
          </div>
          <div class="row" style="gap:10px; align-items:center">
            <div style="text-align:right">
              <div style="font-weight:900; font-size:26px; color: rgba(255,200,87,.95)">${w}</div>
              <div class="muted">${primaryUnit(x.ex)}</div>
            </div>
            <button class="btn" data-delpr="${x.ex.id}" title="${t("deleteMeasure")}">рџ—‘</button>
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
        title:en?"1. Create or choose exercises":"1. РЎС‚РІРѕСЂРё Р°Р±Рѕ РѕР±РµСЂРё РІРїСЂР°РІРё",
        sub:en?"Exercise type defines what you enter":"РўРёРї РІРїСЂР°РІРё РІРёР·РЅР°С‡Р°С” РїРѕР»СЏ РІРІРµРґРµРЅРЅСЏ",
        copy:en
          ? "Open Exercises and tap +. Choose an existing category or New category. Then select tracking: weight + reps, reps only, duration, or distance + time."
          : "Р’С–РґРєСЂРёР№ В«Р’РїСЂР°РІРёВ» Р№ РЅР°С‚РёСЃРЅРё +. РћР±РµСЂРё РЅР°СЏРІРЅСѓ РєР°С‚РµРіРѕСЂС–СЋ Р°Р±Рѕ В«РќРѕРІР° РєР°С‚РµРіРѕСЂС–СЏВ». Р”Р°Р»С– РІРєР°Р¶Рё С‚РёРї РѕР±Р»С–РєСѓ: РІР°РіР° + РїРѕРІС‚РѕСЂРё, Р»РёС€Рµ РїРѕРІС‚РѕСЂРё, С‡Р°СЃ Р°Р±Рѕ РґРёСЃС‚Р°РЅС†С–СЏ + С‡Р°СЃ.",
        example:en?"Example: Pull-ups в†’ Reps only. Treadmill в†’ Distance + time.":"РџСЂРёРєР»Р°Рґ: РџС–РґС‚СЏРіСѓРІР°РЅРЅСЏ в†’ Р›РёС€Рµ РїРѕРІС‚РѕСЂРё. Р”РѕСЂС–Р¶РєР° в†’ Р”РёСЃС‚Р°РЅС†С–СЏ + С‡Р°СЃ.",
        mini:`<div class="miniTitle">пј‹ ${en?"New exercise":"РќРѕРІР° РІРїСЂР°РІР°"}</div><div class="miniField">${en?"Pull-ups":"РџС–РґС‚СЏРіСѓРІР°РЅРЅСЏ"}</div><div class="miniRow"><div class="miniField">${en?"Back":"РЎРїРёРЅР°"}</div><div class="miniField">${en?"Reps only":"Р›РёС€Рµ РїРѕРІС‚РѕСЂРё"}</div></div><div class="miniButton" style="margin-top:6px;text-align:center">${en?"Create":"РЎС‚РІРѕСЂРёС‚Рё"}</div>`
      },
      {
        title:en?"2. Start a workout":"2. РџРѕС‡РЅРё С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
        sub:en?"Build today's exercise list":"РЎРєР»Р°РґРё СЃРїРёСЃРѕРє РІРїСЂР°РІ РЅР° СЃСЊРѕРіРѕРґРЅС–",
        copy:en
          ? "Open Workout, set a title if needed, then tap Add exercise. Add every exercise you plan to perform."
          : "Р’С–РґРєСЂРёР№ В«РўСЂРµРЅСѓРІР°РЅРЅСЏВ», Р·Р° РїРѕС‚СЂРµР±Рё Р·РјС–РЅРё РЅР°Р·РІСѓ Р№ РЅР°С‚РёСЃРЅРё В«Р”РѕРґР°С‚Рё РІРїСЂР°РІСѓВ». Р”РѕРґР°Р№ СѓСЃС– РІРїСЂР°РІРё, СЏРєС– РїР»Р°РЅСѓС”С€ РІРёРєРѕРЅР°С‚Рё.",
        example:en?"Example: Chest Monday в†’ Bench press, incline press, push-ups.":"РџСЂРёРєР»Р°Рґ: Р“СЂСѓРґРё РїРѕРЅРµРґС–Р»РѕРє в†’ Р–РёРј Р»РµР¶Р°С‡Рё, Р¶РёРј РїС–Рґ РєСѓС‚РѕРј, РІС–РґР¶РёРјР°РЅРЅСЏ.",
        mini:`<div class="miniTitle">${en?"Workout":"РўСЂРµРЅСѓРІР°РЅРЅСЏ"}</div><div class="miniField">${en?"Chest Monday":"Р“СЂСѓРґРё РїРѕРЅРµРґС–Р»РѕРє"}</div><div class="miniRow"><div class="miniButton">пј‹ ${en?"Add exercise":"Р”РѕРґР°С‚Рё РІРїСЂР°РІСѓ"}</div></div>`
      },
      {
        title:en?"3. Enter sets correctly":"3. РџСЂР°РІРёР»СЊРЅРѕ РІРЅРµСЃРё РїС–РґС…РѕРґРё",
        sub:en?"Fields change automatically by exercise type":"РџРѕР»СЏ Р·РјС–РЅСЋСЋС‚СЊСЃСЏ Р·Р° С‚РёРїРѕРј РІРїСЂР°РІРё",
        copy:en
          ? "Add a set and enter the actual result. Strength uses reps and kg; bodyweight uses reps; timed exercises use minutes; cardio uses distance and minutes. When all required fields are filled, the rest timer starts automatically."
          : "Р”РѕРґР°Р№ РїС–РґС…С–Рґ С– РІРЅРµСЃРё С„Р°РєС‚РёС‡РЅРёР№ СЂРµР·СѓР»СЊС‚Р°С‚. РЎРёР»РѕРІР° РІРїСЂР°РІР° РјР°С” РїРѕРІС‚РѕСЂРё С‚Р° РєРі; РІР»Р°СЃРЅР° РІР°РіР° вЂ” РїРѕРІС‚РѕСЂРё; РІРїСЂР°РІР° РЅР° С‡Р°СЃ вЂ” С…РІРёР»РёРЅРё; РєР°СЂРґС–Рѕ вЂ” РґРёСЃС‚Р°РЅС†С–СЋ С‚Р° С…РІРёР»РёРЅРё. РљРѕР»Рё РІСЃС– РїРѕС‚СЂС–Р±РЅС– РїРѕР»СЏ Р·Р°РїРѕРІРЅРµРЅС–, С‚Р°Р№РјРµСЂ РІС–РґРїРѕС‡РёРЅРєСѓ Р·Р°РїСѓСЃРєР°С”С‚СЊСЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РЅРѕ.",
        example:en?"80 kg Г— 8 starts the timer. At zero the phone vibrates if vibration is supported and enabled.":"80 РєРі Г— 8 Р·Р°РїСѓСЃРєР°С” С‚Р°Р№РјРµСЂ. РќР° РЅСѓР»С– С‚РµР»РµС„РѕРЅ РІС–Р±СЂСѓС”, СЏРєС‰Рѕ РїСЂРёСЃС‚СЂС–Р№ РїС–РґС‚СЂРёРјСѓС” РІС–Р±СЂР°С†С–СЋ С– РІРѕРЅР° РґРѕР·РІРѕР»РµРЅР°.",
        mini:`<div class="miniTitle">${en?"Sets":"РџС–РґС…РѕРґРё"}</div><div class="miniRow"><div class="miniField">#1</div><div class="miniField">8 ${en?"reps":"РїРѕРІС‚."}</div><div class="miniField">80 kg</div></div><div class="miniRow"><div class="miniField">2.5 km</div><div class="miniField">30 ${en?"min":"С…РІ"}</div></div>`
      },
      {
        title:en?"4. Save and review advice":"4. Р—Р±РµСЂРµР¶Рё Р№ РїРµСЂРµРіР»СЏРЅСЊ РїРѕСЂР°РґСѓ",
        sub:en?"The workout enters history and updates PRs":"РўСЂРµРЅСѓРІР°РЅРЅСЏ РїРѕС‚СЂР°РїРёС‚СЊ РІ С–СЃС‚РѕСЂС–СЋ С‚Р° РѕРЅРѕРІРёС‚СЊ СЂРµРєРѕСЂРґРё",
        copy:en
          ? "After the final set tap Save workout. Records and statistics update immediately. After at least 5 sessions, the app compares exercise combinations, learns your A/B/C rotation, and predicts the next program day from the full history."
          : "РџС–СЃР»СЏ РѕСЃС‚Р°РЅРЅСЊРѕРіРѕ РїС–РґС…РѕРґСѓ РЅР°С‚РёСЃРЅРё В«Р—Р±РµСЂРµРіС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏВ». Р РµРєРѕСЂРґРё Р№ СЃС‚Р°С‚РёСЃС‚РёРєР° РѕРЅРѕРІР»СЏС‚СЊСЃСЏ РѕРґСЂР°Р·Сѓ. РџС–СЃР»СЏ С‰РѕРЅР°Р№РјРµРЅС€Рµ 5 Р·Р°РЅСЏС‚СЊ РґРѕРґР°С‚РѕРє РїРѕСЂС–РІРЅСЋС” РїРѕС”РґРЅР°РЅРЅСЏ РІРїСЂР°РІ, РІРёРІС‡Р°С” СЂРѕС‚Р°С†С–СЋ A/B/C С– РїСЂРѕРіРЅРѕР·СѓС” РЅР°СЃС‚СѓРїРЅРёР№ РґРµРЅСЊ Р· СѓСЃС–С”С— С–СЃС‚РѕСЂС–С—.",
        example:en?"A в†’ B в†’ C в†’ A means the next forecast is B. If every saved workout has the same exercises, the app says that no rotation is visible instead of inventing one.":"A в†’ B в†’ C в†’ A РѕР·РЅР°С‡Р°С”, С‰Рѕ РЅР°СЃС‚СѓРїРЅРёРј РїСЂРѕРіРЅРѕР·СѓС”С‚СЊСЃСЏ B. РЇРєС‰Рѕ РІСЃС– Р·Р±РµСЂРµР¶РµРЅС– Р·Р°РЅСЏС‚С‚СЏ РјР°СЋС‚СЊ РѕРґРЅР°РєРѕРІС– РІРїСЂР°РІРё, РґРѕРґР°С‚РѕРє РїРѕРІС–РґРѕРјРёС‚СЊ, С‰Рѕ СЂРѕС‚Р°С†С–С— С‰Рµ РЅРµ РІРёРґРЅРѕ, Р° РЅРµ РІРёРіР°РґСѓРІР°С‚РёРјРµ С—С—.",
        mini:`<div class="miniButton" style="text-align:center">рџ’ѕ ${en?"Save workout":"Р—Р±РµСЂРµРіС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</div><div class="miniRow"><div class="miniStat">${en?"Calories":"РљР°Р»РѕСЂС–С—"}<strong>в‰€ 420</strong></div><div class="miniStat">PR<strong>+2.5 kg</strong></div></div>`
      },
      {
        title:en?"5. Add body measurements":"5. Р”РѕРґР°Р№ Р·Р°РјС–СЂРё С‚С–Р»Р°",
        sub:en?"Use the same conditions for comparable data":"Р РѕР±Рё Р·Р°РјС–СЂРё РІ РѕРґРЅР°РєРѕРІРёС… СѓРјРѕРІР°С…",
        copy:en
          ? "In Body choose the date, then enter only the measurements you took. Empty fields are allowed. For a clean trend, measure at the same time of day."
          : "РЈ В«РўС–Р»РѕВ» СЃРїРѕС‡Р°С‚РєСѓ РѕР±РµСЂРё РґР°С‚Сѓ, РїРѕС‚С–Рј РІРЅРµСЃРё Р»РёС€Рµ С‚С– РїРѕРєР°Р·РЅРёРєРё, СЏРєС– РІРёРјС–СЂСЏРІ. РџРѕСЂРѕР¶РЅС– РїРѕР»СЏ РґРѕР·РІРѕР»РµРЅС–. Р”Р»СЏ С‡РµСЃРЅРѕРіРѕ РіСЂР°С„С–РєР° РІРёРјС–СЂСЋР№СЃСЏ РїСЂРёР±Р»РёР·РЅРѕ РІ РѕРґРЅР°РєРѕРІРёР№ С‡Р°СЃ.",
        example:en?"Weight 89 kg В· waist 90 cm. You do not have to fill every field.":"Р’Р°РіР° 89 РєРі В· С‚Р°Р»С–СЏ 90 СЃРј. Р—Р°РїРѕРІРЅСЋРІР°С‚Рё РІСЃС– РїРѕР»СЏ РЅРµ РѕР±РѕРІвЂ™СЏР·РєРѕРІРѕ.",
        mini:`<div class="miniTitle">${en?"Body measurement":"Р—Р°РјС–СЂРё С‚С–Р»Р°"}</div><div class="miniField">09.06.2026</div><div class="miniRow"><div class="miniField">89 kg</div><div class="miniField">90 cm</div></div><div class="miniButton" style="margin-top:6px;text-align:center">${en?"Save":"Р—Р±РµСЂРµРіС‚Рё"}</div>`
      },
      {
        title:en?"6. Set goals and read progress":"6. РџРѕСЃС‚Р°РІ С†С–Р»С– Р№ Р°РЅР°Р»С–Р·СѓР№ РїСЂРѕРіСЂРµСЃ",
        sub:en?"Goals appear first on Home":"Р¦С–Р»С– РІС–РґРѕР±СЂР°Р¶Р°СЋС‚СЊСЃСЏ РїРµСЂС€РёРјРё РЅР° РіРѕР»РѕРІРЅС–Р№",
        copy:en
          ? "Create a strength, repetition, time, distance, weight, or body measurement target. The forecast keeps your program rotation but changes progression priority, volume, or cardio advice to match the active goal."
          : "РЎС‚РІРѕСЂРё С†С–Р»СЊ РґР»СЏ РІР°РіРё, РїРѕРІС‚РѕСЂС–РІ, С‡Р°СЃСѓ, РґРёСЃС‚Р°РЅС†С–С— Р°Р±Рѕ РїРѕРєР°Р·РЅРёРєР° С‚С–Р»Р°. РџСЂРѕРіРЅРѕР· Р·Р±РµСЂС–РіР°С” С‡РµСЂРіСѓРІР°РЅРЅСЏ РїСЂРѕРіСЂР°РјРё, Р°Р»Рµ Р·РјС–РЅСЋС” РїСЂС–РѕСЂРёС‚РµС‚ РїСЂРѕРіСЂРµСЃС–С—, РѕР±СЃСЏРі Р°Р±Рѕ РїРѕСЂР°РґСѓ С‰РѕРґРѕ РєР°СЂРґС–Рѕ РІС–РґРїРѕРІС–РґРЅРѕ РґРѕ Р°РєС‚РёРІРЅРѕС— С†С–Р»С–.",
        example:en?"Bench 100 kg raises overload priority on bench day; waist 85 cm may add 10вЂ“20 min easy cardio without replacing strength work.":"Р–РёРј 100 РєРі РїС–РґРІРёС‰СѓС” РїСЂС–РѕСЂРёС‚РµС‚ РЅР°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ Сѓ РґРµРЅСЊ Р¶РёРјСѓ; С‚Р°Р»С–СЏ 85 СЃРј РјРѕР¶Рµ РґРѕРґР°С‚Рё 10вЂ“20 С…РІ Р»РµРіРєРѕРіРѕ РєР°СЂРґС–Рѕ Р±РµР· Р·Р°РјС–РЅРё СЃРёР»РѕРІРѕС— С‡Р°СЃС‚РёРЅРё.",
        mini:`<div class="miniTitle">${en?"Goal":"Р¦С–Р»СЊ"} В· ${en?"Bench press":"Р–РёРј Р»РµР¶Р°С‡Рё"}</div><div style="font-size:17px;font-weight:950">92 в†’ 100 kg</div><div class="miniBar"><span></span></div><div class="miniRow"><div class="miniStat">${en?"Progress":"РџСЂРѕРіСЂРµСЃ"}<strong>60%</strong></div><div class="miniStat">${en?"Period":"РџРµСЂС–РѕРґ"}<strong>${en?"Month":"РњС–СЃСЏС†СЊ"}</strong></div></div>`
      },
      {
        title:en?"7. Protect your data":"7. Р—Р°С…РёСЃС‚Рё СЃРІРѕС— РґР°РЅС–",
        sub:en?"Export JSON regularly":"Р РµРіСѓР»СЏСЂРЅРѕ СЂРѕР±Рё РµРєСЃРїРѕСЂС‚ JSON",
        copy:en
          ? "All information is stored on this device. In Settings tap Export JSON and keep the file. After reinstalling or changing phones, use Import JSON."
          : "РЈСЃС– РґР°РЅС– Р·Р±РµСЂС–РіР°СЋС‚СЊСЃСЏ РЅР° С†СЊРѕРјСѓ РїСЂРёСЃС‚СЂРѕС—. РЈ В«РќР°Р»Р°С€С‚СѓРІР°РЅРЅСЏС…В» РЅР°С‚РёСЃРЅРё В«Р•РєСЃРїРѕСЂС‚ JSONВ» С– Р·Р±РµСЂРµР¶Рё С„Р°Р№Р». РџС–СЃР»СЏ РїРµСЂРµРІСЃС‚Р°РЅРѕРІР»РµРЅРЅСЏ Р°Р±Рѕ Р·РјС–РЅРё С‚РµР»РµС„РѕРЅР° РІРёРєРѕСЂРёСЃС‚Р°Р№ В«Р†РјРїРѕСЂС‚ JSONВ».",
        example:en?"Recommended: export after important workouts or at least once a month.":"Р РµРєРѕРјРµРЅРґР°С†С–СЏ: РµРєСЃРїРѕСЂС‚СѓР№ РїС–СЃР»СЏ РІР°Р¶Р»РёРІРёС… С‚СЂРµРЅСѓРІР°РЅСЊ Р°Р±Рѕ С‰РѕРЅР°Р№РјРµРЅС€Рµ СЂР°Р· РЅР° РјС–СЃСЏС†СЊ.",
        mini:`<div class="miniTitle">${en?"Backup":"Р РµР·РµСЂРІРЅР° РєРѕРїС–СЏ"}</div><div class="miniRow"><div class="miniButton">${en?"Export JSON":"Р•РєСЃРїРѕСЂС‚ JSON"}</div><div class="miniField">${en?"Import JSON":"Р†РјРїРѕСЂС‚ JSON"}</div></div><div class="miniField" style="margin-top:6px">gym-tracker-data.json</div>`
      }
    ];
    if(appShell.mode!=="user") steps.push({
      title:en?"8. Manage clients and calendar":"8. РљРµСЂСѓР№ РєР»С–С”РЅС‚Р°РјРё Р№ РєР°Р»РµРЅРґР°СЂРµРј",
      sub:en?"Your progress is separate from real clients":"РўРІС–Р№ РїСЂРѕРіСЂРµСЃ РІС–РґРѕРєСЂРµРјР»РµРЅРёР№ РІС–Рґ СЂРµР°Р»СЊРЅРёС… РєР»С–С”РЅС‚С–РІ",
      copy:en
        ? "The trainer dashboard starts with no selected profile, so regular tabs stay empty until you explicitly open My progress or a client. My progress is never included in the calendar. Use Week or Month to plan sessions, pause inactive clients, restore them later, and compare active clients over the last 30 days. Calendar records already contain sync metadata for a future Google Calendar connection, but no Google account is connected yet."
        : "РџР°РЅРµР»СЊ С‚СЂРµРЅРµСЂР° РІС–РґРєСЂРёРІР°С”С‚СЊСЃСЏ Р±РµР· РІРёР±СЂР°РЅРѕРіРѕ РїСЂРѕС„С–Р»СЋ, С‚РѕРјСѓ Р·РІРёС‡Р°Р№РЅС– РІРєР»Р°РґРєРё РїРѕСЂРѕР¶РЅС–, РґРѕРєРё С‚Рё СЏРІРЅРѕ РЅРµ РІС–РґРєСЂРёС”С€ В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» Р°Р±Рѕ РєР»С–С”РЅС‚Р°. В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» РЅС–РєРѕР»Рё РЅРµ РІС…РѕРґРёС‚СЊ РґРѕ РєР°Р»РµРЅРґР°СЂСЏ. РџР»Р°РЅСѓР№ Р·Р°РЅСЏС‚С‚СЏ Сѓ СЂРµР¶РёРјС– В«РўРёР¶РґРµРЅСЊВ» Р°Р±Рѕ В«РњС–СЃСЏС†СЊВ», СЃС‚Р°РІ РЅРµР°РєС‚РёРІРЅРёС… РєР»С–С”РЅС‚С–РІ РЅР° РїР°СѓР·Сѓ, РІС–РґРЅРѕРІР»СЋР№ С—С… С– РїРѕСЂС–РІРЅСЋР№ Р°РєС‚РёРІРЅРёС… РєР»С–С”РЅС‚С–РІ Р·Р° РѕСЃС‚Р°РЅРЅС– 30 РґРЅС–РІ. Р—Р°РїРёСЃРё РІР¶Рµ РјР°СЋС‚СЊ СЃР»СѓР¶Р±РѕРІС– РїРѕР»СЏ РґР»СЏ РјР°Р№Р±СѓС‚РЅСЊРѕРіРѕ РїС–РґРєР»СЋС‡РµРЅРЅСЏ Google Calendar, Р°Р»Рµ Google-Р°РєР°СѓРЅС‚ Р·Р°СЂР°Р· С‰Рµ РЅРµ РїС–РґвЂ™С”РґРЅСѓС”С‚СЊСЃСЏ.",
      example:en
        ? "Anna В· June 15 В· 18:00. Deleting the entry asks for confirmation. A paused client disappears from active planning but remains recoverable."
        : "РђРЅРЅР° В· 15 С‡РµСЂРІРЅСЏ В· 18:00. Р’РёРґР°Р»РµРЅРЅСЏ Р·Р°РїРёСЃСѓ РїРѕС‚СЂРµР±СѓС” РїС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ. РљР»С–С”РЅС‚ РЅР° РїР°СѓР·С– Р·РЅРёРєР°С” Р· Р°РєС‚РёРІРЅРѕРіРѕ РїР»Р°РЅСѓРІР°РЅРЅСЏ, Р°Р»Рµ Р№РѕРіРѕ РјРѕР¶РЅР° РІС–РґРЅРѕРІРёС‚Рё.",
      mini:`<div class="miniTitle">${en?"Trainer calendar":"РљР°Р»РµРЅРґР°СЂ С‚СЂРµРЅРµСЂР°"} В· ${en?"Month":"РњС–СЃСЏС†СЊ"}</div><div class="miniRow"><div class="miniField">${en?"Active":"РђРєС‚РёРІРЅС–"}: 4</div><div class="miniField">${en?"Paused":"РќР° РїР°СѓР·С–"}: 1</div></div><div class="miniRow"><div class="miniField">${en?"Anna":"РђРЅРЅР°"} В· 18:00</div><div class="miniField">${en?"Compare":"РџРѕСЂС–РІРЅСЏРЅРЅСЏ"}</div></div>`
    });
    return `
      <div class="guideHero">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#67e8f9">${en?"Quick start":"РЁРІРёРґРєРёР№ СЃС‚Р°СЂС‚"}</div>
        <div style="font-size:22px;font-weight:950;margin-top:5px">${en?"How to use GymTracker Pro":"РЇРє РєРѕСЂРёСЃС‚СѓРІР°С‚РёСЃСЏ GymTracker Pro"}</div>
        <div class="muted" style="margin-top:6px">${en?"Follow the route once, then the app becomes a simple training diary.":"РџСЂРѕР№РґРё С†РµР№ РјР°СЂС€СЂСѓС‚ РѕРґРёРЅ СЂР°Р· вЂ” РґР°Р»С– РґРѕРґР°С‚РѕРє РїСЂР°С†СЋРІР°С‚РёРјРµ СЏРє Р·СЂРѕР·СѓРјС–Р»РёР№ С‰РѕРґРµРЅРЅРёРє С‚СЂРµРЅСѓРІР°РЅСЊ."}</div>
        <div class="guideFlow">${steps.map((_,i)=>`${i?`<span class="guideFlowArrow">вЂє</span>`:""}<span class="guideFlowStep">${i+1}</span>`).join("")}</div>
      </div>
      <div class="guideList">${steps.map((step,i)=>`
        <details class="guideStep" ${i===0?"open":""}>
          <summary><span class="guideNumber">${i+1}</span><span class="guideSummaryText"><strong>${step.title}</strong><span>${step.sub}</span></span><span class="guideChevron">вЊ„</span></summary>
          <div class="guideContent">
            <div class="guideCopy">${step.copy}<div class="guideExample"><strong>${en?"Example":"РџСЂРёРєР»Р°Рґ"}:</strong> ${step.example}</div></div>
            <div class="miniScreen"><div class="miniTop"></div>${step.mini}</div>
          </div>
        </details>`).join("")}</div>`;
  }

  function usageGuideMarkup(){
    const en=state.lang==="en";
    const userSteps=[
      {
        title:en?"Choose User mode":"РћР±РµСЂРё СЂРµР¶РёРј В«РљРѕСЂРёСЃС‚СѓРІР°С‡В»",
        sub:en?"Your personal training space":"РћСЃРѕР±РёСЃС‚РёР№ РїСЂРѕСЃС‚С–СЂ РґР»СЏ С‚СЂРµРЅСѓРІР°РЅСЊ",
        copy:en
          ?"Choose User on the first screen. Your workouts, measurements, goals and records stay in one personal profile. Changing modes does not delete existing information."
          :"РќР° РїРµСЂС€РѕРјСѓ РµРєСЂР°РЅС– РѕР±РµСЂРё В«РљРѕСЂРёСЃС‚СѓРІР°С‡В». РўСЂРµРЅСѓРІР°РЅРЅСЏ, Р·Р°РјС–СЂРё, С†С–Р»С– С‚Р° СЂРµРєРѕСЂРґРё Р·Р±РµСЂС–РіР°СЋС‚СЊСЃСЏ РІ РѕРґРЅРѕРјСѓ РѕСЃРѕР±РёСЃС‚РѕРјСѓ РїСЂРѕС„С–Р»С–. Р—РјС–РЅР° СЂРµР¶РёРјСѓ РЅРµ РІРёРґР°Р»СЏС” РЅР°СЏРІРЅС– РґР°РЅС–.",
        example:en?"Use Settings в†’ Change mode whenever you need to switch.":"РџРµСЂРµРјРёРєР°С‚РёСЃСЏ РјРѕР¶РЅР° С‡РµСЂРµР· В«РќР°Р»Р°С€С‚СѓРІР°РЅРЅСЏВ» в†’ В«Р—РјС–РЅРёС‚Рё СЂРµР¶РёРјВ».",
        mini:`<div class="miniTitle">${en?"Workspace":"Р РµР¶РёРј СЂРѕР±РѕС‚Рё"}</div><div class="miniButton">${en?"User":"РљРѕСЂРёСЃС‚СѓРІР°С‡"}</div>`
      },
      {
        title:en?"Prepare exercises":"РџС–РґРіРѕС‚СѓР№ РІРїСЂР°РІРё",
        sub:en?"Category and tracking type control the fields":"РљР°С‚РµРіРѕСЂС–СЏ С– С‚РёРї РѕР±Р»С–РєСѓ РІРёР·РЅР°С‡Р°СЋС‚СЊ РїРѕР»СЏ",
        copy:en
          ?"Open Exercises, use an existing exercise or tap +. Choose a category or create a new one, then select weight + reps, reps only, duration, or distance + time."
          :"Р’С–РґРєСЂРёР№ В«Р’РїСЂР°РІРёВ», РѕР±РµСЂРё РЅР°СЏРІРЅСѓ РІРїСЂР°РІСѓ Р°Р±Рѕ РЅР°С‚РёСЃРЅРё +. Р’РєР°Р¶Рё РєР°С‚РµРіРѕСЂС–СЋ С‡Рё СЃС‚РІРѕСЂРё РЅРѕРІСѓ, Р° С‚Р°РєРѕР¶ С‚РёРї РѕР±Р»С–РєСѓ: РІР°РіР° + РїРѕРІС‚РѕСЂРё, Р»РёС€Рµ РїРѕРІС‚РѕСЂРё, С‚СЂРёРІР°Р»С–СЃС‚СЊ Р°Р±Рѕ РґРёСЃС‚Р°РЅС†С–СЏ + С‡Р°СЃ.",
        example:en?"Bench press: weight + reps. Pull-ups: reps only. Treadmill: distance + time.":"Р–РёРј Р»РµР¶Р°С‡Рё: РІР°РіР° + РїРѕРІС‚РѕСЂРё. РџС–РґС‚СЏРіСѓРІР°РЅРЅСЏ: Р»РёС€Рµ РїРѕРІС‚РѕСЂРё. Р”РѕСЂС–Р¶РєР°: РґРёСЃС‚Р°РЅС†С–СЏ + С‡Р°СЃ.",
        mini:`<div class="miniTitle">пј‹ ${en?"Exercise":"Р’РїСЂР°РІР°"}</div><div class="miniField">${en?"Pull-ups":"РџС–РґС‚СЏРіСѓРІР°РЅРЅСЏ"}</div><div class="miniRow"><div class="miniField">${en?"Back":"РЎРїРёРЅР°"}</div><div class="miniField">${en?"Reps":"РџРѕРІС‚РѕСЂРё"}</div></div>`
      },
      {
        title:en?"Start or continue a workout":"РџРѕС‡РЅРё Р°Р±Рѕ РїСЂРѕРґРѕРІР¶ С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
        sub:en?"Build today's list and keep unfinished work":"РЎРєР»Р°РґРё РїР»Р°РЅ РґРЅСЏ С– РЅРµ РІС‚СЂР°С‡Р°Р№ РЅРµР·Р°РІРµСЂС€РµРЅРµ",
        copy:en
          ?"Start from Home or Workout, add exercises and enter a title. A workout from the current day can be continued. Saving and clearing require confirmation to prevent accidental taps."
          :"РџРѕС‡РЅРё Р· В«Р“РѕР»РѕРІРЅРѕС—В» Р°Р±Рѕ В«РўСЂРµРЅСѓРІР°РЅРЅСЏВ», РґРѕРґР°Р№ РІРїСЂР°РІРё С‚Р° РЅР°Р·РІСѓ. РўСЂРµРЅСѓРІР°РЅРЅСЏ РїРѕС‚РѕС‡РЅРѕРіРѕ РґРЅСЏ РјРѕР¶РЅР° РїСЂРѕРґРѕРІР¶РёС‚Рё. Р—Р±РµСЂРµР¶РµРЅРЅСЏ Р№ РѕС‡РёС‰РµРЅРЅСЏ РїРѕС‚СЂРµР±СѓСЋС‚СЊ РїС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ, С‰РѕР± СѓРЅРёРєРЅСѓС‚Рё РІРёРїР°РґРєРѕРІРѕРіРѕ РЅР°С‚РёСЃРєР°РЅРЅСЏ.",
        example:en?"Chest day: bench press, incline press, push-ups.":"Р”РµРЅСЊ РіСЂСѓРґРµР№: Р¶РёРј Р»РµР¶Р°С‡Рё, Р¶РёРј РїС–Рґ РєСѓС‚РѕРј, РІС–РґР¶РёРјР°РЅРЅСЏ.",
        mini:`<div class="miniTitle">${en?"Today's workout":"РЎСЊРѕРіРѕРґРЅС–С€РЅС” С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</div><div class="miniField">${en?"Chest day":"Р“СЂСѓРґРё"}</div><div class="miniButton">пј‹ ${en?"Add exercise":"Р”РѕРґР°С‚Рё РІРїСЂР°РІСѓ"}</div>`
      },
      {
        title:en?"Record sets and rest":"Р’РЅРѕСЃСЊ РїС–РґС…РѕРґРё С‚Р° РІС–РґРїРѕС‡РёРЅРѕРє",
        sub:en?"The form adapts to each exercise":"Р¤РѕСЂРјР° РїС–РґР»Р°С€С‚РѕРІСѓС”С‚СЊСЃСЏ РїС–Рґ С‚РёРї РІРїСЂР°РІРё",
        copy:en
          ?"Enter the actual result in the labeled fields. When the required values are filled, the rest timer starts automatically. At zero the app can vibrate on supported devices."
          :"Р’РЅРѕСЃСЊ С„Р°РєС‚РёС‡РЅРёР№ СЂРµР·СѓР»СЊС‚Р°С‚ Сѓ РїС–РґРїРёСЃР°РЅС– РїРѕР»СЏ. РџС–СЃР»СЏ Р·Р°РїРѕРІРЅРµРЅРЅСЏ РїРѕС‚СЂС–Р±РЅРёС… Р·РЅР°С‡РµРЅСЊ С‚Р°Р№РјРµСЂ РІС–РґРїРѕС‡РёРЅРєСѓ Р·Р°РїСѓСЃРєР°С”С‚СЊСЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РЅРѕ. РџС–СЃР»СЏ Р·Р°РІРµСЂС€РµРЅРЅСЏ С‚РµР»РµС„РѕРЅ РјРѕР¶Рµ РІС–Р±СЂСѓРІР°С‚Рё, СЏРєС‰Рѕ РїСЂРёСЃС‚СЂС–Р№ С†Рµ РїС–РґС‚СЂРёРјСѓС”.",
        example:en?"Strength: 80 kg Г— 8. Cardio: 2.5 km in 30 min.":"РЎРёР»РѕРІР°: 80 РєРі Г— 8. РљР°СЂРґС–Рѕ: 2,5 РєРј Р·Р° 30 С…РІ.",
        mini:`<div class="miniTitle">${en?"Set 1":"РџС–РґС…С–Рґ 1"}</div><div class="miniRow"><div class="miniField">80 kg</div><div class="miniField">8 ${en?"reps":"РїРѕРІС‚."}</div></div><div class="miniField">01:30 ${en?"rest":"РІС–РґРїРѕС‡РёРЅРѕРє"}</div>`
      },
      {
        title:en?"Save, edit or delete correctly":"Р—Р±РµСЂС–РіР°Р№, СЂРµРґР°РіСѓР№ С– РІРёРґР°Р»СЏР№ РїСЂР°РІРёР»СЊРЅРѕ",
        sub:en?"All derived results are recalculated":"РЈСЃС– РїРѕС…С–РґРЅС– СЂРµР·СѓР»СЊС‚Р°С‚Рё РїРµСЂРµСЂР°С…РѕРІСѓСЋС‚СЊСЃСЏ",
        copy:en
          ?"After the last set save the workout. Statistics, records, favorites and recommendations update from saved history. If a workout is deleted, its records and traces are removed as well."
          :"РџС–СЃР»СЏ РѕСЃС‚Р°РЅРЅСЊРѕРіРѕ РїС–РґС…РѕРґСѓ Р·Р±РµСЂРµР¶Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ. РЎС‚Р°С‚РёСЃС‚РёРєР°, СЂРµРєРѕСЂРґРё, СѓР»СЋР±Р»РµРЅС– РІРїСЂР°РІРё Р№ СЂРµРєРѕРјРµРЅРґР°С†С–С— РѕРЅРѕРІР»СЋСЋС‚СЊСЃСЏ Р·С– Р·Р±РµСЂРµР¶РµРЅРѕС— С–СЃС‚РѕСЂС–С—. РЇРєС‰Рѕ С‚СЂРµРЅСѓРІР°РЅРЅСЏ РІРёРґР°Р»РёС‚Рё, Р№РѕРіРѕ СЂРµРєРѕСЂРґРё С‚Р° СЃР»С–РґРё С‚Р°РєРѕР¶ РїСЂРёР±РёСЂР°СЋС‚СЊСЃСЏ.",
        example:en?"A deleted test workout no longer affects the maximum weight.":"Р’РёРґР°Р»РµРЅРµ С‚РµСЃС‚РѕРІРµ С‚СЂРµРЅСѓРІР°РЅРЅСЏ Р±С–Р»СЊС€Рµ РЅРµ РІРїР»РёРІР°С” РЅР° РјР°РєСЃРёРјР°Р»СЊРЅСѓ РІР°РіСѓ.",
        mini:`<div class="miniButton">${en?"Save workout":"Р—Р±РµСЂРµРіС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ"}</div><div class="miniRow"><div class="miniField">${en?"Edit":"Р РµРґР°РіСѓРІР°С‚Рё"}</div><div class="miniField">${en?"Delete":"Р’РёРґР°Р»РёС‚Рё"}</div></div>`
      },
      {
        title:en?"Set goals and use recommendations":"РџРѕСЃС‚Р°РІ С†С–Р»С– С‚Р° РєРѕСЂРёСЃС‚СѓР№СЃСЏ СЂРµРєРѕРјРµРЅРґР°С†С–СЏРјРё",
        sub:en?"Advice learns from history and workout rotation":"РџРѕСЂР°РґРё РІСЂР°С…РѕРІСѓСЋС‚СЊ С–СЃС‚РѕСЂС–СЋ Р№ С‡РµСЂРіСѓРІР°РЅРЅСЏ РїСЂРѕРіСЂР°РјРё",
        copy:en
          ?"Create strength, reps, time, distance, weight or body goals. After at least 5 saved sessions, recommendations appear in Workout above the current session, so they are available right before training."
          :"РЎС‚РІРѕСЂРё С†С–Р»СЊ РґР»СЏ СЃРёР»Рё, РїРѕРІС‚РѕСЂС–РІ, С‡Р°СЃСѓ, РґРёСЃС‚Р°РЅС†С–С—, РІР°РіРё Р°Р±Рѕ Р·Р°РјС–СЂС–РІ С‚С–Р»Р°. РџС–СЃР»СЏ С‰РѕРЅР°Р№РјРµРЅС€Рµ 5 Р·Р±РµСЂРµР¶РµРЅРёС… Р·Р°РЅСЏС‚СЊ СЂРµРєРѕРјРµРЅРґР°С†С–С— РїРѕРєР°Р·СѓСЋС‚СЊСЃСЏ РІ СЂРѕР·РґС–Р»С– В«РўСЂРµРЅСѓРІР°РЅРЅСЏВ» РЅР°Рґ РїРѕС‚РѕС‡РЅРёРј Р·Р°РЅСЏС‚С‚СЏРј, С‰РѕР± РІРѕРЅРё Р±СѓР»Рё РїС–Рґ СЂСѓРєРѕСЋ РїРµСЂРµРґ СЂРѕР±РѕС‚РѕСЋ.",
        example:en?"Bench 105 kg and body weight 90 kg may change priorities without replacing your program.":"Р–РёРј 105 РєРі С– РІР°РіР° С‚С–Р»Р° 90 РєРі РјРѕР¶СѓС‚СЊ Р·РјС–РЅСЋРІР°С‚Рё РїСЂС–РѕСЂРёС‚РµС‚Рё, РЅРµ РїС–РґРјС–РЅСЏСЋС‡Рё С‚РІРѕСЋ РїСЂРѕРіСЂР°РјСѓ.",
        mini:`<div class="miniTitle">${en?"Goal":"Р¦С–Р»СЊ"} В· ${en?"Bench press":"Р–РёРј Р»РµР¶Р°С‡Рё"}</div><div style="font-weight:950">92 в†’ 105 kg</div><div class="miniBar"><span></span></div>`
      },
      {
        title:en?"Read Home, Statistics and Body":"РђРЅР°Р»С–Р·СѓР№ РіРѕР»РѕРІРЅСѓ, СЃС‚Р°С‚РёСЃС‚РёРєСѓ Р№ С‚С–Р»Рѕ",
        sub:en?"Choose a period and open exercise details":"РћР±РёСЂР°Р№ РїРµСЂС–РѕРґ С– РІС–РґРєСЂРёРІР°Р№ РґРµС‚Р°Р»С– РІРїСЂР°РІ",
        copy:en
          ?"Home shows goals, a weekly/monthly/yearly overview, favorites and recent sessions. Tap the workout count to jump to the workout list. Tap a favorite or a record to open that exercise's statistics. Body stores partial measurements in a compact form."
          :"Р“РѕР»РѕРІРЅР° РїРѕРєР°Р·СѓС” С†С–Р»С–, РѕРіР»СЏРґ Р·Р° С‚РёР¶РґРµРЅСЊ/РјС–СЃСЏС†СЊ/СЂС–Рє, СѓР»СЋР±Р»РµРЅС– РІРїСЂР°РІРё Р№ РѕСЃС‚Р°РЅРЅС– Р·Р°РЅСЏС‚С‚СЏ. РќР°С‚РёСЃРЅРё РєС–Р»СЊРєС–СЃС‚СЊ С‚СЂРµРЅСѓРІР°РЅСЊ, С‰РѕР± РїРµСЂРµР№С‚Рё РґРѕ СЃРїРёСЃРєСѓ. РќР°С‚РёСЃРЅРё СѓР»СЋР±Р»РµРЅСѓ РІРїСЂР°РІСѓ Р°Р±Рѕ СЂРµРєРѕСЂРґ, С‰РѕР± РІС–РґРєСЂРёС‚Рё СЃС‚Р°С‚РёСЃС‚РёРєСѓ С†С–С”С— РІРїСЂР°РІРё. В«РўС–Р»РѕВ» Р·Р±РµСЂС–РіР°С” С‡Р°СЃС‚РєРѕРІС– Р·Р°РјС–СЂРё РІ РєРѕРјРїР°РєС‚РЅС–Р№ С„РѕСЂРјС–.",
        example:en?"Enter only weight and waist today; empty body fields are allowed.":"РЎСЊРѕРіРѕРґРЅС– РјРѕР¶РЅР° РІРЅРµСЃС‚Рё Р»РёС€Рµ РІР°РіСѓ Р№ С‚Р°Р»С–СЋ; РїРѕСЂРѕР¶РЅС– РїРѕР»СЏ РґРѕР·РІРѕР»РµРЅС–.",
        mini:`<div class="miniRow"><div class="miniStat">${en?"Month":"РњС–СЃСЏС†СЊ"}<strong>12</strong></div><div class="miniStat">${en?"Calories":"РљР°Р»РѕСЂС–С—"}<strong>в‰€420</strong></div></div>`
      },
      {
        title:en?"Plan future workouts and templates":"РџР»Р°РЅСѓР№ РјР°Р№Р±СѓС‚РЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ С– С€Р°Р±Р»РѕРЅРё",
        sub:en?"Prepare Tuesday or Thursday before the day comes":"Р—Р°РіРѕС‚СѓР№ РІС–РІС‚РѕСЂРѕРє С‡Рё С‡РµС‚РІРµСЂ С‰Рµ РґРѕ С‚СЂРµРЅСѓРІР°РЅРЅСЏ",
        copy:en
          ?"In Workout use Planned workouts to create a future workout. Pick a date and time, name it, choose exercises by category or load a saved template. On the planned day tap Start, adjust the title or exercises if needed, enter real sets, then save. Statistics update only after saving the actual workout."
          :"У розділі «Тренування» використовуй «Заплановані тренування»: обери дату й час, назву, вправи по категоріях або готовий шаблон. У потрібний день натисни «Почати», за потреби зміни назву чи вправи, внеси фактичні підходи й збережи. У статистику потрапляє тільки реально завершене тренування.",
        example:en?"Sunday: plan Push for Tuesday and Pull for Thursday. Thursday: open the plan and start with exercises already loaded.":"РќРµРґС–Р»СЏ: Р·Р°РїР»Р°РЅСѓР№ В«Р–РёРјВ» РЅР° РІС–РІС‚РѕСЂРѕРє С– В«РўСЏРіР°В» РЅР° С‡РµС‚РІРµСЂ. РЈ С‡РµС‚РІРµСЂ РІС–РґРєСЂРёР№ РїР»Р°РЅ С– РїРѕС‡РЅРё РІР¶Рµ Р· РЅР°Р±СЂР°РЅРёРјРё РІРїСЂР°РІР°РјРё.",
        mini:`<div class="miniTitle">${en?"Planner":"РџР»Р°РЅСѓРІР°Р»СЊРЅРёРє"} В· ${en?"Templates":"РЁР°Р±Р»РѕРЅРё"}</div><div class="miniRow"><div class="miniField">${en?"Tue":"Р’С‚"} В· ${en?"Push":"Р–РёРј"}</div><div class="miniField">${en?"Thu":"Р§С‚"} В· ${en?"Pull":"РўСЏРіР°"}</div></div><div class="miniButton">${en?"Start planned workout":"РџРѕС‡Р°С‚Рё РїР»Р°РЅ"}</div>`
      },
      {
        title:en?"Back up and restore data":"РЎС‚РІРѕСЂСЋР№ СЂРµР·РµСЂРІРЅСѓ РєРѕРїС–СЋ С‚Р° РІС–РґРЅРѕРІР»СЋР№ РґР°РЅС–",
        sub:en?"JSON keeps your local data portable":"JSON РґРѕР·РІРѕР»СЏС” РїРµСЂРµРЅРµСЃС‚Рё Р»РѕРєР°Р»СЊРЅС– РґР°РЅС–",
        copy:en
          ?"Data is stored on this device. Use Export all for a complete backup, or Export active profile when you need only one client or My progress. Merge into active profile adds new workouts, body records, goals and exercises without replacing existing history."
          :"Р”Р°РЅС– Р·Р±РµСЂС–РіР°СЋС‚СЊСЃСЏ РЅР° С†СЊРѕРјСѓ РїСЂРёСЃС‚СЂРѕС—. Р’РёРєРѕСЂРёСЃС‚РѕРІСѓР№ В«Р•РєСЃРїРѕСЂС‚ РІСЃСЊРѕРіРѕВ» РґР»СЏ РїРѕРІРЅРѕС— РєРѕРїС–С— Р°Р±Рѕ В«Р•РєСЃРїРѕСЂС‚ Р°РєС‚РёРІРЅРѕРіРѕ РїСЂРѕС„С–Р»СЋВ», РєРѕР»Рё РїРѕС‚СЂС–Р±РµРЅ Р»РёС€Рµ РѕРґРёРЅ РєР»С–С”РЅС‚ С‡Рё В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ». В«Р”РѕРїРѕРІРЅРёС‚Рё Р°РєС‚РёРІРЅРёР№ РїСЂРѕС„С–Р»СЊВ» РґРѕРґР°С” РЅРѕРІС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ, Р·Р°РјС–СЂРё, С†С–Р»С– С‚Р° РІРїСЂР°РІРё Р±РµР· Р·Р°С‚РёСЂР°РЅРЅСЏ РЅР°СЏРІРЅРѕС— С–СЃС‚РѕСЂС–С—.",
        example:en?"A client can receive their own JSON file, train alone, then send it back so the trainer merges the new progress.":"РљР»С–С”РЅС‚ РјРѕР¶Рµ РѕС‚СЂРёРјР°С‚Рё СЃРІС–Р№ JSON, Р·Р°Р№РјР°С‚РёСЃСЊ СЃР°РјРѕСЃС‚С–Р№РЅРѕ, Р° РїРѕС‚С–Рј РЅР°РґС–СЃР»Р°С‚Рё С„Р°Р№Р» РЅР°Р·Р°Рґ, С‰РѕР± С‚СЂРµРЅРµСЂ РґРѕРїРѕРІРЅРёРІ РЅРѕРІРёР№ РїСЂРѕРіСЂРµСЃ.",
        mini:`<div class="miniTitle">${en?"Backup":"Р РµР·РµСЂРІРЅР° РєРѕРїС–СЏ"}</div><div class="miniRow"><div class="miniButton">${en?"Export profile":"Р•РєСЃРїРѕСЂС‚ РїСЂРѕС„С–Р»СЋ"}</div><div class="miniField">${en?"Merge":"Р”РѕРїРѕРІРЅРёС‚Рё"}</div></div>`
      }
    ];
    const trainerSteps=[
      {
        title:en?"Choose Trainer mode":"РћР±РµСЂРё СЂРµР¶РёРј В«РўСЂРµРЅРµСЂВ»",
        sub:en?"The dashboard opens without selecting anyone":"РџР°РЅРµР»СЊ РІС–РґРєСЂРёРІР°С”С‚СЊСЃСЏ Р±РµР· РІРёР±СЂР°РЅРѕРіРѕ РїСЂРѕС„С–Р»СЋ",
        copy:en
          ?"Trainer mode manages several independent people. Until you explicitly select My progress or a client, the regular tabs intentionally show no personal data."
          :"Р РµР¶РёРј С‚СЂРµРЅРµСЂР° РІРµРґРµ РєС–Р»СЊРєРѕС… РЅРµР·Р°Р»РµР¶РЅРёС… Р»СЋРґРµР№. РџРѕРєРё С‚Рё СЏРІРЅРѕ РЅРµ РѕР±РµСЂРµС€ В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» Р°Р±Рѕ РєР»С–С”РЅС‚Р°, Р·РІРёС‡Р°Р№РЅС– РІРєР»Р°РґРєРё РЅР°РІРјРёСЃРЅРѕ РЅРµ РїРѕРєР°Р·СѓСЋС‚СЊ С‡РёС—СЃСЊ РїРµСЂСЃРѕРЅР°Р»СЊРЅС– РґР°РЅС–.",
        example:en?"This prevents accidentally entering a workout for the wrong person.":"Р¦Рµ Р·Р°С…РёС‰Р°С” РІС–Рґ РІРёРїР°РґРєРѕРІРѕРіРѕ РІРЅРµСЃРµРЅРЅСЏ С‚СЂРµРЅСѓРІР°РЅРЅСЏ РЅРµ С‚С–Р№ Р»СЋРґРёРЅС–.",
        mini:`<div class="miniTitle">${en?"Trainer dashboard":"РџР°РЅРµР»СЊ С‚СЂРµРЅРµСЂР°"}</div><div class="miniField">${en?"No profile selected":"РџСЂРѕС„С–Р»СЊ РЅРµ РІРёР±СЂР°РЅРѕ"}</div>`
      },
      {
        title:en?"Use My progress":"Р’РёРєРѕСЂРёСЃС‚РѕРІСѓР№ В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ»",
        sub:en?"The trainer's own diary is separate":"РћСЃРѕР±РёСЃС‚РёР№ С‰РѕРґРµРЅРЅРёРє С‚СЂРµРЅРµСЂР° РІС–РґРѕРєСЂРµРјР»РµРЅРёР№",
        copy:en
          ?"Open My progress when you want to record your own workouts. It has the complete user workflow but is not treated as a client and never appears in the appointment calendar."
          :"Р’С–РґРєСЂРёР№ В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ», РєРѕР»Рё С…РѕС‡РµС€ РІРµСЃС‚Рё РІР»Р°СЃРЅС– С‚СЂРµРЅСѓРІР°РЅРЅСЏ. РўСѓС‚ РґРѕСЃС‚СѓРїРЅРёР№ РІРµСЃСЊ Р·РІРёС‡Р°Р№РЅРёР№ С„СѓРЅРєС†С–РѕРЅР°Р» РєРѕСЂРёСЃС‚СѓРІР°С‡Р°, Р°Р»Рµ С†РµР№ РїСЂРѕС„С–Р»СЊ РЅРµ РІРІР°Р¶Р°С”С‚СЊСЃСЏ РєР»С–С”РЅС‚РѕРј С– РЅРµ РїРѕС‚СЂР°РїР»СЏС” РґРѕ РєР°Р»РµРЅРґР°СЂСЏ Р·Р°РїРёСЃС–РІ.",
        example:en?"Your bench session stays separate from every client's history.":"РўРІРѕС” С‚СЂРµРЅСѓРІР°РЅРЅСЏ Р¶РёРјСѓ РЅРµ Р·РјС–С€СѓС”С‚СЊСЃСЏ Р· С–СЃС‚РѕСЂС–С”СЋ РєР»С–С”РЅС‚С–РІ.",
        mini:`<div class="miniButton">${en?"My progress":"РњС–Р№ РїСЂРѕРіСЂРµСЃ"}</div><div class="miniField">${en?"Personal data only":"Р›РёС€Рµ РѕСЃРѕР±РёСЃС‚С– РґР°РЅС–"}</div>`
      },
      {
        title:en?"Add and open a client":"Р”РѕРґР°Р№ С– РІС–РґРєСЂРёР№ РєР»С–С”РЅС‚Р°",
        sub:en?"Every client has independent data":"РљРѕР¶РµРЅ РєР»С–С”РЅС‚ РјР°С” РЅРµР·Р°Р»РµР¶РЅС– РґР°РЅС–",
        copy:en
          ?"Create a client by name, then tap the client card to open the profile. Exercises, workouts, goals, body measurements, records and recommendations are stored separately for that client."
          :"РЎС‚РІРѕСЂРё РєР»С–С”РЅС‚Р° Р·Р° С–РјвЂ™СЏРј, Р° РїРѕС‚С–Рј РЅР°С‚РёСЃРЅРё Р№РѕРіРѕ РєР°СЂС‚РєСѓ, С‰РѕР± РІС–РґРєСЂРёС‚Рё РїСЂРѕС„С–Р»СЊ. Р’РїСЂР°РІРё, С‚СЂРµРЅСѓРІР°РЅРЅСЏ, С†С–Р»С–, Р·Р°РјС–СЂРё С‚С–Р»Р°, СЂРµРєРѕСЂРґРё Р№ СЂРµРєРѕРјРµРЅРґР°С†С–С— Р·Р±РµСЂС–РіР°СЋС‚СЊСЃСЏ РѕРєСЂРµРјРѕ РґР»СЏ С†СЊРѕРіРѕ РєР»С–С”РЅС‚Р°.",
        example:en?"Anna and Viktor can have different exercises, goals and rest settings.":"РђРЅРЅР° Р№ Р’С–РєС‚РѕСЂ РјРѕР¶СѓС‚СЊ РјР°С‚Рё СЂС–Р·РЅС– РІРїСЂР°РІРё, С†С–Р»С– С‚Р° РЅР°Р»Р°С€С‚СѓРІР°РЅРЅСЏ РІС–РґРїРѕС‡РёРЅРєСѓ.",
        mini:`<div class="miniTitle">пј‹ ${en?"New client":"РќРѕРІРёР№ РєР»С–С”РЅС‚"}</div><div class="miniField">${en?"Anna":"РђРЅРЅР°"}</div><div class="miniButton">${en?"Open profile":"Р’С–РґРєСЂРёС‚Рё РїСЂРѕС„С–Р»СЊ"}</div>`
      },
      {
        title:en?"Work inside the selected profile":"РџСЂР°С†СЋР№ Сѓ РІРёР±СЂР°РЅРѕРјСѓ РїСЂРѕС„С–Р»С–",
        sub:en?"The standard tabs now belong to that person":"Р—РІРёС‡Р°Р№РЅС– РІРєР»Р°РґРєРё С‚РµРїРµСЂ РЅР°Р»РµР¶Р°С‚СЊ С†С–Р№ Р»СЋРґРёРЅС–",
        copy:en
          ?"After choosing a profile, use Home, Workout, Exercises, Statistics, Body and Records exactly as in User mode. The profile button in the header returns to the trainer dashboard and clears the selection."
          :"РџС–СЃР»СЏ РІРёР±РѕСЂСѓ РїСЂРѕС„С–Р»СЋ РІРёРєРѕСЂРёСЃС‚РѕРІСѓР№ В«Р“РѕР»РѕРІРЅСѓВ», В«РўСЂРµРЅСѓРІР°РЅРЅСЏВ», В«Р’РїСЂР°РІРёВ», В«РЎС‚Р°С‚РёСЃС‚РёРєСѓВ», В«РўС–Р»РѕВ» Р№ В«Р РµРєРѕСЂРґРёВ» С‚Р°Рє СЃР°РјРѕ, СЏРє Сѓ СЂРµР¶РёРјС– РєРѕСЂРёСЃС‚СѓРІР°С‡Р°. РљРЅРѕРїРєР° РїСЂРѕС„С–Р»СЋ Сѓ С€Р°РїС†С– РїРѕРІРµСЂС‚Р°С” РґРѕ РїР°РЅРµР»С– С‚СЂРµРЅРµСЂР° С‚Р° СЃРєРёРґР°С” РІРёР±С–СЂ.",
        example:en?"Always check the profile name before entering a set.":"РџРµСЂРµРґ РІРЅРµСЃРµРЅРЅСЏРј РїС–РґС…РѕРґСѓ РїРµСЂРµРІС–СЂ С–РјвЂ™СЏ Р°РєС‚РёРІРЅРѕРіРѕ РїСЂРѕС„С–Р»СЋ.",
        mini:`<div class="miniTitle">в—‰ ${en?"Anna":"РђРЅРЅР°"}</div><div class="miniRow"><div class="miniField">${en?"Workout":"РўСЂРµРЅСѓРІР°РЅРЅСЏ"}</div><div class="miniField">${en?"Stats":"РЎС‚Р°С‚РёСЃС‚РёРєР°"}</div></div>`
      },
      {
        title:en?"Plan appointments in the calendar":"РџР»Р°РЅСѓР№ Р·Р°РїРёСЃРё РІ РєР°Р»РµРЅРґР°СЂС–",
        sub:en?"Week and month views show the schedule":"РўРёР¶РґРµРЅСЊ С– РјС–СЃСЏС†СЊ РїРѕРєР°Р·СѓСЋС‚СЊ СЂРѕР·РєР»Р°Рґ",
        copy:en
          ?"Use Week for the near schedule and Month for broader planning. Tap a date to first see what is already planned for that day, then use Add session below the list to choose an active client, time and optional note."
          :"Р’РёРєРѕСЂРёСЃС‚РѕРІСѓР№ В«РўРёР¶РґРµРЅСЊВ» РґР»СЏ РЅР°Р№Р±Р»РёР¶С‡РѕРіРѕ СЂРѕР·РєР»Р°РґСѓ, Р° В«РњС–СЃСЏС†СЊВ» вЂ” РґР»СЏ РґРѕРІС€РѕРіРѕ РїР»Р°РЅСѓРІР°РЅРЅСЏ. РќР°С‚РёСЃРЅРё РґР°С‚Сѓ, С‰РѕР± СЃРїРµСЂС€Сѓ РїРѕР±Р°С‡РёС‚Рё РІСЃС– Р·Р°РїРёСЃРё С†СЊРѕРіРѕ РґРЅСЏ, Р° РЅРёР¶С‡Рµ С‡РµСЂРµР· В«Р”РѕРґР°С‚Рё Р·Р°РїРёСЃВ» РѕР±РµСЂРё Р°РєС‚РёРІРЅРѕРіРѕ РєР»С–С”РЅС‚Р°, С‡Р°СЃ С– РїСЂРёРјС–С‚РєСѓ.",
        example:en?"Anna В· June 15 В· 18:00 В· Leg day.":"РђРЅРЅР° В· 15 С‡РµСЂРІРЅСЏ В· 18:00 В· РќРѕРіРё.",
        mini:`<div class="miniTitle">${en?"Calendar":"РљР°Р»РµРЅРґР°СЂ"} В· ${en?"Month":"РњС–СЃСЏС†СЊ"}</div><div class="miniField">15 В· ${en?"Anna":"РђРЅРЅР°"} В· 18:00</div>`
      },
      {
        title:en?"Manage appointments safely":"РљРµСЂСѓР№ Р·Р°РїРёСЃР°РјРё Р±РµР·РїРµС‡РЅРѕ",
        sub:en?"Reminders work locally while the app is active":"РќР°РіР°РґСѓРІР°РЅРЅСЏ РїСЂР°С†СЋСЋС‚СЊ Р»РѕРєР°Р»СЊРЅРѕ, РїРѕРєРё Р·Р°СЃС‚РѕСЃСѓРЅРѕРє Р°РєС‚РёРІРЅРёР№",
        copy:en
          ?"Planned sessions are shown in the trainer calendar. Deleting an appointment always asks for confirmation. Local notifications depend on browser permission and the app being able to run."
          :"Р—Р°РїР»Р°РЅРѕРІР°РЅС– Р·Р°РЅСЏС‚С‚СЏ РІС–РґРѕР±СЂР°Р¶Р°СЋС‚СЊСЃСЏ РІ РєР°Р»РµРЅРґР°СЂС– С‚СЂРµРЅРµСЂР°. Р’РёРґР°Р»РµРЅРЅСЏ Р·Р°РїРёСЃСѓ Р·Р°РІР¶РґРё РїРѕС‚СЂРµР±СѓС” РїС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ. Р›РѕРєР°Р»СЊРЅС– СЃРїРѕРІС–С‰РµРЅРЅСЏ Р·Р°Р»РµР¶Р°С‚СЊ РІС–Рґ РґРѕР·РІРѕР»Сѓ Р±СЂР°СѓР·РµСЂР° С‚Р° РјРѕР¶Р»РёРІРѕСЃС‚С– Р·Р°СЃС‚РѕСЃСѓРЅРєСѓ РїСЂР°С†СЋРІР°С‚Рё.",
        example:en?"Confirm deletion only after checking the client, date and time.":"РџС–РґС‚РІРµСЂРґР¶СѓР№ РІРёРґР°Р»РµРЅРЅСЏ Р»РёС€Рµ РїС–СЃР»СЏ РїРµСЂРµРІС–СЂРєРё РєР»С–С”РЅС‚Р°, РґР°С‚Рё Р№ С‡Р°СЃСѓ.",
        mini:`<div class="miniTitle">${en?"Appointment":"Р—Р°РїРёСЃ"}</div><div class="miniField">${en?"Delete this appointment?":"Р’РёРґР°Р»РёС‚Рё С†РµР№ Р·Р°РїРёСЃ?"}</div><div class="miniButton">${en?"Confirm":"РџС–РґС‚РІРµСЂРґРёС‚Рё"}</div>`
      },
      {
        title:en?"Pause and restore clients":"РЎС‚Р°РІ РєР»С–С”РЅС‚С–РІ РЅР° РїР°СѓР·Сѓ С‚Р° РІС–РґРЅРѕРІР»СЋР№",
        sub:en?"Data remains stored during a break":"Р”Р°РЅС– Р·Р±РµСЂС–РіР°СЋС‚СЊСЃСЏ РїС–Рґ С‡Р°СЃ РїРµСЂРµСЂРІРё",
        copy:en
          ?"Put an inactive client on pause. The client disappears from the active list, new planning and comparison, but the profile is not deleted. Restore it later from the Paused section."
          :"РџРѕСЃС‚Р°РІ РЅРµР°РєС‚РёРІРЅРѕРіРѕ РєР»С–С”РЅС‚Р° РЅР° РїР°СѓР·Сѓ. Р’С–РЅ Р·РЅРёРєРЅРµ Р· Р°РєС‚РёРІРЅРѕРіРѕ СЃРїРёСЃРєСѓ, РЅРѕРІРѕРіРѕ РїР»Р°РЅСѓРІР°РЅРЅСЏ Р№ РїРѕСЂС–РІРЅСЏРЅРЅСЏ, Р°Р»Рµ РїСЂРѕС„С–Р»СЊ РЅРµ РІРёРґР°Р»СЏС”С‚СЊСЃСЏ. РџС–Р·РЅС–С€Рµ РІС–РґРЅРѕРІРё Р№РѕРіРѕ РІ СЂРѕР·РґС–Р»С– В«РќР° РїР°СѓР·С–В».",
        example:en?"A one-month break does not erase workout history.":"РњС–СЃСЏС‡РЅР° РїРµСЂРµСЂРІР° РЅРµ СЃС‚РёСЂР°С” С–СЃС‚РѕСЂС–СЋ С‚СЂРµРЅСѓРІР°РЅСЊ.",
        mini:`<div class="miniRow"><div class="miniField">${en?"Active":"РђРєС‚РёРІРЅС–"} В· 4</div><div class="miniField">${en?"Paused":"РќР° РїР°СѓР·С–"} В· 1</div></div><div class="miniButton">${en?"Restore":"Р’С–РґРЅРѕРІРёС‚Рё"}</div>`
      },
      {
        title:en?"Compare active clients":"РџРѕСЂС–РІРЅСЋР№ Р°РєС‚РёРІРЅРёС… РєР»С–С”РЅС‚С–РІ",
        sub:en?"See the last 30 days in one place":"РџРµСЂРµРіР»СЏРґР°Р№ РѕСЃС‚Р°РЅРЅС– 30 РґРЅС–РІ РІ РѕРґРЅРѕРјСѓ РјС–СЃС†С–",
        copy:en
          ?"The comparison block summarizes sessions, sets, volume and goal progress for active clients. Use it as context; different programs and exercise types are not a direct competition."
          :"Р‘Р»РѕРє РїРѕСЂС–РІРЅСЏРЅРЅСЏ РїС–РґСЃСѓРјРѕРІСѓС” Р·Р°РЅСЏС‚С‚СЏ, РїС–РґС…РѕРґРё, РѕР±СЃСЏРі С– РїСЂРѕРіСЂРµСЃ С†С–Р»РµР№ Р°РєС‚РёРІРЅРёС… РєР»С–С”РЅС‚С–РІ. Р’РёРєРѕСЂРёСЃС‚РѕРІСѓР№ С†Рµ СЏРє РєРѕРЅС‚РµРєСЃС‚: СЂС–Р·РЅС– РїСЂРѕРіСЂР°РјРё Р№ С‚РёРїРё РІРїСЂР°РІ РЅРµ С” РїСЂСЏРјРёРј Р·РјР°РіР°РЅРЅСЏРј.",
        example:en?"Compare attendance consistency before comparing training volume.":"РЎРїРѕС‡Р°С‚РєСѓ РїРѕСЂС–РІРЅСЋР№ СЂРµРіСѓР»СЏСЂРЅС–СЃС‚СЊ РІС–РґРІС–РґСѓРІР°РЅСЊ, Р° РІР¶Рµ РїРѕС‚С–Рј РѕР±СЃСЏРі СЂРѕР±РѕС‚Рё.",
        mini:`<div class="miniTitle">${en?"Last 30 days":"РћСЃС‚Р°РЅРЅС– 30 РґРЅС–РІ"}</div><div class="miniRow"><div class="miniStat">${en?"Anna":"РђРЅРЅР°"}<strong>8</strong></div><div class="miniStat">${en?"Viktor":"Р’С–РєС‚РѕСЂ"}<strong>6</strong></div></div>`
      },
      {
        title:en?"Export the whole trainer workspace":"Р•РєСЃРїРѕСЂС‚СѓР№ СѓРІРµСЃСЊ РїСЂРѕСЃС‚С–СЂ С‚СЂРµРЅРµСЂР°",
        sub:en?"Version 4 includes profiles and calendar":"Р’РµСЂСЃС–СЏ 4 РјС–СЃС‚РёС‚СЊ РїСЂРѕС„С–Р»С– С‚Р° РєР°Р»РµРЅРґР°СЂ",
        copy:en
          ?"Export all includes mode, My progress, all clients and appointments. Export active profile creates a separate file for only the selected client or My progress. Merge into active profile is for returning clients: it compares the file with existing data and adds what is missing."
          :"В«Р•РєСЃРїРѕСЂС‚ РІСЃСЊРѕРіРѕВ» РјС–СЃС‚РёС‚СЊ СЂРµР¶РёРј, В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ», СѓСЃС–С… РєР»С–С”РЅС‚С–РІ С– Р·Р°РїРёСЃРё РєР°Р»РµРЅРґР°СЂСЏ. В«Р•РєСЃРїРѕСЂС‚ Р°РєС‚РёРІРЅРѕРіРѕ РїСЂРѕС„С–Р»СЋВ» СЃС‚РІРѕСЂСЋС” РѕРєСЂРµРјРёР№ С„Р°Р№Р» Р»РёС€Рµ РґР»СЏ РІРёР±СЂР°РЅРѕРіРѕ РєР»С–С”РЅС‚Р° Р°Р±Рѕ В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ». В«Р”РѕРїРѕРІРЅРёС‚Рё Р°РєС‚РёРІРЅРёР№ РїСЂРѕС„С–Р»СЊВ» РїРѕС‚СЂС–Р±РЅРµ РґР»СЏ РєР»С–С”РЅС‚С–РІ, СЏРєС– РїРѕРІРµСЂС‚Р°СЋС‚СЊСЃСЏ: С„Р°Р№Р» РїРѕСЂС–РІРЅСЋС”С‚СЊСЃСЏ Р· РЅР°СЏРІРЅРёРјРё РґР°РЅРёРјРё Р№ РґРѕРґР°С”С‚СЊСЃСЏ С‚Рµ, С‡РѕРіРѕ Р±СЂР°РєСѓС”.",
        example:en?"If one of 20 clients leaves, export only that client. If they return later with their own JSON, open their profile and merge it back.":"РЇРєС‰Рѕ Р· 20 РєР»С–С”РЅС‚С–РІ РѕРґРёРЅ Р·Р°РІРµСЂС€СѓС”, РµРєСЃРїРѕСЂС‚СѓР№ Р»РёС€Рµ Р№РѕРіРѕ. РЇРєС‰Рѕ РІС–РЅ Р·РіРѕРґРѕРј РїРѕРІРµСЂС‚Р°С”С‚СЊСЃСЏ Р·С– СЃРІРѕС—Рј JSON, РІС–РґРєСЂРёР№ Р№РѕРіРѕ РїСЂРѕС„С–Р»СЊ С– РґРѕРїРѕРІРЅРё РґР°РЅС–.",
        mini:`<div class="miniTitle">${en?"Trainer backup":"РљРѕРїС–СЏ С‚СЂРµРЅРµСЂР°"}</div><div class="miniRow"><div class="miniField">${en?"All clients":"РЈСЃС– РєР»С–С”РЅС‚Рё"}</div><div class="miniField">${en?"One client":"РћРґРёРЅ РєР»С–С”РЅС‚"}</div></div>`
      },
      {
        title:en?"Google Calendar status":"РЎС‚Р°РЅ Google Calendar",
        sub:en?"Prepared for future sync, not connected yet":"РџС–РґРіРѕС‚РѕРІР»РµРЅРѕ РґРѕ РјР°Р№Р±СѓС‚РЅСЊРѕС— СЃРёРЅС…СЂРѕРЅС–Р·Р°С†С–С—, Р°Р»Рµ С‰Рµ РЅРµ РїС–РґРєР»СЋС‡РµРЅРѕ",
        copy:en
          ?"Appointments already have technical sync metadata and an outbox for a future integration. No Google account authorization or live two-way synchronization is active in this version."
          :"Р—Р°РїРёСЃРё РІР¶Рµ РјР°СЋС‚СЊ С‚РµС…РЅС–С‡РЅС– РїРѕР»СЏ СЃРёРЅС…СЂРѕРЅС–Р·Р°С†С–С— С‚Р° С‡РµСЂРіСѓ РґР»СЏ РјР°Р№Р±СѓС‚РЅСЊРѕС— С–РЅС‚РµРіСЂР°С†С–С—. РЈ С†С–Р№ РІРµСЂСЃС–С— С‰Рµ РЅРµРјР°С” Р°РІС‚РѕСЂРёР·Р°С†С–С— Google-Р°РєР°СѓРЅС‚Р° С‡Рё Р¶РёРІРѕС— РґРІРѕСЃС‚РѕСЂРѕРЅРЅСЊРѕС— СЃРёРЅС…СЂРѕРЅС–Р·Р°С†С–С—.",
        example:en?"For now, the in-app calendar is the source of truth.":"РќР°СЂР°Р·С– РѕСЃРЅРѕРІРЅРёРј С” РєР°Р»РµРЅРґР°СЂ СѓСЃРµСЂРµРґРёРЅС– Р·Р°СЃС‚РѕСЃСѓРЅРєСѓ.",
        mini:`<div class="miniTitle">Google Calendar</div><div class="miniField">${en?"Prepared В· not connected":"РџС–РґРіРѕС‚РѕРІР»РµРЅРѕ В· РЅРµ РїС–РґРєР»СЋС‡РµРЅРѕ"}</div>`
      }
    ];
    const renderSteps=(steps)=>`<div class="guideList">${steps.map((step,i)=>`
      <details class="guideStep" ${i===0?"open":""}>
        <summary><span class="guideNumber">${i+1}</span><span class="guideSummaryText"><strong>${step.title}</strong><span>${step.sub}</span></span><span class="guideChevron">вЊ„</span></summary>
        <div class="guideContent"><div class="guideCopy">${step.copy}<div class="guideExample"><strong>${en?"Example":"РџСЂРёРєР»Р°Рґ"}:</strong> ${step.example}</div></div><div class="miniScreen"><div class="miniTop"></div>${step.mini}</div></div>
      </details>`).join("")}</div>`;
    return `
      <div class="guideHero">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#67e8f9">${en?"Complete guide":"РџРѕРІРЅР° С–РЅСЃС‚СЂСѓРєС†С–СЏ"}</div>
        <div style="font-size:22px;font-weight:950;margin-top:5px">${en?"Two modes, two clear workflows":"Р”РІР° СЂРµР¶РёРјРё вЂ” РґРІР° Р·СЂРѕР·СѓРјС–Р»С– СЃС†РµРЅР°СЂС–С—"}</div>
        <div class="muted" style="margin-top:6px">${en?"Open the route you need. Every step includes an example and a small visual cue.":"Р’С–РґРєСЂРёР№ РїРѕС‚СЂС–Р±РЅРёР№ РјР°СЂС€СЂСѓС‚. РљРѕР¶РµРЅ РєСЂРѕРє РјР°С” РїСЂРёРєР»Р°Рґ С– РЅРµРІРµР»РёРєСѓ РІС–Р·СѓР°Р»СЊРЅСѓ РїС–РґРєР°Р·РєСѓ."}</div>
      </div>
      <details class="guideRole" open>
        <summary><span class="guideRoleIcon">в—‰</span><span><strong>${en?"For the user":"Р”Р»СЏ РєРѕСЂРёСЃС‚СѓРІР°С‡Р°"}</strong><small>${en?"Personal workouts, goals, body and statistics":"РћСЃРѕР±РёСЃС‚С– С‚СЂРµРЅСѓРІР°РЅРЅСЏ, С†С–Р»С–, С‚С–Р»Рѕ С‚Р° СЃС‚Р°С‚РёСЃС‚РёРєР°"}</small></span><span class="guideRoleChevron">вЊ„</span></summary>
        <div class="guideRoleBody">${renderSteps(userSteps)}</div>
      </details>
      <details class="guideRole">
        <summary><span class="guideRoleIcon trainer">в—‡</span><span><strong>${en?"For the trainer":"Р”Р»СЏ С‚СЂРµРЅРµСЂР°"}</strong><small>${en?"Profiles, clients, calendar and comparison":"РџСЂРѕС„С–Р»С–, РєР»С–С”РЅС‚Рё, РєР°Р»РµРЅРґР°СЂ С– РїРѕСЂС–РІРЅСЏРЅРЅСЏ"}</small></span><span class="guideRoleChevron">вЊ„</span></summary>
        <div class="guideRoleBody">${renderSteps(trainerSteps)}</div>
      </details>`;
  }

  function viewSettings(){
    const el = document.createElement("div");

    el.appendChild(card(`
      <div class="detailHeader">
        <div class="detailTitle">
          <h2>${t("settings")}</h2>
          <div class="sub">${state.lang==="en" ? "Data stored in browser (localStorage)" : "Р”Р°РЅС– Р·Р±РµСЂС–РіР°СЋС‚СЊСЃСЏ Сѓ Р±СЂР°СѓР·РµСЂС– (localStorage)"}</div>
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
        <span class="pill">${state.lang==="en"?"Mode":"Р РµР¶РёРј"}</span>
        <strong>${appShell.mode==="trainer"?(state.lang==="en"?"Trainer":"РўСЂРµРЅРµСЂ"):(state.lang==="en"?"User":"РљРѕСЂРёСЃС‚СѓРІР°С‡")}</strong>
        <button class="btn" id="changeModeBtn">${state.lang==="en"?"Change mode":"Р—РјС–РЅРёС‚Рё СЂРµР¶РёРј"}</button>
        ${appShell.mode==="trainer"?`<button class="btn" id="openCoachBtn">${state.lang==="en"?"Clients and calendar":"РљР»С–С”РЅС‚Рё С‚Р° РєР°Р»РµРЅРґР°СЂ"}</button>`:""}
      </div>

      <div class="settingsActions">
        <button class="btn" id="exportBtn">${state.lang==="en"?"Export all":"Р•РєСЃРїРѕСЂС‚ РІСЃСЊРѕРіРѕ"}</button>
        <button class="btn" id="importBtn">${state.lang==="en"?"Import all":"Р†РјРїРѕСЂС‚ РІСЃСЊРѕРіРѕ"}</button>
        <button class="btn" id="exportProfileBtn" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>${state.lang==="en"?"Export active profile":"Р•РєСЃРїРѕСЂС‚ Р°РєС‚РёРІРЅРѕРіРѕ РїСЂРѕС„С–Р»СЋ"}</button>
        <button class="btn" id="mergeProfileBtn" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>${state.lang==="en"?"Merge into active profile":"Р”РѕРїРѕРІРЅРёС‚Рё Р°РєС‚РёРІРЅРёР№ РїСЂРѕС„С–Р»СЊ"}</button>
        <button class="btn" id="resetBtn" ${appShell.mode==="trainer"&&!activeProfile()?"disabled":""}>${t("reset")}</button>
        <input id="importFile" type="file" accept="application/json" style="display:none" />
        <input id="mergeProfileFile" type="file" accept="application/json" style="display:none" />
      </div>

      <div class="premiumNote" style="margin-top:16px">
        <strong>${state.lang==="en" ? "Local-first and compatible" : "Р›РѕРєР°Р»СЊРЅРѕ С‚Р° СЃСѓРјС–СЃРЅРѕ"}</strong>
        <div style="margin-top:4px;font-size:13px;opacity:.86">${state.lang==="en"
          ? "Full export keeps all clients and calendar. Profile export gives one client or My progress as a separate file. Merge import adds new data to the active profile without replacing existing history."
          : "РџРѕРІРЅРёР№ РµРєСЃРїРѕСЂС‚ Р·Р±РµСЂС–РіР°С” РІСЃС–С… РєР»С–С”РЅС‚С–РІ С– РєР°Р»РµРЅРґР°СЂ. Р•РєСЃРїРѕСЂС‚ РїСЂРѕС„С–Р»СЋ РІС–РґРґР°С” РѕРґРЅРѕРіРѕ РєР»С–С”РЅС‚Р° Р°Р±Рѕ В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» РѕРєСЂРµРјРёРј С„Р°Р№Р»РѕРј. Р†РјРїРѕСЂС‚ Р· РґРѕРїРѕРІРЅРµРЅРЅСЏРј РґРѕРґР°С” РЅРѕРІС– РґР°РЅС– РІ Р°РєС‚РёРІРЅРёР№ РїСЂРѕС„С–Р»СЊ Р±РµР· Р·Р°РјС–РЅРё РЅР°СЏРІРЅРѕС— С–СЃС‚РѕСЂС–С—."}</div>
      </div>
    `));
    el.appendChild(card(`
      <details class="guideMaster">
        <summary>
          <span class="guideMasterIcon">рџ“–</span>
          <span class="guideMasterTitle"><strong>${state.lang==="en"?"User and trainer guide":"Р†РЅСЃС‚СЂСѓРєС†С–СЏ РґР»СЏ РєРѕСЂРёСЃС‚СѓРІР°С‡Р° С– С‚СЂРµРЅРµСЂР°"}</strong><span>${state.lang==="en"?"All workflows, examples and mini screens":"РЈСЃС– СЃС†РµРЅР°СЂС–С—, РїСЂРёРєР»Р°РґРё С‚Р° РјС–РЅС–СЃРєСЂС–РЅРё"}</span></span>
          <span class="guideMasterChevron">вЊ„</span>
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
          alert(state.lang==="en"?"Choose My progress or a client first.":"РЎРїРѕС‡Р°С‚РєСѓ РѕР±РµСЂРё В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» Р°Р±Рѕ РєР»С–С”РЅС‚Р°.");
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
          alert(state.lang==="en"?"Choose My progress or a client before merging profile data.":"РџРµСЂРµРґ РґРѕРїРѕРІРЅРµРЅРЅСЏРј РґР°РЅРёС… РѕР±РµСЂРё В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» Р°Р±Рѕ РєР»С–С”РЅС‚Р°.");
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
              alert(state.lang==="en"?"Choose My progress or a client before importing an old backup.":"РџРµСЂРµРґ С–РјРїРѕСЂС‚РѕРј СЃС‚Р°СЂРѕС— СЂРµР·РµСЂРІРЅРѕС— РєРѕРїС–С— РѕР±РµСЂРё В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» Р°Р±Рѕ РєР»С–С”РЅС‚Р°.");
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
              : "РЎС…РѕР¶Рµ, С†Рµ РїРѕРІРЅР° РєРѕРїС–СЏ Р· РєС–Р»СЊРєРѕРјР° РєР»С–С”РЅС‚Р°РјРё. Р’С–РґРєСЂРёР№ РІРёС…С–РґРЅРёР№ РґРѕРґР°С‚РѕРє, РµРєСЃРїРѕСЂС‚СѓР№ Р»РёС€Рµ РїРѕС‚СЂС–Р±РЅРёР№ РїСЂРѕС„С–Р»СЊ С– С‚РѕРґС– РґРѕРїРѕРІРЅРё Р№РѕРіРѕ С‚СѓС‚.");
            return;
          }
          const targetProfile=activeExportProfile();
          if(!targetProfile){
            alert(state.lang==="en"?"Choose My progress or a client first.":"РЎРїРѕС‡Р°С‚РєСѓ РѕР±РµСЂРё В«РњС–Р№ РїСЂРѕРіСЂРµСЃВ» Р°Р±Рѕ РєР»С–С”РЅС‚Р°.");
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
            : `РџСЂРѕС„С–Р»СЊ РґРѕРїРѕРІРЅРµРЅРѕ: +${s.workouts} С‚СЂРµРЅСѓРІР°РЅСЊ, +${s.body} Р·Р°РјС–СЂС–РІ С‚С–Р»Р°, +${s.goals} С†С–Р»РµР№, +${s.exercises} РІРїСЂР°РІ.`);
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
          ? (state.lang==="en"?"Clear all data for the active client? Other clients and calendar remain.":"РћС‡РёСЃС‚РёС‚Рё РІСЃС– РґР°РЅС– Р°РєС‚РёРІРЅРѕРіРѕ РєР»С–С”РЅС‚Р°? Р†РЅС€С– РєР»С–С”РЅС‚Рё Р№ РєР°Р»РµРЅРґР°СЂ Р·Р°Р»РёС€Р°С‚СЊСЃСЏ.")
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
