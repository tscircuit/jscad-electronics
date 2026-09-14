import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { SOT89 } from "../../lib/SOT89"
import { sot89StandardVariants } from "../../examples/fixtures/sot89-standard-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("SOT89: six-view physical outline", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(SOT89, Object.values(sot89StandardVariants)[0]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "sot89-standard")
}, 30000)
