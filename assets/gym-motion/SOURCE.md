# Shared GymTracker Mannequin

Approved by the owner for the PWA on 2026-10-27. Exact replacements:

- Barbell_Bench_Press_-_Medium_Grip: original shared mannequin, bench press.
- Dumbbell_Bicep_Curl: the same mannequin, supinating dumbbell curl.

Geometry, hands, IK and motion were authored in the GymTracker prototype.
There are no copied third-party model assets, paid media or personal exports.
Posters are still renders of that model, 400 x 320 JPEG. The renderer, model and
motions are bundled in gym-motion-v54.js for local/offline use, without CDN.
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
