# Web 3D front-end integration

Use this reference when a Three.js/WebGL asset must behave as a reliable page component. Modeling quality includes how the asset loads, resizes, pauses, receives input, loses context, unmounts and ships—not only how it renders after a successful refresh.

## Choose the integration boundary deliberately

### Direct scene module

Use a direct factory such as `createScene(host, options)` when source and target share one Three.js/runtime contract and the asset should integrate with application state. The factory should return a small explicit API:

```ts
type SceneHandle = {
  setActive(active: boolean): void;
  setQuality?(quality: 'low' | 'high'): void;
  resize?(): void;
  requestRender?(): void;
  dispose(): void;
};
```

The module owns its renderer-specific resources. The framework wrapper owns mounting and passes state through the API rather than reaching into scene internals.

### Framework wrapper

Use a React/Vue/Svelte wrapper for lazy loading, error/ready UI, ARIA text, resize/visibility coordination and application state. Keep the renderer outside framework render reconciliation unless using a renderer designed for that framework. In React Strict Mode, initialization and cleanup may run more than once in development; construction and disposal must be idempotent.

### Sandboxed iframe or `srcDoc`

Use isolation when a demo is a full document, owns global CSS/events/audio, bundles an incompatible Three.js version, or would be riskier to untangle than to contain. Define a narrow `postMessage` contract for start/pause/theme/quality and readiness/error. Set the minimum sandbox permissions. Do not pass `Object3D`, geometries, materials or textures across runtime copies.

Isolation is an architectural boundary, not an excuse to keep an uncontrolled render loop. The parent still controls whether the iframe is mounted/active, and the child still needs cleanup within its lifetime.

## One owner, one scheduler

Every renderer needs one named owner for:

- renderer/context creation;
- the only active RAF token or on-demand render queue;
- resize observation;
- pointer/keyboard/global listeners;
- visibility and reduced-motion policy;
- context loss/restoration;
- GPU and DOM disposal.

Avoid a wrapper RAF plus an internal renderer RAF. Use either:

- **continuous:** for wind, particles, simulation or camera movement; or
- **on demand:** `requestRender()` coalesces updates and renders only when camera/state/assets change.

When a scene settles, on-demand rendering can remove almost all idle GPU cost. If continuous animation exists only in one subsystem, allow quality/reduced-motion state to freeze or lower that subsystem without rebuilding the scene.

Clamp simulation delta after tab suspension, for example to 50 ms, so a restored frame does not advance physics or wind by several seconds. Track only one pending RAF and clear it on dispose.

## Visibility and startup

Combine signals rather than treating canvas existence as activity:

- document visibility;
- intersection/offscreen state;
- explicit application/tab activity;
- reduced-motion preference;
- renderer/context readiness.

Start expensive construction after the host has non-zero dimensions. For a heavy procedural build, let the shell/entry transition paint for one or two frames before allocating large geometry or textures. Lazy-load the renderer code and large assets at the parent component boundary.

When the scene becomes inactive, pause scheduling and expensive media/audio. Decide whether state time pauses or continues analytically; document the choice. On resume, avoid duplicate RAF starts.

## Resize the host, then adapt the camera

Observe the actual host element with `ResizeObserver`; window resize alone misses layout/sidebar/container changes. Set the drawing buffer from CSS size and a clamped DPR/quality policy.

Canvas resize does not guarantee composition. For a canonical scene, define a camera adaptation rule:

- perspective: adjust camera distance/FOV/vertical target within bounded ranges;
- orthographic: adjust frustum extents while preserving scale intent;
- fixed-shot exhibit: preserve the hero envelope and safe UI crop at representative wide/tall viewports.

The Kage renderer demonstrates an aspect fix that steps a narrow/tall camera back along its view axis, raises it and widens FOV. Treat this as the general principle “adapt composition as well as resolution,” then derive target-specific values from envelope fit tests.

Update projection matrices, post-process sizes, reflection targets and any screen-space uniforms in the same resize transaction. Test zero-size/unmounted transitions.

## Pointer and keyboard mapping

Map pointer coordinates through the current canvas bounding rect, not `window.innerWidth/innerHeight`. Convert raycast hits into the local space of the affected procedural group when shaders consume local interaction coordinates.

Make non-pointer operation explicit where the scene is interactive:

- focusable control surface or semantic companion controls;
- keyboard action/reset;
- visible focus state;
- ARIA label/instructions and non-WebGL fallback;
- reduced-motion behavior that retains access to content.

Canvas semantics can be supplemented by DOM; do not rasterize ordinary readable text into WebGL merely for consistency.

## Shader patch integration

`onBeforeCompile` is coupled to Three.js shader source. For every patch:

1. name the source and target Three.js versions;
2. check that each replacement anchor exists exactly as expected;
3. fail clearly or select a known fallback when an anchor is absent;
4. set `customProgramCacheKey` from the patch identity and relevant defines;
5. keep per-instance attributes and uniforms typed/documented;
6. compile all supported lighting, fog, skinning/instancing and quality variants;
7. inspect renderer shader logs and capture one visual smoke view.

Do not share one material instance between objects that require different patch definitions unless its cache key and update behavior prove the programs remain distinct.

## Animated bounds and culling

Static geometry bounds are insufficient for wind, leaning blades, particle trails or vertex-displaced rocks/water. Expand bounds analytically from the maximum configured displacement or compute a conservative envelope during construction. Validate the farthest displaced state.

Setting `frustumCulled=false` is a bounded exception for small or unavoidable systems. On a large grass field it may retain significant vertex/fragment cost offscreen. Prefer cells/chunks, near/far populations or conservative animated bounds.

## Context loss, failure and disposal

Handle `webglcontextlost` with `preventDefault()` only when restoration is supported. Stop scheduling work, surface a readable fallback/status, and recreate or restore owned resources on `webglcontextrestored`. If recovery is not implemented, fail clearly instead of leaving a frozen transparent canvas.

On dispose:

- cancel RAF and pending async ownership tokens;
- disconnect resize/intersection/media-query observers;
- remove pointer, keyboard, visibility and context listeners;
- traverse and dispose owned geometries, materials and textures once;
- dispose render targets, PMREM/environment resources, controls, composers and renderer;
- stop audio/media;
- remove only DOM nodes owned by the component;
- ignore late async completions through an abort/generation token.

Track shared resources separately; reference-count or centralize them rather than double-disposing.

Mount/unmount the component repeatedly in development and compare renderer memory/program counts. A clean first unmount is not enough to expose duplicate observers or Strict Mode ownership mistakes.

## Adaptive quality

Base adaptation on measured frame timing, with hysteresis and a cooldown so DPR/quality does not oscillate. Change one cost class at a time:

1. DPR or post-process resolution;
2. shadows/reflections;
3. far vegetation/particles;
4. secondary material effects;
5. only then geometry fidelity if allowed.

Retain the hero silhouette, support relationships and base material identity at every tier. Report the active tier and the reason for switching in diagnostics. Do not measure hidden/throttled frames as normal performance.

## Package and gallery architecture

ThreeUI illustrates a useful separation:

- a data-driven catalog maps route/variant metadata to a smaller set of lazy-loaded parent components;
- a package exposes component subpaths and declares React/Three as peers rather than bundling every consumer runtime;
- a site can support compatibility aliases for isolated examples while the published component contract remains bounded;
- CSS is declared as a side effect so consumers do not tree-shake required styles;
- source/public-boundary audits reject source maps, private paths, private hosts and accidental internal artifacts.

Adopt the principles, not the exact build configuration. A production application should normally use one Three.js version. Use aliases only for a gallery/test matrix or isolate incompatible examples. Verify that tree shaking/preserve-modules output does not duplicate Three.js or split shared singleton state incorrectly.

## Generated and self-contained WebGL artifacts

Treat a generated HTML scene, embedded runtime or base64 asset bundle as an output, not the editable source of truth. Keep:

- generator/source path and exact command;
- generator and input hashes/revision;
- generated output path and runtime version;
- license inventory for embedded code, textures, fonts and media;
- a reproducible regeneration or an explicit archival reason;
- a smoke test that the regenerated artifact still mounts and disposes.

Patch the generator or source, then regenerate. Directly editing the output creates an unrepeatable fork and makes source mining ambiguous. Exclude vendored/minified runtimes and encoded assets from extracted technique closures unless the target explicitly needs the same licensed artifact.

## Mixed rendering is a strength

Choose the cheapest layer that preserves the intended behavior:

- DOM/CSS for semantic interface and typography;
- Canvas 2D for editorial/generative flat effects such as recursive ink trees;
- Three.js/WebGL for spatial models, large instancing and shader-driven interaction;
- iframe for legacy/full-document or version-isolated experiences.

A Canvas 2D generative tree can teach branch spawning, pruning, sway inheritance and depth-based detail reduction without becoming a fake 3D asset. Record such findings as `principle` or `reference-only` and reimplement the relevant grammar in the target representation.

## Integration acceptance

Before local completion, verify:

- cold and warm mount reach ready or a readable fallback;
- representative wide, square, narrow and zero-to-nonzero resizes preserve composition;
- offscreen/hidden/reduced-motion policies visibly reduce work without breaking state;
- pointer mapping remains correct after scrolling and container resize;
- the shader compiles on the target Three.js version and cache key changes when definitions change;
- context loss has a tested recovery or explicit failure path;
- repeated mount/unmount adds no RAF, listener, observer, canvas or GPU-resource leak;
- the production bundler produces one intended runtime per integration boundary and no accidental private/source-map output;
- the local page has no console, shader, accessibility or unhandled-promise errors.
