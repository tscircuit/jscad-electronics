import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { createElement } from "react"
import { SOD323HE } from "../../lib/SOD323HE"
import { sod323heVariants } from "../../examples/fixtures/sod323he-variants"
import { renderComponentContactSheet } from "../helpers/component-model"
test("SOD323HE dimensional variant 2: six views", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(SOD323HE, Object.values(sod323heVariants)[1]!.props),
    ),
  ).toMatchPngSnapshot(import.meta.path, "sod323he-variant-2")
}, 30000)
