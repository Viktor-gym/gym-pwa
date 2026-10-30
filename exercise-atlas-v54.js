/* GymTracker exercise atlas. All matching and muscle maps run on device. */
(() => {
  'use strict';
  const ukrainianNames = {
    Dumbbell_Bench_Press_with_Neutral_Grip:'Жим гантелей лежачи нейтральним хватом',
    Dumbbell_Rear_Lunge:'Випади назад з гантелями',
    'EZ-Bar_Curl':'Згинання з EZ-грифом',
    Incline_Dumbbell_Bench_With_Palms_Facing_In:'Жим гантелей під кутом нейтральним хватом',
    Incline_Hammer_Curls:'Молоткові згинання на похилій лавці',
    Lying_Dumbbell_Tricep_Extension:'Розгинання рук з гантелями лежачи',
    One_Arm_Dumbbell_Bench_Press:'Жим гантелі однією рукою лежачи',
    Reverse_Barbell_Curl:'Згинання зі штангою зворотним хватом',
    'Reverse_Grip_Bent-Over_Rows':'Тяга штанги в нахилі зворотним хватом',
    Seated_Dumbbell_Curl:'Згинання з гантелями сидячи'
  };
  const savedEntries = (window.GYM_EXERCISE_LIBRARY || []).map(entry => {
    const name=ukrainianNames[entry.id] || entry.name_ua || (window.GYM_CUSTOM_MOTIONS||[]).find(motion=>motion.catalogId===entry.id)?.name_ua;
    return name ? {...entry,name_ua:name} : entry;
  });
  const legacy = window.GYM_LEGACY_EXERCISES || [];
  const byId = new Map([...savedEntries,...legacy].map(entry => [entry.id, entry]));
  const customMotions=new Map((window.GYM_CUSTOM_MOTIONS||[]).map(motion=>[motion.catalogId,motion]));
  const customMotion=entry=>entry?customMotions.get(entry.id)||null:null;
  const nativeMotions=new Map((window.GYM_NATIVE_MOTIONS||[]).map(motion=>[motion.catalogId,motion]));
  const nativeMotion=entry=>{const clip=entry&&nativeMotions.get(entry.id);return clip&&(!entry.motion||clip.reviewedReplacement===true)?clip:null;};
  const hasAnimation=entry=>Boolean(entry?.motion||nativeMotion(entry)||customMotion(entry));
  // Curate new choices only. Historical catalog IDs and names must still resolve.
  const removedIds = new Set([
    'repdb-running','Machine_Preacher_Curls','Leverage_High_Row','motion-0094',
    'Leverage_Shoulder_Press','Machine_Bench_Press','Wide-Grip_Barbell_Bench_Press',
    'Cable_Rear_Delt_Fly','Preacher_Curl','repdb-cat-cow','motion-0070','motion-0072',
    'motion-0065','repdb-side-lying-lateral-raise','Flat_Bench_Lying_Leg_Raise',
    'motion-0071','Flat_Bench_Leg_Pull-In','Plank','motion-0066','Seated_Triceps_Press',
    'Ab_Roller','Russian_Twist','Crunches','Cable_Crunch','Split_Squat_with_Dumbbells',
    'repdb-one-arm-kettlebell-row','EZ-Bar_Skullcrusher','Walking_Treadmill','Butt_Lift_Bridge',
    '3_4_Sit-Up','90_90_Hamstring','Ab_Crunch_Machine','Adductor','Adductor_Groin',
    'Air_Bike','All_Fours_Quad_Stretch','Alternate_Hammer_Curl','Alternate_Heel_Touchers',
    'Ankle_Circles','Ankle_On_The_Knee','Anterior_Tibialis-SMR','Arm_Circles',
    'Atlas_Stone_Trainer','Atlas_Stones','Axle_Deadlift'
  ]);
  const entries = savedEntries.filter(entry => {
    // The owner's exception covers our completed native/shared-character guides,
    // not downloaded third-party animations.
    if(nativeMotion(entry)||customMotion(entry)) return true;
    return !removedIds.has(entry.id) && !/\balternating\b/i.test(entry.name) && /[А-Яа-яІіЇїЄєҐґ]/u.test(entry.name_ua||'');
  });
  const availableIds = new Set(entries.map(entry=>entry.id));
  const base = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[’'`ʼ]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const muscleNames = {
    chest:'Груди',lats:'Найширші','middle back':'Середина спини','lower back':'Поперек',traps:'Трапеції',neck:'Шия',shoulders:'Плечі',biceps:'Біцепс',triceps:'Трицепс',forearms:'Передпліччя',abdominals:'Прес',quadriceps:'Квадрицепс',hamstrings:'Задня поверхня стегна',glutes:'Сідниці',calves:'Литки',adductors:'Привідні м’язи',abductors:'Відвідні м’язи'
  };
  const categories = {chest:['Груди','Chest'],back:['Спина','Back'],legs:['Ноги','Legs'],shoulders:['Плечі','Shoulders'],arms:['Руки','Arms'],core:['Прес','Core'],cardio:['Кардіо','Cardio'],other:['Інше','Other']};
  const equipmentNames = {barbell:'Штанга',dumbbell:'Гантелі',cable:'Блок',machine:'Тренажер','body only':'Власна вага',kettlebells:'Гирі',bands:'Еспандер','exercise ball':'Фітбол','medicine ball':'Медбол','e-z curl bar':'EZ-гриф',foam_roll:'Ролер',other:'Інше'};
  Object.assign(muscleNames,{'lower legs':'Литки',supraspinatus:'Надостьовий м’яз','upper traps':'Верх трапецій',legs:'Ноги',hips:'Стегна',mobility:'Рухливість','posterior chain':'Задній м’язовий ланцюг',cardio:'Кардіо'});
  const units = {strength:['кг × повтори','kg × reps'],reps:['повтори','reps'],time:['хвилини','minutes'],distance:['км + хвилини','km + minutes']};
  const indexed = savedEntries.map(entry => ({entry,terms:[entry.name,entry.name_ua,customMotion(entry)?.name_ua,...entry.aliases,...(customMotion(entry)?.aliases||[])].filter(Boolean).map(normalize)}));
  const exact = new Map();
  indexed.forEach(({entry,terms}) => terms.forEach(term => exact.set(term,entry)));
  legacy.forEach(entry=>[entry.name,entry.name_ua,...entry.aliases].filter(Boolean).forEach(name=>{const key=normalize(name);if(!exact.has(key))exact.set(key,entry);}));
  const label = (entry,lang='ua') => lang === 'en' ? entry.name : customMotion(entry)?.name_ua || entry.name_ua || entry.name;
  const category = (id,lang='ua') => (categories[id] || categories.other)[lang === 'en' ? 1 : 0];
  const unitLabel = (type,lang='ua') => (units[type] || units.strength)[lang === 'en' ? 1 : 0];
  function match(exercise) {
    if (exercise?.catalogId === 'none') return null;
    if (exercise?.catalogId && byId.has(exercise.catalogId)) return byId.get(exercise.catalogId);
    const names = typeof exercise === 'string' ? [exercise] : [exercise?.name_ua,exercise?.name_en];
    for (const name of names) { const found = exact.get(normalize(name)); if (found) return found; }
    return null;
  }
  function search(query='',options={}) {
    const q = normalize(query);
    const tokens = q.split(' ').filter(Boolean);
    const dictionary=[[/^жим/,'press'],[/^присід/,'squat'],[/^розвед/,'flyes'],[/^згин/,'curl'],[/^розгин/,'extension'],[/^шраг/,'shrug'],[/^гантел/,'dumbbell'],[/^штанг/,'barbell'],[/^гир/,'kettlebell'],[/^сидяч|^сидячи/,'seated'],[/^стояч|^стоячи/,'standing'],[/^лежач|^лежачи/,'lying'],[/^тренажер/,'machine'],[/^блок/,'cable'],[/^біцепс/,'bicep'],[/^трицепс|^тріцепс/,'triceps'],[/^похило|^кутом/,'incline'],[/^вузьк/,'close grip'],[/^широк/,'wide grip']];
    const translated=tokens.filter(token=>!['з','зі','із','на','в','у','під','для','та','рук','руки'].includes(token)).map(token=>dictionary.find(([pattern])=>pattern.test(token))?.[1]||token).join(' ');
    const variants=[q,translated].filter(Boolean).map(value=>value.split(' '));
    return indexed.filter(({entry}) => availableIds.has(entry.id) && (!options.category || options.category === 'all' || entry.muscleGroup === options.category)).map(({entry,terms}) => {
      const score = !q ? (entry.name_ua ? 5 : 1) : Math.max(...terms.map(term => term === q ? 1000 : term.startsWith(q) ? 700-q.length/100 : term.includes(q) ? 500 : variants.some(words=>words.every(token=>term.includes(token))) ? 300 : 0));
      return {entry,score};
    }).filter(item => item.score > 0).sort((a,b) => b.score-a.score || label(a.entry,options.lang).localeCompare(label(b.entry,options.lang))).slice(0,options.limit || 60).map(item => item.entry);
  }
  function imageUrl(entry,index=0) {
    const image = entry.images[index] || entry.images[0];
    if(!image) return '';
    return entry.localImages ? './assets/exercises/' + image : base + image;
  }
  const previewUrl = entry => nativeMotion(entry)?.poster || customMotion(entry)?.poster || entry.motion?.poster || imageUrl(entry);
  function thumbnail(entry,lang='ua',interactive=true) {
    if(!entry) return '';
    return `<span class="atlasThumb" ${interactive?`data-atlas-id="${esc(entry.id)}" role="button" tabindex="0" aria-label="${esc((lang==='en'?'How to: ':'Як виконувати: ')+label(entry,lang))}"`:''}><span class="atlasThumbFallback" aria-hidden="true">◇</span>${previewUrl(entry)?`<img src="${esc(previewUrl(entry))}" alt="${esc(label(entry,lang))}" loading="lazy" decoding="async">`:''}${hasAnimation(entry)?'<span class="atlasThumbPlay" aria-hidden="true">▶</span>':''}</span>`;
  }
  const regionPaths = {
    front: {
      shoulders:['M42 56Q31 54 27 68L30 80 41 72Z','M78 56Q89 54 93 68L90 80 79 72Z'],
      chest:['M44 58Q50 54 58 59L58 79Q48 85 40 75Z','M62 59Q70 54 76 58L80 75Q72 85 62 79Z'],
      biceps:['M29 78L39 77 35 99Q27 104 25 95Z','M81 77L91 78 95 95Q93 104 85 99Z'],
      forearms:['M25 100L34 103 27 126 20 124Z','M86 103L95 100 100 124 93 126Z'],
      abdominals:['M47 84L58 85 58 117 49 115Z','M62 85L73 84 71 115 62 117Z'],
      quadriceps:['M43 128L57 129 55 175 40 173Z','M63 129L77 128 80 173 65 175Z'],
      adductors:['M57 128L60 136 56 167 52 155Z','M60 136L63 128 68 155 64 167Z'],
      calves:['M41 183L53 185 50 218 42 217Z','M67 185L79 183 78 217 70 218Z'],
      neck:['M52 43L58 44 58 53 49 53Z','M62 44L68 43 71 53 62 53Z']
    },
    back: {
      traps:['M52 47L59 49 59 79 44 64Z','M61 49L68 47 76 64 61 79Z'],
      shoulders:['M41 56Q31 54 27 68L30 80 41 72Z','M79 56Q89 54 93 68L90 80 79 72Z'],
      'middle back':['M43 69L57 80 57 94 45 86Z','M63 80L77 69 75 86 63 94Z'],
      lats:['M41 82L56 97 54 115 43 103Z','M64 97L79 82 77 103 66 115Z'],
      'lower back':['M55 97L59 99 59 123 51 119Z','M61 99L65 97 69 119 61 123Z'],
      triceps:['M29 78L39 77 35 99Q27 104 25 95Z','M81 77L91 78 95 95Q93 104 85 99Z'],
      forearms:['M25 100L34 103 27 126 20 124Z','M86 103L95 100 100 124 93 126Z'],
      glutes:['M44 122Q52 117 58 124L58 144 43 140Z','M62 124Q68 117 76 122L77 140 62 144Z'],
      hamstrings:['M43 145L57 148 54 176 40 173Z','M63 148L77 145 80 173 66 176Z'],
      calves:['M40 182L53 183 53 204 49 220 41 216Z','M67 183L80 182 79 216 71 220 67 204Z'],
      abductors:['M40 126L44 130 42 151 38 143Z','M76 130L80 126 82 143 78 151Z']
    }
  };
  function muscleMap(entry,lang) {
    const regions={'lower legs':'calves',supraspinatus:'shoulders','upper traps':'traps'};
    const primary = new Set((entry.primaryMuscles || []).map(m=>regions[m]||m)), secondary = new Set((entry.secondaryMuscles || []).map(m=>regions[m]||m));
    const body = 'M51 44L48 52 39 55Q28 55 25 70L22 95 17 125 24 131 34 107 40 83 44 110 39 127 36 170 38 178 36 218 39 230 52 230 56 179 60 150 64 179 68 230 81 230 84 218 82 178 84 170 81 127 76 110 80 83 86 107 96 131 103 125 98 95 95 70Q92 55 81 55L72 52 69 44Z';
    return `<div class="atlasAnatomy">${Object.entries(regionPaths).map(([side,regions])=>`<div><svg viewBox="0 0 120 242" role="img" aria-label="${lang==='en'?(side==='front'?'Front muscle map':'Back muscle map'):(side==='front'?'М’язи спереду':'М’язи ззаду')}"><ellipse cx="60" cy="27" rx="15" ry="19" fill="#3b4251"/><path d="${body}" fill="#343d4e" stroke="#66738a" stroke-width="1"/>${Object.entries(regions).map(([muscle,paths])=>paths.map(d=>`<path d="${d}" fill="${primary.has(muscle)?'#ff927d':secondary.has(muscle)?'#e4ba76':'#49566a'}" stroke="#252e3e" stroke-width="1"><title>${esc(lang==='en'?muscle:muscleNames[muscle]||muscle)}</title></path>`).join('')).join('')}</svg><small>${lang==='en'?(side==='front'?'Front':'Back'):(side==='front'?'Спереду':'Ззаду')}</small></div>`).join('')}</div>`;
  }
  function muscleList(items,lang,kind) {
    return `<div class="atlasMuscleTags ${kind}">${(items||[]).map(m=>`<span>${esc(lang==='en'?m:muscleNames[m]||m)}</span>`).join('')}</div>`;
  }
  function open(entry,options={}) {
    const lang=options.lang||'ua', en=lang==='en';
    const previousFocus=document.activeElement;
    const overlay=document.createElement('div');
    overlay.className='atlasOverlay';
    const controller=new AbortController();
    const close=()=>{controller.abort();const video=overlay.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}overlay.remove();previousFocus?.focus?.();};
    const head=options.title || label(entry,lang);
    overlay.innerHTML=`<section class="atlasDialog" role="dialog" aria-modal="true" aria-labelledby="atlasTitle" tabindex="-1">
      <div class="atlasDialogHead"><div><span class="atlasEyebrow">${en?'MOVEMENT ATLAS':'АТЛАС РУХІВ'}</span><h2 id="atlasTitle">${esc(head)}</h2><p>${esc(entry?entry.name:(en?'Your custom exercise':'Твоя власна вправа'))}</p></div><button class="btn atlasClose" aria-label="${en?'Close':'Закрити'}">✕</button></div>
      ${entry?`${variantMarkup(entry,en)}<div class="atlasGuideGrid"><div>${mediaMarkup(entry,en)}</div>
      <aside class="atlasMusclePanel"><h3>${en?'Muscles at work':'Які м’язи працюють'}</h3>${muscleMap(entry,lang)}<div class="atlasLegend"><span><i></i>${en?'Primary':'Основні'}</span><span><i></i>${en?'Secondary':'Допоміжні'}</span></div>${muscleList(entry.primaryMuscles,lang,'primary')}${muscleList(entry.secondaryMuscles,lang,'secondary')}</aside></div>
      <div class="atlasFacts"><span>${esc(category(entry.muscleGroup,lang))}</span><span>${esc(en?entry.equipment||'Other':equipmentNames[entry.equipment]||entry.equipment||'Інше')}</span><span>${esc(unitLabel(entry.trackingType,lang))}</span></div>
      ${instructionsMarkup(entry,en)}`:`<div class="atlasUnmatched"><div>◇</div><h3>${en?'Choose a matching movement':'Підбери відповідний рух'}</h3><p>${en?'There is no exact library match for this name. Keep your exercise or choose the correct variant in Edit.':'Для цієї назви немає точного відповідника. Власна вправа збережена; у редагуванні можна вибрати правильний варіант із бібліотеки.'}</p></div>`}
      <div class="atlasDialogActions">${options.onEdit?`<button class="btn" data-edit>${en?'Edit exercise':'Редагувати вправу'}</button>`:''}${options.onAdd?`<button class="btn primary" data-add>${en?'Add to my exercises':'До моїх вправ'}</button>`:''}<button class="btn" data-close>${en?'Done':'Готово'}</button></div>
      ${sourceMarkup(entry,en)}
    </section>`;
    document.body.append(overlay);
    const dialog=overlay.querySelector('.atlasDialog');
    if(entry&&!hasAnimation(entry)&&!entry.images.length){
      const stage=overlay.querySelector('.atlasStage');
      stage.querySelectorAll('img,.atlasStageCaption').forEach(node=>node.remove());
      const message=stage.querySelector('.atlasImageError');message.hidden=false;message.textContent=en?'The source does not have photographs for this movement yet. Your exercise and results are preserved.':'Джерело поки не має фото цього руху. Твоя вправа й результати збережені.';
      overlay.querySelectorAll('.atlasPlayback button').forEach(button=>{button.disabled=true;});
    }
    dialog.focus();
    overlay.querySelector('.atlasClose').onclick=close;
    overlay.querySelector('[data-close]').onclick=close;
    overlay.addEventListener('click',event=>{if(event.target===overlay) close();});
    overlay.querySelector('[data-edit]')?.addEventListener('click',()=>{close();options.onEdit();});
    overlay.querySelector('[data-add]')?.addEventListener('click',()=>{close();options.onAdd(entry);});
    overlay.querySelectorAll('[data-guide-variant]').forEach(button=>button.addEventListener('click',()=>{const variant=byId.get(button.dataset.guideVariant);close();open(variant,{...options,title:label(variant,lang)});}));
    bindMedia(overlay,controller.signal,en,entry);
    dialog.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.stopPropagation();close();}
      if(event.key==='Tab'){
        const focusable=[...dialog.querySelectorAll('button:not(:disabled),a,summary,input,select')].filter(node=>node.getClientRects().length);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    });
    return {close};
  }
  document.addEventListener('error',event=>{if(event.target instanceof HTMLImageElement&&event.target.closest('.atlasThumb'))event.target.classList.add('atlasPhotoFailed');},true);
  function variantMarkup(entry,en){
    const variants=[...customMotions.values()].filter(item=>item.relatedCatalogIds?.includes(entry.id));
    if(!variants.length)return '';
    return `<div class="atlasFootnote"><p>${en?'This guide shows the level press. Looking for the upward incline variant?':'Цей показ — горизонтальний жим. Для жиму під кутом вгору відкрий інший варіант:'}</p>${variants.map(item=>`<button class="btn" data-guide-variant="${esc(item.catalogId)}">${esc(label(byId.get(item.catalogId),en?'en':'ua'))} · 3D</button>`).join('')}</div>`;
  }
  function mediaMarkup(entry,en,original=false){
    const native=!original&&nativeMotion(entry);
    if(native)return mediaMarkup({...entry,motion:native},en,true);
    const own=native?null:customMotion(entry);
    if(own&&!original)return `<div class="atlasStage atlasCustomStage" data-clip-id="${esc(own.clipId)}"><img class="atlasCustomPoster" src="${esc(own.poster)}" alt="${esc(label(entry,en?'en':'ua'))}"><span class="atlasStageCaption">3D · GymTracker</span></div><div class="atlasPlayback atlasCustomControls"><button class="btn primary" data-play>${en?'▶ Play':'▶ Показ руху'}</button><button class="btn" data-restart>${en?'From start':'Спочатку'}</button><button class="btn" data-speed aria-label="${en?'Animation speed':'Швидкість анімації'}">1×</button><button class="btn" data-angle>${en?'View':'Ракурс'}</button></div><label class="atlasScrub"><span>${en?'Movement':'Рух'}</span><input type="range" min="0" max="1000" value="0" step="1" data-seek aria-label="${en?'Animation position':'Позиція руху'}"><output data-progress>0%</output></label><p class="atlasFootnote">${en?'Shared 3D mannequin. Pause, slow down or change the view to inspect the motion.':'Спільний 3D-манекен. Зупини показ, сповільни або зміни ракурс, щоб роздивитися рух.'}</p>`;
    const error=`<div class="atlasImageError" hidden role="status">${en?'Not downloaded yet. Open this exercise online to save the demonstration.':'Матеріал ще не завантажений. Відкрий вправу з інтернетом, щоб зберегти показ.'}</div>`;
    if(entry.motion)return `<div class="atlasStage atlasMotionStage">${error}<video class="atlasMotion" src="${esc(entry.motion.src)}" poster="${esc(entry.motion.poster)}" preload="metadata" playsinline muted loop aria-label="${esc((en?'3D exercise animation: ':'3D-анімація вправи: ')+label(entry,en?'en':'ua'))}"></video><span class="atlasStageCaption">3D ${en?'ANIMATION':'АНІМАЦІЯ'}</span></div><div class="atlasPlayback"><button class="btn primary" data-play>${en?'▶ Play':'▶ Показ руху'}</button><button class="btn" data-restart>${en?'From start':'Спочатку'}</button><button class="btn" data-speed aria-label="${en?'Animation speed':'Швидкість анімації'}">1×</button></div><label class="atlasScrub"><span>${en?'Movement':'Рух'}</span><input type="range" min="0" max="1000" value="0" step="1" data-seek aria-label="${en?'Animation position':'Позиція руху'}"><output data-progress>0%</output></label><p class="atlasFootnote">${en?'Animated 3D character, not human footage. A muscle map is available below.':'Анімований 3D-персонаж, не відеозйомка людини. Карта м’язів доступна нижче.'}</p>`;
    return `<div class="atlasStage" data-phase="0">${error}${entry.images.length?`<img class="atlasPhase first" src="${esc(imageUrl(entry,0))}" alt="${en?'Starting position':'Початкова позиція'}"><img class="atlasPhase second" src="${esc(imageUrl(entry,1))}" alt="${en?'Second position':'Друга позиція'}">`:''}<span class="atlasStageCaption">${en?'POSITION REFERENCE':'ОРІЄНТИР ПОЗИЦІЇ'}</span></div><div class="atlasPlayback"><button class="btn" data-phase-button="0" aria-pressed="true">01 ${en?'Start':'Початок'}</button><button class="btn" data-phase-button="1" aria-pressed="false">02 ${en?'Finish':'Завершення'}</button></div><p class="atlasFootnote">${en?'No exact animation in the free collection yet. Static positions and technique are available; no unrelated motion is substituted.':'Точної анімації в безкоштовній колекції поки немає. Доступні статичні позиції й техніка, без підміни іншим рухом.'}</p>`;
  }
  function bindMedia(overlay,signal,en,entry){
    if(overlay.querySelector('.atlasCustomStage')){
      const host=overlay.querySelector('.atlasGuideGrid>div');
      const fallback=()=>{if(signal.aborted)return;host.innerHTML=mediaMarkup(entry,en,true);host.dataset.motionFallback='true';bindMedia(overlay,signal,en,entry);};
      try{if(!window.GymMotion?.mount)throw new Error('Motion runtime unavailable');GymMotion.mount(host,{clipId:customMotion(entry).clipId,lang:en?'en':'ua',signal,onFallback:fallback});}catch{fallback();}
      return;
    }
    const video=overlay.querySelector('video'),error=overlay.querySelector('.atlasImageError');
    if(!video){
      overlay.querySelectorAll('[data-phase-button]').forEach(button=>button.onclick=()=>{overlay.querySelector('.atlasStage').dataset.phase=button.dataset.phaseButton;overlay.querySelectorAll('[data-phase-button]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
      overlay.querySelectorAll('.atlasPhase').forEach(img=>img.addEventListener('error',()=>{error.hidden=false;},{signal}));
      return;
    }
    const playButton=overlay.querySelector('[data-play]'),seek=overlay.querySelector('[data-seek]');
    const update=()=>{playButton.textContent=video.paused?(en?'▶ Play':'▶ Показ руху'):(en?'Ⅱ Pause':'Ⅱ Пауза');};
    const play=()=>{if(video.error){video.load();}video.play().then(()=>{error.hidden=true;}).catch(()=>{update();if(video.error)error.hidden=false;});};
    const native=overlay.querySelector('.atlasGuideGrid>div')?.dataset.nativeFallback?null:nativeMotion(entry);
    const views=native?.views?.length>1?native.views:null;
    let viewIndex=0,viewToken=0,angleButton,pendingViewState=null;
    const viewLabel=()=>{if(angleButton)angleButton.textContent=(en?'View: ':'Ракурс: ')+(en?views[viewIndex].label_en:views[viewIndex].label_ua);};
    const selectView=(index,preserved)=>{
      const state=preserved||pendingViewState||{time:Number.isFinite(video.currentTime)?video.currentTime:0,rate:video.playbackRate,playing:!video.paused};
      pendingViewState=state;
      const {time,rate,playing:wasPlaying}=state,token=++viewToken;
      video.pause();viewIndex=index;viewLabel();
      video.poster=views[index].poster;video.src=views[index].src;
      video.addEventListener('loadedmetadata',()=>{
        if(signal.aborted||token!==viewToken)return;
        if(Number.isFinite(video.duration))video.currentTime=Math.min(time,Math.max(0,video.duration-.01));
        pendingViewState=null;video.playbackRate=rate;if(wasPlaying&&!document.hidden)play();else update();
      },{once:true,signal});
      video.load();
    };
    if(views){
      angleButton=document.createElement('button');angleButton.type='button';angleButton.className='btn';
      angleButton.dataset.nativeAngle='';angleButton.setAttribute('aria-label',en?'Change camera angle':'Змінити ракурс');
      viewLabel();angleButton.onclick=()=>selectView((viewIndex+1)%views.length);
      overlay.querySelector('.atlasPlayback').append(angleButton);
    }
    playButton.onclick=()=>video.paused?play():video.pause();
    overlay.querySelector('[data-restart]').onclick=()=>{if(Number.isFinite(video.duration)){video.currentTime=0;play();}};
    overlay.querySelector('[data-speed]').onclick=event=>{video.playbackRate=video.playbackRate===1?0.5:1;event.currentTarget.textContent=video.playbackRate+'×';};
    seek.oninput=()=>{if(Number.isFinite(video.duration))video.currentTime=Number(seek.value)/1000*video.duration;};
    video.addEventListener('timeupdate',()=>{const progress=video.duration?video.currentTime/video.duration:0;seek.value=String(Math.round(progress*1000));overlay.querySelector('[data-progress]').textContent=Math.round(progress*100)+'%';},{signal});
    video.addEventListener('play',update,{signal});video.addEventListener('pause',update,{signal});
    video.addEventListener('error',()=>{
      const host=overlay.querySelector('.atlasGuideGrid>div');
      if(views&&viewIndex>0){selectView(0,pendingViewState);return;}
      if(nativeMotion(entry)&&!host.dataset.nativeFallback){
        host.dataset.nativeFallback='true';video.pause();video.removeAttribute('src');
        host.innerHTML=mediaMarkup(entry,en,true);bindMedia(overlay,signal,en,entry);return;
      }
      error.hidden=false;update();
    },{signal});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();},{signal});
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)play();
  }
  function instructionsMarkup(entry,en){
    const steps=en?entry.instructions:entry.instructions_ua||entry.instructions;
    if(!steps?.length)return `<p class="atlasFootnote">${en?'No written technique is available for this saved variant. You can select an exact matching movement in Edit without deleting your exercise or its results.':'Для цього збереженого варіанта немає текстової техніки. У редагуванні можна вибрати точний відповідник, не видаляючи вправу чи її результати.'}</p>`;
    return `<details class="atlasInstructions" ${entry.instructions_ua||en?'open':''}><summary>${en?'How to perform':'Як виконувати'}${!en&&!entry.instructions_ua?' · EN':''}</summary><ol>${steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></details>`;
  }
  function sourceMarkup(entry,en){
    if(nativeMotion(entry))return `<p class="atlasFootnote">${en?'GymTracker Pro · rendered native 3D character. Stronger color: primary muscles; lighter: secondary muscles. Illustration, not a measurement of activation.':'GymTracker Pro · рендер власного 3D-персонажа. Насичений колір — основні м’язи; світліший — допоміжні. Це ілюстрація, не вимір активації.'} <a href="./assets/native-bench/v56/CREDITS.md" target="_blank" rel="noopener noreferrer">${en?'Sources and credits':'Джерела й авторство'}</a></p>`;
    if(customMotion(entry))return `<p class="atlasFootnote">${en?'Model and motion: GymTracker Pro · original procedural 3D.':'Модель і рух: GymTracker Pro · власний процедурний 3D-показ.'} <a href="./assets/gym-motion/THREE-LICENSE.txt" target="_blank" rel="noopener noreferrer">Three.js · MIT</a></p><details class="atlasFootnote"><summary>${en?'Original fallback sources':'Джерела резервних матеріалів'}</summary>${originalSourceMarkup(entry,en)}</details>`;
    return originalSourceMarkup(entry,en);
  }
  function originalSourceMarkup(entry,en){
    if(!entry)return '';
    if(entry.sourceProvider==='workout-guide')return `<a class="atlasSource" href="https://github.com/bryllim/workout-guide" target="_blank" rel="noopener noreferrer">${en?'Saved movement metadata:':'Дані збереженого руху:'} Workout Guide · Bryl Lim · CC BY-SA 4.0</a><p class="atlasFootnote"><a href="./assets/poses/ATTRIBUTION.md" target="_blank" rel="noopener noreferrer">${en?'Credits':'Авторство'}</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a></p>`;
    if(entry.motion?.provider==='repdb')return `<a class="atlasSource" href="https://repdb.co/preview/" target="_blank" rel="noopener noreferrer">Exercise data & images: RepDB (https://repdb.co)</a><p class="atlasFootnote"><a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC 4.0</a> · ${en?'Personal / non-commercial use only. Resized and transcoded from the preview animation.':'Лише особисте / некомерційне використання. Анімацію зменшено й перекодовано з preview-набору.'}</p>`;
    return `<a class="atlasSource" href="${entry.motion?'https://vitalanimations.com/free-pack':'https://github.com/yuhonas/free-exercise-db'}" target="_blank" rel="noopener noreferrer">${entry.motion?(en?'3D motion: Vital Animations · Free50 pack':'3D-анімація: Vital Animations · безкоштовний набір Free50'):(en?'Photos and movement data: Free Exercise DB · Unlicense':'Фото та дані рухів: Free Exercise DB · Unlicense')}</a>`;
  }
  window.GymAtlas={entries,byId,match,search,label,category,unitLabel,thumbnail,imageUrl,previewUrl,open,normalize,escape:esc,muscleNames,customMotion,nativeMotion,hasAnimation};
})();
