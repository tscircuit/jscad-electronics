import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { MSOP } from "../../lib/MSOP"
import { msopVariants } from "../../examples/fixtures/msop-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("MSOP physical variant 2: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(MSOP, Object.values(msopVariants)[1]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "msop-variant-2")
}, 30000)
