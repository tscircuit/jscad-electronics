import { test, expect } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"
import { cameraForFootprint } from "./footprint-camera"
import { nominalHeightFor, probeFor } from "./footprint-probes"

// Body coverage snapshots, from above and from below. Three things are pinned
// so these are evidence and not just pictures:
//   - the camera comes from the footprint and the recorded package height,
//     never from the model, so the view is identical before and after the body
//     exists and the part arriving is the only difference;
//   - the grid is pinned to z = 0, the top of the board, so pads and holes lie
//     ON it and a body at the wrong height is obvious;
//   - the pads are drawn see-through, so a lead is visible against the pad it
//     is supposed to land on.
// The underside view is the one a viewer cannot give you, and it is where a
// lead count that disagrees with the pad count shows up immediately.
// Regenerate with BUN_UPDATE_SNAPSHOTS=1.
const PAD_OPACITY = 0.45

test("mlp body", async () => {
  const probe = probeFor("mlp")
  const height = nominalHeightFor("mlp")

  const top = await renderFootprint(probe, {
    ...cameraForFootprint(probe, height, "top"),
    gridZ: 0,
    padOpacity: PAD_OPACITY,
  })
  await expect(top).toMatchPngSnapshot(import.meta.path)

  const bottom = await renderFootprint(probe, {
    ...cameraForFootprint(probe, height, "bottom"),
    gridZ: 0,
    padOpacity: PAD_OPACITY,
  })
  await expect(bottom).toMatchPngSnapshot(import.meta.path, "mlp-underside")
})
