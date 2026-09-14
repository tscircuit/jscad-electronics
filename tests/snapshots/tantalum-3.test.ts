import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { TantalumCapacitor } from "../../lib/TantalumCapacitor"
test("tantalum C", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(TantalumCapacitor, {
        footprint:
          "smdpads2_p5.1999mm_pw1.9mm_ph2.376mm_pin1location(rightside,top)",
        caseSize: "C",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "tantalum-C")
}, 30000)
