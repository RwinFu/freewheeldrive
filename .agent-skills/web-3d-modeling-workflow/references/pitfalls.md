# Pitfalls and proven fixes

These failures came from a real WebGL diorama iteration. Preserve the underlying lesson, not the exact numeric fix.

## Portal-shaped boxes are not tunnels

**Symptom:** the train passes through green rectangular blocks.

**Cause:** the scene contains mountain placeholders but no opening, lining, frame, or dark interior.

**Fix:** extrude a hill profile with an arch hole, add lining and masonry frame, and validate the portal from front and back.

## A black blocker works from only one side

**Symptom:** the train disappears in the home view but is visible through the outer/back portal.

**Cause:** depth occlusion depends on camera direction.

**Fix:** keep the dark curtain for appearance and add world-space clipping planes to every vehicle material and clipped shadow.

## Delayed per-car visibility pops

**Symptom:** cars travel half a length beyond the portal and disappear one by one.

**Cause:** visibility is tied to car center or hidden-loop depth instead of portal fragments.

**Fix:** clip fragments at the portal plane. Keep coarse group visibility only as an off-screen performance optimization.

## Hidden spline penetrates the base

**Symptom:** the train tilts into a portal, dives through the slab, or follows an impossible grade.

**Cause:** a closed Catmull-Rom curve was used as a hiding mechanism without tangent/grade validation.

**Fix:** use a physically correct visible corridor plus abstract hidden distance, or build a real hidden route with valid geometry.

## Inner glass layer is invisible

**Symptom:** night windows stay black even with an emissive interior.

**Cause:** the interior plane is behind the solid front face of a frame box; glass only tints the frame.

**Fix:** inspect exact layer offsets and place the interior in front of the opaque frame face, then glass, gasket, and reflections.

## Headlight makes the cab panel glow

**Symptom:** the windshield or entire front panel appears to be the lamp.

**Cause:** a central point light illuminates all nearby faces and/or the windshield backing is too bright.

**Fix:** use two localized bezels/lenses, forward spotlights, subtle halos, and optional beam/pool meshes. Keep the cab glass darker than the lamp lenses.

## Light exists but is not perceptible

**Symptom:** a spotlight is technically present but no forward beam can be seen.

**Cause:** air has no volumetric scattering, intensity is too low for physically based falloff, or no surface lies in the cone.

**Fix:** raise spotlight intensity responsibly and add a subtle additive cone plus an elongated surface pool when the chosen visual style expects visible beams.

## High-quality mode removes shadows

**Symptom:** selecting the high preset produces no detail improvement or loses shadows.

**Causes observed:** incompatible soft-shadow shader injection, changing shadow-map properties without recreating the light, adaptive DPR masking the preset, and constructor-only renderer settings not updating.

**Fix:** use stable native PCF shadows, explicitly update/re-key lights, keep renderer constructor settings stable, and attach high detail to real geometry/instance differences.

## Shader patch makes geometry black

**Symptom:** black petals or physical materials and shader validation errors.

**Cause:** a soft-shadow shader patch was incompatible with the installed Three.js/WebGL shader path.

**Fix:** remove the patch, use native shadow mapping, and keep petals on an unlit basic material with stable color.

## Floating platforms and houses

**Symptom:** objects look grounded from the home camera but gaps appear when rotated.

**Cause:** positions were set by eye and thin planes substituted for foundations.

**Fix:** derive bottom surfaces from the ground height and model explicit foundations/slabs/base plates.

## Reversed roof

**Symptom:** a gabled roof forms a central valley or lifts at the wrong edges.

**Cause:** mirrored rotation signs were swapped or overlapping panels were used without a ridge model.

**Fix:** use a triangular-prism roof profile or validate panel normals and ridge height from the end view.

## Roof looks finished but is open

**Symptom:** the roof reads correctly from above, but a rotated/end view reveals missing gable caps, ridge closure, eaves, or underside.

**Cause:** modeling optimized only for the hero camera or used two decorative planes as a solid roof.

**Fix:** decide whether the roof is a solid volume or an intentionally thin sheet. Tag required solids for boundary-edge auditing and inspect both ends, ridge, eaves, and underside after every roof edit.

## Bicycle wheels lie flat

**Symptom:** torus wheels are parallel to the ground or front/rear wheels use different planes.

**Cause:** primitive-local axes were assumed rather than measured after parent transforms.

**Fix:** define the wheel's local plane normal/axle and expected horizontal world axis, then run an angle-tolerance audit. Inspect an end-on and low side view.

## Child parts penetrate the ground

**Symptom:** the parent object origin is correct, but wheels, feet, roots, pipes, or props extend below the support surface.

**Cause:** grounding checked the anchor instead of the full world-space assembly bounds.

**Fix:** update world matrices and compare the complete assembly and critical child bounding boxes with their explicit support Y. Treat both penetration and floating gaps as P0.

## Centers do not prove non-overlap

**Symptom:** a garden invades the road, a fence enters the track, or a tree is planted in a farm despite different object centers.

**Cause:** placement checks compare anchors rather than extents.

**Fix:** validate full footprints and semantic zones, using OBB/SAT when rotation matters. Give fences an explicit crossing break.

## Rotated AABBs report the wrong collision

**Symptom:** diagonal props are reported as colliding despite visible separation, or a thin rotated object slips through a clearance assumption.

**Cause:** final validation uses world AABBs that discard orientation.

**Fix:** use rotation-aware footprint OBB/SAT and live 3D OBB/SAT for box-like meshes. Treat an AABB fallback as a warning requiring visual or BVH/triangle-level review for concave critical geometry.

## Untagged geometry silently avoids validation

**Symptom:** the audit passes while the newly added roof, wheel, shelf or prop was never checked.

**Cause:** only a small hand-picked subset carries audit metadata and the validator has no coverage gate.

**Fix:** set full tag coverage for highest-quality scenes, require critical IDs/kinds, report eligible/tagged counts, and block on every unexplained untagged visible Mesh. Exclude only true helpers.

## Synthetic coverage tags create a false pass

**Symptom:** runtime coverage reports 100%, but newly added meshes have no stable semantic IDs, support rules, collision class, axis, or topology intent.

**Cause:** a pre-audit traversal assigns a generic tag derived from `Object3D.uuid` to every untagged mesh.

**Fix:** register prefab roots with stable SceneDocument IDs and let descendants inherit coverage deliberately; tag critical children directly and exclude only named helpers/particles. Preserve the count of genuinely unregistered meshes instead of mutating them away before measurement.

## Declared collider is smaller than the visible prefab

**Symptom:** CLI collision and support checks pass while a scaled wheel, roof edge, handle, sign, or child part visibly enters another object or the ground.

**Cause:** support contacts and collider extents were copied by eye or computed before child scale/rotation; the validator only sees the undersized declared volume.

**Fix:** move dimensional math into a pure prefab contract shared by rendering and tests. Derive every wheel/foot contact after scale and rotation, compare the complete visual envelope with collider min/max, and keep an active-scene regression test.

## Runtime scene flattens document hierarchy

**Symptom:** initial matrices match, but a child fails to follow its parent, stays visible under a hidden ancestor, or diverges after parent animation.

**Cause:** the prefab registry renders every object at the root and the binding audit compares only world position or local `visible`.

**Fix:** reconstruct prefab parent relationships where supported and fail loudly for unsupported helper-parent chains. Audit the nearest prefab ancestor, effective visibility through all ancestors, stable identity, prefab ID, and root-relative world matrix.

## Increasing tunnel/rail length exceeds the base

**Symptom:** rails, ballast, or tunnel backs protrude outside the slab.

**Cause:** visible length and tunnel depth were edited independently of base bounds.

**Fix:** derive extents, reserve bevel margins, and fail configuration validation before visual polish.

## Props read as boxes

**Symptom:** vending machine, bench, train, or canopy has correct color but low realism.

**Cause:** one box per object with a flat decal.

**Fix:** model manufactured part boundaries. Products, slats, metal frames, gutters, brackets, sills, handles, and fixtures are high-value details.

## Detailed environment is semantically empty

**Symptom:** a convenience store or room contains walls and a few shelves, but no believable zones, shelf levels, product categories, controls, utilities, or operational clutter.

**Cause:** detail was interpreted as polygon count or random props rather than real-world function.

**Fix:** create a zone-by-zone large/medium/small inventory from real examples. For shelves, model bays, levels, price rails, contents, stock variation, and category placement. Repeat density and physical-access review until hero zones pass.

## A detailed inventory is not rendered detail

**Symptom:** the JSON describes hundreds of products and several shelf levels, but the scene contains a few boxes or a single family with an inflated `quantity` value.

**Cause:** validation checks non-empty planning arrays but never binds them to live scene objects.

**Fix:** map every requirement to actual object IDs, categories, variants and evidence views; compare declared counts with `InstancedMesh.count` or individually tagged objects using the runtime detail auditor.

## First attractive render is treated as complete

**Symptom:** obvious roof, wheel, grounding, intersection, or missing-detail problems remain because the home screenshot looks good.

**Cause:** no mandatory correction-and-recheck cycle.

**Fix:** treat first coherence as a QA milestone. Produce a defect list, fix ownership, repeat the same views, then add new blind-spot angles. Do not ship with any P0/P1 item.

## Night scene becomes black silhouettes

**Symptom:** practical lights glow but vehicles and terrain disappear.

**Cause:** environment/moon fill is too weak and emissive surfaces are asked to light the scene.

**Fix:** combine cool environment fill with localized warm practical lights. Emissive materials show the source; point/spot lights illuminate surroundings.

## Bloom turns the scene white

**Symptom:** the train, bridge and shop lose texture and the whole frame becomes milky or clipped when lights are enabled.

**Cause:** exposure and emissive intensity are too high, Bloom threshold is too low, or a broad light is being used to fake indirect bounce.

**Fix:** establish exposure without Bloom, keep luminous sources localized, use accountable bounce/fill lights, then add selective or thresholded Bloom. Recheck the canonical base-material and full-look pair.

## Planar reflections multiply every render pass

**Symptom:** a scene with a few thousand meshes reports tens of thousands of calls and becomes much slower after GTAO or a second wet surface is added.

**Cause:** each reflector redraws the complete scene for the main pass and post passes, and reflectors may render one another recursively.

**Fix:** block reflector recursion, exclude irrelevant layers, update rain-blurred planar reflections at a validated cadence, and reuse the last reflection while camera controls are active. Preserve full settled resolution when the reference needs it.

## Tiny props dominate shadow cost

**Symptom:** geometry detail looks modest, but every frame renders thousands of shadow-caster meshes or several point-light cubemaps.

**Cause:** every bolt, label, pane, plant, product and fastener inherited `castShadow=true`, while broad practical lights use point shadows unnecessarily.

**Fix:** keep a priority-ordered shadow-light budget, prefer a wide spotlight when one shadow direction is sufficient, disable micro/transparent/particle casters below the reference pixel threshold, and update mostly static shadow maps only on meaningful changes.

## Small glass panes trigger a full transmission pass

**Symptom:** adding laundromat windows or a wet film causes a large draw-call jump although the panes occupy little screen space.

**Cause:** physical transmission requires an additional opaque-scene render and is repeated across many small materials.

**Fix:** keep true transmission for hero refractive glass; compare small panes against transparent physical glass with clearcoat/environment reflection and real interior layers. Validate the appearance before removing transmission.

## Normal-map recompression saves bytes but damages detail

**Symptom:** the compressed file looks similar in a thumbnail, but wet-road and concrete highlights become blocky or directionally wrong.

**Cause:** JPEG chroma subsampling corrupts normal-vector channels even at a high nominal quality setting.

**Fix:** preserve original normal maps or use validated KTX2/Basis normal encoding. Pack scalar ORM channels and reduce their resolution first. Use measured fidelity plus grazing-angle visual review for color-map recompression.

## Large procedural fallbacks block the first frame

**Symptom:** the loading screen stalls before any external PBR texture appears, and scene construction spends hundreds of milliseconds generating maps that are immediately replaced.

**Cause:** high-resolution canvas/procedural fallback textures are created synchronously for every material family.

**Fix:** create tiny shared placeholders, load real assets asynchronously, and generate expensive optional textures only on demand or offline.

## Every repeated part owns a material

**Symptom:** mesh count, shader-program count and draw calls grow together despite repeated parts sharing the same visible finish.

**Cause:** helper functions clone geometry/materials for each sleeper, fastener, product, plant or window.

**Fix:** share immutable geometry/materials, use instances or batching, and vary instance color/transform/atlas index instead of creating unique programs. Preserve stable semantic assembly tags around the optimized representation.

## Interaction is slow although the final screenshot is acceptable

**Symptom:** the canonical frame eventually looks correct, but orbiting the camera stalls and then continues rendering expensive buffers that immediately become obsolete.

**Cause:** GTAO, planar reflections and shadow maps are fully recomputed on every control event.

**Fix:** during active interaction, retain the last valid reflection/shadow buffers and temporarily pause the most expensive AO pass; restore the full settled high-quality state within one or two frames after controls end. Record both states in QA.

## Dev HMR state is mistaken for production truth

**Symptom:** stale runtime errors, duplicated renderers, or behavior that changes after build.

**Cause:** many structural HMR updates accumulated without a full reload, or only the development page was tested.

**Fix:** reload after structural renderer changes and repeat critical QA on the live local page. Repeat on a production build only when build behavior is in scope.

## Browser automation clicks hidden controls

**Symptom:** a locator exists but click times out.

**Cause:** settings remain mounted while visually hidden.

**Fix:** test `isVisible()`, open the panel explicitly, then act. Preserve one browser tab and avoid assuming UI state after reload.

## QA was performed but no evidence exists

**Symptom:** completion notes claim every angle and quality mode passed, but there are no named live-view results, automated summaries, or defect rechecks.

**Cause:** QA stayed in transient browser state and was summarized from memory.

**Fix:** record the actual named live views, relevant states, automated summaries, and any P0/P1 closure rechecks. Files and a second iteration are optional for a clean local experiment; never claim views that were not inspected.

## A local validator weakens the Skill and self-certifies

**Symptom:** the UI reports full coverage and every npm QA command passes, but only a few hand-picked objects participate in collision checks, planned cameras were never implemented, or required semantic objects are satisfied by aliases.

**Cause:** the project copied or rewrote validators with a smaller schema, then treated self-declared `status: pass` fields as final authority.

**Fix:** migrate the whole existing scene to the current contracts and run the installed runtime geometry/detail validators against the live scene. For explicitly requested audited release, also run the installed Skill's `validate_conformance.mjs`; never copy or weaken that script.
