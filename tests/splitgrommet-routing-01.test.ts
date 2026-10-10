import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  SplitGrommet,
  createSplitGrommetGeom,
} from "../lib/models/splitgrommet"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import {
  splitGrommetProps,
  splitGrommetSource,
} from "./fixtures/splitgrommet-example"
test("splitgrommet React and model-string dispatch preserve the same geometry", () => {
  const volume = jscad.measurements.measureVolume(
    createSplitGrommetGeom(splitGrommetProps),
  )
  for (const result of [
    getComponentModel(SplitGrommet, splitGrommetProps),
    getComponentModel(Footprinter3d, { footprint: splitGrommetSource }),
  ]) {
    expect(result.geometries.length).toBe(1)
    expect(
      jscad.measurements.measureVolume(result.geometries[0]!.geom),
    ).toBeCloseTo(volume, 6)
  }
})
