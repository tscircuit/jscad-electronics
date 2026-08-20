import {
  glyphAdvanceRatio,
  glyphLineAlphabet,
  kerningRatio,
  lineHeightRatio,
  spaceWidthRatio,
  strokeWidthRatio,
} from "@tscircuit/alphabet"
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
  fontSize?: number
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

const glyphAdvance = (character: string) =>
  glyphAdvanceRatio[character] ??
  (character === " " ? spaceWidthRatio : glyphAdvanceRatio["?"]) ??
  spaceWidthRatio

const textWidth = (text: string, fontSize: number) => {
  let width = 0
  let previousCharacter: string | undefined
  for (const character of text) {
    if (previousCharacter) {
      width += (kerningRatio[previousCharacter]?.[character] ?? 0) * fontSize
    }
    width += glyphAdvance(character) * fontSize
    previousCharacter = character
  }
  return width
}

const blendPixel = (
  png: PNG,
  x: number,
  y: number,
  color: readonly [number, number, number, number],
  coverage: number,
) => {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return
  const offset = (y * png.width + x) * 4
  const sourceAlpha = (color[3] / 255) * coverage
  const targetAlpha = png.data[offset + 3]! / 255
  const outputAlpha = sourceAlpha + targetAlpha * (1 - sourceAlpha)
  if (outputAlpha === 0) return
  for (let channel = 0; channel < 3; channel += 1) {
    png.data[offset + channel] = Math.round(
      (color[channel]! * sourceAlpha +
        png.data[offset + channel]! * targetAlpha * (1 - sourceAlpha)) /
        outputAlpha,
    )
  }
  png.data[offset + 3] = Math.round(outputAlpha * 255)
}

const distanceToSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  const deltaX = x2 - x1
  const deltaY = y2 - y1
  const squaredLength = deltaX * deltaX + deltaY * deltaY
  const projection =
    squaredLength === 0
      ? 0
      : Math.max(
          0,
          Math.min(1, ((x - x1) * deltaX + (y - y1) * deltaY) / squaredLength),
        )
  return Math.hypot(
    x - (x1 + projection * deltaX),
    y - (y1 + projection * deltaY),
  )
}

const drawStroke = ({
  png,
  x1,
  y1,
  x2,
  y2,
  width,
  color,
}: {
  png: PNG
  x1: number
  y1: number
  x2: number
  y2: number
  width: number
  color: readonly [number, number, number, number]
}) => {
  const radius = width / 2
  const minimumX = Math.floor(Math.min(x1, x2) - radius - 1)
  const maximumX = Math.ceil(Math.max(x1, x2) + radius + 1)
  const minimumY = Math.floor(Math.min(y1, y2) - radius - 1)
  const maximumY = Math.ceil(Math.max(y1, y2) + radius + 1)
  for (let y = minimumY; y <= maximumY; y += 1) {
    for (let x = minimumX; x <= maximumX; x += 1) {
      const distance = distanceToSegment(x + 0.5, y + 0.5, x1, y1, x2, y2)
      const coverage = Math.max(0, Math.min(1, radius + 0.5 - distance))
      if (coverage > 0) blendPixel(png, x, y, color, coverage)
    }
  }
}

const drawText = ({
  png,
  text,
  centerX,
  top,
  fontSize,
  color,
}: {
  png: PNG
  text: string
  centerX: number
  top: number
  fontSize: number
  color: readonly [number, number, number, number]
}) => {
  let cursorX = centerX - textWidth(text, fontSize) / 2
  let previousCharacter: string | undefined
  for (const character of text) {
    if (previousCharacter) {
      cursorX += (kerningRatio[previousCharacter]?.[character] ?? 0) * fontSize
    }
    for (const segment of glyphLineAlphabet[character] ?? []) {
      drawStroke({
        png,
        x1: cursorX + segment.x1 * fontSize,
        y1: top + (1 - segment.y1) * fontSize,
        x2: cursorX + segment.x2 * fontSize,
        y2: top + (1 - segment.y2) * fontSize,
        width: fontSize * strokeWidthRatio,
        color,
      })
    }
    cursorX += glyphAdvance(character) * fontSize
    previousCharacter = character
  }
}

/**
 * Combines rendered PNGs into a reviewable contact sheet and places a
 * multi-line annotation below each view. @tscircuit/alphabet provides
 * deterministic vector strokes without depending on fonts installed on the
 * host.
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
  const annotationHeight = options.annotationHeight ?? 96
  const cellHeight = panelHeight + annotationHeight
  const output = new PNG({
    width: columns * panelWidth + (columns + 1) * gap,
    height: rows * cellHeight + (rows + 1) * gap,
  })
  const backgroundColor = parseColor(options.backgroundColor ?? "#d9dde2")
  const annotationColor = parseColor(options.annotationColor ?? "#202833")
  const textColor = parseColor(options.textColor ?? "#ffffff")
  const fontSize = options.fontSize ?? 30

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
    const lineAdvance = fontSize * lineHeightRatio
    const blockHeight = fontSize + (lines.length - 1) * lineAdvance
    const textTop =
      cellY + panelHeight + Math.floor((annotationHeight - blockHeight) / 2)
    for (const [lineIndex, line] of lines.entries()) {
      drawText({
        png: output,
        text: line,
        centerX: cellX + panelWidth / 2,
        top: textTop + lineIndex * lineAdvance,
        fontSize,
        color: textColor,
      })
    }
  }

  return PNG.sync.write(output)
}
