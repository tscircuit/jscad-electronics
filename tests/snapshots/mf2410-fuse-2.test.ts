import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { MF2410Fuse } from "../../lib/MF2410Fuse"
test("MF2410Fuse orientation 2", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(MF2410Fuse, {
        footprint:
          "smdpads2_p4.9997mm_pw2mm_ph3.2mm_pin1location(rightside,top)",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "mf2410-fuse-2")
}, 30000)
