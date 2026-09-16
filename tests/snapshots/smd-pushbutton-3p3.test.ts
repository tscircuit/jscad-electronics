import { expect, test } from "bun:test"
import { smdPushbutton3p3Footprint } from "../../examples/fixtures/smd-pushbutton-3p3"
import "../fixtures/png-matcher"
import { renderContactSheet } from "../helpers/render-contact-sheet"

test("3.3 mm SMD pushbutton: six-view footprint render", async () => {
  await expect(
    await renderContactSheet(smdPushbutton3p3Footprint),
  ).toMatchPngSnapshot(import.meta.path, "smd-pushbutton-3p3")
}, 30000)
