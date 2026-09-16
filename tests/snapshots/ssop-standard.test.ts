import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { SSOP } from "../../lib/SSOP"
import { ssopStandardVariants } from "../../examples/fixtures/ssop-standard-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("SSOP: six-view physical outline", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(SSOP, Object.values(ssopStandardVariants)[0]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "ssop-standard")
}, 30000)
