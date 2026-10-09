# Male-female standoff renderer

`malefemalestandoff_m3_af5.5mm_l10mm_studl5mm_femaledepth6mm_hex`

The renderer consumes the published modelprinter contract and dimension helper. The hex body's lower mounting shoulder is Z=0. Its male stud extends downward and its top female socket is blind, with a flat floor. Both thread surfaces use the contract's pitch and handedness. This is an untoleranced visual model; manufacturer envelopes, drill points and thread runout are not implied.

Both main and vanilla entrypoints export `MaleFemaleStandoff`, `createMaleFemaleStandoffMesh`, `createMaleFemaleStandoffGeom` and their props/mesh types. The mesh factory returns indexed outward-wound triangles; the geometry factory returns a JSCAD solid. React rendering, `Footprinter3d` and synchronous vanilla footprint dispatch use the same mesh. Mechanical strings produce no PCB pads.

Mesh options control tessellation only: `radialSegments` defaults to 96 and must be a multiple of 12 between 24 and 192. `segmentsPerPitch` defaults to 32 and must be an integer between 8 and 64. Excessive thread-turn counts and vanishing tip radii are rejected before allocation. Modelprinter validates dimensions, units, chamfers and the blind socket's solid floor.

The [standard four-view snapshot](../tests/snapshots/__snapshots__/male-female-standoff.snap.png) displays the exact string, its internal socket, external stud and mounting datums. Geometry tests check closed topology, winding, thread pitch, mirrored handedness, a blind socket, independent body/stud lengths and the smooth-thread variant. Routing tests check public React and built vanilla behavior.
