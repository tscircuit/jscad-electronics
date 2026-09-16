import { expect, test } from "bun:test"
import { lga14_2p5x3Footprint } from "../../examples/fixtures/lga14-2p5x3"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("LGA-14 2.5x3: six-view footprint render", async () => {
  await expect(
    await renderContactSheet(lga14_2p5x3Footprint),
  ).toMatchPngSnapshot(import.meta.path, "lga14-2p5x3")
}, 30000)
