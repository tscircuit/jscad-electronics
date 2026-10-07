# Thrust ball bearing renderer

`ThrustBallBearing` renders the generic
`thrustballbearing_id10mm_od24mm_h9mm` contract through the generated registry.
Both main and vanilla entrypoints export the component, indexed mesh/part
factories, and `createThrustBallBearingGeoms`. The Cosmos fixture uses the full
model string through `Footprinter3d`, and mechanical registration supplies no
electronic pads. Explicit circuit JSON still follows the common pads path.

The modelprinter contract owns dimensional validation and all nominal internal
dimensions; this renderer imports them rather than duplicating tables. The
10 × 24 × 9 mm default matches the standard 51100 external envelope. Grooves,
balls and cage are illustrative internals, without manufacturer-specific names,
fits or rating claims. The two washers intentionally share the supplied bore
and outside diameter; their mounting faces are Z=0 and Z=height. The through
bore remains open throughout. Balls begin on +X and progress counterclockwise.

The washer facing surface contains the specified circular concave race groove;
the upper washer mirrors the lower. Each washer is a closed indexed surface,
the cage has actual round through pockets, and each ball is a separate closed
sphere. Nominal clearances keep these solids separated, so union/repair is not
needed before vanilla or GLTF conversion. Surface subdivision is explicit and
bounded: `segments` defaults to 96 and must be a multiple of four from 24 to
192. Groove sections use 24 arc intervals; ball longitude uses half the washer
segments rounded down to a multiple of four, at least 24, with half as many
latitude intervals. Cage pockets use one quarter of the washer segments,
at least 12, so their polygonal opening retains clearance around each ball.
The cage polygon's incircle must contain the full pocket circles with a
floating-point clearance margin. Thin custom envelopes that fail this check
raise a mesh resolution error before allocation; increase `segments` or widen
the envelope. This renderer guard preserves the broader modelprinter contract.

The four-view snapshot covers the assembled default, including the real open
bore and exposed ball/cage band. Topology tests verify outward closed shells,
race curvature, mounting datums, separate cage pockets, positive volumes and
synchronous React/vanilla/full-string routing. This source-only renderer change
is coordinated with the modelprinter contract preview by the shared dependency
bridge; individual model PRs remain separate review units.
