# FlatHeadScrew geometry

This renderer consumes modelprinter's exported flat-head screw contract. modelprinter owns the parser, dimension tables, defaults and validation; this repository owns the indexed mesh, JSCAD Geom3 factory, React/vanilla component and four-view poppygl snapshot.

`createFlatHeadScrewMesh` and `createFlatHeadScrewGeom` accept the exported modelprinter props schema inputs. `FlatHeadScrew` also accepts a color. Footprinter3d dispatches the full `flatheadscrew` string, and ExtrudedPads validates it then returns no electrical pads. Datums and dimensions follow the modelprinter contract unchanged. All supported M3/M4/M5/M6 sizes are validated by modelprinter.

The surface is welded and outward-oriented. Threads use the specified single-start phase, handedness, flattened ISO flank profile and tip clipping; hidden threads retain major shank diameter. The under-head radius is a sampled tangent circular blend. Head/drive geometry is sampled independently of thread visibility. No schema defaults or dimension tables are duplicated here.

`radialSegments` defaults to 96 and must be a multiple of 24 between 24 and 192. `threadStepsPerTurn` defaults to 24 and must be an integer between 24 and 96. Meshes above 400,000 sampled vertices fail before allocation. Higher resolution improves faceting without altering the nominal profile.

ISO 10642:2019 is the default contract; the optional value-free `_iso10642` flag selects identical geometry and normalizes to `iso10642: true`. The four-view snapshot labels the complete string: `flatheadscrew_m3_l10mm_drive(hexsocket)`. Unit checks cover manifold edge incidence/winding, finite vertices, positive volume, datums, both handednesses, visibility, supported sizes, guard limits, direct React/vanilla geometry and footprint dispatch.

The renderer registry consumes this contract and its other model contracts
from the prepared modelprinter source bundle.
