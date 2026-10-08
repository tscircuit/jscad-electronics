# Torsion spring

The parameter contract and dimensional datums are defined in modelprinter;
this renderer consumes its schema. Model strings route through both React
`Footprinter3d` and synchronous vanilla entrypoints. These mechanical models
produce no PCB pads.

`TorsionSpring`, `createTorsionSpringGeom` and `createTorsionSpringMesh` sweep
circular normal sections along the contract's coil and exact tangent legs, then
cap the free ends. Left/right winding and fractional turns share the same path.
The first coil centerline point is (meanRadius,0,0); the geometry extends below
Z=0. The legs include the helix's axial slope rather than lying in XY end planes.
This is an open-coil free-state reference; no spring rate, preload or load rating
is implied.

Mesh options use 64 segments/turn and 24 wire segments by default. Both are
multiples of four: ranges 16–256 and 8–64 respectively, with a 250000-vertex cap.
Resolution checks reject effectively zero legs, wire, bore or coil gaps relative
to the complete envelope. The contract restricts pitch/diameter before meshing.

Two checked-in four-view PNGs cover the example variants. Their full model
strings, ISOMETRIC / TOP / FRONT / SIDE labels and datums are drawn by the shared
`renderModelSnapshot` helper. Update intentionally with
`BUN_UPDATE_SNAPSHOTS=1 bun test tests/snapshots/torsionspring-` and run again without
that variable to verify. The Cosmos example exposes the same strings.
