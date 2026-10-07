# Radial ball-bearing renderer

`ballbearing_code608_closure(open)` uses the conventional 8 × 22 × 7 mm
608 boundary envelope from the paired modelprinter contract. The renderer
also accepts the compatible dimension-only strings and the five other
supported size designations. No manufacturer name or product fit is implied.

`BallBearing`, `createBallBearingMesh` and `createBallBearingGeom` are public
from main and vanilla. Inputs use `BallBearingModelPropsInput` from
modelprinter. The folder-local registration consumes the definition schema;
Footprinter3d and synchronous vanilla dispatch create the same colored
physical parts without electronic pads. The mesh exposes `parts` with names,
colors and each independent closed indexed surface. Balls additionally expose
their nominal centers and radii. A component color can override part colors.

Axis Z, centered X/Y, runs from Z=0 to width. Two chamfered circular-groove
races enclose eight separated balls, two cage bands and eight separators.
`closure(open)` leaves the race gap exposed. `closure(shielded)` adds two
thin metal face shields; `closure(sealed)` adds two profiled seal lips, rendered
dark in the component. Both remain inside the overall width and keep the bore
open. Each configuration has its own checked-in ISOMETRIC/TOP/FRONT/SIDE
snapshot labeled with the full string. The Cosmos fixture dispatches the full
open model through Footprinter3d within ComponentPreview.

Modelprinter owns every nominal dimension. The eight balls, groove clearance,
cage, chamfer and closures are visualization choices; bearing designations
specify the documented outside envelope rather than these internals. Faces
are closed and outward oriented before conversion to JSCAD. Distinct physical
parts may touch at their nominal mating faces; they are not forcibly united.
Raw topology, positive part volumes, analytical groove/chamfer sections,
shaft rays, ball-to-triangle clearances and ball spacing are tested.

Geometry options accept `segments` as a multiple of 24 from 96 through 192,
default 96. Sphere tessellation is fixed at 24 longitudes/12 latitudes, with
single pole vertices. Dimensions beyond 1,000,000 mm, features below 0.00001
mm or ratios below 1e-7 of the largest checked dimension raise a numerical
resolution error rather than allocating unbounded geometry. These limits
belong to the renderer; the compatible custom-envelope schema remains broader.
