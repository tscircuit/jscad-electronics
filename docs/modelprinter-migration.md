# Model specifications and geometry

`@tscircuit/modelprinter` owns strings, schemas, default dimensions, and parameter
validation. jscad-electronics owns geometry, React/vanilla components, and visual
snapshots. NEMA defaults and the grammar are consumed from modelprinter, with no
second implementation in this repository.

The existing `createHexSocketBoltMesh`, `HexSocketBoltMesh`,
`createSheetMetalMesh`, and `SheetMetalMesh` exports move from modelprinter to
jscad-electronics. Their indexed surfaces and coordinate systems are preserved.
JSCAD consumers can also use `createHexSocketBoltGeom` and `createSheetMetalGeom`;
React and vanilla renderers expose `HexSocketBolt` and `SheetMetal` components.
`Footprinter3d` and the vanilla footprint helpers accept all modelprinter strings,
including `hexsocketbolt_m3_l6mm`, sheet-metal strings, and NEMA strings.
Mechanical models have no PCB pads.

```ts
import { mp } from "@tscircuit/modelprinter"
import { createHexSocketBoltGeom } from "jscad-electronics"

const definition = mp.string("hexsocketbolt_m3_l6mm").json()
if (definition.fn === "hexsocketbolt") {
  const { fn, ...props } = definition
  const solid = createHexSocketBoltGeom(props)
}
```

The cross-repository PR pins the modelprinter Git commit until its updated spec
is released. Its trusted `prepare` script builds package entrypoints on install.
Replace the Git pin with the published version before releasing this migration.
No generated modelprinter build artifacts are committed.

The bolt and sheet-metal generators retain their original topology checks and
four-view poppygl PNG snapshots, rendered with this repository's renderer versions. Geometry tests and snapshots belong here;
parameter-only tests belong in modelprinter. New visual snapshots should show
one model in four views, labelled with the complete modelprinter string.
