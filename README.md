# GymTracker Pro PWA

HTML, CSS and vanilla JavaScript; static GitHub Pages deployment. The current
release is `app-v48.js` with the separate `studio-v48.css` design and exercise atlas.

## Development

Serve this folder with any local HTTP server. No build step or API key is required.
For example: `npx http-server . -p 8080`.

Run library regression checks: `node --test tests/atlas.test.cjs`.
Syntax checks: `node --check app-v48.js`, `node --check exercise-atlas-v48.js`,
and `node --check sw.js`.

## Exercise Atlas

`exercise-library-v47.js` contains 876 public library entries, of which 873 have
source photographs. There are 84 curated Ukrainian names and aliases for common
movements; other names and full instructions remain in their source English.
Ukrainian search also expands common equipment and movement terms.

`exercise-motion-v48.js` augments the catalog to 890 movements with 50 exact
3D animations from the free Vital Animations Free50 pack. All 50 are animated
characters, not recordings of people. A list card always displays a single static
poster; opening it shows continuous motion with pause/restart, 0.5x speed and a
scrubber. A filter shows only animated entries. Respect reduced-motion settings.
No animation is substituted for a different equipment or movement variant.
Unavailable animations show clearly labelled static positions, not a fake replay.

Primary/secondary muscle highlighting is on a separate front/back map, not painted
onto the character. Anatomy colours are coral/amber. The free pack is licensed for
app use, NOT open-source or public domain. See `assets/motion/SOURCE.md` before
reusing any artwork. No Fitness Online assets or paid packages are included.

Animations (50 muted MP4 containers, about 5.3 MB) and JPEG posters are bundled.
The media cache saves these plus photos of 84 common movements (168 JPEGs, about
11 MB) after a successful online update. Service worker byte-range responses allow
offline iPhone/Safari playback. Missing media remains retryable online; app updates
do not depend on every optional media download succeeding. Other photos load on
demand from the public source; up to 240 remote images are cached. See
`assets/exercises/SOURCE.md` and `LICENSE.txt` for the Unlicense photo source.

Typing a name in the exercise editor displays photo suggestions immediately.
Selecting one fills both names, muscle group, tracking type and units. Users can
edit those fields or save their own unmatched exercise. A `catalogId` references
the selected movement; `none` explicitly keeps an exercise unlinked. Existing
exercises are matched by exact names/aliases on display, never by muscle group
alone. New library entries are added to the selected profile only when requested.

## Existing Data And Privacy

The storage keys remain `gymPwaData_v3` and `gymPwaApp_v4`. Workout IDs, exercise IDs,
sets, body records, goals, client profiles, plans and templates retain their current
formats. No library import replaces a user's exercise list. `catalogId` is an
optional exercise property preserved by JSON export/import and profile merge.

User backups and profile examples are not deployment assets. No workout data is
uploaded by the atlas. Remote image requests use only public catalog image paths.
The service worker updates app/media caches and does not clear localStorage.
The in-app guide describes the new workflows for both users and trainers and stays
collapsed until opened.

Before a release, update the references in index.html and sw.js together. Keep
media-cache naming stable to preserve previously downloaded exercise photos.
