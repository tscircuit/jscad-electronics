import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { QFN } from "../../lib/qfn"
import { qfnPhysicalVariants } from "../../examples/fixtures/qfn-physical-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("QFN physical variant 2: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(QFN, Object.values(qfnPhysicalVariants)[1]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "qfn-physical-variant-2")
}, 30000)
