# TimingPulley

```text
timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm
```

Uses modelprinter's `TimingPulleyModelPropsInput`,
`timingPulleyModelPropsSchema`, and `getTimingPulleyDimensions`. Parser,
defaults, units and compatibility live in
[the matching contract](https://github.com/tscircuit/modelprinter/blob/main/docs/timingpulley.md).
The generated `Footprinter3d` route is synchronous and has `pads: "none"`.
Both package entrypoints export `TimingPulley`, `createTimingPulleyGeom`,
`createTimingPulleyMesh`, the mesh/options types, and `createTimingPulleyOutline`.
The generic registration descriptor stays private.

The pulley has straight 50-degree groove flanks, flat roots, 0.4 mm root
fillets, and 0.6 mm entry fillets tangent to the outside circle. Pitch diameter
is teeth*5/pi; outside diameter is 0.85 mm smaller. The fixed nominal clearance
construction is deliberately not a tooth-count-specific DIN machining form.
References and that limitation are documented in the parameter contract.

The face occupies Z=0..12 mm by default; flanges lie at Z=-1..0 and 12..13 mm.
The bore runs through both flanges and the toothed body. A groove is centered
on +X; angles increase counterclockwise around +Z. Intended belt width is
10 mm, centered at Z=1..11 mm, leaving 1 mm side clearance. The flange rise
exceeds the mating T5 belt's 1 mm backing thickness.

`TimingPulleyMeshOptions` chooses `arcSegments` (4..32, default 8) per fillet
and `crestSegments` (2..16, default 4) per circular crest.
`createTimingPulleyOutline` returns the counterclockwise 2D boundary.
Triangulation joins matching radial rings without CSG or bore caps. Features
must exceed max(1e-7 mm, overall scale*1e-9) to avoid numerical collapse.
These renderer limits are separate from the parameter contract.

Geometry tests check manifold topology, positive volume, straight flanks,
measured fillet radii/tangency, groove pitch, bore, flanges and datum planes.
A wrapped basic T5 tooth section must clear the pulley at its tensile pitch
circle. Routing tests compare actual React, public factories and built vanilla
output, including pad exclusions. The four-view PNG labels the complete
canonical string. `examples/timingpulley.example.tsx` renders that string
through `Footprinter3d` inside the fitted `ComponentPreview`.
