# VBlock

`vblock_l60mm_w40mm_h40mm_vangle90deg_vdepth10mm_mountgroovew3mm_mountgrooved3mm_mountz10mm`

Inspection block centered on XY, bottom Z=0. The centered V runs along X; vangle is its included angle. Both Y side faces have full-length rectangular clamp grooves centered at mountz.

Schemas, units and validation come from modelprinter. Public factories are `createVBlockGeom` and `createVBlockMesh`; React component is `VBlock`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
