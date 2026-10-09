# Dowel pin renderer

`dowelpin_d3mm_l10mm`

Modelprinter defaults to the pinned ISO 8734:1997 nominal contract and owns its supported dimensions and end-lead derivation. The optional value-free flag in `dowelpin_iso8734_d3mm_l10mm` makes that same contract explicit. Normalized props contain `iso8734: true`; the former `standard(...)` selectors and `standard` property are rejected. This renderer consumes its dimension helper to build an outward-wound closed mesh with a cylindrical middle, two conical leads and flat end disks. The nominal flat-ended visual convention uses the approximate 15-degree lead angle; optional manufacturer radius/dimple variations and fit or manufacturing certification are not represented.

The lower end is Z=0 and the upper end is Z=length. Length includes both leads. Main and vanilla entrypoints export `DowelPin`, `createDowelPinMesh`, `createDowelPinGeom` and their public types. The mesh factory returns indexed triangles; the geometry factory returns a JSCAD solid. React, registered `Footprinter3d` and synchronous vanilla dispatch share this geometry, and the mechanical model emits no PCB pads.

The optional `radialSegments` affects tessellation only. It defaults to 96 and must be a multiple of four between 24 and 256. Modelprinter rejects unsupported nominal dimensions, contradictory end-lead overrides and overlapping leads before mesh generation.

The checked-in [four-view snapshot](../tests/snapshots/__snapshots__/dowel-pin.snap.png) labels the full proposal string. Geometry tests verify topology, outward winding, both end planes, nominal diameter, end disks, the actual 15-degree lead slope and independent analytic volume. Routing tests compare direct React, registered React and built vanilla behavior.
