import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { CornerFoot, createCornerFootGeom } from "../lib/models/cornerfoot"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import {
  cornerFootProps,
  cornerFootSource,
} from "./fixtures/cornerfoot-example"
test("cornerfoot React and model-string dispatch preserve the same geometry", () => {
  const volume = jscad.measurements.measureVolume(
    createCornerFootGeom(cornerFootProps),
  )
  for (const result of [
    getComponentModel(CornerFoot, cornerFootProps),
    getComponentModel(Footprinter3d, { footprint: cornerFootSource }),
  ]) {
    expect(result.geometries.length).toBe(1)
    expect(
      jscad.measurements.measureVolume(result.geometries[0]!.geom),
    ).toBeCloseTo(volume, 6)
  }
})
