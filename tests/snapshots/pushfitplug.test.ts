import { PNG } from "pngjs"
import { glyphLineAlphabet, glyphAdvanceRatio } from "@tscircuit/alphabet"
import { expect, test } from "bun:test"
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { getPushFitPlugDimensions } from "@tscircuit/modelprinter"
import { createPushFitPlugMesh } from "../../lib/models/pushfitplug/geometry"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
test("pushfitplug standard four-view snapshot", async () => {
  const p = { tubeDiameter: 6, length: 18, headDiameter: 10, headThickness: 3 }
  const d = getPushFitPlugDimensions(p)
  const span = Math.max(...d.size) * 1.8
  const target: [number, number, number] = [0, 0, d.topZ / 2]
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    x * span,
    y * span,
    d.topZ / 2 + z * span,
  ]
  const rendered = await renderModelSnapshot({
    mesh: createPushFitPlugMesh(p),
    title: "PushFitPlug",
    modelString: "pushfitplug_tubeod6mm_l18mm_headod10mm_headt3mm",
    footer: "Dimensions in mm; bottom datum Z=0",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Complete nominal geometry",
        eye: eye(1, -1, 1),
        target,
        span,
      },
      {
        name: "TOP",
        detail: "Looking down +Z",
        eye: eye(0, 0, 2),
        target,
        span,
      },
      {
        name: "FRONT",
        detail: "Looking along +Y",
        eye: eye(0, -2, 0),
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "Looking along -X",
        eye: eye(2, 0, 0),
        target,
        span,
      },
    ],
  })
  // Draw the view headings in bitmap coordinates so they stay readable across PoppyGL versions.
  const sheet = PNG.sync.read(Buffer.from(rendered))
  const label = (text: string, x: number, y: number, size: number) => {
    let cursor = x
    for (const char of text) {
      for (const stroke of glyphLineAlphabet[char] ?? []) {
        const x1 = cursor + stroke.x1 * size,
          y1 = y + size - stroke.y1 * size
        const x2 = cursor + stroke.x2 * size,
          y2 = y + size - stroke.y2 * size
        const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2))
        for (let i = 0; i <= steps; i++)
          for (let dx = 0; dx <= 1; dx++)
            for (let dy = 0; dy <= 1; dy++) {
              const px = Math.round(x1 + ((x2 - x1) * i) / steps) + dx,
                py = Math.round(y1 + ((y2 - y1) * i) / steps) + dy
              if (px >= 0 && py >= 0 && px < sheet.width && py < sheet.height) {
                const at = (py * sheet.width + px) * 4
                sheet.data.set([30, 45, 65, 255], at)
              }
            }
      }
      cursor += (glyphAdvanceRatio[char] ?? 0.4) * size
    }
  }
  const clear = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: number[],
  ) => {
    for (let py = y; py < y + h; py++)
      for (let px = x; px < x + w; px++)
        sheet.data.set(color, (py * sheet.width + px) * 4)
  }
  for (let i = 0; i < 4; i++)
    clear(
      50 + (i % 2) * 676,
      149 + Math.floor(i / 2) * 476,
      200,
      32,
      [241, 244, 248, 255],
    )
  clear(0, 1096, 1400, 45, [227, 233, 240, 255])
  for (const [i, name] of ["ISOMETRIC", "TOP", "FRONT", "SIDE"].entries())
    label(name, 54 + (i % 2) * 676, 151 + Math.floor(i / 2) * 476, 20)
  label("DIMENSIONS IN mm / BOTTOM DATUM Z=0", 32, 1101, 17)
  const png = PNG.sync.write(sheet)
  const path = join(import.meta.dir, "__snapshots__", "pushfitplug.snap.png")
  if (process.env.BUN_UPDATE_SNAPSHOTS === "1") {
    mkdirSync(join(import.meta.dir, "__snapshots__"), { recursive: true })
    writeFileSync(path, png)
  }
  expect(existsSync(path)).toBe(true)
  expect(Buffer.from(png).equals(readFileSync(path))).toBe(true)
})
