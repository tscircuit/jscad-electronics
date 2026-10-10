# RectangularTube

`rectangulartube_w40mm_h20mm_wall2mm_l60mm_outerr4mm_innerr2mm`

Open rectangular stock tube. Outer and inner radii are independent; minimum corner clearance is validated. Section centered on XY, ends Z=0 and Z=length.

Schemas, units and validation come from modelprinter. Public factories are `createRectangularTubeGeom` and `createRectangularTubeMesh`; React component is `RectangularTube`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
