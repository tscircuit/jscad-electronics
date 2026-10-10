# FlatCableClip

`flatcableclip_iw25mm_ih3mm_d10mm_t2mm_feet5mm_holes2_hole3mm_hp34mm`

A rectangular bridge for ribbon cable, centered on X/Y with its feet seated at Z=0. Inner width spans X; depth spans Y. The opening is X=±innerWidth/2, Z=0..innerHeight, fully open through both Y faces. Side walls and top use thickness; the top face is Z=innerHeight+thickness. Each foot extends footLength outward from a leg's outside face and is thickness high. Two Z-axis through bores lie at X=±holePitch/2, Y=0. Hole count defaults to two and only two is supported. Other dimensions are required. The roadmap's 31mm pitch would intersect a 2mm leg with a 3mm bore, so the documented sample uses 34mm pitch and validation rejects the collision.

The renderer consumes the paired modelprinter schema, rejects malformed or impossible fitting dimensions before construction, and exposes `FlatCableClip`, `createFlatCableClipGeom` and `createFlatCableClipMesh` through generated main and vanilla exports. Curved surfaces use polygonal circular tessellation; mounting bores have 96 segments, and edge corner radii have 64 segments per full circle. Mechanical models have no copper pads.

Nominal circular mounting bores use inscribed 96-segment cylinders. Their maximum radial facet deviation is `(holeDiameter/2)*(1-cos(pi/96))`; it is 0.000803mm for a 3mm bore. Planar fitting coordinates are restored to the schema datums after CSG construction, and the existing mesh finishing helper preserves all boundary seam vertices.
