# TSlotEndCap

`tslotendcap_w20mm_h20mm_t3mm_corner1mm_pinod3.8mm_pinl6mm_pins1_centered`

A rounded rectangular end cover with one central cylindrical friction pin. The cover underside and profile end mate at Z=0; the plate extends upward to Z=thickness and the pin inserts downward to Z=-pinLength. pinDiameter is the actual interference-fit envelope, not the target bore diameter. This custom model supports exactly one centered pin.

The renderer exports `TSlotEndCap`, `createTSlotEndCapGeom`, and `createTSlotEndCapMesh` from both the main and vanilla entrypoints. All normalized lengths are millimeters. The component adds color only; the direct factories and registered model string produce the same closed mechanical solid and no copper pads.

Circular surfaces use 128-sided nominal envelopes.
