/* Only the two exercise consolidations explicitly requested by the owner. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GymExerciseIdentity=api;
})(typeof window==='object'?window:null,()=>{
  'use strict';
  const groups=[
    {from:'Machine_Preacher_Curls',to:'Cable_Preacher_Curl',prefer:'target',ua:'Біцепс на лавці Скотта',en:'Machine Preacher Curl'},
    {from:'Leverage_Chest_Press',to:'Leverage_Incline_Chest_Press',prefer:'source',ua:'Жим у Hammer під кутом',en:'Incline Hammer Press'}
  ];
  const aliases=Object.freeze(Object.fromEntries(groups.map(g=>[g.from,g.to])));
  const canonicalId=id=>Object.hasOwn(aliases,id)?aliases[id]:id;
  const groupExercises=(data,group,resolve)=>(Array.isArray(data?.exercises)?data.exercises:[]).filter(ex=>ex&&[group.from,group.to].includes(resolve(ex)||ex.catalogId)&&(!ex.trackingType||ex.trackingType==='strength'));
  function needsMerge(data,resolve=ex=>ex.catalogId){
    return groups.some(group=>{const list=groupExercises(data,group,resolve);return list.length>1||list.some(ex=>(resolve(ex)||ex.catalogId)===group.from);});
  }
  function mergeProfile(input,resolve=ex=>ex.catalogId){
    if(!input||!Array.isArray(input.exercises))return input;
    let data=input;
    for(const group of groups){
      const matching=groupExercises(data,group,resolve);
      if(!matching.length)continue;
      const source=matching.find(ex=>(resolve(ex)||ex.catalogId)===group.from);
      const target=matching.find(ex=>(resolve(ex)||ex.catalogId)===group.to);
      if(!source&&matching.length===1)continue;
      const keeper=(group.prefer==='source'?source||target:target||source)||matching[0];
      const ids=new Set(matching.map(ex=>String(ex.id))),remap=id=>ids.has(String(id))?String(keeper.id):id;
      const refs=value=>{
        if(Array.isArray(value))return value.map(refs);
        if(!value||typeof value!=='object')return value;
        return Object.fromEntries(Object.entries(value).map(([key,item])=>[
          key,key==='exerciseId'?remap(item):key==='exerciseIds'&&Array.isArray(item)?[...new Set(item.map(remap))]:refs(item)
        ]));
      };
      const items=list=>{
        const result=[];let merged;
        for(const item of list||[]){
          if(!ids.has(String(item.exerciseId))){result.push(item);continue;}
          const current={...item,exerciseId:String(keeper.id)};
          if(!merged){merged=current;result.push(merged);}
          else if(Array.isArray(current.sets))merged.sets=[...(merged.sets||[]),...current.sets];
        }
        return result;
      };
      const workouts=list=>(list||[]).map(w=>({...refs(w),...(Array.isArray(w.items)?{items:items(w.items)}:{})}));
      const prs=Object.create(null);
      for(const [id,record] of Object.entries(data.prs||{})){
        const key=remap(id),current=prs[key];
        const score=r=>Number(r?.value??r?.weight)||0;
        if(!current||score(record)>score(current)||(score(record)===score(current)&&Number(record?.reps)>Number(current?.reps)))prs[key]=record;
      }
      const exercise={...keeper,catalogId:group.to,name_ua:group.ua,name_en:group.en};
      data={...data,
        exercises:data.exercises.filter(ex=>!ids.has(String(ex.id))||ex.id===keeper.id).map(ex=>ex.id===keeper.id?exercise:ex),
        workouts:workouts(data.workouts),
        ...(Array.isArray(data.logs)?{logs:workouts(data.logs)}:{}),
        workoutTemplates:workouts(data.workoutTemplates),plannedWorkouts:workouts(data.plannedWorkouts),
        favorites:[...new Set((data.favorites||[]).map(remap))],
        goals:refs(data.goals||[]),recommendations:refs(data.recommendations||[]),
        ...(data.ui?{ui:refs(data.ui)}:{}),prs
      };
    }
    return data;
  }
  return {aliases,canonicalId,needsMerge,mergeProfile};
});
