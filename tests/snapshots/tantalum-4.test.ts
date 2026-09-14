import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TantalumCapacitor } from "../../lib/TantalumCapacitor"
test("tantalum D", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TantalumCapacitor, {
        footprint: "smdpads2_p6mm_pw2.7991mm_ph3.0099mm",
        caseSize: "D",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-D")
}, 30000)
