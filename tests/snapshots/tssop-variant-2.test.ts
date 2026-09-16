import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { Tssop } from "../../lib/Tssop"
import { tssopVariants } from "../../examples/fixtures/tssop-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("Tssop physical variant 2: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(Tssop, Object.values(tssopVariants)[1]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "tssop-variant-2")
}, 30000)
