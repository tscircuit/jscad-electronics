# Industrial plumbing models

These are configurable nominal assembly models for industrial automation layouts.
Dimensions are explicit millimeters, rather than a claim about a supplier catalog,
NPT, BSP, SAE, or ISO pipe interchangeability. Threaded regions are smooth nominal
envelopes. They are suitable for assembly visualization and interference envelopes;
they are not machining drawings, hydraulic simulations, or pressure ratings.

All props schemas are strict. Lengths accept numbers in millimeters or complete
strings with supported units (`mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, `feet`).
Lengths must be positive and relationships must leave material around flow bores.
Counts are bounded unitless integers. Duplicate aliases, unknown fields or tokens,
malformed values, zero/negative dimensions, and impossible mating dimensions fail.
The schemas expose `*ModelPropsInput`, normalized `*ModelProps`, and
`*ModelDefinition`; `get*Dimensions()` supplies normalized named dimensions.
Bare model names use the documented defaults below; every dimension is overrideable.

| Model | Fundamental geometry | Explicit default model string |
| --- | --- | --- |
| `rigidpipe` | Straight open tube with explicit wall thickness | `rigidpipe_od20mm_bore16mm_l100mm` |
| `pipeelbow` | Cast 90-degree elbow with a mitered internal passage, two connected perpendicular ports and enlarged end sockets | `pipeelbow_od24mm_bore16mm_leg36mm_socket28mm_socketl10mm` |
| `pipetee` | Three-way fitting with two inline ports and one perpendicular branch | `pipetee_od24mm_bore16mm_l70mm_branch35mm_socket28mm_socketl10mm` |
| `pipecross` | Four-way fitting with perpendicular through bores | `pipecross_od24mm_bore16mm_span70mm_socket28mm_socketl10mm` |
| `pipecoupling` | Inline sleeve with recessed female socket counterbores and a smaller connecting bore | `pipecoupling_od30mm_bore16mm_socket20mm_l40mm_depth14mm` |
| `pipeunion` | Captive hex swivel nut with annular seams and two tubular ends | `pipeunion_od30mm_bore16mm_l55mm_af36mm_nutl20mm_endod24mm` |
| `pipenipple` | Tubular connector with two smooth thread envelopes and a raised middle shoulder | `pipenipple_od20mm_bore16mm_l50mm_threadl12mm_shoulder22mm` |
| `pipecap` | Blind female socket closed by a floor and hex outer end | `pipecap_od30mm_socket20mm_l25mm_floor4mm_af32mm` |
| `pipeplug` | Solid male plug with a projecting hex head | `pipeplug_d20mm_l20mm_af26mm_head8mm` |
| `reducingbushing` | Hex shoulder and continuously tapered large-to-small bore | `reducingbushing_od26mm_largebore18mm_smallbore10mm_l30mm_af30mm_hexl10mm` |
| `hosebarb` | Hex wrench shoulder, reduced hose stem and several tapered retaining barbs | `hosebarb_od20mm_bore10mm_l45mm_barbod16mm_barbl25mm_pitch6mm_af24mm` |
| `bulkheadfitting` | Tubular body, fixed flange and opposing retaining nut separated by a panel gap | `bulkheadfitting_od20mm_bore12mm_l55mm_flange32mm_flanget4mm_af28mm_nutt8mm_gap10mm` |
| `pushconnectfitting` | Hex body and slotted release collet surrounding a recessed tube socket | `pushconnectfitting_od26mm_bore8mm_l40mm_tube12mm_collet20mm_colletl6mm_af28mm` |
| `compressionfitting` | Inline body, paired compression nuts and recessed tube sockets | `compressionfitting_od22mm_bore8mm_l40mm_tube12mm_af26mm_nutl10mm` |
| `hoseclamp` | Slotted circular band, worm housing, screw and hex drive head | `hoseclamp_id30mm_bandt1.5mm_bandw8mm_housingl14mm_housingw8mm_housingh7mm` |
| `pipeflange` | Raised tubular hub, annular flange and configurable bolt-circle holes | `pipeflange_flange70mm_bore16mm_hub30mm_flanget8mm_hubl20mm_bc50mm_hole6mm_bolts4` |
| `ballvalve` | Spherical central valve envelope, inline ports, stem and longitudinal lever | `ballvalve_od30mm_bore16mm_l65mm_endod24mm_handlel55mm_handlew10mm_stemh14mm_handlet4mm` |
| `checkvalve` | Inline housing with hex ends, service cap and cast flow-direction arrow | `checkvalve_od28mm_bore12mm_l60mm_endod20mm_af30mm_nutl12mm` |
| `needlevalve` | Block body, inline ports, raised stem and perforated handwheel | `needlevalve_bodyl38mm_bodyw24mm_bodyh26mm_bore8mm_port16mm_portl10mm_stemh24mm_wheel26mm_wheelt5mm` |
| `manifold` | Rectangular distribution block with inline gallery, connected upper ports and mounting holes | `manifold_l100mm_w30mm_h26mm_bore12mm_port8mm_pitch25mm_ports3_hole5mm` |

Each model exports its React component plus `create*Geom()` and `create*Mesh()`.
The factories consume the paired modelprinter schemas; meshes use indexed triangles.
Registration descriptors select the same contract and declare `pads: "none"`.

Straight fittings and valve flow axes lie along X through the origin. Elbows have
positive-X and positive-Y ports meeting at the origin; tees have a positive-Y branch;
crosses have both X and Y through ports. A cap's receiving socket opens toward -X
and its closure lies toward +X. A plug's hex head projects beyond its +X end.
The pipe flange face is centered at X=0 and its hub projects along +X. The hose
clamp is centered in XY and its band width lies along Z. The manifold is centered
on the origin, has an X gallery, and receives branch ports through its +Z face.
Valve stems project along +Z; the check valve's cast arrow points along +X.

The release-collet slots, hose-barb ramps, union seams, clamp perforations, flange
bolt holes and manifold mounting holes are modeled as actual geometry. The fitting
bores and ports connect geometrically; caps and plugs retain closure material.
Valve internals remain nominal open flow envelopes, with no pressure or operating
certification implied.

`tests/industrial-plumbing-geometry.test.ts` checks finite positive solids, valid
indexed meshes, 8× volume scaling for 2× dimensions, registration, open flow axes,
connected branches, recesses, closure floors and distinguishing mechanical features.
Each family has a separate standard four-view PNG regression test with its full
model string. The fixtures use ISOMETRIC, TOP, FRONT and SIDE views.
