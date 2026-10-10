# PcbEdgeSupport

`pcbedgesupport_w20mm_d12mm_h15mm_slotw1.8mm_slotd6mm_bw10mm_bt2mm_holes2_hole3mm_hp14mm`

A PCB edge support with a complete rectangular base, narrower upright, and centered transverse board slot. The base spans X=±width/2, Y=±depth/2, Z=0..baseThickness. The upright spans X=±bodyWidth/2 and the same Y depth, reaching Z=height. Its top slot runs through both X faces, spans Y=±slotWidth/2, and has floor Z=height-slotDepth. Two Z-axis base bores are at X=±holePitch/2, Y=0. Their diameter is explicit; no hidden counterbore is present. The original roadmap omits upright width and base thickness; bw10mm and bt2mm in this sample fix those fitting surfaces. Base thickness defaults to 2mm and hole count defaults to two; other dimensions are required. Strict clearance checks keep each mounting bore wholly in an exposed foot rather than under the body.

The renderer consumes the paired modelprinter schema, rejects malformed or impossible fitting dimensions before construction, and exposes `PcbEdgeSupport`, `createPcbEdgeSupportGeom` and `createPcbEdgeSupportMesh` through generated main and vanilla exports. Curved surfaces use polygonal circular tessellation; mounting bores have 96 segments, and edge corner radii have 64 segments per full circle. Mechanical models have no copper pads.

Nominal circular mounting bores use inscribed 96-segment cylinders. Their maximum radial facet deviation is `(holeDiameter/2)*(1-cos(pi/96))`; it is 0.000803mm for a 3mm bore. Planar fitting coordinates are restored to the schema datums after CSG construction, and the existing mesh finishing helper preserves all boundary seam vertices.
