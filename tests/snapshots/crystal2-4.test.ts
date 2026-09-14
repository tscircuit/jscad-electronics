import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TwoPadCrystal } from "../../lib/TwoPadCrystal"
test("NX3225GD", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TwoPadCrystal, {
        footprint:
          "smdpads2_p1.8999mm_pw1.5mm_ph2.7mm_pin1location(rightside,top)",
        packageName: "NX3225GD",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "crystal2-NX3225GD")
}, 30000)
