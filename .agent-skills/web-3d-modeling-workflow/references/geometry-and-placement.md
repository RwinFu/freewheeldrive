# Geometry, coordinates, and placement

## Coordinate convention

Choose one convention and state it in the scene configuration. A useful railway/diorama convention is:

- X: primary travel or length axis;
- Y: up;
- Z: transverse/depth axis;
- ground surface: a derived absolute Y value;
- track center: `railway.centerZ`;
- portals: planes at `x = ±railway.tunnelX`.

For other subjects, replace the semantic names but keep one source of truth. Do not mix world coordinates and parent-local coordinates without naming the owner.

## Height stack

Derive heights from surfaces rather than eyeballing them:

```text
groundTop       = base.positionY + base.topHeight / 2
roadTop         = road.centerY + road.height / 2
ballastTop      = railway.trackY + ballastHeight / 2
railTop         = railway.trackY + railLocalY + railHeight / 2
platformBottom  = station.positionY + foundationLocalBottom
platformTop     = station.positionY + foundationHeight + slabHeight
trainCenterY    = railTop + wheelRadius + bodyAxleOffset
```

Every supported object needs a declared support surface and contact tolerance. A 0.02 gap can become obvious under a low orbit camera.

## Bounds

For a centered rectangular base:

```text
x ∈ [-baseWidth / 2, baseWidth / 2]
z ∈ [-baseDepth / 2, baseDepth / 2]
```

Keep a safety margin for bevels, portal thickness, rails, and shadows. Validate the final extents, not only object origins.

For an axis-aligned footprint centered at `(x, z)`:

```text
minX = x - width / 2
maxX = x + width / 2
minZ = z - depth / 2
maxZ = z + depth / 2
```

For rotated rectangular objects, compute an oriented bounding box. A conservative expanded AABB is acceptable only during early blockout; final collision gates use rotation-aware 2D OBB/SAT for configured footprints and 3D OBB/SAT for eligible live meshes. AABB fallback must be reported because it can create false positives around diagonal objects and false confidence around concave geometry.

## Mesh integrity and closed surfaces

If an object represents a solid real-world volume, treat unexplained open boundaries as errors.

Check:

- roof ridge, eaves, front/back gable caps, and underside;
- wall corners, floor/ceiling joins, doorway/window reveals;
- vehicle body ends, wheel hubs, cabinet backs, platform side faces;
- triangle degeneracy, non-manifold edges, missing/zero normals;
- negative or zero scale that reverses winding or collapses an axis.

A roof that looks correct from above but has no end caps is incomplete. A thin intentionally open sheet, glass pane, decal, road surface, or particle card should be marked as such rather than forced closed.

Use `closedVolumeRequired` tags with [../assets/runtime-scene-audit.template.ts](../assets/runtime-scene-audit.template.ts). Automated boundary-edge checks are a gate, not a substitute for inspecting the ridge, underside, and both roof ends visually.

For required closed volumes, also inspect:

- signed volume relative to the object's scale;
- near-zero or self-canceling volume that indicates collapsed or zero-thickness geometry;
- shared edges whose adjacent triangles use the same direction;
- supplied vertex normals that oppose triangle winding;
- the expected overall winding after parent transforms and negative scale.

Signed-volume sign is meaningful only for a closed manifold mesh and depends on the project's winding convention. Concave/self-intersecting geometry can still require BVH or triangle-level inspection; record that limitation instead of treating an OBB or volume result as proof of perfect topology.

## Zones and collision classes

Define semantic zones:

- `track-clearance`: rail center plus vehicle and equipment margin;
- `road`: carriageway and shoulder;
- `crossing`: road/rail overlap that is intentionally constructed;
- `platform`: foundation and usable top surface;
- `farm` or `garden`: soil footprint and fence envelope;
- `building`: foundation plus roof overhang;
- `tree-trunk` and `tree-crown`: separate collision volumes;
- `tunnel`: portal opening, shell, and hidden-space volume.

Allow overlaps only when they express construction intent. Examples:

- road and rail may overlap only inside the crossing zone;
- roof may overhang a building foundation;
- tree crown may overlap a path visually if clearance remains, but the trunk may not be planted in a road or farm row;
- train may intersect the portal volume while moving, but must remain inside the opening clearance.

## Clearance formulas

### Platform to vehicle

For a platform on negative Z:

```text
trainNearSide      = railway.centerZ - train.carWidth / 2
platformTrackEdge  = station.positionZ + station.platformWidth / 2
platformGap        = trainNearSide - platformTrackEdge
```

Keep the target gap configurable. For a stylized diorama, approximately 0.08–0.28 scene units often reads as intentional; use the model's real scale when known.

### Portal width

```text
sideClearance = (portalWidth - trainWidth) / 2
roofClearance = portalTop - highestTrainPoint
```

Check the highest animated state, including pantographs, roof equipment, cargo, suspension, and sway.

### Road and garden

Do not validate centers only. Compare road X interval against garden X interval and road Z interval against garden Z interval. The overlap exists only when both axes overlap.

### Fence/track safety

Create a discontinuity around the crossing. A continuous repeating fence that merely passes visually behind the rails will intersect sleepers, ballast, or train clearance from another angle.

## Foundations and assemblies

- A platform is a foundation plus top slab, not a thin floating plane.
- A building either rests on ground, a platform, or explicit piers.
- Roof slopes meet at a ridge; mirrored signs of rotation matter.
- Columns require base plates or believable insertion into their support.
- Tunnel shells need a front portal, internal dark region, and a decision about the back/outer face.

## Orientation and mechanical logic

Audit reference axes explicitly. Do not rely on a shape looking approximately correct from the home view.

- A bicycle wheel plane is vertical; its plane normal/axle is horizontal. Front and rear wheel planes are parallel unless steering is intentionally modeled.
- Rail wheels are vertical and share the axle direction; they contact rail heads at their lowest points.
- Ceiling lights, cameras, sprinklers, and signs face their service/view direction.
- Door and gate rotation axes pass through real hinges/pivots.
- Roof normals point outward; mirrored roof slopes rise toward the same ridge.
- Furniture legs and columns transmit load to the floor/foundation.
- Bottles, boxes, products, and tools rest on supporting surfaces instead of intersecting or floating.

For critical axes, tag the object's local reference vector and expected world vector. Use unsigned comparison when parallel and anti-parallel are physically equivalent.

## Ground and support penetration

For each assembly, compute the world-space bounding box after parent transforms and compare its minimum Y to the support surface.

```text
supportDelta = worldBounds.minY - supportY
supportDelta < -tolerance  → penetrates ground/support
supportDelta > +tolerance  → floating
```

Both are P0 unless intentionally documented. Check the complete assembly and meaningful children: a building foundation may touch ground while its detached porch, wheel, or pipe still penetrates it.

Aggregate bounds are insufficient for multi-leg or multi-wheel assemblies. Declare local `supportContacts` for every meaningful load path—for example four chair legs, two bicycle tire patches, rail-wheel contact points, column base corners, or a cabinet's feet. Transform each contact to world space and compare it with its support plane independently. One correct lowest point must not hide another floating or underground contact.

## Audit coverage gate

An auditor cannot inspect geometry that was never registered. For a highest-quality scene:

1. declare `auditPolicy.minimumTaggedObjectRatio: 1` in scene configuration;
2. list critical `requiredKinds` and support-bearing kinds;
3. tag every eligible live Mesh with `userData.audit`, including `id`, `kind`, support/axis/topology rules and collision class where relevant;
4. allow exclusions only for intentional helpers such as debug volumes, hit targets or particle cards;
5. fail if the runtime summary reports coverage below the configured minimum or any required ID/kind is missing.

Stable assembly-level registration may deliberately supply an inherited coverage tag to descendant meshes, provided the prefab root has a document-owned ID and the runtime audit still applies direct support, topology, axis, or collision tags to critical children. Never walk the scene immediately before validation and assign UUID-derived generic tags to everything: that converts missing instrumentation into a false 100% result. Exclusions such as rain, ripples, debug geometry, and hit targets must be explicit and stable.

Use the coverage summary from [../assets/runtime-scene-audit.template.ts](../assets/runtime-scene-audit.template.ts). Do not exclude a visible modeled roof, wheel, prop, shelf, product, or fixture merely to make the ratio pass.

## Repeated physical audit loop

Run the following after blockout, after assembly/detail placement, after animation setup, and before delivery:

1. update all world matrices;
2. run configuration and runtime geometry audits;
3. inspect home, opposite, end-on, roof-end, underside/low, and interior views;
4. list every unexplained intersection, gap, open surface, wrong axis, and underground part;
5. correct the owning dimension or assembly—not only the visible symptom;
6. repeat the same audit views until no P0/P1 issue remains.

Record the eligible/tagged counts, coverage ratio, missing required tags, OBB fallbacks, support-contact failures and topology issue codes in the QA evidence. A clean screenshot cannot override a failed automated gate.

Adding detail increases collision risk. Re-run the audit after filling shelves, adding wires, placing props, or changing parent transforms.

### Declared collider versus rendered prefab

Validation geometry must contain the rendered physical envelope it claims to represent. For a scaled/rotated multi-part prefab, compute the outer extrema and contacts from the same constants used by rendering, then assert that:

```text
collider.minX/Y/Z <= rendered.minX/Y/Z
collider.maxX/Y/Z >= rendered.maxX/Y/Z
worldTransform(contact.localPoint).Y == supportY ± tolerance
```

This check is separate from collision-pair validation. A small collider can pass every pair simply because the protruding visible wheel, roof edge, basket, sign face, or handle is absent from the declared volume. Put non-trivial subject math—wheel outer radius, instance scale, steering/rotation, roof overhang, open-door extrema—in a pure prefab contract module consumed by both rendering and an active-scene test.

## Configuration ownership

Store global values such as these in one typed config:

```text
base.size, base.surfaceY
railway.visibleLength, gauge, centerZ, trackY
railway.tunnelX, tunnelDepth, portalWidth, portalSideHeight
train.carLength, carWidth, carHeight, wheelRadius, carSpacing
station.position, platformLength, platformWidth, foundationHeight
road.position, width, length, crossingClearance
effects.windDirection, particle counts
```

Arrays should own repeated object anchors: houses, trees, lamps, props, signs, cameras, and collision footprints.

## Project case-study dimensions

These values document one successful stylized railway scene; they are evidence, not universal constants:

```text
base size             27 × 18.5
derived ground top    about 0.81
track center Z        0
track Y               0.86
visible rail length   25.6
tunnel faces          x = ±11.35
tunnel depth          1.7
portal opening        width 4.0, side height 2.1
train car             4.25 × 2.06 × 2.18
car spacing           4.46
station anchor        [-2.2, 0.82, -2.34]
platform              length 10, width 2.35, foundation 0.52
road center X         4.85
road                  width 3.85, length 17.7
road fence gap        3.0 around the crossing
```

The important lesson was not the numbers themselves: every related component derived from them, so changing a tunnel or platform dimension did not silently leave stale geometry elsewhere.
