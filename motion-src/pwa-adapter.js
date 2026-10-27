import * as THREE from 'three';
import {createViewer} from './core/viewer.js';
import {gripLabel} from './core/grips.js';

export function mount(host,{clipId,lang='ua',signal,onFallback}){
  const en=lang==='en',stage=host.querySelector('.atlasCustomStage');
  let viewer=null,disposed=false;
  const probe=document.createElement('span');probe.hidden=true;stage.append(probe);
  const getColors=()=>{
    const color=token=>{probe.style.color=`var(${token})`;return new THREE.Color(getComputedStyle(probe).color);};
    return {foreground:color('--motion-ink'),background:color('--motion-background'),muted:color('--motion-muted'),primary:color('--motion-primary'),secondary:color('--motion-secondary')};
  };
  const dispose=()=>{if(disposed)return;disposed=true;viewer?.dispose();probe.remove();delete host.gymMotion;};
  const fail=()=>{if(disposed)return;dispose();if(!signal?.aborted)onFallback?.();};
  try{
    viewer=createViewer(THREE,stage,getColors);
    const play=host.querySelector('[data-play]'),seek=host.querySelector('[data-seek]'),speed=host.querySelector('[data-speed]');
    const update=({playing,time,clip})=>{
      play.textContent=playing?(en?'Ⅱ Pause':'Ⅱ Пауза'):(en?'▶ Play':'▶ Показ руху');
      const position=((time%clip.duration)+clip.duration)%clip.duration/clip.duration;
      seek.value=String(Math.round(position*1000));host.querySelector('[data-progress]').textContent=Math.round(position*100)+'%';
    };
    viewer.onChange(update);viewer.setExercise(clipId);
    const hint=host.querySelector('.atlasFootnote'),label=gripLabel(viewer.engine.clip,lang);
    if(hint&&label){hint.dataset.grip='true';hint.textContent=(en?'Grip: ':'Хват: ')+label+'. '+hint.textContent;}
    const gripButton=document.createElement('button');gripButton.className='btn';gripButton.dataset.gripView='true';gripButton.textContent=en?'Grip detail':'Деталі хвату';gripButton.setAttribute('aria-pressed','false');
    gripButton.onclick=()=>{const detailed=viewer.toggleGripView();gripButton.textContent=detailed?(en?'Whole movement':'Уся вправа'):(en?'Grip detail':'Деталі хвату');gripButton.setAttribute('aria-pressed',String(detailed));};
    host.querySelector('.atlasCustomControls').append(gripButton);
    stage.querySelector('.atlasCustomPoster').hidden=true;
    host.gymMotion=viewer;stage.dataset.ready='true';
    play.onclick=()=>viewer.snapshot().playing?viewer.pause():viewer.play();
    host.querySelector('[data-restart]').onclick=()=>{viewer.renderAt(0);viewer.play();};
    speed.onclick=()=>{const value=viewer.snapshot().speed===1?0.5:1;viewer.setSpeed(value);speed.textContent=value+'×';};
    host.querySelector('[data-angle]').onclick=()=>viewer.nextView();
    seek.oninput=()=>viewer.renderAt(Number(seek.value)/1000*viewer.engine.clip.duration);
    viewer.renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();fail();},{signal});
    signal?.addEventListener('abort',dispose,{once:true});
    if(signal?.aborted)dispose();
    return {dispose};
  }catch(error){dispose();throw error;}
}
