import { expect, test } from "bun:test"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { createAnnotatedViewSheet } from "../fixtures/annotated-view-sheet"
import "../fixtures/png-matcher"
import type { CameraPreset } from "../helpers/camera-presets"
import { renderComponent } from "../helpers/render-component"

const view = async (
  model: string,
  cameraPreset: CameraPreset,
  annotation: string,
) => ({
  png: await renderComponent(<Footprinter3d footprint={model} />, {
    width: 640,
    height: 480,
    cameraPreset,
    showGrid: false,
  }),
  annotation,
})

test("flexscreen pitch visibly widens the connector end", async () => {
  const before = "flexscreen_w16_h10_flex10_sitsflat"
  const after =
    "flexscreen30_w16_h10_flex10_p0.5mm_pw0.3mm_pl1.25mm_tail3mm_taper2mm_sitsflat"
  const views = await Promise.all([
    view(before, "top-down", "Before: automatic spacing\n5mm cable body"),
    view(
      after,
      "top-down",
      "After: 30 pins / pitch 0.5mm\n16mm tail -> 5mm body",
    ),
    view(
      before,
      "top-left-corner",
      "Before: constant cable width\nAngled view",
    ),
    view(after, "top-left-corner", "After: tail3mm / taper2mm\nAngled view"),
  ])
  await expect(
    createAnnotatedViewSheet(views, { columns: 2, fontSize: 24 }),
  ).toMatchPngSnapshot(import.meta.path, "flexscreen-pitch-before-after")
})

test("flexscreen tail and taper dimensions produce distinct outlines", async () => {
  const base = "flexscreen30_w16_h10_flex10_p0.5mm_pw0.3mm_pl1.25mm_sitsflat"
  const views = await Promise.all([
    view(
      base + "_tail1mm_taper3mm",
      "top-down",
      "tailLength=1mm\ntaperLength=3mm",
    ),
    view(
      base + "_tail3mm_taper2mm",
      "top-down",
      "tailLength=3mm\ntaperLength=2mm",
    ),
    view(
      base + "_tail5mm_taper1mm",
      "top-down",
      "tailLength=5mm\ntaperLength=1mm",
    ),
  ])
  await expect(
    createAnnotatedViewSheet(views, { fontSize: 24 }),
  ).toMatchPngSnapshot(import.meta.path, "flexscreen-tail-taper-dimensions")
})

test("flexscreen widened tails follow folded cable routes", async () => {
  const base =
    "flexscreen30_w16_h10_flex40_p0.5mm_pw0.3mm_pl1.25mm_tail3mm_taper9mm"
  const views = await Promise.all([
    view(
      base + "_foldsabove_distance7mm",
      "top-left-corner",
      "Folded above / 30 pins\nTail and taper follow the route",
    ),
    view(
      base + "_foldsbelow_distance7mm",
      "bottom-center-angled",
      "Folded below / 30 pins\nStiffener follows the wide tail",
    ),
    view(
      base + "_rightangleabove",
      "top-left-corner",
      "Right angle / 30 pins\n0.5mm contact pitch",
    ),
  ])
  await expect(
    createAnnotatedViewSheet(views, { fontSize: 24 }),
  ).toMatchPngSnapshot(import.meta.path, "flexscreen-pitch-folded")
})
