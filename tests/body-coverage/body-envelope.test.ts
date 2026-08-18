import { test, expect } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { importVanilla } from "../fixtures/importVanilla.js"
import { NOMINAL_HEIGHT_MM, probeFor } from "./footprint-probes"

/**
 * A body exists so that something can MEASURE it. `core`'s
 * `measureFootprinterBody` takes the top of this bounding box and hands it to
 * `create-fdm-enclosure`, which decides whether a screw boss or a lid column
 * runs through the part.
 *
 * So "renders something" is not the property that matters — "is the right
 * height" is. A picture cannot check that; this can. The heights come from
 * `NOMINAL_HEIGHT_MM`, the same table the render camera frames with, so a body
 * cannot pass here while being photographed as though it were another size.
 *
 * What this can and cannot see: it takes the top of the model's bounding box,
 * so it catches a body that is missing, floating, half-scale or sunk — every
 * failure this suite has actually had. It cannot tell a short body held up by
 * a tall lead from a correct one; body-outline.test.ts covers the X/Y of the
 * body solid itself, and the underside renders cover the rest.
 */
const TOLERANCE = 0.25

/**
 * Footprints with no body yet — covered by the ledger, not by this test.
 */
const NO_BODY_YET = ["jst", "m2host", "usbcmidmount"]

const measureHeight = (geometries: Array<{ geom: unknown }>): number => {
  const [, maxCorner] = jscadModeling.measurements.measureAggregateBoundingBox(
    ...geometries.map(({ geom }) => geom as never),
  )
  return maxCorner[2]!
}

test("a body's height above the board matches the package", async () => {
  const { getJscadModelForFootprint } = await importVanilla()

  const wrong: Record<string, string> = {}
  for (const [name, nominal] of Object.entries(NOMINAL_HEIGHT_MM)) {
    if (NO_BODY_YET.includes(name)) continue
    const { geometries } = getJscadModelForFootprint(
      probeFor(name),
      jscadModeling,
    )
    if (!geometries.length) {
      wrong[name] = "no geometry"
      continue
    }
    const height = measureHeight(geometries)
    const min = nominal * (1 - TOLERANCE)
    const max = nominal * (1 + TOLERANCE)
    if (!(height >= min && height <= max)) {
      wrong[name] =
        `${height.toFixed(2)}mm, expected ${min.toFixed(2)}-${max.toFixed(2)}mm (nominal ${nominal}mm)`
    }
  }
  expect(wrong).toEqual({})
})
