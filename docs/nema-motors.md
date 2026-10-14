# NEMA stepper motors

```tsx
import { NEMA8, NEMA17, NEMA23, NEMA34, NemaMotor, Footprinter3d } from "jscad-electronics"

<NEMA8 />
<NEMA17 bodyLength={48} shaftLength={24} dShaft
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
Shaft choices use `roundShaft` / `dShaft`, body corner choices use `chamfered` /
`stepped`, and visible wires use `noWires` / `wireStubs`. Each explicitly provided
selector group must contain exactly one true flag; resolved props contain false
for the other choices. `wireConnection` accepts JST catalog identifiers such as
`"jst-ph-6"` and `"jst-sh-4"`, mutually exclusive with a true wire visibility flag.
The enum properties `backFace`, `shaftShape` and `cornerProfile`, plus
`wireConnection="none"` / `"stubs"`, are rejected.
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

NEMA8/17/23 show rear socket-head cap screws by default. NEMA34 has a plain rear casting. Use
`nema17_backfaceholes` for open blind bores, `nema17_backfacescrews` for
installed screws, or `nema17_plainbackface` for a plain rear cap. The flags
are mutually exclusive; React and vanilla props use `backFaceHoles`,
`backFaceScrews` or `backFacePlain` booleans.

The rear face is at Z=-bodyLength. Heads project outward along -Z.
`backFaceHoleSpacing`, `backFaceHoleDiameter`, `backFaceHoleDepth`, and
`backFaceScrewSize` configure the rear features independently of the front
mounting holes. String modifiers are `backholespacing`, `backholediameter`,
`backholedepth`, and `backscrewm3` (also M2/M2.5/M4/etc.).
Default rear sizes are M2 / M3 / M3 / M5; patterns are 16 × 16 / 31 × 31 /
50 × 32 / 40 × 40 mm. `backFaceHoleSpacingX` / `backFaceHoleSpacingY`
(`backholespacingx` / `backholespacingy`) override each axis; the existing
`backFaceHoleSpacing` / `backholespacing` sets both axes when supplied.
These are representative configurable rear details, not frame guarantees.
NEMA34 follows the rounded, stepped shoulders and plain rear casting visible in
STEPPERONLINE product photos. The rear follows the body profile instead of
repeating the mounting flange. Front assembly screws sit in edge recesses
separately from the mounting holes. The side wire bundle has a grommet, a 90 degree
default exit angle, 2 mm wires, and 25 mm visible length. Threads, laminations,
and the shaft keyway are omitted.

These visual details are photo-based approximations, not manufacturing dimensions.
`stepped` / `chamfered` booleans and `rearCornerChamfer` / `rearchamfer`
configure the profiles. In stepped mode, the chamfer value divided by sqrt(2)
sets the corner shoulder depth, with fillets up to 4 mm. Default body and rear
values are both 24 mm. Rear bores/screws remain opt-in with an illustrative
40 mm square pitch and can be overridden to match a specific motor.
NEMA8/17 retain their existing rear profiles. NEMA23's rear cap has R5 concave
recesses and R2.5 convex fillets around side tabs. Its 50 × 32 mm pattern and
profile use [STEPPERONLINE’s ST-M10 rear adapter drawing](https://www.omc-stepperonline.com/image/catalog/dimensions/ST-M10_Dimension.svg)
as a representative reference. The adapter itself is 56 × 56 mm with Ø4 clearance
holes; the motor model retains its 56.4 mm envelope and uses illustrative M3
socket screws/bores. Exact motor threads, screw style and rear-cover dimensions
are not established by that adapter drawing. Front flange and core geometry
remain unchanged.

`rearStepped` / `rearChamfered` (`rearstepped` / `rearchamfered`) select the rear
profile independently. Explicit `stepped` / `chamfered` still apply to both
profiles unless a rear selector is supplied. `rearCornerChamfer` / `rearchamfer`
sets the stepped shoulder depth after division by sqrt(2); NEMA23 defaults to
9 mm. `rearCornerRecessRadius` / `rearCornerFilletRadius` (`rearrecess` /
`rearfillet`) independently configure the arcs. Bores, heads, reference points
and React/vanilla geometry consume the same modelprinter parameters.
`nema23_rearchamfered_backholespacing47.14mm_backscrewm4` requests the previous
rear depiction explicitly. Blind bores retain their floors; the existing HexSocketBolt
generator supplies the head and hex recess, with a smooth shank inside the
rear bore. Internal tie rods and threads are not modeled. `screwColor`
configures the screw color.

```tsx
<NEMA8 backFaceHoles />
<NEMA17 backFaceScrews />
<NEMA23 backFaceScrews backFaceHoleSpacingX={46} backFaceHoleSpacingY={28} />
<Footprinter3d footprint="nema23_backfaceholes_backholediameter4mm" />
```
