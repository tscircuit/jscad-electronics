# ButtonScrew renderer

`buttonscrew_m3_l10mm` uses ISO 7380-1:2022 by default. The optional bare flag
in `buttonscrew_iso7380-1_m3_l10mm` produces the same geometry and normalized
`iso73801: true` contract. The old `standard(...)` selector is unsupported.
The renderer consumes modelprinter's strict schemas and resolved dimensions.

`createButtonScrewMesh` returns indexed outward-facing triangles; `createButtonScrewGeom` produces a JSCAD solid. `ButtonScrew` is exported from both React and vanilla entrypoints. `Footprinter3d` and vanilla footprint helpers route `buttonscrew` strings to it; mechanical models produce no PCB pads.

All nominal dimensions, defaults, selectors, validation and datums belong to modelprinter. There is no local parser or second dimension table. Radial sampling resolves the actual mounting, drive and thread surfaces directly, avoiding threaded CSG subtraction. The exported `ButtonScrewMeshOptions` type controls tessellation in the second factory argument: radialSegments defaults to 96 (multiple of 12, 24–192), segmentsPerPitch defaults to 32 (8–64). Inputs requiring more than 24,000 axial thread intervals fail before allocating mesh arrays. Polygonal surfaces approximate the nominal curves; thread depth and hand remain those of the contract. Geometry tests verify manifold topology, positive signed volume, datums and profile sections; a four-view PoppyGL snapshot displays the full roadmap example string.

The renderer registry consumes this contract and its other model contracts
from the same prepared modelprinter build.
