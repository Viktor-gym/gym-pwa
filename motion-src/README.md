# Shared Motion Source

This is the production copy of the approved original GymTracker prototype.
`core/mannequin.js` builds one shared character; clips in `core/exercises.js`
provide poses, equipment, camera and muscle selection. Geometry and bone lengths
do not change when exercises switch. `pwa-adapter.js` mounts the exact requested
clip in the atlas and disposes it when the dialog closes.

Only the two exact catalog IDs in catalog.json use this renderer. Matching is
not based on muscle group, so incline, cable or seated variants are not replaced.
All original catalog/user IDs and measurement/workout data remain unchanged.

```sh
npm install
npm run build:motion
npm test
```

Build writes the checked-in gym-motion-v53.js bundle and its small catalog
bindings file. The static PWA still needs no Node runtime or build step to run.
The bundle includes Three.js; there are no CDN requests at playback time.

Add a clip in core/exercises.js, select appropriate equipment/muscles, test its
pose/IK and add an exact catalog binding. Never duplicate the mannequin per clip.
An exercise name alone does not automatically generate a verified movement.
Regenerate its still poster from the approved renderer, then rebuild the bundle.

WebGL errors or context loss switch to the original photograph/video guide.
Reduced-motion starts paused. Closing a guide cancels animation, observers,
listeners and GPU resources. Nothing reads or writes profile localStorage here.

Movement references (no artwork copied):
https://www.nasm.org/resource-center/exercise-library/barbell-bench-press
https://www.catalystathletics.com/exercise/908/Supinating-Dumbbell-Curl/
