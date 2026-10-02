import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderNemaMotor } from "../fixtures/render-nema-motor"
test("nema8 four views", async () => {
  await expect(await renderNemaMotor("nema8")).toMatchPngSnapshot(
    import.meta.path,
  )
}, 30000)
