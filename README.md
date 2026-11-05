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

The viewer itself needs no npm packages. The test-only dependencies build the complete Three.js scene without WebGL and check 12 part bounds and three motion poses (drive, lock and runback). The Pages workflow validates these checks before deploying. See [drive dimensions and ratios](docs/drive-dimensions.md), [component audit](docs/component-audit.md) , [catalog service audit](docs/drive-catalog-audit.md) and [dimensional reference audit](docs/reference-audit.md) for what was checked and what remains unresolved.

## Single conveyor and educational fault studies

The viewer depicts **one inclined conveyor**. Its existing transfer chute suggests an incoming material stream, but no separate upper conveyor is modeled: there is no original equipment drawing or specification to justify one. The gravity panel offers an illustrative carrying-idler jam (one roller stalls while the belt moves), a 20% head-drum slip comparison, and the power-cut/backstop study. These are not calibrated detectors or certified interlocks. Each part card distinguishes the visible model from plant-reference values; missing reference data is marked unspecified.

## Scope and limitations

The removable coupling/V-belt mesh guards and tail screw take-up are **illustrative only**; no access-distance, strength, tensioning or maintenance procedure is validated. The 3D study is **not a production design, calibrated instrument or safety control**. Plant reference figures (for example Ø800 mm drum and 246 m conveyor) are not all the dimensions of the shortened 3D model (Ø484 mm visible drum). Rated torque, fatigue, guards, tolerances, real-world load paths, dust/thermal duty and collision clearances need engineering validation. Do not fabricate, operate or approve equipment based on this visualization.
