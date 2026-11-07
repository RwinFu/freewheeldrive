# QA and acceptance gates

This file defines default `local-final` acceptance for experimental Web3D assets. Use [qa-modes.md](qa-modes.md) for `fast`, `milestone`, one-time `migration`, or explicitly requested `audited-release`. Use both automated and live visual gates; do not add publication or tamper-evidence work to a local experiment.

Apply only checks for features actually present and required. Rail, vehicle, shop, rain and interior examples below are conditional; do not add those features or their audit machinery to an unrelated scene. Use existing project checks where they cover the same risk.

## First coherent review

The first coherent render is a review milestone. Inspect the planned risk views and supported continuous orbit. Exercise exposed continuous zoom, camera presets, mode/quality transitions, resize, reload and hidden-tab return. Check the page and dynamic module requests, console/shader health and a preview-server lifetime appropriate to local delivery. If it is clean, one reviewed iteration is enough. When a P0/P1 defect is found, complete this focused loop:

```text
full-view audit → defect list → ownership fix → same-view recheck → new-angle audit
```

Continue while any P0/P1 item remains. If a correction changes a parent transform, support height, footprint, roof, aisle, shelf, path, or tunnel, repeat every affected view and automated check.

For local-final, a compact project record of inspected views, actual command outcomes and defect rechecks is sufficient. If using the structured QA plan/evidence tooling, create a real evidence file from [../assets/qa-evidence.template.json](../assets/qa-evidence.template.json), then run:

```bash
node scripts/validate_qa_evidence.mjs qa-views.json qa-evidence.json
```

The local evidence validator checks only the views, states, automated gates, and files enabled by the project QA plan. Default local templates require one review iteration and no file digests. Same-view and new-angle evidence are required only after a P0/P1 correction. Do not create fictitious pass records; record only browser states and command results that were actually inspected.

Project-local validators are authoritative for `local-final`. Use the canonical conformance gate in [conformance-gate.md](conformance-gate.md) only for explicitly selected `audited-release`, where file digests and tamper-evident artifact binding are intentional requirements.

## Automated configuration gate

Run the in-project validator or:

```bash
node scripts/validate_scene.mjs path/to/scene.json --qa-plan=path/to/qa-views.json --warn-as-error
```

Errors block detail polish or delivery. Warnings require review and an explicit reason if accepted.

Select checks matching actual scene features; keep the general bounds, support, geometry validity and ownership checks:

- rail and tunnel extents remain inside the base;
- road length remains inside the base;
- portal side and roof clearance fit the highest vehicle state;
- platform/vehicle gap is within the configured range;
- platform and buildings touch their support surfaces;
- road, farm, track safety, and object footprints do not overlap unintentionally;
- repeated fences have a crossing gap;
- object IDs are unique.
- tagged solid meshes have no open boundaries, non-manifold edges, degenerate triangles, or invalid normals;
- tagged assemblies match expected axes and support heights;
- tagged collision classes have no unexplained world-space intersection.
- the configured and live runtime tag coverage meets the declared minimum and all required IDs/kinds exist;
- rotated footprints use OBB/SAT instead of final AABB-only acceptance;
- every meaningful wheel, leg, foot or foundation contact point touches its support plane;
- hero-zone detail requirements resolve to actual object IDs and meet rendered quantity, category and variant minimums.
- each prefab ID in the active document resolves to a registered renderer, and every declared collider encloses the rendered contract envelope it represents;
- runtime binding coverage is one-to-one and verifies document parentage, effective ancestor visibility and root-relative world matrices rather than only local `visible` and position fields;
- coverage tags are stable document/prefab registrations; no pre-audit UUID tagging pass can turn unregistered meshes into a pass.

## Required visual views

Choose a minimal set covering the actual scene risks:

1. canonical reference-facing/home view and an opposite view when camera freedom is supported;
2. a hero close view and the relevant support/closure blind spot;
3. roof ends, interior, portals, pivots or ground-contact views only where those structures need verification;
4. requested mood/quality states, plus continuous transitions when they can reveal artifacts;
5. the same-view base-material/full-look pair for look development, and a grazing view when material response requires it.

A single view may cover several risks. These are purposes, not a screenshot quota. Add views for uncovered risks; never omit a known failure angle.

Pause animation for geometric comparisons. Reset the camera before and after exploratory drags so evidence remains comparable.

Every selected local risk view must be inspected reproducibly and have its planned checks recorded. Named presets are useful for repeated comparisons; a formal view manifest is only required when the project uses that tooling. Persist a screenshot only when comparison, defect history, or handoff benefits from it. When a correction is made, retain the original defect view if available, repeat the same affected view, and add one new blind-spot angle. Do not recapture unrelated views.

When a view record is persisted, read the actual renderer camera position and target after controls settle. The evidence validator compares them with the planned camera. A record named `night-front` that was inspected from the home camera is a failed view. Local-final does not use per-file hashes.

## Static geometry acceptance

- Base bevels do not expose rail, tunnel, or road geometry outside the slab.
- Platforms, houses, columns, lamps, fences, and props have ground/support contact.
- Roof slopes meet correctly; ridges and eaves face the intended direction.
- Train wheels meet rail heads; bogies and underfloor equipment do not penetrate sleepers.
- Portal openings fit vehicle width and maximum height.
- Roads and crossings have coherent height transitions and rail gaps.
- Farms/gardens remain outside roads; tree trunks remain outside planting rows and structures.
- Guardrails and fences leave track and crossing clearances.
- Repeated parts have consistent spacing and no duplicate transforms.
- Required solid volumes are closed at front, back, sides, ridge, ends, and underside.
- Normals face outward and mirrored components have consistent winding.
- Bicycle/vehicle wheels are vertical, parallel as intended, centered on axles, and contact their support surface.
- No child mesh penetrates the ground merely because its parent origin appears correct.
- Doors, drawers, gates, service panels, and aisles have plausible operating clearance.

## Physical-world logic acceptance

Ask for every hero assembly:

- What supports its weight?
- What does it connect to?
- Which way does it face or rotate?
- Can a person or mechanism use it?
- Does gravity place its contents on a support surface?
- Are power, drainage, ventilation, and access plausible when visible?

Any unexplained answer is a defect. Visual stylization may simplify dimensions, but it does not excuse impossible assembly logic.

## Detail acceptance

- Vehicle windows show frame/gasket, glass, interior/recess, and highlights.
- Doors show frame, window, seam, handle/control, and sill.
- Cab face has localized headlights/tail lights; the body panel is not the emitter.
- Benches read as wood slats on metal frames.
- Vending machines show products, glass, controls, and retrieval opening.
- Roofs show seams/ribs, supporting structure, gutters, and drainage.
- Signs have readable content, frames, supports, and correct facing direction.
- High-quality micro-geometry is visible at a close view without destroying distant clarity.

## Semantic detail-density acceptance

Create a real-world zone inventory before filling a detailed environment. Every hero zone must contain:

- large-scale function and circulation;
- medium-scale construction and modules;
- small-scale contents, interfaces, hardware, labels, or lived-in evidence;
- category-appropriate placement rather than random filler;
- controlled variation in repeated items;
- access and support clearances.

For a convenience store, a shelf run without bays, several levels, price rails, product categories, stock depth, labels, and some variation is incomplete. A checkout without POS/scanner/payment/receipt/bagging/storage details is incomplete. Use [real-world-detailing.md](real-world-detailing.md).

The configuration inventory and live scene graph must agree. Use existing scene-graph checks or [../assets/runtime-detail-audit.template.ts](../assets/runtime-detail-audit.template.ts) when quantity/category coverage needs automation; do not let a declared quantity stand in for missing meshes or instances. Highest-quality hero zones require actual large/medium/small contributors, specific semantic categories and evidence views.

After increasing detail density, rerun intersection, support, and orientation audits; small contents often introduce new penetrations or floating objects.

## Look-development acceptance

Read [look-development-and-performance.md](look-development-and-performance.md). Persist the canonical renderer state and material inventory, then verify:

- the camera projection, pose, frustum/FOV, viewport, tone mapper, exposure, environment and fog can be restored exactly;
- hero materials declare real-world texture scale, mapping method, color space and required base-color/normal/roughness/metalness/AO/height channels;
- concrete/plaster, wet road/paving, painted/rusted metal, glass, wood and water remain materially distinct with post-processing disabled;
- weathering and decals have construction, gravity, drainage, traffic or repair logic rather than uniform random grunge;
- glass includes frame/recess, gasket, pane, interior and controlled reflection; transparent layers do not reveal missing walls or intersections;
- bevels, joints, drainage, flashing, rail hardware, guardrail fixings and other silhouette/parallax details are geometry when maps cannot represent them;
- environment or baked indirect light keeps non-emissive surfaces readable, while practical lights create localized surface illumination and wet reflections;
- Bloom is localized, highlights retain source shape, LUT grading does not hide clipped exposure, and depth of field does not conceal missing geometry;
- the full look remains stable in the opposite, grazing, rotating and moving states.

If texture assets were optimized, preserve their original sources and record source/output dimensions, channel packing, transfer size, decoded-memory estimate and fidelity check. Lossy normal-map recompression requires explicit visual/vector validation; ordinary JPEG quality settings alone are not acceptance evidence.

## Animation acceptance

For moving solids, mechanisms or clearance-sensitive motion, run at least one complete cycle at normal speed and a partial cycle at the maximum exposed speed. Static scenes skip this section. Decorative wind/particles use bounded playback, recycling and state-continuity checks without a vehicle-motion artifact.

Generate and validate the runtime-motion artifact from the same path functions and collider registry used by the renderer. Every adjacent complete-cycle segment receives a swept OBB test; sample spacing is smaller than the narrowest relevant clearance. Bind its partial-at-edge and fully-hidden capture IDs to real QA evidence.

- Car spacing stays constant.
- Portal entry/exit is aligned with the track.
- No car, light, beam, or shadow is visible beyond a tunnel mouth from any external angle.
- Level-crossing gates react to position and do not collide with train or catenary.
- Particle recycling does not create bursts, black instances, or accumulation below ground.
- Crown sway remains subtle and phase-varied.
- Pause/resume preserves state without a jump.
- Follow and orbit camera modes do not fight each other.
- Zero swept penetrations, unsupported samples, tangent discontinuities, impossible grades/steering radii or premature whole-object boundary disappearance remain.

## Lighting and quality matrix

Test the combinations actually exposed by the UI; the table is an example, not a requirement to add golden-hour or quality controls:

| Mood | High quality | Low quality |
| --- | --- | --- |
| day | shadows, glass, micro-detail | core shadows and geometry remain |
| golden | exposure and shadow direction update | no material breakage |
| night | practical lights, windows, beams | core lighting remains readable |

Confirm the high preset produces visible changes and that toggling it does not remove shadows.

## Performance acceptance

Measure the same canonical camera, viewport, quality, animation and tab-visibility state before and after optimization. Persist:

- average/median/p95 frame time with the sampling conditions;
- draw calls, triangles, geometries, textures and shader programs;
- Mesh/InstancedMesh and unique-material counts;
- transparent/transmission mesh counts;
- light count, shadow-light count, shadow-caster count and shadow update policy;
- planar/SSR reflection count, recursion protection and update cadence;
- initial texture transfer bytes and estimated decoded GPU bytes;
- warm-load and representative camera-interaction latency;
- current console, shader and context health.

For local-final, check representative foreground interaction and console/shader health; retain a compact browser/viewport/DPR and renderer-counter snapshot when available. If timing is measured, record device/browser/WebGL renderer and sampling conditions; never invent unavailable telemetry. Use longer raw-sample windows, repeated warm loads, input-to-present samples, and a health soak only when performance is an explicit experiment target or `audited-release` is selected. Before/after comparisons must still use matched conditions.

Local-final requires:

- no recursive reflectors or uncontrolled full-scene reflection updates;
- a priority-ordered shadow budget with micro/transparent/particle casters excluded when they add no visible information;
- true transmission limited to cases where visible refraction/thickness justifies the extra pass;
- repeated small geometry/material families instanced, batched, merged or explicitly justified;
- scalar PBR channels packed or sized independently when this does not reduce visible fidelity;
- QA/reference resources and large procedural fallbacks deferred when they are not required for the first scene frame;
- high-quality interaction may cache reflection/shadow buffers or pause expensive AO, but must preserve geometry/material visibility and restore the settled high-quality frame within one or two frames;
- low quality preserves physical correctness, core material identity, practical lighting, shadows, clipping and animation;
- no performance claim based only on a hidden/throttled tab, different viewport/state, or deletion of required hero detail.

A large numeric gain is not a pass when fixed-shot or rotated A/B evidence shows degraded wet reflection, contact depth, glass interior, material scale, warm/cool bounce or hero detail.

## Runtime acceptance

- no current console errors or shader compilation failures;
- no repeated creation of renderers or leaked browser tabs;
- no per-frame renderer/composer creation, unbounded material/texture/render-target growth, or duplicate animation loop;
- syntax/type checks appropriate to the actual project pass;
- production build/page checks only when build behavior is part of the experiment;
- local server remains available when local delivery is requested.
- applicable project geometry/detail/motion checks pass with blocking severity; use `validate_scene.mjs` when the project uses its scene schema;
- any configured local QA evidence references real inspected states and its final decision is `pass`;
- canonical conformance is required only for explicitly selected `audited-release`.

Framework deprecation warnings may be documented separately, but do not ignore shader, WebGL, React render, or missing-component errors.

## Evidence discipline

Lead with the current contradiction, not the amount of work completed. A scene at 80% detail with a train visible through the back of a tunnel is not ready.

Prioritize defects:

- P0: visibility, collision, grounding, bounds, broken lighting, runtime errors;
- P1: assembly correctness, material layering, missing hero details;
- P2: secondary props, minor texture/color variation, polish.

For quality-first requests, missing reference-defining large/medium/small contributors in a hero zone is P1, not optional polish. Judge fidelity by silhouette, proportions, material/light response and recognizable assemblies at the intended viewing scale, not counts alone. Hidden unrequested hardware is not automatically P1.

Before extending QA or polish, identify the observed defect or uncovered required risk, its owner and expected visible/functional benefit. One clean applicable final review is sufficient; deliver when requested features are present and no known blocker remains. Do not invent extra audits after this point.

Fix and recheck one ownership class at a time. A road/farm change can invalidate trees, fences, lamps, and camera composition.

Inspect the live page first. Save full-resolution captures or contact sheets only when they improve comparison or defect communication. Keep persistent browser profiles and caches outside the project QA directory.
