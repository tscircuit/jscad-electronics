# CableComb

`cablecomb_w60mm_h10mm_d8mm_slots6_slotw6mm_slotd7mm_p8mm_holes2_hole3mm_hp52mm`

A custom straight comb centered on X/Y and seated at Z=0. Width is X, depth is Y, and height is Z. Equal rectangular slots run through both Y faces and open upward, with their floor at height-slotDepth. Slot i is centered at X=(i-(slotCount-1)/2)*slotPitch. Two Z-axis mounting bores at X=±holePitch/2, Y=0 pass through the end walls for the full height. Hole count defaults to two; only two is supported. All other dimensions/counts are required. Validation requires separate teeth, a bottom spine, and mounting bores wholly outside the slots and inside the envelope.

The renderer consumes the paired modelprinter schema, rejects malformed or impossible fitting dimensions before construction, and exposes `CableComb`, `createCableCombGeom` and `createCableCombMesh` through generated main and vanilla exports. Curved surfaces use polygonal circular tessellation; mounting bores have 96 segments, and edge corner radii have 64 segments per full circle. Mechanical models have no copper pads.

Nominal circular mounting bores use inscribed 96-segment cylinders. Their maximum radial facet deviation is `(holeDiameter/2)*(1-cos(pi/96))`; it is 0.000803mm for a 3mm bore. Planar fitting coordinates are restored to the schema datums after CSG construction, and the existing mesh finishing helper preserves all boundary seam vertices.
