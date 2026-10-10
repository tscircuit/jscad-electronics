# SplitGrommet

```text
splitgrommet_panelhole25mm_id12mm_od30mm_h9mm_groovew3mm_grooved2.5mm_split1mm
```

Split cable protection ring centered on XY and the panel midplane Z=0. A square-shouldered groove occupies Z=-grooveWidth/2 through +grooveWidth/2 and fits the stated panel hole. A constant-width slit opens toward +X from the bore through both flanges. Height spans -height/2 to +height/2; all dimensions are nominal custom geometry.

The mesh sweeps its annular meridian around 128 angular intervals. Each meridian radius uses a different terminal angle so both slit faces remain exactly at Y=±splitWidth/2. Shared cardinal columns retain the nominal -X and ±Y bounds. The +X bound is reduced by the slit to sqrt((OD/2)^2-(splitWidth/2)^2). Slit ends are triangulated caps, giving one closed connected solid without coincident internal faces.

`SplitGrommet`, `createSplitGrommetGeom`, and `createSplitGrommetMesh` export from the React and vanilla entrypoints. The renderer consumes modelprinter schemas and dimension helpers, rejects geometry below its relative mesh resolution, and emits no PCB pads. Public component color may be overridden.
