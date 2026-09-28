import { expect, test } from "bun:test"
import { createElement } from "react"
import { SmdLED } from "../../lib/SmdLED"
import { renderComponentContactSheet } from "../helpers/component-model"
import "../fixtures/png-matcher"

test("LED 0805: six-view package outline", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(SmdLED, { footprint: "0805" }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "smd-led-0805")
}, 30000)
