import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { KeyWasher, createKeyWasherGeom } from "../lib/models/keywasher"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { keyWasherProps, keyWasherSource } from "./fixtures/keywasher-example"
test("keywasher React and model-string dispatch preserve the same geometry", () => {
  const volume = jscad.measurements.measureVolume(
    createKeyWasherGeom(keyWasherProps),
  )
  for (const result of [
    getComponentModel(KeyWasher, keyWasherProps),
    getComponentModel(Footprinter3d, { footprint: keyWasherSource }),
  ]) {
    expect(result.geometries.length).toBe(1)
    expect(
      jscad.measurements.measureVolume(result.geometries[0]!.geom),
    ).toBeCloseTo(volume, 6)
  }
})
