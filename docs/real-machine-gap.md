# How close can this viewer get to the actual conveyor drive?

**Decision, 2026-11-05:** Do not assign a visual-similarity percentage to a machine whose as-built drawings, supplier model IDs and photographs are missing. This project is a concept model, not a digital twin. The new CAD skills in [`.agent-skills`](../.agent-skills/README.md) are validation workflows; they do not supply missing real-machine dimensions.

| Evidence available | What can be checked now | What cannot be asserted |
| --- | --- | --- |
| Project reference duty: 200 kW / 1487 rpm motor, Ø800 mm plant drum, 1.9 m/s belt, 450 t/h and 246 m | Ideal plant drum speed ≈45.36 rpm and required overall reduction ≈32.78:1 can be calculated. | Those figures alone do not identify a motor, fluid coupling, actual gearbox, belt profile, support layout or equipment vendor. |
| Visible shortened study: Ø484 mm head drum, 12/36 bevel teeth, 238/318 mm belt pitch radii, 3.8 m drum-center distance | Head/tail belt contact and illustrated reduction ≈4.008:1 can be checked in tests. | A uniformly scaled Ø800 mm installation, a complete ≈32.78:1 gear train, physical load/deflection and safety performance. |
| [SKF SYJ 90 TF catalog](https://www.skf.com/products/mounted-bearings/ball-bearing-units/pillow-block-ball-bearing-units/productid-SYJ%2090%20TF) | Compare the **candidate** head-bearing envelope, 90 mm bore, 200.5 mm height, 27 mm hole and 22 mm attachment bolt. | Whether any SYJ 90 TF is installed, housing/shaft fits, actual bearing count or the load rating of this arrangement. |
| [Voith T-family manual](https://www.voith.com/corp-en/385_e_3626-011000_en_rev.10.pdf) and [SEW X-series manual](https://download.sew-eurodrive.com/download/pdf/16931211.pdf) | Add/identify representative oil sight glass, breather and drain *studies* on existing parts. | That these vendors, their products or these exact service options are on the user's machine. |

## Evidence-first path to a faithful model

1. **Identify the machine:** one overall photo showing drive and belt path, plus plate photos for motor, gearbox, coupling, backstop and drum/bearing unit. Record model/serial numbers privately in a local engineering record, not in a public scene.
2. **Obtain dimensioned sources:** GA arrangement and shaft-centre coordinates; gearbox ratio and mounting face; coupling bore/envelope and installed service features; drum shell/lagging OD, face width and shaft fit; belt width/profile and take-up travel. Without these, silhouette and packaging cannot be checked.
3. **Map each datum:** label it `as-built`, `manufacturer-catalog candidate`, `project reference`, `derived ideal`, or `illustrative`. Link independent dimensions once; do not use catalogue dimensions from one vendor as evidence of installation of that vendor.
4. **Rebuild and verify:** construct a parametric CAD assembly after obtaining the dimensions, then read exported STEP/GLB back and check bounding boxes, shaft axes, pulley/gear ratios, belt contact and clearances across drive, stop and backstop states. Inspect front, top, end, exploded and maintenance-access views. Headless Three.js checks are **not** a manufacturing collision study or a real-browser visual review.

**Current verdict:** Catalog-style external details can be made more credible, but exact as-built visual or mechanical likeness is **unverifiable** with the present evidence. The missing overall reduction is about 8.18× relative to the illustrated train; do not invent an additional stage just to close the number. The unsupported second conveyor was removed, and should remain absent unless the actual installation is documented.
