# Split washer renderer

`splitwasher_id6.1mm_od11.8mm_t1.6mm_rise1.6mm_gapangle10deg_rectangular_righthanded`
renders a free-state, rectangular-section split washer with a 3.2 mm axial
envelope. The modelprinter contract owns its dimensions and handedness.

`SplitWasher`, `createSplitWasherGeom`, and `createSplitWasherMesh` are exported
from both package entrypoints. Mesh options accept `angularSegments` (24–1440;
default 360). The mesh has no internal seams: one angular sweep with two flat
radial end caps, an open bore and an open angular gap. Sharp edges and radial/
vertical cross sections are intentional. The lowest face is Z=0, and the first
end is at +X. Left handedness mirrors Y and reverses triangle winding.

The renderer returns no copper pads and works through React `Footprinter3d`
and synchronous vanilla model-string dispatch. It describes free geometry,
without a preload, stress, tolerance or locking-performance model.
