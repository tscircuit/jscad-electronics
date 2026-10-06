# Plain bushing geometry

This renderer pins [modelprinter PR #22](https://github.com/tscircuit/modelprinter/pull/22)
through the shared immutable [package preview](https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@0262c71788481313bad6d61f7850220c1f6681a4).

`PlainBushing`, `createPlainBushingGeom`, and `createPlainBushingMesh` consume
`PlainBushingModelPropsInput` from modelprinter. The schema, units, defaults,
and physical validation remain in modelprinter; the renderer adds no parameter
specification. The React component also accepts `color` (default `#a18450`).
Both the main and vanilla entrypoints export the component and factories;
`Footprinter3d` routes the complete model string, and mechanical pad rendering
returns no PCB pads.

```ts
import { mp } from "@tscircuit/modelprinter"
import { createPlainBushingGeom } from "jscad-electronics"

const model = mp.string("plainbushing_id8mm_od12mm_l20mm_style(plainclosed)_edgechamfer0.5mm").json()
if (model.fn === "plainbushing") {
  const { fn, ...props } = model
  const solid = createPlainBushingGeom(props)
}
```

The bushing is concentric with Z, with the lower end at Z=0 and the upper end at
Z=`length`. The indexed mesh shares all ring vertices and contains one closed,
outward-oriented surface with an uninterrupted through bore. Annular end faces
preserve the bore openings. A positive `edgeChamfer` cuts 45-degree chamfers on
both inside and outside rims at both ends, keeping all cuts within the original
end planes. Zero chamfer produces square edges without duplicate rings.

Circular surfaces use 96 facets, with vertices on each cardinal direction.
Allocation is fixed regardless of dimensions. Geometry tests check oriented
closed topology, volume, measured cross-sections, all four chamfers, open bore,
invalid inputs, and React/vanilla routing. The four-view poppygl baseline uses
the full roadmap string and displays the sleeve, openings, and rim chamfers.

The shared dependency preview is produced by [modelprinter draft PR #41](https://github.com/tscircuit/modelprinter/pull/41),
which includes this model's contract and the other registry contracts. Replace
the preview with a published modelprinter version once all contracts consumed
by the renderer registry are available in that release.
