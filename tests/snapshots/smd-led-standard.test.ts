import { expect, test } from "bun:test"
import { createElement } from "react"
import { SmdLED } from "../../lib/smdLED"
import { renderComponentContactSheet } from "../helpers/component-model"
import "../fixtures/png-matcher"

for (const footprint of ["0402", "0603", "0805"] as const)
  test(`LED ${footprint}: six-view package outline`, async () => {
    await expect(
      await renderComponentContactSheet(createElement(SmdLED, { footprint })),
    ).toMatchPngSnapshot(import.meta.path, `smd-led-${footprint}`)
  }, 30000)
