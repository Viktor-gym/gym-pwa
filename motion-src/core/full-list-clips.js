import {alignBarGrip,alignNeutralGrip,curlProgress,phaseAt,pressProgress} from './math.js';
import {camera,point,feet,flat,barCenter} from './template-clips.js';

function hand(T,d,pose,side,grip,pole,axis=null){
  const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]),offset=new T.Vector3(...d.handGrip);
  const rotation=axis?alignBarGrip(T,shoulder,grip,pole,axis,offset,d.upperArm,d.forearm):alignNeutralGrip(T,shoulder,grip,pole,side,offset,d.upperArm,d.forearm);
  pose.hands[side]={grip,rotation,pole,closure:1};
}
function seated(T,y=0.66,lean=0){return {pelvis:new T.Vector3(0,y,0),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),lean),hands:{},feet:feet(T,0.23,0.42)};}
const reference=id=>'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/'+id+'.json';
function flatPress(T,d,time,duration,dumbbells){
  const pose=flat(T),p=pressProgress(phaseAt(time,duration));
  for(const side of [-1,1]){
    const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
    const width=dumbbells?0.38-0.18*p:0.22;
    hand(T,d,pose,side,new T.Vector3(shoulder.x-0.14*(1-p),shoulder.y+0.15+0.52*p,side*width),new T.Vector3(shoulder.x-0.21,shoulder.y-0.18,side*(dumbbells?0.42:0.24)),new T.Vector3(0,0,1));
  }
  return barCenter(T,pose);
}

export const FULL_LIST_CLIPS={
  'flat-dumbbell-press':{
    id:'flat-dumbbell-press',name:'Flat dumbbell bench press',duration:4.8,equipment:'flat-dumbbells',grip:'pronated',
    muscles:{primary:['chest'],secondary:['frontDelts','triceps']},camera:{target:[-0.1,0.75,0],height:2.2,views:[[2.9,2.2,4],[0,1.4,5],[-2.7,2,4]]},reference:reference('Dumbbell_Bench_Press'),
    sample(T,d,t){return flatPress(T,d,t,this.duration,true);}
  },
  'close-grip-bench-press':{
    id:'close-grip-bench-press',name:'Close grip bench press',duration:4.8,equipment:'flat-close-barbell',grip:'pronated-close',
    muscles:{primary:['triceps'],secondary:['chest','frontDelts']},camera:{target:[-0.1,0.75,0],height:2.25,views:[[2.9,2.2,4],[0,1.4,5],[-2.7,2,4]]},reference:reference('Close-Grip_Barbell_Bench_Press'),
    sample(T,d,t){return flatPress(T,d,t,this.duration,false);}
  },
  'seated-dumbbell-press':{
    id:'seated-dumbbell-press',name:'Seated dumbbell shoulder press',duration:4.8,equipment:'seated-press-dumbbells',grip:'pronated',
    muscles:{primary:['frontDelts'],secondary:['triceps']},camera:camera([0,1.03,0],2.35),reference:reference('Seated_Dumbbell_Press'),
    sample(T,d,t){
      const pose=seated(T,0.66,-0.08),p=pressProgress(phaseAt(t,this.duration));
      for(const side of [-1,1]){
        const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
        hand(T,d,pose,side,new T.Vector3(side*(0.45-0.30*p),shoulder.y+0.11+0.56*p,0.04),new T.Vector3(side*0.47,shoulder.y-0.24,-0.02),new T.Vector3(1,0,0));
      }
      return pose;
    }
  },
  'straight-arm-pulldown':{
    id:'straight-arm-pulldown',name:'Straight arm pulldown',duration:4.8,equipment:'standing-pulldown',grip:'pronated',
    muscles:{primary:['lats'],secondary:['core']},camera:camera([0,1.0,0.25],2.55),reference:reference('Straight-Arm_Pulldown'),
    sample(T,d,t){
      const pose={pelvis:new T.Vector3(0,0.97,0),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),0.45),hands:{},feet:feet(T,0.18,-0.06)};
      const angle=0.06-1.40*curlProgress(phaseAt(t,this.duration));
      for(const side of [-1,1]){
        const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
        const direction=new T.Vector3(0,Math.sin(angle),Math.cos(angle)),rotationGuess=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),direction);
        const grip=shoulder.clone().add(new T.Vector3(side*0.09,direction.y*0.58,direction.z*0.58)).add(new T.Vector3(...d.handGrip).applyQuaternion(rotationGuess));
        hand(T,d,pose,side,grip,shoulder.clone().add(new T.Vector3(side*0.2,-0.30,-0.1)),new T.Vector3(1,0,0));
      }
      return barCenter(T,pose);
    }
  },
  'wide-lat-pulldown':{
    id:'wide-lat-pulldown',name:'Wide grip lat pulldown',duration:4.8,equipment:'lat-pulldown',grip:'pronated-wide',
    muscles:{primary:['lats'],secondary:['biceps','upperBack']},camera:camera([0,1.1,0.12],2.65),reference:reference('Wide-Grip_Lat_Pulldown'),
    sample(T,d,t){
      const pose=seated(T,0.66,-0.12),p=curlProgress(phaseAt(t,this.duration)),shoulder=point(T,pose,[0,d.shoulderHeight,0.008]);
      for(const side of [-1,1])hand(T,d,pose,side,new T.Vector3(side*0.43,shoulder.y+0.63-0.53*p,0.15+0.10*p),new T.Vector3(side*0.48,shoulder.y-0.24,-0.04),new T.Vector3(1,0,0));
      return barCenter(T,pose);
    }
  },
  'seated-cable-row':{
    id:'seated-cable-row',name:'Seated neutral cable row',duration:4.6,equipment:'seated-row-cable',grip:'neutral',
    muscles:{primary:['upperBack','lats'],secondary:['biceps']},camera:camera([0,0.85,0.35],2.35),reference:reference('Seated_Cable_Rows'),
    sample(T,d,t){
      const pose=seated(T,0.62),p=curlProgress(phaseAt(t,this.duration));
      pose.feet=feet(T,0.18,0.72);for(const foot of Object.values(pose.feet))foot.ankle.y=0.13;
      for(const side of [-1,1])hand(T,d,pose,side,new T.Vector3(side*0.10,0.96-0.08*p,0.62-0.40*p),new T.Vector3(side*0.38,0.86,-0.24));
      return barCenter(T,pose);
    }
  },
  'leverage-row':{
    id:'leverage-row',name:'Chest supported leverage row',duration:4.8,equipment:'leverage-row',grip:'neutral',
    muscles:{primary:['lats','upperBack'],secondary:['biceps']},camera:camera([0,0.95,0.30],2.4),reference:reference('Leverage_Iso_Row'),
    sample(T,d,t){
      const pose=seated(T,0.66,0.12);pose.machineAngle=0.35*curlProgress(phaseAt(t,this.duration));
      for(const side of [-1,1]){
        const grip=new T.Vector3(-side*0.20,0.70,-0.55).applyAxisAngle(new T.Vector3(1,0,0),-pose.machineAngle).add(new T.Vector3(side*0.55,0.40,1.20));
        const axis=new T.Vector3(0,-side,0).applyAxisAngle(new T.Vector3(1,0,0),-pose.machineAngle);
        hand(T,d,pose,side,grip,new T.Vector3(side*0.43,0.91,-0.20),axis);
      }
      return pose;
    }
  },
  'bent-barbell-row':{
    id:'bent-barbell-row',name:'Bent over barbell row',duration:4.8,equipment:'row-barbell',grip:'pronated',
    muscles:{primary:['upperBack','lats'],secondary:['biceps','core']},camera:camera([0,0.95,0.1],2.25),reference:reference('Bent_Over_Barbell_Row'),
    sample(T,d,t){
      const pose={pelvis:new T.Vector3(0,0.91,-0.16),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),1.0),hands:{},feet:feet(T,0.18)};
      const p=curlProgress(phaseAt(t,this.duration));
      for(const side of [-1,1])hand(T,d,pose,side,new T.Vector3(side*0.27,0.505+0.405*p,0.32-0.14*p),new T.Vector3(side*0.32,1.03,-0.18),new T.Vector3(1,0,0));
      return barCenter(T,pose);
    }
  },
  'trap-bar-deadlift':{
    id:'trap-bar-deadlift',name:'Trap bar deadlift',duration:5.0,equipment:'trap-bar',grip:'neutral',
    muscles:{primary:['quadriceps','glutes'],secondary:['hamstrings','core','upperBack']},camera:camera([0,0.95,0.12],2.35),reference:reference('Trap_Bar_Deadlift'),
    sample(T,d,t){
      const p=curlProgress(phaseAt(t,this.duration)),pose={pelvis:new T.Vector3(0,0.59+0.424*p,-0.14*(1-p)),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),0.82*(1-p)),hands:{},feet:feet(T,0.16)};
      const shoulder=point(T,pose,[0,d.shoulderHeight,0.008]);
      for(const side of [-1,1])hand(T,d,pose,side,new T.Vector3(side*0.34,shoulder.y-0.685,shoulder.z),new T.Vector3(side*0.39,shoulder.y-0.32,shoulder.z-0.10),new T.Vector3(0,0,-side));
      return barCenter(T,pose);
    }
  },
  'kneeling-single-arm-pulldown':{
    id:'kneeling-single-arm-pulldown',name:'Half kneeling single arm high pulley row',duration:4.8,equipment:'kneeling-cable',grip:'neutral',
    muscles:{primary:['lats'],secondary:['biceps','upperBack','core']},camera:camera([0,0.96,0.25],2.5),reference:reference('Kneeling_Single-Arm_High_Pulley_Row'),
    sample(T,d,t){
      const p=curlProgress(phaseAt(t,this.duration)),pose=seated(T,0.54);
      const hip=point(T,pose,[d.hipWidth/2,-d.hipDrop,0]),kneeZ=Math.sqrt(d.thigh**2-(hip.y-0.095)**2);
      pose.feet[1]={ankle:new T.Vector3(hip.x,0.18,kneeZ-Math.sqrt(d.shin**2-0.085**2)),pole:new T.Vector3(hip.x,0.095,kneeZ),rotation:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),0.65)};
      pose.feet[-1]={ankle:new T.Vector3(-0.18,0.09,0.62),pole:new T.Vector3(-0.20,0.52,0.45),rotation:new T.Quaternion()};
      hand(T,d,pose,1,new T.Vector3(0.29,1.57-0.55*p,0.35-0.03*p),new T.Vector3(0.48,0.83,-0.03));
      hand(T,d,pose,-1,new T.Vector3(-0.18,0.59,0.47),new T.Vector3(-0.35,0.81,0.26));pose.hands[-1].closure=0.2;
      return pose;
    }
  },
  'hanging-leg-raise':{
    id:'hanging-leg-raise',name:'Hanging straight leg raise',duration:4.8,equipment:'hanging-bar',grip:'pronated',
    muscles:{primary:['core'],secondary:['forearms']},camera:camera([0,1.18,0.30],2.85),reference:reference('Hanging_Leg_Raise'),
    sample(T,d,t){
      const p=curlProgress(phaseAt(t,this.duration)),angle=Math.PI/2*p,pose={pelvis:new T.Vector3(0,1.08,0),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-0.04*p),hands:{},feet:{}};
      for(const side of [-1,1]){
        const hip=point(T,pose,[side*d.hipWidth/2,-d.hipDrop,0]),knee=hip.clone().add(new T.Vector3(0,-Math.cos(angle)*d.thigh,Math.sin(angle)*d.thigh));
        const ankle=knee.clone().add(new T.Vector3(0,-Math.cos(angle-0.04)*d.shin,Math.sin(angle-0.04)*d.shin));
        pose.feet[side]={ankle,pole:knee,rotation:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-angle)};
        hand(T,d,pose,side,new T.Vector3(side*0.30,2.27,0),new T.Vector3(side*0.42,1.85,0.06),new T.Vector3(1,0,0));
      }
      return pose;
    }
  }
};
