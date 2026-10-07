# PanScrew geometry

This renderer consumes [modelprinter PR #38](https://github.com/tscircuit/modelprinter/pull/38) through the published `@tscircuit/modelprinter@0.0.14` dependency. modelprinter owns the parser, dimension tables, defaults and validation; this repository owns the indexed mesh, JSCAD Geom3 factory, React/vanilla component and four-view poppygl snapshot.

`createPanScrewMesh` and `createPanScrewGeom` accept the exported modelprinter props schema inputs. `PanScrew` also accepts a color. Footprinter3d dispatches the full `panscrew` string, and ExtrudedPads validates it then returns no electrical pads. Datums and dimensions follow the modelprinter contract unchanged. All supported M3/M4/M5/M6 sizes are validated by modelprinter.

The surface is welded and outward-oriented. Threads use the specified single-start phase, handedness, flattened ISO flank profile and tip clipping; hidden threads retain major shank diameter. The under-head radius is a sampled tangent circular blend. Head/drive geometry is sampled independently of thread visibility. No schema defaults or dimension tables are duplicated here.

The ISO 4757 type-H recess combines the 26.5° outer wing and 28° bottom cone with four tapered corner cuts using the exported b/e/g/alpha/beta symbols. Its specified r rounds the wing mouth with a circle tangent to the spherical crown and outer wing. The compound-cone g junction remains sharp. The ISO 7045 m dimension and its crown reference plane describe the theoretical unrounded gauge construction; they do not limit the rounded mouth diameter. The tabulated f and t1 are reference/check dimensions rather than independent adjustments to this construction. Corner cuts trim the rounded entry at their actual intersections, with bypassed circular rows welded to avoid overlapping planar wall strips.

`radialSegments` defaults to 96 and must be a multiple of 24 between 24 and 192. `threadStepsPerTurn` defaults to 24 and must be an integer between 24 and 96. Meshes above 400,000 sampled vertices fail before allocation. Higher resolution improves faceting without altering the nominal profile.

The four-view snapshot labels the complete roadmap string: `panscrew_standard(iso7045)_m3_l10mm_drive(phillips)`. Unit checks cover manifold edge incidence/winding, finite vertices, positive volume, datums, both handednesses, visibility, supported sizes, guard limits, direct React/vanilla geometry and footprint dispatch.

The renderer registry consumes this contract and its other model contracts
from the same published modelprinter release.
