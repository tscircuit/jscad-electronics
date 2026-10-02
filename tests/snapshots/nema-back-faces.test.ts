import { expect, test } from "bun:test"
import { createElement } from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { renderComponent } from "../helpers/render-component"
import { createAnnotatedViewSheet } from "../fixtures/annotated-view-sheet"
import "../fixtures/png-matcher"

test("NEMA8/17/23 rear holes and screws", async () => {
  const views = []
  for (const [size, length, width] of [
    [8, 33, 20.3],
    [17, 38, 42.3],
    [23, 51, 56.4],
  ]) {
    for (const mode of ["holes", "screws"]) {
      const footprint = `nema${size}_backface${mode}`
      const png = await renderComponent(
        createElement(Footprinter3d, { footprint }),
        {
          width: 650,
          height: 450,
          camPos: [width! * 0.6, -length! - width! * 2.4, width! * 0.3],
          lookAt: [0, -length!, 0],
          showGrid: false,
        },
      )
      views.push({ png, annotation: footprint })
    }
  }
  await expect(
    createAnnotatedViewSheet(views, {
      columns: 2,
      fontSize: 24,
      annotationHeight: 65,
    }),
  ).toMatchPngSnapshot(import.meta.path)
}, 30000)
