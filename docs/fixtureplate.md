# FixturePlate

`fixtureplate_l80mm_w60mm_t8mm_hole6mm_cols3_rows2_pitch25mm_edgex15mm_edgey15mm`

XY workholding plate with an explicitly located rectangular grid of plain through-holes. Counts, pitch and first-hole margins are independent; the grid must remain inside the plate. Bottom Z=0; no threads or counterbores implied.

Schemas, units and validation come from modelprinter. Public factories are `createFixturePlateGeom` and `createFixturePlateMesh`; React component is `FixturePlate`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
