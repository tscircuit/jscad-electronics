import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TwoPadCrystal } from "../../lib/TwoPadCrystal"
test("FC12M", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TwoPadCrystal, {
        footprint: "smdpads2_p1.7252mm_pw0.925mm_ph1.3mm",
        packageName: "FC12M",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-FC12M")
}, 30000)
