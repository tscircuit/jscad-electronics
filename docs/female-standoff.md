# Female hex standoff renderer

`femalestandoff_m3_af5.5mm_l10mm_hex_threadedthrough` renders a generic hexagonal
body with one continuous internal M3 thread. Its lower mounting face is Z=0 and
upper face is Z=10 mm. Both bore entrances have lead-in chamfers. Dimensions,
coarse pitch defaults, validation and flags come from modelprinter; this model
does not specify a manufacturer's material or manufacturing tolerances.

```tsx
import { FemaleStandoff, Footprinter3d } from "jscad-electronics"

<FemaleStandoff metricSize="M3" acrossFlats={5.5} length={10} />
<Footprinter3d footprint="femalestandoff_m3_af5.5mm_l10mm_hex_threadedthrough" />
```

`createFemaleStandoffMesh(props, options)` returns indexed outward triangles in
millimeters. `createFemaleStandoffGeom(props, options)` converts them to a JSCAD
solid. Both factories and the React component are exported by the main and
vanilla entrypoints. A `color` prop changes the component's material.

The nominal 60-degree internal helix supports left-hand and explicit fine pitch
from the shared contract. `showThreads: false` retains the nominal minor bore
and chamfered entrances with a simpler smooth mesh. The closed manifold contains
no surfaces across the through bore. Outer chamfers scale the hex profile at
both end faces. Mechanical model-string routing generates no PCB pads.

Tessellation defaults to 48 radial segments and 16 axial segments per pitch;
optional `radialSegments` must be a multiple of 12 in [24,192], and
`segmentsPerPitch` an integer in [8,64]. More than 24,000 axial segments is
rejected before allocation. These controls alter tessellation only.

`tests/snapshots/female-standoff.test.ts` and its checked-in PNG cover the exact
model string in labeled ISOMETRIC, TOP, FRONT and SIDE views. Geometry tests
cover thread hand and pitch, open bore, outward manifold topology, chamfers,
Z datums, direct React rendering, string routing, built vanilla exports and pads.
