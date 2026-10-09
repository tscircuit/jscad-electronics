# Nylon lock nut renderer

`NylonLockNut` consumes the pinned ISO 7040:2012 contract from modelprinter;
`nylonlocknut_m6` selects its M6 model using ISO 7040 by default. The
optional value-free `iso7040` flag restates that selection:
`nylonlocknut_m6_iso7040` has identical geometry. All dimensions,
nominal collar/pocket/insert choices, thread profiles and datums belong to
modelprinter. This is an assembly visualization without torque, deformation
or manufacturing certification. The metal extends from Z=0 to the selected
total height; the recessed undeformed nylon annulus is rendered separately.

`createNylonLockNutMesh` and `createNylonLockNutGeom` produce a single closed
assembly exterior, omitting buried material interfaces. `createNylonLockNutMeshes`
and `createNylonLockNutGeometries` return separately closed `metal` and `insert`
parts with exact touching interfaces and no volume overlap. React and vanilla
routing preserve both parts and their steel/blue nylon colors; `color` and
`insertColor` can override them. Mechanical routing produces no PCB pads.
All factories and types are available from the main and vanilla entrypoints.

The ring mesh resolves both hex/cone intersections, the collar, pocket,
insert chamfer and internal helical groove directly; no threaded CSG cut is
needed. Tessellation options do not change physical dimensions: `radialSegments`
defaults to 96 (multiples of 12 in 24–192) and `segmentsPerPitch` to 32
(integers 8–64). More than 24,000 thread intervals is rejected before allocation.

Geometry checks cover closed outward topology, positive volume, bore and
material interfaces, all five supported sizes, assembly volume equal to the
sum of parts, hidden-thread behavior and React/built vanilla routing. The
standard four-view PNG labels the full model string and distinguishes the
nylon ring. Its snapshot helper supports extra independently colored meshes
without changing existing single-mesh snapshots.
