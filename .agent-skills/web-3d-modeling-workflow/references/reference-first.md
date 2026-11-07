# Reference reconstruction: visible fidelity first

Use for a scene whose primary deliverable is resemblance to supplied imagery. This route preserves high fidelity and physical correctness while avoiding unnecessary package-building and audit machinery. Use the full production route only for requested reusable systems or formal evidence deliverables.

## 1. Make a compact, concrete reference analysis

Before blockout, record in `reference-analysis.json` or an existing scene design document:

- source image identity; distinguish visible facts, inferred construction and unknowns;
- camera family, world axes, base shape and at least two useful screen-space ratios;
- foreground/hero/background zones, major object IDs and recognizable large/medium/small parts;
- intrinsic material/color hypotheses separately from illumination, shadow and atmospheric tint;
- support contacts, circulation, intended occlusions and uncertain hidden construction;
- canonical comparison view, intended closest viewing distance and initial risks.

Keep this concrete enough to drive scene dimensions and part ownership. A generic list such as “trees, building, nice light” is insufficient. Do not create parallel inventories containing the same facts. The detailed schema in [reference-image-analysis.md](reference-image-analysis.md) is for reusable systems, explicit audits or tooling that consumes it; compact local notes do not need its strict validator.

## 2. Establish the picture before detail systems

Use one simple scene containing primary masses, canopy volumes, paths, openings and support/clearance proxies. Macro layout and semantic proxies can share a stage. Check the reference-facing camera, an opposite view and the most relevant physical blind spot; add views for actual risks rather than a fixed quota.

Match projection, framing, height/depth ratios, major silhouettes, negative space and foreground-to-background layering. Choose the initial key/environment light early enough to judge the masses. Do not wait for thousands of leaves to discover that the canopy is too narrow or the roof too flat.

Keep the comparison camera and renderer state reproducible. Reopen camera calibration if evidence shows it is wrong; do not move it merely to hide defective geometry. Complete available agent visual review without waiting for user approval unless the user requested that gate.

## 3. Keep up to three largest visible mismatches active

After each coherent preview, compare at the intended presentation size and nearest supported viewing distance. Rank differences by screen area, contrast, recognizability, spatial influence and construction risk. Correct the owners of the largest differences first.

| Observed mismatch | Owning decision | Useful evidence |
| --- | --- | --- |
| Tree reads as a narrow column instead of a spreading crown | Branch direction, crown radius/height, cluster placement | Crown outline, internal gaps and layered light in the same view |
| Building reads as a box with slabs | Roof profile, overhang, openings and joinery | Roof silhouette, visible support and depth at eaves |
| Slope reads as an empty dark plane | Terrain shape, vegetation layers, material response and fill light | Ground coverage, route readability and lit/shaded color separation |

Treat this as a short work list, not a numeric score to game. If two focused edits fail to improve the same mismatch, revisit the representation or diagnosis before adding more instances or complexity. Do not abandon requested secondary details; resolve them after dominant errors no longer overwhelm them.

## 4. Evaluate representation by appearance

- **Vegetation:** crown aspect ratio, branch hierarchy, clustered density and gaps, leaf scale, color variation, light/shadow response and grounding. Leaf count alone is not a quality metric. Choose actual leaf meshes, cards or clusters for the visible scale; unlit foliage needs a deliberate stylistic reason.
- **Architecture:** distinctive roof curvature/profile, thickness, eaves, openings, timber/stone assembly, seams and weathering. Generic repeated slabs cannot substitute for a reference-defining roof or facade.
- **Terrain and paths:** believable height stack, irregular but usable steps, edge transitions, exposed rock and layered ground cover. Complex scatter samplers are useful only when they improve placement or appearance.
- **Materials:** grain direction and texture scale, roughness variation, edge response, localized moss/wear and readable material differences. Use procedural textures without external assets when required. Add shader complexity only for a visible need and validate its exercised variants.
- **Lighting:** explain the key direction, shadow softness, environment fill, warm/cool separation and practical sources. Tune materials with post effects disabled, then compare the full look. Bloom and depth of field must not conceal missing structure.

Preserve large/medium/small contributors in hero zones. Spend detail where it is visible or required by interaction; do not invent hidden hardware solely to increase a count. Respect explicit extreme close-up or export requirements.

## 5. Test a usable scene early

At the first coherent preview, test exposed orbit and continuous zoom, camera presets, mood/quality switching, resize, reload and hidden-tab return. Exercise transitions between presets, not only their endpoints. Verify the page and dynamic module requests, console and shader health. Establish a persistent local preview and a restart command where local delivery is requested.

For camera-dependent black rectangles, popping or corrupted highlights, reproduce the offending angle/size. Isolate render passes, synchronize camera/depth parameters, and inspect actual positions, normals, instance transforms and non-finite HDR values. A clamp or fallback may contain a symptom but does not prove its source is fixed. Recheck the original interaction after correcting the owner.

## 6. Finish with focused evidence

Follow [qa-modes.md](qa-modes.md) and applicable sections of [qa-acceptance.md](qa-acceptance.md). Every extra polish/check iteration needs an observed defect or uncovered required risk, its owner, expected improvement and focused recheck.

- Visual improvement: use the same camera/state before and after; a subtle claim should be visible at the intended scale.
- Reliability improvement: show the previously failing interaction or relevant risk now passes, even if the still image is unchanged.
- Optional polish: deliver when important reference features, requested interactions and applicable checks are complete; do not prolong work simply because more details are possible.

One clean applicable final review is sufficient. Reuse unaffected evidence; repeat changed views and relevant blind spots after a defect fix. Do not generate full audit packages, hashes, motion contracts for absent motion or prolonged benchmarks merely because the user said quality first. There is no arbitrary time cap: unresolved significant fidelity or runtime problems still require work.

Report actual improvements and remaining limitations. Do not equate algorithm complexity with fidelity, claim pixel-perfect reconstruction without evidence, or call throttled/headless timing representative interactive FPS.
