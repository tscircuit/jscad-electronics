import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("headermodule female header has six visible views", async () => {
  await expect(
    await renderContactSheet("headermodule4_female"),
  ).toMatchPngSnapshot(import.meta.path, "headermodule-female")
}, 30000)
