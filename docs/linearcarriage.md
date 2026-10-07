# LinearCarriage renderer

```text
linearcarriage_w27mm_l45mm_h13mm_railw12mm_railh8mm_baseh2mm_neckw8mm_neckh2mm_clearance0.15mm_holes4_hole3mm_holex20mm_holey20mm_holedepth4mm
```

Consumes the `linearcarriage` schemas, normalized dimensions and mounting helpers from modelprinter. The contract is the authority for defaults and compatibility; no local parser or second specification table is defined. The dependency is supplied by the shared motion-contract preview bridge for review, then a published release containing these contracts.

`LinearCarriage`, `createLinearCarriageMesh`, and `createLinearCarriageGeom` are exported through the model folder and the generated main/vanilla barrels. Its typed registration declares no PCB pads. The direct Cosmos example routes the full string through `Footprinter3d`. Geometry tests verify raw manifold topology, positive volume, datums, actual mounting openings and routing; the standard ISOMETRIC/TOP/FRONT/SIDE PNG labels the complete string.

The carriage is centered in X and Y, with the same virtual rail-bed Z=0 datum as the matching rail. For the example, its physical bottom is Z=2.15mm, its chamber shoulder is Z=3.85mm, its chamber ceiling is Z=8.15mm, and its top is Z=13mm. The retaining lips, widened head chamber and roof consume the resolved channel dimensions. Place it at Y=50mm on the example rail with no Z translation. The channel opens through both Y ends and the bottom neck aperture. Four top mounting cylinders have retained flat blind floors. This is a configurable mounting/clearance envelope without balls, seals, lubricant features or a manufacturer interchangeability claim.

Circular cuts use 48 segments and the existing scaled CSG/manifold triangulation helpers. Geometry rejects features at or below 0.0001mm or 1e-10 of the largest extent rather than losing small walls or holes during tessellation. Physical compatibility remains owned by modelprinter.
