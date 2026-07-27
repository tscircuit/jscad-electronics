import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

const variants = [
  {
    name: "jst-ph",
    footprint: "jst4_ph",
    renderOptions: {
      camPos: [11, 16, 12] as [number, number, number],
      lookAt: [0, 1.5, 1.8] as [number, number, number],
    },
  },
  {
    name: "jst-sh",
    footprint: "jst4_sh",
    renderOptions: { cameraPreset: "top-left-corner" as const },
  },
  {
    name: "jst-zh",
    footprint: "jst4_zh",
    renderOptions: { cameraPreset: "top-left-corner" as const },
  },
  {
    name: "jst-smd",
    footprint: "jst4_smd_p2mm_mpx8mm_mpy3mm_mpw2mm_mpl3.4mm_mounttop",
    renderOptions: {
      camPos: [11, 16, 12] as [number, number, number],
      lookAt: [0, 1.5, 1.8] as [number, number, number],
    },
  },
] as const

for (const variant of variants) {
  test(`${variant.name} footprint model`, async () => {
    const pngBuffer = await renderFootprint(
      variant.footprint,
      variant.renderOptions,
    )
    await expect(pngBuffer).toMatchPngSnapshot(import.meta.path, variant.name)
  })
}
