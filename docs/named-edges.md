# Named extrusion outlines

Declare feature names directly on the operations that create a model:

```tsx
import { Colorize, ExtrudeLinear, Polygon, Subtract } from "jscad-fiber/headless"
import { getRectangularTubeProfiles } from "./profiles"

function RectangularTube(props) {
  const { length, outerPoints, innerPoints } = getRectangularTubeProfiles(props)
  return <Colorize color="#929da9">
    <Subtract repair>
      <ExtrudeLinear height={length}
        topOutlineName="outer_top" bottomOutlineName="outer_bottom">
        <Polygon points={outerPoints} />
      </ExtrudeLinear>
      <ExtrudeLinear height={length}
        topOutlineName="inner_top" bottomOutlineName="inner_bottom">
        <Polygon points={innerPoints} />
      </ExtrudeLinear>
    </Subtract>
  </Colorize>
}
```

These are the actual construction nodes used by the rectangular tube. The profile
samples come from its native rounded-rectangle construction, and both extrusions
use the same exact length. Their names identify complete closed outer and bore
contours at the actual ends. A 40 × 20 × 80 mm tube with a 3 mm wall has a 40 mm
outer outline width and a 34 mm bore outline width. The rounded contours retain
all native samples, including their corners.

`bottomOutlineName` names the authored profile at local Z=0.
`topOutlineName` names its signed extrusion endpoint at Z=height, including the
full `twistAngle` rotation in radians. Offset/center wrappers and enclosing
Rotate/Translate nodes compose with these cap placements. Names must be nonblank
and unique within the supplied model tree. Named extrusions require one evaluated
profile; an explicit Union/Subtract can produce that profile.

## Collect declarations from the model tree

```tsx
import jscad from "@jscad/modeling"
import { Translate, Rotate } from "jscad-fiber/headless"
import { renderToJscadModel } from "jscad-fiber/model"
import {
  RectangularTube,
  listJscadReferenceFeatures,
  readJscadNamedEdge,
} from "jscad-electronics"

const model = renderToJscadModel(
  <Translate offset={[10, 20, 30]}>
    <Rotate angles={[Math.PI / 2, 0, 0]}>
      <RectangularTube width={40} height={20} wallThickness={3} length={80}
        outerRadius={3} innerRadius={1} />
    </Rotate>
  </Translate>,
  jscad,
)

// Render model.geometries.
listJscadReferenceFeatures(model)
// ["outer_top", "outer_bottom", "inner_top", "inner_bottom"]
const bore = readJscadNamedEdge(model, "inner_top")
// Closed contour samples include the cap and ancestor placements.
```

`renderToJscadModel` returns `{geometries, referenceFeatures}`. Each collected
reference retains its native `geometry` and composed 4×4 `matrix`. A native
planar profile stays in its authored XY plane; the reader applies its complete
3D placement after sampling. Any additional placement of the owning CAD
component is applied by that component's adapter.

A profile with holes remains one native Geom2 containing every contour.
`readJscadReferenceFeature` exposes that complete native feature. The initial
drawing path reader explicitly requires one contour and rejects a multi-contour
profile rather than inventing a segment between separate loops. The tube names
the outer and bore extrusion outlines separately, so each drawing reference is
unambiguous.

`listJscadReferenceFeatures` exposes generic names, including features other than
edges. `listJscadNamedEdges` filters supported planar paths and contours.
`readJscadNamedEdge` preserves every native sample and the closed/open flag,
checks placement matrices, and leaves source geometry unchanged. A horizontal or
vertical dimension measures the full projected outline extent; an aligned
dimension requires a straight open path.

`createRectangularTubeModel(props)` renders the same component through this
collector. `createRectangularTubeGeom` returns that collected solid, and
`createRectangularTubeMesh` converts it through the shared edge-conforming indexed
mesh converter. `geom3ToIndexedMesh` is also public for converting an already
collected solid into drawing geometry with consistent triangle boundaries.
The React-free `jscad-electronics/vanilla` entrypoint follows the same declaration
and placement contract.

## Drawing snapshots

The model PNG highlights the actual top and bottom outlines. The drawing SVG uses
the same collected solid and measures its bore width as 34 mm, outer width as
40 mm, and inferred view height/length as 20/80 mm. Overall view width/height
presets remain independent of named features.

The viewer-free `jscad-fiber/model` entry evaluates these components with a supplied
JSCAD kernel. Serializable operation plans retain the outline-name metadata on
the extrusion; native feature extraction uses the model renderer. Feature
geometry stays in the model reader, outside Circuit JSON. The drawing exporter
remains a development dependency.

The tube opts into `Subtract repair` to weld floating-point joins before native
kernel triangulation. Both evaluators use the same relative tolerance and retain
the original named profiles. The option applies only to that boolean operation;
ordinary subtraction keeps its existing behavior. The native and built vanilla
solids pass the existing manifold validator.
