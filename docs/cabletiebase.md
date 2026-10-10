# CableTieBase

Screw-mounted cable-tie anchor with two perpendicular rectangular tie tunnels. Its modelprinter contract defines all fitting and mounting dimensions.

```text
cabletiebase_w24mm_d24mm_h5mm_slotw4mm_sloth2mm_floor1mm_hole3mm
```

The rectangular base is centered in XY, underside Z=0. One tie tunnel runs the full X width and the other the full Y depth; each is slotWidth wide and slotHeight high, with its floor at Z=floorThickness. The roof thickness is height-floorThickness-slotHeight. A centered vertical fixing hole passes through floor and roof. The tunnels are open at all four sides and intersect in the middle. All edges are sharp and no adhesive layer or fastener is included.

`CableTieBase` is the React component; `createCableTieBaseGeom` returns JSCAD geometry and `createCableTieBaseMesh` returns an outward, closed indexed triangle surface. The public factories validate input with the shared modelprinter schema. Mechanical model-string routing produces no copper pads. Four-view visual tests and geometry probes cover the mounting holes and fitting openings. Boolean CSG uses a scale-dependent overcut only beyond the exterior boundary; nominal fitting surfaces stay at their contract dimensions.
