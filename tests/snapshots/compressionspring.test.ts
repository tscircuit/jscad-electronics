import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createCompressionSpringMesh } from "../../lib/models/compressionspring"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-orthographic-model-snapshot"

test("compression spring: four views of variable pitch and ground bearing ends", async () => {
  const modelString =
    "compressionspring_spec(custom)_od8mm_wire1mm_l20mm_turns8_active6_ends(closedground)_hand(right)_state(free)"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "compressionspring") throw new Error("Expected spring")
  const { fn, ...props } = definition
  const png = await renderModelSnapshot({
    mesh: createCompressionSpringMesh(props),
    title: "COMPRESSION SPRING / CLOSED GROUND ENDS",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "8 TURNS / 6 ACTIVE / RIGHT HAND",
        eye: [20, -25, 25],
        target: [0, 0, 10],
        span: 26,
      },
      {
        name: "TOP",
        detail: "8 mm OD / 6 mm BORE / 1 mm WIRE",
        eye: [0, 0, 45],
        target: [0, 0, 10],
        span: 12,
      },
      {
        name: "FRONT",
        detail: "20 mm FREE HEIGHT / PIECEWISE PITCH",
        eye: [0, -36, 10],
        target: [0, 0, 10],
        span: 26,
      },
      {
        name: "UNDERSIDE",
        detail: "PLANAR GROUND ENDS AT Z = 0 AND 20 mm",
        eye: [-20, -25, -5],
        target: [0, 0, 10],
        span: 26,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / RADIAL-AXIAL WIRE SECTION",
  })
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
