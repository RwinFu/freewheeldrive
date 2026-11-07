# Look development and performance engineering

Use this reference for quality-first WebGL scenes whose materials, rain/wetness, reflections, practical lighting, post-processing, loading cost, or interaction smoothness materially affect acceptance. It applies after the physical blockout and semantic detail plan pass, and before final local review.

The objective is not to choose between visual quality and performance. Build the accountable high-quality look first, measure its real cost, remove duplicated or visually unproductive work, and preserve the settled high-quality frame while making loading and interaction cheaper.

## Required outputs

Create or extend project-owned configuration for:

- the canonical camera, viewport/aspect, tone mapper, exposure and environment;
- a material inventory with real-world scale and required PBR channels;
- decal/weathering ownership and placement rules;
- post-processing order, quality-tier settings and effect resolutions;
- reflection, shadow, light, particle and texture budgets;
- runtime diagnostics and before/after performance evidence;
- the dependencies that invalidate material, lighting and performance captures.

Do not begin final look development from a freely moving camera. Do not optimize from source-code intuition alone.

## 1. Lock the canonical shot and renderer state

Before tuning materials or lights, persist:

- projection family: orthographic or perspective;
- camera position, target, roll, FOV or orthographic frustum height, zoom, near and far planes;
- viewport size and aspect ratio used for reference comparison;
- renderer output color space, tone mapper, exposure and physically correct light policy;
- background, fog density/color and environment intensity;
- reference overlay crop/registration and the intended focal plane.

Match composition before surface polish. For reference-guided work, compare a paused canonical render with the reference using overlay and difference views. If the camera, crop or exposure is wrong, material edits become compensation for a framing error and will fail from other angles.

Gate:

- the canonical camera can be restored deterministically;
- the major silhouettes and negative spaces align with the reference;
- exposure is low enough that emissive sources retain shape and bright surfaces are not clipped;
- a baseline screenshot and renderer-state record exist before material refinement.

## 2. Define a PBR channel contract

For every hero material, record:

| Field | Required decision |
| --- | --- |
| identity | concrete, plaster, asphalt, painted/bare/rusted metal, glass, wood, water, fabric, foliage, etc. |
| world scale | meters represented by one texture repeat |
| mapping | UV, world-space, triplanar, projected, decal or procedural |
| channels | base color, normal, roughness, metalness, AO, height/displacement, emissive, opacity |
| color space | sRGB only for color/emissive color; data maps use no-color/linear sampling |
| fidelity tier | hero, midground or background |
| variation | macro tint, edge wear, wetness, dirt, decals and local roughness variation |
| evidence views | canonical, grazing-angle and close material views |

Rules:

- Base color must not contain baked directional lighting that conflicts with scene lights.
- Normal, roughness, metalness, AO and height are data, not sRGB color.
- Give repeated textures a real-world scale. A 2K texture repeated every 20 cm and the same texture stretched over a 20 m bridge are both defects.
- Use world-space or triplanar mapping for large surfaces that cannot receive coherent UVs, but keep directional materials such as wood grain, brushed metal and roof sheets aligned to construction axes.
- AO needs valid UV/channel handling. Do not attach an AO map and assume it contributes.
- Height is subtle relief unless the silhouette requires real geometry or displacement subdivisions.
- Preserve anisotropy and mipmaps for grazing wet roads, rails and roofs; cap anisotropy to the renderer/device capability.
- Reuse texture objects and materials. Cloning a material per bolt, sleeper, product or window multiplies shader programs and draw calls without adding detail.

### Texture-resolution policy

Choose resolution from screen coverage and repetition, not from a universal number. A strong quality-first starting point for desktop dioramas is:

- hero base color and normal: 2K when close views justify it;
- scalar AO/roughness/metalness/height: often 1K when packed and repeated;
- small repeated props: shared atlases or instances rather than one texture set each;
- background surfaces: lower tiers or compressed transcodes.

Prefer KTX2/Basis when the project toolchain can validate it. Otherwise keep source files, pack scalar channels into ORM, and recompress color cautiously. Do not JPEG-recompress normal maps merely to save transfer bytes: chroma subsampling can destroy vector fidelity even at nominal quality 100. If a lossy color recompression is used, compare it with the source and keep a project-defined fidelity gate; approximately 40 dB PSNR is a useful starting threshold, not a substitute for visual inspection.

Estimate decoded GPU memory, including mipmaps:

```text
decoded RGBA bytes ≈ width × height × 4 × 4/3
```

Transfer size and decoded size are separate budgets. A small JPEG can still decode to a large GPU allocation.

## 3. Build material identity in layers

Use physically motivated layers instead of one generic rough material.

### Concrete and plaster

- high base roughness with low-amplitude normal and height;
- macro color variation larger than the texture tile;
- darker water runoff below joints, sills, pipes and bridge drainage points;
- cracks with plausible origin and termination;
- moss/algae concentrated at damp bases, seams and shaded drainage paths;
- exposed edges, patch repairs and formwork/joint evidence where appropriate.

### Wet road and paving

- dry substrate identity remains visible below the wet layer;
- wetness lowers roughness non-uniformly instead of turning the road into uniform black glass;
- puddles follow low areas, gutters, patches and drainage, not random circles;
- road markings keep their own roughness and thickness response;
- reflections are strongest at grazing angles and broken by surface normal variation;
- tire grime, repaired asphalt and drain covers add local scale cues.

### Rusted and painted metal

- separate bare metal, paint, primer, rust and wetness responses;
- put rust at joints, fasteners, damaged edges, water traps and vertical runoff paths;
- keep metalness physically plausible: rust and dirt are not metallic merely because they sit on metal;
- add seams, welds, bolt plates and attachment logic before adding noise.

### Glass

- model frame/recess, gasket, pane, interior and controlled reflection/highlight layers;
- keep transparent panes depth-sorted and avoid overlapping coplanar glass;
- use true transmission/refraction only when visible thickness and background distortion justify its full-scene cost;
- for small diorama windows, transparent physical glass with clearcoat/environment reflection plus a real interior often matches the reference more efficiently;
- validate from front, oblique and opposite views.

### Wood

- align grain to each board;
- model board gaps, end grain, fasteners and supports;
- vary board color and roughness without randomizing construction direction;
- wet wood gains darker color and sharper grazing highlights but does not become metallic.

### Water and drainage channels

- build a physically supported channel with walls, invert/bed, outlet and water level;
- combine a coarse flow normal and finer ripple normal at different scales;
- add waterline dirt, foam/debris only where flow or obstacles justify it;
- use reflection/refraction according to screen importance and quality tier;
- ensure the water plane does not z-fight with the channel bed or leak through walls.

## 4. Use decals as construction evidence

Decals and projected detail should explain history and function:

- rain streaks begin below roofs, joints, sills, vents and fasteners;
- rust begins at exposed metal or water traps and follows gravity;
- cracks respond to slab joints, corners, settlement and impact zones;
- moss follows damp shade and capillary contact;
- wastewater lines follow a credible historical water level;
- asphalt patches align with cuts, repairs, drains and wheel paths;
- signs, warning stripes and labels attach to a real panel or support.

Avoid uniform random grunge. Separate base material variation from localized decals. Give decals a small, deliberate normal offset or polygon offset, test grazing angles, and prevent z-fighting. Group/instance repeated decal families where possible.

Gate: each hero surface reads as its intended material before Bloom or depth of field is enabled, and the weathering remains physically explainable from a rotated view.

## 5. Refine geometry where shaders cannot substitute

At reference scale, the highest-value geometric refinements are usually:

- small bevels on silhouette and highlight-bearing edges;
- roof ridges, eaves, flashing, gutters, brackets and downpipes;
- bridge expansion joints, drainage, bearing plates, pier caps and construction seams;
- guardrail posts, base plates, bolts, washers and end treatments;
- railway ballast shoulders, sleepers, rail fasteners, cable troughs and catenary hardware;
- paving joints, curb transitions, drains, manholes and tactile surfaces;
- window/door depth, mullions, sills, handles and operating clearance;
- vehicle panel seams, bogies, axles, wheel hubs, underfloor boxes, couplers and lights.

Use real geometry for silhouette, parallax, support and attachment. Use normal/height maps for sub-silhouette relief. Use decals for localized history. Do not ask one technique to solve all three scales.

## 6. Build accountable lighting and indirect response

Use an HDR environment processed through PMREM, a procedurally generated environment, or baked/lightmapped indirect illumination when available. The environment must illuminate non-emissive surfaces; emissive meshes alone do not create bounce in ordinary raster Three.js.

For a night diorama:

- retain a cool environment/moon fill so vehicles and concrete do not collapse into black silhouettes;
- use warm practical fixtures with local point/spot/area illumination;
- add a broad, low-intensity bounce source or baked light where shop warmth should reach the sidewalk, awning and wet road;
- keep cyan, red and amber practical colors localized and visible in wet reflections;
- separate source lens brightness from the light that reaches surrounding surfaces;
- tune exposure before increasing Bloom.

Prefer a wide spotlight to a shadow-casting point light when one directional pool is sufficient: a point-light shadow can render six cubemap faces per update. Keep contact shadows for hero supports and moving vehicles; do not cast expensive shadows from every label, pane, plant and fastener.

## 7. Add post-processing in accountable order

A practical order is:

1. scene render with environment, direct lights and planar/scene reflections;
2. GTAO/SSAO or contact-occlusion pass;
3. localized Bloom;
4. depth of field or orthographic tilt-shift;
5. LUT/color grading, vignette and subtle grain;
6. output/color-space transform.

Guidance:

- GTAO/SSAO should strengthen contact and creases, not dirty every flat surface. Run it at a validated internal scale when full resolution has no visible benefit.
- Bloom must be driven by localized bright lenses, signs and reflections. If concrete, train bodies or the whole bridge bloom, fix exposure/emissive values or use selective Bloom.
- Full Bokeh depth passes redraw scene depth and can be expensive. For an orthographic miniature shot, a two-pass tilt-shift blur often preserves the intended lens language more cheaply.
- SSR needs a fallback and careful edge handling. Use planar reflection for dominant flat wet surfaces when its extra scene render is justified.
- LUT grading should unify warm/cool contrast after material and lighting identity already works; it must not conceal clipped highlights or black materials.
- Rain, fog, grain and depth of field must be switchable for geometry/material QA.

Gate: disabling post-processing still leaves a credible scene. Enabling it improves focus and atmosphere without erasing material differences or geometry.

## 8. Measure the coherent high-quality baseline

After the first coherent look, record at a fixed viewport and canonical camera:

- average, median and p95 frame time over a bounded visible-tab window;
- renderer draw calls, triangles, lines and points;
- geometries, textures and shader programs;
- total Mesh count, InstancedMesh count and unique material count;
- transparent and transmission-using meshes;
- total lights, shadow-casting lights and shadow-casting meshes;
- reflector/SSR/planar-reflection count and update policy;
- initial texture transfer bytes and estimated decoded texture memory;
- warm reload time and a representative screenshot/camera-interaction latency;
- shader errors, console errors and WebGL context loss.

Reset renderer statistics immediately before the real composed frame and read them immediately after it. Record whether reflection, shadow and post passes updated on that frame; otherwise draw-call comparisons are misleading. Browser automation and hidden tabs can distort RAF timing, so label visibility/throttling state and do not claim an FPS gain from contaminated samples.

Use one reproducible sampling protocol for baseline and optimized runs:

1. record the device/device class, browser and WebGL renderer, viewport, device pixel ratio, quality preset, camera ID, animation state, network profile and warm-cache state;
2. keep the tab foreground and visible, finish required asset/font loading, compile the exercised shader variants, and let temporal effects settle before sampling;
3. capture at least 120 requestAnimationFrame samples around the complete settled composed frame; 180 or more is preferred for a dense animated scene, and also capture at least 60 representative orbit/pan/zoom frames;
4. persist the raw samples; derive average, median and p95 settled frame time plus average and p95 interaction frame time from them, and disclose any excluded navigation, screenshot or debugger stalls;
5. measure warm load from navigation start to the project-owned scene-ready signal using the same cache/network state; record cold load separately when useful, never mix the two;
6. repeat warm load at least three times and use its median; repeat representative input-to-present latency at least five times and use p95, then separately confirm the settled high-quality state returns within its frame budget;
7. do not run screenshot capture, synchronous audit serialization, DevTools profiling or unrelated browser automation inside the RAF sample window;
8. after all required assets and shader variants are warm, run a minimum 60-second soak and require no unexplained growth in geometry, texture, program or render-target counts.

Set numeric budgets before optimization. A report that says only “feels smoother” is not sufficient performance evidence.

## 9. Optimize in cost order

Remove duplicated rendering before reducing visible detail.

### A. Reflections

- Never let two planar reflectors recursively render one another.
- Keep the reflection target resolution needed by the settled hero shot, but update rain-blurred road/water reflections at a measured cadence rather than every pass. Roughly 8–15 Hz is often visually stable for miniature wet surfaces; validate moving vehicles and lights before accepting it.
- During camera interaction, reuse the last valid reflection texture instead of redrawing the scene for every pointer event. Refresh immediately after the controls settle.
- Hide reflection-only helpers and exclude irrelevant layers from the reflection camera.
- Prefer one accountable reflection solution per important surface over stacked SSR, planar reflection and fake additive duplicates.

### B. Shadows

- Count shadow renders, not only light objects. A point light can cost six shadow views.
- Keep a small priority-ordered set of shadow lights. Use non-shadow fill/bounce lights for the rest.
- Disable shadow casting on transparent panes, labels, particles, tiny fasteners and micro-props whose silhouette is below the reference pixel threshold.
- Preserve critical solids, vehicle shells, bridge/building massing and contact-bearing parts.
- Disable `shadowMap.autoUpdate` for mostly static scenes and request updates at a measured cadence or on meaningful changes.
- During orbit interaction, reuse the existing shadow maps; update when the camera/light/object state settles.

### C. Transmission and transparency

- Audit every material with `transmission > 0`. Three.js may require an additional opaque transmission pass even for small panes.
- Retain true transmission for hero glass, thick refractive objects and distortion that is visible in evidence.
- For small windows, laundromat fronts and wet films, compare a transparent physical material with clearcoat, environment reflection, real interior layers and `depthWrite=false` against the transmitted version.
- Avoid many intersecting transparent layers; solve ordering and merge logically shared panes.

### D. Draw calls and material programs

- Instance sleepers, fasteners, ballast, studs, repeated products, posts, plants and particles.
- Share geometry and material objects across repeated parts. Similar-looking clones with unique material instances still cost programs and calls.
- Use atlases, texture arrays, `InstancedMesh`, `BatchedMesh` or merged static geometry where semantic auditability can be preserved.
- Do not merge unrelated assemblies so aggressively that collision/support/detail IDs or culling become unverifiable.
- Remove per-frame object allocation and repeated scene traversal from the render loop.

### E. Texture loading and memory

- Pack AO, roughness and metalness into one ORM texture when channel sampling is correct.
- Use lower-resolution scalar maps before lowering hero base-color or normal resolution.
- Prefer KTX2/Basis for GPU-ready compression; preserve original sources and verify color space and normals after transcoding.
- Lazy-load reference overlays, QA-only assets, optional high-detail layers and audit modules.
- Avoid generating large procedural fallback textures synchronously before the first frame. Use tiny placeholders and replace them asynchronously.
- Deduplicate URLs and texture objects. Dispose abandoned textures and render targets after quality or scene changes.

### F. Post-processing and interaction

- Run GTAO/SSAO at the lowest internal resolution that preserves contact quality; validate denoise radius and temporal stability.
- Keep Bloom/LUT/atmosphere passes when inexpensive and visually important; remove full-scene passes whose contribution is not visible in an A/B comparison.
- During active orbit/pan/zoom, it is acceptable to pause GTAO and expensive reflection/shadow updates while retaining the last valid buffers. Restore the exact high-quality settled state within one or two frames after interaction ends.
- The low preset may reduce DPR, AO resolution, particles and update frequency, but cannot change geometry correctness, material identity or animation paths.

One acceptable control policy is:

```ts
controls.addEventListener('start', () => {
  reflectionsPaused = true;      // keep the last valid texture visible
  gtaoPass.enabled = false;
  renderer.shadowMap.autoUpdate = false;
});

controls.addEventListener('end', () => {
  reflectionsPaused = false;
  gtaoPass.enabled = quality === 'high';
  requestReflectionRefresh();
  renderer.shadowMap.needsUpdate = true;
});
```

Do not hide reflective geometry, shadows, glass or material layers during interaction. Caching changes update cost, not scene content; the first settled frame must explicitly refresh every paused system.

## 10. Fixed-shot look-development loop

For each look-development milestone:

1. restore the canonical camera and pause motion;
2. capture an ungraded/base-material view;
3. capture the full high-quality view;
4. compare with the reference using overlay/difference and inspect exposure histograms if available;
5. inspect a grazing material close-up and an opposite/underside view;
6. record one prioritized contradiction, not a generic “needs detail” note;
7. fix the owning camera, geometry, material, light or post layer;
8. recapture the same view and one new blind-spot angle;
9. run a short animation/orbit stability probe;
10. compare performance diagnostics with the previous milestone.

Do not keep adding effects when the main contradiction belongs to camera, geometry or base material. Do not accept a faster version when wet reflections, warm/cool bounce, glass interiors, contact shadows or hero texture scale visibly regress.

## 11. Performance acceptance

Define project-specific budgets in the typed scene configuration. Budgets depend on viewport, device class and scene scale, but the evidence must include:

- maximum average, median and p95 frame time;
- maximum warm-load time and representative interaction latency;
- device/browser/WebGL renderer, viewport, DPR, network and cache conditions that make those numbers comparable;
- renderer, reflection, shadow, transmission, texture-transfer and decoded-memory limits.

| State | Required result |
| --- | --- |
| settled high | all approved material, reflection, contact-shadow, lighting and grading layers are present; budgets pass |
| active interaction | camera remains responsive; cached reflections/shadows may be reused and expensive AO may pause; no geometry/material disappearance |
| settled after interaction | full high quality returns within one or two frames without a lighting or reflection pop that fails visual QA |
| low quality | core lights, shadows, materials, animation, clipping and physical geometry remain correct |
| hidden tab | simulation/render work pauses or throttles safely and resumes without a time jump |

Relative improvement is evidence, not the sole gate. A useful refactor normally removes a substantial share of duplicated scene renders or asset transfer, but it fails if it achieves the number by erasing visible hero detail. Record before/after metrics at identical camera, viewport, quality and animation state.

Completion-blocking failures include:

- recursive reflectors or unbounded reflection updates;
- unbudgeted point-light shadows or thousands of visually irrelevant shadow casters;
- true transmission on many small panes without evidence that refraction matters;
- every mesh owning a unique material;
- scalar textures using hero color resolution without a screen-space reason;
- post-processing that clips the scene or hides material identity;
- an interaction preset that never restores the settled high-quality frame;
- shader errors, context loss, leaked render targets or duplicated render loops;
- performance claims measured from a hidden/throttled tab or unmatched states.

The final verdict combines the visual evidence with the automated geometry/detail gates. Performance optimization does not excuse penetration, missing interiors, open shells, floating parts or semantically empty hero zones.

## Worked measured pattern (not a universal budget)

One dense rainy railway-corner diorama reached its acceptable high-quality baseline through this sequence:

1. lock the orthographic reference camera, exposure and warm/cool night balance;
2. replace flat surfaces with real-scale concrete, plaster, asphalt, rusted-metal and wood PBR sets;
3. add wet-road/water reflection, localized shop/laundry light, decals, geometry seams and transparent interiors;
4. measure the complete composed frame rather than the bare scene renderer;
5. stop two planar reflectors from rendering each other and update rain-blurred reflection targets at a bounded cadence;
6. replace a shadow-casting point fill with a wide spotlight and remove visually irrelevant micro-casters;
7. remove unneeded small-pane transmission while preserving clearcoat, environment reflection and interior layers;
8. replace a full Bokeh depth redraw with orthographic tilt-shift and run GTAO below full internal resolution;
9. pack scalar ORM/height channels, keep hero color and normal texel density, preserve original normal maps, and lazy-load reference/QA resources;
10. cache reflection/shadow work and pause GTAO during orbit interaction, restoring full quality after controls settle.

At the matched canonical state, measured draw calls moved from 31,877 to 14,635, submitted triangles from 4.75 million to 2.06 million, shadow-casting meshes from 3,238 to 434, and initial texture transfer from 57.49 MB to 27.73 MB. Hero color remained 2K with a minimum measured recompression PSNR of 42.36 dB; original 2K normal maps were retained. Geometry and detail runtime audits still reported full coverage with zero errors.

Use these numbers only as proof that large savings can come from removing duplicate passes and oversized scalar assets without deleting visible detail. Future scenes must establish their own camera/device/viewport budgets and may legitimately be smaller, larger or use a different reflection/lighting strategy.
