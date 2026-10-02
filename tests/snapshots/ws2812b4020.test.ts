import { expect, test } from "bun:test"
import { createElement } from "react"
import { SmdLED } from "../../lib/SmdLED"
import { renderComponentContactSheet } from "../helpers/component-model"
import "../fixtures/png-matcher"

test("WS2812B-4020 side-view package: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(SmdLED, { footprint: "ws2812b4020" }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "ws2812b4020")
}, 30000)
