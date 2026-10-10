import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  RectangularGasket,
  createRectangularGasketGeom,
} from "../lib/models/rectangulargasket"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import {
  rectangularGasketProps,
  rectangularGasketSource,
} from "./fixtures/rectangulargasket-example"
test("rectangulargasket React and model-string dispatch preserve the same geometry", () => {
  const volume = jscad.measurements.measureVolume(
    createRectangularGasketGeom(rectangularGasketProps),
  )
  for (const result of [
    getComponentModel(RectangularGasket, rectangularGasketProps),
    getComponentModel(Footprinter3d, { footprint: rectangularGasketSource }),
  ]) {
    expect(result.geometries.length).toBe(1)
    expect(
      jscad.measurements.measureVolume(result.geometries[0]!.geom),
    ).toBeCloseTo(volume, 6)
  }
})
