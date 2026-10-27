export class MeshFactory {
  constructor(T,materials){this.T=T;this.materials=materials;this.sphere=new T.SphereGeometry(1,32,24);}
  mesh(geometry,material,parent,name){
    const mesh=new this.T.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;
    if(name)mesh.name=name;parent.add(mesh);return mesh;
  }
  oval(parent,position,scale,material=this.materials.skin,name){
    const mesh=this.mesh(this.sphere,material,parent,name);mesh.position.set(...position);mesh.scale.set(...scale);return mesh;
  }
  box(parent,position,size,material=this.materials.metal){
    const mesh=this.mesh(new this.T.BoxGeometry(...size),material,parent);mesh.position.set(...position);return mesh;
  }
  rod(parent,a,b,radius,material=this.materials.metal){
    const T=this.T,start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start);
    const mesh=this.mesh(new T.CylinderGeometry(radius,radius,delta.length(),24),material,parent);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return mesh;
  }
  limb(length,startRadius,endRadius,bulge){
    const T=this.T,positions=[],indices=[],rings=28,sides=36;
    for(let i=0;i<=rings;i++){
      const t=i/rings,radius=startRadius+(endRadius-startRadius)*t+Math.sin(Math.PI*t)*bulge;
      for(let j=0;j<=sides;j++){const angle=j/sides*Math.PI*2;positions.push(Math.sin(angle)*radius,(t-0.5)*length,Math.cos(angle)*radius);}
    }
    for(let i=0;i<rings;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,a+1,b,b,a+1,b+1);}
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
  }
}

export function createMaterials(T,colors){
  const standard=(color,roughness=0.58,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
  const neutral=new T.Color().lerpColors(colors.foreground,colors.background,0.38);
  const materials={
    skin:standard(neutral),sculpt:standard(neutral.clone().multiplyScalar(0.85)),
    palm:standard(neutral.clone().multiplyScalar(1.14),0.76),nail:standard(neutral.clone().multiplyScalar(1.27),0.48),
    tinted:standard(new T.Color(1,1,1)),
    cloth:standard(neutral.clone().multiplyScalar(0.25),0.94),
    pad:standard(neutral.clone().multiplyScalar(0.18),0.88),
    metal:standard(neutral.clone().lerp(colors.muted,0.2),0.35,0.2),
    plate:standard(neutral.clone().multiplyScalar(0.4),0.64,0.18),
    sole:standard(colors.muted,0.86)
  };
  materials.tinted.vertexColors=true;
  materials.palette={neutral,primary:colors.primary.clone(),secondary:colors.secondary.clone()};
  return materials;
}

export function disposeGeometry(root){
  const unique=new Set();root.traverse(object=>{if(object.geometry)unique.add(object.geometry);});
  unique.forEach(geometry=>geometry.dispose());root.removeFromParent();
}
