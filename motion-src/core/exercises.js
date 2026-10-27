import {alignBarGrip,frameQuaternion,phaseAt,pressProgress,curlProgress} from './math.js';
import {TEMPLATE_CLIPS} from './template-clips.js';

export const EXERCISES=Object.freeze({
  ...TEMPLATE_CLIPS,
  'bench-press':{
    id:'bench-press',name:'Жим штанги лежачи',duration:4.8,equipment:'bench-barbell',
    muscles:{primary:['chest','triceps'],secondary:['frontDelts']},
    camera:{target:[-0.13,0.75,0],height:2.20,views:[[2.9,2.5,4.0],[0.10,1.45,5.0],[-2.6,2.1,3.6]]},
    reference:'https://www.nasm.org/resource-center/exercise-library/barbell-bench-press',
    sample(T,dimensions,time){
      const p=pressProgress(phaseAt(time,this.duration));
      const trunk=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(new T.Vector3(0,0,1),new T.Vector3(1,0,0),new T.Vector3(0,1,0)));
      const pelvis=new T.Vector3(-0.36,0.63,0),shoulderX=pelvis.x+dimensions.shoulderHeight,shoulderY=pelvis.y+0.008;
      const gripWidth=0.34,gripOffsetY=dimensions.handGrip[1],gripOffsetX=-dimensions.handGrip[2],bottomY=0.79;
      const elbowY=bottomY-gripOffsetY-dimensions.forearm;
      const dx=Math.sqrt(dimensions.upperArm**2-(shoulderY-elbowY)**2-(gripWidth-dimensions.shoulderWidth/2)**2);
      const bottomX=shoulderX-dx+gripOffsetX,topX=shoulderX+gripOffsetX;
      const topY=shoulderY+Math.sqrt((dimensions.upperArm+dimensions.forearm-0.006)**2-(gripWidth-dimensions.shoulderWidth/2)**2)+gripOffsetY;
      const bar=new T.Vector3(bottomX+(topX-bottomX)*p,bottomY+(topY-bottomY)*p,0);
      const hands={},feet={};
      for(const side of [-1,1]){
        const grip=bar.clone().add(new T.Vector3(0,0,side*gripWidth)),pole=new T.Vector3(bottomX-gripOffsetX,elbowY,side*gripWidth);
        const shoulder=new T.Vector3(shoulderX,shoulderY,side*dimensions.shoulderWidth/2);
        const rotation=alignBarGrip(T,shoulder,grip,pole,new T.Vector3(0,0,1),new T.Vector3(...dimensions.handGrip),dimensions.upperArm,dimensions.forearm);
        hands[side]={grip,rotation,pole,closure:1};
        feet[side]={ankle:new T.Vector3(-0.94,0.09,side*0.27),pole:new T.Vector3(-0.90,0.61,side*0.28),rotation:new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-Math.PI/2)};
      }
      return {pelvis,trunk,hands,feet,bar};
    }
  },
  'dumbbell-curl':{
    id:'dumbbell-curl',name:'Згинання рук із гантелями',duration:4.4,equipment:'dumbbells',
    muscles:{primary:['biceps'],secondary:['forearms']},
    camera:{target:[0,0.97,0.04],height:2.17,views:[[2.5,1.75,4.5],[0,1.1,5],[4.5,1.3,1.3]]},
    reference:'https://www.catalystathletics.com/exercise/908/Supinating-Dumbbell-Curl/',
    sample(T,dimensions,time){
      const p=curlProgress(phaseAt(time,this.duration)),angle=0.12+2.20*p;
      const pelvis=new T.Vector3(0,1.014,0),trunk=new T.Quaternion(),hands={},feet={};
      for(const side of [-1,1]){
        const shoulder=new T.Vector3(side*dimensions.shoulderWidth/2,pelvis.y+dimensions.shoulderHeight,0.008);
        const upper=new T.Vector3(side*0.028,-dimensions.upperArm,0.015).normalize().multiplyScalar(dimensions.upperArm),elbow=shoulder.clone().add(upper);
        const direction=new T.Vector3(0,-Math.cos(angle),Math.sin(angle)),wrist=elbow.clone().addScaledVector(direction,dimensions.forearm);
        const turn=T.MathUtils.smoothstep(p,0.05,0.75);
        const rotation=frameQuaternion(T,direction,new T.Vector3(-turn,0,-side*(1-turn)));
        const grip=new T.Vector3(...dimensions.handGrip).applyQuaternion(rotation).add(wrist);
        hands[side]={grip,rotation,pole:elbow,closure:1};
        feet[side]={ankle:new T.Vector3(side*0.145,0.09,0.015),pole:new T.Vector3(side*0.145,0.55,0.30),rotation:new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),side*0.07)};
      }
      return {pelvis,trunk,hands,feet};
    }
  }
});

export function getExercise(id,registry=EXERCISES){const clip=registry[id];if(!clip)throw new Error(`Unknown exercise: ${id}`);return clip;}
