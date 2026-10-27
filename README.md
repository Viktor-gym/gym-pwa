# GymTracker Pro PWA

HTML, CSS and vanilla JavaScript; static GitHub Pages deployment. The current
release is app-v51.js with studio-v51.css and exercise-atlas-v51.js.

## Development

Serve this folder with a local HTTP server. No build step or API key is needed.
Example: `npx http-server . -p 8080`.

Run `node --test tests/atlas.test.cjs` for catalog regression checks.
Syntax: `node --check app-v51.js`, `node --check exercise-atlas-v51.js`,
`node --check exercise-legacy-v51.js`, `node --check sw.js`.

## Exercise Guides

The visible library is restored to the 899-entry pre-v50 catalog. It keeps all
68 smooth 3D animations unchanged: 50 Vital Free50 and 18 RepDB previews.
Other entries use their original two still photographs, with manual 01 Start /
02 Finish buttons. No three-frame drawings, slideshow, interpolation or photo
animation is loaded. List cards always use one still poster or photograph.

Opening a 3D entry offers play/pause, restart, 0.5x speed and a scrubber.
Reduced-motion starts paused. The filter shows only the 68 smooth animations.
Front/back muscle maps retain source primary/secondary labels in coral/amber.
An exact photo or animation is never replaced with a different exercise variant.

The base Free Exercise DB has 876 entries, 873 with source photos (Unlicense).
Common Ukrainian names and equipment terms are searchable. Most full technique
instructions remain in their source English; curated common guides include UA.
The Vital pack is licensed for app use, NOT open-source or public domain.
See assets/exercises/SOURCE.md and assets/motion/SOURCE.md for details.

RepDB artwork and metadata are CC BY-NC 4.0, accepted for personal/non-commercial
use only with visible attribution. Before commercial app, advertising or
paid-client use, remove/replace those materials or obtain separate rights.
No purchases or Fitness Online artwork are included. See assets/repdb-motion/.

## Compatibility With v50

The owner rejected the three-position presentation after testing. It has been
removed from the app, not from users' saved training data. The 178 extra variants
remain resolvable through exercise-legacy-v51.js when a saved catalogId refers to
one. They are not offered in the new-exercise library. A saved variant without
exact photographs shows an explicit unavailable notice; no image is guessed.
Workout Guide metadata keeps its CC BY-SA 4.0 attribution in assets/poses/.
Existing 899-entry names, photographs, guides and all 68 motion records are
identical to the pre-v50 catalog. No user exercise is automatically renamed.

## Offline Use

The stable media cache retains downloaded exercise photos and animations.
168 common JPEGs and all 68 animations/posters are optional precache assets;
other source photos load on demand and cache for later viewing (240 remote
images maximum). Three-frame media is no longer downloaded. Service worker
byte-range support remains intact for offline iPhone/Safari animation playback.
The core cache is gym-pwa-v51-photo-guides. index.html and sw.js references must
be released together. Missing media can be retried online.

## Data And Privacy

Storage keys remain gymPwaData_v3 and gymPwaApp_v4. Exercise and workout IDs,
sets, completion marks, measurements, goals, profiles, plans, templates and JSON
formats are unchanged. Existing catalogId references remain supported. The
library does not replace a user's exercise list or upload their workout data.

Never publish personal exports, sample profiles, backups or test screenshots.
No iOS/Capacitor sync in this release. The in-app UA/EN guide documents the photo
restoration and stays collapsed until opened.

See EXERCISE-MEDIA-NOTES.md for future smooth-animation search priorities.
Do not reintroduce the rejected three-frame pack without a new user request.
