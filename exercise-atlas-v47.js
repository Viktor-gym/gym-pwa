/* GymTracker exercise atlas. All matching and muscle maps run on device. */
(() => {
  'use strict';
  const entries = window.GYM_EXERCISE_LIBRARY || [];
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const base = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[’'`ʼ]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const muscleNames = {
    chest:'Груди',lats:'Найширші','middle back':'Середина спини','lower back':'Поперек',traps:'Трапеції',neck:'Шия',shoulders:'Плечі',biceps:'Біцепс',triceps:'Трицепс',forearms:'Передпліччя',abdominals:'Прес',quadriceps:'Квадрицепс',hamstrings:'Задня поверхня стегна',glutes:'Сідниці',calves:'Литки',adductors:'Привідні м’язи',abductors:'Відвідні м’язи'
  };
  const categories = {chest:['Груди','Chest'],back:['Спина','Back'],legs:['Ноги','Legs'],shoulders:['Плечі','Shoulders'],arms:['Руки','Arms'],core:['Прес','Core'],cardio:['Кардіо','Cardio'],other:['Інше','Other']};
  const equipmentNames = {barbell:'Штанга',dumbbell:'Гантелі',cable:'Блок',machine:'Тренажер','body only':'Власна вага',kettlebells:'Гирі',bands:'Еспандер','exercise ball':'Фітбол','medicine ball':'Медбол','e-z curl bar':'EZ-гриф',foam_roll:'Ролер',other:'Інше'};
  const units = {strength:['кг × повтори','kg × reps'],reps:['повтори','reps'],time:['хвилини','minutes'],distance:['км + хвилини','km + minutes']};
  const indexed = entries.map(entry => ({entry,terms:[entry.name,entry.name_ua,...entry.aliases].filter(Boolean).map(normalize)}));
  const exact = new Map();
  indexed.forEach(({entry,terms}) => terms.forEach(term => exact.set(term,entry)));
  const label = (entry,lang='ua') => lang === 'en' ? entry.name : entry.name_ua || entry.name;
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
    return indexed.filter(({entry}) => !options.category || options.category === 'all' || entry.muscleGroup === options.category).map(({entry,terms}) => {
      const score = !q ? (entry.name_ua ? 5 : 1) : Math.max(...terms.map(term => term === q ? 1000 : term.startsWith(q) ? 700-q.length/100 : term.includes(q) ? 500 : variants.some(words=>words.every(token=>term.includes(token))) ? 300 : 0));
      return {entry,score};
    }).filter(item => item.score > 0).sort((a,b) => b.score-a.score || label(a.entry,options.lang).localeCompare(label(b.entry,options.lang))).slice(0,options.limit || 60).map(item => item.entry);
  }
  function imageUrl(entry,index=0) {
    const image = entry.images[index] || entry.images[0];
    if(!image) return '';
    return entry.localImages ? './assets/exercises/' + image : base + image;
  }
  function thumbnail(entry,lang='ua',interactive=true) {
    if(!entry) return '';
    return `<span class="atlasThumb" ${interactive?`data-atlas-id="${esc(entry.id)}" role="button" tabindex="0" aria-label="${esc((lang==='en'?'How to: ':'Як виконувати: ')+label(entry,lang))}"`:''}><span class="atlasThumbFallback" aria-hidden="true">◇</span>${entry.images.length?`<img src="${esc(imageUrl(entry))}" alt="${esc(label(entry,lang))}" loading="lazy" decoding="async">`:''}<span class="atlasThumbPlay" aria-hidden="true">▶</span></span>`;
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
    const primary = new Set(entry.primaryMuscles || []), secondary = new Set(entry.secondaryMuscles || []);
    const body = 'M51 44L48 52 39 55Q28 55 25 70L22 95 17 125 24 131 34 107 40 83 44 110 39 127 36 170 38 178 36 218 39 230 52 230 56 179 60 150 64 179 68 230 81 230 84 218 82 178 84 170 81 127 76 110 80 83 86 107 96 131 103 125 98 95 95 70Q92 55 81 55L72 52 69 44Z';
    return `<div class="atlasAnatomy">${Object.entries(regionPaths).map(([side,regions])=>`<div><svg viewBox="0 0 120 242" role="img" aria-label="${lang==='en'?(side==='front'?'Front muscle map':'Back muscle map'):(side==='front'?'М’язи спереду':'М’язи ззаду')}"><ellipse cx="60" cy="27" rx="15" ry="19" fill="#343e3b"/><path d="${body}" fill="#303b37" stroke="#52625b" stroke-width="1"/>${Object.entries(regions).map(([muscle,paths])=>paths.map(d=>`<path d="${d}" fill="${primary.has(muscle)?'#91c9ae':secondary.has(muscle)?'#e4ba76':'#42514a'}" stroke="#26312b" stroke-width="1"><title>${esc(lang==='en'?muscle:muscleNames[muscle]||muscle)}</title></path>`).join('')).join('')}</svg><small>${lang==='en'?(side==='front'?'Front':'Back'):(side==='front'?'Спереду':'Ззаду')}</small></div>`).join('')}</div>`;
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
    let timer=null, phase=0, playing=false, ready=false;
    const close=()=>{clearInterval(timer);controller.abort();overlay.remove();previousFocus?.focus?.();};
    const head=options.title || label(entry,lang);
    overlay.innerHTML=`<section class="atlasDialog" role="dialog" aria-modal="true" aria-labelledby="atlasTitle" tabindex="-1">
      <div class="atlasDialogHead"><div><span class="atlasEyebrow">${en?'MOVEMENT ATLAS':'АТЛАС РУХІВ'}</span><h2 id="atlasTitle">${esc(head)}</h2><p>${esc(entry?entry.name:(en?'Your custom exercise':'Твоя власна вправа'))}</p></div><button class="btn atlasClose" aria-label="${en?'Close':'Закрити'}">✕</button></div>
      ${entry?`<div class="atlasGuideGrid"><div><div class="atlasStage" data-phase="0"><div class="atlasImageError" hidden>${en?'Photos are unavailable offline. Open this exercise online once to save them.':'Фото ще не завантажені. Відкрий вправу з інтернетом, щоб зберегти їх.'}</div><img class="atlasPhase first" src="${esc(imageUrl(entry,0))}" alt="${en?'Starting position':'Початкова позиція'}"><img class="atlasPhase second" src="${esc(imageUrl(entry,1))}" alt="${en?'Second position':'Друга позиція'}"><span class="atlasStageCaption">${en?'Two real movement positions':'Дві реальні позиції руху'}</span></div>
      <div class="atlasPlayback"><button class="btn primary" data-play disabled>${en?'Loading photos…':'Завантаження фото…'}</button><button class="btn" data-phase-button="0" aria-pressed="true">01 ${en?'Start':'Початок'}</button><button class="btn" data-phase-button="1" aria-pressed="false">02 ${en?'Movement':'Рух'}</button><button class="btn" data-speed>1×</button></div><p class="atlasFootnote">${en?'Frame-by-frame replay of two positions, not a continuous video.':'Покадровий показ двох позицій, не безперервне відео.'}</p></div>
      <aside class="atlasMusclePanel"><h3>${en?'Muscles at work':'Які м’язи працюють'}</h3>${muscleMap(entry,lang)}<div class="atlasLegend"><span><i></i>${en?'Primary':'Основні'}</span><span><i></i>${en?'Secondary':'Допоміжні'}</span></div>${muscleList(entry.primaryMuscles,lang,'primary')}${muscleList(entry.secondaryMuscles,lang,'secondary')}</aside></div>
      <div class="atlasFacts"><span>${esc(category(entry.muscleGroup,lang))}</span><span>${esc(en?entry.equipment||'Other':equipmentNames[entry.equipment]||entry.equipment||'Інше')}</span><span>${esc(unitLabel(entry.trackingType,lang))}</span></div>
      <details class="atlasInstructions" ${entry.instructions_ua||en?'open':''}><summary>${en?'How to perform':'Як виконувати'}${!en&&!entry.instructions_ua?' · EN':''}</summary><ol>${(en?entry.instructions:entry.instructions_ua||entry.instructions).map(step=>`<li>${esc(step)}</li>`).join('')}</ol></details>`:`<div class="atlasUnmatched"><div>◇</div><h3>${en?'Choose a matching movement':'Підбери відповідний рух'}</h3><p>${en?'There is no exact library match for this name. Keep your exercise or choose the correct variant in Edit.':'Для цієї назви немає точного відповідника. Власна вправа збережена; у редагуванні можна вибрати правильний варіант із бібліотеки.'}</p></div>`}
      <div class="atlasDialogActions">${options.onEdit?`<button class="btn" data-edit>${en?'Edit exercise':'Редагувати вправу'}</button>`:''}${options.onAdd?`<button class="btn primary" data-add>${en?'Add to my exercises':'До моїх вправ'}</button>`:''}<button class="btn" data-close>${en?'Done':'Готово'}</button></div>
      <a class="atlasSource" href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener noreferrer">${en?'Photos and movement data: Free Exercise DB · Unlicense':'Фото та дані рухів: Free Exercise DB · Unlicense'}</a>
    </section>`;
    document.body.append(overlay);
    const dialog=overlay.querySelector('.atlasDialog');
    if(entry&&!entry.images.length){
      const stage=overlay.querySelector('.atlasStage');
      stage.querySelectorAll('img,.atlasStageCaption').forEach(node=>node.remove());
      const message=stage.querySelector('.atlasImageError');message.hidden=false;message.textContent=en?'The source does not have photographs for this movement yet. Muscle data and instructions are available below.':'Джерело поки не має фото цього руху. Карта м’язів та інструкція доступні нижче.';
      overlay.querySelectorAll('.atlasPlayback button').forEach(button=>{button.disabled=true;});
      overlay.querySelector('[data-play]').textContent=en?'No photos yet':'Фото поки немає';
    }
    dialog.focus();
    overlay.querySelector('.atlasClose').onclick=close;
    overlay.querySelector('[data-close]').onclick=close;
    overlay.addEventListener('click',event=>{if(event.target===overlay) close();});
    overlay.querySelector('[data-edit]')?.addEventListener('click',()=>{close();options.onEdit();});
    overlay.querySelector('[data-add]')?.addEventListener('click',()=>{close();options.onAdd(entry);});
    const playButton=overlay.querySelector('[data-play]');
    let speed=1;
    function setPhase(value) {phase=value;overlay.querySelector('.atlasStage').dataset.phase=String(phase);overlay.querySelectorAll('[data-phase-button]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.phaseButton)===phase)));}
    function pause(){playing=false;clearInterval(timer);if(playButton&&ready) playButton.textContent=en?'▶ Play':'▶ Показ руху';}
    function play(){if(!ready) return;playing=true;playButton.textContent=en?'Ⅱ Pause':'Ⅱ Пауза';clearInterval(timer);timer=setInterval(()=>{if(!document.hidden) setPhase(1-phase);},1800/speed);}
    playButton?.addEventListener('click',()=>playing?pause():play());
    overlay.querySelectorAll('[data-phase-button]').forEach(b=>b.onclick=()=>{pause();setPhase(Number(b.dataset.phaseButton));});
    overlay.querySelector('[data-speed]')?.addEventListener('click',event=>{speed=speed===1?0.5:1;event.currentTarget.textContent=speed+'×';if(playing) play();});
    if(entry){
      const images=[...overlay.querySelectorAll('.atlasPhase')];
      const check=()=>{ready=images.length>=2&&images.every(img=>img.complete&&img.naturalWidth>0);if(ready){playButton.disabled=false;playButton.textContent=en?'▶ Play':'▶ Показ руху';}};
      images.forEach(img=>{img.addEventListener('load',check);img.addEventListener('error',()=>{pause();overlay.querySelector('.atlasImageError').hidden=false;playButton.disabled=true;playButton.textContent=en?'Photos unavailable':'Фото недоступні';});});
      check();
    }
    document.addEventListener('visibilitychange',()=>{if(document.hidden) pause();},{signal:controller.signal});
    dialog.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.stopPropagation();close();}
      if(event.key==='Tab'){
        const focusable=[...dialog.querySelectorAll('button:not(:disabled),a,summary,input')].filter(node=>node.getClientRects().length);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    });
    return {close};
  }
  document.addEventListener('error',event=>{if(event.target instanceof HTMLImageElement&&event.target.closest('.atlasThumb'))event.target.classList.add('atlasPhotoFailed');},true);
  window.GymAtlas={entries,byId,match,search,label,category,unitLabel,thumbnail,imageUrl,open,normalize,escape:esc,muscleNames};
})();
