# Toolchain attempt and validation (2026-11-05)

## What is actually installed

- Existing browser app: embedded **Three.js r128**. It remains the shipping renderer; it is not silently replaced.
- NPM test-only alias `three-modern@npm:three@0.186.0`: headless scene construction, 12-part bounds and motion checks pass under **both r128 and r186**. Modern color textures now carry `SRGBColorSpace` when that API exists. This is **not** a WebGL screenshot test or proof that the full legacy viewer works on r186 (renderer configuration and bundled plugins differ).
- `.agent-skills/threejs-geometry` and `.agent-skills/threejs-animation`: pinned r186 workflow references, with MIT attribution. Existing FreeCAD and parametric CAD guidance remains in `.agent-skills/`.
- A local ignored `.venv` contains CadQuery 2.6.1 and OCP for a *trial*. The pip installation completed, but `import cadquery` **fails** because this sandbox lacks `libGL.so.1`; no STEP generation/validation has been claimed. `.venv` is not committed or included in the app.

## What could not be installed

- Debian `apt-get update` cannot fetch `deb.debian.org`; repositories are outside the sandbox's permitted hosts. Do not infer success from apt's zero exit code: it reported failed fetches.
- The official FreeCAD 1.1.4 Linux AppImage is published on GitHub, but its ~821 MB release asset redirects to `objects.githubusercontent.com`, which this environment cannot access (`curl` exited 35). Therefore **FreeCAD is not installed or runnable here**. A FreeCAD skill file is not the FreeCAD executable.

## Next steps when a full CAD runtime and actual equipment evidence are available

Use the as-built machine's GA drawing, shaft-center distances and component nameplates. Build small candidate solids first, re-import exported STEP, verify exact dimensions/volume/holes and then assemble and inspect clearances. Do not promote the catalog-candidate SKF/Voith/SEW parts to installed equipment without matching plate or drawing evidence; see [real-machine gap assessment](real-machine-gap.md). Browser visual checks and legacy plugin migration are independent tasks before switching the viewer to r186.

## User-supplied Code Cinema kit (local only)

On 2026-11-07 the user's Dropbox `/code-cinema.zip` (833,898 bytes, ZIP SHA-256
`ab1d84a753aa2fe34ce9ebb707da2510ac0f0a6a1a1a3490de0cab048a7c27c9`)
was downloaded through the Dropbox connector. The 38-entry ZIP was inspected for
path traversal, symlinks, and size expansion before installation into
`.agent-skills/code-cinema/`, with a canonical symlink at
`~/.claude/skills/code-cinema`. Its `SKILL.md`, `references/`, code kit, examples,
and scripts are present locally. `npm ci --no-audit --no-fund` installed its
`playwright-core@1.65.0`; `node --check scripts/render.mjs` and a direct ESM
import of `kit/film.js` (bundled Three.js r160) passed. `ffmpeg`, Chrome and
Chromium executables are absent, so the actual film-render/MP4 pipeline **has
not** been validated. The kit is user-supplied and has no stated license for its
own source; the local copy is ignored by Git and is not redistributed by this
repository. `kit/THIRD_PARTY.md` separately lists its third-party licenses.

**Subsequent working browser/video pipeline (2026-11-07):** The absence of
*system* executables was overcome using npm-distributed Chromium 143,
`playwright-core` and locally extracted NSS/NSPR libraries, with static npm
ffmpeg/ffprobe executables. The ignored local renderer was adapted to use
`CODE_CINEMA_CHROME` and `--no-sandbox`, and its audio pad filter was expressed
as `whole_len` for this older ffmpeg. The actual viewer passed a Playwright
smoke run: HERO, 12 views, coupling inspection, no page errors, and GLB export
(372 meshes / 700 nodes / 98 materials, 7,260,392 bytes). The 7.2 s,
960×540, 24 fps Code Cinema movie was rendered from that exported GLB and
checked for frames, duration, audio loudness and true peak. Source and
reproduction steps are in [film README](../films/clinker-drive/README.md).
The film's r160 dependencies do **not** change the viewer's r128 engine. None
of this establishes as-built accuracy, safety compliance or a CAD validation.

## Optional Ultra viewer tier (subsequent pass)

The original Dropbox archive was rechecked against its SHA-256 and its
`SKILL.md`, `references/modeling.md` and `references/light.md` reviewed.
The Ultra setting translates its bevel/material/light guidance to the
existing **offline r128 viewer**, rather than claiming the separate film
engine is a real-time plugin. Its procedural texture/edge detail stays
conceptual and its render budget is bounded. In Chromium/SwiftShader the
Balanced → Ultra → Low → Ultra transitions, HERO preset, and no-console-error
render were exercised. The static and dual-Three tests exercise geometry
visibility, material restoration and repeat-entry without duplicate detail.
No as-built evidence was added.

## GitHub skills follow-up for Ultra (2026-11-07)

Searched GitHub for WebGL/Three.js agent guidance. Selected two MIT projects
because they cover this offline product viewer rather than Blender-only or
WebGPU-only runtimes: [Web 3D Modeling Workflow](https://github.com/wodelt-tishellor/web-3d-modeling-workflow/tree/49dea3ea2914683be8c60772d5933d9298dd793a)
(commit `49dea3e`) and [Three.js Skills](https://github.com/cesartevisual/threejs-skills/tree/84f9bcb4bea1f7a28d57fe7f0af78f7f9c3dc467)
(commit `84f9bcb`). Relevant sources/licenses are installed under
`.agent-skills/`; local agent symlinks are described there. Their material,
lighting, viewer and performance guidance drove a targeted improvement:
Ultra now uses a cached, separately prefiltered studio reflection environment
and directionally brushed/cast data maps, while restoring its original
material/environment on exit. This is **not** an r128-to-WebGPU migration and
not proof of real equipment identity or photo accuracy. Browser/SwiftShader
QA exercised desktop and mobile Ultra→Balanced, as well as quality switching
from inside inspection; scene and dual-Three tests cover the texture and mesh
lifecycle. No physical GPU benchmark was available.

## Further skill search and Ultra performance pass (2026-11-07)

Searched GitHub again for a browser-3D quality/performance skill and selected
MIT-licensed [`maxliebscher/optimize-three@6d7557c`](https://github.com/maxliebscher/optimize-three/tree/6d7557cf7ec1d4ce988984f863ae22db10436934)
for its explicit WebGL quality-budget, frame-pacing, shadow and measurement
procedures. The pinned skill, kit, scripts and references are installed under
`.agent-skills/optimize-three/` with its license; its kit has **not** been
injected into the r128 viewer. Its static audit identified missing frame
pacing and warned about light toggles (also from bundled/minified Three.js and
existing cast-shadow changes); such heuristic warnings are not GPU benchmarks.

Ultra now retains the full studio look while reducing only drawing-buffer
resolution during motion (≈1.2 MP target, bounded by device/window) and
restoring the full ≈5 MP budget after settling. PNG capture uses the full
still budget even if animation is running; its original drawing-buffer size
and clear color are restored afterward. A 60 Hz visual-update cap avoids
needless high-refresh rendering without changing simulation time. The studio
bounce remains present with intensity 0 when off, avoiding a light-count
shader recompile. The static GLB exporter excludes Ultra-only decorative rims
so its engineering snapshot does not depend on the last quality selected.

Playwright/Chromium **SwiftShader** checks exercised desktop and mobile
moving → paused → resumed resolution transitions and a full-resolution PNG;
no page errors were observed. SwiftShader is software rendering: its timings
cannot substantiate an FPS or GPU-efficiency claim for actual iGPUs/phones.
No new as-built evidence was obtained.

## Cinema-focus visual pass (2026-11-07)

GitHub search found MIT [Scene Direction](https://github.com/boranfurkan/scene-direction/tree/ba6819feafe3e9d2d1f9b490838dd5e0b657eebf)
and [Web3D Realism & Performance](https://github.com/saad-git-007/claude-skills/tree/e5c50fbcd794bb4b205cc5234afcfedba6a8dfbd);
the pinned, licensed skill sources are in `.agent-skills/`. Their modern
r187 web starter, network assets, and Blender Cycles lightmap workflow cannot
be copied into this offline r128 viewer without migration, evidence and new
assets. No actual plant photograph or measured mesh was supplied.

The **STUDIO** button (`C`) is an explicit, reversible cinematic framing of
this same concept assembly. It selects the 30° HERO camera and Ultra render,
uses a darker surround and directed warm key/cool rim, and temporarily hides
busy annotation/simulation panels without disabling their state. Its caption
labels the hardware unverified in English/Persian. Exiting, inspecting a part,
selecting another view, changing quality or resetting restores controls and
previous labels. No engineering measurements or ratios are changed.

Reviewed screenshots at 1280×800 and 390×720 using Chromium/SwiftShader;
both showed the complete assembly, readable caveat and no page errors.
Also exercised toggles, quality exit, part selection, Persian translation and
reset. This is visual QA on software WebGL, **not** evidence of as-built
realism, calibrated PBR materials or physical GPU performance.
