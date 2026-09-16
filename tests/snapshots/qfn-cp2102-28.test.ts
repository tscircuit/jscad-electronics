import { expect, test } from "bun:test"
import { qfnCp2102_28Footprint } from "../../examples/fixtures/qfn-cp2102-28"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("CP2102 QFN28: six-view footprint render", async () => {
  await expect(
    await renderContactSheet(qfnCp2102_28Footprint),
  ).toMatchPngSnapshot(import.meta.path, "qfn-cp2102-28")
}, 30000)
