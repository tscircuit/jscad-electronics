# BeltIdler

```text
beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm
```

Uses modelprinter's `BeltIdlerModelPropsInput`, `beltIdlerModelPropsSchema`,
and `getBeltIdlerDimensions`. Parser, defaults, units and compatibility live in
[the matching contract](https://github.com/tscircuit/modelprinter/blob/main/docs/beltidler.md).
The generated `Footprinter3d` route is synchronous and has `pads: "none"`.
Both package entrypoints export `BeltIdler`, `createBeltIdlerGeom`,
`createBeltIdlerMesh`, and the mesh/options types. The generic registration
descriptor stays private.

The smooth roller has a cylindrical contact surface, straight through bore,
two retaining flanges with square shoulders, and flat annular ends. Default
contact/flange diameters are 20/26 mm. The smooth face occupies Z=0..12 mm;
flanges lie at Z=-1..0 and 12..13 mm, about the +Z axis. An intended 10 mm belt
fits at Z=1..11 mm, leaving positive axial clearance. The flange rim rises
beyond the complete 2.2 mm belt thickness above backside contact. Bearing races,
rolling elements, shaft and toothed contact are not part of this generic roller.

`BeltIdlerMeshOptions.radialSegments` accepts multiples of four from 32..512
(default 128), preserving cardinal bounds. The body and flange steps are
explicit shared radial rings. Features must exceed max(1e-7 mm, overall
scale*1e-9) to avoid numerical collapse. These are renderer precision limits.

Geometry tests check raw topology, opposite edge winding, positive volume,
the analytic faceted volume, smooth contact, through bore, flange fit and end
planes at multiple resolutions. Routing tests compare actual React, public
factories and built vanilla output plus pad exclusions. The four-view PNG
labels the full canonical string. `examples/beltidler.example.tsx` renders
that string through `Footprinter3d` inside the fitted `ComponentPreview`.
