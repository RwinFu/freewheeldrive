# Component-by-component concept audit

This is a source/kinematic audit of the **illustrative** HTML scene, not a dimensional CAD inspection, collision simulation, FEA, electrical design or commissioning approval. Reproduce automated checks with `node tests/check-html.mjs && node tests/check-mechanics.mjs`.

| No. | Assembly part | Checks / outcome | Open engineering verification |
| --- | --- | --- | --- |
| 01 | Motor | Motor/coupling/gearbox input share the same rotating input-angle variable; animation ratio to gearbox output checked in mechanics test. | 200 kW motor envelope, mounting, rated torque and starting duty are not dimensionally sourced. |
| 02 | Fluid coupling | Driven input shaft stays phase-coupled in visualization. | Fluid-slip transient, fusible plugs and actual coupling selection not simulated. |
| 03 | Bevel gearbox | Model stage 12:36 = 3:1; 90° cone/pitch geometry is reported by scene audit; forward/reverse shaft angles checked. | Plant reference ratio 32.8:1 is NOT reproduced by the single stage. Do not use displayed animation rpm as plant rpm. |
| 04 | Roller-ramp backstop | 21 roller positions checked for race contact, plunger contact, positive spring preload and nonpenetrating ramp; drive, 2° backstop-shaft lock (≈6.5 mm model-belt travel), free runback and re-install transition exercised. | Torque rating, heat, wear and spring fatigue are not established; never use as a safety specification. |
| 05 | Driver pulley | Modeled 0.238 m pitch radius stays linked to the driven 0.318 m pitch radius in the kinematics and texture phase. | Groove profile and belt rating are illustrative. |
| 06 | Head drum | Corrected shell + 12 mm lagging + half-belt thickness to exactly meet the 0.249 m belt centerline; 90 mm bore/head-bearing envelopes follow catalog dimensions. | Visible Ø484 mm model is deliberately separate from Ø800 mm plant reference; shaft loading and three-bearing arrangement not verified. |
| 07 | Conveyor and tail | Tail rubber radius + half belt = 0.249 m path radius; carrying and return idlers now rotate using their respective 82/62 mm radii; belt speed tracks drum angle. | Clearance against all gallery/chute parts and physical troughing for a 1000 mm plant belt need CAD review. |
| 08 | Three V-belts | Both pitch radii are used in the belt speed relation; three coplanar grooves are present in the scene. | Tension, center distance, section and service factor require actual belt selection. |
| 09 | Loading/dust station | Material feed follows drive/coast presentation state. | Chute clearances, dust extraction and skirt sealing not validated. |
| 10 | Primary cleaner | Exists as a separate selectable component near head end. | Blade pressure, wear and wrap-clearance need manufacturer drawings. |
| 11 | Belt scale | Weigh idler shares the carrying-idler contact radius; uncalibrated flow/total are suppressed in the *separate educational dialog*. | Calibration is synthetic and disconnected from real load cells / scene motion; no weighing accuracy claimed. |
| 12 | Sway switches | The four roller levers deflect with the same input used to bend the carrying/return belt; indicator lamps and a latched trip pause on-screen motion. Warning, trip, reset and power-loss transitions have automated tests. | Arc motion, roller contact, wiring, response time and safe stopping of actual machinery are not validated; this is not a safety circuit. |

## Views / states to inspect manually

Check overview, front, top and close-up inspection at assembled and exploded positions; cycle solid, X-ray, wireframe and bilingual labels; compare power-on, power-cut with installed backstop, removed-backstop runback and reinstall. A headless Three.js geometry test now constructs all 12 components (416 meshes), checks finite bounds and exercises drive, lock and runback poses without WebGL. Browser screenshot checks remain **unverified**: the available Chromium package cannot start here because system NSS libraries are missing. Numerical/geometry checks are not a substitute for multi-angle visual inspection.
