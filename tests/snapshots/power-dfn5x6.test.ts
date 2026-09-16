import { expect, test } from "bun:test"
import { powerDfn5x6Footprint } from "../../examples/fixtures/power-dfn5x6"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("power DFN 5x6: six-view footprint render", async () => {
  await expect(
    await renderContactSheet(powerDfn5x6Footprint),
  ).toMatchPngSnapshot(import.meta.path, "power-dfn5x6")
}, 30000)
