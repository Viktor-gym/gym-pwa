export const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
export const smooth=value=>{const t=clamp(value);return t*t*t*(10+t*(-15+t*6));};
export const phaseAt=(time,duration)=>((time%duration)+duration)%duration/duration;

export function pressProgress(phase){
  if(phase<0.04)return 1;
  if(phase<0.60)return 1-smooth((phase-0.04)/0.56);
  if(phase<0.65)return 0;
  if(phase<0.97)return smooth((phase-0.65)/0.32);
  return 1;
}

export function curlProgress(phase){
  if(phase<0.06)return 0;
  if(phase<0.45)return smooth((phase-0.06)/0.39);
  if(phase<0.53)return 1;
  if(phase<0.98)return 1-smooth((phase-0.53)/0.45);
  return 0;
}

export function frameQuaternion(T,forward,xReference){
  const y=forward.clone().normalize();
  let x=xReference.clone().addScaledVector(y,-xReference.dot(y));
  if(x.lengthSq()<1e-10)x=new T.Vector3(1,0,0).addScaledVector(y,-y.x);
  if(x.lengthSq()<1e-10)x=new T.Vector3(0,0,1).addScaledVector(y,-y.z);
  x.normalize();
  const z=new T.Vector3().crossVectors(x,y).normalize();
  x.crossVectors(y,z).normalize();
  return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z));
}

// A pole chooses the bending plane; the endpoint is clamped, never the bones.
export function solveTwoBone(T,start,target,pole,upperLength,lowerLength){
  const axis=target.clone().sub(start),requested=axis.length();
  if(requested<1e-10)axis.set(0,-1,0);else axis.divideScalar(requested);
  const distance=clamp(requested,Math.abs(upperLength-lowerLength)+1e-6,upperLength+lowerLength-1e-6);
  const end=start.clone().addScaledVector(axis,distance);
  const along=(upperLength**2-lowerLength**2+distance**2)/(2*distance);
  const height=Math.sqrt(Math.max(0,upperLength**2-along**2));
  const perpendicular=pole.clone().sub(start).addScaledVector(axis,-pole.clone().sub(start).dot(axis));
  if(perpendicular.lengthSq()<1e-10){perpendicular.set(0,0,1).addScaledVector(axis,-axis.z);if(perpendicular.lengthSq()<1e-10)perpendicular.set(1,0,0);}
  perpendicular.normalize();
  return {joint:start.clone().addScaledVector(axis,along).addScaledVector(perpendicular,height),end,reachError:Math.abs(requested-distance)};
}

export function poseSegment(T,group,start,end,xReference=new T.Vector3(1,0,0)){
  group.position.copy(start).add(end).multiplyScalar(0.5);
  group.quaternion.copy(frameQuaternion(T,end.clone().sub(start),xReference));
}

export function alignBarGrip(T,shoulder,grip,pole,axis,offset,upperLength,lowerLength){
  const reference=axis.clone().normalize();
  let rotation=frameQuaternion(T,new T.Vector3(0,1,0),reference);
  for(let iteration=0;iteration<16;iteration++){
    const target=grip.clone().sub(offset.clone().applyQuaternion(rotation));
    const solved=solveTwoBone(T,shoulder,target,pole,upperLength,lowerLength);
    const forward=solved.end.clone().sub(solved.joint);forward.addScaledVector(reference,-forward.dot(reference));
    if(forward.lengthSq()<1e-10)break;
    rotation=frameQuaternion(T,forward,reference);
  }
  return rotation;
}

export function alignNeutralGrip(T,shoulder,grip,pole,side,offset,upperLength,lowerLength){
  const palm=new T.Vector3(-side,0,0);
  let rotation=frameQuaternion(T,new T.Vector3(0,0,1),new T.Vector3(0,-side,0));
  for(let i=0;i<16;i++){
    const wrist=grip.clone().sub(offset.clone().applyQuaternion(rotation));
    const solved=solveTwoBone(T,shoulder,wrist,pole,upperLength,lowerLength),forward=solved.end.clone().sub(solved.joint).normalize();
    rotation=frameQuaternion(T,forward,new T.Vector3().crossVectors(forward,palm));
  }
  return rotation;
}
