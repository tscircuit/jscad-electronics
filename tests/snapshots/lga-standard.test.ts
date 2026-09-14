import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { LGA } from "../../lib/LGA"
import { lgaStandardVariants } from "../../examples/fixtures/lga-standard-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("LGA: six-view physical outline", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(LGA, Object.values(lgaStandardVariants)[0]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "lga-standard")
}, 30000)
