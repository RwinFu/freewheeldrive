# Detail and material patterns

Use part boundaries and layered materials to create realism at modest polygon counts. The reference quality in a stylized diorama came more from assembly logic and controlled highlights than from photoreal textures.

For a detailed real-world environment, these construction patterns are necessary but not sufficient. First create the zone/content inventory in [real-world-detailing.md](real-world-detailing.md), then use these patterns to build its large, medium, and small elements.

For complete PBR channel contracts, wet/rusted/weathered layering, decals, indirect light, post-processing and texture/performance budgets, also read [look-development-and-performance.md](look-development-and-performance.md). This file defines construction patterns; it does not replace the look-development and measured optimization pass.

Quality-first work must survive close and opposite views. Repeat closure, support, orientation, and intersection checks after adding each detail family; dense detail that penetrates shelves, floors, roofs, or neighboring props is not higher quality.

Tag a rendered assembly root when it counts as one assembly, and tag the `InstancedMesh` itself when repeated instances must satisfy a numeric target. Descendant meshes inherit an assembly-root tag for coverage, but a wrapper group still contributes only one semantic object. Run [../assets/runtime-detail-audit.template.ts](../assets/runtime-detail-audit.template.ts) and use actual `InstancedMesh.count` where possible; a large number written in configuration is not evidence that products, fasteners or studs were rendered.

## Layered glass

A credible window needs at least four layers ordered toward the viewer:

1. recess/interior color or simplified cabin/interior;
2. passenger, seat, curtain, or room silhouette when visible;
3. transparent glass pane;
4. gasket/frame bars and one or two reflection streaks.

Avoid placing the interior plane behind the solid front face of a full box frame. Compare exact Z offsets. A common failure was a bright interior that remained invisible because the frame box front face sat 0.001 units closer to the camera.

Recommended stylized starting points:

```text
glass roughness          0.06–0.16
glass opacity            0.45–0.72
clearcoat                0.7–1.0
clearcoat roughness      0.05–0.14
reflection opacity       0.22–0.52
gasket metalness         0.3–0.55
```

Night interiors can use an unlit/basic warm layer behind the glass while the glass remains transparent. Do not turn the whole body panel emissive.

## Doors

Build a door from:

- outer recess/frame;
- left/right panels or main slab;
- framed glass opening;
- central seam;
- handle, control button, warning label;
- sill or step.

The glass uses the same layer ordering as a window. A single colored rectangle is insufficient at close range.

## Vehicle body

Separate:

- rounded shell;
- roof cap and equipment;
- colored belt lines;
- side panels and ribs;
- framed windows and doors;
- bogies, axles, wheels, hubs, and springs;
- underfloor equipment;
- gangways/couplers;
- cab face, windshield, wipers, route sign, headlights, and tail lights.

Wheel height is a geometric constraint. The wheel contact point should meet the rail top rather than intersecting it by a visible fraction of the radius.

## Headlights

Treat the system as independent layers:

1. dark metal bezel/ring;
2. bright lens using an exposure-independent emissive or basic material;
3. transparent additive halo;
4. forward spotlight that illuminates surfaces;
5. optional subtle cone mesh and elongated ground/rail pool when the style calls for visible beams.

Aim spotlights using a real target object that moves with the vehicle. Keep beams in the train subtree so tunnel clipping also clips beam meshes. Verify that the cab windshield or body panel does not become the brightest emitter.

## Bench

Use separate wood slats with gaps, color variation, metal legs, braces, back supports, and armrests. A few large boxes read as a block, not a manufactured seat. Small-radius rounded boxes are effective for stylized wood.

## Vending machine

Useful part hierarchy:

- cabinet shell;
- branded header light;
- recessed product display;
- rows of cans/bottles;
- glass cover and mullions;
- price/selection controls;
- payment screen, coin/bill slots;
- retrieval recess and flap;
- lower vents and feet;
- localized night light.

The product rows make the prop legible even at medium distance. Use instances if the inventory is large.

## Laundromats and open shopfronts

A laundromat front is a transparent assembly backed by a real room, not a cyan opaque panel. Include:

- recessed slab, side/rear walls and ceiling so no camera can see through the building shell;
- glass doors/panes, mullions, gaskets, handles, sill and believable transparency/reflection ordering;
- washer/dryer cabinets with drums, doors, hinges, control panels, coin/payment points, vents and service gaps;
- visible hoses, drains, electrical conduit, detergent/storage, bins, signs and a maintainable circulation aisle;
- localized interior fixtures and cool light that illuminates room surfaces without making the glass itself opaque or uniformly emissive.

An open ramen or small-food shop needs real left/rear walls and a continuous interior volume even when two façades are open. Model the counter and kick plate, stools and foot rails, menu/signage, prep surface, shelves, cookware/utensils, refrigerator/storage, extraction/utility evidence, floor/ceiling finishes and the vending machine beside the entrance. The open façades may reveal the room; they must not reveal the road, bridge or sky through missing walls. At upper-floor lit windows, include at least a sill-depth room, wall/ceiling planes, curtain or furnishing silhouettes, balcony/rail support and a localized practical light.

Validate these interiors from the canonical view, a grazing side view and the opposite/rear view with Bloom disabled. Transparent glass that merely hides an empty or intersecting room is not complete.

## Station canopy

Build:

- foundation and platform slab;
- columns with base plates;
- longitudinal beams and braces;
- corrugated or ribbed roof sheets;
- fascia and gutters;
- gutter brackets and downpipes;
- underside fixtures;
- ceiling lights;
- tactile edge strip and studs;
- drainage grate.

Mirroring the reference often requires a pale roof surface with darker structural edges rather than one monolithic colored slab.

## Signs and notice boards

Use CanvasTexture or equivalent for readable labels. Set the texture color space correctly. Build physical frames, posts, panel depth, and optionally emissive backing at night.

Do not use text as a substitute for structure: the sign still needs thickness, supports, fasteners, and placement clearance.

## Railway details

A convincing track stack includes:

- ballast bed and shoulder;
- sleepers perpendicular to travel;
- rails and rail heads;
- base plates and fasteners;
- scattered ballast stones;
- cable troughs and trackside cabinets;
- contact poles, arms, insulators, messenger/contact lines;
- crossing deck with rail flangeway gaps.

Instance repeated stones, fasteners, and studs. Do not give every instance React state.

## Houses and landscape props

- Ground the wall shell or add a foundation.
- Construct a gabled roof from an actual ridge profile; do not overlap two panels with reversed slopes.
- Layer window light, glass, mullions, and reflection.
- Keep door handles, porch lamps, eaves, and sills small but visible.
- Separate tree trunk clearance from crown clearance.
- Give farms an explicit soil footprint and fence envelope.
- Tag solid roofs for closed-boundary auditing and inspect both gable ends and the underside.
- Tag bicycle and vehicle wheel plane normals so horizontal wheels or misaligned axles fail automatically.

## Interior and shelf contents

- Construct shelves as bays, posts, levels, price rails, dividers, kick plates, and end caps—not one block.
- Place contents by functional category and zone.
- Use several package families with controlled size, depth, color, and occupancy variation.
- Leave plausible access space for people, doors, drawers, service panels, and equipment ventilation.
- Include operational evidence: outlets, conduit, cameras, fire equipment, cleaning/storage, labels, bins, and utilities where appropriate.
- Assign hero, midground, and background fidelity rather than using uniform sparse detail everywhere.

## Material response

Use roughness and metalness to distinguish material identity:

- painted metal: moderate metalness, medium roughness, crisp highlights;
- bare rail/fastener metal: high metalness, lower roughness;
- wood: non-metallic, directional color variation, medium-high roughness;
- concrete/plaster: non-metallic, high roughness;
- glass: low roughness, transparent, clearcoat/highlight layer;
- foliage/soil: non-metallic, very high roughness.

Avoid setting every surface to high roughness. Without differentiated highlights, the entire scene reads as rough plastic.

Judge material response first with Bloom, LUT and depth of field disabled. A surface that reads correctly only after heavy grading is not a finished material. After the base response passes, enable the full look stack and verify that localized wet highlights, interior glass layers and rust/dirt separation remain visible rather than being clipped or blurred away.
