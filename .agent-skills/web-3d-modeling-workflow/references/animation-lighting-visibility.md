# Animation, lighting, and visibility

For visible rain that creates puddle or roof impacts, also read [rain-and-surface-interaction.md](rain-and-surface-interaction.md). Falling drops and impact births must share a causal position/time contract rather than run as unrelated loops.

For a suspected temporal defect or a meaningful animation acceptance milestone, consider [video-motion-review.md](video-motion-review.md). Prefer GPT6-Astra or another video-capable reviewer, verify actual session support, and record the running scene when continuous playback can answer something stills and path checks cannot. This is conditional; ambient motion does not make video mandatory.

## Path motion

Advance motion in world distance, not per-object interpolation. For a straight visible rail corridor:

```text
distance = (progress * loopLength - carIndex * carSpacing + loopLength) % loopLength
x        = corridorStart + min(distance, visibleLength)
```

All cars share the same progress and spacing. Do not animate each car independently or spacing will stretch under variable frame rates.

For curves, sample one curve by arc length. Validate tangents at visible entries and exits; a Catmull-Rom loop can overshoot portals or create impossible grades even when control points look reasonable.

For every moving vehicle, persist a deterministic complete-cycle path audit rather than relying only on a screenshot status. Sample finely enough that the maximum distance between samples is smaller than the narrowest relevant clearance. Sweep the vehicle's conservative oriented bounds between adjacent samples against bridge piers, curbs, canal walls, barriers, building volumes and the platform boundary. Record:

- path ID, cycle duration, sample count and maximum world-space sample step;
- minimum vertical support/road/rail clearance and any unsupported samples;
- swept-volume intersection count and the IDs of both colliders;
- tangent/heading discontinuities, impossible grade or steering radius, and phase coverage;
- entry/exit clipping state, including a partial-at-edge frame and a fully hidden frame.

Any penetration, floating sample, discontinuity or early whole-object disappearance is completion-blocking. Use the same sampled path in the audit and runtime; a hand-authored parallel test path is not evidence.

Persist those results using [../assets/runtime-motion-audit.template.json](../assets/runtime-motion-audit.template.json) when motion is part of the experiment and run the Skill-owned `validate_motion_audit.mjs`. Exact artifact binding and edge captures are additionally required only by audited-release conformance.

## Hidden return routes

A browser scene does not need to model inaccessible hidden track literally. A robust pattern is:

1. a physically correct visible corridor;
2. enough hidden duration/distance to hide the complete consist;
3. re-entry from the opposite portal in the same order;
4. render clipping at each portal.

Do not sink the train through the base. A prior hidden spline dropped more than two vertical units over a few horizontal units, produced impossible grades, penetrated the diorama, and entered portals with wrong tangents.

## Tunnel visibility from every camera

A black plane inside a portal only blocks views from one side. An external or rear camera may see the train between the plane and the back opening.

Use two layers:

- an opaque arch-shaped dark curtain slightly inside each mouth for visual depth;
- world-space clipping planes on every train material to keep fragments only inside the visible rail interval.

For Three.js local clipping:

```ts
renderer.localClippingEnabled = true;

const clipX = tunnelX + shadowInset;
const clippingPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), clipX),
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), clipX),
];

material.clippingPlanes = clippingPlanes;
material.clipIntersection = false;
material.clipShadows = true;
```

Apply the planes to opaque, transparent, emissive, and beam materials. Reapply when quality or mood changes mount new materials. Keep the car group alive until the whole car is beyond the hidden boundary, but let fragment clipping control what the camera sees.

Validation views must include both outer portal faces, an elevated end-on view, and an oblique rear view.

## Level crossing

Drive barriers and warning lights from the train's world position, not from a timer:

```text
approaching = trainVisible && abs(trainX - crossingX) < triggerDistance
```

Use damped motion for gate arms. The crossing deck should meet road height and leave rail flangeway gaps; a flat slab below the rail top makes rails and sleepers penetrate the road.

## Wind and vegetation

Keep trunks fixed. Animate crown groups with low-amplitude rotations and a slower gust envelope. Give trees stable seeds and different phase/frequency values so they do not sway in sync.

Use one global wind vector for crown sway and particle drift. This preserves causal coherence.

## Petals and particles

Use one `InstancedMesh`. Keep particle state in a compact buffer, update instance matrices, and recycle particles when they fall below ground or leave bounds.

Recommended invariants:

- particles do not cast shadows;
- use an unlit/basic material for stable color;
- set `depthWrite=false` for soft overlap;
- verify instance colors before enabling `vertexColors`;
- pause updates when the page is hidden;
- reduce count in the low-quality preset.

## Renderer settings

For reflection, shadow, transmission, post-processing and interaction budgets, use [look-development-and-performance.md](look-development-and-performance.md). Motion validation must exercise those policies instead of measuring a static base renderer only.

Renderer properties created once do not automatically respond to React state. Tone-mapping exposure, local clipping, and shadow settings need an explicit component or effect using the renderer handle.

Avoid changing constructor-only settings such as antialiasing without recreating the renderer. If high and low quality switch at runtime, use settings that can update safely or keep antialiasing stable.

When changing a shadow map size or lighting mode, recreate/re-key the light or explicitly mark the shadow map for update. Do not rely on a UI label to prove the preset works.

Mostly static dioramas should not redraw every shadow map and planar reflection for every camera-control event. Cache the last valid buffers during active orbit/pan/zoom, keep the visible reflected/shadowed result on screen, and request a fresh high-quality update after controls settle. Do not freeze buffers while the camera is stationary and a moving hero object visibly changes their content beyond the configured cadence.

## Quality presets

High quality can add:

- higher DPR and shadow map resolution;
- rail fasteners and ballast stones;
- tactile studs and roof brackets;
- glass reflection layers;
- additional product rows and props;
- more particles and light fixtures.

Low quality should keep:

- primary geometry and collision correctness;
- core shadows;
- train/tunnel clipping;
- practical night lighting;
- camera controls and animation timing.

## Night lighting

Separate environment and practical sources:

- low-intensity cool hemisphere/moon key for readable silhouettes;
- warm road lamps with localized pools;
- station ceiling lights;
- emissive sign/vending panels plus nearby illumination;
- house/window layers and small porch lights;
- vehicle interior light layers;
- headlights and red tail lights.

Too little environment light turns non-emissive vehicles into black cutouts. Too much practical intensity can make whole panels appear emissive.

## Headlight construction

Build each headlight from:

- metal bezel;
- bright exposure-independent lens;
- additive halo;
- spotlight aimed at a moving target in front of the vehicle;
- optional transparent cone mesh;
- elongated additive pool close to the rail/road surface.

The visible cone and pool should be subtle in air but obvious on nearby surfaces. Put them in the vehicle subtree so portal clipping removes them with the train. Verify the cab panel remains dark and the light source stays localized.
