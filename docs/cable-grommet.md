# Cable grommet geometry

`CableGrommet`, `createCableGrommetGeom`, and `createCableGrommetMesh` consume
the `@tscircuit/modelprinter` cable-grommet contract. Its parser, dimensions,
validation and groove-root helper remain in that package.

The dependency and lockfile pin the [compatible immutable preview](https://pkg.pr.new/tscircuit/modelprinter/@tscircuit/modelprinter@dfafe559c55795d2e996637abfb0cf59c223d240)
of [modelprinter PR #31](https://github.com/tscircuit/modelprinter/pull/31)
at commit `dfafe559c55795d2e996637abfb0cf59c223d240`, including upstream FlexScreen contact and tail parsing.

```
cablegrommet_panelhole20mm_id10mm_od24mm_h8mm_groovew3mm_grooved2mm_shape(symmetricring)
```

`Footprinter3d` and the vanilla footprint helpers render this string without
PCB pads. Direct mesh/Geom3 factories and the component are exported from the
main and vanilla entrypoints. The ring has a constant open bore, two equal
flanges, square annular shoulders, and a centered groove about Z = 0. The
actual groove-root radius is consumed from modelprinter's dimensions helper.

The mesh revolves the full radial/axial section with shared indexed vertices
and outward triangles. Circular faceting defaults to 96 segments; an optional
second mesh-factory argument `{ radialSegments }` requests a minimum multiple
of four in [12,4096]. Thin groove walls trigger refinement so outside chord
interiors remain beyond the nominal bore. Requests requiring more than 4096
segments fail before allocation. These are renderer resolution controls, not
new physical model parameters.

The four-view PoppyGL snapshot shows the full example string, bore, symmetric
flanges and recessed panel interface. Geometry tests check oriented topology,
positive volume, groove/end planes, radial sections, an unobstructed bore,
thin-wall refinement, and React/vanilla routing parity.
