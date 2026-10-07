# LinearRail renderer

```text
linearrail_w12mm_h8mm_l100mm_baseh2mm_neckw8mm_neckh2mm_chamfer0.5mm_holes4_hole3.5mm_pitch25mm_offset12.5mm_cbore6mm_cbored3mm
```

Consumes the `linearrail` schemas, normalized dimensions and mounting helpers from modelprinter. The contract is the authority for defaults and compatibility; no local parser or second specification table is defined. The dependency is supplied by the shared motion-contract preview bridge for review, then a published release containing these contracts.

`LinearRail`, `createLinearRailMesh`, and `createLinearRailGeom` are exported through the model folder and the generated main/vanilla barrels. Its typed registration declares no PCB pads. The direct Cosmos example routes the full string through `Footprinter3d`. Geometry tests verify raw manifold topology, positive volume, datums, actual mounting openings and routing; the standard ISOMETRIC/TOP/FRONT/SIDE PNG labels the complete string.

The rail is centered on X, extends along Y=0..length, and rests on Z=0. Its explicit waisted base/neck/head profile and 45-degree top chamfers extend along its whole length. Mounting cylinders pass through the full height; coaxial flat-bottom counterbores stop at the contract depth. No fasteners or ball raceways are added.

Circular cuts use 48 segments and the existing scaled CSG/manifold triangulation helpers. Geometry rejects features at or below 0.0001mm or 1e-10 of the largest extent rather than losing small walls or holes during tessellation. Physical compatibility remains owned by modelprinter.
