# HexNut renderer

Consumes the strict schemas and resolved dimensions from ModelPrinter.
The metric and imperial nut contracts are introduced in
[ModelPrinter PR #65](https://github.com/tscircuit/modelprinter/pull/65).
The dependency is pinned to its `5bbced0` PR package preview.

`createHexNutMesh` returns indexed outward-facing triangles; `createHexNutGeom` produces a JSCAD solid. `HexNut` is exported from both React and vanilla entrypoints. `Footprinter3d` and vanilla footprint helpers route `hexnut` strings to it; mechanical models produce no PCB pads.

All nominal dimensions, defaults, selectors, validation and datums belong to modelprinter. There is no local parser or second dimension table. Radial sampling resolves the actual mounting, drive and thread surfaces directly, avoiding threaded CSG subtraction. The exported `HexNutMeshOptions` type controls tessellation in the second factory argument: radialSegments defaults to 96 (multiple of 12, 24–192), segmentsPerPitch defaults to 32 (8–64). Inputs requiring more than 24,000 axial thread intervals fail before allocating mesh arrays. Polygonal surfaces approximate the nominal curves; thread depth and hand remain those of the contract. Geometry tests verify manifold topology, positive signed volume, datums and profile sections; a four-view PoppyGL snapshot displays the full roadmap example string.

The renderer registry consumes this contract and its other model contracts
from the same pinned ModelPrinter package.


The paired ModelPrinter changes add DIN M1.6–M24 and imperial UNC #2–#12
and 1/4–1 inch selections to the same `HexNut` renderer. Examples:
`hexnut_m3`, `hexnut_standard(din934)_m10`,
`hexnut_imperial(1/4-20)` and `hexnut_imperial(#6-32)`.
The mesh consumes the selected pitch, height, bore and envelope from
ModelPrinter without a second table or string parser. Existing ISO models
retain their dimensions and geometry. Tests cover all supported added sizes,
thread visibility, manifold solids, datums, React and built vanilla routing,
and separate four-view snapshots for DIN, fractional UNC and numbered UNC.

The ModelPrinter PR package preview provides the shared contracts in CI and
standalone installations. Replace it with a published release containing the
nut contracts when that release is available.
