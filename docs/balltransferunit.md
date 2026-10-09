# Ball transfer unit

`BallTransferUnit`, `createBallTransferUnitMesh`, and `createBallTransferUnitGeom`
render a ball transfer unit with a round cup and a circular three-hole flange.
The [modelprinter contract](https://github.com/tscircuit/modelprinter/blob/main/docs/balltransferunit.md)
owns dimensions, defaults, units, validation, and model-string parsing.

```tsx
import { BallTransferUnit, Footprinter3d } from "jscad-electronics"

<BallTransferUnit ballDiameter={25} flangeDiameter={45} height={30} />

<Footprinter3d footprint="balltransferunit_balld25mm_flangeod45mm_h30mm_face3hole_pcd36mm_holed4mm" />
```

The roadmap spelling `_mount(face3hole)` also renders; `_face3hole` is the
preferred value-free flag. These strings produce no PCB pads or plated holes.

```ts
import {
  createBallTransferUnitMesh,
  createBallTransferUnitGeom,
  getJscadModelForFootprintWithPads,
} from "jscad-electronics/vanilla"
import jscad from "@jscad/modeling"

const mesh = createBallTransferUnitMesh({ ballDiameter: "25mm" })
const geometry = createBallTransferUnitGeom()
const model = getJscadModelForFootprintWithPads("balltransferunit", jscad)
```

The mesh contains combined `positions`/`indices` and two independently closed
`parts`: `housing` and `load ball`, each with its own indexed mesh and steel
color. React and vanilla rendering retain those separate solids. Set the
component's `color` prop to override both colors. The geometry factory returns
one aggregate JSCAD geometry containing both closed surfaces.

The body is centered in XY and starts at Z=0. `height` reaches the ball top;
the cup mouth is at `height - ballProtrusion`, and the top flange extends down
from that plane by `flangeThickness`. The mounting holes go through the full
flange at 0°, 120°, and 240° on the pitch circle, measured from +X.

The spherical socket has a closed floor and the specified nominal clearance
around the rolling ball. Internal recirculating support balls, retainers, and
seals are represented by the nominal cup rather than detailed mechanisms.
This model describes an external envelope, not a supplier series or load rating.
The renderer rejects dimensions that exceed its numerical resolution.
