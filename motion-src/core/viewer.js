import {createMaterials} from './mesh.js';
import {ExerciseEngine} from './engine.js';

export function createViewer(T,stage,getColors){
  const colors=getColors(),materials=createMaterials(T,colors),engine=new ExerciseEngine(T,materials),scene=new T.Scene();scene.add(engine.root);
  const renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=0.98;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;stage.append(renderer.domElement);
  const camera=new T.OrthographicCamera(-1.6,1.6,1.1,-1.1,0.05,30);
  const hemi=new T.HemisphereLight(new T.Color(1,1,1),colors.muted,0.85);scene.add(hemi);
  const key=new T.DirectionalLight(new T.Color(1,1,1),2.2);key.position.set(-1,5,3);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-3,right:3,top:3,bottom:-3});key.shadow.normalBias=0.013;scene.add(key);
  const fill=new T.DirectionalLight(new T.Color(1,1,1),0.8);fill.position.set(3,3,-4);scene.add(fill);
  const dark=colors.foreground.r+colors.foreground.g+colors.foreground.b<colors.background.r+colors.background.g+colors.background.b?colors.foreground:colors.background;
  const floor=new T.Mesh(new T.PlaneGeometry(8,8),new T.ShadowMaterial({color:dark,opacity:0.13}));floor.rotation.x=-Math.PI/2;floor.position.y=0.005;floor.receiveShadow=true;scene.add(floor);
  let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,speed=1,time=0,view=0,disposed=false,last=performance.now(),frameId=0;
  const listeners=new Set(),controller=new AbortController();
  const notify=()=>listeners.forEach(fn=>fn({playing,speed,time,clip:engine.clip,view}));
  function draw(){if(!disposed)renderer.render(scene,camera);}
  function resize(){
    const width=stage.clientWidth;if(!width||!engine.clip)return;
    const height=width/1.25,half=engine.clip.camera.height/2;renderer.setSize(width,height,false);
    camera.left=-half*1.25;camera.right=half*1.25;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();draw();
  }
  function updateView(){const meta=engine.clip.camera;camera.position.set(...meta.views[view%meta.views.length]);camera.lookAt(new T.Vector3(...meta.target));resize();}
  function pause(){playing=false;notify();}
  const api={
    engine,renderer,scene,camera,
    onChange(fn){listeners.add(fn);return ()=>listeners.delete(fn);},
    setExercise(id){engine.setExercise(id);time=0;view=0;last=performance.now();updateView();notify();},
    renderAt(seconds){if(disposed)return;time=seconds;playing=false;engine.poseAt(time);draw();notify();},
    play(){playing=true;last=performance.now();notify();},pause,
    setSpeed(value){if(![0.5,1].includes(value))throw new Error('Unsupported speed');speed=value;notify();},
    nextView(){view=(view+1)%engine.clip.camera.views.length;updateView();notify();},
    updateTheme(){
      const next=getColors(),updated=createMaterials(T,next);
      for(const [key,value]of Object.entries(updated)){if(value?.isMaterial){materials[key].color.copy(value.color);value.dispose();}}
      for(const name of ['neutral','primary','secondary'])materials.palette[name].copy(updated.palette[name]);
      engine.model.setMuscles(engine.clip.muscles);hemi.groundColor.copy(next.muted);
      const shadow=next.foreground.r+next.foreground.g+next.foreground.b<next.background.r+next.background.g+next.background.b?next.foreground:next.background;
      floor.material.color.copy(shadow);draw();
    },
    snapshot(){return {playing,speed,time,view,exerciseId:engine.clip.id,modelId:engine.model.root.uuid};},
    dispose(){
      if(disposed)return;disposed=true;cancelAnimationFrame(frameId);controller.abort();observer.disconnect();listeners.clear();engine.dispose();
      floor.geometry.dispose();floor.material.dispose();for(const value of Object.values(materials))if(value?.isMaterial)value.dispose();renderer.dispose();renderer.domElement.remove();
    }
  };
  const observer=new ResizeObserver(resize);observer.observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();},{signal:controller.signal});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>api.updateTheme(),{signal:controller.signal});
  let themeFrame=0;
  const themeObserver=new MutationObserver(()=>{cancelAnimationFrame(themeFrame);themeFrame=requestAnimationFrame(()=>{if(engine.clip&&!disposed)api.updateTheme();});});themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
  controller.signal.addEventListener('abort',()=>{themeObserver.disconnect();cancelAnimationFrame(themeFrame);},{once:true});
  function tick(now){
    if(!stage.isConnected){api.dispose();return;}
    if(playing&&!document.hidden&&engine.clip){time+=Math.min(0.06,(now-last)/1000)*speed;engine.poseAt(time);draw();notify();}
    last=now;frameId=requestAnimationFrame(tick);
  }
  frameId=requestAnimationFrame(tick);return api;
}
