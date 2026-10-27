# Exercise Images And Data

Source: https://github.com/yuhonas/free-exercise-db
Dataset downloaded 2026-10-27; 876 entries. License: Unlicense (LICENSE.txt).
The local registry includes the original English names, instructions, primary and
secondary muscles, equipment and image paths. Selected common variants have curated
Ukrainian names and aliases. Other variants retain their original English names.

Each movement has two source photographs. The app replays those two positions;
this is explicitly identified as a frame-by-frame demonstration, not continuous
video. Muscle highlights use the source primary/secondary muscle metadata.

Photos for curated movements are bundled locally. Other photographs load from
the source repository on first use and are cached by the service worker. The
user's exercise names, workout history and profile JSON stay on their device.
Unmatched names remain custom exercises; the app never substitutes a generic
movement based only on its muscle group.
