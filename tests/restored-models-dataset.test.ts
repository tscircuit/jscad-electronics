import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import type { RenderResult } from "../lib/vanilla/render"
import { importVanilla } from "./fixtures/importVanilla.js"

test("exact JLC dataset strings generate restored switch and SH models", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const cases = [
    {
      part: "C2681570",
      footprint:
        "smdslideswitch7_p1mm_pw0.7mm_pl1.5mm_mounty-1.8001mm_mpx5.5001mm_mpy2.2001mm_mpw1mm_mpl0.8mm_holex1.5mm_holey-1.8001mm_holed0.9mm",
      geometryCount: 12,
      height: 1.4,
    },
    {
      part: "C431540",
      footprint:
        "smdslideswitch7_signalcols4_missing(2)_p1.5mm_pw0.6mm_pl1.524mm_mounty-2.2501mm_mpx7.1999mm_mpy2.3mm_mpw1.2mm_mpl0.7mm_holex1.5mm_holey-2.2502mm_holed0.9mm",
      geometryCount: 12,
      height: 1.5,
    },
    {
      part: "C160398",
      footprint:
        "jst12_smd_p1mm_pw0.6mm_pl1.55mm_mpx13.5999mm_mpy2.525mm_mpw1.2mm_mpl1.8mm",
      geometryCount: 15,
      height: 4.25,
    },
  ]

  for (const { part, footprint, geometryCount, height } of cases) {
    const { geometries }: RenderResult = getJscadModelForFootprint(
      footprint,
      jscad,
    )
    expect(geometries.length, part).toBe(geometryCount)
    for (const { geom } of geometries) {
      const volume = jscad.measurements.measureVolume(geom)
      expect(Number.isFinite(volume), part).toBe(true)
      expect(volume, part).toBeGreaterThan(0)
    }
    const [, max] = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map(({ geom }) => geom),
    )
    expect(max[2], part).toBeCloseTo(height, 4)
  }
})
