import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"

test("every mounting leg intersects the shell and retains its insertion depth", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  for (const footprint of [
    "usbcmidmount16",
    "usbcmidmount16_tophw0.8mm_bottomhw0.8mm_tophh1.6mm_bottomhh1.4mm_topring0.2mm_bottomring0.2mm_rowy2.174mm_ph1.3mm_pw0.3mm_powerpw0.6mm_powerx3.2mm_shellx4.3251mm_topy1.4057mm_bottomy2.7741mm_holex2.8999mm_holey0.9056mm_holed0.75mm",
  ]) {
    const { geometries } = get(footprint, jscad)
    const shell = geometries[0]!.geom
    for (const { geom } of geometries.slice(-4)) {
      expect(
        jscad.measurements.measureVolume(jscad.booleans.intersect(shell, geom)),
      ).toBeGreaterThan(0.01)
      expect(jscad.measurements.measureBoundingBox(geom)[0][2]).toBeCloseTo(
        -0.9,
        5,
      )
    }
  }
})
