import {MeshFactory,disposeGeometry} from './mesh.js';
import {poseSegment,solveTwoBone} from './math.js';
import {GripHand} from './hand.js';

export const DIMENSIONS=Object.freeze({upperArm:0.34,forearm:0.28,thigh:0.445,shin:0.43,shoulderWidth:0.42,shoulderHeight:0.49,hipWidth:0.24,hipDrop:0.055,handGrip:Object.freeze([0,0.095,0.028])});
export const MUSCLES=Object.freeze({chest:'Груди',triceps:'Трицепс',biceps:'Біцепс',forearms:'Передпліччя',frontDelts:'Передні дельти',upperBack:'Верх спини',lats:'Найширші',core:'Прес',quadriceps:'Квадрицепс',hamstrings:'Задня поверхня стегна',glutes:'Сідниці',calves:'Литки'});

export class Mannequin {
  constructor(T,materials){
    this.T=T;this.materials=materials;this.dimensions=DIMENSIONS;
    this.root=new T.Group();this.root.name='gym-athlete-v2';
    this.torso=new T.Group();this.torso.name='pelvis-and-spine';this.root.add(this.torso);
    this.factory=new MeshFactory(T,materials);this.surfaces=[];this.limbs=[];this.diagnostics=[];
    this.makeTorso();this.makeHead();
    for(const side of [-1,1])this.makeSide(side);
    this.setMuscles({primary:[],secondary:[]});
  }
  registerSurface(geometry,weights,clothMask=()=>false){
    const T=this.T,count=geometry.attributes.position.count;
    const fields=Object.fromEntries(Object.keys(weights).map(name=>[name,new Float32Array(count)]));
    const clothing=new Uint8Array(count);
    for(let i=0;i<count;i++){
      const p=new T.Vector3().fromBufferAttribute(geometry.attributes.position,i);clothing[i]=clothMask(p)?1:0;
      for(const [name,fn]of Object.entries(weights))fields[name][i]=Math.max(0,Math.min(1,fn(p)));
    }
    geometry.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(count*3),3));
    this.surfaces.push({geometry,fields,clothing});return geometry;
  }
  makeTorso(){
    const T=this.T,positions=[],indices=[],rings=58,sides=64;
    for(let i=0;i<=rings;i++){
      const u=i/rings,y=-0.09+0.65*u,chest=Math.exp(-Math.pow((y-0.39)/0.15,2)),waist=Math.exp(-Math.pow((y-0.14)/0.10,2));
      const taper=1-T.MathUtils.smoothstep(y,0.49,0.56)*0.58;
      const width=(0.169-0.023*waist+0.067*chest)*taper,depth=0.116-0.018*waist+0.025*chest;
      for(let j=0;j<=sides;j++){
        const angle=j/sides*Math.PI*2,x=width*Math.sin(angle),front=Math.max(0,Math.cos(angle));
        const split=Math.sin(Math.min(1,Math.abs(x)/width)*Math.PI),pecBump=0.009*chest*front**4*split;
        positions.push(x,y,depth*Math.cos(angle)+pecBump);
      }
    }
    for(let i=0;i<rings;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,a+1,b,b,a+1,b+1);}
    const bottom=positions.length/3;positions.push(0,-0.09,0);const top=positions.length/3;positions.push(0,0.56,0);
    for(let j=0;j<sides;j++){indices.push(j+1,j,bottom);const a=rings*(sides+1)+j;indices.push(a,a+1,top);}
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    const smooth=T.MathUtils.smoothstep,front=p=>smooth(p.z,0.04,0.10),back=p=>smooth(-p.z,0.04,0.10);
    this.registerSurface(geometry,{
      chest:p=>smooth(p.y,0.20,0.28)*(1-smooth(p.y,0.47,0.54))*front(p)*smooth(Math.abs(p.x),0.012,0.032),
      core:p=>(1-smooth(p.y,0.23,0.30))*smooth(p.y,0.04,0.10)*front(p),
      upperBack:p=>smooth(p.y,0.25,0.42)*back(p),
      lats:p=>smooth(Math.abs(p.x),0.09,0.15)*smooth(p.y,0.10,0.25)*back(p),
      glutes:p=>(1-smooth(p.y,-0.02,0.08))*back(p)
    },p=>p.y<0.045);
    this.factory.mesh(geometry,this.materials.tinted,this.torso,'torso');
    this.factory.oval(this.torso,[0,0.595,0],[0.075,0.098,0.077]);
  }
  makeHead(){
    const f=this.factory,p=this.torso;
    const head=f.oval(p,[0,0.765,0.002],[0.092,0.123,0.103],this.materials.skin,'head');head.receiveShadow=false;
    const jaw=f.oval(p,[0,0.706,0.033],[0.069,0.050,0.058]);jaw.castShadow=false;jaw.receiveShadow=false;
    const nose=f.oval(p,[0,0.765,0.105],[0.018,0.027,0.025]);nose.castShadow=false;
    const mouth=f.oval(p,[0,0.705,0.087],[0.022,0.003,0.005],this.materials.sculpt);mouth.castShadow=false;mouth.receiveShadow=false;
    for(const side of [-1,1]){
      f.oval(p,[side*0.094,0.765,0.002],[0.014,0.027,0.018]);
      f.oval(p,[side*0.032,0.789,0.096],[0.022,0.006,0.007],this.materials.sculpt);
      f.oval(p,[side*0.033,0.802,0.092],[0.026,0.009,0.009]);
    }
  }
  makeSide(side){
    const T=this.T,f=this.factory,d=this.dimensions;
    const arm={side,shoulder:new T.Vector3(),elbow:new T.Vector3(),wrist:new T.Vector3()};
    const leg={side,hip:new T.Vector3(),knee:new T.Vector3(),ankle:new T.Vector3()};
    const group=name=>{const g=new T.Group();g.name=`${name}-${side}`;this.root.add(g);return g;};
    arm.upper=group('upper-arm');arm.lower=group('forearm');
    const upper=f.limb(d.upperArm,0.058,0.044,0.018),belly=p=>Math.sin(Math.PI*(p.y/d.upperArm+0.5));
    this.registerSurface(upper,{biceps:p=>T.MathUtils.smoothstep(p.z,-0.005,0.03)*belly(p),triceps:p=>(1-T.MathUtils.smoothstep(p.z,-0.025,0.01))*belly(p)});
    f.mesh(upper,this.materials.tinted,arm.upper);
    const forearm=f.limb(d.forearm,0.043,0.028,0.012);
    this.registerSurface(forearm,{forearms:p=>Math.sin(Math.PI*(p.y/d.forearm+0.5))*0.9});f.mesh(forearm,this.materials.tinted,arm.lower);
    arm.joint=f.oval(this.root,[0,0,0],[0.045,0.045,0.045]);
    const deltoid=f.sphere.clone();this.registerSurface(deltoid,{frontDelts:p=>T.MathUtils.smoothstep(p.z,0.0,0.75)});
    arm.deltoid=f.mesh(deltoid,this.materials.tinted,this.root);arm.deltoid.scale.set(0.094,0.105,0.094);
    arm.hand=new GripHand(T,f,this.root,side,d.handGrip);
    leg.upper=group('thigh');leg.lower=group('shin');
    const thigh=f.limb(d.thigh,0.077,0.058,0.018);
    this.registerSurface(thigh,{quadriceps:p=>T.MathUtils.smoothstep(p.z,0.0,0.045),hamstrings:p=>T.MathUtils.smoothstep(-p.z,0.0,0.045)},p=>p.y<-d.thigh*0.06);
    f.mesh(thigh,this.materials.tinted,leg.upper);
    leg.joint=f.oval(this.root,[0,0,0],[0.056,0.054,0.056]);
    const shin=f.limb(d.shin,0.044,0.027,0.015);
    this.registerSurface(shin,{calves:p=>T.MathUtils.smoothstep(-p.z,0,0.025)*Math.sin(Math.PI*(p.y/d.shin+0.5))});f.mesh(shin,this.materials.tinted,leg.lower);
    leg.foot=group('foot');f.oval(leg.foot,[0,-0.035,0.058],[0.050,0.045,0.126],this.materials.cloth);
    f.oval(leg.foot,[0,-0.067,0.060],[0.052,0.012,0.128],this.materials.sole);
    f.oval(leg.foot,[0,-0.005,0],[0.034,0.034,0.038]);
    this.limbs.push({arm,leg});
  }
  setMuscles(selection){
    this.muscles={primary:[...(selection.primary||[])],secondary:[...(selection.secondary||[])]};
    const palette=this.materials.palette,T=this.T,color=new T.Color();
    for(const {geometry,fields,clothing}of this.surfaces){
      const colors=geometry.attributes.color;
      for(let i=0;i<colors.count;i++){
        let primary=0,secondary=0;
        for(const name of this.muscles.primary)primary=Math.max(primary,fields[name]?.[i]||0);
        for(const name of this.muscles.secondary)secondary=Math.max(secondary,fields[name]?.[i]||0);
        color.copy(clothing[i]?this.materials.cloth.color:palette.neutral);
        if(!clothing[i]){if(primary>0)color.lerp(palette.primary,primary*0.86);else if(secondary>0)color.lerp(palette.secondary,secondary*0.76);}
        colors.setXYZ(i,color.r,color.g,color.b);
      }
      colors.needsUpdate=true;
    }
  }
  localPoint(point){return new this.T.Vector3(...point).applyQuaternion(this.torso.quaternion).add(this.torso.position);}
  applyPose(pose){
    const T=this.T,d=this.dimensions;this.torso.position.copy(pose.pelvis);this.torso.quaternion.copy(pose.trunk);this.diagnostics=[];
    for(const {arm,leg}of this.limbs){
      const hand=pose.hands[arm.side],foot=pose.feet[arm.side];
      arm.shoulder.copy(this.localPoint([arm.side*d.shoulderWidth/2,d.shoulderHeight,0.008]));
      const wristTarget=hand.grip.clone().sub(arm.hand.gripOffset.clone().applyQuaternion(hand.rotation));
      const solved=solveTwoBone(T,arm.shoulder,wristTarget,hand.pole,d.upperArm,d.forearm);
      arm.elbow.copy(solved.joint);arm.wrist.copy(solved.end);arm.joint.position.copy(arm.elbow);
      let hinge=new T.Vector3().crossVectors(arm.elbow.clone().sub(arm.shoulder),arm.wrist.clone().sub(arm.elbow));
      if(hinge.lengthSq()<1e-10)hinge.set(1,0,0);
      poseSegment(T,arm.upper,arm.shoulder,arm.elbow,hinge);
      const handX=new T.Vector3(1,0,0).applyQuaternion(hand.rotation);poseSegment(T,arm.lower,arm.elbow,arm.wrist,handX);
      arm.deltoid.position.copy(arm.shoulder);arm.deltoid.quaternion.copy(this.torso.quaternion);
      arm.hand.setPose(arm.wrist,hand.rotation,hand.closure??1);
      leg.hip.copy(this.localPoint([leg.side*d.hipWidth/2,-d.hipDrop,0]));
      const knee=solveTwoBone(T,leg.hip,foot.ankle,foot.pole,d.thigh,d.shin);leg.knee.copy(knee.joint);leg.ankle.copy(knee.end);
      const footX=new T.Vector3(1,0,0).applyQuaternion(foot.rotation);
      poseSegment(T,leg.upper,leg.hip,leg.knee,footX);poseSegment(T,leg.lower,leg.knee,leg.ankle,footX);
      leg.joint.position.copy(leg.knee);leg.foot.position.copy(leg.ankle);leg.foot.quaternion.copy(foot.rotation);
      this.diagnostics.push({side:arm.side,armReachError:solved.reachError,legReachError:knee.reachError,upperArm:arm.shoulder.distanceTo(arm.elbow),forearm:arm.elbow.distanceTo(arm.wrist),thigh:leg.hip.distanceTo(leg.knee),shin:leg.knee.distanceTo(leg.ankle)});
    }
    this.root.updateMatrixWorld(true);
    return this.limbs.map(({arm})=>({side:arm.side,position:arm.hand.gripPosition(),rotation:arm.hand.root.quaternion.clone()}));
  }
  dispose(){disposeGeometry(this.root);}
}
