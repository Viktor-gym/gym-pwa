/* Optional, profile-local body metrics. No network access or unit conversion. */
(() => {
  'use strict';
  const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
  const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
  function parseInput(raw){
    const text=String(raw??'').trim();
    if(!text)return {empty:true};
    if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text))return {invalid:true};
    const value=Number(text.replace(',','.'));
    return Number.isFinite(value)?{value}:{invalid:true};
  }
  function normalizeValues(raw){
    if(!object(raw))return {};
    return Object.fromEntries(Object.entries(raw).flatMap(([id,value])=>{
      if(typeof value==='number'&&Number.isFinite(value))return [[id,value]];
      if(object(value)&&typeof value.systolic==='number'&&typeof value.diastolic==='number'&&Number.isFinite(value.systolic)&&Number.isFinite(value.diastolic))return [[id,{systolic:value.systolic,diastolic:value.diastolic}]];
      return [];
    }));
  }
  function normalizeMetrics(raw){
    const seen=new Set();
    return (Array.isArray(raw)?raw:[]).filter(object).flatMap((metric,index)=>{
      const id=String(metric.id||'metric-import-'+index),name=String(metric.name||'').trim(),unit=String(metric.unit||'').trim();
      if(!name||!unit||seen.has(id))return [];
      seen.add(id);
      return [{id,name,unit,type:metric.type==='pressure'?'pressure':'number',archived:metric.archived===true}];
    });
  }
  const metricKey=metric=>JSON.stringify([String(metric.name).normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase(),String(metric.unit).normalize('NFKC').trim(),metric.type==='pressure'?'pressure':'number']);
  const fingerprint=raw=>JSON.stringify(Object.entries(normalizeValues(raw)).sort(([a],[b])=>a<b?-1:a>b?1:0));
  function mergeDefinitions(targetRaw,incomingRaw,makeId){
    const metrics=normalizeMetrics(targetRaw).map(metric=>({...metric}));
    const byId=new Map(metrics.map(metric=>[metric.id,metric])),byKey=new Map(metrics.map(metric=>[metricKey(metric),metric]));
    const idMap=new Map();
    let added=0;
    for(const metric of normalizeMetrics(incomingRaw)){
      const existing=byKey.get(metricKey(metric));
      if(existing){idMap.set(metric.id,existing.id);continue;}
      const copy={...metric};
      if(byId.has(copy.id)){do{copy.id=makeId();}while(byId.has(copy.id));}
      metrics.push(copy);byId.set(copy.id,copy);byKey.set(metricKey(copy),copy);idMap.set(metric.id,copy.id);added++;
    }
    return {metrics,idMap,added};
  }
  const remapValues=(raw,idMap)=>Object.fromEntries(Object.entries(normalizeValues(raw)).map(([id,value])=>[idMap.get(id)||id,value]));
  function combineValues(targetRaw,incomingRaw){
    const target=normalizeValues(targetRaw),incoming=normalizeValues(incomingRaw);
    for(const [id,value]of Object.entries(incoming))if(own(target,id)&&JSON.stringify(target[id])!==JSON.stringify(value))return null;
    return {...target,...incoming};
  }
  const hasValue=(record,metric)=>{
    const values=normalizeValues(record?.custom);
    return own(values,metric.id)&&(metric.type==='pressure'?object(values[metric.id]):typeof values[metric.id]==='number');
  };
  window.GymBodyMetrics={parseInput,normalizeValues,normalizeMetrics,metricKey,fingerprint,mergeDefinitions,remapValues,combineValues,hasValue};
})();
