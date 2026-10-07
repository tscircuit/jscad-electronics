# Radial ball-bearing renderer

`ballbearing608` uses the conventional 8 × 22 × 7 mm 608 boundary envelope
with both faces open. The canonical dimension-only form is
`ballbearing_id8mm_od22mm_w7mm_bothsidesopen`. The paired modelprinter contract
also supports 625, 624, 6000, 6001 and 6002, plus custom positive envelopes.
No manufacturer name or product fit is implied.

Modelprinter expands compact codes, suffixes and value-free flags into six
booleans: `topSideOpen`, `topSideShielded`, `topSideSealed`, `bottomSideOpen`,
`bottomSideShielded`, and `bottomSideSealed`. Exactly one is true for each
face. The renderer consumes those validated booleans without parsing or
special-casing the string. There is no `closure` enum input.

| Compact example | Top (+Z) | Bottom (Z=0) |
| --- | --- | --- |
| `ballbearing608` | open | open |
| `ballbearing625zz` or `ballbearing6252z` | shielded | shielded |
| `ballbearing625z` | open | shielded |
| `ballbearing625rs` | open | sealed |
| `ballbearing6252rs` | sealed | sealed |
| `ballbearing625zz_topsideopen` | open | shielded |

The flags `open`/`bothsidesopen`, `shielded`/`bothsidesshielded` and
`sealed`/`bothsidessealed` select both faces. Per-face flags are `topsideopen`,
`topsideshielded`, `topsidesealed`, `bottomsideopen`, `bottomsideshielded`
and `bottomsidesealed`. Explicit flags override suffix defaults. The canonical
asymmetric example is
`ballbearing_id5mm_od16mm_w5mm_topsideopen_bottomsideshielded`.
Conflicts, unit conversion, shorthand and defaults belong to modelprinter.

`BallBearing`, `createBallBearingMesh` and `createBallBearingGeom` are public
from main and vanilla. Inputs use `BallBearingModelPropsInput` from
modelprinter. The folder-local registration consumes the definition schema;
Footprinter3d and synchronous vanilla dispatch create the same colored
physical parts without electronic pads. Mesh `parts` contains each independent
closed indexed surface with its name and color; rolling elements also expose
their nominal centers and radii. Component color overrides all part colors.

The shaft axis is Z, centered in X/Y. Bottom is Z=0 and top is Z=width.
Two chamfered circular-groove races enclose eight separated balls, two cage
bands and eight separators. An open face leaves the race gap exposed.
A shielded face adds a thin metal shield; a sealed face adds a profiled
rubber seal, dark in the component. Each face is selected independently.
Both structures stay inside the overall width and keep the bore open.

Nine checked-in ISOMETRIC/TOP/FRONT/SIDE snapshots cover every top/bottom
combination and label the full model string. The isometric view looks from
below to reveal the bottom face while TOP reveals the top; FRONT and SIDE
retain their orthogonal directions. Named Cosmos fixtures cover compact codes,
suffix aliases, overrides and all nine explicit pairs, using Footprinter3d
inside ComponentPreview. All three previously reviewed symmetric indexed
geometries are unchanged, verified by frozen SHA-256 regression hashes.

Modelprinter owns every nominal dimension. Ball count, groove clearance,
cage, chamfers and shield/seal profiles are visualization choices; bearing
designations specify the documented outside envelope rather than these
internals. Surfaces are closed and outward oriented before JSCAD conversion.
Distinct physical parts may touch at nominal mating faces and are not forcibly
united. Tests cover topology, positive volumes, groove/chamfer sections,
independent face positions, clear shafts, ball-to-triangle clearance, ball
spacing, exact part colors, overrides and React/vanilla dispatch.

Geometry options accept `segments` as a multiple of 24 from 96 through 192,
default 96. Sphere tessellation is fixed at 24 longitudes/12 latitudes with
single pole vertices. Dimensions above 1,000,000 mm, features below 0.00001 mm,
and ratios below 1e-7 of the largest checked dimension raise a numerical
resolution error. These limits belong to the renderer; the compatible
custom-envelope schema remains broader.
