import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"
import { createElement } from "react"
import { PowerDI123 } from "../../lib/PowerDI123"
test("PowerDI123 six views, orientation 1", async () => {
  await expect(
    await renderComponentContactSheet(
      createElement(PowerDI123, {
        footprint: "diode_p2.3749mm_pw1.725mm_ph1.5mm_rounded0",
      }),
    ),
  ).toMatchPngSnapshot(import.meta.path, "powerdi123-1")
}, 30000)
