# Compression spring geometry

`CompressionSpring`, `createCompressionSpringGeom` and
`createCompressionSpringMesh` consume the modelprinter custom spring contract:

```
compressionspring_spec(custom)_od8mm_wire1mm_l20mm_turns8_active6_ends(closedground)_hand(right)_state(free)
```

The dependency and lockfile pin the [compatible immutable preview](https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@0262c71788481313bad6d61f7850220c1f6681a4)
from [modelprinter draft PR #41](https://github.com/tscircuit/modelprinter/pull/41)
at commit `0262c71788481313bad6d61f7850220c1f6681a4`. It includes
[modelprinter PR #26](https://github.com/tscircuit/modelprinter/pull/26) and upstream FlexScreen contact and tail parsing.
Replace the preview with a published modelprinter release once all contracts
used by the renderer registry are available in that release.

The parser/schema, active-turn default, piecewise pitch, winding and bearing
datums are owned by `@tscircuit/modelprinter`. Geometry imports its dimensions
and `getCompressionSpringCenterlinePoint` helpers instead of defining another
parameter contract or helix. Main and vanilla entrypoints export the component
and factories; `Footprinter3d` and vanilla footprint helpers route the complete
string without PCB pads.

The mesh sweeps a round wire section in the radial/axial plane through the
spring axis at every centerline sample. It follows both one-turn closed ends
and the uniformly pitched active turns, including the two unblended pitch
transitions. Terminal sections have planar radial/axial cuts. The entire sweep
is then clipped to the imported lower and upper bearing Z planes. Shared edge
intersections and triangulated cut boundaries produce actual planar ground
surfaces; the renderer does not cap the bore or add end turns. Left-handed
geometry mirrors Y and reverses triangle winding to retain positive volume.

Circle samples on the section's cardinal axes are exact. Ground clipping
snaps source vertices within 32 machine epsilons of the free length to an end
plane, avoiding zero-area triangles from trigonometric roundoff. This numerical
allowance does not introduce a physical grind depth or pose parameter.

An optional second mesh-factory argument controls tessellation only:
`segmentsPerTurn` defaults to 64 and accepts multiples of four in [16,256];
`wireSegments` defaults to 24 and accepts multiples of four in [8,64]. Meshes
requiring more than 250000 source vertices fail before allocation. Wire size,
bore or active-turn clearance at or below `1e-10` of the larger OD/free-length
scale also fails as an impractical resolution request. No physical defaults or
compatibility rules are duplicated from modelprinter.

Geometry tests inspect closed oriented topology, finite positive volume,
open bore, diameters, imported section-frame and pitch samples, mirrored
winding, actual end-plane faces, and React/vanilla parity. The four-view
PoppyGL snapshot shows the full example, closed ends and active-coil pitch.
