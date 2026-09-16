import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { LQFP } from "../../lib/lqfp"
import { lqfpPhysicalVariants } from "../../examples/fixtures/lqfp-physical-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("LQFP physical variant 1: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(LQFP, Object.values(lqfpPhysicalVariants)[0]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "lqfp-physical-variant-1")
}, 30000)
