import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderHelicalGearSnapshot } from "../fixtures/render-gear-snapshot"

for (const hand of ["right", "left"]) {
  test(`helical gear - ${hand} hand, bore and hub`, async () => {
    const png = await renderHelicalGearSnapshot(
      `helicalgear24_m1mm_w8mm_ha30deg_${hand}_bore5mm_hubdiameter10mm_hublength3mm_backlash0.1mm`,
    )
    await expectPngSnapshot(
      png,
      import.meta.path.replace(
        "helical-gears.test.ts",
        `gears-helical-${hand}.test.ts`,
      ),
    )
  }, 60000)
}
