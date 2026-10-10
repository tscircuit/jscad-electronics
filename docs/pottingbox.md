# PottingBox

Open rectangular potting cup with two pierced floor-level mounting ears. Its modelprinter contract defines all fitting and mounting dimensions.

```text
pottingbox_w60mm_d40mm_h25mm_wall1.5mm_floor1.5mm_earl10mm_earw12mm_hole3mm_hp70mm
```

The outer cup is centered in XY, its floor underside at Z=0 and open rim at Z=height. Cavity dimensions are width-2*wallThickness by depth-2*wallThickness by height-floorThickness. Two rectangular ears project earLength beyond the ±X walls, centered on Y=0, with earWidth along Y and floorThickness along Z. Their vertical fixing bores lie at X=±holePitch/2, Y=0. All radii and chamfers are zero. No lid, potting compound, electronics or mounting screws are included.

`PottingBox` is the React component; `createPottingBoxGeom` returns JSCAD geometry and `createPottingBoxMesh` returns an outward, closed indexed triangle surface. The public factories validate input with the shared modelprinter schema. Mechanical model-string routing produces no copper pads. Four-view visual tests and geometry probes cover the mounting holes and fitting openings. Boolean CSG uses a scale-dependent overcut only beyond the exterior boundary; nominal fitting surfaces stay at their contract dimensions.
