import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getPcbRailDimensions } from "@tscircuit/modelprinter"
import {
  createPcbRailGeom,
  createPcbRailMesh,
} from "../lib/models/pcbrail/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/pcbrail-example"

test("pcbrail exact mounting datum and bounds", () => {
  const geom = createPcbRailGeom(p),
    d = getPcbRailDimensions(p)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  for (let i = 0; i < 2; i++)
    for (let axis = 0; axis < 3; axis++)
      expect(bounds[i]![axis]).toBeCloseTo(d.bounds[i]![axis]!, 7)
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  expect(() => createPcbRailGeom({ ...p, length: 0 })).toThrow()
})
