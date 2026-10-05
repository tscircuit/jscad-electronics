# T-slot inside corner renderer

```text
tslotinsidecorner_w20mm_leg40mm_t4mm_angle90deg_holes2_hole5mm_offset20mm_bendr1mm
```

`TSlotInsideCorner`, `createTSlotInsideCornerGeom`, `createTSlotInsideCornerMesh`
and `TSlotInsideCornerMesh` are exported from React and vanilla entrypoints.
Footprint helpers route this mechanical model without PCB pads.

Parameter validation and defaults come from
[modelprinter PR #34](https://github.com/tscircuit/modelprinter/pull/34), using
its [pinned package preview](https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@68cae8b74205b898d3033f016e200cb10efa4a8f).
The [parameter contract](https://github.com/tscircuit/modelprinter/blob/68cae8b74205b898d3033f016e200cb10efa4a8f/docs/tslot-inside-corner.md)
owns leg extents, local axes and the virtual inside mounting datum.

The geometry joins two drilled straight panels with a constant-thickness
quarter annulus, sampled at 48 angular intervals. Both holes use 96 segments
and pass through the entire selected leg. Bend tangents reuse shared indexed
vertices and omit internal seam faces. Radius zero preserves the specified
sharp inside corner and concentric outside bend. Geometry tests measure
bounds, volume, both mounting cuts, inner/outer bend radii, closed topology and
React/vanilla routing; the complete example has a four-view PNG snapshot.
