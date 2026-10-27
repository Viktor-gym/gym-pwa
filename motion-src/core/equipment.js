import {MeshFactory,disposeGeometry} from './mesh.js';

export function createEquipment(T,materials,type){
  const root=new T.Group();root.name=`equipment-${type}`;const f=new MeshFactory(T,materials),handles=[];
  const ring=(parent,radius,tube,z)=>{const mesh=f.mesh(new T.TorusGeometry(radius,tube,10,48),materials.metal,parent);mesh.position.z=z;return mesh;};
  if(type==='bench-barbell'){
    const pad=f.mesh(new T.CapsuleGeometry(0.19,0.96,12,40),materials.pad,root);pad.rotation.z=Math.PI/2;pad.position.set(0.03,0.46,0);pad.scale.set(0.21,1,1);
    f.box(root,[0.03,0.40,0],[1.30,0.06,0.28]);
    for(const x of [-0.48,0.54]){f.box(root,[x,0.218,0],[0.055,0.35,0.065]);f.box(root,[x,0.042,0],[0.30,0.055,0.61]);for(const z of [-0.25,0.25])f.box(root,[x,0.022,z],[0.32,0.035,0.11],materials.cloth);}
    f.rod(root,[-0.47,0.24,0],[0.54,0.39,0],0.021);
    const bar=new T.Group();bar.name='barbell';root.add(bar);handles.push(bar);
    f.rod(bar,[0,0,-1.0],[0,0,1.0],0.0145);
    for(const side of [-1,1]){
      f.rod(bar,[0,0,side*0.68],[0,0,side*0.96],0.025);
      for(let plate=0;plate<2;plate++){const z=side*(0.75+plate*0.05),disc=f.mesh(new T.CylinderGeometry(0.19,0.19,0.043,64),materials.plate,bar);disc.rotation.x=Math.PI/2;disc.position.z=z;ring(bar,0.168,0.005,z+side*0.024);ring(bar,0.039,0.008,z+side*0.024);}
      f.rod(bar,[0,0,side*0.86],[0,0,side*0.89],0.035);
    }
  }else if(type==='dumbbells'){
    for(const side of [-1,1]){
      const handle=new T.Group();handle.name=`dumbbell-${side}`;root.add(handle);handle.userData.side=side;handles.push(handle);
      // Local X is the hand's grip axis, so gear follows the actual palm frame.
      f.rod(handle,[-0.14,0,0],[0.14,0,0],0.015);
      for(const x of [-0.115,0.115]){
        const weight=f.mesh(new T.CylinderGeometry(0.075,0.075,0.055,8),materials.plate,handle);weight.rotation.z=Math.PI/2;weight.position.x=x;
        f.rod(handle,[x-0.031,0,0],[x+0.031,0,0],0.022);
      }
    }
  }else if(type!=='none')throw new Error(`Unknown equipment: ${type}`);
  return {root,handles,update(pose,grips){
    if(type==='bench-barbell')handles[0].position.copy(pose.bar);
    if(type==='dumbbells')for(const handle of handles){const grip=grips.find(grip=>grip.side===handle.userData.side);handle.position.copy(grip.position);handle.quaternion.copy(grip.rotation);}
  },dispose(){disposeGeometry(root);}};
}
