import { test } from "bun:test"
import { mp } from "@tscircuit/modelprinter"
import { createMaleFemaleStandoffMesh } from "../../lib/models/malefemalestandoff"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

test("male-female standoff proposal has a labeled standard four-view snapshot", async () => {
  const modelString =
    "malefemalestandoff_m3_af5.5mm_l10mm_studl5mm_femaledepth6mm_hex"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "malefemalestandoff")
    throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const image = await renderModelSnapshot({
    mesh: createMaleFemaleStandoffMesh(props, {
      radialSegments: 48,
      segmentsPerPitch: 12,
    }),
    title: "M3 / MALE-FEMALE HEX STANDOFF",
    modelString,
    color: [0.64, 0.5, 0.26, 1],
    views: [
      {
        name: "ISOMETRIC",
        detail: "TOP BLIND SOCKET / LOWER MALE STUD",
        eye: [20, -28, 24],
        target: [0, 0, 2.5],
        span: 20,
      },
      {
        name: "TOP",
        detail: "M3 FEMALE SOCKET / 5.5 mm ACROSS FLATS",
        eye: [0, 0, 35],
        target: [0, 0, 10],
        span: 9,
      },
      {
        name: "FRONT",
        detail: "10 mm BODY / 5 mm STUD BELOW SHOULDER",
        eye: [0, -35, 2.5],
        target: [0, 0, 2.5],
        span: 20,
      },
      {
        name: "SIDE",
        detail: "LOWER SHOULDER Z=0 / TOP FACE Z=10",
        eye: [35, 0, 2.5],
        target: [0, 0, 2.5],
        span: 20,
      },
    ],
    footer: "POPPYGL / DIMENSIONS IN mm / FEMALE DEPTH 6 mm / BLIND FLOOR Z=4",
  })
  await expectPngSnapshot(image, import.meta.path)
})
