# HatSection

Roadmap #0556; a custom part with explicit dimensions, with no supplier or standard profile asserted.

`hatsection_crownw40mm_h20mm_lip10mm_t2mm_bendr2mm_l80mm`

Constant-thickness hat section centered on XY with outward lips at minimum Y, raised crown at maximum Y, and length along +Z from zero. crownWidth is the outside width across both upright webs, lipWidth extends outward from each outside web, and total width is crownWidth+2*lipWidth. bendRadius is inside radius; all outside bends have radius bendRadius+thickness.

All dimensional properties are required; values normalize to millimeters. Width and height describe outside extents. Cut ends are square. Bends use 48 segments per quarter circle and holes use 96 segments, preserving nominal datums and circular tangencies; their faceted surfaces represent the specified radii.

