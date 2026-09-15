import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { bodyDimensionFootprints } from "../examples/fixtures/footprinter-body-dimensions"
test("ssop maps registered body axes into React and vanilla geometry", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const [w, h, t] of [
    [5.3, 10.2, 1.85],
    [6, 11, 0.8],
  ]) {
    const prefix = bodyDimensionFootprints.SSOP.split("_bodywidth")[0]
    const footprint = `${prefix}_bodywidth${w}mm_bodyheight${h}mm_bodythickness${t}mm`
    expect(fp.string(footprint).json()).toMatchObject({
      bodywidth: w,
      bodyheight: h,
      bodythickness: t,
    })
    const react = getComponentModel(Footprinter3d, {
      footprint,
    }).geometries.map((g) => g.geom)
    const vanilla = get(footprint, jscad).geometries.map((g: any) => g.geom)
    expect(vanilla.length).toBe(react.length)
    for (const solids of [react, vanilla]) {
      const [lo, hi] = jscad.measurements.measureBoundingBox(solids[0]!)
      expect(hi[0] - lo[0]).toBeCloseTo(w!, 5)
      expect(hi[1] - lo[1]).toBeCloseTo(h!, 5)
      expect(hi[2] - lo[2]).toBeCloseTo(t!, 5)
      expect(
        solids.every((s: any) => jscad.measurements.measureVolume(s) > 0),
      ).toBe(true)
    }
  }
})
