# TSlotPanelRetainer

Roadmap #0254; a custom part with explicit dimensions, with no supplier or standard profile asserted.

`tslotpanelretainer_w20mm_h25mm_d12mm_t3mm_panel3mm_offset5mm_hole5mm`

Custom stepped panel-edge clip; no extrusion supplier or T-slot standard is implied. Width is centered on X, rear mounting face is Y=0, depth extends +Y, and bottom Z=0. A horizontal shelf starts at Z=offset and has thickness t. Its front retaining lip rises panelThickness above the shelf top. A panel rests on Z=offset+t behind that lip. The rear flange spans the full height and has one Y-directed fixing hole centered in width, at Z=height-thickness-holeDiameter/2, leaving thickness above the hole.

All dimensional properties are required; values normalize to millimeters. Width and height describe outside extents. Cut ends are square. Bends use 48 segments per quarter circle and holes use 96 segments, preserving nominal datums and circular tangencies; their faceted surfaces represent the specified radii.

The specified panel thickness controls the front lip height above the ledge. The clip has an open top; it supports and locates the panel edge and does not clamp it. The fixing hole is a clearance bore without an implicit screw or thread. Sharp bends are intentional for this machined/custom stepped clip; no bend radius is specified.
