# EdgeGrommet

`edgegrommet_l100mm_w5mm_h6mm_slotw2mm_slotd4mm_corner1mm`

A continuous U edge protector with its length along X, outer width along Y, and mounting envelope Z=0..height. The panel slot opens at Z=0, spans Y=±slotWidth/2, and terminates at Z=slotDepth. The part is centered on X/Y; both cut ends are square. All four outer Y/Z cross-section corners are circular with cornerRadius, default 1mm; use corner0mm for sharp corners. The slot's internal corners are square, with no invented lips or grip ribs. This model always has the roadmap U profile, so the string needs no profile selector. Length, width, height, slotWidth and slotDepth are required. Radius checks preserve both walls and the closed top web.

The renderer consumes the paired modelprinter schema, rejects malformed or impossible fitting dimensions before construction, and exposes `EdgeGrommet`, `createEdgeGrommetGeom` and `createEdgeGrommetMesh` through generated main and vanilla exports. Curved surfaces use polygonal circular tessellation; mounting bores have 96 segments, and edge corner radii have 64 segments per full circle. Mechanical models have no copper pads.

Rounded outside corners use 64 segments per full circle. Straight fitting surfaces remain exactly at the schema datums after planar CSG quantization; the exported indexed mesh retains welded outward surface winding.
