# ChannelBar

`channelbar_w40mm_h20mm_web3mm_flange3mm_innerr3mm_tipr1mm_l60mm`

U-section stock centered on XY, opening toward +Y, length along +Z. Root radii and four free-tip radii preserve the outer envelope.

Schemas, units and validation come from modelprinter. Public factories are `createChannelBarGeom` and `createChannelBarMesh`; React component is `ChannelBar`. Mechanical models produce no copper pads. Circular profiles use 64 segments (holes use 48). Fillets use 16 segments per quadrant. These meshes model nominal geometry without manufacturing tolerances.
