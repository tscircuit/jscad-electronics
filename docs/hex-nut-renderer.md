# HexNut renderer

Consumes the strict schemas and resolved dimensions from ModelPrinter.
The contract build combines current modelprinter main with the paired contract
PR, then bundles the tested schemas and dimension tables. Local builds follow
[the model registration workflow](model-registration.md).

`createHexNutMesh` returns indexed outward-facing triangles; `createHexNutGeom` produces a JSCAD solid. `HexNut` is exported from both React and vanilla entrypoints. `Footprinter3d` and vanilla footprint helpers route `hexnut` strings to it; mechanical models produce no PCB pads.

All nominal dimensions, defaults, selectors, validation and datums belong to modelprinter. There is no local parser or second dimension table. Radial sampling resolves the actual mounting, drive and thread surfaces directly, avoiding threaded CSG subtraction. The exported `HexNutMeshOptions` type controls tessellation in the second factory argument: radialSegments defaults to 96 (multiple of 12, 24–192), segmentsPerPitch defaults to 32 (8–64). Inputs requiring more than 24,000 axial thread intervals fail before allocating mesh arrays. Polygonal surfaces approximate the nominal curves; thread depth and hand remain those of the contract. Geometry tests verify manifold topology, positive signed volume, datums and profile sections; a four-view PoppyGL snapshot displays the full roadmap example string.

The renderer registry consumes the normalized boolean family selectors
`iso4032`, `din934` and `asmeb1822`. ISO 4032 defaults for supported ISO metric
sizes, DIN 934 for the remaining supported metric sizes, and ASME B18.2.2 for
imperial sizes. `hexnut_m6`, `hexnut_m3` and `hexnut_imperial(1/4-20)` select
those defaults. Optional value-free flags restate them: `hexnut_m6_iso4032`,
`hexnut_m3_din934` and `hexnut_imperial(1/4-20)_asmeb18.2.2` produce identical
geometry. The compact `asmeb1822` alias is equivalent. Legacy `standard(...)`
selectors are rejected by modelprinter.


The paired ModelPrinter changes add DIN M1.6–M24 and imperial UNC #2–#12
and 1/4–1 inch selections to the same `HexNut` renderer. Examples:
`hexnut_m3`, `hexnut_din934_m10`,
`hexnut_imperial(1/4-20)` and `hexnut_imperial(#6-32)`.
The mesh consumes the selected pitch, height, bore and envelope from
ModelPrinter without a second table or string parser. Existing ISO models
retain their dimensions and geometry. Tests cover all supported added sizes,
thread visibility, manifold solids, datums, React and built vanilla routing,
and separate four-view snapshots for DIN, fractional UNC and numbered UNC.

Checks cover omitted versus explicit family flags in React and built vanilla
routing, exact mesh equivalence for ISO, DIN and both imperial patterns, and
unchanged geometry for all supported sizes. The checked-in four-view snapshots
label the ordinary default strings for ISO, DIN, fractional UNC and numbered
UNC models.
