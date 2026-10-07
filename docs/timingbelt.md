# TimingBelt

```text
timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm
```

Uses modelprinter's `TimingBeltModelPropsInput`, `timingBeltModelPropsSchema`,
and `getTimingBeltDimensions`. Parser, defaults, units and compatibility live in
[the matching contract](https://github.com/tscircuit/modelprinter/blob/main/docs/timingbelt.md).
The generated `Footprinter3d` route is synchronous and has `pads: "none"`.
Both package entrypoints export `TimingBelt`, `createTimingBeltGeom`,
`createTimingBeltMesh`, and `TimingBeltMesh`. The registration descriptor stays
private.

The open straight belt is one closed solid with actual flat-tipped trapezoidal
teeth. Default bounds are X=0..100 mm, Y=-5..5 mm, Z=-1.625..0.575 mm. Z=0 is
the tensile pitch-line datum, roots lie at -0.425 mm, and teeth face -Z.
Twenty teeth repeat at 5 mm pitch; the cut ends have 1.175 mm margins along
the root plane. The basic T5 section has straight 40-degree flanks, 1.2 mm
tooth height and 1 mm backing. Sharp corners are a documented basic-section
construction; microscopic molded fillets, endless routing, splice and cords
are not represented.

The tooth profile is polygonal and needs no angular resolution option.
Earcut triangulates the concave X/Z section, and matching sidewalls close it
across the width. Width must exceed max(1e-7 mm, pitch length*1e-9) and be at
most 1e8 mm. These are renderer precision limits, not part standards.

Geometry tests verify raw topology, positive analytic volume, tooth count,
flat tip width, flank slope, pitch, cut-end margins, and all bounding/datum
planes, including the supported minimum and maximum tooth counts. Routing
tests compare actual React, public factories and built vanilla output plus
pad exclusions. The four-view PNG labels the full canonical string.
`examples/timingbelt.example.tsx` renders that string through `Footprinter3d`
inside the fitted `ComponentPreview`.
