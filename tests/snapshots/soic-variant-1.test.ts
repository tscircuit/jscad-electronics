import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { SOIC } from "../../lib/SOIC"
import { soicVariants } from "../../examples/fixtures/soic-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("SOIC physical variant 1: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(SOIC, Object.values(soicVariants)[0]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "soic-variant-1")
}, 30000)
