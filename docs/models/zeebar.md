# ZeeBar

Roadmap #0555; a custom part with explicit dimensions, with no supplier or standard profile asserted.

`zeebar_h30mm_upperw20mm_lowerw20mm_t2mm_bendr2mm_l80mm`

Constant-thickness Z-section with lower flange toward -X, upper flange toward +X, and length along +Z from zero. The XY envelope is centered. upperWidth/lowerWidth include the web thickness; total width is upperWidth+lowerWidth-thickness. height is outside-to-outside. bendRadius is the inside radius and outside bends use bendRadius+thickness.

All dimensional properties are required; values normalize to millimeters. Width and height describe outside extents. Cut ends are square. Bends use 48 segments per quarter circle and holes use 96 segments, preserving nominal datums and circular tangencies; their faceted surfaces represent the specified radii.

