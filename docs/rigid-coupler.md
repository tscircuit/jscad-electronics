# RigidCoupler geometry

This renderer consumes the parameter contract from [modelprinter PR #29](https://github.com/tscircuit/modelprinter/pull/29). Its preview dependency is pinned to commit `8d396e3918585a220a31b82a54e6bf15ca740419` through `https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@8d396e3918585a220a31b82a54e6bf15ca740419`. Replace the preview URL with a published modelprinter release once that contract is released.

```ts
import { mp } from "@tscircuit/modelprinter"
import { createRigidCouplerMesh, createRigidCouplerGeom, RigidCoupler } from "jscad-electronics"

const model = mp.string("rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4").json()
if (model.fn !== "rigidcoupler") throw new Error("Unexpected family")
const { fn, ...props } = model
const mesh = createRigidCouplerMesh(props)
const solid = createRigidCouplerGeom(props)
```

`RigidCoupler` is the React component; its props add an optional color to modelprinter's input properties. Mesh/Geom factories, types, and the component also export from `jscad-electronics/vanilla`. `Footprinter3d` and both vanilla footprint helpers dispatch the full string; `ExtrudedPads` validates it and emits no PCB pads.

The generator calls `rigidCouplerModelPropsSchema` and `getRigidCouplerDimensions` from modelprinter. That package owns supported tokens, dimensions, defaults, compatibility validation, thread pitch/hand/class, and mounting datums. No specification tables or parsing grammar are copied into this renderer.

The annular meridian is revolved with 64 circumferential segments. Outside polygons are inscribed, while shaft bore polygons circumscribe the nominal shaft circle with tangent flats at the cardinal axes. This preserves the full nominal shaft clearance at every angle and lets radial thread crests break into the bore without tiny blind end caps. Axial entry and outer edge chamfers follow the schema's exact 45-degree setbacks. The plain shaft bore is an actual opening through the solid. Both shaft bore depths and the sharp midpoint shoulder follow the helper, including unequal bore diameters. All four radial set-screw holes use their own helper-supplied depth, start and axis; two perpendicular holes are cut at each shaft end.

Female mounting threads are actual handed helical cuts in the wall, rather than smooth holes or a visual color. Each cutter uses 24 circumferential segments and 12 axial samples per pitch. The nominal major diameter equals the helper's thread diameter. The visual truncated 60-degree profile has radial depth `0.541266 * pitch`, limited to 80% of the radius for unusually deep custom-pitch overrides. Right-hand phase advances counterclockwise around the positive hole axis as distance along that axis increases; left-hand mirrors the phase. Pitch and hand are taken from modelprinter. Manufacturing fit/tolerances for class 6H and crest/root relief are not simulated.

Closed cutters extend 0.0001 mm into the already empty bore/slit/exterior at each end to prevent coincident boolean caps. CSG runs at 100 times scale to retain intersection fragments above JSCAD's absolute BSP epsilon, then returns to millimeters. Seam vertices weld within 0.000001 mm. CSG sliver faces narrower than that weld tolerance collapse to seams before repair. Missing vertices along CSG T junctions are inserted before face triangulation, which retains collinear seam edges and uses unsnapped interior face centers. The exported indexed mesh has shared seam vertices, consistent outward winding, and no caps across fitting openings.

A renderer resolution guard rejects wall/chamfer ligaments thinner than the difference between the inside and outside polygon approximations. Allocation guards reject more than 64 thread turns per hole or more than 100,000 estimated cutter triangles before generating geometry. Thread pitch stays a geometry-driving dimension; small pitches fail explicitly rather than being silently simplified to smooth bores.

Tests inspect the exported mesh's nondegenerate faces, two-use opposite-direction edges, connectedness, positive volume, bounds, open bore/hole axes, material clearances, chamfers, handed thread profiles and pitch changes. The exact full roadmap string has a four-view PNG snapshot in `tests/snapshots/__snapshots__`.
