import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"
import { probeFor } from "./footprint-probes"
test("JST SH six-view body coverage", async () => {
  await expect(await renderContactSheet(probeFor("jst"))).toMatchPngSnapshot(
    import.meta.path,
  )
}, 30000)
