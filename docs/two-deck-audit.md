# Two-deck fault audit (concept, not fabrication)

This review addresses the short upper feed conveyor added to the inclined receiving belt. The upper conveyor is a **separate study**, not a second application of the plant's 200 kW / 246 m reference specification.

## Defects found and corrected

- The initial belt-end rings lay in the wrong plane (YZ despite Z-axis drum shafts). Replaced with semicircular XY belt wraps; test checks wrap span across Z and along X.
- The upper frame's short feet stopped above the floor. Four individually named posts now terminate at the same world floor elevation near Y = 0.11 m, outside the receiving belt truss; test checks the footprint in world coordinates.
- The feeder shaft key originally protruded into the belt wrap. Moved the illustrative key to the outboard shaft end; bearing seal rings now align with the Z-axis shafts.
- Jam/power cut stopped upper feed markers but left the receiving-chute pour visibly active. Flow now stops on source interruption; loaded material already on the receiving belt can continue downstream while the feed gap propagates. Tests cover source stoppage and restart.
- A feeder animation API could still rotate when given a different travel value while stalled. It now retains the last travel until released; test exercises this explicitly.

## Remaining boundaries

The second conveyor drive, hopper, tension calculations, rated carrying capacity, real level/jam/slip detectors, interlocks and fatigue/structural design are **not established**. A 20% slip switch is an illustrative belt-speed mismatch, not an estimate of field slip or braking performance. Floor posts and guardrail are visual studies, not checked for loading or access codes. Axis-aligned bounding checks and headless kinematics tests are not equivalent to a collision-free CAD review or a real-browser visual inspection.
