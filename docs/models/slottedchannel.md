# SlottedChannel

Roadmap #0169; a custom part with explicit dimensions, with no supplier or standard profile asserted.

`slottedchannel_w40mm_h20mm_t3mm_innerr3mm_l80mm_slots3_slotw6mm_slotl12mm_pitch25mm_end15mm`

Constant-thickness open U-section centered on XY, with its outside web at minimum Y, its opening toward +Y, and cut ends Z=0 and Z=length. Inside radius is innerRadius and outside radius is innerRadius+thickness. Through-web slots have semicircular ends, center X=0, long axis Z, and centers Z=endOffset+i*pitch. slotLength is the overall length including the two round ends.

All dimensional properties are required; values normalize to millimeters. Width and height describe outside extents. Cut ends are square. Bends use 48 segments per quarter circle and holes use 96 segments, preserving nominal datums and circular tangencies; their faceted surfaces represent the specified radii.

The slot length includes the rounded ends. Equal slot width and length makes a circular opening. Slots pass through the entire straight web and leave material at both ends and side bends.
