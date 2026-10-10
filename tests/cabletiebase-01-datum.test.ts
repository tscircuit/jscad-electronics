import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableTieBaseDimensions } from "@tscircuit/modelprinter"
import {
  createCableTieBaseGeom,
  createCableTieBaseMesh,
} from "../lib/models/cabletiebase/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/cabletiebase-example"

test("cabletiebase exact mounting datum and bounds", () => {
  const geom = createCableTieBaseGeom(p),
    d = getCableTieBaseDimensions(p)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  for (let i = 0; i < 2; i++)
    for (let axis = 0; axis < 3; axis++)
      expect(bounds[i]![axis]).toBeCloseTo(d.bounds[i]![axis]!, 7)
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  expect(() => createCableTieBaseGeom({ ...p, width: 0 })).toThrow()
})
