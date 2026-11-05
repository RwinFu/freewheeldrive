# Freewheel Drive

Offline bilingual (English/Persian) interactive Three.js **concept visualization** of a cement-plant clinker belt drive. It includes a motor, fluid coupling, right-angle gearbox, V-belts, head drum, inclined conveyor and roller-ramp backstop, plus educational belt-scale and sway-switch simulations.

**Published site:** https://rwinfu.github.io/freewheeldrive/

## Run locally

No build tools or network access are needed for the viewer. Open `index.html` or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`. The self-contained viewer is `freewheel-detailed.html`; `index.html` redirects to it.

## Controls

- Drag: orbit; Shift-drag: pan; wheel/pinch: zoom; click a part: inspect.
- Space: play/pause; `I`: internal inspection; `L`: labels; `G`: show/hide concept drive guards; `X`: explode; `H`: fit; `R`: reset; `1`–`3`: display styles.
- Use the **Belt alignment · simulation** panel in the 3D viewport to demonstrate centered, warning and tripped conditions. The carrying belt shifts sideways, switch levers/lamps respond, and a latched trip pauses only the on-screen animation. The instrument dialog exposes separate carrying/return displacements, power loss and reset. This is **not** a real safety interlock.
- Use **Export GLB** for a static mesh snapshot (not parametric CAD) and PNG for a view image.

## Verification

```sh
npm ci
npm test
```

The viewer itself needs no npm packages. The test-only dependencies build the complete Three.js scene without WebGL and check 13 part bounds and three motion poses (drive, lock and runback). The Pages workflow validates these checks before deploying. See [drive dimensions and ratios](docs/drive-dimensions.md), [component audit](docs/component-audit.md) and [dimensional reference audit](docs/reference-audit.md) for what was checked and what remains unresolved.

## Two-deck concept and fault studies

An independently represented **upper short feed deck** discharges through an enclosed transfer duct into the existing inclined receiving conveyor. The feeder is a selectable/explodable component with distinct drums, shaft seal/grease-point studies, frame, guardrailed access platform and animated feed markers. Its geometry is an illustrative layout: no second motor, sizing, capacity, real controls, stopping-distance calculation, or verified structural clearances are implied. The receiving conveyor remains the only plant-duty reference train.

The gravity panel exposes educational **feeder/idler jam** (the upper feed markers and one receiving idler stop), **20% belt slip** (belt travel and idler/tail motion decouple from head-drum rotation), and the existing **power-cut/backstop** demonstration. Pausing animation is not a model of braking. There is no real jam/slip detector or certified interlock. In the selected-part card, every part has separate "visible model" and "plant reference" rows, using "not specified" where reference data is missing.

## Scope and limitations

The removable coupling/V-belt mesh guards and tail screw take-up are **illustrative only**; no access-distance, strength, tensioning or maintenance procedure is validated. The 3D study is **not a production design, calibrated instrument or safety control**. Plant reference figures (for example Ø800 mm drum and 246 m conveyor) are not all the dimensions of the shortened 3D model (Ø484 mm visible drum). Rated torque, fatigue, guards, tolerances, real-world load paths, dust/thermal duty and collision clearances need engineering validation. Do not fabricate, operate or approve equipment based on this visualization.
