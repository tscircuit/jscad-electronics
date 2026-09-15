import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { bodyDimensionFootprints } from "../../examples/fixtures/footprinter-body-dimensions"
import { renderComponentContactSheet } from "../helpers/component-model"
test("ssop string body dimensions: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(Footprinter3d, { footprint: bodyDimensionFootprints.SSOP }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "fp-ssop-body-dimensions")
}, 30000)
