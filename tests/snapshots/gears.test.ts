import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import {
  renderSpurGearSnapshot,
  renderWormGearSnapshot,
} from "../fixtures/render-gear-snapshot"

test("spur gear - involute teeth, bore and hub", async () => {
  const png = await renderSpurGearSnapshot(
    "spurgear24_m1mm_w5mm_bore5mm_hubdiameter10mm_hublength3mm_backlash0.1mm",
  )
  await expectPngSnapshot(
    png,
    import.meta.path.replace("gears.test.ts", "gears-spur-hub.test.ts"),
  )
}, 60000)

test("worm gear - right-hand single start", async () => {
  const png = await renderWormGearSnapshot(
    "wormgear_m1mm_d10mm_l20mm_bore3mm_starts1_right",
  )
  await expectPngSnapshot(
    png,
    import.meta.path.replace("gears.test.ts", "gears-worm-right.test.ts"),
  )
}, 60000)

test("worm gear - left-hand three starts", async () => {
  const png = await renderWormGearSnapshot(
    "wormgear_m1mm_d12mm_l24mm_starts3_left_bore4mm",
  )
  await expectPngSnapshot(
    png,
    import.meta.path.replace(
      "gears.test.ts",
      "gears-worm-left-multistart.test.ts",
    ),
  )
}, 60000)
