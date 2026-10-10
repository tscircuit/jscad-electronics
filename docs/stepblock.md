# StepBlock

`stepblock_l60mm_w30mm_h40mm_steps8_steprun7.5mm_steprise5mm`

Solid stair-step clamp support centered on XY, bottom Z=0. Staircase rises from -X toward +X. Equal runs and rises must exactly span the specified length and height.

Schemas, units and validation come from modelprinter. Public factories are `createStepBlockGeom` and `createStepBlockMesh`; React component is `StepBlock`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
