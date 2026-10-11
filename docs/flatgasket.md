# FlatGasket

```text
flatgasket_id20mm_od35mm_t2mm_flatannulus
```

Flat annular seal centered on XY. The mating face is Z=0 and the opposite face is Z=thickness. Both bore and outside walls are straight, with no bevels. Custom dimensions specify nominal geometry without material or compression properties.

Both circular walls use 128 segments at shared angles; annular faces are triangulated with a through-opening. Polygon walls are inscribed nominal circles, with maximum radial chord error 1-cos(π/128) times the radius. Geometry is a nominal seal without an inferred material, compression allowance, or fit tolerance.

`FlatGasket`, `createFlatGasketGeom`, and `createFlatGasketMesh` export from the React and vanilla entrypoints. The renderer consumes modelprinter schemas and dimension helpers, rejects geometry below its relative mesh resolution, and emits no PCB pads. Public component color may be overridden.
