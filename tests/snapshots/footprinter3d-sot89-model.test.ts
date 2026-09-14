import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { renderComponentContactSheet } from "../helpers/component-model"
test("Footprinter3d sot89: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(Footprinter3d, { footprint: "sot89" }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "footprinter3d-sot89-model")
}, 30000)
