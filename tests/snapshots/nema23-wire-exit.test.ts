import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderNema23RearProfile } from "../fixtures/render-nema23-rear-profile"

test("NEMA23 front wire exit retains the rectangular rear screw orientation", async () => {
  await expect(
    await renderNema23RearProfile("nema23_wirestubs", { topSpan: 88 }),
  ).toMatchPngSnapshot(import.meta.path)
}, 30000)
