import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

const variants = [
  {
    name: "R-RJ45R08P-B000",
    footprint:
      "rj45_p1.02mm_py1.780032mm_shieldx8.130032mm_shieldy0.130048mm_shieldid1.7999964mm_shieldod2.499995mm_holex6.35mm_holey-3.430016mm_holed3.2499808mm",
    bodyY: -0.96,
  },
  {
    name: "R-RJ45R08P-C000",
    footprint:
      "rj45_ledpins_p1.02mm_py1.780032mm_shieldx8.130032mm_shieldy0.130048mm_shieldid1.9000216mm_shieldod2.499995mm_holex6.35mm_holey-3.430016mm_holed3.3000188mm_ledx4.569968mm_ledp2.290064mm_ledy5.700014mm",
    bodyY: -0.96,
  },
  {
    name: "R-RJ45R10P-B000",
    footprint:
      "rj45_firstpintop_p1.27mm_py2.54mm_shieldx7.750048mm_shieldy10.670032mm_shieldid1.5999968mm_shieldod2.499995mm_holex5.715mm_holey7.62mm_holed3.1999936mm_bodyy6.32mm_h18.4mm_w15.8mm",
    bodyY: 6.32,
  },
  {
    name: "R-RJ45S08P-C000",
    footprint:
      "rj45_ledpins_firstpinleft_p1.27mm_py2.54mm_shieldx7.914894mm_shieldy-3.770122mm_shieldid1.700022mm_shieldod2.499995mm_holex5.715mm_holey-7.62mm_holed3.3000188mm_ledx3.869944mm_ledp2.54mm_ledy-11.729974mm_bodyy-5.865mm_h16.764mm_w16.256mm",
    bodyY: -5.865,
  },
] as const

for (const variant of variants) {
  test(`parametric RJ45 represents ${variant.name}`, async () => {
    const frontViewZ = variant.bodyY > 0 ? -27 : 27
    const pngBuffer = await renderFootprint(variant.footprint, {
      camPos: [22, 20, frontViewZ],
      lookAt: [0, 6.5, -variant.bodyY],
    })
    await expect(pngBuffer).toMatchPngSnapshot(import.meta.path, variant.name)
  })
}

test("parametric RJ45 footprint alignment from below", async () => {
  const pngBuffer = await renderFootprint("rj45_ledpins", {
    cameraPreset: "bottom-up",
    camPos: [18, -25, 24],
    lookAt: [0, 3, 0.96],
  })
  await expect(pngBuffer).toMatchPngSnapshot(
    import.meta.path,
    "rj45-led-bottom",
  )
})
