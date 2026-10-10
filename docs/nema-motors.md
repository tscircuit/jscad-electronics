# NEMA stepper motors

```tsx
import { NEMA8, NEMA17, NEMA23, NEMA34, NemaMotor, Footprinter3d } from "jscad-electronics"

<NEMA8 />
<NEMA17 bodyLength={48} shaftLength={24} shaftShape="d"
  shaftFlatDepth={0.5} shaftFlatLength={15} shaftFlatAngle={90} />
<NEMA23 shaftDiameter={8} shaftLength={25} shaftFlatLength={20} />
<NEMA34 />
<Footprinter3d footprint="nema34_l100mm" />
<NemaMotor nemaSize={8} mountingHoleSpacing={15.4} pilotDiameter={16} />
<Footprinter3d footprint="nema17_l48mm_shaftlength24mm_dshaft_flatangle90deg" />
```

`NEMA8`, `NEMA17`, `NEMA23`, `NEMA34` and `NemaMotor` are also exported by
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

| Default (mm) | NEMA 8 | NEMA 17 | NEMA 23 | NEMA 34 |
| --- | --- | --- | --- | --- |
| Body width × length | 20.3 × 33 | 42.3 × 38 | 56.4 × 51 | 86 × 80 |
| Square mounting pitch | 16 | 31 | 47.14 | 69.6 |
| Hole diameter / depth | 2 / 2 blind | 3 / 4.5 blind | 5 / through front flange | 6.5 / through front flange |
| Pilot diameter × height | 15 × 1.5 | 22 × 2 | 38.1 × 1.6 | 73 × 1.6 |
| Shaft diameter × length | 4 × 15 round | 5 × 24 D | 6.35 × 20.6 D | 14 × 32 round |

Mounting dimensions follow representative Nanotec
[SCA2018](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_SCA2018.pdf),
[ST4118](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST4118.pdf), and
[ST5918](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST5918.pdf)
drawings. NEMA 8 also has 15.4 mm mounting / 16 mm pilot variants, as in the
example above. Body lengths, cap thicknesses, chamfers and D cuts are
configurable defaults. No threads or wires are modeled.

NEMA34's representative envelope follows the
[STEPPERONLINE drawing](https://www.omc-stepperonline.com/download/34HS31-6004S1.pdf);
its keyway is omitted. Body, shaft and mounting dimensions remain configurable
through the shared modelprinter contract.

## Rear holes and screws

All four motors show rear socket-head cap screws by default. Use
`nema17_backfaceholes` for open blind bores, `nema17_backfacescrews` for
installed screws, or `nema17_plainbackface` for a plain rear cap. The flags
are mutually exclusive; React and vanilla props use `backFace`.

The rear face is at Z=-bodyLength. Heads project outward along -Z.
`backFaceHoleSpacing`, `backFaceHoleDiameter`, `backFaceHoleDepth`, and
`backFaceScrewSize` configure the rear features independently of the front
mounting holes. String modifiers are `backholespacing`, `backholediameter`,
`backholedepth`, and `backscrewm3` (also M2/M2.5/M4/etc.).
Default rear sizes are M2 / M3 / M4 / M5; square pitches are 16 / 31 / 47.14 / 58 mm.
These are representative configurable rear details, not frame guarantees.
NEMA34 uses an illustrative inset rear screw pattern and a 16 mm rear corner
chamfer, rather than a second mounting flange. `rearCornerChamfer` / `rearchamfer`
configures the rear outline independently of the front flange and body. These rear
dimensions are not a manufacturer-specific drawing or mounting standard.
NEMA8/17/23 retain their existing rear profiles. Blind bores retain their floors; the existing HexSocketBolt
generator supplies the head and hex recess, with a smooth shank inside the
rear bore. Internal tie rods and threads are not modeled. `screwColor`
configures the screw color.

```tsx
<NEMA8 backFace="holes" />
<NEMA17 backFace="screws" />
<NEMA23 backFace="screws" backFaceHoleSpacing={40} backFaceScrewSize="M3" />
<Footprinter3d footprint="nema23_backfaceholes_backholediameter4mm" />
```
