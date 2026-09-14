import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { footprinter3dModelVariants as v } from "../../examples/fixtures/footprinter3d-model-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("Footprinter3d sot89: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(Footprinter3d, v["SOT89 explicit package"]),
    ),
  ).toMatchPngSnapshot(import.meta.path, "footprinter3d-sot89-model")
}, 30000)
