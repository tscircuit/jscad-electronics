import { test } from "bun:test"
import { encodePNG } from "poppygl"
import { jstMatedAssembly } from "../fixtures/jst-mated-assembly"
import { createAnnotatedViewSheet } from "../fixtures/annotated-view-sheet"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderCableMeshes } from "../fixtures/render-cable-meshes"

test("PH and SH plugs seat in a real NEMA17 motor and board header", async () => {
  const views = []
  for (const family of ["ph", "sh"] as const) {
    const meshes = jstMatedAssembly(family)
    for (const view of ["ASSEMBLY", "MOTOR SOCKET", "BOARD HEADER"] as const) {
      const png = await encodePNG(
        renderCableMeshes(meshes, {
          width: 650,
          height: 500,
          camPos:
            view === "ASSEMBLY"
              ? [100, -145, 130]
              : view === "MOTOR SOCKET"
                ? [12, -30, 22]
                : [48, -25, 26],
          lookAt:
            view === "ASSEMBLY"
              ? [-2, 0, 20]
              : view === "MOTOR SOCKET"
                ? [-10, 0, 5]
                : [30, 0, 5],
          up: "z+",
          fov: view === "ASSEMBLY" ? 32 : 28,
        }).bitmap,
      )
      views.push({
        png,
        annotation: `JST ${family.toUpperCase()} / ${view}\nnema17_jst${family}6 + jst6_${family} + jst_${family}_pins6\nNarrow nose inside socket / shoulder above lip / red = pin 1`,
      })
    }
  }
  await expectPngSnapshot(
    createAnnotatedViewSheet(views, {
      columns: 3,
      fontSize: 17,
      annotationHeight: 95,
    }),
    import.meta.path,
  )
}, 30_000)
