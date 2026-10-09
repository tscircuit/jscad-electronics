# ThreadedRod renderer

Consumes the strict schemas and resolved dimensions from [modelprinter PR #63](https://github.com/tscircuit/modelprinter/pull/63). The string `threadedrod_m6_l100mm_chamfer0.5mm` renders a fully threaded M6 rod with flat ends. Add `_lefthanded` for a left-handed thread; JSON props use `leftHand: true`, with right-handed threads as the default. JSON props omit `spec`, `thread`, and `ends`; legacy string selectors remain accepted by modelprinter.

The dependency and lockfile pin the published pkg.pr.new preview of that contract at commit `02756c0549037ce0dd9b2e47e84b8185b64b1fce`.

`createThreadedRodMesh` returns indexed outward-facing triangles; `createThreadedRodGeom` produces a JSCAD solid. `ThreadedRod` is exported from both React and vanilla entrypoints. `Footprinter3d` and vanilla footprint helpers route `threadedrod` strings to it; mechanical models produce no PCB pads.

All nominal dimensions, defaults, selectors, validation and datums belong to modelprinter. There is no local parser or second dimension table. Radial sampling resolves the actual mounting, drive and thread surfaces directly, avoiding threaded CSG subtraction. The exported `ThreadedRodMeshOptions` type controls tessellation in the second factory argument: radialSegments defaults to 96 (multiple of 12, 24–192), segmentsPerPitch defaults to 32 (8–64). Inputs requiring more than 24,000 axial thread intervals fail before allocating mesh arrays. Polygonal surfaces approximate the nominal curves; thread depth and hand remain those of the contract. Geometry tests verify manifold topology, positive signed volume, datums and profile sections; a four-view PoppyGL snapshot displays the full roadmap example string.

The renderer registry consumes this contract and its other model contracts
from the modelprinter dependency.
