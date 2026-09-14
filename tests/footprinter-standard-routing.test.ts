import { expect, test } from "bun:test"
import { fp } from "@tscircuit/footprinter"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

test("ignored nonstandard suffixes cannot select a package model", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const footprint = "smdpads2_p3mm_pw1mm_ph2mm"
  const baseline = fp.string(footprint).json()
  expect(get(footprint, jscad).geometries).toHaveLength(0)
  // Regression inputs only: these are NOT supported footprinter tokens.
  for (const suffix of [
    "tantalumA",
    "melfresistor0204",
    "crystal2FC135",
    "antennaRFANT5220110A0T",
    "fuseMF2410",
    "ferriteBLM41PG600SN1",
    "switchB3U1000P",
    "inductorSWPA4030",
  ]) {
    const input = `${footprint}_${suffix}`
    expect(fp.string(input).json()).toEqual(baseline)
    expect(get(input, jscad).geometries).toHaveLength(0)
  }
  for (const footprint of ["sot143", "usbcmidmount16", "melf", "crystal"])
    expect(get(footprint, jscad).geometries.length).toBeGreaterThan(0)
})
