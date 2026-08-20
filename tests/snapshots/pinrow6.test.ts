import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"
import { cameraForFootprint } from "../body-coverage/footprint-camera"

test("6-pin header connector", async () => {
  const pngBuffer = await renderFootprint("pinrow6_id01mm_p2.54mm_od01.6mm", {
    // The grid is the top of the board, level with the holes, so a
    // through-hole part is seen against the surface it mounts to.
    gridZ: 0,
  })
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})

// The same part seen from UNDER the board, where a through-hole part is either
// right or obviously wrong: the pins have to come down through the plated
// holes, and the body has to be on the other side of them. The camera and the
// z = 0 grid come from the body-coverage helpers so this reads like those
// renders; the copper is drawn see-through because from below it is between
// the camera and everything else.
test("top-mounted (the default this PR corrects) from below", async () => {
  const footprint = "pinrow6_id01mm_p2.54mm_od01.6mm"
  const pngBuffer = await renderFootprint(footprint, {
    ...cameraForFootprint(footprint, 8.5, "bottom"),
    gridZ: 0,
    padOpacity: 0.45,
  })
  await expect(pngBuffer).toMatchPngSnapshot(
    import.meta.path,
    "pinrow6-underside",
  )
})
