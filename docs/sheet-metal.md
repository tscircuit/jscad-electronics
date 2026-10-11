# Sheet metal renderer

`SheetMetal`, `createSheetMetalGeom`, and `createSheetMetalMesh` consume the
modelprinter sheet metal contract. Use a value-free `plate`, `angle`, or
`channel` flag in a model string:

```text
sheetmetal_angle_w24mm_l20mm_h16mm_t1.2mm_r2mm_hole1(r3mm_bottomface_leftofcenter3mm)_slot1(l12mm_w3mm_angledface_horizontal)
```

Direct props use `plate: true`, `angle: true`, or `channel: true`. Omitting all
three selects a plate; selecting multiple forms is rejected. Round cutouts use
`round: true` with `diameter`, and slots use `slot: true` with `length` and
`width`. The former string selectors `profile` and `shape` are rejected.
Cutouts retain the panel identifiers `base`, `left`, and `right`, panel-local
coordinates `u` and `v`, and slot axis identifiers `u` and `v`.

The base midsurface is at Z=0 and bends rise toward +Z. Straight base and flange
lengths exclude bend arcs. The renderer preserves constant sheet thickness,
rejects cutouts touching an edge or bend tangent, and emits no PCB pads.
