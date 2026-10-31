# Next Exercise Media Search

## Scott Guide v66 (2026-10-31)

Adds Preacher_Curl with a straight bar on the owner-approved model and lowered
straight arm pad. Three actual camera views; 33 native guides, 112 visible entries.
All 49 poses pass motion, grip, bone-length and hard-frame regression checks.
Soft cushion contact is illustrative, not a full surface-physics pass; this
limitation is retained explicitly in catalog QA metadata and the guide footnote.
Only rendered MP4/JPEG media is published, not Blender sources or private profiles.

## Smith Batch v65 (2026-10-30)

Two exact native guides: Smith_Machine_Bench_Press and
Smith_Machine_Overhead_Shoulder_Press. Each has3 actual camera renders and49
saved-pose checks. Publication approval is limited to these exact scene hashes,
not universal anatomical or manufacturer CAD certification. Checks cover bone
length/rotation continuity, signed hinges, shaft/body and machine/body surfaces,
measured heel/forefoot and upholstery support proximity. Soft upholstery overlap
is not claimed to be a pressure simulation or zero foam/skin overlap.

Owner approved the equipment/athlete previews and requested testing/publication.
Bench root lowered13.5mm with ankle IK retained to close the measured pelvis gap;
machine geometry was not reshaped. All native Blender sources and detailed
audits remain local under equipment_pipeline/output, never in this public repo.
32 native guides are published after this batch. The old exact guides remain
available if needed; no profile/storage migration is performed.

Remove only Seated_Leg_Curl from new choices at the owner's latest clarification.
Keep Lying_Leg_Curls and Leg_Extensions, and keep old saved IDs resolvable.

## Curated Catalog v64 (2026-10-30)

Owner removed a named movement list and all untranslated catalog choices.
Exception: completed in-house native/shared-character 3D guides stay available,
including the wide-grip bench press. Downloaded third-party motion alone does
not qualify for this exception. Ten native movements received Ukrainian names;
shared-guide Ukrainian labels are also copied into their catalog fields.
The public selection catalog now has 112 movements, all with Ukrainian names.
Search/autocomplete, category browsing and counts use that same catalog in both
UI languages. Historical IDs/name resolution and original media remain available
for saved workouts and imported profiles; no localStorage migration or deletion.
The owner-defined removals are not anatomical or equipment-quality judgements.

## Latest Owner Direction (2026-10-29)

Unify all exercise animations on the approved native character, including the
68 external guides. Replace them incrementally only after exact-movement review;
until then the working external guide stays active. This supersedes the earlier
instruction to preserve those media permanently, not the data/ID safety rules.
Native Blender scenes and reproducible sources are kept locally under
`work/gym-realistic-model`; see `SOURCE-FILES.md` there. Never publish private
profile exports. Alternate camera renders are not new exercise counts.

The v57 camera release adds two real rendered views to each of the 14 native
guides (28 additional clips; three camera views per exercise). The Angle button
preserves phase, speed and paused/playing state. This is not a free-orbit 3D
viewer. Same saved character/animation scenes, not a different mannequin or
mirrored stills. UA/EN in-app guidance includes these controls. Native MP4 byte
range handling covers both primary and alternate files for offline/iPhone use.

Updated: 2026-10-27. Requested follow-up: repeat the search when exercise visuals
are next revisited. This is a project note, not a scheduled background task.

## Preserve Existing Work

- Keep the current exact illustration and technique whenever no suitable
  animation exists. Do not substitute another exercise or equipment variant.
- Keep catalog matching separate from stored exercise IDs, workouts, clients,
  sets, goals and JSON exports. Never publish private profile examples.
- Keep one still illustration per list card; animate only inside its guide.
- Keep the 68 smooth 3D guides intact. The owner rejected the three-frame
  Workout Guide presentation after testing. Restore the original pair of still
  photos; no drawn slideshow, no automatic switching between photos.

## Search Next

Prioritize flat/incline barbell and dumbbell bench presses, machine and cable
rows, pulldown variants, barbell/EZ-bar curls, triceps extensions, hyperextensions
and deadlift variants without an exact animation. Recheck all uncatalogued
movements locally; do not copy private exercise/profile names into public notes.

Use Fitness Online as a usability reference: clear exercise illustrations,
smooth motion, muscles and technique. Its artwork is not a reusable asset pack.

## Sources Already Checked

- Vital Animations Free50: 50 app-licensed 3D movements. Full catalog is paid.
- RepDB preview: 22 source movements, 18 additional unique motions integrated.
  CC BY-NC 4.0 only, approved for personal/non-commercial use. Recheck/remove
  before any commercial app or paid-client use; do not buy without permission.
- Free Exercise DB: 876 original catalog entries with static photographs;
  Unlicense. Keep as the fallback, not a fake animation made from two photos.
- Workout Guide / Everkinetic: 302 source exercises, CC BY-SA 4.0 artwork;
  v50 integrated 261 three-frame guides (83 existing links, 178 new variants).
  Rejected by the owner on 2026-10-27. v51 restores the 899-entry photo/3D
  library and does not load those drawings or playback code. Compatibility
  metadata for 178 variants remains in exercise-legacy-v51.js for existing
  saved catalogIds only, not new library suggestions. Source credits remain.
- OpenGym3D: promising CC0 motion/MakeHuman pipeline, currently limited live
  exercise coverage and drafts. Recheck readiness and each clip's license.
- Wikimedia Commons: inspect each file. Many clips are real-person footage,
  low resolution or just two frames; those do not meet the requested style.
- ExerciseDB/GymVisual mirrors: a repository's MIT code license does not
  necessarily cover its GIFs. Do not bundle media with unclear provenance.
- VFE free content pack: current free terms exclude app/product interfaces.

For new sources, verify actual archive licenses, equipment/form accuracy,
mobile playback, attribution, offline caching and reduced-motion support.
Document any new coverage limit honestly and update the in-app guide.

## Release Approval

v50 was published on 2026-10-27. The owner then requested the photo restoration
in v51. No iOS/Capacitor changes in this pass.
Backup before these changes: `work/backups/pwa-before-poses-20261027`, outside
the deployment directory. Never add the private test profile to this repository.
Backup before v51: work/backups/pwa-before-photo-restore-20261027, also outside
the deployment directory. Preserve user records; do not roll back localStorage.

## Native Bench Series v56

## Native Strength Continuation v58

Six new guides are initially included: seated dumbbell curl, incline hammer
curl, one-arm bench row, standing hammer curl, barbell curl and EZ-bar curl.
v59 adds reviewed lateral raise and reverse-grip barbell curl: eight of50.
v60 adds front dumbbell raise, dumbbell shrug, bent-over two-dumbbell row,
bodyweight squat, forward dumbbell lunge and reverse dumbbell lunge.
Fourteen of the selected fifty guides now have three rendered camera views;
including the earlier fourteen bench guides, the native catalog contains28.
The floor split-squat prototype and preacher prototypes are withheld: they
do not yet pass the exact-variant and body/support contact review.
v61 adds the bent-over barbell row with overhand and reverse grips after
extending the lower endpoint and rechecking shaft/body clearance. Sixteen
of the selected fifty are published, thirty native guides in total, each
with three real cameras. Preacher curls remain withheld, not certified.
v62 corrects a curl hinge-frame reversal in barbell, EZ-bar and reverse-grip
barbell curls. The lower endpoint no longer crosses behind the upper-arm axis.
All49 baked poses must keep a positive forward hinge normal. Corrected media
uses new `hinge-v2` URLs so older phone caches cannot reuse the faulty clips.
This is a correction of three existing guides, not three additional exercises.
v63 explicitly versions the HTML catalog request and precaches that same URL,
so an older installed worker cannot serve the old catalog for the revised page.
Worker imports bypass the HTTP cache, with a throttled update check on resume.
No forced reload occurs during a workout and profile storage is unchanged.
Each has three actual camera videos, matching posters, source pose/grip checks
and online/offline browser verification. Standing arm skinning was reviewed
separately; it does not alter the approved bench scenes or saved user records.
Additional candidates remain local until every camera and check passes. This
is a partial delivery from the planned50, not50 completed exercises.

An exact reviewedReplacement flag can select a native guide ahead of an old
motion for that catalog ID only. The original68 metadata and media remain
intact; a failed native replacement falls back to the original guide. No
blanket replacement of the68, private exports, Blender sources or iOS changes.

14 exact rendered guides, including the previously reviewed bench press, are
packaged separately from the original68 motion entries. Catalog entries and
saved exercise IDs are not mutated. Native concentration curl is withheld for
remaining leg contact; the existing incline-curl animation is retained rather
than replaced by an unfinished native version. Source Blender files, private
exports and internal review reports are not part of the public application.

Native guides use one poster in lists, H264 motion in the detail dialog, paused
reduced-motion mode, exact-photo fallback on video failure, and cached byte
range responses for offline/iPhone playback. Credits and upstream2D-render
exception are in assets/native-bench/v56/. No third-party FitnessOnline media
was copied. No purchases or iOS changes.

Muscle statistics are derived at display time using the existing exact catalog
primary/secondary metadata. The70/30 allocation is an explicitly disclosed
heuristic, not a physiological measurement. Volume and set views are separate;
unknown custom movements retain their own category. No data migration or new
localStorage keys. The user/trainer in-app guide documents both additions.
