# Realism pass — evidence, service access and verification

This is an **evidence-first concept viewer**, not an as-built digital twin. No photograph, measured GA, machine nameplate or serial-number-qualified equipment drawing of the installed conveyor exists in the repository. A web image or unrelated catalog illustration cannot establish an installed component. Consequently, the work below cannot honestly complete photo-to-model matching, replace the gearbox with a known installed unit, or certify shaft fits, access envelopes and guard distances.

## Evidence register (as of this pass)

| Item needed to claim as-built match | Status | What it would resolve |
| --- | --- | --- |
| Overall and four-side photos, with a scale target | **Missing** | Belt route, support layout, orientation, protective guard/access and actual one-conveyor scope. |
| Motor, coupling, gearbox, backstop and bearing-unit nameplates | **Missing** | Manufacturer/model, rated reduction, shaft interface and actual lubrication/selection. Do not publish full serial numbers. |
| Dimensioned GA and shaft centerlines | **Missing** | Motor/coupling/gearbox mounting, drum spacing, walkways and clearance envelopes. |
| Assembly, lubrication and service drawings | **Missing** | Key/fit/retention, coupling oil level, breather/drain/grease points and service access. |
| Published Voith constant-fill coupling, SEW gear-unit and SKF SYJ 90 TF literature | **Catalog examples only**; see [real-machine gap](real-machine-gap.md) | Functional comparison and **candidate** details, not vendor confirmation for the installed machine. |

## Improvements made without inventing plant hardware

- Distinguishable, named catalog-study fill/fusible plugs, oil sight glass, gearbox breather/drain and six stationary-bearing grease nipples. Selected-part cards list service points in English/Persian with the explicit status **catalog/concept study — installed details unknown**. The `FreewheelStudio.inspect()` diagnostic includes the service inventory and whether each object exists.
- Three separately named, replaceable impact-face liner plates use a matte, different finish from the chute frame. Existing procedural dust cloud, rubber relief, tread and cast/brushed textures remain **visual context**; a weathered finish is not a claim of measured wear or a failure on the installed equipment.
- The local user-supplied Code Cinema skill informed a **HERO** three-quarter lens/framing preset. Its bundled Three.js r160 and film renderer are isolated from the offline r128 viewer. A browser-rendered movie uses the actual exported viewer GLB; see the film README. It is a concept visualization, not a verified machine reconstruction. See [toolchain audit](toolchain-audit.md).
- `npm test` checks service-node presence, fixed-housing parentage for bearing nipples, liner differentiation, and both r128/r186 scene states. It also executes the viewer's actual camera fit calculation for each of the 12 internal overview and detail views at desktop (1280×800) and mobile (390×720) sizes, checking projected focus corners. In addition, a real Chromium/SwiftShader browser smoke run exercised HERO, 12 views, coupling inspection and GLB export, and film stills were visually reviewed. This is not an on-site color/material or physical-accuracy sign-off.

## Next required on-site verification

1. Record photos from front, rear, both ends and above, with rulers and guard-open/closed context where safe; obtain permission and observe lockout before opening any guard. Photograph nameplates separately and redact serials for publication.
2. Record measured shaft centers and component envelopes. Reconcile the reference 32.78:1 with actual gearbox ratio, pulley pitch diameters and measured running speed. The 8.18× difference is **not** a physical modeled stage.
3. Obtain vendor service drawings and measured access routes, then replace candidate fittings/liners and illustrative collar/key fits, remove any feature absent on the actual machine, and rerun geometry plus real-browser screenshot comparisons.
4. Before engineering release, validate mechanical loads, shaft/key fatigue, bearing life, fastener preload, alignment, belt tension, service clearance and guard standards. Headless bounding boxes do not certify those properties.
