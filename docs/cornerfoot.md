# CornerFoot

```text
cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm_base3mm_cornercup
```

Square or rectangular corner foot centered on XY. Base mounting face is Z=0; the supported member sits at Z=baseThickness. Two perpendicular locating walls occupy the negative-X and negative-Y outside edges and reach Z=height. The stated seat starts at their inside corner. One central fixing hole at X=Y=0 passes through the base only. Base thickness defaults to the wall thickness. No rounded exterior or inferred load rating.

The base, two perpendicular locating walls, and through-hole wall are sewn into one closed indexed shell. Only exposed surface patches are emitted; adjoining patches share vertices without coincident internal faces. The central fixing hole passes through the base and leaves both locating walls intact. Planar datums are exact and the hole uses 128 circular segments. The clear seat receives a supported rectangular member against the negative-X and negative-Y inside faces.

`CornerFoot`, `createCornerFootGeom`, and `createCornerFootMesh` export from the React and vanilla entrypoints. The renderer consumes modelprinter schemas and dimension helpers, rejects geometry below its relative mesh resolution, and emits no PCB pads. Public component color may be overridden.
