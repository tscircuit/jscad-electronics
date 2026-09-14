import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TantalumCapacitor } from "../../lib/TantalumCapacitor"
test("tantalum B", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TantalumCapacitor, {
        footprint: "smdpads2_p3.7211mm_pw1.5062mm_ph2.376mm",
        caseSize: "B",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-B")
}, 30000)
