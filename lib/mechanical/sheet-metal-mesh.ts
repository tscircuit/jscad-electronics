import earcut from "earcut"
import {
  sheetMetalModelPropsSchema,
  type SheetMetalModelPropsInput,
  type SheetMetalHole,
} from "@tscircuit/modelprinter"

type Point2 = { u: number; v: number }
type Point3 = [number, number, number]
export interface SheetMetalMesh {
  positions: number[]
  indices: number[]
}

function holeOutline(hole: SheetMetalHole): Point2[] {
  const radius = (hole.shape === "round" ? hole.diameter : hole.width) / 2
  const straight = hole.shape === "slot" ? (hole.length - hole.width) / 2 : 0
  if (straight < 0) throw new Error("Slot length must be at least its width")
  return Array.from({ length: 64 }, (_, i) => {
    if (hole.shape === "round") {
      const angle = (i * Math.PI) / 32
      return {
        u: hole.u + radius * Math.cos(angle),
        v: hole.v + radius * Math.sin(angle),
      }
    }
    // Two semicircles, with straight connections between their end points.
    const half = i < 32 ? 1 : -1
    const angle =
      -Math.PI / 2 +
      ((i < 32 ? i : i - 32) * Math.PI) / 31 +
      (i < 32 ? 0 : Math.PI)
    const along = half * straight + radius * Math.cos(angle)
    const across = radius * Math.sin(angle)
    return hole.shape === "slot" && hole.axis === "v"
      ? { u: hole.u - across, v: hole.v + along }
      : { u: hole.u + along, v: hole.v + across }
  })
}

/** Watertight sheet-metal plate, 90-degree angle or U-channel. Millimeters,
 * right-handed +Z up. Base midsurface at Z=0, centered in X/Y; flanges rise
 * above it. Lengths measure straight tangent-to-tangent sections. Bend skins
 * use the specified inside radius and constant material thickness.
 * Holes are through-cut on straight panels only; no bend allowance/unfolding.
 */
export function createSheetMetalMesh(
  input: SheetMetalModelPropsInput,
): SheetMetalMesh {
  const props = sheetMetalModelPropsSchema.parse(input)
  const { width, baseLength, flangeHeight, thickness, profile } = props
  const radius = props.insideBendRadius + thickness / 2
  const positions: number[] = []
  const indices: number[] = []
  const addTriangle = (vertices: Point3[], reverse = false) => {
    const start = positions.length / 3
    for (const vertex of vertices) positions.push(...vertex)
    indices.push(start, start + (reverse ? 2 : 1), start + (reverse ? 1 : 2))
  }
  const addQuad = (vertices: Point3[], reverse = false) => {
    addTriangle([vertices[0]!, vertices[1]!, vertices[2]!], reverse)
    addTriangle([vertices[0]!, vertices[2]!, vertices[3]!], reverse)
  }
  const panels =
    profile === "plate"
      ? ["base"]
      : profile === "angle"
        ? ["base", "right"]
        : ["base", "left", "right"]
  for (const hole of props.holes) {
    if (!panels.includes(hole.panel))
      throw new Error(`No ${hole.panel} panel on ${profile}`)
  }
  for (const panel of panels) {
    const length = panel === "base" ? baseLength : flangeHeight
    const holes = props.holes
      .filter((hole) => hole.panel === panel)
      .map(holeOutline)
    const bounds = holes.map((outline) => ({
      minU: Math.min(...outline.map((p) => p.u)),
      maxU: Math.max(...outline.map((p) => p.u)),
      minV: Math.min(...outline.map((p) => p.v)),
      maxV: Math.max(...outline.map((p) => p.v)),
    }))
    for (const [i, box] of bounds.entries()) {
      if (
        box.minU <= -length / 2 ||
        box.maxU >= length / 2 ||
        box.minV <= -width / 2 ||
        box.maxV >= width / 2
      )
        throw new Error(`Hole crosses ${panel} panel edge or bend tangent`)
      for (const previous of bounds.slice(0, i))
        if (
          box.minU <= previous.maxU &&
          box.maxU >= previous.minU &&
          box.minV <= previous.maxV &&
          box.maxV >= previous.minV
        )
          throw new Error("Hole bounding boxes must not overlap")
    }
    const outline: Point2[] = [
      { u: -length / 2, v: -width / 2 },
      { u: length / 2, v: -width / 2 },
      { u: length / 2, v: width / 2 },
      { u: -length / 2, v: width / 2 },
    ]
    const loops = [outline, ...holes.map((hole) => [...hole].reverse())]
    const points = loops.flat()
    const starts = holes.map((_, i) => 4 + i * 64)
    const triangles = earcut(
      points.flatMap((p) => [p.u, p.v]),
      starts,
    )
    const project = (point: Point2, offset: number): Point3 =>
      panel === "base"
        ? [point.u, point.v, offset]
        : [
            (panel === "left" ? -1 : 1) * (baseLength / 2 + radius - offset),
            point.v,
            radius + flangeHeight / 2 + point.u,
          ]
    const reverse = panel === "left"
    for (let i = 0; i < triangles.length; i += 3) {
      const face = triangles.slice(i, i + 3).map((index) => points[index]!)
      addTriangle(
        face.map((p) => project(p, thickness / 2)),
        reverse,
      )
      addTriangle(
        face.map((p) => project(p, -thickness / 2)),
        !reverse,
      )
    }
    for (const [loopIndex, loop] of loops.entries())
      for (let i = 0; i < loop.length; i++) {
        const a = loop[i]!,
          b = loop[(i + 1) % loop.length]!
        // Adjacent curved panels close these edges; avoid internal seam faces.
        if (
          loopIndex === 0 &&
          a.u === b.u &&
          ((panel === "base" &&
            ((a.u > 0 && profile !== "plate") ||
              (a.u < 0 && profile === "channel"))) ||
            (panel !== "base" && a.u < 0))
        )
          continue
        addQuad(
          [
            project(a, -thickness / 2),
            project(b, -thickness / 2),
            project(b, thickness / 2),
            project(a, thickness / 2),
          ],
          reverse,
        )
      }
  }
  const sides = profile === "plate" ? [] : profile === "angle" ? [1] : [-1, 1]
  for (const side of sides) {
    const project = (
      angle: number,
      crossSection: { y: number; offset: number },
    ): Point3 => {
      const r = radius - crossSection.offset
      return [
        side * (baseLength / 2 + r * Math.sin(angle)),
        crossSection.y,
        radius - r * Math.cos(angle),
      ]
    }
    for (let i = 0; i < 32; i++) {
      const a = (i * Math.PI) / 64,
        b = ((i + 1) * Math.PI) / 64
      for (const offset of [-thickness / 2, thickness / 2]) {
        addQuad(
          [
            project(a, { y: -width / 2, offset }),
            project(b, { y: -width / 2, offset }),
            project(b, { y: width / 2, offset }),
            project(a, { y: width / 2, offset }),
          ],
          offset < 0 !== side < 0,
        )
      }
      for (const y of [-width / 2, width / 2]) {
        addQuad(
          [
            project(a, { y, offset: -thickness / 2 }),
            project(b, { y, offset: -thickness / 2 }),
            project(b, { y, offset: thickness / 2 }),
            project(a, { y, offset: thickness / 2 }),
          ],
          y > 0 !== side < 0,
        )
      }
    }
  }
  return { positions, indices }
}
