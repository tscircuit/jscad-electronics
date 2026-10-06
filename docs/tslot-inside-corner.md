# T-slot inside corner renderer

```text
tslotinsidecorner_w20mm_leg40mm_t4mm_angle90deg_holes2_hole5mm_offset20mm_bendr1mm
```

`TSlotInsideCorner`, `createTSlotInsideCornerGeom`, `createTSlotInsideCornerMesh`
and `TSlotInsideCornerMesh` are exported from React and vanilla entrypoints.
Footprint helpers route this mechanical model without PCB pads.

Parameter validation and defaults come from
[modelprinter PR #34](https://github.com/tscircuit/modelprinter/pull/34), using
the shared [pinned package preview](https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@0262c71788481313bad6d61f7850220c1f6681a4).
The [parameter contract](https://github.com/tscircuit/modelprinter/blob/fc7fd191873b3149b748a1b4e85e2bc67b175568/docs/tslot-inside-corner.md)
owns leg extents, local axes and the virtual inside mounting datum.

The geometry joins two drilled straight panels with a constant-thickness
quarter annulus, sampled at 48 angular intervals. Both holes use 96 segments
and pass through the entire selected leg. Bend tangents reuse shared indexed
vertices and omit internal seam faces. Radius zero preserves the specified
sharp inside corner and concentric outside bend. Geometry tests measure
bounds, volume, both mounting cuts, inner/outer bend radii, closed topology and
React/vanilla routing; the complete example has a four-view PNG snapshot.

The shared dependency preview is published from
[modelprinter draft PR #41](https://github.com/tscircuit/modelprinter/pull/41) and
contains the contract linked above. Replace it with a published modelprinter
release only after that release contains all contracts used by the renderer
registry.
