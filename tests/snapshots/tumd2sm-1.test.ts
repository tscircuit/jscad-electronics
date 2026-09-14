import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TUMD2SM } from "../../lib/TUMD2SM"
test("TUMD2SM six views, orientation 1", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TUMD2SM, {
        footprint: "smdpads2_p2.1001mm_pw0.8mm_ph1.1mm",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "tumd2sm-1")
}, 30000)
