# Body coverage

`getJscadModelForFootprint(name)` accepts every footprinter name, builds
whatever the dispatch in `lib/Footprinter3d.tsx` has a `case` for, and returns
**cleanly with `geometries: []`** for the rest. Nothing throws.

In a viewer that reads as "this part is not drawn", which is cosmetic. It stops
being cosmetic as soon as something *measures* the result: `core`'s
`measureFootprinterBody` feeds `create-fdm-enclosure`, which cannot tell whether
a screw boss runs through a part that has no height. It reports
`component_bounds_unknown` rather than guessing — so the gap is visible rather
than dangerous, but the clearance check simply does not run.

The packages that were missing are not a random tail: the SOT and TO families,
electrolytics, potentiometers, switches and connectors — the tall parts an
enclosure exists to clear.

## What is in here

| File | What it is |
| --- | --- |
| `footprint-probes.ts` | the ledger: `NO_BODY`, `PROBE`, `MISSING_BODIES` |
| `registry-coverage.test.ts` | walks footprinter's **own registry**, so it cannot drift as footprints are added |
| `<name>.test.ts` + `__snapshots__/<name>[-underside].snap.png` | two poppygl renders per gap: from above, and from under the board |

`registry-coverage.test.ts` puts every registered name in exactly one bucket and
fails if a name is in the wrong one — including a gap that has been **closed**
but left in `MISSING_BODIES`. The ledger cannot go stale in either direction.

## The snapshots are the before/after

Each `<name>.test.ts` renders the footprint through the same poppygl pipeline
the other snapshot tests use, from the same camera. Before the body exists the
image is bare copper pads on a grid; after it exists the same camera shows the
part. The two are one commit apart, so the PR diff shows the part appearing.

To close a gap:

1. add the body (a `case` arm in `lib/Footprinter3d.tsx`, and a component in
   `lib/` if none fits),
2. delete its line from `MISSING_BODIES`,
3. `bun run build && BUN_UPDATE_SNAPSHOTS=1 bun test tests/body-coverage/`.

Step 3 needs the build first: these tests import `dist/vanilla.js`, which is the
entry consumers use, rather than the React path — a body that renders in Cosmos
but not through the vanilla renderer is exactly the failure this is here to
catch. (The vanilla renderer implements a subset of jscad-fiber: `Cuboid`,
`Cube`, `Cylinder`, `Sphere`, `RoundedCuboid`, `RoundedCylinder`, `Polygon`,
`ExtrudeLinear`, `Hull`, `Union`, `Subtract`, `Colorize`, `Translate`,
`Rotate`. Anything else silently renders nothing, and a `rotation` prop on a
primitive is ignored — wrap it in `<Rotate>`.)

## Probes

Names that carry no dimensions of their own need a representative instance —
`soic` alone does not parse, `soic8` does. Those live in `PROBE`. A probe
footprinter rejects fails the coverage test as a **broken probe**, kept separate
from a missing body because the two have different causes.

## A picture is not the property that matters

A render says a body exists. It does not say the body is the right height, and
the height is the whole point: `measureFootprinterBody` gives the enclosure the
top of the bounding box. `NOMINAL_HEIGHT_MM` records what each package should
measure, from its datasheet — the camera frames a volume that tall, and once
the bodies exist `body-envelope.test.ts` asserts against the same numbers. One
table, so a body cannot pass the assertion while being photographed as though
it were another size.
