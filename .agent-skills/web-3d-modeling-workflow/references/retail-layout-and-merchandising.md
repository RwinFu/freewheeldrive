# Retail layout and merchandising gate

Use this reference before modeling or placing shelves, counters, chillers,
freezers, magazine racks or service fixtures in a shop. A detailed asset does not
make a valid store when its footprint blocks circulation.

## 1. Pass a floor-plan gate before fixture geometry

Create a top-down plan with real or explicitly stylized scale. Record:

- exterior shell and usable interior polygon;
- entrance vestibule, complete door travel and anti-theft-gate envelope;
- customer entry/exit paths, primary aisle graph and turning zones;
- checkout queue, payment/bagging area and staff-side work path;
- refrigeration, hot-food, magazine, dry-goods and backroom zones;
- every fixture's full footprint, overhang, drawer/door/service envelope and
  ventilation access;
- required clear widths derived from the reference, project scale and intended
  users rather than one universal number.

Represent every fixture first as a semantic proxy using the dimensions and
access envelope of its approved local asset candidate when one exists. Import
the detailed shelf, chiller, checkout or rack only after this plan passes.

Use footprints/OBBs, not anchors. Fail the plan when a shelf or island overlaps
the entrance clear zone, forces an immediate sharp turn, blocks the checkout
approach, closes the only staff route or removes service access. Approve the
layout before stocking products or polishing materials.

The typed plan should be able to answer:

```text
which fixtures intersect each circulation segment?
what is the narrowest usable aisle?
can both door leaves and EAS gates operate?
can staff reach checkout, chiller and backroom?
which QA view proves each high-risk route?
```

## 2. Bind products to shelf support

For each shelf deck, define a real top surface and usable X/Z interval. Every
product instance declares the supporting deck ID or derives from that deck's
local frame.

```text
productBottomY = shelfTopY ± contactTolerance
product footprint stays inside usable shelf depth
back-stock rows remain supported, not hidden inside the rear panel
```

Check all product bottoms, not the group origin or one lowest item. Small visible
gaps are a P0 support defect when they make stock float above the shelf.

## 3. Use category-appropriate silhouette families

Do not satisfy product detail with one repeated cylinder. Build a small reusable
grammar and assign it by merchandise category:

- bottles and cans for drinks;
- cartons and gable-top packs for milk/juice;
- pillow pouches and gusseted bags for snacks;
- rectangular boxes for medicine, household goods and packaged food;
- cups/bowls with lids for noodles, desserts and hot food;
- trays/clamshells for prepared meals;
- jars/tubs for pantry goods;
- hanging/blister packs where peg display is appropriate.

Hero shelf zones should expose several materially different silhouettes. Derive
their proportions and frequency from the reference and store category; do not
randomize every shelf uniformly. Catalog only one or two useful parametric
archetypes, not every color/label variation.

## 4. Plan occupancy and spacing by category

Store shelves are not equally sparse. Encode occupancy profiles per shelf or
category:

- high-density facings for drinks, snacks and daily goods;
- moderate gaps, mixed depth and occasional stock-outs for ordinary retail;
- intentionally sparse spacing only for premium display, figurines, electronics
  or a reference that supports it;
- multiple front facings and some back-stock depth where visible;
- controlled color/height rhythm without an identical grid on every level.

Measure usable shelf width, occupied width, facing count, depth rows and gap
distribution. A scene fails when every shelf uses the same large gaps or when a
declared high product count is visually carried by a few widely separated forms.

## 5. Acceptance

Before approving a retail interior, verify:

- entrance and staff/customer circulation pass the top-down footprint gate;
- all shelf, checkout, chiller and service units meet the floor;
- every visible product meets a named shelf/support surface;
- package silhouettes and density profiles differ by category;
- the close view shows facings, depth, labels/price rails, occasional gaps and
  no repeated-cylinder monoculture;
- an opposite or cutaway view confirms the layout instead of hiding it behind the
  facade.

The Hikari Mart shelf system that motivated this gate remains deferred: its two
front islands can obstruct arrival, some stock floats, cylinders dominate and
the shelf spacing is uniformly sparse. Those are both execution defects and
evidence that the earlier Skill lacked a sufficiently explicit pre-model retail
layout/product-support gate.
