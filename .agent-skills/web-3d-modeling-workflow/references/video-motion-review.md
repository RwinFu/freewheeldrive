# Video review of dynamic scenes

Use a recording to discover and verify defects that depend on time, not merely to produce another deliverable. Examples include wheels changing orientation while driving, foot sliding, steering snaps, inconsistent rolling speed, reversal jumps, drifting attachments, bad loop seams, intermittent lighting artifacts, and particle recycling that becomes visible during playback.

## Capability and timing gate

**Preferred reviewer: GPT6-Astra (`gpt-6-astra`), or another model with demonstrated video-reading capability.** This is a workflow preference, not a guarantee that every session with that model has video input enabled. Check the tools and input modalities actually available in the session.

- With usable recording and video-reading support, enable video review when a continuous-motion question matters: a user reports a dynamic defect, a moving assembly first becomes coherent, or motion remains an uncovered risk at `milestone` / `local-final`.
- Do not record after every edit. Static layout, text, material-only changes, and unaffected animations normally reuse existing evidence. Video review does not automatically promote the task to `audited-release`.
- Without video-reading support, use supported live inspection, ordered extracted frames, and runtime measurements. Describe the method precisely and identify any temporal behavior still unobserved; do not claim to have watched a clip from its thumbnail or a few stills. This fallback is not native video acceptance.
- If the user explicitly asks for a recording, capture it when tools permit even if direct video reading is unavailable, and disclose the review limitation. Continue independent work rather than treating optional video capability as a universal blocker.
- Do not silently change the model, delegate, install a plugin, or upload a recording to another service to obtain this capability. Follow the session's existing tool, delegation, and authorization rules.

## Record the behavior before changing it

For a reported but unidentified defect, preserve the failing behavior first. Choose a question and camera that can reveal it without first assuming the answer from source code. A tracking close view helps inspect a moving assembly; a fixed world view helps distinguish actual translation, foot sliding, trajectory errors, and camera-induced apparent motion. Use both only when the distinction matters.

Record the **actual running renderer**, not a slideshow assembled from hand-picked screenshots. Prefer a supported browser recording API; for an app being developed, a temporary developer-only `canvas.captureStream()` / `MediaRecorder` path can record the rendered canvas when permitted. Use surface recording instead if DOM overlays or browser interaction are part of the defect. Avoid capturing unrelated desktop content.

- Keep the production animation loop as the single renderer/scheduler owner. Recording may copy completed frames, but must not introduce a second animation loop, simulate a different motion path, or silently alter playback speed.
- Start with a short useful interval, often around 8–15 seconds. Duration follows the phenomenon: include relevant starts, turns, stops, reversals, and loop boundaries. A short straight-line clip does not verify an entire long cycle. For a long cycle, targeted transition clips plus the existing complete-cycle runtime audit may be sufficient.
- Record scene time and wall-clock time when diagnosing speed, cadence, or pauses. Capture overhead, dropped frames, tab throttling, and deliberate time scaling can create misleading stutter or speed differences; do not equate recorded FPS with interactive performance.
- Keep sufficient temporal sampling and subject size to distinguish real motion from aliasing. Fast wheel spokes can appear stationary or reversed even when the physics is correct. Change capture rate or use a visible orientation marker and transform measurements if needed.
- Save locally in the permitted project/evidence area using clear before/after names. No fixed project path, port, codec, frame rate, or upload service is required. A temporary save endpoint, if needed, must stay local, constrain filenames/output paths, and remain outside the normal product flow.

## Diagnose temporal behavior

Inspect continuous playback at normal speed first. Locate the failing interval, then use slower playback or timestamped sequential frames to examine the mechanism. Keep the original clip; a contact sheet is supporting evidence, not a replacement for motion review.

State a concrete observation before naming a cause, for example: “the tire alternates between a side profile and an edge profile while the car body keeps its heading.” Then inspect the owning transform, animation phase, path, attachment, or renderer state.

Use only the measurements needed to test that explanation. Examples:

| Observed behavior | Useful corroboration |
| --- | --- |
| Wheel wobbles or appears to flip | Axle direction in vehicle coordinates; steering and rolling node transforms |
| Wheel spins while the car stops | Actual travel distance, wheel radius, angular displacement, endpoint velocity |
| Foot or boat attachment slides | World-space contact/attachment positions across the same clip interval |
| Direction or orientation snaps | Heading/quaternion continuity and loop/reversal phase |
| Intermittent black region or flicker | Exercised camera/light state, shader logs, finite geometry/HDR samples |

A useful lesson from the harbor vehicle case: applying a second Euler rotation after orienting a cylinder can rotate the **axle itself** instead of rolling the tire. Separate fixed mesh orientation, steering, and axle spin; derive rolling from travel distance rather than multiplying elapsed time by a direction sign that jumps at reversal. This is an example to recognize, not a reason to rebuild every vehicle or prescribe one axis convention.

## Verify the correction and stop

Re-record the affected interval with comparable framing, starting phase, mood, and playback speed. If the path or camera must change as part of the fix, disclose that difference rather than describing the clips as identical conditions. Check the previously failing behavior and the adjacent transition most likely to regress; do not repeatedly record unrelated systems.

Video complements geometry, support, collision, and full-cycle checks; it does not replace them. Conversely, a clean path collision report does not prove correct wheel rolling, believable gait, or smooth timing. Follow [animation-lighting-visibility.md](animation-lighting-visibility.md) for applicable runtime motion checks.

For local delivery, retain only useful clips and a compact record of the reviewed interval, observed defect, owning correction, verification method, and remaining limitations. A side-by-side clip or timestamped before/after frames can make the change reviewable; neither is mandatory for every task. Remove or isolate temporary capture controls, restore a usable scene view, and stop when the observed defect and relevant risks are resolved.
