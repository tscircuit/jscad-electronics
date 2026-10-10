# SandwichMount

`sandwichmount_w50mm_l50mm_h25mm_holepitch35mm_holed6mm_coreh19mm_platethickness3mm`

Rectangular bonded isolator centered on XY, bottom Z=0. Equal end plates surround a solid elastomer core. Four plain bores on a centered square grid pass through the entire assembly so fixing access is explicit. No load rating implied.

Schemas, units and validation come from modelprinter. Public factories are `createSandwichMountGeom` and `createSandwichMountMesh`; React component is `SandwichMount`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
