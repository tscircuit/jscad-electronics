import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { ZeeBar, createZeeBarGeom } from "../lib/models/zeebar"
import { props, source, volume } from "./fixtures/zeebar"
test("zeebar 7: React and string rendering preserve the mechanical solid", () => {
  const expected = jscad.measurements.measureVolume(createZeeBarGeom(props))
  expect(volume(getComponentModel(ZeeBar, props))).toBeCloseTo(expected, 5)
  expect(
    volume(getComponentModel(Footprinter3d, { footprint: source })),
  ).toBeCloseTo(expected, 5)
})
