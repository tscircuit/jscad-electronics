import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("preserves the legacy DFN width and default body length", async () => {
  const footprint = "dfn8_w5.3mm_p1.27mm"
  const { getJscadModelForFootprint } = await importVanilla()
  const reactModel = getComponentModel(Footprinter3d, { footprint })
  const vanillaModel = getJscadModelForFootprint(footprint, jscad)

  for (const model of [reactModel, vanillaModel]) {
    const [minimum, maximum] = jscad.measurements.measureBoundingBox(
      model.geometries[0]!.geom,
    )
    expect(maximum[0] - minimum[0]).toBeCloseTo(5.3, 5)
    expect(maximum[1] - minimum[1]).toBeCloseTo(5.3, 5)
  }
})
