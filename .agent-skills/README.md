# Optional design references

These Markdown files are third-party workflow **references**, not executable plug-ins and not a change to the assistant's underlying capabilities. Read the relevant file when working on the model; verify any numerical claims independently.

- `industrial-design`: https://github.com/emirerdo/industrial-design-skill
- `blender-modeler`, `hard-surface`, `qa-review`, `export-pipeline`, `materials`, `lighting`, `procedural-modeling`, `asset-optimization`: https://github.com/arjun988/blender-skills
- `parametric-cad-verify`: [dlockamy/claude-cad-workbench](https://github.com/dlockamy/claude-cad-workbench/tree/32d575686c4932b76b3cde32f8baea9f031e0556/skills/parametric-cad-verify), Apache-2.0; geometry read-back and explicit placeholder checks. See local `LICENSE`.
- `freecad-scripts`: [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/96543145e9cb97711020b57b9d88f968062c4fc7/skills/freecad-scripts), MIT; scripting reference for future CAD work. See local `LICENSE`.

- `threejs-geometry`, `threejs-animation`: [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills/tree/0e181866f095b5f06d005133876e926515390d95/skills), MIT (local `LICENSE`). These target **r186** and are references for a future migration, not drop-in instructions for the offline viewer.

These are Markdown workflow references, not installed FreeCAD, Blender, or CAD plugins. This standalone viewer **still ships Three.js r128**; r186 is installed only as a parallel npm test dependency (`three-modern`) and scene construction is checked against both. FreeCAD's official AppImage download requires an unavailable binary host in this environment, and CadQuery's OCP import is blocked by missing `libGL.so.1`; neither has been claimed as a working CAD runtime. Blender guidance applies to optional GLB inspection/export, not automatically to the browser runtime. Verify numerical claims against manufacturer documents and the *actual installed equipment* before changing geometry. The original skill documents retain attribution and license headers.
