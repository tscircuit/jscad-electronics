# RectangularGasket

```text
rectangulargasket_w80mm_h50mm_border5mm_t2mm_cornerr5mm_flatframe
```

Closed rounded rectangular flat seal centered on XY, with mating face Z=0 and top Z=thickness. Width and height are outside XY extents; border is the straight-side setback of the inner opening. The inner corner radius is max(0, outer corner radius minus border), giving concentric rounded corners when the border is thinner than the radius and square inner corners otherwise.

Rounded outside and inside profiles use 32 intervals per quadrant, with a square inner opening when cornerRadius≤border. The frame is extruded as one indexed shell without internal seams. Straight dimensions and Z datums are exact; circular corners are polygonal approximations.

`RectangularGasket`, `createRectangularGasketGeom`, and `createRectangularGasketMesh` export from the React and vanilla entrypoints. The renderer consumes modelprinter schemas and dimension helpers, rejects geometry below its relative mesh resolution, and emits no PCB pads. Public component color may be overridden.
