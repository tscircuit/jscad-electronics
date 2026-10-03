# Parameterized gears

`SpurGear` and `WormGear` consume the parameter contracts from
`@tscircuit/modelprinter`. The same models are available through `Footprinter3d`,
the vanilla renderer, and indexed mesh factories. Mechanical model strings
produce no PCB copper pads.

```tsx
import { SpurGear, WormGear } from "jscad-electronics"

<SpurGear
  toothCount={24}
  module="1mm"
  faceWidth="5mm"
  boreDiameter="5mm"
  hubDiameter="10mm"
  hubLength="3mm"
/>
<WormGear
  module="1mm"
  pitchDiameter="10mm"
  length="20mm"
  starts={2}
  handedness="right"
  boreDiameter="3mm"
/>
```

All lengths normalize to millimeters. The axis is +Z, the lower face is Z=0,
and the upper face is `faceWidth` for spur gears or `length` for worms. A spur
hub extends above the upper face by `hubLength`. `phase` is a rotation in degrees
counterclockwise around +Z; at zero, a spur tooth is centered on +X. Components
accept an optional `color`; colors are renderer props rather than model string
parameters.

## Model strings

```ts
import { mp } from "@tscircuit/modelprinter"
import { createSpurGearMesh, createWormGearMesh } from "jscad-electronics"

const spur = mp.string(
  "spurgear24_m1mm_w5mm_bore5mm_hubdiameter10mm_hublength3mm",
).json()
if (spur.fn === "spurgear") {
  const { fn, ...props } = spur
  const mesh = createSpurGearMesh(props)
  // mesh.positions: flattened XYZ coordinates in mm
  // mesh.indices: outward-wound indexed triangles
}

const worm = mp.string(
  "wormgear_m1mm_d10mm_l20mm_starts2_left_bore3mm",
).json()
if (worm.fn === "wormgear") {
  const { fn, ...props } = worm
  const mesh = createWormGearMesh(props)
}
```

For JSCAD solids, use `createSpurGearGeom(props)` or
`createWormGearGeom(props)`. Both factories validate the ModelPrinter contract
before allocating geometry. Indexed meshes have closed end faces and optional
round through bores. React and vanilla entrypoints export the components and
factories.

The [ModelPrinter gear specification](https://github.com/tscircuit/modelprinter/blob/codex/parameterized-gears/docs/gears.md)
defines tokens, defaults, dimension formulas, and validation. Preview variants
are in `examples/SpurGear.example.tsx` and `examples/WormGear.example.tsx`.

## Geometry and limits

Spur gears use sampled involute flanks with circular tips and root valleys.
`segmentsPerTooth` controls their resolution. Below the base circle, radial
extensions join the root circle. Root fillets and low-tooth-count undercut are
not modeled. Module is the transverse module, `pitchDiameter / toothCount`.
Backlash thins each tooth at its pitch circle by the specified length.

`WormGear` generates the worm screw. It sweeps a truncated trapezoidal axial
rack profile helically, including single and multiple starts and either hand.
Module is the **axial module**: axial pitch is `Math.PI * module`, while lead is
`starts * axialPitch`. Its pressure angle is measured in the axial section.
Backlash thins the axial tooth thickness. `radialSegments` and
`segmentsPerTurn` set minimum sampling resolutions; exact profile corners are
also sampled. The worm uses at least `radialSegments` steps per revolution and
twelve axial steps per pitch to keep the helical surfaces consistent.

Both models automatically refine root surfaces when a bore or hub approaches
the root diameter, preserving the thin wall between faceted boundaries.
Requests that require more than one million vertices fail before allocation.
This can reject an analytically valid but extremely thin wall; reduce the bore
or hub diameter, shorten the worm, or lower the requested resolution.

These are visualization models. A worm's swept axial profile does not define a
conjugate worm wheel, and a spur gear is not a drop-in matching wheel. A future
`wormwheel` model should declare the worm's axial module, pitch diameter, starts,
handedness, and pressure-angle convention and use a hobbed tooth envelope.
This implementation does not generate that envelope, pair placement, contact
analysis, manufacturing tolerances, or load ratings.

For an external spur pair, use the same module and pressure angle. The nominal
center distance is `module * (toothCountA + toothCountB) / 2`. The `backlash`
value is thinning per gear; two equal values add at the pitch circles.

## Coordinated development

The [parser/schema change in ModelPrinter](https://github.com/tscircuit/modelprinter/pull/11) must be available before using these
generators. To work on both checkouts locally, build ModelPrinter, then link its
package into jscad-electronics before building and testing:

```sh
cd ../modelprinter
bun install
bun run build
bun link
cd ../jscad-electronics
bun install
bun link @tscircuit/modelprinter
bun run build
bun test tests/gears.test.ts tests/snapshots/gears.test.ts
```

For distribution, update the ModelPrinter dependency to the gear-enabled package
preview or released version. Publish ModelPrinter before releasing
jscad-electronics.
