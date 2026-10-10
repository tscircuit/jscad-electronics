# RectangularBar

`rectangularbar_w20mm_h12mm_l60mm_cornerr1mm`

Solid rectangular stock with optional longitudinal corner radii. Cross section is centered on XY; open length direction is +Z.

Schemas, units and validation come from modelprinter. Public factories are `createRectangularBarGeom` and `createRectangularBarMesh`; React component is `RectangularBar`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
