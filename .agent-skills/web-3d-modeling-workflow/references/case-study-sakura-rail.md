# Case study: Sakura rail diorama

Read this only when learning from or extending the original railway project. It records what was actually built and why.

## Architecture

```text
app/components/DioramaExperience.tsx  canvas, renderer settings, UI, camera state
app/diorama/sceneConfig.ts            typed dimensions and object anchors
app/diorama/sceneValidation.ts        deterministic physical checks
app/diorama/WorldPrimitives.tsx       base, track, tunnels, station, village
app/diorama/AnimatedSystems.tsx       train, crossing, petals, wind, cameras
app/diorama/DetailProps.tsx           reusable bench, vending, bike, lamp, drains
DIORAMA_WORKFLOW.md                   project-local workflow
```

## Final coordinate ownership

The project converged on:

```text
base                       27 × 18.5
railway                    X axis, center Z = 0
track Y                    0.86
visible rail length        25.6
portal faces               X = ±11.35
tunnel depth               1.7
portal opening             width 4.0, side height 2.1
train                      3 cars
car size                   4.25 × 2.06 × 2.18
wheel radius               0.32
car spacing                4.46
hidden loop distance       14.2
station anchor             [-2.2, 0.82, -2.34]
platform                   10 × 2.35, foundation 0.52
road center X              4.85
road                       width 3.85, length 17.7
crossing/fence clearance   3.0
```

Houses were moved down to derived ground contact. Trees around the farm were moved so trunks no longer occupied crop rows. Left-side crowns were moved away from roofs. The farm was shifted and resized to clear the road. Guardrails were split into two spans around the crossing.

## Reusable assets produced

### Typed configuration

Global dimensions, object arrays, effects, quality counts, and mood palettes moved into `sceneConfig.ts`. This eliminated coordinate drift between rail, portals, station, train, road, and camera.

### Configuration validator

`sceneValidation.ts` checks:

- rail and tunnel bounds;
- road bounds;
- platform-to-train clearance;
- platform grounding;
- portal side and roof clearance;
- guardrail/track clearance.

The generic version is included in this Skill.

### Detail component library

`DetailProps.tsx` introduced reusable patterns:

- rod between two 3D points;
- slatted wood/metal bench;
- product-filled vending machine;
- bicycle frame;
- roof gutters, brackets, and downpipes;
- instanced tactile studs;
- road lamps with night lights.

The generic subset is included in `assets/detail-primitives.template.tsx`.

### Multi-view QA

The scene was repeatedly checked from home, opposite, both portal exteriors, end-on, rear, and night vehicle-front views. The QA manifest in this Skill formalizes those views.

## Detail implementation

- Train: layered side/cab glass, frames, reflection streaks, interior silhouettes, doors, route signs, body stripes, bogies, wheels, underfloor equipment, gangways, roof equipment, pantograph, headlights, and tail lights.
- Station: foundation panels, tiled slab, tactile strip/studs, columns/base plates, pale ribbed canopy, beams, gutters, downpipes, lamps, station sign, timetable, bulletin board, detailed benches, vending machine, bicycle, bins, planters, steps, and drainage grate.
- Railway: ballast layers, sleepers, rails/heads, instanced fasteners, scattered stones, cable troughs, equipment cabinets, speed sign, catenary poles and lines.
- Landscape: grounded houses with gabled roofs and layered windows, farm rows/fence, shrubs, split road fence, road lamps, cherry trees.
- Effects: instanced petals, seeded crown sway, synchronized wind direction, position-driven crossing gates.

## Visibility solution

The final tunnel solution combined:

1. extruded hill geometry with an arch hole;
2. dark lining and arch-shaped curtain;
3. stone front/back portal frames;
4. a straight visible train corridor and abstract hidden return distance;
5. two world-space clipping planes applied to every train material and shadow.

This was necessary because a dark plane alone failed from the outer portal view.

## Lighting solution

Three moods were implemented: day, golden hour, and night. Night combines cool environment light, station ceiling lights, road lamps, vending/sign lights, house windows/porch lamps, train interior layers, localized headlight lenses, forward spotlights, visible cone meshes, and surface light pools.

The high preset increases DPR, shadow map resolution, fasteners, ballast, tactile studs, roof ribs, reflections, product rows, and other small geometry. The low preset preserves core shadows and all visibility rules.

## Verification performed

- TypeScript type checking;
- production build;
- complete train loop;
- portal entry sequence frame-by-frame;
- external portal views in day and night;
- high/low shadow comparison while paused;
- day/golden/night switching;
- multi-direction orbit checks for houses, farm, foundations, fences, roofs, and tunnel backs;
- production-page regression after development QA.
