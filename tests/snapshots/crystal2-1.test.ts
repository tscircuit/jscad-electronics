import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TwoPadCrystal } from "../../lib/TwoPadCrystal"
test("FC135", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TwoPadCrystal, {
        footprint: "smdpads2_p2.5mm_pw1mm_ph1.8mm",
        packageName: "FC135",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-FC135")
}, 30000)
