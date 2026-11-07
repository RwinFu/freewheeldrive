# Rain and water-surface interaction

Use this reference when visible rain is expected to create puddle rings, crowns,
splashes, roof runoff or other surface reactions. Do not call an unrelated loop
“physical interaction.”

## Failure pattern

A common shortcut renders one global rain field and a second independent puddle
animation. The puddle effect repeats at the water center with its own timer. It
looks rigid because no visible drop owns the impact position or birth time. More
rain merely repeats the same central response.

This is the current limitation of the deferred Hikari Mart rain system: its
global rain curtain and puddle impacts are visually separate systems. Earlier
work improved footprint distribution and roof-drip pairing, but ordinary puddle
impacts still are not emitted from the actual global drop that crossed the water
surface.

## Required state relationship

An impact event needs at least:

```text
sourceDropId or paired emitter ID
surface/puddle ID
world impact X/Z
surface Y
crossing time or simulation frame
incoming speed/direction
impact intensity/lifetime
```

Trigger the event when a source drop crosses the owning surface height inside
the surface footprint. The ring/crown then expands and fades from that exact X/Z
and event time. It must not snap to the puddle center.

## Scalable implementation routes

### Hero-droplet collision

Use real droplet state for visible foreground/roof drops. On each update, test
the segment from previous to current position against candidate horizontal water
surfaces. Emit once on a downward crossing inside the footprint, recycle the
drop, and advance a bounded impact-event pool.

### Paired proxy emitters

For dense rain, simulating every streak against every puddle is unnecessary.
Select a smaller set of hero/impact drops. Derive each falling drop and its impact
from the same seed, X/Z, phase and speed. The impact begins exactly when the
paired drop reaches `surfaceY`. Background streaks may remain visual-only, but
they must not be presented as the source of a mismatched central splash.

### Shader-only aggregate rain

When no one-to-one droplets are visible, use a spatially varied stochastic ripple
field and describe it as an aggregate approximation. Keep event density tied to
rain intensity and distribute births inside the water mask. Do not combine large
legible falling drops with unrelated center-loop impacts.

## Footprints and surfaces

- bind each event to the actual road, sidewalk, roof or puddle support Y;
- sample only inside the owning irregular footprint/mask;
- preserve the event X/Z through ring and crown lifetime;
- use anisotropic ring scale only when the puddle/camera projection justifies it;
- do not let effects run below ground, above the water plane or outside the
  visible wet region;
- pool events and cap active counts instead of allocating meshes per impact.

## Validation

Persist at least two close captures or a short sequence showing:

1. a named drop above the surface;
2. the same drop crossing at the recorded X/Z;
3. a ring/crown born at that X/Z immediately after crossing;
4. a different drop producing a different site;
5. no center splash when no source/aggregate event was emitted.

Also test high/low rain density, pause/resume, camera rotation, puddle boundaries
and event-pool reuse. A visually plausible ring does not pass when its source,
position and timing cannot be traced.
