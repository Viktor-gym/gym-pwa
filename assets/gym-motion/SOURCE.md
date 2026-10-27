# Shared GymTracker Mannequin

Approved by the owner for the PWA on 2026-10-27. Exact replacements:

- Barbell_Bench_Press_-_Medium_Grip: original shared mannequin, bench press.
- Dumbbell_Bicep_Curl: the same mannequin, supinating dumbbell curl.

Geometry, hands, IK and motion were authored in the GymTracker prototype.
There are no copied third-party model assets, paid media or personal exports.
Posters are still renders of that model, 400 x 320 JPEG. The renderer, model and
motions are bundled in gym-motion-v55.js for local/offline use, without CDN.
Three.js is MIT; its original license is retained in THREE-LICENSE.txt.

Editable source and rebuild instructions: motion-src/README.md. The original
68 motion files and exact photo pairs remain untouched for other exercises and
compatibility fallback. These visual guides are not medical or technique
certification. No anatomical or safety guarantee follows from geometry tests.

v54 adds eight original procedural clips only for previously unanimated exact
catalog entries: Cable_Preacher_Curl, Barbell_Curl, Incline_Dumbbell_Press,
Lying_Triceps_Press, Cable_Crossover,
Barbell_Incline_Bench_Press_-_Medium_Grip, Concentration_Curls and
Leverage_Incline_Chest_Press. No existing third-party animation is replaced.
All eight use the same model and new procedural equipment, not copied artwork.
Pose references are linked in motion-src/core/template-clips.js; the original
exercise catalog retains its own exact technique and source attribution.
The incline lever guide is not assigned to the level Leverage_Chest_Press.

v55 adds eleven original exact guides: Straight-Arm_Pulldown, Leverage_Iso_Row,
Close-Grip_Barbell_Bench_Press, Kneeling_Single-Arm_High_Pulley_Row,
Trap_Bar_Deadlift, Seated_Dumbbell_Press, Dumbbell_Bench_Press,
Wide-Grip_Lat_Pulldown, Bent_Over_Barbell_Row, Seated_Cable_Rows and
Hanging_Leg_Raise. Sources are linked in core/full-list-clips.js; no source
artwork is copied. Shared guides now total 21; the original 68 video assets
remain untouched. The procedural character gains palm/finger detail and grip
close-up, with explicit underhand, overhand and neutral frames. Curls using a
barbell, preacher support or concentration support now use an underhand grip.
Posters have v55 filenames so cached previous renders are not reused.
