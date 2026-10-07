# Generic linear bearing-block renderer

`linearbearingblock_bore8mm_bearingod15mm_w34mm_l24mm_h24mm_mount(clearance)_hole4.5mm_pitchx24mm_pitchy16mm`
dispatches a generic 34 × 24 × 24 mm housing with an 8 mm shaft-contact bore
and a 15 mm nominal cartridge. It is a chosen housing geometry, not an SCS
or manufacturer envelope, and it does not imply threads or a press fit.

`LinearBearingBlock`, `createLinearBearingBlockMesh` and
`createLinearBearingBlockGeom` are main/vanilla public APIs. Modelprinter owns
all inputs, schemas and nominal dimensions. The folder-local renderer is
independent of the new linearballbearing renderer. Its descriptor dispatches
from Footprinter3d and synchronous vanilla without pads. Mesh `parts` contains
closed steel housing/sleeve surfaces, rolling balls, polymer separators,
return-row floors and two flush end retainers, with colors and ball metadata.

Z=0 is the mounting datum. X/Y are centered; the shaft runs along Y at X=0,
Z=height/2, from Y=-length/2 to +length/2. Four real vertical clearance holes
are at X=±mountPitchX/2 and Y=±mountPitchY/2. Defaults leave 2.25 mm from their
rims to the cartridge and 1.75 mm to the Y faces. The cartridge spans the body
length and has six loaded and six unloaded return rows, with relieved end
chambers. These internals illustrate recirculation without claiming standard
fits, preload, load ratings or supplier raceway construction.

The housing's receptacle uses the cartridge's actual refined angular ring,
so their nominal mating surfaces share the same polygon chords. The housing
is directly triangulated with its circular receptacle and four holes, rather
than rendered as a solid box covering the cartridge. Tests prove shared mating
vertices, positive housing-volume bounds against the analytical circular
construction, four through-hole rays, an open shaft, closed oriented topology,
positive part volumes, and every sphere's clearance from all housing/cartridge
surfaces and other spheres. Custom dimensions are covered separately.

The checked-in standard four-view PNG labels the full string. The direct
Cosmos fixture uses Footprinter3d inside ComponentPreview. Options accept
`segments` in multiples of 24 from 96 to 192 (default 96); spheres are fixed
24 × 12. Guards reject dimensions above 1,000,000 mm, features below 0.00001
mm and feature ratios below 1e-7 of the largest checked dimension.
