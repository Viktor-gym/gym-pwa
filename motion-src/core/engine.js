import {Mannequin} from './mannequin.js';
import {createEquipment} from './equipment.js';
import {EXERCISES} from './exercises.js';

// Model identity and geometry survive clip/equipment changes.
export class ExerciseEngine {
  constructor(T,materials,registry=EXERCISES){
    this.T=T;this.materials=materials;this.clips=new Map(Object.values(registry).map(clip=>[clip.id,clip]));
    this.root=new T.Group();this.root.name='gym-exercise-engine';
    this.model=new Mannequin(T,materials);this.root.add(this.model.root);
    this.equipment=null;this.clip=null;this.time=0;
  }
  register(clip){
    if(!clip?.id||typeof clip.sample!=='function'||!(clip.duration>0)||!clip.camera||!clip.muscles)throw new Error('Invalid exercise definition');
    this.clips.set(clip.id,clip);
  }
  setExercise(id){
    const clip=this.clips.get(id);if(!clip)throw new Error(`Unknown exercise: ${id}`);
    const equipment=createEquipment(this.T,this.materials,clip.equipment);
    this.equipment?.dispose();this.equipment=equipment;this.root.add(equipment.root);this.clip=clip;
    this.model.setMuscles(clip.muscles);this.poseAt(0);return clip;
  }
  poseAt(seconds){
    if(!this.clip)throw new Error('Choose an exercise first');
    if(!Number.isFinite(seconds))throw new Error('Animation time must be finite');
    this.time=seconds;this.pose=this.clip.sample(this.T,this.model.dimensions,seconds);
    this.grips=this.model.applyPose(this.pose);this.equipment.update(this.pose,this.grips);return this.pose;
  }
  dispose(){this.equipment?.dispose();this.model.dispose();this.root.removeFromParent();}
}
