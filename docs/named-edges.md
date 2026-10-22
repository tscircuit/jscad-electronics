# Native named edges

Models can return geometry together with named native features. The names belong
to the model; a drawing refers to a declared name rather than supplying a second
definition of its geometry.

```ts
import {
  createRectangularTubeModel,
  listJscadNamedEdges,
  readJscadNamedEdge,
} from "jscad-electronics/vanilla"

const model = createRectangularTubeModel({
  width: 40,
  height: 20,
  wallThickness: 3,
  length: 80,
  outerRadius: 3,
  innerRadius: 1,
})

// Render model.geometry as a regular JSCAD geom3.
listJscadNamedEdges(model)
// ["outer_profile", "inner_profile", "outer_top", "outer_left"]

const top = readJscadNamedEdge(model, "outer_top")
// { points: [{x:-17,y:10,z:0}, {x:17,y:10,z:0}], closed: false }
const profile = readJscadNamedEdge(model, "outer_profile")
// A closed contour with all native polygon samples, including rounded corners.
```

`NamedJscadModel` stores a `Geom3` plus a `namedEdges` record of native JSCAD
`Geom2` or `Path2` features. The rectangular tube retains the actual outer and
inner `Geom2` profiles used to construct its solid, then discovers its straight
top and left sides from the outer profile's native segments. Its rounded top
side measures 34 mm; the complete outer profile spans 40 mm. Changing model
parameters updates both the rendered solid and these native features.
Straight side names are included only when the native profile contains that side.

The initial reader supports planar features at model-local Z=0, in CAD
millimeters with +Z up. It returns every point and whether the contour is closed,
without modifying the source feature. A name must identify one contour: name
inner and outer boundaries separately. Undeclared names throw an error.

The owner applies model placement to the returned samples before passing them to
a drawing exporter. Moving `model.geometry` alone does not move the retained
construction profiles. This wrapper makes that ownership explicit rather than
attaching properties to a `Geom3` that booleans or transforms may discard.

Drawing definitions can now refer to these declared features, for example
`edgeRef=".outer_top"` within a part view selecting this model. An inferred overall
width uses `widthOfView`, independently of named features. A horizontal or vertical
dimension of a curved profile uses the projected extent of the entire contour;
an aligned straight-edge dimension must first verify that its path is collinear.
No named edge geometry needs to be stored in Circuit JSON.
