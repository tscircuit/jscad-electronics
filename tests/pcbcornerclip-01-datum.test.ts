import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getPcbCornerClipDimensions } from "@tscircuit/modelprinter"
import {
  createPcbCornerClipGeom,
  createPcbCornerClipMesh,
} from "../lib/models/pcbcornerclip/geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { source, p } from "./fixtures/pcbcornerclip-example"

test("pcbcornerclip exact mounting datum and bounds", () => {
  const geom = createPcbCornerClipGeom(p),
    d = getPcbCornerClipDimensions(p)
  const bounds = jscad.measurements.measureBoundingBox(geom)
  for (let i = 0; i < 2; i++)
    for (let axis = 0; axis < 3; axis++)
      expect(bounds[i]![axis]).toBeCloseTo(d.bounds[i]![axis]!, 7)
  expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  expect(() => createPcbCornerClipGeom({ ...p, width: 0 })).toThrow()
})
