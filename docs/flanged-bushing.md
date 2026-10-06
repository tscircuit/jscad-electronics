# Flanged bushing geometry

This renderer pins [modelprinter PR #23](https://github.com/tscircuit/modelprinter/pull/23)
through the shared immutable [package preview](https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@0262c71788481313bad6d61f7850220c1f6681a4).

`FlangedBushing`, `createFlangedBushingGeom`, and `createFlangedBushingMesh`
consume `FlangedBushingModelPropsInput` from modelprinter. Schemas, units,
defaults, and physical validation stay in modelprinter. The React component also
accepts `color` (default `#a18450`). Main and vanilla entrypoints export the
component and both factories; `Footprinter3d` routes the complete model string,
and pad rendering returns no PCB pads.

```ts
import { mp } from "@tscircuit/modelprinter"
import { createFlangedBushingGeom } from "jscad-electronics"

const model = mp.string("flangedbushing_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm_style(plainclosed)").json()
if (model.fn === "flangedbushing") {
  const { fn, ...props } = model
  const solid = createFlangedBushingGeom(props)
}
```

The sleeve, flange and bore are concentric with Z. The lower flange face is
Z=0, the square shoulder is Z=`flangeThickness`, and the upper sleeve end is
Z=`length`. Overall length includes the flange: the example has 15 mm total
length with a 2 mm flange and 13 mm sleeve projection.

A single closed radial/axial boundary produces the indexed mesh, with shared
ring vertices and outward winding. The integral flange has no overlapping
internal surface or separate solid. Its bore remains open and uninterrupted
through both flange and sleeve; edges and the shoulder stay square. Circular
surfaces use 96 facets and include all cardinal directions. Allocation is fixed
regardless of dimensions.

Tests verify closed oriented topology, positive volume against the analytic
annular volumes, flange/sleeve cross-sections, overall length and datum,
uninterrupted bore, schema errors, and React/vanilla routing without pads.
The labelled four-view poppygl baseline uses the complete roadmap example.

The shared dependency preview is produced by [modelprinter draft PR #41](https://github.com/tscircuit/modelprinter/pull/41),
which includes this model's contract and the other registry contracts. Replace
the preview with a published modelprinter version once all contracts consumed
by the renderer registry are available in that release.
