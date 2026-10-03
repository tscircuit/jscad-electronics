import { expect, test } from "bun:test"
import { createElement } from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { renderComponent } from "../helpers/render-component"
import { createAnnotatedViewSheet } from "../fixtures/annotated-view-sheet"
import "../fixtures/png-matcher"

test("NEMA17 wire exit and optional six-position JST-PH socket", async () => {
  const views = []
  for (const footprint of [
    "nema17_wirestubs",
    "nema17_jstph6",
    "nema17_wirestubs_wireangle90deg",
    "nema17_nowires",
  ]) {
    const png = await renderComponent(
      createElement(Footprinter3d, { footprint }),
      {
        width: 700,
        height: 550,
        camPos: [115, 95, -110],
        lookAt: [0, -12, 0],
        showGrid: false,
      },
    )
    views.push({
      png,
      annotation: `${footprint}\nWire exit at rear cap; shaft +Z`,
    })
  }
  await expect(
    createAnnotatedViewSheet(views, {
      columns: 2,
      fontSize: 18,
      annotationHeight: 90,
    }),
  ).toMatchPngSnapshot(import.meta.path)
}, 30000)
