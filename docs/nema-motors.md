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

The parameter contract comes from the NEMA models in modelprinter.
Geometry generation lives in jscad-electronics.
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

## Rear holes and screws

All three motors show rear socket-head cap screws by default. Use
`nema17_backfaceholes` for open blind bores, `nema17_backfacescrews` for
installed screws, or `nema17_plainbackface` for a plain rear cap. The flags
are mutually exclusive; React and vanilla props use `backFace`.

The rear face is at Z=-bodyLength. Heads project outward along -Z.
`backFaceHoleSpacing`, `backFaceHoleDiameter`, `backFaceHoleDepth`, and
`backFaceScrewSize` configure the rear features independently of the front
mounting holes. String modifiers are `backholespacing`, `backholediameter`,
`backholedepth`, and `backscrewm3` (also M2/M2.5/M4/etc.).
Default rear sizes are M2 / M3 / M4; square pitches are 16 / 31 / 47.14 mm.
These are representative configurable rear details, not frame guarantees.
The enabled rear face retains the full cap outline to support NEMA23 corner
fasteners. Blind bores retain their floors; the existing HexSocketBolt
generator supplies the head and hex recess, with a smooth shank inside the
rear bore. Internal tie rods and threads are not modeled. `screwColor`
configures the screw color.

```tsx
<NEMA8 backFace="holes" />
<NEMA17 backFace="screws" />
<NEMA23 backFace="screws" backFaceHoleSpacing={40} backFaceScrewSize="M3" />
<Footprinter3d footprint="nema23_backfaceholes_backholediameter4mm" />
```
