# CableClamp

P-shaped cable strap with a closed circular passage and two overlapping pierced mounting tabs. Its modelprinter contract defines all fitting and mounting dimensions.

```text
cableclamp_id10mm_bandw12mm_t1mm_tab12mm_hole4mm
```

The loop axis is Y and its center is X=0, Z=innerDiameter/2+2*thickness. The passage remains a complete circle. The two tab layers occupy Z=0..2*thickness and extend toward -X, ending at X=0 beneath the loop. tabLength measures the extension beyond the loop outer radius; the vertical hole is centered on that extension. The loop outer bottom is Z=thickness and the mounting underside is Z=0. The overlapping layers are a single connected nominal solid; their cosmetic seam is omitted. No material, clamp force or cable rating is implied.

`CableClamp` is the React component; `createCableClampGeom` returns JSCAD geometry and `createCableClampMesh` returns an outward, closed indexed triangle surface. The public factories validate input with the shared modelprinter schema. Mechanical model-string routing produces no copper pads. Four-view visual tests and geometry probes cover the mounting holes and fitting openings. The band and pierced tabs are triangulated as separate adjoining surfaces and sewn along matching boundary vertices, leaving no internal seam faces.
