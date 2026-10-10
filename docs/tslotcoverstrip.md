# TSlotCoverStrip

`tslotcoverstrip_l100mm_w8mm_t1mm_stemw5.8mm_stemh2mm_barbw6.2mm_profile(tee)`

A continuous T-section groove cover: a broad top strip, narrow insertion stem, and wider rectangular retention bead at the stem tip. Length runs along +Z from Z=0. The cover underside mates at Y=0, its top is Y=thickness, and its inserted tip is Y=-stemHeight. barbHeight defaults to 0.5mm and is included in stemHeight. _tee is the value-free profile flag; _profile(tee) is accepted as the roadmap alias.

The renderer exports `TSlotCoverStrip`, `createTSlotCoverStripGeom`, and `createTSlotCoverStripMesh` from both the main and vanilla entrypoints. All normalized lengths are millimeters. The component adds color only; the direct factories and registered model string produce the same closed mechanical solid and no copper pads.

Planar faces use exact polygonal dimensions.
