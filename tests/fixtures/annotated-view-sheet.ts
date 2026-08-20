import { PNG } from "pngjs"

export interface AnnotatedPngView {
  png: Uint8Array
  /** Multi-line caption rendered below this view. */
  annotation: string
}

export interface AnnotatedViewSheetOptions {
  columns?: number
  gap?: number
  annotationHeight?: number
  backgroundColor?: string
  annotationColor?: string
  textColor?: string
  textScale?: number
}

const FONT: Record<string, string> = {
  " ": "000,000,000,000,000",
  A: "010,101,111,101,101",
  B: "110,101,110,101,110",
  C: "011,100,100,100,011",
  D: "110,101,101,101,110",
  E: "111,100,110,100,111",
  F: "111,100,110,100,100",
  G: "011,100,101,101,011",
  H: "101,101,111,101,101",
  I: "111,010,010,010,111",
  J: "001,001,001,101,010",
  K: "101,101,110,101,101",
  L: "100,100,100,100,111",
  M: "101,111,111,101,101",
  N: "101,111,111,111,101",
  O: "010,101,101,101,010",
  P: "110,101,110,100,100",
  Q: "010,101,101,111,011",
  R: "110,101,110,101,101",
  S: "011,100,010,001,110",
  T: "111,010,010,010,010",
  U: "101,101,101,101,111",
  V: "101,101,101,101,010",
  W: "101,101,111,111,101",
  X: "101,101,010,101,101",
  Y: "101,101,010,010,010",
  Z: "111,001,010,100,111",
  0: "111,101,101,101,111",
  1: "010,110,010,010,111",
  2: "110,001,010,100,111",
  3: "110,001,010,001,110",
  4: "101,101,111,001,001",
  5: "111,100,110,001,110",
  6: "011,100,110,101,010",
  7: "111,001,010,010,010",
  8: "010,101,010,101,010",
  9: "010,101,011,001,110",
  "-": "000,000,111,000,000",
  "/": "001,001,010,100,100",
  ":": "000,010,000,010,000",
  ".": "000,000,000,000,010",
}

const parseColor = (hex: string): [number, number, number, number] => {
  const normalized = hex.replace(/^#/, "")
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new Error(`Expected a six-digit hex color, received ${hex}`)
  }
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
    255,
  ]
}

const fillRect = (
  png: PNG,
  x: number,
  y: number,
  width: number,
  height: number,
  color: readonly [number, number, number, number],
) => {
  for (let pixelY = y; pixelY < y + height; pixelY += 1) {
    for (let pixelX = x; pixelX < x + width; pixelX += 1) {
      const offset = (pixelY * png.width + pixelX) * 4
      png.data[offset] = color[0]
      png.data[offset + 1] = color[1]
      png.data[offset + 2] = color[2]
      png.data[offset + 3] = color[3]
    }
  }
}

const copyPng = (
  source: PNG,
  target: PNG,
  targetX: number,
  targetY: number,
) => {
  for (let y = 0; y < source.height; y += 1) {
    const sourceStart = y * source.width * 4
    const targetStart = ((targetY + y) * target.width + targetX) * 4
    source.data.copy(
      target.data,
      targetStart,
      sourceStart,
      sourceStart + source.width * 4,
    )
  }
}

const textWidth = (text: string, scale: number) =>
  Math.max(0, text.length * 4 - 1) * scale

const drawText = ({
  png,
  text,
  centerX,
  top,
  scale,
  color,
}: {
  png: PNG
  text: string
  centerX: number
  top: number
  scale: number
  color: readonly [number, number, number, number]
}) => {
  const normalized = text.toUpperCase()
  const left = Math.round(centerX - textWidth(normalized, scale) / 2)
  for (const [characterIndex, character] of [...normalized].entries()) {
    const rows = (FONT[character] ?? FONT[" "]!).split(",")
    for (const [rowIndex, row] of rows.entries()) {
      for (const [columnIndex, pixel] of [...row].entries()) {
        if (pixel !== "1") continue
        fillRect(
          png,
          left + (characterIndex * 4 + columnIndex) * scale,
          top + rowIndex * scale,
          scale,
          scale,
          color,
        )
      }
    }
  }
}

/**
 * Combines rendered PNGs into a reviewable contact sheet and places a
 * multi-line annotation below each view. The tiny embedded bitmap font keeps
 * this fixture deterministic and independent of fonts installed on the host.
 */
export const createAnnotatedViewSheet = (
  views: readonly AnnotatedPngView[],
  options: AnnotatedViewSheetOptions = {},
): Uint8Array => {
  if (views.length === 0) throw new Error("At least one PNG view is required")

  const decoded = views.map((view) => PNG.sync.read(Buffer.from(view.png)))
  const panelWidth = Math.max(...decoded.map((png) => png.width))
  const panelHeight = Math.max(...decoded.map((png) => png.height))
  const columns = Math.max(
    1,
    Math.min(options.columns ?? views.length, views.length),
  )
  const rows = Math.ceil(views.length / columns)
  const gap = options.gap ?? 8
  const annotationHeight = options.annotationHeight ?? 64
  const cellHeight = panelHeight + annotationHeight
  const output = new PNG({
    width: columns * panelWidth + (columns + 1) * gap,
    height: rows * cellHeight + (rows + 1) * gap,
  })
  const backgroundColor = parseColor(options.backgroundColor ?? "#d9dde2")
  const annotationColor = parseColor(options.annotationColor ?? "#202833")
  const textColor = parseColor(options.textColor ?? "#ffffff")
  const scale = options.textScale ?? 3

  fillRect(output, 0, 0, output.width, output.height, backgroundColor)

  for (const [index, view] of views.entries()) {
    const source = decoded[index]!
    const column = index % columns
    const row = Math.floor(index / columns)
    const cellX = gap + column * panelWidth
    const cellY = gap + row * cellHeight
    const imageX = cellX + Math.floor((panelWidth - source.width) / 2)
    const imageY = cellY + Math.floor((panelHeight - source.height) / 2)
    copyPng(source, output, imageX, imageY)
    fillRect(
      output,
      cellX,
      cellY + panelHeight,
      panelWidth,
      annotationHeight,
      annotationColor,
    )

    const lines = view.annotation.split("\n").slice(0, 2)
    const lineHeight = 5 * scale
    const lineGap = scale * 2
    const blockHeight = lines.length * lineHeight + (lines.length - 1) * lineGap
    const textTop =
      cellY + panelHeight + Math.floor((annotationHeight - blockHeight) / 2)
    for (const [lineIndex, line] of lines.entries()) {
      drawText({
        png: output,
        text: line,
        centerX: cellX + panelWidth / 2,
        top: textTop + lineIndex * (lineHeight + lineGap),
        scale,
        color: textColor,
      })
    }
  }

  return PNG.sync.write(output)
}
