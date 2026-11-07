# Blockout and asset-resolution pipeline

Use this pipeline for non-trivial multi-object scenes, interiors, streets,
reference reconstructions and explorable dioramas. For local reference work,
start with [reference-first.md](reference-first.md). Macro and semantic proxies
may share one simple scene; stages describe decisions, not mandatory separate
artifacts or user-approval pauses.

## Core principle: search early, instantiate late

When existing assets are allowed and useful, search approved local assets before blockout so proxy dimensions, pivots,
support points and access envelopes reflect what can actually be reused. Do not
load the finished detailed assets into the scene before macro and circulation
layout pass; their visual quality can distract from incorrect spacing and makes
large changes expensive. Skip this search when assets are forbidden or custom
construction is appropriate; never inspect prohibited directories for candidates.

The asset decision made during planning is one of:

- `reuse`: an approved local asset is a close fit;
- `adapt`: an approved asset needs controlled labels, palette, scale or variant
  changes without replacing its part hierarchy;
- `custom`: no suitable approved asset exists, so create a new assembly after
  the proxy passes;
- `defer`: the object is not important enough for the current fidelity tier.

## Stage A — macro blockout

Use the smallest useful primitives:

- boxes for buildings, rooms, platforms, roads and major furniture zones;
- cylinders/capsules for trunks, poles, tanks and broad round masses;
- planes or thin boxes for floors, walls and large boundaries;
- explicit clearance volumes for portals, doors and major circulation.

Prove composition, projection/camera, world scale, ground/height stack, primary
axes, major supports, scene bounds and large negative spaces. Do not add small
props, product rows, material polish or decorative labels.

Macro gate:

- scene silhouette and focal hierarchy match the intended composition;
- major zones fit inside bounds and meet support surfaces;
- primary roads/paths/rooms/entrances are physically possible;
- camera can inspect the scene without hiding a major contradiction.

## Stage B — semantic proxy blockout

Replace anonymous macro masses with stable semantic proxies for medium objects:
shelves, counters, chillers, vending machines, bicycles, benches, machines,
trees, signs and other layout-relevant props. Continue using simple geometry,
but make each proxy a contract rather than a visual guess.

Each proxy records:

```text
stable semantic ID
zone and functional role
candidate local asset ID or custom-model decision
anchor and local forward/up axes
conservative full visual envelope
support surface and bottom/contact points
door/drawer/service/maintenance envelope when applicable
circulation or safety clearance class
fidelity tier and evidence views
```

Use one box/OBB for the cabinet and additional translucent/simple volumes for
operating clearance. A vending machine proxy includes cabinet and ventilation
access; a shelf includes footprint and browsing aisle; a bicycle includes wheel
envelope and steering/basket projection. Do not proxy every bottle, fastener or
cup at this stage. Represent content through density zones and category targets.

Semantic gate:

- all layout-relevant objects have stable IDs and conservative envelopes;
- entrance, aisle, staff/customer, vehicle and maintenance routes remain open;
- support, orientation and object-to-zone relationships are valid;
- a planned final asset cannot be larger than its proxy without reopening the
  layout gate.

## Stage C — layout and physical gate

Run configuration and runtime proxy validation before importing or building
detailed assets:

- bounds, support and complete footprint/OBB collision;
- door, drawer, gate, service and maintenance clearances;
- circulation graph and narrowest usable route;
- camera occlusion and visibility from home/opposite/low views;
- hero/midground/background representation budget;
- renderer budget estimate from chosen asset candidates and repetition counts.

Move proxies and change zone ownership here. Do not solve an invalid plan by
shrinking final models, sinking them, hiding parts or clipping them per camera.

## Stage D — one-to-one asset resolution

After the layout gate passes, replace one proxy family at a time:

1. copy or import the approved asset's minimum dependency closure, or construct
   the custom assembly from the proxy contract;
2. keep the same semantic ID, anchor owner, support surface and intended axes;
3. align the asset pivot to the proxy anchor rather than eyeballing a new world
   position;
4. compare the complete rendered asset bounds with the proxy and collider;
5. preserve door/service/access envelopes;
6. remove the visual proxy only after the resolved asset passes;
7. rerun support/collision/axis checks and affected views before resolving the
   next family.

If the resolved asset exceeds the proxy, update the typed proxy/scene contract
and rerun Stage C. Do not silently scale a bicycle, checkout or appliance to fit
an invalid gap unless the chosen scale remains physically and visually valid.

Track resolution state explicitly:

```text
proxy-only → resolving → resolved → validated
```

Never leave both proxy and detailed asset as unexplained overlapping solids.

## Stage E — detailed contents and look development

Use a simple key/environment light during blockout to judge the masses. After
structural asset families resolve, refine:

- shelf products, small operational contents and fasteners;
- seams, handles, controls, cables, drainage and decals;
- material channels, wetness, glass layers and localized weathering;
- practical lights, reflections, post-processing and motion effects.

Small contents still inherit support/category/density contracts. Detailed assets
do not waive circulation, grounding, collision or performance gates.

## Why both scales of blockout matter

Macro blockout catches composition and large spatial mistakes. Semantic proxies
catch functional mistakes that a building-sized box cannot reveal: blocked
entrances, impossible aisle width, door travel, ventilation, bicycle overhang,
checkout queue and maintenance access. Final assets then inherit a verified
place instead of forcing layout changes after expensive modeling.
