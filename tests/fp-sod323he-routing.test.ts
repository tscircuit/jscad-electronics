import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { sod323heVariants } from "../examples/fixtures/sod323he-variants"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("SOD323HE Footprinter routing preserves authored mechanical dimensions", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  for (const { props } of Object.values(sod323heVariants)) {
    const footprint =
      "sod323he" +
      Object.entries(props)
        .map(
          ([dimensionName, millimeters]) =>
            `_${dimensionName.toLowerCase()}${millimeters}mm`,
        )
        .join("")
    const models: ReturnType<typeof getComponentModel>[] = [
      getComponentModel(Footprinter3d, { footprint }),
      getJscadModelForFootprint(footprint, jscad),
    ]
    for (const model of models) {
      expect(model.geometries).toHaveLength(4)
      const solids = model.geometries.map(({ geom }) => geom)
      const [minimum, maximum] = jscad.measurements.measureAggregateBoundingBox(
        ...solids,
      )
      expect(minimum[2]).toBeCloseTo(0, 5)
      expect(maximum[0] - minimum[0]).toBeCloseTo(props.leadSpan, 5)
      expect(maximum[1] - minimum[1]).toBeCloseTo(props.bodyWidth, 5)
      expect(maximum[2]).toBeCloseTo(props.bodyHeight, 5)
      const body = jscad.measurements.measureBoundingBox(solids[0]!)
      expect(body[1][0] - body[0][0]).toBeCloseTo(props.bodyLength, 5)
      expect(body[0][2]).toBeCloseTo(props.standoff, 5)
      for (const terminal of solids.slice(1, 3)) {
        const [terminalMinimum, terminalMaximum] =
          jscad.measurements.measureBoundingBox(terminal)
        expect(terminalMaximum[0] - terminalMinimum[0]).toBeCloseTo(
          props.cathodeLength,
          5,
        )
        expect(terminalMaximum[1] - terminalMinimum[1]).toBeCloseTo(
          props.cathodeWidth,
          5,
        )
        expect(terminalMaximum[2]).toBeCloseTo(props.terminalThickness, 5)
      }
    }
  }
})
