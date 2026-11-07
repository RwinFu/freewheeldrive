# Clinker drive — Code Cinema concept film

[Watch the film](clinker-drive-concept.mp4) · 7.2 s · 960×540 · 24 fps · H.264/AAC.
This is **not footage of the installed conveyor or an as-built/CAD model**. The
three-shot film uses the actual geometry exported by this repository's offline
Three.js viewer, not a newly invented motor, gear stage or second conveyor.
The middle shot temporarily hides the conceptual coupling guard and makes the
viewer-exported fluid shell translucent for an educational look inside; this
is not an instruction to operate equipment without its guard. Rotation is a
pure-time illustrative startup, not simulated fluid mechanics. The original
viewer ships r128; the separate film kit uses Three.js r160.

## Source and traceability

- `scene.js` defines the shots, lighting, deterministic motion, typography and
  synthesized room tone/music/transitions with the **actual Code Cinema API**.
- `drive-data.mjs` is generated from `FreewheelDriveSpec` in the viewer by
  `node scripts/build-film-data.mjs` (run from the repository root). `npm test`
  checks it for drift. The visible reduction is 3 × (0.318/0.238) ≈ **4.008:1**;
  the ideal plant reference ≈ **32.78:1** differs by ≈ **8.18×**, unresolved.
  The film labels that difference, rather than inventing a reducer.
- `drive.glb` is a **generated local input**, Git-ignored (~7 MB); it contains
  the viewer's meshes, not licensed manufacturer geometry. The checked-in MP4
  preserves the reviewed result, but re-rendering requires regenerating the
  GLB from the current viewer (and may legitimately change if the viewer does).
- The user supplied `/code-cinema.zip` in Dropbox, locally installed into
  `.agent-skills/code-cinema/` (ZIP SHA-256
  `ab1d84a753aa2fe34ce9ebb707da2510ac0f0a6a1a1a3490de0cab048a7c27c9`).
  Its own kit has no stated redistribution license, so it is **not committed**.
  Consult its `SKILL.md` for setup/API and `kit/THIRD_PARTY.md` for licenses.

## Reproduce the geometry and render

1. Install the **same user-supplied Code Cinema ZIP** under
   `.agent-skills/code-cinema/` and run `npm ci` inside its `scripts/` folder.
   For the film's GLB import, install/copy the Three.js **r160** example modules
   `GLTFLoader.js` and `utils/BufferGeometryUtils.js` into the kit's
   `kit/loaders/` and `kit/utils/` respectively. These are film-only modules.
2. Open `freewheel-detailed.html` in a modern WebGL browser (either directly or
   via `python3 -m http.server 8000` from the repository root). Let the scene
   settle, press **Export GLB**, and save the downloaded file as
   `films/clinker-drive/drive.glb`. This is a static viewer export. The tested
   export was 7,260,392 bytes with 372 meshes, 700 nodes and 98 materials.
   `npm test` additionally checks the GLB signature/rotor names when present.
3. Run `node scripts/build-film-data.mjs` at the repository root. Provide a
   working Chromium/Chrome executable, `ffmpeg` and `ffprobe` on PATH. If using
   a separate Chromium binary, set `CODE_CINEMA_CHROME` to its absolute path;
   the local kit's `scripts/render.mjs` was adapted to use this variable and
   `--no-sandbox` in the sandbox. The older npm ffmpeg used here also needed
   the renderer's `apad=whole_dur=…` changed to equivalent
   `apad=whole_len=Math.ceil((t1+2)*48000)` at 48 kHz. These compatibility
   edits live only in the ignored local kit. In an environment with current
   Chrome/ffmpeg they may not be needed.
4. With the kit and binaries ready, from the repository root:

   ```sh
   node .agent-skills/code-cinema/scripts/render.mjs films/clinker-drive \
     --stills 1.4,3.5,5.7 --q draft --format landscape --no-audio
   node .agent-skills/code-cinema/scripts/render.mjs films/clinker-drive \
     --q draft --samples 2 --format landscape --out /tmp/clinker-drive.mp4
   bash .agent-skills/code-cinema/scripts/check.sh /tmp/clinker-drive.mp4 7.2
   ```

   Inspect stills before the full render. The checked-in MP4 is the tested
   two-sample draft-quality render; in this sandbox its first AAC encode peaked
   above the kit's -0.5 dBTP ceiling, so the final audio was reduced 2.5 dB:
   `ffmpeg -i input.mp4 -c:v copy -af volume=-2.5dB -c:a aac -b:a 192k output.mp4`.
   The kit's `check.sh` then reported **173 frames, 7.208 s picture, 7.210 s
   container, -16.7 LUFS, -2.2 dBTP, yuv420p and no black/frozen sections**.
   For publishing at a different resolution or with a different ffmpeg, run
   the check again and review the imagery; don't assume a passed test is a
   mechanical or photographic verification.
