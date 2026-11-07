# Real-world semantic detailing

Use this when the user prioritizes quality, realism, or “enough detail” for an interior, shop, street, station, machine, vehicle, or other recognizable real-world subject.

For a shop or stocked shelf system, also read [retail-layout-and-merchandising.md](retail-layout-and-merchandising.md) before placing fixtures. Its footprint/circulation gate precedes shelf geometry and product population.

The goal is not maximum object count. The goal is a believable hierarchy of spaces, assemblies, contents, interfaces, utilities, and small evidence that explains how the place or object actually works.

## Quality-first rule

The first plausible render is never final. After each coherent pass:

1. compare the model with real examples of the same subject;
2. identify missing functional zones and assemblies;
3. inspect every hero zone at large, medium, and small scales;
4. check access, gravity, support, orientation, and use sequence;
5. add or correct details;
6. repeat multi-angle QA.

Continue until no P0/P1 physical or semantic-detail defect remains. Do not stop because the page is attractive from one camera.

## Three-scale decomposition

### Large scale: zones and primary objects

These define function and circulation:

- room/area boundaries;
- entrances, exits, windows, loading/service access;
- counters, aisles, large shelving, refrigeration, machinery, vehicles;
- circulation paths, door swings, staff/customer separation;
- ceiling, floor, structural supports, major utilities.

### Medium scale: assemblies and modules

These explain construction and use:

- shelf bays, levels, end caps, kick plates, price rails;
- cabinet doors, handles, hinges, vents, compressors;
- checkout modules, scanners, payment terminals, printers;
- roof sheets, gutters, brackets, downpipes;
- vehicle doors, windows, bogies, lights, couplers;
- machine panels, fastener groups, guards, hoses, controls.

### Small scale: contents and evidence

These create lived-in specificity:

- products, packages, labels, price tags, dividers;
- cups, napkins, bags, baskets, trays, condiment bottles;
- cables, outlets, switches, warning stickers, screws;
- stock gaps, slight rotations, mixed colors, damaged cartons;
- cleaning tools, waste bins, security cameras, fire equipment;
- reflections, seals, seams, edge wear, drainage slots.

A hero zone must contain all three scales. Background zones may simplify small detail but still need correct large/medium structure.

## Semantic inventory before geometry

Create a zone plan with:

```text
zone purpose
primary users
large objects
medium assemblies
small contents
required clearances
power/water/ventilation implications
visibility priority
repetition/instancing strategy
acceptance evidence
```

Use [../assets/semantic-detail-plan.template.json](../assets/semantic-detail-plan.template.json). Adapt categories to the culture, era, brand, building size, and supplied references. Do not copy the example inventory blindly.

The convenience-store requirement IDs are paired with [../assets/qa-views.convenience-store.example.json](../assets/qa-views.convenience-store.example.json). Adapt both together so every evidence view resolves; do not reuse railway-specific view IDs for a shop interior.

## Bind the plan to rendered objects

A written inventory is not implementation evidence. Before a hero zone can pass, convert every large, medium, and small target into a structured requirement containing:

```text
requirement id and semantic label
scale: large | medium | small
minimum rendered count
actual SceneObjectSpec object IDs
minimum distinct categories when relevant
minimum visible variants when repetition is visible
required close/opposite evidence view IDs
```

Each bound scene object records `detailZoneId`, `detailScale`, `semanticCategory`, `quantity`, and `variantCount`. Tag an assembly root only when it counts as one assembly; put the detail tag on the `InstancedMesh` itself when its repeated instances must satisfy `minimumCount`. Prefer actual objects or `InstancedMesh.count`; do not inflate a declared quantity to make an empty scene pass.

Run both levels:

- `scripts/validate_scene.mjs` checks the plan-to-config mapping, counts, categories, variation, evidence IDs, and generic filler labels;
- [../assets/runtime-detail-audit.template.ts](../assets/runtime-detail-audit.template.ts) counts what is actually present in the live Three.js graph and checks tag coverage.

For highest-quality work, all configured objects receive audit metadata, every hero zone has at least one structured requirement at all three scales, and every visible modeled mesh is covered by an inherited runtime detail tag or an explicit justified helper exclusion.

Do not accept exact labels such as `object`, `prop`, `item`, `detail`, `misc`, or `generic` as semantic content. “Shelf object” does not explain whether the object is a drink bottle, snack bag, price rail, divider, cable, or safety device.

## Convenience-store example

### Exterior and entrance

Large:

- façade, glazing, sliding/swing doors, canopy, sign band;
- delivery/service door, outdoor equipment, parking/sidewalk.

Medium:

- door tracks, handles, kick plates, mullions, mats;
- bollards, umbrella rack, bins, parcel/ATM machine where appropriate;
- AC condensers, vents, drainage, conduit, exterior cameras.

Small:

- opening-hours decal, payment stickers, posters, price cards;
- door sensors, anti-theft pedestals, curb markings, ashtray or wet-floor evidence where appropriate.

### Checkout and service counter

Large:

- one or more counters and staff working zone;
- queue approach and customer bagging/payment space.

Medium:

- POS terminal, scanner, payment terminal, cash drawer;
- receipt printer, bag rack, basket stack, under-counter storage;
- hot-food warmer or service display if supported by references.

Small:

- receipt roll, bags, tape, pens, trays, impulse products;
- gum/candy rows, small batteries, lighters or local equivalents;
- staff notices, countertop signs, cables and power outlets.

### Center aisles

Large:

- several gondola shelf runs with believable aisle width and end caps.

Medium:

- typically multiple vertical bays and roughly 4–7 usable levels depending on shelf type and reference;
- top signage, price rails, dividers, kick plates and structural posts.

Small:

- products grouped by category rather than randomized everywhere;
- snacks, confectionery, instant foods, pantry items, household or hygiene goods according to the zone;
- mixed package dimensions, stock depth, front-facing labels, occasional gaps and rotated items.

Turn the reference into measurable targets. For example, if the supplied store visibly has four gondola runs with five usable levels, encode at least four rendered shelf runs, twenty level assemblies, the observed category set, and a reference-appropriate product count. The template's 3–5 runs and 4–7 levels are examples for a small store, not universal constants.

### Refrigerated wall

Large:

- chiller cabinets with doors or open fronts, compressor/base volume and service clearance.

Medium:

- several shelves per bay, door frames/handles, light bars, vents and price rails.

Small:

- drinks grouped by type/brand/color, dairy, prepared meals, desserts or local equivalents;
- shelf labels, dividers, condensation tint, repeated but varied product instances.

### Hot food, coffee, and self-service

Large/medium:

- coffee machine, cup/ice dispenser, hot cabinet, microwave, water boiler, counter and waste opening.

Small:

- cups in sizes, lids, stirrers, sugar/creamer, napkins, condiment bottles, trays, tongs, instruction labels.

### Back room, utilities, and ceiling

Do not model only customer-facing furniture. Include evidence of operation:

- staff/storage door, stock cartons, cleaning storage;
- ceiling grid, light fixtures, cameras, speakers, smoke detector, sprinkler heads;
- vents, AC, cable/conduit routes, electrical panels;
- fire extinguisher and emergency signage where appropriate.

## Placement logic

Ask how a person uses each object:

- Can doors and drawers open?
- Can staff stand behind the counter and reach devices?
- Are aisles wide enough to move through?
- Are products supported by shelves rather than floating or intersecting?
- Are heavy units grounded and ventilated?
- Do wires, drains, and pipes connect plausibly?
- Are signs oriented toward their viewers?
- Are wheels vertical and aligned with axles?

If the answer is unclear, the assembly is not complete.

## Repetition without artificial uniformity

Use instancing for performance, but vary:

- product color/texture index;
- small rotation and depth;
- occupancy and stock gaps;
- scale within a controlled range;
- category distribution by shelf and zone.

Do not fill every shelf with an identical grid of cubes. Repetition should preserve retail/functional organization.

## Detail density and performance

Allocate detail by importance:

- hero: full three-scale structure, layered materials, readable contents;
- midground: full large/medium structure and representative small contents;
- background: silhouette, major modules, restrained repeated contents.

Prefer texture atlases, instances, shared geometry, LOD, and quality-tier switches over omitting semantic categories.

## Detail acceptance

A hero area fails when:

- it contains only the main shell and large furniture;
- shelves have no levels, price rails, contents, or category logic;
- props are generic colored boxes without interfaces;
- operational utilities and access space are absent;
- every repeated item is identical;
- close views reveal empty surfaces where real objects would have seams, controls, hardware, labels, or contents.

A zone also fails when its plan is detailed but its `objectIds` do not exist, quantities exceed rendered instances, categories are generic, repeated families lack declared or visible variation, or required evidence views were never captured.

After adding detail, repeat the physical-intersection and support checks. Increased density raises the probability of collisions and underground placement.
