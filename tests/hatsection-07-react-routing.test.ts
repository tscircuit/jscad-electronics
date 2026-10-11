import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { HatSection, createHatSectionGeom } from "../lib/models/hatsection"
import { props, source, volume } from "./fixtures/hatsection"
test("hatsection 7: React and string rendering preserve the mechanical solid", () => {
  const expected = jscad.measurements.measureVolume(createHatSectionGeom(props))
  expect(volume(getComponentModel(HatSection, props))).toBeCloseTo(expected, 5)
  expect(
    volume(getComponentModel(Footprinter3d, { footprint: source })),
  ).toBeCloseTo(expected, 5)
})
