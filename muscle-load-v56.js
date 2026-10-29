/* Derived visualization only. Never writes workouts, profiles or localStorage. */
(() => {
  'use strict';
  const DEFAULT_PRIMARY_SHARE=.70;
  const labels={
    chest:['Груди','Chest'],shoulders:['Дельти','Shoulders'],triceps:['Трицепс','Triceps'],
    biceps:['Біцепс','Biceps'],forearms:['Передпліччя','Forearms'],lats:['Найширші','Lats'],
    'middle back':['Середина спини','Middle back'],'lower back':['Поперек','Lower back'],
    traps:['Трапеції','Traps'],neck:['Шия','Neck'],abdominals:['Прес','Abs'],
    quadriceps:['Квадрицепс','Quadriceps'],hamstrings:['Задня поверхня стегна','Hamstrings'],
    glutes:['Сідниці','Glutes'],calves:['Литки','Calves'],adductors:['Привідні м’язи','Adductors'],
    abductors:['Відвідні м’язи','Abductors'],cardio:['Кардіо','Cardio'],other:['Інше','Other']
  };
  const aliases={'lower legs':'calves','upper traps':'traps','frontDelts':'shoulders',
    abs:'abdominals',core:'abdominals',supraspinatus:'shoulders'};
  const unique=items=>[...new Set((Array.isArray(items)?items:[])
    .filter(x=>typeof x==='string'&&x.trim()).map(x=>aliases[x]||x))];
  function roles(exercise,lookup){
    const entry=lookup?.(exercise);
    const primary=unique(entry?.primaryMuscles);
    if(!primary.length)return {primary:['category:'+(exercise?.category||'other')],secondary:[],matched:false};
    const secondary=unique(entry?.secondaryMuscles).filter(x=>!primary.includes(x));
    return {primary,secondary,matched:true};
  }
  function distribute(value,roleData,primaryShare=DEFAULT_PRIMARY_SHARE){
    if(!Number.isFinite(primaryShare)||primaryShare<0||primaryShare>1)throw new RangeError('Invalid primary share');
    if(!Number.isFinite(value)||value<=0)return [];
    const primary=unique(roleData?.primary);
    if(!primary.length)return [];
    const secondary=unique(roleData?.secondary).filter(x=>!primary.includes(x));
    const main=secondary.length?primaryShare:1;
    const rows=primary.map(id=>({id,value:value*main/primary.length,role:'primary'}));
    rows.push(...secondary.map(id=>({id,value:value*(1-main)/secondary.length,role:'secondary'})));
    // Floating point remainder is assigned once, never counted a second time.
    rows[rows.length-1].value+=value-rows.reduce((sum,row)=>sum+row.value,0);
    return rows;
  }
  function aggregate(workouts,exercises,options={}){
    const byId=new Map((exercises||[]).map(ex=>[ex.id,ex]));
    const mode=options.mode==='sets'?'sets':'volume';
    const totals=new Map();let total=0,unmatched=0;
    for(const workout of workouts||[])for(const item of workout.items||[]){
      const exercise=byId.get(item.exerciseId);
      const sets=Array.isArray(item.sets)?item.sets:[];
      const value=mode==='sets'?sets.length:Number(options.volumeOfSets?.(sets)||0);
      if(!Number.isFinite(value)||value<=0)continue;
      const data=roles(exercise,options.lookup);
      if(!data.matched)unmatched+=value;
      total+=value;
      for(const row of distribute(value,data,options.primaryShare??DEFAULT_PRIMARY_SHARE)){
        const entry=totals.get(row.id)||{id:row.id,value:0,primary:0,secondary:0};
        entry.value+=row.value;entry[row.role]+=row.value;totals.set(row.id,entry);
      }
    }
    return {mode,total,unmatched,primaryShare:options.primaryShare??DEFAULT_PRIMARY_SHARE,
      rows:[...totals.values()].filter(row=>row.value>0).sort((a,b)=>b.value-a.value||a.id.localeCompare(b.id))};
  }
  function percentages(rows){
    const total=rows.reduce((sum,row)=>sum+row.value,0);
    if(!(total>0))return rows.map(()=>0);
    const raw=rows.map(row=>100*row.value/total),result=raw.map(Math.floor);
    const order=raw.map((v,i)=>({i,remainder:v-result[i]})).sort((a,b)=>b.remainder-a.remainder||a.i-b.i);
    for(let n=100-result.reduce((a,b)=>a+b,0),i=0;i<n;i++)result[order[i].i]++;
    return result;
  }
  function label(id,lang='ua',categoryLabel=id=>id){
    if(id.startsWith('category:'))return categoryLabel(id.slice(9));
    return labels[id]?.[lang==='en'?1:0]||id;
  }
  window.GymMuscleLoad=Object.freeze({DEFAULT_PRIMARY_SHARE,roles,distribute,aggregate,percentages,label});
})();
