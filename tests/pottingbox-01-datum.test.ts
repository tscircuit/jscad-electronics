import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getPottingBoxDimensions } from "@tscircuit/modelprinter"
import {
  createPottingBoxGeom,
  createPottingBoxMesh,
} from "../lib/models/pottingbox/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/pottingbox-example"

test("pottingbox exact mounting datum and bounds", () => {
  const geom = createPottingBoxGeom(p),
    d = getPottingBoxDimensions(p)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  for (let i = 0; i < 2; i++)
    for (let axis = 0; axis < 3; axis++)
      expect(bounds[i]![axis]).toBeCloseTo(d.bounds[i]![axis]!, 7)
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  expect(() => createPottingBoxGeom({ ...p, width: 0 })).toThrow()
})
