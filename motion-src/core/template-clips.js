import {alignBarGrip,curlProgress,frameQuaternion,phaseAt,pressProgress,solveTwoBone} from './math.js';

const camera=(target,height=2.3)=>({target,height,views:[[3,2.1,4.6],[0,1.25,5],[4.6,1.7,0.8]]});
const point=(T,pose,xyz)=>new T.Vector3(...xyz).applyQuaternion(pose.trunk).add(pose.pelvis);
function feet(T,width=0.145,z=0.015){return Object.fromEntries([-1,1].map(side=>[side,{ankle:new T.Vector3(side*width,0.09,z),pole:new T.Vector3(side*width,0.54,z+0.32),rotation:new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),side*0.07)}]));}
function flat(T){
  const trunk=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(new T.Vector3(0,0,1),new T.Vector3(1,0,0),new T.Vector3(0,1,0)));
  const pose={pelvis:new T.Vector3(-0.36,0.63,0),trunk,hands:{},feet:{}};
  for(const side of [-1,1])pose.feet[side]={ankle:new T.Vector3(-0.94,0.09,side*0.27),pole:new T.Vector3(-0.9,0.61,side*0.28),rotation:new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-Math.PI/2)};
  return pose;
}
function bentHand(T,d,shoulder,elbow,direction,axis){
  const wrist=elbow.clone().addScaledVector(direction,d.forearm),rotation=frameQuaternion(T,direction,axis);
  return {grip:new T.Vector3(...d.handGrip).applyQuaternion(rotation).add(wrist),rotation,pole:elbow,closure:1};
}
function barCenter(T,pose){pose.bar=pose.hands[-1].grip.clone().add(pose.hands[1].grip).multiplyScalar(0.5);return pose;}
function incline(T,d,time,duration,dumbbells){
  const pose=flat(T),tilt=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),Math.PI/6);pose.trunk.premultiply(tilt);
  const p=pressProgress(phaseAt(time,duration));
  for(const side of [-1,1]){
    const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
    const grip=new T.Vector3(shoulder.x-0.10*(1-p),shoulder.y+0.12+0.55*p,side*(dumbbells?0.37-0.16*p:0.34));
    const pole=new T.Vector3(shoulder.x-0.20,shoulder.y-0.14,side*0.41);
    const rotation=alignBarGrip(T,shoulder,grip,pole,new T.Vector3(0,0,1),new T.Vector3(...d.handGrip),d.upperArm,d.forearm);
    pose.hands[side]={grip,rotation,pole,closure:1};
  }
  return barCenter(T,pose);
}

export const TEMPLATE_CLIPS={
  'incline-barbell-press':{
    id:'incline-barbell-press',name:'Incline barbell press',duration:4.8,equipment:'incline-barbell',
    muscles:{primary:['chest'],secondary:['frontDelts','triceps']},camera:{target:[-0.1,0.9,0],height:2.45,views:[[2.8,2.3,4.6],[0,1.2,5],[-3,1.8,4]]},
    reference:'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip.json',
    sample(T,d,time){return incline(T,d,time,this.duration,false);}
  },
  'incline-dumbbell-press':{
    id:'incline-dumbbell-press',name:'Incline dumbbell press',duration:4.8,equipment:'incline-dumbbells',
    muscles:{primary:['chest'],secondary:['frontDelts','triceps']},camera:{target:[-0.1,0.9,0],height:2.4,views:[[2.8,2.3,4.6],[0,1.2,5],[-3,1.8,4]]},
    reference:'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Incline_Dumbbell_Press.json',
    sample(T,d,time){return incline(T,d,time,this.duration,true);}
  },
  'barbell-curl':{
    id:'barbell-curl',name:'Barbell curl',duration:4.4,equipment:'curl-barbell',
    muscles:{primary:['biceps'],secondary:['forearms']},camera:camera([0,0.97,0.1],2.2),
    reference:'https://www.strengthlog.com/barbell-curl/',
    sample(T,d,time){
      const p=curlProgress(phaseAt(time,this.duration)),angle=0.1+2.15*p;
      const pose={pelvis:new T.Vector3(0,1.014,0),trunk:new T.Quaternion(),hands:{},feet:feet(T)};
      for(const side of [-1,1]){
        const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
        const elbow=shoulder.clone().add(new T.Vector3(side*0.025,-d.upperArm,0.015).normalize().multiplyScalar(d.upperArm));
        pose.hands[side]=bentHand(T,d,shoulder,elbow,new T.Vector3(0,-Math.cos(angle),Math.sin(angle)),new T.Vector3(-1,0,0));
      }
      return barCenter(T,pose);
    }
  },
  'cable-preacher-curl':{
    id:'cable-preacher-curl',name:'Cable preacher curl',duration:4.6,equipment:'preacher-cable',
    muscles:{primary:['biceps'],secondary:['forearms']},camera:camera([0,0.92,0.25],2.35),
    reference:'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Cable_Preacher_Curl.json',
    sample(T,d,time){
      const angle=0.75+1.85*curlProgress(phaseAt(time,this.duration));
      const pose={pelvis:new T.Vector3(0,0.62,0),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),0.20),hands:{},feet:feet(T,0.23,0.40)};
      for(const side of [-1,1]){
        const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
        const elbow=shoulder.clone().add(new T.Vector3(0,-0.8,0.6).multiplyScalar(d.upperArm));
        pose.hands[side]=bentHand(T,d,shoulder,elbow,new T.Vector3(0,-Math.cos(angle),Math.sin(angle)),new T.Vector3(-1,0,0));
      }
      return barCenter(T,pose);
    }
  },
  'lying-triceps-press':{
    id:'lying-triceps-press',name:'Lying triceps press',duration:4.6,equipment:'flat-triceps-bar',
    muscles:{primary:['triceps'],secondary:['forearms']},camera:{target:[-0.02,0.75,0],height:2.2,views:[[2.9,2.3,4],[0,1.4,5],[-2.5,1.8,4]]},
    reference:'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Lying_Triceps_Press.json',
    sample(T,d,time){
      const pose=flat(T),p=pressProgress(phaseAt(time,this.duration)),angle=0.08+1.72*(1-p);
      for(const side of [-1,1]){
        const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
        const elbow=shoulder.clone().add(new T.Vector3(0,Math.sqrt(d.upperArm**2-0.03**2),-side*0.03));
        pose.hands[side]=bentHand(T,d,shoulder,elbow,new T.Vector3(Math.sin(angle),Math.cos(angle),0),new T.Vector3(0,0,1));
      }
      return barCenter(T,pose);
    }
  },
  'cable-crossover':{
    id:'cable-crossover',name:'High cable crossover',duration:4.8,equipment:'cable-crossover',
    muscles:{primary:['chest'],secondary:['frontDelts']},camera:camera([0,1.02,0.15],2.55),
    reference:'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Cable_Crossover.json',
    sample(T,d,time){
      const p=curlProgress(phaseAt(time,this.duration)),pose={pelvis:new T.Vector3(0,0.99,0),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),0.14),hands:{},feet:feet(T,0.18)};
      for(const side of [-1,1]){
        pose.feet[side].ankle.z=side===1?0.19:-0.14;
        const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
        const direction=new T.Vector3(side*0.98,-0.17,0.05).lerp(new T.Vector3(-side*0.27,-0.44,0.855),p).normalize();
        const wrist=shoulder.clone().addScaledVector(direction,0.59),pole=shoulder.clone().add(new T.Vector3(side*0.34,-0.35,-0.15));
        const elbow=solveTwoBone(T,shoulder,wrist,pole,d.upperArm,d.forearm).joint;
        const rotation=frameQuaternion(T,wrist.clone().sub(elbow),new T.Vector3(0,1,0));
        pose.hands[side]={grip:new T.Vector3(...d.handGrip).applyQuaternion(rotation).add(wrist),rotation,pole,closure:1};
      }
      return pose;
    }
  },
  'concentration-curl':{
    id:'concentration-curl',name:'Seated concentration curl',duration:4.6,equipment:'concentration-dumbbell',
    muscles:{primary:['biceps'],secondary:['forearms']},camera:camera([0,0.78,0.25],2.05),
    reference:'https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Concentration_Curls.json',
    sample(T,d,time){
      const angle=0.12+2.15*curlProgress(phaseAt(time,this.duration));
      const pose={pelvis:new T.Vector3(0,0.58,0),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),0.70),hands:{},feet:feet(T,0.39,0.42)};
      const shoulder=point(T,pose,[d.shoulderWidth/2,d.shoulderHeight,0.008]);
      const elbow=shoulder.clone().add(new T.Vector3(0.065,-0.31,0.123).normalize().multiplyScalar(d.upperArm));
      pose.hands[1]=bentHand(T,d,shoulder,elbow,new T.Vector3(0,-Math.cos(angle),Math.sin(angle)),new T.Vector3(-1,0,0));
      const resting=point(T,pose,[-d.shoulderWidth/2,d.shoulderHeight,0.008]),target=new T.Vector3(-0.42,0.59,0.44),pole=new T.Vector3(-0.46,0.80,0.27);
      const joint=solveTwoBone(T,resting,target,pole,d.upperArm,d.forearm).joint,rotation=frameQuaternion(T,target.clone().sub(joint),new T.Vector3(1,0,0));
      pose.hands[-1]={grip:new T.Vector3(...d.handGrip).applyQuaternion(rotation).add(target),rotation,pole,closure:0.25};
      return pose;
    }
  },
  'hammer-incline-press':{
    id:'hammer-incline-press',name:'Leverage incline chest press',duration:4.8,equipment:'hammer-incline',
    muscles:{primary:['chest'],secondary:['frontDelts','triceps']},camera:camera([0,1.0,0.05],2.65),
    reference:'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/plate-loaded-iso-lateral-incline-press',
    sample(T,d,time){
      const p=pressProgress(phaseAt(time,this.duration));
      const pose={pelvis:new T.Vector3(0,0.66,0),trunk:new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-0.20),hands:{},feet:feet(T,0.22,0.40),machineAngle:0.50*p};
      for(const side of [-1,1]){
        const shoulder=point(T,pose,[side*d.shoulderWidth/2,d.shoulderHeight,0.008]);
        const pivot=new T.Vector3(side*0.56,1.95,-0.35);
        const grip=new T.Vector3(-side*0.21,-0.90,0.46).applyAxisAngle(new T.Vector3(1,0,0),-pose.machineAngle).add(pivot);
        const pole=new T.Vector3(side*0.48,0.94,-0.05),rotation=alignBarGrip(T,shoulder,grip,pole,new T.Vector3(1,0,0),new T.Vector3(...d.handGrip),d.upperArm,d.forearm);
        pose.hands[side]={grip,rotation,pole,closure:1};
      }
      return pose;
    }
  }
};

export {camera,point,feet,flat,barCenter};
