# Risk-based QA modes

Use one explicit active QA mode per stage; modes may change as the task progresses. For example, an explicitly scoped contract migration can precede an audited-release handoff. The modes change iteration cost, not the definition of correctness. No mode permits known penetration, floating support, open required solids, impossible orientation, missing hero construction, or broken lighting.

## Mode selection

| Mode | Use when | Evidence scope | Exit condition |
| --- | --- | --- | --- |
| `fast` | local modeling edits and transform/material iteration | automated contracts plus affected views | changed ownership class is clean |
| `milestone` | a building, vehicle, interior, animation, or lighting family becomes coherent | representative risk views and relevant state combinations | milestone has no P0/P1 defect |
| `local-final` | local experiment or asset-validation handoff | planned risk views, relevant states, affected runtime audits, stack-appropriate checks, final agent visual review | no P0/P1 defect and local acceptance passes |
| `audited-release` | explicitly requested formal audit or tamper-evident evidence package | complete planned views, state matrix, artifacts, file digests, build, canonical conformance | strict audited gate passes |
| `migration` | explicit full-scene contract migration or reusable-system retrofit | one-time complete inventory and contract retrofit, then local-final evidence unless audit was requested | whole existing scene reaches current contracts |

If uncertain, use `milestone` during construction and `local-final` before claiming completion. Never infer `audited-release` from scene complexity, quality-first language or ordinary deployment. A repair does not automatically trigger `migration`; preserve existing checks and retrofit only the affected ownership unless full migration is in scope.

## Inspection ownership and cadence

Use two complementary forms of review. The agent performs available visual review; a separate human approval is required only when the user explicitly asks for it:

- **Automated checks** are the high-frequency regression layer. They own type/config validity, bounds, support, collision, actual visible-mesh topology, normals/winding, negative-space clearances, coplanar-surface/z-fighting risks, runtime bindings, performance counters, console errors, and deterministic state checks.
- **Visual continuity review** is a low-frequency live-page check. It owns macro proportion, composition, negative-space readability, spatial plausibility across a continuous orbit, reference resemblance, visual hierarchy, and whether a completed object feels coherent rather than merely passing isolated assertions.

Do not ask the user to inspect routine edits. The following are useful review milestones, not mandatory pauses or separate evidence packages. Combine stages when one coherent preview covers them:

1. **Macro blockout review:** before asset resolution or detail work. Inspect the home view, opposite side and relevant support/clearance blind spots, plus a continuous orbit when camera freedom is exposed. Make roads, aisles, door/service clearances, reserved volumes, and base limits visibly distinguishable.
2. **Coherent hero/subsystem review:** after one building, vehicle, mechanism, interior zone, motion system, or material family is complete enough to judge as a whole. Show its owning close view, opposite/underside blind spot, and its relationship to neighbors.
3. **Whole-scene look review:** after geometry, materials, lighting, and atmosphere first read together, before expensive optimization or final evidence capture.
4. **Local-final review:** after automated local gates pass and before the final handoff claim.

A human-reported macro contradiction is sufficient to reopen the owning stage even when automation is green. Human review does not waive measurable physical, topology, performance, or build failures. After feedback, fix the owning dimensions or assembly, run affected automation, and perform one focused recheck of the corrected gate; do not restart a full human review unless a global dependency changed.

Complete agent visual review and continue authorized work without waiting for unsolicited user sign-off. If browser inspection is unavailable, report that concrete validation gap and use available checks; do not claim it passed. Only an explicitly requested human approval remains pending until received. Do not fabricate approval.

At `milestone` or `local-final`, use [video-motion-review.md](video-motion-review.md) when temporal behavior is an uncovered risk and GPT6-Astra or another video-capable model has usable video inspection support in the current session. It can also diagnose a specific reported motion bug. This is not an every-edit requirement or an automatic audited-release gate; label frame-based fallback evidence accurately when direct video review is unavailable.

## Fast mode

Run after a coherent local change:

- type/config validation for changed data;
- full runtime tag/binding coverage when cheap, otherwise the changed prefab plus its support/collision neighborhood;
- affected collision, support, topology, axis, clearance, and detail requirements;
- zero to three deterministic screenshots: the owning close view, the most likely opposite/underside blind spot, and a state-specific view when material/light/motion changed;
- one short runtime probe when the change touches animation or visibility.
- for material/post/performance changes, one canonical fixed-state A/B plus the directly affected grazing/close view and the matching renderer diagnostics.

Fast evidence is advisory and may reuse an unchanged baseline. It does not satisfy local-final delivery.

Fast mode is automation-first. It should not normally trigger human review or a full browser orbit.

### Efficient fast-check contract

When the project has repeated iterations, provide one concise `qa:fast`-style entry point. It should:

- accept or infer the changed ownership class and run only its dependency neighborhood after cached global schema checks;
- reuse unchanged configuration and asset metadata instead of recomputing full evidence;
- print a one-line pass summary and full details only for warnings or failures;
- avoid screenshots, long animation cycles, performance sampling, and production builds unless the change directly owns them;
- aim to return quickly enough to run after every coherent local edit; if a check is inherently slow, move it to milestone mode rather than silently skipping it.

At macro and milestone gates, automation must separately verify: (1) 2D/OBB negative-space corridors such as roads, aisles, doors and reserved berths; (2) topology of the actual visible shell rather than only an audit envelope; and (3) same-plane or near-coplanar overlapping surfaces unless the material/render contract intentionally uses a stable decal offset.

## Milestone mode

Run after a subsystem becomes visually coherent:

- applicable subsystem geometry/detail checks and physical-motion checks when moving solids or clearance-sensitive paths require them;
- the smallest view set covering actual risks, normally home/opposite plus the relevant close or blind-spot view;
- only relevant mood/quality combinations;
- a same-view recheck for each P0/P1 fix and one genuinely new angle for the milestone;
- a full physical-motion cycle for mechanisms, moving solids or clearance-sensitive paths, using same-path swept checks where relevant. For decorative wind, particles or moving lights, use a bounded playback/recycling and state-continuity check; do not create a vehicle-motion artifact for ambient effects.
- for a look-development or performance milestone, canonical base-material/full-look captures, at least one opposite/grazing stability view, high/low or settled/interacting states as relevant, and fixed-state before/after cost metrics.

Persist defect notes and only the useful captures so local-final can reuse an unchanged baseline.

Use one agent visual continuity review at the milestone boundary, not after every intermediate correction. For an isolated technical milestone with no visible composition or continuity consequence, the representative automated/browser evidence is enough.

## Local-final mode

Use [qa-acceptance.md](qa-acceptance.md). Inspect the planned risk views in the live page, exercise only relevant lighting/quality/interaction states, run affected runtime geometry/detail/motion checks, stack-appropriate syntax/type/build checks, and perform one final agent visual continuity review. Persist compact summaries and defect rechecks when they help future iteration. Do not generate per-file hashes, validator fingerprints, a mandatory second review iteration, or a production build unless the experiment specifically needs them.

One clean review iteration is sufficient. If a P0/P1 defect is found, retain its owning view, fix it, then repeat that view plus one new blind-spot angle. Do not recapture unaffected views.

## Early interaction and stopping

At the first coherent usable preview, test exposed continuous zoom/orbit, presets, mood/quality transitions, resize, reload and hidden-tab return. Verify entry/dynamic modules and preview-server reachability. Repeat affected transitions after renderer/camera changes and recheck the live URL before handoff.

Before extending QA, name the observed defect or uncovered required risk, its owner and the expected visual/functional benefit. Stop after applicable checks are clean and important reference features are present. Reuse unchanged evidence; do not add a new audit solely because more checking is possible. See [reference-first.md](reference-first.md) for fidelity priorities.

## Audited-release mode

Use this mode only when explicitly requested. Apply the complete evidence package, production build, file digests, validator fingerprint, at least two review iterations, and the Skill-owned canonical conformance gate in [conformance-gate.md](conformance-gate.md). These tamper-evident controls are intentionally outside the default local workflow.

## Migration mode

Migration cost is front-loaded. Before visual polish:

1. inventory every existing visible physical assembly and helper exclusion;
2. add stable IDs and one-to-one renderer bindings;
3. add collision, support, topology, axis, detail, camera, state, and evidence contracts;
4. establish a full visual baseline because previous hidden defects are unknown;
5. fix discovered P0/P1 defects by ownership class;
6. finish with local-final mode unless audited release was explicitly requested.

After migration passes once, return to delta-based `fast` and `milestone` operation. Do not repeat the migration inventory on every edit.

## View invalidation

Maintain a dependency map from scene ownership to view IDs and state IDs. A change invalidates evidence when it affects:

- an object visible in the view;
- a parent transform, support height, footprint, silhouette, roof, foundation, or occluder;
- a shared material, light, environment, renderer option, or quality policy;
- motion paths, clipping planes, particle state, or camera code;
- the scene configuration or live runtime state used by the view.

Examples:

- wheel edits invalidate wheel/rail, underside, end-on, and moving-train views;
- a vending-machine move invalidates its close view, station circulation, support, and neighboring-column views;
- a global night-light or tone-mapping edit invalidates every night view;
- a local poster texture does not invalidate an opposite portal view unless it changes shared material or build output used by that view.

Reuse an earlier reviewed view when its camera/state contract and dependent scene/material/light ownership are unchanged. For local experiments, an unchanged live preset or contact-sheet entry is sufficient; no file digest is required.

## Efficient visual review

Inspect the live page first. Create deterministic captures or contact sheets only when comparison, defect history, or handoff benefits from them. Group any captures by purpose—structure, hero details, physical blind spots, and lighting/motion—and open individual originals only for suspected defects or material judgment.

For visual review, prefer one live page with named camera presets and a short checklist over a sequence of disconnected screenshots. The continuous orbit is valuable because it exposes popping, missing backs, reversed faces, z-fighting, occlusion changes, and proportion problems that static frames can hide. Keep the prompt focused on the owning stage; do not ask the reviewer to evaluate topology numbers or unrelated unfinished systems.

Keep browser profiles, caches, and temporary downloads outside the project. Local QA storage should remain compact: plans, summaries, selected captures/contact sheets, and defect records—not full browser user-data folders or duplicate evidence packages.
