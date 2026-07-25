import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("FPC-12 connector", async () => {
  const footprint = "fpc12"
  const lookAt: [number, number, number] = [0, 1, 1.8]
  const defaultPng = await renderFootprint(footprint, {
    cameraPreset: "top-left-corner",
    camPos: [11, 19, 14],
    lookAt,
  })
  await expect(defaultPng).toMatchPngSnapshot(import.meta.path)

  const viewpoints = [
    ["top", "top-down", [0, 20, 1.7]],
    ["bottom", "bottom-up", [0, -19, 1.9]],
    ["left", "left-sideview", [16, 1.8, 1.8]],
    ["angled", "top-left-corner", [11, 19, 14]],
  ] as const

  for (const [name, cameraPreset, camPos] of viewpoints) {
    const pngBuffer = await renderFootprint(footprint, {
      cameraPreset,
      camPos: [...camPos],
      lookAt,
    })
    await expect(pngBuffer).toMatchPngSnapshot(import.meta.path, `fpc-${name}`)
  }
})
