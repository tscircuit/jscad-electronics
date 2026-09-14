import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { BLM41FerriteBead } from "../../lib/BLM41FerriteBead"
test("BLM41FerriteBead orientation 1", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(BLM41FerriteBead, {
        footprint: "smdpads2_p3.8999mm_pw2mm_ph2mm",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "blm41-ferrite-bead-1")
}, 30000)
