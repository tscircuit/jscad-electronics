# T-slot extrusion renderer

```text
tslotextrusion_w20mm_h20mm_l100mm_profile(fourtsolid)_slot6mm_pocket10mm_pocketd2mm_lip2mm_bore4mm_corner1mm
```

`TSlotExtrusion`, `createTSlotExtrusionGeom`, `createTSlotExtrusionMesh` and the
`TSlotExtrusionMesh` type are available from the React and vanilla entrypoints.
`Footprinter3d` and vanilla footprint helpers route the complete model string;
mechanical models emit no PCB pads.

The schema, defaults, units and section identity are consumed from
[modelprinter PR #33](https://github.com/tscircuit/modelprinter/pull/33), using
the published `@tscircuit/modelprinter@0.0.14` dependency.
See the [parameter contract](https://github.com/tscircuit/modelprinter/blob/3d8ef855d4228a2624f01c6f01a1d4f3520deaad/docs/tslot-extrusion.md).

The indexed outward surface models the actual narrow mouths and wider T
pockets, open along the whole length, and an uncapped axial bore. Outside
corners use 24 segments per quarter-circle; the bore uses 96 segments. End
faces are flat, with zero end chamfers. The lower end datum is Z=0 and the
section is centered in XY, as specified upstream. No supplier profile is inferred.
Topology, analytic volume, mounting-cut rays, route parity and a four-view PNG
snapshot verify the geometry.

The renderer registry consumes this contract and its other model contracts
from the same published modelprinter release.
