import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createThreadedRodMesh } from "../../lib/models/threadedrod"
import { renderModelSnapshot } from "../fixtures/render-orthographic-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("threadedrod roadmap example - four-view PoppyGL snapshot", async () => {
  const modelString =
    "threadedrod_spec(custom)_m6_l100mm_thread(full)_ends(flat)_chamfer0.5mm"
  const model = mp.string(modelString).json()
  if (model.fn !== "threadedrod") throw new Error("Unexpected model")
  const { fn, ...props } = model
  const image = await renderModelSnapshot({
    mesh: createThreadedRodMesh(props, {
      radialSegments: 48,
      segmentsPerPitch: 12,
    }),
    title: "M6 x 100 mm / FULLY THREADED ROD",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "MOUNTING AND THREAD GEOMETRY",
        eye: [28, -40, 76],
        target: [0, 0, 50],
        span: 115,
      },
      {
        name: "TOP",
        detail: "FLAT CHAMFERED TERMINAL",
        eye: [0, 0, 125],
        target: [0, 0, 100],
        span: 10,
      },
      {
        name: "FRONT",
        detail: "100 mm BETWEEN END PLANES",
        eye: [0, -40, 50],
        target: [0, 0, 50],
        span: 115,
      },
      {
        name: "UNDERSIDE",
        detail: "RIGHT-HAND HELIX AND LOWER END",
        eye: [-28, -40, 24],
        target: [0, 0, 50],
        span: 115,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(image, import.meta.path)
})
