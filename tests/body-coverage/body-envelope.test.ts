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
 * Bodies whose height is known to be wrong, recorded with the value they
 * actually measure so the number is written down rather than rediscovered —
 * and so that FIXING one fails this test and prompts its removal.
 *
 * `breakoutheaders` puts its headers BELOW the board, because that is what
 * `PinRow` does for a through-hole header. Consistent with `pinrow`, and wrong
 * for both: nothing above the board means nothing for a lid to clear.
 */
const KNOWN_BAD_PLACEMENT: Record<string, number> = {
  breakoutheaders: 0.9,
}

/** Footprints with no body yet — covered by the ledger, not by this test. */
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
    if (NO_BODY_YET.includes(name) || name in KNOWN_BAD_PLACEMENT) continue
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

  // The recorded-wrong ones, still wrong. A fix trips this and gets its entry
  // deleted, which is the only way the note above stays true.
  const changed: Record<string, string> = {}
  for (const [name, recorded] of Object.entries(KNOWN_BAD_PLACEMENT)) {
    const { geometries } = getJscadModelForFootprint(
      probeFor(name),
      jscadModeling,
    )
    const height = geometries.length ? measureHeight(geometries) : 0
    if (Math.abs(height - recorded) > 0.5) {
      changed[name] =
        `now ${height.toFixed(2)}mm (was ${recorded}mm) — if this is a fix, delete the KNOWN_BAD_PLACEMENT entry`
    }
  }
  expect(changed).toEqual({})
})
