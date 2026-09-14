import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TantalumCapacitor } from "../../lib/TantalumCapacitor"
test("tantalum A", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TantalumCapacitor, {
        footprint: "smdpads2_p3.0602mm_pw1.53mm_ph1.296mm",
        caseSize: "A",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-A")
}, 30000)
