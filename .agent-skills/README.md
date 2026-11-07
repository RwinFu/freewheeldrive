# Optional design references

These Markdown files are third-party workflow **references**, not executable plug-ins and not a change to the assistant's underlying capabilities. Read the relevant file when working on the model; verify any numerical claims independently.

- `industrial-design`: https://github.com/emirerdo/industrial-design-skill
- `blender-modeler`, `hard-surface`, `qa-review`, `export-pipeline`, `materials`, `lighting`, `procedural-modeling`, `asset-optimization`: https://github.com/arjun988/blender-skills
- `parametric-cad-verify`: [dlockamy/claude-cad-workbench](https://github.com/dlockamy/claude-cad-workbench/tree/32d575686c4932b76b3cde32f8baea9f031e0556/skills/parametric-cad-verify), Apache-2.0; geometry read-back and explicit placeholder checks. See local `LICENSE`.
- `freecad-scripts`: [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/96543145e9cb97711020b57b9d88f968062c4fc7/skills/freecad-scripts), MIT; scripting reference for future CAD work. See local `LICENSE`.

- `threejs-geometry`, `threejs-animation`: [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills/tree/0e181866f095b5f06d005133876e926515390d95/skills), MIT (local `LICENSE`). These target **r186** and are references for a future migration, not drop-in instructions for the offline viewer.

These are Markdown workflow references, not installed FreeCAD, Blender, or CAD plugins. This standalone viewer **still ships Three.js r128**; r186 is installed only as a parallel npm test dependency (`three-modern`) and scene construction is checked against both. FreeCAD's official AppImage download requires an unavailable binary host in this environment, and CadQuery's OCP import is blocked by missing `libGL.so.1`; neither has been claimed as a working CAD runtime. Blender guidance applies to optional GLB inspection/export, not automatically to the browser runtime. Verify numerical claims against manufacturer documents and the *actual installed equipment* before changing geometry. The original skill documents retain attribution and license headers.

- `code-cinema` (local installation from the user's Dropbox `/code-cinema.zip`, SHA-256
  `ab1d84a753aa2fe34ce9ebb707da2510ac0f0a6a1a1a3490de0cab048a7c27c9`):
  `SKILL.md`, references, kit, examples and scripts installed under
  `.agent-skills/code-cinema/` and linked at `~/.claude/skills/code-cinema`; `npm ci` installed `playwright-core` inside its
  `scripts` directory. The supplied source does not state a redistribution
  license for the original kit, so this local installation is Git-ignored rather
  than included in the public repository. Bundled Three.js r160 is **only** for
  the film kit; the viewer continues to ship embedded r128. A separate
  browser-rendered, scored film of the viewer's exported GLB is in
  [films/clinker-drive](../films/clinker-drive/README.md). The local renderer
  uses packaged Chromium/ffmpeg and additional r160 loader modules; these are
  not shipped with the public repository. See
  [the local skill's SKILL.md](code-cinema/SKILL.md) for its workflows.

## Additional pinned GitHub guidance for the Ultra tier

Installed as local project-readable agent-skill references and linked into
`~/.claude/skills/` for this workspace (links are local, not shipped):

- [`web-3d-modeling-workflow`](web-3d-modeling-workflow/SKILL.md), pinned to
  [`wodelt-tishellor/web-3d-modeling-workflow@49dea3e`](https://github.com/wodelt-tishellor/web-3d-modeling-workflow/tree/49dea3ea2914683be8c60772d5933d9298dd793a),
  MIT. Includes its complete `references/` and [license](web-3d-modeling-workflow/LICENSE).
- [`threejs-quality-pack`](threejs-quality-pack/), the **lighting, materials,
  performance, postprocessing, product-viewer and testing** skill directories
  from [`cesartevisual/threejs-skills@84f9bcb`](https://github.com/cesartevisual/threejs-skills/tree/84f9bcb4bea1f7a28d57fe7f0af78f7f9c3dc467),
  MIT ([license](threejs-quality-pack/LICENSE)). Only the relevant Markdown
  guidance and its referenced profiling worksheet are installed, not unrelated
  R3F/WebGPU packages or executable code.

Skills are **instructions**, not installed renderers or new inherent assistant
capabilities. In particular, the viewer stays on embedded Three.js r128; each
example/API must be checked for r128 support before implementation. The Ultra
changes are documented in the [toolchain audit](../docs/toolchain-audit.md).
