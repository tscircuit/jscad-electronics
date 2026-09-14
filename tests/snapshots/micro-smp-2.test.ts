import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { MicroSMP } from "../../lib/MicroSMP"
test("MicroSMP six views, orientation 2", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(MicroSMP, {
        footprint:
          "smdpads2_p1.84mm_pw1.35mm_ph0.95mm_pin1location(rightside,top)",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "micro-smp-2")
}, 30000)
