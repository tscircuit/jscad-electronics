import { test, expect } from "bun:test"
import { fp } from "@tscircuit/footprinter"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"
import { cameraForFootprint } from "./footprint-camera"
import { probeFor } from "./footprint-probes"

// The top and underside views pin the two-sided card-edge copper at z=0.
// m2host is a feature of the PCB, so these should remain bare-pad views.
const PAD_OPACITY = 0.45

test("m2host is a two-sided PCB edge with a cutout", async () => {
  const probe = probeFor("m2host")
  const features = fp.string(probe).circuitJson()
  expect(features.some((f) => f.type === "pcb_cutout")).toBe(true)
  const pads = features.filter((f) => f.type === "pcb_smtpad")
  expect(pads.some((p) => p.layer === "top")).toBe(true)
  expect(pads.some((p) => p.layer === "bottom")).toBe(true)
  const height = 0

  const top = await renderFootprint(probe, {
    ...cameraForFootprint(probe, height, "top"),
    gridZ: 0,
    padOpacity: PAD_OPACITY,
  })
  await expect(top).toMatchPngSnapshot(import.meta.path)

  const bottom = await renderFootprint(probe, {
    ...cameraForFootprint(probe, height, "bottom"),
    gridZ: 0,
    padOpacity: PAD_OPACITY,
  })
  await expect(bottom).toMatchPngSnapshot(import.meta.path, "m2host-underside")
})
