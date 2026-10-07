# Hollow positioning arm tube

`HollowPositioningArmTube` renders a generic hollow, ribbed tube in a configurable planar
pose. The model starts at the origin along +Z, bends toward +X, then follows
the final tangent. It uses Modelprinter's hollowpositioningarmtube schema and dimensional
helpers. See [the parameter contract](https://github.com/tscircuit/modelprinter/blob/main/docs/hollowpositioningarmtube.md)
for dimensions, defaults, datums and validation.

```tsx
import { HollowPositioningArmTube, Footprinter3d } from "jscad-electronics"

<HollowPositioningArmTube
  outerDiameter={6}
  innerDiameter={4}
  startLength={38}
  endLength={112}
  bendRadius={60}
  bendAngle={90}
  ribPitch={2.25}
  ribDepth={0.25}
  color="#343943"
/>

<Footprinter3d footprint="hollowpositioningarmtube_od6mm_id4mm_start38mm_end112mm_radius60mm_angle90_pitch2.25mm_depth0.25mm" />
```

Both package entrypoints export `HollowPositioningArmTube`, `createHollowPositioningArmTubeGeom` and
`createHollowPositioningArmTubeMesh`. Model-string routing works synchronously through the
vanilla renderer and produces no PCB pads. Place the result with the assembly's
position/rotation, rather than baking lamp coordinates into the model.

The mesh is a closed annular shell with open ends. It has a smooth bore and
sinusoidal annular ribs, not a helical strip. `ribDepth: 0` gives a smooth tube;
`bendAngle: 0` gives a straight tube. It represents an installed envelope, not
flexural mechanics, supplier-certified geometry, or load capacity. Wires,
threaded end fittings and the lamp enclosure are separate parts.

The mesh factory accepts `radialSegments` (default 24) and `segmentsPerRib`
(default 4). Both must be multiples of four; supported ranges are 12–128 and
4–32 respectively. Bend tessellation bounds centerline chord error relative
to the bore and wall. Circular surfaces still have polygonal approximation
error. Requests exceeding 250,000 vertices or numerical clearance limits fail
explicitly before allocation.

The Cosmos fixture includes a reading-lamp pose, a straight ribbed arm and a
smooth U bend. Each has a labeled ISOMETRIC / TOP / FRONT / SIDE snapshot.
