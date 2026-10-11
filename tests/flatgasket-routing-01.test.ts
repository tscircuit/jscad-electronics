import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { FlatGasket, createFlatGasketGeom } from "../lib/models/flatgasket"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import {
  flatGasketProps,
  flatGasketSource,
} from "./fixtures/flatgasket-example"
test("flatgasket React and model-string dispatch preserve the same geometry", () => {
  const volume = jscad.measurements.measureVolume(
    createFlatGasketGeom(flatGasketProps),
  )
  for (const result of [
    getComponentModel(FlatGasket, flatGasketProps),
    getComponentModel(Footprinter3d, { footprint: flatGasketSource }),
  ]) {
    expect(result.geometries.length).toBe(1)
    expect(
      jscad.measurements.measureVolume(result.geometries[0]!.geom),
    ).toBeCloseTo(volume, 6)
  }
})
