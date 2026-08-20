import { test, expect } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

/**
 * Which way up a pin header is built, stated as numbers.
 *
 * Two independent questions, and only the second belongs to the model:
 *
 *  - WHICH SIDE OF THE BOARD the part is on is the component's `layer`.
 *    Consumers already implement it — 3d-viewer's cad-model-transform moves a
 *    bottom-layer part to `-(z + pcbThickness)` and rotates it 180 degrees
 *    about X — so a model that flipped itself would be flipped twice. Nothing
 *    here goes below z = 0.
 *  - WHICH END OF THE PINS passes through the board is `invert`.
 *
 * A through-hole header used to render UNDER the board — body at z -3.6 to
 * -1.6 with 2mm of pin poking up through the holes — because the default was
 * the backwards orientation and #256 pushed the whole part down to compensate.
 *
 * The SMD and right-angle variants were never wrong, and this test exists
 * because the first attempt at the fix folded all three into one expression
 * and silently flipped them too. A snapshot diff does not distinguish "this
 * part changed because I fixed it" from "this part changed because I broke
 * it"; these extents do.
 */
const MOUNTING_Z_EXTENT: Record<string, [number, number]> = {
  // the ordinary way: body on the board (0 to 2), long pins standing above
  // it, short pins through the holes
  pinrow6: [-2.5, 8],
  // invert: installed BACKWARDS — same side of the board, but the long pins
  // are the ones through the holes. Unusual, and a real option (stacking,
  // wire wrap); this is what `invert` meant when it was added in #236.
  pinrow6_invert: [-6, 4.5],
  // `faceup` is deprecated (tscircuit/footprinter#813) and ignored here, so a
  // footprint string that still carries it renders the part correctly rather
  // than differently. Kept as an assertion, not deleted: a flag that is
  // supposed to do nothing is exactly the kind of thing that quietly starts
  // doing something again.
  pinrow6_faceup: [-2.5, 8],
  pinrow6_smd_faceup: [-6, 2],
  // unchanged by the through-hole fix, and must stay that way
  pinrow6_smd: [-6, 2],
  pinrow4_smd_rightangle: [0, 2],
  smdpinheader6: [0, 9.62],
}

test("a pin header is mounted the way its footprint says", async () => {
  const { getJscadModelForFootprint } = await importVanilla()

  const wrong: Record<string, string> = {}
  for (const [footprint, [bottom, top]] of Object.entries(MOUNTING_Z_EXTENT)) {
    const { geometries } = getJscadModelForFootprint(footprint, jscadModeling)
    if (!geometries.length) {
      wrong[footprint] = "no geometry"
      continue
    }
    const [min, max] = jscadModeling.measurements.measureAggregateBoundingBox(
      ...geometries.map(({ geom }: { geom: never }) => geom),
    )
    if (Math.abs(min[2]! - bottom) > 0.1 || Math.abs(max[2]! - top) > 0.1) {
      wrong[footprint] =
        `z[${min[2]!.toFixed(2)}, ${max[2]!.toFixed(2)}], expected z[${bottom}, ${top}]`
    }
  }

  expect(wrong).toEqual({})
})
