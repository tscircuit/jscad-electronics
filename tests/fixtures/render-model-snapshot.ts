import { glyphAdvanceRatio, glyphLineAlphabet } from "@tscircuit/alphabet"
import { mat4 } from "gl-matrix"
import {
  SoftwareRenderer,
  createUint8Bitmap,
  encodePNG,
  renderDrawCalls,
  type DrawCall,
} from "poppygl"

const width = 1400
const height = 1152
const scale = 2
const identity = mat4.create()

const drawCall = (
  positions: number[],
  color: [number, number, number, number],
): DrawCall => ({
  positions: new Float32Array(positions),
  normals: null,
  uvs: null,
  indices: null,
  model: identity,
  material: { baseColorFactor: color, baseColorTexture: null },
})

// Stroke-font labels are also drawn by PoppyGL, so snapshots need no browser,
// system fonts or second rendering engine on developer machines or in CI.
const label = (
  renderer: SoftwareRenderer,
  { text, x, y, size }: { text: string; x: number; y: number; size: number },
) => {
  const vertices: number[] = []
  let cursor = x
  for (const character of text) {
    for (const stroke of glyphLineAlphabet[character] ?? []) {
      const x1 = cursor + stroke.x1 * size
      const y1 = y + size - stroke.y1 * size
      const x2 = cursor + stroke.x2 * size
      const y2 = y + size - stroke.y2 * size
      const length = Math.hypot(x2 - x1, y2 - y1)
      if (length === 0) continue
      const dx = (-(y2 - y1) / length) * size * 0.025
      const dy = ((x2 - x1) / length) * size * 0.025
      vertices.push(
        x1 + dx,
        y1 + dy,
        0,
        x1 - dx,
        y1 - dy,
        0,
        x2 - dx,
        y2 - dy,
        0,
        x1 + dx,
        y1 + dy,
        0,
        x2 - dx,
        y2 - dy,
        0,
        x2 + dx,
        y2 + dy,
        0,
      )
    }
    cursor += (glyphAdvanceRatio[character] ?? 0.4) * size
  }
  // Screen coordinates point downward, so reverse the glyph triangle winding.
  for (let i = 0; i < vertices.length; i += 9) {
    for (let axis = 0; axis < 3; axis++) {
      const value = vertices[i + 3 + axis]!
      vertices[i + 3 + axis] = vertices[i + 6 + axis]!
      vertices[i + 6 + axis] = value
    }
  }
  const mesh = drawCall(vertices, [0.07, 0.12, 0.19, 1])
  renderer.drawMesh(
    mesh,
    {
      view: identity,
      proj: mat4.ortho(mat4.create(), 0, width, height, 0, -1, 1),
    },
    { dir: [0, 0, -1], ambient: 1 },
    mesh.material,
    false,
    true,
  )
}

export type SnapshotView = {
  name: string
  detail: string
  eye: readonly [number, number, number]
  target: readonly [number, number, number]
  span: number
}

export async function renderModelSnapshot({
  mesh,
  title,
  modelString,
  views,
  footer,
  metalness = 0,
  roughness = 0.65,
}: {
  mesh: { positions: number[]; indices: number[] }
  title: string
  metalness?: number
  roughness?: number
  modelString: string
  views: readonly [SnapshotView, SnapshotView, SnapshotView, SnapshotView]
  footer: string
}) {
  const positions = mesh.indices.flatMap((index) =>
    mesh.positions.slice(index * 3, index * 3 + 3),
  )
  const model = drawCall(positions, [0.42, 0.49, 0.59, 1])
  model.material.metallicFactor = metalness
  model.material.roughnessFactor = roughness
  const sheet = new SoftwareRenderer(width * scale, height * scale)
  sheet.clear([227, 233, 240, 255])

  for (const [index, view] of views.entries()) {
    const distance = Math.hypot(
      ...view.eye.map((value, axis) => value - view.target[axis]!),
    )
    const { bitmap: panel } = renderDrawCalls([model], {
      width: 660,
      height: 440,
      supersampling: 1,
      realistic: true,
      backgroundColor: [241 / 255, 244 / 255, 248 / 255],
      camPos: view.eye,
      lookAt: view.target,
      up: view.name === "TOP" ? "y+" : "z+",
      fov: (2 * Math.atan(view.span / (2 * distance)) * 180) / Math.PI,
      grid: false,
      cull: true,
    })
    const left = 32 + (index % 2) * 676
    const top = 144 + Math.floor(index / 2) * 476
    // Shade at the final panel resolution; supersample the small text separately.
    for (let y = 0; y < panel.height * scale; y++) {
      const row = new Uint8Array(panel.width * scale * 4)
      for (let x = 0; x < panel.width * scale; x++) {
        const at =
          (Math.floor(y / scale) * panel.width + Math.floor(x / scale)) * 4
        row.set(panel.data.subarray(at, at + 4), x * 4)
      }
      const start = ((top * scale + y) * sheet.width + left * scale) * 4
      sheet.bitmap.data.set(row, start)
    }
    label(sheet, { text: view.name, x: left + 22, y: top + 7, size: 20 })
    label(sheet, { text: view.detail, x: left + 22, y: top + 401, size: 17 })
  }
  label(sheet, { text: title, x: 32, y: 20, size: 38 })
  for (const [index, line] of (modelString.match(/.{1,90}/g) ?? []).entries()) {
    label(sheet, { text: line, x: 32, y: 73 + index * 21, size: 16 })
  }
  label(sheet, { text: footer, x: 32, y: 1101, size: 17 })

  const bitmap = createUint8Bitmap(width, height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 4; c++) {
        const at = (y * scale * sheet.width + x * scale) * 4 + c
        bitmap.data[(y * width + x) * 4 + c] = Math.round(
          (sheet.buffer[at]! +
            sheet.buffer[at + 4]! +
            sheet.buffer[at + sheet.width * 4]! +
            sheet.buffer[at + sheet.width * 4 + 4]!) /
            4,
        )
      }
    }
  }
  return encodePNG(bitmap)
}
