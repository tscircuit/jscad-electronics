import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { DFN } from "../../lib/dfn"
import { dfnVariants } from "../../examples/fixtures/dfn-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("DFN dimensional variant 2: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(DFN, Object.values(dfnVariants)[1]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "dfn-variant-2")
}, 30000)
