# Production workflow

This is the full production route for reusable object systems and requested engineering deliverables. For a reference-matched scene, start with [reference-first.md](reference-first.md) and consult only applicable sections here. Complexity or quality-first language does not make every template, benchmark or audit mandatory. Review gates mean agent checks, not required user sign-off unless explicitly requested.

## 0. Resolve scope and delivery

Record before editing:

- output surface: local HTML, existing site, embedded component, or published site;
- framework and renderer: Three.js, React Three Fiber, Babylon.js, raw WebGL, or another engine;
- reference fidelity: exact fixed-shot match, stylized similarity, or original design;
- required motion, camera freedom, quality presets, lighting states, accessibility, and performance targets;
- canonical comparison viewport/camera, target device class, texture-transfer/decoded-memory budget, frame-time budget and acceptable interaction-time adaptation;
- whether browser visual QA is explicitly requested or necessary for reference matching;
- whether local-only delivery forbids deployment.
- active QA mode: `fast`, `milestone`, `local-final`, `audited-release`, or `migration`, selected with [qa-modes.md](qa-modes.md).
- integration boundary per renderer: direct scene module, framework wrapper, or isolated iframe/srcDoc; name the one owner of initialization, RAF, resize and disposal.
- any source repositories or example galleries that are evidence inputs, including exact commit/tag, license and target Three.js/runtime version.

Preserve the existing package manager, project structure, runtime, and unrelated user changes. When `.openai/hosting.json` exists, the current Site-owning agent keeps sole ownership of site edits and preview handoff.

## 1. Convert references into a scene hypothesis

For image-guided work, create concrete analysis before blockout. Local reconstruction may use the compact artifact in [reference-first.md](reference-first.md). Reusable systems, explicit audits and tools consuming the full schema use [reference-image-analysis.md](reference-image-analysis.md), its JSON template and strict validator. Carry the analysis into scene dimensions, parts, materials and comparison cameras; avoid duplicate inventories.

Create a short evidence table rather than copying visible pixels blindly:

| Evidence | Hypothesis | Confidence | Validation |
| --- | --- | ---: | --- |
| rail direction | world X axis | high | sleepers remain perpendicular in all views |
| road crossing | road follows Z axis | high | road intersects rail once at 90 degrees |
| tunnel mouth | portal plane at fixed X | high | train silhouette fits portal clearance |
| hidden tunnel | short shell plus render clipping | medium | no train visible from back/outer views |
| isometric look | orthographic camera | high | parallel edges do not converge |

For a single image, measure screen-space ratios: base width/depth, object height relative to rail gauge, portal width relative to car width, platform width relative to car length, and roof span relative to column spacing. Treat hidden geometry as a hypothesis until a rotated view disproves it.

Inventory the scene by layer:

1. base and support surfaces;
2. primary path or hero object;
3. structural assemblies;
4. secondary props;
5. materials and decals;
6. motion systems;
7. lighting and atmosphere;
8. UI and camera controls.

For a real-world environment, also inventory by semantic zone. Record large objects, medium assemblies, small contents, circulation, utilities, and support/access rules before modeling. Read [real-world-detailing.md](real-world-detailing.md).

For each image-derived object, bind the inventory entry to a normalized evidence region and classify it as directly visible, inferred from real construction, or unknown. Record approximate colors, material response, meaningful assembly parts, support/attachment/clearance relations, repetition grammar, and QA risks. Do not treat night lighting, reflection color, or atmospheric tint as intrinsic material color without evidence.

Gate: the chosen reference analysis is concrete and internally consistent (strict validation when the full schema is selected); its inventory, axes, base bounds, camera family, material hypotheses, unknowns, physical relationships, and risk-derived QA seeds are explicit.

## 1A. Mine reusable source patterns when a repository is in scope

Read [source-pattern-mining.md](source-pattern-mining.md). Search by rendered subject and by mechanism, then trace each promising example from the gallery/export entry through its wrapper into renderer, geometry, material, shader, lifecycle and asset dependencies. Ignore vendored/minified runtimes unless dependency compatibility is the question.

For each finding, record:

- immutable repository revision, source paths and governing license;
- observed source fact versus inferred principle versus target-project adaptation;
- algorithm/shape grammar and its tunable parameters;
- renderer/version assumptions, shader injection points and external data/assets;
- known defects or shortcuts that must not be copied;
- minimum dependency closure and intended integration boundary.

Classify the result as `principle`, `reference-only`, `adapt`, or `candidate-for-promotion`. A gallery demo can teach a useful rule without being safe to copy. Promotion into the approved asset catalog happens only after target-version construction, physical, visual, performance, lifecycle and provenance gates pass.

Gate: every source-derived candidate has enough evidence to reproduce its useful behavior without copying unrelated site infrastructure, and no source limitation is silently rebranded as a production feature.

## 2. Search assets and establish coordinate ownership

Create shared scene configuration before detailed geometry, using project types or JSDoc as appropriate. Store dimensions, anchors, counts, motion speeds, portal extents, quality budgets, and effect densities there. Components may derive local offsets, but must not redefine global truth.

When existing assets are allowed and credible candidates would help, search the approved local asset catalog before building proxies. Skip catalog and source-mining work when assets are prohibited or custom construction is the appropriate route. Respect prohibited directory boundaries. Record candidate asset IDs, exact or conservative asset envelopes, expected pivots, support contacts and `reuse/adapt/custom/defer` decisions. Search now so blockout uses credible dimensions; defer importing or rendering detailed assets until the proxy layout gate passes. Source-mined candidates remain outside the approved catalog until their promotion record passes. Read [blockout-and-asset-resolution.md](blockout-and-asset-resolution.md).

Create a proxy manifest that binds every layout-relevant object to a stable semantic ID, anchor owner, axes, support surface, conservative visual envelope, operating/access envelope and optional candidate asset ID. The same ID survives blockout, asset resolution and final QA.

Add an explicit audit policy: required object kinds, support-bearing kinds, collision severity, structured-detail requirement, and minimum tag coverage. Highest-quality work uses full configured-object coverage; a missing audit tag is a blocking error rather than an invitation to skip the object.

For an explicitly scoped full-scene contract migration, build a complete migration inventory before trusting existing green checks. A focused repair does not trigger this migration; keep existing checks and retrofit its affected ownership only. Every existing physical assembly must either enter the current collision/support/topology contracts or have a specific reviewed exclusion. Replace legacy QA schemas and weak local validators instead of layering new labels over old evidence.

Build a height stack and a zone map. Read [geometry-and-placement.md](geometry-and-placement.md) for formulas and collision rules.

Gate: a validator can answer whether rail, tunnels, roads, platforms, and objects fit inside the base and whether support surfaces touch.

## 3. Build and approve the blockout

Render only:

- base and ground surface;
- main path, track, road, or hero-object silhouette;
- portals/openings and their clearance volume;
- platform/foundation/support geometry;
- default orbit camera and a reset control.

Inspect the reference-facing view, opposite view and relevant support/closure blind spots before adding detail; add azimuths or roof-end views where actual risks require them. The default view is not evidence that the back, underside, roof closure, wheel orientation, or opposite portal is correct.

Add semantic proxies for layout-relevant medium objects during this same blockout stage: shelves, counters, chillers, vending machines, bicycles, benches, machines, trees, and other functional props. Use conservative boxes, cylinders, and explicit operating/access envelopes. Do not model product contents or fasteners yet.

Gate:

- all primary geometry is within bounds;
- no support is floating;
- road/track/platform relationships are physically possible;
- roads, aisles, doors, service bands and reserved berths are represented as explicit negative-space corridors and pass 2D/OBB clearance checks;
- the camera can inspect the scene without entering the base accidentally.
- required solid shells are closed and expected object axes match real-world orientation.
- every eligible primary Mesh is audit-tagged; rotated collision bodies use OBB/SAT; multi-contact assemblies declare each load-bearing contact.
- agent visual review verifies macro proportion, negative space, circulation and the supported camera range before detailed assets replace proxies; user approval is required only if explicitly requested.

Do not add finished bicycles, vending machines, shelf contents, labels or material polish merely because they already exist in the asset library. Macro blockout proves composition and large physical relationships first.

## 4. Complete the proxy contract

Add simple stable-ID proxies for layout-relevant medium objects: shelves, counters, chillers, vending machines, bicycles, benches, machines, trees and other functional props. Use conservative boxes, cylinders and explicit clearance volumes rather than detailed geometry.

Each proxy must own:

- semantic role and zone;
- anchor, forward/up axes and support surface;
- full visual envelope, including overhangs;
- door/drawer/service/ventilation envelope when relevant;
- circulation/safety class;
- candidate local asset ID or custom-build decision.

Do not proxy every bottle, cup, fastener or label. Represent product/content needs as density/category targets until the fixture layout passes. This section completes metadata and conservative extents for the blockout built in the previous stage; it is not a second independent modeling pass.

Gate: all layout-relevant objects have stable identities and conservative extents; no candidate asset is known to exceed its proxy; proxy-only inspection can evaluate the intended use of the scene.

## 5. Pass the layout and physical gate

Run bounds, support, OBB collision, entrance/aisle/staff/customer/vehicle circulation, door/service/maintenance clearance, camera occlusion and preliminary renderer-budget checks against proxies. For retail scenes, apply [retail-layout-and-merchandising.md](retail-layout-and-merchandising.md).

Change dimensions and placement at this stage. Do not repair an invalid plan later by shrinking final assets, hiding components, sinking geometry or using camera-specific clipping.

Gate: the proxy scene has no P0/P1 layout or physical contradiction and is approved for asset resolution.

## 6. Resolve assets and build assemblies, not decorated boxes

Replace one proxy family at a time. Copy the approved asset's minimum dependency closure or construct a custom assembly from the same proxy contract. Preserve stable IDs, anchors, axes and support ownership; compare the complete rendered bounds with proxy/collider extents before removing the proxy. If the asset exceeds the proxy, reopen the layout gate instead of silently forcing it to fit.

For a procedural or source-derived hero asset, read [procedural-hero-assets.md](procedural-hero-assets.md). Resolve its five linked contracts together: shape/construction grammar, surface-history grammar, support/envelope, runtime/lifecycle, and evidence. Seed all reusable randomness; expose semantic controls with safe ranges; repair known source shortcuts such as open solids, incorrect cap normals, absent shader cache keys or disabled frustum culling before promotion.

Track each object as `proxy-only → resolving → resolved → validated`. Never leave both proxy and final asset as unexplained overlapping solids. Rerun affected support, collision, axis, close-view and performance checks after each family.

Break real manufactured objects into meaningful parts: body shell, frame, glass, gaskets, doors, hinges, bogies, fixtures, supports, gutters, brackets, handles, panels, and fasteners. Use shared components for repeated construction grammar.

Read [detail-and-material-patterns.md](detail-and-material-patterns.md). Add high-frequency details only after silhouette, spacing, and structural seams pass.

Prefer instances for repeated ballast, studs, bolts, plants, petals, sleepers, and fasteners. Prefer curves or rod-between-points helpers for frames, pipes, wires, and bicycle geometry.

After each assembly family is added, run the same support/intersection/axis audit again. Common objects deserve the same scrutiny as hero assets: closed roofs, vertical bicycle wheels, supported shelves, aligned handles, and grounded props.

At milestone and final scope, bind topology checks to the actual visible shell. A conservative collision or audit envelope may prove spacing, but it cannot prove wall winding, roof closure, back-face correctness, or absence of coplanar render surfaces. Detect overlapping near-coplanar deck/wall/road faces or use an explicit stable decal contract (`polygonOffset`, depth-write policy and render order) when layering is intentional.

Bind the zone inventory to actual configured IDs and the live scene graph. Encode minimum rendered count, semantic categories, visible variants and evidence views for each hero-zone large/medium/small requirement. Run both the configuration validator and runtime detail auditor; a prose inventory cannot substitute for rendered contributors.

Gate: close views reveal believable part boundaries and real-world contents at large/medium/small scales; distant views preserve a clean focal hierarchy; no P0/P1 physical defect remains from the assembly pass.

## 7. Lock the shot and perform look development

Read [look-development-and-performance.md](look-development-and-performance.md). Restore the canonical camera, viewport, tone mapper, exposure and environment before changing materials or post-processing.

Build the look in dependency order:

1. real-scale base color/normal/roughness/metalness/AO/height contracts;
2. material-specific macro variation and wetness;
3. construction-aware decals for runoff, rust, cracks, moss, waterlines and repairs;
4. bevels, joints, drainage, flashing, fasteners, ballast and other highlight/parallax geometry;
5. environment/indirect response and practical-light bounce;
6. GTAO/contact depth, localized Bloom, reflection, miniature focus and LUT grading.

Keep post-processing disabled while judging base material identity. Capture the canonical base-material view, the full-look view, a grazing material close-up and an opposite/underside view. Use overlay/difference comparison for reference-guided work.

Gate:

- concrete, wet road, metal/rust, glass, wood and water are distinguishable by response as well as color;
- weathering has a physical source and gravity/drainage logic;
- transparent fronts reveal the intended interior and do not expose missing walls or intersections;
- practical lights illuminate nearby surfaces and wet reflections without global overexposure;
- disabling post-processing does not collapse the scene into flat plastic or black silhouettes.

## 8. Add motion and visibility

Separate these concerns:

- simulation state: progress, velocity, wind phase, gate closure;
- transform state: object position, rotation, deformation;
- render visibility: clipping, occlusion, quality-dependent detail;
- UI state: pause, follow, mood, quality, effect toggles.

Do not use motion to hide geometry mistakes. Read [animation-lighting-visibility.md](animation-lighting-visibility.md) before implementing tunnels, hidden loops, particles, or moving lights.

Apply [web-3d-frontend-integration.md](web-3d-frontend-integration.md) to the host as well as the shader: one scheduler owns continuous or on-demand rendering; visibility, document state and reduced motion govern work; pointer coordinates are mapped through the actual canvas rect; animated bounds are conservative; teardown removes every listener/observer and disposes GPU resources. Isolate an incompatible legacy/full-document renderer instead of mixing Three.js object graphs across versions.

Gate: run one full cycle at normal and high speed. Entry/exit tangents, car spacing, gates, particle recycling, and camera follow remain stable. Generate the canonical runtime-motion artifact from the same production paths and colliders; every adjacent path segment receives a swept OBB test and no penetration, unsupported sample, discontinuity or premature whole-object edge disappearance remains.

## 9. Add lighting states and quality tiers

Start with accountable illumination: one environmental source, one key light, and actual practical lights. Add night mode only after day materials read correctly.

For every practical light, build:

1. physical fixture;
2. luminous lens or panel;
3. light source that illuminates nearby surfaces;
4. optional visible beam or pool when the style requires it.

Quality tiers must preserve correctness. High quality may increase DPR, shadow map resolution, reflected layers, instances, and micro-geometry. Low quality may reduce them but must keep core shadows, animation, and geometry.

Gate: switch every mood and quality tier while paused. No shadow map disappears, material turns black, or renderer-only option silently fails to update. Run moving vehicles, rain and reflections long enough to detect shimmer, temporal lag, clipping and edge leaks.

## 10. Measure and refactor performance

At the first coherent high-quality whole scene, record fixed-state renderer, asset, shadow, reflection, post-processing and load diagnostics using [look-development-and-performance.md](look-development-and-performance.md). The baseline must name device/browser/WebGL renderer, DPR, camera, viewport, quality, animation, warm-cache/network and tab-visibility state. Persist raw settled/interaction RAF, repeated warm-load and input-to-present samples only for explicitly measured performance work or audited release. Ordinary local-final uses compact representative runtime checks; do not infer a benchmark deliverable from quality-first language.

Optimize in cost order:

1. recursive or unnecessarily full-rate reflection renders;
2. point-light shadow cubemaps, excess shadow lights and irrelevant micro-casters;
3. true transmission and overlapping transparent layers;
4. repeated geometry/material draw calls that should be instanced, batched or shared;
5. unpacked/oversized textures, synchronous procedural textures and eager QA/reference assets;
6. full-resolution AO/depth passes whose contribution is invisible at the reference scale;
7. per-frame allocation, traversal, listener/render-loop duplication and hidden-tab work.

Use interaction-time caching when useful: retain the last valid reflection/shadow buffers and temporarily pause expensive AO while the camera moves, then restore full settled quality within one or two frames. Do not “optimize” by deleting hero details, flattening interiors, lowering the canonical camera resolution without agreement, or replacing physical wet/glass/light response with a flat color.

Gate: before/after metrics use identical state, the configured budgets pass, no shader/console/context error appears, and fixed-shot plus rotated/moving A/B review finds no P0/P1 visual regression.

## 11. Iterate with proportional evidence

Follow [qa-modes.md](qa-modes.md). Keep one validation loop per scale:

- **Local edit:** run affected automated contracts, reload/HMR, and inspect zero to three ownership views. Do not request human review.
- **Coherent milestone:** run all subsystem contracts and representative states, inspect the minimal risk-covering view set, then perform one live-page agent visual continuity review when the result changes visible composition or whole-object coherence.
- **Local-final:** rerun affected runtime audits and typecheck, inspect the planned live risk views, close P0/P1 defects, and complete one final agent visual continuity review. Do not generate hashes or publication evidence.
- **Audited-release:** only when explicitly requested, add the complete persisted evidence set, production page, performance/motion package, file digests, and canonical gate.

After a P0/P1 correction, repeat the same owning view and one new blind-spot angle. Do not blindly rerun unrelated states or ask the human reviewer to re-evaluate unaffected work.

Keep a compact local QA record from the first coherent render onward. A second iteration is required only after a P0/P1 correction and must contain the same-view recheck plus one new blind-spot angle. Keep defect origin, owning dimension/assembly, fix summary, and relevant view IDs connected.

Maintain ownership-to-view/state dependencies. Reuse a previous reviewed view when its camera, state, and dependent scene/material/light ownership remain unchanged. Prefer live inspection; group selected captures into contact sheets only when comparison helps. Keep browser profile/cache directories outside the project.

Do not batch many unverified spatial edits. Small coordinate changes can create new collisions in views that are not currently visible. Record stage start/end time, automated-run count, human-review count, and P0/P1 reopen reasons in a compact workflow timeline when process efficiency is being evaluated; do not add this bookkeeping to small one-off models.

## 12. Local handoff

Keep the development server available and test the live local URL. Run and inspect a production build only when build initialization, chunking, or deployment-like timing is part of the experiment.

Deliver:

- the working local or hosted URL authorized by the user;
- typed scene configuration;
- reusable detail components;
- configuration validator;
- workflow/QA documentation;
- compact local QA summaries and selected defect/comparison captures when useful;
- complete-cycle runtime motion artifact bound to the production path and collider registry;
- the look-development contract, texture/channel inventory, performance budget and fixed-state before/after diagnostics;
- a concise note on remaining limitations, if any.

Do not claim completion merely because the build succeeds. Apply [qa-acceptance.md](qa-acceptance.md).

For ordinary local-final handoff, affected project validators and the reviewed live page are sufficient. Run the Skill-owned canonical gate from [conformance-gate.md](conformance-gate.md) only in explicitly requested audited-release mode.
