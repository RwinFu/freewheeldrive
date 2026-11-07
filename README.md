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

- Drag: orbit; Shift-drag: pan; wheel/pinch: zoom; click a part: inspect. The **HERO** view applies a deliberate 30° three-quarter product-camera preset; Front/Top/ISO restore the 37° lens. This is presentation only, not evidence of equipment identity.
- Space: play/pause; `I`: internal inspection; `L`: labels; `G`: show/hide concept drive guards; `X`: explode; `H`: fit; `R`: reset; `1`–`3`: display styles.
- Use the **Belt alignment · simulation** panel in the 3D viewport to demonstrate centered, warning and tripped conditions. The carrying belt shifts sideways, switch levers/lamps respond, and a latched trip pauses only the on-screen animation. The instrument dialog exposes separate carrying/return displacements, power loss and reset. This is **not** a real safety interlock.
- Use **Export GLB** for a static mesh snapshot (not parametric CAD) and PNG for a view image.

## Verification

```sh
npm ci
npm test
```

The viewer itself needs no npm packages and continues to ship embedded Three.js r128. Test-only dependencies construct the scene without WebGL using both r128 and a parallel r186 alias, checking 12 part bounds, drive/lock/runback poses, all 12 overview/detail inspection views, service features, desktop/mobile camera projection of their focus bounds, coupling wheel visibility and material restoration after inspection. This is not a browser migration or visual sign-off. The Pages workflow validates these checks before deploying. See [realism and evidence verification](docs/realism-verification.md), [connection audit](docs/connection-audit.md), [real-product comparison](docs/comparable-drive-review.md), [toolchain audit](docs/toolchain-audit.md), [real-machine gap assessment](docs/real-machine-gap.md), [drive dimensions and ratios](docs/drive-dimensions.md), [component audit](docs/component-audit.md), [catalog service audit](docs/drive-catalog-audit.md) and [dimensional reference audit](docs/reference-audit.md) for what was checked and what remains unresolved.

## Code Cinema film (concept only)

A [7.2-second browser-rendered film with synthetic sound](films/clinker-drive/clinker-drive-concept.mp4)
shows the actual viewer-exported mesh in three shots. The numerical captions
come from the viewer's `FreewheelDriveSpec`, not invented gearing: the shown
model is ≈4.008:1 while the ideal plant reference is ≈32.78:1, leaving an
unresolved ≈8.18× factor. It is **not as-built footage**. The film's source,
GLB re-export steps, local third-party kit prerequisites and video checks are
in [films/clinker-drive/README.md](films/clinker-drive/README.md). The viewer
itself remains an offline, dependency-free r128 page.

## Single conveyor and educational fault studies

The viewer depicts **one inclined conveyor**. Its existing transfer chute suggests an incoming material stream, but no separate upper conveyor is modeled: there is no original equipment drawing or specification to justify one. The gravity panel offers an illustrative carrying-idler jam (one roller stalls while the belt moves), a 20% head-drum slip comparison, and the power-cut/backstop study. These are not calibrated detectors or certified interlocks. Each part card distinguishes the visible model from plant-reference values; missing reference data is marked unspecified.

## Scope and limitations

The removable coupling/V-belt mesh guards and tail screw take-up are **illustrative only**; no access-distance, strength, tensioning or maintenance procedure is validated. The 3D study is **not a production design, calibrated instrument or safety control**. Plant reference figures (for example Ø800 mm drum and 246 m conveyor) are not all the dimensions of the shortened 3D model (Ø484 mm visible drum). Rated torque, fatigue, guards, tolerances, real-world load paths, dust/thermal duty and collision clearances need engineering validation. Do not fabricate, operate or approve equipment based on this visualization.
