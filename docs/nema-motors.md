# NEMA stepper motors

```tsx
import { NEMA8, NEMA17, NEMA23, NemaMotor, Footprinter3d } from "jscad-electronics"

<NEMA8 />
<NEMA17 bodyLength={48} shaftLength={24} shaftShape="d"
  shaftFlatDepth={0.5} shaftFlatLength={15} shaftFlatAngle={90} />
<NEMA23 shaftDiameter={8} shaftLength={25} shaftFlatLength={20} />
<NemaMotor nemaSize={8} mountingHoleSpacing={15.4} pilotDiameter={16} />
<Footprinter3d footprint="nema17_l48mm_shaftlength24mm_dshaft_flatangle90deg" />
```

`NEMA8`, `NEMA17`, `NEMA23` and `NemaMotor` are also exported by
`jscad-electronics/vanilla` for use with `h` and `createJSCADRenderer`.
`getJscadModelForFootprint` and `getJscadModelForFootprintWithPads` accept the
same modelprinter strings; motors add no PCB copper pads.

Geometry, unit conversion and validation come from `@tscircuit/modelprinter`.
The mounting face is Z=0, with the body along -Z and the shaft along +Z.
Shaft length is measured from the mounting face, including pilot height.
Flat length runs back from the tip; depth is the radial material removed.
Flat angle is degrees counterclockwise around +Z, with zero on the +X side.
`bodyColor`, `capColor`, and `shaftColor` configure the React/vanilla colors.

| Default (mm) | NEMA 8 | NEMA 17 | NEMA 23 |
| --- | --- | --- | --- |
| Body width × length | 20.3 × 33 | 42.3 × 38 | 56.4 × 51 |
| Square mounting pitch | 16 | 31 | 47.14 |
| Hole diameter / depth | 2 / 2 blind | 3 / 4.5 blind | 5 / through front flange |
| Pilot diameter × height | 15 × 1.5 | 22 × 2 | 38.1 × 1.6 |
| Shaft diameter × length | 4 × 15 round | 5 × 24 D | 6.35 × 20.6 D |

Mounting dimensions follow representative Nanotec
[SCA2018](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_SCA2018.pdf),
[ST4118](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST4118.pdf), and
[ST5918](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST5918.pdf)
drawings. NEMA 8 also has 15.4 mm mounting / 16 mm pilot variants, as in the
example above. Body lengths, cap thicknesses, chamfers and D cuts are
configurable defaults. No threads or wires are modeled.
