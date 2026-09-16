import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { DO219AD } from "../../lib/DO219AD"
import { do219adVariants } from "../../examples/fixtures/do219ad-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("DO219AD dimensional variant 2: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(DO219AD, Object.values(do219adVariants)[1]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "do219ad-variant-2")
}, 30000)
