import { PNG } from "pngjs"
import { renderFootprint } from "./render-footprint"
import type { CameraPreset } from "./camera-presets"

/** One comprehensive image per footprint: iso, top, bottom / front, side, rear. */
export async function renderContactSheet(
  footprint: string,
  finalView: CameraPreset = "top-right-corner",
): Promise<Uint8Array> {
  const presets: CameraPreset[] = [
    "top-left-corner",
    "top-down",
    "bottom-up",
    "front",
    "left-sideview",
    finalView,
  ]
  const images: PNG[] = []
  for (const cameraPreset of presets)
    images.push(
      PNG.sync.read(
        Buffer.from(
          await renderFootprint(footprint, {
            cameraPreset,
            padOpacity: 0.25,
            gridZ: 0,
          }),
        ),
      ),
    )
  const width = images[0]!.width,
    height = images[0]!.height
  const sheet = new PNG({ width: width * 3, height: height * 2 })
  for (const [i, image] of images.entries())
    PNG.bitblt(
      image,
      sheet,
      0,
      0,
      width,
      height,
      (i % 3) * width,
      Math.floor(i / 3) * height,
    )
  return PNG.sync.write(sheet)
}
