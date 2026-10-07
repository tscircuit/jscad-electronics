# Finned heatsink

The parameter contract and dimensional datums are defined in modelprinter;
this renderer consumes its schema. Model strings route through both React
`Footprinter3d` and synchronous vanilla entrypoints. These mechanical models
produce no PCB pads.

`FinnedHeatsink`, `createFinnedHeatsinkGeom` and `createFinnedHeatsinkMesh` expose
a single indexed comb extrusion. The mounting plane is Z=0, width is X, fins
run along Y, and height includes the base. Intermediate slots have equal gaps;
the first/last fins are flush with the edges. No overlapping cuboids or internal
seam faces are used. Resolution checks reject features below 1e-10 of the largest
envelope dimension. No thermal rating, fillets or mounting hardware is implied.

Two checked-in four-view PNGs cover the example variants. Their full model
strings, ISOMETRIC / TOP / FRONT / SIDE labels and datums are drawn by the shared
`renderModelSnapshot` helper. Update intentionally with
`BUN_UPDATE_SNAPSHOTS=1 bun test tests/snapshots/finnedheatsink-` and run again without
that variable to verify. The Cosmos example exposes the same strings.
