import {poseSegment} from './math.js';

export class GripHand {
  constructor(T,factory,parent,side,gripOffset){
    this.T=T;this.root=new T.Group();this.root.name=`hand-${side}`;parent.add(this.root);
    this.gripOffset=new T.Vector3(...gripOffset);
    factory.oval(this.root,[0,0.041,0],[0.037,0.046,0.020]);
    factory.oval(this.root,[0,0.005,-0.002],[0.029,0.021,0.023]);
    this.fingers=[];
    const angles=[-140,-65,10,85].map(value=>value*Math.PI/180),radius=0.028;
    const points=angles.map(angle=>new T.Vector3(0,this.gripOffset.y+radius*Math.cos(angle),this.gripOffset.z+radius*Math.sin(angle)));
    for(let index=0;index<4;index++){
      const root=new T.Group();root.position.set((index-1.5)*0.017,points[0].y,points[0].z);this.root.add(root);
      const joints=[],absolute=[];let parent=root;
      for(let bone=0;bone<3;bone++){
        const direction=points[bone+1].clone().sub(points[bone]),length=direction.length(),joint=new T.Group();
        parent.add(joint);const geometry=factory.limb(length,0.0056-bone*0.0006,0.0052-bone*0.0005,0.0003);
        const mesh=factory.mesh(geometry,factory.materials.skin,joint);mesh.position.y=length/2;
        factory.oval(joint,[0,length,0],[0.0057,0.0057,0.0057]);
        const next=new T.Group();next.position.y=length;joint.add(next);parent=next;
        absolute.push(Math.atan2(direction.z,direction.y));joints.push(joint);
      }
      this.fingers.push({joints,angles:absolute.map((angle,i)=>angle-(i?absolute[i-1]:0))});
    }
    this.thumb={sign:-side,root:new T.Vector3(-side*0.043,0.034,0.007),segments:[]};
    const ends=[this.thumb.root.clone(),new T.Vector3(-side*0.025,0.055,0.026),new T.Vector3(-side*0.006,0.073,0.040)];
    for(let i=0;i<2;i++){
      const group=new T.Group();this.root.add(group);factory.mesh(factory.limb(ends[i].distanceTo(ends[i+1]),0.008-i*0.001,0.0065-i*0.001,0.0005),factory.materials.skin,group);
      this.thumb.segments.push({group,start:ends[i],end:ends[i+1]});
    }
    this.setClosure(1);
  }
  setClosure(value){
    const closure=Math.max(0,Math.min(1,value));
    for(const finger of this.fingers)finger.joints.forEach((joint,index)=>{joint.rotation.x=finger.angles[index]*closure;});
    let start=this.thumb.root.clone();
    for(const bone of this.thumb.segments){
      const direction=bone.end.clone().sub(bone.start);
      direction.applyAxisAngle(new this.T.Vector3(0,1,0),this.thumb.sign*(1-closure)*0.8);
      poseSegment(this.T,bone.group,start,start.clone().add(direction));
      start.add(direction);
    }
  }
  setPose(wrist,rotation,closure=1){this.root.position.copy(wrist);this.root.quaternion.copy(rotation);this.setClosure(closure);}
  gripPosition(){return this.gripOffset.clone().applyQuaternion(this.root.quaternion).add(this.root.position);}
}
