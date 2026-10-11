import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import {
  PerforatedAngle,
  createPerforatedAngleGeom,
} from "../lib/models/perforatedangle"
import { props, source, volume } from "./fixtures/perforatedangle"
test("perforatedangle 7: React and string rendering preserve the mechanical solid", () => {
  const expected = jscad.measurements.measureVolume(
    createPerforatedAngleGeom(props),
  )
  expect(volume(getComponentModel(PerforatedAngle, props))).toBeCloseTo(
    expected,
    5,
  )
  expect(
    volume(getComponentModel(Footprinter3d, { footprint: source })),
  ).toBeCloseTo(expected, 5)
})
