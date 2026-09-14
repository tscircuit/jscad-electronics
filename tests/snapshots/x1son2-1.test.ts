import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { X1SON2 } from "../../lib/X1SON2"
test("X1SON2 six views, orientation 1", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(X1SON2, { footprint: "smdpads2_p1mm_pw0.6mm_ph0.6mm" }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "x1son2-1")
}, 30000)
