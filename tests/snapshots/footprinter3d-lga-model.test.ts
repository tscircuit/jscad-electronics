import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { footprinter3dModelVariants as v } from "../../examples/fixtures/footprinter3d-model-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("Footprinter3d lga: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(Footprinter3d, v["LGA explicit package"]),
    ),
  ).toMatchPngSnapshot(import.meta.path, "footprinter3d-lga-model")
}, 30000)
