import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderNema34 } from "../fixtures/render-nema34"

test("nema34 four views", async () => {
  await expect(await renderNema34()).toMatchPngSnapshot(import.meta.path)
}, 30_000)
