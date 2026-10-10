# HexShaft

`hexshaft_af12mm_l200mm_profile(regularhex)_endchamfer1mm`

A regular hexagonal drive shaft with 45-degree chamfers on all six facets at each end. Length runs along the centered +Z axis from Z=0. acrossFlats measures the distance between the flats X=+-acrossFlats/2; vertices lie on the +/-Y axis. endChamfer offsets each flat inward by that amount over the same axial distance. _regularhex is the value-free profile flag; _profile(regularhex) is the roadmap alias.

The renderer exports `HexShaft`, `createHexShaftGeom`, and `createHexShaftMesh` from both the main and vanilla entrypoints. All normalized lengths are millimeters. The component adds color only; the direct factories and registered model string produce the same closed mechanical solid and no copper pads.

Planar faces use exact polygonal dimensions.
