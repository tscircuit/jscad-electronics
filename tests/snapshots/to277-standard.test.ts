import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { TO277 } from "../../lib/TO277"
import { to277StandardVariants } from "../../examples/fixtures/to277-standard-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("TO277: six-view physical outline", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TO277, Object.values(to277StandardVariants)[0]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "to277-standard")
}, 30000)
