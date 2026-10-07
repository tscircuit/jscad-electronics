# Generic sleeve linear ball-bearing renderer

`linearballbearing_bore8mm_od15mm_l24mm_seals(both)` renders the generic
8 × 15 × 24 mm sleeve envelope. The paired contract also supplies common
10 × 19 × 29 and 12 × 21 × 30 mm envelopes. Dimensions are descriptive;
there is no manufacturer or LM selector, internal standard claim or load rating.

Public main/vanilla APIs are `LinearBallBearing`, `createLinearBallBearingMesh`
and `createLinearBallBearingGeom`, using modelprinter's input type and
schema. The local descriptor dispatches the same colored parts from
Footprinter3d and synchronous vanilla with no electronic pads. Mesh `parts`
contains individually closed surfaces and nominal ball centers/radii.

The shaft axis is Z; end planes are Z=0 and Z=length. The bore is the minimum
shaft-contact diameter. Six loaded rows start on +X and repeat every
60 degrees. Six unloaded return rows offset 30 degrees have inward polymer
retaining floors. A grooved steel sleeve, polymer pocket separators and two
end retainers complete the nominal cartridge. One intermediate ball in each
relieved end-turn chamber illustrates recirculation; it does not claim a
supplier's full raceway or ball count. The shaft passage stays open.

Modelprinter owns loaded/return radii, ball spacing, groove clearance, cage
and end-chamber dimensions. The nominal return center is inside the main
cavity radius, so its open groove profile is continuous. Circle-intersection
feature angles bound local groove arcs to 15 degrees, keeping their chords
outside the balls even when a uniform shaft-angle grid would cut through a
return ball. All spheres are tested against every emitted steel/polymer
triangle and each other. Tests also cover closed topology, outward winding,
positive volume, exact boundary envelope, actual loaded/return cuts and bore rays.

The standard four-view PNG uses the exact full string. The direct Cosmos
fixture wraps Footprinter3d in ComponentPreview so it exercises the generated
registry in an actual JSCAD context. Geometry options accept multiples of 24
from 96 to 192, default 96; spheres use fixed 24 × 12 tessellation. Numerical
resolution guards reject dimensions above 1,000,000 mm, features below 0.00001
mm and feature ratios below 1e-7 of the largest checked dimension.
