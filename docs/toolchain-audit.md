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
