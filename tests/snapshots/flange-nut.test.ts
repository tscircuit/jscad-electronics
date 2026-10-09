import { test } from "bun:test"
import { createFlangeNutMesh } from "../../lib/models/flangenut"
import {
  flangeNutModelString,
  flangeNutProps,
} from "../fixtures/flange-nut-case"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("ISO 4161 M6 plain flange nut in four labeled views", async () => {
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: createFlangeNutMesh(flangeNutProps),
      title: "FLANGE NUT / ISO 4161:2012 / M6 PLAIN FACE",
      modelString: flangeNutModelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "HEX BODY / INTEGRAL SMOOTH BEARING FLANGE",
          eye: [22, -28, 26],
          target: [0, 0, 3],
          span: 20,
        },
        {
          name: "TOP",
          detail: "10mm ACROSS FLATS / 14.2mm FLANGE / M6 BORE",
          eye: [0, 0, 40],
          target: [0, 0, 3],
          span: 18,
        },
        {
          name: "FRONT",
          detail: "6mm TOTAL HEIGHT / BEARING PLANE Z=0",
          eye: [0, -40, 3],
          target: [0, 0, 3],
          span: 20,
        },
        {
          name: "SIDE",
          detail: "20deg FLANGE TAPER / 30deg TOP CHAMFER",
          eye: [40, 0, 3],
          target: [0, 0, 3],
          span: 20,
        },
      ],
      footer:
        "POPPYGL / DIMENSIONS IN mm / RIGHT-HAND 1mm PITCH / UNTOLERANCED VISUAL MODEL",
    }),
    import.meta.path,
  )
})
