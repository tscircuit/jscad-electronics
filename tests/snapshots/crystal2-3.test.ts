import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TwoPadCrystal } from "../../lib/TwoPadCrystal"
test("FC1610AN", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TwoPadCrystal, {
        footprint: "smdpads2_p1.05mm_pw0.5mm_ph1mm",
        packageName: "FC1610AN",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-FC1610AN")
}, 30000)
