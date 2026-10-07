# HexNut renderer

Consumes the strict schemas and resolved dimensions from [modelprinter PR #25](https://github.com/tscircuit/modelprinter/pull/25). The dependency and lockfile use the published `@tscircuit/modelprinter@0.0.14` release.

`createHexNutMesh` returns indexed outward-facing triangles; `createHexNutGeom` produces a JSCAD solid. `HexNut` is exported from both React and vanilla entrypoints. `Footprinter3d` and vanilla footprint helpers route `hexnut` strings to it; mechanical models produce no PCB pads.

All nominal dimensions, defaults, selectors, validation and datums belong to modelprinter. There is no local parser or second dimension table. Radial sampling resolves the actual mounting, drive and thread surfaces directly, avoiding threaded CSG subtraction. The exported `HexNutMeshOptions` type controls tessellation in the second factory argument: radialSegments defaults to 96 (multiple of 12, 24–192), segmentsPerPitch defaults to 32 (8–64). Inputs requiring more than 24,000 axial thread intervals fail before allocating mesh arrays. Polygonal surfaces approximate the nominal curves; thread depth and hand remain those of the contract. Geometry tests verify manifold topology, positive signed volume, datums and profile sections; a four-view PoppyGL snapshot displays the full roadmap example string.

The renderer registry consumes this contract and its other model contracts
from the same published modelprinter release.
