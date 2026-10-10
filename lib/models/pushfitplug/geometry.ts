import jscad from "@jscad/modeling"
import {
  pushFitPlugModelPropsSchema,
  type PushFitPlugModelPropsInput,
} from "@tscircuit/modelprinter"
const { primitives, extrusions, geometries, modifiers, measurements } = jscad
// JSCAD's runtime exports a function here; its default-export declaration is a namespace.
const generalize = modifiers.generalize as unknown as (
  options: { snap?: boolean; triangulate?: boolean },
  geometry: jscad.geometries.geom3.Geom3,
) => jscad.geometries.geom3.Geom3

const { rectangle, roundedRectangle, polygon } = primitives

const roundedRect = (width: number, height: number, radius: number) =>
  radius
    ? roundedRectangle({
        size: [width, height],
        roundRadius: radius,
        segments: 64,
      })
    : rectangle({ size: [width, height] })

/** Solid round push-in tube stopper with an integral flat extraction head. Overall length includes the head. Shaft axis is +Z; insertion tip Z=0, shoulder Z=length-headThickness. No seal or pressure rating implied. */
export function createPushFitPlugGeom(input: PushFitPlugModelPropsInput) {
  const p = pushFitPlugModelPropsSchema.parse(input)
  return extrusions.extrudeRotate(
    { segments: 64 },
    polygon({
      points: [
        [0, 0],
        [p.tubeDiameter / 2, 0],
        [p.tubeDiameter / 2, p.length - p.headThickness],
        [p.headDiameter / 2, p.length - p.headThickness],
        [p.headDiameter / 2, p.length],
        [0, p.length],
      ],
    }),
  )
}
export function createPushFitPlugMesh(input: PushFitPlugModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    createPushFitPlugGeom(input),
  )
  const epsilon = Math.max(...measurements.measureDimensions(geom)) * 1e-10
  const positions: number[] = []
  const indices: number[] = []
  const lookup = new Map<string, number>()
  const vertex = (v: number[]) => {
    const key = v.map((x) => Math.round(x / epsilon)).join(",")
    let index = lookup.get(key)
    if (index === undefined) {
      index = positions.length / 3
      positions.push(...v)
      lookup.set(key, index)
    }
    return index
  }
  for (const poly of geometries.geom3.toPolygons(geom)) {
    for (let i = 1; i < poly.vertices.length - 1; i++) {
      const a = poly.vertices[0]!,
        b = poly.vertices[i]!,
        c = poly.vertices[i + 1]!
      const u = b.map((x, j) => x - a[j]!),
        v = c.map((x, j) => x - a[j]!)
      const area = Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      )
      if (area > epsilon * epsilon)
        indices.push(vertex(a), vertex(b), vertex(c))
    }
  }
  return { positions, indices }
}
