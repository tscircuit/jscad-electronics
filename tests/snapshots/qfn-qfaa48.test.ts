import { expect, test } from "bun:test"
import { qfnQfaa48Footprint } from "../../examples/fixtures/qfn-qfaa48"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("QFAA48 QFN: six-view footprint render", async () => {
  await expect(await renderContactSheet(qfnQfaa48Footprint)).toMatchPngSnapshot(
    import.meta.path,
    "qfn-qfaa48",
  )
}, 30000)
