# Dimensional reference audit — bearing units

Reference: [SKF SYJ 90 TF product dimensional drawing/table](https://www.skf.com/products/mounted-bearings/ball-bearing-units/pillow-block-ball-bearing-units/productid-SYJ%2090%20TF) (consulted 2026-11-05).

Catalog values (millimetres): bore d=90, base width A=88, top width A1=54, inner ring width B=89, centre height H=101.6, foot height H1=33, housing length L=327, bolt centres J=262, attachment-hole diameter N=27. The three head-drum bearing envelopes now follow these dimensions at the 90 mm bore; the shaft and bore radii match at 45 mm. Other model bearings reuse the same *proportions* at their own bore and are not catalog-matched products.

This is a concept visualization, **not** a bearing selection or approved fabrication drawing. Internal bearing geometry and supports remain stylized. Load ratings, shaft fits, mounting, seals, alignment and support stiffness require separate engineering verification.

## Outstanding dimensional contradictions

- The plant-reference head drum calls out Ø800 mm, but the actual visible rubber geometry has radius 0.242 m (Ø484 mm) and the steel shell radius 0.230 m (12 mm lagging). Resolving this requires moving the belt path, idlers, chute and supports together, not just enlarging the drum in isolation.
- The 1000 mm belt width and 246 m conveyor length are explicitly *plant reference* figures, not confirmed model dimensions. Do not treat the current exported GLB as a manufacturing-scale layout.
- The illustrative bearing geometry and three-point support arrangement are not validated against service loads or a real SKF unit.

## Motion/contact checks (model units)

The belt centerline radius on both head and tail is now 0.249 m. A 14 mm belt over 0.242 m lagging gives a 0.249 m belt centerline, eliminating the prior head/tail radial clearance. Head shell radius 0.230 m plus 12 mm lagging is 0.242 m. Carry/weigh idlers spin at belt speed divided by their 0.082 m radius; return idlers use their own 0.062 m radius rather than the carry-idler radius. These are kinematic/contact consistency checks, **not** proof of clearances throughout the gallery.

## Distinct rollback angles

A 2° take-up at the model backstop/output shaft passes through a 238/318 belt pitch-radius ratio, hence the model drum turns only ≈1.50° and the model belt travels 0.249 × (238/318) × 2π/180 ≈ 6.5 mm. The separate plant-reference line “2° ≈ 14 mm” assumes 2° at an Ø800 mm **plant drum**, not the model backstop shaft. The component text and engagement notification now distinguish these cases.
