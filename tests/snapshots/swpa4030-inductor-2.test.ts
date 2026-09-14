import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { SWPA4030Inductor } from "../../lib/SWPA4030Inductor"
test("SWPA4030Inductor orientation 2", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(SWPA4030Inductor, {
        footprint:
          "smdpads2_p3.6002mm_pw1.9mm_ph3.7mm_pin1location(rightside,top)",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "swpa4030-inductor-2")
}, 30000)
