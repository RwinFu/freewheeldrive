# Reference-image concretization

Use these analysis dimensions whenever imagery defines the scene. For local reference reconstruction, [reference-first.md](reference-first.md) defines the compact artifact and reading route. The full machine-readable schema below applies to reusable systems, explicit audits or project tooling that requires it; do not impose a schema migration on every one-off scene.

## Why this exists

Starting from a short visual impression causes two expensive failures: major objects are discovered late, and small details are added without the assemblies that support them. A structured analysis establishes spatial ownership, real-world part grammar, materials, colors, support relations, unknowns, and QA risks before coordinates spread through scene code.

The analysis is a hypothesis, not ground truth. Keep three states distinct:

- `visible`: directly supported by image pixels;
- `inferred`: plausible from real-world construction but not fully visible;
- `unknown`: unresolved and capable of changing the model.

Never promote an inference to a visible fact merely to make the inventory look complete.

## Four analysis dimensions

### Pass A — composition and spatial frame

Record:

- image dimensions and crop;
- likely projection, azimuth, elevation, focal target, and depth compression;
- base silhouette and normalized screen-space bounds;
- world-up and candidate primary axes;
- foreground, hero, secondary, background, and negative-space layers;
- at least two scale anchors or ratios where the image permits them.

For a single image, keep hidden depth and rear construction in `unknowns`. For multiple images, bind observations to stable object IDs rather than creating a new object per view.

### Pass B — zones and complete object inventory

Sweep the image systematically from large to small and from top-left to bottom-right. Divide it into semantic zones, then enumerate:

1. large masses and circulation surfaces;
2. medium assemblies and repeated modules;
3. small contents, interfaces, hardware, labels, fasteners, wear, and lived-in evidence.

Do not use “miscellaneous props” or “and so on.” Consolidate repeated objects into one family only when their construction grammar is actually shared. Record visible count, repetition pattern, variation, zone, normalized evidence region, confidence, and importance.

### Pass C — assembly, color, material, and light

For every hero object, identify meaningful parts. A lit apartment window, for example, may require recess/interior, frame, mullions, glass, curtain or blinds, sill, warm emissive source, and reflected highlight. A rooftop tank requires tank shell, seams, cap, pipe or outlet, support frame, braces, and roof contact.

Record colors as approximate sRGB hex values plus usage and lighting context. A sampled dark blue window under night lighting is not automatically blue glass. Separate:

- intrinsic base-color hypothesis;
- direct light color and intensity relationship;
- reflected/environment color;
- wetness, dirt, aging, roughness variation, and edge response.

Material entries should contain plausible PBR ranges instead of one falsely precise number. Use `confidence` and evidence notes for every material hypothesis.

### Pass D — physical logic and risk seeding

For every large or hero assembly, answer:

- what supports its weight;
- what it attaches to;
- which direction it faces, drains, opens, rolls, or rotates;
- what clearance a person, vehicle, door, fan, pipe, or mechanism requires;
- which parts must be closed volumes;
- which contacts, axes, intersections, and views are failure-prone.

Turn these into initial relationships and QA risks. The reference analysis must seed later collision, support, topology, material, detail-density, lighting, and camera checks.

## Artifact contract

When the full schema is selected, copy [../assets/reference-analysis.template.json](../assets/reference-analysis.template.json). Keep these sections. Compact local analysis may combine the four dimensions in one existing document; validate its concrete content without running a strict validator for a different schema:

- `sourceImages`: exact file/URL identity and image role;
- `coordinateHypothesis` and `composition`: camera and spatial reading;
- `palette` and `materials`: reusable color/material hypotheses;
- `zones`: functional regions and three-scale density expectations;
- `objects`: stable semantic inventory and construction requirements;
- `relationships`: support, attachment, clearance, adjacency, containment, and alignment;
- `unknowns`: unresolved hidden-space or material decisions;
- `modelingPriorities`: ordered blockout-to-detail route;
- `qaSeed`: risk-derived views and state requirements;
- `coverage`: evidence that the whole image was swept rather than only the focal object.

Evidence regions use normalized image coordinates `[x, y, width, height]` in the range `0..1`, measured from the top-left. They are approximate localization aids, not segmentation masks.

Run:

```bash
node scripts/validate_reference_analysis.mjs reference-analysis.json --strict
```

Strict mode requires material, support/orientation, part, evidence, risk, zone-density, relationship, and image-coverage information for hero content. A syntactically valid but vague inventory must fail.

## Converting analysis into construction

Before modeling:

1. map zones and large objects into typed scene configuration;
2. convert object assembly parts into prefab/component boundaries;
3. convert repeated patterns into instances or parameterized generators;
4. map materials into shared tokens with high/low quality behavior;
5. map support and clearance relationships into collision/support contracts;
6. map `qaSeed` into deterministic QA cameras;
7. map unresolved `unknowns` into conservative geometry choices or explicit review tasks.

Do not copy all image details at equal fidelity. Spend geometry and shading budget according to focal importance, screen-space visibility, repetition benefit, animation relevance, and physical risk.

## Worked example

[../assets/reference-analysis.apartment-diorama.example.json](../assets/reference-analysis.apartment-diorama.example.json) demonstrates this contract for a night apartment-building diorama: concrete building mass, layered windows, balconies and planters, air conditioners, drainpipes, rooftop service room and water tank, wet asphalt, curb drainage, bicycles, cars, lamps, perimeter planting, and warm/cool lighting contrast.
