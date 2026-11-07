# Source pattern mining and promotion

Use this reference when an open-source repository, gallery, shader archive, demo collection or copied example is expected to improve a Web 3D build. The goal is not to collect snippets. The goal is to extract a reproducible rule, preserve provenance, identify hidden runtime assumptions, and decide whether the result is a principle, a reference, an adaptation, or a promotable local asset.

## The evidence chain

Trace a candidate in this order:

1. **Catalog entry:** displayed name, route, variant, thumbnail and public description.
2. **Integration boundary:** React/Vue/Svelte wrapper, direct module factory, custom element, iframe, or full-document `srcDoc`.
3. **Renderer owner:** scene/camera/renderer creation, loop scheduling, input, resize and disposal.
4. **Construction:** geometry builders, seed/random streams, transforms, anchors, supports and bounds.
5. **Surface:** material creation, texture generation, color-space handling, shader patches and grading assumptions.
6. **Runtime:** visibility policy, reduced motion, context loss, adaptive quality and loading behavior.
7. **Distribution:** package exports, copied assets, licenses, source manifests, version aliases and build guards.

Do not stop at the most readable wrapper. It often contains lifecycle behavior but none of the geometry. Do not begin from a bundled/minified Three.js runtime unless the task is explicitly compatibility analysis.

## Keep four kinds of statements separate

Every mining note must label statements so future users can tell evidence from interpretation:

- `source-fact`: directly present in a pinned file and line/function;
- `inferred-principle`: a general rule supported by one or more source facts;
- `target-adaptation`: a deliberate change required by the consuming project;
- `open-question`: something not proved by source inspection or runtime evidence.

Example:

- Source fact: a branch segment uses `CylinderGeometry(..., 6, 1, true)` and a double-sided material.
- Inferred principle: six-sided tapered segments are sufficient for a stylized middle-distance branch.
- Target adaptation: close the segment ends or union connected segments for a hero asset that claims solid topology.
- Open question: whether a joined alternative preserves the desired silhouette under the target camera.

This prevents a useful demo shortcut from being copied as a production guarantee.

## Search by subject and by mechanism

Search names and UI text first, then search implementation mechanisms independently:

- subject: tree, grass, rock, gate, shrine, torii, roof, moss, puddle, leaves;
- geometry: `InstancedMesh`, `BufferGeometry`, `IcosahedronGeometry`, curve/sweep, recursion, merge;
- surface: `CanvasTexture`, normal, roughness, `onBeforeCompile`, color space, alpha test;
- lifecycle: `ResizeObserver`, `IntersectionObserver`, `visibilitychange`, `contextlost`, `dispose`, `requestAnimationFrame`;
- packaging: lazy import, subpath export, aliases, preserve modules, source manifest, asset/license notice.

Search the actual public component/renderer tree as well as metadata. A gallery may list one parent with many route variants; variants can be parameter presets rather than independent implementations.

## Build the minimum dependency closure

For a candidate, list the files and runtime services needed to reproduce the feature. Classify each dependency:

| Dependency | Keep | Replace | Exclude |
| --- | --- | --- | --- |
| geometry/material builder | when it contains the desired rule | when it is tightly coupled but small | when unrelated to the result |
| seeded noise/random helper | when deterministic and compatible | with project seed utilities | never replace with direct `Math.random()` silently |
| wrapper lifecycle | when framework-compatible | with the project's host contract | do not omit without replacing ownership |
| Three.js runtime | use the project's one | isolate legacy code in iframe | never share objects/materials across runtime copies |
| external image/model/font | only with verified license | with a locally licensed equivalent | exclude when provenance is unavailable |
| site navigation/gallery CSS | almost never | project UI | exclude |

Minimum closure means the smallest set that retains the behavior and its lifecycle—not merely the fewest source lines.

## Compatibility matrix before copying

Record at least:

- source Three.js version or alias and target version;
- module format, framework and peer dependency ranges;
- renderer/color-management/tone-mapping assumptions;
- shader chunks or string anchors touched by `onBeforeCompile`;
- geometry attribute names, instancing limits and WebGL requirements;
- texture color space, wrapping, channel meaning and disposal ownership;
- whether the source owns a canvas, global document events, audio or full-page CSS.

For shader patches, save the target-version shader anchor assumptions beside the code. Add a stable `customProgramCacheKey`. Compile the relevant material variants in the target renderer and capture console/shader errors. A passing TypeScript build does not prove shader compatibility.

## Promotion levels

Use exactly one status:

1. `principle` — a design or algorithmic lesson only; no code copied.
2. `reference-only` — useful implementation evidence, but licensing, runtime, topology or lifecycle prevents direct reuse.
3. `adapt` — copied or reimplemented for one target scene with explicit changes; not yet a library asset.
4. `candidate-for-promotion` — dependency closure and provenance are known; target gates are pending.
5. `approved-local-asset` — cataloged only after all promotion gates pass.

An adaptation does not become approved because it looks good in one camera.

## Promotion gates

A source-derived candidate may enter the local asset catalog only when:

- repository URL/path, immutable commit/tag, source files, license and copied/adapted boundary are recorded;
- target runtime and renderer settings are named;
- geometry, anchor, axes, support contacts and complete visual envelope pass;
- required real solids are closed and correctly wound, or thin/open construction is explicitly declared;
- procedural output replays exactly from the same seed and configuration;
- shader patches compile in every supported material/quality variant and have a cache key;
- material channels use correct color spaces and surface variation follows construction/environmental causes;
- adaptive quality changes cost without breaking the promised silhouette/material identity;
- mount, resize, visibility, reduced-motion, context-loss and unmount behavior pass;
- the minimum closure excludes unrelated gallery/site code and all included assets have known licenses;
- fixed-camera, rotated, close/grazing and performance evidence is attached.

Record this in `assets/hero-asset-pattern.kage-torii.example.json`-shaped metadata and validate it before catalog promotion.

## Worked repository: ThreeUI

The audited local ThreeUI snapshot is an MIT-licensed React/TypeScript/Vite gallery and package. At inspection time the local repository HEAD was `68802d5428071ada5c20db8094b1649e6bb770ed`; verify the revision again before future reuse. Its synced community catalog recorded 43 parent components, 104 routes and 163 variants. Those numbers describe the inspected snapshot, not a permanent API guarantee.

Useful repository-level patterns:

- parent components are lazy-loaded while routes/variants are data-driven;
- direct Three.js renderers, sandboxed full-document demos, Canvas 2D and DOM/CSS are selected by task rather than forced into one rendering layer;
- wrappers provide ready/error states and can own resize, visibility, reduced motion and fallback behavior;
- library builds preserve modules and expose component subpaths while the website stays a separate consumption surface;
- public-boundary/source audits can block source maps, private paths/hosts and accidental private assets;
- multiple Three.js aliases support gallery compatibility, but consuming products should normally converge on one runtime or isolate an incompatible demo.

Important classification examples:

- the Kage/temple torii and lacquer system are `adapt` candidates after cap-normal, grading and support checks;
- the recursive temple maple is an algorithm reference until open branch ends and shader-cache/version contracts are repaired;
- Sylva grass is a strong sampling/shader pattern, but its instance counts and `frustumCulled=false` are demo-specific, not universal budgets;
- Sylva's root/moss system is a `traced-natural-hero` reference: landmark-driven centripetal splines, parallel-transport frames, separately displaced bark/moss shells and surface-weighted attached vegetation;
- Japanese Tower field stones are a background-scatter system, not a hero-rock replacement;
- GenerativeTree is Canvas 2D branch grammar and an editorial effect, not a Three.js tree asset.
- temple grass/rock/bough Canvas cutouts are deliberate `billboard-2.5d` foreground layers and must not be advertised as orbitable/collidable 3D assets;
- the Bookshelf renderer is a strong manufactured-asset reference because typed construction data, visible layers, page pivots and transparent interaction targets remain distinct;
- Japanese Tower's `Bld` primitives are a reusable architectural vocabulary, while its generated/bundled HTML and embedded minified runtime are outputs/dependencies to exclude from hand editing.

Audit corrections that matter when learning from this snapshot:

- temple buildings are primarily ordinary Meshes and merged geometries; do not describe them as an InstancedMesh construction system;
- the current temple render targets serve post-processing/bloom, not the removed planar mirror; never infer “reflection” from `WebGLRenderTarget` alone;
- Sylva's active high/small blade totals are 250,000 and 90,000 in the inspected source, while older comments/notes mention different counts; runtime configuration and `instanceCount` win;
- a near/far grass split implies separate batches/draw submissions, so “the entire 250k field is one draw call” is not established;
- deterministic root/asset construction does not make ambient pollen/spray deterministic when those effects still call direct randomness;
- random splash/ripple pools without shared event IDs are atmosphere, not evidence of one-to-one rain collision.

## Repository hygiene

Never overwrite source-history or guard files while mining. If a repository documents byte-identical protected files, treat their hashes as a hard boundary. Keep audit notes, extracted manifests and workflow changes outside the source repository unless the user explicitly requests a repository change.

When a read-only local MCP/source index already exists, use it for catalog discovery and exact-source retrieval. Direct file search remains the fallback and the authority for unindexed implementation details. Do not build a new MCP server merely to avoid reading a small repository.
