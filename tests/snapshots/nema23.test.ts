import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderNemaMotor } from "../fixtures/render-nema-motor"
test("nema23 four views", async () => {
  // Modelprinter's merged NEMA23 contract defaults to a 270-degree wire side.
  // Keep the standard spelling here so the four views also cover that default.
  await expect(await renderNemaMotor("nema23")).toMatchPngSnapshot(
    import.meta.path,
  )
}, 30000)
