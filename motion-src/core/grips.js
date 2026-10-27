const modes=Object.freeze({
  'bench-press':'pronated','dumbbell-curl':'neutral-to-supinated',
  'incline-barbell-press':'pronated','incline-dumbbell-press':'pronated',
  'barbell-curl':'supinated','cable-preacher-curl':'supinated',
  'lying-triceps-press':'pronated','cable-crossover':'neutral',
  'concentration-curl':'supinated','hammer-incline-press':'pronated'
});
const labels={
  pronated:['верхній (прямий)','overhand (pronated)'],
  'pronated-close':['верхній, приблизно на ширині плечей','overhand, about shoulder width'],
  'pronated-wide':['верхній широкий','wide overhand'],
  supinated:['нижній, долоні догори / до себе','underhand, palms up / toward you'],
  neutral:['нейтральний, долоні всередину','neutral, palms inward'],
  'neutral-to-supinated':['нейтральний із розворотом у нижній','neutral turning to underhand']
};
export const gripMode=clip=>clip.grip||modes[clip.id]||null;
export const gripLabel=(clip,lang='ua')=>labels[gripMode(clip)]?.[lang==='en'?1:0]||'';
