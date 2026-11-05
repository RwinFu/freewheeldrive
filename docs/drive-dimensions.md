# Drive dimensions and ratios — concept study

`FreewheelDriveSpec` in `freewheel-detailed.html` is the shared source for the **shortened visible model** (`model`) and a **separate plant reference calculation** (`plant`). Geometry uses metres and radians internally; input speeds are angular radians per second. These are two different profiles, **not two scales of a validated machine**. Existing detail dimensions not listed here are still illustrative and are not governed by this table.

| Quantity | Visible model (`model`) | Plant reference (`plant`) |
| --- | ---: | ---: |
| Bevel teeth, input / output | 12 / 36 | Not specified |
| Bevel reduction (input / output rpm) | 3 : 1 | Not specified |
| V-belt pitch radii, driver / driven | 238 / 318 mm | Not specified |
| V-belt reduction (input / output rpm) | 318/238 ≈ 1.336 : 1 | Not specified |
| **Total *depicted* reduction** | **≈ 4.008 : 1** | Not depicted |
| Head shell radius + lagging thickness | 230 + 12 mm | Not specified |
| Belt thickness, centerline radius at both drums | 14 mm, 249 mm | Not specified |
| Visible head drum OD (shell + lagging) | 484 mm | **800 mm reference drum OD** |
| Drum center distance / incline | 3.8 m / 18° | 246 m conveyor / 18° |
| Reference motor power / rpm | Not represented at rated speed | 200 kW / 1487 rpm |
| Reference belt speed / capacity / width | Not rated | 1.9 m/s / 450 t/h / 1000 mm |
| Drum rpm at stated belt speed | Not rated | 1.9/(π × 0.8) × 60 ≈ 45.36 rpm |
| **Required ideal overall reduction** | **Not depicted** | **1487 / 45.36 ≈ 32.78 : 1** |
| Ideal drum torque / tangential belt pull | Not rated | ≈ 42.1 kN·m / 105.3 kN |
| Surface travel for 2° drum rotation | Not a stopping-distance prediction | ≈ 14.0 mm |

The **32.78 : 1 reference ratio is not achieved by the 4.008 : 1 depicted drive**. The gap is about 8.18×; no additional reduction stage is drawn or asserted. Do not equate the illustrative animation speed with plant speed. Reference rpm assumes no belt slip and the stated 800 mm contact diameter. Ideal torque and pull assume 100% efficient transfer and ignore duty factors, losses, friction, drive sizing, load distribution and braking dynamics; the 2° travel is only an arc-length conversion, not measured runback.

The `model` radii and teeth drive the bevel and V-belt motions, belt/drum contact path and key procedural meshes. `plant` drives the plant card, duty readouts and motor reference plate. Other stylized housing, fastener, guard, chute, idler and roller dimensions are **not** parametric. Changing the table alone does not regenerate a manufacturable assembly. Automated arithmetic and contact checks are in `tests/check-drive-spec.mjs`, with scene and mechanics checks in the other tests.

## Two-deck extension

The short upper infeed is a **second conceptual belt**, discharged toward the enclosed loading duct of the lower receiving incline. The 246 m plant reference describes the original inclined conveyor only. The feeder's drive, pulley dimensions, rated speed and transfer capacity are not established; motion is a direction indicator, not a synchronized factory drive. Its guardrails, bearing seals and lubrication points are illustrative and require structural, clearance and safety validation. The 20% slip switch changes on-screen belt distance relative to head-drum rotation, not the engineering motor selection.
