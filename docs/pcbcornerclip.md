# PcbCornerClip

PCB corner support with two perpendicular edge grooves and a central base mounting hole. Its modelprinter contract defines all fitting and mounting dimensions.

```text
pcbcornerclip_w16mm_d16mm_h8mm_wall3mm_floor2mm_board1.6mm_lip2mm_slotz3mm_hole3mm
```

The flat base is centered in XY, underside Z=0. Walls occupy the -X and -Y edges. Their inward-facing horizontal board grooves are grooveDepth deep and boardThickness high, starting at slotBottomZ. These meet at the inner corner to accept the two adjacent edges of a horizontal board. The board corner is at X=-width/2+wallThickness-grooveDepth, Y=-depth/2+wallThickness-grooveDepth. A centered vertical hole pierces only the floor; its bore clears both walls. The wall and upper lip remain continuous behind the grooves. All corners are square. This is an explicit custom fit, not a claim about a standard PCB thickness or tolerance.

`PcbCornerClip` is the React component; `createPcbCornerClipGeom` returns JSCAD geometry and `createPcbCornerClipMesh` returns an outward, closed indexed triangle surface. The public factories validate input with the shared modelprinter schema. Mechanical model-string routing produces no copper pads. Four-view visual tests and geometry probes cover the mounting holes and fitting openings. Boolean CSG uses a scale-dependent overcut only beyond the exterior boundary; nominal fitting surfaces stay at their contract dimensions.
