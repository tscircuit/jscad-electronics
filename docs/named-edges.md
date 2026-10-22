# Named features declared in JSCAD Fiber

Declare feature names in the component that defines the model, using the same
`name` and `reference` pattern as Fiber reference rectangles:

```tsx
import { Custom, Colorize } from "jscad-fiber/headless"
import { createRectangularTubeConstruction } from "./geometry"

function RectangularTube(props) {
  const { solid, outer, inner, topPath, leftPath } =
    createRectangularTubeConstruction(props)
  return <>
    <Colorize color="#929da9"><Custom geometry={solid} /></Colorize>
    <Custom name="outer_profile" geometry={outer} reference />
    <Custom name="inner_profile" geometry={inner} reference />
    {topPath && <Custom name="outer_top" geometry={topPath} reference />}
    {leftPath && <Custom name="outer_left" geometry={leftPath} reference />}
  </>
}
```

`Custom` accepts native JSCAD `Geom2`, `Path2`, or `Geom3` geometry. `name` declares
an identity; `reference` keeps that feature out of the solid and boolean
operations. A named node without `reference` remains ordinary rendered geometry
and is also collected. Names must be nonblank and unique within the supplied
model tree. Features can represent paths, closed profiles, clearance volumes,
or other native geometry; a name does not force every feature to be a straight
edge.

The rectangular tube uses the actual outer and inner construction profiles that
produce its solid. Its top and left sides are discovered from the outer profile's
native segments. Rounded corners shorten those straight sides naturally; a
40 × 20 mm tube with R3 outer corners has a 34 mm `outer_top` and a complete
40 mm `outer_profile` span. A straight side name is omitted if the native profile
does not contain that side.

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

// Render model.geometries; reference features add no material.
listJscadReferenceFeatures(model)
// ["outer_profile", "inner_profile", "outer_top", "outer_left"]
const top = readJscadNamedEdge(model, "outer_top")
// All path samples include the full ancestor translation and rotation.
```

`renderToJscadModel` returns `{geometries, referenceFeatures}`. Each collected
reference contains its native `geometry` and composed 4×4 `matrix`. A native
planar feature stays in its authored XY plane; the reader applies its full 3D
placement after sampling. This preserves out-of-plane rotations that cannot be
represented by transforming a native `Geom2` or `Path2` alone. Any additional
placement of the owning CAD component is applied by that component's adapter.

`listJscadReferenceFeatures` and `readJscadReferenceFeature` expose generic named
features. `listJscadNamedEdges` filters the planar contours and paths supported by
the drawing reader. `readJscadNamedEdge` preserves every native sample and whether
the contour is closed; it rejects undeclared names, solid features used as edges,
and ambiguous multiple contours. It does not modify the source geometry.

`createRectangularTubeModel(props)` is a convenience that renders the same
`RectangularTube` component through this collector. There is no separately
authored feature map. Its reader helpers are also available from the React-free
`jscad-electronics/vanilla` entrypoint, whose existing renderer follows the same
declarations and transform contract.

## Native models and serializable plans

`jscad-fiber/model` is a viewer-free native model renderer with a supplied JSCAD
kernel. The existing `renderToJscadPlan` compiler remains the pure serializable
operation-plan path and continues to reject raw native `Custom` geometry. Native
feature declarations do not add geometry to Circuit JSON.

The checked-in model PNG highlights the declared features. The drawing SVG uses
the real collected model with a development dependency on the drawing exporter:
the actual straight top is 34 mm, the closed profile spans 40 mm, and inferred
view dimensions give 20 mm height and 80 mm length. Overall view width/height
presets remain independent of named features. Drawing export stays outside the
runtime model package.
