import {MeshFactory,disposeGeometry} from './mesh.js';

export const TEMPLATE_EQUIPMENT=new Set(['incline-barbell','incline-dumbbells','curl-barbell','preacher-cable','flat-triceps-bar','cable-crossover','concentration-dumbbell','hammer-incline','flat-dumbbells','flat-close-barbell','seated-press-dumbbells','standing-pulldown','lat-pulldown','seated-row-cable','leverage-row','row-barbell','trap-bar','kneeling-cable','hanging-bar']);

export function createTemplateEquipment(T,materials,type){
  const root=new T.Group();root.name=`equipment-${type}`;
  const f=new MeshFactory(T,materials),handles=[],ropes=[],levers=[],braces=[];let moving=null;
  const group=(name,parent=root)=>{const node=new T.Group();node.name=name;parent.add(node);return node;};
  const line=(a,b,radius=0.007,material=materials.cloth)=>f.rod(root,a,b,radius,material);
  const movableLine=(name)=>{const mesh=f.mesh(new T.CylinderGeometry(0.006,0.006,1,12),materials.cloth,root,name);ropes.push(mesh);return mesh;};
  const setLine=(mesh,a,b)=>{const delta=b.clone().sub(a);mesh.position.copy(a).add(b).multiplyScalar(0.5);mesh.scale.y=delta.length();mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());};
  function plate(parent,position,axis='x',radius=0.13){
    const mesh=f.mesh(new T.CylinderGeometry(radius,radius,0.04,36),materials.plate,parent);mesh.position.set(...position);mesh.rotation[axis==='x'?'z':'x']=Math.PI/2;
    const hub=f.mesh(new T.CylinderGeometry(0.035,0.035,0.049,24),materials.metal,parent);hub.position.copy(mesh.position);hub.quaternion.copy(mesh.quaternion);
  }
  function bar(axis='x',width=1.30,weighted=true){
    const node=group('barbell'),a=axis==='x'?[-width/2,0,0]:[0,0,-width/2],b=a.map(value=>-value);
    f.rod(node,a,b,0.0145);
    if(weighted)for(const side of [-1,1])plate(node,axis==='x'?[side*(width/2-0.13),0,0]:[0,0,side*(width/2-0.13)],axis);
    handles.push(node);return node;
  }
  function dumbbell(side){
    const node=group('dumbbell-'+side);node.userData.side=side;handles.push(node);f.rod(node,[-0.14,0,0],[0.14,0,0],0.015);
    for(const x of [-0.115,0.115]){const weight=f.mesh(new T.CylinderGeometry(0.075,0.075,0.055,8),materials.plate,node);weight.rotation.z=Math.PI/2;weight.position.x=x;}
  }
  function seat(y=0.46,width=0.65,z=0){
    f.box(root,[0,y,z],[width,0.07,0.38],materials.pad);
    for(const x of [-width*0.34,width*0.34]){f.box(root,[x,y/2,z],[0.045,y-0.06,0.045]);f.box(root,[x,0.035,z],[0.12,0.05,0.52]);}
  }
  function bench(incline=false){
    const node=group('bench-pad');
    if(incline){node.position.set(-0.055,0.622,0);node.rotation.z=Math.PI/6;f.box(node,[0,0,0],[1.1,0.07,0.32],materials.pad);}
    else{node.position.set(0.03,0.46,0);f.box(node,[0,0,0],[1.25,0.08,0.32],materials.pad);}
    for(const x of [-0.48,0.46]){const y=incline?(x<0?0.33:0.83):0.41;f.box(root,[x,y/2,0],[0.06,y-0.045,0.07]);f.box(root,[x,0.035,0],[0.30,0.05,0.62]);}
    line([-0.48,0.2,0],[0.46,0.2,0],0.025,materials.metal);
  }
  function pulley(position){
    const mesh=f.mesh(new T.TorusGeometry(0.065,0.015,10,32),materials.plate,root,'pulley');mesh.position.set(...position);mesh.rotation.y=Math.PI/2;
    f.rod(root,[position[0]-0.05,position[1],position[2]],[position[0]+0.05,position[1],position[2]],0.015);
  }
  if(type==='flat-dumbbells'||type==='flat-close-barbell'){
    bench();if(type==='flat-dumbbells')for(const side of [-1,1])dumbbell(side);else bar('z',1.8);
  }else if(type==='row-barbell'){bar('x',1.55);}
  else if(type==='seated-press-dumbbells'){
    seat(0.50,0.5);const back=group('upright-bench');back.position.set(0,0.95,-0.15);back.rotation.x=-0.08;f.box(back,[0,0,0],[0.32,0.86,0.065],materials.pad);for(const side of [-1,1])dumbbell(side);
  }else if(['standing-pulldown','lat-pulldown','kneeling-cable','seated-row-cable'].includes(type)){
    const high=type!=='seated-row-cable',height=high?2.15:0.70,z=high?1.10:1.20;
    for(const x of [-0.82,-0.48])f.box(root,[x,height/2+0.05,z],[0.045,height,0.07]);
    f.box(root,[-0.41,0.035,z],[0.94,0.06,0.45]);
    for(let i=0;i<8;i++)f.box(root,[-0.65,0.12+i*0.04,z],[0.30,0.028,0.16],materials.plate);
    const pulleyY=high?height:0.18;line([0,pulleyY,z],[-0.82,pulleyY,z],0.025,materials.metal);pulley([0,pulleyY,z]);movableLine(type+'-cable');
    if(type==='lat-pulldown'){
      seat(0.50,0.5);for(const side of [-1,1])f.oval(root,[side*0.18,0.63,0.25],[0.18,0.07,0.07],materials.pad);bar('x',1.2,false);
    }else if(type==='standing-pulldown'){bar('x',0.90,false);}
    else if(type==='kneeling-cable'){
      const node=group('single-cable-handle');node.userData.side=1;handles.push(node);f.rod(node,[-0.06,0,0],[0.06,0,0],0.015,materials.cloth);f.rod(node,[-0.06,0,0],[0,0.10,0],0.009);f.rod(node,[0.06,0,0],[0,0.10,0],0.009);
      f.box(root,[0.12,0.02,0.05],[0.30,0.035,0.40],materials.pad);
    }else{
      seat(0.46,0.5,-0.12);
      for(const side of [-1,1]){
        f.box(root,[side*0.18,0.02,0.79],[0.21,0.05,0.22],materials.plate);
        const node=group('v-handle-'+side);node.userData.side=side;handles.push(node);f.rod(node,[-0.085,0,0],[0.085,0,0],0.016,materials.cloth);
        braces.push(f.mesh(new T.CylinderGeometry(0.01,0.01,1,16),materials.metal,root));
      }
    }
  }else if(type==='leverage-row'){
    seat(0.50,0.50);f.box(root,[0,0.97,0.20],[0.32,0.34,0.07],materials.pad);f.box(root,[0,0.48,0.28],[0.055,0.93,0.07]);f.box(root,[0,0.05,0.55],[1.5,0.08,1.65]);
    for(const side of [-1,1]){
      f.box(root,[side*0.55,0.23,1.20],[0.075,0.38,0.10]);
      const lever=group('row-lever-'+side);lever.position.set(side*0.55,0.40,1.20);levers.push(lever);f.rod(lever,[0,0,0],[-side*0.20,0.70,-0.55],0.026);
      const handle=group('row-handle-'+side,lever);handle.position.set(-side*0.20,0.70,-0.55);handle.userData.side=side;handles.push(handle);f.rod(handle,[0,-0.10,0],[0,0.10,0],0.017,materials.cloth);
      f.rod(lever,[0,0.43,-0.30],[side*0.30,0.43,-0.30],0.025);plate(lever,[side*0.20,0.43,-0.30],'x',0.17);plate(lever,[side*0.25,0.43,-0.30],'x',0.17);
    }
  }else if(type==='trap-bar'){
    moving=group('hex-bar');const vertices=[[-0.45,0,-0.25],[-0.25,0,-0.43],[0.25,0,-0.43],[0.45,0,-0.25],[0.45,0,0.25],[0.25,0,0.43],[-0.25,0,0.43],[-0.45,0,0.25]];
    vertices.forEach((a,i)=>f.rod(moving,a,vertices[(i+1)%vertices.length],0.022));
    for(const side of [-1,1]){
      const handle=group('trap-handle-'+side,moving);handle.position.set(side*0.34,0,0);handle.userData.side=side;handles.push(handle);f.rod(handle,[0,0,-0.16],[0,0,0.16],0.016);
      for(const z of [-0.16,0.16])f.rod(moving,[side*0.34,0,z],[side*0.45,0,z],0.017);
      f.rod(moving,[side*0.45,0,0],[side*0.87,0,0],0.024);plate(moving,[side*0.69,0,0],'x',0.22);plate(moving,[side*0.74,0,0],'x',0.22);
    }
  }else if(type==='hanging-bar'){
    for(const side of [-1,1]){f.box(root,[side*0.72,1.12,-0.27],[0.065,2.2,0.08]);f.box(root,[side*0.72,0.035,-0.20],[0.25,0.05,0.85]);line([side*0.72,2.24,-0.27],[side*0.72,2.27,0],0.028,materials.metal);}
    line([-0.76,2.27,0],[0.76,2.27,0],0.016,materials.cloth);
  }else if(type==='incline-barbell'||type==='incline-dumbbells'){
    bench(true);if(type==='incline-barbell')bar('z',1.8);else for(const side of [-1,1])dumbbell(side);
  }else if(type==='flat-triceps-bar'){bench();bar('z',1.15);}
  else if(type==='curl-barbell'){bar();}
  else if(type==='preacher-cable'){
    seat();const pad=group('preacher-pad');pad.position.set(0,0.928,0.154);pad.rotation.x=Math.acos(0.6);f.box(pad,[0,0,0],[0.66,0.065,0.43],materials.pad);
    f.box(root,[0,0.46,0.16],[0.065,0.86,0.065]);f.box(root,[0,0.04,0.12],[0.8,0.05,0.7]);
    for(const x of [-0.82,-0.48])f.box(root,[x,0.65,1.25],[0.045,1.25,0.06]);
    f.box(root,[-0.41,0.04,1.17],[0.94,0.06,0.32]);
    for(let i=0;i<7;i++)f.box(root,[-0.65,0.15+i*0.04,1.25],[0.30,0.028,0.15],materials.plate);
    pulley([0,0.14,1.10]);bar('x',0.65,false);movableLine('preacher-cable');
  }else if(type==='concentration-dumbbell'){seat(0.43,0.9);dumbbell(1);}
  else if(type==='cable-crossover'){
    for(const side of [-1,1]){
      f.box(root,[side*1.0,1.0,-0.22],[0.12,1.95,0.18]);f.box(root,[side*1.0,0.035,-0.22],[0.34,0.06,0.72]);
      for(let i=0;i<8;i++)f.box(root,[side*1.0,0.12+i*0.04,-0.10],[0.22,0.028,0.15],materials.plate);
      pulley([side*1.0,1.90,-0.22]);movableLine('crossover-cable-'+side);
      const node=group('cable-handle-'+side);node.userData.side=side;handles.push(node);
      f.rod(node,[-0.06,0,0],[0.06,0,0],0.014,materials.cloth);
      f.rod(node,[-0.06,0,0],[0,-0.10,0],0.009);f.rod(node,[0.06,0,0],[0,-0.10,0],0.009);
    }
    line([-1.0,1.98,-0.22],[1.0,1.98,-0.22],0.035,materials.metal);
  }else if(type==='hammer-incline'){
    seat(0.50,0.48);const back=group('machine-back');back.position.set(0,0.93,-0.14);back.rotation.x=-0.20;f.box(back,[0,0,0],[0.36,0.78,0.075],materials.pad);
    f.box(root,[0,0.07,-0.24],[1.55,0.10,0.90]);
    for(const side of [-1,1]){
      f.box(root,[side*0.56,1.0,-0.35],[0.07,1.9,0.09]);
      const lever=group('press-lever-'+side);lever.position.set(side*0.56,1.95,-0.35);levers.push(lever);
      f.rod(lever,[0,0,0],[-side*0.21,-0.90,0.46],0.025);
      const handle=group('press-handle-'+side,lever);handle.position.set(-side*0.21,-0.90,0.46);handle.userData.side=side;handles.push(handle);f.rod(handle,[-0.10,0,0],[0.10,0,0],0.017,materials.cloth);
      f.rod(lever,[0,-0.6,0.3],[side*0.32,-0.6,0.3],0.022);
      plate(lever,[side*0.20,-0.6,0.3]);plate(lever,[side*0.25,-0.6,0.3]);
    }
    line([-0.56,1.95,-0.35],[0.56,1.95,-0.35],0.035,materials.metal);
  }else throw new Error('Unsupported template equipment: '+type);
  return {root,handles,update(pose,grips){
    if(['incline-barbell','curl-barbell','preacher-cable','flat-triceps-bar','flat-close-barbell','row-barbell','standing-pulldown','lat-pulldown'].includes(type))handles[0].position.copy(pose.bar);
    if(['incline-dumbbells','concentration-dumbbell','cable-crossover','flat-dumbbells','seated-press-dumbbells','seated-row-cable','kneeling-cable'].includes(type))for(const handle of handles){const grip=grips.find(item=>item.side===handle.userData.side);handle.position.copy(grip.position);handle.quaternion.copy(grip.rotation);}
    if(type==='preacher-cable')setLine(ropes[0],new T.Vector3(0,0.14,1.10),pose.bar);
    if(type==='cable-crossover')for(let i=0;i<handles.length;i++){const handle=handles[i],end=new T.Vector3(0,-0.10,0).applyQuaternion(handle.quaternion).add(handle.position);setLine(ropes[i],new T.Vector3(handle.userData.side*1.0,1.90,-0.22),end);}
    if(type==='hammer-incline'||type==='leverage-row')for(const lever of levers)lever.rotation.x=-pose.machineAngle;
    if(type==='standing-pulldown'||type==='lat-pulldown')setLine(ropes[0],new T.Vector3(0,2.15,1.10),pose.bar);
    if(type==='kneeling-cable'){const end=new T.Vector3(0,0.10,0).applyQuaternion(handles[0].quaternion).add(handles[0].position);setLine(ropes[0],new T.Vector3(0,2.15,1.10),end);}
    if(type==='seated-row-cable'){const nose=pose.bar.clone().add(new T.Vector3(0,-0.07,0.12));for(let i=0;i<2;i++)setLine(braces[i],handles[i].position,nose);setLine(ropes[0],new T.Vector3(0,0.18,1.20),nose);}
    if(type==='trap-bar')moving.position.copy(pose.bar);
    root.updateMatrixWorld(true);
  },dispose(){disposeGeometry(root);}};
}
