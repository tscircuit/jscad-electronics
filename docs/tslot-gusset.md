# T-slot gusset renderer

```text
tslotgusset_w40mm_h40mm_t4mm_shape(righttriangle)_slots2_slot(5mm,12mm)_centers(12mm,28mm)
```

`TSlotGusset`, `createTSlotGussetGeom`, `createTSlotGussetMesh` and the
`TSlotGussetMesh` type are exported from React and vanilla entrypoints.
Footprint helpers route this mechanical model without PCB pads.

The renderer consumes the schema and mounting-slot resolver from
[modelprinter PR #35](https://github.com/tscircuit/modelprinter/pull/35), using
its [pinned package preview](https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@1b3f3c88810f1ea564a57a293f3c2a5cdbd28d97).
See the [parameter contract](https://github.com/tscircuit/modelprinter/blob/1b3f3c88810f1ea564a57a293f3c2a5cdbd28d97/docs/tslot-gusset.md)
for defaults, triangular datum and the along-edge meaning of `centers`.

The flat triangle contains both full capsule openings, using the upstream
centers and perpendicular orientations. Semicircles use 48 angular intervals;
equal width/length becomes a 96-segment round hole. Both openings remain
uncapped through the complete thickness. Closed topology, analytic volume,
slot-center/end mounting rays, unequal-size/default cases and React/vanilla
parity are checked. The complete example has a four-view PNG snapshot.
