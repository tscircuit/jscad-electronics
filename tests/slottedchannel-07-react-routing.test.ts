import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import {
  SlottedChannel,
  createSlottedChannelGeom,
} from "../lib/models/slottedchannel"
import { props, source, volume } from "./fixtures/slottedchannel"
test("slottedchannel 7: React and string rendering preserve the mechanical solid", () => {
  const expected = jscad.measurements.measureVolume(
    createSlottedChannelGeom(props),
  )
  expect(volume(getComponentModel(SlottedChannel, props))).toBeCloseTo(
    expected,
    5,
  )
  expect(
    volume(getComponentModel(Footprinter3d, { footprint: source })),
  ).toBeCloseTo(expected, 5)
})
