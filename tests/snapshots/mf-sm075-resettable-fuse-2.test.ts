import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { MFSM075ResettableFuse } from "../../lib/MFSM075ResettableFuse"
test("MFSM075ResettableFuse six views, orientation 2", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(MFSM075ResettableFuse, {
        footprint:
          "smdpads2_p7.0825mm_pw1.5mm_ph3.1mm_cyw9.0852mm_cyh6.1896mm_pin1location(rightside,top)",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "mf-sm075-resettable-fuse-2")
}, 30000)
