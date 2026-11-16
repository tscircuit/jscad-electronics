import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

test("TQFP and LQFP Footprinter routing honors pin count, pitch, and body dimensions", async () => {
  const { getJscadModelForFootprint } = await importVanilla()

  const footprints = [
    { footprint: "tqfp32", expectedPins: 32 },
    { footprint: "tqfp32_w7_h7_p0.8mm", expectedPins: 32 },
    { footprint: "tqfp48", expectedPins: 48 },
    { footprint: "tqfp64", expectedPins: 64 },
    { footprint: "tqfp100", expectedPins: 100 },
    { footprint: "tqfp32_w7_h9_p0.8mm", expectedPins: 32 },
    { footprint: "lqfp32_w7_h7_p0.8mm", expectedPins: 32 },
    { footprint: "lqfp48_w7_h7_p0.5mm", expectedPins: 48 },
    { footprint: "lqfp64_w10_h12_p0.5mm", expectedPins: 64 },
  ]

  for (const { footprint, expectedPins } of footprints) {
    const pads = fp
      .string(footprint)
      .circuitJson()
      .filter((el) => el.type === "pcb_smtpad" && el.shape === "rect")
    expect(pads).toHaveLength(expectedPins)

    const padMinX = Math.min(...pads.map((p) => p.x - p.width / 2))
    const padMaxX = Math.max(...pads.map((p) => p.x + p.width / 2))
    const padMinY = Math.min(...pads.map((p) => p.y - p.height / 2))
    const padMaxY = Math.max(...pads.map((p) => p.y + p.height / 2))

    const models = [
      getComponentModel(Footprinter3d, { footprint }),
      getJscadModelForFootprint(footprint, jscad),
    ]

    for (const model of models) {
      // 4N leads + 1 ChipBody
      expect(model.geometries).toHaveLength(expectedPins + 1)

      const leadSolids = model.geometries
        .slice(0, expectedPins)
        .map((g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom)
      const [leadMin, leadMax] = jscad.measurements.measureAggregateBoundingBox(
        ...leadSolids,
      )

      // Outer lead tips sit within the copper pad envelope on all four sides
      expect(leadMin[0]).toBeGreaterThanOrEqual(padMinX - 0.15)
      expect(leadMin[0]).toBeLessThanOrEqual(padMinX + 1.0)
      expect(leadMax[0]).toBeLessThanOrEqual(padMaxX + 0.15)
      expect(leadMax[0]).toBeGreaterThanOrEqual(padMaxX - 1.0)

      expect(leadMin[1]).toBeGreaterThanOrEqual(padMinY - 0.15)
      expect(leadMin[1]).toBeLessThanOrEqual(padMinY + 1.0)
      expect(leadMax[1]).toBeLessThanOrEqual(padMaxY + 0.15)
      expect(leadMax[1]).toBeGreaterThanOrEqual(padMaxY - 1.0)

      const bodySolid = model.geometries[expectedPins]!.geom
      const [bodyMin, bodyMax] =
        jscad.measurements.measureBoundingBox(bodySolid)
      const fpParams = fp.string(footprint).json() as unknown as {
        w: number
        h: number
      }
      expect(bodyMax[0] - bodyMin[0]).toBeCloseTo(fpParams.w, 2)
      expect(bodyMax[1] - bodyMin[1]).toBeCloseTo(fpParams.h, 2)
    }
  }
})
