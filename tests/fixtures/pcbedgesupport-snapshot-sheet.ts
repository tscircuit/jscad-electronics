import {
  glyphAdvanceRatio,
  kerningRatio,
  spaceWidthRatio,
} from "@tscircuit/alphabet"
import { PNG } from "pngjs"
import { createAnnotatedViewSheet } from "./annotated-view-sheet"

/** Place view captions in bitmap coordinates after the standard model renderer,
 * so PoppyGL's depth state cannot hide a view name or the full fitting string. */
export function annotateSnapshot(
  rendered: Uint8Array,
  title: string,
  modelString: string,
) {
  const sheet = PNG.sync.read(Buffer.from(rendered))
  const views = ["ISOMETRIC", "TOP", "FRONT", "SIDE"].map((name, index) => {
    const panel = new PNG({ width: 660, height: 440 })
    const left = 32 + (index % 2) * 676,
      top = 144 + Math.floor(index / 2) * 476
    for (let y = 0; y < 440; y++) {
      const start = ((top + y) * sheet.width + left) * 4
      sheet.data.copy(panel.data, y * 660 * 4, start, start + 660 * 4)
      if (y < 42 || y >= 399)
        for (let x = 0; x < 660; x++)
          panel.data.set([241, 244, 248, 255], (y * 660 + x) * 4)
    }
    return {
      png: PNG.sync.write(panel),
      annotation: `${title} / ${name}\n${modelString}`,
    }
  })
  let textWidth = 0
  let previous: string | undefined
  for (const character of modelString) {
    textWidth += glyphAdvanceRatio[character] ?? spaceWidthRatio
    if (previous) textWidth += kerningRatio[previous]?.[character] ?? 0
    previous = character
  }
  return createAnnotatedViewSheet(views, {
    columns: 2,
    gap: 12,
    annotationHeight: 70,
    fontSize: Math.min(16, 620 / textWidth),
  })
}
