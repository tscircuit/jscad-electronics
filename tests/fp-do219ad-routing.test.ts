import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { do219adVariants } from "../examples/fixtures/do219ad-variants"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("DO219AD Footprinter routing preserves physical body and asymmetric terminals", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  for (const { props } of Object.values(do219adVariants)) {
    const dimensions = Object.entries(props)
      .map(
        ([dimensionName, millimeters]) =>
          `_${dimensionName.toLowerCase()}${millimeters}mm`,
      )
      .join("")
    for (const footprint of ["do219ad", `do219ad${dimensions}`]) {
      const expected =
        footprint === "do219ad"
          ? do219adVariants["Nominal outline"].props
          : props
      const models: ReturnType<typeof getComponentModel>[] = [
        getComponentModel(Footprinter3d, { footprint }),
        getJscadModelForFootprint(footprint, jscad),
      ]
      for (const model of models) {
        expect(model.geometries).toHaveLength(4)
        const solids = model.geometries.map(({ geom }) => geom)
        const [minimum, maximum] =
          jscad.measurements.measureAggregateBoundingBox(...solids)
        expect(minimum[2]).toBeCloseTo(0, 5)
        expect(maximum[0] - minimum[0]).toBeCloseTo(expected.leadSpan, 5)
        expect(maximum[1] - minimum[1]).toBeCloseTo(expected.bodyWidth, 5)
        expect(maximum[2]).toBeCloseTo(expected.bodyHeight, 5)
        const cathode = jscad.measurements.measureBoundingBox(solids[1]!)
        expect(cathode[1][0] - cathode[0][0]).toBeCloseTo(
          expected.cathodeLength,
          5,
        )
        expect(cathode[1][1] - cathode[0][1]).toBeCloseTo(
          expected.cathodeWidth,
          5,
        )
        expect(cathode[0][0]).toBeCloseTo(-expected.leadSpan / 2, 5)
        const anode = jscad.measurements.measureBoundingBox(solids[2]!)
        expect(anode[1][0] - anode[0][0]).toBeCloseTo(expected.anodeLength, 5)
        expect(anode[1][1] - anode[0][1]).toBeCloseTo(expected.anodeWidth, 5)
        expect(anode[1][0]).toBeCloseTo(expected.leadSpan / 2, 5)
      }
    }
  }
})
