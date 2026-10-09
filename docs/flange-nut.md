# Flange nut renderer

`flangenut_m6_plainface` renders one steel-colored solid with
a smooth bearing flange, hexagonal body and open internal coarse thread.
ISO 4161:2012 applies by default; the optional value-free `_iso4161` flag,
as in `flangenut_iso4161_m6_plainface`, produces identical geometry.
Modelprinter represents that selection as `iso4161: true`.
`nothreads` retains the minor bore and conical entrances. Supported sizes,
strict parameter validation and all dimensions come from modelprinter's
`flangeNutModelPropsSchema` and `getFlangeNutDimensions`; no standard table is
duplicated here. The modelprinter contract pins
[ISO 4161:2012 Table 1](https://cdn.standards.iteh.ai/samples/61523/6933d05d5928493fa0aaa091527bed78/ISO-4161-2012.pdf).
For M6 the envelope is a 14.2 mm flange, 10 mm across flats and 6 mm total height.

Public exports are `FlangeNut`, `FlangeNutProps`, `createFlangeNutGeom`,
`createFlangeNutMesh`, `FlangeNutMesh` and `FlangeNutMeshOptions`. React,
Footprinter3d and the vanilla footprint renderer use the same geometry. The
renderer registers `pads: "none"`. Both package entrypoints export the factories.

The flange bearing annulus is flat at Z=0 and the upper face is Z=height.
The axis is +Z, with a hex flat parallel to X at Y=acrossFlats/2. Modelprinter
specifies the cylindrical flange rim, 20-degree taper, sharp flange/hex
intersection, 30-degree upper chamfer and both 90-degree included bore mouths.
The bore has a basic 60-degree right-hand thread whose phase is zero at Z=0
and angle zero. Entrances trim the thread; no additional runout is modeled.
These are documented nominal visualization choices, without thread allowances,
ISO gauge certification, material strength or manufacturing tolerances.

`createFlangeNutMesh` returns a single indexed, welded annular surface with
outward triangles. Flange and hexagon share one exterior, so no internal
overlap faces or Boolean repair are needed. Angular cone/hex intersections get
explicit axial levels. The descending bore connects directly to each bearing
annulus, leaving no axial bore caps.

Tessellation defaults to 96 radial segments and 32 segments per pitch. Radial
segments must be a multiple of 12 between 24 and 192; pitch segments must be
an integer between 8 and 64. These renderer options never change dimensions.

Tests check every size with and without threads for manifold seams, triangle
area, outward volume and mounting datums. Independent ray probes check the
flange, flats, upper chamfer, mouths, pitch, right-hand helix and through bore.
Routing tests compare React and vanilla geometry and check that no pads appear.
The checked-in M6 PNG uses `tests/fixtures/render-model-snapshot.ts` and labels
the full model string plus ISOMETRIC, TOP, FRONT and SIDE views.
