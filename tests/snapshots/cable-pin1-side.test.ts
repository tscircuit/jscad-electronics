import { test } from "bun:test"
import { encodePNG } from "poppygl"
import { createCableMeshes, type CablePoint } from "../../lib/cables"
import { createAnnotatedViewSheet } from "../fixtures/annotated-view-sheet"
import { cableExamples } from "../fixtures/cable-examples"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderCableMeshes } from "../fixtures/render-cable-meshes"

test("pin 1 sides orient JST plugs and preserve conductor order through quarter and half turns", async () => {
  // Circuit-world XYZ: right-handed, +Z up, millimeters. Pin 1 sides are
  // directions from the plug center toward its first contact, not points.
  const path: CablePoint[] = Array.from({ length: 41 }, (_, i) => [0, 0, i / 2])
  const cases = [
    { label: "LEGACY / NO CONSTRAINTS", side: undefined },
    { label: "90 DEG / PIN 1: A -X, B -Y", side: [0, -1, 0] as CablePoint },
    { label: "180 DEG / PIN 1: A -X, B +X", side: [1, 0, 0] as CablePoint },
  ]
  const cables = cases.map(({ side }) =>
    createCableMeshes({
      definition: cableExamples[1]!,
      path,
      ...(side
        ? { startPin1Side: [-1, 0, 0] as CablePoint, endPin1Side: side }
        : {}),
    }),
  )
  const views = []
  for (const detail of [false, true]) {
    for (const [index, { label }] of cases.entries()) {
      views.push({
        png: await encodePNG(
          renderCableMeshes(
            detail
              ? cables[index]!.filter((mesh) => !mesh.name.startsWith("A-"))
              : cables[index]!,
            {
              width: 600,
              height: 450,
              camPos: detail ? [7, -9, 34] : [30, -40, 37],
              lookAt: detail ? [0, 0, 21] : [0, 0, 10],
              up: "z+",
              fov: 32,
            },
          ).bitmap,
        ),
        annotation: `${label}\n${detail ? "B PLUG DETAIL" : "PLUGS + TWIST"} / RED = PIN 1`,
      })
    }
  }
  await expectPngSnapshot(
    createAnnotatedViewSheet(views, {
      columns: 3,
      fontSize: 22,
      annotationHeight: 85,
    }),
    import.meta.path,
  )
}, 30_000)
