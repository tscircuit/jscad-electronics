import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableClampDimensions } from "@tscircuit/modelprinter"
import {
  createCableClampGeom,
  createCableClampMesh,
} from "../lib/models/cableclamp/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/cableclamp-example"

test("cableclamp exact mounting datum and bounds", () => {
  const geom = createCableClampGeom(p),
    d = getCableClampDimensions(p)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  for (let i = 0; i < 2; i++)
    for (let axis = 0; axis < 3; axis++)
      expect(bounds[i]![axis]).toBeCloseTo(d.bounds[i]![axis]!, 7)
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  expect(() => createCableClampGeom({ ...p, innerDiameter: 0 })).toThrow()
})
