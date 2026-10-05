import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createTSlotExtrusionMesh } from "../../lib/TSlotExtrusion"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("T-slot extrusion complete roadmap string - four views", async () => {
  const modelString =
    "tslotextrusion_w20mm_h20mm_l100mm_profile(fourtsolid)_slot6mm_pocket10mm_pocketd2mm_lip2mm_bore4mm_corner1mm"
  const model = mp.string(modelString).json()
  if (model.fn !== "tslotextrusion") throw new Error("Wrong model family")
  const { fn, ...props } = model
  const png = await renderModelSnapshot({
    mesh: createTSlotExtrusionMesh(props),
    title: "T-SLOT EXTRUSION / FOUR GROOVES AND AXIAL BORE",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "100 mm LENGTH / OPEN T GROOVES",
        eye: [90, -100, 135],
        target: [0, 0, 50],
        span: 130,
        far: 400,
      },
      {
        name: "TOP",
        detail: "FOUR STRAIGHT T POCKETS / 4 mm BORE",
        eye: [0, 0, 145],
        target: [0, 0, 100],
        span: 28,
        far: 400,
      },
      {
        name: "FRONT OBLIQUE",
        detail: "6 mm SLOT MOUTH ALONG FULL LENGTH",
        eye: [25, -85, 50],
        target: [0, 0, 50],
        span: 130,
        far: 400,
      },
      {
        name: "END DETAIL",
        detail: "FLAT OPEN END / 1 mm CORNER RADII",
        eye: [18, -20, -40],
        target: [0, 0, 8],
        span: 40,
        far: 400,
      },
    ],
    footer: "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / mm / MODELPRINTER CONTRACT",
  })
  await expectPngSnapshot(png, import.meta.path)
})
