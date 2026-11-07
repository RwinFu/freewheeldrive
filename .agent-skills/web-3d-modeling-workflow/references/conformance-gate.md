# Canonical conformance gate

Use this gate only for explicitly requested `audited-release`: publishable, archived, tamper-evident, or multi-party handoff evidence. Do not run it for ordinary local experiments or `local-final`. It prevents a project-local validator from weakening an audited result while still printing `pass`.

## Authority boundary

Project scripts remain useful for fast iteration, but they are not final authority. The last acceptance command must execute the original Skill-owned script:

```powershell
node /path/to/web-3d-modeling-workflow/scripts/validate_conformance.mjs <project-root> --manifest=audit-conformance.json --artifact=qa/conformance-result.json
```

Resolve the installed Skill path on non-Windows systems. Do not copy `validate_conformance.mjs` into the project, edit it to fit the project, or replace it with an npm script of the same name. The result records a fingerprint of the canonical scene, evidence, motion and look-performance validators plus runtime audit templates that made the decision.

Copy [../assets/audit-conformance.template.json](../assets/audit-conformance.template.json) into the project. All paths are relative to the project root and must remain inside it.

## What the gate cross-checks

The gate does not merely inspect `status: pass`. It:

1. executes the Skill-owned `validate_scene.mjs` with warnings as errors;
2. executes the Skill-owned `validate_qa_evidence.mjs`;
3. executes the Skill-owned `validate_motion_audit.mjs` against the bound complete-cycle runtime-motion artifact;
4. executes the Skill-owned `validate_look_performance.mjs` against the bound look-development/performance artifact;
5. requires matching scene IDs across the manifest, scene contract, QA evidence, runtime geometry artifact, runtime detail artifact, runtime motion artifact, and look-development/performance artifact;
6. requires the v1 runtime geometry capability contract, including direct critical tags, inherited mesh coverage, aggregate and per-contact support, boundary/manifold/winding/signed-volume/normal checks, axis checks, and AABB plus OBB/SAT intersections;
7. derives collision, support, and closed-volume candidates from the scene contract and requires each ID in the corresponding live runtime registry;
8. fails when configured collision pairs exist but the live audit tested none;
9. requires the v1 runtime detail capability contract, direct stable contributor IDs, visible rendered/instanced counts, and alias-free one-requirement ownership;
10. checks that every configured detail requirement has a passing runtime result at its configured count/category/variant thresholds;
11. requires complete-cycle sampling of the actual runtime path, swept OBB collision, support, tangent/grade/steering and partial/fully-hidden boundary clipping checks for every declared moving system;
12. proves that QA evidence references the exact runtime geometry/detail/motion/look-performance artifacts used by conformance;
13. records the canonical Skill fingerprint in its result.

## Existing-project migration

Adopting the Skill midway is a migration, not a waiver. Before running the gate:

1. inventory every visible physical assembly and every configured object;
2. add stable IDs and one-to-one live bindings;
3. give every physical footprint a collision class and explicit AABB/OBB shape, or add a specific reviewed exclusion reason;
4. add support planes and independent contacts for every meaningful foot, wheel, leg, column, cabinet, or foundation;
5. mark every required solid and expected winding;
6. replace aggregate or alias-based detail counting with direct requirement bindings;
7. implement the QA cameras, state matrix, animation runs, and capture evidence rather than only listing them;
8. generate the complete-cycle motion artifact from the production runtime paths and stable collider registry;
9. regenerate runtime artifacts after the final production build;
10. lock the canonical camera/exposure, complete the material/look-development captures, record matched-state renderer/texture/interactivity measurements, and generate the look-performance artifact.

Do not preserve a weaker legacy schema merely to keep old green results. Convert the existing project to the current templates and treat every newly exposed failure as a real migration defect.

## Runtime geometry artifact

Persist the result returned by [../assets/runtime-scene-audit.template.ts](../assets/runtime-scene-audit.template.ts), passing the stable `sceneId` in its options. The artifact must retain:

- `schemaVersion: web-3d-runtime-geometry/v1`;
- the canonical producer name and capabilities;
- zero errors and zero warnings;
- eligible/tagged mesh counts and exact coverage;
- tested collision-pair count;
- direct-tag, collision, support, topology, axis, and exclusion registries;
- the complete issue list.

Do not reconstruct this JSON from a summary card. Persist the runtime result read from the live production scene.

## Runtime detail artifact

Persist the result returned by [../assets/runtime-detail-audit.template.ts](../assets/runtime-detail-audit.template.ts), again passing the stable `sceneId`. Contributors must use stable direct `detailAudit.id` values. A parent wrapper may provide inherited mesh coverage, but it cannot let doors count as handles, wheels count as fasteners, or generic descendant meshes count as unrelated semantic requirements.

## Runtime motion artifact

Generate [../assets/runtime-motion-audit.template.json](../assets/runtime-motion-audit.template.json) from the production scene, then validate it with the Skill-owned `validate_motion_audit.mjs`. Do not type a clean summary by hand. The producer must sample the same runtime path functions and stable collider registry used by the render loop. For each train, truck or other moving physical assembly, persist:

- stable system and runtime-path IDs, semantic kind, full conservative bounds and cycle duration;
- at least 120 complete-cycle samples with a maximum step smaller than the narrowest configured clearance;
- a swept-volume test for every adjacent sample segment against piers, curbs, walls, channels, barriers, buildings and relevant boundaries;
- maximum support gap/penetration and zero penetration, unsupported, tangent, grade or steering violations;
- partial-at-edge and fully-hidden capture IDs where boundary/tunnel clipping applies;
- explicit capabilities and zero unresolved warnings/errors.

Bind the same artifact path from the conformance manifest and `runtime-motion` automated QA run. When the QA plan requests any animation cycle or maximum-speed run, conformance rejects `motionRequired: false`.

## Look-development and performance artifact

Copy [../assets/look-performance-audit.template.json](../assets/look-performance-audit.template.json), replace its examples with real fixed-state measurements and reviewed capture IDs, and validate it with the Skill-owned `validate_look_performance.mjs`. The artifact binds:

- the canonical camera/viewport/quality/visibility sampling state;
- base-material, full-look, grazing and opposite/moving captures;
- required and verified material/weathering families plus per-material real-scale mapping, channel and grazing-evidence contracts;
- source/optimized texture transfer, decoded-memory estimate, channel packing and normal fidelity;
- baseline/optimized renderer, shadow, transmission and texture metrics;
- raw settled and interaction RAF samples, repeated warm-load samples, input-to-present latency samples, and recomputed aggregate metrics;
- a warm runtime soak with zero optimized geometry, texture, program or render-target growth after warm-up;
- project budgets and concrete optimization actions;
- interaction-time caching and settled-quality restoration;
- required visual, animation and console/shader checks.

The scene configuration is the budget source of truth. Conformance cross-checks the selected high/low tier, viewport, device/browser label, DPR, warm-cache state, sample window, timing/draw/triangle/texture/shadow/transmission limits, reflection cadence, contact-occlusion scale, texture sizes and interaction policy against the look/performance artifact. Editing only the evidence JSON cannot relax the configured budget.

Persist the artifact inside the project and reference the exact same path from the conformance manifest and the `look-development-performance` automated QA run.

## Camera and file proof

The QA plan enables `requireCameraPose` and `requireFileDigests`. Each required view defines an exact camera position and target. Capture automation must read the actual live camera pose after controls settle and store it beside the capture; typing the intended values without reading the renderer is not evidence. SHA-256 digests bind every capture and automated artifact to the files that were reviewed.

## Blocking interpretation

Any conformance issue blocks `pass`. In particular, do not downgrade:

- missing collision/support/topology participants;
- a locally weakened or incompatible QA schema;
- a capture whose actual camera differs from its planned view;
- stale runtime artifacts or mismatched hashes;
- missing, hand-paralleled or incomplete motion paths; any swept penetration, unsupported sample, discontinuity or failed edge clipping;
- incomplete capability declarations;
- runtime warnings such as OBB fallback in a required quality-first gate;
- alias-style reuse of one detail contributor across multiple requirements.
- missing or mismatched look-development/performance evidence, measurements from a hidden tab, unmatched before/after states, texture or renderer budget failures, unverified material families, or interaction quality that does not restore.

The conformance gate proves instrumentation and evidence consistency. It does not replace human visual judgment. A visually discovered penetration, missing face, incorrect material, or implausible assembly remains P0/P1 even when deterministic gates pass; record it and repeat the correction loop.
