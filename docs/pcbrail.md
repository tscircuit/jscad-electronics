# PcbRail

L-section PCB edge rail with a horizontal board groove and pierced mounting tabs at both ends. Its modelprinter contract defines all fitting and mounting dimensions.

```text
pcbrail_l80mm_w12mm_h8mm_wall3mm_floor2mm_slotw1.8mm_slotd2mm_slotz4mm_tabl8mm_tabw8mm_hole3mm_hp88mm
```

The rail length is along X, centered at the origin; width is Y and underside is Z=0. The vertical wall lies along the -Y edge. A horizontal groove runs through the entire length, opens toward +Y, extends slotDepth into the wall, and occupies Z=slotBottomZ..slotBottomZ+slotWidth. The flat floor supports a horizontal board extending toward +Y. Two tabs extend tabLength beyond the body ends at ±X; each has tabWidth along Y and floorThickness along Z. Their vertical bores are centered at X=±holePitch/2, Y=0. Hole pitch measures the mounting centers, not the body length. No board or mounting screws are included.

`PcbRail` is the React component; `createPcbRailGeom` returns JSCAD geometry and `createPcbRailMesh` returns an outward, closed indexed triangle surface. The public factories validate input with the shared modelprinter schema. Mechanical model-string routing produces no copper pads. Four-view visual tests and geometry probes cover the mounting holes and fitting openings. Boolean CSG uses a scale-dependent overcut only beyond the exterior boundary; nominal fitting surfaces stay at their contract dimensions.
