# PerforatedSheet

`perforatedsheet_l60mm_w40mm_t1mm_hole3mm_pitchx10mm_pitchy10mm_edgex5mm_edgey5mm_stagger0mm`

Flat XY panel, bottom Z=0. Hole centers begin edgeX/edgeY from the negative edges, continue on stated pitches while respecting both opposite margins. Odd rows shift +stagger; incomplete edge holes are omitted. At most 2500 holes.

Schemas, units and validation come from modelprinter. Public factories are `createPerforatedSheetGeom` and `createPerforatedSheetMesh`; React component is `PerforatedSheet`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
