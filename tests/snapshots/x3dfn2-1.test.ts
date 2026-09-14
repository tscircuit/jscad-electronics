import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { X3DFN2 } from "../../lib/X3DFN2"
test("X3DFN2 six views, orientation 1", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(X3DFN2, { footprint: "smdpads2_p0.4mm_pw0.2mm_ph0.3mm" }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "x3dfn2-1")
}, 30000)
