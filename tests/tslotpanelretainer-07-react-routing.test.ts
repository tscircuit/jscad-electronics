import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import {
  TSlotPanelRetainer,
  createTSlotPanelRetainerGeom,
} from "../lib/models/tslotpanelretainer"
import { props, source, volume } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 7: React and string rendering preserve the mechanical solid", () => {
  const expected = jscad.measurements.measureVolume(
    createTSlotPanelRetainerGeom(props),
  )
  expect(volume(getComponentModel(TSlotPanelRetainer, props))).toBeCloseTo(
    expected,
    5,
  )
  expect(
    volume(getComponentModel(Footprinter3d, { footprint: source })),
  ).toBeCloseTo(expected, 5)
})
