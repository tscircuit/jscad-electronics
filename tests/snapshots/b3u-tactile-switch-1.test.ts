import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { B3UTactileSwitch } from "../../lib/B3UTactileSwitch"
test("B3UTactileSwitch orientation 1", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(B3UTactileSwitch, {
        footprint: "smdpads2_p3.4mm_pw0.8mm_ph1.7mm",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "b3u-tactile-switch-1")
}, 30000)
