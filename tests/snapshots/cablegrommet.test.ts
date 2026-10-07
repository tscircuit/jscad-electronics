import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createCableGrommetMesh } from "../../lib/models/cablegrommet"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-orthographic-model-snapshot"

test("cable grommet: four views of centered panel groove and cable bore", async () => {
  const modelString =
    "cablegrommet_panelhole20mm_id10mm_od24mm_h8mm_groovew3mm_grooved2mm_shape(symmetricring)"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "cablegrommet") throw new Error("Expected grommet")
  const { fn, ...props } = definition
  const png = await renderModelSnapshot({
    mesh: createCableGrommetMesh(props),
    title: "CABLE GROMMET / SYMMETRIC PANEL GROOVE",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "TWO FLANGES AND OPEN CABLE BORE",
        eye: [30, -35, 30],
        target: [0, 0, 0],
        span: 30,
      },
      {
        name: "TOP",
        detail: "10 mm BORE AND 24 mm FLANGE",
        eye: [0, 0, 48],
        target: [0, 0, 0],
        span: 30,
      },
      {
        name: "FRONT",
        detail: "CENTERED 3 mm GROOVE / 20 mm ROOT",
        eye: [0, -48, 0],
        target: [0, 0, 0],
        span: 30,
      },
      {
        name: "UNDERSIDE",
        detail: "EQUAL FLANGES / 8 mm OVERALL HEIGHT",
        eye: [-30, -35, -30],
        target: [0, 0, 0],
        span: 30,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / UNDEFORMED NOMINAL RING",
  })
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
