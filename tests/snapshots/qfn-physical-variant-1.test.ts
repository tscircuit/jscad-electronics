import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { QFN } from "../../lib/qfn"
import { qfnPhysicalVariants } from "../../examples/fixtures/qfn-physical-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("QFN physical variant 1: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(QFN, Object.values(qfnPhysicalVariants)[0]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "qfn-physical-variant-1")
}, 30000)
