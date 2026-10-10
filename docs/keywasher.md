# KeyWasher

```text
keywasher_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1_inward
```

Custom annular key washer centered on XY, bottom Z=0 and top Z=thickness. One rectangular tab on +X projects inward from the nominal circular bore to X=innerDiameter/2-tabLength. Tab width is along Y and the tab root overlaps the annular body. tabLength is measured radially at the tab centerline. No supplier standard is claimed.

The outside ring uses 128 circular segments. The bore follows a circular arc around three cardinal directions and closes along the two tab sides and inward tip. This changes the bore itself rather than layering a disconnected tab solid. The tab never extends beyond the stated outside diameter.

`KeyWasher`, `createKeyWasherGeom`, and `createKeyWasherMesh` export from the React and vanilla entrypoints. The renderer consumes modelprinter schemas and dimension helpers, rejects geometry below its relative mesh resolution, and emits no PCB pads. Public component color may be overridden.
