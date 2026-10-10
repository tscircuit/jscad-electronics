# AngleBar

`anglebar_w25mm_h25mm_t3mm_innerr3mm_tipr1mm_l60mm`

L-section stock, centered envelope on XY with the outside corner at minimum X/Y. Inner root and four free-tip corners accept circular fillets. Length runs along +Z.

Schemas, units and validation come from modelprinter. Public factories are `createAngleBarGeom` and `createAngleBarMesh`; React component is `AngleBar`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
