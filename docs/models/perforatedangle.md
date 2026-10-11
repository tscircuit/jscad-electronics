# PerforatedAngle

Roadmap #0158; a custom part with explicit dimensions, with no supplier or standard profile asserted.

`perforatedangle_w25mm_h25mm_t3mm_l80mm_innerr3mm_holes3_hole6mm_pitch25mm_end15mm_legoffset12.5mm`

Constant-thickness equal or unequal L-section with round holes in both legs. XY envelope is centered; the outside heel is at minimum X/Y and cut ends are Z=0 and Z=length. Inside bend radius is innerRadius; outside radius is innerRadius+thickness. Each leg hole center is legOffset from the outside heel and Z=endOffset+i*pitch.

All dimensional properties are required; values normalize to millimeters. Width and height describe outside extents. Cut ends are square. Bends use 48 segments per quarter circle and holes use 96 segments, preserving nominal datums and circular tangencies; their faceted surfaces represent the specified radii.

