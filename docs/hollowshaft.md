# HollowShaft

`hollowshaft_od20mm_id12mm_l200mm_style(roundtube)_endchamfer1mm`

A concentric round tubular drive shaft with a through bore and 45-degree chamfers on both the inner and outer edges of both ends. The centered shaft axis is +Z and bottom face Z=0. endChamfer is the radial and axial chamfer size; validation preserves a positive annular end land. _roundtube is the value-free style flag; _style(roundtube) is accepted as the roadmap alias.

The renderer exports `HollowShaft`, `createHollowShaftGeom`, and `createHollowShaftMesh` from both the main and vanilla entrypoints. All normalized lengths are millimeters. The component adds color only; the direct factories and registered model string produce the same closed mechanical solid and no copper pads.

Circular bore faces circumscribe the nominal bore; outer envelope uses 128 or more inscribed facets.
The bore tessellation increases up to 4096 segments when needed to preserve a narrow end land. An end land smaller than the maximum-resolution polygon tolerance is rejected before constructing the solid.
