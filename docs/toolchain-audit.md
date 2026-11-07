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
