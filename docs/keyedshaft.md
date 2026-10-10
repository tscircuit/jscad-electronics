# KeyedShaft

`keyedshaft_d20mm_l250mm_keyw6mm_keydepth3mm_keyl200mm_endchamfer1mm`

A round drive shaft with a rectangular longitudinal keyway centered along its length and 45-degree chamfers at both outer end edges. The shaft axis is +Z, its bottom face is Z=0, and the keyway opens toward +Y. keyDepth measures radially inward from the nominal outermost +Y surface; keyLength excludes the solid end sections.

The renderer exports `KeyedShaft`, `createKeyedShaftGeom`, and `createKeyedShaftMesh` from both the main and vanilla entrypoints. All normalized lengths are millimeters. The component adds color only; the direct factories and registered model string produce the same closed mechanical solid and no copper pads.

Circular surfaces use 128-sided nominal envelopes.
